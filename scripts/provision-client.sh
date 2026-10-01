#!/bin/bash
set -euo pipefail

# Provision complet d'une boutique client :
#   scaffold -> stack Docker -> attente santé -> clé publishable -> storefront
#
# Usage:
#   provision-client.sh <slug> [domain] [--admin-email E] [--admin-password P]
#
# Prérequis: Docker + Traefik en place, images ${IMAGE_PREFIX}-backend/storefront
# disponibles (buildées ou poussées depuis GHCR).

CLIENT_NAME=""
DOMAIN=""
ADMIN_EMAIL=""
ADMIN_PASSWORD=""

while [ $# -gt 0 ]; do
  case "$1" in
    --admin-email) ADMIN_EMAIL="$2"; shift 2 ;;
    --admin-password) ADMIN_PASSWORD="$2"; shift 2 ;;
    *)
      if [ -z "$CLIENT_NAME" ]; then CLIENT_NAME="$1"
      elif [ -z "$DOMAIN" ]; then DOMAIN="$1"
      else echo "Argument inconnu: $1" >&2; exit 1
      fi
      shift ;;
  esac
done

if [ -z "$CLIENT_NAME" ]; then
  echo "Usage: provision-client.sh <slug> [domain] [--admin-email E] [--admin-password P]"
  exit 1
fi

DOMAIN=${DOMAIN:-${CLIENT_NAME}.stiamond.store}
CLIENT_DIR="clients/${CLIENT_NAME}"
PROJECT="white-${CLIENT_NAME}"
COMPOSE="docker compose -f docker-compose.client.yml.template -p ${PROJECT}"

if [ -d "$CLIENT_DIR" ]; then
  echo "ERREUR: ${CLIENT_DIR} existe déjà (client déjà provisionné ?)" >&2
  exit 1
fi

echo "==> 1/5 Scaffold ${CLIENT_NAME}"
./scripts/new-client.sh "$CLIENT_NAME" "$DOMAIN" >/dev/null

# Admin credentials générés si non fournis — écrits avant le premier boot
# (entrypoint.sh crée les comptes quand CREATE_DEFAULT_ADMIN=true)
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@${DOMAIN}}
if [ -z "$ADMIN_PASSWORD" ]; then
  ADMIN_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
fi
GENERATED_CREDS=1

cat >> "${CLIENT_DIR}/.env.backend" <<EOF

CREATE_DEFAULT_ADMIN=true
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}
MEDUSA_FF_TRANSLATION=true
EOF

echo "==> 2/5 Démarrage postgres + redis + backend"
source "${CLIENT_DIR}/.env.backend"
export CLIENT_NAME DOMAIN IMAGE_TAG DB_USER DB_PASSWORD
$COMPOSE up -d postgres redis backend

echo "==> 3/5 Attente backend healthy (migrations + seed)"
TRIES=0
until $COMPOSE exec -T backend node -e \
  "require('http').get('http://127.0.0.1:9000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" \
  >/dev/null 2>&1; do
  TRIES=$((TRIES + 1))
  if [ "$TRIES" -ge 60 ]; then
    echo "ERREUR: backend pas healthy après 5 min" >&2
    $COMPOSE logs --tail=50 backend >&2
    exit 1
  fi
  sleep 5
done
echo "    backend OK"

echo "==> 4/5 Extraction de la clé publishable"
PK=$($COMPOSE exec -T postgres psql -U postgres -d "white_${CLIENT_NAME}" -t -A \
  -c "SELECT token FROM api_key WHERE type='publishable' ORDER BY created_at LIMIT 1" | tr -d '[:space:]')

if [ -z "$PK" ]; then
  echo "ERREUR: aucune clé publishable trouvée (seed échoué ?)" >&2
  exit 1
fi

sed -i "s|^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${PK}|" \
  "${CLIENT_DIR}/.env.storefront"
# Traefik expose le backend sur les préfixes /store,/auth,/admin du domaine —
# le navigateur doit donc appeler https://DOMAIN (pas /api).
if grep -q "^NEXT_PUBLIC_MEDUSA_BACKEND_URL=" "${CLIENT_DIR}/.env.storefront"; then
  sed -i "s|^NEXT_PUBLIC_MEDUSA_BACKEND_URL=.*|NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${DOMAIN}|" \
    "${CLIENT_DIR}/.env.storefront"
else
  echo "NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${DOMAIN}" >> "${CLIENT_DIR}/.env.storefront"
fi

echo "==> 5/5 Démarrage storefront"
$COMPOSE up -d storefront

cat <<EOF

Provision terminé pour ${CLIENT_NAME}
  Storefront : https://${DOMAIN}
  Admin      : https://${DOMAIN}/app  (${ADMIN_EMAIL})
  Backend    : https://${DOMAIN}/store/* (via Traefik)

$([ "$GENERATED_CREDS" = "1" ] && echo "  Admin password (à noter, affiché une seule fois): ${ADMIN_PASSWORD}")

Vérifier: STOREFRONT_URL=https://${DOMAIN} MEDUSA_BACKEND_URL=https://${DOMAIN} ./scripts/verify.sh
EOF

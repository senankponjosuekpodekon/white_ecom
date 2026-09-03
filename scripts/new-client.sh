#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: new-client.sh <client-slug> [domain]"
  exit 1
fi

CLIENT_NAME=$1
DOMAIN=${2:-$CLIENT_NAME.stiamond.store}
DB_PASSWORD=${DB_PASSWORD:-$(openssl rand -base64 32)}
IMAGE_TAG=${IMAGE_TAG:-latest}

echo "Creating client ${CLIENT_NAME}..."

mkdir -p "clients/${CLIENT_NAME}"

cat > "clients/${CLIENT_NAME}/config.json" <<EOF
{
  "name": "${CLIENT_NAME}",
  "domain": "${DOMAIN}",
  "locale": "fr"
}
EOF

cat > "clients/${CLIENT_NAME}/.env.backend" <<EOF
# Client: ${CLIENT_NAME}
CLIENT_NAME=${CLIENT_NAME}
DOMAIN=${DOMAIN}
IMAGE_TAG=${IMAGE_TAG}

STORE_CORS=https://${DOMAIN}
ADMIN_CORS=https://${DOMAIN}
AUTH_CORS=https://${DOMAIN}
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
DB_USER=postgres
DB_PASSWORD=${DB_PASSWORD}
DATABASE_URL=postgres://postgres:${DB_PASSWORD}@postgres:5432/white_${CLIENT_NAME}
DB_NAME=white_${CLIENT_NAME}

STORE_NAME=${CLIENT_NAME}
PRIMARY_COLOR=#111111
LOGO_URL=
STORE_FONT=Inter
DEFAULT_LANGUAGE=fr
SUPPORTED_LANGUAGES=fr,en

STRIPE_API_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
EOF

cat > "clients/${CLIENT_NAME}/.env.storefront" <<EOF
MEDUSA_BACKEND_URL=https://${DOMAIN}
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_STRIPE_KEY=pk_test_placeholder
EOF

echo "Client ${CLIENT_NAME} created in clients/${CLIENT_NAME}"
echo "Next steps:"
echo "  1. Fill clients/${CLIENT_NAME}/.env.* with real values."
echo "  2. Add DNS: ${DOMAIN} -> your server IP."
echo "  3. Run: ./scripts/deploy-client.sh ${CLIENT_NAME}"

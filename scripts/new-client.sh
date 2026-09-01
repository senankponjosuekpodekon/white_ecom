#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: new-client.sh <client-slug> [domain]"
  exit 1
fi

CLIENT_NAME=$1
DOMAIN=${2:-$CLIENT_NAME.stiamond.store}

mkdir -p "clients/${CLIENT_NAME}"

cat > "clients/${CLIENT_NAME}/.env.backend" <<EOF
STORE_CORS=https://${DOMAIN}
ADMIN_CORS=https://${DOMAIN}
AUTH_CORS=https://${DOMAIN}
REDIS_URL=redis://redis:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgres://postgres:\${DB_PASSWORD}@postgres:5432/white_${CLIENT_NAME}
DB_NAME=white_${CLIENT_NAME}
EOF

cat > "clients/${CLIENT_NAME}/.env.storefront" <<EOF
MEDUSA_BACKEND_URL=https://${DOMAIN}/api
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
EOF

echo "Client ${CLIENT_NAME} created."
echo "Next steps:"
echo "  1. Fill clients/${CLIENT_NAME}/.env.* with real values."
echo "  2. Add DNS: ${DOMAIN} -> your server IP."
echo "  3. Run: deploy-client.sh ${CLIENT_NAME}"

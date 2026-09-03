#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: deploy-client.sh <client-slug>"
  exit 1
fi

CLIENT_NAME=$1

if [ ! -d "clients/${CLIENT_NAME}" ]; then
  echo "Client ${CLIENT_NAME} not found. Run new-client.sh first."
  exit 1
fi

# shellcheck source=/dev/null
source "clients/${CLIENT_NAME}/.env.backend"

export CLIENT_NAME
export DOMAIN
export IMAGE_TAG
export DB_USER
export DB_PASSWORD

echo "Deploying client ${CLIENT_NAME} on ${DOMAIN}..."

docker compose -f docker-compose.client.yml.template -p "white-${CLIENT_NAME}" up -d

echo "Deployed client ${CLIENT_NAME}."
echo "Storefront: https://${DOMAIN}"
echo "Backend: https://${DOMAIN}/api"

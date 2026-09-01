#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: deploy-client.sh <client-slug>"
  exit 1
fi

CLIENT_NAME=$1
export CLIENT_NAME

if [ ! -d "clients/${CLIENT_NAME}" ]; then
  echo "Client ${CLIENT_NAME} not found. Run new-client.sh first."
  exit 1
fi

# shellcheck source=/dev/null
source "clients/${CLIENT_NAME}/.env.backend"
export DOMAIN IMAGE_TAG

docker compose -f docker-compose.client.yml.template -p "white-${CLIENT_NAME}" up -d

echo "Deployed client ${CLIENT_NAME}."

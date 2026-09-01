#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: backup-client.sh <client-slug>"
  exit 1
fi

CLIENT_NAME=$1
DATE=$(date +%F)
BACKUP_FILE="white-${CLIENT_NAME}-${DATE}.sql.gz"

docker compose -p "white-${CLIENT_NAME}" exec -T postgres \
  pg_dump -U postgres "white_${CLIENT_NAME}" | gzip > "clients/${CLIENT_NAME}/${BACKUP_FILE}"

echo "Backup created: clients/${CLIENT_NAME}/${BACKUP_FILE}"

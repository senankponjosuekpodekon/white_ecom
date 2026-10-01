#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "Usage: backup-client.sh <client-slug>"
  echo ""
  echo "Variables d'environnement optionnelles :"
  echo "  BACKUP_S3_BUCKET   Bucket S3 pour l'upload offsite (ex: s3://my-backups)"
  echo "  BACKUP_RETENTION_DAYS  Rétention locale en jours (défaut: 30)"
  exit 1
fi

CLIENT_NAME=$1
DATE=$(date +%F)
BACKUP_FILE="white-${CLIENT_NAME}-${DATE}.sql.gz"
BACKUP_DIR="clients/${CLIENT_NAME}"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}

mkdir -p "$BACKUP_DIR"

docker compose -p "white-${CLIENT_NAME}" exec -T postgres \
  pg_dump -U postgres "white_${CLIENT_NAME}" | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

# Sanity check: non-empty dump
if [ ! -s "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
  echo "ERREUR: backup vide pour ${CLIENT_NAME}" >&2
  rm -f "${BACKUP_DIR}/${BACKUP_FILE}"
  exit 1
fi

echo "Backup created: ${BACKUP_DIR}/${BACKUP_FILE} ($(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1))"

# Offsite upload to S3 if configured (requires aws cli)
if [ -n "$BACKUP_S3_BUCKET" ]; then
  if command -v aws >/dev/null 2>&1; then
    aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" \
      "${BACKUP_S3_BUCKET%/}/${CLIENT_NAME}/${BACKUP_FILE}"
    echo "Uploaded to ${BACKUP_S3_BUCKET%/}/${CLIENT_NAME}/${BACKUP_FILE}"
  else
    echo "ATTENTION: BACKUP_S3_BUCKET défini mais aws cli absent — upload ignoré" >&2
  fi
fi

# Local retention
find "$BACKUP_DIR" -name "white-${CLIENT_NAME}-*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete

echo "Rétention locale: ${RETENTION_DAYS} jours"

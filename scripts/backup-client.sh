#!/bin/bash
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: backup-client.sh <client-slug>"
  echo ""
  echo "Variables d'environnement optionnelles :"
  echo "  BACKUP_S3_BUCKET       Bucket S3 pour l'upload offsite (ex: s3://my-backups)"
  echo "  BACKUP_RETENTION_DAYS  Rétention locale en jours (défaut: 30)"
  echo "  BACKUP_DRY_RUN=1       Simule sans créer de fichier ni upload"
  exit 1
fi

CLIENT_NAME=$1
DATE=$(date +%F)
BACKUP_FILE="white-${CLIENT_NAME}-${DATE}.sql.gz"
BACKUP_DIR="clients/${CLIENT_NAME}"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
DRY_RUN=${BACKUP_DRY_RUN:-0}

if [ "$DRY_RUN" = "1" ]; then
  echo "[dry-run] Dump: white_${CLIENT_NAME} -> ${BACKUP_DIR}/${BACKUP_FILE}"
  echo "[dry-run] S3: ${BACKUP_S3_BUCKET:-non configuré} (aws cli: $(command -v aws >/dev/null 2>&1 && echo présent || echo absent))"
  echo "[dry-run] Rétention: suppression locale > ${RETENTION_DAYS}j dans ${BACKUP_DIR}/white-${CLIENT_NAME}-*.sql.gz"
  exit 0
fi

mkdir -p "$BACKUP_DIR"
TMP_FILE="${BACKUP_DIR}/.${BACKUP_FILE}.tmp"

if ! docker compose -p "white-${CLIENT_NAME}" exec -T postgres \
  pg_dump -U postgres "white_${CLIENT_NAME}" | gzip > "$TMP_FILE"; then
  echo "ERREUR: pg_dump a échoué pour ${CLIENT_NAME}" >&2
  rm -f "$TMP_FILE"
  exit 1
fi

# Sanity check: valid gzip AND non-empty uncompressed payload
if ! gzip -t "$TMP_FILE" 2>/dev/null || [ "$(gzip -dc "$TMP_FILE" | wc -c)" -lt 1024 ]; then
  echo "ERREUR: backup vide ou corrompu pour ${CLIENT_NAME}" >&2
  rm -f "$TMP_FILE"
  exit 1
fi

mv "$TMP_FILE" "${BACKUP_DIR}/${BACKUP_FILE}"
echo "Backup created: ${BACKUP_DIR}/${BACKUP_FILE} ($(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1))"

# Offsite upload to S3 if configured (requires aws cli)
if [ -n "${BACKUP_S3_BUCKET:-}" ]; then
  if command -v aws >/dev/null 2>&1; then
    aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" \
      "${BACKUP_S3_BUCKET%/}/${CLIENT_NAME}/${BACKUP_FILE}"
    echo "Uploaded to ${BACKUP_S3_BUCKET%/}/${CLIENT_NAME}/${BACKUP_FILE}"
  else
    echo "ATTENTION: BACKUP_S3_BUCKET défini mais aws cli absent — upload ignoré" >&2
  fi
fi

# Local retention — scoped to this client's own prefix
find "$BACKUP_DIR" -name "white-${CLIENT_NAME}-*.sql.gz" -mtime "+${RETENTION_DAYS}" -delete

echo "Rétention locale: ${RETENTION_DAYS} jours"

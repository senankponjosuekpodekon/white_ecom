#!/bin/sh
set -e

npx medusa db:migrate --execute-safe-links
npx medusa db:migrate:scripts

# Create demo admin users only in non-production or if explicitly requested
if [ "$NODE_ENV" != "production" ] || [ "$CREATE_DEFAULT_ADMIN" = "true" ]; then
  npx medusa user -e "${SUPER_ADMIN_EMAIL:-super@example.com}" -p "${SUPER_ADMIN_PASSWORD:-superpassword}" || true
  npx medusa user -e "${ADMIN_EMAIL:-admin@example.com}" -p "${ADMIN_PASSWORD:-password}" || true
  npx medusa user -e "${MANAGER_EMAIL:-manager@example.com}" -p "${MANAGER_PASSWORD:-managerpassword}" || true
fi

npx medusa start

#!/bin/sh
set -e

npx medusa db:migrate

# Create a default admin user only in non-production or if explicitly requested
if [ "$NODE_ENV" != "production" ] || [ "$CREATE_DEFAULT_ADMIN" = "true" ]; then
  npx medusa user -e "${ADMIN_EMAIL:-admin@example.com}" -p "${ADMIN_PASSWORD:-password}" || true
fi

npx medusa start

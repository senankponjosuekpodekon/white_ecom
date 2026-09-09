#!/bin/sh
set -e

npx medusa db:migrate --execute-safe-links
npx medusa db:migrate:scripts

# Seed initial data only when no publishable API key exists yet
if ! node - <<'NODE'
const { Client } = require("pg")
;(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  try {
    await client.connect()
    const { rows } = await client.query("SELECT COUNT(*) FROM api_key WHERE type='publishable'")
    const count = parseInt(rows[0].count, 10)
    await client.end()
    process.exit(count > 0 ? 0 : 1)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})()
NODE
then
  echo "Seeding initial data..."
  npx medusa exec .medusa/server/src/migration-scripts/initial-data-seed.js
else
  echo "Initial data already seeded, skipping."
fi

# Create demo admin users only in non-production or if explicitly requested
if [ "$NODE_ENV" != "production" ] || [ "$CREATE_DEFAULT_ADMIN" = "true" ]; then
  npx medusa user -e "${SUPER_ADMIN_EMAIL:-super@example.com}" -p "${SUPER_ADMIN_PASSWORD:-superpassword}" || true
  npx medusa user -e "${ADMIN_EMAIL:-admin@example.com}" -p "${ADMIN_PASSWORD:-password}" || true
  npx medusa user -e "${MANAGER_EMAIL:-manager@example.com}" -p "${MANAGER_PASSWORD:-managerpassword}" || true
fi

npx medusa start

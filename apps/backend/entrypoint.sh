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

create_user_if_missing() {
  local email="$1"
  local password="$2"

  if CHECK_EMAIL="$email" node - <<NODE
const { Client } = require("pg")
;(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  try {
    await client.connect()
    const { rows } = await client.query('SELECT COUNT(*) FROM "user" WHERE email = $1', [process.env.CHECK_EMAIL])
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
    echo "User $email already exists, skipping."
  else
    npx medusa user -e "$email" -p "$password" || true
  fi
}

# Create demo admin users only in non-production or if explicitly requested
if [ "$NODE_ENV" != "production" ] || [ "$CREATE_DEFAULT_ADMIN" = "true" ]; then
  create_user_if_missing "${SUPER_ADMIN_EMAIL:-super@example.com}" "${SUPER_ADMIN_PASSWORD:-superpassword}"
  create_user_if_missing "${ADMIN_EMAIL:-admin@example.com}" "${ADMIN_PASSWORD:-password}"
  create_user_if_missing "${MANAGER_EMAIL:-manager@example.com}" "${MANAGER_PASSWORD:-managerpassword}"
fi

npx medusa start

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

create_user_if_configured() {
  local email="$1"
  local password="$2"

  if [ -z "$email" ] || [ -z "$password" ]; then
    echo "Skipping user creation: email or password not configured"
    return
  fi

  create_user_if_missing "$email" "$password"
}

# Create default admin users only when explicitly requested
if [ "$CREATE_DEFAULT_ADMIN" = "true" ]; then
  create_user_if_configured "$SUPER_ADMIN_EMAIL" "$SUPER_ADMIN_PASSWORD"
  create_user_if_configured "$ADMIN_EMAIL" "$ADMIN_PASSWORD"
  create_user_if_configured "$MANAGER_EMAIL" "$MANAGER_PASSWORD"
fi

exec npx medusa start -H 0.0.0.0 -p "${PORT:-9000}"

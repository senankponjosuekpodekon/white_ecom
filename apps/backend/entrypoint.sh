#!/bin/sh
set -e

npx medusa db:migrate

# Create a default admin user if it doesn't already exist
npx medusa user -e admin@example.com -p password || true

npx medusa start

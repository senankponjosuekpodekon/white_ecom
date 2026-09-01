#!/bin/sh
set -e

npx medusa db:migrate
npx medusa develop

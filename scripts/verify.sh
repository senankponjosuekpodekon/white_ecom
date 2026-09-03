#!/bin/bash
set -e

# Load frontend publishable key
if [ -f .env.storefront ]; then
  # shellcheck source=/dev/null
  export $(grep -v '^#' .env.storefront | xargs)
fi

PK=${NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY:-}
BASE=${STOREFRONT_URL:-http://localhost:3000}
API=${MEDUSA_BACKEND_URL:-http://localhost:9000}

PASS=0
FAIL=0

check() {
  local name=$1
  local url=$2
  local expected=${3:-200}
  local code

  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" = "$expected" ]; then
    echo "[OK] $name ($code)"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] $name (got $code, expected $expected)"
    FAIL=$((FAIL + 1))
  fi
}

check_auth() {
  local name=$1
  local url=$2
  local expected=${3:-200}
  local code

  if [ -z "$PK" ]; then
    echo "[SKIP] $name (pas de NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)"
    return
  fi

  code=$(curl -s -H "x-publishable-api-key: $PK" -o /dev/null -w "%{http_code}" "$url")
  if [ "$code" = "$expected" ]; then
    echo "[OK] $name ($code)"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] $name (got $code, expected $expected)"
    FAIL=$((FAIL + 1))
  fi
}

check_contains() {
  local name=$1
  local url=$2
  local text=$3

  if curl -s "$url" | grep -q "$text"; then
    echo "[OK] $name contains '$text'"
    PASS=$((PASS + 1))
  else
    echo "[FAIL] $name does not contain '$text'"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== Vérification du déploiement ==="
echo "Base: $BASE"
echo "API: $API"
echo ""

check "Homepage" "$BASE/fr" 200
check_contains "Homepage" "$BASE/fr" "White Shop"
check "Products" "$BASE/fr/products" 200
check_contains "Products" "$BASE/fr/products" "Medusa Sweatshirt"
check "Product detail" "$BASE/fr/products/sweatshirt" 200
check_contains "Product detail" "$BASE/fr/products/sweatshirt" "Medusa Sweatshirt"
check "Cart" "$BASE/fr/cart" 200
check "Contact" "$BASE/fr/contact" 200
check_contains "Contact" "$BASE/fr/contact" "Contactez-nous"
check "Legal" "$BASE/fr/legal" 200
check_contains "Legal" "$BASE/fr/legal" "Mentions légales"
check "Terms" "$BASE/fr/terms" 200
check_contains "Terms" "$BASE/fr/terms" "Conditions de service"
check "Shipping" "$BASE/fr/shipping" 200
check "Returns" "$BASE/fr/returns" 200
check "Privacy" "$BASE/fr/privacy" 200
check "LLMs.txt" "$BASE/llms.txt" 200
check "Sitemap" "$BASE/sitemap.xml" 200
check "Robots" "$BASE/robots.txt" 200

echo ""
echo "=== Vérification des flux produits ==="
for platform in google facebook pinterest tiktok; do
  url="$API/store/feed/$platform"
  if [ -n "$PK" ]; then
    if curl -s -H "x-publishable-api-key: $PK" -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
      echo "[OK] Feed $platform (200)"
      PASS=$((PASS + 1))
    else
      echo "[FAIL] Feed $platform"
      FAIL=$((FAIL + 1))
    fi
  else
    echo "[SKIP] Feed $platform (pas de NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)"
  fi
done

echo ""
echo "=== Vérification API backend ==="
check "Backend health" "$API/health" 200
check_auth "Store config" "$API/store/store-config" 200

echo ""
echo "=== Résultat ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi

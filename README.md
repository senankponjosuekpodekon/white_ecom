# White Shop — E-commerce white-label SaaS

Plateforme e-commerce multi-clients basée sur **Medusa v2** et **Next.js 14**.

---

## Stack

- **Backend** : Medusa v2, PostgreSQL 16, Redis 7
- **Frontend** : Next.js 14 (App Router), Tailwind CSS, next-intl v4
- **DevOps** : Docker, Docker Compose, Traefik (client), GitHub Actions
- **Tests** : Jest (backend), Playwright (E2E)

---

## Démarrage rapide (autre machine)

### Prérequis

- Node.js 20
- npm
- Docker et Docker Compose

### 1. Cloner et installer

```bash
git clone <repo>
cd white_ecom
npm install
```

### 2. Créer les fichiers d’environnement

`docker-compose.yml` attend `.env.backend` et `.env.storefront` à la racine. Crée-les :

**`.env.backend`**

```bash
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:3000,http://localhost:9000
AUTH_CORS=http://localhost:3000
REDIS_URL=redis://redis:6379
JWT_SECRET=local-jwt-secret
COOKIE_SECRET=local-cookie-secret
DATABASE_URL=postgres://postgres:postgres@postgres:5432/white_local?ssl=false&sslmode=disable
DB_NAME=white_local

# White-label store config (served by GET /store/store-config)
STORE_NAME=White Shop
PRIMARY_COLOR=#111111
LOGO_URL=
STORE_FONT=Inter
DEFAULT_LANGUAGE=fr
SUPPORTED_LANGUAGES=fr,en
```

**`.env.storefront`**

```bash
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxx
```

La clé `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` est générée une fois le backend démarré (voir étape 4).

### 3. Build et lancer Docker

```bash
docker compose up -d --build
```

- Storefront : `http://localhost:3000`
- API Medusa : `http://localhost:9000`

### 4. Créer un admin + une clé publishable

```bash
# Admin user
docker compose exec backend npx medusa user -e admin@example.com -p password

# Login et récupération du token
TOKEN=$(curl -s -X POST http://localhost:9000/auth/user/emailpass \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"password"}' | jq -r '.token')

# Créer la clé publishable
curl -s -X POST http://localhost:9000/admin/api-keys \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Storefront Key","type":"publishable"}'
```

Copie la valeur `token` (`pk_...`) dans `.env.storefront`, puis redémarre le storefront :

```bash
docker compose up -d storefront
```

---

## Lancer en développement (hors Docker)

```bash
# Terminal 1
npm run backend:dev

# Terminal 2
npm run storefront:dev
```

---

## Scripts de déploiement client

```bash
./scripts/new-client.sh boutique-jean boutique-jean.com
./scripts/deploy-client.sh boutique-jean
./scripts/backup-client.sh boutique-jean
```

---

## Déploiement principal (production)

1. Générer les images :

```bash
# Local
npm run build
npm run test
docker compose build

# Ou via CI/CD : push sur main ou tag v*
```

2. Créer `.env.production` à partir du template :

```bash
cp .env.production.template .env.production
# Éditer DOMAIN, ACME_EMAIL, secrets, clés Stripe/PK, etc.
```

3. Lancer le stack principal :

```bash
docker compose -f docker-compose.prod.yml up -d
```

4. Vérifier :

```bash
./scripts/verify.sh
```

> Nécessite les ports 80 et 443 libres et un nom de domaine pointant vers le serveur.

---

## Architecture

- Mono-repo `npm` workspaces avec `turbo`
- `apps/backend` : API commerce Medusa
- `apps/storefront` : boutique Next.js avec i18n `[locale]`
- `clients/` : configurations et backups par client
- `docker-compose.client.yml.template` : template de déploiement client avec Traefik

---

## Fonctionnalités récentes

### Système de design blanc-étiquette

- Presets design (`modern`, `corporate`, `minimalist`, `luxury`, `playful`)
- Variables CSS injectées automatiquement par client
- Contenu `content.json` par client avec fallback par défaut (fr/en)

### SEO & découverte

- `robots.txt`, `sitemap.xml`, JSON-LD `Product`, `BreadcrumbList`
- Hreflang + canonical par page
- `public/llms.txt` pour les crawlers LLM

### Pages storefront

- `/[locale]/` (home), `/[locale]/products`, `/[locale]/products/[handle]`, `/[locale]/cart`, `/[locale]/checkout`
- Politiques : `/[locale]/shipping`, `/[locale]/returns`, `/[locale]/privacy`, `/[locale]/legal`, `/[locale]/terms`
- Contact : `/[locale]/contact` avec email, téléphone, adresse, horaires, réseaux sociaux depuis `content.json`

### Google Merchant

- `GET /store/feed/{google,facebook,pinterest,tiktok}` : CSVs adaptés à chaque plateforme
- Gestion des attributs : `condition`, `color`, `size`, `age_group`, `gender`, `gtin`, `mpn`, `google_product_category`
- Disponibilité calculée depuis l’inventaire Medusa

### Google Ads

- Injection dynamique du tag (`gtagId`)
- Events : `view_item_list`, `view_item`, `add_to_cart`, `begin_checkout`, `purchase`

### Admin

- `/app/content` — éditeur visuel de `content.json` (formulaire + aperçu live)
- `/app/onboarding` — onboarding boutique (nom, design, modèle économique, devises, pays)
- `/app/dashboard` — métriques (produits, clients, commandes, revenus)
- `/app/quick-product` — ajout / édition rapide de produit (une page)
- `/app/csv` — import / export CSV des produits
- `/app/clients` — liste et création des boutiques white-label
- `/admin/content` / `/admin/config` — API de lecture/écriture `content.json` et `config.json`
- `/admin/clients` — API de gestion des clients

---

## Notes

- `getStoreConfig` appelle `/store/store-config` (custom route) et fallback sur les valeurs par défaut en cas d’erreur.
- L’admin UI est désactivé en mode `medusa start` ; exécute `npx medusa develop` pour l’activer.
- Les fichiers `.env.*` ne sont jamais commités.

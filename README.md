# White Shop — E-commerce white-label SaaS

Plateforme e-commerce multi-clients basée sur **Medusa v2** et **Next.js 14**.

---

## Stack

- **Backend** : Medusa v2, PostgreSQL 16, Redis 7
- **Frontend** : Next.js 14 (App Router), Tailwind CSS, next-intl v4
- **DevOps** : Docker, Docker Compose, Traefik (client), GitHub Actions
- **Tests** : Jest (backend), Playwright (E2E)

---

## Démarrage rapide

### Prérequis

- Node.js 20+
- npm (le package manager est verrouillé dans `package.json`)
- Docker et Docker Compose (optionnel, mais recommandé)

### Installation

```bash
npm install
```

### Lancer en local avec Docker

```bash
# Build et démarrage
npm run build -w @dtc/backend
npm run build -w @dtc/storefront
docker compose up -d

# Migrations et seed
docker compose exec backend npx medusa db:migrate
docker compose exec backend npx medusa user -e admin@example.com -p password
```

- Storefront : `http://localhost:3000`
- API Medusa : `http://localhost:9000`
- Admin Medusa : `http://localhost:9000/app`

### Lancer en développement (hors Docker)

```bash
# Terminal 1
npm run backend:dev

# Terminal 2
npm run storefront:dev
```

---

## Scripts de déploiement

```bash
# Créer un nouveau client
./scripts/new-client.sh boutique-jean boutique-jean.com

# Déployer un client
./scripts/deploy-client.sh boutique-jean

# Sauvegarder la base d'un client
./scripts/backup-client.sh boutique-jean
```

---

## Architecture

- Mono-repo `npm` workspaces avec `turbo`
- `apps/backend` : API commerce Medusa
- `apps/storefront` : boutique Next.js avec i18n `[locale]`
- `clients/` : configurations et backups par client
- `docker-compose.client.yml.template` : template de déploiement client avec Traefik

---

## Notes

- `getStoreConfig` est actuellement en stub pour permettre le build statique ; il sera branché au backend une fois l'API démarrée.
- Les fichiers `.env.*` ne sont jamais commités.

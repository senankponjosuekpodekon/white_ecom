# Stiamond White Shop — Spécification technique SaaS v1.0

- **Version** : 1.0
- **Date** : 2026-09-01
- **Statut** : Validé — prêt pour le scaffolding
- **Auteur** : Ingénierie Stiamond
- **Scope** : Plateforme e-commerce white-label, multi-clients, déployée en mode SaaS

---

## 1. Vue d'ensemble

### 1.1 Problème résolu

Les PME et indépendants qui veulent vendre en ligne n'ont aujourd'hui que deux options : des plateformes propriétaires à commission (Shopify) ou des monolithes fragiles à base de plugins (WooCommerce). **Stiamond White Shop** propose une troisième voie : une boutique en marque blanche, déployée en quelques heures, sur un code source maîtrisé, sans frais de transaction ni dépendance à un éditeur tiers.

### 1.2 Acteurs

| Acteur | Rôle | Besoin principal |
|---|---|---|
| **Client Stiamond** | Commerçant/propriétaire de la boutique | Lancer une boutique sans gérer d'infrastructure. |
| **Acheteur final** | Client du client | Expérience fluide, paiement sécurisé, mobile first. |
| **Opérateur Stiamond** | Équipe interne | Déployer, maintenir et scaler N boutiques avec un minimum d'effort. |

### 1.3 Promise produit

- Une base de code unique, jamais forkée par client.
- Un déploiement par configuration (`.env` + base de données vierge + seed).
- Des mises à jour de l'image Docker propagées à l'ensemble des clients sans réécriture manuelle.
- Un modèle économique basé sur un abonnement/marge Stiamond, pas sur une commission par vente.

---

## 2. Principes directeurs

1. **Configuration > Code**  
   Tout ce qui varie d'un client à l'autre est extériorisé (variables d'environnement, `Store.metadata`, base de données). Aucun `if client === 'x'` dans le code.

2. **Isolation complète**  
   Chaque client dispose de sa propre base PostgreSQL, de ses propres secrets et de son propre namespace conteneur.

3. **Image unifiée versionnée**  
   Une seule image Docker construite et taguée (`white-shop:v{semVer}-{sha}`). Cette image est déployée chez tous les clients.

4. **Security by design**  
   Aucune donnée de carte bancaire ne transite ou n'est stockée en interne. HTTPS, CSP, CORS stricts, secrets externalisés, sauvegardes chiffrées.

5. **Livraison progressive**  
   MVP minimal, phases clairement délimitées, gâchettes objectives avant de passer à la phase suivante.

6. **Observabilité dès le premier client**  
   Logs, métriques, alertes et healthchecks sont requis, pas des luxes de Phase 4.

7. **API-first**  
   Le backend expose une API REST/Admin propre (Medusa v2). Le storefront et l'admin consomment cette API.

8. **Internationalisation dès le MVP**  
   L'architecture est prête à accueillir plusieurs langues d'interface et, en Phase 2, plusieurs langues de catalogue. Chaque client définit ses locales supportées via `Store.metadata`. Aucun texte d'interface n'est codé en dur.

---

## 3. Architecture système

### 3.1 Vue haut niveau

```
Internet
   │
   ▼
Traefik (reverse proxy + TLS auto)
   │
   ├─── client-a.com  ───> Storefront Next.js (conteneur client-a)
   │                         │
   │                         ▼
   │                      Medusa API + Admin (conteneur client-a)
   │                         │
   │           ┌─────────────┴─────────────┐
   │           ▼                           ▼
   │    PostgreSQL client-a           Redis client-a
   │
   └─── client-b.com  ───> Storefront Next.js (conteneur client-b)
                             │
                             ▼
                          Medusa API + Admin (conteneur client-b)
                             │
           ┌─────────────────┴─────────────────┐
           ▼                                   ▼
    PostgreSQL client-b                   Redis client-b

Stockage commun : S3-compatible (images produit)
Télémétrie : logs + métriques centralisés
```

### 3.2 Composants

| Couche | Technologie | Rôle |
|---|---|---|
| Reverse proxy / edge | Traefik v3 | Routage par domaine, TLS auto, rate limiting, headers sécurisés. |
| Storefront | Next.js 14 (App Router, `output: 'standalone'`) + next-intl 3.x | Expérience acheteur, SSR, SEO, runtime branding, i18n. |
| Back-office | Medusa Admin (inclus dans Medusa v2) | Gestion produits, commandes, clients, branding. |
| API commerce | Medusa v2 (Node.js 20 LTS) | Catalogue, panier, commandes, paiements, régions, taxes. |
| Base de données | PostgreSQL 16 | Données transactionnelles par client. |
| Cache / events | Redis 7 | Cache Medusa, file d'événements, sessions. |
| Stockage fichiers | S3-compatible (Scaleway / DigitalOcean Spaces / MinIO) | Images produit, sauvegardes, documents. |
| Paiement | Stripe via module officiel Medusa | Paiement cartes, webhooks. |
| Emails | Resend / Postmark / AWS SES | Confirmations de commande, notifications. |

---

## 4. Stack et versions

Toutes les versions sont verrouillées dans `package.json` et `pnpm-lock.yaml` / `package-lock.json`.

| Composant | Version / Choix | Justification |
|---|---|---|
| Node.js | 20 LTS | Support long terme, compatibilité Medusa v2. |
| next-intl | 3.x | Routing et traduction du storefront. |
| Medusa | 2.x (dernière stable) | MIT, modulaire, module Stripe officiel. |
| Next.js | 14+ (App Router) | SSR natif, `output: 'standalone'`, SEO. |
| PostgreSQL | 16 | Base relationnelle supportée par Medusa. |
| Redis | 7 | Cache et bus d'événements. |
| Stripe | SDK officielle + module Medusa | Conformité PCI, pas de logique custom. |
| S3 | Provider managé au choix | Pas d'ops auto-hébergée en Phase 1. |
| Reverse proxy | Traefik v3 | TLS auto, labels Docker, middlewares. |
| Package manager | pnpm + workspaces | Mono-repo propre, `node_modules` partagés. |
| Lint / format | ESLint + Prettier + TypeScript strict | Qualité de code unifiée. |
| Tests | Vitest (unit) + Playwright (E2E) | Tests rapides + parcours réels. |
| CI/CD | GitHub Actions (ou équivalent) | Build, tests, scan, déploiement. |

---

## 5. Modèle multi-tenant et isolation

### 5.1 Choix : isolation forte (one database per tenant)

- Chaque client = une base PostgreSQL distincte (nommée `white_<client-slug>`).
- Chaque client = un namespace Docker (`white-<client-slug>`).
- Chaque client = un set de secrets distincts (DB, Stripe, JWT, cookie, S3).
- Aucune table ou ligne n'est partagée entre deux clients.

### 5.2 Avantages de ce modèle

- Simplicité opérationnelle : un backup/restore/restauration par client est trivial.
- Sécurité accrue : une fuite sur une base n'impacte pas les autres.
- Conformité RGPD : la suppression d'un client est une suppression physique de sa base.

### 5.3 Limites gérées

- N multiplie les conteneurs DB/Redis. Pour dépasser quelques dizaines de clients, prévoir un monitoring systématique et un orchestrateur (Coolify, Dokploy, Kubernetes) en Phase 4.
- L'agrégation multi-clients (GMV total, churn) nécessite un ETL léger. Voir section 13.

---

## 6. Backend — Medusa v2

### 6.1 Modules activés en Phase 1

- Product / Inventory / Pricing
- Cart / Order / Customer
- Payment — module Stripe officiel (`@medusajs/payment-stripe`)
- Region / Tax (une seule région/devise par client au départ)
- Store (métadonnées du Store utilisées pour le branding)
- Notification (email transactionnel)

### 6.2 Modules custom (Phase 1)

- `whitelabel-store` : validation et injection de la configuration store (logo, couleur, typographie, langues supportées).
- `translation` (Phase 1.5 / Phase 2) : gestion des traductions de catalogue et de contenu par locale.
- `onboarding` (Phase 1.5) : helper de création de compte admin initial.

### 6.3 Workflows et Subscribers

- `order.placed` -> envoi d'email de confirmation.
- `order.payment_failed` -> notification client + log retry.
- `customer.created` -> email de bienvenue (optionnel Phase 1).

### 6.4 Migrations

- Les migrations Medusa sont appliquées au démarrage par un `entrypoint.sh` robuste.
- Stratégie de dry-run : chaque montée de version est testée sur une copie de base client anonymisée avant déploiement généralisé.

---

## 7. Frontend — Next.js

### 7.1 Architecture des pages

```
app/
├── [locale]/
│   ├── (store)/
│   │   ├── page.tsx                  # Accueil
│   │   ├── products/[handle]/page.tsx
│   │   ├── categories/[handle]/page.tsx
│   │   ├── cart/page.tsx
│   │   └── checkout/page.tsx
│   └── layout.tsx                  # Server layout, branding + locale
├── admin/                          # Redirection vers Medusa Admin
├── layout.tsx                      # Root layout
└── error.tsx / not-found.tsx
```

### 7.2 Runtime branding et langue (aucune variable NEXT_PUBLIC_* sensible)

Le branding et la langue par défaut du client sont lus côté serveur à chaque requête via `getStoreConfig()` appelant `medusaClient.store.retrieve()`. Ils sont injectés sous forme de variables CSS et de paramètres `lang`/`dir` dans le `<html>`.

```ts
// src/lib/get-store-config.ts
import { cache } from 'react'
import { medusaClient } from './medusa-client'

const getStoreConfig = cache(async () => {
  const { store } = await medusaClient.store.retrieve()
  return {
    name: store.name,
    primaryColor: store.metadata?.primary_color ?? '#111111',
    logoUrl: store.metadata?.logo_url ?? '',
    font: store.metadata?.font ?? 'Inter',
    defaultLanguage: (store.metadata?.default_language ?? 'fr') as string,
    supportedLanguages: (store.metadata?.supported_languages ?? ['fr']) as string[],
  }
})
```

`cache()` de React évite les appels redondants entre Server Components d'une même requête.

### 7.3 Sécurité et performances du storefront

- Server Components par défaut ; `medusaClient` n'est jamais exposé au navigateur.
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` est la seule variable préfixée `NEXT_PUBLIC_` ; elle est par définition sans danger.
- `MEDUSA_BACKEND_URL` est lue côté serveur et n'est pas inlined.
- Tailwind mappe `bg-primary` / `text-primary` sur les variables CSS.
- CSP stricte configurée via `next.config.js`.

### 7.4 Internationalisation (i18n)

L'architecture i18n est conçue pour être simple en Phase 1 et extensible en Phase 2.

#### Niveaux de support

| Niveau | Scope | Phase |
|---|---|---|
| **Interface** | Labels, boutons, messages d'erreur. | Phase 1 |
| **Catalogue** | Noms, descriptions, catégories de produits. | Phase 1.5 / Phase 2 |
| **Contenus** | Pages légales, emails, factures, SEO. | Phase 2+ |

#### Mécanisme côté storefront

- `next-intl` gère le routing `[locale]`, le chargement des messages JSON et le fallback.
- La locale par défaut est définie dans `Store.metadata.default_language`.
- La liste des locales supportées est définie dans `Store.metadata.supported_languages`.
- Un middleware (`src/middleware.ts`) redirige `/` vers `/{defaultLocale}` si aucune locale n'est présente.

#### Mécanisme côté catalogue

- En Phase 1, le catalogue reste dans la langue par défaut du client.
- En Phase 2, un module custom `translation` stocke les traductions de catalogue dans des entités `ProductTranslation`, `CategoryTranslation`, liées par `locale`.
- Les API storefront (`/store/products`) incluent une option `?locale=xx` pour surcharger la langue par défaut.

#### SEO multilingue

- Génération de `hreflang` dans `<head>`.
- Sitemap XML par locale (`/sitemap.xml` inclut les URLs `/fr/...`, `/en/...`).
- Balises `lang` et `dir` injectées dans le `<html>` du layout racine.

---

## 8. Intégrations et API

### 8.1 Stripe

- Paiement exclusivement via le module Stripe officiel de Medusa.
- Webhook `payment_intent.succeeded` et `payment_intent.payment_failed`.
- Mode test obligatoire en staging.
- Clés `STRIPE_API_KEY` et `STRIPE_WEBHOOK_SECRET` par client.

### 8.2 S3 (images)

- Images produit uploadées via Medusa vers le bucket client.
- URLs signées si nécessaire pour les assets privés.
- Pas d'image stockée dans le conteneur.

### 8.3 Emails

- Provider configuré via le module Medusa Notification.
- Templates de base : confirmation de commande, livraison, réinitialisation de mot de passe.

---

## 9. Infrastructure et opérations

### 9.1 Conteneurisation

- `apps/backend/Dockerfile` : build `white-shop-backend`.
- `apps/storefront/Dockerfile` : build `white-shop-storefront` en mode `standalone`.
- Images taguées : `white-shop-backend:v1.0.0-{sha}`.

### 9.2 Docker Compose par client

Un template `docker-compose.client.yml` est rendu par `new-client.sh` :

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: white_${CLIENT_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    volumes:
      - redisdata:/data

  backend:
    image: white-shop-backend:${IMAGE_TAG:-latest}
    env_file: .env.backend
    depends_on:
      postgres:
        condition: service_healthy
    command: ["/app/entrypoint.sh"]
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${CLIENT_NAME}-backend.rule=Host(\`${DOMAIN}\`) && PathPrefix(\`/admin\`,\`/api\`,\`/store\`,\`/auth\`)"
      - "traefik.http.routers.${CLIENT_NAME}-backend.tls.certresolver=letsencrypt"

  storefront:
    image: white-shop-storefront:${IMAGE_TAG:-latest}
    env_file: .env.storefront
    depends_on:
      - backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${CLIENT_NAME}-storefront.rule=Host(\`${DOMAIN}\`)"
      - "traefik.http.routers.${CLIENT_NAME}-storefront.tls.certresolver=letsencrypt"

volumes:
  pgdata:
  redisdata:
```

### 9.3 Reverse proxy

Traefik est déployé une seule fois sur le VPS. Les conteneurs backend/storefront s'enregistrent via des labels. Cela permet d'ajouter un client sans modifier Traefik.

### 9.4 Backups

- **Base de données** : `pg_dump` quotidien vers S3, rétention 30 jours minimum.
- **Images** : stockées sur S3 avec versioning activé.
- **Procédure de restauration** documentée dans le runbook.

### 9.5 Monitoring

- Logs : agrégation via `docker logs` + rotation, puis solution centralisée à partir de 5 clients.
- Healthchecks sur chaque conteneur.
- Alertes basiques : Prometheus + Alertmanager ou service externe.
- Uptime : check HTTP sur chaque domaine client.

### 9.6 Noms de domaine et emails

#### Sous-domaine par défaut

- Chaque client reçoit un sous-domaine automatique : `client.stiamond.store`.
- Traefik génère un certificat SSL wildcard pour `*.stiamond.store`.
- Aucun action DNS requise de la part du client.

#### Domaine personnalisé

- Le client configure un enregistrement `CNAME` ou `A/ALIAS` vers l’infrastructure Stiamond.
- Traefik génère un certificat Let’s Encrypt pour `clientdomain.com`.
- `new-client.sh` affiche les enregistrements DNS exacts à transmettre au client.
- Automatisation possible via l’API Cloudflare si le domaine racine est géré par Stiamond.

#### Emails transactionnels

- Service : Resend, Postmark, AWS SES ou Brevo.
- Sender par défaut : `noreply@client.stiamond.store`.
- Si le client utilise son propre domaine, `new-client.sh` fournit les enregistrements `SPF`, `DKIM` et `DMARC` à ajouter.

#### Email professionnel

- **On n’héberge pas de serveur mail.**
- Options proposées :
  - **Cloudflare Email Routing** : redirection gratuite `contact@clientdomain.com` -> boîte personnelle.
  - **Google Workspace / Zoho / Microsoft 365** : vraie boîte mail, à facturer au client ou gérée par lui.

---

## 10. Sécurité

### 10.1 Secrets

- Aucun secret n'est commité.
- `.env.backend` et `.env.storefront` sont générés par script.
- À partir du 3e client : utilisation d'un vault externe (Doppler, Infisical, HashiCorp Vault) ou Docker secrets.
- `JWT_SECRET`, `COOKIE_SECRET` et `STRIPE_API_KEY` uniques par client.

### 10.2 Réseau et transport

- TLS 1.2+ obligatoire, HSTS activé.
- CORS strict : seuls les domaines client autorisés (`STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`).
- Rate limiting sur les routes `/auth` et `/store/carts`.

### 10.3 Headers et contenu

- CSP configurée : autoriser uniquement Stripe, S3 et self.
- `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`.

### 10.4 Conformité

- RGPD : bannière de consentement, mentions légales et CGV par pays, droit à l'oubli (suppression de compte + base client).
- PCI : aucune donnée de carte stockée ou traitée par Stiamond. Stripe gère tout.
- TVA : taxes configurées par région Medusa, mentions légales localisées.

---

## 11. Tests et qualité

### 11.1 Niveaux de test

| Niveau | Outil | Portée |
|---|---|---|
| Unitaire | Vitest | Utilitaires, calculs de prix, validation des formulaires. |
| Intégration | Vitest / in-memory DB | Services et repositories custom du backend. |
| API | Supertest / fetch | Points d'API Medusa sur instance de test. |
| E2E | Playwright | Parcours complet d'achat. |

### 11.2 Scénarios critiques obligatoires

1. Catalogue -> produit -> panier -> checkout -> paiement Stripe test -> email reçu.
2. Affichage correct du branding.
3. Échec de paiement -> conservation du panier.
4. Migration de base de test (dry-run).

### 11.3 CI/CD

GitHub Actions exécute à chaque PR et push sur `main` :

```
lint -> typecheck -> unit tests -> build images -> integration tests -> E2E on staging -> image push to registry
```

### 11.4 Gestion des dépendances

- `npm audit` / `pnpm audit` dans la CI.
- Dependabot ou Renovate pour les mises à jour.
- Pas de mise à jour majeure Medusa sans dry-run sur copie de base client.

---

## 12. Déploiement et scripts

### 12.1 `new-client.sh`

Script interactif de création d'un client :

1. Saisie du slug client, du domaine, de la devise, de la région.
2. Génération des secrets (JWT, cookie, DB password).
3. Création du dossier `clients/<slug>/`.
4. Génération des `.env.backend` / `.env.storefront` à partir de templates.
5. Affichage des enregistrements DNS à créer.

### 12.2 `deploy-client.sh <slug>`

1. Pull de l'image versionnée.
2. Lancement du `docker compose -p white-<slug> up -d`.
3. Attente du healthcheck Postgres.
4. Exécution des migrations.
5. Si la base est vierge, exécution du seed.
6. Vérification HTTP 200 sur le domaine.

### 12.3 `update-image.sh <version>`

1. Build et tag de l'image.
2. Déploiement sur l'instance de staging.
3. Exécution des tests E2E.
4. Déploiement progressif chez les clients (par lots de 20 %, avec pause d'observation).
5. Rollback automatique si un healthcheck échoue.

### 12.4 `backup-client.sh <slug>`

Export quotidien vers S3 avec nommage `white-<slug>-<yyyy-mm-dd>.sql.gz`.

---

## 13. Feuille de route et gâchettes

| Phase | Contenu | Gâchette de passage |
|---|---|---|
| **Phase 1 — MVP** | Boutique single-région, Stripe, branding basique, interface multilingue (next-intl), 1 client réel live. | 1 client payant avec un achat de test réussi. |
| **Phase 1.5** | Traductions du catalogue et contenus produits (module `translation`). | 1 client demandant 2+ langues de catalogue. |
| **Phase 2 — Post-MVP** | Flux Google Merchant / Meta, multi-région, analytics basique, `new-client.sh` automatisé. | 3 clients stables, 30 jours sans incident critique. |
| **Phase 3 — Modules** | Bouton WhatsApp (feature flag), factures PDF, page builder JSON. | 10 clients actifs, retours métier clairs. |
| **Phase 4 — Industrialisation** | Onboarding self-service, dashboard multi-clients, orchestrateur (Coolify/Kubernetes). | 30+ clients ou volume justifiant l'investissement. |

---

## 14. Definition of Done — MVP

| # | Condition | Critère d'acceptation | Owner |
|---|---|---|---|
| 1 | Parcours d'achat complet | Un acheteur test peut commander et payer via Stripe test. | Frontend + QA |
| 2 | Email de confirmation | Un email est envoyé sous 2 minutes après `order.placed`. | Backend |
| 3 | Branding modifiable | Logo, couleur et langue par défaut modifiés depuis l'admin sans commit. | Frontend |
| 4 | Interface multilingue | Le storefront supporte au moins 2 langues d'interface (FR/EN). | Frontend + QA |
| 5 | Déploiement scripté | `new-client.sh` + `deploy-client.sh` créent une boutique fonctionnelle. | DevOps |
| 6 | Tests E2E passent | Playwright valide le scénario critique en staging. | QA |
| 7 | Backups actives | `backup-client.sh` planifié et restauration testée. | DevOps |
| 8 | Lancement client | Checklist exécutée avec succès sur un client réel. | PO + Ops |
| 5 | Tests E2E passent | Playwright valide le scénario critique en staging. | QA |
| 6 | Backups actives | `backup-client.sh` planifié et restauration testée. | DevOps |
| 7 | Lancement client | Checklist exécutée avec succès sur un client réel. | PO + Ops |

---

## 15. Gouvernance et documentation

- **README.md** : installation locale, lancement des tests, contribution.
- **RUNBOOK.md** : procédures d'incident, rollback, restauration.
- **DECISIONS.md** : ADR pour chaque choix architectural (Medusa vs Vendure, one-DB-per-tenant, etc.).
- **Conventional Commits** : `feat:`, `fix:`, `chore:`, `docs:` — génération automatique du changelog.
- **Branche `main` toujours déployable**.
- **Pull requests obligatoires** même en solo (auto-review à froid le lendemain minimum).

---

## 16. Glossaire

| Terme | Définition |
|---|---|
| **Client** | Instance boutique dédiée à un commerçant. |
| **Slug** | Identifiant technique unique d'un client (`boutique-jean`). |
| **Image** | Artefact Docker contenant le backend ou le storefront. |
| **Store metadata** | Champ JSON de l'entité Medusa `Store` utilisé pour stocker le branding. |
| **Seed** | Script d'initialisation des données d'une nouvelle boutique. |
| **Dry-run migration** | Test d'une migration sur une copie de base sans impacter la production. |
| **Canary** | Déploiement progressif d'une nouvelle image sur un sous-ensemble de clients. |
| **Locale** | Combinaison langue/région utilisée pour le routing et les traductions (ex. `fr-FR`, `en-US`). |
| **Translation** | Module Medusa gérant les contenus traduits (catalogue, pages, emails). |

---

*Ce document remplace et consolide les recherches initiales. Il est destiné à servir de source de vérité technique pour l'équipe produit et l'équipe d'ingénierie.*

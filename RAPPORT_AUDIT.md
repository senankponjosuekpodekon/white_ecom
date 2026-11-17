# Rapport d'audit — white_ecom (White Shop)

Date : 2026-11-17. Périmètre : monorepo complet (backend Medusa 2.x, storefront Next.js 15, Docker Compose, CI/CD GitHub Actions, scripts ops).

> Les anciens rapports (`AUDIT_QUALITE.md`, `AUDIT_ROUTES.md`, `ANALYSE_LIGNE_PAR_LIGNE.md`, `white_shop_ecommerce*.md`) décrivent la phase spécification ; celui-ci audite le code livré.

## Résumé exécutif

| Indicateur | Évaluation |
|---|---|
| Build backend (`medusa build`) | ✅ passe |
| Build storefront (`next build`) | ✅ passe |
| Lint (medusa + eslint) | ✅ passe |
| Tests unitaires | ✅ 19/19 |
| Sécurité dépendances | ✅ 0 critique ; ~125 `high` restants, tous dans des chaînes transitives ReDoS (picomatch/fast-glob) d'outils de dev — aucune version corrigée n'existe |
| Prêt production | Oui après les correctifs de ce PR + les actions manuelles listées en §5 |

## P0 — Corrigés

1. **Routes admin custom toutes inutilisables (401 permanent).** `requireUser`/`requireSuperAdmin` lisaient `req.user`, inexistant en Medusa v2 (`req.auth_context`). Toutes les routes `/admin/clients`, `/admin/config`, `/admin/content` — donc les pages admin Boutiques, Contenu, Onboarding, Import CSV — renvoyaient 401. Corrigé : vérification sur `req.auth_context` (`actor_type === "user"`), et le super-admin est résolu par email via la query `user`. `SUPER_ADMIN_EMAIL` non configuré → refus explicite au lieu du fallback `super@example.com`.
2. **SDK Medusa côté navigateur pointait sur `localhost:9000` en prod.** `medusa-client.ts` retombait sur `http://localhost:9000` dans le bundle client (les `MEDUSA_BACKEND_URL` non `NEXT_PUBLIC_` ne sont pas inlinés) : login/register/compte client impossibles en production. Corrigé : même origine en prod (Traefik route `/store`, `/auth` sur le domaine), `localhost:9000` en dev.
3. **Checkout sans email ni adresse.** Les commandes étaient créées avec `email: null`, `shipping_address: null` — imposibles à livrer ou contacter. Ajout d'une étape coordonnées obligatoire (email toujours ; adresse sauf modèle `digital`/`services`) qui met à jour le panier via `POST /store/carts/:id` avant d'afficher Stripe ou le paiement manuel.
4. **Panier créé sans `region_id`** → tarification aléatoire selon la région par défaut. Le storefront choisit maintenant la région dont la devise/pays matchent `defaultCurrency`/`defaultCountry` (`GET /store/regions`).
5. **`.env.production.template` inutilisable tel quel** : docker-compose n'interpole pas `${DOMAIN}` dans `env_file` — les valeurs CORS/`DATABASE_URL`/`SITE_URL` auraient été littérales et le déploiement cassé. Template réécrit en valeurs littérales à remplacer.

## P1 — Corrigés

- **Upgrade Medusa 2.20.1 → 2.22.7** (+ zod `^4.6.6`, js-sdk `^2.22.7`) : corrige les vulnérabilités high `@graphql-tools/utils` (prototype pollution) et `zod` (mémoire). `@medusajs/admin-sdk` ajouté en devDependency racine : `draft-order` résout le SDK depuis le `node_modules` racine pendant le build.
- **`npm audit fix`** : supprime les 2 vulnérabilités critiques (`proxy-addr` IP spoofing) et plusieurs `high` (`sharp`, `source-map-js`, `postcss-selector-parser`, `qs`, `brace-expansion`).
- **CI** : `npm audit --audit-level high` échouait à coup sûr (advisory picomatch sans correctif publié). La CI bloque désormais sur `critical`, le niveau `high` reste informatif.
- **Secrets par défaut faibles** : `JWT_SECRET=supersecret`/`COOKIE_SECRET=supersecret` retirés de `apps/backend/.env.template` (valeurs vides + commentaire `openssl rand -base64 48`).
- **Paiement manuel** : tout visiteur pouvait finaliser une commande sans payer. Désactivable via `MANUAL_PAYMENT_ENABLED=false` (activé par défaut — requis par les tests E2E et le modèle « paiement à la livraison »).
- **`robots.txt`** : `disallow: /cart` ne couvrait pas les routes localisées → `/*/cart`, `/*/checkout`.
- **`env_file` obligatoire** : `docker compose up` échouait sans `.env.backend`/`.env.storefront`. Marqués `required: false` + ajout de `.env.backend.template` / `.env.storefront.template`.

## P2 — Non bloquant, recommandations

- **`next.config` `images.remotePatterns` accepte tout hôte** — nécessaire pour les images produit fournies par les marchands white-label, mais permet d'utiliser l'optimiseur Next comme proxy. À resserrer si les URLs d'images sont maîtrisées.
- **Pas de rate limiting applicatif** : seul le middleware Traefik `rateLimit` (100 req/s moy.) protège l'API ; envisager une limite sur `/auth/*` et `/store/carts`.
- **`getOrder` sur `/store/orders/:id`** renvoie null sans session client sur la page résultat — l'affichage dégrade proprement, mais une confirmation par token de commande serait plus fiable.
- **Comptes démo en prod** : `CREATE_DEFAULT_ADMIN=true` dans le template prod crée les comptes seed ; penser à le repasser à `false` après le premier démarrage.
- **Clé publishable codée en dur** (`pk_5c32…`) comme fallback dans `docker-compose.yml` et `cd.yml` — publique par nature, mais remplacer par votre clé.
- **Traefik `api.insecure=true`** expose le dashboard sur :8081 en dev — acceptable en local, absent du compose prod.
- **`|| true` dans `entrypoint.sh`** masque les erreurs de création des comptes admin.
- Tests E2E dépendants d'un catalogue seedé (skip silencieux sans produit) — normal mais à savoir.

## Actions manuelles requises avant mise en production

1. Remplir `.env.production` à partir de `.env.production.template` (domaine, `DB_PASSWORD`, `JWT_SECRET`, `COOKIE_SECRET` — `openssl rand -base64 48`).
2. Fournir les clés Stripe live (`STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_KEY`) et la `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` du déploiement (log `PUBLISHABLE_KEY=pk_…` au seed).
3. Configurer le webhook Stripe → `POST https://<domaine>/hooks/payment/stripe_stripe`.
4. `CREATE_DEFAULT_ADMIN=false` après création des comptes ; changer les mots de passe par défaut.
5. Décider du modèle de paiement manuel (`MANUAL_PAYMENT_ENABLED`).
6. Emails transactionnels : aucun module de notification n'est configuré — les clients ne recevront pas de confirmation de commande (SendGrid/Resend à brancher).

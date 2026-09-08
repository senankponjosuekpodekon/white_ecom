# Audit qualité — White Shop (vertical + horizontal)

> Date : 2026-09-08 — Axes : code quality, UI/UX, scalabilité, sécurité, itérativité, accessibilité, tests, observabilité.

Légende : 🔴 critique · 🟠 important · 🟡 à améliorer · 🟢 déjà bon.

---

## Partie 1 — Audit vertical (par couche)

### 1.1 Storefront (Next.js)

| Sujet | Constat | Insuffisance | Optimisation | Impact |
|---|---|---|---|---|
| Prix produits | 🟢 Corrigé : `fields` ajoutés pour récupérer `prices` | — | — | UX (prix visibles) |
| Panier | 🟢 Cookie `cartId` non-Secure en local | — | — | — |
| Checkout | 🟠 Premier rendu lent (~12s à froid) | Cause non identifiée (probable `loadStripe`/composants client) | Lazy-load `CheckoutForm`, exclure Stripe du SSR, warm-up route | UX (perte de conversion) |
| Quantité / Acheter maintenant | 🟢 Ajouté | — | — | UX (parcours d'achat) |
| Images | 🟡 `loading="lazy"` ajouté sur les cartes, pas de `srcset` sur les images S3 | Tailles S3 fixes | Générer des variantes d'image ou utiliser `next/image` avec `srcSet` | Perf (bande passante) |
| SEO | 🟢 Metadata + sitemap dynamique | Les pages cart/checkout/account n'ont pas de `generateMetadata` | Ajouter robots `noindex` sur ces pages | SEO / confidentialité |
| i18n | 🟢 FR/EN via `next-intl` | Clés dispersées, pas de typecheck i18n | Typage des clés (`@formatjs` ou type des messages) | Itérativité |
| Auth client | 🟢 Session cookies | Flow register → create → login lourd | Factoriser dans un hook `useCustomerAuth` | Itérativité |
| API client | 🟠 SDK Medusa importé côté client (gros bundle) | Taille du JS client | Code-splitting, appels `fetch` légers si besoin | Perf |

### 1.2 Backend (Medusa)

| Sujet | Constat | Insuffisance | Optimisation | Impact |
|---|---|---|---|---|
| Routes admin | 🟠 Écriture filesystem directe dans les routes (`content`, `config`, `clients`) | Non conforme à la règle AGENTS (workflows) | Déplacer dans des workflows Medusa | Itérativité, testabilité |
| Sécurité chemins | 🟢 Corrigé : `safeClientPath` + validation `^[a-z0-9-]+$` | — | — | Sécurité |
| Super-admin | 🟢 Restreint via `SUPER_ADMIN_EMAIL` | Pas de rôle natif Medusa v2 | (Option) `metadata.is_super_admin` | Sécurité, flexibilité |
| Régions/TVA | 🟢 Seed régions idempotent | Pas de taux de TVA par région configurés | Créer `tax-rate` par région via workflow | Scalabilité |
| Multi-tenant | 🟡 `CLIENT_NAME` statique (env) | Pas de multi-tenant dynamique par domaine | Résolution par `req.headers.host` ou middleware | Scalabilité |
| Requêtes | 🟠 Pas de rate-limiting custom par route (Traefik global seulement) | — | Rate-limit par route (auth, clients) | Sécurité |

### 1.3 Admin UI

| Sujet | Constat | Insuffisance | Optimisation | Impact |
|---|---|---|---|---|
| Menu | 🟢 Réorganisé (Dashboard, Analytics, Contenu, Produits→sous-menu, Boutiques, Onboarding) | — | — | UX |
| Analytics | 🟢 Filtres période + export CSV + live view | Pas de graphiques riches | Bibliothèque légère de charts (Recharts) | UX |
| Dashboard | 🟢 Vue simplifiée analytics | — | — | UX |
| Boutiques | 🟢 Super-admin only | Pas de masquage du menu côté UI | Hook de permission côté admin | UX, sécurité |

### 1.4 Infra / CI-CD

| Sujet | Constat | Insuffisance | Optimisation | Impact |
|---|---|---|---|---|
| Docker | 🟢 Rebuild OK, `--execute-safe-links` corrigé | Images sans cache multi-stage optimisé | Buildx cache (déjà en CD), réduire couches | Perf build |
| CI | 🟢 Lint/build/tests/audit/E2E | E2E rebuild Docker à chaque run | Cache Docker dans CI | Vitesse CI |
| CD | 🟢 Build GHCR + build-args | Déclenché sur `main` uniquement | Pipeline de déploiement automatique (SSH/Helm) | Itérativité |
| Tunnel | 🟡 `cloudflared` en profil `tunnel` sans token par défaut | — | Documenter la config token | Scalabilité |

---

## Partie 2 — Audit horizontal (transversal)

### 2.1 Qualité de code

- 🟢 Conventions respectées (pas de `;`, double quotes, kebab-case, PascalCase, camelCase).
- 🟢 `formatPrice` centralisé (plus de duplication).
- 🟢 Hook `useAnalyticsData` partagé (dashboard/analytics).
- 🟠 Encore des `any` dans les pages admin (dashboard/analytics/onboarding) → typer (`Order`, `Config`, `Product`).
- 🟠 `requireUser`/`requireSuperAdmin` centralisés ✅ mais les routes écrivent le FS directement → **workflows**.
- 🟡 Tests unitaires : 19/19 ; E2E : 4/4 ; mais pas de tests sur les routes admin custom (content/config/clients).

### 2.2 UI / UX

- 🟢 Parcours produit : quantité + acheter maintenant ✅.
- 🟢 Checkout digital (pas de livraison) ✅.
- 🟡 Accessibilité : pas d'audit axe ; boutons sans `aria-label` sur les icônes.
- 🟡 États vides (ex. analytics sans données) présents mais pas de design pattern unifié (skeleton/empty state).
- 🟠 Première visite checkout lente → risque de perte de panier.

### 2.3 Scalabilité

- 🟠 Multi-tenant statique (`CLIENT_NAME`) : une instance par boutique → OK pour l'agence mais pas pour un SaaS multi-boutiques partagé.
- 🟡 Base de données unique par instance ; pas de partitionnement.
- 🟢 Feeds produits et sitemap indépendants par instance.
- 🟡 Analytics charge `limit=200` commandes — devient lourd à grande échelle → pagination/agrégation serveur.

### 2.4 Sécurité

- 🟢 Path traversal corrigé.
- 🟢 Super-admin restreint sur `/admin/clients`.
- 🟢 Cookies `HttpOnly`, `SameSite=Strict` (prod), pas de secret committé.
- 🟠 Secrets par défaut locaux (`JWT_SECRET`, `COOKIE_SECRET`) → **à changer en prod** (`.env.production.template`).
- 🟡 Pas de rate-limit par route admin ; les flux `/store/feed/*` sont publics avec la clé publiable.
- 🟡 `CORS` large (`localhost:8080` etc.) à resserrer en prod.

### 2.5 Itérativité

- 🟢 Ajout rapide produit, templates, CSV → le catalogue est itérable.
- 🟢 Onboarding + Boutiques → nouvelle instance en quelques minutes.
- 🟡 La logique filesystem dans les routes rend les tests et le refactor plus durs → workflows.
- 🟡 Documentation éparpillée (`AUDIT_ROUTES.md`, `AUDIT_QUALITE.md`, `notes.md`) → centraliser un `docs/`.

### 2.6 Observabilité

- 🟡 Pas de logging structuré côté storefront.
- 🟡 Pas de métriques applicatives (latence, conversion, panier abandonné).
- 🟢 Healthcheck `/health` + vérifications `make verify`.
- 🟡 Analytics admin basés sur les commandes ; pas d'intégration Plausible/Umami (roadmap).

---

## Partie 3 — Explication des options discutées

### 3.1 Super-admin : email vs metadata

**Option email (choisie)**
- Principe : on compare `req.user.email` à `SUPER_ADMIN_EMAIL`.
- ✅ Immédiat, pas de migration, aligné avec l'env.
- ❌ Fragile si l'email change ; pas de gestion visuelle du rôle.

**Option metadata (alternative)**
- Principe : champ `metadata.is_super_admin` sur l'utilisateur Medusa.
- ✅ Flexible (plusieurs super-admins), gérable via une UI admin.
- ❌ Nécessite une migration, un séeder et une UI de gestion des rôles.
- **Recommandation** : commencer par l'email, évoluer vers `metadata` quand la gestion des admins devient multi-utilisateurs.

### 3.2 Todos et leur intérêt

1. **Rebuild Docker** — applique toutes les modifs (menu, quantité, analytics, sécurité).
2. **Merge dev → main** — déclenche le CD GHCR ; prépare la prod.
3. **Supprimer search.md / search copy.md** — fichiers hors projet, évitent la confusion.
4. **Workflows Medusa pour le FS** — règle AGENTS ; rend le code testable et conforme.
5. **Diagnostic checkout lent** — UX critique (conversion).
6. **E2E paiement manuel + multi-devises** — couverture des parcours monétaires.

---

## Synthèse

- **Priorité haute** : sécuriser la prod (`JWT_SECRET`/`COOKIE_SECRET`), diagnostic checkout, workflows FS.
- **Priorité moyenne** : typage admin, multi-tenant dynamique, rate-limit par route, accessibilité.
- **Priorité basse** : charts riches, observabilité Plausible/Umami, refactor docs.

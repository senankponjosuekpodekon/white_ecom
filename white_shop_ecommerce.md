# Cahier des charges — Boutique en marque blanche (Medusa + Next.js)

Ce document complète le **blueprint technique** déjà livré (architecture, structure
de repo, docker-compose, script de déploiement). Il couvre tout ce que le blueprint
ne couvre pas : vision produit, exigences détaillées, conventions d'équipe, stratégie
de test, stratégie data, sécurité. Pense-le comme le document que tu donnerais à
quelqu'un qui rejoint le projet, quel que soit son rôle.

**Qui lit quoi en priorité :**

| Rôle | Sections prioritaires |
|---|---|
| Product Owner | 1, 2, 3, 4, 6, 11 |
| Développeur (tous niveaux) | 2, 5, 7, 10, 12 |
| Lead technique | Tout, en particulier 2, 7.5, 10, 11 |
| Testeur / QA | 2, 5, 8, 11 |
| Data Analyst | 2, 9 |

---

## 1. Vision produit et contexte (Product Owner)

### Le problème résolu
Les PME et indépendants qui veulent vendre en ligne (e-commerce classique ou
dropshipping) font face à un choix binaire insatisfaisant : Shopify (rapide mais
cher à l'échelle, dépendant, frais sur chaque vente) ou WordPress/WooCommerce
(gratuit mais fragile, dépendant de plugins tiers de qualité variable). Le produit
livre une troisième voie : une boutique déployée en quelques heures, sur une base de
code que Stiamond possède et fait évoluer, sans les frais de transaction ni la
dépendance à un éditeur tiers.

### Les deux niveaux d'utilisateurs
- **Le client Stiamond** (propriétaire de la boutique) : PME ou indépendant en
  ecommerce/dropshipping, généralement non-technique, veut vendre vite sans gérer
  d'infrastructure.
- **L'acheteur final** : le client du client. Ne sait jamais qu'il achète sur une
  plateforme "maison" — l'expérience doit être aussi fluide qu'un Shopify standard.

### Proposition de valeur face à Shopify / WooCommerce
Déjà détaillée dans l'échange précédent (tableau comparatif) — à retenir pour le
discours commercial : 0% de commission sur les ventes, code source possédé, mais
mise en route plus longue que Shopify et écosystème d'apps plus restreint. Le
produit ne cherche pas à battre Shopify sur la richesse fonctionnelle — il cherche
à gagner sur le coût total de possession à moyen terme et l'indépendance.

### Objectifs de succès (côté agence)
- Temps de déploiement d'un nouveau client : cible < 1 journée une fois le MVP stable
- Coût d'infrastructure marginal par client additionnel : quelques euros/mois
- Taux de mise à jour sans incident : une MAJ de l'image ne doit casser aucun client existant

### Périmètre du MVP — explicite

**Inclus (Phase 1)**
- Catalogue produit, panier, checkout Stripe
- Une région/devise par client
- Branding basique (logo, couleur primaire) piloté depuis l'admin Medusa
- Déploiement manuel scripté (un client à la fois)

**Exclu du MVP (renvoyé en Phase 2+, voir blueprint technique section 11)**
- Bouton WhatsApp, facturation PDF automatisée, feed Merchant Center automatique,
  page builder par blocs, onboarding self-service, multi-région

⚠️ **Astuce PO** : résiste à la tentation d'ajouter une fonctionnalité "juste un
peu" avant le premier client payant. Le risque numéro un de ce type de projet solo
n'est pas technique, c'est le scope creep qui repousse indéfiniment la première
vente.

### Risques produit majeurs
| Risque | Impact | Mitigation |
|---|---|---|
| Premier client déçu par un délai plus long que Shopify | Perte de confiance | Annoncer un délai réaliste dès le devis, pas "1 heure" |
| Un client demande une fonctionnalité hors scope MVP | Dérive du planning | Grille de réponse type "Phase 2" préparée à l'avance |
| Bug sur l'image partagée après une MAJ | Impact simultané sur tous les clients | Voir section 8 (staging obligatoire avant toute MAJ) |

---

## 2. Architecture en un coup d'œil (tous rôles)

C'est un vrai découplage :

- **Frontend** : Next.js — ce que le client final voit : pages produit, panier,
  tunnel de paiement, mise en page/branding par boutique.
- **Backend** : Medusa (ou Vendure) — un serveur API qui gère catalogue, panier,
  commandes, paiements (via son module Stripe), comptes clients, et fournit même sa
  propre interface d'admin. Aucun PHP, aucun plugin tiers à gérer.

### Comment la duplication se déroule concrètement

Le point clé : un seul code, jamais de fork par client — seule la configuration
change.

1. Le repo template contient `/frontend` (Next.js), `/backend` (Medusa), un
   `docker-compose.yml`, et un `.env.example` qui liste tout ce qui varie par
   client : domaine, clés Stripe, logo, couleurs, devise, éventuellement clé API du
   fournisseur dropshipping.
2. Tu builds cette base une seule fois en image Docker, versionnée (v1.0, v1.1...).
3. Nouveau client = un `.env` rempli (domaine + branding + clés de paiement) + une
   base Postgres vierge + un script de seed qui pré-remplit catégories, taxes,
   zones de livraison. Tu lances la même image avec ce `.env`, tu pointes le
   domaine dessus. Terminé — aucune page à reconstruire à la main.
4. Nouvelle fonctionnalité ou correctif : tu rebuild l'image une fois, tu la
   redéploies partout. Rien à fusionner, parce que rien de client-spécifique n'a
   jamais touché au code — tout est resté dans le `.env` et la base de données.

💡 **Pourquoi cette section compte pour chaque rôle** : le Product Owner y voit
pourquoi une demande "juste pour ce client" est un signal d'alerte (ça pousserait à
coder en dur ce qui doit rester en configuration) ; le développeur y trouve la
règle numéro un de contribution (jamais de code conditionnel par client) ; le
testeur y voit pourquoi une régression touche tous les clients en même temps
(section 8) ; le data analyst y voit pourquoi les données ne sont jamais partagées
entre clients (section 9).

Détail technique complet (structure de dossiers exacte, Dockerfile, script de
déploiement, gestion du branding au runtime) : voir le blueprint technique livré
séparément — cette section donne le principe, le blueprint donne l'exécution.

---

## 3. Personas et parcours utilisateurs

### Persona A — Le client Stiamond ("Amina, 34 ans, revend des cosmétiques bio")
Non-technique, gère déjà une activité (magasin physique ou réseaux sociaux), veut
un site en ligne rapidement, ne veut pas apprendre à coder ni gérer un serveur.
Attente : recevoir des accès prêts à l'emploi, un support réactif.

### Persona B — L'acheteur final ("Marc, achète en ligne régulièrement")
Attend une expérience standard : navigation rapide, paiement en 2 clics, email de
confirmation, pas de friction. Ne doit jamais remarquer que la plateforme n'est ni
Shopify ni un WooCommerce classique.

### Parcours critique 1 — Achat (Persona B)
Catalogue → fiche produit → ajout panier → checkout → paiement Stripe → confirmation
+ email. Chaque étape doit fonctionner sans JavaScript cassé, sans latence visible,
sur mobile en priorité (la majorité du trafic e-commerce est mobile).

### Parcours critique 2 — Onboarding (Persona A, côté agence)
Voir checklist détaillée dans le blueprint technique, section 10.

---

## 4. User stories prioritaires (MVP)

| # | En tant que... | Je veux... | Afin de... | Critère d'acceptation |
|---|---|---|---|---|
| US1 | Acheteur | parcourir le catalogue par catégorie | trouver rapidement un produit | Filtrage par catégorie fonctionnel, temps de chargement < 2s |
| US2 | Acheteur | voir une fiche produit détaillée | décider d'acheter | Images, prix, description, disponibilité visibles |
| US3 | Acheteur | ajouter au panier et modifier les quantités | préparer ma commande | Panier persistant pendant la session |
| US4 | Acheteur | payer par carte bancaire | finaliser mon achat | Paiement Stripe réussi, email de confirmation envoyé sous 1 min |
| US5 | Client Stiamond | modifier le logo et la couleur de ma boutique | avoir un site à mon image | Modification visible sans intervention développeur (admin Medusa) |
| US6 | Client Stiamond | consulter mes commandes reçues | gérer mon activité | Liste des commandes accessible depuis l'admin Medusa |
| US7 | Stiamond (agence) | déployer une nouvelle boutique avec un script | livrer un client rapidement | Script exécuté de bout en bout sans intervention manuelle sur le code |

💡 **Astuce PO** : garde cette table à jour comme unique source de vérité du
périmètre MVP. Si une demande client ne correspond à aucune ligne, c'est du hors
scope par défaut — pas une raison de dire non, mais une raison de la qualifier
explicitement en Phase 2/3 avant de l'accepter.

---

## 5. Exigences fonctionnelles détaillées (Développeurs, QA)

### Catalogue
- Liste paginée, filtrage par catégorie
- Fiche produit : galerie d'images, variantes (taille/couleur si applicable), stock
- Recherche texte simple (pas de recherche à facettes en Phase 1)

### Panier
- Ajout/suppression/modification de quantité
- Persistant côté serveur (cart Medusa), pas seulement en local storage
- Calcul du total incluant taxes selon la région du client

### Checkout / Paiement
- Formulaire adresse de livraison
- Paiement Stripe (carte bancaire uniquement en Phase 1 ; Sofort/Giropay/Bancontact
  en Phase 2 si expansion Europe — voir recherches précédentes)
- Email de confirmation automatique
- Gestion des échecs de paiement : message clair, panier conservé pour réessai

### Admin (côté boutique cliente)
- Interface Medusa standard (pas de sur-mesure en Phase 1)
- Gestion produits, commandes, branding (metadata Store)

⚠️ **Attention développeurs** : ne jamais construire de logique de paiement
personnalisée (numéro de carte, etc.). Tout passe par le module Stripe officiel de
Medusa. C'est un point non négociable, pas une question de style de code.

---

## 6. Exigences non-fonctionnelles

| Catégorie | Exigence |
|---|---|
| Performance | Temps de chargement page produit < 2s sur connexion 4G |
| SEO | Balises meta dynamiques par produit, sitemap.xml généré automatiquement (Next.js `generateMetadata`) |
| Disponibilité | Pas de SLA formel en Phase 1 (solo dev) — mais sauvegarde quotidienne de chaque base Postgres obligatoire dès le premier client |
| Sécurité | Aucune donnée de carte bancaire stockée ; secrets `.env` jamais commités dans git |
| RGPD | Bannière cookies, mentions légales localisées par pays, droit à l'oubli via suppression de compte |
| Accessibilité | Contraste suffisant, navigation clavier basique (pas d'audit WCAG complet en Phase 1) |

---

## 7. Guide développeurs — tous niveaux

### 7.1 Conventions de code
- TypeScript strict activé sur les deux apps (backend et frontend)
- ESLint + Prettier avec une config partagée à la racine du repo (un seul style pour
  tout le monde, pas de débat par PR)
- Nommage des fichiers : `kebab-case` pour les fichiers, `PascalCase` pour les
  composants React, `camelCase` pour les fonctions/variables

### 7.2 Workflow Git
- Une branche `main` toujours déployable
- Une branche par fonctionnalité (`feat/nom-fonctionnalite`), fusionnée par PR même
  en solo — ça garde un historique propre et prépare l'arrivée d'un collaborateur
- Convention de commit recommandée : `feat:`, `fix:`, `chore:`, `docs:` (Conventional
  Commits) — facilite la génération automatique de changelog plus tard

### 7.3 Pour les développeurs juniors
**Zones sûres pour commencer** : composants UI du storefront (`src/modules/`),
ajustements de style, pages statiques (mentions légales, à propos).
**Zones à ne jamais toucher sans review d'un senior** : tout ce qui touche au module
Stripe, aux migrations de base de données, au script de déploiement, ou à la logique
multi-client (`.env`, isolation des données).
💡 **Astuce** : avant de toucher au backend Medusa, lis la documentation officielle
des concepts Workflows et Subscribers — c'est le point qui déroute le plus les
développeurs venant d'un framework plus classique type Express/NestJS pur.

### 7.4 Pour les développeurs confirmés
Responsabilité naturelle : les modules custom (Phase 2+, ex. générateur de flux
Merchant), les Workflows Medusa, l'intégration de nouveaux moyens de paiement.
⚠️ **Attention** : chaque module custom doit être isolé dans son propre dossier
(`apps/backend/src/modules/nom-du-module`) — jamais mélangé au code natif Medusa,
pour rester compatible avec les futures mises à jour majeures du framework.

### 7.5 Pour le lead technique
- Les décisions d'architecture déjà actées (Medusa vs Vendure, Next.js vs autre,
  branding server-side) sont dans la section 2 et dans le blueprint technique — ne
  pas les rouvrir sans raison forte, elles ont déjà été arbitrées avec les
  compromis correspondants
- Dette technique à surveiller en priorité : la gestion des migrations de base de
  données lors des montées de version Medusa (voir section 8, tests de régression)
- **Definition of Done** pour toute fonctionnalité livrée :
  1. Code revu (même en solo : relecture à froid le lendemain minimum)
  2. Testé manuellement sur un environnement de staging, pas en production directe
  3. Documenté si ça ajoute une variable d'environnement ou une étape de déploiement
  4. Ne casse aucun scénario de la checklist de test (section 8)

---

## 8. Stratégie de test (QA / Testeurs)

### Le point critique de ce modèle
Une seule image Docker sert tous les clients. **Une mise à jour non testée peut
casser N boutiques simultanément**, pas une seule. C'est la différence majeure avec
un projet client classique où un bug reste isolé à un seul site. La stratégie de
test doit être proportionnée à ce risque, pas allégée parce que "c'est un projet
solo".

### Niveaux de test
| Niveau | Portée | Outil recommandé |
|---|---|---|
| Unitaire | Fonctions utilitaires, calculs de prix/taxes | Vitest ou Jest |
| Intégration | Appels API Medusa depuis le storefront | Tests contre une instance Medusa de staging |
| End-to-end | Parcours d'achat complet | Playwright (simule un vrai navigateur) |

### Scénarios critiques à tester à chaque mise à jour de l'image
1. Ajout au panier → checkout → paiement Stripe (mode test) → email reçu
2. Affichage correct du branding (logo/couleur) après le chargement de la page
3. Comportement en cas d'échec de paiement (carte refusée)
4. Migration de base de données : appliquer la migration sur une copie de la base
   d'un client existant avant de la pousser en production

### Environnements
- **Staging obligatoire** avant toute mise à jour de l'image partagée : un
  déploiement de test avec des données factices, jamais directement en prod
- Mode test Stripe activé en staging (clés `sk_test_...`), jamais de vraies
  transactions

⚠️ **Astuce QA** : automatise au minimum le scénario 1 (achat complet) avec
Playwright dès que possible. C'est le seul test qui, s'il casse, arrête
complètement la génération de revenus de tous les clients en même temps — il mérite
d'être vérifié systématiquement, même sans suite de tests complète autour.

---

## 9. Stratégie data & analytics (Data Analyst)

### Deux niveaux de données à distinguer
- **Niveau boutique** : les données d'UN client (ses commandes, ses produits, ses
  clients à lui) — vivent dans SA base Postgres isolée
- **Niveau agence** : les métriques agrégées de Stiamond sur TOUTES les boutiques
  déployées (nombre de boutiques actives, GMV total, churn) — n'existent nulle part
  par défaut, puisque chaque base est isolée par design

C'est un point à anticiper dès maintenant si tu veux un jour un tableau de bord
agence : soit un ETL léger qui interroge périodiquement chaque instance Medusa via
API et centralise dans un entrepôt (même une base Postgres séparée suffit au
début), soit chaque backend envoie des événements de télémétrie basiques
(nombre de commandes, montant) vers un service central.

### Entités principales du schéma Medusa (niveau boutique)
`Product`, `Order`, `Customer`, `Cart`, `Region`, `PaymentCollection`. Toutes
accessibles via l'API REST/Admin de Medusa — pas besoin d'accès direct à
PostgreSQL pour l'analyse courante.

### Ce qui doit être tracké côté storefront (comportement acheteur)
- `view_product`, `add_to_cart`, `begin_checkout`, `purchase` — événements standards
  compatibles GA4, à poser en Phase 2 quand le tracking devient une priorité (pas
  bloquant pour le MVP)

### Conformité RGPD sur le tracking
Consentement cookies avant tout script de tracking tiers (GA4, Pixel Meta) — la
bannière de consentement fait partie du MVP même si le tracking lui-même est
Phase 2, pour éviter d'avoir à la retrofitter plus tard sous pression client.

💡 **Astuce Data** : ne construis pas de pipeline d'agrégation multi-clients avant
d'avoir au moins 5 à 10 boutiques actives. En dessous, un simple export manuel
périodique depuis chaque admin Medusa suffit largement et coûte zéro développement.

---

## 10. Sécurité et conformité (tous rôles techniques)

- **Paiement** : uniquement via le module Stripe officiel, jamais de logique
  personnalisée de traitement de carte (rappel de la section 5)
- **Isolation entre clients** : bases de données et conteneurs strictement séparés
  par client (pas de vrai multi-tenant partagé) — voir blueprint technique
- **Secrets** : `.env` toujours exclus du contrôle de version (`.gitignore`),
  gestion via un coffre-fort de secrets (même basique, type fichier chiffré) dès que
  le nombre de clients dépasse ce qui tient dans ta tête
- **RGPD** : mentions légales et CGV localisées par pays de vente (pas juste
  traduites), droit de rétractation 14 jours pour les clients UE
- **Mises à jour de sécurité** : suivre les advisories de sécurité Medusa/Next.js
  (dépendances npm), un scan automatisé (`npm audit` ou équivalent) dans le
  processus de build est recommandé dès que possible

---

## 11. Definition of Done — MVP

Le MVP est considéré terminé quand, sur une boutique de démonstration :

- [ ] Un acheteur peut parcourir le catalogue, ajouter au panier et payer par carte
- [ ] Un email de confirmation de commande est reçu automatiquement
- [ ] Le branding (logo, couleur) est modifiable depuis l'admin sans toucher au code
- [ ] Le script de déploiement crée une nouvelle boutique fonctionnelle en une seule
      exécution, sans intervention manuelle sur le code applicatif
- [ ] Les scénarios critiques de la section 8 passent tous en staging
- [ ] Les sauvegardes quotidiennes de la base de données sont actives
- [ ] La checklist de lancement client (blueprint technique, section 10) a été
      exécutée avec succès sur au moins un déploiement réel

---

## 12. Glossaire

| Terme | Définition |
|---|---|
| Region (Medusa) | Zone géographique définissant devise, taxes et méthodes de paiement disponibles |
| Sales Channel | Canal de vente (ex. boutique web) auquel des produits sont rattachés |
| Workflow (Medusa) | Suite d'actions orchestrées côté backend (ex. commande passée → facture générée) |
| Subscriber (Medusa) | Code qui écoute un événement système (ex. `order.placed`) et déclenche une action |
| Publishable API Key | Clé Medusa exposable côté client (navigateur), à ne pas confondre avec une clé secrète |
| Output standalone (Next.js) | Mode de build produisant un serveur Node autonome, nécessaire pour un déploiement Docker propre |












# Blueprint MVP — Boutique en marque blanche (Medusa + Next.js)

## 1. Objectif du MVP

Livrer une **première boutique cliente payante** avec le minimum de surface technique :
catalogue produits, panier, checkout Stripe, branding basique (logo + couleurs), et un
script capable de redéployer exactement la même base pour un deuxième client sans
toucher au code.

Tout ce qui n'est pas strictement nécessaire pour encaisser une première vente
(WhatsApp, facturation PDF, feed Merchant automatique, page builder par blocs) est
volontairement repoussé en Phase 2+ (voir section 11). Le but ici n'est pas de tout
construire — c'est de livrer vite et d'apprendre du premier vrai déploiement.

## 2. Stack et versions

| Composant | Choix | Pourquoi |
|---|---|---|
| Backend commerce | Medusa v2 (architecture Modules/Workflows) | MIT, Node/TS, communauté large, module Stripe officiel |
| Frontend | Next.js 14+ (App Router) | Ton stack habituel, SSR natif, bon SEO |
| Base de données | PostgreSQL 16 | Requis par Medusa |
| Cache/queue événements | Redis 7 | Requis par Medusa pour les événements/workflows |
| Paiement | Stripe (module Medusa officiel) | Intégration mature, pas de commission plateforme additionnelle |
| Stockage images | S3-compatible (MinIO auto-hébergé, ou Scaleway/DO Spaces) | Ne jamais stocker les images produit dans le conteneur |
| Orchestration | Docker Compose (VPS unique au départ) | Simple à opérer seul, migrable vers Coolify plus tard |

## 3. Structure du repo

```
whitelabel-store/
├── apps/
│   ├── backend/                      # Medusa
│   │   ├── src/
│   │   │   ├── modules/              # Modules custom (vide au départ)
│   │   │   ├── subscribers/          # Écouteurs d'événements (order.placed, etc.)
│   │   │   ├── workflows/            # Workflows custom Medusa
│   │   │   └── scripts/
│   │   │       └── seed.ts           # Script de seed (voir section 9)
│   │   ├── medusa-config.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   └── storefront/                   # Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── [countryCode]/
│       │   │   │   ├── (main)/
│       │   │   │   │   ├── page.tsx                    # Accueil
│       │   │   │   │   ├── products/[handle]/page.tsx
│       │   │   │   │   ├── categories/[...cat]/page.tsx
│       │   │   │   │   ├── cart/page.tsx
│       │   │   │   │   └── checkout/page.tsx
│       │   │   │   └── layout.tsx
│       │   │   └── layout.tsx        # Injection du branding (voir section 5)
│       │   ├── modules/              # Composants (product-card, header, footer...)
│       │   └── lib/
│       │       ├── medusa-client.ts  # SDK Medusa, appelé server-side uniquement
│       │       └── get-store-config.ts
│       ├── next.config.js            # output: 'standalone'
│       ├── package.json
│       └── Dockerfile
├── configs/
│   └── clients/
│       ├── .env.backend.example
│       └── .env.storefront.example
├── scripts/
│   ├── deploy-store.sh
│   └── new-client.sh                 # Génère les .env à partir d'un template
├── docker-compose.yml
└── README.md
```

## 4. Le backend Medusa

Pour le MVP, active uniquement :
- **Product / Inventory / Pricing** (natifs, rien à configurer de spécial)
- **Cart / Order** (natifs)
- **Payment — module Stripe officiel** (`@medusajs/payment-stripe`)
- **Region / Tax** : une région par client au lancement (pas de multi-région pour le MVP)
- **Store settings** : c'est ICI que vit le branding (nom, logo, couleur primaire) —
  pas dans le code. Utilise le champ `metadata` de l'entité Store pour stocker
  `{ "primary_color": "#...", "logo_url": "...", "font": "..." }`.

Ne touche pas encore aux Workflows/Subscribers custom en Phase 1 — le moteur natif
suffit pour vendre.

## 5. Le frontend Next.js — et le piège du branding au runtime

**Le problème** : Next.js évalue beaucoup de choses au *build*. Une variable
`NEXT_PUBLIC_PRIMARY_COLOR` est figée dans le bundle JS au moment du `next build` —
elle ne changera pas si tu relances la même image avec un `.env` différent. Or tout
le modèle repose sur une seule image redéployée N fois avec juste un `.env` différent.

**La solution retenue pour ce MVP** : le branding ne passe JAMAIS par une variable
`NEXT_PUBLIC_*`. Il est stocké dans Medusa (metadata du Store, section 4) et récupéré
**côté serveur, à chaque requête**, par le layout racine :

```ts
// src/lib/get-store-config.ts
import { medusaClient } from "./medusa-client" // appel server-side, jamais exposé au navigateur

export async function getStoreConfig() {
  const { store } = await medusaClient.store.retrieve()
  return {
    name: store.name,
    primaryColor: store.metadata?.primary_color ?? "#111111",
    logoUrl: store.metadata?.logo_url ?? "",
    font: store.metadata?.font ?? "Inter",
  }
}
```

```tsx
// src/app/[countryCode]/layout.tsx
import { getStoreConfig } from "@/lib/get-store-config"

export default async function Layout({ children }) {
  const config = await getStoreConfig()
  return (
    <html style={{
      // @ts-ignore — custom properties
      "--color-primary": config.primaryColor,
    }}>
      <body>{children}</body>
    </html>
  )
}
```

Les composants utilisent ensuite des classes Tailwind sémantiques (`bg-primary`,
`text-primary`) mappées sur ces variables CSS, jamais des couleurs codées en dur.

**La seule variable qui reste vraiment "par conteneur"** : `MEDUSA_BACKEND_URL`
(l'adresse de l'API du backend de CE client). Elle reste **non préfixée** `NEXT_PUBLIC_`
et n'est lue que côté serveur (Server Components, Route Handlers) — donc lue fraîchement
à chaque requête Node, sans le problème d'inlining au build. Résultat : une seule image
Next.js, un `.env` différent par conteneur (juste l'URL du backend + une clé publique
Medusa), zéro rebuild par client.

## 6. Variables d'environnement

**Backend (`.env.backend`)**
```
DATABASE_URL=postgres://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=
COOKIE_SECRET=
STORE_CORS=https://boutique-client.com
ADMIN_CORS=https://admin-client.com
AUTH_CORS=https://boutique-client.com
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=
S3_ENDPOINT=
```

**Storefront (`.env.storefront`)**
```
MEDUSA_BACKEND_URL=https://api-client.tondomaine.com
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_DEFAULT_REGION=fr
```

## 7. Docker Compose

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  backend:
    build: ./apps/backend
    env_file: ./configs/clients/${CLIENT_NAME}.backend.env
    depends_on: [postgres, redis]
    command: sh -c "medusa db:migrate && medusa start"

  storefront:
    build: ./apps/storefront
    env_file: ./configs/clients/${CLIENT_NAME}.storefront.env
    depends_on: [backend]

volumes:
  pgdata:
```

## 8. Script de déploiement (squelette)

```bash
#!/bin/bash
set -e
CLIENT_NAME=$1   # ex: boutique-jean
DOMAIN=$2        # ex: boutique-jean.com

mkdir -p configs/clients
cp configs/clients/.env.backend.example configs/clients/${CLIENT_NAME}.backend.env
cp configs/clients/.env.storefront.example configs/clients/${CLIENT_NAME}.storefront.env
# → remplir manuellement ou via sed/prompt interactif les valeurs (Stripe, domaine, DB)

CLIENT_NAME=${CLIENT_NAME} docker compose -p ${CLIENT_NAME} up -d --build

docker compose -p ${CLIENT_NAME} exec backend medusa exec ./src/scripts/seed.ts

echo "✅ Boutique ${CLIENT_NAME} déployée — pointer ${DOMAIN} vers ce serveur."
```

À ce stade (premier client), remplir les `.env` à la main est très bien. Ne
construis un générateur automatique de `.env` qu'à partir du 3e-4e déploiement —
avant ça, l'automatisation coûte plus cher que ce qu'elle fait gagner.

## 9. Script de seed — contenu minimal

Le seed doit créer, pour chaque nouveau client :
- La région par défaut (devise + pays) et la zone fiscale associée
- Une catégorie produit racine ("Tous les produits")
- Le sales channel par défaut
- Le provider de paiement Stripe rattaché à la région
- Un compte admin (email/mot de passe fournis en argument du script, pas en dur)

Rien de plus pour le MVP — pas de catalogue produit pré-rempli, pas de copywriting
généré (ça, c'est Phase 2).

## 10. Checklist de lancement d'un nouveau client

1. Récupérer logo (SVG/PNG haute résolution), couleur primaire, nom de la boutique
2. Créer ou connecter le compte Stripe du client → récupérer clé API + webhook secret
3. Réserver le domaine, préparer les enregistrements DNS
4. Copier les `.env.example`, remplir avec les infos ci-dessus
5. Lancer `deploy-store.sh`
6. Passer une commande de test de bout en bout (paiement + email de confirmation)
7. Renseigner le branding dans les Store Settings de l'admin Medusa (logo, couleur —
   c'est stocké là, pas dans le code, voir section 5)
8. Livraison au client + accès admin

## 11. Roadmap — étapes suivantes

**Phase 1 — MVP (ce document)**
Medusa + Next.js + Stripe + branding basique + script de déploiement manuel.
Objectif unique : premier client payant en ligne. Ne rien construire au-delà tant
que ce n'est pas atteint.

**Phase 2 — après le 1er au 3e client validé**
- Route API générique `/store/feeds/google` : génère le flux Merchant Center/Meta
  à la volée à partir du catalogue Medusa du client (un module par client, pas de
  code dupliqué)
- Génération automatique de `.env` client via un petit script interactif
  (`new-client.sh`), plutôt que copier-coller manuel
- Multi-région si un client a besoin de vendre dans plusieurs pays

**Phase 3 — une fois un volume de clients établi**
- Plugin "Commande WhatsApp" activable par variable d'environnement
  (`ENABLE_WHATSAPP_ORDER=true`), pour les clients qui préfèrent ce tunnel à Stripe
- Facturation PDF automatisée, générée à l'événement `order.placed`, avec mentions
  légales localisées par pays
- Page builder piloté par la donnée (JSON en base définissant l'agencement des blocs
  de la page d'accueil) pour varier le design sans toucher au code

**Phase 4 — industrialisation**
- Interface d'onboarding self-service : le client s'inscrit, paie, le déploiement
  se déclenche automatiquement (API vers Coolify/Portainer)
- Dashboard central de supervision multi-clients (santé des conteneurs, sauvegardes,
  facturation groupée)
- Éventuellement : publication de certains plugins génériques (feed Merchant,
  WhatsApp) sur les marketplaces Medusa/Vendure comme canal de revenu additionnel

---

**Note de calibrage temps** : compte 6 à 10 semaines de travail solo pour boucler la
Phase 1 jusqu'à un premier déploiement client fiable, pas 2-3 semaines — la partie
theming runtime (section 5) et la fiabilisation du script de déploiement prennent
plus de temps qu'il n'y paraît sur le papier.





Non, pas WordPress dans ce chemin — je parlais de Medusa ou Vendure (moteurs Node.js dédiés au commerce), pas de WordPress caché derrière une API. C'est un vrai découplage :

- **Frontend** : Next.js — ce que le client final voit : pages produit, panier, tunnel de paiement, mise en page/branding par boutique.
- **Backend** : Medusa (ou Vendure) — un serveur API qui gère catalogue, panier, commandes, paiements (via son module Stripe), comptes clients, et fournit même sa propre interface d'admin. Aucun PHP, aucun plugin tiers à gérer.

Il existe bien une troisième option — "WordPress headless" (Next.js devant, WooCommerce derrière en pure API via WPGraphQL) — mais ça te ramène exactement aux problèmes de licences de plugins et de code PHP tiers qu'on vient d'écarter. Ce n'est pas ce que je te recommande ici.

Laisse-moi te montrer comment la duplication se déroule concrètement dans ce modèle :**Le point clé** : un seul code, jamais de fork par client — seule la configuration change.

1. Le repo template contient `/frontend` (Next.js), `/backend` (Medusa), un `docker-compose.yml`, et un `.env.example` qui liste tout ce qui varie par client : domaine, clés Stripe, logo, couleurs, devise, éventuellement clé API du fournisseur dropshipping.
2. Tu builds cette base une seule fois en image Docker, versionnée (v1.0, v1.1...).
3. Nouveau client = un `.env` rempli (domaine + branding + clés de paiement) + une base Postgres vierge + un script de seed qui pré-remplit catégories, taxes, zones de livraison. Tu lances la même image avec ce `.env`, tu pointes le domaine dessus. Terminé — aucune page à reconstruire à la main.
4. Nouvelle fonctionnalité ou correctif : tu rebuild l'image une fois, tu la redéploies partout. Rien à fusionner, parce que rien de client-spécifique n'a jamais touché au code — tout est resté dans le `.env` et la base de données.

C'est la vraie différence avec WordPress : là où dupliquer un site WP est une opération de récupération après-coup, ici c'est le mode de fonctionnement par défaut dès le premier client.

Tu veux qu'on écrive le script de provisioning concret (le `.env` type + le script de seed), ou plutôt qu'on pose la structure de dossiers du repo ?



Avec de l'assistance IA pour coder, ça change effectivement le calcul — mais je ne partirais quand même pas d'un repo vide. Réinventer checkout, taxes, multi-devise, panier, etc. from scratch, ce sont des centaines d'heures qu'un copilote IA ne compresse pas à zéro, et c'est justement la zone où les bugs coûtent cher (paiement, conformité).

**Le bon compromis : un moteur e-commerce open-source en fondation, ta propre boutique par-dessus**

Tu prends un backend commerce headless, open-source, auto-hébergé — donc du vrai code que tu possèdes et que l'IA peut modifier librement — et tu construis ton propre frontend (storefront + admin rebrandé) dessus. Vu ton stack NestJS sur Trading OS, deux candidats sérieux :

- **Vendure** — littéralement bâti sur NestJS (cite index="30-1">le framework Node que tu utilises déjà, avec TypeScript de bout en bout</cite> : ton expérience NestJS se transfère quasi directement à la lecture et à l'extension du code. API GraphQL, architecture à plugins pensée pour ça.
- **Medusa** — (cite index="29-1">licence MIT intégralement, sans couche commerciale qui vient compliquer la revente,</cite> écosystème JS/TS modulaire, module Stripe officiel prêt à l'emploi, storefront Next.js officiel.

La différence qui compte pour toi précisément : (cite index="23-1">le cœur de Vendure est en GPLv3, avec les fonctionnalités entreprise avancées réservées à une couche commerciale payante, alors que Medusa reste sous licence permissive de bout en bout.</cite> Plus simple juridiquement pour Medusa quand tu vas redéployer le même code chez N clients commerciaux. Je pencherais pour Medusa comme fondation, sauf si tu veux vraiment capitaliser sur ta familiarité NestJS existante — Vendure se défend très bien dans ce cas.

**Structurer le repo pour que la "duplication" ne soit même plus un sujet**

Contrairement à WordPress, où cloner un site est une opération après-coup (données sérialisées, remap d'URL...), ici tu conçois la répétabilité dès le départ, comme sur Trading OS :
- Un repo "template" : backend (Medusa/Vendure) + storefront Next.js + admin, toute la config (branding, devise, passerelle de paiement, fournisseur dropshipping) en variables d'environnement, rien en dur dans le code.
- Un `docker-compose.yml` qui monte tout le stack + Postgres.
- Un script de provisioning (bash ou Node) : clone du repo → nouveau `.env` par client → build → déploiement (VPS, ou un orchestrateur self-hosted type Coolify/Dokploy si tu veux quelque chose façon Vercel).

Un nouveau client = ce script + un logo + une palette de couleurs. Pas de reconstruction de pages à la main, jamais.

**Où l'IA t'aide vraiment, et où rester prudent**

L'IA (Claude Code par exemple) est excellente pour scaffolder les modules custom — connecteur fournisseur dropshipping, pages storefront par client, scripts de provisioning — et pour faire évoluer le code au fil des demandes. Là où je resterais sur des SDK officiels plutôt que du code généré : le paiement (module Stripe intégré à Medusa/Vendure, ne jamais faire écrire de logique de carte bancaire par une IA) et la conformité fiscale/TVA, où une erreur silencieuse a des implications légales directes.

**Le vrai arbitrage**

Ce chemin coûte plus de temps avant le premier client livré que WooCommerce + plugins — tu reconstruis une partie de ce que WooCommerce a mûri depuis 15 ans. En échange : zéro dépendance à des plugins tiers dont tu ne contrôles pas la qualité, une base de code que l'IA peut faire évoluer sans les limites d'un plugin fermé, et un vrai actif que tu pourrais même vendre un jour comme produit à part entière. Avec l'IA en copilote, cet écart se resserre — pari raisonnable pour ton profil, mais le premier déploiement prendra clairement plus longtemps que le troisième.

Tu veux qu'on pose l'architecture précise du repo template — découpage des modules, structure de dossiers ?

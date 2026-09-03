# Audit des routes — White Shop

> Généré pour audit live. Dernière mise à jour : 2026-09-03.

## Types d’utilisateurs

| Type | Rôle | Identifié par |
|------|------|---------------|
| **Public** | Visiteur non connecté | Aucun |
| **Storefront client** | Client boutique ( navigateur ) | Cookie session, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |
| **Merchant / Admin** | Gestionnaire de la boutique | Login Medusa admin (`/app`) |
| **Super-utilisateur** | Configuration système | Accès au serveur, `.env.*`, `content.json` |

---

## 1. Storefront (Next.js)

Base : `http://localhost:3000`

| URL | Nom | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|-----|---------|------|-------------|---------|-------|
| `/` | Redirection locale | GET | Non | Public | Redirige vers `/{defaultLocale}` |  |
| `/fr` / `/en` | Accueil | GET | Non | Public | Page d’accueil configurable | SSR, lit `/store/store-config` |
| `/fr/products` / `/en/products` | Catalogue | GET | Non | Public | Liste des produits Medusa | SSR |
| `/fr/products/[handle]` / `/en/products/[handle]` | Fiche produit | GET | Non | Public | Détail produit + JSON-LD | Ex: `/fr/products/sweatshirt` |
| `/fr/cart` | Panier | GET | Non | Public | Affiche le panier |  |
| `/fr/checkout` | Paiement | GET/POST | Cookie session | Client | Stripe / paiement manuel test |  |
| `/fr/checkout/result` | Résultat paiement | GET | Cookie session | Client | Retour Stripe |  |
| `/fr/shipping` | Livraison | GET | Non | Public | Politique de livraison | Contenu depuis `content.json` |
| `/fr/returns` | Retours | GET | Non | Public | Politique de retours | Contenu depuis `content.json` |
| `/fr/privacy` | Confidentialité | GET | Non | Public | Politique de confidentialité | Contenu depuis `content.json` |
| `/fr/contact` | Contact | GET | Non | Public | Coordonnées + réseaux sociaux | Contenu depuis `content.json` |
| `/fr/legal` | Mentions légales | GET | Non | Public | Texte légal | Contenu depuis `content.json` |
| `/fr/terms` | Conditions de service | GET | Non | Public | CGV / conditions | Contenu depuis `content.json` |
| `/sitemap.xml` | Plan du site | GET | Non | Public | Sitemap statique | `fr` + `en` |
| `/robots.txt` | Robots | GET | Non | Public | `allow: /` | Disallow `/cart`, `/checkout` |
| `/llms.txt` | Guide LLM | GET | Non | Public | Documentation pour crawlers IA |  |

---

## 2. Backend — Routes API Medusa personnalisées

Base : `http://localhost:9000`

### 2.1 Health

| URL | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|---------|------|-------------|---------|-------|
| `/health` | GET | Non | Public | Healthcheck Docker | Retourne `200 { status: "ok" }` |

### 2.2 Store API (requiert `x-publishable-api-key`)

| URL | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|---------|------|-------------|---------|-------|
| `/store/store-config` | GET | `x-publishable-api-key` | Public/Client | Configuration + contenu du client | Utilisé par toutes les pages SSR |
| `/store/feed/google` | GET | `x-publishable-api-key` | Public | Flux Google Merchant CSV |  |
| `/store/feed/facebook` | GET | `x-publishable-api-key` | Public | Flux Facebook CSV |  |
| `/store/feed/pinterest` | GET | `x-publishable-api-key` | Public | Flux Pinterest CSV |  |
| `/store/feed/tiktok` | GET | `x-publishable-api-key` | Public | Flux TikTok CSV |  |
| `/store/custom` | GET | `x-publishable-api-key` | Public | Route test store | Retourne `200` |

### 2.3 Admin API (requiert session admin Medusa)

| URL | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|---------|------|-------------|---------|-------|
| `/admin/content` | GET | Admin | Merchant/Admin | Lire `content.json` du client | Protégé par admin Medusa |
| `/admin/content` | POST | Admin | Merchant/Admin | Écrire `content.json` du client | Écriture directe fichier — à sécuriser |
| `/admin/custom` | GET | Admin | Merchant/Admin | Route test admin | Retourne `200` |

### 2.4 Routes Medusa natives (non personnalisées)

Disponibles automatiquement via Medusa v2 :

| Préfixe | Exemples | Auth | Utilisateur |
|---------|----------|------|-------------|
| `/store/*` | `/store/products`, `/store/carts`, `/store/customers`, `/store/orders` | `x-publishable-api-key` | Public / Client |
| `/admin/*` | `/admin/products`, `/admin/orders`, `/admin/customers` | Session admin | Admin |
| `/auth/*` | `/auth/user/emailpass` | — | Auth flows Medusa |

---

## 3. Admin UI (Medusa Admin)

Base : `http://localhost:9000/app`

| URL | Méthode | Auth | Utilisateur | Utilité |
|-----|---------|------|-------------|---------|
| `/app` | GET | Admin | Admin | Dashboard Medusa |
| `/app/content` | GET | Admin | Admin | Éditeur `content.json` (widget custom) |

---

## 4. Fichiers statiques / public

| Chemin | Utilité | Accès |
|--------|---------|-------|
| `apps/storefront/public/llms.txt` | Documentation LLM | `/llms.txt` |
| `apps/storefront/public/robots.txt` | Robots (généré) | `/robots.txt` |
| `apps/storefront/public/favicon.ico` | Favicon | `/favicon.ico` |
| `apps/backend/clients/default/content.json` | Contenu client par défaut | Backend + admin |
| `apps/backend/clients/default/config.json` | *N’existe pas encore* | — |

---

## 5. Findings / points de contrôle pour l’audit

| # | Finding | Sévérité | Recommandation |
|---|---------|----------|----------------|
| 1 | `/admin/content` (POST) écrit directement sur le filesystem sans vérification de rôles au-delà de l’auth admin | Moyenne | Ajouter un check `admin` explicite et valider le payload (schema) |
| 2 | Les flux `/store/feed/*` exposent toutes les données produits publiquement avec seulement la clé publiable | Faible | Surveiller la rotation de `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |
| 3 | `/store/store-config` expose `content` complet (politiques, contact, email) | Faible | Vérifier qu’aucune donnée sensible n’est incluse |
| 4 | Aucune route client authentifiée (compte, historique) implémentée dans le storefront | Info | À prévoir pour une vraie production |
| 5 | `COOKIE_SECURE=false` en local | Info | Passer à `true` en production + HTTPS |

---

## 6. Commandes de test rapides

```bash
# Public
make verify

# Store API (remplacer par ta clé)
curl -H "x-publishable-api-key: $NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" http://localhost:9000/store/store-config

# Admin (nécessite un cookie session)
curl -u admin@example.com:password http://localhost:9000/admin/content
```

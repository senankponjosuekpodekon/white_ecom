# Audit des routes — White Shop

> Généré pour audit live. Dernière mise à jour : 2026-09-09.

## Types d’utilisateurs

| Type | Rôle | Identifié par |
|------|------|---------------|
| **Public** | Visiteur non connecté | Aucun |
| **Storefront client** | Client boutique ( navigateur ) | Cookie session, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |
| **Merchant / Admin** | Gestionnaire de la boutique | Login Medusa admin (`/app`) |
| **Super-utilisateur** | Configuration système | Accès au serveur, `.env.*`, `config.json`, `content.json` |

## Environnements

| Environnement | Storefront | Backend | Admin |
|---------------|------------|---------|-------|
| Local | `http://localhost:3000` | `http://localhost:9000` | `http://localhost:9000/app` |
| Production | `https://white-ecom-storefront-six.vercel.app` | `https://white-ecom-backend.onrender.com` | `https://white-ecom-backend.onrender.com/app` |

---

## 1. Storefront (Next.js)

Base local : `http://localhost:3000` — Production : `https://white-ecom-storefront-six.vercel.app`

| URL | Nom | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|-----|---------|------|-------------|---------|-------|
| `/` | Redirection locale | GET | Non | Public | Redirige vers `/{defaultLocale}` |  |
| `/fr` / `/en` | Accueil | GET | Non | Public | Page d’accueil configurable | SSR, lit `/store/store-config` |
| `/fr/products` / `/en/products` | Catalogue | GET | Non | Public | Liste des produits Medusa | SSR |
| `/fr/products/[handle]` / `/en/products/[handle]` | Fiche produit | GET | Non | Public | Détail produit + JSON-LD | Ex: `/fr/products/sweatshirt` |
| `/fr/cart` | Panier | GET | Non | Public | Affiche le panier |  |
| `/fr/checkout` | Paiement | GET/POST | Cookie session | Client | Stripe / paiement manuel test |  |
| `/fr/checkout/result` | Résultat paiement | GET | Cookie session | Client | Retour Stripe |  |
| `/fr/register` | Inscription client | GET | Non | Public | Création compte client | Cookie session Medusa |
| `/fr/login` | Connexion client | GET | Non | Public | Login client | Cookie session Medusa |
| `/fr/account` | Compte client | GET | Cookie session | Client | Profil client |  |
| `/fr/shipping` | Livraison | GET | Non | Public | Politique de livraison | Contenu depuis `content.json` |
| `/fr/returns` | Retours | GET | Non | Public | Politique de retours | Contenu depuis `content.json` |
| `/fr/privacy` | Confidentialité | GET | Non | Public | Politique de confidentialité | Contenu depuis `content.json` |
| `/fr/contact` | Contact | GET | Non | Public | Coordonnées + réseaux sociaux | Contenu depuis `content.json` |
| `/fr/legal` | Mentions légales | GET | Non | Public | Texte légal | Contenu depuis `content.json` |
| `/fr/terms` | Conditions de service | GET | Non | Public | CGV / conditions | Contenu depuis `content.json` |
| `/sitemap.xml` | Plan du site | GET | Non | Public | Sitemap dynamique (pages statiques + produits) | `fr` + `en` |
| `/robots.txt` | Robots | GET | Non | Public | `allow: /` | Disallow `/cart`, `/checkout` |
| `/llms.txt` | Guide LLM | GET | Non | Public | Documentation pour crawlers IA |  |

---

## 2. Backend — Routes API Medusa personnalisées

Base local : `http://localhost:9000` — Production : `https://white-ecom-backend.onrender.com`

### 2.1 Health

| URL | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|---------|------|-------------|---------|-------|
| `/health` | GET | Non | Public | Healthcheck Docker | Retourne `200 { status: "ok" }` |

### 2.2 Store API (requiert `x-publishable-api-key`)

| URL | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|---------|------|-------------|---------|-------|
| `/store/store-config` | GET | `x-publishable-api-key` | Public/Client | Configuration + contenu du client (nom, design, devises, pays, modèle économique) | Utilisé par toutes les pages SSR |
| `/store/feed/google` | GET | `x-publishable-api-key` | Public | Flux Google Merchant CSV |  |
| `/store/feed/facebook` | GET | `x-publishable-api-key` | Public | Flux Facebook CSV |  |
| `/store/feed/pinterest` | GET | `x-publishable-api-key` | Public | Flux Pinterest CSV |  |
| `/store/feed/tiktok` | GET | `x-publishable-api-key` | Public | Flux TikTok CSV |  |
| `/store/custom` | GET | `x-publishable-api-key` | Public | Route test store | Retourne `200` |

### 2.3 Admin API (requiert session admin Medusa)

| URL | Méthode | Auth | Utilisateur | Utilité | Notes |
|-----|---------|------|-------------|---------|-------|
| `/admin/content` | GET | Admin | Merchant/Admin | Lire `content.json` du client | Protégé par admin Medusa |
| `/admin/content` | POST | Admin | Merchant/Admin | Écrire `content.json` du client | `req.user` requis + payload validé par Zod |
| `/admin/config` | GET | Admin | Merchant/Admin | Lire `config.json` du client |  |
| `/admin/config` | POST | Admin | Merchant/Admin | Écrire `config.json` du client | `req.user` requis + payload validé par Zod |
| `/admin/clients` | GET | Super-admin | Super-admin | Lister les boutiques white-label | Email = `SUPER_ADMIN_EMAIL` |
| `/admin/clients` | POST | Super-admin | Super-admin | Créer une boutique (dossier + config + contenu) | Email = `SUPER_ADMIN_EMAIL` |
| `/admin/payment-config` | GET | Admin | Admin | Statut Stripe (clé, webhook) |  |
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

Base local : `http://localhost:9000/app` — Production : `https://white-ecom-backend.onrender.com/app`

| URL | Méthode | Auth | Utilisateur | Utilité |
|-----|---------|------|-------------|---------|
| `/app` | GET | Admin | Admin | Dashboard Medusa |
| `/app/content` | GET | Admin | Admin | Éditeur visuel `content.json` (formulaire + aperçu live) |
| `/app/onboarding` | GET | Admin | Super-admin | Onboarding boutique (nom, design, modèle économique, devises, pays) |
| `/app/dashboard` | GET | Admin | Admin | Vue d’ensemble (KPIs + aperçu analytics) |
| `/app/payments` | GET | Admin | Admin | Gestion des providers de paiement par région |
| `/app/product-page` | GET | Admin | Admin | Builder page produit (blocs, layout, templates) |
| `/app/home-page` | GET | Admin | Admin | Builder page d’accueil (sections, templates) |
| `/collections` | GET | Public | Public | Page “Toutes les catégories” (cartes + compteurs) |
| `/app/analytics` | GET | Admin | Admin | Analytics (Overview, Live view, Reports) avec filtres période et export CSV |
| `/app/quick-product` | GET | Admin | Admin | Ajout / édition rapide de produit (une page) |
| `/app/clients` | GET | Admin | Super-admin | Liste et création des boutiques white-label |

---

## 4. Fichiers statiques / public

| Chemin | Utilité | Accès |
|--------|---------|-------|
| `apps/storefront/public/llms.txt` | Documentation LLM | `/llms.txt` |
| `apps/storefront/public/robots.txt` | Robots (généré) | `/robots.txt` |
| `apps/storefront/public/favicon.ico` | Favicon | `/favicon.ico` |
| `apps/backend/clients/default/content.json` | Contenu client par défaut | Backend + admin |
| `apps/backend/clients/default/config.json` | Configuration client (créé via onboarding ou `/admin/config`) | Backend + admin |
| `apps/backend/clients/<client>/` | Dossier d’un client white-label | Backend + admin |

---

## 5. Findings / points de contrôle pour l’audit

| # | Finding | Sévérité | Recommandation |
|---|---------|----------|----------------|
| 1 | ~~`/admin/content` (POST) écrit directement sur le filesystem sans vérification de rôles au-delà de l’auth admin~~ | Moyenne | ✅ Corrigé : `req.user` obligatoire + validation Zod du payload |
| 2 | Les flux `/store/feed/*` exposent toutes les données produits publiquement avec seulement la clé publiable | Faible | Surveiller la rotation de `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` |
| 3 | `/store/store-config` expose `content` complet (politiques, contact, email) | Faible | Vérifier qu’aucune donnée sensible n’est incluse |
| 4 | ~~Aucune route client authentifiée dans le storefront~~ | Info | ✅ Implémenté : `/register`, `/login`, `/account` avec cookies de session |
| 5 | ~~`COOKIE_SAME_SITE=lax` en production~~ | Info | ✅ Corrigé : `COOKIE_SAME_SITE=strict` en production |
| 6 | `/admin/config` et `/admin/clients` écrivent sur le filesystem | Moyenne | Assurer que seuls des super-admins y accèdent (contribution possible) |

---

## 6. Commandes de test rapides

```bash
# Public
make verify

# Store API local (remplacer par ta clé)
curl -H "x-publishable-api-key: $NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY" http://localhost:9000/store/store-config

# Store API production
curl -H "x-publishable-api-key: pk_6ea31213a0ac3a83a5fa86488160545cf4a996996528c07af669f537df70b41b" \
  https://white-ecom-backend.onrender.com/store/store-config

# Admin local (nécessite un cookie session)
curl -u admin@example.com:password http://localhost:9000/admin/content
```

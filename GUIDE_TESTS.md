# Guide de test — Stiamond White Shop

Parcours de test manuel couvrant toutes les interfaces : storefront (client final), admin Medusa (super-admin + marchand), onboarding, provisioning multi-clients.

Cocher chaque case. En cas d'échec, noter l'URL, le message d'erreur et la réponse réseau (F12 → Network).

## Préparation

```bash
# Local
docker compose up -d postgres redis
cd apps/backend && npm run dev        # http://localhost:9000 (admin: /app)
cd apps/storefront && npm run dev     # http://localhost:8000

# Prod
Backend :    https://<backend>.onrender.com  (/health doit retourner 200)
Storefront : https://<projet>.vercel.app
Admin :      https://<backend>.onrender.com/app
```

Comptes de test (seed) : voir `.env` — `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `DEMO_CUSTOMER_EMAIL`/`DEMO_CUSTOMER_PASSWORD`.

Carte de test Stripe : `4242 4242 4242 4242`, date future, CVC 123.

---

## 1. Storefront — parcours visiteur

### 1.1 Homepage (`/fr`, `/en`)

- [ ] Page charge sans erreur console
- [ ] Nom/logo de la boutique affichés (config white-label)
- [ ] Sections configurées visibles (hero, produits, catégories)
- [ ] Switcher de langue fr ↔ en fonctionne (contenus traduits)
- [ ] Navigation header : liens configurés (Catalogue + items personnalisés)
- [ ] Bouton WhatsApp flottant visible si activé
- [ ] Footer : liens, devise, langue

### 1.2 Catalogue (`/fr/products`)

- [ ] Liste des produits avec images, prix, titres
- [ ] Recherche : taper un mot-clé → résultats filtrés
- [ ] Filtre catégorie : produits de la catégorie seulement
- [ ] Filtre prix min/max : borne respectée (serveur — `/store/catalog`)
- [ ] Filtre "en stock" : produits épuisés exclus
- [ ] Tri prix croissant/décroissant correct
- [ ] Pagination : page 2+ charge, `count` exact
- [ ] Cœur wishlist sur chaque card : toggle, persisté après reload
- [ ] Clic produit → fiche `/fr/products/<handle>` (ou `/p/[slug]` si page custom)

### 1.3 Fiche produit

- [ ] Images, prix, variantes (taille/couleur) sélectionnables
- [ ] Prix se met à jour selon la variante
- [ ] Bouton "Ajouter au panier" → confirmation, compteur panier +1
- [ ] Variante épuisée : bouton désactivé ou message
- [ ] Section avis : moyenne, liste des avis approuvés
- [ ] Formulaire avis : soumettre → "en attente de modération"
- [ ] SEO : `<title>`, meta description, JSON-LD produit (F12 → inspecter `<head>`)

### 1.4 Wishlist (`/fr/wishlist`)

- [ ] Produits ajoutés via cœur listés
- [ ] Retirer un item fonctionne
- [ ] Vide si rien ajouté → message approprié
- [ ] Persistance après reload (localStorage)

### 1.5 Panier (`/fr/cart`)

- [ ] Items ajoutés présents, quantités modifiables
- [ ] Suppression d'item
- [ ] Sous-total, livraison, total corrects
- [ ] Panier persiste après reload (cookie/localStorage)

### 1.6 Checkout (`/fr/checkout`)

- [ ] Étape 1 : email requis, validation format
- [ ] Étape 2 : adresses livraison + facturation complètes
- [ ] Méthode de livraison sélectionnable, prix ajouté
- [ ] **Code promo** : appliquer un code valide (créé dans admin) → `discount_total` apparaît ; code invalide → erreur ; retirer le code → total restauré
- [ ] Étape 3 : paiement Stripe (carte 4242…) → redirection confirmation
- [ ] Option manuelle invisible si `MANUAL_PAYMENT_ENABLED=false`
- [ ] Page confirmation : numéro de commande affiché
- [ ] Email de confirmation reçu (Resend) — si configuré

### 1.7 Compte client (`/fr/login` → `/fr/account`)

- [ ] Inscription : formulaire complet, email dupliqué → erreur
- [ ] Login → accès au compte
- [ ] Commandes : liste + page détail (items, statut, tracking)
- [ ] **Adresses** : ajouter, éditer, supprimer, définir par défaut
- [ ] Mot de passe oublié → email de reset → nouveau mot de passe fonctionne
- [ ] Logout → session coupée

### 1.8 Pages custom (`/fr/p/[slug]`)

- [ ] Page créée dans admin `/app/pages` → rendue au storefront
- [ ] Sections hero/text/produits/images ordonnées correctement
- [ ] Slug inexistant → 404 propre

### 1.9 Accessibilité & technique

- [ ] Formulaires : labels liés aux inputs (clic sur label → focus input)
- [ ] Navigation clavier : tabulation logique, focus visible
- [ ] Contrastes lisibles (boutons primaires, textes muted)
- [ ] `robots.txt` et `sitemap.xml` servis
- [ ] `/feeds/google.xml` etc. → flux produits valide

---

## 2. Admin Medusa (`/app`)

Login avec `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

### 2.1 Fonctions Medusa natives

- [ ] Dashboard charge, analytics serveur (`/admin/analytics` agrégé)
- [ ] Produits : créer/éditer, images uploadées (S3 si configuré)
- [ ] Commande de test visible, statut modifiable (expédition → email tracking)
- [ ] Promotions : créer un code promo, tester au checkout
- [ ] Traductions : modifier titre produit en EN → visible sur `/en`
- [ ] **Factures** : `/app/invoices` → sélectionner commande → fenêtre imprimable → "Enregistrer en PDF"

### 2.2 Pages admin custom (SaaS)

- [ ] `/app/clients` : liste des clients + demandes `pending`
- [ ] `/app/pages` : éditeur de pages custom (créer section, sauvegarder, vérifier au storefront)
- [ ] `/app/navigation` : éditer items nav → header storefront mis à jour
- [ ] `/app/reviews` : modération — approuver/rejeter/supprimer un avis soumis

### 2.3 Config white-label

- [ ] Modifier couleur primaire/logo/nom → storefront reflète le changement
- [ ] Persistance après rechargement (stocké en DB, pas fichier)

---

## 3. Onboarding marchand (self-service)

### 3.1 Demande (`/fr/sell`)

- [ ] Formulaire : nom boutique, email, slug souhaité
- [ ] Slug invalide (majuscules/espaces) → erreur validation
- [ ] Soumission → confirmation affichée
- [ ] Demande visible dans `/app/clients` avec statut `pending`
- [ ] Rate-limit : >5 soumissions/min → 429

### 3.2 Provisioning (super-admin)

- [ ] `/app/clients` → approuver la demande → provision
- [ ] Client créé avec sales channel + publishable key propres
- [ ] `VERCEL_TOKEN` configuré → projet Vercel créé, env injectées, URL `*-vercel.app` retournée
- [ ] Sans `VERCEL_TOKEN` → client créé, erreur explicite sur la partie Vercel
- [ ] Nouvelle clé publishable testée : `GET /store/products` avec `x-publishable-api-key` → catalogue scopé au sales channel du client (vide si aucun produit assigné)

### 3.3 Isolation multi-clients

- [ ] Clé du client A → uniquement produits du canal A
- [ ] `Host` header du domaine client → `store-config` du bon client
- [ ] Pas de fuite de contenu entre clients

---

## 4. Émission & résilience

- [ ] Backend down → storefront affiche contenu par défaut (pas de crash)
- [ ] Config client absente → fallback `CLIENT_NAME` legacy
- [ ] Session expirée → redirection login propre
- [ ] Erreur 5xx → log structuré JSON côté backend (docker logs / Render logs)
- [ ] Erreur navigateur → POST `/api/client-log` visible dans les logs

---

## 5. Automatisé (vérifications rapides)

```bash
cd apps/backend && npm run lint && npx tsc --noEmit
cd apps/storefront && npm run lint && npx tsc --noEmit && npx next build
npx playwright test e2e/a11y.spec.ts          # 4 pages, zéro violation
STRIPE_E2E_ENABLED=true npx playwright test e2e/stripe.spec.ts
gh run list --limit 5                        # CI/CD verts
```

## Rapport de bug — format

```
URL : ...
Rôle : visiteur / client connecté / admin
Action : ...
Attendu : ...
Obtenu : ... (erreur console + réponse réseau)
```

# Notes optimisation White Ecom

## Questions initiales

- more suported countries, currency, region, tva
- how seo is managed, short description for products
- interet et particularité des sales channels
- à quoi sert : Contenu client (content.json)
- il ny a pas de analytics?
- Je penses qu'il y a beaucoup de particularité shopify absent
- Nous devons penser à simplifier les processus et les fonctionnalités pour rendre l'application plus intuitive et plus facile à utiliser; par exemple, l'ajout de produits pourrait être plus simple et plus intuitif.
- Facilité de faire les éditions
- Comment google merchant fonctionne dans ces circonstances?
- pas un dashboard complet ?

## Plan d'optimisation

### 1. Simplification du catalogue (quick win)

- Widget admin "Ajout rapide de produit" : titre, catégorie, prix, stock, image, description courte, description longue.
- Import/export CSV de produits (titre, handle, prix, stock, image, catégorie).
- Templates de produits : standard, service, digital.
- Champ short_description separe de description pour la fiche produit.
- Editeur SEO par produit : meta title, meta description, OG image, slug.

### 2. Multi-pays, devises, regions, TVA

- Configurer les regions / currencies / tax rates dans Medusa.
- Ajouter un selecteur de devise/pays dans le storefront.
- Faire varier les frais de port et les TVA selon la region du client.
- Stocker la config regionale par client dans content.json (regions, currencies, taxRates).

### 3. SEO & Google Merchant

- Meta-donnees par page et par produit.
- Sitemap dynamique multilingue deja en place, a enrichir.
- JSON-LD ameliore pour Product, Offer, Organization.
- Flux Google Merchant automatique avec envoi programme ou endpoint a recuperer par Google.

### 4. Analytics & dashboard

- Integrer Plausible ou Umami (respectueux du RGPD, simple).
- Ajouter un dashboard simplifie dans l'admin : commandes du jour, CA, panier moyen, produits les plus vendus.
- Conserver les evenements Google Tag deja en place.

### 5. Editeur de contenu (content.json)

- Transformer l'editeur actuel en formulaire visuel (hero, features, footer, reseaux sociaux, couleurs, polices).
- Apercu en temps reel d'un theme.
- Presets de design (minimal, corporate, playful, etc.).

### 6. Sales channels & multi-client

- Decider si chaque client a son propre sales channel ou s'il partage le meme.
- Creer un wizard de creation de client : nom, domaine, langues, devise, design preset.
- Isoler les content.json par client (deja partiellement en place).

### 7. Qualite & livraison

- Nettoyer les fichiers inutiles (search.md, etc.).
- Stabiliser le build Docker (timeout reseau).
- Ajouter des tests E2E sur l'ajout produit et le checkout.
- Mettre a jour AUDIT_ROUTES.md et le README avec les nouvelles fonctionnalites.

## Decisions

- Demarrage : simplifier l'ajout produit (widget admin + templates).
- Ambition cible : parite Shopify simplifiee.
- Ce plan est sauvegarde dans notes.md.



Overview dashboard
Live view
Analytics reports

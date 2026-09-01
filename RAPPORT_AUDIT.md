# Rapport d'audit — White Shop Ecommerce

## 1. Résumé exécutif

Le projet `white_shop_ecommerce` se situe à l'étape **spécification/planification**. L'unique livrable présent dans le workspace est un document de cahier des charges / blueprint (`white_shop_ecommerce.md`) décrivant une solution e-commerce en marque blanche basée sur **Medusa + Next.js + PostgreSQL + Redis + Stripe**, déployée via Docker Compose.

Aucun code source, aucun fichier de configuration technique (package.json, Dockerfile, docker-compose.yml, .env.example, etc.) n'est encore présent. Le projet n'est donc **pas exécutable** et le MVP n'est pas commencé.

| Indicateur | Évaluation |
|---|---|
| Maturité produit | 2 / 5 — vision claire, persona et scénarios définis. |
| Maturité technique | 1 / 5 — choix d'architecture posés, zéro code produit. |
| Prêt au 1er client | Non. La spécification reste à matérialiser en repo exécutable. |
| Risque global | Modéré/élevé : le scope est bien verrouillé, mais le délai de 6-10 semaines estimé dans le doc n'a pas de fondation technique encore. |

---

## 2. Livrables actuellement présents

Le dossier de travail ne contient qu'un seul fichier :

- `white_shop_ecommerce.md` : cahier des charges et blueprint technique (712 lignes).

Aucun autre artefact (`.git/`, `package.json`, `Dockerfile`, `docker-compose.yml`, `README.md`, dossiers `apps/`, etc.) n'a été trouvé.

---

## 3. Audit par domaine

### 3.1 Architecture et stack

| Élément | Statut | Commentaire |
|---|---|---|
| Choix du backend (Medusa v2) | Bien | MIT, module Stripe officiel, communauté active. Aligné sur la contrainte "pas de frais de transaction cachés". |
| Choix du frontend (Next.js 14+ App Router) | Bien | SSR/SEO natifs, cohérent avec la cible PME. |
| Base de données (PostgreSQL 16) | Standard | Requis par Medusa. |
| Cache/queue (Redis 7) | Standard | Requis par Medusa. |
| Paiement (Stripe via module Medusa) | Bien | Conforme PCI-DSS, pas de logique custom de carte. |
| Stockage d'images (S3-compatible) | Bien | Évite le stockage local éphémère. |
| Multi-client par image Docker | Bien pensé | Le principe du branding en runtime via `metadata` du Store est le bon angle pour ne pas rebuild par client. |
| Isolation client | Attention | Chaque client a sa propre base et son propre conteneur, mais le document ne précise pas comment la ségrégation est assurée au niveau réseau et secrets. |

**Point fort** : le modèle "une image, une config par client, jamais de fork" est sain et scalable. Le traitement du branding côté serveur dans Next.js pour éviter l'inlining de `NEXT_PUBLIC_*` est correctement identifié.

### 3.2 Code et structure de repo

| Point | Statut |
|---|---|
| Structure de repo proposée | Coquille vierge, non implémentée. |
| TypeScript strict prévu | Bien, à appliquer dès le scaffold. |
| ESLint/Prettier partagé | Bien, à appliquer. |
| Conventions de nommage | Définies, à vérifier lors des premières revues. |
| Modules custom isolés | Planifiés, aucune implémentation. |

### 3.3 Sécurité et conformité

| Thème | Évaluation | Détail |
|---|---|---|
| Paiement | Correct | Utilisation du module Stripe officiel, pas de stockage de données de carte. |
| Secrets | À vérifier | Aucun `.env.example`, aucun `.gitignore`, aucun coffre de secrets n'existe. |
| RGPD | Partiel | Bannière cookies et mentions légales mentionnées, mais non matérialisées. Droit à l'oubli à implémenter via suppression de compte. |
| Isolation des données clients | À vérifier | Nécessite une vérification formelle : un conteneur par client ne suffit pas, il faut aussi des credentials DB distincts et des règles CORS strictes. |
| Mises à jour de sécurité | Processus manque | Aucune tâche automatisée `npm audit` dans un CI. |

### 3.4 Déploiement et opérations

| Élément | Statut | Remarque |
|---|---|---|
| Docker Compose | Squelette décrit, absent. | La version "3.8" et la commande `medusa db:migrate && medusa start` sont sensibles à l'ordre d'initialisation. Un healthcheck Postgres est nécessaire. |
| Script de déploiement | Squelette décrit, absent. | Le remplissage manuel des `.env` est accepté pour les premiers clients, mais doit être sécurisé. |
| Sauvegardes Postgres | Mentionné, non implémenté. | Point critique : obligation dès le 1er client. |
| Monitoring / alertes | Non traité. | Aucune supervision conteneurs, logs centralisés, alerting. |
| Staging obligatoire | Bien identifié dans le cahier, non construit. | C'est un prérequis avant toute mise à jour de l'image partagée. |

### 3.5 Tests

| Niveau de test | Évaluation |
|---|---|
| Plan de test | Bien défini : unitaire (Vitest/Jest), intégration API, E2E (Playwright). |
| Automatisation | Aucun test n'existe. |
| Scénarios critiques | Listés (achat complet, branding, échec paiement, migration DB). À industrialiser dès le scaffold. |

### 3.6 Gestion de projet / périmètre MVP

| Élément | Évaluation |
|---|---|
| Vision produit | Claire. |
| Périmètre MVP | Bien verrouillé avec liste explicite d'inclusions/exclusions. |
| User stories | Présentes avec critères d'acceptation. |
| Anti-scope-creep | Bien conscientisé dans le texte, à maintenir en phase de construction. |
| Calibrage temps | 6-10 semaines pour la Phase 1, réaliste si l'exécution suit le plan. |

### 3.7 Process Git et collaboration

| Élément | Statut |
|---|---|
| Workflow Git | Bien défini (main déployable, branches `feat/`, PR). |
| Conventional commits | Prévu. |
| Repo Git | Aucun `.git` détecté : le projet n'est pas versionné. |

---

## 4. Risques majeurs (hiérarchisés)

1. **Aucun repo exécutable** : le projet est actuellement un document, pas une application. La première tâche est donc le scaffolding, pas la livraison client.
2. **Délai du premier client** : 6-10 semaines est une fourchette raisonnable mais exige de ne pas ajouter de scope avant le premier déploiement fiable.
3. **Risque de régression multi-client** : une seule image Docker pour N clients. Le test E2E devient critique avant chaque nouvelle image.
4. **Sécurité des secrets** : avec N clients, multiplier les `.env` manuellement devient un vecteur d'erreur (clés Stripe, JWT, CORS). Prévoir un vault ou un chiffrement systématique.
5. **RGPD / conformité fiscale** : TVA, droit de rétractation 14 jours, mentions légales par pays : le document mentionne mais ne les implémente pas.
6. **Migration Medusa** : les montées de version Medusa v2 viendront avec des migrations DB à tester systématiquement sur une copie de production.

---

## 5. Recommandations prioritaires

### Immédiat (semaine 1)
1. **Créer le repo Git** et ajouter `.gitignore` dès le premier fichier.
2. **Scaffolder le monorepo** : `apps/backend` (Medusa v2), `apps/storefront` (Next.js 14), `configs/clients/.env.*.example`, `docker-compose.yml`.
3. **Ajouter la configuration partagée** : TypeScript strict, ESLint, Prettier.
4. **Ajouter `healthcheck` Postgres/Redis** dans `docker-compose.yml` pour garantir l'ordre de démarrage.

### Court terme (semaines 2-3)
5. **Implémenter le `getStoreConfig()` côté serveur** dès le layout racine pour prouver que le branding fonctionne sans `NEXT_PUBLIC_*`.
6. **Créer le script de seed Medusa** : région, devise, taxe, catégorie racine, sales channel, compte admin.
7. **Mettre en place un environnement de staging** (même sur le même VPS, avec un nom de projet Docker différent).
8. **Automatiser un test Playwright minimal** : catalogue -> panier -> checkout Stripe test -> email (même si l'email est simulé).

### Moyen terme (avant le 1er client payant)
9. **Documenter le processus de backup PostgreSQL** (cron + `pg_dump` + stockage externe).
10. **Prévoir un mécanisme de secrets** (chiffrement local minimum, puis migration vers un vault).
11. **Effectuer un test de bout en bout complet** selon la checklist de lancement client du blueprint.

---

## 6. État du MVP par rapport au Definition of Done du document

Le cahier définit 7 conditions de fin de MVP. Aucune n'est remplie actuellement :

| # | Condition | État |
|---|---|---|
| 1 | Parcours achat complet par carte | Non implémenté |
| 2 | Email de confirmation automatique | Non implémenté |
| 3 | Branding modifiable depuis l'admin sans code | Non implémenté |
| 4 | Script de déploiement en une exécution | Squelette seulement |
| 5 | Scénarios critiques de test en staging | Non implémenté |
| 6 | Sauvegardes quotidiennes | Non implémentées |
| 7 | Checklist de lancement client exécutée | Non commencée |

---

## 7. Conclusion

Le projet dispose d'une **base conceptuelle solide** : vision produit claire, MVP bien cadastré, stack pertinente, architecture multi-client réfléchie. Le principal écueil est actuellement le **passage à l'exécutable** : le cahier ne vaut que s'il est traduit en code, tests, scripts et processus opérationnels.

Le prochain jalon n'est pas "avoir un client" mais **"avoir un repo qui build, se lance localement, et exécute un achat de test Stripe"**. Dès que cet objectif est atteint, on pourra estimer un déploiement client réel de manière crédible.

---

*Audit rédigé par l'ingénieur fullstack sur la base du document `white_shop_ecommerce.md` présent dans `/home/josue/Projections/future_stiamond/white_ecom/`.*

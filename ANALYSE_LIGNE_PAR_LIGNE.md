# Analyse ligne par ligne — white_shop_ecommerce.md

*Analyse réalisée par l'ingénieur fullstack. Chaque bloc correspond à une plage de lignes du document original.*

---

## 1. Lignes 1-19 — En-tête et présentation

| Élément | Détail |
|---|---|
| **Contenu** | Cahier des charges pour une boutique en marque blanche Medusa + Next.js. Précise qu'il complète un blueprint technique déjà livré. |
| **Avis** | Bonne intention pédagogique : le doc est pensé pour plusieurs rôles. |
| **Insuffisances** | Pas de version, pas de date, pas d'auteur. Le "blueprint" référencé n'est pas prés dans le repo. On ne sait pas ce qui est le cahier vs le blueprint car les deux sont fusionnés après la ligne 376. |
| **Solutions** | Ajouter un frontmatter YAML : `version`, `date`, `auteur`, `statut` (brouillon/validé). Séparer clairement le cahier (besoins) du blueprint (implémentation) ou unifier sans ambiguïté. |

---

## 2. Lignes 20-76 — Vision produit et périmètre MVP

| Élément | Détail |
|---|---|
| **Contenu** | Problème résolu, deux niveaux d'utilisateurs, proposition de valeur, objectifs, inclusions/exclusions Phase 1, risques produit. |
| **Avis** | Excellent cadre de product management. L'exclusion explicite du WhatsApp / PDF / Merchant Center est exactement ce qu'il faut pour rester focus. |
| **Insuffisances** | Objectifs "cible < 1 journée" et "quelques euros/mois" non justifiés chiffrément. "Mise à jour sans incident" n'est pas mesurable. Le risque 3 est pertinent mais la mitigation renvoie à la section 8 sans lien direct. Le persona Amina et Marc sont utiles mais ne sont pas ancrés dans des interviews ou données. |
| **Solutions** | Mettre des hypothèses de coûts (VPS, Stripe, S3, temps humain) derrière les objectifs. Remplacer "section 8" par une action concrète : "créer un environnement de staging avant chaque MAJ image". Ajouter une section "hypothèses à valider". |

---

## 3. Lignes 77-115 — Architecture en un coup d'œil

| Élément | Détail |
|---|---|
| **Contenu** | Découplage Next.js / Medusa. Principe "une seule base de code, config par client". Déploiement par image Docker versionnée. |
| **Avis** | Architecture saine, véritablement multi-boutique sans fork. |
| **Insuffisances** | Écrit "Medusa (ou Vendure)" (ligne 83) alors que le reste du document s'engage sur Medusa. Cette ambiguïté doit être tranchée. Pas de diagramme d'architecture. La phrase "build cette base une seule fois en image Docker" masque la complexité du build multi-plateformes et du cache. |
| **Solutions** | Supprimer "(ou Vendure)" si le choix Medusa v2 est acté, ou ajouter une ADR expliquant le choix final. Ajouter un diagramme d'architecture (C4 ou Draw.io). Préciser la stratégie de tag d'image (`white-shop:v1.0.0-{sha}`). |

---

## 4. Lignes 119-157 — Personas et user stories

| Élément | Détail |
|---|---|
| **Contenu** | Deux personas, deux parcours critiques, user stories avec critères d'acceptation. |
| **Avis** | Bonne structure. Les US sont liées à la valeur métier. |
| **Insuffisances** | Les critères d'acceptation ne sont pas vraiment testables : "temps de chargement < 2s" dépend du réseau et du device, sans méthode de mesure. US7 ne précise pas ce que le script doit déployer (conteneur, DNS, DB, SSL). "Panier persistant pendant la session" (US3) est vague : session navigateur ? côté serveur ? cookie ? |
| **Solutions** | Rendre chaque critère S.M.A.R.T. (ex. : "Lighthouse mobile Performance > 90 sur 4G simulé"). Pour US7, lister les artefacts créés par le script. Préciser la persistance du panier dans le schéma Medusa. |

---

## 5. Lignes 160-199 — Exigences fonctionnelles et non-fonctionnelles

| Élément | Détail |
|---|---|
| **Contenu** | Catalogue, panier, checkout, admin, exigences non-fonctionnelles (performance, SEO, dispo, sécurité, RGPD, accessibilité). |
| **Avis** | Exigences cohérentes avec un MVP. Le rappel "ne jamais coder de logique de paiement personnalisée" est un point non négociable bien posé. |
| **Insuffisances** | "Recherche texte simple" sans précision (Levenshtein ? full-text Postgres ?). Pas de gestion des erreurs de checkout. "Pas de SLA formel en Phase 1" est acceptable mais "sauvegarde quotidienne" n'est pas opérationnalisée. RGPD : bannière cookies sans outil mentionné. Accessibilité "basique" sans norme cible (WCAG 2.1 A au minimum). |
| **Solutions** | Choisir la technologie de recherche dès maintenant (Postgres `tsvector` ou module Medusa Search). Documenter le parcours d'erreur de paiement. Découper la sauvegarde en tâche concrète (`pg_dump` + stockage externe). Choisir un gestionnaire de consentement et une cible WCAG. |

---

## 6. Lignes 202-247 — Guide développeurs, workflow Git, DoD

| Élément | Détail |
|---|---|
| **Contenu** | Conventions TS/ESLint/Prettier, workflow Git, conseils juniors/confirmés, DoD. |
| **Avis** | Très pro. Le warning sur les zones sensibles (Stripe, migrations, déploiement) est pertinent. |
| **Insuffisances** | La convention de commit est recommandée mais pas automatisée (pas de `commitlint` ni de template). Le DoD prévoit "documenté si .env" sans template de doc. "Testé manuellement sur staging" manque de détail sur qui et comment. Aucun guide d'installation locale. |
| **Solutions** | Ajouter `commitlint` + Husky. Créer un template `docs/env-changes.md`. Documenter le lancement local (`docker compose up`, `medusa db:migrate`, `seed`). Automatiser au moins un lint/typecheck en CI. |

---

## 7. Lignes 250-283 — Stratégie de test

| Élément | Détail |
|---|---|
| **Contenu** | Niveaux de test, scénarios critiques, environnements, insistance sur le staging obligatoire. |
| **Avis** | L'angle "une image = N clients = risque multiplié" est bien cerné. Playwright est le bon choix. |
| **Insuffisances** | Pas de pipeline CI. Les tests d'intégration "contre une instance Medusa de staging" nécessitent un seed de test reproductible. La migration DB sur "copie d'une base client" suppose un processus de clone non documenté. |
| **Solutions** | Créer une GitHub Action (ou équivalent) qui lance lint, build, migrations, tests d'intégration et E2E sur une instance de test. Ajouter une fixture de seed de test. Documenter le processus de "dry-run migration" sur une base anonymisée. |

---

## 8. Lignes 286-319 — Stratégie data

| Élément | Détail |
|---|---|
| **Contenu** | Distinction niveau boutique vs agence, entités Medusa, tracking storefront, conformité RGPD du tracking. |
| **Avis** | Vision data claire, pas de sur-ingénierie. Le conseil de ne pas construire de pipeline avant 5-10 boutiques est sage. |
| **Insuffisances** | Le tracking (GA4) est reporté en Phase 2, mais le consentement cookies est inclus dans le MVP sans que la bannière soit spécifiée. Pas de rétention définie pour les logs/exporter. |
| **Solutions** | Implémenter une bannière de consentement dés le MVP même si aucun tracker n'est activé. Définir une politique de rétention (ex. logs 30 jours, commandes 5 ans). Prévoir un schéma d'export CSV pour les clients. |

---

## 9. Lignes 322-336 — Sécurité et conformité

| Élément | Détail |
|---|---|
| **Contenu** | Paiement via Stripe, isolation clients, secrets en `.env` (hors git), RGPD, suivi des advisories. |
| **Avis** | Bonnes pratiques de base listées. |
| **Insuffisances** | Manquent : HTTPS/TLS, headers de sécurité (HSTS, CSP, X-Frame-Options), gestion des CORS, audit de dépendances automatisé, rotation des secrets, contrôle d'accès admin (2FA), DDoS/WAF. "Coffre-fort de secrets" reste vague. |
| **Solutions** | Ajouter un reverse proxy (Traefik/Caddy) gérant HTTPS automatique via Let's Encrypt. Configurer CSP + HSTS. Intégrer `npm audit` au build. Utiliser Docker secrets ou un vault (Doppler, 1Password) dès le 2e client. Prévoir un runbook d'incident. |

---

## 10. Lignes 339-365 — Definition of Done MVP et Glossaire

| Élément | Détail |
|---|---|
| **Contenu** | Checklist de fin de MVP et glossaire. |
| **Avis** | La DoD est explicite et actionnable. Le glossaire est utile. |
| **Insuffisances** | Les cases sont toutes vides (à cocher) ce qui est normal, mais rien n'indique qui est responsable de chaque case. Glossaire manque de termes opérationnels : `healthcheck`, `reverse proxy`, `publishable key`, `JWT_SECRET`, `COOKIE_SECRET`. |
| **Solutions** | Assigner un owner et une date cible à chaque item de la DoD. Compléter le glossaire avec les termes infra/secrets. |

---

## 11. Lignes 376-401 — Blueprint : objectif et stack

| Élément | Détail |
|---|---|
| **Contenu** | Rappel de l'objectif MVP et tableau de la stack retenue. |
| **Avis** | L'objectif "première boutique cliente payante" est clair. Le tableau est clair. |
| **Insuffisances** | "Medusa v2" est indiqué, mais Medusa v2 était encore en évolution rapide. S3-compatible : MinIO auto-hébergé ajoute une ops supplémentaire. Pas de versionning exact de packages. |
| **Solutions** | Verrouiller les versions (`package.json` exact, lockfile). Évaluer si Medusa v2 stable est disponible au moment du build. Choisir un provider S3 managé (Scaleway/DO) pour le MVP pour réduire la charge ops. |

---

## 12. Lignes 403-446 — Structure du repo

| Élément | Détail |
|---|---|
| **Contenu** | Arborescence proposée : `apps/backend`, `apps/storefront`, `configs/clients`, `scripts/`, `docker-compose.yml`. |
| **Avis** | Structure moderne et compréhensible. |
| **Insuffisances** | `medusa-config.ts` et `next.config.js` doivent réellement supporter `output: 'standalone'`. Aucun `package.json` à la racine, ni gestionnaire de monorepo (npm workspace / pnpm workspace / turborepo). `docker-compose.yml` à la racine implique un seul client par hôte ; pour du multi-client il faudra un compose par client ou un orchestrateur. Aucun `README.md`. Aucun `apps/backend/medusa-config.ts` détaillé. |
| **Solutions** | Choisir pnpm workspaces ou npm workspaces. Créer un `package.json` racine. Prévoir un `docker-compose.client.yml` templaté. Rédiger un `README.md` d'installation. |

---

## 13. Lignes 448-513 — Backend Medusa et frontend Next.js (branding)

| Élément | Détail |
|---|---|
| **Contenu** | Modules à activer, utilisation des `metadata` du Store pour le branding, récupération côté serveur du branding. |
| **Avis** | Le principe du branding en runtime via `metadata` est le point le plus malin du document. L'explication du piège `NEXT_PUBLIC_*` est précieuse. |
| **Insuffisances** | `metadata` est un JSON non typé : aucune validation, risque d'erreurs silencieuses. Le code `html style={...}` avec custom property fonctionne mais n'est pas idiomatique Next.js/Tailwind. `getStoreConfig()` est appelé à chaque requête sans cache. Le layout `[countryCode]` est prévu mais le MVP n'a qu'une région : introduit une complexité inutile en Phase 1. |
| **Solutions** | Valider le store `metadata` avec Zod. Utiliser un fichier CSS ou un `<style>` dédié. Mettre en cache `getStoreConfig()` côté serveur (React `cache()` ou un TTL Redis). Supprimer le `[countryCode]` du MVP ou le garder seulement en URL statique. |

---

## 14. Lignes 515-572 — Variables d'environnement et Docker Compose

| Élément | Détail |
|---|---|
| **Contenu** | Liste des `.env` backend et storefront, exemple de `docker-compose.yml`. |
| **Avis** | Les variables couvrent les besoins. Le Compose est simple. |
| **Insuffisances** | Compose `version: "3.8"` n'est plus nécessaire mais acceptable. Aucun `healthcheck` Postgres/Redis, donc `depends_on` ne garantit pas que les services sont prêts. `command: sh -c "medusa db:migrate && medusa start"` est fragile (si migration échoue, le conteneur redémarre en boucle sans logs explicites). Pas de volumes persistés Redis. Pas de reverse proxy. Pas de `S3_ENDPOINT` / `S3_FORCE_PATH_STYLE` pour MinIO. Pas de `NODE_ENV`. Pas de `DATABASE_SSL`. |
| **Solutions** | Ajouter des `healthcheck` et `condition: service_healthy`. Utiliser un `entrypoint.sh` gérant les migrations et l'arrêt propre. Ajouter un volume Redis. Intégrer Traefik ou Caddy pour le multi-domaine. Remplir un `.env.example` complet avec les flags MinIO. |

---

## 15. Lignes 574-609 — Scripts de déploiement et de seed

| Élément | Détail |
|---|---|
| **Contenu** | Squelette de `deploy-store.sh` et contenu du seed. |
| **Avis** | Le seed est minimal et raisonnable. Le déploiement manuel est accepté au début. |
| **Insuffisances** | `deploy-store.sh` ne valide pas les arguments, n'est pas idempotent, ne gère pas les erreurs partielles, ne configure pas DNS/SSL, ne sauvegarde pas l'état. Le seed `medusa exec ./src/scripts/seed.ts` suppose que le fichier est inclus dans l'image Docker. Le mot de passe admin passé en argument CLI est visible dans l'historique. |
| **Solutions** | Ajouter des vérifications (`[ -z "$CLIENT_NAME" ]`, vérifier que le domaine est fourni). Rendre idempotent (ne pas recréer si DB existe déjà, option `--force`). Utiliser un entrypoint qui exécute le seed seulement sur base vierge. Passer le mot de passe via un fichier temporaire (`--password-file`) ou via une variable d'env. Générer automatiquement un `.env` via un questionnaire `new-client.sh` interactif. |

---

## 16. Lignes 610-652 — Checklist de lancement client et roadmap

| Élément | Détail |
|---|---|
| **Contenu** | Checklist concrète, roadmap en 4 phases. |
| **Avis** | La checklist est opérationnelle. La roadmap est bien séquencée. |
| **Insuffisances** | La checklist ne mentionne pas le test E2E après livraison. Pas de phase de validation intermédiaire entre Phase 1 et 2. La Phase 4 (industrialisation) est ambitieuse sans indicateur de volume. |
| **Solutions** | Ajouter une case "exécuter le test Playwright de parcours d'achat sur l'URL réelle après DNS". Définir des gâchettes de passage d'une phase à l'autre (ex. 3 boutiques live sans incident critique). Donner une fourchette de clients pour déclencher Phase 4. |

---

## 17. Lignes 655-712 — Notes et appendices (restes de conversation)

| Élément | Détail |
|---|---|
| **Contenu** | Notes de calibrage, clarifications sur WordPress vs Medusa, évoque Vendure, questions ouvertes, phrases de conversation. |
| **Avis** | Le calibrage temps (6-10 semaines) est un avertissement utile et réaliste. |
| **Insuffisances** | Cette section est clairement un copier-coller de conversation avec un assistant IA : elle répète des passages déjà écrits, pose des questions ouvertes non résolues ("Tu veux qu'on pose l'architecture précise ?"), et mentionne à nouveau Vendure. Cela nuit à la professionnalisation du document. |
| **Solutions** | Nettoyer toute la fin du document. Intégrer les informations utiles (calibrage temps, comparaison Vendure) dans une section "Annexe — décisions d'architecture" ou les supprimer si redondants. Supprimer les questions adressées à un interlocuteur. |

---

## 18. Synthèse transversale des insuffisances à corriger

### Architecture / implémentation
- Le choix Medusa vs Vendure reste ambigu.
- Aucun schéma d'architecture, aucun diagramme.
- Multi-client théorisé mais pas opérationnalisé (réseau, DNS, SSL, isolation des secrets).

### Sécurité / ops
- Absence de : HTTPS auto, CSP/HSTS, reverse proxy, WAF, secrets vault, backup, monitoring, CI/CD.

### Tests / qualité
- Pas de CI. Pas de tests écrits. Pas de processus de migration testé.

### Documentation
- Mélange cahier des charges / blueprint / conversation IA.
- Pas de version, pas de `README.md`, pas de `.env.example`, pas de guide d'installation.

### Produit
- Critères d'acceptation à rendre S.M.A.R.T.
- DoD sans owners ni dates.

---

## 19. Plan d'action recommandé

1. **Nettoyage immédiat** : trancher Medusa v2, retirer Vendure, supprimer les restes de conversation.
2. **Scaffolding** : créer le monorepo, lockfiles, `.gitignore`, `README.md`.
3. **Docker Compose robuste** : healthchecks, migrations, reverse proxy.
4. **Scripts** : `new-client.sh` interactif, `deploy-store.sh` idempotent, `backup.sh`.
5. **Sécurité** : `.env.example`, HTTPS auto, headers sécurisés, gestion des secrets.
6. **CI/CD** : lint, build, tests, scan de dépendances.
7. **Tests** : un test Playwright du parcours d'achat complet en mode test Stripe.
8. **MVP client pilote** : un seul client, un seul déploiement, un seul paiement de test.

---

*Fin de l'analyse ligne par ligne.*

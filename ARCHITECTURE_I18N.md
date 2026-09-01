# Architecture i18n — White Shop

*Document technique détaillé pour le multilingue (interface + catalogue). Les snippets sont conçus pour Medusa v2 et Next.js 14 avec `next-intl`, et doivent être adaptés aux versions exactes au moment du développement.*

---

## 1. Scope i18n par phase

| Phase | Scope | Implémentation |
|---|---|---|
| **Phase 1** | Interface storefront (labels, boutons, SEO) | `next-intl` + JSON messages |
| **Phase 1.5** | Catalogue (noms, descriptions, catégories) | Module `translation` dans Medusa + API `?locale=xx` |
| **Phase 2** | Emails, pages légales, factures | Templates de notification par locale |
| **Phase 3** | Page builder, contenu CMS | Couche CMS headless ou champs `i18n` structurés |

---

## 2. Configuration store (backend)

Les paramètres i18n du client sont stockés dans `Store.metadata`.

```ts
// apps/backend/src/scripts/seed.ts
await medusaModuleService.createStores([
  {
    name: 'Boutique Jean',
    supported_currencies: ['eur'],
    default_language: 'fr',
    supported_languages: ['fr', 'en'],
    metadata: {
      primary_color: '#1d4ed8',
      logo_url: 'https://cdn.../logo.svg',
      font: 'Inter',
      default_language: 'fr',
      supported_languages: ['fr', 'en'],
    },
  },
])
```

```ts
// apps/backend/src/modules/whitelabel-store/validate-store-config.ts
import { z } from 'zod'

const storeMetadataSchema = z.object({
  primary_color: z.string().default('#111111'),
  logo_url: z.string().url().optional(),
  font: z.string().default('Inter'),
  default_language: z.string().default('fr'),
  supported_languages: z.array(z.string()).default(['fr']),
})

export const validateStoreMetadata = (metadata: unknown) => {
  return storeMetadataSchema.parse(metadata)
}
```

---

## 3. Front-end — Next.js + next-intl

### 3.1 Structure des fichiers

```
apps/storefront/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (store)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── products/[handle]/page.tsx
│   │   │   │   ├── categories/[handle]/page.tsx
│   │   │   │   ├── cart/page.tsx
│   │   │   │   └── checkout/page.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── i18n.ts
│   ├── messages/
│   │   ├── fr.json
│   │   └── en.json
│   └── middleware.ts
├── next.config.js
└── package.json
```

### 3.2 `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'], // remplacer par le domaine S3 en prod
  },
}

module.exports = nextConfig
```

### 3.3 `src/i18n.ts`

```ts
import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

export const locales = ['fr', 'en', 'nl', 'de'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

export const isValidLocale = (locale: string): locale is Locale =>
  locales.includes(locale as Locale)

export default getRequestConfig(async ({ locale }) => {
  if (!isValidLocale(locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

### 3.4 `src/middleware.ts`

```ts
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

### 3.5 Fichiers de messages

```json
// apps/storefront/src/messages/fr.json
{
  "home": {
    "title": "Bienvenue",
    "subtitle": "Découvrez notre catalogue"
  },
  "product": {
    "addToCart": "Ajouter au panier",
    "outOfStock": "Rupture de stock"
  },
  "cart": {
    "title": "Votre panier",
    "empty": "Votre panier est vide"
  },
  "checkout": {
    "pay": "Payer",
    "securePayment": "Paiement sécurisé par Stripe"
  }
}
```

```json
// apps/storefront/src/messages/en.json
{
  "home": {
    "title": "Welcome",
    "subtitle": "Discover our catalogue"
  },
  "product": {
    "addToCart": "Add to cart",
    "outOfStock": "Out of stock"
  },
  "cart": {
    "title": "Your cart",
    "empty": "Your cart is empty"
  },
  "checkout": {
    "pay": "Pay",
    "securePayment": "Secure payment by Stripe"
  }
}
```

### 3.6 Layout racine avec branding + langue

```tsx
// apps/storefront/src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { getStoreConfig } from '@/lib/get-store-config'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as any)) notFound()

  const config = await getStoreConfig()
  const isDefault = config.defaultLanguage === locale
  const isSupported = config.supportedLanguages.includes(locale)

  if (!isSupported) {
    notFound()
  }

  return (
    <html
      lang={locale}
      style={{
        '--color-primary': config.primaryColor,
      }}
    >
      <body className={`font-${config.font}`}>
        {children}
      </body>
    </html>
  )
}
```

### 3.7 `getStoreConfig` avec langue

```ts
// apps/storefront/src/lib/get-store-config.ts
import { cache } from 'react'
import { medusaClient } from './medusa-client'

export const getStoreConfig = cache(async () => {
  const { store } = await medusaClient.store.retrieve()
  const metadata = store.metadata ?? {}

  return {
    name: store.name,
    primaryColor: (metadata.primary_color as string) ?? '#111111',
    logoUrl: (metadata.logo_url as string) ?? '',
    font: (metadata.font as string) ?? 'Inter',
    defaultLanguage: (metadata.default_language as string) ?? 'fr',
    supportedLanguages: (metadata.supported_languages as string[]) ?? ['fr'],
  }
})
```

### 3.8 Utilisation des messages dans un composant

```tsx
// apps/storefront/src/modules/products/product-card.tsx
import { useTranslations } from 'next-intl'

export function ProductCard({ product }: { product: any }) {
  const t = useTranslations('product')

  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <p>{product.price}</p>
      <button className="bg-primary text-white px-4 py-2 rounded">
        {t('addToCart')}
      </button>
    </div>
  )
}
```

---

## 4. SEO multilingue

### 4.1 `metadata` dynamique dans une page produit

```tsx
// apps/storefront/src/app/[locale]/(store)/products/[handle]/page.tsx
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params: { locale, handle },
}: {
  params: { locale: string; handle: string }
}) {
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const product = await getProduct(handle, locale)

  return {
    title: `${product.title} | ${t('siteTitle')}`,
    description: product.description,
    alternates: {
      canonical: `/${locale}/products/${handle}`,
      languages: {
        'fr-FR': `/fr/products/${handle}`,
        'en-US': `/en/products/${handle}`,
      },
    },
  }
}
```

### 4.2 Composant `HrefLang`

```tsx
// apps/storefront/src/components/hreflang.tsx
import { locales } from '@/i18n'

export function HrefLang({ path }: { path: string }) {
  return (
    <>
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={`/${locale}${path}`}
        />
      ))}
    </>
  )
}
```

---

## 5. Backend — module `translation` (Phase 1.5)

### 5.1 Objectif

Stocker les traductions de catalogue (produits, catégories) dans des entités dédiées. Cela évite d'utiliser `metadata` non typé et permet de requêter par `locale`.

### 5.2 Structure du module

```
apps/backend/src/modules/translation/
├── models/
│   ├── product-translation.ts
│   └── category-translation.ts
├── service.ts
├── repository.ts
├── index.ts
└── migrations/
    └── 001-translation-tables.ts
```

### 5.3 Modèles

```ts
// apps/backend/src/modules/translation/models/product-translation.ts
export class ProductTranslation {
  id: string
  product_id: string
  locale: string
  title: string
  description: string | null
  subtitle: string | null
  // metadata
  created_at: Date
  updated_at: Date
}
```

```ts
// apps/backend/src/modules/translation/models/category-translation.ts
export class CategoryTranslation {
  id: string
  category_id: string
  locale: string
  name: string
  description: string | null
}
```

### 5.4 Service

```ts
// apps/backend/src/modules/translation/service.ts
export class TranslationService {
  async translateProduct(productId: string, locale: string) {
    const fallback = await this.getProductTranslation(productId, 'fr')
    const translation = await this.getProductTranslation(productId, locale)

    return {
      title: translation?.title ?? fallback?.title,
      description: translation?.description ?? fallback?.description,
    }
  }

  private async getProductTranslation(productId: string, locale: string) {
    // requête repository
  }
}
```

### 5.5 Intégration API Storefront

```ts
// apps/backend/src/modules/translation/api/store/products/route.ts (squelette)
import { MedusaRequest, MedusaResponse } from '@medusajs/framework'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { locale } = req.query as { locale?: string }

  const products = await listProducts({
    // ...
  })

  if (locale) {
    const translations = await Promise.all(
      products.map((p) => translationService.translateProduct(p.id, locale))
    )
    // fusionner products + translations
  }

  res.json({ products })
}
```

### 5.6 Principe de fallback

1. Si la locale demandée a une traduction, on l'utilise.
2. Sinon, on retourne la langue par défaut du client (`default_language`).
3. Le storefront signale le fallback via un attribut `translated: false` si nécessaire.

---

## 6. Emails par locale

```ts
// apps/backend/src/modules/notification/templates/order-confirmation.ts
const templates: Record<string, (order: any) => string> = {
  fr: (order) => `Bonjour ${order.customer.first_name}, votre commande ${order.display_id} est confirmée.`,
  en: (order) => `Hello ${order.customer.first_name}, your order ${order.display_id} is confirmed.`,
}

export const getOrderConfirmationEmail = (order: any, locale: string) => {
  const template = templates[locale] ?? templates['fr']
  return template(order)
}
```

---

## 7. Tests i18n

| Type | Outil | Exemple |
|---|---|---|
| Interface | Playwright | Vérifier `/en` affiche "Add to cart". |
| Fallback | Playwright | Demander `/nl/products/x` quand le néerlandais n'est pas supporté retourne 404 ou redirige. |
| API | Vitest | `GET /store/products?locale=en` retourne `title` en anglais. |
| SEO | Unit | `HrefLang` génère bien les liens `/fr` et `/en`. |

---

## 8. Checklist de mise en place

1. Ajouter `next-intl` au storefront.
2. Créer `src/i18n.ts`, `src/middleware.ts` et `messages/*.json`.
3. Déplacer les pages dans `app/[locale]/`.
4. Lire `default_language` et `supported_languages` depuis `Store.metadata`.
5. Mettre à jour `getStoreConfig` pour retourner ces champs.
6. Valider le `Store.metadata` avec Zod côté backend.
7. Générer le sitemap et les `hreflang`.
8. (Phase 1.5) Créer le module `translation` Medusa pour le catalogue.
9. (Phase 2) Templatiser les emails par locale.
10. Écrire les tests Playwright pour les locales principales.

---

*Cette architecture est prête à être copiée telle quelle lors du scaffolding du repo.*

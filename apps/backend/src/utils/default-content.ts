import { deepMerge } from "./merge";

export type ProductPageBlock = {
  type: string
  enabled?: boolean
  options?: Record<string, unknown>
}

export type HomePageSection = {
  type: string
  enabled?: boolean
  options?: Record<string, unknown>
}

export type LocalizedContent = {
  homePage?: {
    sections?: HomePageSection[]
  }
  productPage?: {
    layout?: string
    blocks?: ProductPageBlock[]
  }
  site?: {
    description?: string;
    keywords?: string;
    titleTemplate?: string;
  };
  hero?: {
    title?: string;
    subtitle?: string;
    cta?: string;
    image?: string;
  };
  features?: Array<{ title?: string; text?: string }>;
  valueProposition?: {
    title?: string;
    text?: string;
  };
  socialProof?: {
    title?: string;
    stats?: Array<{ label: string; value: string }>;
  };
  cta?: {
    title?: string;
    subtitle?: string;
    button?: string;
  };
  policies?: {
    shipping?: string;
    returns?: string;
    privacy?: string;
    legal?: string;
  };
  contact?: {
    title?: string;
    intro?: string;
    email?: string;
    phone?: string;
    address?: string;
    hours?: string;
    social?: Array<{ name: string; url: string }>;
  };
  legal?: {
    mentions?: string;
    terms?: string;
  };
  footer?: {
    text?: string;
    links?: Array<{ label: string; href: string }>;
  };
  merchant?: {
    brand?: string;
    googleProductCategory?: string;
    shipping?: string;
    identifierExists?: "yes" | "no";
  };
  ads?: {
    gtagId?: string;
    pixelId?: string;
  };
  siteUrl?: string;
};

export type ClientContent = {
  fr?: Partial<LocalizedContent>;
  en?: Partial<LocalizedContent>;
};

const defaultLocalizedContent: LocalizedContent = {
  homePage: {
    sections: [
      {
        type: "hero",
        enabled: true,
        options: {
          slides: [
            {
              title: "Votre boutique, votre identité",
              subtitle:
                "Découvrez une sélection soignée et un storefront entièrement personnalisable par client.",
              cta: "Découvrir le catalogue",
              ctaHref: "/products",
              image: "",
            },
          ],
        },
      },
      {
        type: "marquee",
        enabled: true,
        options: {
          items: [
            { text: "Livraison rapide" },
            { text: "Qualité vérifiée" },
            { text: "Service client" },
            { text: "Paiement sécurisé" },
          ],
        },
      },
      {
        type: "collections",
        enabled: true,
        options: { heading: "Nos univers", items: [] },
      },
      {
        type: "featured_products",
        enabled: true,
        options: { heading: "Nos produits", limit: 8 },
      },
      { type: "features", enabled: true },
      { type: "value_proposition", enabled: true },
      { type: "social_proof", enabled: true },
      { type: "cta", enabled: true },
    ],
  },
  productPage: {
    layout: "split",
    blocks: [
      { type: "breadcrumb", enabled: true },
      { type: "gallery", enabled: true },
      { type: "title", enabled: true },
      { type: "price", enabled: true },
      { type: "tabs", enabled: true },
      {
        type: "buy_buttons",
        enabled: true,
        options: { show_quantity: true, show_buy_now: true },
      },
      { type: "meta", enabled: false, options: { show_sku: true, show_vendor: true } },
      { type: "badges", enabled: false },
      { type: "shipping_info", enabled: false },
      { type: "trust_badge", enabled: false },
      { type: "inventory_status", enabled: false },
      { type: "share", enabled: true },
      { type: "recommendations", enabled: true },
      { type: "sticky_atc", enabled: true },
    ],
  },
  site: {
    description: "Boutique en ligne moderne et fiable. Découvrez notre catalogue.",
    keywords: "boutique, e-commerce, produits",
    titleTemplate: "%s",
  },
  hero: {
    title: "Trouvez ce qu'il vous faut",
    subtitle: "Une sélection soignée, pensée pour vous simplifier le quotidien.",
    cta: "Explorer le catalogue",
    image: "",
  },
  features: [
    { title: "Qualité vérifiée", text: "Nous sélectionnons chaque produit avec soin." },
    { title: "Livraison rapide", text: "Expédition sous 48h pour la plupart des commandes." },
    { title: "Service client", text: "Une équipe disponible pour vous accompagner." },
  ],
  valueProposition: {
    title: "Une expérience d'achat moderne et fiable",
    text: "Notre plateforme est conçue pour vous offrir rapidité, sécurité et simplicité.",
  },
  socialProof: {
    title: "Ils nous font confiance",
    stats: [
      { label: "Produits", value: "50+" },
      { label: "Clients satisfaits", value: "1 000+" },
      { label: "Livraison", value: "48h" },
    ],
  },
  cta: {
    title: "Prêt à commander ?",
    subtitle: "Parcourez notre catalogue et profitez dès maintenant de nos offres.",
    button: "Voir les produits",
  },
  policies: {
    shipping: "Livraison standard sous 3 à 5 jours ouvrés. Livraison express disponible sur certains produits.",
    returns: "Vous disposez de 14 jours pour retourner un produit non utilisé dans son emballage d'origine.",
    privacy: "Nous ne vendons ni ne partageons vos données personnelles. Vos informations sont sécurisées.",
    legal: "Raison sociale, SIRET et informations légales à compléter selon votre entreprise.",
  },
  contact: {
    title: "Contactez-nous",
    intro: "Une question ? Notre équipe est là pour vous aider.",
    email: "contact@example.com",
    phone: "+33 1 23 45 67 89",
    address: "12 rue du Commerce, 75000 Paris, France",
    hours: "Lundi - Vendredi : 9h - 18h",
    social: [
      { name: "Instagram", url: "https://instagram.com" },
      { name: "Facebook", url: "https://facebook.com" },
    ],
  },
  legal: {
    mentions: "Mentions légales à compléter (éditeur, hébergeur, SIRET, etc.).",
    terms: "Conditions de service à compléter (CGV, responsabilités, paiement, livraison, rétractation).",
  },
  footer: {
    text: "Tous droits réservés.",
    links: [
      { label: "Livraison", href: "/shipping" },
      { label: "Retours", href: "/returns" },
      { label: "Confidentialité", href: "/privacy" },
      { label: "Contact", href: "/contact" },
      { label: "Mentions légales", href: "/legal" },
      { label: "CGV", href: "/terms" },
    ],
  },
  merchant: {
    brand: "White Shop",
    googleProductCategory: "",
    shipping: "FR::Standard:9.90",
    identifierExists: "no",
  },
  ads: {
    gtagId: "",
    pixelId: "",
  },
  siteUrl: "http://localhost:8080",
};

const defaultEnglishContent: LocalizedContent = {
  homePage: {
    sections: [
      {
        type: "hero",
        enabled: true,
        options: {
          slides: [
            {
              title: "Your store, your identity",
              subtitle:
                "Discover a curated selection and a fully customizable storefront per client.",
              cta: "Explore catalogue",
              ctaHref: "/products",
              image: "",
            },
          ],
        },
      },
      {
        type: "marquee",
        enabled: true,
        options: {
          items: [
            { text: "Fast delivery" },
            { text: "Verified quality" },
            { text: "Customer service" },
            { text: "Secure payment" },
          ],
        },
      },
      {
        type: "collections",
        enabled: true,
        options: { heading: "Our worlds", items: [] },
      },
      {
        type: "featured_products",
        enabled: true,
        options: { heading: "Our products", limit: 8 },
      },
      { type: "features", enabled: true },
      { type: "value_proposition", enabled: true },
      { type: "social_proof", enabled: true },
      { type: "cta", enabled: true },
    ],
  },
  productPage: {
    layout: "split",
    blocks: [
      { type: "breadcrumb", enabled: true },
      { type: "gallery", enabled: true },
      { type: "title", enabled: true },
      { type: "price", enabled: true },
      { type: "tabs", enabled: true },
      {
        type: "buy_buttons",
        enabled: true,
        options: { show_quantity: true, show_buy_now: true },
      },
      { type: "meta", enabled: false, options: { show_sku: true, show_vendor: true } },
      { type: "badges", enabled: false },
      { type: "shipping_info", enabled: false },
      { type: "trust_badge", enabled: false },
      { type: "inventory_status", enabled: false },
      { type: "share", enabled: true },
      { type: "recommendations", enabled: true },
      { type: "sticky_atc", enabled: true },
    ],
  },
  site: {
    description: "Modern and reliable online store. Discover our catalogue.",
    keywords: "shop, e-commerce, products",
    titleTemplate: "%s",
  },
  hero: {
    title: "Find what you need",
    subtitle: "A curated selection designed to make your day easier.",
    cta: "Explore catalogue",
    image: "",
  },
  features: [
    { title: "Verified quality", text: "We carefully select every product." },
    { title: "Fast delivery", text: "Shipped within 48h for most orders." },
    { title: "Customer service", text: "A team available to support you." },
  ],
  valueProposition: {
    title: "A modern and reliable shopping experience",
    text: "Our platform is built for speed, security, and simplicity.",
  },
  socialProof: {
    title: "They trust us",
    stats: [
      { label: "Products", value: "50+" },
      { label: "Happy customers", value: "1 000+" },
      { label: "Delivery", value: "48h" },
    ],
  },
  cta: {
    title: "Ready to order?",
    subtitle: "Browse our catalogue and take advantage of our offers today.",
    button: "See products",
  },
  policies: {
    shipping: "Standard delivery within 3 to 5 business days. Express delivery available on selected products.",
    returns: "You have 14 days to return an unused product in its original packaging.",
    privacy: "We do not sell or share your personal data. Your information is secure.",
    legal: "Company name, registration number and legal information to be completed according to your business.",
  },
  contact: {
    title: "Contact us",
    intro: "Have a question? Our team is here to help.",
    email: "contact@example.com",
    phone: "+33 1 23 45 67 89",
    address: "12 Commerce Street, 75000 Paris, France",
    hours: "Monday - Friday: 9am - 6pm",
    social: [
      { name: "Instagram", url: "https://instagram.com" },
      { name: "Facebook", url: "https://facebook.com" },
    ],
  },
  legal: {
    mentions: "Legal mentions to be completed (publisher, host, registration number, etc.).",
    terms: "Terms of service to be completed (sales, liability, payment, delivery, withdrawal).",
  },
  footer: {
    text: "All rights reserved.",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy", href: "/privacy" },
      { label: "Contact", href: "/contact" },
      { label: "Legal mentions", href: "/legal" },
      { label: "Terms", href: "/terms" },
    ],
  },
  merchant: {
    brand: "White Shop",
    googleProductCategory: "",
    shipping: "FR::Standard:9.90",
    identifierExists: "no",
  },
  ads: {
    gtagId: "",
    pixelId: "",
  },
  siteUrl: "http://localhost:8080",
};

export const defaultContent: ClientContent = {
  fr: defaultLocalizedContent,
  en: defaultEnglishContent,
};

export function mergeContent(
  base: ClientContent,
  override?: ClientContent
): ClientContent {
  if (!override) return base;
  return {
    fr: deepMerge(
      (base.fr ?? {}) as Record<string, unknown>,
      (override.fr ?? {}) as Record<string, unknown>
    ) as LocalizedContent,
    en: deepMerge(
      (base.en ?? {}) as Record<string, unknown>,
      (override.en ?? {}) as Record<string, unknown>
    ) as LocalizedContent,
  };
}

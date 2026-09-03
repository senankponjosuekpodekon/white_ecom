import { deepMerge } from "./merge";

export type LocalizedContent = {
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
  footer: {
    text: "Tous droits réservés.",
    links: [
      { label: "Livraison", href: "/shipping" },
      { label: "Retours", href: "/returns" },
      { label: "Confidentialité", href: "/privacy" },
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
  footer: {
    text: "All rights reserved.",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy", href: "/privacy" },
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

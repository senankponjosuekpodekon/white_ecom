import { mergeObjects } from "./design/merge";
import { defaultLocale, type Locale } from "@/i18n";

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

export type MinimogBlock = Record<string, unknown>

export type MinimogSection = {
  id: string
  type: string
  enabled?: boolean
  design?: string
  settings?: Record<string, unknown>
  blocks?: Record<string, MinimogBlock>
  block_order?: string[]
}


export type CustomPageSection = {
  type: "hero" | "text" | "image" | "cta" | "products";
  title?: string;
  subtitle?: string;
  text?: string;
  image?: string;
  ctaLabel?: string;
  ctaHref?: string;
  categoryHandle?: string;
  limit?: number;
}

export type CustomPage = {
  title?: string;
  sections?: CustomPageSection[];
}

export type LocalizedContent = {
  minimog?: {
    sections?: MinimogSection[]
    sectionOrder?: string[]
  }
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
  nav?: {
    items?: Array<{ label: string; href: string }>;
  };
  pages?: Record<string, CustomPage>;
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
};

export type ClientContent = {
  [locale: string]: Partial<LocalizedContent> | undefined;
};

export function getLocalizedContent(
  content: ClientContent | undefined,
  locale: Locale,
  fallbackLocale: Locale = defaultLocale
): LocalizedContent {
  const base = (content?.[fallbackLocale] ?? {}) as LocalizedContent;
  const override = (content?.[locale] ?? {}) as LocalizedContent;
  return mergeObjects(base, override);
}



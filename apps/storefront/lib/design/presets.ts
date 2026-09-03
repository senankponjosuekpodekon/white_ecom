import { DesignFullConfig } from "./types";

const baseEffects: DesignFullConfig["effects"] = {
  buttonHover: "scale",
  cardHover: "lift",
  cardShadow: "soft",
  cardAccent: false,
  heroGradient: false,
  iconHover: true,
  modalFade: true,
  formFocus: "ring",
};

const baseAnimations: DesignFullConfig["animations"] = {
  revealOnScroll: false,
  gradient: false,
  lightEffect: false,
  parallax: false,
};

const baseFeed: DesignFullConfig["feed"] = {
  layout: "grid",
  cardsPerRow: 3,
  itemsPerPage: 12,
  showDescription: true,
  showPrices: true,
  hoverEffect: "lift",
};

const baseUX: DesignFullConfig["ux"] = {
  heroEnabled: true,
  valuePropositionEnabled: true,
  featuresEnabled: true,
  socialProofEnabled: true,
  ctaEnabled: true,
  footerEnabled: true,
};

export const presets: Record<string, DesignFullConfig> = {
  modern: {
    preset: "modern",
    colors: {
      primary: "#3B82F6",
      secondary: "#1F2937",
      accent: "#10B981",
      surface: "#F8FAFC",
      background: "#FFFFFF",
      foreground: "#111827",
      muted: "#6B7280",
      border: "#E5E7EB",
    },
    typography: {
      heading: "Inter",
      body: "Inter",
    },
    effects: {
      ...baseEffects,
      buttonHover: "glow",
      cardAccent: true,
      heroGradient: true,
    },
    animations: {
      ...baseAnimations,
      revealOnScroll: true,
      gradient: true,
      lightEffect: true,
    },
    feed: {
      ...baseFeed,
      cardsPerRow: 3,
    },
    seo: {
      titleTemplate: "%s | Modern Store",
      description: "Découvrez notre catalogue moderne et professionnel.",
      robots: "index,follow",
    },
    ux: baseUX,
  },
  corporate: {
    preset: "corporate",
    colors: {
      primary: "#2563EB",
      secondary: "#1E40AF",
      accent: "#0EA5E9",
      surface: "#FFFFFF",
      background: "#F9FAFB",
      foreground: "#111827",
      muted: "#64748B",
      border: "#E2E8F0",
    },
    typography: {
      heading: "Inter",
      body: "Roboto",
    },
    effects: {
      ...baseEffects,
      cardHover: "scale",
      heroGradient: false,
    },
    animations: { ...baseAnimations },
    feed: { ...baseFeed, cardsPerRow: 4, showDescription: false },
    seo: {
      titleTemplate: "%s | Corporate Store",
      description: "Solutions professionnelles pour votre entreprise.",
      robots: "index,follow",
    },
    ux: baseUX,
  },
  minimalist: {
    preset: "minimalist",
    colors: {
      primary: "#111111",
      secondary: "#4B5563",
      accent: "#3B82F6",
      surface: "#FFFFFF",
      background: "#FFFFFF",
      foreground: "#111111",
      muted: "#9CA3AF",
      border: "#F3F4F6",
    },
    typography: {
      heading: "Inter",
      body: "Inter",
    },
    effects: {
      ...baseEffects,
      buttonHover: "scale",
      cardShadow: "none",
      heroGradient: false,
    },
    animations: { ...baseAnimations, revealOnScroll: true },
    feed: { ...baseFeed, cardsPerRow: 3, hoverEffect: "none" },
    seo: {
      titleTemplate: "%s",
      description: "Boutique minimaliste et élégante.",
      robots: "index,follow",
    },
    ux: { ...baseUX, heroEnabled: false },
  },
  luxury: {
    preset: "luxury",
    colors: {
      primary: "#000000",
      secondary: "#C5A880",
      accent: "#C5A880",
      surface: "#FDFBF7",
      background: "#FFFFFF",
      foreground: "#1C1C1C",
      muted: "#8C8C8C",
      border: "#E8E4DD",
    },
    typography: {
      heading: "Playfair Display",
      body: "Inter",
    },
    effects: {
      ...baseEffects,
      cardShadow: "none",
      cardAccent: false,
      heroGradient: false,
    },
    animations: { ...baseAnimations, revealOnScroll: true },
    feed: { ...baseFeed, cardsPerRow: 2, hoverEffect: "scale" },
    seo: {
      titleTemplate: "%s | Luxury Store",
      description: "Une sélection premium pour une expérience exclusive.",
      robots: "index,follow",
    },
    ux: baseUX,
  },
  playful: {
    preset: "playful",
    colors: {
      primary: "#F59E0B",
      secondary: "#10B981",
      accent: "#EF4444",
      surface: "#FFFBEB",
      background: "#FFFFFF",
      foreground: "#1F2937",
      muted: "#6B7280",
      border: "#FDE68A",
    },
    typography: {
      heading: "Poppins",
      body: "Baloo",
    },
    effects: {
      ...baseEffects,
      buttonHover: "scale",
      cardHover: "scale",
      heroGradient: true,
    },
    animations: { ...baseAnimations, revealOnScroll: true, lightEffect: true },
    feed: { ...baseFeed, cardsPerRow: 3, hoverEffect: "scale" },
    seo: {
      titleTemplate: "%s | Fun Store",
      description: "Boutique colorée et ludique.",
      robots: "index,follow",
    },
    ux: baseUX,
  },
};

export const defaultPreset = presets.modern;

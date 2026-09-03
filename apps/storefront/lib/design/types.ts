export type DesignColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
};

export type DesignTypography = {
  heading: string;
  body: string;
};

export type DesignEffects = {
  buttonHover: "glow" | "scale" | "none";
  cardHover: "lift" | "scale" | "none";
  cardShadow: "soft" | "none";
  cardAccent: boolean;
  heroGradient: boolean;
  iconHover: boolean;
  modalFade: boolean;
  formFocus: "ring" | "border" | "none";
};

export type DesignAnimations = {
  revealOnScroll: boolean;
  gradient: boolean;
  lightEffect: boolean;
  parallax: boolean;
};

export type DesignFeed = {
  layout: "grid" | "list" | "hero-first";
  cardsPerRow: 2 | 3 | 4;
  itemsPerPage: number;
  showDescription: boolean;
  showPrices: boolean;
  hoverEffect: "lift" | "scale" | "none";
};

export type DesignSEO = {
  titleTemplate?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  robots?: string;
};

export type DesignUX = {
  heroEnabled: boolean;
  valuePropositionEnabled: boolean;
  featuresEnabled: boolean;
  socialProofEnabled: boolean;
  ctaEnabled: boolean;
  footerEnabled: boolean;
};

export type DesignFullConfig = {
  preset: string;
  colors: DesignColorScheme;
  typography: DesignTypography;
  effects: DesignEffects;
  animations: DesignAnimations;
  feed: DesignFeed;
  seo: DesignSEO;
  ux: DesignUX;
};

export type DesignConfig = {
  preset?: string;
  colors?: Partial<DesignColorScheme>;
  typography?: Partial<DesignTypography>;
  effects?: Partial<DesignEffects>;
  animations?: Partial<DesignAnimations>;
  feed?: Partial<DesignFeed>;
  seo?: Partial<DesignSEO>;
  ux?: Partial<DesignUX>;
};

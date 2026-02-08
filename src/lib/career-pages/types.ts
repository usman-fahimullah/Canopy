/**
 * Career Page Config — Template-based section system.
 * Stored as JSON in Organization.careerPageConfig.
 */

export type CareerPageSection =
  | HeroSection
  | AboutSection
  | ValuesSection
  | ImpactSection
  | BenefitsSection
  | TeamSection
  | OpenRolesSection
  | CTASection
  | TestimonialsSection
  | FAQSection;

export interface HeroSection {
  type: "hero";
  headline: string;
  subheadline: string;
  backgroundImage?: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  style?: SectionStyle;
  visible?: boolean;
  layout?: "centered" | "left-aligned" | "split";
}

export interface AboutSection {
  type: "about";
  title: string;
  content: string;
  image?: string;
  style?: SectionStyle;
  visible?: boolean;
}

export interface ValuesSection {
  type: "values";
  title: string;
  items: Array<{ icon: string; title: string; description: string }>;
  style?: SectionStyle;
  visible?: boolean;
  layout?: "2-col" | "3-col" | "4-col";
}

export interface ImpactSection {
  type: "impact";
  title: string;
  metrics: Array<{ value: string; label: string; icon?: string }>;
  style?: SectionStyle;
  visible?: boolean;
  layout?: "horizontal" | "stacked" | "large-single";
}

export interface BenefitsSection {
  type: "benefits";
  title: string;
  items: Array<{ icon: string; title: string; description: string }>;
  style?: SectionStyle;
  visible?: boolean;
  layout?: "2-col" | "3-col" | "list";
}

export interface TeamSection {
  type: "team";
  title: string;
  members: Array<{ name: string; role: string; photo?: string; bio?: string }>;
  style?: SectionStyle;
  visible?: boolean;
  layout?: "grid" | "list" | "cards";
}

export interface OpenRolesSection {
  type: "openRoles";
  title: string;
  showFilters: boolean;
  style?: SectionStyle;
  visible?: boolean;
}

export interface CTASection {
  type: "cta";
  headline: string;
  buttonText: string;
  style?: SectionStyle;
  visible?: boolean;
}

export interface TestimonialsSection {
  type: "testimonials";
  title: string;
  items: Array<{ quote: string; author: string; role: string; photo?: string }>;
  style?: SectionStyle;
  visible?: boolean;
  layout?: "cards" | "single-featured" | "minimal";
}

export interface FAQSection {
  type: "faq";
  title: string;
  items: Array<{ question: string; answer: string }>;
  style?: SectionStyle;
  visible?: boolean;
}

/* ------------------------------------------------------------------ */
/* Section Style — per-section visual overrides                        */
/* ------------------------------------------------------------------ */

export interface SectionStyle {
  backgroundColor?: string;
  textColor?: string;
  padding?: "compact" | "default" | "spacious";
  textAlign?: "left" | "center";
  maxWidth?: "narrow" | "default" | "wide" | "full";
}

/* ------------------------------------------------------------------ */
/* Theme — brand palette for the career page                           */
/* ------------------------------------------------------------------ */

export interface CareerPageTheme {
  // Core brand palette (synced from Organization model)
  primaryColor: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily: string;
  headingFontFamily?: string;
  logo?: string;

  // Career page specific
  defaultSectionPadding?: "compact" | "default" | "spacious";
}

export interface CareerPageConfig {
  sections: CareerPageSection[];
  theme: CareerPageTheme;
}

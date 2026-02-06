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
  | CTASection;

export interface HeroSection {
  type: "hero";
  headline: string;
  subheadline: string;
  backgroundImage?: string;
}

export interface AboutSection {
  type: "about";
  title: string;
  content: string;
  image?: string;
}

export interface ValuesSection {
  type: "values";
  title: string;
  items: Array<{ icon: string; title: string; description: string }>;
}

export interface ImpactSection {
  type: "impact";
  title: string;
  metrics: Array<{ value: string; label: string }>;
}

export interface BenefitsSection {
  type: "benefits";
  title: string;
  items: Array<{ icon: string; title: string; description: string }>;
}

export interface TeamSection {
  type: "team";
  title: string;
  members: Array<{ name: string; role: string; photo?: string }>;
}

export interface OpenRolesSection {
  type: "openRoles";
  title: string;
  showFilters: boolean;
}

export interface CTASection {
  type: "cta";
  headline: string;
  buttonText: string;
}

export interface CareerPageTheme {
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
}

export interface CareerPageConfig {
  sections: CareerPageSection[];
  theme: CareerPageTheme;
}

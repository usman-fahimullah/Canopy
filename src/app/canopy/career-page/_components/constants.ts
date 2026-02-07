import type { CareerPageSection } from "@/lib/career-pages/types";

export const SECTION_LABELS: Record<CareerPageSection["type"], string> = {
  hero: "Hero Banner",
  about: "About Us",
  values: "Our Values",
  impact: "Impact Metrics",
  benefits: "Benefits",
  team: "Team Members",
  openRoles: "Open Positions",
  cta: "Call to Action",
  testimonials: "Testimonials",
  faq: "FAQ",
};

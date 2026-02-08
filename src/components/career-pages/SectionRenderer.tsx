"use client";

import type {
  CareerPageSection,
  CareerPageTheme,
  HeroSection,
  AboutSection,
  ValuesSection,
  ImpactSection,
  BenefitsSection,
  TeamSection,
  OpenRolesSection,
  CTASection,
  TestimonialsSection,
  FAQSection,
} from "@/lib/career-pages/types";
import { HeroBlock } from "./sections/HeroBlock";
import { AboutBlock } from "./sections/AboutBlock";
import { ValuesBlock } from "./sections/ValuesBlock";
import { ImpactBlock } from "./sections/ImpactBlock";
import { BenefitsBlock } from "./sections/BenefitsBlock";
import { TeamBlock } from "./sections/TeamBlock";
import { OpenRolesBlock } from "./sections/OpenRolesBlock";
import { CTABlock } from "./sections/CTABlock";
import { TestimonialsBlock } from "./sections/TestimonialsBlock";
import { FAQBlock } from "./sections/FAQBlock";

interface SectionRendererProps {
  sections: CareerPageSection[];
  theme: CareerPageTheme;
  orgSlug: string;
  jobs?: Array<{
    id: string;
    title: string;
    location: string | null;
    locationType: string;
    employmentType: string;
  }>;
}

export function SectionRenderer({ sections, theme, orgSlug, jobs = [] }: SectionRendererProps) {
  // Filter out sections that are explicitly hidden
  const visibleSections = sections.filter((s) => s.visible !== false);

  return (
    <div>
      {visibleSections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <HeroBlock key={index} section={section as HeroSection} theme={theme} />;
          case "about":
            return <AboutBlock key={index} section={section as AboutSection} theme={theme} />;
          case "values":
            return <ValuesBlock key={index} section={section as ValuesSection} theme={theme} />;
          case "impact":
            return <ImpactBlock key={index} section={section as ImpactSection} theme={theme} />;
          case "benefits":
            return <BenefitsBlock key={index} section={section as BenefitsSection} theme={theme} />;
          case "team":
            return <TeamBlock key={index} section={section as TeamSection} theme={theme} />;
          case "openRoles":
            return (
              <OpenRolesBlock
                key={index}
                section={section as OpenRolesSection}
                theme={theme}
                jobs={jobs}
                orgSlug={orgSlug}
              />
            );
          case "cta":
            return <CTABlock key={index} section={section as CTASection} theme={theme} />;
          case "testimonials":
            return (
              <TestimonialsBlock
                key={index}
                section={section as TestimonialsSection}
                theme={theme}
              />
            );
          case "faq":
            return <FAQBlock key={index} section={section as FAQSection} theme={theme} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

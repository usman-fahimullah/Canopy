import type { CTASection, CareerPageTheme } from "@/lib/career-pages/types";

interface CTABlockProps {
  section: CTASection;
  theme: CareerPageTheme;
}

export function CTABlock({ section, theme }: CTABlockProps) {
  return (
    <section className="px-6 py-16 text-center md:px-12">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-6 text-3xl font-bold text-[var(--foreground-default)]">
          {section.headline}
        </h2>
        <a
          href="#open-roles"
          className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {section.buttonText}
        </a>
      </div>
    </section>
  );
}

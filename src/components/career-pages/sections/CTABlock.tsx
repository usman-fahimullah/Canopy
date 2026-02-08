import type { CTASection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";

interface CTABlockProps {
  section: CTASection;
  theme: CareerPageTheme;
}

export function CTABlock({ section, theme }: CTABlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, "#FFFFFF");
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={`${resolved.paddingClass} ${resolved.textAlignClass}`}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className="mb-6 text-3xl font-bold"
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
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

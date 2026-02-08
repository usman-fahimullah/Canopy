import type { ImpactSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";

interface ImpactBlockProps {
  section: ImpactSection;
  theme: CareerPageTheme;
}

export function ImpactBlock({ section, theme }: ImpactBlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, theme.primaryColor);
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={resolved.paddingClass}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className={`mb-12 text-3xl font-bold ${resolved.textAlignClass}`}
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {section.metrics.map((metric, i) => (
            <div key={i} className={resolved.textAlignClass}>
              <div className="mb-2 text-5xl font-bold" style={{ color: resolved.headingColor }}>
                {metric.value}
              </div>
              <div className="text-lg" style={{ color: resolved.mutedTextColor }}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

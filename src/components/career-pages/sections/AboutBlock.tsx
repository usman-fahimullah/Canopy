import type { AboutSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";

interface AboutBlockProps {
  section: AboutSection;
  theme: CareerPageTheme;
}

export function AboutBlock({ section, theme }: AboutBlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, "#FFFFFF");
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={resolved.paddingClass}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className={`mb-6 text-3xl font-bold ${resolved.textAlignClass}`}
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.title}
        </h2>
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <div
              className="prose prose-sm max-w-none"
              style={{ color: resolved.mutedTextColor }}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
          {section.image && (
            <div className="w-full shrink-0 md:w-80">
              <img src={section.image} alt={section.title} className="rounded-xl object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

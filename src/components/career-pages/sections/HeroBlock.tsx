import type { HeroSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";

interface HeroBlockProps {
  section: HeroSection;
  theme: CareerPageTheme;
}

export function HeroBlock({ section, theme }: HeroBlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, theme.primaryColor);
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={`relative flex min-h-[400px] items-center justify-center ${resolved.paddingClass} ${resolved.textAlignClass}`}
      style={{
        backgroundColor: resolved.backgroundColor,
        backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {section.backgroundImage && <div className="absolute inset-0 bg-black/50" />}
      <div className={`relative z-10 mx-auto ${resolved.maxWidthClass}`}>
        <h1
          className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.headline}
        </h1>
        <p className="text-lg md:text-xl" style={{ color: resolved.mutedTextColor }}>
          {section.subheadline}
        </p>
        {section.ctaButtonText && (
          <div className="mt-8">
            <a
              href={section.ctaButtonUrl || "#open-roles"}
              className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: resolved.textColorIsAuto ? "#FFFFFF" : resolved.textColor,
                color: resolved.backgroundColor,
              }}
            >
              {section.ctaButtonText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

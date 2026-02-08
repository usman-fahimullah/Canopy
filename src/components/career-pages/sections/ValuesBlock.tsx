import type { ValuesSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";
import * as PhosphorIcons from "@phosphor-icons/react/dist/ssr";

interface ValuesBlockProps {
  section: ValuesSection;
  theme: CareerPageTheme;
}

function getIcon(iconName: string) {
  const icons = PhosphorIcons as unknown as Record<string, typeof PhosphorIcons.Star>;
  return icons[iconName] || PhosphorIcons.Star;
}

export function ValuesBlock({ section, theme }: ValuesBlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, "#FAF9F7");
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={resolved.paddingClass}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className={`mb-10 text-3xl font-bold ${resolved.textAlignClass}`}
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {section.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={i} className={resolved.textAlignClass}>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                  <Icon size={28} weight="regular" style={{ color: resolved.headingColor }} />
                </div>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: resolved.headingColor }}>
                  {item.title}
                </h3>
                <p style={{ color: resolved.mutedTextColor }}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

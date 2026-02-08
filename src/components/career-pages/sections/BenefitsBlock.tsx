import type { BenefitsSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";
import * as PhosphorIcons from "@phosphor-icons/react/dist/ssr";

interface BenefitsBlockProps {
  section: BenefitsSection;
  theme: CareerPageTheme;
}

function getIcon(iconName: string) {
  const icons = PhosphorIcons as unknown as Record<string, typeof PhosphorIcons.CheckCircle>;
  return icons[iconName] || PhosphorIcons.CheckCircle;
}

export function BenefitsBlock({ section, theme }: BenefitsBlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, "#FFFFFF");
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {section.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={i}
                className="flex gap-4 rounded-xl border border-[var(--border-muted)] bg-[var(--background-default)] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
                  <Icon size={20} weight="regular" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: resolved.headingColor }}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: resolved.mutedTextColor }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

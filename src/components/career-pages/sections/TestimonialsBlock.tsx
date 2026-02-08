import type { TestimonialsSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";
import { Quotes } from "@phosphor-icons/react";

interface TestimonialsBlockProps {
  section: TestimonialsSection;
  theme: CareerPageTheme;
}

export function TestimonialsBlock({ section, theme }: TestimonialsBlockProps) {
  const resolved = resolveSectionStyle(section.style, theme, "#FFFFFF");
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  return (
    <section
      className={resolved.paddingClass}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className={`mb-10 text-2xl font-bold ${resolved.textAlignClass}`}
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.title}
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="relative rounded-2xl border border-[var(--border-muted)] bg-[var(--card-background)] p-6"
            >
              <Quotes
                size={24}
                weight="fill"
                className="mb-3"
                style={{ color: theme.primaryColor }}
              />
              <p className="mb-4 text-sm leading-relaxed text-[var(--foreground-default)]">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.author}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    {item.author.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground-default)]">
                    {item.author}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)]">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { TeamSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";
import { User } from "@phosphor-icons/react/dist/ssr";

interface TeamBlockProps {
  section: TeamSection;
  theme: CareerPageTheme;
}

export function TeamBlock({ section, theme }: TeamBlockProps) {
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
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {section.members.map((member, i) => (
            <div key={i} className={resolved.textAlignClass}>
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="mx-auto mb-3 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--background-muted)]">
                  <User size={40} weight="regular" />
                </div>
              )}
              <h3 className="font-semibold" style={{ color: resolved.headingColor }}>
                {member.name}
              </h3>
              <p className="text-sm" style={{ color: resolved.mutedTextColor }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

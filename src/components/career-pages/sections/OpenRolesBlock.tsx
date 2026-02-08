import type { OpenRolesSection, CareerPageTheme } from "@/lib/career-pages/types";
import { resolveSectionStyle } from "@/lib/career-pages/section-style-utils";
import { getFontValue } from "@/lib/career-pages/fonts";
import { MapPin, Clock, Briefcase } from "@phosphor-icons/react/dist/ssr";

interface OpenRolesBlockProps {
  section: OpenRolesSection;
  theme: CareerPageTheme;
  jobs: Array<{
    id: string;
    title: string;
    location: string | null;
    locationType: string;
    employmentType: string;
  }>;
  orgSlug: string;
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const LOCATION_LABELS: Record<string, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

export function OpenRolesBlock({ section, theme, jobs, orgSlug }: OpenRolesBlockProps) {
  void orgSlug; // reserved for future filtering links

  const resolved = resolveSectionStyle(section.style, theme, "#FFFFFF");
  const headingFont = getFontValue(theme.headingFontFamily || theme.fontFamily);

  if (jobs.length === 0) {
    return (
      <section
        className={resolved.paddingClass}
        style={{ backgroundColor: resolved.backgroundColor }}
      >
        <div className={`mx-auto ${resolved.maxWidthClass} ${resolved.textAlignClass}`}>
          <h2
            className="mb-4 text-3xl font-bold"
            style={{ color: resolved.headingColor, fontFamily: headingFont }}
          >
            {section.title}
          </h2>
          <p className="text-lg" style={{ color: resolved.mutedTextColor }}>
            No open positions right now. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={resolved.paddingClass}
      style={{ backgroundColor: resolved.backgroundColor }}
    >
      <div className={`mx-auto ${resolved.maxWidthClass}`}>
        <h2
          className={`mb-8 text-3xl font-bold ${resolved.textAlignClass}`}
          style={{ color: resolved.headingColor, fontFamily: headingFont }}
        >
          {section.title}
        </h2>
        <div className="space-y-3">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={`/apply/${job.id}`}
              className="flex items-center justify-between rounded-xl border border-[var(--border-muted)] bg-[var(--background-default)] px-6 py-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <div>
                <h3 className="font-semibold text-[var(--foreground-default)]">{job.title}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--foreground-muted)]">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} weight="regular" />
                      {job.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={14} weight="regular" />
                    {EMPLOYMENT_LABELS[job.employmentType] || job.employmentType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} weight="regular" />
                    {LOCATION_LABELS[job.locationType] || job.locationType}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-sm font-medium text-[var(--foreground-brand)]">
                Apply &rarr;
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { OpenRolesSection } from "@/lib/career-pages/types";
import { MapPin, Clock, Briefcase } from "@phosphor-icons/react/dist/ssr";

interface OpenRolesBlockProps {
  section: OpenRolesSection;
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

export function OpenRolesBlock({ section, jobs, orgSlug }: OpenRolesBlockProps) {
  void orgSlug; // reserved for future filtering links

  if (jobs.length === 0) {
    return (
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-[var(--foreground-default)]">
            {section.title}
          </h2>
          <p className="text-lg text-[var(--foreground-muted)]">
            No open positions right now. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-[var(--foreground-default)]">
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

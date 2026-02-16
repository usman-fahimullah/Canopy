import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { MapPin, Briefcase, Clock } from "@phosphor-icons/react/dist/ssr";

// ============================================
// TYPES
// ============================================

interface CareerPageProps {
  params: Promise<{ orgSlug: string }>;
}

interface JobItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  publishedAt: Date | null;
  department: { id: string; name: string; color: string | null } | null;
}

// ============================================
// HELPERS
// ============================================

const EMPLOYMENT_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const LOCATION_LABELS: Record<string, string> = {
  ONSITE: "On-site",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
};

function formatEmploymentType(type: string): string {
  return EMPLOYMENT_LABELS[type] ?? type;
}

function formatLocationType(type: string): string {
  return LOCATION_LABELS[type] ?? type;
}

function groupJobsByDepartment(jobs: JobItem[]) {
  const groups = new Map<string, { name: string; color: string | null; jobs: JobItem[] }>();
  const ungrouped: JobItem[] = [];

  for (const job of jobs) {
    if (job.department) {
      const existing = groups.get(job.department.id);
      if (existing) {
        existing.jobs.push(job);
      } else {
        groups.set(job.department.id, {
          name: job.department.name,
          color: job.department.color,
          jobs: [job],
        });
      }
    } else {
      ungrouped.push(job);
    }
  }

  return { groups: Array.from(groups.values()), ungrouped };
}

// ============================================
// DATA FETCHING
// ============================================

async function getCareerPageData(slug: string) {
  const org = await prisma.organization.findFirst({
    where: {
      careerPageSlug: slug,
      careerPageEnabled: true,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      description: true,
      primaryColor: true,
      careerPageSlug: true,
    },
  });

  if (!org) return null;

  const jobs = await prisma.job.findMany({
    where: {
      organizationId: org.id,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      location: true,
      locationType: true,
      employmentType: true,
      publishedAt: true,
      department: {
        select: { id: true, name: true, color: true },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  return { org, jobs };
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  const { orgSlug } = await params;
  const data = await getCareerPageData(orgSlug);

  if (!data) return { title: "Career Page Not Found" };

  const { org } = data;
  const title = `Careers at ${org.name}`;
  const description = org.description
    ? org.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `Explore open positions at ${org.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(org.logo ? { images: [{ url: org.logo, alt: org.name }] } : {}),
    },
  };
}

// ============================================
// PAGE
// ============================================

export default async function CareerPage({ params }: CareerPageProps) {
  const { orgSlug } = await params;
  const data = await getCareerPageData(orgSlug);

  if (!data) {
    notFound();
  }

  const { org, jobs } = data;
  const hasDepartments = jobs.some((j) => j.department !== null);
  const { groups, ungrouped } = hasDepartments
    ? groupJobsByDepartment(jobs)
    : { groups: [], ungrouped: jobs };

  return (
    <main className="min-h-screen bg-[var(--background-default)]">
      {/* Header */}
      <header className="border-b border-[var(--border-default)]">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-6 sm:px-8">
          {org.logo && (
            <img
              src={org.logo}
              alt={org.name}
              className="h-10 w-auto max-w-[140px] object-contain"
            />
          )}
          <div>
            <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
              {org.name}
            </h1>
            {org.description && (
              <p className="mt-0.5 line-clamp-2 text-body-sm text-[var(--foreground-muted)]">
                {org.description.replace(/<[^>]*>/g, "").slice(0, 200)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Job listings */}
      <div className="mx-auto max-w-4xl px-6 py-10 sm:px-8">
        <h2 className="mb-6 text-heading-sm font-semibold text-[var(--foreground-default)]">
          Open Positions
          {jobs.length > 0 && (
            <span className="ml-2 text-body text-[var(--foreground-muted)]">({jobs.length})</span>
          )}
        </h2>

        {jobs.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-[var(--border-default)] py-16 text-center">
            <Briefcase
              size={40}
              weight="light"
              className="mx-auto mb-3 text-[var(--foreground-subtle)]"
            />
            <p className="text-body font-medium text-[var(--foreground-default)]">
              No open positions at this time
            </p>
            <p className="mt-1 text-caption text-[var(--foreground-muted)]">
              Check back later for new opportunities.
            </p>
          </div>
        ) : hasDepartments ? (
          <div className="space-y-8">
            {groups.map((group) => (
              <DepartmentSection
                key={group.name}
                name={group.name}
                jobs={group.jobs}
                orgSlug={orgSlug}
              />
            ))}
            {ungrouped.length > 0 && (
              <DepartmentSection name="Other" jobs={ungrouped} orgSlug={orgSlug} />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} orgSlug={orgSlug} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-6 text-center">
        <p className="text-caption text-[var(--foreground-subtle)]">
          Powered by{" "}
          <a
            href="https://greenjobsboard.us"
            className="font-medium text-[var(--foreground-brand)] hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Green Jobs Board
          </a>
        </p>
      </footer>
    </main>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function DepartmentSection({
  name,
  jobs,
  orgSlug,
}: {
  name: string;
  jobs: JobItem[];
  orgSlug: string;
}) {
  return (
    <div>
      <h3 className="mb-3 text-body-strong font-semibold text-[var(--foreground-default)]">
        {name}
        <span className="ml-2 text-caption font-normal text-[var(--foreground-muted)]">
          ({jobs.length})
        </span>
      </h3>
      <div className="space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} orgSlug={orgSlug} />
        ))}
      </div>
    </div>
  );
}

function JobCard({ job, orgSlug }: { job: JobItem; orgSlug: string }) {
  return (
    <Link
      href={`/careers/${orgSlug}/${job.slug}`}
      className="group block rounded-[var(--radius-card)] border border-[var(--border-default)] px-5 py-4 transition-colors hover:border-[var(--border-emphasis)] hover:bg-[var(--background-subtle)]"
    >
      <h4 className="text-body font-medium text-[var(--foreground-default)] group-hover:text-[var(--foreground-brand)]">
        {job.title}
      </h4>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-caption text-[var(--foreground-muted)]">
        {job.location && (
          <span className="flex items-center gap-1">
            <MapPin size={14} weight="bold" />
            {job.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Briefcase size={14} weight="bold" />
          {formatEmploymentType(job.employmentType)}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} weight="bold" />
          {formatLocationType(job.locationType)}
        </span>
      </div>
    </Link>
  );
}

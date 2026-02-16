import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  MapPin,
  Briefcase,
  Clock,
  Money,
  TreeStructure,
  Leaf,
  Certificate,
  ArrowLeft,
} from "@phosphor-icons/react/dist/ssr";

// ============================================
// STYLE CONSTANTS
// ============================================

/** Button-link classes matching the Button primary variant for server-rendered pages */
const PRIMARY_LINK_CLASSES =
  "inline-flex items-center justify-center rounded-2xl bg-[var(--button-primary-background)] font-bold text-[var(--button-primary-foreground)] transition-all duration-150 hover:bg-[var(--button-primary-background-hover)] active:scale-[0.98]";

/** Prose classes for rendering HTML job descriptions with design system tokens */
const JOB_DESCRIPTION_PROSE =
  "prose prose-neutral max-w-none text-body-sm leading-relaxed text-[var(--foreground-default)] prose-headings:text-[var(--foreground-default)] prose-h2:text-body-strong prose-h3:text-body prose-p:text-body-sm prose-a:text-[var(--foreground-link)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--foreground-default)] prose-ul:text-body-sm prose-ol:text-body-sm prose-li:text-body-sm";

// ============================================
// TYPES
// ============================================

interface JobDetailPageProps {
  params: Promise<{ orgSlug: string; jobSlug: string }>;
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

const SALARY_PERIOD_LABELS: Record<string, string> = {
  ANNUAL: "year",
  HOURLY: "hour",
  WEEKLY: "week",
  MONTHLY: "month",
};

function formatEmploymentType(type: string): string {
  return EMPLOYMENT_LABELS[type] ?? type;
}

function formatLocationType(type: string): string {
  return LOCATION_LABELS[type] ?? type;
}

function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  period: string | null
): string | null {
  if (!min && !max) return null;

  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const periodLabel = period ? `/${SALARY_PERIOD_LABELS[period] ?? period}` : "";

  if (min && max) {
    return `${fmt.format(min)} - ${fmt.format(max)}${periodLabel}`;
  }
  if (min) return `From ${fmt.format(min)}${periodLabel}`;
  if (max) return `Up to ${fmt.format(max)}${periodLabel}`;
  return null;
}

// ============================================
// DATA FETCHING
// ============================================

async function getJobDetailData(orgSlug: string, jobSlug: string) {
  const org = await prisma.organization.findFirst({
    where: {
      careerPageSlug: orgSlug,
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

  const job = await prisma.job.findFirst({
    where: {
      organizationId: org.id,
      slug: jobSlug,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      descriptionHtml: true,
      location: true,
      locationType: true,
      employmentType: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      salaryPeriod: true,
      climateCategory: true,
      impactDescription: true,
      requiredCerts: true,
      greenSkills: true,
      publishedAt: true,
      department: {
        select: { id: true, name: true },
      },
    },
  });

  if (!job) return null;

  return { org, job };
}

// ============================================
// METADATA
// ============================================

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { orgSlug, jobSlug } = await params;
  const data = await getJobDetailData(orgSlug, jobSlug);

  if (!data) return { title: "Job Not Found" };

  const { org, job } = data;
  const title = `${job.title} at ${org.name}`;
  const description = job.description
    ? job.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `${job.title} - ${formatEmploymentType(job.employmentType)} position at ${org.name}`;

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

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { orgSlug, jobSlug } = await params;
  const data = await getJobDetailData(orgSlug, jobSlug);

  if (!data) {
    notFound();
  }

  const { org, job } = data;
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryPeriod);

  return (
    <main className="min-h-screen bg-[var(--background-default)]">
      {/* Header */}
      <header className="border-b border-[var(--border-default)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-6 sm:px-8">
          <Link
            href={`/careers/${orgSlug}`}
            className="flex items-center gap-1.5 text-caption font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-default)]"
          >
            <ArrowLeft size={16} weight="bold" />
            All positions
          </Link>
          <div className="ml-auto flex items-center gap-3">
            {org.logo && (
              <img
                src={org.logo}
                alt={org.name}
                className="h-8 w-auto max-w-[100px] object-contain"
              />
            )}
            <span className="text-caption font-medium text-[var(--foreground-muted)]">
              {org.name}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        {/* Title + Meta */}
        <div className="mb-8">
          <h1 className="text-heading-md font-bold text-[var(--foreground-default)]">
            {job.title}
          </h1>

          {/* Meta badges */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-body-sm text-[var(--foreground-muted)]">
            {job.department && (
              <span className="flex items-center gap-1.5">
                <TreeStructure size={16} weight="bold" />
                {job.department.name}
              </span>
            )}
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={16} weight="bold" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={16} weight="bold" />
              {formatLocationType(job.locationType)}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase size={16} weight="bold" />
              {formatEmploymentType(job.employmentType)}
            </span>
            {salary && (
              <span className="flex items-center gap-1.5">
                <Money size={16} weight="bold" />
                {salary}
              </span>
            )}
          </div>

          {/* Climate category */}
          {job.climateCategory && (
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--background-brand-subtle)] px-3 py-1 text-caption font-medium text-[var(--foreground-brand)]">
                <Leaf size={14} weight="fill" />
                {job.climateCategory}
              </span>
            </div>
          )}
        </div>

        {/* Apply CTA */}
        <div className="mb-10 flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--border-default)] p-5">
          <div className="flex-1">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              Interested in this role?
            </p>
            <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
              Submit your application and we&apos;ll be in touch.
            </p>
          </div>
          <Link
            href={`/apply/${job.id}`}
            className={`${PRIMARY_LINK_CLASSES} px-6 py-2.5 text-body-sm`}
          >
            Apply Now
          </Link>
        </div>

        {/* Impact Description */}
        {job.impactDescription && (
          <section className="mb-10">
            <h2 className="mb-3 text-heading-sm font-semibold text-[var(--foreground-default)]">
              Climate Impact
            </h2>
            <div className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--background-brand-subtle)] p-5">
              <p className="text-body-sm leading-relaxed text-[var(--foreground-default)]">
                {job.impactDescription}
              </p>
            </div>
          </section>
        )}

        {/* Job Description */}
        <section className="mb-10">
          <h2 className="mb-3 text-heading-sm font-semibold text-[var(--foreground-default)]">
            About the Role
          </h2>
          {job.descriptionHtml ? (
            <div
              className={JOB_DESCRIPTION_PROSE}
              dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
            />
          ) : (
            <div className="whitespace-pre-wrap text-body-sm leading-relaxed text-[var(--foreground-default)]">
              {job.description}
            </div>
          )}
        </section>

        {/* Certifications */}
        {job.requiredCerts.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-heading-sm font-semibold text-[var(--foreground-default)]">
              Required Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredCerts.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--background-subtle)] px-3 py-1.5 text-caption font-medium text-[var(--foreground-default)]"
                >
                  <Certificate size={14} weight="bold" />
                  {cert}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Green Skills */}
        {job.greenSkills.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-3 text-heading-sm font-semibold text-[var(--foreground-default)]">
              Green Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.greenSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--background-brand-subtle)] px-3 py-1.5 text-caption font-medium text-[var(--foreground-brand)]"
                >
                  <Leaf size={14} weight="fill" />
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Apply CTA */}
        <div className="border-t border-[var(--border-default)] pt-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-body font-medium text-[var(--foreground-default)]">
              Ready to make an impact?
            </p>
            <Link
              href={`/apply/${job.id}`}
              className={`${PRIMARY_LINK_CLASSES} px-8 py-3 text-body-sm`}
            >
              Apply for this Position
            </Link>
            <Link
              href={`/careers/${orgSlug}`}
              className="text-caption font-medium text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-default)]"
            >
              View all open positions
            </Link>
          </div>
        </div>
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

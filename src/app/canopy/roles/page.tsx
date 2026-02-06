"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryTag } from "@/components/ui/category-tag";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import {
  Plus,
  Sparkle,
  PencilSimple,
  ListPlus,
  Megaphone,
  FolderOpen,
  ArrowClockwise,
  WarningCircle,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import {
  RolesEmptyHeroIllustration,
  RolesTemplatePromoIllustration,
} from "@/components/illustrations/roles-illustrations";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface Pathway {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

interface Job {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  closesAt: string | null;
  applicationCount?: number;
  pathway?: Pathway | null;
  climateCategory?: string | null;
  _count?: { applications: number };
}

interface RoleTemplate {
  id: string;
  name: string;
  category: string;
  categoryIcon?: string;
  isNew?: boolean;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function formatDate(dateString: string | null) {
  if (!dateString) return "--";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------
   Sub-components
   ------------------------------------------------------------------- */

/** First-time UX: empty state hero with rocket illustration */
function RolesEmptyState() {
  return (
    <div className="flex min-h-[500px] flex-col items-center gap-8 px-8 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-12 lg:py-16">
      {/* Left: copy + CTA */}
      <div className="flex max-w-lg flex-col gap-6 lg:flex-1">
        <h2 className="text-heading-md font-bold text-[var(--foreground-default)] lg:text-heading-lg">
          Go ahead, kickstart your talent search
        </h2>
        <p className="text-body text-[var(--foreground-muted)]">
          Post your first job on Green Jobs Board, its easy and fast! We&apos;ll help you find the
          right candidate fast and easy.
        </p>
        <div>
          <Link href="/canopy/roles/new">
            <Button>
              <Plus size={18} weight="bold" />
              Create a role
            </Button>
          </Link>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="flex-1 lg:max-w-[500px]">
        <RolesEmptyHeroIllustration className="h-auto w-full" />
      </div>
    </div>
  );
}

/** Template promo banner when no templates have been created yet */
function TemplatePromoBanner() {
  return (
    <div className="overflow-hidden rounded-xl bg-[var(--primitive-blue-100)]">
      <div className="flex flex-col items-center gap-8 p-8 lg:flex-row lg:gap-12 lg:p-10">
        {/* Left: copy + CTA */}
        <div className="flex max-w-lg flex-col gap-4 lg:flex-1">
          <h3 className="text-heading-sm font-bold text-[var(--foreground-default)] lg:text-heading-md">
            Create role templates that spark your talent search
          </h3>
          <p className="text-body-sm text-[var(--foreground-muted)]">
            Standardize your roles once, then spin up polished job posts in minutes. With Green Jobs
            Board&apos;s reusable templates, you&apos;ll move faster, stay consistent, and attract
            the right candidates from the very first post.
          </p>
          <div>
            <Link href="/canopy/roles/templates/new">
              <Button variant="outline">
                <ListPlus size={18} weight="bold" />
                Create a template
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: illustration */}
        <div className="flex-1 lg:max-w-[340px]">
          <RolesTemplatePromoIllustration className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

/** Template card for existing role templates */
function RoleTemplateCard({ template }: { template: RoleTemplate }) {
  return (
    <Card variant="outlined" className="flex min-h-[180px] flex-col justify-between p-5">
      <div className="flex flex-col gap-3">
        {/* Top row: category tag + "New" badge */}
        <div className="flex items-center gap-2">
          <CategoryTag icon={<Megaphone size={18} weight="fill" />}>
            {template.category}
          </CategoryTag>
          {template.isNew && (
            <Badge variant="success" size="sm">
              <Sparkle size={12} weight="fill" />
              New
            </Badge>
          )}
        </div>

        {/* Template name */}
        <h4 className="text-body-strong font-semibold text-[var(--foreground-default)]">
          {template.name}
        </h4>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4">
        <Link href={`/canopy/roles/new?template=${template.id}`}>
          <Button variant="tertiary" size="sm">
            Use Template
          </Button>
        </Link>
        <Link href={`/canopy/roles/templates/${template.id}/edit`}>
          <Button variant="ghost" size="icon-sm">
            <PencilSimple size={18} weight="bold" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

/** "Create Another" placeholder card */
function CreateTemplateCard() {
  return (
    <Link href="/canopy/roles/templates/new">
      <Card
        variant="flat"
        className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-[var(--border-muted)] bg-[var(--background-muted)] transition-colors hover:border-[var(--border-default)] hover:bg-[var(--background-subtle)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-emphasized)]">
          <ListPlus size={20} weight="bold" className="text-[var(--foreground-muted)]" />
        </div>
        <span className="text-body-sm font-medium text-[var(--foreground-muted)]">
          Create Another Role Template
        </span>
      </Card>
    </Link>
  );
}

/** Templates section: cards grid */
function TemplatesSection({ templates }: { templates: RoleTemplate[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">Templates</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
          <RoleTemplateCard key={template.id} template={template} />
        ))}
        <CreateTemplateCard />
      </div>
    </section>
  );
}

/** Open Roles table section */
function OpenRolesSection({ jobs }: { jobs: Job[] }) {
  const openJobs = jobs.filter((j) => j.status === "PUBLISHED" || j.status === "DRAFT");

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">Open Roles</h2>
        <Badge variant="neutral" size="sm">
          {openJobs.length}
        </Badge>
      </div>

      <Table hoverable>
        {/* Table title row */}
        <TableHeader>
          <TableRow>
            <TableHead colSpan={5}>
              <div className="flex items-center gap-2 py-1">
                <FolderOpen size={20} weight="fill" className="text-[var(--foreground-muted)]" />
                <span className="text-body-sm font-semibold text-[var(--foreground-default)]">
                  Open Roles
                </span>
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead sortable>Job Title</TableHead>
            <TableHead sortable>Job Category</TableHead>
            <TableHead sortable>Department</TableHead>
            <TableHead sortable>Closing Date</TableHead>
            <TableHead sortable># of Applications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="py-8 text-center text-body-sm text-[var(--foreground-muted)]">
                  No open roles yet. Submit your first role to get started.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            openJobs.map((job) => {
              const appCount = job.applicationCount ?? job._count?.applications ?? 0;

              return (
                <TableRow key={job.id}>
                  <TableCell>
                    <Link
                      href={`/canopy/roles/${job.id}`}
                      className="font-medium text-[var(--foreground-default)] hover:underline"
                    >
                      <span className="line-clamp-1">{job.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {job.pathway ? (
                      <CategoryTag variant="truncate" maxWidth={140}>
                        {job.pathway.name}
                      </CategoryTag>
                    ) : job.climateCategory ? (
                      <CategoryTag variant="truncate" maxWidth={140}>
                        {job.climateCategory}
                      </CategoryTag>
                    ) : (
                      <span className="text-[var(--foreground-subtle)]">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[var(--foreground-muted)]">{job.location || "--"}</span>
                  </TableCell>
                  <TableCell>
                    {job.closesAt ? (
                      <Badge variant="warning" size="sm">
                        {formatDate(job.closesAt)}
                      </Badge>
                    ) : (
                      <span className="text-[var(--foreground-subtle)]">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-[var(--foreground-default)]">{appCount} Applied</span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </section>
  );
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

/** Error state component */
function RolesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-error)]">
        <WarningCircle size={32} weight="fill" className="text-[var(--foreground-error)]" />
      </div>
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-body font-medium text-[var(--foreground-default)]">
          Unable to load roles
        </h3>
        <p className="text-caption text-[var(--foreground-muted)]">
          Something went wrong while fetching your roles. Please try again.
        </p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <ArrowClockwise size={16} weight="bold" />
        Try again
      </Button>
    </div>
  );
}

export default function RolesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [templates, setTemplates] = useState<RoleTemplate[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/canopy/roles");
      if (!res.ok) {
        throw new Error(`Failed to fetch roles (${res.status})`);
      }
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      logger.error("Error fetching roles", { error: formatError(err) });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // TODO: Fetch role templates when API is available
    // For now templates stay empty — will show promo banner
  }, []);

  const hasJobs = jobs.length > 0;
  const hasTemplates = templates.length > 0;
  const isEmpty = !hasJobs && !hasTemplates;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Roles"
        actions={
          <div className="flex items-center gap-3">
            {/* Primary CTA always visible */}
            <Link href="/canopy/roles/new">
              <Button>
                <Plus size={18} weight="bold" />
                Create a role
              </Button>
            </Link>

            {/* Secondary actions only when content exists */}
            {hasJobs && (
              <Link href="/canopy/roles/templates/new">
                <Button variant="outline">
                  <ListPlus size={18} weight="bold" />
                  Create Template
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Content */}
      <div className="px-8 py-6 lg:px-12">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        )}

        {/* Error */}
        {!loading && error && <RolesErrorState onRetry={fetchData} />}

        {/* State 1: First-time UX — no jobs, no templates */}
        {!loading && !error && isEmpty && <RolesEmptyState />}

        {/* State 2 & 3: Has content */}
        {!loading && !error && !isEmpty && (
          <div className="space-y-10">
            {/* Role Templates or Promo */}
            {hasTemplates ? (
              <TemplatesSection templates={templates} />
            ) : (
              <section className="space-y-4">
                <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">
                  Role Templates
                </h2>
                <TemplatePromoBanner />
              </section>
            )}

            {/* Open Roles Table */}
            {hasJobs && <OpenRolesSection jobs={jobs} />}
          </div>
        )}
      </div>
    </div>
  );
}

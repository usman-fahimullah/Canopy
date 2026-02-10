"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CategoryTag } from "@/components/ui/category-tag";
import { SimpleTooltip } from "@/components/ui/tooltip";
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
  Copy,
  CirclesThreePlus,
} from "@phosphor-icons/react";
import {
  RolesEmptyHeroIllustration,
  RolesTemplatePromoIllustration,
} from "@/components/illustrations/roles-illustrations";
import { CreateTemplateModal } from "@/components/canopy/create-template-modal";
import { CreateRoleModal } from "./_components/CreateRoleModal";
import { useRolesQuery, useTemplatesQuery } from "@/hooks/queries";
import type { RoleListItem, TemplateItem } from "@/hooks/queries";
import { Spinner } from "@/components/ui/spinner";

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

/** Skeleton loading state for the roles page */
function RolesPageSkeleton() {
  return (
    <div className="space-y-8 px-12 py-6">
      {/* Templates section skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-7 w-32" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[180px] rounded-[var(--radius-card)]" />
          ))}
        </div>
      </section>

      {/* Roles table skeleton */}
      <section className="space-y-4">
        <Skeleton className="h-7 w-32" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <div className="flex -space-x-1.5">
                <Skeleton variant="circular" className="h-7 w-7" />
                <Skeleton variant="circular" className="h-7 w-7" />
              </div>
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** First-time UX: empty state hero with rocket illustration */
function RolesEmptyState({
  onCreateRole,
  creating,
}: {
  onCreateRole: () => void;
  creating: boolean;
}) {
  return (
    <div className="flex min-h-[500px] flex-col items-center gap-8 px-8 py-12 lg:flex-row lg:items-center lg:gap-16 lg:px-12 lg:py-16">
      {/* Left: copy + CTA */}
      <div className="flex max-w-lg flex-col gap-6 lg:flex-1">
        <h2 className="text-heading-md text-[var(--foreground-default)] lg:text-heading-lg">
          Go ahead, kickstart your talent search
        </h2>
        <p className="text-body text-[var(--foreground-muted)]">
          Post your first job on Green Jobs Board, its easy and fast! We&apos;ll help you find the
          right candidate fast and easy.
        </p>
        <div>
          <Button onClick={onCreateRole} disabled={creating}>
            {creating ? <Spinner size="sm" /> : <Plus size={18} weight="bold" />}
            {creating ? "Creating..." : "Create a role"}
          </Button>
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
function TemplatePromoBanner({ onCreateTemplate }: { onCreateTemplate: () => void }) {
  return (
    <div className="flex h-[380px] overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--primitive-blue-100)]">
      {/* Left: copy + CTA */}
      <div className="flex flex-1 flex-col justify-between px-12 py-12">
        <div className="flex flex-col gap-3 text-[var(--primitive-green-800)]">
          <h3 className="text-heading-md">Create role templates that spark your talent search</h3>
          <p className="text-body">
            Standardize your roles once, then spin up polished job posts in minutes. With Green Jobs
            Board&apos;s reusable templates, you&apos;ll move faster, stay consistent, and attract
            the right candidates from the very first post.
          </p>
        </div>
        <div>
          <Button variant="inverse" onClick={onCreateTemplate}>
            <CirclesThreePlus size={18} weight="fill" />
            Create a template
          </Button>
        </div>
      </div>

      {/* Right: illustration */}
      <div className="hidden flex-1 overflow-hidden lg:block">
        <RolesTemplatePromoIllustration className="h-full w-full object-cover" />
      </div>
    </div>
  );
}

/** Template card for existing role templates */
function RoleTemplateCard({ template }: { template: TemplateItem }) {
  const isNew = false;

  return (
    <Card variant="outlined" className="flex min-h-[180px] flex-col justify-between p-5">
      <div className="flex flex-col gap-3">
        {/* Top row: category tag + "New" badge */}
        <div className="flex items-center gap-2">
          <CategoryTag icon={<Megaphone size={18} weight="fill" />}>Template</CategoryTag>
          {isNew && (
            <Badge variant="success" size="sm">
              <Sparkle size={12} weight="fill" />
              New
            </Badge>
          )}
        </div>

        {/* Template name */}
        <h4 className="text-body-strong text-[var(--foreground-default)]">{template.name}</h4>
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
function CreateTemplateCard({ onCreateTemplate }: { onCreateTemplate: () => void }) {
  return (
    <button type="button" onClick={onCreateTemplate} className="text-left">
      <Card
        variant="flat"
        className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-[var(--border-muted)] bg-[var(--background-muted)] transition-colors hover:border-[var(--border-default)] hover:bg-[var(--background-interactive-hover)]"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-emphasized)]">
          <ListPlus size={20} weight="bold" className="text-[var(--foreground-muted)]" />
        </div>
        <span className="text-caption-strong text-[var(--foreground-muted)]">
          Create Another Role Template
        </span>
      </Card>
    </button>
  );
}

/** Templates section: cards grid */
function TemplatesSection({
  templates,
  onCreateTemplate,
}: {
  templates: TemplateItem[];
  onCreateTemplate: () => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-heading-sm text-[var(--foreground-default)]">Templates</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((template) => (
          <RoleTemplateCard key={template.id} template={template} />
        ))}
        <CreateTemplateCard onCreateTemplate={onCreateTemplate} />
      </div>
    </section>
  );
}

/** Open Roles table section */
function OpenRolesSection({ jobs }: { jobs: RoleListItem[] }) {
  const openJobs = jobs.filter((j) => j.status === "PUBLISHED" || j.status === "DRAFT");

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <h2 className="text-heading-sm text-[var(--foreground-default)]">Open Roles</h2>
        <Badge variant="neutral" size="sm">
          {openJobs.length}
        </Badge>
      </div>

      <Table hoverable>
        {/* Table title row */}
        <TableHeader>
          <TableRow>
            <TableHead colSpan={6}>
              <div className="flex items-center gap-2 py-1">
                <FolderOpen size={20} weight="fill" className="text-[var(--foreground-muted)]" />
                <span className="text-body-strong text-[var(--foreground-default)]">
                  Open Roles
                </span>
              </div>
            </TableHead>
          </TableRow>
          <TableRow>
            <TableHead sortable>Job Title</TableHead>
            <TableHead sortable>Pathway</TableHead>
            <TableHead>Team</TableHead>
            <TableHead sortable>Closing Date</TableHead>
            <TableHead sortable># of Applications</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {openJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="py-8 text-center text-body-sm text-[var(--foreground-muted)]">
                  No open roles yet. Submit your first role to get started.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            openJobs.map((job) => {
              const appCount = job.applicationCount ?? job._count?.applications ?? 0;
              const assignees: { name: string; avatar: string | null; label: string }[] = [];
              if (job.recruiter) {
                const name = job.recruiter.name ?? "Unknown";
                assignees.push({ ...job.recruiter, name, label: `${name} (Recruiter)` });
              }
              if (job.hiringManager) {
                const name = job.hiringManager.name ?? "Unknown";
                assignees.push({
                  ...job.hiringManager,
                  name,
                  label: `${name} (Hiring Manager)`,
                });
              }

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
                    {assignees.length > 0 ? (
                      <div className="flex items-center -space-x-1.5">
                        {assignees.map((a) => (
                          <SimpleTooltip key={a.label} content={a.label}>
                            <Avatar
                              name={a.name}
                              src={a.avatar ?? undefined}
                              size="xs"
                              className="ring-2 ring-[var(--background-default)]"
                            />
                          </SimpleTooltip>
                        ))}
                        {(job.reviewerCount ?? 0) > 0 && (
                          <span className="ml-2 text-caption text-[var(--foreground-muted)]">
                            +{job.reviewerCount}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[var(--foreground-subtle)]">--</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {job.closesAt ? (
                      <Badge variant="info" size="sm">
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
   Error state
   ------------------------------------------------------------------- */

function RolesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-error)]">
        <WarningCircle size={32} weight="fill" className="text-[var(--foreground-error)]" />
      </div>
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-body-strong text-[var(--foreground-default)]">Unable to load roles</h3>
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

/* -------------------------------------------------------------------
   Main View
   ------------------------------------------------------------------- */

interface RolesViewProps {
  initialJobs: RoleListItem[];
  initialTemplates: TemplateItem[];
}

export function RolesView({ initialJobs, initialTemplates }: RolesViewProps) {
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // React Query with initialData — renders instantly from SSR, refetches in background
  const {
    data: jobs = [],
    isLoading: rolesLoading,
    error: rolesError,
    refetch: refetchRoles,
  } = useRolesQuery({ initialData: initialJobs });

  const { data: templates = [], isLoading: templatesLoading } = useTemplatesQuery({
    initialData: initialTemplates,
  });

  // Only show skeleton on first load (no cached data yet)
  const isFirstLoad =
    (rolesLoading && jobs.length === 0) || (templatesLoading && templates.length === 0);
  const error = rolesError ? (rolesError as Error).message : null;

  const hasJobs = jobs.length > 0;
  const hasTemplates = templates.length > 0;
  const isEmpty = !hasJobs && !hasTemplates;

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Roles"
        actions={
          <div className="flex items-center gap-2.5">
            {/* Primary CTA always visible */}
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus size={18} weight="bold" />
              Create a role
            </Button>

            {/* Secondary actions only when content exists */}
            {hasJobs && (
              <>
                <Button variant="tertiary" onClick={() => setTemplateModalOpen(true)}>
                  <CirclesThreePlus size={18} weight="fill" />
                  Create a template
                </Button>
                <Button variant="tertiary">
                  <Copy size={18} weight="fill" />
                  Make a copy
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Content */}
      <div>
        {/* Loading — skeleton only on first visit (no cached data) */}
        {isFirstLoad && <RolesPageSkeleton />}

        {/* Error */}
        {!isFirstLoad && error && (
          <div className="px-12 py-6">
            <RolesErrorState onRetry={() => refetchRoles()} />
          </div>
        )}

        {/* State 1: First-time UX — no jobs, no templates */}
        {!isFirstLoad && !error && isEmpty && (
          <div className="px-12 py-6">
            <RolesEmptyState onCreateRole={() => setCreateModalOpen(true)} creating={false} />
          </div>
        )}

        {/* State 2 & 3: Has content — shows instantly from cache on return visits */}
        {!isFirstLoad && !error && !isEmpty && (
          <>
            {/* Role Templates section — white background */}
            <div className="px-12 py-6">
              {hasTemplates ? (
                <TemplatesSection
                  templates={templates}
                  onCreateTemplate={() => setTemplateModalOpen(true)}
                />
              ) : (
                <section className="space-y-3">
                  <h2 className="text-heading-sm text-[var(--foreground-default)]">
                    Role Templates
                  </h2>
                  <TemplatePromoBanner onCreateTemplate={() => setTemplateModalOpen(true)} />
                </section>
              )}
            </div>

            {/* Open Roles section — subtle background per Figma */}
            {hasJobs && (
              <div className="bg-[var(--background-subtle)] px-12 py-6">
                <OpenRolesSection jobs={jobs} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Role Modal */}
      <CreateRoleModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      {/* Create Template Modal */}
      <CreateTemplateModal
        open={templateModalOpen}
        onOpenChange={setTemplateModalOpen}
        jobs={jobs as RoleListItem[]}
        onTemplateCreated={() => {
          // Templates query auto-invalidates via stale-while-revalidate
        }}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shell/page-header";
import { DashboardChecklist } from "@/components/shell/dashboard-checklist";
import { Spinner } from "@/components/ui/spinner";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseMetal,
  Users,
  Table,
  UsersFour,
  ArrowCircleRight,
  MapPin,
  Plus,
  WarningCircle,
} from "@phosphor-icons/react";

interface DashboardRole {
  id: string;
  title: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  applicationCount: number;
}

interface DashboardApplication {
  id: string;
  stage: string;
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
  };
  job: {
    id: string;
    title: string;
  };
}

interface DashboardData {
  activeRolesCount: number;
  recentRoles: DashboardRole[];
  candidateCount: number;
  newApplicationCount: number;
  hiredCount: number;
  recentApplications: DashboardApplication[];
  pipelineStats: Record<string, number>;
}

const initialData: DashboardData = {
  activeRolesCount: 0,
  recentRoles: [],
  candidateCount: 0,
  newApplicationCount: 0,
  hiredCount: 0,
  recentApplications: [],
  pipelineStats: {},
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function statusBadgeVariant(status: string) {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
      return "success";
    case "DRAFT":
      return "neutral";
    case "PAUSED":
      return "warning";
    case "CLOSED":
      return "error";
    default:
      return "neutral";
  }
}

const PIPELINE_STAGES = ["Applied", "Screening", "Interview", "Offer", "Hired"];

async function fetchDashboardData(): Promise<DashboardData> {
  const res = await fetch("/api/canopy/dashboard");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Failed to load dashboard (${res.status})`);
  }
  return res.json();
}

export default function EmployerDashboardPage() {
  const {
    data = initialData,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardData>({
    queryKey: ["canopy-dashboard"],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Home" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader title="Home" />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-8">
          <WarningCircle size={48} weight="duotone" className="text-[var(--foreground-error)]" />
          <p className="text-body text-[var(--foreground-muted)]">
            {error instanceof Error ? error.message : "Failed to load dashboard"}
          </p>
          <button
            onClick={() => refetch()}
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[var(--radius-button)]"
            )}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const totalInPipeline = Object.values(data.pipelineStats).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      <PageHeader title="Home" />

      {/* Greeting + Quick Actions */}
      <div className="flex flex-col gap-6 px-8 py-6 lg:px-12">
        <h2 className="text-heading-md font-medium text-[var(--foreground-brand-emphasis)]">
          {getGreeting()}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/canopy/roles"
            className={cn(
              buttonVariants({ variant: "primary" }),
              "rounded-[var(--radius-2xl)] px-4 py-4 text-body font-bold"
            )}
          >
            <Plus size={20} weight="bold" />
            Post a Role
          </Link>
          <Link
            href="/canopy/candidates"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[var(--radius-2xl)] px-4 py-4 text-body font-bold"
            )}
          >
            <Users size={20} weight="bold" />
            View Candidates
          </Link>
          <Link
            href="/canopy/team"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[var(--radius-2xl)] px-4 py-4 text-body font-bold"
            )}
          >
            <UsersFour size={20} weight="bold" />
            Invite Team
          </Link>
        </div>
      </div>

      {/* Getting Started Checklist */}
      <section className="px-8 py-4 lg:px-12">
        <DashboardChecklist shell="employer" />
      </section>

      {/* Stats */}
      <section className="px-8 py-6 lg:px-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Active Roles",
              value: data.activeRolesCount,
              icon: BriefcaseMetal,
              href: "/canopy/roles",
            },
            {
              label: "Candidates",
              value: data.candidateCount,
              icon: Users,
              href: "/canopy/candidates",
            },
            {
              label: "New Applications",
              value: data.newApplicationCount,
              icon: Table,
              href: "/canopy/candidates",
            },
            { label: "Hires", value: data.hiredCount, icon: UsersFour, href: "/canopy/analytics" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-4 py-5 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-caption text-[var(--foreground-muted)]">{stat.label}</p>
                <div className="rounded-lg bg-[var(--background-info)] p-1.5">
                  <stat.icon size={16} weight="bold" className="text-[var(--foreground-info)]" />
                </div>
              </div>
              <p className="text-heading-sm font-semibold text-[var(--foreground-default)]">
                {stat.value}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Roles */}
      <section className="px-8 py-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Active Roles
          </h2>
          <Link
            href="/canopy/roles"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-[var(--radius-2xl)] px-4 py-3.5 text-caption font-bold"
            )}
          >
            View All
            <ArrowCircleRight size={20} />
          </Link>
        </div>

        {data.recentRoles.length > 0 ? (
          <div className="space-y-3">
            {data.recentRoles.map((job) => (
              <Link
                key={job.id}
                href={`/canopy/roles/${job.id}`}
                className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-info)]">
                  <BriefcaseMetal
                    size={20}
                    weight="fill"
                    className="text-[var(--foreground-info)]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-[var(--foreground-default)]">
                    {job.title}
                  </p>
                  <div className="flex items-center gap-2 text-caption text-[var(--foreground-muted)]">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {job.location}
                      </span>
                    )}
                    <span>{job.applicationCount} applications</span>
                  </div>
                </div>
                <Badge variant={statusBadgeVariant(job.status)}>
                  {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] p-8 text-center">
            <p className="text-body text-[var(--foreground-muted)]">
              No roles posted yet. Create your first job listing to start receiving applications.
            </p>
          </div>
        )}
      </section>

      {/* Recent Applications */}
      <section className="px-8 py-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Recent Applications
          </h2>
          <Link
            href="/canopy/candidates"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-[var(--radius-2xl)] px-4 py-3.5 text-caption font-bold"
            )}
          >
            View All
            <ArrowCircleRight size={20} />
          </Link>
        </div>

        {data.recentApplications.length > 0 ? (
          <div className="space-y-3">
            {data.recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-[var(--foreground-default)]">
                    {app.candidate.name}
                  </p>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    {app.job.title} ·{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={statusBadgeVariant(app.stage)}>{app.stage}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] p-8 text-center">
            <p className="text-body text-[var(--foreground-muted)]">
              No applications yet. Post a role to start receiving candidates.
            </p>
          </div>
        )}
      </section>

      {/* Hiring Pipeline */}
      {totalInPipeline > 0 && (
        <section className="px-8 py-6 lg:px-12">
          <h2 className="mb-4 text-heading-sm font-medium text-[var(--foreground-default)]">
            Hiring Pipeline
          </h2>
          <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] p-6">
            <div className="flex items-end gap-1">
              {PIPELINE_STAGES.map((stage) => {
                const count = data.pipelineStats[stage] || 0;
                const height =
                  totalInPipeline > 0 ? Math.max((count / totalInPipeline) * 120, 8) : 8;
                return (
                  <div key={stage} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-caption-strong text-[var(--foreground-default)]">
                      {count}
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-[var(--background-info)] transition-all"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-center text-caption text-[var(--foreground-muted)]">
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

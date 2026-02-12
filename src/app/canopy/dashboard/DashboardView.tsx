"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { DashboardChecklist } from "@/components/shell/dashboard-checklist";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UpcomingInterviewsWidget } from "@/components/canopy/UpcomingInterviewsWidget";
import {
  BriefcaseMetal,
  Info,
  Users,
  Table,
  UsersFour,
  ArrowCircleRight,
  MapPin,
  Plus,
  Warning,
  Clock,
  Exam,
} from "@phosphor-icons/react";
import { TruncateText } from "@/components/ui/truncate-text";
import type { DashboardData, AttentionItem } from "@/lib/services/dashboard";

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

interface DashboardViewProps {
  data: DashboardData;
}

export function DashboardView({ data }: DashboardViewProps) {
  const totalInPipeline = Object.values(data.pipelineStats).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      <PageHeader title="Home" />

      {/* Scoped-access banner for HIRING_MANAGER / MEMBER */}
      {(data.userRole === "HIRING_MANAGER" || data.userRole === "MEMBER") && (
        <div className="mx-8 mt-6 flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border-info)] bg-[var(--background-info)] px-4 py-3 lg:mx-12">
          <Info size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--foreground-info)]" />
          <p className="text-caption text-[var(--foreground-info)]">
            You&apos;re viewing data for your assigned roles only. Contact an admin to adjust your
            role assignments.
          </p>
        </div>
      )}

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
              className="flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-4 py-5 shadow-card transition-shadow hover:shadow-card-hover"
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

      {/* Attention Needed */}
      {data.attention.totalCount > 0 && (
        <section className="px-8 py-6 lg:px-12">
          <div className="mb-4 flex items-center gap-2">
            <Warning size={22} weight="fill" className="text-[var(--foreground-warning)]" />
            <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
              Attention Needed
            </h2>
            <Badge variant="warning">{data.attention.totalCount}</Badge>
          </div>

          <div className="space-y-3">
            {data.attention.staleCandidates.map((item) => (
              <AttentionRow key={`stale-${item.id}`} item={item} />
            ))}
            {data.attention.unscoredInterviews.map((item) => (
              <AttentionRow key={`unscored-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      )}

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
                className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-info)]">
                  <BriefcaseMetal
                    size={20}
                    weight="fill"
                    className="text-[var(--foreground-info)]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <TruncateText className="text-body font-medium text-[var(--foreground-default)]">
                    {job.title}
                  </TruncateText>
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
              <Link
                key={app.id}
                href={`/canopy/candidates?preview=${app.candidate.id}`}
                className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="min-w-0 flex-1">
                  <TruncateText className="text-body font-medium text-[var(--foreground-default)]">
                    {app.candidate.name}
                  </TruncateText>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    {app.job.title} ·{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={statusBadgeVariant(app.stage)}>{app.stage}</Badge>
              </Link>
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

      {/* Upcoming Interviews Widget */}
      <section className="px-8 py-6 lg:px-12">
        <UpcomingInterviewsWidget />
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

function AttentionRow({ item }: { item: AttentionItem }) {
  const icon =
    item.type === "stale" ? (
      <Clock size={18} weight="bold" className="text-[var(--foreground-warning)]" />
    ) : (
      <Exam size={18} weight="bold" className="text-[var(--foreground-error)]" />
    );

  const badgeVariant = item.type === "stale" ? "warning" : "error";
  const badgeLabel = item.type === "stale" ? "Stale" : "Unscored";

  return (
    <Link
      href={`/canopy/candidates?preview=${item.seekerId}`}
      className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4 shadow-card transition-shadow hover:shadow-card-hover"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-warning)]">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <TruncateText className="text-body font-medium text-[var(--foreground-default)]">
          {item.candidateName}
        </TruncateText>
        <p className="text-caption text-[var(--foreground-muted)]">
          {item.jobTitle} — {item.detail}
        </p>
      </div>
      <Badge variant={badgeVariant}>{badgeLabel}</Badge>
    </Link>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
} from "@phosphor-icons/react";

interface Job {
  id: string;
  title: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  _count?: { applications: number };
}

interface Application {
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
  recentRoles: Job[];
  candidateCount: number;
  newApplicationCount: number;
  hiredCount: number;
  recentApplications: Application[];
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

export default function EmployerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, applicationsRes, candidatesRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/applications"),
          fetch("/api/candidates"),
        ]);

        const jobsData = jobsRes.ok ? await jobsRes.json() : { jobs: [] };
        const applicationsData = applicationsRes.ok
          ? await applicationsRes.json()
          : { applications: [] };
        const candidatesData = candidatesRes.ok ? await candidatesRes.json() : { candidates: [] };

        const allJobs: Job[] = jobsData.jobs || [];
        const allApplications: Application[] = applicationsData.applications || [];
        const allCandidates = candidatesData.candidates || [];

        const activeJobs = allJobs.filter((j) => j.status === "PUBLISHED");

        // Calculate pipeline stats
        const pipelineStats: Record<string, number> = {};
        PIPELINE_STAGES.forEach((stage) => {
          pipelineStats[stage] = allApplications.filter(
            (a) => a.stage.toLowerCase() === stage.toLowerCase()
          ).length;
        });

        // Count recent applications (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentApps = allApplications.filter((a) => new Date(a.createdAt) >= sevenDaysAgo);

        const hiredApps = allApplications.filter((a) => a.stage.toLowerCase() === "hired");

        setData({
          activeRolesCount: activeJobs.length,
          recentRoles: allJobs
            .sort((a, b) => {
              const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
              const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
              return dateB - dateA;
            })
            .slice(0, 5),
          candidateCount: allCandidates.length,
          newApplicationCount: recentApps.length,
          hiredCount: hiredApps.length,
          recentApplications: allApplications
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5),
          pipelineStats,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalInPipeline = Object.values(data.pipelineStats).reduce((sum, n) => sum + n, 0);

  return (
    <div>
      <PageHeader title="Home" />

      {/* Greeting + Quick Actions */}
      <div className="flex flex-col gap-6 px-8 py-6 lg:px-12">
        <h2 className="text-heading-md font-medium text-[var(--primitive-green-800)]">
          {getGreeting()}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/canopy/roles"
            className={cn(
              buttonVariants({ variant: "primary" }),
              "rounded-[16px] px-4 py-4 text-body font-bold"
            )}
          >
            <Plus size={20} weight="bold" />
            Post a Role
          </Link>
          <Link
            href="/canopy/candidates"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[16px] px-4 py-4 text-body font-bold"
            )}
          >
            <Users size={20} weight="bold" />
            View Candidates
          </Link>
          <Link
            href="/canopy/team"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[16px] px-4 py-4 text-body font-bold"
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
              className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-4 py-5 transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-caption text-foreground-muted">{stat.label}</p>
                <div className="rounded-lg bg-[var(--primitive-blue-100)] p-1.5">
                  <stat.icon size={16} weight="bold" className="text-[var(--primitive-blue-600)]" />
                </div>
              </div>
              <p className="text-foreground-default text-heading-sm font-semibold">{stat.value}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Active Roles */}
      <section className="px-8 py-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-medium">Active Roles</h2>
          <Link
            href="/canopy/roles"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-[16px] px-4 py-3.5 text-caption font-bold"
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
                className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-4 transition-shadow hover:shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                  <BriefcaseMetal
                    size={20}
                    weight="fill"
                    className="text-[var(--primitive-blue-600)]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground-default truncate text-body font-medium">
                    {job.title}
                  </p>
                  <div className="flex items-center gap-2 text-caption text-foreground-muted">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {job.location}
                      </span>
                    )}
                    <span>{job._count?.applications || 0} applications</span>
                  </div>
                </div>
                <Badge variant={statusBadgeVariant(job.status)}>
                  {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8 text-center">
            <p className="text-body text-foreground-muted">
              No roles posted yet. Create your first job listing to start receiving applications.
            </p>
          </div>
        )}
      </section>

      {/* Recent Applications */}
      <section className="px-8 py-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-medium">
            Recent Applications
          </h2>
          <Link
            href="/canopy/candidates"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-[16px] px-4 py-3.5 text-caption font-bold"
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
                className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-foreground-default truncate text-body font-medium">
                    {app.candidate.name}
                  </p>
                  <p className="text-caption text-foreground-muted">
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
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8 text-center">
            <p className="text-body text-foreground-muted">
              No applications yet. Post a role to start receiving candidates.
            </p>
          </div>
        )}
      </section>

      {/* Hiring Pipeline */}
      {totalInPipeline > 0 && (
        <section className="px-8 py-6 lg:px-12">
          <h2 className="text-foreground-default mb-4 text-heading-sm font-medium">
            Hiring Pipeline
          </h2>
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-6">
            <div className="flex items-end gap-1">
              {PIPELINE_STAGES.map((stage) => {
                const count = data.pipelineStats[stage] || 0;
                const height =
                  totalInPipeline > 0 ? Math.max((count / totalInPipeline) * 120, 8) : 8;
                return (
                  <div key={stage} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-foreground-default text-caption-strong">{count}</span>
                    <div
                      className="w-full rounded-t-lg bg-[var(--primitive-blue-200)] transition-all"
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-center text-caption text-foreground-muted">{stage}</span>
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

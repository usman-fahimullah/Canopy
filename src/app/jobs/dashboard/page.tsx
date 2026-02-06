"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shell/page-header";
import { DashboardChecklist } from "@/components/shell/dashboard-checklist";
import { Spinner } from "@/components/ui/spinner";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { stageBadgeVariant } from "@/lib/jobs/helpers";
import { Card } from "@/components/ui/card";
import {
  MagnifyingGlass,
  Table,
  User,
  Heart,
  ArrowCircleRight,
  MapPin,
  Buildings,
} from "@phosphor-icons/react";

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string | null;
  locationType: string;
  matchScore: number | null;
}

interface Application {
  id: string;
  stage: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    organization?: { name: string };
  };
}

interface DashboardData {
  jobMatchCount: number;
  topMatches: JobMatch[];
  applicationCount: number;
  recentApplications: Application[];
  savedJobCount: number;
  profileCompletion: number;
}

const initialData: DashboardData = {
  jobMatchCount: 0,
  topMatches: [],
  applicationCount: 0,
  recentApplications: [],
  savedJobCount: 0,
  profileCompletion: 0,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

async function fetchTalentDashboard(): Promise<DashboardData> {
  const [matchesRes, applicationsRes, savedRes] = await Promise.all([
    fetch("/api/jobs/matches"),
    fetch("/api/applications"),
    fetch("/api/jobs/saved"),
  ]);

  const matchesData = matchesRes.ok ? await matchesRes.json() : { jobs: [], total: 0 };
  const applicationsData = applicationsRes.ok ? await applicationsRes.json() : { applications: [] };
  const savedData = savedRes.ok ? await savedRes.json() : { jobs: [] };

  const allMatches = matchesData.jobs || [];
  const allApplications = applicationsData.applications || [];
  const allSaved = savedData.jobs || [];

  return {
    jobMatchCount: matchesData.total || allMatches.length,
    topMatches: allMatches.slice(0, 5),
    applicationCount: allApplications.length,
    recentApplications: allApplications
      .sort(
        (a: Application, b: Application) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5),
    savedJobCount: allSaved.length,
    profileCompletion: 0,
  };
}

export default function TalentDashboardPage() {
  const { data = initialData, isLoading } = useQuery<DashboardData>({
    queryKey: ["talent-dashboard"],
    queryFn: fetchTalentDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
            href="/jobs/search"
            className={cn(
              buttonVariants({ variant: "primary" }),
              "rounded-2xl px-4 py-4 text-body font-bold"
            )}
          >
            <MagnifyingGlass size={20} weight="bold" />
            Browse Jobs
          </Link>
          <Link
            href="/jobs/applications"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-2xl px-4 py-4 text-body font-bold"
            )}
          >
            <Table size={20} weight="fill" />
            My Applications
          </Link>
          <Link
            href="/jobs/profile"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-2xl px-4 py-4 text-body font-bold"
            )}
          >
            <User size={20} weight="bold" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Getting Started Checklist */}
      <section className="px-8 py-4 lg:px-12">
        <DashboardChecklist shell="talent" />
      </section>

      {/* Stats */}
      <section className="px-8 py-6 lg:px-12">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Job Matches",
              value: data.jobMatchCount,
              icon: MagnifyingGlass,
              href: "/jobs/search",
            },
            {
              label: "Applications",
              value: data.applicationCount,
              icon: Table,
              href: "/jobs/applications",
            },
            {
              label: "Profile",
              value: `${data.profileCompletion}%`,
              icon: User,
              href: "/jobs/profile",
            },
            { label: "Saved Jobs", value: data.savedJobCount, icon: Heart, href: "/jobs/search" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex flex-col gap-3 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-4 py-5 transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-caption text-foreground-muted">{stat.label}</p>
                <div className="rounded-lg bg-[var(--background-brand-subtle)] p-1.5">
                  <stat.icon size={16} weight="bold" className="text-[var(--foreground-brand)]" />
                </div>
              </div>
              <p className="text-foreground-default text-heading-sm font-semibold">{stat.value}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Job Matches */}
      <section className="px-8 py-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-medium">
            Recent Job Matches
          </h2>
          <Link
            href="/jobs/search"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-2xl px-4 py-3.5 text-caption font-bold"
            )}
          >
            View All
            <ArrowCircleRight size={20} />
          </Link>
        </div>

        {data.topMatches.length > 0 ? (
          <div className="space-y-3">
            {data.topMatches.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/search/${job.id}`}
                className="flex items-center gap-4 rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] px-6 py-4 transition-shadow hover:shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--background-info)]">
                  <Buildings size={20} weight="fill" className="text-[var(--foreground-info)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground-default truncate text-body font-medium">
                    {job.title}
                  </p>
                  <p className="truncate text-caption text-foreground-muted">{job.company}</p>
                </div>
                {job.location && (
                  <div className="hidden items-center gap-1 text-caption text-foreground-muted sm:flex">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.matchScore != null && (
                  <Badge
                    variant={
                      job.matchScore >= 80
                        ? "success"
                        : job.matchScore >= 50
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {Math.round(job.matchScore)}% match
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="p-8 text-center">
            <p className="text-body text-foreground-muted">
              No job matches yet. Complete your profile to get personalized recommendations.
            </p>
          </Card>
        )}
      </section>

      {/* Recent Applications */}
      <section className="px-8 py-6 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-medium">Applications</h2>
          <Link
            href="/jobs/applications"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-2xl px-4 py-3.5 text-caption font-bold"
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
                  <p className="text-foreground-default truncate text-body font-medium">
                    {app.job.title}
                  </p>
                  <p className="text-caption text-foreground-muted">
                    {app.job.organization?.name || "Company"} · Applied{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Badge variant={stageBadgeVariant(app.stage)}>{app.stage}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="p-8 text-center">
            <p className="text-body text-foreground-muted">
              You haven&apos;t applied to any roles yet. Browse jobs to get started.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}

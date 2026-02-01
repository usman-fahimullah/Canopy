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

function stageBadgeVariant(stage: string) {
  switch (stage.toLowerCase()) {
    case "applied":
      return "info";
    case "screening":
      return "default";
    case "interview":
      return "feature";
    case "offer":
      return "warning";
    case "hired":
      return "success";
    case "rejected":
      return "error";
    default:
      return "neutral";
  }
}

export default function TalentDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        setData({
          jobMatchCount: matchesData.total || allMatches.length,
          topMatches: allMatches.slice(0, 5),
          applicationCount: allApplications.length,
          recentApplications: allApplications
            .sort((a: Application, b: Application) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, 5),
          savedJobCount: allSaved.length,
          profileCompletion: 0,
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
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

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
            href="/talent/jobs"
            className={cn(
              buttonVariants({ variant: "primary" }),
              "rounded-[16px] px-4 py-4 text-body font-bold"
            )}
          >
            <MagnifyingGlass size={20} weight="bold" />
            Browse Jobs
          </Link>
          <Link
            href="/talent/applications"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[16px] px-4 py-4 text-body font-bold"
            )}
          >
            <Table size={20} weight="fill" />
            My Applications
          </Link>
          <Link
            href="/talent/profile"
            className={cn(
              buttonVariants({ variant: "tertiary" }),
              "rounded-[16px] px-4 py-4 text-body font-bold"
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
            { label: "Job Matches", value: data.jobMatchCount, icon: MagnifyingGlass, href: "/talent/jobs" },
            { label: "Applications", value: data.applicationCount, icon: Table, href: "/talent/applications" },
            { label: "Profile", value: `${data.profileCompletion}%`, icon: User, href: "/talent/profile" },
            { label: "Saved Jobs", value: data.savedJobCount, icon: Heart, href: "/talent/jobs" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-4 py-5 transition-shadow hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-caption text-foreground-muted">{stat.label}</p>
                <div className="rounded-lg bg-[var(--primitive-green-100)] p-1.5">
                  <stat.icon size={16} weight="bold" className="text-[var(--primitive-green-700)]" />
                </div>
              </div>
              <p className="text-heading-sm font-semibold text-foreground-default">
                {stat.value}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Job Matches */}
      <section className="px-8 py-6 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-sm font-medium text-foreground-default">
            Recent Job Matches
          </h2>
          <Link
            href="/talent/jobs"
            className={cn(
              buttonVariants({ variant: "inverse" }),
              "rounded-[16px] px-4 py-3.5 text-caption font-bold"
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
                href={`/talent/jobs/${job.id}`}
                className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-4 transition-shadow hover:shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                  <Buildings size={20} weight="fill" className="text-[var(--primitive-blue-600)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-foreground-default truncate">
                    {job.title}
                  </p>
                  <p className="text-caption text-foreground-muted truncate">
                    {job.company}
                  </p>
                </div>
                {job.location && (
                  <div className="hidden sm:flex items-center gap-1 text-caption text-foreground-muted">
                    <MapPin size={14} />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.matchScore != null && (
                  <Badge variant={job.matchScore >= 80 ? "success" : job.matchScore >= 50 ? "warning" : "neutral"}>
                    {Math.round(job.matchScore)}% match
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8 text-center">
            <p className="text-body text-foreground-muted">
              No job matches yet. Complete your profile to get personalized recommendations.
            </p>
          </div>
        )}
      </section>

      {/* Recent Applications */}
      <section className="px-8 py-6 lg:px-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading-sm font-medium text-foreground-default">
            Applications
          </h2>
          <Link
            href="/talent/applications"
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
                <div className="flex-1 min-w-0">
                  <p className="text-body font-medium text-foreground-default truncate">
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
                <Badge variant={stageBadgeVariant(app.stage)}>
                  {app.stage}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8 text-center">
            <p className="text-body text-foreground-muted">
              You haven&apos;t applied to any roles yet. Browse jobs to get started.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

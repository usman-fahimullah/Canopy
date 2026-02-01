"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Plus,
  BriefcaseMetal,
  MapPin,
  Users,
  CalendarBlank,
} from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

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
  _count?: { applications: number };
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function statusBadgeVariant(status: string) {
  switch (status.toUpperCase()) {
    case "PUBLISHED":
      return "success" as const;
    case "DRAFT":
      return "neutral" as const;
    case "PAUSED":
      return "warning" as const;
    case "CLOSED":
      return "error" as const;
    default:
      return "neutral" as const;
  }
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatDate(dateString: string | null) {
  if (!dateString) return "--";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function RolesPage() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <PageHeader
        title="Roles"
        actions={
          <Link
            href="/employer/roles/new"
            className={cn(
              buttonVariants({ variant: "primary" }),
              "rounded-[16px]"
            )}
          >
            <Plus size={18} weight="bold" />
            Create Role
          </Link>
        }
      />

      <div className="px-8 py-6 lg:px-12">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primitive-blue-100)]">
              <BriefcaseMetal
                size={28}
                weight="fill"
                className="text-[var(--primitive-blue-600)]"
              />
            </div>
            <p className="text-body font-medium text-foreground-default mb-1">
              No roles posted yet
            </p>
            <p className="text-caption text-foreground-muted">
              Create your first role to start hiring.
            </p>
          </div>
        )}

        {/* Roles List */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-2">
              <span className="col-span-4 text-caption text-foreground-muted font-medium">
                Role
              </span>
              <span className="col-span-2 text-caption text-foreground-muted font-medium">
                Location
              </span>
              <span className="col-span-2 text-caption text-foreground-muted font-medium">
                Status
              </span>
              <span className="col-span-2 text-caption text-foreground-muted font-medium">
                Applications
              </span>
              <span className="col-span-2 text-caption text-foreground-muted font-medium">
                Posted
              </span>
            </div>

            {/* Job Cards */}
            {jobs.map((job) => {
              const appCount =
                job.applicationCount ?? job._count?.applications ?? 0;

              return (
                <Link
                  key={job.id}
                  href={`/employer/roles/${job.id}`}
                  className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-5 transition-shadow hover:shadow-card lg:grid lg:grid-cols-12 lg:items-center lg:gap-4 lg:py-4"
                >
                  {/* Title */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                      <BriefcaseMetal
                        size={20}
                        weight="fill"
                        className="text-[var(--primitive-blue-600)]"
                      />
                    </div>
                    <p className="text-body font-medium text-foreground-default truncate">
                      {job.title}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="col-span-2 flex items-center gap-1.5 text-caption text-foreground-muted">
                    <MapPin size={14} weight="bold" className="shrink-0" />
                    <span className="truncate">
                      {job.location || job.locationType || "Remote"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <Badge variant={statusBadgeVariant(job.status)} size="sm">
                      {formatStatus(job.status)}
                    </Badge>
                  </div>

                  {/* Applications Count */}
                  <div className="col-span-2 flex items-center gap-1.5 text-caption text-foreground-muted">
                    <Users size={14} weight="bold" className="shrink-0" />
                    <span>
                      {appCount} application{appCount !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Posted Date */}
                  <div className="col-span-2 flex items-center gap-1.5 text-caption text-foreground-muted">
                    <CalendarBlank
                      size={14}
                      weight="bold"
                      className="shrink-0"
                    />
                    <span>{formatDate(job.publishedAt)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

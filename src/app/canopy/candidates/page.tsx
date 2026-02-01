"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Star, CalendarBlank, BriefcaseMetal } from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface Application {
  id: string;
  name?: string;
  email?: string;
  stage?: string;
  status?: string;
  jobId?: string;
  matchScore?: number | null;
  submittedAt?: string;
  createdAt?: string;
  candidate?: {
    id: string;
    name: string;
    email: string;
  };
  job?: {
    id: string;
    title: string;
  };
}

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const PIPELINE_STAGES = ["All", "Applied", "Screening", "Interview", "Offer", "Hired"] as const;

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function stageBadgeVariant(stage: string) {
  switch (stage.toLowerCase()) {
    case "applied":
      return "info" as const;
    case "screening":
      return "success" as const;
    case "interview":
      return "feature" as const;
    case "offer":
      return "warning" as const;
    case "hired":
      return "success" as const;
    default:
      return "neutral" as const;
  }
}

function formatDate(dateString: string | undefined | null) {
  if (!dateString) return "--";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getCandidateName(app: Application): string {
  return app.candidate?.name || app.name || "Unknown Candidate";
}

function getCandidateEmail(app: Application): string {
  return app.candidate?.email || app.email || "";
}

function getJobTitle(app: Application): string {
  return app.job?.title || "Untitled Role";
}

function getStage(app: Application): string {
  return app.stage || app.status || "applied";
}

function getAppliedDate(app: Application): string | undefined {
  return app.submittedAt || app.createdAt;
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function CandidatesPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications?jobId=all");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications =
    activeFilter === "All"
      ? applications
      : applications.filter((app) => getStage(app).toLowerCase() === activeFilter.toLowerCase());

  return (
    <div>
      <PageHeader title="Candidates" />

      <div className="px-8 py-6 lg:px-12">
        {/* Stage Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {PIPELINE_STAGES.map((stage) => {
            const isActive = activeFilter === stage;
            const count =
              stage === "All"
                ? applications.length
                : applications.filter((app) => getStage(app).toLowerCase() === stage.toLowerCase())
                    .length;

            return (
              <Button
                key={stage}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setActiveFilter(stage)}
                className={cn(
                  "rounded-[16px] px-4",
                  isActive &&
                    "bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-600)] hover:bg-[var(--primitive-blue-200)]"
                )}
              >
                {stage}
                <span
                  className={cn(
                    "ml-1.5 text-caption-sm",
                    isActive ? "text-[var(--primitive-blue-500)]" : "text-foreground-muted"
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredApplications.length === 0 && (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primitive-blue-100)]">
              <Users size={28} weight="fill" className="text-[var(--primitive-blue-600)]" />
            </div>
            <p className="text-foreground-default mb-1 text-body font-medium">
              {activeFilter === "All" ? "No candidates yet" : `No candidates in ${activeFilter}`}
            </p>
            <p className="text-caption text-foreground-muted">
              {activeFilter === "All"
                ? "Post a role to start receiving applications."
                : "Candidates will appear here as they move through the pipeline."}
            </p>
          </div>
        )}

        {/* Candidate Cards */}
        {!loading && filteredApplications.length > 0 && (
          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const candidateName = getCandidateName(app);
              const stage = getStage(app);
              const appliedDate = getAppliedDate(app);

              return (
                <div
                  key={app.id}
                  className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-6 py-5 transition-shadow hover:shadow-card sm:flex-row sm:items-center sm:gap-4"
                >
                  {/* Avatar Initials */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primitive-blue-200)] text-caption font-bold text-[var(--primitive-blue-700)]">
                    {candidateName
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground-default truncate text-body font-medium">
                      {candidateName}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-foreground-muted">
                      <span className="flex items-center gap-1">
                        <BriefcaseMetal size={12} weight="bold" />
                        {getJobTitle(app)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarBlank size={12} weight="bold" />
                        {formatDate(appliedDate)}
                      </span>
                    </div>
                  </div>

                  {/* Match Score */}
                  {app.matchScore != null && (
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Star
                        size={14}
                        weight="fill"
                        className={cn(
                          app.matchScore >= 80
                            ? "text-[var(--primitive-green-600)]"
                            : app.matchScore >= 50
                              ? "text-[var(--primitive-yellow-500)]"
                              : "text-[var(--primitive-orange-500)]"
                        )}
                      />
                      <span
                        className={cn(
                          "text-caption font-medium",
                          app.matchScore >= 80
                            ? "text-[var(--primitive-green-700)]"
                            : app.matchScore >= 50
                              ? "text-[var(--primitive-yellow-700)]"
                              : "text-[var(--primitive-orange-700)]"
                        )}
                      >
                        {app.matchScore}%
                      </span>
                    </div>
                  )}

                  {/* Stage Badge */}
                  <Badge variant={stageBadgeVariant(stage)} size="sm">
                    {stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase()}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

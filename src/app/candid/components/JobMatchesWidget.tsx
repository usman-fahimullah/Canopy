"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Briefcase,
  MapPin,
  CaretRight,
  BookmarkSimple,
  ArrowSquareOut,
  Buildings,
} from "@phosphor-icons/react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  postedAt: string;
  matchScore?: number;
  url: string;
  remote?: boolean;
}

interface JobMatchesWidgetProps {
  className?: string;
  /** Maximum number of jobs to display */
  limit?: number;
  /** Title for the widget */
  title?: string;
}

/**
 * JobMatchesWidget displays job matches from Green Jobs Board.
 * Integrates with greenjobsboard.us to show relevant climate jobs.
 */
export function JobMatchesWidget({
  className,
  limit = 3,
  title = "Jobs for You",
}: JobMatchesWidgetProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual Green Jobs Board API integration
        // For now, using mock data
        const mockJobs: Job[] = [
          {
            id: "1",
            title: "Product Manager - Clean Energy",
            company: "Aurora Solar",
            location: "San Francisco, CA",
            salary: "$150K - $180K",
            postedAt: "2 days ago",
            matchScore: 94,
            url: "https://greenjobsboard.us/jobs/1",
            remote: false,
          },
          {
            id: "2",
            title: "Senior Software Engineer",
            company: "Watershed",
            location: "Remote",
            salary: "$160K - $200K",
            postedAt: "3 days ago",
            matchScore: 89,
            url: "https://greenjobsboard.us/jobs/2",
            remote: true,
          },
          {
            id: "3",
            title: "Sustainability Analyst",
            company: "Stripe Climate",
            location: "New York, NY",
            salary: "$120K - $150K",
            postedAt: "5 days ago",
            matchScore: 85,
            url: "https://greenjobsboard.us/jobs/3",
            remote: false,
          },
          {
            id: "4",
            title: "Climate Policy Advisor",
            company: "RMI",
            location: "Boulder, CO",
            salary: "$100K - $130K",
            postedAt: "1 week ago",
            matchScore: 82,
            url: "https://greenjobsboard.us/jobs/4",
            remote: true,
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setJobs(mockJobs.slice(0, limit));

        // Load saved jobs from localStorage
        const saved = localStorage.getItem("candid-saved-jobs");
        if (saved) {
          setSavedJobs(new Set(JSON.parse(saved)));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  const handleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      localStorage.setItem("candid-saved-jobs", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border border-[var(--border-default)]">
              <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className={cn("p-6 text-center", className)}>
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-[var(--primitive-blue-100)] mb-4">
          <Briefcase size={24} className="text-[var(--primitive-green-700)]" />
        </div>
        <h3 className="text-body-strong font-medium text-foreground-default mb-1">
          No job matches yet
        </h3>
        <p className="text-caption text-foreground-muted mb-4">
          Complete your profile to get personalized job recommendations.
        </p>
        <Button variant="primary" size="sm" asChild>
          <Link href="/candid/profile">Complete Profile</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-[var(--primitive-green-700)]" weight="fill" />
          <h3 className="text-body-strong font-medium text-foreground-default">
            {title}
          </h3>
        </div>
        <Link
          href="https://greenjobsboard.us"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "link", size: "sm" }), "gap-1")}
        >
          View all
          <ArrowSquareOut size={14} />
        </Link>
      </div>

      {/* Jobs list */}
      <div className="divide-y divide-[var(--border-default)]">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-start gap-3 p-4 hover:bg-[var(--background-subtle)] transition-colors"
          >
            {/* Company icon placeholder */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--background-subtle)] flex-shrink-0">
              <Buildings size={20} className="text-foreground-muted" />
            </div>

            {/* Job info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm font-medium text-foreground-default hover:text-[var(--primitive-green-700)] transition-colors line-clamp-1"
                  >
                    {job.title}
                  </a>
                  <p className="text-caption text-foreground-muted">
                    {job.company}
                  </p>
                </div>
                {job.matchScore && (
                  <Chip variant="primary" size="sm" className="flex-shrink-0">
                    {job.matchScore}% match
                  </Chip>
                )}
              </div>

              <div className="mt-2 flex items-center gap-3 text-caption text-foreground-muted">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {job.remote ? "Remote" : job.location}
                </span>
                {job.salary && (
                  <span>{job.salary}</span>
                )}
                <span>{job.postedAt}</span>
              </div>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  asChild
                >
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    View Job
                  </a>
                </Button>
                <Button
                  variant={savedJobs.has(job.id) ? "secondary" : "tertiary"}
                  size="sm"
                  onClick={() => handleSaveJob(job.id)}
                >
                  <BookmarkSimple
                    size={14}
                    weight={savedJobs.has(job.id) ? "fill" : "regular"}
                  />
                  {savedJobs.has(job.id) ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3">
        <p className="text-caption text-foreground-muted text-center">
          Powered by{" "}
          <a
            href="https://greenjobsboard.us"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--primitive-green-700)] hover:underline"
          >
            Green Jobs Board
          </a>
        </p>
      </div>
    </Card>
  );
}

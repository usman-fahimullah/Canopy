"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { sanitizeHtml } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import {
  Briefcase,
  MapPin,
  Buildings,
  BookmarkSimple,
  Funnel,
  ArrowLeft,
  CaretDown,
  CaretUp,
  CurrencyDollar,
  Clock,
  Leaf,
  ArrowSquareOut,
  House,
  MapTrifold,
  Desktop,
  Lightning,
} from "@phosphor-icons/react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isBipocOwned: boolean;
  isWomenOwned: boolean;
  isVeteranOwned: boolean;
}

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
  description: string;
  location: string | null;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  climateCategory: string | null;
  impactDescription: string | null;
  greenSkills: string[];
  experienceLevel: "ENTRY" | "INTERMEDIATE" | "SENIOR" | "EXECUTIVE" | null;
  isFeatured: boolean;
  publishedAt: string | null;
  closesAt: string | null;
  organization: Organization;
  pathway: Pathway | null;
  matchScore?: number;
  matchReasons?: string[];
  isSaved?: boolean;
  savedAt?: string;
}

const locationTypeOptions = [
  { value: "REMOTE", label: "Remote", icon: Desktop },
  { value: "HYBRID", label: "Hybrid", icon: House },
  { value: "ONSITE", label: "On-site", icon: MapTrifold },
];

const experienceLevelOptions = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "INTERMEDIATE", label: "Mid Level" },
  { value: "SENIOR", label: "Senior" },
  { value: "EXECUTIVE", label: "Executive" },
];

const employmentTypeOptions = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return "";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  if (min && max) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }
  if (min) return `${formatter.format(min)}+`;
  if (max) return `Up to ${formatter.format(max)}`;
  return "";
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString();
}

// Skeleton for Job List Item
function JobListItemSkeleton() {
  return (
    <div className="border-l-2 border-l-transparent px-4 py-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 flex-shrink-0 rounded-lg" animation="shimmer" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" animation="shimmer" />
          <Skeleton className="h-3 w-1/2" animation="shimmer" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-16" animation="shimmer" />
            <Skeleton className="h-3 w-12" animation="shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for Job Detail Panel
function JobDetailPanelSkeleton() {
  return (
    <div className="flex h-full animate-fade-in flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8">
          <div className="mb-8">
            <Skeleton className="mb-4 h-12 w-12 rounded-lg" animation="shimmer" />
            <Skeleton className="mb-2 h-7 w-64" animation="shimmer" />
            <Skeleton className="mb-4 h-5 w-48" animation="shimmer" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" animation="shimmer" />
              <Skeleton className="h-4 w-24" animation="shimmer" />
              <Skeleton className="h-4 w-20" animation="shimmer" />
            </div>
          </div>
          <section className="mb-8">
            <Skeleton className="mb-3 h-4 w-24" animation="shimmer" />
            <SkeletonText lines={6} />
          </section>
          <section className="mb-8">
            <Skeleton className="mb-3 h-4 w-28" animation="shimmer" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" animation="shimmer" />
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="border-border-default bg-background-default border-t px-6 py-4">
        <div className="mx-auto flex max-w-2xl gap-3">
          <Skeleton className="h-12 flex-1 rounded-lg" animation="shimmer" />
          <Skeleton className="h-12 w-32 rounded-lg" animation="shimmer" />
        </div>
      </div>
    </div>
  );
}

// Job List Item Component
function JobListItem({
  job,
  isSelected,
  onClick,
}: {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}) {
  const LocationIcon =
    locationTypeOptions.find((o) => o.value === job.locationType)?.icon || MapPin;

  return (
    <button
      onClick={onClick}
      className={`w-full border-l-2 px-4 py-3 text-left transition-all duration-150 ${
        isSelected
          ? "border-l-foreground-brand bg-background-brand-subtle"
          : "border-l-transparent hover:bg-background-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background-subtle">
          {job.organization.logo ? (
            <Image
              src={job.organization.logo}
              alt={job.organization.name}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <Buildings size={20} className="text-foreground-muted" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`truncate text-body-sm font-medium ${
                isSelected ? "text-foreground-brand" : "text-foreground-default"
              }`}
            >
              {job.title}
            </p>
            {job.matchScore && (
              <Chip variant="primary" size="sm" className="flex-shrink-0">
                {job.matchScore}%
              </Chip>
            )}
          </div>
          <p className="mt-0.5 truncate text-caption text-foreground-muted">
            {job.organization.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-caption text-foreground-subtle">
            <span className="flex items-center gap-0.5">
              <LocationIcon size={12} />
              {job.locationType === "REMOTE"
                ? "Remote"
                : job.location?.split(",")[0] || job.locationType}
            </span>
            {job.salaryMin && (
              <span className="flex items-center gap-0.5">
                <CurrencyDollar size={12} />
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// Job Detail Panel Component
function JobDetailPanel({
  job,
  onSaveJob,
  saving,
  onBack,
}: {
  job: Job;
  onSaveJob: (jobId: string) => void;
  saving: boolean;
  onBack: () => void;
}) {
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);
  const LocationIcon =
    locationTypeOptions.find((o) => o.value === job.locationType)?.icon || MapPin;

  return (
    <div className="flex h-full animate-fade-in flex-col" key={job.id}>
      {/* Mobile Back Button */}
      <div className="border-border-default border-b px-4 py-3 lg:hidden">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={18} className="mr-2" />
          Back to jobs
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {/* Job Header */}
          <div className="mb-8">
            {/* Company Logo */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-background-subtle">
              {job.organization.logo ? (
                <Image
                  src={job.organization.logo}
                  alt={job.organization.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Buildings size={28} className="text-foreground-muted" />
              )}
            </div>

            <h1 className="text-foreground-default text-heading-md font-semibold">{job.title}</h1>
            <p className="mt-1 text-body text-foreground-muted">{job.organization.name}</p>

            {/* Diversity Badges */}
            {(job.organization.isBipocOwned ||
              job.organization.isWomenOwned ||
              job.organization.isVeteranOwned) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {job.organization.isBipocOwned && (
                  <Chip variant="neutral" size="sm">
                    BIPOC-owned
                  </Chip>
                )}
                {job.organization.isWomenOwned && (
                  <Chip variant="neutral" size="sm">
                    Women-owned
                  </Chip>
                )}
                {job.organization.isVeteranOwned && (
                  <Chip variant="neutral" size="sm">
                    Veteran-owned
                  </Chip>
                )}
              </div>
            )}

            {/* Match Score */}
            {job.matchScore && (
              <div className="mt-4 rounded-lg border border-border-brand bg-background-brand-subtle p-3">
                <div className="mb-1 flex items-center gap-2">
                  <Lightning size={16} weight="fill" className="text-foreground-brand" />
                  <span className="text-body-sm font-semibold text-foreground-brand">
                    {job.matchScore}% Match
                  </span>
                </div>
                {job.matchReasons && job.matchReasons.length > 0 && (
                  <ul className="space-y-0.5 text-caption text-foreground-muted">
                    {job.matchReasons.map((reason, i) => (
                      <li key={i}>• {reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-caption text-foreground-muted">
              <span className="flex items-center gap-1">
                <LocationIcon size={14} />
                {job.locationType === "REMOTE" ? "Remote" : job.location || job.locationType}
              </span>
              {salary && (
                <span className="flex items-center gap-1">
                  <CurrencyDollar size={14} />
                  {salary}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                {employmentTypeOptions.find((o) => o.value === job.employmentType)?.label ||
                  job.employmentType}
              </span>
              {job.publishedAt && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(job.publishedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Impact Description */}
          {job.impactDescription && (
            <section className="mb-8 rounded-lg border border-[var(--primitive-green-200)] bg-[var(--primitive-green-100)] p-4">
              <div className="mb-2 flex items-center gap-2">
                <Leaf size={16} weight="fill" className="text-[var(--primitive-green-700)]" />
                <h2 className="text-body-sm font-semibold text-[var(--primitive-green-800)]">
                  Climate Impact
                </h2>
              </div>
              <p className="text-body-sm text-[var(--primitive-green-800)]">
                {job.impactDescription}
              </p>
            </section>
          )}

          {/* Job Description */}
          <section className="mb-8">
            <h2 className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-foreground-muted">
              About this role
            </h2>
            <div
              className="text-foreground-default prose prose-sm max-w-none text-body leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
            />
          </section>

          {/* Green Skills */}
          {job.greenSkills.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-foreground-muted">
                Green Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.greenSkills.map((skill) => (
                  <Chip key={skill} variant="primary" size="sm">
                    {skill}
                  </Chip>
                ))}
              </div>
            </section>
          )}

          {/* Pathway */}
          {job.pathway && (
            <section className="mb-8">
              <h2 className="mb-3 text-body-sm font-semibold uppercase tracking-wide text-foreground-muted">
                Career Pathway
              </h2>
              <Chip variant="neutral" size="md">
                {job.pathway.name}
              </Chip>
            </section>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="border-border-default bg-background-default border-t px-6 py-4">
        <div className="mx-auto flex max-w-2xl gap-3">
          <Button variant="primary" size="lg" className="flex-1" asChild>
            <Link href={`/apply/${job.id}`}>
              <ArrowSquareOut size={18} className="mr-2" />
              Apply Now
            </Link>
          </Button>
          <Button
            variant={job.isSaved ? "secondary" : "tertiary"}
            size="lg"
            onClick={() => onSaveJob(job.id)}
            loading={saving}
          >
            <BookmarkSimple size={18} weight={job.isSaved ? "fill" : "regular"} className="mr-2" />
            {job.isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty Selection State
function EmptySelectionState() {
  return (
    <div className="flex h-full animate-fade-in items-center justify-center p-8">
      <div className="max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-muted">
          <Briefcase size={28} className="text-foreground-muted" />
        </div>
        <h2 className="text-foreground-default mb-2 text-heading-sm font-semibold">Select a job</h2>
        <p className="text-body text-foreground-muted">
          Choose a job from the list to view details and apply.
        </p>
      </div>
    </div>
  );
}

export default function JobsBrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}

function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedJobId = searchParams.get("job");
  const tab = searchParams.get("tab") || "matches";

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationType, setLocationType] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = "/api/jobs";
      const params = new URLSearchParams();

      if (tab === "matches") {
        endpoint = "/api/jobs/matches";
        params.set("limit", "50");
      } else if (tab === "saved") {
        endpoint = "/api/jobs/saved";
      } else {
        // Browse all jobs
        if (searchQuery) params.set("search", searchQuery);
        if (locationType) params.set("locationType", locationType);
        if (experienceLevel) params.set("experienceLevel", experienceLevel);
        params.set("limit", "50");
      }

      const res = await fetch(`${endpoint}?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      } else {
        throw new Error("Failed to fetch jobs");
      }
    } catch {
      setError("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [tab, searchQuery, locationType, experienceLevel]);

  useEffect(() => {
    const debounce = setTimeout(fetchJobs, 300);
    return () => clearTimeout(debounce);
  }, [fetchJobs]);

  const handleSelectJob = (jobId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("job", jobId);
    router.push(`/candid/jobs?${params.toString()}`, { scroll: false });
  };

  const handleBackToList = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("job");
    router.push(`/candid/jobs?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (newTab: string) => {
    const params = new URLSearchParams();
    params.set("tab", newTab);
    router.push(`/candid/jobs?${params.toString()}`, { scroll: false });
  };

  const handleSaveJob = async (jobId: string) => {
    setSaving(jobId);
    setError(null);
    try {
      const job = jobs.find((j) => j.id === jobId);
      const isSaved = job?.isSaved;

      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      });

      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isSaved: !isSaved } : j)));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save job");
      }
    } catch {
      setError("Failed to save job");
    } finally {
      setSaving(null);
    }
  };

  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  const activeFilters = [locationType, experienceLevel].filter(Boolean).length;

  return (
    <div className="flex h-[calc(100vh-5rem)] lg:h-screen">
      {/* Left Panel - Job List */}
      <div
        className={`bg-background-default border-border-default flex w-full flex-shrink-0 flex-col border-r lg:w-[360px] xl:w-[400px] ${
          selectedJobId ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="border-border-default border-b px-4 py-5">
          <div className="mb-1 flex items-center gap-2">
            <Briefcase size={22} weight="duotone" className="text-foreground-brand" />
            <h1 className="text-foreground-default text-heading-sm font-semibold">Climate Jobs</h1>
          </div>
          <p className="text-caption text-foreground-muted">
            Find your next role in the green economy
          </p>
        </div>

        {/* Tabs */}
        <div className="border-border-default flex gap-1 border-b px-4 py-2">
          <button
            onClick={() => handleTabChange("matches")}
            className={`rounded-lg px-3 py-2 text-body-sm font-medium transition-colors ${
              tab === "matches"
                ? "bg-background-brand-subtle text-foreground-brand"
                : "hover:text-foreground-default text-foreground-muted hover:bg-background-subtle"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => handleTabChange("browse")}
            className={`rounded-lg px-3 py-2 text-body-sm font-medium transition-colors ${
              tab === "browse"
                ? "bg-background-brand-subtle text-foreground-brand"
                : "hover:text-foreground-default text-foreground-muted hover:bg-background-subtle"
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => handleTabChange("saved")}
            className={`rounded-lg px-3 py-2 text-body-sm font-medium transition-colors ${
              tab === "saved"
                ? "bg-background-brand-subtle text-foreground-brand"
                : "hover:text-foreground-default text-foreground-muted hover:bg-background-subtle"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Search & Filter Toggle (only for browse tab) */}
        {tab === "browse" && (
          <div className="border-border-default space-y-3 border-b px-4 py-3">
            <SearchInput
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="compact"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="hover:text-foreground-default flex items-center gap-2 text-caption text-foreground-muted transition-colors"
            >
              <Funnel size={14} />
              <span>Filters</span>
              {activeFilters > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-background-brand text-[10px] font-bold text-foreground-on-emphasis">
                  {activeFilters}
                </span>
              )}
              {showFilters ? <CaretUp size={14} /> : <CaretDown size={14} />}
            </button>

            {/* Filter Panel */}
            {showFilters && (
              <div className="animate-fade-in space-y-4 pt-2">
                {/* Location Type */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-caption font-medium text-foreground-muted">Work Type</p>
                    {locationType && (
                      <button
                        className="hover:text-foreground-default text-caption text-foreground-muted"
                        onClick={() => setLocationType("")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {locationTypeOptions.map((opt) => (
                      <Chip
                        key={opt.value}
                        variant={locationType === opt.value ? "primary" : "neutral"}
                        size="sm"
                        onClick={() => setLocationType(locationType === opt.value ? "" : opt.value)}
                      >
                        {opt.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-caption font-medium text-foreground-muted">Experience</p>
                    {experienceLevel && (
                      <button
                        className="hover:text-foreground-default text-caption text-foreground-muted"
                        onClick={() => setExperienceLevel("")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {experienceLevelOptions.map((opt) => (
                      <Chip
                        key={opt.value}
                        variant={experienceLevel === opt.value ? "primary" : "neutral"}
                        size="sm"
                        onClick={() =>
                          setExperienceLevel(experienceLevel === opt.value ? "" : opt.value)
                        }
                      >
                        {opt.label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="px-4 py-3">
            <Alert variant="critical" dismissible onDismiss={() => setError(null)}>
              {error}
            </Alert>
          </div>
        )}

        {/* Job List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="divide-y divide-border-muted">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <JobListItemSkeleton key={i} />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="divide-y divide-border-muted">
              {jobs.map((job, index) => (
                <div
                  key={job.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <JobListItem
                    job={job}
                    isSelected={job.id === selectedJobId}
                    onClick={() => handleSelectJob(job.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <EmptyState
                icon={<Briefcase size={32} className="text-foreground-muted" />}
                title={tab === "saved" ? "No saved jobs" : "No jobs found"}
                description={
                  tab === "saved"
                    ? "Save jobs you're interested in to view them here"
                    : tab === "matches"
                      ? "Complete your profile to get personalized job matches"
                      : "Try adjusting your filters"
                }
                size="sm"
                action={
                  searchQuery || locationType || experienceLevel
                    ? {
                        label: "Clear filters",
                        onClick: () => {
                          setSearchQuery("");
                          setLocationType("");
                          setExperienceLevel("");
                        },
                      }
                    : tab === "matches"
                      ? {
                          label: "Complete Profile",
                          onClick: () => router.push("/candid/profile"),
                        }
                      : undefined
                }
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border-default border-t px-4 py-3">
          <p className="text-caption text-foreground-muted">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""}{" "}
            {tab === "matches" ? "matched" : tab === "saved" ? "saved" : "found"}
          </p>
        </div>
      </div>

      {/* Right Panel - Job Detail */}
      <div className={`flex-1 bg-background-subtle ${selectedJobId ? "flex" : "hidden lg:flex"}`}>
        {selectedJobId && loading ? (
          <JobDetailPanelSkeleton />
        ) : selectedJob ? (
          <JobDetailPanel
            key={selectedJob.id}
            job={selectedJob}
            onSaveJob={handleSaveJob}
            saving={saving === selectedJob.id}
            onBack={handleBackToList}
          />
        ) : (
          <EmptySelectionState />
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="px-4 py-3 border-l-2 border-l-transparent">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" animation="shimmer" />
        <div className="flex-1 min-w-0 space-y-2">
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
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Skeleton className="h-12 w-12 rounded-lg mb-4" animation="shimmer" />
            <Skeleton className="h-7 w-64 mb-2" animation="shimmer" />
            <Skeleton className="h-5 w-48 mb-4" animation="shimmer" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" animation="shimmer" />
              <Skeleton className="h-4 w-24" animation="shimmer" />
              <Skeleton className="h-4 w-20" animation="shimmer" />
            </div>
          </div>
          <section className="mb-8">
            <Skeleton className="h-4 w-24 mb-3" animation="shimmer" />
            <SkeletonText lines={6} />
          </section>
          <section className="mb-8">
            <Skeleton className="h-4 w-28 mb-3" animation="shimmer" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" animation="shimmer" />
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="border-t border-border-default bg-background-default px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
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
  const LocationIcon = locationTypeOptions.find(o => o.value === job.locationType)?.icon || MapPin;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 transition-all duration-150 border-l-2 ${
        isSelected
          ? "bg-background-brand-subtle border-l-foreground-brand"
          : "border-l-transparent hover:bg-background-subtle"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Company Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background-subtle flex-shrink-0 overflow-hidden">
          {job.organization.logo ? (
            <img
              src={job.organization.logo}
              alt={job.organization.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Buildings size={20} className="text-foreground-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-body-sm font-medium truncate ${
              isSelected ? "text-foreground-brand" : "text-foreground-default"
            }`}>
              {job.title}
            </p>
            {job.matchScore && (
              <Chip variant="primary" size="sm" className="flex-shrink-0">
                {job.matchScore}%
              </Chip>
            )}
          </div>
          <p className="text-caption text-foreground-muted truncate mt-0.5">
            {job.organization.name}
          </p>
          <div className="flex items-center gap-2 mt-1 text-caption text-foreground-subtle flex-wrap">
            <span className="flex items-center gap-0.5">
              <LocationIcon size={12} />
              {job.locationType === "REMOTE" ? "Remote" : job.location?.split(",")[0] || job.locationType}
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
  const LocationIcon = locationTypeOptions.find(o => o.value === job.locationType)?.icon || MapPin;

  return (
    <div className="h-full flex flex-col animate-fade-in" key={job.id}>
      {/* Mobile Back Button */}
      <div className="lg:hidden px-4 py-3 border-b border-border-default">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={18} className="mr-2" />
          Back to jobs
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Job Header */}
          <div className="mb-8">
            {/* Company Logo */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-background-subtle mb-4 overflow-hidden">
              {job.organization.logo ? (
                <img
                  src={job.organization.logo}
                  alt={job.organization.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Buildings size={28} className="text-foreground-muted" />
              )}
            </div>

            <h1 className="text-heading-md font-semibold text-foreground-default">
              {job.title}
            </h1>
            <p className="text-body text-foreground-muted mt-1">
              {job.organization.name}
            </p>

            {/* Diversity Badges */}
            {(job.organization.isBipocOwned || job.organization.isWomenOwned || job.organization.isVeteranOwned) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.organization.isBipocOwned && (
                  <Chip variant="neutral" size="sm">BIPOC-owned</Chip>
                )}
                {job.organization.isWomenOwned && (
                  <Chip variant="neutral" size="sm">Women-owned</Chip>
                )}
                {job.organization.isVeteranOwned && (
                  <Chip variant="neutral" size="sm">Veteran-owned</Chip>
                )}
              </div>
            )}

            {/* Match Score */}
            {job.matchScore && (
              <div className="mt-4 p-3 rounded-lg bg-background-brand-subtle border border-border-brand">
                <div className="flex items-center gap-2 mb-1">
                  <Lightning size={16} weight="fill" className="text-foreground-brand" />
                  <span className="text-body-sm font-semibold text-foreground-brand">
                    {job.matchScore}% Match
                  </span>
                </div>
                {job.matchReasons && job.matchReasons.length > 0 && (
                  <ul className="text-caption text-foreground-muted space-y-0.5">
                    {job.matchReasons.map((reason, i) => (
                      <li key={i}>• {reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-caption text-foreground-muted">
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
                {employmentTypeOptions.find(o => o.value === job.employmentType)?.label || job.employmentType}
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
            <section className="mb-8 p-4 rounded-lg bg-[var(--primitive-green-100)] border border-[var(--primitive-green-200)]">
              <div className="flex items-center gap-2 mb-2">
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
            <h2 className="text-body-sm font-semibold text-foreground-muted uppercase tracking-wide mb-3">
              About this role
            </h2>
            <div
              className="text-body text-foreground-default leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </section>

          {/* Green Skills */}
          {job.greenSkills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-body-sm font-semibold text-foreground-muted uppercase tracking-wide mb-3">
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
              <h2 className="text-body-sm font-semibold text-foreground-muted uppercase tracking-wide mb-3">
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
      <div className="border-t border-border-default bg-background-default px-6 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            asChild
          >
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
            <BookmarkSimple
              size={18}
              weight={job.isSaved ? "fill" : "regular"}
              className="mr-2"
            />
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
    <div className="h-full flex items-center justify-center p-8 animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-muted">
          <Briefcase size={28} className="text-foreground-muted" />
        </div>
        <h2 className="text-heading-sm font-semibold text-foreground-default mb-2">
          Select a job
        </h2>
        <p className="text-body text-foreground-muted">
          Choose a job from the list to view details and apply.
        </p>
      </div>
    </div>
  );
}

export default function JobsBrowsePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    }>
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
      const job = jobs.find(j => j.id === jobId);
      const isSaved = job?.isSaved;

      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: isSaved ? "DELETE" : "POST",
      });

      if (res.ok) {
        setJobs(prev => prev.map(j =>
          j.id === jobId ? { ...j, isSaved: !isSaved } : j
        ));
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
    <div className="h-[calc(100vh-5rem)] lg:h-screen flex">
      {/* Left Panel - Job List */}
      <div
        className={`w-full lg:w-[360px] xl:w-[400px] flex-shrink-0 bg-background-default border-r border-border-default flex flex-col ${
          selectedJobId ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="px-4 py-5 border-b border-border-default">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={22} weight="duotone" className="text-foreground-brand" />
            <h1 className="text-heading-sm font-semibold text-foreground-default">
              Climate Jobs
            </h1>
          </div>
          <p className="text-caption text-foreground-muted">
            Find your next role in the green economy
          </p>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 border-b border-border-default flex gap-1">
          <button
            onClick={() => handleTabChange("matches")}
            className={`px-3 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              tab === "matches"
                ? "bg-background-brand-subtle text-foreground-brand"
                : "text-foreground-muted hover:text-foreground-default hover:bg-background-subtle"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => handleTabChange("browse")}
            className={`px-3 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              tab === "browse"
                ? "bg-background-brand-subtle text-foreground-brand"
                : "text-foreground-muted hover:text-foreground-default hover:bg-background-subtle"
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => handleTabChange("saved")}
            className={`px-3 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              tab === "saved"
                ? "bg-background-brand-subtle text-foreground-brand"
                : "text-foreground-muted hover:text-foreground-default hover:bg-background-subtle"
            }`}
          >
            Saved
          </button>
        </div>

        {/* Search & Filter Toggle (only for browse tab) */}
        {tab === "browse" && (
          <div className="px-4 py-3 border-b border-border-default space-y-3">
            <SearchInput
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="compact"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-caption text-foreground-muted hover:text-foreground-default transition-colors"
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
              <div className="pt-2 space-y-4 animate-fade-in">
                {/* Location Type */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-caption font-medium text-foreground-muted">Work Type</p>
                    {locationType && (
                      <button
                        className="text-caption text-foreground-muted hover:text-foreground-default"
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
                        onClick={() =>
                          setLocationType(locationType === opt.value ? "" : opt.value)
                        }
                      >
                        {opt.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-caption font-medium text-foreground-muted">Experience</p>
                    {experienceLevel && (
                      <button
                        className="text-caption text-foreground-muted hover:text-foreground-default"
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
            <Alert
              variant="critical"
              dismissible
              onDismiss={() => setError(null)}
            >
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
                  (searchQuery || locationType || experienceLevel)
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
        <div className="px-4 py-3 border-t border-border-default">
          <p className="text-caption text-foreground-muted">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""}{" "}
            {tab === "matches" ? "matched" : tab === "saved" ? "saved" : "found"}
          </p>
        </div>
      </div>

      {/* Right Panel - Job Detail */}
      <div
        className={`flex-1 bg-background-subtle ${
          selectedJobId ? "flex" : "hidden lg:flex"
        }`}
      >
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

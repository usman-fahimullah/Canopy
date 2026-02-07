# Feature Spec: Job Detail Page Full Rebuild

**Project:** Canopy (Next.js 14.2 + Tailwind CSS + Prisma)
**Status:** Ready for Implementation
**Last Updated:** 2026-02-06
**Author:** Engineering Team

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Structure](#2-file-structure)
3. [TypeScript Interfaces](#3-typescript-interfaces)
4. [Component Specifications](#4-component-specifications)
5. [API Contracts](#5-api-contracts)
6. [Implementation Phases](#6-implementation-phases)
7. [Testing Plan](#7-testing-plan)
8. [Migration Strategy](#8-migration-strategy)

---

## 1. Architecture Overview

### 1.1 Server vs Client Strategy

**Server Component (`page.tsx`)**

- Fetches job data from Prisma at request time
- Renders the main layout structure
- Passes data down to child components as props
- Zero client-side data fetching
- Uses `Suspense` with fallback skeletons for async sections

**Client Components (`_components/` directory)**

- All interactive features: save toggle, notes editor, tab switching
- Use React hooks for state management
- Optimistic updates for save/unsave
- Auto-save for notes with debouncing
- Isolated client-side logic via component extraction

**Layout Pattern:**

```
page.tsx (server)
├── JobDetailSkeleton (fallback via Suspense)
├── JobHeader (client component — interactive CTA buttons)
├── Main content area (flex layout)
│   ├── JobDescription (server — prose rendering)
│   └── Sidebar (server container)
│       └── SidebarTabs (client — tab state management)
│           ├── Job Details tab (server-rendered content)
│           │   ├── ApplyBeforeCard (server)
│           │   ├── RecruiterCard (server)
│           │   ├── HighlightsCard (server)
│           │   ├── RoleOverviewCard (server)
│           │   ├── AboutCompanyCard (server)
│           │   └── ExploreMoreJobs (server)
│           └── Your Notes tab
│               └── NotesEditor (client — interactive textarea)
```

### 1.2 Data Fetching Approach

**Single Server-Side Fetch:**

- Query Prisma directly in `page.tsx` server component
- Use `Promise.all()` for parallel queries:
  1. Fetch full job detail with organization, pathway
  2. Count similar jobs query (for pagination if needed later)
  3. Fetch top 3 similar jobs by multi-signal scoring
  4. Fetch current user's saved state and notes (if authenticated)
- Handle `notFound()` for deleted/private jobs
- No client-side `useEffect` fetching

**Performance Optimizations:**

- Use Prisma `select` to fetch only needed fields
- Join organization data in single query
- Use database-level filtering for published/non-expired jobs
- Similar jobs scoring done in memory after fetch (top 3)

### 1.3 State Management

| State Type        | Location             | Mechanism                                                                  |
| ----------------- | -------------------- | -------------------------------------------------------------------------- |
| **Save toggle**   | Client (SaveButton)  | `useState` with optimistic update; reverts on API error                    |
| **Notes content** | Client (NotesEditor) | `useState` with debounced auto-save via `useDebouncedCallback`             |
| **Tab selection** | Client (SidebarTabs) | `useState` (defaultValue managed by Radix Tabs)                            |
| **Page data**     | Server (page.tsx)    | Direct Prisma fetch; passed as immutable props down tree                   |
| **URL params**    | Next.js router       | Job slug via `[id]` dynamic route segment                                  |
| **Auth state**    | Server               | `getServerSession()` call in page.tsx; passed to auth-dependent components |

---

## 2. File Structure

```
src/app/jobs/search/[id]/
├── page.tsx                           # Server component — data fetching, main layout
├── loading.tsx                        # Skeleton fallback
├── error.tsx                          # Error boundary
├── _components/
│   ├── JobHeader.tsx                  # Client — title, company, badges, CTAs
│   ├── JobDescription.tsx             # Server — prose rendering with sanitized HTML
│   ├── SidebarTabs.tsx                # Client — tabs container, state management
│   ├── ApplyBeforeCard.tsx            # Server — deadline, closing soon badge
│   ├── RecruiterCard.tsx              # Server — avatar, name, title, mailto CTA
│   ├── HighlightsCard.tsx             # Server — salary, education, special reqs
│   ├── RoleOverviewCard.tsx           # Server — job type, level, location, workplace
│   ├── AboutCompanyCard.tsx           # Server — company logo, description, read more
│   ├── ExploreMoreJobs.tsx            # Server — similar job cards grid
│   ├── SaveButton.tsx                 # Client — interactive save toggle with icons
│   ├── NotesEditor.tsx                # Client — textarea with auto-save, status indicator
│   └── types.ts                       # Shared prop interfaces for _components
```

---

## 3. TypeScript Interfaces

### 3.1 Page-Level Data Types

```typescript
// src/app/jobs/search/[id]/types.ts

/**
 * Full job detail with all relations and computed fields.
 * This is what the server component fetches and passes to children.
 */
export interface JobDetailPageData {
  job: JobDetail;
  similarJobs: SimilarJob[];
  isAuthenticated: boolean;
  isSaved: boolean;
  savedNotes: string | null;
}

/**
 * Complete job listing with all required fields for display.
 * Source: Prisma Job model with organization, pathway relations.
 */
export interface JobDetail {
  id: string;
  title: string;
  slug: string;
  description: string; // HTML or plain text, will be sanitized
  location: string | null;
  locationType: "REMOTE" | "HYBRID" | "ONSITE";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: "USD"; // Only USD supported currently
  climateCategory: string | null; // Maps to JobCategoryType in design system
  impactDescription: string | null; // Compensation note, stipend info
  greenSkills: string[];
  requiredCerts: string[];
  experienceLevel: "ENTRY" | "INTERMEDIATE" | "SENIOR" | "EXECUTIVE" | null;
  isFeatured: boolean;
  publishedAt: string | null; // ISO 8601
  closesAt: string | null; // ISO 8601 deadline
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
  organization: Organization;
  pathway: Pathway | null;
  recruiter: Recruiter | null; // NEW — from org team members
}

/**
 * Organization data for display.
 */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  isBipocOwned?: boolean;
  isWomenOwned?: boolean;
  isVeteranOwned?: boolean;
  description?: string | null;
}

/**
 * Pathway/category data.
 */
export interface Pathway {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
}

/**
 * Recruiter data from Organization team members.
 */
export interface Recruiter {
  id: string;
  name: string;
  title: string;
  avatarUrl: string | null;
  email: string; // Required — for mailto: link
}

/**
 * Similar/related job for the "Explore More Jobs" section.
 * Subset of JobDetail fields + organization info.
 */
export interface SimilarJob {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: "REMOTE" | "HYBRID" | "ONSITE";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  climateCategory: string | null;
  publishedAt: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    isBipocOwned?: boolean;
  };
  pathway: Pathway | null;
}
```

### 3.2 Component Prop Interfaces

```typescript
// src/app/jobs/search/[id]/_components/types.ts

// ============ JobHeader.tsx ============
export interface JobHeaderProps {
  job: JobDetail;
  isAuthenticated: boolean;
  isSaved: boolean;
  onSaveChange: (newState: boolean) => void;
}

// ============ JobDescription.tsx ============
export interface JobDescriptionProps {
  description: string;
  title: string;
}

// ============ SidebarTabs.tsx ============
export interface SidebarTabsProps {
  job: JobDetail;
  isSaved: boolean;
  savedNotes: string | null;
  onSaveJob: () => void;
  isAuthenticated: boolean;
}

// ============ ApplyBeforeCard.tsx ============
export interface ApplyBeforeCardProps {
  closesAt: string | null;
}

// ============ RecruiterCard.tsx ============
export interface RecruiterCardProps {
  recruiter: Recruiter | null;
  jobTitle: string;
}

// ============ HighlightsCard.tsx ============
export interface HighlightsCardProps {
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  impactDescription: string | null;
  requiredCerts: string[];
  greenSkills: string[];
}

// ============ RoleOverviewCard.tsx ============
export interface RoleOverviewCardProps {
  experienceLevel: string | null;
  locationType: "REMOTE" | "HYBRID" | "ONSITE";
  location: string | null;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  climateCategory: string | null;
}

// ============ AboutCompanyCard.tsx ============
export interface AboutCompanyCardProps {
  organization: Organization;
}

// ============ ExploreMoreJobs.tsx ============
export interface ExploreMoreJobsProps {
  jobs: SimilarJob[];
}

// ============ SaveButton.tsx ============
export interface SaveButtonProps {
  jobId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
  onSaveChange: (newState: boolean) => void;
}

// ============ NotesEditor.tsx ============
export interface NotesEditorProps {
  jobId: string;
  initialNotes: string | null;
  isSaved: boolean;
  isAuthenticated: boolean;
  onSaveJob: () => void;
}
```

---

## 4. Component Specifications

### 4.1 page.tsx (Server Component — Data Fetching)

**Responsibility:**

- Query Prisma for job detail, recruiter, similar jobs
- Handle 404 and permission errors
- Wrap UI in Suspense boundaries
- Pass data to child components

**Implementation:**

```typescript
// src/app/jobs/search/[id]/page.tsx

import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getServerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { JobDetailPageData } from "./_components/types";
import JobHeader from "./_components/JobHeader";
import JobDescription from "./_components/JobDescription";
import SidebarTabs from "./_components/SidebarTabs";
import ExploreMoreJobs from "./_components/ExploreMoreJobs";
import JobDetailSkeleton from "./loading";

interface PageProps {
  params: { id: string };
  searchParams: Record<string, string>;
}

/**
 * Fetch job detail with related data (organization, recruiter, pathway).
 * Returns null if job not found or not published.
 */
async function fetchJobDetail(jobId: string) {
  return await prisma.job.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      locationType: true,
      employmentType: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      climateCategory: true,
      impactDescription: true,
      greenSkills: true,
      requiredCerts: true,
      experienceLevel: true,
      isFeatured: true,
      publishedAt: true,
      closesAt: true,
      status: true,
      pathwayId: true,
      organizationId: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          isBipocOwned: true,
          isWomenOwned: true,
          isVeteranOwned: true,
          description: true,
        },
      },
      pathway: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
        },
      },
    },
  });
}

/**
 * Fetch recruiter from organization's team members.
 * Resolves to first member with RECRUITER role, falls back to OWNER.
 */
async function fetchRecruiter(organizationId: string) {
  const recruiter = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      role: { in: ["RECRUITER", "OWNER"] },
    },
    select: {
      id: true,
      title: true,
      account: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      role: "asc", // OWNER before RECRUITER in role enum
    },
  });

  if (!recruiter || !recruiter.account.email) {
    return null;
  }

  return {
    id: recruiter.id,
    name: recruiter.account.name || recruiter.account.email,
    title: recruiter.title || "Recruiter",
    avatarUrl: recruiter.account.avatarUrl,
    email: recruiter.account.email,
  };
}

/**
 * Compute multi-signal relevance score for similar jobs.
 * Signals: same pathway (3pts) + same locationType (2pts) +
 *          same experienceLevel (1pt) + same organization (1pt)
 */
function scoreSimilarJob(
  candidate: typeof similarJobsRaw[0],
  target: Awaited<ReturnType<typeof fetchJobDetail>>
): number {
  if (!target) return 0;

  let score = 0;

  if (candidate.pathwayId && candidate.pathwayId === target.pathwayId) {
    score += 3;
  }
  if (candidate.locationType === target.locationType) {
    score += 2;
  }
  if (candidate.experienceLevel && candidate.experienceLevel === target.experienceLevel) {
    score += 1;
  }
  if (candidate.organizationId === target.organizationId) {
    score += 1;
  }

  return score;
}

/**
 * Fetch similar jobs using multi-signal scoring.
 */
async function fetchSimilarJobs(
  jobId: string,
  targetJob: Awaited<ReturnType<typeof fetchJobDetail>>
) {
  if (!targetJob) return [];

  // Fetch candidates: published, not expired, not this job
  const candidates = await prisma.job.findMany({
    where: {
      id: { not: jobId },
      status: "PUBLISHED",
      publishedAt: { not: null },
      OR: [
        { closesAt: null },
        { closesAt: { gt: new Date() } },
      ],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      location: true,
      locationType: true,
      employmentType: true,
      climateCategory: true,
      publishedAt: true,
      pathwayId: true,
      experienceLevel: true,
      organizationId: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          isBipocOwned: true,
        },
      },
      pathway: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
        },
      },
    },
    take: 100, // Fetch top 100 candidates to score
  });

  // Score and sort
  const scored = candidates
    .map((candidate) => ({
      ...candidate,
      score: scoreSimilarJob(candidate, targetJob),
    }))
    .filter((c) => c.score > 0) // Only candidates with at least one signal match
    .sort((a, b) => {
      // Sort by score desc, then by publishedAt desc
      if (b.score !== a.score) return b.score - a.score;
      const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3); // Return top 3

  return scored.map(({ score, ...rest }) => rest);
}

/**
 * Fetch saved state and notes for authenticated user.
 */
async function fetchUserJobState(jobId: string, userId: string) {
  const savedJob = await prisma.savedJob.findUnique({
    where: { seekerId_jobId: { seekerId: userId, jobId } },
    select: {
      notes: true,
    },
  });

  return {
    isSaved: !!savedJob,
    notes: savedJob?.notes ?? null,
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const jobId = params.id;
  const user = await getServerUser();

  try {
    // Fetch job detail
    const job = await fetchJobDetail(jobId);
    if (!job || job.status !== "PUBLISHED") {
      notFound();
    }

    // Parallel queries for recruiter, similar jobs, user state
    const [recruiter, similarJobs, userState] = await Promise.all([
      fetchRecruiter(job.organizationId),
      fetchSimilarJobs(jobId, job),
      user ? fetchUserJobState(jobId, user.id) : Promise.resolve({ isSaved: false, notes: null }),
    ]);

    // Enrich job detail with recruiter
    const jobDetail = {
      ...job,
      recruiter,
    };

    const pageData: JobDetailPageData = {
      job: jobDetail,
      similarJobs,
      isAuthenticated: !!user,
      isSaved: userState.isSaved,
      savedNotes: userState.notes,
    };

    return (
      <div className="min-h-screen bg-[var(--background-subtle)]">
        {/* Header bar */}
        <div className="border-b border-[var(--border-muted)] bg-[var(--background-default)] px-12 py-6">
          <JobHeader
            job={jobDetail}
            isAuthenticated={pageData.isAuthenticated}
            isSaved={pageData.isSaved}
            onSaveChange={() => {
              // Client component will handle this via POST/DELETE
            }}
          />
        </div>

        {/* Main content area */}
        <div className="px-12 py-6">
          <div className="flex gap-6">
            {/* Left column: Job description */}
            <div className="flex-1">
              <Suspense fallback={<div className="h-[600px] bg-[var(--background-default)] rounded-[var(--radius-card)]" />}>
                <JobDescription
                  description={jobDetail.description}
                  title={jobDetail.title}
                />
              </Suspense>
            </div>

            {/* Right column: Sidebar */}
            <aside className="w-[350px] shrink-0">
              <Suspense fallback={<div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-32 bg-[var(--background-default)] rounded-[var(--radius-card)]" />
                ))}
              </div>}>
                <SidebarTabs
                  job={jobDetail}
                  isSaved={pageData.isSaved}
                  savedNotes={pageData.savedNotes}
                  onSaveJob={() => {
                    // State will be updated by SaveButton in header
                  }}
                  isAuthenticated={pageData.isAuthenticated}
                />
              </Suspense>
            </aside>
          </div>

          {/* Explore More Jobs section */}
          {similarJobs.length > 0 && (
            <Suspense fallback={<div className="mt-12 h-64 bg-[var(--background-default)] rounded-[var(--radius-card)]" />}>
              <div className="mt-12">
                <ExploreMoreJobs jobs={similarJobs} />
              </div>
            </Suspense>
          )}
        </div>
      </div>
    );
  } catch (error) {
    logger.error("Failed to fetch job detail", {
      jobId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}
```

**Key Patterns:**

- No client-side `useEffect` — fetch happens on server
- Parallel queries with `Promise.all()` for performance
- Graceful handling of missing recruiter (returns null)
- Similar jobs scoring done in memory
- Suspense boundaries for async rendering
- Proper error logging

---

### 4.2 JobHeader.tsx (Client Component)

**Responsibility:**

- Display job title, company name, logo, badges
- Render Apply Now and Save buttons with interactive state
- Manage optimistic updates for save toggle

```typescript
// src/app/jobs/search/[id]/_components/JobHeader.tsx

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Badge, Button } from "@/components/ui";
import { getJobStatus, getLocationTypeLabel } from "@/lib/jobs/helpers";
import { logger } from "@/lib/logger";
import SaveButton from "./SaveButton";
import { JobHeaderProps } from "./types";

export default function JobHeader({
  job,
  isAuthenticated,
  isSaved: initialSaved,
  onSaveChange,
}: JobHeaderProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);

  const handleApplyNow = useCallback(() => {
    router.push(`/apply/${job.id}`);
  }, [job.id, router]);

  const handleSaveChange = useCallback((newState: boolean) => {
    setIsSaved(newState);
    onSaveChange(newState);
  }, [onSaveChange]);

  // Determine badges to show
  const status = getJobStatus({
    isBipocOwned: job.organization.isBipocOwned,
    isFeatured: job.isFeatured,
    closesAt: job.closesAt,
  });

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left: Logo, title, company */}
      <div className="flex items-start gap-4 flex-1">
        <Avatar
          size="xs"
          src={job.organization.logo ?? undefined}
          name={job.organization.name}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-heading-sm font-medium text-[var(--foreground-default)] line-clamp-2">
            {job.title}
          </h1>
          <p className="text-body text-[var(--foreground-default)]">
            {job.organization.name}
          </p>
          {/* Badges: BIPOC, Featured, Closing Soon */}
          <div className="flex flex-wrap gap-2 mt-2">
            {status === "bipoc-owned" && (
              <Badge variant="feature">BIPOC Owned</Badge>
            )}
            {status === "featured" && (
              <Badge variant="feature">Featured</Badge>
            )}
            {status === "closing-soon" && (
              <Badge variant="warning">Closing Soon</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right: CTA buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <Button
          variant="primary"
          size="lg"
          onClick={handleApplyNow}
          className="rounded-[var(--radius-button)]"
        >
          Apply Now
        </Button>
        <SaveButton
          jobId={job.id}
          initialSaved={isSaved}
          isAuthenticated={isAuthenticated}
          onSaveChange={handleSaveChange}
        />
      </div>
    </div>
  );
}
```

**Key Details:**

- Extracts badge status via `getJobStatus()` helper
- Routes Apply Now to `/apply/{jobId}` form
- Delegates save toggle to SaveButton child component
- Responsive: may stack on mobile via sticky CTA bar (Phase 5)

---

### 4.3 SaveButton.tsx (Client Component)

**Responsibility:**

- Toggle save/unsave state
- Manage optimistic UI updates
- Handle auth errors gracefully

```typescript
// src/app/jobs/search/[id]/_components/SaveButton.tsx

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { BookmarkSimple, CheckCircle } from "@phosphor-icons/react";
import { logger } from "@/lib/logger";
import { SaveButtonProps } from "./types";

export default function SaveButton({
  jobId,
  initialSaved,
  isAuthenticated,
  onSaveChange,
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleSave = useCallback(async () => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      // TODO: Implement auth gate
      window.location.href = "/auth/login";
      return;
    }

    // Optimistic update
    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      setIsLoading(true);
      const method = previousState ? "DELETE" : "POST";
      const response = await fetch(`/api/jobs/${jobId}/save`, { method });

      if (!response.ok) {
        // Rollback on error
        setIsSaved(previousState);
        logger.error("Failed to toggle save", {
          jobId,
          method,
          status: response.status,
        });
        // TODO: Show toast error
        return;
      }

      // Success — notify parent
      onSaveChange(!previousState);
    } catch (error) {
      // Rollback on error
      setIsSaved(previousState);
      logger.error("Save toggle error", {
        jobId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      // TODO: Show toast error
    } finally {
      setIsLoading(false);
    }
  }, [jobId, isSaved, isAuthenticated, onSaveChange]);

  return (
    <Button
      variant={isSaved ? "secondary" : "inverse"}
      size="lg"
      onClick={handleToggleSave}
      disabled={isLoading}
      aria-pressed={isSaved}
      className={`rounded-[var(--radius-button)] ${
        isSaved ? "bg-[var(--primitive-green-200)] text-[var(--primitive-green-700)]" : ""
      }`}
    >
      {isSaved ? (
        <CheckCircle size={20} weight="fill" />
      ) : (
        <BookmarkSimple size={20} />
      )}
    </Button>
  );
}
```

**Key Details:**

- `aria-pressed={isSaved}` for accessibility
- Optimistic update with rollback on error
- Auth check via `isAuthenticated` prop
- Proper disabled state during loading

---

### 4.4 NotesEditor.tsx (Client Component)

**Responsibility:**

- Display textarea for user notes
- Auto-save with 1s debounce
- Auto-save the job if not already saved
- Show save status ("Saving...", "Saved", "Failed to save")

```typescript
// src/app/jobs/search/[id]/_components/NotesEditor.tsx

"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, Textarea } from "@/components/ui";
import { useDebouncedCallback } from "use-debounce";
import { logger } from "@/lib/logger";
import { NotesEditorProps } from "./types";

export default function NotesEditor({
  jobId,
  initialNotes,
  isSaved,
  isAuthenticated,
  onSaveJob,
}: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Debounced auto-save
  const debouncedSave = useDebouncedCallback(
    async (content: string) => {
      if (!isAuthenticated) return;

      setSaveStatus("saving");

      try {
        // If job isn't saved yet, save it first
        if (!isSaved) {
          const saveResponse = await fetch(`/api/jobs/${jobId}/save`, {
            method: "POST",
          });

          if (!saveResponse.ok) {
            setSaveStatus("error");
            logger.error("Failed to auto-save job", { jobId });
            return;
          }

          // Notify parent that job is now saved
          onSaveJob();
        }

        // Save notes
        const response = await fetch(`/api/jobs/${jobId}/notes`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          setSaveStatus("error");
          logger.error("Failed to save notes", { jobId, status: response.status });
          return;
        }

        setSaveStatus("saved");
        // Reset to idle after 2s
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch (error) {
        setSaveStatus("error");
        logger.error("Notes save error", {
          jobId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    1000
  );

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNotes(value);
      debouncedSave(value);
    },
    [debouncedSave]
  );

  if (!isAuthenticated) {
    return (
      <Card className="rounded-[var(--radius-card)] border-[var(--primitive-neutral-200)]">
        <CardContent className="p-6">
          <p className="text-body text-[var(--foreground-subtle)]">
            Log in to save notes about this job.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--primitive-neutral-200)]">
      <CardContent className="p-6 space-y-3">
        <label htmlFor="job-notes" className="text-body font-medium text-[var(--foreground-default)]">
          Your Notes
        </label>
        <Textarea
          id="job-notes"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your notes about this position..."
          className="min-h-[120px]"
        />
        {saveStatus === "saving" && (
          <p className="text-caption text-[var(--foreground-subtle)]">Saving...</p>
        )}
        {saveStatus === "saved" && (
          <p className="text-caption text-[var(--foreground-brand)]">Saved</p>
        )}
        {saveStatus === "error" && (
          <p className="text-caption text-[var(--foreground-error)]">Failed to save</p>
        )}
      </CardContent>
    </Card>
  );
}
```

**Key Details:**

- Uses `useDebouncedCallback` from `use-debounce` package
- Auto-saves job via POST if notes are written but job not saved
- Status indicator shows transient messages
- Accessible label via `htmlFor`
- No login gate — message shown if not authenticated

---

### 4.5 JobDescription.tsx (Server Component)

**Responsibility:**

- Render job description HTML with prose styling
- Sanitize HTML to prevent XSS
- Apply Tailwind prose classes for typography

```typescript
// src/app/jobs/search/[id]/_components/JobDescription.tsx

import { Card, CardContent } from "@/components/ui";
import DOMPurify from "isomorphic-dompurify";
import { JobDescriptionProps } from "./types";

/**
 * Sanitize HTML description to prevent XSS attacks.
 */
function sanitizeDescription(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

export default function JobDescription({ description, title }: JobDescriptionProps) {
  const sanitizedHtml = sanitizeDescription(description);

  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--primitive-neutral-200)]">
      <CardContent className="p-6">
        <div
          className="prose prose-lg max-w-none text-[var(--foreground-default)]
            [&_h2]:text-heading-sm [&_h2]:font-bold [&_h2]:tracking-tight
            [&_h3]:text-body-strong [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wide
            [&_p]:text-body [&_p]:leading-relaxed
            [&_ul]:space-y-1 [&_ul]:pl-5
            [&_ol]:space-y-1 [&_ol]:pl-5
            [&_li]:text-body [&_li]:leading-relaxed
            [&_a]:text-[var(--foreground-brand)] [&_a]:underline hover:[&_a]:text-[var(--foreground-brand-emphasis)]"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      </CardContent>
    </Card>
  );
}
```

**Key Details:**

- Uses `isomorphic-dompurify` for server-side HTML sanitization
- Prose classes applied inline to match design tokens
- No dangerous `dangerouslySetInnerHTML` without sanitization

---

### 4.6 SidebarTabs.tsx (Client Component)

**Responsibility:**

- Manage tab state (Job Details vs Your Notes)
- Render tab bar and content containers
- Switch tab variant per design spec

```typescript
// src/app/jobs/search/[id]/_components/SidebarTabs.tsx

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsListUnderline, TabsTriggerUnderline } from "@/components/ui";
import ApplyBeforeCard from "./ApplyBeforeCard";
import RecruiterCard from "./RecruiterCard";
import HighlightsCard from "./HighlightsCard";
import RoleOverviewCard from "./RoleOverviewCard";
import AboutCompanyCard from "./AboutCompanyCard";
import NotesEditor from "./NotesEditor";
import { SidebarTabsProps } from "./types";

export default function SidebarTabs({
  job,
  isSaved,
  savedNotes,
  onSaveJob,
  isAuthenticated,
}: SidebarTabsProps) {
  const [savedState, setSavedState] = useState(isSaved);

  const handleSaveJob = () => {
    setSavedState(true);
    onSaveJob();
  };

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsListUnderline className="w-full">
        <TabsTriggerUnderline value="details" className="flex-1">
          Job Details
        </TabsTriggerUnderline>
        <TabsTriggerUnderline value="notes" className="flex-1">
          Your Notes
        </TabsTriggerUnderline>
      </TabsListUnderline>

      <TabsContent value="details" className="mt-6 space-y-6">
        <ApplyBeforeCard closesAt={job.closesAt} />
        <RecruiterCard recruiter={job.recruiter} jobTitle={job.title} />
        <HighlightsCard
          salaryMin={job.salaryMin}
          salaryMax={job.salaryMax}
          salaryCurrency={job.salaryCurrency}
          impactDescription={job.impactDescription}
          requiredCerts={job.requiredCerts}
          greenSkills={job.greenSkills}
        />
        <RoleOverviewCard
          experienceLevel={job.experienceLevel}
          locationType={job.locationType}
          location={job.location}
          employmentType={job.employmentType}
          climateCategory={job.climateCategory}
        />
        <AboutCompanyCard organization={job.organization} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <NotesEditor
          jobId={job.id}
          initialNotes={savedNotes}
          isSaved={savedState}
          isAuthenticated={isAuthenticated}
          onSaveJob={handleSaveJob}
        />
      </TabsContent>
    </Tabs>
  );
}
```

**Key Details:**

- Uses `TabsListUnderline` and `TabsTriggerUnderline` per design spec
- Maintains local saved state to sync with parent
- Spacing between tabs and content (`mt-6` and `space-y-6`)

---

### 4.7 Remaining Card Components (Server Components)

These are simple, stateless renderers of job data. All follow the same pattern:

```typescript
// src/app/jobs/search/[id]/_components/ApplyBeforeCard.tsx

import { Badge, Card, CardContent } from "@/components/ui";
import { isClosingSoon, formatDate } from "@/lib/jobs/helpers";
import { ApplyBeforeCardProps } from "./types";

export default function ApplyBeforeCard({ closesAt }: ApplyBeforeCardProps) {
  return (
    <Card className="rounded-[var(--radius-card)] border-[var(--primitive-neutral-200)]">
      <CardContent className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-[var(--foreground-default)]">
            Apply Before:
          </span>
          <span className="text-body text-[var(--foreground-default)]">
            {closesAt ? formatDate(closesAt) : "Not specified"}
          </span>
        </div>
        {closesAt && isClosingSoon(closesAt) && (
          <Badge variant="warning" className="shrink-0">
            Closing Soon
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
```

Similar pattern for:

- `RecruiterCard.tsx` — Avatar, name, title, mailto button
- `HighlightsCard.tsx` — Salary, education, special requirements
- `RoleOverviewCard.tsx` — Job type, level, location, workplace
- `AboutCompanyCard.tsx` — Company logo, description, read more
- `ExploreMoreJobs.tsx` — Grid of similar job cards

(See PRD §7 for detailed specs)

---

### 4.8 loading.tsx (Skeleton Fallback)

```typescript
// src/app/jobs/search/[id]/loading.tsx

import { Skeleton, SkeletonCard } from "@/components/ui";

export default function JobDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--background-subtle)]">
      {/* Header */}
      <div className="border-b border-[var(--border-muted)] bg-[var(--background-default)] px-12 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-80" />
              <Skeleton className="h-6 w-40" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-8 w-28 rounded-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Skeleton className="h-12 w-32 rounded-[var(--radius-button)]" />
            <Skeleton className="h-12 w-12 rounded-[var(--radius-button)]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-12 py-6">
        <div className="flex gap-6">
          {/* Left column */}
          <div className="flex-1">
            <SkeletonCard className="min-h-[600px]" />
          </div>

          {/* Right column */}
          <div className="w-[350px] shrink-0 space-y-6">
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-32" />
            <SkeletonCard className="h-48" />
            <SkeletonCard className="h-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### 4.9 error.tsx (Error Boundary)

```typescript
// src/app/jobs/search/[id]/error.tsx

"use client";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background-subtle)]">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
          Something went wrong
        </h1>
        <p className="text-body text-[var(--foreground-muted)]">
          {error.message || "Failed to load job details. Please try again."}
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="tertiary" onClick={() => router.push("/jobs/search")}>
            Back to Search
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. API Contracts

### 5.1 GET /api/jobs/{id}

**Extends existing endpoint with recruiter data.**

**Request:**

```
GET /api/jobs/[jobId]
Authorization: Bearer [token] (optional)
```

**Response (200 OK):**

```typescript
// Response body type
interface GetJobResponse {
  data: {
    job: {
      id: string;
      title: string;
      slug: string;
      description: string;
      location: string | null;
      locationType: "REMOTE" | "HYBRID" | "ONSITE";
      employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
      salaryMin: number | null;
      salaryMax: number | null;
      salaryCurrency: "USD";
      climateCategory: string | null;
      impactDescription: string | null;
      greenSkills: string[];
      requiredCerts: string[];
      experienceLevel: "ENTRY" | "INTERMEDIATE" | "SENIOR" | "EXECUTIVE" | null;
      isFeatured: boolean;
      publishedAt: string | null;
      closesAt: string | null;
      organization: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        isBipocOwned?: boolean;
        isWomenOwned?: boolean;
        isVeteranOwned?: boolean;
        description?: string | null;
      };
      pathway: {
        id: string;
        name: string;
        slug: string;
        icon?: string | null;
        color?: string | null;
      } | null;
      recruiter: {
        id: string;
        name: string;
        title: string;
        avatarUrl: string | null;
        email: string;
      } | null;
    };
    similarJobs: {
      id: string;
      title: string;
      slug: string;
      location: string | null;
      locationType: "REMOTE" | "HYBRID" | "ONSITE";
      employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
      climateCategory: string | null;
      organization: {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        isBipocOwned?: boolean;
      };
      pathway: {
        id: string;
        name: string;
        slug: string;
        icon?: string | null;
        color?: string | null;
      } | null;
    }[];
    isSaved: boolean;
    savedNotes: string | null;
  };
}
```

**Error Responses:**

- `404 Not Found` — Job doesn't exist or not published
- `500 Internal Server Error` — Database error

---

### 5.2 POST /api/jobs/{id}/save

**Existing endpoint — no changes needed.**

**Request:**

```
POST /api/jobs/[jobId]/save
Authorization: Bearer [token] (required)
Content-Type: application/json
```

**Response (201 Created):**

```typescript
interface SaveJobResponse {
  data: {
    seekerId: string;
    jobId: string;
    savedAt: string; // ISO 8601
  };
}
```

**Error Responses:**

- `401 Unauthorized` — Not logged in
- `404 Not Found` — Job doesn't exist
- `409 Conflict` — Already saved
- `500 Internal Server Error` — Database error

---

### 5.3 DELETE /api/jobs/{id}/save

**Existing endpoint — no changes needed.**

**Request:**

```
DELETE /api/jobs/[jobId]/save
Authorization: Bearer [token] (required)
```

**Response (204 No Content):**

```
(empty body)
```

**Error Responses:**

- `401 Unauthorized` — Not logged in
- `404 Not Found` — Job or SavedJob doesn't exist
- `500 Internal Server Error` — Database error

---

### 5.4 PATCH /api/jobs/{id}/notes (NEW)

**Updates user's notes for a saved job. Auto-creates SavedJob if doesn't exist.**

**Implementation:**

```typescript
// src/app/api/jobs/[id]/notes/route.ts

import { NextRequest, Response } from "next/server";
import { z } from "zod";
import { getServerUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

// Validation schema
const UpdateNotesSchema = z.object({
  content: z.string().max(5000, "Notes must be under 5000 characters"),
});

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 1. Auth check
    const user = await getServerUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = params.id;

    // 2. Get seeker profile
    const seekerProfile = await prisma.seekerProfile.findUnique({
      where: { accountId: user.id },
      select: { id: true },
    });

    if (!seekerProfile) {
      return Response.json({ error: "Seeker profile not found" }, { status: 404 });
    }

    // 3. Validate input
    const body = await request.json();
    const result = UpdateNotesSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }

    const { content } = result.data;

    // 4. Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true },
    });

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    // 5. Upsert SavedJob with notes
    const savedJob = await prisma.savedJob.upsert({
      where: { seekerId_jobId: { seekerId: seekerProfile.id, jobId } },
      create: {
        seekerId: seekerProfile.id,
        jobId,
        notes: content,
        savedAt: new Date(),
      },
      update: {
        notes: content,
      },
      select: {
        seekerId: true,
        jobId: true,
        notes: true,
        savedAt: true,
      },
    });

    logger.info("Job notes updated", {
      seekerId: seekerProfile.id,
      jobId,
      contentLength: content.length,
    });

    return Response.json({ data: savedJob }, { status: 200 });
  } catch (error) {
    logger.error("Failed to update job notes", {
      error: error instanceof Error ? error.message : "Unknown error",
      jobId: params.id,
    });

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Request:**

```
PATCH /api/jobs/[jobId]/notes
Authorization: Bearer [token] (required)
Content-Type: application/json

{
  "content": "Great opportunity for senior engineers. Stack includes React and Node. Need to prepare for system design interview."
}
```

**Response (200 OK):**

```typescript
interface UpdateNotesResponse {
  data: {
    seekerId: string;
    jobId: string;
    notes: string;
    savedAt: string; // ISO 8601
  };
}
```

**Error Responses:**

- `401 Unauthorized` — Not logged in
- `404 Not Found` — Job or seeker profile doesn't exist
- `422 Unprocessable Entity` — Validation error
- `500 Internal Server Error` — Database error

---

## 6. Implementation Phases

### Phase 1: Foundation (Types, Server Data Fetching, Basic Layout)

**Deliverables:**

- [ ] TypeScript interfaces in `_components/types.ts`
- [ ] `page.tsx` server component with Prisma queries
- [ ] Basic layout skeleton (flex, two-column)
- [ ] `loading.tsx` and `error.tsx` files
- [ ] CI/linting passes

**PR: `feat: job-detail-rebuild-phase-1-foundation`**

**Estimated effort:** 2-3 hours

**Testing:**

- Unit test for `scoreSimilarJob()` scoring logic
- Integration test for `fetchJobDetail()` query
- E2E: Navigate to job detail page, verify data loads

---

### Phase 2: Core UI Components (Header, Cards, Description)

**Deliverables:**

- [ ] `JobHeader.tsx` with company info and badges
- [ ] `JobDescription.tsx` with prose rendering and HTML sanitization
- [ ] `ApplyBeforeCard.tsx`
- [ ] `RecruiterCard.tsx`
- [ ] `HighlightsCard.tsx`
- [ ] `RoleOverviewCard.tsx`
- [ ] `AboutCompanyCard.tsx`
- [ ] Token compliance verified (no hardcoded colors)
- [ ] Design system components used (Card, Badge, Avatar, Button)

**PR: `feat: job-detail-rebuild-phase-2-ui-components`**

**Estimated effort:** 4-5 hours

**Testing:**

- Component tests for each card (snapshot + props)
- Visual regression tests for prose rendering
- Accessibility: Tab order, ARIA labels, color contrast

---

### Phase 3: Interactive Features (Save Toggle, Notes Editor)

**Deliverables:**

- [ ] `SaveButton.tsx` with optimistic updates
- [ ] `NotesEditor.tsx` with debounced auto-save
- [ ] `PATCH /api/jobs/{id}/notes` endpoint
- [ ] Integration: notes auto-save calls save job if needed
- [ ] Error handling for auth failures
- [ ] `aria-pressed` on save button

**PR: `feat: job-detail-rebuild-phase-3-interactive`**

**Estimated effort:** 3-4 hours

**Testing:**

- Integration test for save toggle (POST, DELETE, rollback)
- Integration test for notes auto-save
- Unit test for debounce logic
- E2E: Write notes, verify auto-save, refresh, notes persist

---

### Phase 4: Similar Jobs Algorithm

**Deliverables:**

- [ ] Multi-signal scoring implemented in page.tsx
- [ ] `ExploreMoreJobs.tsx` component
- [ ] Filter: only published, non-expired jobs
- [ ] Top 3 results by score (ties by recency)
- [ ] Edge case: no similar jobs → section hidden

**PR: `feat: job-detail-rebuild-phase-4-similar-jobs`**

**Estimated effort:** 2-3 hours

**Testing:**

- Unit test for scoring algorithm (same pathway, location, level, org)
- Integration test: verify top 3 returned
- Query optimization: verify indexes exist on pathway, locationType, experienceLevel

---

### Phase 5: Responsive Layout + Mobile Sticky CTA

**Deliverables:**

- [ ] Mobile breakpoint: single-column stacking below 768px
- [ ] Sticky CTA bar at bottom of mobile viewport
- [ ] Title truncation (line-clamp) on mobile
- [ ] Touch-friendly button sizes
- [ ] Sidebar width responsive (350px → 300px at md)
- [ ] Test on 375px (iPhone SE), 768px (iPad), 1024px+ (desktop)

**PR: `feat: job-detail-rebuild-phase-5-responsive`**

**Estimated effort:** 2-3 hours

**Testing:**

- Responsive visual regression (Chromatic or similar)
- Mobile E2E: Save, notes, tab switching on small viewport
- VoiceOver/NVDA: Verify reading order correct

---

### Phase 6: Bug Fixes & Polish

**Deliverables:**

- [ ] Badge variant fix: `variant="feature"` instead of `"accent"`
- [ ] Apply Now routing verified
- [ ] HTML sanitization tested with XSS payloads
- [ ] Dark mode verification
- [ ] Performance: Largest Contentful Paint < 2.5s
- [ ] All tokens used correctly (no hardcoded colors)
- [ ] Final code review & lint pass

**PR: `feat: job-detail-rebuild-phase-6-polish`**

**Estimated effort:** 1-2 hours

**Testing:**

- Lighthouse audit (>90 performance, >95 accessibility)
- Dark mode visual verification
- XSS security testing on description field

---

## 7. Testing Plan

### Unit Tests

```typescript
// src/app/jobs/search/[id]/__tests__/scoring.test.ts

import { describe, it, expect } from "vitest";

// Tests for scoreSimilarJob() function
describe("scoreSimilarJob", () => {
  it("awards 3 points for same pathway", () => {
    const candidate = { pathwayId: "marketing-design" };
    const target = { pathwayId: "marketing-design" };
    expect(scoreSimilarJob(candidate, target)).toBeGreaterThanOrEqual(3);
  });

  it("awards 2 points for same locationType", () => {
    const candidate = { locationType: "REMOTE" };
    const target = { locationType: "REMOTE" };
    expect(scoreSimilarJob(candidate, target)).toBeGreaterThanOrEqual(2);
  });

  it("returns 0 for no matching signals", () => {
    const candidate = {
      pathwayId: "a",
      locationType: "REMOTE",
      experienceLevel: "ENTRY",
      organizationId: "org1",
    };
    const target = {
      pathwayId: "b",
      locationType: "HYBRID",
      experienceLevel: "SENIOR",
      organizationId: "org2",
    };
    expect(scoreSimilarJob(candidate, target)).toBe(0);
  });
});
```

### Integration Tests

```typescript
// src/app/api/jobs/__tests__/[id]/save.test.ts

import { describe, it, expect, beforeEach } from "vitest";
import { POST, DELETE } from "@/app/api/jobs/[id]/save/route";
import { prisma } from "@/lib/prisma";

describe("POST /api/jobs/[id]/save", () => {
  beforeEach(() => {
    // Setup: create test user, job, seeker profile
  });

  it("requires authentication", async () => {
    const request = new Request("http://localhost/api/jobs/123/save", {
      method: "POST",
    });
    const response = await POST(request, { params: { id: "123" } });
    expect(response.status).toBe(401);
  });

  it("creates SavedJob for authenticated user", async () => {
    // Setup: authenticated request
    const response = await POST(authenticatedRequest, { params: { id: jobId } });
    expect(response.status).toBe(201);

    const data = await response.json();
    expect(data.data).toHaveProperty("seekerId");
    expect(data.data).toHaveProperty("jobId", jobId);
  });

  it("prevents duplicate saves", async () => {
    // Already saved
    const response = await POST(authenticatedRequest, { params: { id: jobId } });
    expect(response.status).toBe(409);
  });
});
```

### Component Tests

```typescript
// src/app/jobs/search/[id]/_components/__tests__/SaveButton.test.tsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SaveButton from "../SaveButton";

describe("SaveButton", () => {
  it("renders unsaved state with bookmark icon", () => {
    render(
      <SaveButton
        jobId="123"
        initialSaved={false}
        isAuthenticated={true}
        onSaveChange={() => {}}
      />
    );
    expect(screen.getByRole("button", { pressed: false })).toBeInTheDocument();
  });

  it("renders saved state with check circle icon", () => {
    render(
      <SaveButton
        jobId="123"
        initialSaved={true}
        isAuthenticated={true}
        onSaveChange={() => {}}
      />
    );
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
  });

  it("toggles save state on click", async () => {
    const onSaveChange = vi.fn();
    const { rerender } = render(
      <SaveButton
        jobId="123"
        initialSaved={false}
        isAuthenticated={true}
        onSaveChange={onSaveChange}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    await waitFor(() => {
      expect(onSaveChange).toHaveBeenCalledWith(true);
    });
  });

  it("reverts state on API error", async () => {
    // Mock fetch to return 500
    global.fetch = vi.fn(() =>
      Promise.resolve(new Response(null, { status: 500 }))
    );

    render(
      <SaveButton
        jobId="123"
        initialSaved={false}
        isAuthenticated={true}
        onSaveChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button", { pressed: false })).toBeInTheDocument();
    });
  });
});
```

---

## 8. Migration Strategy

### Step 1: Deploy New Route Alongside Old

1. Create new route at `/jobs/detail/[id]/` (keeping old at `/jobs/search/[id]/`)
2. Deploy to staging; verify functionality
3. Run side-by-side comparison tests

### Step 2: Feature Flag

1. Implement feature flag: `ENABLE_NEW_JOB_DETAIL_PAGE`
2. Route traffic: if flag on, use new route; else use old
3. Monitor error rates, load times, user session length
4. Gather feedback from QA team

### Step 3: Gradual Rollout

1. Enable flag for 10% of users
2. Monitor for 24 hours
3. Expand to 25%, 50%, 100%
4. Revert flag if critical issues detected

### Step 4: Cleanup

1. Delete old `/jobs/search/[id]/page.tsx` (after 1 week of 100% new route)
2. Update any outbound links in docs/emails
3. Archive old code in git history

### Rollback Plan

If new implementation has critical bug:

1. Disable feature flag immediately
2. Route traffic back to old component
3. Investigate bug, fix, redeploy
4. Retry rollout after verification

---

## Appendix: Helper Functions Reference

### src/lib/jobs/helpers.ts (Existing)

```typescript
export function getLocationTypeLabel(locationType: "REMOTE" | "HYBRID" | "ONSITE"): string;
export function getEmploymentTypeLabel(employmentType: string): string;
export function getJobStatus(job: {
  isBipocOwned?: boolean;
  isFeatured?: boolean;
  closesAt?: string | null;
}): "bipoc-owned" | "featured" | "closing-soon" | "default";
```

### New Helpers (to add)

```typescript
// src/lib/jobs/helpers.ts

export function formatSalary(min: number | null, max: number | null, currency: string): string {
  if (!min && !max) return "Not specified";
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency as "USD",
    maximumFractionDigits: 0,
  });

  if (min && max) return `${formatter.format(min)} - ${formatter.format(max)}`;
  if (min) return `${formatter.format(min)}+`;
  return `Up to ${formatter.format(max)}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function isClosingSoon(closesAt: string | null): boolean {
  if (!closesAt) return false;
  const deadline = new Date(closesAt);
  const now = new Date();
  const daysUntilClose = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return daysUntilClose <= 14 && daysUntilClose > 0;
}

export function getExperienceLevelLabel(level: string | null): string {
  const labels: Record<string, string> = {
    ENTRY: "Entry Level",
    INTERMEDIATE: "Intermediate",
    SENIOR: "Senior or Executive",
    EXECUTIVE: "Executive",
  };
  return labels[level] || "Not specified";
}
```

---

## Sign-Off

This Feature Spec is approved for implementation. All engineering standards (TypeScript strict mode, auth checks, Zod validation, structured logging, design system compliance) must be followed throughout.

**Next Step:** Begin Phase 1 (Foundation) implementation.

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ApplicationTracker,
  type JobApplication,
  type ApplicationSection,
  type EmojiReaction,
} from "@/components/ui/job-application-table";
import { Briefcase } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ApiApplication {
  id: string;
  appliedAt: string;
  updatedAt: string;
  status: string;
  rejectedAt: string | null;
  hiredAt: string | null;
  offeredAt: string | null;
  job: {
    id: string;
    title: string;
    company: string | null;
    logo: string | null;
  };
  hasOffer: boolean;
  offerStatus: string | null;
  nextInterview: {
    id: string;
    scheduledAt: string;
    type: string;
  } | null;
}

interface ApiSavedJob {
  id: string;
  title: string;
  savedAt: string;
  organization: {
    name: string;
    logo: string | null;
  };
}

const POLL_INTERVAL_MS = 30_000; // 30 seconds
const REACTIONS_STORAGE_KEY = "your-jobs-reactions";
const FAVORITES_STORAGE_KEY = "your-jobs-favorites";
const STAGES_STORAGE_KEY = "your-jobs-stage-overrides";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Map API status string to ApplicationSection */
function mapStatusToSection(status: string): ApplicationSection {
  switch (status.toLowerCase()) {
    case "new":
    case "applied":
      return "applied";
    case "screening":
    case "reviewing":
    case "interview":
      return "interview";
    case "offer":
      return "offer";
    case "hired":
      return "hired";
    case "rejected":
    case "withdrawn":
      return "ineligible";
    default:
      return "applied";
  }
}

/** Get initials from a company name (e.g., "Aurora Climate" → "AC") */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Read a JSON map from localStorage safely */
function readLocalMap<T>(key: string): Record<string, T> {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

/** Write a JSON map to localStorage safely */
function writeLocalMap<T>(key: string, map: Record<string, T>) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(map));
    }
  } catch {
    // Silently ignore storage errors
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function YourJobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Local state maps persisted in localStorage
  const [reactions, setReactions] = useState<Record<string, EmojiReaction>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [stageOverrides, setStageOverrides] = useState<Record<string, ApplicationSection>>({});

  // Load localStorage on mount
  useEffect(() => {
    setReactions(readLocalMap<EmojiReaction>(REACTIONS_STORAGE_KEY));
    setFavorites(readLocalMap<boolean>(FAVORITES_STORAGE_KEY));
    setStageOverrides(readLocalMap<ApplicationSection>(STAGES_STORAGE_KEY));
  }, []);

  /* ---- data fetch ------------------------------------------------ */
  const fetchData = useCallback(
    async (isPolling = false) => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          fetch("/api/jobs/applications?limit=100&days=365"),
          fetch("/api/jobs/saved"),
        ]);

        let appItems: JobApplication[] = [];
        let savedItems: JobApplication[] = [];

        if (appsRes.ok) {
          const data = await appsRes.json();
          const apiApps: ApiApplication[] = data.applications ?? [];
          appItems = apiApps.map((app) => ({
            id: app.job.id, // Use job ID for consistency with track page
            jobTitle: app.job.title,
            company: app.job.company || "Unknown Company",
            companyLogo: app.job.logo || undefined,
            companyInitials: getInitials(app.job.company || "UC"),
            stage: stageOverrides[app.job.id] ?? mapStatusToSection(app.status),
            activity: app.updatedAt,
            reaction: reactions[app.job.id] ?? undefined,
            isFavorite: favorites[app.job.id] ?? false,
          }));
        }

        if (savedRes.ok) {
          const data = await savedRes.json();
          const savedJobs: ApiSavedJob[] = data.jobs ?? [];

          // Get the set of job IDs from applications to avoid dupes
          const appliedJobIds = new Set(appItems.map((a) => a.id));

          savedItems = savedJobs
            .filter((job) => !appliedJobIds.has(job.id)) // Don't show saved jobs that are already applied
            .map((job) => ({
              id: job.id,
              jobTitle: job.title,
              company: job.organization.name,
              companyLogo: job.organization.logo || undefined,
              companyInitials: getInitials(job.organization.name),
              stage: (stageOverrides[job.id] ?? "saved") as ApplicationSection,
              activity: job.savedAt,
              reaction: reactions[job.id] ?? undefined,
              isFavorite: favorites[job.id] ?? false,
            }));
        }

        setApplications([...savedItems, ...appItems]);
      } catch (err) {
        logger.error("Error fetching your jobs data", { error: formatError(err) });
        if (!isPolling) setApplications([]);
      } finally {
        if (!isPolling) setLoading(false);
      }
    },
    [reactions, favorites, stageOverrides]
  );

  /* ---- initial fetch + polling ----------------------------------- */
  useEffect(() => {
    fetchData(false);

    pollRef.current = setInterval(() => {
      fetchData(true);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchData]);

  /* ---- callbacks ------------------------------------------------- */
  const handleStageChange = useCallback((applicationId: string, newStage: ApplicationSection) => {
    // Optimistic update
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, stage: newStage } : app))
    );

    // Persist to localStorage
    setStageOverrides((prev) => {
      const next = { ...prev, [applicationId]: newStage };
      writeLocalMap(STAGES_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const handleReactionChange = useCallback((applicationId: string, reaction: EmojiReaction) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, reaction } : app))
    );

    setReactions((prev) => {
      const next = { ...prev, [applicationId]: reaction };
      writeLocalMap(REACTIONS_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const handleFavoriteToggle = useCallback((applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, isFavorite: !app.isFavorite } : app))
    );

    setFavorites((prev) => {
      const next = { ...prev, [applicationId]: !prev[applicationId] };
      writeLocalMap(FAVORITES_STORAGE_KEY, next);
      return next;
    });
  }, []);

  const handleRowClick = useCallback(
    (applicationId: string) => {
      router.push(`/jobs/applications/track/${applicationId}`);
    },
    [router]
  );

  const handleExploreJobs = useCallback(() => {
    router.push("/jobs/search");
  }, [router]);

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Your Jobs" />
        <div className="px-8 py-6 lg:px-12">
          <TrackerSkeleton />
        </div>
      </div>
    );
  }

  /* ---- empty state ----------------------------------------------- */
  if (applications.length === 0) {
    return (
      <div>
        <PageHeader title="Your Jobs" />
        <div className="px-8 py-6 lg:px-12">
          <EmptyState
            icon={<Briefcase size={40} weight="light" />}
            title="No jobs tracked yet"
            description="Save or apply to jobs to start tracking your application journey."
            action={{
              label: "Explore Jobs",
              onClick: () => router.push("/jobs/search"),
            }}
          />
        </div>
      </div>
    );
  }

  /* ---- render ---------------------------------------------------- */
  return (
    <div>
      <PageHeader title="Your Jobs" />

      <div className="px-8 py-6 lg:px-12">
        <ApplicationTracker
          applications={applications}
          onStageChange={handleStageChange}
          onReactionChange={handleReactionChange}
          onFavoriteToggle={handleFavoriteToggle}
          onRowClick={handleRowClick}
          onExploreJobs={handleExploreJobs}
          defaultOpenSections={["saved", "applied", "interview", "offer"]}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                           */
/* ------------------------------------------------------------------ */

function TrackerSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-[var(--border-muted)]">
      {["Saved", "Applied", "Interview"].map((section) => (
        <div key={section} className="py-4">
          {/* Section header */}
          <div className="flex items-center gap-3 py-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
          {/* Table rows */}
          <div className="mt-2 space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl px-4 py-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

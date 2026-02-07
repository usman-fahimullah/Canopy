import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface PipelineStage {
  stage: string;
  count: number;
}

export interface AnalyticsData {
  pipeline: PipelineStage[];
  stats: {
    timeToHire: number | null;
    appsPerRole: number | null;
    offerRate: number | null;
    pipelineVelocity: number | null;
  };
  applicationsOverTime: Array<{ week: string; count: number }>;
  topJobs: Array<{
    id: string;
    title: string;
    applications: number;
    hired: number;
  }>;
  sourceBreakdown: Array<{ source: string; count: number }>;
}

export interface RoleListItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: "ONSITE" | "REMOTE" | "HYBRID";
  status: "DRAFT" | "PUBLISHED" | "PAUSED" | "CLOSED";
  publishedAt: string | null;
  closesAt: string | null;
  climateCategory: string | null;
  pathway: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  } | null;
  recruiter: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
  hiringManager: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
  applicationCount: number;
  reviewerCount: number;
  _count?: {
    applications: number;
  };
}

export interface TemplateItem {
  id: string;
  name: string;
  sourceJobId: string;
  activeFields: string[];
  createdAt: string;
  updatedAt: string;
}

/* -------------------------------------------------------------------
   Fetch helpers
   ------------------------------------------------------------------- */

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/* -------------------------------------------------------------------
   Query keys
   ------------------------------------------------------------------- */

export const queryKeys = {
  analytics: ["canopy", "analytics"] as const,
  roles: ["canopy", "roles"] as const,
  templates: ["canopy", "templates"] as const,
};

/* -------------------------------------------------------------------
   Hooks
   ------------------------------------------------------------------- */

/** Fetch analytics dashboard data. */
export function useAnalyticsQuery() {
  return useQuery<AnalyticsData>({
    queryKey: queryKeys.analytics,
    queryFn: () => fetchJSON<AnalyticsData>("/api/canopy/analytics"),
  });
}

/** Fetch the current organisation's roles list. */
export function useRolesQuery() {
  return useQuery<RoleListItem[]>({
    queryKey: queryKeys.roles,
    queryFn: async () => {
      const data = await fetchJSON<{ jobs: RoleListItem[] }>("/api/canopy/roles");
      return data.jobs;
    },
  });
}

/** Fetch the current organisation's role templates. */
export function useTemplatesQuery() {
  return useQuery<TemplateItem[]>({
    queryKey: queryKeys.templates,
    queryFn: async () => {
      const data = await fetchJSON<{ templates: TemplateItem[] }>("/api/canopy/templates");
      return data.templates;
    },
  });
}

/** Create a new draft role and invalidate the roles cache. */
export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; description: string }) => {
      const res = await fetch("/api/canopy/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
      }
      return res.json() as Promise<{
        job: { id: string; title: string; slug: string; status: string };
      }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

// ============================================
// TYPES
// ============================================

export interface CandidateApplication {
  id: string;
  seekerId?: string;
  name?: string;
  email?: string;
  stage?: string;
  status?: string;
  jobId?: string;
  matchScore?: number | null;
  submittedAt?: string;
  createdAt?: string | null;
  source?: string | null;
  candidate?: {
    id: string;
    name: string | null;
    email: string;
  };
  job?: {
    id: string;
    title: string;
  };
}

export interface CandidatesListResponse {
  applications: CandidateApplication[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
  userRole?: string;
}

export interface CandidateFilters {
  skip?: number;
  take?: number;
  stage?: string;
  matchScoreMin?: number;
  matchScoreMax?: number;
  source?: string;
  search?: string;
  sortBy?: "name" | "email" | "stage" | "matchScore" | "source" | "createdAt";
  sortDirection?: "asc" | "desc";
}

// ============================================
// QUERIES
// ============================================

/** Fetch paginated/filtered candidates list. Each filter combo is independently cached. */
export function useCandidatesQuery(
  filters: CandidateFilters,
  options?: { initialData?: CandidatesListResponse }
) {
  const params = new URLSearchParams();
  if (filters.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters.take !== undefined) params.set("take", String(filters.take));
  if (filters.stage) params.set("stage", filters.stage);
  if (filters.matchScoreMin !== undefined)
    params.set("matchScoreMin", String(filters.matchScoreMin));
  if (filters.matchScoreMax !== undefined)
    params.set("matchScoreMax", String(filters.matchScoreMax));
  if (filters.source) params.set("source", filters.source);
  if (filters.search) params.set("search", filters.search);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortDirection) params.set("sortDirection", filters.sortDirection);

  return useQuery({
    queryKey: queryKeys.canopy.candidates.list(filters as Record<string, unknown>),
    queryFn: () => apiFetch<CandidatesListResponse>(`/api/canopy/candidates?${params.toString()}`),
    // Show previous data while new filter results load (no flash of skeleton)
    placeholderData: (previousData) => previousData,
    ...(options?.initialData ? { initialData: options.initialData } : {}),
  });
}

/** Fetch a single candidate's full profile. Cached so re-opening the same sheet is instant. */
export function useCandidateDetailQuery(seekerId: string | null) {
  return useQuery({
    queryKey: queryKeys.canopy.candidates.detail(seekerId ?? ""),
    queryFn: () =>
      apiFetch<{ data: Record<string, unknown>; orgMemberId: string }>(
        `/api/canopy/candidates/${seekerId}`
      ),
    enabled: !!seekerId,
  });
}

// ============================================
// MUTATIONS
// ============================================

/** Move a candidate to a new stage. Invalidates candidates + role detail + dashboard. */
export function useStageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      roleId: string;
      applicationId: string;
      stage: string;
      stageOrder?: number;
    }) =>
      apiMutate<Record<string, unknown>>(
        `/api/canopy/roles/${params.roleId}/applications/${params.applicationId}`,
        {
          method: "PATCH",
          body: { stage: params.stage, stageOrder: params.stageOrder ?? 0 },
        }
      ),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.roles.detail(variables.roleId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
    },
  });
}

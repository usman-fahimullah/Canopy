"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

// ============================================
// TYPES (mirrors API response shapes)
// ============================================

interface Pathway {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

interface JobAssignee {
  id: string;
  name: string | null;
  avatar: string | null;
}

export interface RoleListItem {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  closesAt: string | null;
  applicationCount?: number;
  pathway?: Pathway | null;
  climateCategory?: string | null;
  _count?: { applications: number };
  recruiter?: JobAssignee | null;
  hiringManager?: JobAssignee | null;
  reviewerCount?: number;
}

interface RolesListResponse {
  jobs: RoleListItem[];
}

export interface TemplateItem {
  id: string;
  name: string;
  sourceJobId: string | null;
  activeFields: string[];
  createdAt: string;
  updatedAt: string;
}

interface TemplatesResponse {
  templates: TemplateItem[];
}

// ============================================
// QUERIES
// ============================================

/** Fetch the roles list. Data cached for 2min stale / 5min GC. */
export function useRolesQuery(options?: { initialData?: RoleListItem[] }) {
  return useQuery({
    queryKey: queryKeys.canopy.roles.list(),
    queryFn: () => apiFetch<RolesListResponse>("/api/canopy/roles?skip=0&take=100"),
    select: (data) => data.jobs,
    ...(options?.initialData
      ? { initialData: { jobs: options.initialData } as RolesListResponse }
      : {}),
  });
}

/** Fetch role templates. */
export function useTemplatesQuery(options?: { initialData?: TemplateItem[] }) {
  return useQuery({
    queryKey: queryKeys.canopy.templates.all,
    queryFn: () => apiFetch<TemplatesResponse>("/api/canopy/templates"),
    select: (data) => data.templates,
    ...(options?.initialData
      ? { initialData: { templates: options.initialData } as TemplatesResponse }
      : {}),
  });
}

/** Fetch a single role's full data (job + applications + counts). */
export function useRoleDetailQuery(roleId: string) {
  return useQuery({
    queryKey: queryKeys.canopy.roles.detail(roleId),
    queryFn: () => apiFetch<Record<string, unknown>>(`/api/canopy/roles/${roleId}`),
    enabled: !!roleId,
  });
}

// ============================================
// MUTATIONS
// ============================================

/** Create a new blank role, then invalidate the roles list. */
export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiMutate<{ job: { id: string } }>("/api/canopy/roles", {
        method: "POST",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.roles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
    },
  });
}

/** Save/update a role, then invalidate detail + list. */
export function useSaveRoleMutation(roleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      apiMutate<Record<string, unknown>>(`/api/canopy/roles/${roleId}`, {
        method: "PATCH",
        body: payload,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.roles.detail(roleId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.roles.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.dashboard.all });
    },
  });
}

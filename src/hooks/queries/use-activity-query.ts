"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch } from "./fetchers";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface ActivityItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string | null;
  actorName: string | null;
  actorAvatar: string | null;
  changes: Record<string, { from: unknown; to: unknown }> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  summary: string;
}

interface ActivityFeedResponse {
  data: {
    items: ActivityItem[];
    total: number;
    hasMore: boolean;
  };
}

/* -------------------------------------------------------------------
   Queries
   ------------------------------------------------------------------- */

/**
 * Fetch activity feed for a specific application.
 */
export function useApplicationActivityQuery(applicationId: string | null) {
  return useQuery({
    queryKey: queryKeys.canopy.activity.forEntity("Application", applicationId ?? ""),
    queryFn: () =>
      apiFetch<ActivityFeedResponse>(
        `/api/canopy/activity?entityType=Application&entityId=${applicationId}`
      ),
    enabled: !!applicationId,
  });
}

/**
 * Fetch activity feed for all of a seeker's applications.
 */
export function useSeekerActivityQuery(seekerId: string | null) {
  return useQuery({
    queryKey: queryKeys.canopy.activity.forSeeker(seekerId ?? ""),
    queryFn: () => apiFetch<ActivityFeedResponse>(`/api/canopy/activity?seekerId=${seekerId}`),
    enabled: !!seekerId,
  });
}

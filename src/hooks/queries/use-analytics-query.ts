"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch } from "./fetchers";

// ============================================
// TYPES
// ============================================

export interface PipelineStage {
  stage: string;
  count: number;
}

export interface ApplicationsOverTimePoint {
  week: string;
  count: number;
}

export interface TopJob {
  id: string;
  title: string;
  applications: number;
  hired: number;
}

export interface SourceBreakdownItem {
  source: string;
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
  applicationsOverTime: ApplicationsOverTimePoint[];
  topJobs: TopJob[];
  sourceBreakdown: SourceBreakdownItem[];
}

// ============================================
// QUERIES
// ============================================

/** Fetch analytics data. Cached for 2min (global staleTime). */
export function useAnalyticsQuery() {
  return useQuery({
    queryKey: queryKeys.canopy.analytics.all,
    queryFn: () => apiFetch<AnalyticsData>("/api/canopy/analytics"),
  });
}

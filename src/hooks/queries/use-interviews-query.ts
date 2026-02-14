"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface Interview {
  id: string;
  applicationId: string;
  interviewerId: string;
  organizationId: string;
  scheduledAt: string;
  duration: number;
  type: "PHONE" | "VIDEO" | "ONSITE";
  location: string | null;
  meetingLink: string | null;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  interviewer?: {
    id: string;
    account: {
      name: string | null;
      avatar: string | null;
    };
  };
  application?: {
    id: string;
    seeker: {
      account: {
        name: string | null;
        email: string;
      };
    };
    job: {
      id: string;
      title: string;
    };
  };
}

export interface InterviewFilters {
  status?: string;
  applicationId?: string;
  interviewerId?: string;
  from?: string;
  to?: string;
  skip?: number;
  take?: number;
}

interface InterviewsListResponse {
  data: Interview[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

/* -------------------------------------------------------------------
   Queries
   ------------------------------------------------------------------- */

/** Fetch paginated/filtered interviews list. */
export function useInterviewsQuery(filters: InterviewFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.applicationId) params.set("applicationId", filters.applicationId);
  if (filters.interviewerId) params.set("interviewerId", filters.interviewerId);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters.take !== undefined) params.set("take", String(filters.take));

  return useQuery({
    queryKey: queryKeys.canopy.interviews.list(filters as Record<string, unknown>),
    queryFn: () => apiFetch<InterviewsListResponse>(`/api/canopy/interviews?${params.toString()}`),
    placeholderData: (previousData) => previousData,
  });
}

/** Fetch a single interview detail. */
export function useInterviewDetailQuery(interviewId: string | null) {
  return useQuery({
    queryKey: queryKeys.canopy.interviews.detail(interviewId ?? ""),
    queryFn: () => apiFetch<{ data: Interview }>(`/api/canopy/interviews/${interviewId}`),
    enabled: !!interviewId,
  });
}

/* -------------------------------------------------------------------
   Mutations
   ------------------------------------------------------------------- */

/** Schedule a new interview. */
export function useCreateInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      applicationId: string;
      interviewerId: string;
      scheduledAt: string;
      duration?: number;
      type?: "PHONE" | "VIDEO" | "ONSITE";
      location?: string;
      meetingLink?: string;
      notes?: string;
    }) =>
      apiMutate<{ data: Interview }>("/api/canopy/interviews", {
        method: "POST",
        body: params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.interviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
    },
  });
}

/** Update/reschedule an interview. */
export function useUpdateInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      interviewId: string;
      scheduledAt?: string;
      duration?: number;
      type?: "PHONE" | "VIDEO" | "ONSITE";
      location?: string;
      meetingLink?: string;
      notes?: string;
      status?: string;
    }) => {
      const { interviewId, ...body } = params;
      return apiMutate<{ data: Interview }>(`/api/canopy/interviews/${interviewId}`, {
        method: "PATCH",
        body,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.interviews.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.interviews.detail(variables.interviewId),
      });
    },
  });
}

/** Cancel an interview. */
export function useCancelInterviewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { interviewId: string }) =>
      apiMutate<{ data: Interview }>(`/api/canopy/interviews/${params.interviewId}`, {
        method: "PATCH",
        body: { status: "CANCELLED" },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.interviews.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.interviews.detail(variables.interviewId),
      });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface ApprovalRequest {
  id: string;
  organizationId: string;
  requesterId: string;
  approverId: string;
  type: "JOB_PUBLISH" | "OFFER_SEND";
  entityId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string | null;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
  requester?: {
    id: string;
    account: {
      name: string | null;
      avatar: string | null;
    };
  };
  approver?: {
    id: string;
    account: {
      name: string | null;
      avatar: string | null;
    };
  };
}

export interface ApprovalFilters {
  status?: "PENDING" | "APPROVED" | "REJECTED";
  type?: "JOB_PUBLISH" | "OFFER_SEND";
  skip?: number;
  take?: number;
}

interface ApprovalsListResponse {
  data: ApprovalRequest[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

/* -------------------------------------------------------------------
   Queries
   ------------------------------------------------------------------- */

/** Fetch paginated/filtered approvals list. */
export function useApprovalsQuery(filters: ApprovalFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.type) params.set("type", filters.type);
  if (filters.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters.take !== undefined) params.set("take", String(filters.take));

  return useQuery({
    queryKey: queryKeys.canopy.approvals.list(filters as Record<string, unknown>),
    queryFn: () => apiFetch<ApprovalsListResponse>(`/api/canopy/approvals?${params.toString()}`),
    placeholderData: (previousData) => previousData,
  });
}

/** Fetch pending approvals count (for badges/indicators). */
export function usePendingApprovalsCount() {
  return useQuery({
    queryKey: queryKeys.canopy.approvals.list({ status: "PENDING" }),
    queryFn: () => apiFetch<ApprovalsListResponse>(`/api/canopy/approvals?status=PENDING&take=0`),
    select: (data) => data.meta.total,
  });
}

/* -------------------------------------------------------------------
   Mutations
   ------------------------------------------------------------------- */

/** Respond to an approval request (approve or reject). */
export function useRespondApprovalMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      approvalId: string;
      status: "APPROVED" | "REJECTED";
      reason?: string;
    }) =>
      apiMutate<{ data: ApprovalRequest }>(`/api/canopy/approvals/${params.approvalId}`, {
        method: "PATCH",
        body: {
          status: params.status,
          reason: params.reason,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.approvals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.offers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.roles.all });
    },
  });
}

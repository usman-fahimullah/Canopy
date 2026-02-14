"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

export interface OfferRecord {
  id: string;
  applicationId: string;
  organizationId: string;
  createdById: string;
  salary: number | null;
  salaryCurrency: string;
  startDate: string;
  department: string | null;
  managerId: string | null;
  notes: string | null;
  letterContent: string;
  signingMethod: "SIGNING_LINK" | "DOCUMENT_UPLOAD" | "OFFLINE";
  signingLink: string | null;
  signingDocumentUrl: string | null;
  signingInstructions: string | null;
  status: "DRAFT" | "SENT" | "VIEWED" | "AWAITING_SIGNATURE" | "SIGNED" | "WITHDRAWN";
  sentAt: string | null;
  viewedAt: string | null;
  signedAt: string | null;
  withdrawnAt: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface OfferFilters {
  status?: string;
  applicationId?: string;
  skip?: number;
  take?: number;
}

interface OffersListResponse {
  data: OfferRecord[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

/* -------------------------------------------------------------------
   Queries
   ------------------------------------------------------------------- */

/** Fetch paginated/filtered offers list. */
export function useOffersQuery(filters: OfferFilters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.applicationId) params.set("applicationId", filters.applicationId);
  if (filters.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters.take !== undefined) params.set("take", String(filters.take));

  return useQuery({
    queryKey: queryKeys.canopy.offers.list(filters as Record<string, unknown>),
    queryFn: () => apiFetch<OffersListResponse>(`/api/canopy/offers?${params.toString()}`),
    placeholderData: (previousData) => previousData,
  });
}

/** Fetch a single offer detail. */
export function useOfferDetailQuery(offerId: string | null) {
  return useQuery({
    queryKey: queryKeys.canopy.offers.detail(offerId ?? ""),
    queryFn: () => apiFetch<{ data: OfferRecord }>(`/api/canopy/offers/${offerId}`),
    enabled: !!offerId,
  });
}

/* -------------------------------------------------------------------
   Mutations
   ------------------------------------------------------------------- */

/** Create a new offer draft. */
export function useCreateOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      applicationId: string;
      salary?: number;
      salaryCurrency?: string;
      startDate: string;
      department?: string;
      managerId?: string;
      notes?: string;
      letterContent: string;
      signingMethod: "SIGNING_LINK" | "DOCUMENT_UPLOAD" | "OFFLINE";
      signingLink?: string;
      signingDocumentUrl?: string;
      signingInstructions?: string;
    }) =>
      apiMutate<{ data: OfferRecord }>("/api/canopy/offers", {
        method: "POST",
        body: params,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.offers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
    },
  });
}

/** Update offer terms (while still in DRAFT). */
export function useUpdateOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      offerId: string;
      salary?: number;
      salaryCurrency?: string;
      startDate?: string;
      department?: string;
      managerId?: string;
      notes?: string;
      letterContent?: string;
      signingMethod?: "SIGNING_LINK" | "DOCUMENT_UPLOAD" | "OFFLINE";
      signingLink?: string;
      signingDocumentUrl?: string;
      signingInstructions?: string;
    }) => {
      const { offerId, ...body } = params;
      return apiMutate<{ data: OfferRecord }>(`/api/canopy/offers/${offerId}`, {
        method: "PATCH",
        body,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.offers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.offers.detail(variables.offerId),
      });
    },
  });
}

/** Send an offer to the candidate. */
export function useSendOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { offerId: string }) =>
      apiMutate<{ data: OfferRecord }>(`/api/canopy/offers/${params.offerId}/send`, {
        method: "POST",
        body: {},
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.offers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.offers.detail(variables.offerId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
    },
  });
}

/** Withdraw an offer. */
export function useWithdrawOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { offerId: string; reason?: string }) =>
      apiMutate<{ data: OfferRecord }>(`/api/canopy/offers/${params.offerId}/withdraw`, {
        method: "POST",
        body: { reason: params.reason },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.offers.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.offers.detail(variables.offerId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.candidates.all });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface ScoreResponse {
  criterionId: string;
  criterionLabel: string;
  rating: number;
  weight?: number;
}

interface ScorecardResult {
  id: string;
  scorerId: string;
  scorerName: string | null;
  scorerAvatar: string | null;
  overallRating: number;
  recommendation: string;
  comments: string | null;
  responses: ScoreResponse[];
  createdAt: string;
  updatedAt: string;
}

interface BlindReviewStatus {
  totalAssigned: number;
  submitted: number;
  isBlindLifted: boolean;
  isBlindEnabled: boolean;
}

interface AggregateScores {
  averageRating: number;
  totalScores: number;
  recommendations: Record<string, number>;
  criterionAverages: {
    criterionId: string;
    criterionLabel: string;
    averageRating: number;
    weight: number;
  }[];
  weightedScore: number;
}

interface ScoresQueryResult {
  data: {
    scores: ScorecardResult[];
    blindReview: BlindReviewStatus;
    aggregate: AggregateScores | null;
  };
}

/* -------------------------------------------------------------------
   Queries
   ------------------------------------------------------------------- */

/**
 * Fetch scores for an application with blind review status and aggregates.
 */
export function useScoresQuery(seekerId: string | null, applicationId: string | null) {
  return useQuery({
    queryKey: queryKeys.canopy.scores.forApplication(applicationId ?? ""),
    queryFn: () =>
      apiFetch<ScoresQueryResult>(
        `/api/canopy/candidates/${seekerId}/scores?applicationId=${applicationId}`
      ),
    enabled: !!seekerId && !!applicationId,
  });
}

/* -------------------------------------------------------------------
   Mutations
   ------------------------------------------------------------------- */

/**
 * Submit or update a scorecard for a candidate's application.
 */
export function useSubmitScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      seekerId: string;
      applicationId: string;
      overallRating: number;
      recommendation: string;
      comments?: string;
      responses?: string;
    }) =>
      apiMutate(`/api/canopy/candidates/${params.seekerId}/scores`, {
        method: "POST",
        body: {
          applicationId: params.applicationId,
          overallRating: params.overallRating,
          recommendation: params.recommendation,
          comments: params.comments,
          responses: params.responses,
        },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.scores.forApplication(variables.applicationId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.candidates.detail(variables.seekerId),
      });
    },
  });
}

/**
 * Update an existing score.
 */
export function useUpdateScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      seekerId: string;
      scoreId: string;
      applicationId: string;
      overallRating?: number;
      recommendation?: string;
      comments?: string;
      responses?: string;
    }) =>
      apiMutate(`/api/canopy/candidates/${params.seekerId}/scores/${params.scoreId}`, {
        method: "PATCH",
        body: {
          overallRating: params.overallRating,
          recommendation: params.recommendation,
          comments: params.comments,
          responses: params.responses,
        },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.canopy.scores.forApplication(variables.applicationId),
      });
    },
  });
}

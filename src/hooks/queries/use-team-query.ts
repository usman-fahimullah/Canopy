"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { OrgMemberRole } from "@prisma/client";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

// ============================================
// TYPES (re-export from team page types)
// ============================================

export interface AssignedJob {
  id: string;
  title: string;
  type: "recruiter" | "hiring_manager" | "reviewer";
}

export interface TeamMember {
  id: string;
  accountId: string;
  name: string;
  email: string;
  avatar: string | null;
  role: OrgMemberRole;
  title: string | null;
  lastActiveAt: string | null;
  joinedAt: string;
  assignedJobs?: AssignedJob[];
  assignedJobCount?: number;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: OrgMemberRole;
  invitedBy: { name: string; email: string };
  expiresAt: string;
  createdAt: string;
}

export interface TeamData {
  members: TeamMember[];
  pendingInvites: PendingInvite[];
  currentUserRole: OrgMemberRole;
  meta: {
    memberCount: number;
    pendingCount: number;
  };
}

// ============================================
// QUERIES
// ============================================

/** Fetch team data (members + invites + current user role). */
export function useTeamQuery() {
  return useQuery({
    queryKey: queryKeys.canopy.team.all,
    queryFn: () => apiFetch<TeamData>("/api/canopy/team"),
  });
}

// ============================================
// MUTATIONS
// ============================================

/** Change a team member's role. Optimistic update with rollback. */
export function useRoleChangeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { memberId: string; role: OrgMemberRole }) =>
      apiMutate<Record<string, unknown>>(`/api/canopy/team/members/${params.memberId}`, {
        method: "PATCH",
        body: { role: params.role },
      }),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.canopy.team.all });

      // Snapshot previous state for rollback
      const previous = queryClient.getQueryData<TeamData>(queryKeys.canopy.team.all);

      // Optimistic update
      if (previous) {
        queryClient.setQueryData<TeamData>(queryKeys.canopy.team.all, {
          ...previous,
          members: previous.members.map((m) =>
            m.id === variables.memberId ? { ...m, role: variables.role } : m
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.canopy.team.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.team.all });
    },
  });
}

/** Remove a team member. */
export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) =>
      apiMutate<Record<string, unknown>>(`/api/canopy/team/members/${memberId}`, {
        method: "DELETE",
      }),
    onMutate: async (memberId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.canopy.team.all });
      const previous = queryClient.getQueryData<TeamData>(queryKeys.canopy.team.all);

      if (previous) {
        queryClient.setQueryData<TeamData>(queryKeys.canopy.team.all, {
          ...previous,
          members: previous.members.filter((m) => m.id !== memberId),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.canopy.team.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.team.all });
    },
  });
}

/** Resend an invite. No optimistic update needed (just a side effect). */
export function useResendInviteMutation() {
  return useMutation({
    mutationFn: (inviteId: string) =>
      apiMutate<Record<string, unknown>>(`/api/canopy/team/invites/${inviteId}/resend`, {
        method: "POST",
      }),
  });
}

/** Revoke a pending invite. Optimistic removal. */
export function useRevokeInviteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) =>
      apiMutate<Record<string, unknown>>(`/api/canopy/team/invites/${inviteId}`, {
        method: "DELETE",
      }),
    onMutate: async (inviteId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.canopy.team.all });
      const previous = queryClient.getQueryData<TeamData>(queryKeys.canopy.team.all);

      if (previous) {
        queryClient.setQueryData<TeamData>(queryKeys.canopy.team.all, {
          ...previous,
          pendingInvites: previous.pendingInvites.filter((inv) => inv.id !== inviteId),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.canopy.team.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.canopy.team.all });
    },
  });
}

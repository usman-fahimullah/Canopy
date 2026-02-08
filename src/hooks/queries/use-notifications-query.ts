"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./keys";
import { apiFetch, apiMutate } from "./fetchers";

// ============================================
// TYPES
// ============================================

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: { url?: string };
}

interface NotificationsResponse {
  notifications: Notification[];
}

// ============================================
// QUERIES
// ============================================

/** Fetch notifications list. Cached so navigating away and back is instant. */
export function useNotificationsQuery() {
  return useQuery({
    queryKey: queryKeys.canopy.notifications.all,
    queryFn: () => apiFetch<NotificationsResponse>("/api/notifications"),
    select: (data) => data.notifications,
  });
}

// ============================================
// MUTATIONS
// ============================================

/** Mark a single notification as read. Optimistic update. */
export function useMarkReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      apiMutate<Record<string, unknown>>(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      }),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.canopy.notifications.all });

      const previous = queryClient.getQueryData<NotificationsResponse>(
        queryKeys.canopy.notifications.all
      );

      if (previous) {
        queryClient.setQueryData<NotificationsResponse>(queryKeys.canopy.notifications.all, {
          notifications: previous.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.canopy.notifications.all, context.previous);
      }
    },
  });
}

/** Mark all notifications as read. Optimistic update. */
export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiMutate<Record<string, unknown>>("/api/notifications/mark-all-read", {
        method: "POST",
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.canopy.notifications.all });

      const previous = queryClient.getQueryData<NotificationsResponse>(
        queryKeys.canopy.notifications.all
      );

      if (previous) {
        queryClient.setQueryData<NotificationsResponse>(queryKeys.canopy.notifications.all, {
          notifications: previous.notifications.map((n) => ({ ...n, read: true })),
        });
      }

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.canopy.notifications.all, context.previous);
      }
    },
  });
}

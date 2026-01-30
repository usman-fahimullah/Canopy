"use client";

import { useState, useEffect, useCallback } from "react";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  data: string | null;
  readAt: string | null;
  createdAt: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=20");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setError(null);
    } catch (err) {
      console.error("useNotifications error:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, readAt: new Date().toISOString() } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("markAsRead error:", err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("markAllAsRead error:", err);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
}

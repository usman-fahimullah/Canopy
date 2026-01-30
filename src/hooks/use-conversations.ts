"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ConversationListItem {
  id: string;
  lastMessageAt: string | null;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount: number;
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    headline: string | null;
  } | null;
}

export function useConversations() {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) {
        throw new Error("Failed to fetch conversations");
      }
      const data = await res.json();
      setConversations(data.conversations || []);
      setError(null);
    } catch (err) {
      console.error("useConversations error:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Subscribe to realtime updates for new messages
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Message",
        },
        () => {
          // Refetch conversation list on any message change
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchConversations]);

  const createConversation = useCallback(
    async (recipientAccountId: string, initialMessage?: string) => {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientAccountId, initialMessage }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create conversation");
        }
        const data = await res.json();
        // Refresh the list
        await fetchConversations();
        return data.conversation;
      } catch (err: any) {
        console.error("createConversation error:", err);
        throw err;
      }
    },
    [fetchConversations]
  );

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );

  return {
    conversations,
    loading,
    error,
    totalUnread,
    refetch: fetchConversations,
    createConversation,
  };
}

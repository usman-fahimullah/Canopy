"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDebouncedCallback } from "use-debounce";
import { logger, formatError } from "@/lib/logger";

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
      logger.error("useConversations fetch failed", { error: formatError(err), endpoint: "hooks/use-conversations" });
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Debounced refetch — batches rapid message events into a single API call
  const debouncedRefetch = useDebouncedCallback(fetchConversations, 500);

  // Track conversation IDs for scoped subscription
  const conversationIdsRef = useRef<string[]>([]);
  useEffect(() => {
    conversationIdsRef.current = conversations.map((c) => c.id);
  }, [conversations]);

  // Subscribe to realtime updates scoped to user's conversations
  useEffect(() => {
    const supabase = createClient();
    const convIds = conversationIdsRef.current;

    // Build a scoped filter if we have conversations, otherwise listen broadly
    const filterConfig =
      convIds.length > 0
        ? { filter: `conversationId=in.(${convIds.join(",")})` }
        : {};

    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          ...filterConfig,
        },
        (payload) => {
          const newRecord = payload.new as {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: string;
          };

          // Surgically update the matching conversation in local state
          setConversations((prev) => {
            const idx = prev.findIndex((c) => c.id === newRecord.conversationId);
            if (idx === -1) {
              // New conversation we don't have yet — debounced full refetch
              debouncedRefetch();
              return prev;
            }

            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              lastMessageAt: newRecord.createdAt,
              lastMessage: {
                id: newRecord.id,
                content: newRecord.content,
                senderId: newRecord.senderId,
                createdAt: newRecord.createdAt,
              },
              // Increment unread count (will be corrected on next full fetch)
              unreadCount: updated[idx].unreadCount + 1,
            };

            // Re-sort by lastMessageAt (most recent first)
            updated.sort((a, b) => {
              const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
              const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
              return bTime - aTime;
            });

            return updated;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [debouncedRefetch]);

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
      } catch (err) {
        logger.error("createConversation failed", { error: formatError(err), endpoint: "hooks/use-conversations" });
        throw err;
      }
    },
    [fetchConversations]
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    conversations,
    loading,
    error,
    totalUnread,
    refetch: fetchConversations,
    createConversation,
  };
}

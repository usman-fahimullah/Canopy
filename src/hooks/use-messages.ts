"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { logger, formatError } from "@/lib/logger";

export interface MessageItem {
  id: string;
  content: string;
  senderId: string;
  attachmentUrls: string[];
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

interface UseMessagesOptions {
  conversationId: string | null;
  limit?: number;
}

export function useMessages({ conversationId, limit = 50 }: UseMessagesOptions) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Track current conversation to avoid stale updates
  const currentConversationRef = useRef(conversationId);

  const fetchMessages = useCallback(
    async (cursor?: string) => {
      if (!conversationId) return;

      const isLoadMore = !!cursor;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`/api/conversations/${conversationId}/messages?${params}`);

        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await res.json();

        // Only update if this is still the active conversation
        if (currentConversationRef.current !== conversationId) return;

        if (isLoadMore) {
          // Append older messages (they come in reverse chronological)
          setMessages((prev) => [...prev, ...data.messages]);
        } else {
          // Messages come newest-first from API, reverse for display
          setMessages(data.messages.reverse());
        }

        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
        setError(null);
      } catch (err) {
        logger.error("useMessages fetch failed", {
          error: formatError(err),
          endpoint: "hooks/use-messages",
        });
        setError("Failed to load messages");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [conversationId, limit]
  );

  // Fetch messages when conversation changes
  useEffect(() => {
    currentConversationRef.current = conversationId;
    if (conversationId) {
      setMessages([]);
      setNextCursor(null);
      setHasMore(false);
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId, fetchMessages]);

  // Cache of participant sender info (populated from initial message fetch)
  const senderCacheRef = useRef<
    Map<string, { id: string; name: string | null; avatar: string | null }>
  >(new Map());

  // Build sender cache whenever messages load
  useEffect(() => {
    messages.forEach((msg) => {
      if (msg.sender && !senderCacheRef.current.has(msg.senderId)) {
        senderCacheRef.current.set(msg.senderId, msg.sender);
      }
    });
  }, [messages]);

  // Subscribe to realtime message inserts for this conversation
  useEffect(() => {
    if (!conversationId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `conversationId=eq.${conversationId}`,
        },
        (payload) => {
          // Only process if we're still on this conversation
          if (currentConversationRef.current !== conversationId) return;

          const newRecord = payload.new as {
            id: string;
            content: string;
            senderId: string;
            conversationId: string;
            createdAt: string;
            attachmentUrls: string[] | null;
          };

          // Surgically add to local state instead of full refetch
          setMessages((prev) => {
            // Skip if we already have this message (from optimistic add in sendMessage)
            if (prev.some((m) => m.id === newRecord.id)) return prev;

            // Look up sender info from cache
            const cachedSender = senderCacheRef.current.get(newRecord.senderId);
            if (!cachedSender) {
              // Sender not in cache — fall back to refetch to get full sender info
              fetchMessages();
              return prev;
            }

            const newMessage: MessageItem = {
              id: newRecord.id,
              content: newRecord.content,
              senderId: newRecord.senderId,
              attachmentUrls: newRecord.attachmentUrls || [],
              createdAt: newRecord.createdAt,
              sender: cachedSender,
            };

            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = useCallback(
    async (content: string, attachmentUrls?: string[]) => {
      if (!conversationId) return null;
      if (!content.trim() && (!attachmentUrls || attachmentUrls.length === 0)) return null;

      setSending(true);
      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, attachmentUrls }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to send message");
        }

        const data = await res.json();

        // Optimistically add message to the list
        setMessages((prev) => [...prev, data.message]);

        return data.message;
      } catch (err) {
        logger.error("sendMessage failed", {
          error: formatError(err),
          endpoint: "hooks/use-messages",
        });
        setError("Failed to send message");
        return null;
      } finally {
        setSending(false);
      }
    },
    [conversationId]
  );

  const loadMore = useCallback(() => {
    if (hasMore && nextCursor && !loadingMore) {
      fetchMessages(nextCursor);
    }
  }, [hasMore, nextCursor, loadingMore, fetchMessages]);

  const markAsRead = useCallback(async () => {
    if (!conversationId) return;
    try {
      await fetch(`/api/messages/${conversationId}/read`, {
        method: "PUT",
      });
    } catch (err) {
      logger.error("markAsRead failed", {
        error: formatError(err),
        endpoint: "hooks/use-messages",
      });
    }
  }, [conversationId]);

  return {
    messages,
    loading,
    loadingMore,
    error,
    hasMore,
    sending,
    sendMessage,
    loadMore,
    markAsRead,
    refetch: fetchMessages,
  };
}

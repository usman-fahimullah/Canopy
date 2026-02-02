"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChatCircle } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { useConversations } from "@/hooks/use-conversations";
import { useMessages } from "@/hooks/use-messages";
import { ConversationList } from "./conversation-list";
import { ChatPanel } from "./chat-panel";

export interface MessagesLayoutProps {
  basePath: string;
  emptyMessage?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
}

export function MessagesLayout({
  basePath,
  emptyMessage = "No conversations yet",
  emptyActionLabel,
  emptyActionHref,
}: MessagesLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeThreadId = searchParams.get("thread");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Get current user's account ID
  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setCurrentAccountId(data.account?.id || null);
        }
      } catch {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentAccountId(user.id);
        }
      }
    };
    fetchAccountId();
  }, []);

  // Hooks
  const { conversations, loading: conversationsLoading } = useConversations();

  const {
    messages,
    loading: messagesLoading,
    sending,
    sendMessage,
    markAsRead,
    hasMore,
    loadMore,
    loadingMore,
  } = useMessages({ conversationId: activeThreadId });

  // Mark as read when viewing a conversation
  useEffect(() => {
    if (activeThreadId) {
      markAsRead();
    }
  }, [activeThreadId, markAsRead]);

  // Show chat panel on mobile when a thread is selected
  useEffect(() => {
    if (activeThreadId) {
      setMobileShowChat(true);
    }
  }, [activeThreadId]);

  const activeConversation = conversations.find(
    (c) => c.id === activeThreadId
  );
  const otherUser = activeConversation?.otherUser || null;

  const handleSelectThread = useCallback(
    (id: string) => {
      router.push(`${basePath}?thread=${id}`);
    },
    [basePath, router]
  );

  const handleSendMessage = useCallback(
    async (content: string) => {
      await sendMessage(content);
    },
    [sendMessage]
  );

  const handleBack = useCallback(() => {
    setMobileShowChat(false);
  }, []);

  if (conversationsLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] lg:h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] lg:h-screen">
      {/* Panel 1: Conversation List */}
      <div
        className={cn(
          "flex h-full w-full flex-col border-r border-[var(--primitive-neutral-200)] bg-[var(--background-default)] lg:w-[480px] shrink-0",
          mobileShowChat && activeThreadId ? "hidden lg:flex" : "flex"
        )}
      >
        <ConversationList
          conversations={conversations}
          activeThreadId={activeThreadId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectThread={handleSelectThread}
          emptyMessage={emptyMessage}
          emptyActionLabel={emptyActionLabel}
          emptyActionHref={emptyActionHref}
        />
      </div>

      {/* Panel 2: Chat View */}
      <div
        className={cn(
          "flex h-full flex-1 flex-col bg-[var(--primitive-neutral-100)]",
          !mobileShowChat || !activeThreadId ? "hidden lg:flex" : "flex"
        )}
      >
        {activeThreadId && otherUser ? (
          <ChatPanel
            otherUser={otherUser}
            messages={messages}
            messagesLoading={messagesLoading}
            sending={sending}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onSendMessage={handleSendMessage}
            onLoadMore={loadMore}
            onBack={handleBack}
            currentAccountId={currentAccountId}
          />
        ) : (
          /* Empty State - No conversation selected */
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <ChatCircle
              size={64}
              className="text-[var(--primitive-neutral-400)]"
            />
            <div className="text-center">
              <p className="text-xl font-medium text-[var(--primitive-green-800)]">
                Select a conversation
              </p>
              <p className="mt-1 text-lg text-[var(--primitive-neutral-500)]">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { useConversations } from "@/hooks/use-conversations";
import { useMessages } from "@/hooks/use-messages";
import {
  MagnifyingGlass,
  Plus,
  CalendarDots,
  Smiley,
  ArrowCircleUp,
  ArrowLeft,
  ChatCircle,
} from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";

function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: false }) + " ago";
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] lg:h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const activeThreadId = searchParams.get("thread");

  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show chat panel on mobile when a thread is selected
  useEffect(() => {
    if (activeThreadId) {
      setMobileShowChat(true);
    }
  }, [activeThreadId]);

  const activeConversation = conversations.find((c) => c.id === activeThreadId);
  const otherUser = activeConversation?.otherUser || null;

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    if (!conv.otherUser) return false;
    return conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending) return;
    const content = newMessage;
    setNewMessage("");
    await sendMessage(content);
  }, [newMessage, sending, sendMessage]);

  // Auto-resize textarea
  const handleTextareaInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewMessage(e.target.value);
      const el = e.target;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    },
    []
  );

  if (conversationsLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] lg:h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] lg:h-screen">
      {/* ─── Panel 1: Conversation List ─── */}
      <div
        className={cn(
          "flex h-full w-full flex-col border-r border-[var(--primitive-neutral-200)] bg-white lg:w-[480px] shrink-0",
          mobileShowChat && activeThreadId ? "hidden lg:flex" : "flex"
        )}
      >
        {/* Segmented Tabs */}
        <div className="border-b border-[var(--primitive-neutral-200)] px-6 py-7">
          <div className="flex rounded-2xl bg-[var(--primitive-neutral-200)] p-1">
            <button
              onClick={() => setActiveTab("messages")}
              className={cn(
                "flex-1 rounded-xl py-3 px-2 text-sm text-center transition-all",
                activeTab === "messages"
                  ? "bg-white font-bold text-[var(--primitive-green-800)] shadow-[1px_2px_16px_0px_rgba(31,29,28,0.08)]"
                  : "font-normal text-[var(--primitive-neutral-700)]"
              )}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={cn(
                "flex-1 rounded-xl py-3 px-2 text-sm text-center transition-all cursor-pointer",
                activeTab === "requests"
                  ? "bg-white font-bold text-[var(--primitive-green-800)] shadow-[1px_2px_16px_0px_rgba(31,29,28,0.08)]"
                  : "font-normal text-[var(--primitive-neutral-700)]"
              )}
            >
              Requests
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-b border-[var(--primitive-neutral-200)] px-6 py-5">
          <button className="flex w-full items-center gap-2 rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] p-4">
            <MagnifyingGlass
              size={24}
              className="shrink-0 text-[var(--primitive-neutral-600)]"
            />
            <input
              type="text"
              placeholder="Search your messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-lg text-[var(--primitive-green-800)] placeholder:text-[var(--primitive-neutral-600)] outline-none"
            />
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeThreadId;
              const hasUnread = conv.unreadCount > 0;

              return (
                <Link
                  key={conv.id}
                  href={`/candid/messages?thread=${conv.id}`}
                  className={cn(
                    "flex items-start gap-3 border-b border-[var(--primitive-neutral-200)] px-6 py-4 transition-colors",
                    isActive
                      ? "bg-[var(--primitive-neutral-100)]"
                      : "bg-white hover:bg-[var(--primitive-neutral-100)]/50"
                  )}
                >
                  {/* Avatar */}
                  <Avatar
                    size="default"
                    src={conv.otherUser?.avatar || undefined}
                    name={conv.otherUser?.name || "User"}
                    color="green"
                    className="h-12 w-12 shrink-0 rounded-2xl border border-[var(--primitive-neutral-300)]"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <p
                        className={cn(
                          "truncate text-lg leading-6",
                          isActive
                            ? "font-bold text-[var(--primitive-blue-400)]"
                            : hasUnread
                              ? "font-bold text-[var(--primitive-neutral-800)]"
                              : "font-normal text-[var(--primitive-neutral-800)]"
                        )}
                      >
                        {conv.otherUser?.name || "Unknown User"}
                      </p>
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-lg leading-6 line-clamp-2",
                        isActive
                          ? "text-black"
                          : "text-[var(--primitive-neutral-500)]"
                      )}
                    >
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>

                  {/* Timestamp + Unread */}
                  <div className="flex shrink-0 flex-col items-end gap-3">
                    {conv.lastMessage && (
                      <span className="text-sm leading-5 text-[var(--primitive-neutral-500)] whitespace-nowrap">
                        {formatTimestamp(conv.lastMessage.createdAt)}
                      </span>
                    )}
                    {hasUnread && (
                      <div className="h-3 w-3 rounded-full bg-[var(--primitive-blue-400)]" />
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <ChatCircle
                size={48}
                className="text-[var(--primitive-neutral-400)]"
              />
              <p className="text-lg text-[var(--primitive-neutral-500)]">
                No conversations yet
              </p>
              <Link
                href="/candid/browse"
                className="text-sm font-medium text-[var(--primitive-blue-500)] hover:underline"
              >
                Find a mentor to start chatting
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ─── Panel 2: Chat View ─── */}
      <div
        className={cn(
          "flex h-full flex-1 flex-col bg-[var(--primitive-neutral-100)]",
          !mobileShowChat || !activeThreadId ? "hidden lg:flex" : "flex"
        )}
      >
        {activeThreadId && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-[var(--primitive-neutral-200)] bg-white px-6 py-[30px]">
              <div className="flex items-center gap-3">
                {/* Mobile back button */}
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="lg:hidden shrink-0 p-1 -ml-1"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={24} className="text-[var(--primitive-green-800)]" />
                </button>
                <h2 className="text-4xl font-medium leading-[48px] text-[var(--primitive-green-800)]">
                  {otherUser.name}
                </h2>
              </div>
            </div>

            {/* Messages Area */}
            <div className="relative flex-1 overflow-y-auto">
              <div className="px-6 py-4 space-y-0">
                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pb-4">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="text-sm text-[var(--primitive-blue-500)] hover:underline disabled:opacity-50"
                    >
                      {loadingMore ? "Loading..." : "Load earlier messages"}
                    </button>
                  </div>
                )}

                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full py-20">
                    <Spinner size="lg" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full py-20">
                    <p className="text-lg text-[var(--primitive-neutral-500)]">
                      No messages yet. Say hello!
                    </p>
                  </div>
                ) : (
                  <MessageBubbles
                    messages={messages}
                    currentAccountId={currentAccountId}
                    otherUser={otherUser}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Composer */}
            <div className="border-t border-[var(--primitive-neutral-200)] bg-white px-12 py-6">
              <div className="flex flex-col gap-4 rounded-2xl bg-[var(--primitive-neutral-100)] p-6">
                {/* Input */}
                <textarea
                  ref={inputRef}
                  placeholder="Write a message"
                  value={newMessage}
                  onChange={handleTextareaInput}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  className="w-full resize-none bg-transparent text-lg text-[var(--primitive-green-800)] placeholder:text-[var(--primitive-green-800)] outline-none"
                  aria-label="Write a message"
                />

                {/* Actions Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <button
                      className="flex items-center justify-center rounded-2xl bg-[var(--primitive-neutral-200)] p-3 transition-colors hover:bg-[var(--primitive-neutral-300)]"
                      aria-label="Attach file"
                    >
                      <Plus size={24} className="text-[var(--primitive-green-800)]" />
                    </button>
                    <button
                      className="flex items-center justify-center rounded-2xl bg-[var(--primitive-neutral-200)] p-3 transition-colors hover:bg-[var(--primitive-neutral-300)]"
                      aria-label="Schedule"
                    >
                      <CalendarDots size={24} className="text-[var(--primitive-green-800)]" />
                    </button>
                    <button
                      className="flex items-center justify-center rounded-2xl bg-[var(--primitive-neutral-200)] p-3 transition-colors hover:bg-[var(--primitive-neutral-300)]"
                      aria-label="Emoji"
                    >
                      <Smiley size={24} className="text-[var(--primitive-green-800)]" />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="flex items-center justify-center rounded-2xl bg-[var(--primitive-blue-200)] p-3 transition-colors hover:bg-[var(--primitive-blue-300)] disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Spinner size="sm" />
                    ) : (
                      <ArrowCircleUp
                        size={24}
                        weight="fill"
                        className="text-[var(--primitive-blue-700)]"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
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

/* ─── Message Bubbles with Grouping ─── */

interface MessageBubblesProps {
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    attachmentUrls?: string[];
  }>;
  currentAccountId: string | null;
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
  };
}

function MessageBubbles({
  messages,
  currentAccountId,
  otherUser,
}: MessageBubblesProps) {
  // Group consecutive messages from the same sender
  const groups: Array<{
    senderId: string;
    isOwn: boolean;
    messages: typeof messages;
  }> = [];

  for (const msg of messages) {
    const isOwn = msg.senderId === currentAccountId;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.senderId === msg.senderId) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({
        senderId: msg.senderId,
        isOwn,
        messages: [msg],
      });
    }
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.messages[0].id}
          className={cn(
            "flex items-end gap-3 px-0 py-0",
            group.isOwn ? "justify-end" : "justify-start"
          )}
        >
          {/* Avatar for received messages (on last bubble) */}
          {!group.isOwn && (
            <Avatar
              size="sm"
              src={otherUser.avatar || undefined}
              name={otherUser.name}
              color="green"
              className="h-8 w-8 shrink-0 rounded-xl border border-[var(--primitive-neutral-300)]"
            />
          )}

          {/* Bubble cluster */}
          <div
            className={cn(
              "flex flex-col gap-1 max-w-[480px]",
              group.isOwn ? "items-end" : "items-start"
            )}
          >
            {/* Sender label for received messages */}
            {!group.isOwn && (
              <p className="text-sm leading-5 text-[var(--primitive-neutral-800)] mb-0.5">
                {otherUser.name}
              </p>
            )}

            {group.messages.map((msg, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === group.messages.length - 1;
              const isSingle = group.messages.length === 1;

              // Bubble radius logic
              let radiusClass: string;
              if (isSingle) {
                // Single bubble - flatten the tail corner
                radiusClass = group.isOwn
                  ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-[4px]"
                  : "rounded-tl-xl rounded-tr-xl rounded-bl-[4px] rounded-br-xl";
              } else if (isFirst) {
                radiusClass = "rounded-xl";
              } else if (isLast) {
                radiusClass = group.isOwn
                  ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-[4px]"
                  : "rounded-tl-xl rounded-tr-xl rounded-bl-[4px] rounded-br-xl";
              } else {
                radiusClass = "rounded-xl";
              }

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "px-3 py-3 text-lg leading-6",
                    radiusClass,
                    group.isOwn
                      ? "bg-[var(--primitive-blue-200)] text-[var(--primitive-blue-800)]"
                      : "bg-[var(--primitive-neutral-200)] text-black",
                    !isSingle && isFirst && !group.isOwn && "w-full",
                    !isSingle && !isFirst && !isLast && !group.isOwn && "w-full"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              );
            })}
          </div>

          {/* Avatar for sent messages (on last bubble) */}
          {group.isOwn && (
            <Avatar
              size="sm"
              src={undefined}
              name="You"
              color="green"
              className="h-8 w-8 shrink-0 rounded-xl border border-[var(--primitive-neutral-300)]"
            />
          )}
        </div>
      ))}
    </div>
  );
}

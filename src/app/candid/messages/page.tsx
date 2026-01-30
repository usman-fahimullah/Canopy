"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/client";
import { useConversations } from "@/hooks/use-conversations";
import { useMessages } from "@/hooks/use-messages";
import {
  PaperPlaneRight,
  Paperclip,
  ArrowLeft,
  DotsThree,
  Phone,
  VideoCamera,
  Info,
  ChatCircle,
} from "@phosphor-icons/react";
import { format, isToday, isYesterday } from "date-fns";

function formatMessageDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) {
    return format(d, "h:mm a");
  }
  if (isYesterday(d)) {
    return `Yesterday ${format(d, "h:mm a")}`;
  }
  return format(d, "MMM d, h:mm a");
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8" />}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeThreadId = searchParams.get("thread");

  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        // If profile API doesn't exist yet, fall back to supabase user
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // We'll use supabaseId as fallback; senderId in messages uses accountId
          setCurrentAccountId(user.id);
        }
      }
    };
    fetchAccountId();
  }, []);

  // Hooks
  const {
    conversations,
    loading: conversationsLoading,
    totalUnread,
  } = useConversations();

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

  // Find the active conversation's other user info
  const activeConversation = conversations.find((c) => c.id === activeThreadId);
  const otherUser = activeConversation?.otherUser || null;

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    if (!conv.otherUser) return false;
    return conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = async () => {
    if (!newMessage.trim() || sending) return;
    const content = newMessage;
    setNewMessage("");
    await sendMessage(content);
  };

  if (conversationsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Card container */}
      <Card className="h-[calc(100vh-12rem)] overflow-hidden">
        <div className="flex h-full">
          {/* Thread List - Left Panel */}
          <div
            className={`flex h-full w-full flex-col border-r border-[var(--border-default)] md:w-80 lg:w-96 ${
              activeThreadId ? "hidden md:flex" : ""
            }`}
          >
            {/* Header */}
            <div className="border-b border-[var(--border-default)] p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-heading-sm font-semibold text-foreground-default">
                  Messages
                </h1>
                {totalUnread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primitive-green-600)] px-1.5 text-[10px] font-bold text-white">
                    {totalUnread}
                  </span>
                )}
              </div>
              {/* Search */}
              <div className="mt-3">
                <SearchInput
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  size="compact"
                />
              </div>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/candid/messages?thread=${conv.id}`}
                    className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                      conv.id === activeThreadId
                        ? "bg-[var(--candid-background-subtle)]"
                        : "hover:bg-[var(--background-subtle)]"
                    }`}
                  >
                    <Avatar
                      size="default"
                      src={conv.otherUser?.avatar || undefined}
                      name={conv.otherUser?.name || "User"}
                      color="green"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground-default truncate">
                          {conv.otherUser?.name || "Unknown User"}
                        </p>
                        {conv.lastMessage && (
                          <span className="text-[11px] text-foreground-muted flex-shrink-0 ml-2">
                            {formatMessageDate(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-caption text-foreground-muted truncate">
                        {conv.lastMessage?.content || "No messages yet"}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primitive-green-600)] text-[10px] font-bold text-white">
                        {conv.unreadCount}
                      </span>
                    )}
                  </Link>
                ))
              ) : (
                <div className="flex h-full items-center justify-center p-4 text-center">
                  <div>
                    <p className="text-caption text-foreground-muted">No conversations yet</p>
                    <Button variant="link" size="sm" className="mt-2" asChild>
                      <Link href="/candid/browse">
                        Find a mentor to start chatting
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message Content - Right Panel */}
          <div
            className={`flex h-full flex-1 flex-col ${!activeThreadId ? "hidden md:flex" : ""}`}
          >
            {activeThreadId && otherUser ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-default)] p-4">
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon-sm" className="md:hidden" asChild>
                      <Link href="/candid/messages">
                        <ArrowLeft size={20} />
                      </Link>
                    </Button>
                    <Avatar
                      size="default"
                      src={otherUser.avatar || undefined}
                      name={otherUser.name}
                      color="green"
                    />
                    <div>
                      <Link
                        href={`/candid/coach/${otherUser.id}`}
                        className="text-body-strong font-semibold text-foreground-default hover:text-[var(--primitive-green-800)]"
                      >
                        {otherUser.name}
                      </Link>
                      <p className="text-caption text-foreground-muted">
                        {otherUser.headline
                          || (otherUser.role === "COACH" || otherUser.role === "MENTOR"
                            ? "Coach"
                            : "Seeker")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm">
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <VideoCamera size={18} />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Info size={18} />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <DotsThree size={18} weight="bold" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Load More Button */}
                  {hasMore && (
                    <div className="flex justify-center pb-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={loadMore}
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <Spinner size="sm" className="mr-2" />
                        ) : null}
                        Load earlier messages
                      </Button>
                    </div>
                  )}

                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Spinner size="lg" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-foreground-muted text-caption">
                        No messages yet. Say hello!
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => {
                      const isOwn = message.senderId === currentAccountId;
                      const showAvatar =
                        index === 0 || messages[index - 1].senderId !== message.senderId;

                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                        >
                          {/* Avatar */}
                          <div className="w-8 flex-shrink-0">
                            {showAvatar && !isOwn && otherUser && (
                              <Avatar
                                size="sm"
                                src={otherUser.avatar || undefined}
                                name={otherUser.name}
                                color="green"
                              />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                            <div
                              className={`rounded-2xl px-4 py-2.5 ${
                                isOwn
                                  ? "bg-[var(--primitive-green-800)] text-white"
                                  : "bg-[var(--primitive-blue-200)] text-foreground-default"
                              }`}
                            >
                              <p className="text-body whitespace-pre-wrap">{message.content}</p>
                              {/* Attachments */}
                              {message.attachmentUrls && message.attachmentUrls.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {message.attachmentUrls.map((url, i) => (
                                    <a
                                      key={i}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-1 text-caption underline ${
                                        isOwn ? "text-white/80" : "text-[var(--foreground-link)]"
                                      }`}
                                    >
                                      <Paperclip size={12} />
                                      Attachment {i + 1}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            <p
                              className={`mt-1 text-caption text-foreground-muted ${
                                isOwn ? "text-right" : ""
                              }`}
                            >
                              {formatMessageDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-[var(--border-default)] p-4">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="icon">
                      <Paperclip size={20} />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={1}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      variant="primary"
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                    >
                      {sending ? (
                        <Spinner size="sm" />
                      ) : (
                        <PaperPlaneRight size={20} weight="fill" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // Empty State
              <div className="flex h-full items-center justify-center">
                <EmptyState
                  preset="inbox"
                  title="Select a conversation"
                  description="Choose a conversation from the list to start messaging"
                />
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { createClient } from "@/lib/supabase/client";
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

function formatMessageDate(date: Date): string {
  if (isToday(date)) {
    return format(date, "h:mm a");
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, "h:mm a")}`;
  }
  return format(date, "MMM d, h:mm a");
}

interface Thread {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: number;
  otherUser?: {
    id: string;
    name: string;
    avatar: string | null;
    role: string;
    currentRole?: string;
    currentCompany?: string;
  };
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  readAt: Date | null;
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
  const activeThreadId = searchParams.get("thread");

  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);

  // Get current user
  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  // For now, threads and messages would come from an API
  // This is a placeholder until a messages API is implemented
  const activeThread = threads.find((t) => t.id === activeThreadId);
  const otherUser = activeThread?.otherUser || null;

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    if (!thread.otherUser) return false;
    return thread.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // TODO: Implement message sending via API
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  if (loading) {
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
              <h1 className="text-heading-sm font-semibold text-foreground-default">Messages</h1>
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
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/candid/messages?thread=${thread.id}`}
                    className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
                      thread.id === activeThreadId
                        ? "bg-[var(--candid-background-subtle)]"
                        : "hover:bg-[var(--background-subtle)]"
                    }`}
                  >
                    <Avatar
                      size="default"
                      src={thread.otherUser?.avatar || undefined}
                      name={thread.otherUser?.name || "User"}
                      color="green"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground-default truncate">
                        {thread.otherUser?.name || "Unknown User"}
                      </p>
                      <p className="text-caption text-foreground-muted truncate">
                        {thread.lastMessage}
                      </p>
                    </div>
                    {thread.unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--primitive-green-600)] text-[10px] font-bold text-white">
                        {thread.unreadCount}
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
            {activeThread && otherUser ? (
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
                        {otherUser.role === "coach" || otherUser.role === "mentor"
                          ? `${otherUser.currentRole || ""} at ${otherUser.currentCompany || ""}`
                          : "Seeker"}
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
                  {activeMessages.map((message, index) => {
                    const isOwn = message.senderId === currentUserId;
                    const showAvatar =
                      index === 0 || activeMessages[index - 1].senderId !== message.senderId;

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
                          </div>
                          <p
                            className={`mt-1 text-caption text-foreground-muted ${
                              isOwn ? "text-right" : ""
                            }`}
                          >
                            {formatMessageDate(message.createdAt)}
                            {isOwn && message.readAt && (
                              <span className="ml-2 text-[var(--primitive-green-800)]">Read</span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
                      disabled={!newMessage.trim()}
                    >
                      <PaperPlaneRight size={20} weight="fill" />
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

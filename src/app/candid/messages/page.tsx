"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MessageThread } from "../components";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  currentUser,
  getThreadsForUser,
  getMessagesForThread,
  getUserById,
} from "@/lib/candid";
import {
  MagnifyingGlass,
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

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const activeThreadId = searchParams.get("thread");

  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const threads = getThreadsForUser(currentUser.id);
  const activeThread = threads.find((t) => t.id === activeThreadId);
  const activeMessages = activeThread ? getMessagesForThread(activeThread.id) : [];

  const otherUserId = activeThread?.participantIds.find((id) => id !== currentUser.id);
  const otherUser = otherUserId ? getUserById(otherUserId) : null;

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    const otherUserId = thread.participantIds.find((id) => id !== currentUser.id);
    const otherUser = otherUserId ? getUserById(otherUserId) : null;
    if (!otherUser) return false;
    const fullName = `${otherUser.firstName} ${otherUser.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // In a real app, this would send the message
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* White card container with shadow */}
      <div className="h-[calc(100vh-12rem)] overflow-hidden rounded-card bg-white shadow-card">
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
              <div className="relative mt-3">
                <MagnifyingGlass
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
                />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background-subtle)] py-2 pl-9 pr-3 text-body placeholder:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
                />
              </div>
            </div>

            {/* Thread List */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                  <MessageThread
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                  />
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
                      src={otherUser.avatar}
                      name={`${otherUser.firstName} ${otherUser.lastName}`}
                      color="green"
                    />
                    <div>
                      <Link
                        href={`/candid/profile/${otherUser.id}`}
                        className="text-body-strong font-semibold text-foreground-default hover:text-[var(--primitive-green-800)]"
                      >
                        {otherUser.firstName} {otherUser.lastName}
                      </Link>
                      <p className="text-caption text-foreground-muted">
                        {otherUser.role === "coach" || otherUser.role === "light-mentor"
                          ? `${(otherUser as any).currentRole} at ${(otherUser as any).currentCompany}`
                          : "Mentee"}
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
                    const isOwn = message.senderId === currentUser.id;
                    const sender = getUserById(message.senderId);
                    const showAvatar =
                      index === 0 || activeMessages[index - 1].senderId !== message.senderId;

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                      >
                        {/* Avatar */}
                        <div className="w-8 flex-shrink-0">
                          {showAvatar && !isOwn && sender && (
                            <Avatar
                              size="sm"
                              src={sender.avatar}
                              name={`${sender.firstName} ${sender.lastName}`}
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
                      <textarea
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
                        className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-2.5 text-body placeholder:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
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
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
                    <ChatCircle size={32} className="text-[var(--primitive-green-800)]" />
                  </div>
                  <h3 className="mt-4 text-body-strong font-semibold text-foreground-default">
                    Select a conversation
                  </h3>
                  <p className="mt-2 text-caption text-foreground-muted">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

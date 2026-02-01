"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MagnifyingGlass, ChatCircle } from "@phosphor-icons/react";
import type { ConversationListItem } from "@/hooks/use-conversations";
import { ConversationItem } from "./conversation-item";

export interface ConversationListProps {
  conversations: ConversationListItem[];
  activeThreadId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectThread: (id: string) => void;
  emptyMessage?: string;
  emptyActionLabel?: string;
  emptyActionHref?: string;
}

export function ConversationList({
  conversations,
  activeThreadId,
  searchQuery,
  onSearchChange,
  onSelectThread,
  emptyMessage = "No conversations yet",
  emptyActionLabel,
  emptyActionHref,
}: ConversationListProps) {
  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    if (!conv.otherUser) return false;
    return conv.otherUser.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col">
      {/* Search Bar */}
      <div className="border-b border-[var(--primitive-neutral-200)] px-6 py-5">
        <div className="flex w-full items-center gap-2 rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] p-4">
          <MagnifyingGlass
            size={24}
            className="shrink-0 text-[var(--primitive-neutral-600)]"
          />
          <input
            type="text"
            placeholder="Search your messages"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-lg text-[var(--primitive-green-800)] placeholder:text-[var(--primitive-neutral-600)] outline-none"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeThreadId}
              onClick={() => onSelectThread(conv.id)}
            />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <ChatCircle
              size={48}
              className="text-[var(--primitive-neutral-400)]"
            />
            <p className="text-lg text-[var(--primitive-neutral-500)]">
              {emptyMessage}
            </p>
            {emptyActionLabel && emptyActionHref && (
              <Link
                href={emptyActionHref}
                className="text-sm font-medium text-[var(--primitive-blue-500)] hover:underline"
              >
                {emptyActionLabel}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

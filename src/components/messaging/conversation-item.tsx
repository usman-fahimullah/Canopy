"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import type { ConversationListItem } from "@/hooks/use-conversations";
import { formatDistanceToNow } from "date-fns";

function formatTimestamp(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: false }) + " ago";
}

export interface ConversationItemProps {
  conversation: ConversationListItem;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const hasUnread = conversation.unreadCount > 0;
  const otherUser = conversation.otherUser;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 border-b border-[var(--primitive-neutral-200)] px-6 py-4 text-left transition-colors",
        isActive
          ? "bg-[var(--primitive-neutral-100)]"
          : "bg-white hover:bg-[var(--primitive-neutral-100)]/50"
      )}
    >
      {/* Avatar */}
      <Avatar
        size="default"
        src={otherUser?.avatar || undefined}
        name={otherUser?.name || "User"}
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
            {otherUser?.name || "Unknown User"}
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
          {conversation.lastMessage?.content || "No messages yet"}
        </p>
      </div>

      {/* Timestamp + Unread */}
      <div className="flex shrink-0 flex-col items-end gap-3">
        {conversation.lastMessage && (
          <span className="text-sm leading-5 text-[var(--primitive-neutral-500)] whitespace-nowrap">
            {formatTimestamp(conversation.lastMessage.createdAt)}
          </span>
        )}
        {hasUnread && (
          <div className="h-3 w-3 rounded-full bg-[var(--primitive-blue-400)]" />
        )}
      </div>
    </button>
  );
}

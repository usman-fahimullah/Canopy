"use client";

import { cn } from "@/lib/utils";
import {
  Avatar,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  ListItemTrailingText,
} from "@/components/ui";
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

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const hasUnread = conversation.unreadCount > 0;
  const otherUser = conversation.otherUser;

  return (
    <ListItem
      interactive
      selected={isActive}
      size="lg"
      className={cn(
        "items-start border-b border-[var(--border-muted)]",
        !isActive && "bg-[var(--background-interactive-default)]"
      )}
      onClick={onClick}
    >
      {/* Avatar */}
      <ListItemLeading size="lg">
        <Avatar
          size="default"
          src={otherUser?.avatar || undefined}
          name={otherUser?.name || "User"}
          color="green"
          className="h-12 w-12 rounded-2xl border border-[var(--border-muted)]"
        />
      </ListItemLeading>

      {/* Content */}
      <ListItemContent>
        <ListItemTitle
          className={cn(
            isActive && "text-[var(--foreground-link)]",
            !isActive && !hasUnread && "font-normal"
          )}
        >
          {otherUser?.name || "Unknown User"}
        </ListItemTitle>
        <ListItemDescription
          className={cn(
            "line-clamp-2 whitespace-normal",
            isActive && "text-[var(--foreground-default)]"
          )}
        >
          {conversation.lastMessage?.content || "No messages yet"}
        </ListItemDescription>
      </ListItemContent>

      {/* Timestamp + Unread */}
      <ListItemTrailing>
        <div className="flex flex-col items-end gap-3">
          {conversation.lastMessage && (
            <ListItemTrailingText className="text-[var(--foreground-subtle)]">
              {formatTimestamp(conversation.lastMessage.createdAt)}
            </ListItemTrailingText>
          )}
          {hasUnread && <div className="h-3 w-3 rounded-full bg-[var(--foreground-info)]" />}
        </div>
      </ListItemTrailing>
    </ListItem>
  );
}

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MessageThread as MessageThreadType } from "@/lib/candid/types";
import { getUserById, currentUser } from "@/lib/candid/mock-data";
import { formatDistanceToNow } from "date-fns";

interface MessageThreadProps {
  thread: MessageThreadType;
  isActive?: boolean;
  className?: string;
}

export function MessageThread({ thread, isActive, className }: MessageThreadProps) {
  const otherUserId = thread.participantIds.find((id) => id !== currentUser.id);
  const otherUser = otherUserId ? getUserById(otherUserId) : null;

  if (!otherUser) return null;

  return (
    <Link
      href={`/candid/messages?thread=${thread.id}`}
      className={cn(
        "flex items-start gap-3 rounded-lg p-3 transition-colors duration-[var(--duration-fast)]",
        isActive
          ? "bg-[var(--candid-nav-item-active)]"
          : "hover:bg-[var(--candid-nav-item-hover)]",
        thread.unreadCount > 0 && !isActive && "bg-background-subtle",
        className
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {otherUser.avatar ? (
          <img
            src={otherUser.avatar}
            alt={`${otherUser.firstName} ${otherUser.lastName}`}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--candid-background-muted)] text-[var(--candid-foreground-brand)] font-semibold">
            {otherUser.firstName[0]}
            {otherUser.lastName[0]}
          </div>
        )}
        {/* Role badge */}
        <div
          className={cn(
            "absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-caption-sm font-medium",
            otherUser.role === "coach"
              ? "bg-[var(--candid-badge-founding-background)] text-[var(--candid-badge-founding-foreground)]"
              : "bg-[var(--candid-background-accent)] text-[var(--candid-foreground-brand)]"
          )}
        >
          {otherUser.role === "coach" ? "Coach" : "Mentor"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <h3
            className={cn(
              "text-body-sm font-medium truncate",
              thread.unreadCount > 0
                ? "text-foreground-default"
                : "text-foreground-muted"
            )}
          >
            {otherUser.firstName} {otherUser.lastName}
          </h3>
          {thread.lastMessage && (
            <span className="flex-shrink-0 text-caption-sm text-foreground-muted">
              {formatDistanceToNow(thread.lastMessage.createdAt, { addSuffix: false })}
            </span>
          )}
        </div>

        {/* Role & Company */}
        <p className="text-caption-sm text-foreground-muted">
          {otherUser.role === "coach" || otherUser.role === "light-mentor"
            ? `${(otherUser as any).currentRole} at ${(otherUser as any).currentCompany}`
            : "Mentee"}
        </p>

        {/* Last message preview */}
        {thread.lastMessage && (
          <p
            className={cn(
              "mt-1 text-body-sm truncate",
              thread.unreadCount > 0
                ? "text-foreground-default font-medium"
                : "text-foreground-muted"
            )}
          >
            {thread.lastMessage.senderId === currentUser.id && (
              <span className="text-foreground-muted">You: </span>
            )}
            {thread.lastMessage.content}
          </p>
        )}
      </div>

      {/* Unread badge */}
      {thread.unreadCount > 0 && (
        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--candid-button-primary-background)] text-caption-sm font-bold text-[var(--candid-button-primary-foreground)]">
          {thread.unreadCount}
        </div>
      )}
    </Link>
  );
}

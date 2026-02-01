"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle } from "@phosphor-icons/react";
import {
  useNotifications,
  type NotificationItem,
} from "@/hooks/use-notifications";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import type { Shell } from "@/lib/onboarding/types";

function formatNotificationDate(date: string): string {
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

function getNotificationUrl(notification: NotificationItem): string | null {
  if (!notification.data) return null;
  try {
    const data = JSON.parse(notification.data);
    return data.url || null;
  } catch {
    return null;
  }
}

interface ShellNotificationBellProps {
  shell: Shell;
}

export function ShellNotificationBell({ shell }: ShellNotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: NotificationItem) => {
    if (!notification.readAt) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default transition-colors duration-200"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell size={18} weight={isOpen ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5">
            <NotificationBadge
              count={unreadCount}
              variant="alert"
              size="sm"
              max={9}
            />
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[var(--border-default)] bg-[var(--background-default)] shadow-lg z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
            <h3 className="text-body-sm font-semibold text-foreground-default">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-caption text-[var(--candid-foreground-brand)] hover:underline"
              >
                <CheckCircle size={14} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const url = getNotificationUrl(notification);
                const isRead = !!notification.readAt;

                const content = (
                  <div
                    className={cn(
                      "flex gap-3 px-4 py-3 transition-colors cursor-pointer",
                      isRead
                        ? "hover:bg-[var(--background-subtle)]"
                        : "bg-[var(--primitive-green-100)]/30 hover:bg-[var(--primitive-green-100)]/50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread dot */}
                    <div className="flex-shrink-0 pt-1.5">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          isRead
                            ? "bg-transparent"
                            : "bg-[var(--primitive-green-600)]"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-caption truncate",
                          isRead
                            ? "text-foreground-muted"
                            : "text-foreground-default font-medium"
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="text-caption text-foreground-muted line-clamp-2 mt-0.5">
                        {notification.body}
                      </p>
                      <p className="text-caption-sm text-foreground-subtle mt-1">
                        {formatNotificationDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                );

                return url ? (
                  <Link key={notification.id} href={url}>
                    {content}
                  </Link>
                ) : (
                  <div key={notification.id}>{content}</div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell
                  size={32}
                  className="text-foreground-muted mb-2"
                  weight="light"
                />
                <p className="text-caption text-foreground-muted">
                  No notifications yet
                </p>
              </div>
            )}
          </div>

          {/* Footer — shell-aware "View all" link */}
          {notifications.length > 0 && (
            <div className="border-t border-[var(--border-default)] px-4 py-2.5">
              <Link
                href={`/${shell}/notifications`}
                onClick={() => setIsOpen(false)}
                className="block text-center text-caption text-[var(--candid-foreground-brand)] hover:underline"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

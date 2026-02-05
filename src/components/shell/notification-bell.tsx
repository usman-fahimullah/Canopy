"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCircle } from "@phosphor-icons/react";
import { useNotifications, type NotificationItem } from "@/hooks/use-notifications";
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
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
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
        className="hover:text-foreground-default relative rounded-full p-2 text-foreground-muted transition-colors duration-200 hover:bg-[var(--shell-nav-item-hover)]"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell size={18} weight={isOpen ? "fill" : "regular"} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5">
            <NotificationBadge count={unreadCount} variant="alert" size="sm" max={9} />
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--background-default)] shadow-lg"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
            <h3 className="text-foreground-default text-body-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 text-caption text-[var(--shell-nav-accent)] hover:underline"
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
                      "flex cursor-pointer gap-3 px-4 py-3 transition-colors",
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
                          isRead ? "bg-transparent" : "bg-[var(--primitive-green-600)]"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-caption",
                          isRead ? "text-foreground-muted" : "text-foreground-default font-medium"
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-caption text-foreground-muted">
                        {notification.body}
                      </p>
                      <p className="mt-1 text-caption-sm text-foreground-subtle">
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
                <Bell size={32} className="mb-2 text-foreground-muted" weight="light" />
                <p className="text-caption text-foreground-muted">No notifications yet</p>
              </div>
            )}
          </div>

          {/* Footer — shell-aware "View all" link */}
          {notifications.length > 0 && (
            <div className="border-t border-[var(--border-default)] px-4 py-2.5">
              <Link
                href={`/${shell}/notifications`}
                onClick={() => setIsOpen(false)}
                className="block text-center text-caption text-[var(--shell-nav-accent)] hover:underline"
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

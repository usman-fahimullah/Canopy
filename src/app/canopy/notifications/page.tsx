"use client";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TruncateText } from "@/components/ui/truncate-text";
import { Bell, Check, BriefcaseMetal, ChatCircleDots, Users, Warning } from "@phosphor-icons/react";
import {
  useNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "@/hooks/queries";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: { url?: string };
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  new_application: BriefcaseMetal,
  new_message: ChatCircleDots,
  job_expiring: Warning,
  team_activity: Users,
};

function groupByDate(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayItems: Notification[] = [];
  const yesterdayItems: Notification[] = [];
  const olderItems: Notification[] = [];

  notifications.forEach((n) => {
    const d = new Date(n.createdAt);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) todayItems.push(n);
    else if (d.getTime() === yesterday.getTime()) yesterdayItems.push(n);
    else olderItems.push(n);
  });

  if (todayItems.length) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (olderItems.length) groups.push({ label: "Earlier", items: olderItems });

  return groups;
}

/* -------------------------------------------------------------------
   Skeleton
   ------------------------------------------------------------------- */

function NotificationsSkeleton() {
  return (
    <div className="px-8 py-6 lg:px-12">
      <Skeleton className="mb-6 h-4 w-20" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-[16px] border border-[var(--border-default)] bg-[var(--card-background)] px-6 py-4"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function EmployerNotificationsPage() {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markReadMutation = useMarkReadMutation();
  const markAllReadMutation = useMarkAllReadMutation();

  const isFirstLoad = isLoading && notifications.length === 0;

  const markAllRead = () => {
    markAllReadMutation.mutate();
  };

  const markRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  if (isFirstLoad) {
    return (
      <div>
        <PageHeader title="Notifications" />
        <NotificationsSkeleton />
      </div>
    );
  }

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;
  const groups = groupByDate(notifications as Notification[]);

  return (
    <div>
      <PageHeader
        title="Notifications"
        actions={
          unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <Check size={16} weight="bold" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      <div className="px-8 py-6 lg:px-12">
        {notifications.length === 0 ? (
          <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-neutral-100)]">
              <Bell size={28} className="text-foreground-muted" />
            </div>
            <p className="text-foreground-default text-body font-medium">No notifications</p>
            <p className="mt-1 text-caption text-foreground-muted">
              You&apos;re all caught up. New notifications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.label}>
                <h3 className="mb-3 text-caption-strong font-medium text-foreground-muted">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.items.map((notif) => {
                    const Icon = TYPE_ICONS[notif.type] || Bell;
                    return (
                      <button
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={`flex w-full items-start gap-4 rounded-[16px] border bg-[var(--card-background)] px-6 py-4 text-left transition-colors ${
                          notif.read
                            ? "border-[var(--primitive-neutral-200)]"
                            : "bg-[var(--primitive-blue-100)]/30 border-[var(--primitive-blue-200)]"
                        }`}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
                          <Icon
                            size={20}
                            weight="fill"
                            className="text-[var(--primitive-blue-600)]"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-body-sm ${notif.read ? "text-foreground-muted" : "text-foreground-default font-medium"}`}
                          >
                            {notif.title}
                          </p>
                          <TruncateText className="text-caption text-foreground-muted">
                            {notif.body}
                          </TruncateText>
                        </div>
                        <span className="flex-shrink-0 text-caption text-foreground-muted">
                          {new Date(notif.createdAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        {!notif.read && (
                          <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--primitive-blue-500)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

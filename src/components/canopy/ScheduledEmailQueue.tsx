"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { logger } from "@/lib/logger";
import {
  Clock,
  EnvelopeSimple,
  UsersThree,
  CalendarBlank,
  Trash,
  CheckCircle,
  XCircle,
  Prohibit,
  ArrowClockwise,
} from "@phosphor-icons/react";

/* ============================================
   Types
   ============================================ */

interface ScheduledEmailItem {
  id: string;
  subject: string;
  recipientCount: number;
  scheduledFor: string;
  status: "PENDING" | "SENT" | "CANCELLED" | "FAILED";
  createdAt: string;
}

interface ScheduledEmailQueueProps {
  /** Controls visibility of the queue panel */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

/* ============================================
   Helpers
   ============================================ */

function formatScheduleDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / 3600000);

  if (diffMs < 0) {
    // In the past
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (diffHours < 1) {
    const mins = Math.round(diffMs / 60000);
    return `in ${mins} min${mins !== 1 ? "s" : ""}`;
  }
  if (diffHours < 24) {
    return `in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusBadge(status: ScheduledEmailItem["status"]) {
  switch (status) {
    case "PENDING":
      return (
        <Badge variant="info" size="sm">
          <Clock size={12} weight="bold" className="mr-0.5" />
          Pending
        </Badge>
      );
    case "SENT":
      return (
        <Badge variant="success" size="sm">
          <CheckCircle size={12} weight="bold" className="mr-0.5" />
          Sent
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="neutral" size="sm">
          <Prohibit size={12} weight="bold" className="mr-0.5" />
          Cancelled
        </Badge>
      );
    case "FAILED":
      return (
        <Badge variant="error" size="sm">
          <XCircle size={12} weight="bold" className="mr-0.5" />
          Failed
        </Badge>
      );
  }
}

/* ============================================
   ScheduledEmailQueue
   ============================================ */

export function ScheduledEmailQueue({ open, onOpenChange }: ScheduledEmailQueueProps) {
  const [items, setItems] = React.useState<ScheduledEmailItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = React.useState<string | null>(null);

  // Fetch scheduled emails when panel opens
  const fetchScheduled = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/canopy/emails/schedule?take=50");
      if (!res.ok) throw new Error("Failed to fetch scheduled emails");
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load";
      setError(message);
      logger.error("Failed to fetch scheduled emails", {
        error: message,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open) {
      fetchScheduled();
    }
  }, [open, fetchScheduled]);

  // Cancel a scheduled email
  const handleCancel = React.useCallback(async (id: string) => {
    setCancellingId(id);
    try {
      const res = await fetch(`/api/canopy/emails/schedule/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error ?? "Failed to cancel");
      }

      // Update local state
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "CANCELLED" as const } : item))
      );
    } catch (err) {
      logger.error("Failed to cancel scheduled email", {
        error: err instanceof Error ? err.message : String(err),
        scheduledEmailId: id,
      });
    } finally {
      setCancellingId(null);
      setConfirmCancelId(null);
    }
  }, []);

  // Counts
  const pendingCount = items.filter((i) => i.status === "PENDING").length;

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange}>
        <ModalContent size="lg">
          <ModalHeader
            icon={<Clock weight="regular" className="h-6 w-6 text-[var(--foreground-brand)]" />}
            iconBg="bg-[var(--background-brand-subtle)]"
          >
            <ModalTitle>
              <span className="flex items-center gap-2">
                Scheduled Emails
                {pendingCount > 0 && (
                  <Badge variant="info" size="sm">
                    {pendingCount} pending
                  </Badge>
                )}
              </span>
            </ModalTitle>
          </ModalHeader>

          <ModalBody>
            {isLoading ? (
              <div className="flex w-full items-center justify-center py-12">
                <Spinner size="md" />
                <span className="ml-2 text-body-sm text-[var(--foreground-muted)]">
                  Loading scheduled emails...
                </span>
              </div>
            ) : error ? (
              <div className="flex w-full flex-col items-center gap-4 py-12">
                <XCircle size={32} className="text-[var(--foreground-error)]" />
                <p className="text-body-sm text-[var(--foreground-muted)]">{error}</p>
                <Button variant="tertiary" size="sm" onClick={fetchScheduled}>
                  <ArrowClockwise className="mr-1.5 h-4 w-4" />
                  Retry
                </Button>
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={<EnvelopeSimple size={40} />}
                title="No scheduled emails"
                description="Schedule emails to send at a later time using the bulk email composer."
                className="py-12"
              />
            ) : (
              <div className="w-full space-y-2">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="transition-colors hover:bg-[var(--background-subtle)]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background-subtle)]">
                          <EnvelopeSimple
                            size={20}
                            weight="regular"
                            className="text-[var(--foreground-muted)]"
                          />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="truncate text-body-sm font-medium text-[var(--foreground-default)]">
                              {item.subject || "(No subject)"}
                            </p>
                            {getStatusBadge(item.status)}
                          </div>

                          <div className="flex items-center gap-4 text-caption text-[var(--foreground-muted)]">
                            <span className="flex items-center gap-1">
                              <UsersThree size={14} />
                              {item.recipientCount} recipient
                              {item.recipientCount !== 1 ? "s" : ""}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarBlank size={14} />
                              {item.status === "PENDING"
                                ? formatScheduleDate(item.scheduledFor)
                                : new Date(item.scheduledFor).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                            </span>
                          </div>
                        </div>

                        {/* Cancel action (only for pending) */}
                        {item.status === "PENDING" && (
                          <SimpleTooltip content="Cancel this scheduled email">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setConfirmCancelId(item.id)}
                              disabled={cancellingId === item.id}
                              loading={cancellingId === item.id}
                              className="shrink-0 text-[var(--foreground-subtle)] hover:text-[var(--foreground-error)]"
                            >
                              <Trash size={16} />
                            </Button>
                          </SimpleTooltip>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button variant="tertiary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            {!isLoading && !error && (
              <Button variant="ghost" size="sm" onClick={fetchScheduled}>
                <ArrowClockwise className="mr-1.5 h-4 w-4" />
                Refresh
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel confirmation modal */}
      <Modal
        open={!!confirmCancelId}
        onOpenChange={(open) => {
          if (!open) setConfirmCancelId(null);
        }}
      >
        <ModalContent size="default">
          <ModalHeader>
            <ModalTitle>Cancel Scheduled Email</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-body-sm text-[var(--foreground-muted)]">
              Are you sure you want to cancel this scheduled email? This action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setConfirmCancelId(null)}>
              Keep Scheduled
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmCancelId) {
                  handleCancel(confirmCancelId);
                }
              }}
              loading={!!cancellingId}
            >
              Cancel Email
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

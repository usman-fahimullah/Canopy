"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  EnvelopeSimple,
  CaretDown,
  CaretUp,
  Robot,
  PaperPlaneTilt,
  Users,
  Timer,
  Warning,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface EmailData {
  id: string;
  subject: string;
  body: string;
  recipientEmail: string;
  recipientName: string | null;
  sendType: string;
  stageId: string | null;
  status: string;
  createdAt: string;
  senderName: string | null;
  senderAvatar: string | null;
}

interface StageInfo {
  id: string;
  name: string;
}

interface EmailThreadSectionProps {
  seekerId: string;
  applicationId: string;
  /** Resolved job stages for grouping by stage name */
  jobStages?: StageInfo[];
  /** Open the email compose dialog */
  onCompose?: () => void;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getSendTypeBadge(sendType: string) {
  switch (sendType) {
    case "AUTOMATED":
      return { icon: <Robot size={12} weight="bold" />, label: "Auto", variant: "info" as const };
    case "BULK":
      return {
        icon: <Users size={12} weight="bold" />,
        label: "Bulk",
        variant: "neutral" as const,
      };
    case "SCHEDULED":
      return {
        icon: <Timer size={12} weight="bold" />,
        label: "Scheduled",
        variant: "neutral" as const,
      };
    case "MANUAL":
    default:
      return {
        icon: <PaperPlaneTilt size={12} weight="bold" />,
        label: "Manual",
        variant: "neutral" as const,
      };
  }
}

/* -------------------------------------------------------------------
   Sub-components
   ------------------------------------------------------------------- */

function EmailCard({ email }: { email: EmailData }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const sendType = getSendTypeBadge(email.sendType);
  const isFailed = email.status === "FAILED";

  return (
    <div className="space-y-2 rounded-[var(--radius-card)] bg-[var(--background-subtle)] p-4">
      {/* Header: subject + status */}
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex min-w-0 flex-1 items-start gap-2 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-sm font-medium text-[var(--foreground-default)]">
              {email.subject}
            </span>
          </span>
          {isExpanded ? (
            <CaretUp
              size={14}
              weight="bold"
              className="mt-0.5 shrink-0 text-[var(--foreground-subtle)]"
            />
          ) : (
            <CaretDown
              size={14}
              weight="bold"
              className="mt-0.5 shrink-0 text-[var(--foreground-subtle)]"
            />
          )}
        </button>
        <div className="flex shrink-0 items-center gap-1.5">
          {isFailed && (
            <Badge variant="error" size="sm">
              Failed
            </Badge>
          )}
          <Badge variant={sendType.variant} size="sm">
            <span className="flex items-center gap-1">
              {sendType.icon}
              {sendType.label}
            </span>
          </Badge>
        </div>
      </div>

      {/* Sender + time */}
      <div className="flex items-center gap-3 text-caption text-[var(--foreground-muted)]">
        <span className="flex items-center gap-1.5">
          <Avatar
            src={email.senderAvatar ?? undefined}
            name={email.senderName ?? undefined}
            size="xs"
          />
          {email.senderName ?? "System"}
        </span>
        <span>{formatRelativeDate(email.createdAt)}</span>
      </div>

      {/* Expandable body */}
      {isExpanded && (
        <div className="mt-2 border-t border-[var(--border-muted)] pt-3">
          <div className="text-caption text-[var(--foreground-muted)]">
            To: {email.recipientEmail}
          </div>
          <div
            className="mt-2 max-h-[300px] overflow-y-auto text-body-sm leading-relaxed text-[var(--foreground-default)] [&_a]:text-[var(--foreground-link)] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: email.body }}
          />
        </div>
      )}
    </div>
  );
}

function EmailThreadSkeleton() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-6 rounded-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-[var(--radius-card)]" />
        <Skeleton className="h-20 w-full rounded-[var(--radius-card)]" />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export function EmailThreadSection({
  seekerId,
  applicationId,
  jobStages,
  onCompose,
}: EmailThreadSectionProps) {
  const [emails, setEmails] = React.useState<EmailData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch emails for this application
  React.useEffect(() => {
    let cancelled = false;

    async function fetchEmails() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/canopy/candidates/${seekerId}/emails?applicationId=${applicationId}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to fetch emails");
        }

        const { data } = await res.json();
        if (!cancelled) {
          setEmails(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load emails");
          logger.error("Failed to fetch email thread", { error: formatError(err) });
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchEmails();
    return () => {
      cancelled = true;
    };
  }, [seekerId, applicationId]);

  // Loading state
  if (isLoading) {
    return <EmailThreadSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <EnvelopeSimple size={20} weight="bold" className="text-[var(--foreground-brand)]" />
          <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
            Emails
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-[var(--background-error)] px-3 py-2 text-caption text-[var(--foreground-error)]">
          <Warning size={16} weight="bold" />
          {error}
        </div>
      </section>
    );
  }

  // Empty state — always render the section (with compose button)
  if (emails.length === 0) {
    return (
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EnvelopeSimple size={20} weight="bold" className="text-[var(--foreground-brand)]" />
            <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
              Emails
            </h3>
          </div>
          {onCompose && (
            <Button variant="outline" size="sm" onClick={onCompose}>
              <PaperPlaneTilt size={14} weight="bold" className="mr-1" />
              Compose
            </Button>
          )}
        </div>
        <p className="text-caption text-[var(--foreground-subtle)]">
          No emails sent yet. Use the compose button to reach out.
        </p>
      </section>
    );
  }

  // Group emails by stageId
  const stageMap = new Map<string, string>();
  if (jobStages) {
    for (const stage of jobStages) {
      stageMap.set(stage.id, stage.name);
    }
  }

  // Group: stageId → emails[]
  const grouped = new Map<string | null, EmailData[]>();
  for (const email of emails) {
    const key = email.stageId;
    const existing = grouped.get(key) ?? [];
    existing.push(email);
    grouped.set(key, existing);
  }

  // Sort groups: stages with emails in pipeline order, null/"Other" last
  const stageOrder = jobStages?.map((s) => s.id) ?? [];
  const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
    if (a === null) return 1;
    if (b === null) return -1;
    const aIdx = stageOrder.indexOf(a);
    const bIdx = stageOrder.indexOf(b);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EnvelopeSimple size={20} weight="bold" className="text-[var(--foreground-brand)]" />
          <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
            Emails
          </h3>
          <Badge variant="neutral" size="sm">
            {emails.length}
          </Badge>
        </div>
        {onCompose && (
          <Button variant="outline" size="sm" onClick={onCompose}>
            <PaperPlaneTilt size={14} weight="bold" className="mr-1" />
            Compose
          </Button>
        )}
      </div>

      {/* Grouped email list */}
      {sortedKeys.length === 1 && sortedKeys[0] === null ? (
        // All emails ungrouped — no stage headers needed
        <div className="space-y-3">
          {grouped.get(null)!.map((email) => (
            <EmailCard key={email.id} email={email} />
          ))}
        </div>
      ) : (
        // Multiple groups — show stage headers
        <div className="space-y-5">
          {sortedKeys.map((stageId) => {
            const stageEmails = grouped.get(stageId)!;
            const stageName = stageId
              ? (stageMap.get(stageId) ?? stageId.charAt(0).toUpperCase() + stageId.slice(1))
              : "Other";

            return (
              <div key={stageId ?? "other"} className="space-y-3">
                <h4 className="text-caption-strong font-semibold text-[var(--foreground-muted)]">
                  {stageName}
                </h4>
                {stageEmails.map((email) => (
                  <EmailCard key={email.id} email={email} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Link as LinkIcon,
  Copy,
  CheckCircle,
  Users,
  Calendar as CalendarIcon,
  Clock,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* ============================================
   Self-Booking Link Component
   ============================================ */
export interface BookingLinkProps {
  /** The booking link URL */
  link: string;
  /** Title for the booking page */
  title?: string;
  /** Duration of the meeting in minutes */
  duration?: number;
  /** Whether the link is active */
  isActive?: boolean;
  /** Callback when link is copied */
  onCopy?: () => void;
  /** Callback to toggle link status */
  onToggleStatus?: (active: boolean) => void;
  className?: string;
}

export const BookingLink: React.FC<BookingLinkProps> = ({
  link,
  title = "Schedule a Meeting",
  duration = 30,
  isActive = true,
  onCopy,
  onToggleStatus,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error("Failed to copy", { error: formatError(err) });
    }
  };

  return (
    <div
      className={cn(
        "bg-surface-default overflow-hidden rounded-xl border border-border-muted",
        !isActive && "opacity-60",
        className
      )}
    >
      {/* Header */}
      <div className="from-background-subtle/50 flex items-center justify-between border-b border-border-muted bg-gradient-to-b to-transparent px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="dark:bg-[var(--primitive-blue-800)]/30 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primitive-blue-100)]">
            <LinkIcon className="h-5 w-5 text-[var(--primitive-blue-500)]" weight="duotone" />
          </div>
          <div>
            <h4 className="text-foreground-default font-semibold">{title}</h4>
            <div className="mt-0.5 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-foreground-muted" />
              <span className="text-sm text-foreground-muted">{duration} minutes</span>
            </div>
          </div>
        </div>
        {onToggleStatus && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-muted">
              {isActive ? "Active" : "Inactive"}
            </span>
            <button
              onClick={() => onToggleStatus(!isActive)}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-200",
                isActive
                  ? "bg-[var(--switch-background-checked)]"
                  : "bg-neutral-300 dark:bg-neutral-600"
              )}
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-[var(--switch-thumb)] shadow-sm transition-transform duration-200",
                  isActive && "translate-x-5"
                )}
              />
            </button>
          </div>
        )}
      </div>

      {/* Link section */}
      <div className="p-5">
        <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-foreground-muted">
          Booking Link
        </label>
        <div className="flex items-center gap-2">
          <div className="dark:bg-neutral-800/50 flex flex-1 items-center gap-2 overflow-hidden rounded-lg border border-border-muted bg-neutral-50 px-4 py-2.5">
            <LinkIcon className="h-4 w-4 flex-shrink-0 text-foreground-muted" />
            <span className="text-foreground-default truncate font-mono text-sm">{link}</span>
          </div>
          <Button
            variant={copied ? "secondary" : "primary"}
            size="default"
            onClick={handleCopy}
            className="flex-shrink-0 gap-2"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" weight="fill" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Share options */}
        <div className="mt-4 flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
            <Users className="h-4 w-4" />
            Share with candidate
          </Button>
          <Button variant="ghost" size="sm" className="gap-1.5">
            <CalendarIcon className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Stats (optional) */}
      <div className="border-t border-border-muted bg-neutral-50/50 px-5 py-3 dark:bg-neutral-900/30">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground-muted">Total bookings this month</span>
          <span className="text-foreground-default font-semibold">12</span>
        </div>
      </div>
    </div>
  );
};

BookingLink.displayName = "BookingLink";

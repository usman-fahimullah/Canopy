"use client";

import { cn } from "@/lib/utils";

export type OfferBadgeStatus =
  | "DRAFT"
  | "SENT"
  | "VIEWED"
  | "AWAITING_SIGNATURE"
  | "SIGNED"
  | "WITHDRAWN";

const STATUS_CONFIG: Record<
  OfferBadgeStatus,
  { label: string; bgClass: string; textClass: string }
> = {
  DRAFT: {
    label: "Offer Drafted",
    bgClass: "bg-[var(--background-subtle)]",
    textClass: "text-[var(--foreground-muted)]",
  },
  SENT: {
    label: "Offer Sent",
    bgClass: "bg-amber-50",
    textClass: "text-amber-700",
  },
  VIEWED: {
    label: "Offer Viewed",
    bgClass: "bg-orange-50",
    textClass: "text-orange-700",
  },
  AWAITING_SIGNATURE: {
    label: "Awaiting Signature",
    bgClass: "bg-blue-50",
    textClass: "text-blue-700",
  },
  SIGNED: {
    label: "Offer Signed",
    bgClass: "bg-emerald-50",
    textClass: "text-emerald-700",
  },
  WITHDRAWN: {
    label: "Offer Withdrawn",
    bgClass: "bg-red-50",
    textClass: "text-red-700",
  },
};

interface OfferBadgeProps {
  status: OfferBadgeStatus;
  className?: string;
}

export function OfferBadge({ status, className }: OfferBadgeProps) {
  const config = STATUS_CONFIG[status];
  if (!config) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.bgClass,
        config.textClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}

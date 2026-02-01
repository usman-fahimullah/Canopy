"use client";

import { Badge } from "@/components/ui/badge";
import { Certificate } from "@phosphor-icons/react";

interface CertificationCardProps {
  name: string;
  issuer: string;
  status: "not_started" | "in_progress" | "earned";
  earnedDate: string | null;
  expiresDate: string | null;
}

const statusConfig = {
  not_started: { label: "Not Started", variant: "neutral" },
  in_progress: { label: "In Progress", variant: "info" },
  earned: { label: "Earned", variant: "success" },
} as const;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CertificationCard({
  name,
  issuer,
  status,
  earnedDate,
  expiresDate,
}: CertificationCardProps) {
  const { label, variant } = statusConfig[status];

  return (
    <div className="flex items-start gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-5">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primitive-green-100)]">
        <Certificate
          size={20}
          weight="fill"
          className="text-[var(--primitive-green-700)]"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-body font-semibold text-[var(--primitive-green-800)]">
          {name}
        </h3>
        <p className="text-caption text-[var(--primitive-neutral-600)]">
          {issuer}
        </p>

        {/* Earned date */}
        {status === "earned" && earnedDate && (
          <p className="mt-1 text-caption text-[var(--primitive-neutral-600)]">
            Earned: {formatDate(earnedDate)}
          </p>
        )}

        {/* Expiration date */}
        {expiresDate && (
          <p className="mt-0.5 text-caption text-[var(--primitive-neutral-600)]">
            Expires: {formatDate(expiresDate)}
          </p>
        )}
      </div>

      {/* Status badge */}
      <Badge variant={variant} size="sm">
        {label}
      </Badge>
    </div>
  );
}

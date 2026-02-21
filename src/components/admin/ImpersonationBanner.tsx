"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightning, SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ImpersonationBannerProps {
  /** Name of the organization being impersonated */
  orgName: string;
  /** Raw PlanTier enum value from the database */
  planTier: string;
  /** Optional extra className for the root element */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TIER_LABELS: Record<string, string> = {
  PAY_AS_YOU_GO: "Pay As You Go",
  LISTINGS: "Listings",
  ATS: "ATS",
};

function formatTier(raw: string): string {
  return TIER_LABELS[raw] ?? raw;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ImpersonationBanner
 *
 * A sticky top banner shown when a super-admin is impersonating an
 * organization. Uses an orange/amber color scheme (design tokens) so it
 * is visually distinct from the rest of the UI and cannot be overlooked.
 *
 * Props are passed from a server component that reads the impersonation
 * cookie via `getImpersonatedOrgId()`.
 */
export function ImpersonationBanner({ orgName, planTier, className }: ImpersonationBannerProps) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const handleExit = async () => {
    setExiting(true);
    try {
      const res = await fetch("/api/admin/canopy/impersonate/exit", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/admin/organizations");
        router.refresh();
      } else {
        // If the request failed, allow retry
        setExiting(false);
      }
    } catch {
      setExiting(false);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-toast)]",
        "flex h-10 items-center justify-center",
        "bg-[var(--primitive-orange-100)] text-[var(--primitive-orange-800)]",
        "border-b border-[var(--primitive-orange-300)]",
        "text-caption font-medium",
        className
      )}
    >
      <div className="flex w-full max-w-7xl items-center justify-center gap-2 px-4">
        {/* Lightning icon */}
        <Lightning size={16} weight="fill" className="shrink-0" />

        {/* Status text */}
        <span className="truncate">
          <span className="font-bold">Admin Mode:</span> Viewing as {orgName} (
          {formatTier(planTier)})
        </span>

        {/* Separator */}
        <span className="text-[var(--primitive-orange-400)]" aria-hidden="true">
          &mdash;
        </span>

        {/* Exit button */}
        <Button
          variant="ghost"
          size="sm"
          disabled={exiting}
          onClick={handleExit}
          className={cn(
            "h-7 gap-1.5 rounded-lg px-2.5",
            "text-caption-sm font-bold",
            "text-[var(--primitive-orange-800)]",
            "hover:bg-[var(--primitive-orange-600)] hover:text-[var(--foreground-on-emphasis)]",
            "focus-visible:ring-[var(--primitive-orange-500)]",
            "disabled:opacity-70"
          )}
          aria-label="Exit impersonation mode"
        >
          {exiting ? <Spinner size="xs" variant="current" /> : <SignOut size={14} weight="bold" />}
          Exit Impersonation
        </Button>
      </div>
    </div>
  );
}

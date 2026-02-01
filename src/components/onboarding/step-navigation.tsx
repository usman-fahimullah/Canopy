"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StepNavigationProps {
  /** Called when user clicks Continue */
  onContinue: () => void;
  /** Called when user clicks Back (hidden if not provided) */
  onBack?: () => void;
  /** Disable the Continue button */
  canContinue?: boolean;
  /** Show loading spinner on Continue */
  loading?: boolean;
  /** Custom label for Continue button */
  continueLabel?: string;
  /** Additional className for the container */
  className?: string;
}

export function StepNavigation({
  onContinue,
  onBack,
  canContinue = true,
  loading = false,
  continueLabel = "Continue",
  className,
}: StepNavigationProps) {
  return (
    <div
      className={cn(
        "flex items-center pb-4 pt-8",
        onBack ? "justify-between" : "justify-end",
        className
      )}
    >
      {onBack && (
        <Button type="button" variant="secondary" size="icon" onClick={onBack} aria-label="Go back">
          <ArrowLeft size={20} weight="bold" />
        </Button>
      )}

      <Button
        type="button"
        onClick={onContinue}
        disabled={!canContinue || loading}
        loading={loading}
      >
        {continueLabel}
      </Button>
    </div>
  );
}

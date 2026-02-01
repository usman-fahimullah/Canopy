"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
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
        "flex items-center pt-8 pb-4",
        onBack ? "justify-between" : "justify-end",
        className
      )}
    >
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          leftIcon={<ArrowLeft weight="bold" />}
        >
          Back
        </Button>
      )}

      <Button
        type="button"
        onClick={onContinue}
        disabled={!canContinue || loading}
        loading={loading}
        rightIcon={!loading ? <ArrowRight weight="bold" /> : undefined}
      >
        {continueLabel}
      </Button>
    </div>
  );
}

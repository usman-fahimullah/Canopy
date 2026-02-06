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
  /** Called when user clicks Skip (hidden if not provided) */
  onSkip?: () => void;
  /** Custom label for Skip button */
  skipLabel?: string;
  /** Additional className for the container */
  className?: string;
}

export function StepNavigation({
  onContinue,
  onBack,
  canContinue = true,
  loading = false,
  continueLabel = "Continue",
  onSkip,
  skipLabel = "Skip for now",
  className,
}: StepNavigationProps) {
  return (
    <footer
      className={cn(
        "shrink-0 border-t border-[var(--primitive-neutral-200)] bg-[var(--background-default)] px-4 py-4 sm:px-12",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Back button */}
        <div>
          {onBack && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onBack}
              aria-label="Go back"
            >
              <ArrowLeft size={24} weight="bold" />
            </Button>
          )}
        </div>

        {/* Right side: Skip + Continue */}
        <div className="flex items-center gap-3">
          {onSkip && (
            <Button type="button" variant="outline" onClick={onSkip} disabled={loading}>
              {skipLabel}
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
      </div>
    </footer>
  );
}

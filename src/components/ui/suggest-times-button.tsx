"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { Lightning, Sparkle } from "@phosphor-icons/react";
import { type InterviewTimeSlot as TimeSlot } from "@/lib/scheduling";
import { logger, formatError } from "@/lib/logger";

export interface SuggestTimesButtonProps {
  onSuggest?: () => Promise<TimeSlot[]>;
  onSuggestComplete?: (slots: TimeSlot[]) => void;
  disabled?: boolean;
  className?: string;
}

const SuggestTimesButton: React.FC<SuggestTimesButtonProps> = ({
  onSuggest,
  onSuggestComplete,
  disabled,
  className,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (!onSuggest || isLoading) return;
    setIsLoading(true);
    try {
      const suggestedSlots = await onSuggest();
      onSuggestComplete?.(suggestedSlots);
    } catch (error) {
      logger.error("Failed to get suggestions", { error: formatError(error) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5",
              "text-[13px] font-medium",
              "bg-gradient-to-r from-[var(--primitive-purple-100)] to-[var(--primitive-blue-100)]",
              "border border-[var(--primitive-purple-300)]",
              "text-[var(--primitive-purple-700)]",
              "hover:from-[var(--primitive-purple-200)] hover:to-[var(--primitive-blue-200)]",
              "rounded-full transition-all",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isLoading && "animate-pulse",
              className
            )}
          >
            {isLoading ? (
              <>
                <Sparkle size={14} weight="fill" className="animate-spin" />
                <span>Finding times...</span>
              </>
            ) : (
              <>
                <Lightning size={14} weight="fill" />
                <span>Suggest times</span>
              </>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">AI will find optimal times when everyone is free</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

SuggestTimesButton.displayName = "SuggestTimesButton";

export { SuggestTimesButton };

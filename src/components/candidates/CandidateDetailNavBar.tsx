"use client";

import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  X,
  CaretUp,
  CaretDown,
  CalendarPlus,
  VideoCamera,
  Star,
  ArrowFatLineRight,
  Prohibit,
  UserCirclePlus,
  DotsThreeVertical,
} from "@phosphor-icons/react";

interface CandidateDetailNavBarProps {
  currentIndex?: number;
  totalCount?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  /** Current application stage — used to show/hide actions contextually */
  currentStage?: string;
  /** Whether an action is currently in progress */
  isActionLoading?: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onReject?: () => void;
  onSaveToTalentPool?: () => void;
}

export function CandidateDetailNavBar({
  currentIndex,
  totalCount,
  hasPrevious,
  hasNext,
  currentStage,
  isActionLoading,
  onClose,
  onPrevious,
  onNext,
  onReject,
  onSaveToTalentPool,
}: CandidateDetailNavBarProps) {
  // Hide reject/talent-pool actions if candidate is already in one of those stages
  const isTerminalStage =
    currentStage === "rejected" || currentStage === "talent-pool" || currentStage === "hired";

  return (
    <nav className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-4">
      {/* Left: Close + navigation */}
      <div className="flex items-center gap-1">
        <SimpleTooltip content="Close">
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </SimpleTooltip>

        <Separator orientation="vertical" className="mx-2 h-5" />

        <SimpleTooltip content="Previous candidate">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPrevious}
            disabled={!hasPrevious}
            aria-label="Previous candidate"
          >
            <CaretUp size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Next candidate">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNext}
            disabled={!hasNext}
            aria-label="Next candidate"
          >
            <CaretDown size={18} />
          </Button>
        </SimpleTooltip>

        {currentIndex !== undefined && totalCount !== undefined && (
          <span className="ml-2 text-caption text-[var(--foreground-muted)]">
            {currentIndex + 1} of {totalCount}
          </span>
        )}
      </div>

      {/* Right: Action icons */}
      <div className="flex items-center gap-1">
        <SimpleTooltip content="Schedule">
          <Button variant="ghost" size="icon-sm" aria-label="Schedule interview">
            <CalendarPlus size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Video call">
          <Button variant="ghost" size="icon-sm" aria-label="Start video call">
            <VideoCamera size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Review">
          <Button variant="ghost" size="icon-sm" aria-label="Review application">
            <Star size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="Advance">
          <Button variant="ghost" size="icon-sm" aria-label="Advance to next stage">
            <ArrowFatLineRight size={18} />
          </Button>
        </SimpleTooltip>

        {!isTerminalStage && (
          <>
            <Separator orientation="vertical" className="mx-1 h-5" />

            <SimpleTooltip content="Save to Talent Pool">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Save to talent pool"
                onClick={onSaveToTalentPool}
                disabled={isActionLoading}
              >
                <UserCirclePlus size={18} className="text-[var(--primitive-yellow-600)]" />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Reject">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Reject candidate"
                onClick={onReject}
                disabled={isActionLoading}
              >
                <Prohibit size={18} className="text-[var(--foreground-error)]" />
              </Button>
            </SimpleTooltip>
          </>
        )}

        <SimpleTooltip content="More actions">
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <DotsThreeVertical size={18} />
          </Button>
        </SimpleTooltip>
      </div>
    </nav>
  );
}

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
  DotsThreeVertical,
} from "@phosphor-icons/react";

interface CandidateDetailNavBarProps {
  currentIndex?: number;
  totalCount?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function CandidateDetailNavBar({
  currentIndex,
  totalCount,
  hasPrevious,
  hasNext,
  onClose,
  onPrevious,
  onNext,
}: CandidateDetailNavBarProps) {
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

        <SimpleTooltip content="Reject">
          <Button variant="ghost" size="icon-sm" aria-label="Reject candidate">
            <Prohibit size={18} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip content="More actions">
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <DotsThreeVertical size={18} />
          </Button>
        </SimpleTooltip>
      </div>
    </nav>
  );
}

"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SplitButton } from "@/components/ui/split-button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  X,
  CaretUp,
  CaretDown,
  ClockCounterClockwise,
  ChatCircleDots,
  ListChecks,
  ArrowCircleRight,
  Prohibit,
  DotsThreeVertical,
  UserCirclePlus,
  Export,
  Archive,
  CheckCircle,
} from "@phosphor-icons/react";

interface CandidateDetailNavBarProps {
  currentIndex?: number;
  totalCount?: number;
  hasPrevious: boolean;
  hasNext: boolean;
  /** Current application stage -- used to highlight the active stage in the move menu */
  currentStage?: string;
  /** Whether an action is currently in progress */
  isActionLoading?: boolean;
  /** Which right-side panel is currently open, or null if none */
  activePanel?: "review" | "comments" | "todo" | "history" | null;
  /** Pipeline stages available for this job */
  stages?: Array<{ id: string; name: string }>;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleComments?: () => void;
  onToggleTodo?: () => void;
  onToggleHistory?: () => void;
  onAdvanceStage?: (stageId: string) => void;
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
  activePanel = null,
  stages = [],
  onClose,
  onPrevious,
  onNext,
  onToggleComments,
  onToggleTodo,
  onToggleHistory,
  onAdvanceStage,
  onReject,
  onSaveToTalentPool,
}: CandidateDetailNavBarProps) {
  const [overflowOpen, setOverflowOpen] = useState(false);
  const splitButtonRef = useRef<HTMLDivElement>(null);

  // Hide reject/talent-pool actions if candidate is already in a terminal stage
  const isTerminalStage =
    currentStage === "rejected" || currentStage === "talent-pool" || currentStage === "hired";

  return (
    <nav className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-4">
      {/* ---- Left side: Close + Up/Down navigation + counter ---- */}
      <div className="flex items-center gap-2">
        <SimpleTooltip content="Close">
          <Button variant="outline" size="icon" onClick={onClose} aria-label="Close">
            <X size={24} weight="bold" />
          </Button>
        </SimpleTooltip>

        <SplitButton
          variant="outline"
          leftIcon={<CaretUp size={24} weight="bold" />}
          rightIcon={<CaretDown size={24} weight="bold" />}
          onPrimaryClick={onPrevious}
          onSecondaryClick={onNext}
          disabled={!hasPrevious && !hasNext}
          aria-label="Navigate candidates"
        />

        {currentIndex !== undefined && totalCount !== undefined && (
          <span className="ml-1 text-caption text-[var(--foreground-muted)]">
            {currentIndex + 1} of {totalCount}
          </span>
        )}
      </div>

      {/* ---- Right side: Panel toggles + stage actions ---- */}
      <div className="flex items-center gap-2">
        {/* History toggle */}
        <SimpleTooltip content="History">
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle history panel"
            data-selected={activePanel === "history" ? "true" : undefined}
            onClick={onToggleHistory}
          >
            <ClockCounterClockwise size={24} weight="bold" />
          </Button>
        </SimpleTooltip>

        {/* Comments toggle */}
        <SimpleTooltip content="Comments">
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle comments panel"
            data-selected={activePanel === "comments" ? "true" : undefined}
            onClick={onToggleComments}
          >
            <ChatCircleDots size={24} weight="bold" />
          </Button>
        </SimpleTooltip>

        {/* To-Do toggle */}
        <SimpleTooltip content="To-Do">
          <Button
            variant="outline"
            size="icon"
            aria-label="Toggle to-do panel"
            data-selected={activePanel === "todo" ? "true" : undefined}
            onClick={onToggleTodo}
          >
            <ListChecks size={24} weight="bold" />
          </Button>
        </SimpleTooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Move to stage dropdown */}
        <DropdownMenu>
          <SimpleTooltip content="Move to stage">
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Move to stage"
                disabled={isActionLoading}
              >
                <ArrowCircleRight size={24} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
          </SimpleTooltip>
          <DropdownMenuContent align="end" className="min-w-[180px]">
            {stages.map((stage) => (
              <DropdownMenuItem
                key={stage.id}
                onClick={() => onAdvanceStage?.(stage.id)}
                disabled={stage.id === currentStage}
                className="flex items-center justify-between gap-2"
              >
                <span>{stage.name}</span>
                {stage.id === currentStage && (
                  <CheckCircle
                    size={16}
                    weight="fill"
                    className="text-[var(--foreground-success)]"
                  />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reject + overflow actions SplitButton (non-terminal stages)
            Left side: Reject action (direct click)
            Right side: Opens overflow dropdown menu via controlled state */}
        {!isTerminalStage && (
          <DropdownMenu open={overflowOpen} onOpenChange={setOverflowOpen}>
            {/* Hidden trigger anchored to the SplitButton for dropdown positioning */}
            <DropdownMenuTrigger asChild>
              <div ref={splitButtonRef} className="inline-flex">
                <SplitButton
                  variant="outline"
                  leftIcon={<Prohibit size={24} weight="bold" />}
                  rightIcon={<DotsThreeVertical size={24} weight="bold" />}
                  onPrimaryClick={(e) => {
                    // Prevent the DropdownMenuTrigger from capturing this click
                    e.stopPropagation();
                    onReject?.();
                  }}
                  onSecondaryClick={(e) => {
                    e.stopPropagation();
                    setOverflowOpen((prev) => !prev);
                  }}
                  disabled={isActionLoading}
                  secondarySelected={overflowOpen}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem onClick={onSaveToTalentPool} className="flex items-center gap-2">
                <UserCirclePlus size={16} />
                <span>Save to Talent Pool</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Export size={16} />
                <span>Export Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Archive size={16} />
                <span>Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Terminal stage: standalone overflow dropdown (no reject button) */}
        {isTerminalStage && (
          <DropdownMenu>
            <SimpleTooltip content="More actions">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="More actions"
                  disabled={isActionLoading}
                >
                  <DotsThreeVertical size={24} weight="bold" />
                </Button>
              </DropdownMenuTrigger>
            </SimpleTooltip>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem onClick={onSaveToTalentPool} className="flex items-center gap-2">
                <UserCirclePlus size={16} />
                <span>Save to Talent Pool</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Export size={16} />
                <span>Export Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Archive size={16} />
                <span>Archive</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}

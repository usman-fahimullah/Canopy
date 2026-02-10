"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SplitButton } from "@/components/ui/split-button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
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
  WarningCircle,
} from "@phosphor-icons/react";
import { getStageVisualConfig } from "@/lib/pipeline/stage-registry-ui";

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
  /** Candidate name — used in rejection confirmation modal */
  candidateName?: string;
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
  candidateName,
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
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const splitButtonRef = useRef<HTMLDivElement>(null);

  // Hide reject/talent-pool actions if candidate is already in a terminal stage
  const isTerminalStage =
    currentStage === "rejected" || currentStage === "talent-pool" || currentStage === "hired";

  return (
    <nav className="flex h-[108px] shrink-0 items-center justify-between border-b border-[var(--border-muted)] px-8">
      {/* ---- Left side: Close + Up/Down navigation + counter ---- */}
      <div className="flex items-center gap-3">
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
          <span className="text-body text-[var(--foreground-subtle)]">
            {currentIndex + 1} of {totalCount}
          </span>
        )}
      </div>

      {/* ---- Right side: Panel toggles + stage actions ---- */}
      <div className="flex items-center gap-3">
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
          <DropdownMenuContent align="end" className="min-w-[200px]">
            {stages.map((stage) => {
              const config = getStageVisualConfig(stage.id);
              const isCurrent = stage.id === currentStage;
              return (
                <DropdownMenuItem
                  key={stage.id}
                  onClick={() => onAdvanceStage?.(stage.id)}
                  disabled={isCurrent}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${config.badgeDot}`}
                    />
                    <span>{stage.name}</span>
                  </span>
                  {isCurrent && (
                    <CheckCircle
                      size={16}
                      weight="fill"
                      className="text-[var(--foreground-success)]"
                    />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reject + overflow actions SplitButton (non-terminal stages)
            Left side: Reject action (opens confirmation modal)
            Right side: Opens overflow dropdown menu via controlled state */}
        {!isTerminalStage && (
          <DropdownMenu open={overflowOpen} onOpenChange={setOverflowOpen}>
            {/* Hidden trigger anchored to the SplitButton for dropdown positioning */}
            <DropdownMenuTrigger asChild>
              <div ref={splitButtonRef} className="inline-flex">
                <SplitButton
                  variant="outline"
                  leftIcon={
                    <Prohibit size={24} weight="bold" className="text-[var(--primitive-red-500)]" />
                  }
                  rightIcon={<DotsThreeVertical size={24} weight="bold" />}
                  onPrimaryClick={(e) => {
                    // Prevent the DropdownMenuTrigger from capturing this click
                    e.stopPropagation();
                    setRejectModalOpen(true);
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

      {/* ---- Rejection confirmation modal ---- */}
      <Modal open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <ModalContent size="default">
          <ModalHeader>
            <ModalTitle>Reject candidate</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-4 py-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-error)]">
                <WarningCircle size={28} weight="fill" className="text-[var(--foreground-error)]" />
              </div>
              <p className="text-body text-[var(--foreground-default)]">
                Are you sure you want to reject{" "}
                <span className="font-semibold">{candidateName ?? "this candidate"}</span>? This
                will move them out of the active pipeline and notify them of the decision.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="tertiary" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setRejectModalOpen(false);
                onReject?.();
              }}
              loading={isActionLoading}
            >
              <Prohibit size={16} weight="bold" className="mr-1.5" />
              Reject Candidate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </nav>
  );
}

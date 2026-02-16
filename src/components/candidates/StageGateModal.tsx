"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldWarning, ListChecks, CalendarCheck } from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface Blocker {
  action: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface StageGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The stage that has unmet requirements */
  stageName: string;
  /** List of blocking requirements */
  blockers: Blocker[];
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function getBlockerIcon(action: string) {
  switch (action) {
    case "gate_scorecards_required":
      return <ListChecks size={18} weight="bold" className="text-[var(--foreground-warning)]" />;
    case "gate_interviews_required":
      return <CalendarCheck size={18} weight="bold" className="text-[var(--foreground-warning)]" />;
    default:
      return <ShieldWarning size={18} weight="bold" className="text-[var(--foreground-warning)]" />;
  }
}

function getBlockerLabel(action: string): string {
  switch (action) {
    case "gate_scorecards_required":
      return "Scorecards";
    case "gate_interviews_required":
      return "Interviews";
    default:
      return "Requirement";
  }
}

function getProgressText(metadata?: Record<string, unknown>): string | null {
  if (!metadata) return null;
  const current = metadata.current as number | undefined;
  const required = metadata.required as number | undefined;
  if (current !== undefined && required !== undefined) {
    return `${current} / ${required}`;
  }
  return null;
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function StageGateModal({ open, onOpenChange, stageName, blockers }: StageGateModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="default">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <ShieldWarning size={22} weight="bold" className="text-[var(--foreground-warning)]" />
            <ModalTitle>Requirements not met</ModalTitle>
          </div>
        </ModalHeader>

        <ModalBody>
          <p className="mb-4 text-body-sm text-[var(--foreground-muted)]">
            The following requirements must be completed before advancing past{" "}
            <span className="font-semibold text-[var(--foreground-default)]">{stageName}</span>:
          </p>

          <div className="space-y-3">
            {blockers.map((blocker, idx) => {
              const progress = getProgressText(blocker.metadata);

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-[var(--radius-card)] bg-[var(--background-warning)] p-3"
                >
                  <span className="mt-0.5 shrink-0">{getBlockerIcon(blocker.action)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                        {getBlockerLabel(blocker.action)}
                      </span>
                      {progress && (
                        <Badge variant="warning" size="sm">
                          {progress}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                      {blocker.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="primary" onClick={() => onOpenChange(false)}>
            Understood
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

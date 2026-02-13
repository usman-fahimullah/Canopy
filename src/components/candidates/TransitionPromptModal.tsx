"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import {
  CalendarCheck,
  CurrencyDollar,
  EnvelopeSimple,
  Lightning,
  UsersThree,
  Warning,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import type { TransitionSideEffect, TransitionPlan } from "@/lib/pipeline-service";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface TransitionPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The role/job ID */
  roleId: string;
  /** The application being moved */
  applicationId: string;
  /** Target stage ID */
  toStage: string;
  /** Target stage display name */
  toStageName: string;
  /** Candidate name for UI display */
  candidateName: string;
  /** Called when user confirms the transition (with selected optional actions) */
  onConfirm: (selectedActions: string[]) => void;
  /** Called when user cancels (Kanban will revert) */
  onCancel: () => void;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function getActionIcon(action: string) {
  switch (action) {
    case "prompt_schedule_interview":
      return <CalendarCheck size={18} weight="bold" />;
    case "prompt_create_offer":
      return <CurrencyDollar size={18} weight="bold" />;
    case "prompt_send_rejection_email":
      return <EnvelopeSimple size={18} weight="bold" />;
    case "suggest_reject_others":
      return <UsersThree size={18} weight="bold" />;
    case "auto_log_milestone":
      return <Lightning size={18} weight="bold" />;
    default:
      return <Lightning size={18} weight="bold" />;
  }
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function TransitionPromptModal({
  open,
  onOpenChange,
  roleId,
  applicationId,
  toStage,
  toStageName,
  candidateName,
  onConfirm,
  onCancel,
}: TransitionPromptModalProps) {
  const [plan, setPlan] = React.useState<TransitionPlan | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedOptional, setSelectedOptional] = React.useState<Set<string>>(new Set());

  // Fetch the transition plan when the modal opens
  React.useEffect(() => {
    if (!open) {
      setPlan(null);
      setError(null);
      setSelectedOptional(new Set());
      return;
    }

    const fetchPlan = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/canopy/roles/${roleId}/applications/${applicationId}/transition-plan?toStage=${encodeURIComponent(toStage)}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to load transition plan");
        }

        const { data } = await res.json();
        setPlan(data);

        // Pre-select all optional actions by default
        const optionalActions = (data.sideEffects ?? [])
          .filter((e: TransitionSideEffect) => !e.required)
          .map((e: TransitionSideEffect) => e.action);
        setSelectedOptional(new Set(optionalActions));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transition plan");
        logger.error("Failed to fetch transition plan", { error: formatError(err) });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [open, roleId, applicationId, toStage]);

  const toggleOptional = (action: string) => {
    setSelectedOptional((prev) => {
      const next = new Set(prev);
      if (next.has(action)) {
        next.delete(action);
      } else {
        next.add(action);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selectedActions = [
      // Required actions are always included
      ...(plan?.sideEffects ?? []).filter((e) => e.required).map((e) => e.action),
      // Optional actions that the user selected
      ...Array.from(selectedOptional),
    ];
    onConfirm(selectedActions);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  // If plan has no side effects, no need for the modal
  const hasSideEffects = (plan?.sideEffects ?? []).length > 0;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="default">
        <ModalHeader>
          <ModalTitle>
            Move {candidateName} to {toStageName}
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-[var(--background-error)] px-4 py-3 text-caption text-[var(--foreground-error)]">
              <Warning size={16} weight="bold" />
              {error}
            </div>
          )}

          {plan && !isLoading && (
            <div className="space-y-4">
              {!plan.allowed && (
                <div className="flex items-center gap-2 rounded-lg bg-[var(--background-error)] px-4 py-3 text-caption text-[var(--foreground-error)]">
                  <Warning size={16} weight="bold" />
                  {plan.blockedReason ?? "This transition is not allowed."}
                </div>
              )}

              {hasSideEffects && (
                <>
                  <p className="text-body-sm text-[var(--foreground-muted)]">
                    Moving this candidate will trigger the following actions:
                  </p>

                  <div className="space-y-3">
                    {plan.sideEffects.map((effect) => (
                      <div
                        key={effect.action}
                        className="flex items-start gap-3 rounded-lg bg-[var(--background-subtle)] p-3"
                      >
                        {/* Required = auto-checked, Optional = toggleable */}
                        {effect.required ? (
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]">
                            {getActionIcon(effect.action)}
                          </div>
                        ) : (
                          <Checkbox
                            checked={selectedOptional.has(effect.action)}
                            onCheckedChange={() => toggleOptional(effect.action)}
                            className="mt-0.5 shrink-0"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                              {effect.message}
                            </span>
                            {effect.required && (
                              <Badge variant="warning" size="sm">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!hasSideEffects && plan.allowed && (
                <p className="py-4 text-body-sm text-[var(--foreground-muted)]">
                  No additional actions are needed. Continue to move{" "}
                  <strong className="text-[var(--foreground-default)]">{candidateName}</strong> to{" "}
                  <strong className="text-[var(--foreground-default)]">{toStageName}</strong>?
                </p>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="tertiary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!plan?.allowed || isLoading}>
            {hasSideEffects ? "Confirm & Move" : "Move"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

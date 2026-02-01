"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Shell, StepConfig } from "@/lib/onboarding/types";
import { SHELL_CONFIGS } from "@/lib/onboarding/types";

interface OnboardingShellProps {
  children: ReactNode;
  /** Current shell being onboarded (null for intent/profile steps) */
  shell?: Shell | null;
  /** Current step config */
  step?: StepConfig | null;
  /** 0-indexed current step number */
  currentStepIndex?: number;
  /** Total steps for the current shell */
  totalSteps?: number;
}

export function OnboardingShell({
  children,
  shell,
  step,
  currentStepIndex,
  totalSteps,
}: OnboardingShellProps) {
  const hasProgress =
    currentStepIndex !== undefined && totalSteps !== undefined && totalSteps > 0;
  const progressPercent = hasProgress
    ? ((currentStepIndex + 1) / totalSteps) * 100
    : 0;

  const shellLabel = shell ? SHELL_CONFIGS[shell].label : null;

  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] flex flex-col">
      {/* ── Top bar ────────────────────────────────────────────── */}
      <header className="shrink-0 bg-white border-b border-[var(--primitive-neutral-200)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[var(--candid-background-brand)] flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {shell === "talent" ? "G" : shell === "coach" ? "C" : shell === "employer" ? "E" : "C"}
              </span>
            </div>
            <span className="text-body-sm font-semibold text-foreground-default">
              {shell === "talent"
                ? "Green Jobs"
                : shell === "coach"
                  ? "Candid"
                  : shell === "employer"
                    ? "Canopy"
                    : "Get Started"}
            </span>
          </Link>

          {/* Step counter */}
          {hasProgress && (
            <span className="text-caption text-foreground-muted">
              Step {currentStepIndex + 1} of {totalSteps}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {hasProgress && (
          <div className="h-1 bg-[var(--primitive-neutral-200)]">
            <div
              className="h-full bg-[var(--candid-background-brand)] transition-[width] duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col">
          {/* Step header */}
          {step && (
            <div className="mb-8">
              {shellLabel && (
                <p className="text-caption font-medium text-[var(--candid-foreground-brand)] mb-1">
                  {shellLabel}
                </p>
              )}
              <h1 className="text-heading-sm font-bold text-foreground-default">
                {step.title}
              </h1>
              <p className="mt-1 text-body-sm text-foreground-muted">
                {step.subtitle}
              </p>
            </div>
          )}

          {/* Step content */}
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}

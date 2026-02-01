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
  const hasProgress = currentStepIndex !== undefined && totalSteps !== undefined && totalSteps > 0;
  const progressPercent = hasProgress ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const shellLabel = shell ? SHELL_CONFIGS[shell].label : null;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--primitive-neutral-100)]">
      {/* ── Top bar ────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-[var(--primitive-neutral-200)] bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--candid-background-brand)]">
              <span className="text-sm font-bold text-white">
                {shell === "talent"
                  ? "G"
                  : shell === "coach"
                    ? "C"
                    : shell === "employer"
                      ? "E"
                      : "C"}
              </span>
            </div>
            <span className="text-foreground-default text-body-sm font-semibold">
              {shell === "talent"
                ? "Green Jobs"
                : shell === "coach"
                  ? "Candid"
                  : shell === "employer"
                    ? "Canopy"
                    : "Get Started"}
            </span>
          </Link>

          {/* Nav links + Step counter */}
          <div className="flex items-center gap-4">
            <Link
              href="/design-system"
              className="hover:text-foreground-default hidden text-caption text-foreground-muted transition-colors sm:inline"
            >
              Design System
            </Link>
            <Link
              href="/demo"
              className="hover:text-foreground-default hidden text-caption text-foreground-muted transition-colors sm:inline"
            >
              Demos
            </Link>
            {hasProgress && (
              <span className="text-caption text-foreground-muted">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
            )}
          </div>
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
      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12">
          {/* Step header */}
          {step && (
            <div className="mb-8">
              {shellLabel && (
                <p className="mb-1 text-caption font-medium text-[var(--candid-foreground-brand)]">
                  {shellLabel}
                </p>
              )}
              <h1 className="text-foreground-default text-heading-sm font-bold">{step.title}</h1>
              <p className="mt-1 text-body-sm text-foreground-muted">{step.subtitle}</p>
            </div>
          )}

          {/* Step content */}
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </div>
  );
}

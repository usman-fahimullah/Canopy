"use client";

import { Button } from "@/components/ui/button";
import { WarningCircle } from "@phosphor-icons/react";

export default function CandidateDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--background-default)]">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-error)]">
          <WarningCircle size={32} weight="fill" className="text-[var(--foreground-error)]" />
        </div>
        <h2 className="text-heading-sm font-semibold text-[var(--foreground-default)]">
          Failed to load candidate
        </h2>
        <p className="text-body-sm text-[var(--foreground-muted)]">
          {error.message || "Something went wrong while loading the candidate details."}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go back
          </Button>
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

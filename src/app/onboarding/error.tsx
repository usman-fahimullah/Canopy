"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WarningCircle } from "@phosphor-icons/react";

export default function OnboardingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Log to console so we can see it in Vercel Runtime Logs
    console.error("[Onboarding Error]", error.message, error.stack);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background-default)] px-8">
      <WarningCircle size={48} className="text-[var(--primitive-red-500)]" />
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
        Something went wrong
      </h2>
      <p className="max-w-md text-center text-body text-[var(--foreground-muted)]">
        An error occurred during onboarding. Please try again.
      </p>

      {/* Show error details for debugging */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-caption text-[var(--foreground-subtle)] underline"
      >
        {showDetails ? "Hide details" : "Show error details"}
      </button>

      {showDetails && (
        <div className="max-w-lg overflow-auto rounded-lg bg-[var(--background-subtle)] p-4">
          <p className="break-all font-mono text-caption text-[var(--foreground-error)]">
            {error.message}
          </p>
          {error.stack && (
            <pre className="mt-2 whitespace-pre-wrap break-all font-mono text-caption-sm text-[var(--foreground-muted)]">
              {error.stack}
            </pre>
          )}
          {error.digest && (
            <p className="mt-2 font-mono text-caption-sm text-[var(--foreground-subtle)]">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
        <Button onClick={() => (window.location.href = "/onboarding")} variant="tertiary">
          Start over
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WarningCircle } from "@phosphor-icons/react";

export default function CoachError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Coach shell error:", error);
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-108px)] flex-col items-center justify-center gap-4 px-8">
      <WarningCircle size={48} className="text-[var(--primitive-red-500)]" />
      <h2 className="text-heading-sm font-medium text-foreground-default">
        Something went wrong
      </h2>
      <p className="text-body text-foreground-muted text-center max-w-md">
        An unexpected error occurred. Please try again or contact support if the problem persists.
      </p>
      <Button onClick={reset} variant="primary">
        Try again
      </Button>
    </div>
  );
}

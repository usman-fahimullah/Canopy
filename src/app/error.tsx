"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WarningCircle } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      logger.error("Root error", { error: formatError(error) });
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4 px-8">
          <WarningCircle size={48} className="text-[var(--primitive-red-500)]" />
          <h2 className="text-foreground-default text-heading-sm font-medium">
            Something went wrong
          </h2>
          <p className="max-w-md text-center text-body text-foreground-muted">
            An unexpected error occurred. Please try again or contact support if the problem
            persists.
          </p>
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}

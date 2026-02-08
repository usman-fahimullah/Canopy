"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { WarningCircle } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

export default function TrackedJobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    logger.error("Tracked job page error", { error: formatError(error) });
  }, [error]);

  return (
    <div className="flex h-[calc(100vh-108px)] flex-col items-center justify-center gap-4 px-8">
      <WarningCircle size={48} className="text-[var(--primitive-red-500)]" />
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
        Unable to load job details
      </h2>
      <p className="max-w-md text-center text-body text-[var(--foreground-muted)]">
        We couldn&apos;t load this job&apos;s details. The job may have been removed or there was a
        temporary issue.
      </p>
      <div className="flex items-center gap-3">
        <Button onClick={() => router.push("/jobs/applications")} variant="tertiary">
          Back to Your Jobs
        </Button>
        <Button onClick={reset} variant="primary">
          Try again
        </Button>
      </div>
    </div>
  );
}

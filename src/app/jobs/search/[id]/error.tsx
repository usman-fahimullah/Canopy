"use client";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export default function JobDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 lg:px-12">
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
        Something went wrong
      </h2>
      <p className="max-w-md text-center text-body text-[var(--foreground-muted)]">
        We couldn&apos;t load this job posting. It may have been removed or there was a temporary
        issue.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
        <Button variant="tertiary" onClick={() => router.push("/jobs/search")}>
          Back to Job Search
        </Button>
      </div>
    </div>
  );
}

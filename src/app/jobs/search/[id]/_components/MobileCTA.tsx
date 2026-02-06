"use client";

import { Button } from "@/components/ui";
import { SaveButton } from "./SaveButton";

interface MobileCTAProps {
  jobId: string;
  isSaved: boolean;
  applyUrl: string | null;
}

export function MobileCTA({ jobId, isSaved, applyUrl }: MobileCTAProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border-muted)] bg-[var(--background-default)] p-4 lg:hidden">
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={() => {
            if (applyUrl) window.open(applyUrl, "_blank", "noopener");
          }}
        >
          Apply Now
        </Button>
        <SaveButton jobId={jobId} initialSaved={isSaved} />
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { BookmarkSimple, CheckCircle } from "@phosphor-icons/react";

interface SaveButtonProps {
  jobId: string;
  initialSaved: boolean;
}

export function SaveButton({ jobId, initialSaved }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [savingInProgress, setSavingInProgress] = useState(false);

  const toggleSave = useCallback(async () => {
    if (savingInProgress) return;
    setSavingInProgress(true);

    const wasSaved = isSaved;
    // Optimistic update
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: wasSaved ? "DELETE" : "POST",
      });
      if (!res.ok) {
        // Revert on failure
        setIsSaved(wasSaved);
      }
    } catch {
      setIsSaved(wasSaved);
    } finally {
      setSavingInProgress(false);
    }
  }, [jobId, isSaved, savingInProgress]);

  return (
    <Button
      variant={isSaved ? "secondary" : "inverse"}
      size="lg"
      onClick={toggleSave}
      aria-pressed={isSaved}
      disabled={savingInProgress}
      className={
        isSaved
          ? "bg-[var(--primitive-green-200)] text-[var(--primitive-green-700)] hover:bg-[var(--primitive-green-300)]"
          : ""
      }
    >
      {isSaved ? (
        <>
          <CheckCircle size={20} weight="fill" />
          Saved
        </>
      ) : (
        <>
          <BookmarkSimple size={20} />
          Save It
        </>
      )}
    </Button>
  );
}

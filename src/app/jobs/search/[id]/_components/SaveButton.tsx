"use client";

import { useState, useCallback } from "react";
import { SaveButton as SaveButtonUI } from "@/components/ui/save-button";

interface SaveButtonProps {
  jobId: string;
  initialSaved: boolean;
  /** Button size */
  size?: "default" | "lg";
  /** Show only the icon without label text */
  iconOnly?: boolean;
}

export function SaveButton({
  jobId,
  initialSaved,
  size = "lg",
  iconOnly = false,
}: SaveButtonProps) {
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
    <SaveButtonUI
      size={size}
      saved={isSaved}
      iconOnly={iconOnly}
      onClick={toggleSave}
      aria-pressed={isSaved}
      disabled={savingInProgress}
    />
  );
}

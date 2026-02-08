"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Textarea, Card, CardContent } from "@/components/ui";
import { CheckCircle } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface NotesEditorProps {
  jobId: string;
  initialNotes: string | null;
  isSaved: boolean;
}

export function NotesEditor({ jobId, initialNotes, isSaved }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [status, setStatus] = useState<SaveStatus>("idle");

  // Debounced auto-save (1s)
  const debouncedSave = useDebouncedCallback(async (value: string) => {
    setStatus("saving");
    try {
      const res = await fetch(`/api/jobs/${jobId}/save`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: value || undefined }),
      });
      if (res.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, 1000);

  // Clear "saved" indicator after 2s
  useEffect(() => {
    if (status === "saved") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setNotes(value);
      if (isSaved) {
        debouncedSave(value);
      }
    },
    [isSaved, debouncedSave]
  );

  if (!isSaved) {
    return (
      <Card className="rounded-2xl border-[var(--border-muted)]">
        <CardContent className="p-6">
          <p className="text-sm text-[var(--foreground-muted)]">
            Save this job to add personal notes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        value={notes}
        onChange={handleChange}
        placeholder="Add your notes about this job..."
        className="min-h-[120px] resize-y"
        maxLength={10000}
        aria-label="Your notes about this job"
      />
      <div className="flex items-center justify-between">
        <span className="text-caption-sm text-[var(--foreground-subtle)]">{notes.length}/10000</span>
        {status === "saving" && (
          <span className="flex items-center gap-1 text-caption-sm text-[var(--foreground-muted)]">
            <Spinner size="xs" variant="current" label="Saving" />
            Saving...
          </span>
        )}
        {status === "saved" && (
          <span className="flex items-center gap-1 text-caption-sm text-[var(--foreground-success)]">
            <CheckCircle size={14} weight="fill" />
            Saved
          </span>
        )}
        {status === "error" && (
          <span className="text-caption-sm text-[var(--foreground-error)]">Failed to save</span>
        )}
      </div>
    </div>
  );
}

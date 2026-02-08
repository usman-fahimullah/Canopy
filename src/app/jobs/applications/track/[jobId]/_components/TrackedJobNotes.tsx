"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Card, CardContent } from "@/components/ui";
import { CheckCircle } from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import { SimpleRichTextEditor } from "@/components/ui/rich-text-editor";
import { RichTextCharacterCounter } from "@/components/ui/character-counter";

/**
 * TrackedJobNotes — Rich text notes editor with auto-save.
 *
 * Pattern: Same auto-save approach as NotesEditor.tsx
 * (useDebouncedCallback 1s → PATCH /api/jobs/[jobId]/save)
 * but uses SimpleRichTextEditor for rich text HTML.
 */

type SaveStatus = "idle" | "saving" | "saved" | "error";

const MAX_CHARS = 10000;

interface TrackedJobNotesProps {
  jobId: string;
  initialNotes: string | null;
  isSaved: boolean;
}

export function TrackedJobNotes({ jobId, initialNotes, isSaved }: TrackedJobNotesProps) {
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
    (html: string) => {
      setNotes(html);
      if (isSaved) {
        debouncedSave(html);
      }
    },
    [isSaved, debouncedSave]
  );

  if (!isSaved) {
    return (
      <Card className="rounded-2xl border-[var(--border-muted)]">
        <CardContent className="p-6">
          <p className="text-body text-[var(--foreground-muted)]">
            Save this job to add personal notes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <SimpleRichTextEditor
        value={notes}
        onChange={handleChange}
        placeholder="Add your notes about this job..."
      />
      <div className="flex items-center justify-between">
        <RichTextCharacterCounter htmlContent={notes} max={MAX_CHARS} />
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

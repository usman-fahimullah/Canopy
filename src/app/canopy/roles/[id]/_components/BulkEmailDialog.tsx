"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { RichTextEditor, RichTextToolbar } from "@/components/ui/rich-text-editor";
import { EnvelopeSimple, Users, PaperPlaneTilt } from "@phosphor-icons/react";

// ============================================
// TYPES
// ============================================

interface BulkRecipient {
  applicationId: string;
  name: string;
  email: string;
}

interface BulkEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: BulkRecipient[];
  jobTitle?: string;
  onSent?: () => void;
}

// ============================================
// COMPONENT
// ============================================

export function BulkEmailDialog({
  open,
  onOpenChange,
  recipients,
  jobTitle,
  onSent,
}: BulkEmailDialogProps) {
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState<{
    sent: number;
    failed: number;
  } | null>(null);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSubject("");
      setBody("");
      setResult(null);
    }
  }, [open]);

  const handleSend = React.useCallback(async () => {
    if (!subject.trim() || !body.trim() || sending) return;
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/canopy/emails/bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationIds: recipients.map((r) => r.applicationId),
          subject,
          body,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");

      setResult({ sent: data.sent, failed: data.failed });
      onSent?.();
    } catch {
      setResult({ sent: 0, failed: recipients.length });
    } finally {
      setSending(false);
    }
  }, [subject, body, recipients, sending, onSent]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <EnvelopeSimple size={20} weight="bold" />
            Send Bulk Email
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Recipients summary */}
          <div className="flex items-center gap-2 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] px-4 py-3">
            <Users size={18} weight="bold" className="text-[var(--foreground-muted)]" />
            <span className="text-body-sm text-[var(--foreground-default)]">
              {recipients.length} recipient{recipients.length !== 1 ? "s" : ""}
            </span>
            {jobTitle && (
              <Badge variant="neutral" size="sm">
                {jobTitle}
              </Badge>
            )}
          </div>

          {/* Recipient preview (collapsible) */}
          <details className="text-caption text-[var(--foreground-muted)]">
            <summary className="cursor-pointer hover:text-[var(--foreground-default)]">
              Show recipients
            </summary>
            <div className="mt-2 flex max-h-32 flex-col gap-1 overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-3">
              {recipients.map((r) => (
                <span key={r.applicationId} className="text-caption-sm">
                  {r.name} &lt;{r.email}&gt;
                </span>
              ))}
            </div>
          </details>

          {/* Variable hint */}
          <p className="text-caption text-[var(--foreground-subtle)]">
            Available variables:{" "}
            <code className="rounded bg-[var(--background-muted)] px-1">
              {"{{candidate_name}}"}
            </code>
            , <code className="rounded bg-[var(--background-muted)] px-1">{"{{job_title}}"}</code>,{" "}
            <code className="rounded bg-[var(--background-muted)] px-1">{"{{company_name}}"}</code>
          </p>

          {/* Subject */}
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject..."
            inputSize="lg"
          />

          {/* Body */}
          <RichTextEditor
            content={body}
            onChange={setBody}
            placeholder="Write your email here..."
            minHeight="150px"
          >
            <RichTextToolbar />
          </RichTextEditor>

          {/* Result feedback */}
          {result && (
            <div
              className={`rounded-[var(--radius-lg)] px-4 py-3 text-body-sm ${
                result.failed === 0
                  ? "bg-[var(--background-success)] text-[var(--foreground-success)]"
                  : "bg-[var(--background-warning)] text-[var(--foreground-warning)]"
              }`}
            >
              {result.sent} sent{result.failed > 0 ? `, ${result.failed} failed` : ""}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => onOpenChange(false)}>
              {result ? "Close" : "Cancel"}
            </Button>
            {!result && (
              <Button
                variant="primary"
                onClick={handleSend}
                disabled={sending || !subject.trim() || !body.trim()}
              >
                {sending ? (
                  <Spinner size="sm" variant="current" />
                ) : (
                  <PaperPlaneTilt size={16} weight="bold" />
                )}
                {sending ? "Sending..." : `Send to ${recipients.length}`}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

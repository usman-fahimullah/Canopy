"use client";

import * as React from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  EmailComposer,
  type EmailRecipient,
  type EmailTemplate as ComposerTemplate,
} from "@/components/ui/email-composer";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface CandidateInfo {
  name: string;
  email: string;
  avatar?: string;
}

interface JobInfo {
  id: string;
  title: string;
}

interface CandidateEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateInfo;
  job?: JobInfo;
  applicationId?: string;
  companyName?: string;
  /** Current pipeline stage for email tracking */
  stageId?: string;
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function CandidateEmailDialog({
  open,
  onOpenChange,
  candidate,
  job,
  applicationId,
  companyName = "Our Team",
  stageId,
}: CandidateEmailDialogProps) {
  const [templates, setTemplates] = React.useState<ComposerTemplate[]>([]);
  const [isSending, setIsSending] = React.useState(false);

  // Fetch templates on open
  React.useEffect(() => {
    if (!open) return;

    fetch("/api/canopy/emails/templates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch templates");
        return res.json();
      })
      .then((json) => {
        const mapped: ComposerTemplate[] = (json.data ?? []).map(
          (t: { id: string; name: string; subject: string; content: string; type?: string }) => ({
            id: t.id,
            name: t.name,
            subject: t.subject,
            body: t.content,
            category: t.type?.toLowerCase(),
          })
        );
        setTemplates(mapped);
      })
      .catch(() => {
        // Templates are optional — composer works without them
      });
  }, [open]);

  const recipient: EmailRecipient = {
    id: candidate.email,
    name: candidate.name,
    email: candidate.email,
    avatar: candidate.avatar,
  };

  const handleSend = async (email: {
    to: EmailRecipient[];
    cc?: EmailRecipient[];
    bcc?: EmailRecipient[];
    subject: string;
    body: string;
  }) => {
    setIsSending(true);

    try {
      // Build variables for server-side interpolation
      const variables: Record<string, string> = {
        candidate_name: candidate.name,
        candidate_first_name: candidate.name.split(" ")[0] ?? candidate.name,
        candidate_email: candidate.email,
      };
      if (job) {
        variables.job_title = job.title;
      }
      if (companyName) {
        variables.company_name = companyName;
      }

      const res = await fetch("/api/canopy/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email.to.map((r) => r.email),
          cc: email.cc?.map((r) => r.email),
          bcc: email.bcc?.map((r) => r.email),
          subject: email.subject,
          body: email.body,
          applicationId,
          stageId: stageId || undefined,
          variables,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Failed to send email");
      }

      const result = await res.json();
      toast.success(`Email sent to ${result.sent} recipient${result.sent === 1 ? "" : "s"}`);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="border-b border-[var(--border-default)] px-6 py-4">
          <DialogTitle>Email {candidate.name}</DialogTitle>
        </DialogHeader>
        <div className="p-0">
          <EmailComposer
            to={[recipient]}
            templates={templates}
            onSend={handleSend}
            onDiscard={() => onOpenChange(false)}
            loading={isSending}
            showAiSuggestions={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

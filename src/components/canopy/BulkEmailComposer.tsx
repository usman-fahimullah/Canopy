"use client";

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { RichTextEditor, RichTextToolbar } from "@/components/ui/rich-text-editor";
import {
  TemplateGallery,
  VariableInserter,
  defaultVariables,
  type EmailTemplate,
  type EmailVariable,
} from "@/components/ui/email-composer";
import { sanitizeHtml } from "@/lib/utils";
import { logger } from "@/lib/logger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateTimePicker } from "@/components/ui/time-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  EnvelopeSimple,
  PaperPlaneTilt,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle,
  WarningCircle,
  UsersThree,
  Sparkle,
  Clock,
  CalendarBlank,
  CaretDown,
  Timer,
} from "@phosphor-icons/react";

/* ============================================
   Types
   ============================================ */

interface BulkEmailCandidate {
  id: string;
  name: string;
  email: string;
}

interface BulkEmailComposerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Application IDs of selected candidates */
  applicationIds: string[];
  /** Candidate names/emails for display */
  candidates: BulkEmailCandidate[];
  /** Job title for variable interpolation */
  jobTitle: string;
  /** Company name for variable interpolation */
  companyName: string;
  /** Called after modal closes to clean up bulk selection */
  onSendComplete?: () => void;
}

type ComposerStep = "compose" | "preview" | "sending" | "results" | "scheduled";

interface SendResult {
  sent: number;
  failed: number;
  total: number;
  errors?: string[];
}

interface ApiTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  variables?: string[];
}

/* ============================================
   Helpers
   ============================================ */

/** Replace {{variable}} placeholders with sample or actual values */
function interpolateVariables(
  text: string,
  variables: EmailVariable[],
  overrides?: Record<string, string>
): string {
  let result = text;
  variables.forEach((v) => {
    const value = overrides?.[v.key] ?? v.sampleValue ?? v.label;
    result = result.replace(new RegExp(v.key.replace(/[{}]/g, "\\$&"), "g"), value);
  });
  return result;
}

/** Map API template shape to EmailComposer's EmailTemplate interface */
function mapApiTemplate(apiTemplate: ApiTemplate): EmailTemplate {
  return {
    id: apiTemplate.id,
    name: apiTemplate.name,
    subject: apiTemplate.subject,
    body: apiTemplate.content,
    category: apiTemplate.type,
  };
}

/* ============================================
   BulkEmailComposer
   ============================================ */

export function BulkEmailComposer({
  open,
  onOpenChange,
  applicationIds,
  candidates,
  jobTitle,
  companyName,
  onSendComplete,
}: BulkEmailComposerProps) {
  // -- Step state --
  const [step, setStep] = React.useState<ComposerStep>("compose");

  // -- Compose state --
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");

  // -- Templates --
  const [templates, setTemplates] = React.useState<EmailTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);

  // -- Sending state --
  const [sendProgress, setSendProgress] = React.useState(0);
  const [sendResult, setSendResult] = React.useState<SendResult | null>(null);

  // -- Schedule state (Story 6.6) --
  const [scheduledFor, setScheduledFor] = React.useState<Date | undefined>(undefined);
  const [showCustomSchedule, setShowCustomSchedule] = React.useState(false);
  const [isScheduling, setIsScheduling] = React.useState(false);

  // -- Variables for interpolation --
  const variables: EmailVariable[] = React.useMemo(() => {
    return defaultVariables.map((v) => {
      if (v.key === "{{job_title}}" && jobTitle) {
        return { ...v, sampleValue: jobTitle };
      }
      if (v.key === "{{company_name}}" && companyName) {
        return { ...v, sampleValue: companyName };
      }
      return v;
    });
  }, [jobTitle, companyName]);

  // -- Sample preview candidate --
  const previewCandidate = candidates[0];
  const previewOverrides = React.useMemo((): Record<string, string> => {
    if (!previewCandidate) return {};
    return {
      "{{candidate_name}}": previewCandidate.name,
      "{{candidate_first_name}}": previewCandidate.name.split(" ")[0],
      "{{candidate_email}}": previewCandidate.email,
      "{{job_title}}": jobTitle,
      "{{company_name}}": companyName,
    };
  }, [previewCandidate, jobTitle, companyName]);

  // -- Fetch templates when modal opens --
  React.useEffect(() => {
    if (!open) return;

    // Reset state when modal opens
    setStep("compose");
    setSubject("");
    setBody("");
    setSelectedTemplateId("");
    setSendProgress(0);
    setSendResult(null);
    setScheduledFor(undefined);
    setShowCustomSchedule(false);
    setIsScheduling(false);
    setShowTemplates(false);

    // Fetch templates
    setTemplatesLoading(true);
    fetch("/api/canopy/emails/templates")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch templates");
        return res.json();
      })
      .then((data: { data: ApiTemplate[] }) => {
        const mapped = (data.data || []).map(mapApiTemplate);
        setTemplates(mapped);
        if (mapped.length > 0) {
          setShowTemplates(true);
        }
      })
      .catch((err) => {
        logger.error("Failed to fetch email templates", {
          error: err instanceof Error ? err.message : String(err),
        });
      })
      .finally(() => {
        setTemplatesLoading(false);
      });
  }, [open]);

  // -- Handlers --
  const handleTemplateSelect = React.useCallback((template: EmailTemplate) => {
    setSubject(template.subject);
    setBody(template.body);
    setSelectedTemplateId(template.id);
    setShowTemplates(false);
  }, []);

  const handleInsertVariable = React.useCallback((variable: string) => {
    setBody((prev) => prev + variable);
  }, []);

  const handleGoToPreview = React.useCallback(() => {
    setStep("preview");
  }, []);

  const handleBackToCompose = React.useCallback(() => {
    setStep("compose");
  }, []);

  const handleSendAll = React.useCallback(async () => {
    setStep("sending");
    setSendProgress(0);

    try {
      // Simulate progress while the API processes
      const progressInterval = setInterval(() => {
        setSendProgress((prev) => {
          // Progress up to 90% while waiting for response
          if (prev < 90) return prev + 5;
          return prev;
        });
      }, 300);

      const res = await fetch("/api/canopy/emails/bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationIds,
          subject,
          body,
          templateId: selectedTemplateId || undefined,
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error ?? `Failed to send emails (${res.status})`);
      }

      const result: SendResult = await res.json();
      setSendProgress(100);
      setSendResult(result);
      setStep("results");
    } catch (err) {
      logger.error("Bulk email send failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      setSendProgress(100);
      setSendResult({
        sent: 0,
        failed: applicationIds.length,
        total: applicationIds.length,
        errors: [err instanceof Error ? err.message : "An unexpected error occurred"],
      });
      setStep("results");
    }
  }, [applicationIds, subject, body, selectedTemplateId]);

  // -- Schedule handler (Story 6.6) --
  const handleSchedule = React.useCallback(
    async (date: Date) => {
      setIsScheduling(true);
      try {
        const recipients = candidates.map((c) => ({
          email: c.email,
          name: c.name,
          applicationId: c.id,
        }));

        const res = await fetch("/api/canopy/emails/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipients,
            subject,
            body,
            templateId: selectedTemplateId || undefined,
            scheduledFor: date.toISOString(),
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error ?? "Failed to schedule email");
        }

        setScheduledFor(date);
        setStep("scheduled");
      } catch (err) {
        logger.error("Failed to schedule email", {
          error: err instanceof Error ? err.message : String(err),
        });
        // Show error via the results step
        setSendResult({
          sent: 0,
          failed: candidates.length,
          total: candidates.length,
          errors: [err instanceof Error ? err.message : "Failed to schedule email"],
        });
        setStep("results");
      } finally {
        setIsScheduling(false);
      }
    },
    [candidates, subject, body, selectedTemplateId]
  );

  const handleClose = React.useCallback(() => {
    onOpenChange(false);
    if ((sendResult && sendResult.sent > 0) || step === "scheduled") {
      onSendComplete?.();
    }
  }, [onOpenChange, sendResult, step, onSendComplete]);

  // -- Validation --
  const canSend = subject.trim().length > 0 && body.trim().length > 0;

  // -- Preview content --
  const previewSubject = interpolateVariables(subject, variables, previewOverrides);
  const previewBody = interpolateVariables(body, variables, previewOverrides);

  return (
    <Modal open={open} onOpenChange={step === "sending" ? undefined : onOpenChange}>
      <ModalContent size="lg">
        {/* ============================================
            HEADER
            ============================================ */}
        <ModalHeader
          icon={
            <EnvelopeSimple weight="regular" className="h-6 w-6 text-[var(--foreground-brand)]" />
          }
          iconBg="bg-[var(--background-brand-subtle)]"
          hideCloseButton={step === "sending"}
        >
          <ModalTitle>
            <span className="flex items-center gap-2">
              {step === "compose" && "Compose Bulk Email"}
              {step === "preview" && "Preview Email"}
              {step === "sending" && "Sending Emails..."}
              {step === "results" && "Send Results"}
              <Badge variant="neutral" size="sm">
                <UsersThree size={12} weight="bold" className="mr-0.5" />
                {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
              </Badge>
            </span>
          </ModalTitle>
        </ModalHeader>

        {/* ============================================
            COMPOSE STEP
            ============================================ */}
        {step === "compose" && (
          <>
            <ModalBody className="gap-0 p-0">
              {/* Recipient summary */}
              <div className="border-b border-[var(--border-muted)] px-8 py-3">
                <div className="flex items-start gap-2">
                  <span className="shrink-0 pt-0.5 text-caption-strong text-[var(--foreground-subtle)]">
                    To:
                  </span>
                  <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                    {candidates.slice(0, 5).map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--background-subtle)] py-0.5 pl-0.5 pr-2.5 text-sm"
                      >
                        <Avatar name={c.name} size="xs" />
                        <span className="max-w-32 truncate">{c.name}</span>
                      </span>
                    ))}
                    {candidates.length > 5 && (
                      <Badge variant="neutral" size="sm">
                        +{candidates.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Template gallery (collapsible) */}
              {templatesLoading ? (
                <div className="flex items-center justify-center border-b border-[var(--border-muted)] bg-[var(--background-subtle)] px-8 py-6">
                  <Spinner size="sm" />
                  <span className="ml-2 text-caption text-[var(--foreground-muted)]">
                    Loading templates...
                  </span>
                </div>
              ) : (
                showTemplates &&
                templates.length > 0 && (
                  <div className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)] px-8 py-4">
                    <TemplateGallery
                      templates={templates}
                      onSelect={handleTemplateSelect}
                      selectedId={selectedTemplateId}
                    />
                  </div>
                )
              )}

              {/* Template toggle button (when gallery is hidden) */}
              {!templatesLoading && !showTemplates && templates.length > 0 && (
                <div className="border-b border-[var(--border-muted)] px-8 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(true)}
                    className="h-7 gap-1.5 text-xs"
                  >
                    <Sparkle className="h-3.5 w-3.5" />
                    Show Templates
                  </Button>
                </div>
              )}

              {/* Subject field */}
              <div className="flex items-center gap-0 border-b border-[var(--border-muted)] px-8 py-3">
                <span className="w-16 shrink-0 text-caption-strong text-[var(--foreground-subtle)]">
                  Subject:
                </span>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line..."
                  className="flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                />
              </div>

              {/* Body editor */}
              <div className="flex min-h-[280px] flex-col">
                <RichTextEditor
                  content={body}
                  onChange={setBody}
                  placeholder="Write your message... Use variables like {{candidate_name}} for personalization."
                  className="flex-1 rounded-none border-0"
                  minHeight="200px"
                >
                  <div className="flex items-center gap-1 border-b border-[var(--border-muted)] px-5 py-2">
                    <RichTextToolbar />
                    <span className="mx-1 h-4 w-px bg-[var(--border-muted)]" />
                    <VariableInserter variables={variables} onInsert={handleInsertVariable} />
                  </div>
                </RichTextEditor>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="tertiary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={handleGoToPreview} disabled={!canSend}>
                <Eye className="mr-1.5 h-4 w-4" />
                Preview
              </Button>
            </ModalFooter>
          </>
        )}

        {/* ============================================
            PREVIEW STEP
            ============================================ */}
        {step === "preview" && (
          <>
            <ModalBody>
              {/* Sample note */}
              <div className="flex w-full items-center gap-2 rounded-lg bg-[var(--background-info)] px-4 py-2.5 text-caption text-[var(--foreground-info)]">
                <WarningCircle size={16} weight="fill" className="shrink-0" />
                <span>
                  Preview shows a sample for{" "}
                  <strong>{previewCandidate?.name ?? "the first candidate"}</strong>. Variables will
                  be personalized for each recipient.
                </span>
              </div>

              {/* Recipient preview */}
              <div className="w-full space-y-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                  To
                </span>
                <div className="flex items-center gap-2">
                  {previewCandidate && (
                    <>
                      <Avatar name={previewCandidate.name} size="xs" />
                      <span className="text-body-sm text-[var(--foreground-default)]">
                        {previewCandidate.name}
                      </span>
                      <span className="text-caption text-[var(--foreground-subtle)]">
                        ({previewCandidate.email})
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Subject preview */}
              <div className="w-full space-y-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                  Subject
                </span>
                <p className="text-body font-semibold text-[var(--foreground-default)]">
                  {previewSubject || "(No subject)"}
                </p>
              </div>

              {/* Body preview */}
              <div className="w-full space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
                  Message
                </span>
                <div
                  className="prose prose-sm max-w-none rounded-xl border border-[var(--border-muted)] bg-[var(--background-subtle)] p-5"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(previewBody),
                  }}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <Button variant="tertiary" onClick={handleBackToCompose}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Edit
              </Button>
              <div className="flex-1" />

              {/* Schedule for later (Story 6.6) */}
              <Popover open={showCustomSchedule} onOpenChange={setShowCustomSchedule}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="tertiary" disabled={isScheduling}>
                      <Clock className="mr-1.5 h-4 w-4" />
                      Schedule
                      <CaretDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-2 py-1.5 text-xs font-medium text-[var(--foreground-subtle)]">
                      Send later
                    </div>
                    <DropdownMenuItem
                      onClick={() => handleSchedule(new Date(Date.now() + 3600000))}
                      className="gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      In 1 hour
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(9, 0, 0, 0);
                        handleSchedule(tomorrow);
                      }}
                      className="gap-2"
                    >
                      <CalendarBlank className="h-4 w-4" />
                      Tomorrow 9:00 AM
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const inTwoDays = new Date();
                        inTwoDays.setDate(inTwoDays.getDate() + 2);
                        inTwoDays.setHours(9, 0, 0, 0);
                        handleSchedule(inTwoDays);
                      }}
                      className="gap-2"
                    >
                      <CalendarBlank className="h-4 w-4" />
                      In 2 days
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <PopoverTrigger asChild>
                      <DropdownMenuItem className="gap-2">
                        <Timer className="h-4 w-4" />
                        Pick date & time...
                      </DropdownMenuItem>
                    </PopoverTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <PopoverContent align="end" className="w-auto p-4">
                  <div className="space-y-3">
                    <p className="text-caption-strong text-[var(--foreground-default)]">
                      Schedule send time
                    </p>
                    <DateTimePicker
                      value={scheduledFor}
                      onChange={(d) => setScheduledFor(d)}
                      minDate={new Date()}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => setShowCustomSchedule(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        disabled={!scheduledFor || isScheduling}
                        loading={isScheduling}
                        onClick={() => {
                          if (scheduledFor) {
                            setShowCustomSchedule(false);
                            handleSchedule(scheduledFor);
                          }
                        }}
                      >
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button onClick={handleSendAll} disabled={isScheduling}>
                <PaperPlaneTilt className="mr-1.5 h-4 w-4" weight="fill" />
                Send to {candidates.length} Candidate{candidates.length !== 1 ? "s" : ""}
              </Button>
            </ModalFooter>
          </>
        )}

        {/* ============================================
            SENDING STEP
            ============================================ */}
        {step === "sending" && (
          <ModalBody className="items-center justify-center py-12">
            <div className="flex w-full max-w-sm flex-col items-center gap-6">
              <Spinner size="lg" />
              <div className="w-full space-y-2 text-center">
                <p className="text-body font-medium text-[var(--foreground-default)]">
                  Sending emails...
                </p>
                <p className="text-caption text-[var(--foreground-muted)]">
                  Sending to {candidates.length} candidate
                  {candidates.length !== 1 ? "s" : ""}. Please wait.
                </p>
              </div>
              <Progress value={sendProgress} size="md" className="w-full" />
              <p className="text-caption tabular-nums text-[var(--foreground-subtle)]">
                {sendProgress}% complete
              </p>
            </div>
          </ModalBody>
        )}

        {/* ============================================
            RESULTS STEP
            ============================================ */}
        {step === "results" && sendResult && (
          <>
            <ModalBody className="items-center py-8">
              <div className="flex w-full max-w-md flex-col items-center gap-6">
                {/* Success / Partial / Failure icon */}
                {sendResult.failed === 0 ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-success)]">
                    <CheckCircle
                      size={32}
                      weight="fill"
                      className="text-[var(--foreground-success)]"
                    />
                  </div>
                ) : sendResult.sent > 0 ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-warning)]">
                    <WarningCircle
                      size={32}
                      weight="fill"
                      className="text-[var(--foreground-warning)]"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-error)]">
                    <XCircle size={32} weight="fill" className="text-[var(--foreground-error)]" />
                  </div>
                )}

                {/* Summary text */}
                <div className="space-y-1 text-center">
                  <h3 className="text-heading-sm font-semibold text-[var(--foreground-default)]">
                    {sendResult.failed === 0
                      ? "All Emails Sent"
                      : sendResult.sent > 0
                        ? "Partially Sent"
                        : "Send Failed"}
                  </h3>
                  <p className="text-body-sm text-[var(--foreground-muted)]">
                    {sendResult.failed === 0
                      ? `Successfully sent ${sendResult.sent} email${sendResult.sent !== 1 ? "s" : ""}.`
                      : `${sendResult.sent} sent, ${sendResult.failed} failed out of ${sendResult.total} total.`}
                  </p>
                </div>

                {/* Stats row */}
                <div className="flex w-full items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      size={18}
                      weight="fill"
                      className="text-[var(--foreground-success)]"
                    />
                    <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                      {sendResult.sent} Sent
                    </span>
                  </div>
                  {sendResult.failed > 0 && (
                    <div className="flex items-center gap-2">
                      <XCircle size={18} weight="fill" className="text-[var(--foreground-error)]" />
                      <span className="text-body-sm font-medium text-[var(--foreground-default)]">
                        {sendResult.failed} Failed
                      </span>
                    </div>
                  )}
                </div>

                {/* Error details */}
                {sendResult.errors && sendResult.errors.length > 0 && (
                  <div className="w-full rounded-lg border border-[var(--border-error)] bg-[var(--background-error)] p-4">
                    <p className="mb-2 text-caption-strong text-[var(--foreground-error)]">
                      Error Details
                    </p>
                    <ul className="space-y-1">
                      {sendResult.errors.map((error, idx) => (
                        <li key={idx} className="text-caption text-[var(--foreground-error)]">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleClose}>Close</Button>
            </ModalFooter>
          </>
        )}
        {/* ============================================
            SCHEDULED CONFIRMATION STEP (Story 6.6)
            ============================================ */}
        {step === "scheduled" && scheduledFor && (
          <>
            <ModalBody className="items-center py-8">
              <div className="flex w-full max-w-md flex-col items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-info)]">
                  <Clock size={32} weight="fill" className="text-[var(--foreground-info)]" />
                </div>

                <div className="space-y-1 text-center">
                  <h3 className="text-heading-sm font-semibold text-[var(--foreground-default)]">
                    Email Scheduled
                  </h3>
                  <p className="text-body-sm text-[var(--foreground-muted)]">
                    Your email to {candidates.length} candidate
                    {candidates.length !== 1 ? "s" : ""} is scheduled for:
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-5 py-3">
                  <CalendarBlank
                    size={20}
                    weight="regular"
                    className="text-[var(--foreground-brand)]"
                  />
                  <div>
                    <p className="text-body font-medium text-[var(--foreground-default)]">
                      {scheduledFor.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-caption text-[var(--foreground-muted)]">
                      {scheduledFor.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-caption text-[var(--foreground-subtle)]">
                  You can view and cancel scheduled emails from the email queue.
                </p>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button onClick={handleClose}>Done</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Label,
  DatePicker,
  Spinner,
} from "@/components/ui";
import { logger, formatError } from "@/lib/logger";

interface OfferDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  jobTitle: string;
  candidateName: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  onOfferCreated?: (offerId: string) => void;
}

export function OfferDetailsModal({
  open,
  onOpenChange,
  applicationId,
  jobTitle,
  candidateName,
  salaryMin,
  salaryMax,
  onOfferCreated,
}: OfferDetailsModalProps) {
  const [salary, setSalary] = useState(salaryMin ? String(salaryMin / 100) : "");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [department, setDepartment] = useState("");
  const [notes, setNotes] = useState("");
  const [signingMethod, setSigningMethod] = useState<
    "SIGNING_LINK" | "DOCUMENT_UPLOAD" | "OFFLINE"
  >("SIGNING_LINK");
  const [signingLink, setSigningLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [letterContent, setLetterContent] = useState("");
  const [step, setStep] = useState<"details" | "preview" | "signing">("details");
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePreview = async () => {
    if (!startDate) {
      setError("Start date is required");
      return;
    }

    setIsGeneratingPreview(true);
    setError(null);

    try {
      const res = await fetch("/api/canopy/offers/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          salary: salary ? Math.round(parseFloat(salary) * 100) : undefined,
          startDate: startDate.toISOString(),
          department: department || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate preview");
      }

      const data = await res.json();
      setLetterContent(data.letterContent);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate preview");
      logger.error("Offer preview error", { error: formatError(err) });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleCreateOffer = async () => {
    if (!startDate || !letterContent) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/canopy/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          salary: salary ? Math.round(parseFloat(salary) * 100) : undefined,
          salaryCurrency: "USD",
          startDate: startDate.toISOString(),
          department: department || undefined,
          notes: notes || undefined,
          signingMethod,
          signingLink: signingMethod === "SIGNING_LINK" ? signingLink || undefined : undefined,
          letterContent,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create offer");
      }

      const data = await res.json();
      onOfferCreated?.(data.offer.id);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create offer");
      logger.error("Offer creation error", { error: formatError(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <p className="text-body-sm text-[var(--foreground-muted)]">
        Create an offer for <strong>{candidateName}</strong> for the <strong>{jobTitle}</strong>{" "}
        position.
      </p>

      <div className="space-y-2">
        <Label htmlFor="salary">Annual Salary (USD)</Label>
        <Input
          id="salary"
          type="number"
          placeholder={
            salaryMin ? `${salaryMin / 100} - ${(salaryMax || salaryMin) / 100}` : "e.g. 75000"
          }
          value={salary}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSalary(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Start Date</Label>
        <DatePicker
          value={startDate}
          onChange={setStartDate}
          placeholder="Select start date"
          minDate={new Date()}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department (optional)</Label>
        <Input
          id="department"
          placeholder="e.g. Engineering"
          value={department}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartment(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Personal message to candidate (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add a personal note to the candidate..."
          value={notes}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-4">
      <p className="text-body-sm text-[var(--foreground-muted)]">
        Review the offer letter. You can edit it before sending.
      </p>
      <div
        className="max-h-[400px] overflow-y-auto rounded-lg border border-[var(--border-default)] bg-white p-6"
        dangerouslySetInnerHTML={{ __html: letterContent }}
      />
    </div>
  );

  const renderSigningStep = () => (
    <div className="space-y-4">
      <p className="text-body-sm text-[var(--foreground-muted)]">
        How will the candidate sign this offer?
      </p>

      <div className="space-y-3">
        {(
          [
            {
              value: "SIGNING_LINK" as const,
              label: "Paste a signing link",
              desc: "DocuSign, HelloSign, or another e-signing tool",
            },
            {
              value: "DOCUMENT_UPLOAD" as const,
              label: "Upload a signing document",
              desc: "Upload a PDF for the candidate to download",
            },
            {
              value: "OFFLINE" as const,
              label: "Handle offline",
              desc: "Signing will happen outside of Canopy",
            },
          ] as const
        ).map((option) => (
          <label
            key={option.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              signingMethod === option.value
                ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                : "border-[var(--border-default)] hover:bg-[var(--background-interactive-hover)]"
            }`}
          >
            <input
              type="radio"
              name="signingMethod"
              value={option.value}
              checked={signingMethod === option.value}
              onChange={() => setSigningMethod(option.value)}
              className="mt-1"
            />
            <div>
              <p className="text-body-sm font-semibold text-[var(--foreground-default)]">
                {option.label}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">{option.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {signingMethod === "SIGNING_LINK" && (
        <div className="space-y-2">
          <Label htmlFor="signingLink">Signing URL</Label>
          <Input
            id="signingLink"
            type="url"
            placeholder="https://docusign.com/..."
            value={signingLink}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSigningLink(e.target.value)}
          />
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === "details" && "Offer Details"}
            {step === "preview" && "Offer Letter Preview"}
            {step === "signing" && "Signing Method"}
          </DialogTitle>
        </DialogHeader>

        {error && <div className="rounded-lg bg-red-50 p-3 text-body-sm text-red-700">{error}</div>}

        {step === "details" && renderDetailsStep()}
        {step === "preview" && renderPreviewStep()}
        {step === "signing" && renderSigningStep()}

        <DialogFooter className="flex gap-2">
          {step === "details" && (
            <>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleGeneratePreview} disabled={!startDate || isGeneratingPreview}>
                {isGeneratingPreview ? (
                  <>
                    <Spinner size="sm" /> Generating...
                  </>
                ) : (
                  "Preview Letter"
                )}
              </Button>
            </>
          )}
          {step === "preview" && (
            <>
              <Button variant="ghost" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button onClick={() => setStep("signing")}>Choose Signing Method</Button>
            </>
          )}
          {step === "signing" && (
            <>
              <Button variant="ghost" onClick={() => setStep("preview")}>
                Back
              </Button>
              <Button onClick={handleCreateOffer} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" /> Creating...
                  </>
                ) : (
                  "Create Offer"
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

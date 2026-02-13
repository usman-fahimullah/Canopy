"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Spinner } from "@/components/ui/spinner";
import { Banner } from "@/components/ui/banner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-table";
import {
  UploadSimple,
  CheckCircle,
  XCircle,
  DownloadSimple,
  WarningCircle,
  FileText,
} from "@phosphor-icons/react";
import { parseRolesFromCSV, SAMPLE_CSV, type ParsedRow } from "@/lib/csv/import";
import { downloadCSV } from "@/lib/csv/export";
import { logger, formatError } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BulkRoleImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete?: () => void;
}

type ImportStep = "upload" | "review" | "results";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format location type enum for display. */
function formatEnum(value: string | undefined): string {
  if (!value) return "\u2014";
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Format a salary range for display. */
function formatSalaryRange(min?: number, max?: number): string {
  if (min == null && max == null) return "\u2014";
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  if (min != null && max != null) return `${fmt(min)} \u2013 ${fmt(max)}`;
  if (min != null) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

// ---------------------------------------------------------------------------
// Step 1: Upload
// ---------------------------------------------------------------------------

function StepUpload({ onFileSelected }: { onFileSelected: (file: File) => void }) {
  const handleDownloadSample = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    downloadCSV("canopy-roles-sample.csv", SAMPLE_CSV);
  }, []);

  return (
    <ModalBody>
      <p className="text-body-sm text-[var(--foreground-muted)]">
        Upload a CSV file with your job roles. Only the Title column is required &mdash; all other
        fields are optional.
      </p>

      <FileUpload
        accept=".csv"
        multiple={false}
        maxSize={1048576}
        onChange={(files) => {
          if (files.length > 0) {
            onFileSelected(files[0]);
          }
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-[var(--background-muted)] p-3">
            <FileText className="h-6 w-6 text-[var(--foreground-muted)]" />
          </div>
          <div className="text-center">
            <p className="text-body-sm font-medium text-[var(--foreground-default)]">
              Drop your CSV file here or click to browse
            </p>
            <p className="mt-1 text-caption text-[var(--foreground-muted)]">
              Accepted: .csv &middot; Max 1 MB
            </p>
          </div>
        </div>
      </FileUpload>

      {/* Download sample CSV link */}
      <button
        type="button"
        onClick={handleDownloadSample}
        className="inline-flex items-center gap-1.5 text-caption font-medium text-[var(--foreground-link)] transition-colors hover:text-[var(--foreground-link-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
      >
        <DownloadSimple size={16} weight="bold" />
        Download sample CSV
      </button>
    </ModalBody>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Review
// ---------------------------------------------------------------------------

function StepReview({
  parsedRows,
  unmappedHeaders,
}: {
  parsedRows: ParsedRow[];
  unmappedHeaders: string[];
}) {
  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const invalidRows = parsedRows.filter((r) => r.errors.length > 0);

  return (
    <ModalBody className="gap-4">
      {/* Summary banner */}
      {invalidRows.length === 0 ? (
        <Banner
          type="success"
          subtle
          dismissible={false}
          title={`${validRows.length} role${validRows.length !== 1 ? "s" : ""} ready to import`}
        />
      ) : validRows.length > 0 ? (
        <Banner
          type="warning"
          subtle
          dismissible={false}
          title={`${validRows.length} ready, ${invalidRows.length} need fixes`}
          description="Invalid rows will be skipped during import."
        />
      ) : (
        <Banner
          type="critical"
          subtle
          dismissible={false}
          title="No valid roles found"
          description="Every row has validation errors. Please fix your CSV and re-upload."
        />
      )}

      {/* Unmapped headers warning */}
      {unmappedHeaders.length > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-[var(--background-subtle)] px-4 py-3">
          <WarningCircle
            size={18}
            weight="fill"
            className="mt-0.5 shrink-0 text-[var(--foreground-muted)]"
          />
          <p className="text-caption text-[var(--foreground-muted)]">
            Unrecognized columns: <span className="font-medium">{unmappedHeaders.join(", ")}</span>{" "}
            (these will be skipped)
          </p>
        </div>
      )}

      {/* Preview table */}
      <div className="max-h-[400px] overflow-y-auto rounded-xl border border-[var(--border-default)]">
        <Table density="compact" bordered={false}>
          <TableHeader sticky>
            <TableRow>
              <TableHead>Row</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Employment</TableHead>
              <TableHead>Salary Range</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parsedRows.map((row) => {
              const hasErrors = row.errors.length > 0;
              return (
                <TableRow
                  key={row.rowIndex}
                  className={hasErrors ? "bg-[var(--background-error)]" : undefined}
                >
                  <TableCell className="text-caption text-[var(--foreground-muted)]">
                    {row.rowIndex}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="text-caption font-medium text-[var(--foreground-default)]">
                      {row.data.title || "\u2014"}
                    </span>
                  </TableCell>
                  <TableCell className="text-caption text-[var(--foreground-muted)]">
                    {row.data.location || "\u2014"}
                  </TableCell>
                  <TableCell className="text-caption text-[var(--foreground-muted)]">
                    {formatEnum(row.data.locationType)}
                  </TableCell>
                  <TableCell className="text-caption text-[var(--foreground-muted)]">
                    {formatEnum(row.data.employmentType)}
                  </TableCell>
                  <TableCell className="text-caption text-[var(--foreground-muted)]">
                    {formatSalaryRange(row.data.salaryMin, row.data.salaryMax)}
                  </TableCell>
                  <TableCell>
                    {hasErrors ? (
                      <div className="flex items-center gap-1.5">
                        <XCircle
                          size={16}
                          weight="fill"
                          className="shrink-0 text-[var(--foreground-error)]"
                        />
                        <span className="text-caption text-[var(--foreground-error)]">
                          {row.errors.map((e) => e.message).join("; ")}
                        </span>
                      </div>
                    ) : (
                      <CheckCircle
                        size={16}
                        weight="fill"
                        className="text-[var(--foreground-success)]"
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </ModalBody>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Results
// ---------------------------------------------------------------------------

function StepResults({ createdCount }: { createdCount: number }) {
  return (
    <ModalBody className="items-center justify-center py-12">
      <CheckCircle size={48} weight="fill" className="text-[var(--foreground-success)]" />
      <h2 className="text-heading-sm font-semibold text-[var(--foreground-default)]">
        Successfully imported {createdCount} role{createdCount !== 1 ? "s" : ""}
      </h2>
      <p className="max-w-sm text-center text-body-sm text-[var(--foreground-muted)]">
        All roles have been created as drafts. You can edit and publish them from the Roles page.
      </p>
    </ModalBody>
  );
}

// ---------------------------------------------------------------------------
// Main Modal Component
// ---------------------------------------------------------------------------

export function BulkRoleImportModal({
  open,
  onOpenChange,
  onImportComplete,
}: BulkRoleImportModalProps) {
  const [step, setStep] = useState<ImportStep>("upload");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [unmappedHeaders, setUnmappedHeaders] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ created: number } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Reset all state when the modal closes
  useEffect(() => {
    if (!open) {
      setStep("upload");
      setParsedRows([]);
      setUnmappedHeaders([]);
      setIsImporting(false);
      setImportResult(null);
      setImportError(null);
    }
  }, [open]);

  // ----------------------------------
  // Step 1 handler: parse the file
  // ----------------------------------
  const handleFileSelected = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const { rows, unmappedHeaders: unmapped } = parseRolesFromCSV(text);
      setParsedRows(rows);
      setUnmappedHeaders(unmapped);
      setStep("review");
    };
    reader.readAsText(file);
  }, []);

  // ----------------------------------
  // Step 2 handler: import valid rows
  // ----------------------------------
  const validRows = parsedRows.filter((r) => r.errors.length === 0);
  const invalidCount = parsedRows.length - validRows.length;

  const handleImport = useCallback(async () => {
    if (validRows.length === 0) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const res = await fetch("/api/canopy/roles/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: validRows.map((r) => r.data) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Import failed. Please try again.");
      }

      const data = await res.json();
      setImportResult({ created: data.created ?? validRows.length });
      setStep("results");
    } catch (err) {
      logger.error("Bulk role import failed", { error: formatError(err) });
      setImportError(err instanceof Error ? err.message : "Import failed. Please try again.");
    } finally {
      setIsImporting(false);
    }
  }, [validRows]);

  // ----------------------------------
  // Step 3 handler: done
  // ----------------------------------
  const handleDone = useCallback(() => {
    onOpenChange(false);
    onImportComplete?.();
  }, [onOpenChange, onImportComplete]);

  // ----------------------------------
  // Determine modal size based on step
  // ----------------------------------
  const modalSize = step === "review" ? "xl" : "default";

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size={modalSize}>
        {/* ----------------------------------------------------------------
            Header
            ---------------------------------------------------------------- */}
        <ModalHeader
          icon={<UploadSimple size={24} weight="regular" />}
          iconBg="bg-[var(--background-brand-subtle)]"
        >
          <ModalTitle>
            {step === "upload" && "Import Roles from CSV"}
            {step === "review" && "Review Import"}
            {step === "results" && "Import Complete"}
          </ModalTitle>
        </ModalHeader>

        {/* ----------------------------------------------------------------
            Body — step-specific content
            ---------------------------------------------------------------- */}
        {step === "upload" && <StepUpload onFileSelected={handleFileSelected} />}

        {step === "review" && (
          <>
            <StepReview parsedRows={parsedRows} unmappedHeaders={unmappedHeaders} />

            {/* Import error banner */}
            {importError && (
              <div className="px-8 pb-2">
                <Banner
                  type="critical"
                  subtle
                  dismissible={false}
                  title="Import failed"
                  description={importError}
                />
              </div>
            )}
          </>
        )}

        {step === "results" && importResult && <StepResults createdCount={importResult.created} />}

        {/* ----------------------------------------------------------------
            Footer
            ---------------------------------------------------------------- */}
        <ModalFooter>
          {/* Step 1: Upload — cancel only */}
          {step === "upload" && (
            <Button variant="tertiary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}

          {/* Step 2: Review — back + import */}
          {step === "review" && (
            <>
              {invalidCount > 0 && (
                <p className="mr-auto text-caption text-[var(--foreground-muted)]">
                  Invalid rows will be skipped
                </p>
              )}
              <Button variant="tertiary" onClick={() => setStep("upload")} disabled={isImporting}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={validRows.length === 0 || isImporting}>
                {isImporting ? (
                  <>
                    <Spinner size="sm" variant="current" />
                    Importing...
                  </>
                ) : (
                  `Import ${validRows.length} Role${validRows.length !== 1 ? "s" : ""}`
                )}
              </Button>
            </>
          )}

          {/* Step 3: Results — done */}
          {step === "results" && <Button onClick={handleDone}>Done</Button>}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

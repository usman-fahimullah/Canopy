"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/modal";
import {
  Upload,
  FilePdf,
  FileDoc,
  File,
  ArrowSquareOut,
  DownloadSimple,
} from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DocumentsFile {
  name: string;
  url: string;
  type: "pdf" | "doc" | "other";
}

interface DocumentsSectionProps {
  files: DocumentsFile[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function FileIcon({ type }: { type: DocumentsFile["type"] }) {
  switch (type) {
    case "pdf":
      return (
        <FilePdf
          size={24}
          weight="regular"
          className="shrink-0 text-[var(--foreground-error)]"
          aria-hidden="true"
        />
      );
    case "doc":
      return (
        <FileDoc
          size={24}
          weight="regular"
          className="shrink-0 text-[var(--primitive-blue-500)]"
          aria-hidden="true"
        />
      );
    default:
      return (
        <File
          size={24}
          weight="regular"
          className="shrink-0 text-[var(--foreground-muted)]"
          aria-hidden="true"
        />
      );
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DocumentsSection({ files }: DocumentsSectionProps) {
  const [viewingFile, setViewingFile] = React.useState<DocumentsFile | null>(null);

  function handleDownload(file: DocumentsFile) {
    const anchor = document.createElement("a");
    anchor.href = file.url;
    anchor.download = file.name;
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  return (
    <section aria-labelledby="documents-heading">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="documents-heading"
          className="text-heading-sm font-medium text-[var(--foreground-default)]"
        >
          Documents
        </h2>
        <Button variant="tertiary" size="sm" leftIcon={<Upload size={16} weight="bold" />}>
          Upload files
        </Button>
      </div>

      {/* File list card */}
      {files.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-background)] px-6 py-8 text-center">
          <p className="text-caption text-[var(--foreground-subtle)]">No documents uploaded</p>
        </div>
      ) : (
        <div className="overflow-clip rounded-[var(--radius-card)] border border-[var(--card-border)] bg-[var(--card-background)]">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.url}`}
              className={`flex items-center justify-between px-6 py-4 ${
                index < files.length - 1 ? "border-b border-[var(--border-muted)]" : ""
              }`}
            >
              {/* Left: icon + filename */}
              <div className="flex min-w-0 items-center gap-3">
                <FileIcon type={file.type} />
                <span className="truncate text-body-strong text-[var(--foreground-default)]">
                  {file.name}
                </span>
              </div>

              {/* Right: action buttons */}
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Preview ${file.name}`}
                  onClick={() => setViewingFile(file)}
                >
                  <ArrowSquareOut size={20} weight="regular" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={`Download ${file.name}`}
                  onClick={() => handleDownload(file)}
                >
                  <DownloadSimple size={20} weight="regular" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF viewer modal */}
      <Modal
        open={!!viewingFile}
        onOpenChange={(open) => {
          if (!open) setViewingFile(null);
        }}
      >
        <ModalContent size="xl">
          <ModalHeader>
            <ModalTitle>{viewingFile?.name ?? "Document"}</ModalTitle>
          </ModalHeader>
          <ModalBody className="p-0">
            <div className="h-[70vh] w-full">
              <iframe
                src={viewingFile?.url}
                title={viewingFile?.name ?? "Document preview"}
                className="h-full w-full border-0"
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </section>
  );
}

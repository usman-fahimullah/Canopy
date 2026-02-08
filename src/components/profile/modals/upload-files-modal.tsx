"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { CheckCircle, File, Trash } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface UploadFilesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeUrl: string | null;
  coverLetterUrl: string | null;
  onUpload: (file: File, type: "resume" | "cover_letter") => void;
  loading?: boolean;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

export function UploadFilesModal({
  open,
  onOpenChange,
  resumeUrl,
  coverLetterUrl,
  onUpload,
  loading,
}: UploadFilesModalProps) {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (resumeFile) onUpload(resumeFile, "resume");
    if (coverLetterFile) onUpload(coverLetterFile, "cover_letter");
    if (!resumeFile && !coverLetterFile) onOpenChange(false);
  };

  const hasChanges = !!resumeFile || !!coverLetterFile;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Upload your files</ModalTitle>
          <ModalDescription>
            Add your resume and cover letter to your profile to share with employers.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}

          {/* Resume section */}
          <div className="space-y-2">
            <Label>Resume</Label>
            {resumeFile ? (
              <SelectedFileCard
                name={resumeFile.name}
                size={resumeFile.size}
                onRemove={() => setResumeFile(null)}
              />
            ) : resumeUrl ? (
              <ExistingFileCard name="Resume.pdf" onReplace={(file) => setResumeFile(file)} />
            ) : (
              <FileUpload
                accept=".pdf"
                maxSize={MAX_FILE_SIZE}
                size="sm"
                onChange={(files) => {
                  if (files[0]) setResumeFile(files[0]);
                }}
                onError={(msg) => setError(msg)}
              >
                <div className="text-center">
                  <p className="text-caption-strong text-[var(--foreground-default)]">
                    Drop your resume here or click to browse
                  </p>
                  <p className="mt-1 text-caption-sm text-[var(--foreground-subtle)]">
                    PDF only. Max 1MB.
                  </p>
                </div>
              </FileUpload>
            )}
          </div>

          {/* Cover Letter section */}
          <div className="space-y-2">
            <Label>Cover Letter</Label>
            {coverLetterFile ? (
              <SelectedFileCard
                name={coverLetterFile.name}
                size={coverLetterFile.size}
                onRemove={() => setCoverLetterFile(null)}
              />
            ) : coverLetterUrl ? (
              <ExistingFileCard
                name="Cover_Letter.pdf"
                onReplace={(file) => setCoverLetterFile(file)}
              />
            ) : (
              <FileUpload
                accept=".pdf"
                maxSize={MAX_FILE_SIZE}
                size="sm"
                onChange={(files) => {
                  if (files[0]) setCoverLetterFile(files[0]);
                }}
                onError={(msg) => setError(msg)}
              >
                <div className="text-center">
                  <p className="text-caption-strong text-[var(--foreground-default)]">
                    Drop your cover letter here or click to browse
                  </p>
                  <p className="mt-1 text-caption-sm text-[var(--foreground-subtle)]">
                    PDF only. Max 1MB.
                  </p>
                </div>
              </FileUpload>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading} disabled={!hasChanges}>
            Save to Profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/** Card showing a newly-selected file with a remove button */
function SelectedFileCard({
  name,
  size,
  onRemove,
}: {
  name: string;
  size: number;
  onRemove: () => void;
}) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        "border-[var(--border-success)] bg-[var(--background-success)]"
      )}
    >
      <File size={20} weight="fill" className="shrink-0 text-[var(--foreground-success)]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-caption-strong text-[var(--foreground-default)]">{name}</p>
        <p className="text-caption-sm text-[var(--foreground-muted)]">{formatSize(size)}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-md p-1 transition-colors hover:bg-[var(--background-interactive-hover)]"
        aria-label="Remove file"
      >
        <Trash size={16} className="text-[var(--foreground-muted)]" />
      </button>
    </div>
  );
}

/** Card showing an already-uploaded file with an option to replace */
function ExistingFileCard({ name, onReplace }: { name: string; onReplace: (file: File) => void }) {
  const handleReplace = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onReplace(file);
    };
    input.click();
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        "border-[var(--border-default)] bg-[var(--background-subtle)]"
      )}
    >
      <CheckCircle size={20} weight="fill" className="shrink-0 text-[var(--foreground-success)]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-caption-strong text-[var(--foreground-default)]">{name}</p>
        <p className="text-caption-sm text-[var(--foreground-muted)]">Uploaded</p>
      </div>
      <Button variant="ghost" size="sm" onClick={handleReplace}>
        Replace
      </Button>
    </div>
  );
}

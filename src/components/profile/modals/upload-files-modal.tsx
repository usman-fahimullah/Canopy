"use client";

import { useRef, useState } from "react";
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
import { UploadSimple } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";

interface UploadFilesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeUrl: string | null;
  coverLetterUrl: string | null;
  onUpload: (file: File, type: "resume" | "cover_letter") => void;
  loading?: boolean;
}

export function UploadFilesModal({
  open,
  onOpenChange,
  resumeUrl,
  coverLetterUrl,
  onUpload,
  loading,
}: UploadFilesModalProps) {
  const resumeRef = useRef<HTMLInputElement>(null);
  const coverLetterRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "cover_letter"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "resume") setResumeFile(file);
    else setCoverLetterFile(file);
  };

  const handleSave = () => {
    if (resumeFile) onUpload(resumeFile, "resume");
    if (coverLetterFile) onUpload(coverLetterFile, "cover_letter");
    if (!resumeFile && !coverLetterFile) onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Upload your files</ModalTitle>
          <ModalDescription>
            Add your resume and cover letter to your profile. Max File Size: 1MB. File type: .PDF
            only.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="space-y-6">
          {/* Resume */}
          <div>
            <h3 className="mb-2 text-body-strong text-[var(--foreground-default)]">Resume</h3>
            <Separator className="mb-3" />
            <div className="flex items-center justify-between">
              <p className="text-body text-[var(--foreground-muted)]">
                {resumeFile?.name ?? (resumeUrl ? "Resume uploaded" : "None Uploaded")}
              </p>
              <Button
                variant="outline"
                leftIcon={<UploadSimple size={16} />}
                onClick={() => resumeRef.current?.click()}
              >
                Upload File
              </Button>
              <input
                ref={resumeRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "resume")}
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <h3 className="mb-2 text-body-strong text-[var(--foreground-default)]">Cover Letter</h3>
            <Separator className="mb-3" />
            <div className="flex items-center justify-between">
              <p className="text-body text-[var(--foreground-muted)]">
                {coverLetterFile?.name ??
                  (coverLetterUrl ? "Cover letter uploaded" : "None Uploaded")}
              </p>
              <Button
                variant="outline"
                leftIcon={<UploadSimple size={16} />}
                onClick={() => coverLetterRef.current?.click()}
              >
                Upload File
              </Button>
              <input
                ref={coverLetterRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "cover_letter")}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save to Profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

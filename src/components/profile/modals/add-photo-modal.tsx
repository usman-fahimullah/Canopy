"use client";

import { useState, useRef } from "react";
import Image from "next/image";
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
import { Camera } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface AddPhotoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (file: File) => void;
  loading?: boolean;
}

export function AddPhotoModal({ open, onOpenChange, onSave, loading }: AddPhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  };

  const handleSave = () => {
    if (file) onSave(file);
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setPreview(null);
      setFile(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add your photo</ModalTitle>
          <ModalDescription>
            Add your profile photo to help others recognize you! Take or upload a photo of yourself.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="mb-4 text-caption text-[var(--foreground-muted)]">
            Max file size is 2MB. File types supported (.PNG and .JPG)
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex h-40 w-40 items-center justify-center rounded-full",
                "border-2 border-dashed border-[var(--border-muted)]",
                "bg-[var(--background-subtle)]",
                "transition-colors hover:border-[var(--border-default)]",
                "overflow-hidden"
              )}
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={160}
                  height={160}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Camera size={48} className="text-[var(--foreground-muted)]" />
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading} disabled={!file}>
            Save profile photo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

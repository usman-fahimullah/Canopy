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
import { CheckCircle, UploadSimple, Image as ImageIcon, Trash } from "@phosphor-icons/react";
import { COVER_PRESETS, type CoverPresetId } from "@/lib/profile/cover-presets";
import { cn } from "@/lib/utils";

type CoverSelection =
  | { type: "preset"; id: CoverPresetId }
  | { type: "custom"; url: string; file?: File };

interface ChangeCoverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCoverId: CoverPresetId | null;
  currentCustomUrl?: string | null;
  onSave: (coverId: CoverPresetId | null, customFile?: File) => void;
  loading?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ChangeCoverModal({
  open,
  onOpenChange,
  currentCoverId,
  currentCustomUrl,
  onSave,
  loading,
}: ChangeCoverModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Determine initial selection
  const getInitialSelection = (): CoverSelection => {
    if (currentCustomUrl) {
      return { type: "custom", url: currentCustomUrl };
    }
    return { type: "preset", id: currentCoverId ?? COVER_PRESETS[0].id };
  };

  const [selection, setSelection] = useState<CoverSelection>(getInitialSelection);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be 5MB or less.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelection({ type: "custom", url: previewUrl, file });
  };

  const handleRemoveCustom = () => {
    setSelection({ type: "preset", id: currentCoverId ?? COVER_PRESETS[0].id });
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (selection.type === "preset") {
      onSave(selection.id);
    } else if (selection.file) {
      // New upload
      onSave(null, selection.file);
    } else {
      // Existing custom URL, no change needed — just keep it
      onSave(null);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Change Cover Image</ModalTitle>
          <ModalDescription>
            Choose from our presets or upload your own banner image.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          {/* Upload your own section */}
          <div className="mb-6">
            <h4 className="mb-3 flex items-center gap-2 text-caption-strong text-[var(--foreground-default)]">
              <UploadSimple size={16} weight="bold" />
              Upload Your Own
            </h4>

            {selection.type === "custom" ? (
              <div className="relative">
                <div
                  className={cn(
                    "relative aspect-[3/1] w-full overflow-hidden rounded-lg border-2 border-[var(--primitive-blue-500)]"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selection.url}
                    alt="Custom cover preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-2 top-2">
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-[var(--primitive-blue-500)]"
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon size={16} weight="bold" className="mr-1.5" />
                    Replace
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCustom}
                    className="text-[var(--foreground-error)]"
                  >
                    <Trash size={16} weight="bold" className="mr-1.5" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed",
                  "border-[var(--border-default)] bg-[var(--background-subtle)]",
                  "px-6 py-8 transition-colors",
                  "hover:border-[var(--border-emphasis)] hover:bg-[var(--background-muted)]"
                )}
              >
                <UploadSimple size={24} weight="bold" className="text-[var(--foreground-subtle)]" />
                <div className="text-left">
                  <p className="text-caption-strong text-[var(--foreground-default)]">
                    Click to upload a banner image
                  </p>
                  <p className="text-caption-sm text-[var(--foreground-subtle)]">
                    JPEG, PNG or WebP. Max 5MB. Recommended 1500x500px.
                  </p>
                </div>
              </button>
            )}

            {fileError && (
              <p className="mt-2 text-caption text-[var(--foreground-error)]">{fileError}</p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Presets section */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-caption-strong text-[var(--foreground-default)]">
              <ImageIcon size={16} weight="bold" />
              Choose a Preset
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COVER_PRESETS.map((preset) => {
                const isSelected = selection.type === "preset" && selection.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelection({ type: "preset", id: preset.id })}
                    className={cn(
                      "relative aspect-[16/9] overflow-hidden rounded-lg border-2 transition-colors",
                      isSelected
                        ? "border-[var(--primitive-blue-500)]"
                        : "border-transparent hover:border-[var(--border-muted)]"
                    )}
                  >
                    <Image
                      src={preset.src}
                      alt={preset.alt}
                      width={300}
                      height={169}
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5">
                        <CheckCircle
                          size={20}
                          weight="fill"
                          className="text-[var(--primitive-blue-500)]"
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save Background
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

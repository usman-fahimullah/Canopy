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
import {
  AVATAR_PRESETS,
  getAvatarPresetFromSrc,
  isCustomAvatarUrl,
} from "@/lib/profile/avatar-presets";
import { cn } from "@/lib/utils";

type AvatarSelection =
  | { type: "preset"; src: string }
  | { type: "custom"; url: string; file?: File };

interface ChangeAvatarModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar: string | null;
  onSave: (presetSrc: string | null, customFile?: File) => void;
  loading?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ChangeAvatarModal({
  open,
  onOpenChange,
  currentAvatar,
  onSave,
  loading,
}: ChangeAvatarModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const getInitialSelection = (): AvatarSelection => {
    if (isCustomAvatarUrl(currentAvatar)) {
      return { type: "custom", url: currentAvatar! };
    }
    // Check if it's a known preset
    const presetId = getAvatarPresetFromSrc(currentAvatar);
    if (presetId) {
      return { type: "preset", src: currentAvatar! };
    }
    // Default to first preset
    return { type: "preset", src: AVATAR_PRESETS[0].src };
  };

  const [selection, setSelection] = useState<AvatarSelection>(getInitialSelection);

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
    const presetId = getAvatarPresetFromSrc(currentAvatar);
    setSelection({
      type: "preset",
      src: presetId ? currentAvatar! : AVATAR_PRESETS[0].src,
    });
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (selection.type === "preset") {
      onSave(selection.src);
    } else if (selection.file) {
      // New custom upload
      onSave(null, selection.file);
    } else {
      // Existing custom URL, no change
      onSave(null);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Change Profile Picture</ModalTitle>
          <ModalDescription>Choose a character or upload your own photo.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          {/* Upload your own section */}
          <div className="mb-6">
            <h4 className="mb-3 flex items-center gap-2 text-caption-strong text-[var(--foreground-default)]">
              <UploadSimple size={16} weight="bold" />
              Upload Your Own
            </h4>

            {selection.type === "custom" ? (
              <div className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "relative h-32 w-32 overflow-hidden rounded-full border-2 border-[var(--primitive-blue-500)]"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selection.url}
                    alt="Custom avatar preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-1 top-1">
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-[var(--primitive-blue-500)]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
                  "px-6 py-6 transition-colors",
                  "hover:border-[var(--border-emphasis)] hover:bg-[var(--background-muted)]"
                )}
              >
                <UploadSimple size={24} weight="bold" className="text-[var(--foreground-subtle)]" />
                <div className="text-left">
                  <p className="text-caption-strong text-[var(--foreground-default)]">
                    Click to upload a photo
                  </p>
                  <p className="text-caption-sm text-[var(--foreground-subtle)]">
                    JPEG, PNG or WebP. Max 5MB.
                  </p>
                </div>
              </button>
            )}

            {fileError && (
              <p className="mt-2 text-center text-caption text-[var(--foreground-error)]">
                {fileError}
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Preset avatars section */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-caption-strong text-[var(--foreground-default)]">
              <ImageIcon size={16} weight="bold" />
              Choose a Character
            </h4>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-7">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selection.type === "preset" && selection.src === preset.src;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelection({ type: "preset", src: preset.src })}
                    className={cn(
                      "group relative aspect-square overflow-hidden rounded-full border-2 transition-all",
                      isSelected
                        ? "ring-[var(--primitive-blue-500)]/30 border-[var(--primitive-blue-500)] ring-2"
                        : "border-transparent hover:border-[var(--border-muted)]"
                    )}
                    aria-label={preset.alt}
                  >
                    <Image
                      src={preset.src}
                      alt={preset.alt}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute right-0 top-0">
                        <CheckCircle
                          size={18}
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
            Save Profile Picture
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

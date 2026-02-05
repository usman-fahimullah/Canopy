"use client";

import { useState } from "react";
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
import { CheckCircle } from "@phosphor-icons/react";
import { COVER_PRESETS, type CoverPresetId } from "@/lib/profile/cover-presets";
import { cn } from "@/lib/utils";

interface ChangeCoverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCoverId: CoverPresetId | null;
  onSave: (coverId: CoverPresetId) => void;
  loading?: boolean;
}

export function ChangeCoverModal({
  open,
  onOpenChange,
  currentCoverId,
  onSave,
  loading,
}: ChangeCoverModalProps) {
  const [selected, setSelected] = useState<CoverPresetId>(currentCoverId ?? COVER_PRESETS[0].id);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Change Cover Image</ModalTitle>
          <ModalDescription>
            Express yourself with a cover image that describes your personality best! We have 6
            styles available with more coming soon!
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-4">
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelected(preset.id)}
                className={cn(
                  "relative aspect-[16/9] overflow-hidden rounded-lg border-2 transition-colors",
                  selected === preset.id
                    ? "border-[var(--primitive-blue-500)]"
                    : "border-transparent hover:border-[var(--border-muted)]"
                )}
              >
                <Image src={preset.src} alt={preset.alt} fill className="object-cover" />
                {selected === preset.id && (
                  <div className="absolute right-2 top-2">
                    <CheckCircle
                      size={24}
                      weight="fill"
                      className="text-[var(--primitive-blue-500)]"
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(selected)} loading={loading}>
            Save Background
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

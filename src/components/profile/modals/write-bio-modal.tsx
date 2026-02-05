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
import { Textarea } from "@/components/ui/textarea";
import { CharacterCounter } from "@/components/ui/character-counter";

interface WriteBioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBio: string | null;
  onSave: (bio: string) => void;
  loading?: boolean;
}

const MAX_BIO_LENGTH = 250;

export function WriteBioModal({
  open,
  onOpenChange,
  currentBio,
  onSave,
  loading,
}: WriteBioModalProps) {
  const [bio, setBio] = useState(currentBio ?? "");

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Write Your Bio</ModalTitle>
          <ModalDescription>
            Write about your years of experience, industry, achievements or skills within the
            climate space. This space is dedicated for you to tell everyone your story.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            <label className="text-caption text-[var(--foreground-muted)]">
              Write your bio here
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, MAX_BIO_LENGTH))}
              placeholder="Write your bio here"
              rows={5}
            />
            <div className="flex justify-end">
              <CharacterCounter current={bio.length} max={MAX_BIO_LENGTH} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(bio)} loading={loading}>
            Save Your Summary
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

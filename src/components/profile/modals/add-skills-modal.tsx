"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";

interface AddSkillsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSkills: string[];
  onSave: (skills: string[]) => void;
  loading?: boolean;
}

export function AddSkillsModal({
  open,
  onOpenChange,
  currentSkills,
  onSave,
  loading,
}: AddSkillsModalProps) {
  const [skills, setSkills] = useState<string[]>(currentSkills);
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add skills</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
              Write a skill
            </label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a skill"
            />
            <InputMessage status="info">
              Type in a skill and press enter and we&apos;ll add it below!
            </InputMessage>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Chip key={skill} variant="neutral" removable onRemove={() => removeSkill(skill)}>
                  {skill}
                </Chip>
              ))}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(skills)} loading={loading}>
            Add Skill
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

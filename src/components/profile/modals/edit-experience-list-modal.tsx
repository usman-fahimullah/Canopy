"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { PencilSimple, Trash, Plus } from "@phosphor-icons/react";

interface ExperienceItem {
  id: string;
  companyName: string;
  jobTitle: string;
  employmentType?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
}

interface EditExperienceListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experiences: ExperienceItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function formatDateRange(start: string, end: string | null | undefined, isCurrent?: boolean) {
  const startYear = new Date(start).getFullYear();
  if (isCurrent) return "Current Role";
  if (!end) return `${startYear}`;
  const endYear = new Date(end).getFullYear();
  return `${startYear} - ${endYear}`;
}

export function EditExperienceListModal({
  open,
  onOpenChange,
  experiences,
  onEdit,
  onDelete,
  onAdd,
}: EditExperienceListModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit your experience</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="divide-y divide-[var(--border-muted)]">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex items-center gap-4 py-4">
                <Avatar name={exp.companyName} shape="square" size="default" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium text-[var(--foreground-default)]">
                    {exp.jobTitle}
                  </p>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    {exp.companyName}
                    {exp.employmentType && ` · ${exp.employmentType}`}
                  </p>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(exp.id)}
                    aria-label={`Edit ${exp.jobTitle}`}
                  >
                    <PencilSimple size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onDelete(exp.id)}
                    aria-label={`Delete ${exp.jobTitle}`}
                    className="text-[var(--foreground-error)]"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" leftIcon={<Plus size={16} weight="bold" />} onClick={onAdd}>
            Add Experiences
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

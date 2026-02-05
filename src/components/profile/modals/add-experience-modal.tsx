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
import { Input } from "@/components/ui/input";
import { SwitchWithLabel } from "@/components/ui/switch";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui";

interface ExperienceFormData {
  jobTitle: string;
  companyName: string;
  employmentType: string;
  isCurrent: boolean;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
}

interface AddExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ExperienceFormData) => void;
  loading?: boolean;
  initialData?: Partial<ExperienceFormData>;
  mode?: "add" | "edit";
  onDelete?: () => void;
}

const EMPLOYMENT_TYPES = ["Full Time", "Part Time", "Contract", "Internship"];

export function AddExperienceModal({
  open,
  onOpenChange,
  onSave,
  loading,
  initialData,
  mode = "add",
  onDelete,
}: AddExperienceModalProps) {
  const [form, setForm] = useState<ExperienceFormData>({
    jobTitle: initialData?.jobTitle ?? "",
    companyName: initialData?.companyName ?? "",
    employmentType: initialData?.employmentType ?? "",
    isCurrent: initialData?.isCurrent ?? false,
    startMonth: initialData?.startMonth ?? "",
    startYear: initialData?.startYear ?? "",
    endMonth: initialData?.endMonth ?? "",
    endYear: initialData?.endYear ?? "",
  });

  const update = (field: keyof ExperienceFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <div className="flex items-center justify-between">
            <ModalTitle>
              {mode === "edit" ? "Edit your experience" : "Add your experience"}
            </ModalTitle>
            {mode === "edit" && onDelete && (
              <Button variant="ghost" onClick={onDelete} className="text-[var(--foreground-error)]">
                Remove
              </Button>
            )}
          </div>
        </ModalHeader>
        <ModalBody className="space-y-4">
          <div>
            <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
              Position Title
            </label>
            <Input
              value={form.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
              placeholder="Position Title"
            />
          </div>

          <div>
            <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
              Company Name
            </label>
            <Input
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Company Name"
            />
          </div>

          <div>
            <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
              Employment Type
            </label>
            <Dropdown
              value={form.employmentType}
              onValueChange={(v) => update("employmentType", v)}
            >
              <DropdownTrigger>
                <DropdownValue placeholder="Select employment type" />
              </DropdownTrigger>
              <DropdownContent>
                {EMPLOYMENT_TYPES.map((type) => (
                  <DropdownItem key={type} value={type}>
                    {type}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>

          <SwitchWithLabel
            label="Current role"
            checked={form.isCurrent}
            onCheckedChange={(checked) => update("isCurrent", checked)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                Start Month
              </label>
              <Input
                value={form.startMonth}
                onChange={(e) => update("startMonth", e.target.value)}
                placeholder="Month"
              />
            </div>
            <div>
              <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                Start Year
              </label>
              <Input
                value={form.startYear}
                onChange={(e) => update("startYear", e.target.value)}
                placeholder="Year"
              />
            </div>
          </div>

          {!form.isCurrent && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  End Month
                </label>
                <Input
                  value={form.endMonth}
                  onChange={(e) => update("endMonth", e.target.value)}
                  placeholder="Month"
                />
              </div>
              <div>
                <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                  End Year
                </label>
                <Input
                  value={form.endYear}
                  onChange={(e) => update("endYear", e.target.value)}
                  placeholder="Year"
                />
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onSave(form)}
            loading={loading}
            disabled={!form.jobTitle || !form.companyName}
          >
            {mode === "edit" ? "Update Position" : "Save Position"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

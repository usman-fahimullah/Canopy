"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { SwitchWithLabel } from "@/components/ui/switch";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui";
import { Trash } from "@phosphor-icons/react";

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

const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear; y >= currentYear - 50; y--) {
    years.push(String(y));
  }
  return years;
}

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

  // Reset form when initialData changes (e.g., switching between add/edit)
  useEffect(() => {
    if (open) {
      setForm({
        jobTitle: initialData?.jobTitle ?? "",
        companyName: initialData?.companyName ?? "",
        employmentType: initialData?.employmentType ?? "",
        isCurrent: initialData?.isCurrent ?? false,
        startMonth: initialData?.startMonth ?? "",
        startYear: initialData?.startYear ?? "",
        endMonth: initialData?.endMonth ?? "",
        endYear: initialData?.endYear ?? "",
      });
    }
  }, [open, initialData]);

  const update = (field: keyof ExperienceFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const years = getYearOptions();
  const canSave =
    form.jobTitle.trim() && form.companyName.trim() && form.startMonth && form.startYear;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {mode === "edit" ? "Edit your experience" : "Add your experience"}
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="exp-title" required>
              Position Title
            </Label>
            <Input
              id="exp-title"
              value={form.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
              placeholder="e.g. Sustainability Analyst"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="exp-company" required>
              Company Name
            </Label>
            <Input
              id="exp-company"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="e.g. Solaris Energy Co."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Employment Type</Label>
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
            label="I currently work here"
            checked={form.isCurrent}
            onCheckedChange={(checked) => update("isCurrent", checked)}
          />

          {/* Start date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label required>Start Month</Label>
              <Dropdown value={form.startMonth} onValueChange={(v) => update("startMonth", v)}>
                <DropdownTrigger>
                  <DropdownValue placeholder="Month" />
                </DropdownTrigger>
                <DropdownContent>
                  {MONTHS.map((m) => (
                    <DropdownItem key={m.value} value={m.value}>
                      {m.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>
            <div className="space-y-1.5">
              <Label required>Start Year</Label>
              <Dropdown value={form.startYear} onValueChange={(v) => update("startYear", v)}>
                <DropdownTrigger>
                  <DropdownValue placeholder="Year" />
                </DropdownTrigger>
                <DropdownContent>
                  {years.map((y) => (
                    <DropdownItem key={y} value={y}>
                      {y}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* End date — hidden when current role */}
          {!form.isCurrent && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>End Month</Label>
                <Dropdown value={form.endMonth} onValueChange={(v) => update("endMonth", v)}>
                  <DropdownTrigger>
                    <DropdownValue placeholder="Month" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {MONTHS.map((m) => (
                      <DropdownItem key={m.value} value={m.value}>
                        {m.label}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </div>
              <div className="space-y-1.5">
                <Label>End Year</Label>
                <Dropdown value={form.endYear} onValueChange={(v) => update("endYear", v)}>
                  <DropdownTrigger>
                    <DropdownValue placeholder="Year" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {years.map((y) => (
                      <DropdownItem key={y} value={y}>
                        {y}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          {mode === "edit" && onDelete ? (
            <Button
              variant="ghost"
              onClick={onDelete}
              className="mr-auto text-[var(--foreground-error)]"
            >
              <Trash size={16} weight="bold" className="mr-1.5" />
              Remove
            </Button>
          ) : null}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onSave(form)}
            loading={loading}
            disabled={!canSave}
          >
            {mode === "edit" ? "Update Position" : "Save Position"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

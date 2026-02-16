"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { BriefcaseMetal, MapPin } from "@phosphor-icons/react";
import { useCreateRoleMutation } from "@/hooks/queries";
import { DepartmentPicker } from "@/components/departments/DepartmentPicker";
import { toast } from "sonner";

// ============================================
// CONSTANTS
// ============================================

const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

// ============================================
// TYPES
// ============================================

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ============================================
// COMPONENT
// ============================================

export function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
  const router = useRouter();
  const createRole = useCreateRoleMutation();

  const [title, setTitle] = React.useState("");
  const [employmentType, setEmploymentType] = React.useState("");
  const [departmentId, setDepartmentId] = React.useState<string | null>(null);
  const [workplaceType, setWorkplaceType] = React.useState("onsite");
  const [city, setCity] = React.useState("");

  const handleCreate = async () => {
    try {
      const employmentTypeMap: Record<string, string> = {
        "full-time": "FULL_TIME",
        "part-time": "PART_TIME",
        contract: "CONTRACT",
        internship: "INTERNSHIP",
      };

      const locationTypeMap: Record<string, string> = {
        onsite: "ONSITE",
        remote: "REMOTE",
        hybrid: "HYBRID",
      };

      const data = await createRole.mutateAsync({
        title: title || "Untitled Role",
        description: "",
        employmentType: employmentTypeMap[employmentType] || undefined,
        locationType: locationTypeMap[workplaceType] || undefined,
        location: city || undefined,
        departmentId: departmentId || undefined,
      });

      onOpenChange(false);
      router.push(`/canopy/roles/${data.job.id}`);
    } catch {
      toast.error("Failed to create role");
    }
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setTitle("");
      setEmploymentType("");
      setDepartmentId(null);
      setWorkplaceType("onsite");
      setCity("");
    }
  }, [open]);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="default">
        <ModalHeader
          icon={<BriefcaseMetal weight="fill" className="h-6 w-6 text-[var(--foreground-brand)]" />}
          iconBg="bg-[var(--background-brand-subtle)]"
        >
          <ModalTitle>Create a New Role</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Job Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Solar Installation Manager"
                inputSize="lg"
                autoFocus
              />
            </div>

            {/* Employment Type + Department */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                  Employment Type
                </label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                  Department
                </label>
                <DepartmentPicker
                  value={departmentId}
                  onChange={setDepartmentId}
                  placeholder="Select department"
                />
              </div>
            </div>

            {/* Workplace Type */}
            <div className="flex flex-col gap-2">
              <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
                Workplace Type
              </label>
              <SegmentedController
                options={[
                  { value: "onsite", label: "Onsite" },
                  { value: "remote", label: "Remote" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
                value={workplaceType}
                onValueChange={setWorkplaceType}
              />
            </div>

            {/* Location */}
            {workplaceType !== "remote" && (
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-1.5 text-caption-strong font-medium text-[var(--foreground-default)]">
                  <MapPin weight="bold" className="h-4 w-4" />
                  Location
                </label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  inputSize="lg"
                />
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="tertiary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreate} disabled={createRole.isPending}>
            {createRole.isPending && <Spinner size="sm" variant="current" />}
            {createRole.isPending ? "Creating..." : "Create Role"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

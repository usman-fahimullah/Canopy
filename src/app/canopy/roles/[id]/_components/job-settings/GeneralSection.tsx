"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { SwitchWithLabel } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { Link as LinkIcon, Folder, Globe, MapPin } from "@phosphor-icons/react";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";
import type { JobData } from "../../_lib/types";
import type { JobPostState } from "../../_lib/use-role-form";

// ============================================
// TYPES
// ============================================

interface GeneralSectionProps {
  roleId: string;
  jobData: JobData;
  jobPostState: JobPostState;
  onJobDataChange: (updater: (prev: JobData) => JobData) => void;
}

// ============================================
// CONSTANTS
// ============================================

const employmentTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const departmentOptions = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "sustainability", label: "Sustainability" },
  { value: "other", label: "Other" },
];

// ============================================
// COMPONENT
// ============================================

export function GeneralSection({
  roleId,
  jobData,
  jobPostState,
  onJobDataChange,
}: GeneralSectionProps) {
  const [saving, setSaving] = React.useState(false);

  // Local state for fields that don't exist on jobPostState
  const [department, setDepartment] = React.useState<string>(
    ((jobData.formConfig as Record<string, unknown>)?.department as string) ?? ""
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/canopy/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: jobPostState.roleTitle || undefined,
          employmentType: jobPostState.positionType
            ? jobPostState.positionType.toUpperCase().replace(/-/g, "_")
            : undefined,
          location:
            [jobPostState.city, jobPostState.state, jobPostState.country]
              .filter(Boolean)
              .join(", ") || null,
          closesAt: jobPostState.closingDate ? jobPostState.closingDate.toISOString() : null,
          formConfig: {
            ...(jobData.formConfig as Record<string, unknown>),
            department,
            externalLink: jobPostState.externalLink,
            requiredFiles: {
              resume: jobPostState.requireResume,
              coverLetter: jobPostState.requireCoverLetter,
              portfolio: jobPostState.requirePortfolio,
            },
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      onJobDataChange((prev) => ({
        ...prev,
        title: jobPostState.roleTitle || prev.title,
        closesAt: jobPostState.closingDate ? jobPostState.closingDate.toISOString() : null,
      }));

      toast.success("General settings saved");
    } catch (error) {
      logger.error("Failed to save general settings", { error: formatError(error) });
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">General</h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Basic information about this role
        </p>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Job Title
        </label>
        <Input
          value={jobPostState.roleTitle}
          onChange={(e) => jobPostState.setRoleTitle(e.target.value)}
          placeholder="e.g. Solar Installation Manager"
          inputSize="lg"
        />
      </div>

      {/* Employment Type + Department (two columns) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
            Employment Type
          </label>
          <Select value={jobPostState.positionType} onValueChange={jobPostState.setPositionType}>
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
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departmentOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-caption-strong font-medium text-[var(--foreground-default)]">
          <MapPin weight="bold" className="h-4 w-4" />
          Location
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Input
            value={jobPostState.city}
            onChange={(e) => jobPostState.setCity(e.target.value)}
            placeholder="City"
            inputSize="lg"
          />
          <Input
            value={jobPostState.state}
            onChange={(e) => jobPostState.setState(e.target.value)}
            placeholder="State"
            inputSize="lg"
          />
          <Input
            value={jobPostState.country}
            onChange={(e) => jobPostState.setCountry(e.target.value)}
            placeholder="Country"
            inputSize="lg"
          />
        </div>
      </div>

      {/* URL Slug (read-only) */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-1.5 text-caption-strong font-medium text-[var(--foreground-default)]">
          <Globe weight="bold" className="h-4 w-4" />
          URL Slug
        </label>
        <Input
          value={jobData.slug}
          readOnly
          inputSize="lg"
          className="bg-[var(--background-muted)] text-[var(--foreground-subtle)]"
        />
      </div>

      {/* Closing Date */}
      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          Closing Date
        </label>
        <DatePicker
          value={jobPostState.closingDate}
          onChange={jobPostState.setClosingDate}
          placeholder="Select closing date"
          showPresets={false}
        />
      </div>

      {/* External Link */}
      <div className="flex flex-col gap-2">
        <label className="text-caption-strong font-medium text-[var(--foreground-default)]">
          External Application Link
        </label>
        <Input
          value={jobPostState.externalLink}
          onChange={(e) => jobPostState.setExternalLink(e.target.value)}
          placeholder="https://apply.example.com"
          inputSize="lg"
          leftAddon={<LinkIcon weight="bold" />}
        />
        <p className="text-caption-sm text-[var(--foreground-subtle)]">
          If set, applicants will be redirected to this URL instead of the built-in apply form.
        </p>
      </div>

      {/* Required Files */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-1.5 text-caption-strong font-medium text-[var(--foreground-default)]">
          <Folder weight="fill" className="h-4 w-4" />
          Required Files
        </label>
        <div className="flex flex-col gap-2.5">
          <SwitchWithLabel
            label="Resume"
            labelPosition="right"
            size="sm"
            checked={jobPostState.requireResume}
            onCheckedChange={jobPostState.setRequireResume}
          />
          <SwitchWithLabel
            label="Cover Letter"
            labelPosition="right"
            size="sm"
            checked={jobPostState.requireCoverLetter}
            onCheckedChange={jobPostState.setRequireCoverLetter}
          />
          <SwitchWithLabel
            label="Portfolio"
            labelPosition="right"
            size="sm"
            checked={jobPostState.requirePortfolio}
            onCheckedChange={jobPostState.setRequirePortfolio}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving && <Spinner size="sm" variant="current" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

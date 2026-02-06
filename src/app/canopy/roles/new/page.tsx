"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Banner } from "@/components/ui/banner";
import {
  FormCard,
  FormSection,
  FormField,
  FormTitleInput,
  FormRow,
} from "@/components/ui/form-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { DatePicker } from "@/components/ui/date-picker";
import { SwitchWithLabel } from "@/components/ui/switch";
import {
  RoleInformationSection,
  WorkplaceInformationSection,
  EducationRequirementsSection,
  CompensationBenefitsSection,
  type EducationLevel,
  type WorkplaceType,
  type WorkplaceLocation,
  type CompensationData,
} from "@/components/jobs";
import { ArrowLeft, FloppyDisk } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const jobCategories = [
  { value: "renewable-energy", label: "Renewable Energy" },
  { value: "sustainability", label: "Sustainability" },
  { value: "climate-tech", label: "Climate Tech" },
  { value: "conservation", label: "Conservation" },
  { value: "clean-transportation", label: "Clean Transportation" },
  { value: "circular-economy", label: "Circular Economy" },
  { value: "green-building", label: "Green Building" },
  { value: "environmental-policy", label: "Environmental Policy" },
  { value: "other", label: "Other" },
];

const positionTypes = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const experienceLevels = [
  { value: "ENTRY", label: "Entry Level" },
  { value: "INTERMEDIATE", label: "Mid Level" },
  { value: "SENIOR", label: "Senior Level" },
  { value: "EXECUTIVE", label: "Executive" },
];

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function CreateRolePage() {
  const router = useRouter();

  // Form state
  const [title, setTitle] = React.useState("");
  const [jobCategory, setJobCategory] = React.useState("");
  const [positionType, setPositionType] = React.useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = React.useState("");

  // Role information (rich text)
  const [roleDescription, setRoleDescription] = React.useState("");
  const [responsibilities, setResponsibilities] = React.useState("");
  const [requiredQualifications, setRequiredQualifications] = React.useState("");
  const [desiredQualifications, setDesiredQualifications] = React.useState("");

  // Education
  const [educationLevel, setEducationLevel] = React.useState<EducationLevel>();
  const [specificEducation, setSpecificEducation] = React.useState("");

  // Workplace
  const [workplaceType, setWorkplaceType] = React.useState<WorkplaceType>("onsite");
  const [location, setLocation] = React.useState<WorkplaceLocation>({});

  // Compensation
  const [compensation, setCompensation] = React.useState<CompensationData>({
    payFrequency: "weekly",
  });
  const [selectedBenefits, setSelectedBenefits] = React.useState<string[]>([]);
  const [useCompanyDefaults, setUseCompanyDefaults] = React.useState(true);
  const [additionalDetails, setAdditionalDetails] = React.useState("");

  // Settings
  const [closingDate, setClosingDate] = React.useState<Date | undefined>();
  const [externalLink, setExternalLink] = React.useState("");
  const [requireResume, setRequireResume] = React.useState(true);
  const [requireCoverLetter, setRequireCoverLetter] = React.useState(false);

  // Submission state
  const [saving, setSaving] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /* -------------------------------------------------------------------
     Build description from rich text sections
     ------------------------------------------------------------------- */
  function buildDescription(): string {
    const sections: string[] = [];
    if (roleDescription) sections.push(roleDescription);
    if (responsibilities) sections.push(`<h3>Responsibilities</h3>${responsibilities}`);
    if (requiredQualifications)
      sections.push(`<h3>Required Qualifications</h3>${requiredQualifications}`);
    if (desiredQualifications)
      sections.push(`<h3>Desired Qualifications</h3>${desiredQualifications}`);
    return sections.join("\n");
  }

  /* -------------------------------------------------------------------
     Map workplace type to DB enum
     ------------------------------------------------------------------- */
  function mapLocationType(wt: WorkplaceType): "ONSITE" | "REMOTE" | "HYBRID" {
    switch (wt) {
      case "onsite":
        return "ONSITE";
      case "remote":
        return "REMOTE";
      case "hybrid":
        return "HYBRID";
      default:
        return "ONSITE";
    }
  }

  /* -------------------------------------------------------------------
     Build location string
     ------------------------------------------------------------------- */
  function buildLocation(): string | null {
    const parts = [location.city, location.state, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
  }

  /* -------------------------------------------------------------------
     Save as Draft
     ------------------------------------------------------------------- */
  async function handleSaveDraft() {
    if (!title.trim()) {
      setError("Please enter a role title before saving.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: buildDescription(),
        location: buildLocation(),
        locationType: mapLocationType(workplaceType),
        employmentType: positionType || "FULL_TIME",
        salaryMin: compensation.minPay ? Number(compensation.minPay) : null,
        salaryMax: compensation.maxPay ? Number(compensation.maxPay) : null,
        salaryCurrency: "USD",
        climateCategory: jobCategory || null,
        experienceLevel: experienceLevel || null,
        closesAt: closingDate ? closingDate.toISOString() : null,
      };

      const res = await fetch("/api/canopy/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save role");
      }

      const { job } = await res.json();
      router.push(`/canopy/roles/${job.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save role";
      logger.error("Error saving role", { error: formatError(err) });
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  /* -------------------------------------------------------------------
     Render
     ------------------------------------------------------------------- */

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Create a role"
        actions={
          <div className="flex items-center gap-3">
            <Link href="/canopy/roles">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} weight="bold" />
                Back to Roles
              </Button>
            </Link>

            <Badge variant="neutral" size="sm">
              Draft
            </Badge>

            <Button variant="outline" onClick={handleSaveDraft} disabled={saving || publishing}>
              {saving ? <Spinner size="sm" /> : <FloppyDisk size={18} weight="bold" />}
              Save Draft
            </Button>
          </div>
        }
      />

      {/* Content */}
      <div className="mx-auto max-w-4xl px-8 py-8 lg:px-12">
        <div className="space-y-6">
          {/* Error Banner */}
          {error && (
            <Banner type="critical" title={error} dismissible onDismiss={() => setError(null)} />
          )}

          {/* Role Title Card */}
          <FormCard>
            <FormSection title="Role Details">
              <FormField label="Role Title" required>
                <FormTitleInput
                  placeholder="e.g. Solar Installation Lead"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </FormField>

              <FormRow columns={2}>
                <FormField label="Job Category">
                  <Select value={jobCategory} onValueChange={setJobCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Position Type">
                  <Select value={positionType} onValueChange={setPositionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {positionTypes.map((pt) => (
                        <SelectItem key={pt.value} value={pt.value}>
                          {pt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </FormRow>

              <FormRow columns={2}>
                <FormField label="Experience Level">
                  <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((el) => (
                        <SelectItem key={el.value} value={el.value}>
                          {el.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Closing Date">
                  <DatePicker
                    value={closingDate}
                    onChange={setClosingDate}
                    placeholder="Select closing date"
                  />
                </FormField>
              </FormRow>
            </FormSection>
          </FormCard>

          {/* Role Information (Rich Text) */}
          <RoleInformationSection
            roleDescription={roleDescription}
            responsibilities={responsibilities}
            requiredQualifications={requiredQualifications}
            desiredQualifications={desiredQualifications}
            onRoleDescriptionChange={setRoleDescription}
            onResponsibilitiesChange={setResponsibilities}
            onRequiredQualificationsChange={setRequiredQualifications}
            onDesiredQualificationsChange={setDesiredQualifications}
          />

          {/* Education Requirements */}
          <EducationRequirementsSection
            educationLevel={educationLevel}
            specificRequirements={specificEducation}
            onEducationLevelChange={setEducationLevel}
            onSpecificRequirementsChange={setSpecificEducation}
          />

          {/* Workplace Information */}
          <WorkplaceInformationSection
            workplaceType={workplaceType}
            location={location}
            onWorkplaceTypeChange={setWorkplaceType}
            onLocationChange={setLocation}
          />

          {/* Compensation & Benefits */}
          <CompensationBenefitsSection
            compensation={compensation}
            selectedBenefits={selectedBenefits}
            useCompanyDefaults={useCompanyDefaults}
            additionalDetails={additionalDetails}
            onCompensationChange={setCompensation}
            onBenefitsChange={setSelectedBenefits}
            onUseCompanyDefaultsChange={setUseCompanyDefaults}
            onAdditionalDetailsChange={setAdditionalDetails}
          />

          {/* Application Settings */}
          <FormCard>
            <FormSection title="Application Settings">
              <FormField
                label="External Application Link"
                helpText="If candidates should apply on an external site, enter the URL here."
              >
                <Input
                  placeholder="https://..."
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                />
              </FormField>

              <div className="space-y-4">
                <SwitchWithLabel
                  label="Require resume upload"
                  checked={requireResume}
                  onCheckedChange={setRequireResume}
                />
                <SwitchWithLabel
                  label="Require cover letter"
                  checked={requireCoverLetter}
                  onCheckedChange={setRequireCoverLetter}
                />
              </div>
            </FormSection>
          </FormCard>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between border-t border-[var(--border-muted)] pt-6">
            <Link href="/canopy/roles">
              <Button variant="ghost">Cancel</Button>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSaveDraft} disabled={saving || publishing}>
                {saving ? <Spinner size="sm" /> : <FloppyDisk size={18} weight="bold" />}
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

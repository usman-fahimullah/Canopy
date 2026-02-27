"use client";

import { useState, useCallback } from "react";
import { WizardModal, WizardStep } from "@/components/ui/wizard-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CategoryTag } from "@/components/ui/category-tag";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Stack } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { logger, formatError } from "@/lib/logger";
import type { RoleTemplate } from "@/types/canopy";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface Pathway {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
}

interface JobSummary {
  id: string;
  title: string;
  slug: string;
  location: string | null;
  locationType: string;
  status: string;
  publishedAt: string | null;
  closesAt: string | null;
  applicationCount?: number;
  pathway?: Pathway | null;
  climateCategory?: string | null;
}

interface JobDetail {
  id: string;
  title: string;
  description: string;
  location: string | null;
  locationType: string;
  employmentType: string;
  climateCategory: string | null;
  experienceLevel: string | null;
  requiredCerts: string[];
  greenSkills: string[];
  impactDescription: string | null;
  pathwayId: string | null;
  pathway?: Pathway | null;
}

/* -------------------------------------------------------------------
   Field configuration for Step 2 toggles
   ------------------------------------------------------------------- */

interface FieldConfig {
  key: string;
  label: string;
}

const MAIN_INFO_FIELDS: FieldConfig[] = [
  { key: "title", label: "Role Title" },
  { key: "climateCategory", label: "Job Category" },
  { key: "employmentType", label: "Position Type" },
  { key: "experienceLevel", label: "Level of Experience" },
];

const ROLE_INFO_FIELDS: FieldConfig[] = [
  { key: "description", label: "Role Description" },
  { key: "responsibilities", label: "Primary Responsibilities" },
  { key: "qualifications", label: "Desired Qualifications" },
  { key: "educationLevel", label: "Education Level" },
  { key: "specialEducation", label: "Special Education Requirements" },
];

const ALL_FIELD_KEYS = [
  ...MAIN_INFO_FIELDS.map((f) => f.key),
  ...ROLE_INFO_FIELDS.map((f) => f.key),
];

function getDefaultToggles(): Record<string, boolean> {
  const toggles: Record<string, boolean> = {};
  for (const key of ALL_FIELD_KEYS) {
    toggles[key] = true;
  }
  return toggles;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function formatDate(dateString: string | null) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Extract a human-readable preview value for a field from the job detail */
function getFieldValue(job: JobDetail, fieldKey: string): string | null {
  switch (fieldKey) {
    case "title":
      return job.title || null;
    case "climateCategory":
      return job.pathway?.name || job.climateCategory || null;
    case "employmentType":
      return job.employmentType
        ? job.employmentType
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : null;
    case "experienceLevel":
      return job.experienceLevel
        ? job.experienceLevel
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : null;
    case "description":
      return job.description || null;
    case "responsibilities":
      return job.description || null; // MVP: same source
    case "qualifications": {
      const parts = [...job.requiredCerts, ...job.greenSkills];
      return parts.length > 0 ? parts.join(", ") : null;
    }
    case "educationLevel":
      return job.requiredCerts.length > 0 ? job.requiredCerts.join(", ") : null;
    case "specialEducation":
      return job.requiredCerts.length > 0 ? job.requiredCerts.join(", ") : null;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------
   Step 1: Select a Role
   ------------------------------------------------------------------- */

function StepSelectRole({
  jobs,
  onSelect,
  loadingJobId,
}: {
  jobs: JobSummary[];
  onSelect: (jobId: string) => void;
  loadingJobId: string | null;
}) {
  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-sm text-[var(--foreground-default)]">
          Select a role to convert to a Job Template
        </h2>
        <p className="text-body text-[var(--foreground-default)]">
          Job Templates let you reuse role requirements, responsibilities, and qualifications—saving
          time when creating new job postings.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)]">
          {jobs.length === 0 ? (
            <div className="p-6 text-center text-body text-[var(--foreground-muted)]">
              No roles available. Create a role first to use as a template.
            </div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={job.id}
                className={cn(
                  "flex items-center justify-between p-6",
                  index < jobs.length - 1 && "border-b border-[var(--border-muted)]"
                )}
              >
                {/* Left side: stacked tags row above title */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {/* Tags row */}
                  {(job.pathway?.name || job.climateCategory || job.closesAt) && (
                    <div className="flex items-start gap-3">
                      {(job.pathway?.name || job.climateCategory) && (
                        <CategoryTag variant="truncate" maxWidth={120}>
                          {job.pathway?.name || job.climateCategory}
                        </CategoryTag>
                      )}
                      {job.closesAt && (
                        <Badge variant="info" size="sm">
                          {formatDate(job.closesAt)}
                        </Badge>
                      )}
                    </div>
                  )}
                  {/* Job title */}
                  <span className="text-body text-[var(--foreground-default)]">{job.title}</span>
                </div>

                {/* Select button */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="shrink-0"
                  onClick={() => onSelect(job.id)}
                  disabled={loadingJobId !== null}
                >
                  {loadingJobId === job.id ? <Spinner size="sm" /> : "Select Role"}
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/* -------------------------------------------------------------------
   Step 2: Toggle Fields
   ------------------------------------------------------------------- */

function FieldToggleSection({
  title,
  fields,
  toggles,
  onToggle,
  job,
}: {
  title: string;
  fields: FieldConfig[];
  toggles: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
  job: JobDetail;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-body text-[var(--foreground-default)]">{title}</span>
      <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--background-subtle)]">
        {fields.map((field, index) => {
          const value = getFieldValue(job, field.key);
          const switchId = `toggle-${field.key}`;
          return (
            <div
              key={field.key}
              className={cn(
                "flex items-center gap-2 px-6 py-4",
                index < fields.length - 1 && "border-b border-[var(--border-muted)]"
              )}
            >
              {/* Label + value column */}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <label
                  htmlFor={switchId}
                  className="cursor-pointer text-body text-[var(--foreground-brand-emphasis)]"
                >
                  {field.label}
                </label>
                {value && (
                  <p className="truncate text-body text-[var(--foreground-default)]">{value}</p>
                )}
              </div>
              {/* Switch */}
              <Switch
                id={switchId}
                size="default"
                checked={toggles[field.key] ?? true}
                onCheckedChange={(checked) => onToggle(field.key, checked as boolean)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepToggleFields({
  job,
  toggles,
  onToggle,
}: {
  job: JobDetail;
  toggles: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Sub-header */}
      <div className="border-b border-[var(--border-muted)] px-8 py-4">
        <p className="text-heading-sm text-[var(--foreground-brand-emphasis)]">
          Turn on/off which information you would like to keep from{" "}
          <span className="text-[var(--foreground-link)]">{job.title}</span>
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-6 px-8 py-6">
          <FieldToggleSection
            title="Main Information"
            fields={MAIN_INFO_FIELDS}
            toggles={toggles}
            onToggle={onToggle}
            job={job}
          />
          <FieldToggleSection
            title="Role Information"
            fields={ROLE_INFO_FIELDS}
            toggles={toggles}
            onToggle={onToggle}
            job={job}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

/* -------------------------------------------------------------------
   Step 3: Name Template
   ------------------------------------------------------------------- */

function StepNameTemplate({
  name,
  onNameChange,
  error,
}: {
  name: string;
  onNameChange: (name: string) => void;
  error: string | null;
}) {
  return (
    <div className="flex w-full flex-col gap-6 px-8 py-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-sm text-[var(--foreground-default)]">Name your Job Template</h2>
        <p className="text-body text-[var(--foreground-muted)]">
          Choose a clear name for this template (ex: &apos;Marketing Manager — Growth&apos; or
          &apos;Engineer — Backend&apos;). You can always edit it later.
        </p>
      </div>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name this template (e.g. Customer Support – Weekend)"
      />
      {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}
    </div>
  );
}

/* -------------------------------------------------------------------
   Wizard Step Definitions
   ------------------------------------------------------------------- */

const WIZARD_STEPS = [
  { id: "select", label: "Select Role" },
  { id: "configure", label: "Configure Fields" },
  { id: "name", label: "Name Template" },
];

/* -------------------------------------------------------------------
   Main Modal Component
   ------------------------------------------------------------------- */

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: JobSummary[];
  onTemplateCreated: (template: RoleTemplate) => void;
}

interface ModalState {
  step: number;
  selectedJob: JobDetail | null;
  loadingJobId: string | null;
  fieldToggles: Record<string, boolean>;
  templateName: string;
  isSaving: boolean;
  error: string | null;
}

const INITIAL_STATE: ModalState = {
  step: 0,
  selectedJob: null,
  loadingJobId: null,
  fieldToggles: getDefaultToggles(),
  templateName: "",
  isSaving: false,
  error: null,
};

export function CreateTemplateModal({
  open,
  onOpenChange,
  jobs,
  onTemplateCreated,
}: CreateTemplateModalProps) {
  const [state, setState] = useState<ModalState>(INITIAL_STATE);

  const resetAndClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setState(INITIAL_STATE);
      }
      onOpenChange(isOpen);
    },
    [onOpenChange]
  );

  /** Step 0 → 1: fetch full job details, then advance */
  const handleSelectRole = useCallback(async (jobId: string) => {
    setState((prev) => ({ ...prev, loadingJobId: jobId, error: null }));

    try {
      const res = await fetch(`/api/canopy/roles/${jobId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch job details");
      }
      const data = await res.json();
      const job = data.job as JobDetail;

      setState((prev) => ({
        ...prev,
        step: 1,
        selectedJob: job,
        loadingJobId: null,
        fieldToggles: getDefaultToggles(),
      }));
    } catch (err) {
      logger.error("Error fetching job for template", { error: formatError(err) });
      setState((prev) => ({
        ...prev,
        loadingJobId: null,
        error: "Failed to load role details. Please try again.",
      }));
    }
  }, []);

  /** Step 2 → save template */
  const handleSave = useCallback(async () => {
    if (!state.templateName.trim() || !state.selectedJob) return;

    setState((prev) => ({ ...prev, isSaving: true, error: null }));

    const activeFields = Object.entries(state.fieldToggles)
      .filter(([, isOn]) => isOn)
      .map(([key]) => key);

    try {
      const res = await fetch("/api/canopy/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.templateName.trim(),
          sourceJobId: state.selectedJob.id,
          activeFields,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create template");
      }

      const data = await res.json();
      onTemplateCreated(data.template as RoleTemplate);
      setState(INITIAL_STATE);
      onOpenChange(false);
    } catch (err) {
      logger.error("Error creating template", { error: formatError(err) });
      setState((prev) => ({
        ...prev,
        isSaving: false,
        error: err instanceof Error ? err.message : "Failed to create template",
      }));
    }
  }, [state.templateName, state.selectedJob, state.fieldToggles, onTemplateCreated, onOpenChange]);

  /** Go back one step */
  const handleGoBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: prev.step - 1,
      error: null,
    }));
  }, []);

  /** Toggle a field on/off in step 2 */
  const handleToggle = useCallback((key: string, checked: boolean) => {
    setState((prev) => ({
      ...prev,
      fieldToggles: { ...prev.fieldToggles, [key]: checked },
    }));
  }, []);

  const hasActiveFields = Object.values(state.fieldToggles).some(Boolean);

  return (
    <WizardModal
      open={open}
      onOpenChange={resetAndClose}
      steps={WIZARD_STEPS}
      step={state.step}
      onStepChange={(step) => setState((prev) => ({ ...prev, step, error: null }))}
      icon={<Stack size={24} weight="regular" />}
      iconBg="bg-[var(--background-info)]"
      title="Create Job Template"
      size="md"
      completeLabel="Save and Finish"
      nextLabel="Create Template"
      onComplete={handleSave}
      isCompleting={state.isSaving}
      nextDisabled={!hasActiveFields}
      hideFooter={state.step === 0}
      onBack={handleGoBack}
    >
      <WizardStep stepId="select">
        <StepSelectRole jobs={jobs} onSelect={handleSelectRole} loadingJobId={state.loadingJobId} />
        {state.error && (
          <p className="px-8 pb-4 text-caption text-[var(--foreground-error)]">{state.error}</p>
        )}
      </WizardStep>

      <WizardStep stepId="configure">
        {state.selectedJob && (
          <StepToggleFields
            job={state.selectedJob}
            toggles={state.fieldToggles}
            onToggle={handleToggle}
          />
        )}
      </WizardStep>

      <WizardStep stepId="name">
        <StepNameTemplate
          name={state.templateName}
          onNameChange={(name) => setState((prev) => ({ ...prev, templateName: name }))}
          error={state.error}
        />
      </WizardStep>
    </WizardModal>
  );
}

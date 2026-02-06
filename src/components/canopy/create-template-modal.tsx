"use client";

import { useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { CategoryTag } from "@/components/ui/category-tag";
import { SwitchWithLabel } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Stack, ArrowLeft } from "@phosphor-icons/react";
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
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-sm text-[var(--foreground-default)]">
          Select a role to convert to a Job Template
        </h2>
        <p className="text-body text-[var(--foreground-muted)]">
          Choose an existing role to use as the foundation for your template. We&apos;ll help you
          pick which information to keep.
        </p>
      </div>

      <ScrollArea className="max-h-[400px]">
        <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)]">
          {jobs.length === 0 ? (
            <div className="px-6 py-8 text-center text-body text-[var(--foreground-muted)]">
              No roles available. Create a role first to use as a template.
            </div>
          ) : (
            jobs.map((job, index) => (
              <div
                key={job.id}
                className={cn(
                  "flex items-center justify-between gap-4 px-6 py-4",
                  index < jobs.length - 1 && "border-b border-[var(--border-muted)]"
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
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
                  <span className="truncate text-body text-[var(--foreground-default)]">
                    {job.title}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
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
}: {
  title: string;
  fields: FieldConfig[];
  toggles: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-body text-[var(--foreground-default)]">{title}</span>
      <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)]">
        {fields.map((field, index) => (
          <div
            key={field.key}
            className={cn(
              "flex items-center justify-between px-6 py-4",
              index < fields.length - 1 && "border-b border-[var(--border-muted)]"
            )}
          >
            <SwitchWithLabel
              label={field.label}
              labelPosition="left"
              checked={toggles[field.key] ?? true}
              onCheckedChange={(checked) => onToggle(field.key, checked as boolean)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function StepToggleFields({
  jobTitle,
  toggles,
  onToggle,
}: {
  jobTitle: string;
  toggles: Record<string, boolean>;
  onToggle: (key: string, checked: boolean) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <p className="text-heading-sm text-[var(--foreground-default)]">
        Turn on/off which information you would like to keep from{" "}
        <span className="text-[var(--foreground-link)]">{jobTitle}</span>
      </p>

      <ScrollArea className="max-h-[420px]">
        <div className="flex flex-col gap-6">
          <FieldToggleSection
            title="Main Information"
            fields={MAIN_INFO_FIELDS}
            toggles={toggles}
            onToggle={onToggle}
          />
          <FieldToggleSection
            title="Role Information"
            fields={ROLE_INFO_FIELDS}
            toggles={toggles}
            onToggle={onToggle}
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
    <div className="flex w-full flex-col gap-6">
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
   Main Modal Component
   ------------------------------------------------------------------- */

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobs: JobSummary[];
  onTemplateCreated: (template: RoleTemplate) => void;
}

interface ModalState {
  step: 1 | 2 | 3;
  selectedJob: JobDetail | null;
  loadingJobId: string | null;
  fieldToggles: Record<string, boolean>;
  templateName: string;
  isSaving: boolean;
  error: string | null;
}

const INITIAL_STATE: ModalState = {
  step: 1,
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

  const resetAndClose = useCallback(() => {
    setState(INITIAL_STATE);
    onOpenChange(false);
  }, [onOpenChange]);

  /** Step 1 → 2: fetch full job details, then advance */
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
        step: 2,
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

  /** Step 2 → 3: advance to naming step */
  const handleAdvanceToNaming = useCallback(() => {
    setState((prev) => ({ ...prev, step: 3, error: null }));
  }, []);

  /** Step 3: save template */
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
      step: (prev.step - 1) as 1 | 2,
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
    <Modal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetAndClose();
        }
      }}
    >
      <ModalContent size="md">
        {/* Header — shared across all steps */}
        <ModalHeader
          icon={<Stack size={24} weight="regular" />}
          iconBg="bg-[var(--background-info)]"
        >
          <ModalTitle>Create Job Template</ModalTitle>
        </ModalHeader>

        {/* Body — step-specific content */}
        <ModalBody>
          {state.step === 1 && (
            <StepSelectRole
              jobs={jobs}
              onSelect={handleSelectRole}
              loadingJobId={state.loadingJobId}
            />
          )}

          {state.step === 2 && state.selectedJob && (
            <StepToggleFields
              jobTitle={state.selectedJob.title}
              toggles={state.fieldToggles}
              onToggle={handleToggle}
            />
          )}

          {state.step === 3 && (
            <StepNameTemplate
              name={state.templateName}
              onNameChange={(name) => setState((prev) => ({ ...prev, templateName: name }))}
              error={state.error}
            />
          )}

          {/* Error display for steps 1 and 2 (step 3 shows error via StepNameTemplate) */}
          {state.step < 3 && state.error && (
            <p className="text-caption text-[var(--foreground-error)]">{state.error}</p>
          )}
        </ModalBody>

        {/* Footer — steps 2 & 3 only */}
        {state.step > 1 && (
          <ModalFooter className="justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="bg-[var(--background-info)] hover:bg-[var(--background-interactive-hover)]"
              onClick={handleGoBack}
              aria-label="Go back"
            >
              <ArrowLeft size={20} weight="bold" />
            </Button>

            {state.step === 2 && (
              <Button onClick={handleAdvanceToNaming} disabled={!hasActiveFields}>
                Continue
              </Button>
            )}

            {state.step === 3 && (
              <Button onClick={handleSave} disabled={!state.templateName.trim() || state.isSaving}>
                {state.isSaving ? (
                  <>
                    <Spinner size="sm" />
                    Saving...
                  </>
                ) : (
                  "Save and Finish"
                )}
              </Button>
            )}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}

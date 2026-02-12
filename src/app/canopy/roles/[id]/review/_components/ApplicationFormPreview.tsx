"use client";

import {
  User,
  Envelope,
  Calendar,
  MapPin,
  Briefcase,
  Buildings,
  Clock,
  LinkedinLogo,
  Globe,
  File,
  FileText,
  FolderOpen,
  TextT,
  CheckCircle,
  ListBullets,
  Upload,
  Asterisk,
} from "@phosphor-icons/react";
import type { FormConfigData, FormQuestionData } from "../page";

// ============================================
// TYPES
// ============================================

interface ApplicationFormPreviewProps {
  formConfig: FormConfigData | null;
  formQuestions: FormQuestionData[];
}

// ============================================
// DEFAULTS
// ============================================

const DEFAULT_PERSONAL: Record<string, { visible: boolean; required: boolean }> = {
  name: { visible: true, required: true },
  email: { visible: true, required: true },
  dateOfBirth: { visible: false, required: false },
  pronouns: { visible: true, required: false },
  location: { visible: true, required: true },
};

const DEFAULT_CAREER: Record<string, { visible: boolean; required: boolean }> = {
  currentRole: { visible: true, required: false },
  currentCompany: { visible: true, required: false },
  yearsExperience: { visible: true, required: true },
  linkedIn: { visible: true, required: false },
  portfolio: { visible: true, required: false },
};

const DEFAULT_FILES = { resume: true, coverLetter: false, portfolio: false };

// ============================================
// HELPERS
// ============================================

const FIELD_LABELS: Record<string, string> = {
  name: "Full Name",
  email: "Email Address",
  dateOfBirth: "Date of Birth",
  pronouns: "Pronouns",
  location: "Location",
  currentRole: "Current Role",
  currentCompany: "Current Company",
  yearsExperience: "Years of Experience",
  linkedIn: "LinkedIn Profile",
  portfolio: "Portfolio URL",
};

const FIELD_ICONS: Record<string, React.ReactNode> = {
  name: <User size={14} weight="regular" />,
  email: <Envelope size={14} weight="regular" />,
  dateOfBirth: <Calendar size={14} weight="regular" />,
  pronouns: <User size={14} weight="regular" />,
  location: <MapPin size={14} weight="regular" />,
  currentRole: <Briefcase size={14} weight="regular" />,
  currentCompany: <Buildings size={14} weight="regular" />,
  yearsExperience: <Clock size={14} weight="regular" />,
  linkedIn: <LinkedinLogo size={14} weight="regular" />,
  portfolio: <Globe size={14} weight="regular" />,
};

const QUESTION_ICONS: Record<string, React.ReactNode> = {
  text: <TextT size={14} weight="regular" />,
  "yes-no": <CheckCircle size={14} weight="regular" />,
  "multiple-choice": <ListBullets size={14} weight="regular" />,
  "file-upload": <Upload size={14} weight="regular" />,
};

// ============================================
// COMPONENT
// ============================================

export function ApplicationFormPreview({ formConfig, formQuestions }: ApplicationFormPreviewProps) {
  const personalDetails = formConfig?.personalDetails ?? DEFAULT_PERSONAL;
  const careerDetails = formConfig?.careerDetails ?? DEFAULT_CAREER;
  const requiredFiles = formConfig?.requiredFiles ?? DEFAULT_FILES;

  const visiblePersonal = Object.entries(personalDetails).filter(([, cfg]) => cfg.visible);
  const visibleCareer = Object.entries(careerDetails).filter(([, cfg]) => cfg.visible);
  const activeFiles = Object.entries(requiredFiles).filter(([, on]) => on);

  const hasContent =
    visiblePersonal.length > 0 ||
    visibleCareer.length > 0 ||
    activeFiles.length > 0 ||
    formQuestions.length > 0;

  if (!hasContent) return null;

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--border-default)] bg-[var(--card-background)] p-5">
      <h3 className="mb-4 text-caption-strong font-semibold text-[var(--foreground-default)]">
        Application Form
      </h3>

      <div className="space-y-4">
        {/* Required Files */}
        {activeFiles.length > 0 && (
          <FormSection title="Required Files">
            {activeFiles.map(([key]) => (
              <FieldRow
                key={key}
                icon={
                  key === "resume" ? (
                    <File size={14} weight="regular" />
                  ) : key === "coverLetter" ? (
                    <FileText size={14} weight="regular" />
                  ) : (
                    <FolderOpen size={14} weight="regular" />
                  )
                }
                label={
                  key === "resume" ? "Resume" : key === "coverLetter" ? "Cover Letter" : "Portfolio"
                }
                required
              />
            ))}
          </FormSection>
        )}

        {/* Personal Details */}
        {visiblePersonal.length > 0 && (
          <FormSection title="Personal Details">
            {visiblePersonal.map(([key, cfg]) => (
              <FieldRow
                key={key}
                icon={FIELD_ICONS[key]}
                label={FIELD_LABELS[key] ?? key}
                required={cfg.required}
              />
            ))}
          </FormSection>
        )}

        {/* Career Details */}
        {visibleCareer.length > 0 && (
          <FormSection title="Career Details">
            {visibleCareer.map(([key, cfg]) => (
              <FieldRow
                key={key}
                icon={FIELD_ICONS[key]}
                label={FIELD_LABELS[key] ?? key}
                required={cfg.required}
              />
            ))}
          </FormSection>
        )}

        {/* Custom Questions */}
        {formQuestions.length > 0 && (
          <FormSection title="Custom Questions">
            {formQuestions.map((q) => (
              <FieldRow
                key={q.id}
                icon={QUESTION_ICONS[q.type]}
                label={q.title}
                required={q.required}
                sublabel={
                  q.type === "multiple-choice"
                    ? `${q.options?.length ?? 0} options`
                    : q.type.replace("-", "/")
                }
              />
            ))}
          </FormSection>
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-caption-sm font-medium uppercase tracking-wide text-[var(--foreground-subtle)]">
        {title}
      </p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function FieldRow({
  icon,
  label,
  required,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  required: boolean;
  sublabel?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-caption text-[var(--foreground-muted)]">
      <span className="flex shrink-0 text-[var(--foreground-subtle)]">{icon}</span>
      <span className="min-w-0 truncate">{label}</span>
      {required && (
        <Asterisk size={10} weight="bold" className="shrink-0 text-[var(--foreground-error)]" />
      )}
      {sublabel && (
        <span className="ml-auto shrink-0 text-caption-sm text-[var(--foreground-subtle)]">
          {sublabel}
        </span>
      )}
    </div>
  );
}

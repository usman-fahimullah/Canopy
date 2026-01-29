"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import {
  RichTextEditor,
  RichTextToolbar,
} from "@/components/ui/rich-text-editor";

/**
 * RoleInformationSection component
 * Based on Figma Design (188:6104)
 *
 * Contains rich text editors for:
 * - Role Description
 * - Primary Responsibilities
 * - Required Qualifications
 * - Desired Qualifications
 *
 * Each field uses the existing RichTextEditor with RichTextToolbar.
 */

export interface RoleInformationSectionProps {
  /** Role description content (HTML) */
  roleDescription?: string;
  /** Primary responsibilities content (HTML) */
  responsibilities?: string;
  /** Required qualifications content (HTML) */
  requiredQualifications?: string;
  /** Desired qualifications content (HTML) */
  desiredQualifications?: string;
  /** Callback when role description changes */
  onRoleDescriptionChange?: (html: string) => void;
  /** Callback when responsibilities change */
  onResponsibilitiesChange?: (html: string) => void;
  /** Callback when required qualifications change */
  onRequiredQualificationsChange?: (html: string) => void;
  /** Callback when desired qualifications change */
  onDesiredQualificationsChange?: (html: string) => void;
  /** Character limits for each field */
  characterLimits?: {
    roleDescription?: number;
    responsibilities?: number;
    requiredQualifications?: number;
    desiredQualifications?: number;
  };
  /** Additional class names */
  className?: string;
}

const RoleInformationSection = React.forwardRef<
  HTMLDivElement,
  RoleInformationSectionProps
>(
  (
    {
      roleDescription = "",
      responsibilities = "",
      requiredQualifications = "",
      desiredQualifications = "",
      onRoleDescriptionChange,
      onResponsibilitiesChange,
      onRequiredQualificationsChange,
      onDesiredQualificationsChange,
      characterLimits = {
        roleDescription: 500,
        responsibilities: 250,
        requiredQualifications: 250,
        desiredQualifications: 250,
      },
      className,
    },
    ref
  ) => {
    // Helper to get plain text length from HTML
    const getTextLength = (html: string) => {
      if (typeof window === "undefined") return 0;
      const div = document.createElement("div");
      div.innerHTML = html;
      return div.textContent?.length || 0;
    };

    return (
      <FormCard ref={ref} className={className}>
        {/* Role Description */}
        <FormSection title="Role Description">
          <FormField
            label="Overview of Role"
            helpText="Summarize the role, impact, and daily responsibilities to give candidates a clear picture of the position."
          >
            <RichTextEditorWithCounter
              content={roleDescription}
              onChange={onRoleDescriptionChange}
              placeholder="Describe the role and its key responsibilities..."
              maxCharacters={characterLimits.roleDescription}
              minHeight="180px"
            />
          </FormField>
        </FormSection>

        {/* Primary Responsibilities */}
        <FormSection title="Responsibilities">
          <FormField
            label="Primary Responsibilities"
            helpText="Outline key tasks and duties the candidate will be responsible for on a regular basis."
          >
            <RichTextEditorWithCounter
              content={responsibilities}
              onChange={onResponsibilitiesChange}
              placeholder="List the main responsibilities for this role..."
              maxCharacters={characterLimits.responsibilities}
              minHeight="180px"
            />
          </FormField>
        </FormSection>

        {/* Qualifications */}
        <FormSection title="Qualifications">
          <FormField
            label="Required Qualifications"
            helpText="Specify must-have skills, experience, and certifications needed to succeed in this role."
          >
            <RichTextEditorWithCounter
              content={requiredQualifications}
              onChange={onRequiredQualificationsChange}
              placeholder="List the required qualifications..."
              maxCharacters={characterLimits.requiredQualifications}
              minHeight="180px"
            />
          </FormField>

          <FormField
            label="Desired Qualifications"
            helpText="Include nice-to-have skills and experience that would make a candidate stand out."
          >
            <RichTextEditorWithCounter
              content={desiredQualifications}
              onChange={onDesiredQualificationsChange}
              placeholder="List any desired qualifications..."
              maxCharacters={characterLimits.desiredQualifications}
              minHeight="180px"
            />
          </FormField>
        </FormSection>
      </FormCard>
    );
  }
);

RoleInformationSection.displayName = "RoleInformationSection";

/**
 * RichTextEditorWithCounter - Wraps RichTextEditor with character counter
 */
interface RichTextEditorWithCounterProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  maxCharacters?: number;
  minHeight?: string;
  className?: string;
}

const RichTextEditorWithCounter: React.FC<RichTextEditorWithCounterProps> = ({
  content = "",
  onChange,
  placeholder,
  maxCharacters = 250,
  minHeight = "180px",
  className,
}) => {
  const [charCount, setCharCount] = React.useState(0);

  const handleChange = (html: string) => {
    // Calculate character count from plain text
    if (typeof window !== "undefined") {
      const div = document.createElement("div");
      div.innerHTML = html;
      setCharCount(div.textContent?.length || 0);
    }
    onChange?.(html);
  };

  return (
    <div className={cn("relative", className)}>
      <RichTextEditor
        content={content}
        onChange={handleChange}
        placeholder={placeholder}
        minHeight={minHeight}
      >
        <RichTextToolbar />
      </RichTextEditor>
      {/* Character counter - positioned at bottom right */}
      <div className="absolute bottom-3 right-4 text-sm text-[var(--primitive-neutral-500)] opacity-80">
        {charCount}/{maxCharacters}
      </div>
    </div>
  );
};

export { RoleInformationSection, RichTextEditorWithCounter };

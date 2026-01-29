"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import {
  RichTextEditor,
  RichTextToolbar,
} from "@/components/ui/rich-text-editor";

/**
 * EducationRequirementsSection component
 * Based on Figma Design (188:6193)
 *
 * Contains:
 * - Education Level dropdown
 * - Specific Education Requirements rich text editor
 */

export type EducationLevel =
  | "high-school"
  | "associate"
  | "bachelor"
  | "master"
  | "doctorate"
  | "professional"
  | "vocational"
  | "none";

export const educationLevelOptions: { value: EducationLevel; label: string }[] = [
  { value: "none", label: "No formal education required" },
  { value: "high-school", label: "High School Diploma / GED" },
  { value: "vocational", label: "Vocational / Trade Certificate" },
  { value: "associate", label: "Associate's Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (Ph.D.)" },
  { value: "professional", label: "Professional Degree (MD, JD, etc.)" },
];

export interface EducationRequirementsSectionProps {
  /** Selected education level */
  educationLevel?: EducationLevel;
  /** Specific education requirements content (HTML) */
  specificRequirements?: string;
  /** Callback when education level changes */
  onEducationLevelChange?: (level: EducationLevel) => void;
  /** Callback when specific requirements change */
  onSpecificRequirementsChange?: (html: string) => void;
  /** Character limit for specific requirements */
  characterLimit?: number;
  /** Additional class names */
  className?: string;
}

const EducationRequirementsSection = React.forwardRef<
  HTMLDivElement,
  EducationRequirementsSectionProps
>(
  (
    {
      educationLevel,
      specificRequirements = "",
      onEducationLevelChange,
      onSpecificRequirementsChange,
      characterLimit = 250,
      className,
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleSpecificRequirementsChange = (html: string) => {
      if (typeof window !== "undefined") {
        const div = document.createElement("div");
        div.innerHTML = html;
        setCharCount(div.textContent?.length || 0);
      }
      onSpecificRequirementsChange?.(html);
    };

    return (
      <FormCard ref={ref} className={className}>
        <FormSection title="Education Requirements">
          {/* Education Level Dropdown */}
          <FormField label="Education Level">
            <Select
              value={educationLevel}
              onValueChange={(value) =>
                onEducationLevelChange?.(value as EducationLevel)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Education Level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Specific Education Requirements */}
          <FormField
            label="Specific Education Requirements"
            helpText="Outline the degrees, credentials, and training required to support students with disabilities and diverse learning needs effectively."
          >
            <div className="relative">
              <RichTextEditor
                content={specificRequirements}
                onChange={handleSpecificRequirementsChange}
                placeholder="Add any information regarding any specific education requirements"
                minHeight="180px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              {/* Character counter */}
              <div className="absolute bottom-3 right-4 text-sm text-[var(--primitive-neutral-500)] opacity-80">
                {charCount}/{characterLimit}
              </div>
            </div>
          </FormField>
        </FormSection>
      </FormCard>
    );
  }
);

EducationRequirementsSection.displayName = "EducationRequirementsSection";

export { EducationRequirementsSection };

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { Input } from "@/components/ui/input";
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
import { BenefitsSelector, defaultBenefitCategories } from "@/components/ui/benefits-selector";
import { CurrencyDollar } from "@phosphor-icons/react";

/**
 * CompensationBenefitsSection component
 * Based on Figma Design (188:6234)
 *
 * Contains:
 * - Pay Type dropdown (Salary, Hourly, Commission, etc.)
 * - Min/Max Pay Amount inputs with currency icon
 * - Pay Frequency segmented controller (Weekly, Bi-Weekly, Monthly)
 * - Company Benefits selector with customize option
 * - Additional compensation details rich text editor
 */

export type PayType = "salary" | "hourly" | "commission" | "contract" | "stipend";
export type PayFrequency = "weekly" | "bi-weekly" | "monthly" | "annually";

export const payTypeOptions: { value: PayType; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "hourly", label: "Hourly" },
  { value: "commission", label: "Commission" },
  { value: "contract", label: "Contract" },
  { value: "stipend", label: "Stipend" },
];

export const payFrequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
];

export interface CompensationData {
  payType?: PayType;
  minPay?: number;
  maxPay?: number;
  payFrequency?: PayFrequency;
  currency?: string;
}

export interface CompensationBenefitsSectionProps {
  /** Compensation data */
  compensation?: CompensationData;
  /** Selected benefit IDs */
  selectedBenefits?: string[];
  /** Whether to use company default benefits */
  useCompanyDefaults?: boolean;
  /** Additional compensation/benefits details (HTML) */
  additionalDetails?: string;
  /** Callback when compensation changes */
  onCompensationChange?: (compensation: CompensationData) => void;
  /** Callback when benefits selection changes */
  onBenefitsChange?: (benefitIds: string[]) => void;
  /** Callback when company defaults toggle changes */
  onUseCompanyDefaultsChange?: (useDefaults: boolean) => void;
  /** Callback when additional details change */
  onAdditionalDetailsChange?: (html: string) => void;
  /** Company name for benefits display */
  companyName?: string;
  /** Character limit for additional details */
  characterLimit?: number;
  /** Additional class names */
  className?: string;
}

const CompensationBenefitsSection = React.forwardRef<
  HTMLDivElement,
  CompensationBenefitsSectionProps
>(
  (
    {
      compensation = {},
      selectedBenefits = [],
      useCompanyDefaults = true,
      additionalDetails = "",
      onCompensationChange,
      onBenefitsChange,
      onUseCompanyDefaultsChange,
      onAdditionalDetailsChange,
      companyName = "Company",
      characterLimit = 250,
      className,
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);

    const handleCompensationFieldChange = <K extends keyof CompensationData>(
      field: K,
      value: CompensationData[K]
    ) => {
      onCompensationChange?.({
        ...compensation,
        [field]: value,
      });
    };

    const handleAdditionalDetailsChange = (html: string) => {
      if (typeof window !== "undefined") {
        const div = document.createElement("div");
        div.innerHTML = html;
        setCharCount(div.textContent?.length || 0);
      }
      onAdditionalDetailsChange?.(html);
    };

    // Parse number from string, returning undefined if invalid
    const parsePayAmount = (value: string): number | undefined => {
      const num = parseFloat(value.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? undefined : num;
    };

    return (
      <FormCard ref={ref} className={className}>
        <FormSection title="Compensation & Benefits Information">
          {/* Compensation Section */}
          <FormField
            label="Compensation"
            helpText="Outline the pay range, and incentives needed to fairly reward, attract, and retain someone in this role."
          >
            <div className="flex gap-4 items-center">
              {/* Pay Type Dropdown */}
              <div className="flex-1">
                <Select
                  value={compensation.payType}
                  onValueChange={(value) =>
                    handleCompensationFieldChange("payType", value as PayType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pay Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {payTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Pay Input */}
              <Input
                placeholder="Minimum Pay Amount"
                leftAddon={<CurrencyDollar weight="regular" />}
                value={compensation.minPay?.toString() || ""}
                onChange={(e) =>
                  handleCompensationFieldChange(
                    "minPay",
                    parsePayAmount(e.target.value)
                  )
                }
                type="text"
                inputMode="numeric"
                className="w-auto"
              />

              {/* Separator line */}
              <div className="w-4 h-px bg-[var(--primitive-neutral-300)]" />

              {/* Max Pay Input */}
              <Input
                placeholder="Maximum Pay Amount"
                leftAddon={<CurrencyDollar weight="regular" />}
                value={compensation.maxPay?.toString() || ""}
                onChange={(e) =>
                  handleCompensationFieldChange(
                    "maxPay",
                    parsePayAmount(e.target.value)
                  )
                }
                type="text"
                inputMode="numeric"
                className="w-auto"
              />
            </div>
          </FormField>

          {/* Pay Frequency */}
          <FormField label="Pay frequency">
            <SegmentedController
              options={payFrequencyOptions}
              value={compensation.payFrequency || "weekly"}
              onValueChange={(value) =>
                handleCompensationFieldChange("payFrequency", value as PayFrequency)
              }
              aria-label="Select pay frequency"
              className="w-[343px]"
            />
          </FormField>

          {/* Benefits Section */}
          <FormField
            label="Benefits"
            helpText="Outline the benefits needed to fairly reward, attract, and retain someone in this role."
          >
            <BenefitsSelector
              categories={defaultBenefitCategories}
              selectedBenefits={selectedBenefits}
              onSelectionChange={onBenefitsChange || (() => {})}
              useCompanyDefaults={useCompanyDefaults}
              onUseCompanyDefaultsChange={onUseCompanyDefaultsChange || (() => {})}
              companyName={companyName}
            />
          </FormField>

          {/* Additional Details Rich Text Editor */}
          <div className="relative">
            <RichTextEditor
              content={additionalDetails}
              onChange={handleAdditionalDetailsChange}
              placeholder="Add any details on compensation or benefits."
              minHeight="180px"
            >
              <RichTextToolbar />
            </RichTextEditor>
            {/* Character counter */}
            <div className="absolute bottom-3 right-4 text-sm text-[var(--primitive-neutral-500)] opacity-80">
              {charCount}/{characterLimit}
            </div>
          </div>
        </FormSection>
      </FormCard>
    );
  }
);

CompensationBenefitsSection.displayName = "CompensationBenefitsSection";

export { CompensationBenefitsSection };

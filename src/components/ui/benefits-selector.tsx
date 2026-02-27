"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { PencilSimple, ShieldPlus, X, Check } from "@phosphor-icons/react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "./modal";

/**
 * BenefitsSelector component
 *
 * A specialized selector for company benefits with preset categories
 * and the ability to customize individual benefits.
 *
 * Features:
 * - Preset "Company Benefits" toggle
 * - Customize button to open detailed selection
 * - Display selected benefits as chips
 * - Add custom benefits
 */

export interface BenefitCategory {
  id: string;
  name: string;
  icon?: React.ReactNode;
  benefits: BenefitItem[];
}

export interface BenefitItem {
  id: string;
  label: string;
  categoryId: string;
}

export interface BenefitsSelectorProps {
  /** All available benefit categories with their items */
  categories: BenefitCategory[];
  /** Currently selected benefit IDs */
  selectedBenefits: string[];
  /** Callback when selection changes */
  onSelectionChange: (benefitIds: string[]) => void;
  /** Whether to use company default benefits */
  useCompanyDefaults: boolean;
  /** Callback when company defaults toggle changes */
  onUseCompanyDefaultsChange: (useDefaults: boolean) => void;
  /** Company name for display */
  companyName?: string;
  /** Disable the selector */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

// Default benefit categories
export const defaultBenefitCategories: BenefitCategory[] = [
  {
    id: "health",
    name: "Health & Wellness",
    benefits: [
      { id: "health-insurance", label: "Health Insurance", categoryId: "health" },
      { id: "dental", label: "Dental Coverage", categoryId: "health" },
      { id: "vision", label: "Vision Coverage", categoryId: "health" },
      { id: "mental-health", label: "Mental Health Support", categoryId: "health" },
      { id: "gym", label: "Gym Membership", categoryId: "health" },
    ],
  },
  {
    id: "financial",
    name: "Financial",
    benefits: [
      { id: "401k", label: "401(k) Match", categoryId: "financial" },
      { id: "stock-options", label: "Stock Options", categoryId: "financial" },
      { id: "bonus", label: "Performance Bonus", categoryId: "financial" },
      { id: "commuter", label: "Commuter Benefits", categoryId: "financial" },
    ],
  },
  {
    id: "time-off",
    name: "Time Off",
    benefits: [
      { id: "pto", label: "Unlimited PTO", categoryId: "time-off" },
      { id: "parental", label: "Parental Leave", categoryId: "time-off" },
      { id: "sabbatical", label: "Sabbatical", categoryId: "time-off" },
      { id: "holidays", label: "Paid Holidays", categoryId: "time-off" },
    ],
  },
  {
    id: "work-environment",
    name: "Work Environment",
    benefits: [
      { id: "remote", label: "Remote Work", categoryId: "work-environment" },
      { id: "flexible-hours", label: "Flexible Hours", categoryId: "work-environment" },
      { id: "equipment", label: "Home Office Stipend", categoryId: "work-environment" },
      { id: "learning", label: "Learning Budget", categoryId: "work-environment" },
    ],
  },
];

const BenefitsSelector = React.forwardRef<HTMLDivElement, BenefitsSelectorProps>(
  (
    {
      categories = defaultBenefitCategories,
      selectedBenefits,
      onSelectionChange,
      useCompanyDefaults,
      onUseCompanyDefaultsChange,
      companyName = "Company",
      disabled = false,
      className,
    },
    ref
  ) => {
    const [customizeOpen, setCustomizeOpen] = React.useState(false);

    // Get all benefits as flat list
    const allBenefits = React.useMemo(() => {
      return categories.flatMap((cat) => cat.benefits);
    }, [categories]);

    // Get selected benefit objects
    const selectedBenefitObjects = React.useMemo(() => {
      return allBenefits.filter((b) => selectedBenefits.includes(b.id));
    }, [allBenefits, selectedBenefits]);

    const toggleBenefit = (benefitId: string) => {
      if (selectedBenefits.includes(benefitId)) {
        onSelectionChange(selectedBenefits.filter((id) => id !== benefitId));
      } else {
        onSelectionChange([...selectedBenefits, benefitId]);
      }
    };

    const selectAll = () => {
      onSelectionChange(allBenefits.map((b) => b.id));
    };

    const clearAll = () => {
      onSelectionChange([]);
    };

    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {/* Company Benefits Row */}
        <div
          className={cn(
            "flex w-full items-center gap-3",
            "rounded-2xl border px-4 py-3",
            "border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)]",
            disabled && "opacity-50"
          )}
        >
          {/* Icon */}
          <div className="shrink-0 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-red-500)] p-1">
            <ShieldPlus size={32} weight="fill" className="text-[var(--foreground-on-emphasis)]" />
          </div>

          {/* Label */}
          <span className="min-w-0 flex-1 text-body text-[var(--foreground-default)]">
            {companyName} Benefits
          </span>

          {/* Customize Button */}
          <Button
            variant="inverse"
            disabled={disabled}
            leftIcon={<PencilSimple weight="regular" className="h-5 w-5" />}
            onClick={() => setCustomizeOpen(true)}
          >
            Customize
          </Button>

          {/* Benefits Selection Modal */}
          <Modal open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Select Benefits</ModalTitle>
              </ModalHeader>
              <ModalBody>
                <div className="mb-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-caption text-foreground-link hover:text-foreground-link-hover"
                  >
                    Select all
                  </button>
                  <span className="text-foreground-muted">|</span>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-caption text-foreground-link hover:text-foreground-link-hover"
                  >
                    Clear all
                  </button>
                </div>
                <div className="max-h-96 space-y-4 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <div className="px-2 py-1 text-caption font-medium text-foreground-muted">
                        {category.name}
                      </div>
                      <div className="space-y-0.5">
                        {category.benefits.map((benefit) => {
                          const isSelected = selectedBenefits.includes(benefit.id);
                          return (
                            <button
                              key={benefit.id}
                              type="button"
                              onClick={() => toggleBenefit(benefit.id)}
                              className={cn(
                                "flex w-full items-center gap-2 rounded-md px-2 py-1.5",
                                "text-body-sm text-[var(--foreground-default)]",
                                "transition-colors duration-150",
                                isSelected
                                  ? "bg-[var(--background-interactive-selected)] text-[var(--foreground-interactive-selected)]"
                                  : "hover:bg-[var(--background-interactive-hover)]"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded border",
                                  "transition-all duration-150",
                                  isSelected
                                    ? "border-[var(--primitive-green-600)] bg-[var(--primitive-green-600)]"
                                    : "border-[var(--border-default)] bg-[var(--background-default)]"
                                )}
                              >
                                {isSelected && (
                                  <Check
                                    weight="bold"
                                    className="h-3 w-3 text-[var(--foreground-on-emphasis)]"
                                  />
                                )}
                              </span>
                              {benefit.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter className="justify-between">
                <span className="text-caption text-[var(--foreground-muted)]">
                  {selectedBenefits.length} benefits selected
                </span>
                <Button variant="primary" onClick={() => setCustomizeOpen(false)}>
                  Done
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>

        {/* Selected benefits display (when not using company defaults) */}
        {!useCompanyDefaults && selectedBenefitObjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedBenefitObjects.slice(0, 5).map((benefit) => (
              <Badge key={benefit.id} variant="secondary" className="gap-1 pr-1">
                {benefit.label}
                <button
                  type="button"
                  onClick={() => toggleBenefit(benefit.id)}
                  disabled={disabled}
                  className="ml-1 rounded-full p-0.5 transition-colors hover:bg-background-emphasized"
                >
                  <X weight="bold" className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedBenefitObjects.length > 5 && (
              <Badge variant="secondary">+{selectedBenefitObjects.length - 5} more</Badge>
            )}
          </div>
        )}
      </div>
    );
  }
);

BenefitsSelector.displayName = "BenefitsSelector";

export { BenefitsSelector };

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Badge } from "./badge";
import { PencilSimple, Plus, X, Check } from "@phosphor-icons/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

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
        {/* Company Benefits Toggle with Customize */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onUseCompanyDefaultsChange(!useCompanyDefaults);
              if (!useCompanyDefaults) {
                // When enabling company defaults, select all
                selectAll();
              }
            }}
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full border",
              "text-caption font-medium",
              "transition-all duration-150",
              useCompanyDefaults
                ? "bg-primary-100 border-primary-300 text-primary-800"
                : "bg-surface border-border text-foreground-muted hover:border-border-emphasis",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-5 h-5 rounded-full",
                useCompanyDefaults
                  ? "bg-primary-600 text-white"
                  : "bg-background-muted"
              )}
            >
              {useCompanyDefaults ? (
                <Check weight="bold" className="w-3 h-3" />
              ) : (
                <Plus weight="bold" className="w-3 h-3 text-foreground-muted" />
              )}
            </span>
            {companyName} Benefits
          </button>

          <Popover open={customizeOpen} onOpenChange={setCustomizeOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                leftIcon={<PencilSimple weight="regular" className="w-4 h-4" />}
                className="text-foreground-muted hover:text-foreground"
              >
                Customize
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-3 border-b border-border-muted">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Select Benefits
                  </span>
                  <div className="flex gap-2">
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
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto p-2">
                {categories.map((category) => (
                  <div key={category.id} className="mb-3 last:mb-0">
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
                              "flex items-center gap-2 w-full px-2 py-1.5 rounded-md",
                              "text-body-sm text-foreground",
                              "transition-colors duration-150",
                              isSelected
                                ? "bg-primary-100 text-primary-800"
                                : "hover:bg-background-muted"
                            )}
                          >
                            <span
                              className={cn(
                                "flex items-center justify-center w-4 h-4 rounded border",
                                "transition-all duration-150",
                                isSelected
                                  ? "bg-primary-600 border-primary-600"
                                  : "bg-surface border-border"
                              )}
                            >
                              {isSelected && (
                                <Check weight="bold" className="w-3 h-3 text-white" />
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
              <div className="p-3 border-t border-border-muted bg-background-subtle">
                <div className="text-caption text-foreground-muted">
                  {selectedBenefits.length} benefits selected
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected benefits display (when not using company defaults) */}
        {!useCompanyDefaults && selectedBenefitObjects.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedBenefitObjects.slice(0, 5).map((benefit) => (
              <Badge
                key={benefit.id}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {benefit.label}
                <button
                  type="button"
                  onClick={() => toggleBenefit(benefit.id)}
                  disabled={disabled}
                  className="ml-1 hover:bg-background-emphasized rounded-full p-0.5 transition-colors"
                >
                  <X weight="bold" className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {selectedBenefitObjects.length > 5 && (
              <Badge variant="secondary">
                +{selectedBenefitObjects.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }
);

BenefitsSelector.displayName = "BenefitsSelector";

export { BenefitsSelector };

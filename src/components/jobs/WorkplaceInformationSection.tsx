"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { FormCard, FormSection, FormField, FormRow } from "@/components/ui/form-section";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";

/**
 * WorkplaceInformationSection component
 * Based on Figma Design (188:6221)
 *
 * Contains:
 * - Workplace Type segmented controller (Onsite, Remote, Hybrid)
 * - Office Location fields (City, State, Country)
 */

export type WorkplaceType = "onsite" | "remote" | "hybrid";

export interface WorkplaceLocation {
  city?: string;
  state?: string;
  country?: string;
}

// Common US states
export const usStates = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "Washington D.C." },
];

// Common countries
export const countries = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "JP", label: "Japan" },
  { value: "SG", label: "Singapore" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "IE", label: "Ireland" },
  { value: "CH", label: "Switzerland" },
  { value: "AT", label: "Austria" },
  { value: "BE", label: "Belgium" },
  { value: "ES", label: "Spain" },
  { value: "IT", label: "Italy" },
  { value: "PT", label: "Portugal" },
  { value: "MX", label: "Mexico" },
  { value: "BR", label: "Brazil" },
  { value: "IN", label: "India" },
];

export interface WorkplaceInformationSectionProps {
  /** Selected workplace type */
  workplaceType?: WorkplaceType;
  /** Office location details */
  location?: WorkplaceLocation;
  /** Callback when workplace type changes */
  onWorkplaceTypeChange?: (type: WorkplaceType) => void;
  /** Callback when location changes */
  onLocationChange?: (location: WorkplaceLocation) => void;
  /** Whether to show location fields (hidden when fully remote) */
  showLocationFields?: boolean;
  /** Additional class names */
  className?: string;
}

const workplaceTypeOptions = [
  { value: "onsite", label: "Onsite" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

const WorkplaceInformationSection = React.forwardRef<
  HTMLDivElement,
  WorkplaceInformationSectionProps
>(
  (
    {
      workplaceType = "onsite",
      location = {},
      onWorkplaceTypeChange,
      onLocationChange,
      showLocationFields = true,
      className,
    },
    ref
  ) => {
    const handleLocationFieldChange = (
      field: keyof WorkplaceLocation,
      value: string
    ) => {
      onLocationChange?.({
        ...location,
        [field]: value,
      });
    };

    // Determine if location fields should be shown
    // Show for onsite and hybrid, optionally hide for remote
    const shouldShowLocation = showLocationFields && workplaceType !== "remote";

    return (
      <FormCard ref={ref} className={className}>
        <FormSection title="Workplace Information">
          {/* Workplace Type */}
          <FormField label="Workplace Type" required>
            <SegmentedController
              options={workplaceTypeOptions}
              value={workplaceType}
              onValueChange={(value) =>
                onWorkplaceTypeChange?.(value as WorkplaceType)
              }
              aria-label="Select workplace type"
            />
          </FormField>

          {/* Office Location */}
          {shouldShowLocation && (
            <FormField label="Office Location">
              <div className="grid grid-cols-3 gap-4">
                {/* City - Text Input */}
                <Input
                  placeholder="City"
                  value={location.city || ""}
                  onChange={(e) =>
                    handleLocationFieldChange("city", e.target.value)
                  }
                />

                {/* State - Dropdown */}
                <Select
                  value={location.state}
                  onValueChange={(value) =>
                    handleLocationFieldChange("state", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Country - Dropdown */}
                <Select
                  value={location.country}
                  onValueChange={(value) =>
                    handleLocationFieldChange("country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </FormField>
          )}

          {/* Show a note for remote positions */}
          {workplaceType === "remote" && (
            <p className="text-sm text-[var(--primitive-neutral-500)]">
              This position is fully remote. Location fields are optional.
            </p>
          )}
        </FormSection>
      </FormCard>
    );
  }
);

WorkplaceInformationSection.displayName = "WorkplaceInformationSection";

export { WorkplaceInformationSection };

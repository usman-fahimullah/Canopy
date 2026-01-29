"use client";

import * as React from "react";
import {
  RoleInformationSection,
  EducationRequirementsSection,
  WorkplaceInformationSection,
  CompensationBenefitsSection,
  type EducationLevel,
  type WorkplaceType,
  type WorkplaceLocation,
  type CompensationData,
} from "@/components/jobs";

/**
 * Demo page showcasing all 4 job form section components
 *
 * These components implement the Figma designs:
 * - 188:6104 - Role Information
 * - 188:6193 - Education Requirements
 * - 188:6221 - Workplace Information
 * - 188:6234 - Compensation & Benefits
 */
export default function JobFormDemoPage() {
  // Role Information state
  const [roleDescription, setRoleDescription] = React.useState("");
  const [responsibilities, setResponsibilities] = React.useState("");
  const [requiredQualifications, setRequiredQualifications] = React.useState("");
  const [desiredQualifications, setDesiredQualifications] = React.useState("");

  // Education Requirements state
  const [educationLevel, setEducationLevel] = React.useState<EducationLevel>();
  const [specificEducation, setSpecificEducation] = React.useState("");

  // Workplace Information state
  const [workplaceType, setWorkplaceType] = React.useState<WorkplaceType>("onsite");
  const [location, setLocation] = React.useState<WorkplaceLocation>({});

  // Compensation & Benefits state
  const [compensation, setCompensation] = React.useState<CompensationData>({
    payFrequency: "weekly",
  });
  const [selectedBenefits, setSelectedBenefits] = React.useState<string[]>([]);
  const [useCompanyDefaults, setUseCompanyDefaults] = React.useState(true);
  const [additionalDetails, setAdditionalDetails] = React.useState("");

  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            Job Posting Form Demo
          </h1>
          <p className="text-[var(--primitive-neutral-600)]">
            Demonstrating the 4 job form section components from Figma
          </p>
        </div>

        {/* Role Information Section */}
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

        {/* Education Requirements Section */}
        <EducationRequirementsSection
          educationLevel={educationLevel}
          specificRequirements={specificEducation}
          onEducationLevelChange={setEducationLevel}
          onSpecificRequirementsChange={setSpecificEducation}
        />

        {/* Workplace Information Section */}
        <WorkplaceInformationSection
          workplaceType={workplaceType}
          location={location}
          onWorkplaceTypeChange={setWorkplaceType}
          onLocationChange={setLocation}
        />

        {/* Compensation & Benefits Section */}
        <CompensationBenefitsSection
          compensation={compensation}
          selectedBenefits={selectedBenefits}
          useCompanyDefaults={useCompanyDefaults}
          additionalDetails={additionalDetails}
          onCompensationChange={setCompensation}
          onBenefitsChange={setSelectedBenefits}
          onUseCompanyDefaultsChange={setUseCompanyDefaults}
          onAdditionalDetailsChange={setAdditionalDetails}
          companyName="Acme Corp"
        />

        {/* Debug output */}
        <details className="bg-white rounded-2xl border border-[var(--primitive-neutral-200)] p-6">
          <summary className="cursor-pointer text-lg font-medium text-black">
            Form State (Debug)
          </summary>
          <pre className="mt-4 text-sm text-[var(--primitive-neutral-600)] overflow-auto">
            {JSON.stringify(
              {
                roleDescription: roleDescription.slice(0, 100) + "...",
                responsibilities: responsibilities.slice(0, 100) + "...",
                requiredQualifications: requiredQualifications.slice(0, 100) + "...",
                desiredQualifications: desiredQualifications.slice(0, 100) + "...",
                educationLevel,
                specificEducation: specificEducation.slice(0, 100) + "...",
                workplaceType,
                location,
                compensation,
                selectedBenefits,
                useCompanyDefaults,
                additionalDetails: additionalDetails.slice(0, 100) + "...",
              },
              null,
              2
            )}
          </pre>
        </details>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { SegmentedController } from "@/components/ui/segmented-controller";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { RichTextEditor, RichTextToolbar } from "@/components/ui/rich-text-editor";
import { RichTextCharacterCounter } from "@/components/ui/character-counter";
import { BenefitsSelector, defaultBenefitCategories } from "@/components/ui/benefits-selector";
import {
  FormCard,
  FormSection,
  FormField,
  FormTitleInput,
  FormRow,
} from "@/components/ui/form-section";
import type { JobPostState } from "../_lib/use-role-form";
import {
  jobCategories,
  positionTypes,
  experienceLevels,
  educationLevels,
  payTypes,
  usStates,
  countries,
} from "../_lib/constants";
import { JobPostSidebar } from "./JobPostSidebar";

// ============================================
// TYPES
// ============================================

interface JobPostTabProps {
  jobPostState: JobPostState;
}

// ============================================
// COMPONENT
// ============================================

export function JobPostTab({ jobPostState }: JobPostTabProps) {
  const {
    roleTitle,
    setRoleTitle,
    jobCategory,
    setJobCategory,
    positionType,
    setPositionType,
    experienceLevel,
    setExperienceLevel,
    description,
    setDescription,
    responsibilities,
    setResponsibilities,
    requiredQuals,
    setRequiredQuals,
    desiredQuals,
    setDesiredQuals,
    educationLevel,
    setEducationLevel,
    educationDetails,
    setEducationDetails,
    workplaceType,
    setWorkplaceType,
    city,
    setCity,
    state,
    setState,
    country,
    setCountry,
    payType,
    setPayType,
    minPay,
    setMinPay,
    maxPay,
    setMaxPay,
    payFrequency,
    setPayFrequency,
    useCompanyBenefits,
    setUseCompanyBenefits,
    selectedBenefits,
    setSelectedBenefits,
    compensationDetails,
    setCompensationDetails,
    showRecruiter,
    setShowRecruiter,
    recruiterId,
    setRecruiterId,
    showHiringManager,
    setShowHiringManager,
    hiringManagerId,
    setHiringManagerId,
    orgMembers,
    reviewerIds,
    setReviewerIds,
    closingDate,
    setClosingDate,
    externalLink,
    setExternalLink,
    requireResume,
    setRequireResume,
    requireCoverLetter,
    setRequireCoverLetter,
    requirePortfolio,
    setRequirePortfolio,
    templateSaved,
    savingTemplate,
    handleSaveTemplate,
  } = jobPostState;

  return (
    <div className="flex flex-col gap-4 xl:flex-row">
      {/* Left Column - Form */}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {/* Basic Info Card */}
        <FormCard>
          <FormTitleInput
            placeholder="Untitled Role"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            required
          />

          <FormField label="Job Category" required>
            <Select value={jobCategory} onValueChange={setJobCategory}>
              <SelectTrigger size="lg">
                <SelectValue placeholder="Select a Job Category" />
              </SelectTrigger>
              <SelectContent>
                {jobCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormRow columns={2}>
            <FormField label="Position Type" required>
              <Select value={positionType} onValueChange={setPositionType}>
                <SelectTrigger size="lg">
                  <SelectValue placeholder="Select a Position Type" />
                </SelectTrigger>
                <SelectContent>
                  {positionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Level of Experience" required>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger size="lg">
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </FormRow>
        </FormCard>

        {/* Role Information Card */}
        <FormCard>
          <FormSection title="Role Information">
            <FormField
              label="Role Description"
              required
              helpText="Provide a detailed overview of the responsibilities and qualifications expected from the job applicant."
            >
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Write your role description here"
                minHeight="100px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              <div className="mt-2 flex justify-end">
                <RichTextCharacterCounter htmlContent={description} max={250} />
              </div>
            </FormField>

            <FormField
              label="Primary Responsibilities"
              helpText="What are the key responsibilities a candidate must fulfill to be considered for this role?"
            >
              <RichTextEditor
                content={responsibilities}
                onChange={setResponsibilities}
                placeholder="What are the primary responsibilities for this job?"
                minHeight="100px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              <div className="mt-2 flex justify-end">
                <RichTextCharacterCounter htmlContent={responsibilities} max={250} />
              </div>
            </FormField>

            <FormField
              label="Required Qualifications"
              helpText="What are the essential qualifications required for a candidate to be eligible for consideration for this role."
            >
              <RichTextEditor
                content={requiredQuals}
                onChange={setRequiredQuals}
                placeholder="What are the required qualifications for this job?"
                minHeight="100px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              <div className="mt-2 flex justify-end">
                <RichTextCharacterCounter htmlContent={requiredQuals} max={250} />
              </div>
            </FormField>

            <FormField
              label="Desired Qualifications"
              helpText="What are the qualifications that, while not mandatory, are highly advantageous for the position."
            >
              <RichTextEditor
                content={desiredQuals}
                onChange={setDesiredQuals}
                placeholder="What are the desired qualifications for this job?"
                minHeight="100px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              <div className="mt-2 flex justify-end">
                <RichTextCharacterCounter htmlContent={desiredQuals} max={250} />
              </div>
            </FormField>
          </FormSection>
        </FormCard>

        {/* Education Requirements Card */}
        <FormCard>
          <FormSection title="Education Requirements">
            <FormField label="Education Level">
              <Select value={educationLevel} onValueChange={setEducationLevel}>
                <SelectTrigger size="lg">
                  <SelectValue placeholder="Education Level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              label="Specific Education Requirements"
              helpText="Outline the degrees, credentials, and training required to support students with disabilities and diverse learning needs effectively."
            >
              <RichTextEditor
                content={educationDetails}
                onChange={setEducationDetails}
                placeholder="Add any information regarding any specific education requirements"
                minHeight="100px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              <div className="mt-2 flex justify-end">
                <RichTextCharacterCounter htmlContent={educationDetails} max={250} />
              </div>
            </FormField>
          </FormSection>
        </FormCard>

        {/* Workplace Information Card */}
        <FormCard>
          <FormSection title="Workplace Information">
            <FormField label="Workplace Type" required>
              <SegmentedController
                options={[
                  { value: "onsite", label: "Onsite" },
                  { value: "remote", label: "Remote" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
                value={workplaceType}
                onValueChange={setWorkplaceType}
              />
            </FormField>

            {workplaceType !== "remote" && (
              <FormField label="Office Location">
                <FormRow columns={3}>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    inputSize="lg"
                  />
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger size="lg">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger size="lg">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormRow>
              </FormField>
            )}
          </FormSection>
        </FormCard>

        {/* Compensation & Benefits Card */}
        <FormCard>
          <FormSection title="Compensation & Benefits Information">
            <FormField
              label="Compensation"
              helpText="Outline the pay range, and incentives needed to fairly reward, attract, and retain someone in this role."
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <Select value={payType} onValueChange={setPayType}>
                  <SelectTrigger size="lg" className="w-full md:w-[340px]">
                    <SelectValue placeholder="Pay Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {payTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={minPay}
                  onChange={(e) => setMinPay(e.target.value)}
                  placeholder="Minimum Pay Amount"
                  inputSize="lg"
                  leftAddon={<span className="text-body font-medium">$</span>}
                  className="flex-1"
                />
                <span className="text-[var(--primitive-neutral-500)]">—</span>
                <Input
                  value={maxPay}
                  onChange={(e) => setMaxPay(e.target.value)}
                  placeholder="Maximum Pay Amount"
                  inputSize="lg"
                  leftAddon={<span className="text-body font-medium">$</span>}
                  className="flex-1"
                />
              </div>
            </FormField>

            <FormField label="Pay frequency">
              <SegmentedController
                options={[
                  { value: "weekly", label: "Weekly" },
                  { value: "bi-weekly", label: "Bi-Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
                value={payFrequency}
                onValueChange={setPayFrequency}
              />
            </FormField>

            <FormField
              label="Benefits"
              helpText="Outline the benefits needed to fairly reward, attract, and retain someone in this role."
            >
              <BenefitsSelector
                categories={defaultBenefitCategories}
                selectedBenefits={selectedBenefits}
                onSelectionChange={setSelectedBenefits}
                useCompanyDefaults={useCompanyBenefits}
                onUseCompanyDefaultsChange={setUseCompanyBenefits}
                companyName="Company"
              />
              <RichTextEditor
                content={compensationDetails}
                onChange={setCompensationDetails}
                placeholder="Add any details on compensation or benefits."
                minHeight="100px"
              >
                <RichTextToolbar />
              </RichTextEditor>
              <div className="mt-2 flex justify-end">
                <RichTextCharacterCounter htmlContent={compensationDetails} max={250} />
              </div>
            </FormField>
          </FormSection>
        </FormCard>
      </div>

      {/* Right Column - Sidebar */}
      <JobPostSidebar
        showRecruiter={showRecruiter}
        setShowRecruiter={setShowRecruiter}
        recruiterId={recruiterId}
        setRecruiterId={setRecruiterId}
        showHiringManager={showHiringManager}
        setShowHiringManager={setShowHiringManager}
        hiringManagerId={hiringManagerId}
        setHiringManagerId={setHiringManagerId}
        reviewerIds={reviewerIds}
        setReviewerIds={setReviewerIds}
        orgMembers={orgMembers}
        closingDate={closingDate}
        setClosingDate={setClosingDate}
        externalLink={externalLink}
        setExternalLink={setExternalLink}
        requireResume={requireResume}
        setRequireResume={setRequireResume}
        requireCoverLetter={requireCoverLetter}
        setRequireCoverLetter={setRequireCoverLetter}
        requirePortfolio={requirePortfolio}
        setRequirePortfolio={setRequirePortfolio}
        templateSaved={templateSaved}
        savingTemplate={savingTemplate}
        handleSaveTemplate={handleSaveTemplate}
      />
    </div>
  );
}

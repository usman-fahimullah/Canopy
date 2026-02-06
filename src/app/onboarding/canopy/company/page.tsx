"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui";
import { Camera, GlobeSimple, MapPin } from "@phosphor-icons/react";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

const MAX_DESCRIPTION_LENGTH = 250;

const companySizeOptions = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-1000", label: "201–1,000 employees" },
  { value: "1000+", label: "1,000+ employees" },
];

const pathwayOptions = [
  { value: "renewable-energy", label: "Renewable Energy" },
  { value: "clean-transportation", label: "Clean Transportation" },
  { value: "sustainable-agriculture", label: "Sustainable Agriculture" },
  { value: "circular-economy", label: "Circular Economy" },
  { value: "climate-tech", label: "Climate Tech" },
  { value: "environmental-consulting", label: "Environmental Consulting" },
  { value: "green-building", label: "Green Building" },
  { value: "water-management", label: "Water Management" },
  { value: "biodiversity", label: "Biodiversity & Conservation" },
  { value: "esg-finance", label: "ESG & Sustainable Finance" },
];

export default function EmployerCompanyPage() {
  const router = useRouter();
  const { employerData, setEmployerData } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = EMPLOYER_STEPS[0]; // company
  const canContinue = employerData.companyName.trim().length > 0;

  const descriptionLength = employerData.companyDescription.length;

  function handleDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setEmployerData({ companyDescription: value });
    }
  }

  async function handleContinue() {
    if (!canContinue) return;
    setLoading(true);
    setError(null);

    try {
      router.push("/onboarding/canopy/your-role");
    } catch {
      setError(
        "Could not connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={0}
      totalSteps={EMPLOYER_STEPS.length}
      rightPanel={
        <Image
          src="/illustrations/employer-onboarding-companyworkspace.png"
          alt="Build your company workspace"
          width={560}
          height={560}
          className="h-auto w-full object-contain"
          priority
        />
      }
      footer={
        <StepNavigation onContinue={handleContinue} canContinue={canContinue} loading={loading} />
      }
    >
      <div className="space-y-6">
        {/* Company Name + Upload Logo */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Company Name
          </label>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter the name of your company"
                value={employerData.companyName}
                onChange={(e) => setEmployerData({ companyName: e.target.value })}
                autoFocus
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 gap-2"
              leftIcon={<Camera size={18} weight="fill" />}
            >
              Upload company logo
            </Button>
          </div>
        </div>

        {/* Company Description with character counter */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Company description
          </label>
          <div className="relative">
            <Textarea
              placeholder="Write a brief company description"
              value={employerData.companyDescription}
              onChange={handleDescriptionChange}
              rows={4}
              className="resize-none"
            />
            <span className="absolute bottom-3 right-4 text-caption-sm text-[var(--foreground-subtle)]">
              {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
        </div>

        {/* Company Website + Company Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
              Company website
            </label>
            <Input
              placeholder="Company URL"
              value={employerData.companyWebsite}
              onChange={(e) => setEmployerData({ companyWebsite: e.target.value })}
              type="url"
              leftAddon={<GlobeSimple size={20} weight="regular" />}
            />
          </div>
          <div>
            <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
              Company Location
            </label>
            <Input
              placeholder="Enter your location"
              value={employerData.companyLocation}
              onChange={(e) => setEmployerData({ companyLocation: e.target.value })}
              leftAddon={<MapPin size={20} weight="regular" />}
            />
          </div>
        </div>

        {/* Company Size */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Company Size
          </label>
          <Dropdown
            value={employerData.companySize ?? undefined}
            onValueChange={(val: string) => setEmployerData({ companySize: val })}
          >
            <DropdownTrigger className="w-full">
              <DropdownValue placeholder="How big is your company" />
            </DropdownTrigger>
            <DropdownContent>
              {companySizeOptions.map((opt) => (
                <DropdownItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Company Pathway */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Company Pathway
          </label>
          <Dropdown
            value={employerData.industries[0] ?? undefined}
            onValueChange={(val: string) => setEmployerData({ industries: [val] })}
          >
            <DropdownTrigger className="w-full">
              <DropdownValue placeholder="Select a pathway" />
            </DropdownTrigger>
            <DropdownContent>
              {pathwayOptions.map((opt) => (
                <DropdownItem key={opt.value} value={opt.value}>
                  {opt.label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {error && <InlineMessage variant="critical">{error}</InlineMessage>}
      </div>
    </OnboardingShell>
  );
}

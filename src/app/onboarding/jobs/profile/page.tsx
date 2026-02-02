"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Phone, MapPin } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { FormCard, FormField } from "@/components/ui/form-section";
import { TALENT_STEPS } from "@/lib/onboarding/types";

const pronounOptions = [
  { value: "he/him", label: "He/Him" },
  { value: "she/her", label: "She/Her" },
  { value: "they/them", label: "They/Them" },
  { value: "ze/zir", label: "Ze/Zir" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const ethnicityOptions = [
  { value: "american-indian", label: "American Indian or Alaska Native" },
  { value: "asian", label: "Asian" },
  { value: "black", label: "Black or African American" },
  { value: "hispanic", label: "Hispanic or Latino" },
  { value: "middle-eastern", label: "Middle Eastern or North African" },
  { value: "native-hawaiian", label: "Native Hawaiian or Pacific Islander" },
  { value: "white", label: "White" },
  { value: "multiracial", label: "Multiracial" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

export default function TalentProfilePage() {
  const router = useRouter();
  const { baseProfile, setBaseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step = TALENT_STEPS[0]; // profile
  // Location is the only truly required field for profile step
  const canContinue = baseProfile.location.trim().length > 0;

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the uploaded file
    const url = URL.createObjectURL(file);
    setBaseProfile({ profilePhotoUrl: url });
  }

  async function handleContinue() {
    if (!canContinue) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-profile",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          pronouns: baseProfile.pronouns || undefined,
          ethnicity: baseProfile.ethnicity || undefined,
          phone: baseProfile.phone || undefined,
          location: baseProfile.location || undefined,
          profilePhotoUrl: baseProfile.profilePhotoUrl || undefined,
        }),
      });

      if (res.status === 401) {
        router.push("/auth/redirect");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/onboarding/jobs/career");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell
      shell="talent"
      step={step}
      currentStepIndex={0}
      totalSteps={TALENT_STEPS.length}
      rightPanel={
        <Image
          src="/illustrations/onboarding-profile.svg"
          alt=""
          width={400}
          height={400}
          className="max-w-[80%]"
          priority
        />
      }
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding")}
          onContinue={handleContinue}
          canContinue={canContinue}
          loading={loading}
        />
      }
    >
      <div className="space-y-6">
        {/* Profile photo */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-24 w-24 overflow-hidden rounded-full bg-[var(--background-subtle)] transition-all hover:ring-2 hover:ring-[var(--border-interactive-focus)] hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2"
          >
            {baseProfile.profilePhotoUrl ? (
              <img
                src={baseProfile.profilePhotoUrl}
                alt="Profile photo"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Camera size={32} weight="regular" className="text-[var(--foreground-subtle)]" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <Camera
                size={24}
                weight="bold"
                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        {/* Pronouns */}
        <FormCard>
          <FormField label="Pronouns">
            <Dropdown
              value={baseProfile.pronouns}
              onValueChange={(value) => setBaseProfile({ pronouns: value })}
            >
              <DropdownTrigger>
                <DropdownValue placeholder="Select your pronouns" />
              </DropdownTrigger>
              <DropdownContent>
                {pronounOptions.map((option) => (
                  <DropdownItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </FormField>
        </FormCard>

        {/* Ethnicity */}
        <FormCard>
          <FormField label="Ethnicity" helpText="Used for diversity reporting only">
            <Dropdown
              value={baseProfile.ethnicity}
              onValueChange={(value) => setBaseProfile({ ethnicity: value })}
            >
              <DropdownTrigger>
                <DropdownValue placeholder="Select your ethnicity" />
              </DropdownTrigger>
              <DropdownContent>
                {ethnicityOptions.map((option) => (
                  <DropdownItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </FormField>
        </FormCard>

        {/* Phone number */}
        <FormCard>
          <FormField label="Phone number" helpText="Optional">
            <Input
              placeholder="(555) 123-4567"
              value={baseProfile.phone}
              onChange={(e) => setBaseProfile({ phone: e.target.value })}
              type="tel"
              autoComplete="tel"
              leftAddon={<Phone weight="regular" />}
            />
          </FormField>
        </FormCard>

        {/* Location */}
        <FormCard>
          <FormField label="Location" required>
            <Input
              placeholder="City, State"
              value={baseProfile.location}
              onChange={(e) => setBaseProfile({ location: e.target.value })}
              autoComplete="address-level2"
              leftAddon={<MapPin weight="regular" />}
            />
          </FormField>
        </FormCard>

        {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}
      </div>
    </OnboardingShell>
  );
}

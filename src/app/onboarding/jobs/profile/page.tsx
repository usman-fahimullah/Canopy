"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, MapPin } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
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
  const canContinue = baseProfile.location.trim().length > 0;

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
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
          firstName: baseProfile.firstName || undefined,
          lastName: baseProfile.lastName || undefined,
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
      firstName={baseProfile.firstName}
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
      <div className="flex flex-col gap-6">
        {/* Upload Profile Photo — tertiary button with camera icon */}
        <div>
          <Button
            variant="tertiary"
            leftIcon={<Camera size={20} weight="fill" />}
            onClick={() => fileInputRef.current?.click()}
          >
            {baseProfile.profilePhotoUrl ? "Change Profile Photo" : "Upload Profile Photo"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          {baseProfile.profilePhotoUrl && (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={baseProfile.profilePhotoUrl}
                alt="Profile preview"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-caption text-[var(--foreground-muted)]">Photo uploaded</span>
            </div>
          )}
        </div>

        {/* Pronouns */}
        <div className="flex flex-col gap-2">
          <label className="text-caption text-[var(--primitive-green-800)]">
            What are your pronouns
          </label>
          <Dropdown
            value={baseProfile.pronouns}
            onValueChange={(value) => setBaseProfile({ pronouns: value })}
          >
            <DropdownTrigger>
              <DropdownValue placeholder="Select a pronoun" />
            </DropdownTrigger>
            <DropdownContent>
              {pronounOptions.map((option) => (
                <DropdownItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Ethnicity */}
        <div className="flex flex-col gap-2">
          <label className="text-caption text-[var(--primitive-green-800)]">
            What&apos;s your ethnicity
          </label>
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
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-[var(--primitive-green-800)]">
            Phone Number (Optional)
          </label>
          <Input
            placeholder="Enter your phone number"
            value={baseProfile.phone}
            onChange={(e) => setBaseProfile({ phone: e.target.value })}
            type="tel"
            autoComplete="tel"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-[var(--primitive-green-800)]">
            Your Location
          </label>
          <Input
            placeholder="Enter your location"
            value={baseProfile.location}
            onChange={(e) => setBaseProfile({ location: e.target.value })}
            autoComplete="address-level2"
            leftAddon={<MapPin weight="regular" />}
          />
        </div>

        {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}
      </div>
    </OnboardingShell>
  );
}

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";
import { Camera } from "@phosphor-icons/react";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

function isValidLinkedInUrl(url: string): boolean {
  if (!url) return true; // Empty is fine (optional field)
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === "https:" || parsed.protocol === "http:") &&
      (parsed.hostname === "linkedin.com" ||
        parsed.hostname === "www.linkedin.com" ||
        parsed.hostname.endsWith(".linkedin.com"))
    );
  } catch {
    return false;
  }
}

export default function EmployerYourRolePage() {
  const router = useRouter();
  const { employerData, setEmployerData, baseProfile, setBaseProfile } = useOnboardingForm();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [linkedinTouched, setLinkedinTouched] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step = EMPLOYER_STEPS[1]; // your-role

  const linkedinValid = isValidLinkedInUrl(baseProfile.linkedinUrl);
  const canContinue =
    employerData.userTitle.trim().length > 0 && (baseProfile.linkedinUrl === "" || linkedinValid);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setPhotoError("Unsupported file format. Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("This image is too large. Please choose a file under 5 MB.");
      return;
    }

    setUploadingPhoto(true);
    setPhotoError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/photo", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setPhotoError(data.error || "Upload failed. Please check your connection and try again.");
        return;
      }

      const { url } = await res.json();
      setBaseProfile({ profilePhotoUrl: url });
    } catch {
      setPhotoError(
        "Could not connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={1}
      totalSteps={EMPLOYER_STEPS.length}
      companyName={employerData.companyName}
      rightPanel={
        <Image
          src="/illustrations/employer-onboarding-whatdoyoudo.png"
          alt="What do you do"
          width={560}
          height={560}
          className="h-auto w-full object-contain"
          priority
        />
      }
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/company")}
          onContinue={() => router.push("/onboarding/canopy/invite-team")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {/* Job Title */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
            Job Title
          </label>
          <Input
            placeholder="What is your job title?"
            value={employerData.userTitle}
            onChange={(e) => setEmployerData({ userTitle: e.target.value })}
            autoFocus
          />
        </div>

        {/* Phone Number (Optional) */}
        <div>
          <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
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

        {/* LinkedIn Section */}
        <div className="space-y-4">
          <p className="text-body font-medium text-[var(--primitive-green-800)]">
            Connect your LinkedIn Profile to Green Jobs Board
          </p>
          <div>
            <label className="mb-3 block text-caption font-bold text-[var(--primitive-green-800)]">
              LinkedIn URL
            </label>
            <Input
              placeholder="https://www.linkedin.com/in/your-profile"
              value={baseProfile.linkedinUrl}
              onChange={(e) => setBaseProfile({ linkedinUrl: e.target.value })}
              onBlur={() => setLinkedinTouched(true)}
              autoComplete="url"
            />
            {linkedinTouched && !linkedinValid && baseProfile.linkedinUrl.length > 0 && (
              <p className="mt-2 text-caption text-[var(--foreground-error)]">
                Please enter a valid LinkedIn URL (e.g. https://www.linkedin.com/in/your-profile)
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[var(--border-muted)]" />

        {/* Profile Photo Upload */}
        <div className="space-y-4">
          <p className="text-body text-[var(--foreground-default)]">
            Add a photo to help build trust with potential applicants
          </p>
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            leftIcon={<Camera size={18} weight="fill" />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingPhoto}
            loading={uploadingPhoto}
          >
            {uploadingPhoto
              ? "Uploading..."
              : baseProfile.profilePhotoUrl
                ? "Change Profile Photo"
                : "Upload your profile photo"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          {baseProfile.profilePhotoUrl && (
            <div className="flex items-center gap-3">
              <img
                src={baseProfile.profilePhotoUrl}
                alt="Profile preview"
                className="h-10 w-10 rounded-full object-cover"
                onError={() => {
                  setBaseProfile({ profilePhotoUrl: "" });
                  setPhotoError("Your profile photo could not be loaded. Please upload it again.");
                }}
              />
              <span className="text-caption text-[var(--foreground-muted)]">Photo uploaded</span>
            </div>
          )}
          {photoError && <InlineMessage variant="critical">{photoError}</InlineMessage>}
        </div>
      </div>
    </OnboardingShell>
  );
}

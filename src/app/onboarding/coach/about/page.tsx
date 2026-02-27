"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField, FormRow } from "@/components/ui/form-section";
import { InlineMessage } from "@/components/ui/inline-message";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";
import { Camera, User } from "@phosphor-icons/react";
import { useRef, useState, useCallback } from "react";

const TAGLINE_MAX = 60;

export default function CoachAboutPage() {
  const router = useRouter();
  const { coachData, setCoachData, baseProfile, setBaseProfile } = useOnboardingForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string>(coachData.photoUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const step = COACH_STEPS[0]; // about
  const canContinue =
    baseProfile.firstName.trim().length > 0 &&
    baseProfile.lastName.trim().length > 0 &&
    coachData.tagline.trim().length >= 10 &&
    coachData.bio.trim().length >= 100 &&
    coachData.location.trim().length > 0;

  const handlePhotoSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setPhotoError(null);

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        setPhotoError("Unsupported file format. Please upload a JPEG, PNG, WebP, or GIF image.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("This image is too large. Please choose a file under 5 MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        setCoachData({ photoUrl: dataUrl });
      };
      reader.onerror = () => {
        setPhotoError("Could not read this file. Please try a different image.");
      };
      reader.readAsDataURL(file);
    },
    [setCoachData]
  );

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
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: coachData.bio || undefined,
        }),
      });

      if (res.status === 401) {
        router.push("/auth/redirect");
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "We couldn\u2019t save your profile. Please try again.");
        return;
      }

      router.push("/onboarding/coach/expertise");
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
      shell="coach"
      step={step}
      currentStepIndex={0}
      totalSteps={COACH_STEPS.length}
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
        {/* About you */}
        <FormCard>
          <FormRow>
            <FormField label="First name" required>
              <Input
                placeholder="Jane"
                value={baseProfile.firstName}
                onChange={(e) => setBaseProfile({ firstName: e.target.value })}
                autoComplete="given-name"
                autoFocus
              />
            </FormField>
            <FormField label="Last name" required>
              <Input
                placeholder="Doe"
                value={baseProfile.lastName}
                onChange={(e) => setBaseProfile({ lastName: e.target.value })}
                autoComplete="family-name"
              />
            </FormField>
          </FormRow>

          <FormField
            label="LinkedIn URL"
            helpText="Optional, but helps build your professional credibility"
          >
            <Input
              placeholder="https://linkedin.com/in/your-profile"
              value={baseProfile.linkedinUrl}
              onChange={(e) => setBaseProfile({ linkedinUrl: e.target.value })}
              autoComplete="url"
            />
          </FormField>
        </FormCard>

        {/* Profile Photo */}
        <FormCard>
          <FormField
            label="Profile photo"
            helpText="Add a photo that shows your face clearly. Clients are more likely to book coaches with photos."
          >
            <div className="flex items-start gap-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "group relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all",
                  "border-[var(--border-default)] hover:border-[var(--border-interactive-focus)]",
                  "bg-[var(--background-subtle)] hover:bg-[var(--background-interactive-hover)]"
                )}
              >
                {photoPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera
                        size={24}
                        weight="bold"
                        className="text-[var(--foreground-on-emphasis)]"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <User size={32} weight="light" className="text-[var(--foreground-subtle)]" />
                    <span className="text-caption-sm text-[var(--foreground-subtle)]">
                      Add photo
                    </span>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoSelect}
              />
              <div className="text-caption text-[var(--foreground-muted)]">
                <p className="mb-2 font-medium text-[var(--foreground-default)]">
                  Tips for a great photo
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Face clearly visible</li>
                  <li>Good lighting</li>
                  <li>Professional but approachable</li>
                  <li>Solid or simple background</li>
                </ul>
              </div>
            </div>
            {photoError && (
              <div className="mt-2">
                <InlineMessage variant="critical">{photoError}</InlineMessage>
              </div>
            )}
          </FormField>
        </FormCard>

        {/* Tagline & Bio */}
        <FormCard>
          <FormField
            label="Tagline"
            required
            helpText="A short headline that tells clients who you are"
          >
            <Input
              placeholder='e.g. "Helping climate professionals find their path"'
              value={coachData.tagline}
              onChange={(e) => {
                if (e.target.value.length <= TAGLINE_MAX) {
                  setCoachData({ tagline: e.target.value });
                }
              }}
            />
            <p className="mt-1 text-caption-sm text-[var(--foreground-muted)]">
              {coachData.tagline.length}/{TAGLINE_MAX} characters
            </p>
          </FormField>

          <FormField
            label="Bio"
            required
            helpText="Tell potential clients about your background and approach (100+ characters)"
          >
            <Textarea
              placeholder="Share your coaching philosophy, background, and what makes you passionate about helping people transition into climate careers..."
              value={coachData.bio}
              onChange={(e) => setCoachData({ bio: e.target.value })}
              rows={5}
            />
            <p
              className={cn(
                "mt-1 text-caption-sm",
                coachData.bio.length < 100
                  ? "text-[var(--foreground-error)]"
                  : "text-[var(--foreground-muted)]"
              )}
            >
              {coachData.bio.length} characters
              {coachData.bio.length < 100 && " (minimum 100)"}
              {coachData.bio.length >= 100 && coachData.bio.length < 500 && " — 500+ recommended"}
            </p>
          </FormField>
        </FormCard>

        {/* Location */}
        <FormCard>
          <FormField
            label="Location"
            required
            helpText="Where are you based? This helps clients in your timezone find you."
          >
            <Input
              placeholder="e.g. San Francisco, CA"
              value={coachData.location}
              onChange={(e) => setCoachData({ location: e.target.value })}
            />
          </FormField>
        </FormCard>

        {error && <InlineMessage variant="critical">{error}</InlineMessage>}
      </div>
    </OnboardingShell>
  );
}

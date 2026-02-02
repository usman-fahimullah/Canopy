"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import {
  useOnboardingForm,
  type TeamInviteEntry,
} from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormCard, FormField } from "@/components/ui/form-section";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui";
import { Plus, Trash, EnvelopeSimple, Users } from "@phosphor-icons/react";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

const roleOptions = [
  { value: "RECRUITER", label: "Recruiter" },
  { value: "MEMBER", label: "Hiring Team" },
];

function createEmptyInvite(): TeamInviteEntry {
  return { email: "", role: "RECRUITER" };
}

export default function EmployerInviteTeamPage() {
  const router = useRouter();
  const { employerData, setEmployerData, baseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = EMPLOYER_STEPS[5]; // invite-team

  // Initialize with one empty row if no invites yet
  const invites =
    employerData.teamInvites.length > 0
      ? employerData.teamInvites
      : [createEmptyInvite()];

  function updateInvite(index: number, updates: Partial<TeamInviteEntry>) {
    const updated = invites.map((inv, i) =>
      i === index ? { ...inv, ...updates } : inv
    );
    setEmployerData({ teamInvites: updated });
  }

  function addRow() {
    setEmployerData({ teamInvites: [...invites, createEmptyInvite()] });
  }

  function removeRow(index: number) {
    const updated = invites.filter((_, i) => i !== index);
    setEmployerData({
      teamInvites: updated.length > 0 ? updated : [createEmptyInvite()],
    });
  }

  // Filter to only non-empty emails for submission
  const validInvites = invites.filter(
    (inv) => inv.email.trim().length > 0 && inv.email.includes("@")
  );

  async function handleSubmit(includeInvites: boolean) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete-role",
          shell: "employer",
          firstName: baseProfile.firstName,
          lastName: baseProfile.lastName,
          linkedinUrl: baseProfile.linkedinUrl || undefined,
          bio: baseProfile.bio || undefined,
          companyName: employerData.companyName,
          companyDescription: employerData.companyDescription || undefined,
          companyWebsite: employerData.companyWebsite || undefined,
          companyLocation: employerData.companyLocation || undefined,
          companySize: employerData.companySize || undefined,
          industries:
            employerData.industries.length > 0
              ? employerData.industries
              : undefined,
          userTitle: employerData.userTitle,
          hiringGoal: employerData.hiringGoal || undefined,
          firstRole: employerData.firstRole
            ? {
                title: employerData.firstRole.title,
                category: employerData.firstRole.category || undefined,
                location: employerData.firstRole.location || undefined,
                workType: employerData.firstRole.workType || undefined,
                employmentType:
                  employerData.firstRole.employmentType || undefined,
              }
            : undefined,
          teamInvites:
            includeInvites && validInvites.length > 0
              ? validInvites
              : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/onboarding/complete");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Determine back route based on whether first-role was skipped
  const backRoute =
    employerData.hiringGoal === "exploring"
      ? "/onboarding/canopy/hiring-goals"
      : "/onboarding/canopy/first-role";

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={5}
      totalSteps={EMPLOYER_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push(backRoute)}
          onContinue={() => handleSubmit(true)}
          canContinue={validInvites.length > 0}
          loading={loading}
          continueLabel="Send invites & continue"
          onSkip={() => handleSubmit(false)}
          skipLabel="Skip for now"
        />
      }
    >
      <div className="space-y-6">
        <FormCard>
          <FormField
            label="Team members"
            helpText="They'll receive an email invitation to join your Canopy workspace"
          >
            <div className="space-y-3">
              {invites.map((invite, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="colleague@company.com"
                      value={invite.email}
                      onChange={(e) =>
                        updateInvite(index, { email: e.target.value })
                      }
                      autoFocus={index === 0}
                    />
                  </div>
                  <div className="w-40">
                    <Dropdown
                      value={invite.role}
                      onValueChange={(val: string) =>
                        updateInvite(index, {
                          role: val as "RECRUITER" | "MEMBER",
                        })
                      }
                    >
                      <DropdownTrigger className="w-full">
                        <DropdownValue placeholder="Role" />
                      </DropdownTrigger>
                      <DropdownContent>
                        {roleOptions.map((opt) => (
                          <DropdownItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </DropdownItem>
                        ))}
                      </DropdownContent>
                    </Dropdown>
                  </div>
                  {invites.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(index)}
                      aria-label="Remove invite"
                    >
                      <Trash size={18} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </FormField>

          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={addRow}
            className="mt-2"
          >
            <Plus size={16} weight="bold" className="mr-1.5" />
            Add another person
          </Button>
        </FormCard>

        {/* Role descriptions */}
        <div className="rounded-[var(--radius-card)] border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
          <p className="text-[var(--foreground-default)] mb-3 text-caption font-medium">
            Team roles
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <EnvelopeSimple
                size={20}
                weight="duotone"
                className="mt-0.5 shrink-0 text-[var(--foreground-brand)]"
              />
              <div>
                <p className="text-caption font-medium text-[var(--foreground-default)]">
                  Recruiter
                </p>
                <p className="text-caption text-[var(--foreground-muted)]">
                  Can post roles, manage candidates, and view analytics
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users
                size={20}
                weight="duotone"
                className="mt-0.5 shrink-0 text-[var(--foreground-brand)]"
              />
              <div>
                <p className="text-caption font-medium text-[var(--foreground-default)]">
                  Hiring Team
                </p>
                <p className="text-caption text-[var(--foreground-muted)]">
                  Can view candidates assigned to their roles and leave
                  feedback
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-caption text-[var(--foreground-error)]">
          {error}
        </p>
      )}
    </OnboardingShell>
  );
}

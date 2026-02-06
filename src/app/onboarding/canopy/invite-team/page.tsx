"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm, type TeamInviteEntry } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui";
import { Plus, Trash } from "@phosphor-icons/react";
import { InlineMessage } from "@/components/ui/inline-message";
import { EMPLOYER_STEPS } from "@/lib/onboarding/types";

const roleOptions = [
  { value: "RECRUITER", label: "Reviewer" },
  { value: "MEMBER", label: "Hiring Team" },
];

export default function EmployerInviteTeamPage() {
  const router = useRouter();
  const { employerData, setEmployerData, baseProfile } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");

  const step = EMPLOYER_STEPS[2]; // invite-team
  const invites = employerData.teamInvites ?? [];

  function addInvite() {
    const email = newEmail.trim();
    if (!email || !email.includes("@")) return;
    // Don't add duplicates
    if (invites.some((inv) => inv.email === email)) return;
    const newInvite: TeamInviteEntry = { email, role: "RECRUITER" };
    setEmployerData({ teamInvites: [...invites, newInvite] });
    setNewEmail("");
  }

  function updateInviteRole(index: number, role: "RECRUITER" | "MEMBER") {
    const updated = invites.map((inv, i) => (i === index ? { ...inv, role } : inv));
    setEmployerData({ teamInvites: updated });
  }

  function removeInvite(index: number) {
    const updated = invites.filter((_, i) => i !== index);
    setEmployerData({ teamInvites: updated });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addInvite();
    }
  }

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
          phone: baseProfile.phone || undefined,
          companyName: employerData.companyName,
          companyDescription: employerData.companyDescription || undefined,
          companyWebsite: employerData.companyWebsite || undefined,
          companyLocation: employerData.companyLocation || undefined,
          companySize: employerData.companySize || undefined,
          industries:
            (employerData.industries ?? []).length > 0 ? employerData.industries : undefined,
          userTitle: employerData.userTitle,
          teamInvites: includeInvites && validInvites.length > 0 ? validInvites : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "We couldn\u2019t complete your setup. Please try again.");
        return;
      }

      router.push("/onboarding/complete");
    } catch {
      setError(
        "Could not connect to the server. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /** Get the initial letter for the avatar */
  function getInitial(email: string) {
    return email.charAt(0).toUpperCase();
  }

  const inviteCount = validInvites.length;

  return (
    <OnboardingShell
      shell="employer"
      step={step}
      currentStepIndex={2}
      totalSteps={EMPLOYER_STEPS.length}
      rightPanel={
        <Image
          src="/illustrations/employer-onboarding-Build your team.png"
          alt="Build your team"
          width={560}
          height={560}
          className="h-auto w-full object-contain"
          priority
        />
      }
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/canopy/your-role")}
          onContinue={() => handleSubmit(true)}
          canContinue={inviteCount > 0}
          loading={loading}
          continueLabel={
            inviteCount > 0
              ? `Invite ${inviteCount} ${inviteCount === 1 ? "Person" : "People"} and Continue`
              : "Continue"
          }
          onSkip={() => handleSubmit(false)}
          skipLabel="Continue Without Inviting"
        />
      }
    >
      <div className="space-y-6">
        {/* Divider between subtitle and form */}
        <hr className="border-[var(--border-muted)]" />

        {/* Send Invites heading */}
        <h2 className="text-heading-sm font-medium text-[var(--primitive-green-800)]">
          Send Invites
        </h2>

        {/* Email input + Add button */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter teammates email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addInvite}
            disabled={!newEmail.trim() || !newEmail.includes("@")}
            className="shrink-0 gap-2"
            leftIcon={<Plus size={16} weight="bold" />}
          >
            Add
          </Button>
        </div>

        {/* Invited members list */}
        {invites.length > 0 && (
          <div className="rounded-[var(--radius-card)] border border-[var(--border-muted)] bg-[var(--background-subtle)]">
            {invites.map((invite, index) => (
              <div
                key={index}
                className="flex items-center gap-4 border-b border-[var(--border-muted)] px-5 py-4 last:border-b-0"
              >
                {/* Avatar circle with initial */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primitive-blue-200)] text-caption font-bold text-[var(--primitive-blue-700)]">
                  {getInitial(invite.email)}
                </div>

                {/* Email */}
                <span className="flex-1 text-body text-[var(--foreground-default)]">
                  {invite.email}
                </span>

                {/* Role dropdown */}
                <div className="w-32">
                  <Dropdown
                    value={invite.role}
                    onValueChange={(val: string) =>
                      updateInviteRole(index, val as "RECRUITER" | "MEMBER")
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

                {/* Delete button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInvite(index)}
                  aria-label={`Remove ${invite.email}`}
                  className="text-[var(--foreground-error)]"
                >
                  <Trash size={20} weight="regular" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {error && <InlineMessage variant="critical">{error}</InlineMessage>}
      </div>
    </OnboardingShell>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Plus, EnvelopeSimple, Trash, Users } from "@phosphor-icons/react";

/**
 * Employer Team Screen - Onboarding Step 4 (Employer Flow)
 *
 * Based on Figma design (204:3212)
 * User can invite team members with different roles
 */

const roleOptions = [
  { value: "admin", label: "Admin", description: "Full access to all features" },
  { value: "recruiter", label: "Recruiter", description: "Manage jobs and candidates" },
  { value: "hiring-manager", label: "Hiring Manager", description: "Review assigned candidates" },
  { value: "interviewer", label: "Interviewer", description: "View and evaluate candidates" },
];

interface TeamInvite {
  id: string;
  email: string;
  role: string;
}

export default function EmployerTeamPage() {
  const router = useRouter();
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentRole, setCurrentRole] = useState("");

  const handleBack = () => {
    router.push("/employer/your-role");
  };

  const handleContinue = () => {
    // In a real app, we'd send invites and redirect to dashboard
    router.push("/candid/dashboard");
  };

  const handleSkip = () => {
    // Skip team invitations and go directly to dashboard
    router.push("/candid/dashboard");
  };

  const addInvite = () => {
    if (currentEmail && currentRole) {
      const newInvite: TeamInvite = {
        id: Math.random().toString(36).slice(2),
        email: currentEmail,
        role: currentRole,
      };
      setInvites([...invites, newInvite]);
      setCurrentEmail("");
      setCurrentRole("");
    }
  };

  const removeInvite = (id: string) => {
    setInvites(invites.filter((invite) => invite.id !== id));
  };

  const getRoleLabel = (roleValue: string) => {
    return roleOptions.find((r) => r.value === roleValue)?.label || roleValue;
  };

  const canAddInvite = currentEmail && currentRole && currentEmail.includes("@");

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[var(--primitive-green-100)] rounded-full flex items-center justify-center mx-auto mb-4">
          <Users weight="bold" size={32} className="text-[var(--primitive-green-700)]" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          Build your team
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Invite colleagues to collaborate on hiring
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 mb-8">
        {/* Add Team Member Form */}
        <div className="p-4 bg-[var(--primitive-neutral-50)] rounded-xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                leftAddon={<EnvelopeSimple weight="bold" />}
              />
            </div>

            {/* Role Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Dropdown value={currentRole} onValueChange={setCurrentRole}>
                <DropdownTrigger id="role" className="w-full">
                  <DropdownValue placeholder="Select a role" />
                </DropdownTrigger>
                <DropdownContent>
                  {roleOptions.map((role) => (
                    <DropdownItem key={role.value} value={role.value}>
                      <div className="flex flex-col">
                        <span>{role.label}</span>
                        <span className="text-xs text-[var(--primitive-neutral-500)]">
                          {role.description}
                        </span>
                      </div>
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={addInvite}
            disabled={!canAddInvite}
            leftIcon={<Plus weight="bold" size={20} />}
            className="w-full"
          >
            Add to invite list
          </Button>
        </div>

        {/* Pending Invites List */}
        {invites.length > 0 && (
          <div className="space-y-3">
            <Label>Pending invitations ({invites.length})</Label>
            <div className="space-y-2">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg",
                    "bg-[var(--primitive-neutral-100)] border border-[var(--primitive-neutral-200)]"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--primitive-green-800)] truncate">
                      {invite.email}
                    </p>
                    <p className="text-xs text-[var(--primitive-neutral-600)]">
                      {getRoleLabel(invite.role)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInvite(invite.id)}
                    className={cn(
                      "p-2 rounded-lg",
                      "text-[var(--primitive-neutral-500)]",
                      "hover:bg-[var(--primitive-red-100)] hover:text-[var(--primitive-red-600)]",
                      "transition-colors"
                    )}
                    aria-label={`Remove ${invite.email}`}
                  >
                    <Trash weight="bold" size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {invites.length === 0 && (
          <div className="text-center py-6 text-[var(--primitive-neutral-500)]">
            <p className="text-sm">
              No team members added yet. Add colleagues above or continue to set up your workspace.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          onClick={handleBack}
          leftIcon={<ArrowLeft weight="bold" size={20} />}
        >
          Back
        </Button>
        {invites.length === 0 ? (
          <Button
            variant="secondary"
            onClick={handleSkip}
            className="flex-1"
          >
            Skip for now
          </Button>
        ) : (
          <Button
            onClick={handleContinue}
            className="flex-1"
            rightIcon={<ArrowRight weight="bold" size={20} />}
          >
            Send invites & Continue
          </Button>
        )}
      </div>
    </div>
  );
}

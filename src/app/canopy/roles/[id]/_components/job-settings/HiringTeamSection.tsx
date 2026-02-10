"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SimpleTooltip } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import {
  PencilSimple,
  X,
  UserCirclePlus,
  Eye,
  EyeSlash,
  UsersThree,
  Plus,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";
import type { JobPostState, OrgMemberOption } from "../../_lib/use-role-form";

// ============================================
// TYPES
// ============================================

interface HiringTeamSectionProps {
  roleId: string;
  jobPostState: JobPostState;
}

// ============================================
// MEMBER PICKER (reusable within modal)
// ============================================

function MemberPicker({
  label,
  memberId,
  onMemberChange,
  showOnPost,
  onShowChange,
  members,
}: {
  label: string;
  memberId: string | null;
  onMemberChange: (id: string | null) => void;
  showOnPost: boolean;
  onShowChange: (v: boolean) => void;
  members: OrgMemberOption[];
}) {
  const [isSelecting, setIsSelecting] = React.useState(false);
  const selectedMember = members.find((m) => m.id === memberId) ?? null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-default)] p-4">
      <div className="flex items-center justify-between">
        <span className="text-caption-strong font-bold text-[var(--foreground-default)]">
          {label}
        </span>
        <SimpleTooltip
          content={showOnPost ? "Visible on job post" : "Hidden from job post"}
          side="left"
          variant="dark"
        >
          <button
            type="button"
            onClick={() => onShowChange(!showOnPost)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2 py-1",
              "text-caption transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2",
              showOnPost
                ? "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]"
                : "bg-[var(--background-muted)] text-[var(--foreground-subtle)]"
            )}
          >
            {showOnPost ? (
              <Eye weight="bold" className="h-3.5 w-3.5" />
            ) : (
              <EyeSlash weight="bold" className="h-3.5 w-3.5" />
            )}
            <span className="text-caption-sm font-medium">{showOnPost ? "Visible" : "Hidden"}</span>
          </button>
        </SimpleTooltip>
      </div>

      {selectedMember && !isSelecting ? (
        <div className="flex items-center gap-3 rounded-xl bg-[var(--background-subtle)] p-3">
          <Avatar
            name={selectedMember.name}
            src={selectedMember.avatar ?? undefined}
            size="default"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-caption-strong font-bold text-[var(--foreground-default)]">
              {selectedMember.name}
            </span>
            {selectedMember.title && (
              <span className="truncate text-caption-sm text-[var(--foreground-subtle)]">
                {selectedMember.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <SimpleTooltip content="Change" side="top" variant="dark">
              <button
                type="button"
                onClick={() => setIsSelecting(true)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "text-[var(--foreground-subtle)] transition-colors duration-150",
                  "hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
                )}
              >
                <PencilSimple weight="bold" className="h-4 w-4" />
              </button>
            </SimpleTooltip>
            <SimpleTooltip content="Remove" side="top" variant="dark">
              <button
                type="button"
                onClick={() => onMemberChange(null)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg",
                  "text-[var(--foreground-subtle)] transition-colors duration-150",
                  "hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
                )}
              >
                <X weight="bold" className="h-4 w-4" />
              </button>
            </SimpleTooltip>
          </div>
        </div>
      ) : (
        <>
          <Select
            value={memberId ?? ""}
            onValueChange={(v) => {
              onMemberChange(v || null);
              setIsSelecting(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <span className="flex items-center gap-2">
                    <Avatar name={member.name} src={member.avatar ?? undefined} size="xs" />
                    <span className="flex flex-col">
                      <span>{member.name}</span>
                      {member.title && (
                        <span className="text-caption-sm text-[var(--foreground-subtle)]">
                          {member.title}
                        </span>
                      )}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMember && isSelecting && (
            <button
              type="button"
              onClick={() => setIsSelecting(false)}
              className="text-caption text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]"
            >
              Cancel
            </button>
          )}
          {!selectedMember && (
            <p className="flex items-center gap-1.5 text-caption-sm text-[var(--foreground-subtle)]">
              <UserCirclePlus
                weight="duotone"
                className="h-4 w-4 shrink-0 text-[var(--foreground-disabled)]"
              />
              Assign a team member to this role
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ============================================
// REVIEWER PICKER (reusable within modal)
// ============================================

function ReviewerPicker({
  reviewerIds,
  onReviewerChange,
  members,
}: {
  reviewerIds: string[];
  onReviewerChange: (ids: string[]) => void;
  members: OrgMemberOption[];
}) {
  const [isAdding, setIsAdding] = React.useState(false);
  const selectedMembers = members.filter((m) => reviewerIds.includes(m.id));
  const availableMembers = members.filter((m) => !reviewerIds.includes(m.id));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[var(--border-default)] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <UsersThree weight="bold" className="h-4 w-4 text-[var(--foreground-default)]" />
          <span className="text-caption-strong font-bold text-[var(--foreground-default)]">
            Reviewers
          </span>
        </div>
        {availableMembers.length > 0 && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1",
              "text-caption-sm font-medium transition-colors duration-150",
              "text-[var(--foreground-brand)] hover:bg-[var(--background-brand-subtle)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
            )}
          >
            <Plus weight="bold" className="h-3.5 w-3.5" />
            Add
          </button>
        )}
      </div>

      {selectedMembers.length > 0 && (
        <div className="flex flex-col gap-2">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl bg-[var(--background-subtle)] p-3"
            >
              <Avatar name={member.name} src={member.avatar ?? undefined} size="default" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-caption-strong font-bold text-[var(--foreground-default)]">
                  {member.name}
                </span>
                {member.title && (
                  <span className="truncate text-caption-sm text-[var(--foreground-subtle)]">
                    {member.title}
                  </span>
                )}
              </div>
              <SimpleTooltip content="Remove" side="top" variant="dark">
                <button
                  type="button"
                  onClick={() => onReviewerChange(reviewerIds.filter((id) => id !== member.id))}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    "text-[var(--foreground-subtle)] transition-colors duration-150",
                    "hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
                  )}
                >
                  <X weight="bold" className="h-4 w-4" />
                </button>
              </SimpleTooltip>
            </div>
          ))}
        </div>
      )}

      {isAdding && availableMembers.length > 0 && (
        <div className="flex flex-col gap-2">
          <Select
            value=""
            onValueChange={(v) => {
              if (v) onReviewerChange([...reviewerIds, v]);
              setIsAdding(false);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select reviewer" />
            </SelectTrigger>
            <SelectContent>
              {availableMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  <span className="flex items-center gap-2">
                    <Avatar name={member.name} src={member.avatar ?? undefined} size="xs" />
                    <span className="flex flex-col">
                      <span>{member.name}</span>
                      {member.title && (
                        <span className="text-caption-sm text-[var(--foreground-subtle)]">
                          {member.title}
                        </span>
                      )}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="text-caption text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]"
          >
            Cancel
          </button>
        </div>
      )}

      {selectedMembers.length === 0 && !isAdding && (
        <p className="flex items-center gap-1.5 text-caption-sm text-[var(--foreground-subtle)]">
          <UserCirclePlus
            weight="duotone"
            className="h-4 w-4 shrink-0 text-[var(--foreground-disabled)]"
          />
          Assign reviewers to this role
        </p>
      )}
    </div>
  );
}

// ============================================
// COMPONENT
// ============================================

export function HiringTeamSection({ roleId, jobPostState }: HiringTeamSectionProps) {
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save recruiter/hiring manager to role
      const roleRes = await fetch(`/api/canopy/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recruiterId: jobPostState.recruiterId || null,
          hiringManagerId: jobPostState.hiringManagerId || null,
          formConfig: {
            showRecruiter: jobPostState.showRecruiter,
            showHiringManager: jobPostState.showHiringManager,
          },
        }),
      });

      if (!roleRes.ok) throw new Error("Failed to save team assignments");

      // Save reviewer assignments
      const assignRes = await fetch(`/api/canopy/roles/${roleId}/assignments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerIds: jobPostState.reviewerIds }),
      });

      if (!assignRes.ok) {
        logger.warn("Failed to sync reviewer assignments", { roleId });
      }

      toast.success("Hiring team saved");
    } catch (error) {
      logger.error("Failed to save hiring team", { error: formatError(error) });
      toast.error("Failed to save hiring team");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h3 className="text-body-strong font-medium text-[var(--foreground-default)]">
          Hiring Team
        </h3>
        <p className="mt-1 text-caption text-[var(--foreground-muted)]">
          Assign team members to this role. Toggle visibility to show them on the job post.
        </p>
      </div>

      <MemberPicker
        label="Recruiter"
        memberId={jobPostState.recruiterId}
        onMemberChange={jobPostState.setRecruiterId}
        showOnPost={jobPostState.showRecruiter}
        onShowChange={jobPostState.setShowRecruiter}
        members={jobPostState.orgMembers}
      />

      <MemberPicker
        label="Hiring Manager"
        memberId={jobPostState.hiringManagerId}
        onMemberChange={jobPostState.setHiringManagerId}
        showOnPost={jobPostState.showHiringManager}
        onShowChange={jobPostState.setShowHiringManager}
        members={jobPostState.orgMembers}
      />

      <ReviewerPicker
        reviewerIds={jobPostState.reviewerIds}
        onReviewerChange={jobPostState.setReviewerIds}
        members={jobPostState.orgMembers}
      />

      <div className="flex justify-end border-t border-[var(--border-default)] pt-4">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving && <Spinner size="sm" variant="current" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

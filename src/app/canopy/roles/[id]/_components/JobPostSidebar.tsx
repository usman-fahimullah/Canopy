"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { RoleTemplateCard } from "@/components/ui/role-template-card";
import { SimpleTooltip } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import {
  SlidersHorizontal,
  Link as LinkIcon,
  Folder,
  PencilSimple,
  X,
  UserCirclePlus,
  Eye,
  EyeSlash,
  UsersThree,
  Plus,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { JobPostState, OrgMemberOption } from "../_lib/use-role-form";

// ============================================
// TYPES
// ============================================

interface JobPostSidebarProps {
  showRecruiter: JobPostState["showRecruiter"];
  setShowRecruiter: JobPostState["setShowRecruiter"];
  recruiterId: JobPostState["recruiterId"];
  setRecruiterId: JobPostState["setRecruiterId"];
  showHiringManager: JobPostState["showHiringManager"];
  setShowHiringManager: JobPostState["setShowHiringManager"];
  hiringManagerId: JobPostState["hiringManagerId"];
  setHiringManagerId: JobPostState["setHiringManagerId"];
  reviewerIds: JobPostState["reviewerIds"];
  setReviewerIds: JobPostState["setReviewerIds"];
  orgMembers: JobPostState["orgMembers"];
  closingDate: JobPostState["closingDate"];
  setClosingDate: JobPostState["setClosingDate"];
  externalLink: JobPostState["externalLink"];
  setExternalLink: JobPostState["setExternalLink"];
  requireResume: JobPostState["requireResume"];
  setRequireResume: JobPostState["setRequireResume"];
  requireCoverLetter: JobPostState["requireCoverLetter"];
  setRequireCoverLetter: JobPostState["setRequireCoverLetter"];
  requirePortfolio: JobPostState["requirePortfolio"];
  setRequirePortfolio: JobPostState["setRequirePortfolio"];
  templateSaved: JobPostState["templateSaved"];
  savingTemplate: JobPostState["savingTemplate"];
  handleSaveTemplate: JobPostState["handleSaveTemplate"];
}

// ============================================
// MEMBER PICKER SECTION
// ============================================

function MemberPickerSection({
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
    <div className="flex flex-col gap-3 border-b border-[var(--border-default)] px-6 py-5">
      {/* Header: label + visibility toggle */}
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

      {/* Selected member card — or picker */}
      {selectedMember && !isSelecting ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-3",
            "bg-[var(--background-subtle)]",
            "transition-colors duration-150"
          )}
        >
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
                  "text-[var(--foreground-subtle)]",
                  "transition-colors duration-150",
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
                  "text-[var(--foreground-subtle)]",
                  "transition-colors duration-150",
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

          {/* Cancel button when editing existing selection */}
          {selectedMember && isSelecting && (
            <button
              type="button"
              onClick={() => setIsSelecting(false)}
              className="text-caption text-[var(--foreground-subtle)] transition-colors duration-150 hover:text-[var(--foreground-default)]"
            >
              Cancel
            </button>
          )}

          {/* Empty state hint when no selection */}
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
// REVIEWER MULTI-SELECT SECTION
// ============================================

function ReviewerPickerSection({
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
    <div className="flex flex-col gap-3 border-b border-[var(--border-default)] px-6 py-5">
      {/* Header */}
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

      {/* Selected reviewer chips */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-col gap-2">
          {selectedMembers.map((member) => (
            <div
              key={member.id}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3",
                "bg-[var(--background-subtle)]",
                "transition-colors duration-150"
              )}
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
                    "text-[var(--foreground-subtle)]",
                    "transition-colors duration-150",
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

      {/* Add reviewer dropdown */}
      {isAdding && availableMembers.length > 0 && (
        <div className="flex flex-col gap-2">
          <Select
            value=""
            onValueChange={(v) => {
              if (v) {
                onReviewerChange([...reviewerIds, v]);
              }
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
            className="text-caption text-[var(--foreground-subtle)] transition-colors duration-150 hover:text-[var(--foreground-default)]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Empty state */}
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

export function JobPostSidebar({
  showRecruiter,
  setShowRecruiter,
  recruiterId,
  setRecruiterId,
  showHiringManager,
  setShowHiringManager,
  hiringManagerId,
  setHiringManagerId,
  reviewerIds,
  setReviewerIds,
  orgMembers,
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
}: JobPostSidebarProps) {
  return (
    <div className="flex w-full flex-col gap-4 xl:sticky xl:top-6 xl:w-[360px] xl:shrink-0 xl:self-start">
      {/* Role Settings Card */}
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-emphasis)] bg-[var(--background-default)]">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[var(--border-default)] px-6 py-4">
          <SlidersHorizontal
            weight="bold"
            className="h-5 w-5 shrink-0 text-[var(--foreground-default)]"
          />
          <h2 className="flex-1 text-caption-strong font-bold text-[var(--foreground-default)]">
            Role Settings
          </h2>
        </div>

        {/* Recruiter */}
        <MemberPickerSection
          label="Recruiter"
          memberId={recruiterId}
          onMemberChange={setRecruiterId}
          showOnPost={showRecruiter}
          onShowChange={setShowRecruiter}
          members={orgMembers}
        />

        {/* Hiring Manager */}
        <MemberPickerSection
          label="Hiring Manager"
          memberId={hiringManagerId}
          onMemberChange={setHiringManagerId}
          showOnPost={showHiringManager}
          onShowChange={setShowHiringManager}
          members={orgMembers}
        />

        {/* Reviewers */}
        <ReviewerPickerSection
          reviewerIds={reviewerIds}
          onReviewerChange={setReviewerIds}
          members={orgMembers}
        />

        {/* Closing Date */}
        <div className="flex flex-col gap-2 border-b border-[var(--border-default)] px-6 py-5">
          <label className="text-caption-strong font-bold text-[var(--foreground-default)]">
            Closing Date
          </label>
          <DatePicker
            value={closingDate}
            onChange={setClosingDate}
            placeholder="Select a date"
            popoverAlign="end"
            showPresets={false}
          />
        </div>

        {/* External Link */}
        <div className="flex flex-col gap-2 border-b border-[var(--border-default)] px-6 py-5">
          <label className="text-caption-strong font-bold text-[var(--foreground-default)]">
            External Link
          </label>
          <Input
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            placeholder="https://apply.example.com"
            inputSize="lg"
            leftAddon={<LinkIcon weight="bold" />}
          />
        </div>

        {/* Required Files */}
        <div className="flex flex-col gap-3 border-b border-[var(--border-default)] px-6 py-5">
          <div className="flex items-center gap-2">
            <Folder weight="fill" className="h-5 w-5 shrink-0 text-[var(--foreground-default)]" />
            <span className="text-caption-strong font-bold text-[var(--foreground-default)]">
              Required Files
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            <SwitchWithLabel
              label="Resume"
              labelPosition="right"
              size="sm"
              checked={requireResume}
              onCheckedChange={setRequireResume}
            />
            <SwitchWithLabel
              label="Cover Letter"
              labelPosition="right"
              size="sm"
              checked={requireCoverLetter}
              onCheckedChange={setRequireCoverLetter}
            />
            <SwitchWithLabel
              label="Portfolio"
              labelPosition="right"
              size="sm"
              checked={requirePortfolio}
              onCheckedChange={setRequirePortfolio}
            />
          </div>
        </div>
      </div>

      {/* Role Template Card */}
      <RoleTemplateCard
        onSaveTemplate={handleSaveTemplate}
        isSaved={templateSaved}
        loading={savingTemplate}
      />
    </div>
  );
}

"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Switch, SwitchWithLabel } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { RoleTemplateCard } from "@/components/ui/role-template-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { SlidersHorizontal, Link as LinkIcon, Folder } from "@phosphor-icons/react";
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
  const selectedMember = members.find((m) => m.id === memberId) ?? null;

  return (
    <div className="flex flex-col gap-3 border-b border-[var(--border-default)] p-6">
      <div className="flex items-center justify-between">
        <span className="text-body leading-6 text-[var(--foreground-default)]">{label}</span>
        <Switch checked={showOnPost} onCheckedChange={onShowChange} />
      </div>

      <Select value={memberId ?? ""} onValueChange={(v) => onMemberChange(v || null)}>
        <SelectTrigger size="lg">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {members.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
              {member.title ? ` — ${member.title}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedMember && (
        <div className="flex items-center gap-2">
          <Avatar
            name={selectedMember.name}
            src={selectedMember.avatar ?? undefined}
            size="sm"
            className="border border-[var(--border-default)]"
          />
          <div className="flex flex-1 flex-col">
            <span className="text-body leading-6 text-[var(--foreground-default)]">
              {selectedMember.name}
            </span>
            {selectedMember.title && (
              <span className="text-caption leading-5 text-[var(--foreground-subtle)]">
                {selectedMember.title}
              </span>
            )}
          </div>
        </div>
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
        <div className="flex items-center gap-2 border-b border-[var(--border-default)] p-6">
          <SlidersHorizontal
            weight="bold"
            className="h-6 w-6 shrink-0 text-[var(--foreground-default)]"
          />
          <h2 className="flex-1 text-body-strong text-[var(--foreground-default)]">
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

        {/* Closing Date */}
        <div className="flex flex-col gap-3 border-b border-[var(--border-default)] p-6">
          <label className="text-body leading-6 text-[var(--foreground-default)]">
            Closing Date
          </label>
          <DatePicker
            value={closingDate}
            onChange={setClosingDate}
            placeholder="Closing Date"
            popoverAlign="end"
            showPresets={false}
          />
        </div>

        {/* External Link */}
        <div className="flex flex-col gap-3 border-b border-[var(--border-default)] p-6">
          <label className="text-body leading-6 text-[var(--foreground-default)]">
            External Link
          </label>
          <Input
            value={externalLink}
            onChange={(e) => setExternalLink(e.target.value)}
            placeholder="Field label"
            inputSize="lg"
            leftAddon={<LinkIcon weight="bold" />}
          />
        </div>

        {/* Required Files */}
        <div className="flex flex-col gap-3 border-b border-[var(--border-default)] p-6">
          <div className="flex items-center gap-3">
            <Folder weight="fill" className="h-6 w-6 shrink-0 text-[var(--foreground-default)]" />
            <span className="flex-1 text-body leading-6 text-[var(--foreground-default)]">
              Required Files
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <SwitchWithLabel
              label="Resume"
              labelPosition="right"
              checked={requireResume}
              onCheckedChange={setRequireResume}
            />
            <SwitchWithLabel
              label="Cover Letter"
              labelPosition="right"
              checked={requireCoverLetter}
              onCheckedChange={setRequireCoverLetter}
            />
            <SwitchWithLabel
              label="Portfolio"
              labelPosition="right"
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

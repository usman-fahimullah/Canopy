"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Switch, SwitchWithLabel } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { DatePicker } from "@/components/ui/date-picker";
import { RoleTemplateCard } from "@/components/ui/role-template-card";
import { SlidersHorizontal, Link as LinkIcon, Folder } from "@phosphor-icons/react";
import type { JobPostState } from "../_lib/use-role-form";

// ============================================
// TYPES
// ============================================

interface JobPostSidebarProps {
  showRecruiter: JobPostState["showRecruiter"];
  setShowRecruiter: JobPostState["setShowRecruiter"];
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
// COMPONENT
// ============================================

export function JobPostSidebar({
  showRecruiter,
  setShowRecruiter,
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
    <div className="sticky top-6 flex w-[360px] shrink-0 flex-col gap-4 self-start">
      {/* Role Settings Card */}
      <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--primitive-neutral-300)] bg-[var(--primitive-neutral-0)]">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-[var(--primitive-neutral-200)] p-6">
          <SlidersHorizontal
            weight="bold"
            className="h-6 w-6 shrink-0 text-[var(--foreground-default)]"
          />
          <h2 className="flex-1 text-body-strong text-[var(--primitive-neutral-900)]">
            Role Settings
          </h2>
        </div>

        {/* Show Recruiter */}
        <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
          <span className="text-body leading-6 text-[var(--primitive-neutral-900)]">
            Show Recruiter
          </span>
          <div className="flex items-center gap-2">
            <Avatar
              name="Soobin Han"
              size="sm"
              className="border border-[var(--primitive-neutral-200)]"
            />
            <div className="flex flex-1 flex-col">
              <span className="text-body leading-6 text-[var(--primitive-neutral-900)]">
                Soobin Han
              </span>
              <span className="text-caption leading-5 text-[var(--primitive-neutral-600)]">
                Sr. Technical Recruiter
              </span>
            </div>
            <Switch checked={showRecruiter} onCheckedChange={setShowRecruiter} />
          </div>
        </div>

        {/* Closing Date */}
        <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
          <label className="text-body leading-6 text-[var(--primitive-neutral-900)]">
            Closing Date
          </label>
          <DatePicker
            value={closingDate}
            onChange={setClosingDate}
            placeholder="Closing Date"
            popoverAlign="end"
          />
        </div>

        {/* External Link */}
        <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
          <label className="text-body leading-6 text-[var(--primitive-neutral-900)]">
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
        <div className="flex flex-col gap-3 border-b border-[var(--primitive-neutral-200)] p-6">
          <div className="flex items-center gap-3">
            <Folder weight="fill" className="h-6 w-6 shrink-0 text-[var(--foreground-default)]" />
            <span className="flex-1 text-body leading-6 text-[var(--primitive-neutral-900)]">
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

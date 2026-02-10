"use client";

import * as React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalSidebarLayout,
  ModalSidebarContent,
} from "@/components/ui/modal";
import type { JobData } from "../_lib/types";
import type { JobPostState } from "../_lib/use-role-form";
import { JobSettingsSidebar, type SettingsSection } from "./job-settings/JobSettingsSidebar";
import { GeneralSection } from "./job-settings/GeneralSection";
import { ShareSettingsSection } from "./job-settings/ShareSettingsSection";
import { JobBoardsSection } from "./job-settings/JobBoardsSection";
import { ConfirmationEmailSection, FirstReplySection } from "./job-settings/EmailSettingsSections";
import { HiringStagesSection } from "./job-settings/HiringStagesSection";
import { HiringTeamSection } from "./job-settings/HiringTeamSection";

// ============================================
// TYPES
// ============================================

interface JobSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
  jobData: JobData;
  setJobData: React.Dispatch<React.SetStateAction<JobData | null>>;
  jobPostState: JobPostState;
}

// ============================================
// COMPONENT
// ============================================

export function JobSettingsModal({
  open,
  onOpenChange,
  roleId,
  jobData,
  setJobData,
  jobPostState,
}: JobSettingsModalProps) {
  const [activeSection, setActiveSection] = React.useState<SettingsSection>("general");

  const handleJobDataChange = React.useCallback(
    (updater: (prev: JobData) => JobData) => {
      setJobData((prev) => (prev ? updater(prev) : prev));
    },
    [setJobData]
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl" className="h-[min(720px,calc(100vh-4rem))]">
        <ModalHeader>
          <ModalTitle>Job Settings</ModalTitle>
        </ModalHeader>

        <ModalSidebarLayout>
          <JobSettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <ModalSidebarContent>
            {activeSection === "general" && (
              <GeneralSection
                roleId={roleId}
                jobData={jobData}
                jobPostState={jobPostState}
                onJobDataChange={handleJobDataChange}
              />
            )}

            {activeSection === "share" && (
              <ShareSettingsSection
                roleId={roleId}
                jobData={jobData}
                onJobDataChange={handleJobDataChange}
              />
            )}

            {activeSection === "job-boards" && (
              <JobBoardsSection jobData={jobData} onJobDataChange={handleJobDataChange} />
            )}

            {activeSection === "confirmation-email" && <ConfirmationEmailSection roleId={roleId} />}

            {activeSection === "first-reply" && <FirstReplySection roleId={roleId} />}

            {activeSection === "hiring-stages" && <HiringStagesSection roleId={roleId} />}

            {activeSection === "hiring-team" && (
              <HiringTeamSection roleId={roleId} jobPostState={jobPostState} />
            )}
          </ModalSidebarContent>
        </ModalSidebarLayout>
      </ModalContent>
    </Modal>
  );
}

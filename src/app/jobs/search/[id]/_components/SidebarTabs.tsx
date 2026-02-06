"use client";

import { useState } from "react";
import { SegmentedController } from "@/components/ui";
import { NotesEditor } from "./NotesEditor";
import type { JobDetail } from "./types";

interface SidebarTabsProps {
  job: JobDetail;
  /** The sidebar sections to render under "Job Details" tab */
  children: React.ReactNode;
}

const TAB_OPTIONS = [
  { value: "details", label: "Job Details" },
  { value: "notes", label: "Your Notes" },
];

export function SidebarTabs({ job, children }: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="space-y-6">
      <SegmentedController
        options={TAB_OPTIONS}
        value={activeTab}
        onValueChange={setActiveTab}
        fullWidth
        aria-label="Sidebar navigation"
      />

      {activeTab === "details" ? (
        <div className="space-y-6">{children}</div>
      ) : (
        <NotesEditor jobId={job.id} initialNotes={job.savedNotes} isSaved={job.isSaved} />
      )}
    </div>
  );
}

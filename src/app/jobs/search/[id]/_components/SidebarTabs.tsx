"use client";

import { Tabs, TabsListUnderline, TabsTriggerUnderline, TabsContent } from "@/components/ui";
import { NotesEditor } from "./NotesEditor";
import type { JobDetail } from "./types";

interface SidebarTabsProps {
  job: JobDetail;
  /** The sidebar cards to render under "Job Details" tab */
  children: React.ReactNode;
}

export function SidebarTabs({ job, children }: SidebarTabsProps) {
  return (
    <Tabs defaultValue="details">
      <TabsListUnderline className="w-full">
        <TabsTriggerUnderline value="details" className="flex-1">
          Job Details
        </TabsTriggerUnderline>
        <TabsTriggerUnderline value="notes" className="flex-1">
          Your Notes
        </TabsTriggerUnderline>
      </TabsListUnderline>
      <TabsContent value="details" className="mt-6 space-y-6">
        {children}
      </TabsContent>
      <TabsContent value="notes" className="mt-6">
        <NotesEditor jobId={job.id} initialNotes={job.savedNotes} isSaved={job.isSaved} />
      </TabsContent>
    </Tabs>
  );
}

"use client";

import * as React from "react";
import { ActivityFeed, type Activity, type ActivityType } from "@/components/ui/activity-feed";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { ChatCircle } from "@phosphor-icons/react";

interface ActivityPanelProps {
  seekerId: string;
  applicationId: string;
}

/**
 * Right-panel activity feed for a candidate.
 * Currently shows placeholder data — wire to API in Phase 7.
 */
export function ActivityPanel({ seekerId, applicationId }: ActivityPanelProps) {
  // Placeholder activities for initial build
  const [activities] = React.useState<Activity[]>([
    {
      id: "1",
      type: "application_received" as ActivityType,
      actor: { id: "system", name: "System" },
      message: "applied for this position",
      timestamp: new Date().toISOString(),
    },
  ]);
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="md" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="px-6 py-12">
        <EmptyState
          title="No activity yet"
          description="Activity for this candidate will appear here."
          icon={<ChatCircle size={40} />}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <ActivityFeed activities={activities} groupByDate />
    </div>
  );
}

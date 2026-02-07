"use client";

import * as React from "react";
import { CandidateActivityTimeline } from "@/components/canopy/CandidateActivityTimeline";

interface ActivityPanelProps {
  seekerId: string;
  applicationId: string;
}

/**
 * Right-panel activity feed for a candidate.
 * Displays unified activity feed from the activity API endpoint.
 */
export function ActivityPanel({ seekerId, applicationId }: ActivityPanelProps) {
  return (
    <div className="p-4">
      <CandidateActivityTimeline candidateId={seekerId} />
    </div>
  );
}

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";
import { CandidateActivityTimeline } from "@/components/canopy/CandidateActivityTimeline";

/**
 * HistoryPanel — Chronological activity timeline for a candidate.
 * Triggered by ClockCounterClockwise icon in navbar.
 * Reuses existing CandidateActivityTimeline component which fetches
 * from GET /api/canopy/candidates/[id]/activity.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1245
 */

interface HistoryPanelProps {
  seekerId: string;
  onClose: () => void;
}

export function HistoryPanel({ seekerId, onClose }: HistoryPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">History</h2>
        <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </Button>
      </div>

      {/* Timeline content — reuses existing component */}
      <div className="flex-1 overflow-y-auto p-4">
        <CandidateActivityTimeline candidateId={seekerId} />
      </div>
    </div>
  );
}

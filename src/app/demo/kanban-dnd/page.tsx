"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  CandidateKanbanHeader,
  CandidateTags,
  CandidateActivity,
  CandidateReviewers,
  DaysInStage,
  DecisionPill,
  type ReviewerData,
  Button,
} from "@/components/ui";
import { Plus } from "@phosphor-icons/react";

// Import types and hook from separate file to avoid @dnd-kit SSR issues
import { useKanbanState, type KanbanItem } from "@/components/ui/kanban-state";

// Import KanbanColumnData type from dnd file (only types, no runtime code)
import type { KanbanColumnData } from "@/components/ui/kanban-dnd";

// Dynamic import for dnd-kit components to avoid SSR issues
const DndKanbanBoard = dynamic(
  () =>
    import("@/components/ui/kanban-dnd")
      .then((mod) => {
        // eslint-disable-next-line no-console
        console.log("DndKanbanBoard module loaded successfully", mod);
        // Return object with default property for Next.js dynamic()
        return { default: mod.DndKanbanBoard };
      })
      .catch((err) => {
        console.error("Failed to load DndKanbanBoard:", err);
        throw err;
      }),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center text-foreground-muted">Loading kanban...</div>,
  }
);

/**
 * Demo page for the DnD Kanban Board
 * Shows drag-and-drop functionality with the new ATS components
 */

// ============================================
// SAMPLE DATA
// ============================================

interface CandidateData {
  id: string;
  name: string;
  avatarUrl?: string;
  rating?: number;
  matchScore?: number;
  appliedDate: Date;
  daysInStage: number;
  tags: Array<{
    label: string;
    variant?: "default" | "green" | "blue" | "amber" | "purple" | "pink";
  }>;
  lastComment?: string;
  scheduledInterview?: string;
  reviewers: ReviewerData[];
}

const sampleCandidates: CandidateData[] = [
  {
    id: "1",
    name: "Myna Ahmed",
    rating: 4.2,
    matchScore: 85,
    appliedDate: new Date(),
    daysInStage: 0,
    tags: [
      { label: "Portfolio", variant: "blue" },
      { label: "Referred", variant: "green" },
    ],
    lastComment: "2h ago",
    reviewers: [{ name: "Soobin Han", status: "pending", color: "purple" }],
  },
  {
    id: "2",
    name: "Christopher Peterson",
    rating: 4.2,
    matchScore: 78,
    appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    daysInStage: 6,
    tags: [{ label: "Climate exp.", variant: "green" }],
    lastComment: "1d ago",
    reviewers: [
      { name: "Leo Moreau", status: "yes", rating: 5, color: "blue" },
      { name: "Rachel Costanza", status: "yes", rating: 4, color: "red" },
      { name: "Maya Fernández", status: "maybe", rating: 4, color: "green" },
    ],
  },
  {
    id: "3",
    name: "Randy Philips",
    rating: 4.2,
    matchScore: 92,
    appliedDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    daysInStage: 6,
    tags: [
      { label: "Art School", variant: "blue" },
      { label: "Top Match", variant: "green" },
    ],
    lastComment: "3h ago",
    reviewers: [
      { name: "Benjamin Martinez", status: "strong_yes", rating: 5, color: "orange" },
      { name: "Alexander Smith", status: "yes", rating: 4, color: "blue" },
      { name: "Jacob Souza", status: "yes", rating: 4, color: "purple" },
    ],
  },
  {
    id: "4",
    name: "Jacob Cherrywood",
    rating: 4.9,
    matchScore: 88,
    appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    daysInStage: 8,
    tags: [{ label: "Senior", variant: "amber" }],
    lastComment: "1d ago",
    scheduledInterview: "Tomorrow, 2pm",
    reviewers: [
      { name: "Sarah Chen", status: "strong_yes", rating: 5, color: "red" },
      { name: "Mike Johnson", status: "yes", rating: 5, color: "blue" },
    ],
  },
  {
    id: "5",
    name: "Camille Laurent",
    rating: 4.5,
    matchScore: 81,
    appliedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    daysInStage: 15,
    tags: [{ label: "Final round", variant: "green" }],
    scheduledInterview: "Mon, 10am",
    reviewers: [
      { name: "Lisa Park", status: "yes", rating: 4, color: "green" },
      { name: "Tom Wilson", status: "pending", color: "orange" },
    ],
  },
  {
    id: "6",
    name: "Sophie Collins",
    rating: 4.8,
    matchScore: 95,
    appliedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    daysInStage: 9,
    tags: [{ label: "Offer sent", variant: "green" }],
    lastComment: "2d ago",
    reviewers: [{ name: "HR Team", status: "strong_yes", color: "blue" }],
  },
];

// Column definitions
const columns: KanbanColumnData[] = [
  { id: "applied", title: "Applied", stage: "applied" },
  { id: "qualified", title: "Qualified", stage: "qualified" },
  { id: "interview", title: "Interviews", stage: "interview" },
  { id: "offer", title: "Offers", stage: "offer" },
];

// Initial column assignments
const initialColumnAssignments: Record<string, string> = {
  "1": "applied",
  "2": "applied",
  "3": "qualified",
  "4": "qualified",
  "5": "interview",
  "6": "offer",
};

// ============================================
// CANDIDATE CARD RENDERER
// ============================================

interface CandidateCardContentProps {
  candidate: CandidateData;
  columnId: string;
}

const CandidateCardContent = ({ candidate, columnId }: CandidateCardContentProps) => {
  const showDaysInStage = columnId !== "applied";

  return (
    <div className="space-y-3">
      {/* Header with avatar, name, rating, match score */}
      <div className="flex items-start justify-between">
        <CandidateKanbanHeader
          name={candidate.name}
          avatarUrl={candidate.avatarUrl}
          rating={candidate.rating}
          matchScore={candidate.matchScore}
          appliedDate={candidate.appliedDate}
        />
        {showDaysInStage && <DaysInStage days={candidate.daysInStage} compact />}
      </div>

      {/* Tags */}
      {candidate.tags.length > 0 && <CandidateTags tags={candidate.tags} maxVisible={3} />}

      {/* Activity row */}
      <CandidateActivity
        lastComment={candidate.lastComment}
        scheduledInterview={candidate.scheduledInterview}
      />

      {/* Reviewers */}
      {candidate.reviewers.length > 0 && <CandidateReviewers reviewers={candidate.reviewers} />}
    </div>
  );
};

// ============================================
// MAIN DEMO PAGE
// ============================================

export default function KanbanDndDemo() {
  // Debug: Log when component mounts
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("KanbanDndDemo mounted");
    // eslint-disable-next-line no-console
    return () => console.log("KanbanDndDemo unmounted");
  }, []);

  // Memoize initial items to prevent infinite re-renders
  // (useKanbanState has an effect that resets items when initialItems changes)
  const initialItems = React.useMemo<KanbanItem<CandidateData>[]>(
    () =>
      sampleCandidates.map((candidate) => ({
        id: candidate.id,
        columnId: initialColumnAssignments[candidate.id] || "applied",
        content: (
          <CandidateCardContent
            candidate={candidate}
            columnId={initialColumnAssignments[candidate.id] || "applied"}
          />
        ),
        data: candidate,
      })),
    [] // Empty deps - sample data is static
  );

  // Use the kanban state hook
  const { items, handleItemsChange, handleDragEnd, isMoving } = useKanbanState({
    initialItems,
    onMoveItem: async (itemId, fromColumnId, toColumnId) => {
      // Simulate API call
      // eslint-disable-next-line no-console
      console.log(`Moving ${itemId} from ${fromColumnId} to ${toColumnId}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
  });

  // Render function for drag overlay
  const renderDragOverlay = (item: KanbanItem) => {
    const candidate = item.data as CandidateData;
    return <CandidateCardContent candidate={candidate} columnId={String(item.columnId)} />;
  };

  // Column header actions
  const columnHeaderActions = (columnId: string | number) => (
    <Button variant="ghost" size="icon-sm" className="text-foreground-muted">
      <Plus weight="bold" className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background-subtle p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-heading-md font-bold text-foreground">DnD Kanban Demo</h1>
        <p className="text-body text-foreground-muted">
          Drag and drop candidates between stages. Try dragging cards to reorder within columns or
          move them to different stages.
        </p>
        {isMoving && <p className="mt-2 text-caption text-foreground-brand">Saving changes...</p>}
      </div>

      {/* Decision Pills Preview */}
      <div className="mb-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-body-strong font-semibold">Decision Pills</h2>
        <div className="flex flex-wrap gap-2">
          <DecisionPill decision="strong_yes" />
          <DecisionPill decision="yes" />
          <DecisionPill decision="maybe" />
          <DecisionPill decision="no" />
          <DecisionPill decision="pending" />
        </div>
      </div>

      {/* Kanban Board */}
      <DndKanbanBoard
        columns={columns}
        items={items}
        onItemsChange={handleItemsChange}
        onDragEnd={handleDragEnd}
        renderDragOverlay={renderDragOverlay}
        columnHeaderActions={columnHeaderActions}
        emptyMessage="Drop candidates here"
        className="overflow-hidden rounded-xl border border-border"
      />

      {/* Instructions */}
      <div className="mt-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-body-strong font-semibold">Features</h2>
        <ul className="space-y-1 text-caption text-foreground-muted">
          <li>• Drag cards between columns to change candidate stage</li>
          <li>• Drag cards within a column to reorder</li>
          <li>• Keyboard navigation supported (Tab to focus, Space to pick up)</li>
          <li>• Visual feedback with drag overlay and drop indicators</li>
          <li>• Collapsed reviewer summary expands on click</li>
          <li>• Days in stage with urgency coloring (warning at 7d, critical at 14d)</li>
        </ul>
      </div>
    </div>
  );
}

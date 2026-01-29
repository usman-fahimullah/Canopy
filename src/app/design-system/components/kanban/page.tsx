"use client";

import React from "react";
import {
  KanbanBoard,
  KanbanColumn,
  KanbanCard,
  KanbanEmpty,
  KanbanDropPlaceholder,
  KanbanAddCard,
  Label,
  Badge,
  Avatar,
  Button,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Plus, DotsThree, FunnelSimple } from "@phosphor-icons/react";

// ============================================
// PROPS DEFINITIONS
// ============================================

const kanbanBoardProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "KanbanColumn components to render",
    required: true,
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show loading skeleton state",
  },
  {
    name: "skeletonColumns",
    type: "number",
    default: "5",
    description: "Number of skeleton columns to show when loading",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const kanbanColumnProps = [
  {
    name: "title",
    type: "string",
    description: "Column header title",
    required: true,
  },
  {
    name: "count",
    type: "number",
    description: "Number of items in the column (shown as badge)",
  },
  {
    name: "stage",
    type: '"applied" | "qualified" | "interview" | "offer" | "hired" | "rejected"',
    description: "Stage type for semantic icon and color",
  },
  {
    name: "color",
    type: "string",
    description: "Custom color for the column indicator (hex)",
  },
  {
    name: "icon",
    type: "ReactNode",
    description: "Custom icon to display instead of stage icon",
  },
  {
    name: "headerActions",
    type: "ReactNode",
    description: "Actions to display in the column header",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "KanbanCard components",
    required: true,
  },
];

const kanbanCardProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Card content",
    required: true,
  },
  {
    name: "isDragging",
    type: "boolean",
    default: "false",
    description: "Whether the card is currently being dragged",
  },
  {
    name: "isDropTarget",
    type: "boolean",
    default: "false",
    description: "Whether the card is the current drop target",
  },
  {
    name: "isSelected",
    type: "boolean",
    default: "false",
    description: "Whether the card is selected",
  },
];

const kanbanEmptyProps = [
  {
    name: "message",
    type: "string",
    default: '"No candidates"',
    description: "Message to display when column is empty",
  },
];

const kanbanDropPlaceholderProps = [
  {
    name: "height",
    type: "number",
    default: "72",
    description: "Height of the placeholder in pixels",
  },
];

const kanbanAddCardProps = [
  {
    name: "label",
    type: "string",
    default: '"Add candidate"',
    description: "Button label text",
  },
];

// ============================================
// SAMPLE DATA
// ============================================

const sampleCandidates = [
  { id: "1", name: "Sarah Chen", role: "Solar Engineer", score: 92, skills: ["NABCEP", "PV Design"] },
  { id: "2", name: "Michael Torres", role: "Project Manager", score: 87, skills: ["LEED AP", "Agile"] },
  { id: "3", name: "Emily Johnson", role: "Analyst", score: 78, skills: ["ESG", "Data Analysis"] },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function KanbanPage() {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="text-heading-lg text-foreground mb-2">
          Kanban Board
        </h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          A visual pipeline management system for tracking candidates across hiring stages.
          The Kanban board provides an intuitive drag-and-drop interface for moving candidates
          through the recruitment workflow.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            ATS Core
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Drag & Drop
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            6 Sub-components
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">
              When to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Managing candidate pipelines across stages</li>
              <li>• Visualizing hiring workflow status</li>
              <li>• Quick stage transitions via drag-and-drop</li>
              <li>• Team collaboration on candidate review</li>
              <li>• Tracking multiple job pipelines</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">
              When not to use
            </h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• For simple list views (use Data Table)</li>
              <li>• When stages aren't sequential</li>
              <li>• For detailed candidate information (use Profile)</li>
              <li>• When horizontal scrolling is problematic</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Board Container",
            description: "Horizontal scrolling container with rounded corners and overflow handling",
            required: true,
          },
          {
            name: "Column",
            description: "Vertical lane representing a pipeline stage with header and card area",
            required: true,
          },
          {
            name: "Column Header",
            description: "Title, count badge, stage icon, and optional actions",
            required: true,
          },
          {
            name: "Card",
            description: "Draggable item representing a candidate with interactive states",
            required: true,
          },
          {
            name: "Empty State",
            description: "Placeholder shown when a column has no cards",
          },
          {
            name: "Drop Placeholder",
            description: "Visual indicator showing where a card will be dropped",
          },
          {
            name: "Add Card Button",
            description: "Optional button to add new items to a column",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A minimal Kanban board with columns and cards"
      >
        <CodePreview
          code={`import { KanbanBoard, KanbanColumn, KanbanCard } from "@/components/ui";

<KanbanBoard>
  <KanbanColumn title="Applied" count={3} stage="applied">
    <KanbanCard>
      <p className="font-medium">Sarah Chen</p>
      <p className="text-sm text-foreground-muted">Solar Engineer</p>
    </KanbanCard>
  </KanbanColumn>
  <KanbanColumn title="Interview" count={1} stage="interview">
    <KanbanCard>
      <p className="font-medium">Michael Torres</p>
      <p className="text-sm text-foreground-muted">Project Manager</p>
    </KanbanCard>
  </KanbanColumn>
</KanbanBoard>`}
        >
          <div className="overflow-x-auto">
            <KanbanBoard>
              <KanbanColumn title="Applied" count={2} stage="applied">
                <KanbanCard>
                  <p className="font-medium text-foreground">Sarah Chen</p>
                  <p className="text-caption text-foreground-muted">Solar Engineer</p>
                </KanbanCard>
                <KanbanCard>
                  <p className="font-medium text-foreground">Emily Johnson</p>
                  <p className="text-caption text-foreground-muted">ESG Analyst</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Interview" count={1} stage="interview">
                <KanbanCard>
                  <p className="font-medium text-foreground">Michael Torres</p>
                  <p className="text-caption text-foreground-muted">Project Manager</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Offer" count={0} stage="offer">
                <KanbanEmpty />
              </KanbanColumn>
            </KanbanBoard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. STAGE VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="stages"
        title="Stage Variants"
        description="Pre-defined stage types with semantic icons and colors"
      >
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <KanbanBoard>
              <KanbanColumn title="Applied" count={5} stage="applied">
                <KanbanCard>
                  <p className="text-caption text-foreground-muted">New applications</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Qualified" count={3} stage="qualified">
                <KanbanCard>
                  <p className="text-caption text-foreground-muted">Passed initial screen</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Interview" count={2} stage="interview">
                <KanbanCard>
                  <p className="text-caption text-foreground-muted">In interview process</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Offer" count={1} stage="offer">
                <KanbanCard>
                  <p className="text-caption text-foreground-muted">Offer extended</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Hired" count={1} stage="hired">
                <KanbanCard>
                  <p className="text-caption text-foreground-muted">Accepted offer</p>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Rejected" count={2} stage="rejected">
                <KanbanCard>
                  <p className="text-caption text-foreground-muted">Not moving forward</p>
                </KanbanCard>
              </KanbanColumn>
            </KanbanBoard>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-caption">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primitive-purple-500)]" />
              <span><strong>Applied</strong> — Purple, paper plane icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primitive-blue-500)]" />
              <span><strong>Qualified</strong> — Blue, checkmark icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primitive-orange-500)]" />
              <span><strong>Interview</strong> — Orange, chat icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primitive-green-500)]" />
              <span><strong>Offer</strong> — Green, check circle icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primitive-green-500)]" />
              <span><strong>Hired</strong> — Green, check circle icon</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primitive-red-500)]" />
              <span><strong>Rejected</strong> — Red, x circle icon</span>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. CARD STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="card-states"
        title="Card States"
        description="Interactive states for drag-and-drop operations"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Default</Label>
            <KanbanCard>
              <p className="font-medium text-foreground">Sarah Chen</p>
              <p className="text-caption text-foreground-muted">Solar Engineer</p>
            </KanbanCard>
            <p className="text-caption text-foreground-muted">Ready to be dragged</p>
          </div>
          <div className="space-y-2">
            <Label>Dragging</Label>
            <KanbanCard isDragging>
              <p className="font-medium text-foreground">Sarah Chen</p>
              <p className="text-caption text-foreground-muted">Solar Engineer</p>
            </KanbanCard>
            <p className="text-caption text-foreground-muted">Currently being moved</p>
          </div>
          <div className="space-y-2">
            <Label>Drop Target</Label>
            <KanbanCard isDropTarget>
              <p className="font-medium text-foreground">Sarah Chen</p>
              <p className="text-caption text-foreground-muted">Solar Engineer</p>
            </KanbanCard>
            <p className="text-caption text-foreground-muted">Valid drop location</p>
          </div>
          <div className="space-y-2">
            <Label>Selected</Label>
            <KanbanCard isSelected>
              <p className="font-medium text-foreground">Sarah Chen</p>
              <p className="text-caption text-foreground-muted">Solar Engineer</p>
            </KanbanCard>
            <p className="text-caption text-foreground-muted">Keyboard selected</p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. LOADING STATE */}
      {/* ============================================ */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Skeleton loading with staggered animation"
      >
        <CodePreview
          code={`<KanbanBoard loading skeletonColumns={4}>
  {/* Children are ignored when loading */}
</KanbanBoard>`}
        >
          <div className="overflow-x-auto">
            <KanbanBoard loading skeletonColumns={4}>
              <span />
            </KanbanBoard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. EMPTY STATE */}
      {/* ============================================ */}
      <ComponentCard
        id="empty"
        title="Empty State"
        description="Shown when a column has no cards"
      >
        <CodePreview
          code={`<KanbanColumn title="Offer" count={0} stage="offer">
  <KanbanEmpty message="No candidates in this stage" />
</KanbanColumn>`}
        >
          <div className="overflow-x-auto max-w-md">
            <KanbanBoard>
              <KanbanColumn title="Offer" count={0} stage="offer">
                <KanbanEmpty message="No candidates in this stage" />
              </KanbanColumn>
            </KanbanBoard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. DROP PLACEHOLDER */}
      {/* ============================================ */}
      <ComponentCard
        id="drop-placeholder"
        title="Drop Placeholder"
        description="Visual indicator during drag operations"
      >
        <CodePreview
          code={`{/* Show placeholder where card will be dropped */}
<KanbanDropPlaceholder height={80} />`}
        >
          <div className="space-y-2 max-w-xs">
            <KanbanCard>
              <p className="font-medium text-foreground">Sarah Chen</p>
              <p className="text-caption text-foreground-muted">Solar Engineer</p>
            </KanbanCard>
            <KanbanDropPlaceholder height={72} />
            <KanbanCard>
              <p className="font-medium text-foreground">Michael Torres</p>
              <p className="text-caption text-foreground-muted">Project Manager</p>
            </KanbanCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. ADD CARD BUTTON */}
      {/* ============================================ */}
      <ComponentCard
        id="add-card"
        title="Add Card Button"
        description="Action to add new candidates to a column"
      >
        <CodePreview
          code={`<KanbanColumn title="Applied" stage="applied">
  {/* ... cards ... */}
  <KanbanAddCard
    label="Add candidate"
    onClick={() => openAddModal()}
  />
</KanbanColumn>`}
        >
          <div className="overflow-x-auto max-w-md">
            <KanbanBoard>
              <KanbanColumn title="Applied" count={1} stage="applied">
                <KanbanCard>
                  <p className="font-medium text-foreground">Sarah Chen</p>
                  <p className="text-caption text-foreground-muted">Solar Engineer</p>
                </KanbanCard>
                <KanbanAddCard label="Add candidate" />
              </KanbanColumn>
            </KanbanBoard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. HEADER ACTIONS */}
      {/* ============================================ */}
      <ComponentCard
        id="header-actions"
        title="Header Actions"
        description="Column-level actions in the header"
      >
        <CodePreview
          code={`<KanbanColumn
  title="Interview"
  count={3}
  stage="interview"
  headerActions={
    <div className="flex gap-1">
      <Button variant="ghost" size="icon-sm">
        <FunnelSimple size={16} />
      </Button>
      <Button variant="ghost" size="icon-sm">
        <DotsThree size={16} />
      </Button>
    </div>
  }
>
  {/* cards */}
</KanbanColumn>`}
        >
          <div className="overflow-x-auto max-w-md">
            <KanbanBoard>
              <KanbanColumn
                title="Interview"
                count={2}
                stage="interview"
                headerActions={
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="Filter">
                      <FunnelSimple size={16} />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="More options">
                      <DotsThree size={16} />
                    </Button>
                  </div>
                }
              >
                <KanbanCard>
                  <p className="font-medium text-foreground">Sarah Chen</p>
                  <p className="text-caption text-foreground-muted">Solar Engineer</p>
                </KanbanCard>
                <KanbanCard>
                  <p className="font-medium text-foreground">Michael Torres</p>
                  <p className="text-caption text-foreground-muted">Project Manager</p>
                </KanbanCard>
              </KanbanColumn>
            </KanbanBoard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 11. RICH CARD CONTENT */}
      {/* ============================================ */}
      <ComponentCard
        id="rich-content"
        title="Rich Card Content"
        description="Cards with avatar, skills, and match score"
      >
        <CodePreview
          code={`<KanbanCard>
  <div className="flex items-center gap-3 mb-2">
    <Avatar name="Sarah Chen" size="sm" />
    <div>
      <p className="font-medium">Sarah Chen</p>
      <p className="text-caption text-foreground-muted">Solar Engineer</p>
    </div>
  </div>
  <div className="flex gap-1 mb-2">
    <Badge variant="secondary" size="sm">NABCEP</Badge>
    <Badge variant="secondary" size="sm">PV Design</Badge>
  </div>
  <div className="flex justify-between text-caption">
    <span className="text-foreground-muted">Applied 2d ago</span>
    <span className="text-foreground-success font-medium">92% match</span>
  </div>
</KanbanCard>`}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {sampleCandidates.map((candidate) => (
              <KanbanCard
                key={candidate.id}
                isSelected={selectedCard === candidate.id}
                onClick={() => setSelectedCard(candidate.id)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={candidate.name} size="sm" />
                  <div>
                    <p className="font-medium text-foreground">{candidate.name}</p>
                    <p className="text-caption text-foreground-muted">{candidate.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between text-caption">
                  <span className="text-foreground-muted">Applied 2d ago</span>
                  <span className={candidate.score >= 85 ? "text-foreground-success font-medium" : "text-foreground-warning font-medium"}>
                    {candidate.score}% match
                  </span>
                </div>
              </KanbanCard>
            ))}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 12. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-8">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="KanbanBoard Props">
          <PropsTable props={kanbanBoardProps} />
        </ComponentCard>

        <ComponentCard title="KanbanColumn Props">
          <PropsTable props={kanbanColumnProps} />
        </ComponentCard>

        <ComponentCard title="KanbanCard Props">
          <PropsTable props={kanbanCardProps} />
        </ComponentCard>

        <ComponentCard title="KanbanEmpty Props">
          <PropsTable props={kanbanEmptyProps} />
        </ComponentCard>

        <ComponentCard title="KanbanDropPlaceholder Props">
          <PropsTable props={kanbanDropPlaceholderProps} />
        </ComponentCard>

        <ComponentCard title="KanbanAddCard Props">
          <PropsTable props={kanbanAddCardProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 13. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="text-heading-sm text-foreground mb-4">
          Usage Guidelines
        </h2>
        <UsageGuide
          dos={[
            "Use consistent stage colors across all pipeline views",
            "Show candidate count in column headers",
            "Provide loading states during data fetch",
            "Use drag handle indicator for accessibility",
            "Allow keyboard navigation between cards",
            "Show empty state when columns have no cards",
            "Limit visible skills/tags to 2-3 with overflow indicator",
            "Display match score for AI-enabled pipelines",
          ]}
          donts={[
            "Don't have more than 6-7 columns visible at once",
            "Don't show too much detail on cards (use modal for details)",
            "Don't allow dropping without confirmation for stage changes",
            "Don't hide the drag handle on mobile",
            "Don't auto-scroll too aggressively during drag",
            "Don't disable card interactions during loading",
            "Don't use custom colors that don't follow the design system",
            "Don't show AI match score without explanation available",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard**: Cards have role='button' and tabIndex for keyboard focus",
            "**Navigation**: Use Tab to move between cards, Enter/Space to select",
            "**Drag indicator**: Visual drag handle appears on hover/focus",
            "**Focus ring**: 2px green focus ring with offset for clear visibility",
            "**ARIA**: Cards use role='button' for interaction semantics",
            "**Screen readers**: Column headers announce title and count",
            "**Motion**: Drag animations respect prefers-reduced-motion",
            "**Touch**: Touch-friendly hit targets (minimum 44x44px)",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 15. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Candidate Card",
              href: "/design-system/components/candidate-card",
              description: "Detailed candidate information display",
            },
            {
              name: "Stage Badge",
              href: "/design-system/components/stage-badge",
              description: "Pipeline stage indicators",
            },
            {
              name: "Activity Feed",
              href: "/design-system/components/activity-feed",
              description: "Candidate interaction history",
            },
            {
              name: "Match Score",
              href: "/design-system/components/match-score",
              description: "AI-generated fit percentage",
            },
            {
              name: "Data Table",
              href: "/design-system/components/data-table",
              description: "Alternative list view for candidates",
            },
            {
              name: "Skeleton",
              href: "/design-system/components/skeleton",
              description: "Loading states for content",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 16. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">
          Real-World Examples
        </h2>

        <RealWorldExample
          title="Full Hiring Pipeline"
          description="Complete Kanban board for a job posting"
        >
          <div className="overflow-x-auto">
            <KanbanBoard>
              <KanbanColumn title="Applied" count={12} stage="applied">
                <KanbanCard>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name="Alex Rivera" size="xs" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">Alex Rivera</p>
                      <p className="text-caption text-foreground-muted">Sustainability Lead</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary" size="sm">B Corp</Badge>
                  </div>
                </KanbanCard>
                <KanbanCard>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name="Jordan Kim" size="xs" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">Jordan Kim</p>
                      <p className="text-caption text-foreground-muted">Climate Analyst</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="secondary" size="sm">ESG</Badge>
                  </div>
                </KanbanCard>
                <KanbanAddCard />
              </KanbanColumn>
              <KanbanColumn title="Qualified" count={5} stage="qualified">
                <KanbanCard>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name="Sarah Chen" size="xs" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">Sarah Chen</p>
                      <p className="text-caption text-foreground-muted">Solar Engineer</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" size="sm">NABCEP</Badge>
                    <span className="text-caption text-foreground-success font-medium">92%</span>
                  </div>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Interview" count={2} stage="interview">
                <KanbanCard>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name="Michael Torres" size="xs" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">Michael Torres</p>
                      <p className="text-caption text-foreground-muted">Project Manager</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="info" size="sm">Round 2</Badge>
                    <span className="text-caption text-foreground-success font-medium">87%</span>
                  </div>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Offer" count={1} stage="offer">
                <KanbanCard>
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name="Emily Johnson" size="xs" />
                    <div>
                      <p className="text-body-sm font-medium text-foreground">Emily Johnson</p>
                      <p className="text-caption text-foreground-muted">ESG Specialist</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Offer Sent</Badge>
                </KanbanCard>
              </KanbanColumn>
              <KanbanColumn title="Hired" count={0} stage="hired">
                <KanbanEmpty message="No hires yet" />
              </KanbanColumn>
            </KanbanBoard>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="With dnd-kit Integration"
          description="Implementing drag-and-drop with @dnd-kit/core"
        >
          <div className="p-6 bg-background-subtle rounded-lg">
            <CodePreview
              code={`import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';

function PipelineBoard() {
  const [activeId, setActiveId] = useState(null);
  const [candidates, setCandidates] = useState(initialCandidates);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Move candidate to new stage
      moveCandidateToStage(active.id, over.data.current.stage);
    }
    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <KanbanBoard>
        {stages.map(stage => (
          <SortableContext items={candidatesInStage(stage.id)}>
            <KanbanColumn title={stage.name} stage={stage.id}>
              {candidatesInStage(stage.id).map(candidate => (
                <SortableCard key={candidate.id} candidate={candidate} />
              ))}
            </KanbanColumn>
          </SortableContext>
        ))}
      </KanbanBoard>

      <DragOverlay>
        {activeId ? <KanbanCard isDragging>...</KanbanCard> : null}
      </DragOverlay>
    </DndContext>
  );
}`}
            >
              <div className="text-center py-8 text-foreground-muted">
                <p className="text-body-sm">
                  This component is presentational only. Implement drag-and-drop
                  with <code className="bg-background-muted px-1 rounded">@dnd-kit/core</code> at
                  the application level.
                </p>
              </div>
            </CodePreview>
          </div>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/kanban" />
    </div>
  );
}

"use client";

import React from "react";
import {
  CandidateCard,
  CandidateHeader,
  CandidateMeta,
  CandidateMetaItem,
  CandidateSkills,
  CandidateScore,
  CandidateActions,
  CandidateStage,
  CandidateDate,
  CandidateKanbanHeader,
  CandidateReviewers,
} from "@/components/ui/candidate-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  MapPin,
  Envelope,
  Briefcase,
  Calendar,
} from "@phosphor-icons/react";

// Props documentation
const candidateCardProps = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Content of the card (header, meta, skills, actions)",
  },
  {
    name: "variant",
    type: '"compact" | "expanded"',
    default: '"compact"',
    description: "Compact for Kanban cards, expanded for list views",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show skeleton loading state",
  },
];

const candidateHeaderProps = [
  {
    name: "name",
    type: "string",
    required: true,
    description: "Candidate's full name",
  },
  {
    name: "email",
    type: "string",
    description: "Candidate's email address",
  },
  {
    name: "avatarUrl",
    type: "string",
    description: "URL for candidate's avatar image",
  },
  {
    name: "avatarFallback",
    type: "string",
    description: "Fallback initials for avatar (auto-generated from name)",
  },
];

const candidateSkillsProps = [
  {
    name: "skills",
    type: "string[]",
    required: true,
    description: "Array of skill names to display",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "3",
    description: "Maximum skills to show before collapsing into +N badge",
  },
];

const candidateScoreProps = [
  {
    name: "score",
    type: "number",
    required: true,
    description: "Match score percentage (0-100)",
  },
  {
    name: "label",
    type: "string",
    default: '"Match"',
    description: "Label shown after the score",
  },
  {
    name: "variant",
    type: '"auto" | "excellent" | "good" | "average" | "poor"',
    default: '"auto"',
    description: "Color variant (auto determines from score value)",
  },
  {
    name: "showProgress",
    type: "boolean",
    default: "false",
    description: "Show progress bar visualization",
  },
];

const candidateDateProps = [
  {
    name: "date",
    type: "Date | string",
    required: true,
    description: "Application date",
  },
  {
    name: "prefix",
    type: "string",
    default: '"Applied"',
    description: "Text prefix before the date",
  },
  {
    name: "relative",
    type: "boolean",
    default: "false",
    description: "Show relative time (e.g., '2 days ago') instead of absolute",
  },
];

const candidateKanbanHeaderProps = [
  {
    name: "name",
    type: "string",
    required: true,
    description: "Candidate's full name",
  },
  {
    name: "avatarUrl",
    type: "string",
    description: "URL for candidate's avatar image",
  },
  {
    name: "rating",
    type: "number",
    description: "Average reviewer rating (0-5 stars)",
  },
  {
    name: "matchScore",
    type: "number",
    description: "AI-generated match score (0-100%)",
  },
  {
    name: "appliedDate",
    type: "Date | string",
    description: "When the candidate applied",
  },
];

const candidateReviewersProps = [
  {
    name: "reviewers",
    type: "Array<{ name: string; avatarUrl?: string; status: 'in_review' | number }>",
    required: true,
    description: "Array of reviewer data with name, avatar, and rating/status",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "3",
    description: "Maximum reviewers to show before collapse",
  },
  {
    name: "expanded",
    type: "boolean",
    default: "false",
    description: "Always show all reviewers",
  },
];

export default function CandidateCardPage() {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Candidate Card
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl mb-4">
          Display candidate information at a glance with avatar, skills, match scores,
          and metadata. Optimized for both Kanban pipeline views (compact) and detailed
          list views (expanded).
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success/10 rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">When to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Kanban board pipeline cards</li>
              <li>• Candidate list/table rows</li>
              <li>• Search results display</li>
              <li>• Candidate comparison views</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error/10 rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">When not to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>• Full candidate profile pages (use dedicated layout)</li>
              <li>• Team member cards (use different component)</li>
              <li>• Interview scheduling (use scheduler component)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The candidate card is built from composable sub-components"
      >
        <div className="relative p-6 bg-background-subtle rounded-lg">
          <div className="max-w-sm">
            <CandidateCard variant="expanded">
              <div className="relative">
                <CandidateHeader
                  name="Sarah Chen"
                  email="sarah.chen@example.com"
                />
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
              </div>
              <div className="relative mt-3">
                <CandidateMeta>
                  <CandidateMetaItem icon={<MapPin size={14} />}>
                    San Francisco, CA
                  </CandidateMetaItem>
                  <CandidateMetaItem icon={<Briefcase size={14} />}>
                    5 years exp.
                  </CandidateMetaItem>
                </CandidateMeta>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
              </div>
              <div className="relative mt-3">
                <CandidateSkills skills={["React", "TypeScript", "Node.js", "GraphQL", "AWS"]} />
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
              </div>
              <div className="relative mt-3">
                <CandidateScore score={92} showProgress />
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">4</div>
              </div>
              <div className="relative">
                <CandidateActions>
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm">Schedule</Button>
                </CandidateActions>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">5</div>
              </div>
            </CandidateCard>
          </div>
          <div className="mt-6 grid grid-cols-5 gap-2 text-sm">
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">1</span> Header</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">2</span> Meta</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">3</span> Skills</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">4</span> Score</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">5</span> Actions</div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple candidate card with essential information"
      >
        <CodePreview
          code={`import {
  CandidateCard,
  CandidateHeader,
  CandidateSkills,
  CandidateScore,
} from "@/components/ui/candidate-card";

<CandidateCard>
  <CandidateHeader
    name="Sarah Chen"
    email="sarah.chen@example.com"
  />
  <CandidateSkills
    skills={["React", "TypeScript", "Node.js"]}
  />
  <CandidateScore score={85} />
</CandidateCard>`}
        >
          <div className="max-w-sm">
            <CandidateCard>
              <CandidateHeader
                name="Sarah Chen"
                email="sarah.chen@example.com"
              />
              <CandidateSkills
                skills={["React", "TypeScript", "Node.js"]}
                className="mt-3"
              />
              <CandidateScore score={85} className="mt-3" />
            </CandidateCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Compact for Kanban, expanded for list views"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label>Compact (Default)</Label>
            <p className="text-caption text-foreground-muted">Used in Kanban columns</p>
            <CandidateCard variant="compact">
              <CandidateHeader name="Sarah Chen" email="sarah.chen@example.com" />
              <CandidateSkills skills={["React", "TypeScript", "Node.js"]} className="mt-3" />
            </CandidateCard>
          </div>
          <div className="space-y-3">
            <Label>Expanded</Label>
            <p className="text-caption text-foreground-muted">Used in list/table views</p>
            <CandidateCard variant="expanded">
              <CandidateHeader name="Sarah Chen" email="sarah.chen@example.com" />
              <CandidateMeta className="mt-2">
                <CandidateMetaItem icon={<MapPin size={14} />}>San Francisco</CandidateMetaItem>
                <CandidateMetaItem icon={<Briefcase size={14} />}>5 years</CandidateMetaItem>
              </CandidateMeta>
              <CandidateSkills skills={["React", "TypeScript", "Node.js", "GraphQL"]} className="mt-3" />
              <CandidateScore score={92} showProgress className="mt-3" />
              <CandidateActions>
                <Button size="sm" variant="outline">View Profile</Button>
                <Button size="sm">Schedule Interview</Button>
              </CandidateActions>
            </CandidateCard>
          </div>
        </div>
      </ComponentCard>

      {/* Loading State */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Skeleton placeholder while data loads"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Label>Compact Loading</Label>
            <CandidateCard loading variant="compact">
              <span />
            </CandidateCard>
          </div>
          <div className="space-y-3">
            <Label>Expanded Loading</Label>
            <CandidateCard loading variant="expanded">
              <span />
            </CandidateCard>
          </div>
        </div>
      </ComponentCard>

      {/* Candidate Score */}
      <ComponentCard
        id="score"
        title="Candidate Score"
        description="AI-generated match scores with color-coded variants"
      >
        <div className="space-y-6">
          {/* Auto variants based on score */}
          <div>
            <h4 className="text-body-strong mb-4">Auto Color by Score</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Excellent (85+)</Label>
                <CandidateScore score={92} />
              </div>
              <div className="space-y-2">
                <Label>Good (70-84)</Label>
                <CandidateScore score={78} />
              </div>
              <div className="space-y-2">
                <Label>Average (50-69)</Label>
                <CandidateScore score={62} />
              </div>
              <div className="space-y-2">
                <Label>Poor (&lt;50)</Label>
                <CandidateScore score={35} />
              </div>
            </div>
          </div>

          {/* With progress bar */}
          <div>
            <h4 className="text-body-strong mb-4">With Progress Bar</h4>
            <div className="space-y-4 max-w-md">
              <CandidateScore score={92} showProgress label="AI Match" />
              <CandidateScore score={78} showProgress label="AI Match" />
              <CandidateScore score={55} showProgress label="AI Match" />
            </div>
          </div>

          {/* Manual variants */}
          <div>
            <h4 className="text-body-strong mb-4">Manual Variants</h4>
            <div className="flex flex-wrap gap-4">
              <CandidateScore score={75} variant="excellent" />
              <CandidateScore score={75} variant="good" />
              <CandidateScore score={75} variant="average" />
              <CandidateScore score={75} variant="poor" />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Skills Display */}
      <ComponentCard
        id="skills"
        title="Skills Display"
        description="Badges with overflow handling"
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-4">Default (3 visible)</h4>
            <CandidateSkills
              skills={["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"]}
            />
          </div>
          <div>
            <h4 className="text-body-strong mb-4">Custom maxVisible (5)</h4>
            <CandidateSkills
              skills={["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker", "Kubernetes"]}
              maxVisible={5}
            />
          </div>
          <div>
            <h4 className="text-body-strong mb-4">Few Skills (no overflow)</h4>
            <CandidateSkills skills={["React", "TypeScript"]} />
          </div>
        </div>
      </ComponentCard>

      {/* Date Display */}
      <ComponentCard
        id="date"
        title="Application Date"
        description="Show when the candidate applied"
      >
        <div className="flex flex-wrap gap-8">
          <div className="space-y-2">
            <Label>Absolute Date</Label>
            <CandidateDate date={new Date()} />
          </div>
          <div className="space-y-2">
            <Label>Relative Time</Label>
            <CandidateDate date={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)} relative />
          </div>
          <div className="space-y-2">
            <Label>Custom Prefix</Label>
            <CandidateDate date={new Date()} prefix="Submitted" />
          </div>
        </div>
      </ComponentCard>

      {/* Kanban Header */}
      <ComponentCard
        id="kanban-header"
        title="Kanban Header"
        description="Optimized header for Kanban cards with rating, match score, and date"
      >
        <CodePreview
          code={`<CandidateKanbanHeader
  name="Sarah Chen"
  rating={4.5}
  matchScore={92}
  appliedDate={new Date()}
/>`}
        >
          <div className="space-y-4 max-w-sm">
            <CandidateCard>
              <CandidateKanbanHeader
                name="Sarah Chen"
                rating={4.5}
                matchScore={92}
                appliedDate={new Date()}
              />
            </CandidateCard>
            <CandidateCard>
              <CandidateKanbanHeader
                name="Michael Park"
                rating={3.8}
                matchScore={78}
                appliedDate={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)}
              />
            </CandidateCard>
            <CandidateCard>
              <CandidateKanbanHeader
                name="Emily Davis"
                matchScore={65}
                appliedDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
              />
            </CandidateCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Reviewers Section */}
      <ComponentCard
        id="reviewers"
        title="Reviewers Section"
        description="Display interviewer ratings with collapsible list"
      >
        <CodePreview
          code={`<CandidateReviewers
  reviewers={[
    { name: "John Smith", status: 4.5 },
    { name: "Lisa Wang", status: "in_review" },
    { name: "Mike Brown", status: 4.0 },
    { name: "Sarah Lee", status: 3.5 },
  ]}
  maxVisible={3}
/>`}
        >
          <div className="max-w-sm">
            <CandidateCard>
              <CandidateKanbanHeader
                name="Sarah Chen"
                rating={4.0}
                matchScore={88}
              />
              <CandidateReviewers
                reviewers={[
                  { name: "John Smith", status: 4.5 },
                  { name: "Lisa Wang", status: "in_review" },
                  { name: "Mike Brown", status: 4.0 },
                  { name: "Sarah Lee", status: 3.5 },
                ]}
                maxVisible={3}
              />
            </CandidateCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Complete Examples */}
      <ComponentCard
        id="examples"
        title="Complete Examples"
        description="Real-world usage patterns"
      >
        <div className="space-y-8">
          {/* Kanban Card */}
          <div>
            <h4 className="text-body-strong mb-4">Kanban Pipeline Card</h4>
            <div className="max-w-xs">
              <CandidateCard variant="compact">
                <CandidateKanbanHeader
                  name="Sarah Chen"
                  rating={4.2}
                  matchScore={92}
                  appliedDate={new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)}
                />
                <CandidateSkills
                  skills={["React", "TypeScript", "Node.js", "AWS"]}
                  className="mt-3"
                />
                <CandidateReviewers
                  reviewers={[
                    { name: "John Smith", status: 4.5 },
                    { name: "Lisa Wang", status: "in_review" },
                  ]}
                />
              </CandidateCard>
            </div>
          </div>

          {/* List View Card */}
          <div>
            <h4 className="text-body-strong mb-4">List View Card</h4>
            <div className="max-w-lg">
              <CandidateCard variant="expanded">
                <div className="flex items-start justify-between">
                  <CandidateHeader
                    name="Michael Park"
                    email="michael.park@example.com"
                  />
                  <Badge variant="success">New</Badge>
                </div>
                <CandidateMeta className="mt-2">
                  <CandidateMetaItem icon={<MapPin size={14} />}>
                    New York, NY
                  </CandidateMetaItem>
                  <CandidateMetaItem icon={<Briefcase size={14} />}>
                    8 years experience
                  </CandidateMetaItem>
                  <CandidateMetaItem icon={<Calendar size={14} />}>
                    Applied Jan 20, 2025
                  </CandidateMetaItem>
                </CandidateMeta>
                <CandidateSkills
                  skills={["Python", "Machine Learning", "TensorFlow", "PyTorch", "Data Science"]}
                  maxVisible={4}
                  className="mt-3"
                />
                <div className="flex items-center justify-between mt-3">
                  <CandidateScore score={88} showProgress label="AI Match" />
                  <CandidateStage stage="Screening" color="#3b82f6" />
                </div>
                <CandidateActions>
                  <Button size="sm" variant="ghost">
                    <Envelope size={16} className="mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">View Profile</Button>
                  <Button size="sm">Schedule</Button>
                </CandidateActions>
              </CandidateCard>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="text-body-strong mb-3">CandidateCard</h4>
              <PropsTable props={candidateCardProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">CandidateHeader</h4>
              <PropsTable props={candidateHeaderProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">CandidateSkills</h4>
              <PropsTable props={candidateSkillsProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">CandidateScore</h4>
              <PropsTable props={candidateScoreProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">CandidateDate</h4>
              <PropsTable props={candidateDateProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">CandidateKanbanHeader</h4>
              <PropsTable props={candidateKanbanHeaderProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">CandidateReviewers</h4>
              <PropsTable props={candidateReviewersProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Use compact variant in Kanban columns for space efficiency",
          "Show AI match scores with clear reasoning (tooltip or expandable)",
          "Use consistent skill badge styling across all cards",
          "Show loading skeletons while fetching candidate data",
          "Truncate long names/emails with tooltips for full text",
        ]}
        donts={[
          "Don't show too many skills (use maxVisible to limit)",
          "Don't auto-reject based on AI scores without human review",
          "Don't hide important metadata in compact view",
          "Don't use different card layouts in the same Kanban board",
          "Don't show scores without context (always explain AI reasoning)",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Interactive Cards**: Cards are focusable with visible focus ring",
          "**Tooltips**: Long names and emails show full text on hover/focus",
          "**Overflow Skills**: '+N more' badge expands on hover to show all skills",
          "**Score Colors**: Use both color and numeric value for score indication",
          "**Avatar Fallbacks**: Auto-generates initials when image is unavailable",
          "**Keyboard**: All interactive elements accessible via Tab navigation",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Candidate Card"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/kanban"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Kanban Board</p>
            <p className="text-caption text-foreground-muted">Pipeline view</p>
          </a>
          <a
            href="/design-system/components/scorecard"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Scorecard</p>
            <p className="text-caption text-foreground-muted">Evaluation forms</p>
          </a>
          <a
            href="/design-system/components/stage-badge"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Stage Badge</p>
            <p className="text-caption text-foreground-muted">Pipeline stages</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Avatar</p>
            <p className="text-caption text-foreground-muted">User images</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/candidate-card" />
    </div>
  );
}

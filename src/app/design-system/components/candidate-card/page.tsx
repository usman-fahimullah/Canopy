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
  CandidateTags,
  CandidateActivity,
  DaysInStage,
  DecisionPill,
  StarRating,
  type ReviewerData,
  type DecisionType,
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
import { MapPin, Envelope, Briefcase, Calendar } from "@phosphor-icons/react";

// ============================================
// PROPS DOCUMENTATION
// ============================================

const candidateCardProps = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Content of the card (header, tags, activity, reviewers)",
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
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Visual selected state — highlights card with brand border and background",
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
    description: "AI-generated match score (0-100%), colored by --match-* tokens",
  },
  {
    name: "appliedDate",
    type: "Date | string",
    description: "When the candidate applied (shows relative time)",
  },
];

const candidateTagsProps = [
  {
    name: "tags",
    type: "CandidateTag[] | string[]",
    required: true,
    description: "Array of tags — strings or objects with label and optional color variant",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "3",
    description: "Maximum tags to show before collapsing into +N tooltip",
  },
];

const candidateActivityProps = [
  {
    name: "lastComment",
    type: "string",
    description: 'Last comment time, e.g. "2h ago"',
  },
  {
    name: "scheduledInterview",
    type: "string",
    description: 'Scheduled interview info, e.g. "Tomorrow, 2pm"',
  },
  {
    name: "showNotScheduled",
    type: "boolean",
    default: "false",
    description: 'Show "Not scheduled" when no interview is scheduled',
  },
];

const daysInStageProps = [
  {
    name: "days",
    type: "number",
    required: true,
    description: "Number of days in the current pipeline stage",
  },
  {
    name: "warningThreshold",
    type: "number",
    default: "7",
    description: "Days before warning color is applied (orange)",
  },
  {
    name: "criticalThreshold",
    type: "number",
    default: "14",
    description: "Days before critical color is applied (red with warning icon)",
  },
  {
    name: "showIcon",
    type: "boolean",
    default: "true",
    description: "Show clock or warning icon",
  },
  {
    name: "compact",
    type: "boolean",
    default: "false",
    description: "Compact display mode",
  },
];

const decisionPillProps = [
  {
    name: "decision",
    type: '"strong_yes" | "yes" | "maybe" | "no" | "pending"',
    required: true,
    description: "Decision type — determines color, icon, and label",
  },
  {
    name: "showIcon",
    type: "boolean",
    default: "true",
    description: "Show the decision icon",
  },
  {
    name: "size",
    type: '"sm" | "default"',
    default: '"default"',
    description: "Pill size",
  },
];

const starRatingProps = [
  {
    name: "rating",
    type: "number",
    required: true,
    description: "Rating value (supports half-stars via rounding)",
  },
  {
    name: "maxStars",
    type: "number",
    default: "5",
    description: "Maximum number of stars",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"sm"',
    description: "Star icon size (14px, 16px, 20px)",
  },
  {
    name: "showValue",
    type: "boolean",
    default: "false",
    description: "Show numeric value before stars",
  },
];

const candidateReviewersProps = [
  {
    name: "reviewers",
    type: "ReviewerData[]",
    required: true,
    description:
      "Array of reviewer data with name, optional avatar, status (DecisionType | number | 'in_review'), optional rating, and optional color",
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
    description: "Start in expanded mode showing all reviewer rows",
  },
  {
    name: "showSummary",
    type: "boolean",
    description: "Override auto-behavior for collapsed summary row",
  },
];

const candidateSkillsProps = [
  {
    name: "skills",
    type: "string[]",
    required: true,
    description: "Array of skill names to display as badges",
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

// ============================================
// SAMPLE DATA
// ============================================

const sampleReviewers: ReviewerData[] = [
  { name: "Leo Moreau", status: "yes", rating: 5, color: "blue" },
  { name: "Rachel Costanza", status: "yes", rating: 4, color: "red" },
  { name: "Maya Fernandez", status: "maybe", rating: 4, color: "green" },
];

const singleReviewer: ReviewerData[] = [{ name: "Soobin Han", status: "pending", color: "purple" }];

const manyReviewers: ReviewerData[] = [
  { name: "Benjamin Martinez", status: "strong_yes", rating: 5, color: "orange" },
  { name: "Alexander Smith", status: "yes", rating: 4, color: "blue" },
  { name: "Jacob Souza", status: "yes", rating: 4, color: "purple" },
  { name: "Sarah Chen", status: "maybe", rating: 3, color: "red" },
];

export default function CandidateCardPage() {
  const [selectedCards, setSelectedCards] = React.useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-12">
      {/* ============================================
          OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg font-bold text-foreground">
          Candidate Card
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Clean, minimal cards for displaying candidate information in ATS pipeline views. Designed
          for scannability with clear visual hierarchy: name + avatar as primary anchor, rating +
          match score as compact meta, colored tags, activity indicators, and collapsible reviewer
          sections with decision pills.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Kanban board pipeline cards (compact variant)</li>
              <li>• Candidate list/table rows (expanded variant)</li>
              <li>• Search results display</li>
              <li>• Bulk selection and comparison views</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Full candidate profile pages (use dedicated layout)</li>
              <li>• Team member cards (use different component)</li>
              <li>• Simple contact cards without ATS context</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          ANATOMY — Kanban Card
          ============================================ */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The Kanban card is built from composable sub-components, each responsible for a layer of information"
      >
        <div className="relative rounded-lg bg-background-subtle p-6">
          <div className="max-w-sm space-y-4">
            <div className="relative">
              <span className="absolute -left-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                1
              </span>
              <CandidateKanbanHeader
                name="Myna Ahmed"
                rating={4.2}
                matchScore={85}
                appliedDate={new Date()}
              />
            </div>
            <div className="relative">
              <span className="absolute -left-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                2
              </span>
              <CandidateTags
                tags={[
                  { label: "Portfolio", variant: "blue" },
                  { label: "Referred", variant: "green" },
                ]}
              />
            </div>
            <div className="relative">
              <span className="absolute -left-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                3
              </span>
              <CandidateActivity lastComment="2h ago" scheduledInterview="Tomorrow, 2pm" />
            </div>
            <div className="relative">
              <span className="absolute -left-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                4
              </span>
              <DaysInStage days={6} />
            </div>
            <div className="relative">
              <span className="absolute -left-3 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                5
              </span>
              <CandidateReviewers reviewers={sampleReviewers} expanded />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2 text-sm">
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">1</span> Kanban
              Header
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">2</span> Tags
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">3</span>{" "}
              Activity
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">4</span> Days in
              Stage
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">5</span>{" "}
              Reviewers
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          BASIC USAGE — Full Kanban Card
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A complete Kanban pipeline card with all sub-components"
      >
        <CodePreview
          code={`import {
  CandidateCard,
  CandidateKanbanHeader,
  CandidateTags,
  CandidateActivity,
  CandidateReviewers,
  DaysInStage,
} from "@/components/ui/candidate-card";

<CandidateCard>
  <div className="space-y-3">
    <div className="flex items-start justify-between">
      <CandidateKanbanHeader
        name="Myna Ahmed"
        rating={4.2}
        matchScore={85}
        appliedDate={new Date()}
      />
      <DaysInStage days={6} compact />
    </div>
    <CandidateTags
      tags={[
        { label: "Portfolio", variant: "blue" },
        { label: "Referred", variant: "green" },
      ]}
    />
    <CandidateActivity
      lastComment="2h ago"
      scheduledInterview="Tomorrow, 2pm"
    />
    <CandidateReviewers
      reviewers={[
        { name: "Leo Moreau", status: "yes", rating: 5, color: "blue" },
        { name: "Rachel Costanza", status: "yes", rating: 4, color: "red" },
        { name: "Maya Fernandez", status: "maybe", rating: 4, color: "green" },
      ]}
    />
  </div>
</CandidateCard>`}
        >
          <div className="max-w-sm">
            <CandidateCard>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <CandidateKanbanHeader
                    name="Myna Ahmed"
                    rating={4.2}
                    matchScore={85}
                    appliedDate={new Date()}
                  />
                  <DaysInStage days={6} compact />
                </div>
                <CandidateTags
                  tags={[
                    { label: "Portfolio", variant: "blue" },
                    { label: "Referred", variant: "green" },
                  ]}
                />
                <CandidateActivity lastComment="2h ago" scheduledInterview="Tomorrow, 2pm" />
                <CandidateReviewers reviewers={sampleReviewers} />
              </div>
            </CandidateCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          VARIANTS — Compact vs Expanded
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Compact for Kanban columns, expanded for list views"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <Label>Compact (Default)</Label>
            <p className="text-caption text-foreground-muted">
              Used in Kanban columns — tight spacing, minimal footprint
            </p>
            <CandidateCard variant="compact">
              <div className="space-y-3">
                <CandidateKanbanHeader
                  name="Sarah Chen"
                  rating={4.5}
                  matchScore={92}
                  appliedDate={new Date()}
                />
                <CandidateTags
                  tags={[
                    { label: "Top Match", variant: "green" },
                    { label: "Senior", variant: "amber" },
                  ]}
                />
                <CandidateActivity lastComment="3h ago" />
                <CandidateReviewers
                  reviewers={[
                    { name: "Mike Johnson", status: "strong_yes", rating: 5, color: "blue" },
                    { name: "Lisa Park", status: "yes", rating: 4, color: "green" },
                  ]}
                />
              </div>
            </CandidateCard>
          </div>
          <div className="space-y-3">
            <Label>Expanded</Label>
            <p className="text-caption text-foreground-muted">
              Used in list/table views — more room for detail
            </p>
            <CandidateCard variant="expanded">
              <div className="flex items-start justify-between">
                <CandidateHeader name="Michael Park" email="michael.park@example.com" />
                <Badge variant="success">New</Badge>
              </div>
              <CandidateMeta className="mt-2">
                <CandidateMetaItem icon={<MapPin size={14} />}>New York, NY</CandidateMetaItem>
                <CandidateMetaItem icon={<Briefcase size={14} />}>8 years</CandidateMetaItem>
              </CandidateMeta>
              <CandidateSkills
                skills={["Python", "ML", "TensorFlow", "PyTorch"]}
                className="mt-3"
              />
              <div className="mt-3 flex items-center justify-between">
                <CandidateScore score={88} showProgress label="AI Match" />
                <CandidateStage stage="Screening" />
              </div>
              <CandidateActions>
                <Button size="sm" variant="ghost">
                  <Envelope size={16} className="mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
                <Button size="sm">Schedule</Button>
              </CandidateActions>
            </CandidateCard>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          DECISION PILLS
          ============================================ */}
      <ComponentCard
        id="decision-pills"
        title="Decision Pills"
        description="Reviewer decisions displayed as compact, colored pills with icons"
      >
        <CodePreview
          code={`import { DecisionPill } from "@/components/ui/candidate-card";

<DecisionPill decision="strong_yes" />
<DecisionPill decision="yes" />
<DecisionPill decision="maybe" />
<DecisionPill decision="no" />
<DecisionPill decision="pending" />`}
        >
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-body-strong">All Decision Types</h4>
              <div className="flex flex-wrap gap-3">
                <div className="space-y-2 text-center">
                  <DecisionPill decision="strong_yes" />
                  <p className="text-caption text-foreground-muted">strong_yes</p>
                </div>
                <div className="space-y-2 text-center">
                  <DecisionPill decision="yes" />
                  <p className="text-caption text-foreground-muted">yes</p>
                </div>
                <div className="space-y-2 text-center">
                  <DecisionPill decision="maybe" />
                  <p className="text-caption text-foreground-muted">maybe</p>
                </div>
                <div className="space-y-2 text-center">
                  <DecisionPill decision="no" />
                  <p className="text-caption text-foreground-muted">no</p>
                </div>
                <div className="space-y-2 text-center">
                  <DecisionPill decision="pending" />
                  <p className="text-caption text-foreground-muted">pending</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-body-strong">Sizes</h4>
              <div className="flex items-center gap-4">
                <div className="space-y-1">
                  <Label>Default</Label>
                  <DecisionPill decision="yes" />
                </div>
                <div className="space-y-1">
                  <Label>Small</Label>
                  <DecisionPill decision="yes" size="sm" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-body-strong">Without Icons</h4>
              <div className="flex flex-wrap gap-2">
                <DecisionPill decision="strong_yes" showIcon={false} />
                <DecisionPill decision="yes" showIcon={false} />
                <DecisionPill decision="maybe" showIcon={false} />
                <DecisionPill decision="no" showIcon={false} />
              </div>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          DAYS IN STAGE
          ============================================ */}
      <ComponentCard
        id="days-in-stage"
        title="Days in Stage"
        description="Displays how long a candidate has been in the current stage with urgency coloring"
      >
        <CodePreview
          code={`import { DaysInStage } from "@/components/ui/candidate-card";

<DaysInStage days={3} />  {/* Normal — muted */}
<DaysInStage days={8} />  {/* Warning at 7d — orange */}
<DaysInStage days={15} /> {/* Critical at 14d — red + warning icon */}`}
        >
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-body-strong">Urgency Thresholds</h4>
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <Label>Normal (0-6 days)</Label>
                  <DaysInStage days={3} />
                </div>
                <div className="space-y-2">
                  <Label>Warning (7-13 days)</Label>
                  <DaysInStage days={8} />
                </div>
                <div className="space-y-2">
                  <Label>Critical (14+ days)</Label>
                  <DaysInStage days={15} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-body-strong">Custom Thresholds</h4>
              <div className="flex flex-wrap gap-6">
                <div className="space-y-2">
                  <Label>Warning at 3d, Critical at 5d</Label>
                  <DaysInStage days={4} warningThreshold={3} criticalThreshold={5} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-body-strong">Without Icon</h4>
              <DaysInStage days={10} showIcon={false} />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          CANDIDATE TAGS
          ============================================ */}
      <ComponentCard
        id="tags"
        title="Candidate Tags"
        description="Lightweight colored pills for categorization — supports 6 color variants"
      >
        <CodePreview
          code={`import { CandidateTags } from "@/components/ui/candidate-card";

{/* Object tags with color variants */}
<CandidateTags
  tags={[
    { label: "Portfolio", variant: "blue" },
    { label: "Referred", variant: "green" },
    { label: "Senior", variant: "amber" },
  ]}
/>

{/* Simple string tags (default color) */}
<CandidateTags tags={["React", "TypeScript", "Node.js"]} />`}
        >
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-body-strong">Color Variants</h4>
              <div className="space-y-3">
                <CandidateTags
                  tags={[
                    { label: "Default", variant: "default" },
                    { label: "Green", variant: "green" },
                    { label: "Blue", variant: "blue" },
                    { label: "Amber", variant: "amber" },
                    { label: "Purple", variant: "purple" },
                    { label: "Pink", variant: "pink" },
                  ]}
                  maxVisible={6}
                />
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-body-strong">With Overflow (+N tooltip)</h4>
              <CandidateTags
                tags={[
                  { label: "Portfolio", variant: "blue" },
                  { label: "Referred", variant: "green" },
                  { label: "Senior", variant: "amber" },
                  { label: "Art School", variant: "purple" },
                  { label: "Top Match", variant: "green" },
                ]}
                maxVisible={3}
              />
            </div>

            <div>
              <h4 className="mb-4 text-body-strong">String Tags (Default Color)</h4>
              <CandidateTags tags={["React", "TypeScript", "Node.js"]} />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          CANDIDATE ACTIVITY
          ============================================ */}
      <ComponentCard
        id="activity"
        title="Candidate Activity"
        description="Compact activity indicators for last comment and scheduled interviews"
      >
        <CodePreview
          code={`import { CandidateActivity } from "@/components/ui/candidate-card";

<CandidateActivity
  lastComment="2h ago"
  scheduledInterview="Tomorrow, 2pm"
/>`}
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Comment + Interview</Label>
              <CandidateActivity lastComment="2h ago" scheduledInterview="Tomorrow, 2pm" />
            </div>
            <div className="space-y-2">
              <Label>Comment Only</Label>
              <CandidateActivity lastComment="1d ago" />
            </div>
            <div className="space-y-2">
              <Label>Interview Only</Label>
              <CandidateActivity scheduledInterview="Mon, 10am" />
            </div>
            <div className="space-y-2">
              <Label>Not Scheduled</Label>
              <CandidateActivity showNotScheduled />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          STAR RATING
          ============================================ */}
      <ComponentCard
        id="star-rating"
        title="Star Rating"
        description="Phosphor-based star rating with half-star support"
      >
        <CodePreview
          code={`import { StarRating } from "@/components/ui/candidate-card";

<StarRating rating={4.5} />
<StarRating rating={3.0} size="md" showValue />`}
        >
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-body-strong">Ratings</h4>
              <div className="flex flex-wrap gap-6">
                {[5, 4.5, 4, 3.5, 3, 2, 1].map((r) => (
                  <div key={r} className="space-y-1">
                    <Label>{r.toFixed(1)}</Label>
                    <StarRating rating={r} />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-body-strong">Sizes</h4>
              <div className="flex items-end gap-6">
                <div className="space-y-1">
                  <Label>Small (14px)</Label>
                  <StarRating rating={4} size="sm" />
                </div>
                <div className="space-y-1">
                  <Label>Medium (16px)</Label>
                  <StarRating rating={4} size="md" />
                </div>
                <div className="space-y-1">
                  <Label>Large (20px)</Label>
                  <StarRating rating={4} size="lg" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-body-strong">With Numeric Value</h4>
              <StarRating rating={4.2} size="md" showValue />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SELECTION STATE
          ============================================ */}
      <ComponentCard
        id="selection"
        title="Selection State"
        description="Cards support selection with checkbox overlay — visible on hover, persistent when selected"
      >
        <CodePreview
          code={`const [selected, setSelected] = React.useState(false);

<CandidateCard
 
  selected={selected}
 
>
  {/* card content */}
</CandidateCard>`}
        >
          <div className="space-y-4">
            <p className="text-caption text-foreground-muted">
              Hover over a card to see the checkbox. Click it to toggle selection.
            </p>
            <div className="grid max-w-lg grid-cols-2 gap-4">
              {["sarah", "michael"].map((id) => (
                <CandidateCard key={id} selected={selectedCards.has(id)}>
                  <div className="space-y-3">
                    <CandidateKanbanHeader
                      name={id === "sarah" ? "Sarah Chen" : "Michael Park"}
                      rating={id === "sarah" ? 4.5 : 3.8}
                      matchScore={id === "sarah" ? 92 : 78}
                    />
                    <CandidateTags
                      tags={
                        id === "sarah"
                          ? [{ label: "Top Match", variant: "green" as const }]
                          : [{ label: "Climate exp.", variant: "green" as const }]
                      }
                    />
                    <CandidateReviewers
                      reviewers={id === "sarah" ? singleReviewer : sampleReviewers}
                    />
                  </div>
                </CandidateCard>
              ))}
            </div>
            <p className="text-caption text-foreground-muted">
              Selected: {selectedCards.size === 0 ? "None" : Array.from(selectedCards).join(", ")}
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          REVIEWERS — Collapsible
          ============================================ */}
      <ComponentCard
        id="reviewers"
        title="Reviewers Section"
        description="Collapsible reviewer list with avatar stack, decision summary, and expandable detail rows"
      >
        <CodePreview
          code={`import { CandidateReviewers, type ReviewerData } from "@/components/ui/candidate-card";

const reviewers: ReviewerData[] = [
  { name: "Leo Moreau", status: "yes", rating: 5, color: "blue" },
  { name: "Rachel Costanza", status: "yes", rating: 4, color: "red" },
  { name: "Maya Fernandez", status: "maybe", rating: 4, color: "green" },
];

<CandidateReviewers reviewers={reviewers} />`}
        >
          <div className="space-y-8">
            <div className="max-w-sm space-y-3">
              <Label>Collapsed (click to expand)</Label>
              <CandidateCard>
                <CandidateKanbanHeader name="Christopher Peterson" rating={4.2} matchScore={78} />
                <CandidateReviewers reviewers={sampleReviewers} />
              </CandidateCard>
            </div>

            <div className="max-w-sm space-y-3">
              <Label>Expanded by default</Label>
              <CandidateCard>
                <CandidateKanbanHeader name="Randy Philips" rating={4.2} matchScore={92} />
                <CandidateReviewers reviewers={manyReviewers} expanded />
              </CandidateCard>
            </div>

            <div className="max-w-sm space-y-3">
              <Label>Single reviewer (no collapse)</Label>
              <CandidateCard>
                <CandidateKanbanHeader name="Myna Ahmed" rating={4.2} matchScore={85} />
                <CandidateReviewers reviewers={singleReviewer} />
              </CandidateCard>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          KANBAN HEADER
          ============================================ */}
      <ComponentCard
        id="kanban-header"
        title="Kanban Header"
        description="Optimized header for Kanban cards with avatar, name, star rating, match score, and applied date"
      >
        <CodePreview
          code={`<CandidateKanbanHeader
  name="Sarah Chen"
  rating={4.5}
  matchScore={92}
  appliedDate={new Date()}
/>`}
        >
          <div className="max-w-sm space-y-4">
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
                matchScore={55}
                appliedDate={new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)}
              />
            </CandidateCard>
            <CandidateCard>
              <CandidateKanbanHeader
                name="Emily Davis"
                matchScore={35}
                appliedDate={new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)}
              />
            </CandidateCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          LOADING STATE
          ============================================ */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Skeleton placeholder while data loads"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

      {/* ============================================
          HOVER, FOCUS & ACTIVE STATES
          ============================================ */}
      <ComponentCard
        id="states"
        title="Interactive States"
        description="Cards have subtle micro-interactions for hover, focus, and active states"
      >
        <div className="space-y-6">
          <div className="max-w-sm space-y-4">
            <p className="text-caption text-foreground-muted">
              Hover to see the lift and shadow transition. Click for the press effect. Tab to see
              the focus ring.
            </p>
            <CandidateCard>
              <CandidateKanbanHeader name="Interactive Card" rating={4.0} matchScore={80} />
              <CandidateTags tags={[{ label: "Hover me", variant: "blue" }]} className="mt-3" />
            </CandidateCard>
          </div>
          <div className="rounded-lg border border-border-muted bg-background-subtle p-4">
            <h4 className="mb-3 text-body-strong">State Details</h4>
            <ul className="space-y-2 text-caption text-foreground-muted">
              <li>
                <span className="font-medium text-foreground">Hover:</span> -1px translate-y,
                elevated shadow, border-color change
              </li>
              <li>
                <span className="font-medium text-foreground">Focus:</span> Double-ring focus
                indicator via --shadow-focus
              </li>
              <li>
                <span className="font-medium text-foreground">Active:</span> scale(0.995) press
                effect
              </li>
              <li>
                <span className="font-medium text-foreground">Selected:</span> Brand border +
                selected background tint
              </li>
            </ul>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SKILLS DISPLAY
          ============================================ */}
      <ComponentCard
        id="skills"
        title="Skills Display"
        description="Skill badges with overflow handling and tooltip"
      >
        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-body-strong">Default (3 visible)</h4>
            <CandidateSkills
              skills={["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker"]}
            />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">Custom maxVisible (5)</h4>
            <CandidateSkills
              skills={["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Docker", "Kubernetes"]}
              maxVisible={5}
            />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">Few Skills (no overflow)</h4>
            <CandidateSkills skills={["React", "TypeScript"]} />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          CANDIDATE SCORE (Deprecated)
          ============================================ */}
      <ComponentCard
        id="score"
        title="Candidate Score"
        description="AI-generated match scores with color-coded variants"
      >
        <div className="mb-4 rounded-lg border border-border-warning bg-background-warning p-3">
          <p className="text-caption font-medium text-foreground-warning">
            Deprecated: Use MatchScoreBadge from @/components/ui/match-score for new
            implementations. CandidateScore is kept for backward compatibility.
          </p>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="mb-4 text-body-strong">Auto Color by Score</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
          <div>
            <h4 className="mb-4 text-body-strong">With Progress Bar</h4>
            <div className="max-w-md space-y-4">
              <CandidateScore score={92} showProgress label="AI Match" />
              <CandidateScore score={78} showProgress label="AI Match" />
              <CandidateScore score={55} showProgress label="AI Match" />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          DATE DISPLAY
          ============================================ */}
      <ComponentCard
        id="date"
        title="Application Date"
        description="Show when the candidate applied — absolute or relative"
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

      {/* ============================================
          COMPLETE EXAMPLES
          ============================================ */}
      <ComponentCard
        id="examples"
        title="Complete Examples"
        description="Real-world usage patterns matching the reference ATS design"
      >
        <div className="space-y-8">
          {/* Applied Column Card */}
          <div>
            <h4 className="mb-4 text-body-strong">Applied Column — New Candidate</h4>
            <div className="max-w-xs">
              <CandidateCard variant="compact">
                <div className="space-y-3">
                  <CandidateKanbanHeader
                    name="Myna Ahmed"
                    rating={4.2}
                    matchScore={85}
                    appliedDate={new Date()}
                  />
                  <CandidateTags
                    tags={[
                      { label: "Portfolio", variant: "blue" },
                      { label: "Referred", variant: "green" },
                    ]}
                  />
                  <CandidateActivity lastComment="2h ago" />
                  <CandidateReviewers reviewers={singleReviewer} />
                </div>
              </CandidateCard>
            </div>
          </div>

          {/* Qualified Column Card */}
          <div>
            <h4 className="mb-4 text-body-strong">Qualified Column — Multiple Reviewers</h4>
            <div className="max-w-xs">
              <CandidateCard variant="compact">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <CandidateKanbanHeader
                      name="Randy Philips"
                      rating={4.2}
                      matchScore={92}
                      appliedDate={new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)}
                    />
                    <DaysInStage days={6} compact />
                  </div>
                  <CandidateTags
                    tags={[
                      { label: "Art School", variant: "blue" },
                      { label: "Top Match", variant: "green" },
                    ]}
                  />
                  <CandidateActivity lastComment="3h ago" />
                  <CandidateReviewers reviewers={manyReviewers} />
                </div>
              </CandidateCard>
            </div>
          </div>

          {/* Interview Column Card */}
          <div>
            <h4 className="mb-4 text-body-strong">Interview Column — Scheduled</h4>
            <div className="max-w-xs">
              <CandidateCard variant="compact">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <CandidateKanbanHeader
                      name="Jacob Cherrywood"
                      rating={4.9}
                      matchScore={88}
                      appliedDate={new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)}
                    />
                    <DaysInStage days={14} compact />
                  </div>
                  <CandidateTags tags={[{ label: "Senior", variant: "amber" }]} />
                  <CandidateActivity lastComment="1d ago" scheduledInterview="Tomorrow, 2pm" />
                  <CandidateReviewers
                    reviewers={[
                      { name: "Sarah Chen", status: "strong_yes", rating: 5, color: "red" },
                      { name: "Mike Johnson", status: "yes", rating: 5, color: "blue" },
                    ]}
                  />
                </div>
              </CandidateCard>
            </div>
          </div>

          {/* Expanded List View */}
          <div>
            <h4 className="mb-4 text-body-strong">Expanded List View</h4>
            <div className="max-w-lg">
              <CandidateCard variant="expanded">
                <div className="flex items-start justify-between">
                  <CandidateHeader name="Camille Laurent" email="camille.laurent@example.com" />
                  <Badge variant="success">Final Round</Badge>
                </div>
                <CandidateMeta className="mt-2">
                  <CandidateMetaItem icon={<MapPin size={14} />}>Paris, France</CandidateMetaItem>
                  <CandidateMetaItem icon={<Briefcase size={14} />}>10 years</CandidateMetaItem>
                  <CandidateMetaItem icon={<Calendar size={14} />}>
                    Applied 20d ago
                  </CandidateMetaItem>
                </CandidateMeta>
                <CandidateSkills
                  skills={["Sustainability", "ESG Reporting", "Climate Policy", "Data Analysis"]}
                  maxVisible={4}
                  className="mt-3"
                />
                <div className="mt-3 flex items-center justify-between">
                  <CandidateScore score={81} showProgress label="AI Match" />
                  <DaysInStage days={15} />
                </div>
                <CandidateActions>
                  <Button size="sm" variant="ghost">
                    <Envelope size={16} className="mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                  <Button size="sm">Schedule</Button>
                </CandidateActions>
              </CandidateCard>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          PROPS TABLES
          ============================================ */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-body-strong">CandidateCard</h4>
              <PropsTable props={candidateCardProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateKanbanHeader</h4>
              <PropsTable props={candidateKanbanHeaderProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">DecisionPill</h4>
              <PropsTable props={decisionPillProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">DaysInStage</h4>
              <PropsTable props={daysInStageProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateTags</h4>
              <PropsTable props={candidateTagsProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateActivity</h4>
              <PropsTable props={candidateActivityProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">StarRating</h4>
              <PropsTable props={starRatingProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateReviewers</h4>
              <PropsTable props={candidateReviewersProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateHeader</h4>
              <PropsTable props={candidateHeaderProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateSkills</h4>
              <PropsTable props={candidateSkillsProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">
                CandidateScore
                <span className="ml-2 text-caption font-normal text-foreground-warning">
                  (Deprecated)
                </span>
              </h4>
              <PropsTable props={candidateScoreProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">CandidateDate</h4>
              <PropsTable props={candidateDateProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* ============================================
          DO'S AND DON'TS
          ============================================ */}
      <UsageGuide
        dos={[
          "Use compact variant with CandidateKanbanHeader in Kanban columns",
          "Show reviewer decisions with DecisionPill for quick scanning",
          "Use DaysInStage to surface stale candidates that need attention",
          "Keep tags to 2-3 max in compact mode to prevent overflow",
          "Show loading skeletons while fetching candidate data",
          "Use CandidateTags with color variants to differentiate tag categories",
        ]}
        donts={[
          "Don't use CandidateScore in new code — use MatchScoreBadge instead",
          "Don't show too many tags in compact mode (use maxVisible={2-3})",
          "Don't auto-reject based on AI scores without human review",
          "Don't mix different card layouts in the same Kanban board",
          "Don't hide important metadata — use the activity and days-in-stage indicators",
          "Don't use selection state without providing bulk action controls",
        ]}
      />

      {/* ============================================
          ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Card Focus**: Cards are focusable with `tabIndex={0}` and visible double-ring focus indicator via `--shadow-focus`",
          '**ARIA Roles**: Cards use `role="article"` by default, switching to `role="option"` with `aria-selected` when',
          '**Star Rating**: Uses `role="img"` with `aria-label` announcing the exact rating (e.g., "Rating: 4.2 out of 5 stars")',
          '**Days in Stage**: Includes `aria-label` that communicates urgency level ("needs attention" for critical)',
          '**Decision Pill**: Uses `role="status"` so screen readers announce decision changes',
          "**Keyboard Navigation**: All interactive elements (expand/collapse reviewers, checkboxes) are keyboard accessible via Tab",
          "**Tooltips**: Overflow tags and truncated names show full text on hover/focus",
          '**Selection Checkbox**: Has `aria-label="Select candidate"` and stops click propagation to prevent card interaction',
        ]}
      />

      {/* ============================================
          RELATED COMPONENTS
          ============================================ */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used alongside Candidate Card"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/kanban"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Kanban Board</p>
            <p className="text-caption text-foreground-muted">Pipeline view</p>
          </a>
          <a
            href="/design-system/components/match-score"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Match Score</p>
            <p className="text-caption text-foreground-muted">AI scoring badge</p>
          </a>
          <a
            href="/design-system/components/scorecard"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Scorecard</p>
            <p className="text-caption text-foreground-muted">Evaluation forms</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
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

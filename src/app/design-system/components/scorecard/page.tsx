"use client";

import React from "react";
import {
  Scorecard,
  ScorecardHeader,
  ScorecardSection,
  ScorecardCriterion,
  StarRating,
  RecommendationSelect,
  ScorecardSummary,
} from "@/components/ui/scorecard";
import type { RecommendationType } from "@/components/ui/scorecard";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// Props documentation for each sub-component
const scorecardProps = [
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Content of the scorecard (headers, sections, criteria)",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const scorecardHeaderProps = [
  {
    name: "title",
    type: "string",
    required: true,
    description: "The main title (usually candidate name or interview type)",
  },
  {
    name: "subtitle",
    type: "string",
    description: "Secondary text (e.g., role, date)",
  },
  {
    name: "avatar",
    type: "React.ReactNode",
    description: "Avatar component to display",
  },
];

const scorecardSectionProps = [
  {
    name: "title",
    type: "string",
    required: true,
    description: "Section heading (e.g., 'Technical Skills', 'Communication')",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Section content (typically ScorecardCriterion components)",
  },
];

const scorecardCriterionProps = [
  {
    name: "label",
    type: "string",
    required: true,
    description: "Name of the evaluation criterion",
  },
  {
    name: "description",
    type: "string",
    description: "Additional context or guidance for the criterion",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Input element (typically StarRating)",
  },
];

const starRatingProps = [
  {
    name: "value",
    type: "number",
    required: true,
    description: "Current rating value",
  },
  {
    name: "max",
    type: "number",
    default: "5",
    description: "Maximum number of stars",
  },
  {
    name: "onChange",
    type: "(value: number) => void",
    description: "Callback when rating changes (interactive mode)",
  },
  {
    name: "readOnly",
    type: "boolean",
    default: "false",
    description: "Disable interaction and show display-only stars",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Size of the star icons",
  },
  {
    name: "allowHalf",
    type: "boolean",
    default: "false",
    description: "Allow half-star ratings (0.5 increments)",
  },
  {
    name: "showValue",
    type: "boolean",
    default: "false",
    description: "Show numeric value next to stars",
  },
];

const recommendationSelectProps = [
  {
    name: "value",
    type: '"strong_yes" | "yes" | "neutral" | "no" | "strong_no"',
    description: "Currently selected recommendation",
  },
  {
    name: "onChange",
    type: "(value: RecommendationType) => void",
    description: "Callback when selection changes",
  },
];

const scorecardSummaryProps = [
  {
    name: "overallRating",
    type: "number",
    required: true,
    description: "Overall star rating (1-5)",
  },
  {
    name: "recommendation",
    type: "RecommendationType",
    description: "The hiring recommendation",
  },
  {
    name: "reviewerName",
    type: "string",
    description: "Name of the person who completed the scorecard",
  },
  {
    name: "reviewDate",
    type: "Date | string",
    description: "When the scorecard was completed",
  },
];

export default function ScorecardPage() {
  // State for interactive examples
  const [technicalRating, setTechnicalRating] = React.useState(4);
  const [communicationRating, setCommunicationRating] = React.useState(3.5);
  const [problemSolvingRating, setProblemSolvingRating] = React.useState(4.5);
  const [recommendation, setRecommendation] = React.useState<RecommendationType>("yes");
  const [comments, setComments] = React.useState("");

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Scorecard
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Structured evaluation forms for collecting interviewer feedback with star ratings,
          criteria-based assessment, and hiring recommendations. Essential for consistent candidate
          evaluation in the ATS pipeline.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Post-interview feedback collection</li>
              <li>• Standardized candidate evaluation</li>
              <li>• Comparing multiple interviewers&apos; assessments</li>
              <li>• Documenting hiring decisions</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Quick feedback (use notes instead)</li>
              <li>• Non-interview assessments</li>
              <li>• Binary yes/no decisions only</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The scorecard is composed of several building blocks"
      >
        <div className="relative rounded-lg bg-background-subtle p-6">
          <div className="max-w-md">
            <Scorecard>
              <div className="relative">
                <ScorecardHeader
                  title="Jane Cooper"
                  subtitle="Technical Interview · Jan 15, 2025"
                  avatar={<Avatar name="Jane Cooper" size="default" />}
                />
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  1
                </div>
              </div>
              <div className="relative mt-4">
                <ScorecardSection title="Technical Skills">
                  <ScorecardCriterion
                    label="Problem Solving"
                    description="Approach to breaking down complex problems"
                  >
                    <StarRating value={4} readOnly />
                  </ScorecardCriterion>
                </ScorecardSection>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  2
                </div>
              </div>
              <div className="relative mt-4">
                <div className="py-4">
                  <h4 className="mb-3 text-body-sm font-medium text-foreground-muted">
                    Recommendation
                  </h4>
                  <RecommendationSelect value="yes" />
                </div>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  3
                </div>
              </div>
            </Scorecard>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">1</span> Header
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">2</span>{" "}
              Sections & Criteria
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">3</span>{" "}
              Recommendation
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple scorecard with header, sections, and criteria"
      >
        <CodePreview
          code={`import {
  Scorecard,
  ScorecardHeader,
  ScorecardSection,
  ScorecardCriterion,
  StarRating,
} from "@/components/ui/scorecard";
import { Avatar } from "@/components/ui/avatar";

<Scorecard>
  <ScorecardHeader
    title="Jane Cooper"
    subtitle="Technical Interview · Jan 15, 2025"
    avatar={<Avatar name="Jane Cooper" size="default" />}
  />
  <ScorecardSection title="Technical Skills">
    <ScorecardCriterion label="Problem Solving">
      <StarRating value={4} readOnly />
    </ScorecardCriterion>
    <ScorecardCriterion label="Code Quality">
      <StarRating value={3.5} readOnly />
    </ScorecardCriterion>
  </ScorecardSection>
</Scorecard>`}
        >
          <div className="max-w-lg">
            <Scorecard>
              <ScorecardHeader
                title="Jane Cooper"
                subtitle="Technical Interview · Jan 15, 2025"
                avatar={<Avatar name="Jane Cooper" size="default" />}
              />
              <ScorecardSection title="Technical Skills">
                <ScorecardCriterion label="Problem Solving">
                  <StarRating value={4} readOnly />
                </ScorecardCriterion>
                <ScorecardCriterion label="Code Quality">
                  <StarRating value={3.5} readOnly allowHalf />
                </ScorecardCriterion>
              </ScorecardSection>
            </Scorecard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Star Rating */}
      <ComponentCard
        id="star-rating"
        title="Star Rating"
        description="Interactive and read-only star rating inputs"
      >
        <div className="space-y-8">
          {/* Sizes */}
          <div>
            <h4 className="mb-4 text-body-strong">Sizes</h4>
            <div className="flex flex-wrap items-end gap-8">
              <div className="space-y-2">
                <Label>Small</Label>
                <StarRating value={4} readOnly size="sm" />
              </div>
              <div className="space-y-2">
                <Label>Medium (Default)</Label>
                <StarRating value={4} readOnly size="md" />
              </div>
              <div className="space-y-2">
                <Label>Large</Label>
                <StarRating value={4} readOnly size="lg" />
              </div>
            </div>
          </div>

          {/* Half Stars */}
          <div>
            <h4 className="mb-4 text-body-strong">Half-Star Support</h4>
            <div className="flex flex-wrap items-center gap-8">
              <div className="space-y-2">
                <Label>4.5 Stars</Label>
                <StarRating value={4.5} readOnly allowHalf size="lg" />
              </div>
              <div className="space-y-2">
                <Label>3.5 Stars</Label>
                <StarRating value={3.5} readOnly allowHalf size="lg" />
              </div>
              <div className="space-y-2">
                <Label>2.5 Stars</Label>
                <StarRating value={2.5} readOnly allowHalf size="lg" />
              </div>
            </div>
          </div>

          {/* Show Value */}
          <div>
            <h4 className="mb-4 text-body-strong">With Numeric Value</h4>
            <StarRating value={4.5} readOnly allowHalf size="lg" showValue />
          </div>

          {/* Interactive */}
          <div>
            <h4 className="mb-4 text-body-strong">Interactive Rating</h4>
            <CodePreview
              code={`const [rating, setRating] = React.useState(3);

<StarRating
  value={rating}
  onChange={setRating}
  size="lg"
  showValue
/>`}
            >
              <div className="space-y-2">
                <StarRating
                  value={technicalRating}
                  onChange={setTechnicalRating}
                  size="lg"
                  showValue
                />
                <p className="text-caption text-foreground-muted">
                  Click or use arrow keys to change rating
                </p>
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* Recommendation Select */}
      <ComponentCard
        id="recommendation"
        title="Recommendation Select"
        description="Hiring recommendation with semantic colors"
      >
        <CodePreview
          code={`import { RecommendationSelect } from "@/components/ui/scorecard";

const [recommendation, setRecommendation] = useState<RecommendationType>("yes");

<RecommendationSelect
  value={recommendation}
  onChange={setRecommendation}
/>`}
        >
          <div className="space-y-4">
            <RecommendationSelect value={recommendation} onChange={setRecommendation} />
            <p className="text-caption text-foreground-muted">
              Selected:{" "}
              <code className="rounded bg-background-muted px-1.5 py-0.5">{recommendation}</code>
            </p>
          </div>
        </CodePreview>

        <div className="mt-6 border-t border-border-muted pt-6">
          <h4 className="mb-4 text-body-strong">All Recommendation Options</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            {(["strong_yes", "yes", "neutral", "no", "strong_no"] as RecommendationType[]).map(
              (rec) => (
                <div key={rec} className="text-center">
                  <RecommendationSelect value={rec} />
                  <p className="mt-2 text-caption capitalize text-foreground-muted">
                    {rec
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </ComponentCard>

      {/* Scorecard Summary */}
      <ComponentCard
        id="summary"
        title="Scorecard Summary"
        description="Display completed scorecard overview"
      >
        <CodePreview
          code={`<ScorecardSummary
  overallRating={4.5}
  recommendation="strong_yes"
  reviewerName="Sarah Chen"
  reviewDate={new Date()}
/>`}
        >
          <div className="max-w-xl">
            <ScorecardSummary
              overallRating={4.5}
              recommendation="strong_yes"
              reviewerName="Sarah Chen"
              reviewDate={new Date()}
            />
          </div>
        </CodePreview>

        <div className="mt-6 border-t border-border-muted pt-6">
          <h4 className="mb-4 text-body-strong">Different Recommendations</h4>
          <div className="space-y-4">
            <ScorecardSummary
              overallRating={4}
              recommendation="yes"
              reviewerName="Michael Park"
              reviewDate="2025-01-10"
            />
            <ScorecardSummary
              overallRating={3}
              recommendation="neutral"
              reviewerName="Emily Davis"
              reviewDate="2025-01-08"
            />
            <ScorecardSummary
              overallRating={2}
              recommendation="no"
              reviewerName="James Wilson"
              reviewDate="2025-01-05"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Complete Form Example */}
      <ComponentCard
        id="complete-form"
        title="Complete Scorecard Form"
        description="A fully interactive scorecard for interview feedback"
      >
        <CodePreview
          code={`const [technical, setTechnical] = useState(4);
const [communication, setCommunication] = useState(3.5);
const [problemSolving, setProblemSolving] = useState(4.5);
const [recommendation, setRecommendation] = useState("yes");
const [comments, setComments] = useState("");

<Scorecard>
  <ScorecardHeader
    title="Interview Feedback"
    subtitle="Technical Interview · Senior Developer"
    avatar={<Avatar name="Jane Cooper" size="default" />}
  />

  <ScorecardSection title="Technical Skills">
    <ScorecardCriterion
      label="Technical Knowledge"
      description="Understanding of core concepts and technologies"
    >
      <StarRating value={technical} onChange={setTechnical} allowHalf />
    </ScorecardCriterion>
    <ScorecardCriterion
      label="Problem Solving"
      description="Approach to breaking down complex problems"
    >
      <StarRating value={problemSolving} onChange={setProblemSolving} allowHalf />
    </ScorecardCriterion>
  </ScorecardSection>

  <ScorecardSection title="Soft Skills">
    <ScorecardCriterion
      label="Communication"
      description="Clarity and effectiveness of communication"
    >
      <StarRating value={communication} onChange={setCommunication} allowHalf />
    </ScorecardCriterion>
  </ScorecardSection>

  <ScorecardSection title="Overall Assessment">
    <div className="space-y-4">
      <div>
        <Label className="mb-2 block">Recommendation</Label>
        <RecommendationSelect value={recommendation} onChange={setRecommendation} />
      </div>
      <div>
        <Label htmlFor="comments" className="mb-2 block">Additional Comments</Label>
        <Textarea
          id="comments"
          placeholder="Add any additional feedback..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>
    </div>
  </ScorecardSection>

  <div className="flex justify-end gap-3 pt-4 border-t border-border">
    <Button variant="outline">Save Draft</Button>
    <Button>Submit Feedback</Button>
  </div>
</Scorecard>`}
        >
          <div className="max-w-2xl">
            <Scorecard>
              <ScorecardHeader
                title="Interview Feedback"
                subtitle="Technical Interview · Senior Developer"
                avatar={<Avatar name="Jane Cooper" size="default" />}
              />

              <ScorecardSection title="Technical Skills">
                <ScorecardCriterion
                  label="Technical Knowledge"
                  description="Understanding of core concepts and technologies"
                >
                  <StarRating value={technicalRating} onChange={setTechnicalRating} allowHalf />
                </ScorecardCriterion>
                <ScorecardCriterion
                  label="Problem Solving"
                  description="Approach to breaking down complex problems"
                >
                  <StarRating
                    value={problemSolvingRating}
                    onChange={setProblemSolvingRating}
                    allowHalf
                  />
                </ScorecardCriterion>
              </ScorecardSection>

              <ScorecardSection title="Soft Skills">
                <ScorecardCriterion
                  label="Communication"
                  description="Clarity and effectiveness of communication"
                >
                  <StarRating
                    value={communicationRating}
                    onChange={setCommunicationRating}
                    allowHalf
                  />
                </ScorecardCriterion>
              </ScorecardSection>

              <ScorecardSection title="Overall Assessment">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Recommendation</Label>
                    <RecommendationSelect value={recommendation} onChange={setRecommendation} />
                  </div>
                  <div>
                    <Label htmlFor="comments" className="mb-2 block">
                      Additional Comments
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Add any additional feedback..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
              </ScorecardSection>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <Button variant="outline">Save Draft</Button>
                <Button>Submit Feedback</Button>
              </div>
            </Scorecard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Props Tables */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-body-strong">Scorecard</h4>
              <PropsTable props={scorecardProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">ScorecardHeader</h4>
              <PropsTable props={scorecardHeaderProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">ScorecardSection</h4>
              <PropsTable props={scorecardSectionProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">ScorecardCriterion</h4>
              <PropsTable props={scorecardCriterionProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">StarRating</h4>
              <PropsTable props={starRatingProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">RecommendationSelect</h4>
              <PropsTable props={recommendationSelectProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">ScorecardSummary</h4>
              <PropsTable props={scorecardSummaryProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Use consistent criteria across all interviews for the same role",
          "Include descriptions to guide interviewers on what to evaluate",
          "Allow half-star ratings for nuanced feedback",
          "Show completed scorecards in candidate profiles for comparison",
          "Require a recommendation for every scorecard submission",
        ]}
        donts={[
          "Don't auto-submit scorecards without human review",
          "Don't hide scoring criteria from candidates after hiring",
          "Don't use more than 10 criteria per section (cognitive overload)",
          "Don't make all criteria required—some may not apply",
          "Don't show individual scores to candidates (aggregate only)",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard Navigation**: StarRating supports Arrow keys (←→↑↓), Home/End keys for min/max",
          "**Focus Management**: Visible focus ring on all interactive elements",
          "**ARIA**: Uses `role='slider'` for StarRating with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`",
          "**ARIA**: RecommendationSelect uses `role='radiogroup'` with `aria-checked` states",
          "**Screen Readers**: Announces rating as 'X out of Y stars' and recommendation labels",
          "**Color Independence**: Recommendations use both color and text labels",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Scorecard"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/candidate-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Candidate Card</p>
            <p className="text-caption text-foreground-muted">Display scores on cards</p>
          </a>
          <a
            href="/design-system/components/kanban"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Kanban Board</p>
            <p className="text-caption text-foreground-muted">Pipeline management</p>
          </a>
          <a
            href="/design-system/components/activity-feed"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Activity Feed</p>
            <p className="text-caption text-foreground-muted">Show scorecard submissions</p>
          </a>
          <a
            href="/design-system/components/modal"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Modal</p>
            <p className="text-caption text-foreground-muted">Scorecard dialogs</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/scorecard" />
    </div>
  );
}

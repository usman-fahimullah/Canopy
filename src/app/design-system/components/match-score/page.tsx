"use client";

import React from "react";
import { MatchScore, MatchScoreBadge, MatchScoreBreakdown } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const matchScoreProps = [
  { name: "score", type: "number", required: true, description: "Score value (0-100)" },
  { name: "showLabel", type: "boolean", default: "true", description: "Show percentage label" },
  { name: "label", type: "string", default: "undefined", description: "Custom label text" },
  { name: "showLevel", type: "boolean", default: "false", description: 'Show match level text (High, Medium, Low)' },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Component size" },
  { name: "layout", type: '"inline" | "stacked"', default: '"inline"', description: "Layout orientation" },
];

const matchScoreBreakdownProps = [
  { name: "score", type: "number", required: true, description: "Overall score (0-100)" },
  { name: "breakdown", type: "Array<{ label: string; score: number; weight?: number }>", required: true, description: "Score breakdown items" },
];

export default function MatchScorePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Match Score
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          MatchScore visualizes AI-generated candidate-job match scores. It uses
          color coding to indicate high, medium, and low match levels.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple match score display"
      >
        <CodePreview
          code={`<MatchScore score={85} />`}
        >
          <div className="flex items-center gap-8">
            <MatchScore score={85} />
            <MatchScore score={62} />
            <MatchScore score={35} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Score Levels */}
      <ComponentCard
        id="levels"
        title="Score Levels"
        description="Color coding for different score ranges"
      >
        <div className="flex flex-wrap gap-8">
          <div className="text-center">
            <MatchScore score={90} showLevel />
            <p className="text-caption text-foreground-muted mt-2">75-100: High</p>
          </div>
          <div className="text-center">
            <MatchScore score={65} showLevel />
            <p className="text-caption text-foreground-muted mt-2">50-74: Medium</p>
          </div>
          <div className="text-center">
            <MatchScore score={35} showLevel />
            <p className="text-caption text-foreground-muted mt-2">0-49: Low</p>
          </div>
        </div>
      </ComponentCard>

      {/* Sizes */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available component sizes"
      >
        <div className="flex items-end gap-8">
          <div className="text-center">
            <MatchScore score={78} size="sm" />
            <p className="text-caption text-foreground-muted mt-2">Small</p>
          </div>
          <div className="text-center">
            <MatchScore score={78} size="md" />
            <p className="text-caption text-foreground-muted mt-2">Medium</p>
          </div>
          <div className="text-center">
            <MatchScore score={78} size="lg" />
            <p className="text-caption text-foreground-muted mt-2">Large</p>
          </div>
        </div>
      </ComponentCard>

      {/* With Label */}
      <ComponentCard
        id="with-label"
        title="With Label"
        description="Show level and custom label"
      >
        <div className="flex flex-wrap gap-8">
          <MatchScore score={88} showLevel label="Skills match" />
          <MatchScore score={72} showLevel label="Experience fit" />
          <MatchScore score={45} showLevel label="Location match" />
        </div>
      </ComponentCard>

      {/* Match Score Badge */}
      <ComponentCard
        id="badge"
        title="Match Score Badge"
        description="Compact badge format"
      >
        <div className="flex flex-wrap gap-4">
          <MatchScoreBadge score={92} />
          <MatchScoreBadge score={68} />
          <MatchScoreBadge score={41} />
        </div>
      </ComponentCard>

      {/* Breakdown */}
      <ComponentCard
        id="breakdown"
        title="Score Breakdown"
        description="Detailed score breakdown by criteria"
      >
        <div className="max-w-md">
          <MatchScoreBreakdown
            score={78}
            breakdown={[
              { label: "Skills & Experience", score: 85 },
              { label: "Education", score: 70 },
              { label: "Location", score: 90 },
              { label: "Salary Expectations", score: 65 },
              { label: "Culture Fit", score: 80 },
            ]}
          />
        </div>
      </ComponentCard>

      {/* Candidate Card Example */}
      <ComponentCard
        id="example"
        title="Candidate Card Example"
        description="Match score in context"
      >
        <div className="max-w-md p-4 border border-border rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 font-medium">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-body-strong font-medium">John Doe</h3>
                  <p className="text-caption text-foreground-muted">Solar Energy Engineer</p>
                </div>
                <MatchScore score={87} size="sm" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-0.5 text-caption bg-background-subtle rounded border border-border">
                  5 years exp
                </span>
                <span className="px-2 py-0.5 text-caption bg-background-subtle rounded border border-border">
                  San Francisco
                </span>
                <span className="px-2 py-0.5 text-caption bg-background-subtle rounded border border-border">
                  NABCEP
                </span>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props - MatchScore */}
      <ComponentCard id="props-score" title="MatchScore Props">
        <PropsTable props={matchScoreProps} />
      </ComponentCard>

      {/* Props - MatchScoreBreakdown */}
      <ComponentCard id="props-breakdown" title="MatchScoreBreakdown Props">
        <PropsTable props={matchScoreBreakdownProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use to visualize AI matching scores",
          "Show breakdown for transparency",
          "Use appropriate size for context",
          "Include level labels for clarity",
        ]}
        donts={[
          "Don't hide score reasoning from users",
          "Don't use without context or explanation",
          "Don't display scores for unrelated items",
          "Don't make scores the only selection criteria",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/match-score" />
    </div>
  );
}

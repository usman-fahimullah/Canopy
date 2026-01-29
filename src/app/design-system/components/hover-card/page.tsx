"use client";

import React from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
  Avatar,
  Badge,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Calendar, MapPin, Briefcase } from "@/components/Icons";

const hoverCardProps = [
  { name: "children", type: "ReactNode", required: true, description: "Trigger and content elements" },
  { name: "openDelay", type: "number", default: "200", description: "Delay before showing (ms)" },
  { name: "closeDelay", type: "number", default: "100", description: "Delay before hiding (ms)" },
];

const hoverCardContentProps = [
  { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment relative to trigger" },
  { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Side of trigger to show on" },
  { name: "sideOffset", type: "number", default: "4", description: "Distance from trigger (px)" },
  { name: "children", type: "ReactNode", required: true, description: "Card content" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function HoverCardPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Hover Card
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          HoverCard displays additional information when hovering over a trigger
          element. Ideal for user profiles, link previews, and contextual details.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple hover card with content"
      >
        <CodePreview
          code={`<HoverCard>
  <HoverCardTrigger asChild>
    <button className="underline">Hover me</button>
  </HoverCardTrigger>
  <HoverCardContent>
    <HoverCardHeader>
      <HoverCardTitle>Title</HoverCardTitle>
      <HoverCardDescription>
        Description text goes here.
      </HoverCardDescription>
    </HoverCardHeader>
  </HoverCardContent>
</HoverCard>`}
        >
          <div className="flex justify-center py-8">
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="text-primary-600 underline underline-offset-4 font-medium">
                  Hover me
                </button>
              </HoverCardTrigger>
              <HoverCardContent>
                <HoverCardHeader>
                  <HoverCardTitle>Hover Card Title</HoverCardTitle>
                  <HoverCardDescription>
                    This is additional information shown on hover.
                  </HoverCardDescription>
                </HoverCardHeader>
              </HoverCardContent>
            </HoverCard>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* User Profile Card */}
      <ComponentCard
        id="user-profile"
        title="User Profile Card"
        description="Rich hover card for user profiles"
      >
        <div className="flex justify-center py-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="flex items-center gap-2 hover:underline">
                <Avatar size="sm" src="https://i.pravatar.cc/150?u=jane" alt="Jane Smith" name="Jane Smith" />
                <span className="font-medium">Jane Smith</span>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex gap-4">
                <Avatar size="lg" src="https://i.pravatar.cc/150?u=jane" alt="Jane Smith" name="Jane Smith" />
                <div className="space-y-1">
                  <h4 className="text-body-strong font-semibold">Jane Smith</h4>
                  <p className="text-caption text-foreground-muted">
                    Senior Solar Engineer at SunPower
                  </p>
                  <div className="flex items-center gap-1 text-caption text-foreground-muted">
                    <MapPin className="w-3 h-3" />
                    San Francisco, CA
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex gap-4 text-caption text-foreground-muted">
                  <div>
                    <span className="font-semibold text-foreground">127</span> candidates
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">45</span> hired
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </ComponentCard>

      {/* Job Preview */}
      <ComponentCard
        id="job-preview"
        title="Job Preview Card"
        description="Hover card for job listings"
      >
        <div className="flex justify-center py-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <a
                href="#"
                className="text-primary-600 hover:underline font-medium"
                onClick={(e) => e.preventDefault()}
              >
                Solar Installation Technician
              </a>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <HoverCardHeader>
                <HoverCardTitle>Solar Installation Technician</HoverCardTitle>
                <HoverCardDescription>
                  Install and maintain residential and commercial solar panel systems.
                </HoverCardDescription>
              </HoverCardHeader>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-caption text-foreground-muted">
                  <Briefcase className="w-4 h-4" />
                  Full-time
                </div>
                <div className="flex items-center gap-2 text-caption text-foreground-muted">
                  <MapPin className="w-4 h-4" />
                  Denver, CO
                </div>
                <div className="flex items-center gap-2 text-caption text-foreground-muted">
                  <Calendar className="w-4 h-4" />
                  Posted 3 days ago
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge variant="success">Renewable Energy</Badge>
                <Badge variant="feature">Entry Level</Badge>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </ComponentCard>

      {/* Alignment */}
      <ComponentCard
        id="alignment"
        title="Alignment"
        description="Different card alignments"
      >
        <div className="flex justify-around py-8">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-background-subtle">
                Start
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="start" className="w-48">
              <p className="text-sm">Aligned to start</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-background-subtle">
                Center
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="center" className="w-48">
              <p className="text-sm">Aligned to center</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-background-subtle">
                End
              </button>
            </HoverCardTrigger>
            <HoverCardContent align="end" className="w-48">
              <p className="text-sm">Aligned to end</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </ComponentCard>

      {/* Side Positions */}
      <ComponentCard
        id="positions"
        title="Side Positions"
        description="Show card on different sides"
      >
        <div className="flex justify-center gap-8 py-12">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-background-subtle">
                Top
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-40">
              <p className="text-sm text-center">Above trigger</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-background-subtle">
                Right
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="right" className="w-40">
              <p className="text-sm text-center">Right of trigger</p>
            </HoverCardContent>
          </HoverCard>

          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="px-4 py-2 border border-border rounded-lg hover:bg-background-subtle">
                Left
              </button>
            </HoverCardTrigger>
            <HoverCardContent side="left" className="w-40">
              <p className="text-sm text-center">Left of trigger</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </ComponentCard>

      {/* Props - HoverCard */}
      <ComponentCard id="props-root" title="HoverCard Props">
        <PropsTable props={hoverCardProps} />
      </ComponentCard>

      {/* Props - HoverCardContent */}
      <ComponentCard id="props-content" title="HoverCardContent Props">
        <PropsTable props={hoverCardContentProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for supplementary, non-critical information",
          "Keep hover card content scannable",
          "Use for user profiles and link previews",
          "Position to avoid screen edge clipping",
        ]}
        donts={[
          "Don't put critical actions in hover cards",
          "Don't use for mobile-first interfaces",
          "Don't make content too large or complex",
          "Don't nest hover cards inside each other",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/hover-card" />
    </div>
  );
}

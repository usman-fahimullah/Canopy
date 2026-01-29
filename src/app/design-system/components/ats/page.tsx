"use client";

import React from "react";
import Link from "next/link";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  ArrowRight,
  Kanban,
  UserCircle,
  Tag,
  Star,
  ChartLineUp,
  ClockCounterClockwise,
  FilePdf,
  Calendar,
  Gift,
  FileText,
} from "@phosphor-icons/react";

const atsComponents = [
  {
    name: "Kanban Board",
    href: "/design-system/components/kanban",
    description: "Drag-and-drop pipeline for managing candidates across hiring stages",
    icon: Kanban,
  },
  {
    name: "Candidate Card",
    href: "/design-system/components/candidate-card",
    description: "Display candidate information with avatar, skills, and match score",
    icon: UserCircle,
  },
  {
    name: "Stage Badge",
    href: "/design-system/components/stage-badge",
    description: "Visual indicators for pipeline stages with semantic colors",
    icon: Tag,
  },
  {
    name: "Scorecard",
    href: "/design-system/components/scorecard",
    description: "Structured interviewer feedback with star ratings and recommendations",
    icon: Star,
  },
  {
    name: "Match Score",
    href: "/design-system/components/match-score",
    description: "AI-generated candidate-job fit percentage with breakdown",
    icon: ChartLineUp,
  },
  {
    name: "Activity Feed",
    href: "/design-system/components/activity-feed",
    description: "Timeline of candidate interactions, notes, and status changes",
    icon: ClockCounterClockwise,
  },
  {
    name: "PDF Viewer",
    href: "/design-system/components/pdf-viewer",
    description: "Resume and document preview with navigation controls",
    icon: FilePdf,
  },
  {
    name: "Scheduler",
    href: "/design-system/components/scheduler",
    description: "Interview scheduling with calendar integration",
    icon: Calendar,
  },
  {
    name: "Calendar",
    href: "/design-system/components/calendar",
    description: "Date picker and calendar views for scheduling",
    icon: Calendar,
  },
  {
    name: "Benefits Selector",
    href: "/design-system/components/benefits-selector",
    description: "Multi-select for job perks and benefits packages",
    icon: Gift,
  },
  {
    name: "Role Template Card",
    href: "/design-system/components/role-template-card",
    description: "Pre-built job templates for quick job posting",
    icon: FileText,
  },
];

export default function ATSComponentsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          ATS Components
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Specialized components for Applicant Tracking System functionality. These components
          power the core hiring workflow: candidate pipelines, evaluations, scheduling, and
          document management.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Climate-Focused ATS
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            {atsComponents.length} Components
          </span>
        </div>
      </div>

      {/* Component Grid */}
      <div id="components" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {atsComponents.map((component) => {
          const Icon = component.icon;
          return (
            <Link
              key={component.href}
              href={component.href}
              className="group p-4 border border-border rounded-lg hover:border-border-brand hover:bg-background-subtle transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-background-brand-subtle rounded-lg group-hover:bg-background-brand-muted transition-colors">
                  <Icon className="h-5 w-5 text-foreground-brand" weight="duotone" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-body-strong text-foreground group-hover:text-foreground-brand transition-colors truncate">
                      {component.name}
                    </h3>
                    <ArrowRight className="h-4 w-4 text-foreground-muted group-hover:text-foreground-brand transition-colors flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-caption text-foreground-muted mt-1 line-clamp-2">
                    {component.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Guidelines */}
      <div id="guidelines" className="space-y-6">
        <h2 className="text-heading-md text-foreground">Usage Guidelines</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-4 border border-border-success rounded-lg bg-background-success">
            <h3 className="text-body-strong text-foreground-success mb-3">Do</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-foreground-success flex-shrink-0">✓</span>
                Use Kanban boards for visual pipeline management
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-success flex-shrink-0">✓</span>
                Show AI match scores with clear reasoning
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-success flex-shrink-0">✓</span>
                Use consistent stage colors across all views
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-success flex-shrink-0">✓</span>
                Provide loading states for async operations
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-success flex-shrink-0">✓</span>
                Allow users to override AI suggestions
              </li>
            </ul>
          </div>
          <div className="p-4 border border-border-error rounded-lg bg-background-error">
            <h3 className="text-body-strong text-foreground-error mb-3">Don&apos;t</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="text-foreground-error flex-shrink-0">✗</span>
                Show AI scores without explanation
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-error flex-shrink-0">✗</span>
                Use inconsistent stage colors
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-error flex-shrink-0">✗</span>
                Block users from manual actions
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-error flex-shrink-0">✗</span>
                Hide candidate activity history
              </li>
              <li className="flex gap-2">
                <span className="text-foreground-error flex-shrink-0">✗</span>
                Auto-reject without human review
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Human-First AI Philosophy */}
      <div id="philosophy" className="p-6 border border-border-brand rounded-xl bg-background-brand-subtle">
        <h2 className="text-heading-sm text-foreground mb-3">
          Human-First, AI-Enabled Philosophy
        </h2>
        <p className="text-body text-foreground-muted mb-4">
          Canopy follows a "human-first, AI-enabled" approach. AI features should assist
          and suggest, but humans always make the final decisions. When implementing these
          components:
        </p>
        <ul className="space-y-2 text-body-sm text-foreground-muted">
          <li className="flex gap-2">
            <span className="text-foreground-brand">→</span>
            Always show reasoning behind AI recommendations
          </li>
          <li className="flex gap-2">
            <span className="text-foreground-brand">→</span>
            Provide clear "Accept" / "Dismiss" actions on suggestions
          </li>
          <li className="flex gap-2">
            <span className="text-foreground-brand">→</span>
            Never auto-reject candidates without human review
          </li>
          <li className="flex gap-2">
            <span className="text-foreground-brand">→</span>
            Learn from feedback when users override AI
          </li>
        </ul>
      </div>

      <PageNavigation currentPath="/design-system/components/ats" />
    </div>
  );
}

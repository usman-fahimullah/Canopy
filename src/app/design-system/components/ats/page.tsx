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
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          ATS Components
        </h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          Specialized components for Applicant Tracking System functionality. These components power
          the core hiring workflow: candidate pipelines, evaluations, scheduling, and document
          management.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Climate-Focused ATS
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
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
              className="group rounded-lg border border-border p-4 transition-all hover:border-border-brand hover:bg-background-subtle"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-background-brand-subtle p-2 transition-colors group-hover:bg-background-brand-muted">
                  <Icon className="h-5 w-5 text-foreground-brand" weight="duotone" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-body-strong text-foreground transition-colors group-hover:text-foreground-brand">
                      {component.name}
                    </h3>
                    <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0 text-foreground-muted transition-colors group-hover:text-foreground-brand" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-caption text-foreground-muted">
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
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-3 text-body-strong text-foreground-success">Do</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-success">✓</span>
                Use Kanban boards for visual pipeline management
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-success">✓</span>
                Show AI match scores with clear reasoning
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-success">✓</span>
                Use consistent stage colors across all views
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-success">✓</span>
                Provide loading states for async operations
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-success">✓</span>
                Allow users to override AI suggestions
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-3 text-body-strong text-foreground-error">Don&apos;t</h3>
            <ul className="space-y-2 text-body-sm text-foreground-muted">
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-error">✗</span>
                Show AI scores without explanation
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-error">✗</span>
                Use inconsistent stage colors
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-error">✗</span>
                Block users from manual actions
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-error">✗</span>
                Hide candidate activity history
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 text-foreground-error">✗</span>
                Auto-reject without human review
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Human-First AI Philosophy */}
      <div
        id="philosophy"
        className="rounded-xl border border-border-brand bg-background-brand-subtle p-6"
      >
        <h2 className="mb-3 text-heading-sm text-foreground">Human-First, AI-Enabled Philosophy</h2>
        <p className="mb-4 text-body text-foreground-muted">
          Canopy follows a &quot;human-first, AI-enabled&quot; approach. AI features should assist
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
            Provide clear &quot;Accept&quot; / &quot;Dismiss&quot; actions on suggestions
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

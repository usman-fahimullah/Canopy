"use client";

/**
 * Job Application Table - Design System Documentation
 *
 * @figma https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System?node-id=4643-18073
 */

import React from "react";
import {
  JobApplicationTable,
  ApplicationTracker,
  type JobApplication,
  type ApplicationSection,
  type EmojiReaction,
  applicationSectionConfig,
  applicationStageColors,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";

// ============================================
// SAMPLE DATA
// ============================================

const generateSampleApplications = (): JobApplication[] => [
  // Saved jobs
  {
    id: "1",
    jobTitle: "Senior Frontend Engineer",
    company: "Solaris Energy Co.",
    stage: "saved",
    activity: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    reaction: "excited",
    isFavorite: true,
  },
  {
    id: "2",
    jobTitle: "Climate Data Analyst",
    company: "GreenLeaf Analytics",
    stage: "saved",
    activity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    reaction: "nervous",
  },
  {
    id: "3",
    jobTitle: "Sustainability Consultant",
    company: "EcoFirst Partners",
    stage: "saved",
    activity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isFavorite: true,
  },
  // Applied jobs
  {
    id: "4",
    jobTitle: "Renewable Energy Project Manager",
    company: "TerraWatt Industries",
    stage: "applied",
    activity: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    reaction: "happy",
  },
  {
    id: "5",
    jobTitle: "ESG Reporting Specialist",
    company: "Verdant Systems",
    stage: "applied",
    activity: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    reaction: "meh",
  },
  // Interview stage
  {
    id: "6",
    jobTitle: "Clean Tech Product Designer",
    company: "Aurora Climate",
    stage: "interview",
    activity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    reaction: "nervous",
    isFavorite: true,
  },
  // Offer
  {
    id: "7",
    jobTitle: "Carbon Footprint Analyst",
    company: "Evergreen Tech",
    stage: "offer",
    activity: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    reaction: "excited",
    isFavorite: true,
  },
];

// ============================================
// PROPS DOCUMENTATION
// ============================================

const jobApplicationTableProps = [
  {
    name: "section",
    type: '"saved" | "applied" | "interview" | "offer" | "hired" | "ineligible"',
    required: true,
    description: "The pipeline section this table displays",
  },
  {
    name: "applications",
    type: "JobApplication[]",
    required: true,
    description: "Array of job applications to display",
  },
  {
    name: "isOpen",
    type: "boolean",
    default: "true",
    description: "Whether the section is expanded",
  },
  {
    name: "onToggle",
    type: "() => void",
    description: "Callback when section header is clicked to expand/collapse",
  },
  {
    name: "onStageChange",
    type: "(applicationId: string, newStage: ApplicationSection) => void",
    description: "Callback when user changes an application's stage",
  },
  {
    name: "onReactionChange",
    type: "(applicationId: string, reaction: EmojiReaction) => void",
    description: "Callback when user sets an emoji reaction",
  },
  {
    name: "onFavoriteToggle",
    type: "(applicationId: string) => void",
    description: "Callback when user stars/unstars a job",
  },
  {
    name: "onExploreJobs",
    type: "() => void",
    description: "Callback for the CTA button in empty state",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const applicationTrackerProps = [
  {
    name: "applications",
    type: "JobApplication[]",
    required: true,
    description: "All applications across all stages",
  },
  {
    name: "onStageChange",
    type: "(applicationId: string, newStage: ApplicationSection) => void",
    description: "Callback when user changes an application's stage",
  },
  {
    name: "onReactionChange",
    type: "(applicationId: string, reaction: EmojiReaction) => void",
    description: "Callback when user sets an emoji reaction",
  },
  {
    name: "onFavoriteToggle",
    type: "(applicationId: string) => void",
    description: "Callback when user stars/unstars a job",
  },
  {
    name: "onExploreJobs",
    type: "() => void",
    description: "Callback for the CTA button in empty state",
  },
  {
    name: "defaultOpenSections",
    type: "ApplicationSection[]",
    default: '["saved", "applied", "interview"]',
    description: "Which sections are expanded by default",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const jobApplicationTypeFields = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the application",
  },
  {
    name: "jobTitle",
    type: "string",
    required: true,
    description: "Title of the job position",
  },
  {
    name: "company",
    type: "string",
    required: true,
    description: "Company name",
  },
  {
    name: "companyLogo",
    type: "string",
    description: "URL to company logo image",
  },
  {
    name: "stage",
    type: "ApplicationSection",
    required: true,
    description: "Current pipeline stage",
  },
  {
    name: "activity",
    type: "Date | string",
    required: true,
    description: "Last activity timestamp",
  },
  {
    name: "reaction",
    type: '"excited" | "happy" | "meh" | "nervous" | "shocked" | "none"',
    description: "User's emoji reaction to this application",
  },
  {
    name: "isFavorite",
    type: "boolean",
    description: "Whether the job is starred/favorited",
  },
];

export default function JobApplicationTablePage() {
  const [applications, setApplications] = React.useState<JobApplication[]>(
    generateSampleApplications
  );

  const handleStageChange = (applicationId: string, newStage: ApplicationSection) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, stage: newStage, activity: new Date() } : app
      )
    );
  };

  const handleReactionChange = (applicationId: string, reaction: EmojiReaction) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, reaction } : app))
    );
  };

  const handleFavoriteToggle = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === applicationId ? { ...app, isFavorite: !app.isFavorite } : app))
    );
  };

  return (
    <div className="space-y-12">
      {/* ============================================
          SECTION 1: OVERVIEW
          ============================================ */}
      <div>
        <h1
          id="overview"
          className="mb-2 text-heading-lg font-bold text-[var(--foreground-default)]"
        >
          Job Application Table
        </h1>
        <p className="mb-4 text-body text-[var(--foreground-muted)]">
          A collapsible table component for tracking job applications across different pipeline
          stages. Designed for the job seeker portal (Green Jobs Board) to help candidates organize
          and track their job search journey.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-[var(--foreground-muted)]">
              <li>Job seeker dashboard for tracking applications</li>
              <li>Displaying grouped job listings by status</li>
              <li>When users need to manage multiple application states</li>
              <li>Enabling quick stage changes and emotional tracking</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-[var(--foreground-muted)]">
              <li>For employer-side candidate tracking (use CandidateTable)</li>
              <li>Simple job listings without interaction</li>
              <li>When stage management is not needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================
          SECTION 2: FULL TRACKER DEMO
          ============================================ */}
      <ComponentCard
        id="full-tracker"
        title="Application Tracker"
        description="Complete dashboard with all pipeline stages"
      >
        <div className="rounded-lg border border-[var(--border-default)]">
          <ApplicationTracker
            applications={applications}
            onStageChange={handleStageChange}
            onReactionChange={handleReactionChange}
            onFavoriteToggle={handleFavoriteToggle}
            onExploreJobs={() => alert("Navigate to job search")}
          />
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 3: SINGLE SECTION
          ============================================ */}
      <ComponentCard
        id="single-section"
        title="Single Section"
        description="Individual section table"
      >
        <CodePreview
          code={`import { JobApplicationTable, type JobApplication } from "@/components/ui";

const applications: JobApplication[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Engineer",
    company: "Solaris Energy Co.",
    stage: "saved",
    activity: new Date(),
    reaction: "excited",
    isFavorite: true,
  },
];

<JobApplicationTable
  section="saved"
  applications={applications}
  onStageChange={(id, stage) => console.log(id, stage)}
  onReactionChange={(id, reaction) => console.log(id, reaction)}
  onFavoriteToggle={(id) => console.log("toggle", id)}
/>`}
        >
          <div className="rounded-lg border border-[var(--border-default)]">
            <JobApplicationTable
              section="saved"
              applications={applications}
              onStageChange={handleStageChange}
              onReactionChange={handleReactionChange}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          SECTION 4: EMPTY STATE
          ============================================ */}
      <ComponentCard
        id="empty-state"
        title="Empty State"
        description="What users see when a section has no applications"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--border-default)]">
            <JobApplicationTable
              section="hired"
              applications={[]}
              onExploreJobs={() => alert("Explore Jobs clicked")}
            />
          </div>
          <div className="rounded-lg border border-[var(--border-default)]">
            <JobApplicationTable
              section="ineligible"
              applications={[]}
              onExploreJobs={() => alert("View Applications clicked")}
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 5: COLLAPSED STATE
          ============================================ */}
      <ComponentCard
        id="collapsed"
        title="Collapsed State"
        description="Section header when collapsed"
      >
        <div className="rounded-lg border border-[var(--border-default)]">
          <JobApplicationTable section="interview" applications={applications} isOpen={false} />
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 6: STAGE COLORS
          ============================================ */}
      <ComponentCard
        id="stage-colors"
        title="Stage Colors"
        description="Color coding for each pipeline stage"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {(Object.keys(applicationSectionConfig) as ApplicationSection[]).map((stage) => {
            const config = applicationSectionConfig[stage];
            const colors = applicationStageColors[stage];
            const Icon = config.icon;

            return (
              <div
                key={stage}
                className="flex items-center gap-3 rounded-lg border border-[var(--border-default)] p-4"
              >
                <Icon size={24} weight="fill" className={config.iconColor} />
                <div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 ${colors.bg}`}
                  >
                    <span className={`text-caption-strong ${colors.text}`}>{config.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ComponentCard>

      {/* ============================================
          SECTION 7: PROPS TABLE
          ============================================ */}
      <ComponentCard id="props-table" title="JobApplicationTable Props">
        <PropsTable props={jobApplicationTableProps} />
      </ComponentCard>

      <ComponentCard id="tracker-props" title="ApplicationTracker Props">
        <PropsTable props={applicationTrackerProps} />
      </ComponentCard>

      <ComponentCard id="job-application-type" title="JobApplication Type">
        <PropsTable props={jobApplicationTypeFields} />
      </ComponentCard>

      {/* ============================================
          SECTION 8: USAGE GUIDE
          ============================================ */}
      <UsageGuide
        dos={[
          "Use ApplicationTracker for a complete dashboard view",
          "Use JobApplicationTable for individual section control",
          "Provide onStageChange callback for stage updates",
          "Include onExploreJobs for empty state CTAs",
          "Allow users to favorite/unfavorite jobs",
        ]}
        donts={[
          "Don't use for employer-side candidate management",
          "Don't disable all interactive features",
          "Don't show too many collapsed sections at once",
          "Don't remove the activity time display",
        ]}
      />

      {/* ============================================
          SECTION 9: ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Collapsible sections are keyboard accessible via Tab + Enter/Space",
          "**ARIA**: Expand/collapse button uses aria-expanded",
          "**Focus**: All interactive elements have visible focus states",
          "**Screen Readers**: Section counts and states are announced",
          "**Color Contrast**: Stage colors meet WCAG AA standards",
        ]}
      />

      {/* ============================================
          SECTION 10: RELATED COMPONENTS
          ============================================ */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components that work well together"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/candidate-table"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">CandidateTable</p>
            <p className="text-caption text-[var(--foreground-muted)]">Employer-side tracking</p>
          </a>
          <a
            href="/design-system/components/stage-badge"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">StageBadge</p>
            <p className="text-caption text-[var(--foreground-muted)]">Pipeline stage indicator</p>
          </a>
          <a
            href="/design-system/components/empty-state"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">EmptyState</p>
            <p className="text-caption text-[var(--foreground-muted)]">No-content displays</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="rounded-lg border border-[var(--border-muted)] p-4 transition-colors hover:border-[var(--border-brand)]"
          >
            <p className="font-medium">Avatar</p>
            <p className="text-caption text-[var(--foreground-muted)]">Company logos</p>
          </a>
        </div>
      </ComponentCard>
    </div>
  );
}

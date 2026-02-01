"use client";

import React from "react";
import { JobPostCard, type JobPostStatus, type PathwayType } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Leaf, Sun, Lightning, Drop } from "@phosphor-icons/react";

// Props documentation
const jobPostCardProps = [
  {
    name: "companyName",
    type: "string",
    required: true,
    description: "Company name displayed with avatar",
  },
  {
    name: "companyLogo",
    type: "string",
    description: "URL for company logo image",
  },
  {
    name: "jobTitle",
    type: "string",
    required: true,
    description: "Job title/position name",
  },
  {
    name: "pathway",
    type: "PathwayType",
    description: "Climate industry pathway (e.g., 'energy', 'agriculture', 'conservation')",
  },
  {
    name: "pathwayIcon",
    type: "React.ReactNode",
    description: "Custom icon to override the default pathway icon",
  },
  {
    name: "status",
    type: '"default" | "featured" | "bipoc-owned" | "closing-soon"',
    default: '"default"',
    description: "Status badge variant shown on the card",
  },
  {
    name: "tags",
    type: "string[]",
    default: "[]",
    description: 'Tags to display (e.g., "Remote", "Full-time")',
  },
  {
    name: "saved",
    type: "boolean",
    default: "false",
    description: "Whether the job is bookmarked/saved",
  },
  {
    name: "onSave",
    type: "() => void",
    description: "Callback when save/bookmark button is clicked",
  },
  {
    name: "onViewJob",
    type: "() => void",
    description: "Callback when view job button is clicked",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Callback when card is clicked",
  },
  {
    name: "actionText",
    type: "string",
    default: '"View Job"',
    description: "Text for the action button",
  },
  {
    name: "size",
    type: '"default" | "compact" | "full"',
    default: '"default"',
    description: "Size variant of the card",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show loading state",
  },
];

export default function JobPostCardPage() {
  const [savedJobs, setSavedJobs] = React.useState<Set<string>>(new Set());

  const toggleSaved = (id: string) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Job Post Card
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Display job postings with company info, pathway tags, status badges, and interactive hover
          states. Optimized for job boards and career pages in the climate/sustainability sector.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Job board listings and search results</li>
              <li>Career page job grids</li>
              <li>Saved/bookmarked jobs display</li>
              <li>Featured job showcases</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Full job detail pages (use dedicated layout)</li>
              <li>ATS pipeline views (use CandidateCard)</li>
              <li>Compact list views (use table rows)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The job post card is composed of several distinct sections"
      >
        <div className="relative rounded-lg bg-background-subtle p-6">
          <div className="max-w-[350px]">
            <div className="relative rounded-[12px] bg-[var(--primitive-neutral-0)] p-4 shadow-[1px_2px_16px_rgba(31,29,28,0.08)]">
              {/* Header Row */}
              <div className="relative mb-3 flex items-center gap-2">
                <div className="flex flex-1 items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primitive-neutral-200)] text-xs font-medium">
                    A
                  </div>
                  <span className="text-sm text-[var(--primitive-neutral-800)]">Acme Corp</span>
                </div>
                <div className="rounded-lg bg-[var(--primitive-green-200)] px-2 py-1 text-sm font-bold text-[var(--primitive-green-700)]">
                  <Leaf size={16} weight="fill" />
                </div>
                <div className="rounded-full bg-[var(--primitive-blue-100)] px-2 py-1">
                  <span className="text-sm font-bold text-[var(--primitive-blue-500)]">
                    Featured
                  </span>
                </div>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  1
                </div>
              </div>
              {/* Title */}
              <div className="relative mb-4">
                <h3 className="text-2xl font-medium text-[var(--primitive-neutral-800)]">
                  Solar Installation Lead
                </h3>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  2
                </div>
              </div>
              {/* Tags */}
              <div className="relative flex gap-2">
                <div className="rounded-full bg-[var(--primitive-neutral-200)] px-2 py-1">
                  <span className="text-sm text-[var(--primitive-neutral-700)]">Remote</span>
                </div>
                <div className="rounded-full bg-[var(--primitive-neutral-200)] px-2 py-1">
                  <span className="text-sm text-[var(--primitive-neutral-700)]">Full-time</span>
                </div>
                <div className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground-brand text-xs font-medium text-white">
                  3
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">1</span> Header
              (Company, Pathway, Status)
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">2</span> Job
              Title
            </div>
            <div>
              <span className="rounded bg-background-muted px-1.5 py-0.5 font-mono">3</span> Tags /
              Actions (hover)
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple job post card with essential information"
      >
        <CodePreview
          code={`import { JobPostCard } from "@/components/ui";

<JobPostCard
  companyName="Acme Solar"
  jobTitle="Solar Installation Technician"
  pathway="energy"
  tags={["Remote", "Full-time"]}
  onViewJob={() => console.log("View job")}
/>`}
        >
          <div className="max-w-[350px]">
            <JobPostCard
              companyName="Acme Solar"
              jobTitle="Solar Installation Technician"
              pathway="energy"
              tags={["Remote", "Full-time"]}
              // eslint-disable-next-line no-console
              onViewJob={() => console.log("View job")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Size Variants */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="Available size variants for different layouts"
      >
        <div className="space-y-8">
          <div>
            <Label className="mb-3 block">Default (350x200px)</Label>
            <JobPostCard
              companyName="Green Energy Co"
              jobTitle="Renewable Energy Analyst"
              pathway="energy"
              tags={["Hybrid", "Full-time"]}
              size="default"
            />
          </div>
          <div>
            <Label className="mb-3 block">Full Width</Label>
            <div className="max-w-2xl">
              <JobPostCard
                companyName="EcoTech Solutions"
                jobTitle="Sustainability Consultant"
                pathway="conservation"
                tags={["Remote", "Contract"]}
                size="full"
              />
            </div>
          </div>
          <div>
            <Label className="mb-3 block">Compact (Full Width, Auto Height)</Label>
            <div className="max-w-md">
              <JobPostCard
                companyName="Climate First"
                jobTitle="Carbon Analyst"
                pathway="finance"
                tags={["On-site"]}
                size="compact"
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Status Badges */}
      <ComponentCard
        id="status"
        title="Status Badges"
        description="Visual indicators for job status"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Default (No Badge)</Label>
            <JobPostCard
              companyName="Green Corp"
              jobTitle="Environmental Engineer"
              pathway="conservation"
              tags={["Remote"]}
              status="default"
            />
          </div>
          <div className="space-y-2">
            <Label>Featured</Label>
            <JobPostCard
              companyName="Solar Plus"
              jobTitle="PV System Designer"
              pathway="energy"
              tags={["Hybrid"]}
              status="featured"
            />
          </div>
          <div className="space-y-2">
            <Label>BIPOC Owned</Label>
            <JobPostCard
              companyName="Diverse Energy"
              jobTitle="Community Outreach Lead"
              pathway="education"
              tags={["Full-time"]}
              status="bipoc-owned"
            />
          </div>
          <div className="space-y-2">
            <Label>Closing Soon</Label>
            <JobPostCard
              companyName="EcoVentures"
              jobTitle="Grant Writer"
              pathway="finance"
              tags={["Contract"]}
              status="closing-soon"
            />
          </div>
        </div>
      </ComponentCard>

      {/* Pathway Types */}
      <ComponentCard
        id="pathways"
        title="Pathway Types"
        description="Climate industry pathways with color-coded tags"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(
            [
              "energy",
              "agriculture",
              "conservation",
              "transportation",
              "construction",
              "technology",
            ] as PathwayType[]
          ).map((pathway) => (
            <JobPostCard
              key={pathway}
              companyName={`${pathway.charAt(0).toUpperCase() + pathway.slice(1)} Inc`}
              jobTitle={`${pathway.charAt(0).toUpperCase() + pathway.slice(1)} Specialist`}
              pathway={pathway}
              tags={["Full-time"]}
              size="compact"
            />
          ))}
        </div>
      </ComponentCard>

      {/* Interactive States */}
      <ComponentCard
        id="states"
        title="Interactive States"
        description="Hover to reveal action buttons"
      >
        <CodePreview
          code={`const [saved, setSaved] = React.useState(false);

<JobPostCard
  companyName="CleanTech"
  jobTitle="Battery Engineer"
  pathway="energy"
  tags={["Remote", "Full-time"]}
  saved={saved}
  onSave={() => setSaved(!saved)}
  onViewJob={() => console.log("View job")}
/>`}
        >
          <div className="max-w-[350px]">
            <p className="mb-4 text-caption text-foreground-muted">
              Hover over the card to see action buttons
            </p>
            <JobPostCard
              companyName="CleanTech"
              jobTitle="Battery Engineer"
              pathway="energy"
              tags={["Remote", "Full-time"]}
              saved={savedJobs.has("cleantech-1")}
              onSave={() => toggleSaved("cleantech-1")}
              // eslint-disable-next-line no-console
              onViewJob={() => console.log("View job")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Saved State */}
      <ComponentCard
        id="saved"
        title="Saved/Bookmarked State"
        description="Toggle bookmark state for saved jobs"
      >
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label>Not Saved</Label>
            <JobPostCard
              companyName="Green Jobs"
              jobTitle="Climate Analyst"
              pathway="research"
              tags={["Remote"]}
              saved={false}
              onSave={() => {}}
            />
          </div>
          <div className="space-y-2">
            <Label>Saved</Label>
            <JobPostCard
              companyName="Green Jobs"
              jobTitle="Climate Analyst"
              pathway="research"
              tags={["Remote"]}
              saved={true}
              onSave={() => {}}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Custom Action Text */}
      <ComponentCard
        id="action-text"
        title="Custom Action Text"
        description="Customize the action button label"
      >
        <div className="flex flex-wrap gap-4">
          <JobPostCard
            companyName="Eco Corp"
            jobTitle="Sustainability Manager"
            pathway="conservation"
            tags={["Full-time"]}
            actionText="Apply Now"
            onViewJob={() => {}}
          />
          <JobPostCard
            companyName="Green Fund"
            jobTitle="ESG Analyst"
            pathway="finance"
            tags={["Remote"]}
            actionText="Learn More"
            onViewJob={() => {}}
          />
        </div>
      </ComponentCard>

      {/* Complete Examples */}
      <ComponentCard
        id="examples"
        title="Complete Examples"
        description="Real-world usage patterns"
      >
        <div className="space-y-8">
          {/* Job Board Grid */}
          <div>
            <h4 className="mb-4 text-body-strong">Job Board Grid</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <JobPostCard
                companyName="SunPower Systems"
                jobTitle="Solar Installation Lead"
                pathway="energy"
                status="featured"
                tags={["Remote", "Full-time"]}
                saved={savedJobs.has("sunpower")}
                onSave={() => toggleSaved("sunpower")}
                onViewJob={() => {}}
              />
              <JobPostCard
                companyName="EcoFarms"
                jobTitle="Regenerative Agriculture Manager"
                pathway="agriculture"
                tags={["On-site", "Full-time"]}
                saved={savedJobs.has("ecofarms")}
                onSave={() => toggleSaved("ecofarms")}
                onViewJob={() => {}}
              />
              <JobPostCard
                companyName="Blue Ocean Initiative"
                jobTitle="Marine Conservation Scientist"
                pathway="conservation"
                status="closing-soon"
                tags={["Hybrid", "Contract"]}
                saved={savedJobs.has("blueocean")}
                onSave={() => toggleSaved("blueocean")}
                onViewJob={() => {}}
              />
            </div>
          </div>

          {/* Featured Jobs Section */}
          <div>
            <h4 className="mb-4 text-body-strong">Featured Jobs Section</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <JobPostCard
                companyName="Tesla Energy"
                jobTitle="Megapack Installation Engineer"
                pathway="energy"
                status="featured"
                tags={["Austin, TX", "Full-time"]}
                onViewJob={() => {}}
              />
              <JobPostCard
                companyName="Rivian"
                jobTitle="EV Charging Infrastructure Lead"
                pathway="transportation"
                status="featured"
                tags={["Remote", "Full-time"]}
                onViewJob={() => {}}
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props Table */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={jobPostCardProps} />
      </ComponentCard>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Use pathway tags to categorize jobs by climate industry",
          "Show status badges for featured or time-sensitive jobs",
          "Limit tags to 2 most relevant attributes",
          "Provide clear action buttons on hover",
          "Use consistent card sizes within a grid layout",
        ]}
        donts={[
          "Don't overload cards with too many tags or badges",
          "Don't use status badges on every card (reserve for special cases)",
          "Don't truncate job titles excessively",
          "Don't mix different card sizes in the same row",
          "Don't disable hover states on interactive cards",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Interactive Cards**: Cards with onClick are focusable with visible focus ring",
          "**Keyboard Navigation**: Tab to focus, Enter/Space to activate",
          "**Bookmark Button**: Has aria-label describing saved state",
          "**Avatar Fallback**: Auto-generates company initial when logo unavailable",
          "**Color Independence**: Status badges use both color and text labels",
          "**Hover States**: Action buttons appear on hover/focus",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Job Post Card"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/company-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Company Card</p>
            <p className="text-caption text-foreground-muted">Company profiles</p>
          </a>
          <a
            href="/design-system/components/job-note-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Job Note Card</p>
            <p className="text-caption text-foreground-muted">Career guidance</p>
          </a>
          <a
            href="/design-system/components/chip"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Chip</p>
            <p className="text-caption text-foreground-muted">Tags and filters</p>
          </a>
          <a
            href="/design-system/components/badge"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Badge</p>
            <p className="text-caption text-foreground-muted">Status indicators</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/job-post-card" />
    </div>
  );
}

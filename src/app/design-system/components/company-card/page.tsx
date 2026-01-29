"use client";

import React from "react";
import {
  CompanyCard,
  type PathwayType,
} from "@/components/ui";
import { Label } from "@/components/ui/label";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// Props documentation
const companyCardProps = [
  {
    name: "companyName",
    type: "string",
    required: true,
    description: "Company name displayed prominently",
  },
  {
    name: "companyLogo",
    type: "string",
    description: "URL for company logo image",
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
    name: "isPartner",
    type: "boolean",
    default: "false",
    description: "Whether company is a platform partner (shows Partner badge)",
  },
  {
    name: "isBipocOwned",
    type: "boolean",
    default: "false",
    description: "Whether company is BIPOC-owned (shows checkmark badge on avatar)",
  },
  {
    name: "jobCount",
    type: "number",
    description: "Number of open jobs (shows 'X Jobs' tag if provided)",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Callback when card is clicked",
  },
  {
    name: "size",
    type: '"default" | "compact" | "full"',
    default: '"default"',
    description: "Size variant of the card",
  },
];

const sampleCompanies = [
  {
    name: "SunPower Systems",
    pathway: "energy" as PathwayType,
    jobCount: 12,
    isPartner: true,
    isBipocOwned: false,
  },
  {
    name: "EcoFarms Collective",
    pathway: "agriculture" as PathwayType,
    jobCount: 5,
    isPartner: false,
    isBipocOwned: true,
  },
  {
    name: "Blue Ocean Initiative",
    pathway: "conservation" as PathwayType,
    jobCount: 8,
    isPartner: true,
    isBipocOwned: false,
  },
  {
    name: "GreenBuild Co",
    pathway: "construction" as PathwayType,
    jobCount: 3,
    isPartner: false,
    isBipocOwned: false,
  },
  {
    name: "CleanTech Ventures",
    pathway: "technology" as PathwayType,
    jobCount: 15,
    isPartner: true,
    isBipocOwned: true,
  },
  {
    name: "EcoTransit Solutions",
    pathway: "transportation" as PathwayType,
    jobCount: 7,
    isPartner: false,
    isBipocOwned: false,
  },
];

export default function CompanyCardPage() {
  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Company Card
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl mb-4">
          Display company profiles with industry pathway, job count, partner status,
          and BIPOC-owned indicators. Designed for company directories and job board
          employer listings.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success/10 rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">When to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Company directory listings</li>
              <li>Employer profiles on job boards</li>
              <li>Partner company showcases</li>
              <li>Search results for companies</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error/10 rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">When not to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Job listings (use JobPostCard)</li>
              <li>Full company profile pages (use dedicated layout)</li>
              <li>Team member cards (use CandidateCard or Avatar)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The company card structure"
      >
        <div className="relative p-6 bg-background-subtle rounded-lg">
          <div className="max-w-[350px]">
            <div className="relative bg-[var(--primitive-neutral-0)] rounded-[12px] p-4 shadow-[1px_2px_16px_rgba(31,29,28,0.08)] flex items-center h-[124px]">
              {/* Content */}
              <div className="flex items-start gap-3 flex-1 h-full">
                {/* Left: Company Info */}
                <div className="flex flex-col justify-between flex-1 h-full">
                  {/* Company Name */}
                  <div className="relative">
                    <h3 className="text-2xl font-medium text-[var(--primitive-neutral-800)]">
                      SunPower Systems
                    </h3>
                    <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">1</div>
                  </div>
                  {/* Tags Row */}
                  <div className="relative flex items-center gap-2 flex-wrap">
                    <div className="px-2 py-1 rounded-lg bg-[var(--primitive-yellow-200)]">
                      <span className="text-sm font-bold text-[var(--primitive-yellow-700)]">Energy</span>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-[var(--primitive-neutral-200)]">
                      <span className="text-sm text-[var(--primitive-neutral-700)]">12 Jobs</span>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-[var(--primitive-blue-100)]">
                      <span className="text-sm font-bold text-[var(--primitive-blue-500)]">Partner</span>
                    </div>
                    <div className="absolute -top-2 -left-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">2</div>
                  </div>
                </div>
                {/* Right: Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[var(--primitive-neutral-200)] flex items-center justify-center text-sm font-medium">
                    SP
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[var(--primitive-green-200)] border-2 border-white flex items-center justify-center">
                    <span className="text-xs text-[var(--primitive-green-700)]">+</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-foreground-brand text-white rounded-full flex items-center justify-center text-xs font-medium">3</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">1</span> Company Name</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">2</span> Pathway + Jobs + Partner</div>
            <div><span className="font-mono bg-background-muted px-1.5 py-0.5 rounded">3</span> Avatar + BIPOC Badge</div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple company card with essential information"
      >
        <CodePreview
          code={`import { CompanyCard } from "@/components/ui";

<CompanyCard
  companyName="SunPower Systems"
  pathway="energy"
  jobCount={12}
  onClick={() => console.log("View company")}
/>`}
        >
          <div className="max-w-[350px]">
            <CompanyCard
              companyName="SunPower Systems"
              pathway="energy"
              jobCount={12}
              onClick={() => console.log("View company")}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Size Variants */}
      <ComponentCard
        id="sizes"
        title="Size Variants"
        description="Available size options for different layouts"
      >
        <div className="space-y-6">
          <div>
            <Label className="mb-3 block">Default (350x124px)</Label>
            <CompanyCard
              companyName="Green Energy Co"
              pathway="energy"
              jobCount={8}
              size="default"
            />
          </div>
          <div>
            <Label className="mb-3 block">Full Width</Label>
            <div className="max-w-2xl">
              <CompanyCard
                companyName="EcoTech Solutions"
                pathway="technology"
                jobCount={15}
                isPartner
                size="full"
              />
            </div>
          </div>
          <div>
            <Label className="mb-3 block">Compact (Full Width, Auto Height)</Label>
            <div className="max-w-md">
              <CompanyCard
                companyName="Climate First"
                pathway="conservation"
                jobCount={3}
                size="compact"
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Partner Badge */}
      <ComponentCard
        id="partner"
        title="Partner Badge"
        description="Highlight platform partner companies"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Standard Company</Label>
            <CompanyCard
              companyName="Green Corp"
              pathway="conservation"
              jobCount={5}
              isPartner={false}
            />
          </div>
          <div className="space-y-2">
            <Label>Partner Company</Label>
            <CompanyCard
              companyName="CleanTech Ventures"
              pathway="technology"
              jobCount={15}
              isPartner={true}
            />
          </div>
        </div>
        <p className="text-caption text-foreground-muted mt-4">
          Note: When a company is a partner, the pathway tag shows only the icon (minimized) to make room for the Partner badge.
        </p>
      </ComponentCard>

      {/* BIPOC Owned Badge */}
      <ComponentCard
        id="bipoc-owned"
        title="BIPOC-Owned Badge"
        description="Indicator for BIPOC-owned businesses"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Standard</Label>
            <CompanyCard
              companyName="Solar Plus"
              pathway="energy"
              jobCount={7}
              isBipocOwned={false}
            />
          </div>
          <div className="space-y-2">
            <Label>BIPOC-Owned</Label>
            <CompanyCard
              companyName="Diverse Energy Solutions"
              pathway="energy"
              jobCount={4}
              isBipocOwned={true}
            />
          </div>
        </div>
        <p className="text-caption text-foreground-muted mt-4">
          The BIPOC-owned indicator appears as a green checkmark badge on the company avatar.
        </p>
      </ComponentCard>

      {/* Pathway Types */}
      <ComponentCard
        id="pathways"
        title="Pathway Types"
        description="Climate industry pathways with color-coded tags"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(["energy", "agriculture", "conservation", "transportation", "construction", "technology"] as PathwayType[]).map((pathway) => (
            <CompanyCard
              key={pathway}
              companyName={`${pathway.charAt(0).toUpperCase() + pathway.slice(1)} Inc`}
              pathway={pathway}
              jobCount={Math.floor(Math.random() * 20) + 1}
              size="compact"
            />
          ))}
        </div>
      </ComponentCard>

      {/* Job Count */}
      <ComponentCard
        id="job-count"
        title="Job Count"
        description="Display number of open positions"
      >
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label>No Jobs Shown</Label>
            <CompanyCard
              companyName="Startup Co"
              pathway="technology"
            />
          </div>
          <div className="space-y-2">
            <Label>Few Jobs</Label>
            <CompanyCard
              companyName="Small Team"
              pathway="conservation"
              jobCount={2}
            />
          </div>
          <div className="space-y-2">
            <Label>Many Jobs</Label>
            <CompanyCard
              companyName="Large Corp"
              pathway="energy"
              jobCount={50}
            />
          </div>
        </div>
      </ComponentCard>

      {/* Combined Badges */}
      <ComponentCard
        id="combined"
        title="Combined Badges"
        description="Partner and BIPOC-owned badges together"
      >
        <CodePreview
          code={`<CompanyCard
  companyName="Inclusive Energy Co"
  pathway="energy"
  jobCount={10}
  isPartner={true}
  isBipocOwned={true}
/>`}
        >
          <div className="max-w-[350px]">
            <CompanyCard
              companyName="Inclusive Energy Co"
              pathway="energy"
              jobCount={10}
              isPartner={true}
              isBipocOwned={true}
            />
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
          {/* Company Directory Grid */}
          <div>
            <h4 className="text-body-strong mb-4">Company Directory Grid</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleCompanies.map((company) => (
                <CompanyCard
                  key={company.name}
                  companyName={company.name}
                  pathway={company.pathway}
                  jobCount={company.jobCount}
                  isPartner={company.isPartner}
                  isBipocOwned={company.isBipocOwned}
                  onClick={() => console.log(`View ${company.name}`)}
                />
              ))}
            </div>
          </div>

          {/* Featured Partners Section */}
          <div>
            <h4 className="text-body-strong mb-4">Featured Partners</h4>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {sampleCompanies
                .filter((c) => c.isPartner)
                .map((company) => (
                  <CompanyCard
                    key={company.name}
                    companyName={company.name}
                    pathway={company.pathway}
                    jobCount={company.jobCount}
                    isPartner={company.isPartner}
                    isBipocOwned={company.isBipocOwned}
                  />
                ))}
            </div>
          </div>

          {/* Compact List */}
          <div>
            <h4 className="text-body-strong mb-4">Compact Company List</h4>
            <div className="space-y-3 max-w-lg">
              {sampleCompanies.slice(0, 3).map((company) => (
                <CompanyCard
                  key={company.name}
                  companyName={company.name}
                  pathway={company.pathway}
                  jobCount={company.jobCount}
                  isPartner={company.isPartner}
                  isBipocOwned={company.isBipocOwned}
                  size="full"
                />
              ))}
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Props Table */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={companyCardProps} />
      </ComponentCard>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Use pathway tags to categorize companies by industry",
          "Show job count to indicate hiring activity",
          "Highlight partner companies with the Partner badge",
          "Display BIPOC-owned indicator when applicable",
          "Use consistent card sizes within the same section",
        ]}
        donts={[
          "Don't show 0 job count (omit if no open positions)",
          "Don't use Partner badge for non-partner companies",
          "Don't truncate company names excessively",
          "Don't mix different card sizes in the same row",
          "Don't use this card for job listings",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Interactive Cards**: Cards with onClick are focusable with visible focus ring",
          "**Keyboard Navigation**: Tab to focus, Enter/Space to activate",
          "**BIPOC Badge**: Has title attribute for tooltip on hover",
          "**Avatar Fallback**: Auto-generates company initial when logo unavailable",
          "**Color Independence**: Badges use both color and text labels",
          "**Hover States**: Shadow increases on hover for visual feedback",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Company Card"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/job-post-card"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Job Post Card</p>
            <p className="text-caption text-foreground-muted">Job listings</p>
          </a>
          <a
            href="/design-system/components/job-note-card"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Job Note Card</p>
            <p className="text-caption text-foreground-muted">Career guidance</p>
          </a>
          <a
            href="/design-system/components/chip"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Chip / Pathway Tag</p>
            <p className="text-caption text-foreground-muted">Industry tags</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Avatar</p>
            <p className="text-caption text-foreground-muted">Company logos</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/company-card" />
    </div>
  );
}

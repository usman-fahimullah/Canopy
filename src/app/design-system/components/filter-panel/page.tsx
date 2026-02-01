"use client";

import React from "react";
import {
  FilterPanel,
  FilterPanelInline,
  FilterPanelSheet,
  FilterGroup,
  ActiveFiltersBar,
  atsFilterConfigs,
  countActiveFilters,
  getActiveFilterLabels,
  Label,
  Button,
  Card,
  CardContent,
  Badge,
} from "@/components/ui";
import type { FilterConfig, FilterState, FilterValue } from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
  ComponentAnatomy,
  RelatedComponents,
  RealWorldExample,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Funnel, FunnelSimple, Users, Briefcase, MagnifyingGlass, X } from "@phosphor-icons/react";

// ============================================
// SAMPLE DATA
// ============================================

const sampleFilterConfigs: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    options: [
      { value: "active", label: "Active" },
      { value: "screening", label: "Screening" },
      { value: "interview", label: "Interview" },
      { value: "offer", label: "Offer" },
      { value: "hired", label: "Hired" },
      { value: "rejected", label: "Rejected" },
    ],
  },
  {
    id: "location",
    label: "Location",
    type: "checkbox",
    options: [
      { value: "remote", label: "Remote" },
      { value: "onsite", label: "On-site" },
      { value: "hybrid", label: "Hybrid" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    type: "range",
    min: 0,
    max: 20,
    step: 1,
  },
  {
    id: "skills",
    label: "Skills",
    type: "checkbox",
    options: [
      { value: "sustainability", label: "Sustainability" },
      { value: "solar", label: "Solar Energy" },
      { value: "wind", label: "Wind Energy" },
      { value: "esg", label: "ESG Reporting" },
      { value: "carbon", label: "Carbon Accounting" },
    ],
  },
  {
    id: "source",
    label: "Source",
    type: "radio",
    options: [
      { value: "linkedin", label: "LinkedIn" },
      { value: "referral", label: "Referral" },
      { value: "website", label: "Company Website" },
      { value: "jobs-board", label: "Green Jobs Board" },
    ],
  },
  {
    id: "date",
    label: "Applied Date",
    type: "date-range",
  },
];

// ============================================
// PROPS DEFINITIONS
// ============================================

const filterPanelProps = [
  {
    name: "filters",
    type: "FilterConfig[]",
    required: true,
    description: "Array of filter configurations",
  },
  {
    name: "values",
    type: "FilterState",
    required: true,
    description: "Current filter values (Record<string, FilterValue>)",
  },
  {
    name: "onChange",
    type: "(values: FilterState) => void",
    required: true,
    description: "Callback when any filter value changes",
  },
  {
    name: "onClear",
    type: "() => void",
    description: "Callback to clear all filters",
  },
  {
    name: "onApply",
    type: "() => void",
    description: "Callback when Apply button is clicked",
  },
  {
    name: "showApplyButton",
    type: "boolean",
    default: "false",
    description: "Show a separate Apply button instead of immediate filtering",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows loading state while filters are being applied",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const filterPanelInlineProps = [
  {
    name: "...FilterPanelProps",
    type: "FilterPanelProps",
    description: "All FilterPanel props",
  },
  {
    name: "collapsible",
    type: "boolean",
    default: "true",
    description: "Allow collapsing filter groups",
  },
];

const filterPanelSheetProps = [
  {
    name: "...FilterPanelProps",
    type: "FilterPanelProps",
    description: "All FilterPanel props",
  },
  {
    name: "trigger",
    type: "ReactNode",
    description: "Custom trigger element (defaults to Filter button)",
  },
  {
    name: "title",
    type: "string",
    default: '"Filters"',
    description: "Sheet header title",
  },
];

const filterGroupProps = [
  {
    name: "config",
    type: "FilterConfig",
    required: true,
    description: "Single filter configuration",
  },
  {
    name: "value",
    type: "FilterValue",
    required: true,
    description: "Current value of this filter",
  },
  {
    name: "onChange",
    type: "(value: FilterValue) => void",
    required: true,
    description: "Callback when value changes",
  },
  {
    name: "collapsible",
    type: "boolean",
    default: "false",
    description: "Make the filter group collapsible",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    default: "true",
    description: "Initial collapsed state",
  },
];

const activeFiltersBarProps = [
  {
    name: "filters",
    type: "FilterConfig[]",
    required: true,
    description: "Filter configurations for label lookup",
  },
  {
    name: "values",
    type: "FilterState",
    required: true,
    description: "Current active filter values",
  },
  {
    name: "onRemove",
    type: "(filterId: string) => void",
    required: true,
    description: "Callback to remove a specific filter",
  },
  {
    name: "onClearAll",
    type: "() => void",
    required: true,
    description: "Callback to clear all filters",
  },
];

const filterConfigType = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique filter identifier",
  },
  {
    name: "label",
    type: "string",
    required: true,
    description: "Display label for the filter",
  },
  {
    name: "type",
    type: '"checkbox" | "radio" | "range" | "date-range" | "search" | "custom"',
    required: true,
    description: "Type of filter control",
  },
  {
    name: "options",
    type: "{ value: string; label: string }[]",
    description: "Options for select-type filters",
  },
  {
    name: "min",
    type: "number",
    description: "Minimum value for range filters",
  },
  {
    name: "max",
    type: "number",
    description: "Maximum value for range filters",
  },
  {
    name: "unit",
    type: "string",
    description: 'Unit label for range filters (e.g., "years")',
  },
];

const helperFunctions = [
  {
    name: "countActiveFilters",
    type: "(values: FilterState) => number",
    description: "Returns the count of active (non-empty) filters",
  },
  {
    name: "getActiveFilterLabels",
    type: "(filters: FilterConfig[], values: FilterState) => string[]",
    description: "Returns human-readable labels for active filters",
  },
  {
    name: "atsFilterConfigs",
    type: "FilterConfig[]",
    description: "Pre-built filter configs for ATS candidate/job filtering",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function FilterPanelPage() {
  // Basic filter state
  const [filterValues, setFilterValues] = React.useState<FilterState>({});

  // Example with pre-set values
  const [presetValues, setPresetValues] = React.useState<FilterState>({
    status: ["active", "screening"],
    location: ["remote"],
  });

  // Sheet example state
  const [sheetValues, setSheetValues] = React.useState<FilterState>({});

  const handleClearAll = () => {
    setFilterValues({});
  };

  const handleRemoveFilter = (filterId: string) => {
    const newValues = { ...filterValues };
    delete newValues[filterId];
    setFilterValues(newValues);
  };

  const activeCount = countActiveFilters(sampleFilterConfigs, filterValues);

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Filter Panel</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Advanced filtering interface for narrowing down candidates, jobs, or other data with
          multiple criteria. Supports checkbox, radio select, range sliders, date ranges, and
          boolean filters. Available as inline panel, slide-out sheet, or individual filter groups.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Data Display
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Search & Filter
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            ATS Feature
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Candidate pipeline filtering by status, skills, etc.</li>
              <li>Job listing search with multiple criteria</li>
              <li>Data tables needing complex filtering</li>
              <li>Search results refinement</li>
              <li>Dashboard data exploration</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>Simple search (use SearchInput)</li>
              <li>Single criterion selection (use Select)</li>
              <li>Form data entry (use form controls)</li>
              <li>Navigation or sorting (use DropdownMenu)</li>
              <li>Binary toggles (use Switch or Checkbox)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Header",
            description: "Title showing filter count and clear all button",
            required: true,
          },
          {
            name: "Filter Groups",
            description: "Individual filter sections with labels and controls",
            required: true,
          },
          {
            name: "Multi-Select",
            description: "Checkbox group for selecting multiple options",
          },
          {
            name: "Single-Select",
            description: "Radio group or dropdown for single selection",
          },
          {
            name: "Range Slider",
            description: "Dual-thumb slider for numeric ranges",
          },
          {
            name: "Date Range Picker",
            description: "Start/end date selection",
          },
          {
            name: "Active Filters Bar",
            description: "Shows applied filters as removable chips",
          },
          {
            name: "Apply/Clear Actions",
            description: "Footer buttons for applying or clearing filters",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A standard filter panel with multiple filter types"
      >
        <CodePreview
          code={`import { FilterPanel, countActiveFilters } from "@/components/ui";

const [values, setValues] = React.useState<FilterState>({});

const filters: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox",
    options: [
      { value: "active", label: "Active" },
      { value: "screening", label: "Screening" },
      { value: "hired", label: "Hired" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    type: "range",
    min: 0,
    max: 20,
    step: 1,
  },
];

<FilterPanel
  filters={filters}
  value={values}
  onChange={setValues}
  onReset={() => setValues({})}
/>`}
        >
          <div className="max-w-sm">
            <FilterPanel
              filters={sampleFilterConfigs.slice(0, 3)}
              value={filterValues}
              onChange={setFilterValues}
              onReset={handleClearAll}
            />
            <p className="mt-4 text-caption text-foreground-muted">Active filters: {activeCount}</p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Different layouts for various use cases"
      >
        <div className="space-y-8">
          {/* Inline Panel */}
          <div className="space-y-2">
            <Label className="font-semibold">FilterPanelInline</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Sidebar-style panel for persistent filtering. Collapsible filter groups.
            </p>
            <div className="max-w-xs rounded-lg border border-border-muted p-4">
              <FilterPanelInline
                filters={sampleFilterConfigs.slice(0, 3)}
                value={presetValues}
                onChange={setPresetValues}
                onReset={() => setPresetValues({})}
                collapsible
              />
            </div>
          </div>

          {/* Sheet Panel */}
          <div className="space-y-2">
            <Label className="font-semibold">FilterPanelSheet</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Slide-out sheet for mobile or space-constrained layouts.
            </p>
            <FilterPanelSheet
              filters={sampleFilterConfigs}
              value={sheetValues}
              onChange={setSheetValues}
              onReset={() => setSheetValues({})}
            />
          </div>

          {/* Individual Filter Group */}
          <div className="space-y-2">
            <Label className="font-semibold">FilterGroup (Individual)</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Single filter control for custom layouts.
            </p>
            <div className="max-w-xs rounded-lg border border-border-muted p-4">
              <FilterGroup
                filter={sampleFilterConfigs[0]}
                value={filterValues.status || []}
                onChange={(value) =>
                  setFilterValues({ ...filterValues, status: value as string[] })
                }
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. FILTER TYPES */}
      {/* ============================================ */}
      <ComponentCard
        id="filter-types"
        title="Filter Types"
        description="All available filter control types"
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Multi-Select */}
          <div className="space-y-2 rounded-lg border border-border-muted p-4">
            <Label className="font-semibold">Multi-Select</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Checkbox group for multiple selections
            </p>
            <FilterGroup
              filter={{
                id: "demo-multi",
                label: "Status",
                type: "checkbox",
                options: [
                  { value: "active", label: "Active" },
                  { value: "screening", label: "Screening" },
                  { value: "interview", label: "Interview" },
                ],
              }}
              value={[]}
              onChange={() => {}}
            />
          </div>

          {/* Single-Select */}
          <div className="space-y-2 rounded-lg border border-border-muted p-4">
            <Label className="font-semibold">Single-Select</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Radio group for exclusive selection
            </p>
            <FilterGroup
              filter={{
                id: "demo-single",
                label: "Source",
                type: "radio",
                options: [
                  { value: "linkedin", label: "LinkedIn" },
                  { value: "referral", label: "Referral" },
                  { value: "website", label: "Website" },
                ],
              }}
              value=""
              onChange={() => {}}
            />
          </div>

          {/* Range */}
          <div className="space-y-2 rounded-lg border border-border-muted p-4">
            <Label className="font-semibold">Range</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Dual-thumb slider for numeric ranges
            </p>
            <FilterGroup
              filter={{
                id: "demo-range",
                label: "Experience",
                type: "range",
                min: 0,
                max: 20,
                step: 1,
              }}
              value={[2, 10]}
              onChange={() => {}}
            />
          </div>

          {/* Date Range */}
          <div className="space-y-2 rounded-lg border border-border-muted p-4">
            <Label className="font-semibold">Date Range</Label>
            <p className="mb-2 text-caption text-foreground-muted">Start and end date selection</p>
            <FilterGroup
              filter={{
                id: "demo-date",
                label: "Applied Date",
                type: "date-range",
              }}
              value={{ start: undefined, end: undefined }}
              onChange={() => {}}
            />
          </div>

          {/* Boolean */}
          <div className="space-y-2 rounded-lg border border-border-muted p-4">
            <Label className="font-semibold">Boolean</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Toggle switch for yes/no filters
            </p>
            <FilterGroup
              filter={{
                id: "demo-boolean",
                label: "Has Resume",
                type: "checkbox",
                options: [{ value: "yes", label: "Yes" }],
              }}
              value={["yes"]}
              onChange={() => {}}
            />
          </div>

          {/* Search */}
          <div className="space-y-2 rounded-lg border border-border-muted p-4">
            <Label className="font-semibold">Search</Label>
            <p className="mb-2 text-caption text-foreground-muted">
              Text input for keyword filtering
            </p>
            <FilterGroup
              filter={{
                id: "demo-search",
                label: "Keywords",
                type: "search",
              }}
              value=""
              onChange={() => {}}
            />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. ACTIVE FILTERS BAR */}
      {/* ============================================ */}
      <ComponentCard
        id="active-filters"
        title="Active Filters Bar"
        description="Display and manage applied filters"
      >
        <CodePreview
          code={`import { ActiveFiltersBar } from "@/components/ui";

<ActiveFiltersBar
  filters={filterConfigs}
  value={filterValues}
  onRemove={(filterId) => removeFilter(filterId)}
  onClearAll={() => clearAllFilters()}
/>`}
        >
          <div className="space-y-4">
            <ActiveFiltersBar
              filters={sampleFilterConfigs}
              value={presetValues}
              onChange={setPresetValues}
              onReset={() => setPresetValues({})}
            />
            <p className="text-caption text-foreground-muted">
              Click chips to remove individual filters, or &quot;Clear all&quot; to reset
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. HELPER FUNCTIONS */}
      {/* ============================================ */}
      <ComponentCard
        id="helpers"
        title="Helper Functions"
        description="Utility functions for working with filter state"
      >
        <div className="space-y-6">
          <CodePreview
            code={`import {
  countActiveFilters,
  getActiveFilterLabels,
  atsFilterConfigs,
} from "@/components/ui";

// Count active filters
const count = countActiveFilters(sampleFilterConfigs, filterValues);
// Returns: 2

// Get human-readable labels
const labels = getActiveFilterLabels(filters, filterValues);
// Returns: ["Status: Active, Screening", "Location: Remote"]

// Use pre-built ATS filter configs
<FilterPanel filters={atsFilterConfigs} ... />`}
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-background-subtle p-4">
                <p className="mb-2 text-sm font-medium">
                  countActiveFilters(sampleFilterConfigs, presetValues):
                </p>
                <code className="text-sm">
                  {countActiveFilters(sampleFilterConfigs, presetValues)}
                </code>
              </div>
              <div className="rounded-lg bg-background-subtle p-4">
                <p className="mb-2 text-sm font-medium">
                  getActiveFilterLabels(filters, presetValues):
                </p>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilterLabels(sampleFilterConfigs, presetValues).map((item, i) => (
                    <Badge key={i} variant="secondary">
                      {item.label}: {item.value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. ATS PRESET CONFIGS */}
      {/* ============================================ */}
      <ComponentCard
        id="ats-presets"
        title="ATS Filter Presets"
        description="Pre-built filter configurations for common ATS use cases"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-muted">
            Use <code className="rounded bg-background-muted px-1">atsFilterConfigs</code> for
            ready-to-use filter configurations for candidate and job filtering.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border-muted p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium">
                <Users className="h-4 w-4 text-foreground-brand" />
                Candidate Filters
              </h4>
              <ul className="space-y-1 text-sm text-foreground-muted">
                <li>Pipeline Stage (multi-select)</li>
                <li>Skills (multi-select)</li>
                <li>Experience Range (range)</li>
                <li>Location Type (multi-select)</li>
                <li>Source (single-select)</li>
                <li>Applied Date (date-range)</li>
                <li>Has Resume (boolean)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border-muted p-4">
              <h4 className="mb-2 flex items-center gap-2 font-medium">
                <Briefcase className="h-4 w-4 text-foreground-brand" />
                Job Filters
              </h4>
              <ul className="space-y-1 text-sm text-foreground-muted">
                <li>Status (multi-select)</li>
                <li>Department (multi-select)</li>
                <li>Location Type (multi-select)</li>
                <li>Employment Type (multi-select)</li>
                <li>Posted Date (date-range)</li>
                <li>Active (boolean)</li>
              </ul>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="FilterPanel Props">
          <PropsTable props={filterPanelProps} />
        </ComponentCard>

        <ComponentCard title="FilterPanelInline Props">
          <PropsTable props={filterPanelInlineProps} />
        </ComponentCard>

        <ComponentCard title="FilterPanelSheet Props">
          <PropsTable props={filterPanelSheetProps} />
        </ComponentCard>

        <ComponentCard title="FilterGroup Props">
          <PropsTable props={filterGroupProps} />
        </ComponentCard>

        <ComponentCard title="ActiveFiltersBar Props">
          <PropsTable props={activeFiltersBarProps} />
        </ComponentCard>

        <ComponentCard title="FilterConfig Type">
          <PropsTable props={filterConfigType} />
        </ComponentCard>

        <ComponentCard title="Helper Functions">
          <PropsTable props={helperFunctions} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 10. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use FilterPanelSheet on mobile for better UX",
            "Show ActiveFiltersBar above results for visibility",
            "Use pre-built atsFilterConfigs when applicable",
            "Provide clear labels for all filter options",
            "Show result count that updates with filtering",
            "Allow clearing individual or all filters easily",
          ]}
          donts={[
            "Don't show too many filters at once (max 5-7 visible)",
            "Don't require Apply button for immediate feedback scenarios",
            "Don't nest filters too deeply (keep UI simple)",
            "Don't use range filters for small option sets (use multi-select)",
            "Don't hide the clear all option",
            "Don't forget to handle empty results state",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Tab through filter controls, Space/Enter to toggle",
            "**Focus management**: Focus moves logically through filter groups",
            "**Screen readers**: Filter labels and values announced correctly",
            "**ARIA**: Checkboxes and radios use proper group roles",
            "**Collapsible sections**: Announced as expanded/collapsed",
            "**Active filters**: Chip removal is keyboard accessible",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "SearchInput",
              href: "/design-system/components/search-input",
              description: "For text-based search",
            },
            {
              name: "Select",
              href: "/design-system/components/select",
              description: "For single option selection",
            },
            {
              name: "Checkbox",
              href: "/design-system/components/checkbox",
              description: "For individual boolean options",
            },
            {
              name: "Slider",
              href: "/design-system/components/slider",
              description: "Underlying range control",
            },
            {
              name: "DatePicker",
              href: "/design-system/components/date-picker",
              description: "Underlying date selection",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Candidate Pipeline Sidebar"
          description="Filter panel in candidate pipeline view"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-6">
                {/* Filter Sidebar */}
                <div className="w-64 shrink-0 border-r border-border-muted pr-4">
                  <div className="mb-4 flex items-center gap-2">
                    <Funnel className="h-5 w-5 text-foreground-brand" />
                    <h3 className="text-body-strong text-foreground">Filter Candidates</h3>
                  </div>
                  <FilterPanelInline
                    filters={sampleFilterConfigs.slice(0, 4)}
                    value={filterValues}
                    onChange={setFilterValues}
                    onReset={handleClearAll}
                    collapsible
                  />
                </div>

                {/* Results Area */}
                <div className="flex-1">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-body-strong text-foreground">Candidates</h3>
                      <p className="text-caption text-foreground-muted">
                        Showing 24 of 156 candidates
                      </p>
                    </div>
                    {activeCount > 0 && (
                      <Badge variant="info">
                        {activeCount} filter{activeCount !== 1 ? "s" : ""} active
                      </Badge>
                    )}
                  </div>
                  {activeCount > 0 && (
                    <ActiveFiltersBar
                      filters={sampleFilterConfigs}
                      value={filterValues}
                      onChange={setFilterValues}
                      onReset={handleClearAll}
                    />
                  )}
                  <div className="mt-4 rounded-lg border border-dashed border-border-muted p-8 text-center text-foreground-muted">
                    Candidate cards would appear here
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Mobile Filter Sheet"
          description="Full-screen filter panel for mobile devices"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MagnifyingGlass className="h-5 w-5 text-foreground-brand" />
                    <h3 className="text-body-strong text-foreground">Job Search</h3>
                  </div>
                  <FilterPanelSheet
                    filters={sampleFilterConfigs}
                    value={sheetValues}
                    onChange={setSheetValues}
                    onReset={() => setSheetValues({})}
                    trigger={
                      <Button variant="secondary" size="sm">
                        <FunnelSimple className="mr-2 h-4 w-4" />
                        Filters
                        {countActiveFilters(sampleFilterConfigs, sheetValues) > 0 && (
                          <Badge variant="info" className="ml-2">
                            {countActiveFilters(sampleFilterConfigs, sheetValues)}
                          </Badge>
                        )}
                      </Button>
                    }
                  />
                </div>

                {countActiveFilters(sampleFilterConfigs, sheetValues) > 0 && (
                  <ActiveFiltersBar
                    filters={sampleFilterConfigs}
                    value={sheetValues}
                    onChange={setSheetValues}
                    onReset={() => setSheetValues({})}
                  />
                )}

                <div className="rounded-lg border border-dashed border-border-muted p-8 text-center text-foreground-muted">
                  Job listings would appear here
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Quick Filter Bar"
          description="Horizontal filter bar for common quick filters"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Status:</Label>
                    <div className="flex gap-1">
                      {["All", "Active", "Screening", "Interview"].map((status) => (
                        <Button
                          key={status}
                          variant={status === "Active" ? "primary" : "tertiary"}
                          size="sm"
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="h-6 w-px bg-border-muted" />
                  <FilterPanelSheet
                    filters={sampleFilterConfigs}
                    value={filterValues}
                    onChange={setFilterValues}
                    onReset={handleClearAll}
                    trigger={
                      <Button variant="tertiary" size="sm">
                        More Filters
                        {activeCount > 0 && (
                          <Badge variant="secondary" className="ml-2">
                            +{activeCount}
                          </Badge>
                        )}
                      </Button>
                    }
                  />
                </div>

                <div className="rounded-lg border border-dashed border-border-muted p-8 text-center text-foreground-muted">
                  Data table would appear here
                </div>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/filter-panel" />
    </div>
  );
}

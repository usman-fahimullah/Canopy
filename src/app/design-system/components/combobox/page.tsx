"use client";

import React from "react";
import {
  Combobox,
  MultiCombobox,
  AsyncCombobox,
  Label,
  Card,
  CardContent,
  Badge,
  Button,
} from "@/components/ui";
import type { ComboboxOption } from "@/components/ui";
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
import {
  MapPin,
  Briefcase,
  User,
  Buildings,
  Leaf,
  Lightning,
  Wind,
  SunDim,
  TreeEvergreen,
  Drop,
} from "@phosphor-icons/react";

// ============================================
// SAMPLE DATA
// ============================================

const locationOptions: ComboboxOption[] = [
  { value: "sf", label: "San Francisco, CA", description: "Bay Area" },
  { value: "nyc", label: "New York, NY", description: "East Coast" },
  { value: "austin", label: "Austin, TX", description: "Texas" },
  { value: "seattle", label: "Seattle, WA", description: "Pacific Northwest" },
  { value: "denver", label: "Denver, CO", description: "Mountain West" },
  { value: "remote", label: "Remote", description: "Work from anywhere" },
];

const jobTypeOptions: ComboboxOption[] = [
  { value: "full-time", label: "Full-time", icon: <Briefcase size={16} /> },
  { value: "part-time", label: "Part-time", icon: <Briefcase size={16} /> },
  { value: "contract", label: "Contract", icon: <Briefcase size={16} /> },
  { value: "internship", label: "Internship", icon: <Briefcase size={16} /> },
];

const skillOptions: ComboboxOption[] = [
  { value: "solar", label: "Solar Energy", icon: <SunDim size={16} />, group: "Renewable Energy" },
  { value: "wind", label: "Wind Power", icon: <Wind size={16} />, group: "Renewable Energy" },
  { value: "hydro", label: "Hydroelectric", icon: <Drop size={16} />, group: "Renewable Energy" },
  { value: "esg", label: "ESG Reporting", icon: <Leaf size={16} />, group: "Sustainability" },
  {
    value: "lca",
    label: "Life Cycle Assessment",
    icon: <TreeEvergreen size={16} />,
    group: "Sustainability",
  },
  {
    value: "carbon",
    label: "Carbon Accounting",
    icon: <Leaf size={16} />,
    group: "Sustainability",
  },
  { value: "ev", label: "Electric Vehicles", icon: <Lightning size={16} />, group: "Clean Tech" },
  {
    value: "battery",
    label: "Battery Storage",
    icon: <Lightning size={16} />,
    group: "Clean Tech",
  },
];

const departmentOptions: ComboboxOption[] = [
  { value: "engineering", label: "Engineering", description: "Technical roles" },
  { value: "operations", label: "Operations", description: "Day-to-day management" },
  { value: "sustainability", label: "Sustainability", description: "Environmental impact" },
  { value: "sales", label: "Sales", description: "Business development" },
  {
    value: "marketing",
    label: "Marketing",
    description: "Brand and communications",
    disabled: true,
  },
];

// ============================================
// PROPS DEFINITIONS
// ============================================

const comboboxProps = [
  {
    name: "options",
    type: "ComboboxOption[]",
    description:
      "Array of options to display. Each option has value, label, and optional description, icon, disabled, and group properties.",
    default: "[]",
  },
  {
    name: "value",
    type: "string",
    description: "Currently selected value (controlled mode).",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback when selection changes.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select an option..."',
    description: "Placeholder text shown when no option is selected.",
  },
  {
    name: "searchPlaceholder",
    type: "string",
    default: '"Search..."',
    description: "Placeholder text for the search input.",
  },
  {
    name: "emptyMessage",
    type: "string",
    default: '"No results found."',
    description: "Message displayed when search yields no results.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the combobox.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a loading spinner.",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Shows error state with red border.",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Shows success state with green border.",
  },
  {
    name: "clearable",
    type: "boolean",
    default: "true",
    description: "Shows a clear button when a value is selected.",
  },
  {
    name: "onSearchChange",
    type: "(search: string) => void",
    description: "Callback when search input changes. Useful for async search.",
  },
  {
    name: "renderOption",
    type: "(option: ComboboxOption, selected: boolean) => ReactNode",
    description: "Custom render function for options.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

const multiComboboxProps = [
  {
    name: "options",
    type: "ComboboxOption[]",
    description: "Array of options to display.",
    default: "[]",
  },
  {
    name: "value",
    type: "string[]",
    description: "Array of currently selected values.",
    default: "[]",
  },
  {
    name: "onValueChange",
    type: "(value: string[]) => void",
    description: "Callback when selection changes.",
  },
  {
    name: "maxItems",
    type: "number",
    description: "Maximum number of items that can be selected.",
  },
  {
    name: "placeholder",
    type: "string",
    default: '"Select options..."',
    description: "Placeholder text when no options are selected.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the combobox.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a loading spinner.",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Shows error state.",
  },
  {
    name: "success",
    type: "boolean",
    default: "false",
    description: "Shows success state.",
  },
];

const asyncComboboxProps = [
  {
    name: "loadOptions",
    type: "(search: string) => Promise<ComboboxOption[]>",
    description: "Function to fetch options based on search query. Required for AsyncCombobox.",
  },
  {
    name: "debounceMs",
    type: "number",
    default: "300",
    description: "Debounce delay in milliseconds before triggering search.",
  },
  {
    name: "minChars",
    type: "number",
    default: "1",
    description: "Minimum characters before search is triggered.",
  },
];

const optionProps = [
  {
    name: "value",
    type: "string",
    description: "Unique identifier for the option. Required.",
  },
  {
    name: "label",
    type: "string",
    description: "Display text for the option. Required.",
  },
  {
    name: "description",
    type: "string",
    description: "Secondary text shown below the label.",
  },
  {
    name: "icon",
    type: "ReactNode",
    description: "Icon to display before the label.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Makes the option non-selectable.",
  },
  {
    name: "group",
    type: "string",
    description: "Group name for categorizing options.",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function ComboboxPage() {
  const [singleValue, setSingleValue] = React.useState("");
  const [multiValue, setMultiValue] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [asyncValue, setAsyncValue] = React.useState("");
  const [limitedValue, setLimitedValue] = React.useState<string[]>([]);

  // Simulated async search function
  const loadCandidates = async (search: string): Promise<ComboboxOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const candidates = [
      { value: "1", label: "Jane Smith", description: "Senior Solar Engineer" },
      { value: "2", label: "John Doe", description: "Sustainability Analyst" },
      { value: "3", label: "Sarah Johnson", description: "Wind Turbine Technician" },
      { value: "4", label: "Mike Chen", description: "ESG Consultant" },
      { value: "5", label: "Emily Brown", description: "Carbon Accountant" },
    ];
    return candidates.filter(
      (c) =>
        c.label.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Combobox</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Combobox combines a text input with a dropdown list, allowing users to search and select
          from a list of options. It&apos;s ideal for large option sets where users benefit from
          typing to filter, such as selecting locations, skills, or candidates.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Interactive
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            3 Variants
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Async Support
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Large option sets (5+ items)</li>
              <li>• Users know what they&apos;re looking for</li>
              <li>• Options have predictable, searchable labels</li>
              <li>• Multi-selection with search filtering</li>
              <li>• API-driven options that load dynamically</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Small option sets (use Select instead)</li>
              <li>• Binary choices (use Switch or Checkbox)</li>
              <li>• When users need to see all options at once</li>
              <li>• Free-form text entry (use Input)</li>
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
            name: "Trigger Button",
            description:
              "The clickable area that opens the dropdown. Shows selected value or placeholder.",
            required: true,
          },
          {
            name: "Selected Value / Placeholder",
            description:
              "Displays the current selection or placeholder text when nothing is selected.",
            required: true,
          },
          {
            name: "Clear Button",
            description:
              "Optional button to clear the selection. Only visible when clearable is true and a value is selected.",
          },
          {
            name: "Dropdown Indicator",
            description:
              "Caret icon that rotates when dropdown is open. Shows loading spinner or error icon based on state.",
            required: true,
          },
          {
            name: "Search Input",
            description: "Text input at the top of the dropdown for filtering options.",
            required: true,
          },
          {
            name: "Option List",
            description: "Scrollable list of filterable options, optionally grouped by category.",
            required: true,
          },
          {
            name: "Selected Badges (Multi)",
            description:
              "In MultiCombobox, shows badges for each selected item with remove buttons.",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple single-select combobox with searchable options"
      >
        <CodePreview
          code={`import { Combobox } from "@/components/ui";

const options = [
  { value: "sf", label: "San Francisco, CA" },
  { value: "nyc", label: "New York, NY" },
  { value: "austin", label: "Austin, TX" },
];

<Combobox
  options={options}
  value={value}
  onValueChange={setValue}
  placeholder="Select a location"
/>`}
        >
          <div className="max-w-md">
            <Combobox
              options={locationOptions}
              value={singleValue}
              onValueChange={setSingleValue}
              placeholder="Select a location"
            />
            <p className="mt-2 text-caption text-foreground-muted">
              Selected:{" "}
              <code className="rounded bg-background-muted px-1">{singleValue || "(none)"}</code>
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Variants"
        description="Three combobox variants for different use cases"
      >
        <div className="space-y-8">
          {/* Single Select */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Single Select (Combobox)</Label>
              <span className="text-caption text-foreground-muted">
                — Select one option from a searchable list
              </span>
            </div>
            <div className="max-w-md">
              <Combobox
                options={jobTypeOptions}
                value={singleValue}
                onValueChange={setSingleValue}
                placeholder="Select employment type"
              />
            </div>
          </div>

          {/* Multi Select */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Multi Select (MultiCombobox)</Label>
              <span className="text-caption text-foreground-muted">
                — Select multiple options with badge chips
              </span>
            </div>
            <div className="max-w-md">
              <MultiCombobox
                options={skillOptions}
                value={multiValue}
                onValueChange={setMultiValue}
                placeholder="Select skills"
              />
              {multiValue.length > 0 && (
                <p className="mt-2 text-caption text-foreground-muted">
                  Selected: {multiValue.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Async */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Async (AsyncCombobox)</Label>
              <span className="text-caption text-foreground-muted">
                — Load options from an API with debounced search
              </span>
            </div>
            <div className="max-w-md">
              <AsyncCombobox
                loadOptions={loadCandidates}
                value={asyncValue}
                onValueChange={setAsyncValue}
                placeholder="Search candidates..."
                debounceMs={300}
                minChars={1}
              />
              <p className="mt-2 text-caption text-foreground-muted">
                Type to search. Results are fetched from a simulated API.
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. WITH ICONS AND DESCRIPTIONS */}
      {/* ============================================ */}
      <ComponentCard
        id="icons-descriptions"
        title="With Icons and Descriptions"
        description="Options can include icons and secondary description text"
      >
        <CodePreview
          code={`const options = [
  {
    value: "solar",
    label: "Solar Energy",
    icon: <SunDim size={16} />,
    description: "Photovoltaic systems"
  },
  // ...
];

<Combobox options={options} />`}
        >
          <div className="max-w-md">
            <Combobox
              options={[
                {
                  value: "solar",
                  label: "Solar Energy",
                  icon: <SunDim size={16} />,
                  description: "Photovoltaic systems",
                },
                {
                  value: "wind",
                  label: "Wind Power",
                  icon: <Wind size={16} />,
                  description: "Onshore and offshore",
                },
                {
                  value: "hydro",
                  label: "Hydroelectric",
                  icon: <Drop size={16} />,
                  description: "Dam and run-of-river",
                },
                {
                  value: "geo",
                  label: "Geothermal",
                  icon: <Lightning size={16} />,
                  description: "Earth's heat",
                },
              ]}
              placeholder="Select energy type"
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. GROUPED OPTIONS */}
      {/* ============================================ */}
      <ComponentCard
        id="grouped"
        title="Grouped Options"
        description="Options can be organized into groups using the group property"
      >
        <CodePreview
          code={`const options = [
  { value: "solar", label: "Solar Energy", group: "Renewable Energy" },
  { value: "wind", label: "Wind Power", group: "Renewable Energy" },
  { value: "esg", label: "ESG Reporting", group: "Sustainability" },
  // ...
];

<Combobox options={options} />`}
        >
          <div className="max-w-md">
            <Combobox options={skillOptions} placeholder="Select a skill" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. STATES */}
      {/* ============================================ */}
      <ComponentCard id="states" title="States" description="Visual states for different scenarios">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Default</Label>
            <Combobox options={locationOptions} placeholder="Select location" />
            <p className="text-caption text-foreground-muted">Ready for input</p>
          </div>
          <div className="space-y-2">
            <Label>With Value</Label>
            <Combobox options={locationOptions} value="sf" placeholder="Select location" />
            <p className="text-caption text-foreground-muted">Has selection</p>
          </div>
          <div className="space-y-2">
            <Label>Loading</Label>
            <Combobox options={locationOptions} placeholder="Loading..." loading />
            <p className="text-caption text-foreground-muted">Fetching options</p>
          </div>
          <div className="space-y-2">
            <Label>Error</Label>
            <Combobox options={locationOptions} placeholder="Select location" error />
            <p className="text-caption text-foreground-muted">Validation failed</p>
          </div>
          <div className="space-y-2">
            <Label>Success</Label>
            <Combobox options={locationOptions} value="sf" placeholder="Select location" success />
            <p className="text-caption text-foreground-muted">Valid selection</p>
          </div>
          <div className="space-y-2">
            <Label>Disabled</Label>
            <Combobox options={locationOptions} placeholder="Select location" disabled />
            <p className="text-caption text-foreground-muted">Cannot interact</p>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. MULTI-SELECT WITH LIMIT */}
      {/* ============================================ */}
      <ComponentCard
        id="max-items"
        title="Multi-Select with Limit"
        description="Limit the number of items that can be selected"
      >
        <CodePreview
          code={`<MultiCombobox
  options={options}
  value={value}
  onValueChange={setValue}
  maxItems={3}
  placeholder="Select up to 3 skills"
/>`}
        >
          <div className="max-w-md">
            <MultiCombobox
              options={skillOptions}
              value={limitedValue}
              onValueChange={setLimitedValue}
              maxItems={3}
              placeholder="Select up to 3 skills"
            />
            <p className="mt-2 text-caption text-foreground-muted">
              Maximum 3 selections. The counter shows progress.
            </p>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. DISABLED OPTIONS */}
      {/* ============================================ */}
      <ComponentCard
        id="disabled-options"
        title="Disabled Options"
        description="Individual options can be disabled while keeping others selectable"
      >
        <div className="max-w-md">
          <Combobox options={departmentOptions} placeholder="Select department" />
          <p className="mt-2 text-caption text-foreground-muted">
            The &quot;Marketing&quot; option is disabled and cannot be selected.
          </p>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. PROPS TABLE */}
      {/* ============================================ */}
      <ComponentCard id="props" title="Props Reference">
        <div className="space-y-8">
          <div>
            <h4 className="mb-4 text-body-strong">Combobox Props</h4>
            <PropsTable props={comboboxProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">MultiCombobox Additional Props</h4>
            <PropsTable props={multiComboboxProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">AsyncCombobox Additional Props</h4>
            <PropsTable props={asyncComboboxProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ComboboxOption Interface</h4>
            <PropsTable props={optionProps} />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 11. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use Combobox for 5+ options where search helps users find items faster",
            "Provide meaningful placeholder text that describes what to search for",
            "Use descriptions to add context when labels alone aren't clear",
            "Group related options to help users scan large lists",
            "Show loading state during async operations",
            "Use error state with validation messages for required fields",
            "Set maxItems for multi-select when there's a logical limit",
          ]}
          donts={[
            "Don't use Combobox for 3-4 options (use Select instead)",
            "Don't mix grouped and ungrouped options in the same list",
            "Don't set maxItems unnecessarily - let users select all they need",
            "Don't use async search for small, static datasets",
            "Don't hide critical options deep in grouped lists",
            "Don't use vague placeholders like 'Select...'",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 12. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard**: Tab to focus, Arrow keys to navigate options, Enter to select, Escape to close",
            "**ARIA**: Uses role='combobox', aria-expanded, aria-haspopup='listbox' for proper screen reader support",
            "**aria-invalid**: Set to 'true' when error prop is true",
            "**Focus management**: Focus moves to search input when dropdown opens",
            "**Screen readers**: Announces option count, selected state, and group headings",
            "**Type-ahead**: Users can type to filter and jump to matching options",
            "**Clear button**: Accessible via keyboard with proper aria-label",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Select",
              href: "/design-system/components/select",
              description: "For smaller option sets without search",
            },
            {
              name: "Input",
              href: "/design-system/components/input",
              description: "For free-form text entry",
            },
            {
              name: "Chip",
              href: "/design-system/components/chip",
              description: "For displaying selected items",
            },
            {
              name: "Search Input",
              href: "/design-system/components/search-input",
              description: "For standalone search functionality",
            },
            {
              name: "Command",
              href: "/design-system/components/command",
              description: "For command palettes and complex search UIs",
            },
            {
              name: "Filter Panel",
              href: "/design-system/components/filter-panel",
              description: "For combined filter controls",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Job Posting Location Filter"
          description="Location selection with remote option in job posting form"
        >
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label className="mb-2 block">Job Location</Label>
                <Combobox
                  options={[
                    { value: "sf", label: "San Francisco, CA", icon: <MapPin size={16} /> },
                    { value: "nyc", label: "New York, NY", icon: <MapPin size={16} /> },
                    { value: "austin", label: "Austin, TX", icon: <MapPin size={16} /> },
                    {
                      value: "remote",
                      label: "Remote (US)",
                      icon: <Buildings size={16} />,
                      description: "Work from anywhere in the US",
                    },
                    {
                      value: "remote-global",
                      label: "Remote (Global)",
                      icon: <Buildings size={16} />,
                      description: "Work from anywhere",
                    },
                  ]}
                  placeholder="Select job location"
                />
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Skills Selection"
          description="Multi-select for tagging candidate skills during screening"
        >
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label className="mb-2 block">Candidate Skills</Label>
                <MultiCombobox options={skillOptions} placeholder="Add skills..." />
                <p className="mt-2 text-caption text-foreground-muted">
                  Search and select all relevant skills for this candidate.
                </p>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Search"
          description="Async combobox for searching candidates across the talent pool"
        >
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <Label className="mb-2 block">Find Candidate</Label>
                <AsyncCombobox
                  loadOptions={loadCandidates}
                  placeholder="Search by name or role..."
                  debounceMs={300}
                />
                <p className="mt-2 text-caption text-foreground-muted">
                  Start typing to search across your candidate database.
                </p>
              </div>
            </CardContent>
          </Card>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/combobox" />
    </div>
  );
}

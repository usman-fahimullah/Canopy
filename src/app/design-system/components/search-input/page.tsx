"use client";

import React from "react";
import {
  SearchInput,
  LocationInput,
  RecentlySearchedItem,
  RecentlySearchedDropdown,
  SearchBar,
  Label,
  Card,
  CardContent,
  Button,
} from "@/components/ui";
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

// ============================================
// PROPS DEFINITIONS
// ============================================

const searchInputProps = [
  {
    name: "placeholder",
    type: "string",
    default: '"Search by title, company name, etc."',
    description: "Placeholder text shown when input is empty",
  },
  {
    name: "value",
    type: "string",
    description: "Controlled input value",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "Default value for uncontrolled mode",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback fired when the input value changes",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Displays error state with red border and warning icon",
  },
  {
    name: "errorMessage",
    type: "string",
    description: "Error message displayed below the input when error is true",
  },
  {
    name: "size",
    type: '"default" | "compact"',
    default: '"default"',
    description: "Size variant - default (56px) or compact (48px) height",
  },
  {
    name: "containerClassName",
    type: "string",
    description: "Additional CSS class for the outer container",
  },
];

const locationInputProps = [
  {
    name: "placeholder",
    type: "string",
    default: '"City, state, or zip code"',
    description: "Placeholder text shown when input is empty",
  },
  {
    name: "value",
    type: "string",
    description: "Controlled input value",
  },
  {
    name: "defaultValue",
    type: "string",
    description: "Default value for uncontrolled mode",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback fired when the input value changes",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Displays error state with red border and warning icon",
  },
  {
    name: "errorMessage",
    type: "string",
    description: "Error message displayed below the input when error is true",
  },
  {
    name: "size",
    type: '"default" | "compact" | "full"',
    default: '"default"',
    description: "Size variant - default (218px width), compact (200px), or full (100% width)",
  },
  {
    name: "containerClassName",
    type: "string",
    description: "Additional CSS class for the outer container",
  },
];

const recentlySearchedItemProps = [
  {
    name: "text",
    type: "string",
    required: true,
    description: "The search term text to display",
  },
  {
    name: "onClick",
    type: "() => void",
    description: "Callback when the item is clicked",
  },
  {
    name: "onDelete",
    type: "() => void",
    description: "Callback when the delete button is clicked",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class for styling",
  },
];

const recentlySearchedDropdownProps = [
  {
    name: "items",
    type: "Array<{ id: string; text: string }>",
    required: true,
    description: "Array of recently searched items to display",
  },
  {
    name: "onItemClick",
    type: "(item: { id: string; text: string }) => void",
    description: "Callback when an item is clicked",
  },
  {
    name: "onItemDelete",
    type: "(item: { id: string; text: string }) => void",
    description: "Callback when an item's delete button is clicked",
  },
  {
    name: "maxItems",
    type: "1 | 2 | 3 | 4 | 5",
    default: "5",
    description: "Maximum number of items to display",
  },
  {
    name: "open",
    type: "boolean",
    default: "true",
    description: "Whether the dropdown is visible",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class for styling",
  },
];

const searchBarProps = [
  {
    name: "searchValue",
    type: "string",
    description: "Controlled search input value",
  },
  {
    name: "defaultSearchValue",
    type: "string",
    description: "Default value for uncontrolled search input",
  },
  {
    name: "onSearchChange",
    type: "(value: string) => void",
    description: "Callback when search value changes",
  },
  {
    name: "searchPlaceholder",
    type: "string",
    default: '"Search by title, company name, etc."',
    description: "Placeholder for the search input",
  },
  {
    name: "showLocation",
    type: "boolean",
    default: "true",
    description: "Whether to show the location input",
  },
  {
    name: "locationValue",
    type: "string",
    description: "Controlled location input value",
  },
  {
    name: "defaultLocationValue",
    type: "string",
    description: "Default value for uncontrolled location input",
  },
  {
    name: "onLocationChange",
    type: "(value: string) => void",
    description: "Callback when location value changes",
  },
  {
    name: "locationPlaceholder",
    type: "string",
    default: '"City, state, or zip code"',
    description: "Placeholder for the location input",
  },
  {
    name: "buttonText",
    type: "string",
    default: '"Search"',
    description: "Text displayed on the search button",
  },
  {
    name: "onSearch",
    type: "(search: string, location?: string) => void",
    description: "Callback when the search button is clicked or Enter is pressed",
  },
  {
    name: "recentSearches",
    type: "Array<{ id: string; text: string }>",
    description: "List of recently searched items for the dropdown",
  },
  {
    name: "showRecentSearches",
    type: "boolean",
    default: "false",
    description: "Whether to show the recently searched dropdown on focus",
  },
  {
    name: "onRecentSearchClick",
    type: "(item: { id: string; text: string }) => void",
    description: "Callback when a recent search item is clicked",
  },
  {
    name: "onRecentSearchDelete",
    type: "(item: { id: string; text: string }) => void",
    description: "Callback when a recent search item is deleted",
  },
  {
    name: "searchError",
    type: "boolean",
    default: "false",
    description: "Error state for the search input",
  },
  {
    name: "locationError",
    type: "boolean",
    default: "false",
    description: "Error state for the location input",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS class for the container",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function SearchInputPage() {
  // State for interactive examples
  const [controlledValue, setControlledValue] = React.useState("");
  const [recentSearches, setRecentSearches] = React.useState([
    { id: "1", text: "Climate Corp" },
    { id: "2", text: "Sustainability Manager" },
    { id: "3", text: "Solar Panel Installer" },
    { id: "4", text: "Environmental Consultant" },
    { id: "5", text: "Renewable Energy Analyst" },
  ]);

  const handleSearch = (search: string, location?: string) => {
    console.log("Search:", search, "Location:", location);
  };

  const handleDeleteRecent = (item: { id: string; text: string }) => {
    setRecentSearches((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="text-heading-lg text-foreground mb-2">
          Search Input
        </h1>
        <p className="text-body text-foreground-muted max-w-3xl">
          Search Input components provide specialized input fields for search functionality.
          This family includes the base SearchInput, LocationInput for location-based filtering,
          RecentlySearchedDropdown for search history, and the composite SearchBar that combines
          all elements into a complete search experience.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-background-brand-subtle text-foreground-brand rounded-full text-caption font-medium">
            Form Control
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Composable
          </span>
          <span className="px-3 py-1 bg-background-subtle text-foreground-muted rounded-full text-caption">
            Controlled & Uncontrolled
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* 2. ANATOMY */}
      {/* ============================================ */}
      <ComponentAnatomy
        parts={[
          {
            name: "Container",
            description: "The outer wrapper that handles layout and contains all child elements",
            required: true,
          },
          {
            name: "Search Icon",
            description: "Magnifying glass icon indicating search functionality (SearchInput only)",
            required: true,
          },
          {
            name: "Location Icon",
            description: "Map pin icon indicating location input (LocationInput only)",
            required: true,
          },
          {
            name: "Input Field",
            description: "The text input where users type their query",
            required: true,
          },
          {
            name: "Error Icon",
            description: "Warning octagon icon shown when error state is active",
          },
          {
            name: "Error Message",
            description: "Text below the input explaining the error",
          },
          {
            name: "Cursor Indicator",
            description: "Animated vertical line shown when focused without a value",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest implementation of SearchInput with default placeholder"
      >
        <CodePreview
          code={`import { SearchInput } from "@/components/ui";

<SearchInput placeholder="Search by title, company name, etc." />`}
        >
          <div className="w-full max-w-xl">
            <SearchInput placeholder="Search by title, company name, etc." />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. VARIANTS */}
      {/* ============================================ */}
      <ComponentCard
        id="variants"
        title="Component Variants"
        description="The search input family includes several specialized components"
      >
        <div className="space-y-8">
          {/* SearchBar - Full */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">SearchBar (Complete)</h4>
            <p className="text-caption text-foreground-muted">
              Full search bar with search input, location input, and search button
            </p>
            <CodePreview
              code={`<SearchBar
  searchPlaceholder="Search by title, company name, etc."
  showLocation={true}
  buttonText="Search"
  onSearch={(search, location) => console.log(search, location)}
/>`}
            >
              <SearchBar
                searchPlaceholder="Search by title, company name, etc."
                showLocation={true}
                buttonText="Search"
                onSearch={handleSearch}
              />
            </CodePreview>
          </div>

          {/* SearchBar - Search Only */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">SearchBar (Search Only)</h4>
            <p className="text-caption text-foreground-muted">
              Search bar without the location input for simpler use cases
            </p>
            <CodePreview
              code={`<SearchBar
  showLocation={false}
  buttonText="Search"
  onSearch={(search) => console.log(search)}
/>`}
            >
              <SearchBar
                showLocation={false}
                buttonText="Search"
                onSearch={handleSearch}
              />
            </CodePreview>
          </div>

          {/* Standalone Inputs */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">Standalone Inputs</h4>
            <p className="text-caption text-foreground-muted">
              SearchInput and LocationInput can be used independently
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label className="mb-2 block">Search Input</Label>
                <SearchInput placeholder="Search..." />
              </div>
              <div className="w-auto">
                <Label className="mb-2 block">Location Input</Label>
                <LocationInput placeholder="City, state..." />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. SIZES */}
      {/* ============================================ */}
      <ComponentCard
        id="sizes"
        title="Sizes"
        description="SearchInput and LocationInput support different size variants"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Default (56px height)</Label>
            <div className="flex gap-4 items-start">
              <SearchInput size="default" placeholder="Default size search..." />
              <LocationInput size="default" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Compact (48px height)</Label>
            <div className="flex gap-4 items-start">
              <SearchInput size="compact" placeholder="Compact size search..." />
              <LocationInput size="compact" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Location Input Full Width</Label>
            <LocationInput size="full" placeholder="Full width location input" />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="States"
        description="Visual states for different interaction scenarios"
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Default</Label>
              <SearchInput placeholder="Search by title, company name, etc." />
              <p className="text-caption text-foreground-muted">Neutral border, ready for input</p>
            </div>
            <div className="space-y-2">
              <Label>With Value (Typing)</Label>
              <SearchInput
                placeholder="Search by title, company name, etc."
                defaultValue="Climate Corp"
              />
              <p className="text-caption text-foreground-muted">Green border, text in green-800</p>
            </div>
            <div className="space-y-2">
              <Label>Error</Label>
              <SearchInput
                placeholder="Search by title, company name, etc."
                error
                errorMessage="Please enter a valid search term"
              />
              <p className="text-caption text-foreground-muted">Red border with warning icon</p>
            </div>
            <div className="space-y-2">
              <Label>Disabled</Label>
              <SearchInput
                placeholder="Search by title, company name, etc."
                disabled
              />
              <p className="text-caption text-foreground-muted">Reduced opacity, no interaction</p>
            </div>
          </div>

          <div className="border-t border-border-muted pt-6">
            <h4 className="text-body-strong text-foreground mb-4">Location Input States</h4>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Default</Label>
                <LocationInput placeholder="City, state, or zip code" size="full" />
              </div>
              <div className="space-y-2">
                <Label>With Value</Label>
                <LocationInput
                  placeholder="City, state, or zip code"
                  defaultValue="San Francisco, CA"
                  size="full"
                />
              </div>
              <div className="space-y-2">
                <Label>Error</Label>
                <LocationInput
                  placeholder="City, state, or zip code"
                  error
                  errorMessage="Please enter a valid location"
                  size="full"
                />
              </div>
              <div className="space-y-2">
                <Label>Disabled</Label>
                <LocationInput
                  placeholder="City, state, or zip code"
                  disabled
                  size="full"
                />
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. CONTROLLED USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="controlled"
        title="Controlled vs Uncontrolled"
        description="SearchInput supports both controlled and uncontrolled modes"
      >
        <div className="space-y-8">
          {/* Controlled Example */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">Controlled Mode</h4>
            <p className="text-caption text-foreground-muted">
              Use <code className="bg-background-muted px-1 rounded">value</code> and{" "}
              <code className="bg-background-muted px-1 rounded">onValueChange</code> for full control
            </p>
            <CodePreview
              code={`const [value, setValue] = React.useState("");

<SearchInput
  value={value}
  onValueChange={setValue}
  placeholder="Controlled input..."
/>
<p>Current value: {value}</p>`}
            >
              <div className="space-y-4">
                <SearchInput
                  value={controlledValue}
                  onValueChange={setControlledValue}
                  placeholder="Type to see controlled state..."
                />
                <p className="text-caption text-foreground-muted">
                  Current value: <strong>{controlledValue || "(empty)"}</strong>
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setControlledValue("")}
                >
                  Clear Value
                </Button>
              </div>
            </CodePreview>
          </div>

          {/* Uncontrolled Example */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">Uncontrolled Mode</h4>
            <p className="text-caption text-foreground-muted">
              Use <code className="bg-background-muted px-1 rounded">defaultValue</code> and let the component manage state internally
            </p>
            <CodePreview
              code={`<SearchInput
  defaultValue="Initial search"
  onValueChange={(value) => console.log("Changed:", value)}
  placeholder="Uncontrolled input..."
/>`}
            >
              <SearchInput
                defaultValue="Initial search"
                onValueChange={(value) => console.log("Changed:", value)}
                placeholder="Uncontrolled input..."
              />
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. RECENTLY SEARCHED */}
      {/* ============================================ */}
      <ComponentCard
        id="recently-searched"
        title="Recently Searched"
        description="Components for displaying and managing search history"
      >
        <div className="space-y-8">
          {/* Recently Searched Item */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">RecentlySearchedItem</h4>
            <p className="text-caption text-foreground-muted">
              Individual item with click and delete actions
            </p>
            <CodePreview
              code={`<RecentlySearchedItem
  text="Climate Corp"
  onClick={() => console.log('clicked')}
  onDelete={() => console.log('deleted')}
/>`}
            >
              <div className="w-full max-w-md border border-border-muted rounded-xl">
                <RecentlySearchedItem
                  text="Climate Corp"
                  onClick={() => console.log("Item clicked")}
                  onDelete={() => console.log("Item deleted")}
                />
              </div>
            </CodePreview>
          </div>

          {/* Recently Searched Dropdown */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">RecentlySearchedDropdown</h4>
            <p className="text-caption text-foreground-muted">
              Dropdown list showing multiple recent searches
            </p>
            <CodePreview
              code={`<RecentlySearchedDropdown
  items={[
    { id: "1", text: "Climate Corp" },
    { id: "2", text: "Sustainability Manager" },
    { id: "3", text: "Solar Panel Installer" },
  ]}
  onItemClick={(item) => console.log("Selected:", item)}
  onItemDelete={(item) => console.log("Deleted:", item)}
  maxItems={5}
/>`}
            >
              <div className="w-full max-w-xl">
                <RecentlySearchedDropdown
                  items={recentSearches}
                  onItemClick={(item) => console.log("Selected:", item)}
                  onItemDelete={handleDeleteRecent}
                  maxItems={5}
                />
              </div>
            </CodePreview>
          </div>

          {/* SearchBar with Recent Searches */}
          <div className="space-y-3">
            <h4 className="text-body-strong text-foreground">SearchBar with Recent Searches</h4>
            <p className="text-caption text-foreground-muted">
              Click on the search input to see the recent searches dropdown
            </p>
            <CodePreview
              code={`<SearchBar
  showRecentSearches={true}
  recentSearches={[
    { id: "1", text: "Climate Corp" },
    { id: "2", text: "Sustainability Manager" },
  ]}
  onRecentSearchClick={(item) => console.log("Selected:", item)}
  onRecentSearchDelete={(item) => console.log("Deleted:", item)}
  onSearch={(search, location) => console.log(search, location)}
/>`}
            >
              <div className="w-full">
                <SearchBar
                  searchPlaceholder="Click to see recent searches..."
                  showLocation={true}
                  buttonText="Search"
                  onSearch={handleSearch}
                  showRecentSearches={true}
                  recentSearches={recentSearches}
                  onRecentSearchClick={(item) => {
                    console.log("Selected:", item);
                  }}
                  onRecentSearchDelete={handleDeleteRecent}
                />
              </div>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. PROPS TABLES */}
      {/* ============================================ */}
      <div id="props" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Props Reference</h2>

        <ComponentCard title="SearchInput Props">
          <PropsTable props={searchInputProps} />
        </ComponentCard>

        <ComponentCard title="LocationInput Props">
          <PropsTable props={locationInputProps} />
        </ComponentCard>

        <ComponentCard title="RecentlySearchedItem Props">
          <PropsTable props={recentlySearchedItemProps} />
        </ComponentCard>

        <ComponentCard title="RecentlySearchedDropdown Props">
          <PropsTable props={recentlySearchedDropdownProps} />
        </ComponentCard>

        <ComponentCard title="SearchBar Props">
          <PropsTable props={searchBarProps} />
        </ComponentCard>
      </div>

      {/* ============================================ */}
      {/* 10. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="text-heading-sm text-foreground mb-4">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Use SearchBar for main search functionality on job boards and candidate search",
            "Show recently searched items to help users quickly repeat searches",
            "Provide clear, descriptive placeholder text indicating what can be searched",
            "Allow users to clear individual recent searches with the delete button",
            "Use LocationInput when location-based filtering adds value to the search",
            "Debounce search callbacks to prevent excessive API calls on every keystroke",
            "Show loading states when search results are being fetched",
          ]}
          donts={[
            "Don't hide the search icon - it's a key affordance for users",
            "Don't use SearchInput for general text input (use the Input component instead)",
            "Don't show more than 5 recent searches - keep the list manageable",
            "Don't trigger search automatically without user action or clear feedback",
            "Don't remove the search button in favor of auto-search without careful consideration",
            "Don't use error states for empty searches - only for validation failures",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 11. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "All inputs include appropriate role and aria attributes for screen readers",
            "The search input uses type=\"text\" with proper labeling for assistive technology",
            "Delete buttons include descriptive aria-label (e.g., 'Remove \"Climate Corp\" from recent searches')",
            "Focus states are clearly visible with high-contrast green/red borders",
            "Error messages are associated with inputs for screen reader announcements",
            "Keyboard navigation: Tab through inputs, Enter to submit search",
            "The cursor indicator animation respects prefers-reduced-motion media query",
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
              name: "Input",
              href: "/design-system/components/input",
              description: "Basic text input for general form fields",
            },
            {
              name: "Combobox",
              href: "/design-system/components/combobox",
              description: "Autocomplete input with dropdown suggestions",
            },
            {
              name: "Filter Panel",
              href: "/design-system/components/filter-panel",
              description: "Advanced filtering UI for search results",
            },
            {
              name: "Command",
              href: "/design-system/components/command",
              description: "Command palette for keyboard-driven search",
            },
            {
              name: "Dropdown Menu",
              href: "/design-system/components/dropdown-menu",
              description: "Menu component used in recent searches",
            },
            {
              name: "Button",
              href: "/design-system/components/buttons",
              description: "Action buttons used alongside search inputs",
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
          title="Job Search Page Header"
          description="How SearchBar appears on the main jobs page of the ATS"
        >
          <Card className="overflow-hidden">
            <div className="bg-background-brand p-8">
              <h2 className="text-heading-md text-foreground-on-emphasis mb-2">
                Find Climate Jobs
              </h2>
              <p className="text-body text-foreground-on-emphasis/80 mb-6">
                Discover opportunities in renewable energy, sustainability, and environmental sectors
              </p>
              <SearchBar
                searchPlaceholder="Job title, company, or keywords"
                locationPlaceholder="Location"
                showLocation={true}
                buttonText="Search Jobs"
                onSearch={handleSearch}
                showRecentSearches={true}
                recentSearches={recentSearches.slice(0, 3)}
                onRecentSearchClick={(item) => console.log(item)}
                onRecentSearchDelete={handleDeleteRecent}
              />
            </div>
            <CardContent className="pt-4">
              <p className="text-caption text-foreground-muted">
                1,234 jobs found • Showing results for all locations
              </p>
            </CardContent>
          </Card>
        </RealWorldExample>

        <RealWorldExample
          title="Candidate Search in ATS Dashboard"
          description="Search for candidates within the applicant tracking system"
        >
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-body-strong text-foreground">Candidates</h3>
              <Button variant="primary" size="sm">
                Add Candidate
              </Button>
            </div>
            <SearchBar
              searchPlaceholder="Search candidates by name, email, or skills..."
              showLocation={false}
              buttonText="Search"
              onSearch={handleSearch}
            />
            <div className="mt-4 text-caption text-foreground-muted">
              Showing 156 candidates • 12 new this week
            </div>
          </div>
        </RealWorldExample>

        <RealWorldExample
          title="Compact Search in Navigation"
          description="Compact search input used in a toolbar or navigation bar"
        >
          <div className="bg-surface rounded-xl border border-border p-4 flex items-center gap-4">
            <span className="text-body-strong text-foreground">Dashboard</span>
            <div className="flex-1 max-w-md">
              <SearchInput size="compact" placeholder="Quick search..." />
            </div>
            <Button variant="ghost" size="icon-sm">
              <span className="sr-only">Settings</span>
              ⚙️
            </Button>
          </div>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/search-input" />
    </div>
  );
}

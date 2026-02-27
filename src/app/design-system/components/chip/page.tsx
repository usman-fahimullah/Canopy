"use client";

import React from "react";
import {
  Chip,
  ChipGroup,
  ChipMore,
  AddChipButton,
  InfoTag,
  CategoryTag,
  PathwayTag,
  Label,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  Lightning,
  Tree,
  Carrot,
  Buildings,
  Car,
  Drop,
  Atom,
  Palette,
  GraduationCap,
  Briefcase,
  Tag,
  Star,
  Heart,
} from "@phosphor-icons/react";

/* ============================================
   PROPS DOCUMENTATION
   ============================================ */

const chipProps = [
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Chip content/label",
  },
  {
    name: "variant",
    type: '"neutral" | "primary" | "blue" | "red" | "orange" | "yellow" | "purple"',
    default: '"neutral"',
    description: "Color variant",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Size of the chip (28px, 32px, 40px height)",
  },
  {
    name: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Optional icon displayed before the label",
  },
  {
    name: "removable",
    type: "boolean",
    default: "false",
    description: "Shows X button to remove the chip",
  },
  {
    name: "onRemove",
    type: "() => void",
    default: "undefined",
    description: "Called when remove button is clicked",
  },
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Selected state (for filter chips) - uses green background",
  },
  {
    name: "onClick",
    type: "() => void",
    default: "undefined",
    description: "Click handler - makes chip interactive/clickable",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the chip",
  },
];

const chipGroupProps = [
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Chip elements to display",
  },
  {
    name: "label",
    type: "string",
    default: "undefined",
    description: "Optional label above the chip group",
  },
  {
    name: "maxVisible",
    type: "number",
    default: "undefined",
    description: "Maximum chips to show before truncating with +N",
  },
  {
    name: "onShowMore",
    type: "() => void",
    default: "undefined",
    description: "Called when +N more chip is clicked",
  },
  {
    name: "gap",
    type: "1 | 1.5 | 2 | 3",
    default: "2",
    description: "Gap between chips (4px, 6px, 8px, 12px)",
  },
];

const infoTagProps = [
  {
    name: "children",
    type: "ReactNode",
    required: true,
    description: "Tag content",
  },
  {
    name: "removable",
    type: "boolean",
    default: "false",
    description: "Shows close button",
  },
  {
    name: "onRemove",
    type: "() => void",
    default: "undefined",
    description: "Called when close button is clicked",
  },
  {
    name: "transparent",
    type: "boolean",
    default: "false",
    description: "Transparent background with backdrop blur (for image overlays)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the tag",
  },
];

const categoryTagProps = [
  {
    name: "category",
    type: "JobCategoryType",
    default: "undefined",
    description: "Predefined job category (provides default label)",
  },
  {
    name: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Phosphor icon element (18px, fill weight)",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "undefined",
    description: "Custom label (overrides category default)",
  },
  {
    name: "variant",
    type: '"mini" | "full" | "truncate"',
    default: '"full"',
    description: "Display variant: icon only, icon + text, or truncated text",
  },
  {
    name: "maxWidth",
    type: "number",
    default: "100",
    description: "Max width in pixels when truncated",
  },
];

const pathwayTagProps = [
  {
    name: "pathway",
    type: "PathwayType",
    required: true,
    description: "Pathway type determines the color (agriculture, energy, etc.)",
  },
  {
    name: "icon",
    type: "ReactNode",
    default: "undefined",
    description: "Phosphor icon element (20px, fill weight)",
  },
  {
    name: "children",
    type: "ReactNode",
    default: "undefined",
    description: "Custom label (overrides pathway default)",
  },
  {
    name: "minimized",
    type: "boolean",
    default: "false",
    description: "Show only icon (hides label)",
  },
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Selected state - adds border and lighter background",
  },
  {
    name: "onClick",
    type: "() => void",
    default: "undefined",
    description: "Click handler - makes tag interactive",
  },
];

/* ============================================
   PAGE COMPONENT
   ============================================ */

export default function ChipPage() {
  const [skills, setSkills] = React.useState(["React", "TypeScript", "Node.js"]);
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>(["Remote"]);
  const [selectedPathways, setSelectedPathways] = React.useState<string[]>(["energy"]);

  const addSkill = () => {
    const newSkill = `Skill ${skills.length + 1}`;
    setSkills([...skills, newSkill]);
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const togglePathway = (pathway: string) => {
    setSelectedPathways((prev) =>
      prev.includes(pathway) ? prev.filter((p) => p !== pathway) : [...prev, pathway]
    );
  };

  return (
    <div className="space-y-12">
      {/* ============================================
          OVERVIEW
          ============================================ */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Chip
        </h1>
        <p className="mb-6 max-w-2xl text-body text-foreground-muted">
          Chips are compact elements that represent an input, attribute, or action. They allow users
          to filter content, make selections, or display tags. The chip system includes several
          specialized variants for different use cases.
        </p>

        {/* Component Family Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">Chip</h3>
            <p className="text-sm text-foreground-muted">
              Interactive, removable chips for tags, filters, and selections.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">InfoTag</h3>
            <p className="text-sm text-foreground-muted">
              Simple tags with cream background for displaying metadata.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">CategoryTag</h3>
            <p className="text-sm text-foreground-muted">
              Job category tags with icons for the ATS domain.
            </p>
          </div>
          <div className="rounded-lg bg-[var(--background-subtle)] p-4">
            <h3 className="mb-2 font-semibold text-foreground">PathwayTag</h3>
            <p className="text-sm text-foreground-muted">
              Colorful pathway tags for climate industry taxonomy.
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          BASIC USAGE
          ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple chip display with ChipGroup container"
      >
        <CodePreview
          code={`import { Chip, ChipGroup } from "@/components/ui";

<ChipGroup>
  <Chip>React</Chip>
  <Chip>TypeScript</Chip>
  <Chip>Node.js</Chip>
</ChipGroup>`}
        >
          <ChipGroup>
            <Chip>React</Chip>
            <Chip>TypeScript</Chip>
            <Chip>Node.js</Chip>
          </ChipGroup>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          VARIANTS
          ============================================ */}
      <ComponentCard
        id="variants"
        title="Color Variants"
        description="All available color variants"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Chip variant="neutral">Neutral</Chip>
            <Chip variant="primary">Primary</Chip>
            <Chip variant="blue">Blue</Chip>
            <Chip variant="red">Red</Chip>
            <Chip variant="orange">Orange</Chip>
            <Chip variant="yellow">Yellow</Chip>
            <Chip variant="purple">Purple</Chip>
          </div>
          <p className="text-caption text-foreground-muted">
            Use semantic variants: primary for brand-related, blue for info, red for
            errors/warnings, etc.
          </p>
        </div>
      </ComponentCard>

      {/* ============================================
          SIZES
          ============================================ */}
      <ComponentCard id="sizes" title="Sizes" description="Three size options">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-caption">Small (28px)</Label>
            <Chip size="sm">Small</Chip>
          </div>
          <div className="space-y-1">
            <Label className="text-caption">Medium (32px)</Label>
            <Chip size="md">Medium</Chip>
          </div>
          <div className="space-y-1">
            <Label className="text-caption">Large (40px)</Label>
            <Chip size="lg">Large</Chip>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          WITH ICONS
          ============================================ */}
      <ComponentCard
        id="with-icons"
        title="With Icons"
        description="Chips can include a leading icon"
      >
        <CodePreview
          code={`import { Star, Heart, Tag } from "@phosphor-icons/react";

<ChipGroup>
  <Chip icon={<Star />} variant="yellow">Featured</Chip>
  <Chip icon={<Heart />} variant="red">Favorite</Chip>
  <Chip icon={<Tag />} variant="blue">Tagged</Chip>
</ChipGroup>`}
        >
          <ChipGroup>
            <Chip icon={<Star />} variant="yellow">
              Featured
            </Chip>
            <Chip icon={<Heart />} variant="red">
              Favorite
            </Chip>
            <Chip icon={<Tag />} variant="blue">
              Tagged
            </Chip>
          </ChipGroup>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          REMOVABLE CHIPS
          ============================================ */}
      <ComponentCard
        id="removable"
        title="Removable Chips"
        description="Chips that can be removed by the user"
      >
        <CodePreview
          code={`const [skills, setSkills] = React.useState(["React", "TypeScript"]);

<ChipGroup label="Skills">
  {skills.map((skill) => (
    <Chip
      key={skill}
      removable
      onRemove={() => setSkills(skills.filter(s => s !== skill))}
    >
      {skill}
    </Chip>
  ))}
  <AddChipButton onClick={addSkill} />
</ChipGroup>`}
        >
          <div className="space-y-2">
            <Label className="block">Skills</Label>
            <ChipGroup>
              {skills.map((skill) => (
                <Chip key={skill} removable onRemove={() => removeSkill(skill)}>
                  {skill}
                </Chip>
              ))}
              <AddChipButton onClick={addSkill} />
            </ChipGroup>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          FILTER CHIPS (SELECTABLE)
          ============================================ */}
      <ComponentCard
        id="filter-chips"
        title="Filter Chips (Selectable)"
        description="Interactive chips for filtering with built-in selected state"
      >
        <CodePreview
          code={`const [selected, setSelected] = React.useState(["Remote"]);

const toggleFilter = (filter: string) => {
  setSelected(prev =>
    prev.includes(filter)
      ? prev.filter(f => f !== filter)
      : [...prev, filter]
  );
};

<ChipGroup label="Filter by location">
  {["Remote", "Hybrid", "On-site", "Flexible"].map((filter) => (
    <Chip
      key={filter}
      selected={selected.includes(filter)}
      onClick={() => toggleFilter(filter)}
    >
      {filter}
    </Chip>
  ))}
</ChipGroup>`}
        >
          <div className="space-y-4">
            <Label className="block">Filter by location</Label>
            <ChipGroup>
              {["Remote", "Hybrid", "On-site", "Flexible"].map((filter) => (
                <Chip
                  key={filter}
                  selected={selectedFilters.includes(filter)}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Chip>
              ))}
            </ChipGroup>
            {selectedFilters.length > 0 && (
              <p className="text-caption text-foreground-muted">
                Active filters: {selectedFilters.join(", ")}
              </p>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          CHIP GROUP WITH TRUNCATION
          ============================================ */}
      <ComponentCard
        id="truncation"
        title="ChipGroup with Truncation"
        description="Limit visible chips with maxVisible prop"
      >
        <CodePreview
          code={`<ChipGroup
  label="Technologies"
  maxVisible={3}
  onShowMore={() => alert("Show all clicked!")}
>
  <Chip>React</Chip>
  <Chip>TypeScript</Chip>
  <Chip>Node.js</Chip>
  <Chip>Python</Chip>
  <Chip>Go</Chip>
  <Chip>Rust</Chip>
</ChipGroup>`}
        >
          <ChipGroup
            label="Technologies"
            maxVisible={3}
            onShowMore={() => alert("Show all clicked!")}
          >
            <Chip>React</Chip>
            <Chip>TypeScript</Chip>
            <Chip>Node.js</Chip>
            <Chip>Python</Chip>
            <Chip>Go</Chip>
            <Chip>Rust</Chip>
          </ChipGroup>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          STATES
          ============================================ */}
      <ComponentCard id="states" title="States" description="Interactive states">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <Label className="block text-caption">Default</Label>
              <Chip>Default</Chip>
            </div>
            <div className="space-y-1">
              <Label className="block text-caption">Selected</Label>
              <Chip selected>Selected</Chip>
            </div>
            <div className="space-y-1">
              <Label className="block text-caption">Disabled</Label>
              <Chip disabled>Disabled</Chip>
            </div>
            <div className="space-y-1">
              <Label className="block text-caption">Removable</Label>
              <Chip removable onRemove={() => {}}>
                Removable
              </Chip>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================
          INFO TAG
          ============================================ */}
      <ComponentCard
        id="info-tags"
        title="InfoTag"
        description="Simple tags with cream background for metadata display"
      >
        <CodePreview
          code={`import { InfoTag } from "@/components/ui";

{/* Basic */}
<InfoTag>Remote</InfoTag>
<InfoTag>Full-time</InfoTag>

{/* Removable */}
<InfoTag removable onRemove={() => {}}>
  Dismissible
</InfoTag>

{/* Transparent (for image overlays) */}
<InfoTag transparent>
  Overlay text
</InfoTag>`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <InfoTag>Remote</InfoTag>
              <InfoTag>Full-time</InfoTag>
              <InfoTag>$80k - $120k</InfoTag>
              <InfoTag>5+ years</InfoTag>
            </div>
            <div className="flex flex-wrap gap-2">
              <InfoTag removable onRemove={() => {}}>
                Dismissible
              </InfoTag>
            </div>
            <div className="relative rounded-lg bg-gradient-to-r from-[var(--primitive-green-600)] to-[var(--primitive-blue-600)] p-4">
              <InfoTag transparent>Overlay on image</InfoTag>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          CATEGORY TAG
          ============================================ */}
      <ComponentCard
        id="category-tags"
        title="CategoryTag"
        description="Job category tags with icons (ATS domain)"
      >
        <CodePreview
          code={`import { CategoryTag } from "@/components/ui";
import { Briefcase, GraduationCap, Palette } from "@phosphor-icons/react";

{/* Full size with icon */}
<CategoryTag icon={<Briefcase />}>Software Engineering</CategoryTag>

{/* Mini variant (icon only) */}
<CategoryTag icon={<GraduationCap />} variant="mini" />

{/* Truncated text */}
<CategoryTag icon={<Palette />} variant="truncate" maxWidth={120}>
  Marketing & Design
</CategoryTag>`}
        >
          <div className="space-y-4">
            <Label className="block">Full size</Label>
            <div className="flex flex-wrap gap-2">
              <CategoryTag icon={<Briefcase />}>Software Engineering</CategoryTag>
              <CategoryTag icon={<GraduationCap />}>Education</CategoryTag>
              <CategoryTag icon={<Palette />}>Marketing & Design</CategoryTag>
            </div>

            <Label className="block">Mini variant (icon only)</Label>
            <div className="flex flex-wrap gap-2">
              <CategoryTag icon={<Briefcase />} variant="mini" />
              <CategoryTag icon={<GraduationCap />} variant="mini" />
              <CategoryTag icon={<Palette />} variant="mini" />
            </div>

            <Label className="block">Truncated</Label>
            <div className="flex flex-wrap gap-2">
              <CategoryTag icon={<Briefcase />} variant="truncate" maxWidth={150}>
                Operations, Program/Project Management & Strategy
              </CategoryTag>
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          PATHWAY TAG
          ============================================ */}
      <ComponentCard
        id="pathway-tags"
        title="PathwayTag"
        description="Colorful pathway tags for climate industry taxonomy"
      >
        <CodePreview
          code={`import { PathwayTag } from "@/components/ui";
import { Lightning, Tree, Drop } from "@phosphor-icons/react";

{/* With default labels */}
<PathwayTag pathway="energy" icon={<Lightning />} />
<PathwayTag pathway="forestry" icon={<Tree />} />
<PathwayTag pathway="water" icon={<Drop />} />

{/* Minimized (icon only) */}
<PathwayTag pathway="energy" icon={<Lightning />} minimized />

{/* Selected state */}
<PathwayTag pathway="energy" icon={<Lightning />} selected />

{/* Interactive */}
<PathwayTag
  pathway="energy"
  icon={<Lightning />}
  selected={isSelected}
  onClick={() => toggle()}
/>`}
        >
          <div className="space-y-4">
            <Label className="block">All pathways by color family</Label>

            {/* GREEN family */}
            <div className="space-y-1">
              <span className="text-caption text-foreground-muted">Green</span>
              <div className="flex flex-wrap gap-2">
                <PathwayTag pathway="agriculture" icon={<Carrot />} />
                <PathwayTag pathway="forestry" icon={<Tree />} />
                <PathwayTag pathway="transportation" icon={<Car />} />
              </div>
            </div>

            {/* BLUE family */}
            <div className="space-y-1">
              <span className="text-caption text-foreground-muted">Blue</span>
              <div className="flex flex-wrap gap-2">
                <PathwayTag pathway="conservation" icon={<Tree />} />
                <PathwayTag pathway="water" icon={<Drop />} />
                <PathwayTag pathway="research" icon={<Atom />} />
              </div>
            </div>

            {/* YELLOW family */}
            <div className="space-y-1">
              <span className="text-caption text-foreground-muted">Yellow</span>
              <div className="flex flex-wrap gap-2">
                <PathwayTag pathway="energy" icon={<Lightning />} />
                <PathwayTag pathway="technology" icon={<Atom />} />
              </div>
            </div>

            {/* ORANGE family */}
            <div className="space-y-1">
              <span className="text-caption text-foreground-muted">Orange</span>
              <div className="flex flex-wrap gap-2">
                <PathwayTag pathway="construction" icon={<Buildings />} />
                <PathwayTag pathway="manufacturing" icon={<Buildings />} />
              </div>
            </div>

            {/* PURPLE family */}
            <div className="space-y-1">
              <span className="text-caption text-foreground-muted">Purple</span>
              <div className="flex flex-wrap gap-2">
                <PathwayTag pathway="arts-culture" icon={<Palette />} />
                <PathwayTag pathway="media" icon={<Palette />} />
                <PathwayTag pathway="policy" icon={<Buildings />} />
              </div>
            </div>

            <Label className="mt-6 block">Interactive pathway selection</Label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { pathway: "energy", icon: <Lightning /> },
                  { pathway: "agriculture", icon: <Carrot /> },
                  { pathway: "water", icon: <Drop /> },
                  { pathway: "construction", icon: <Buildings /> },
                ] as const
              ).map(({ pathway, icon }) => (
                <PathwayTag
                  key={pathway}
                  pathway={pathway}
                  icon={icon}
                  selected={selectedPathways.includes(pathway)}
                  onClick={() => togglePathway(pathway)}
                />
              ))}
            </div>
            {selectedPathways.length > 0 && (
              <p className="text-caption text-foreground-muted">
                Selected: {selectedPathways.join(", ")}
              </p>
            )}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* ============================================
          PROPS TABLES
          ============================================ */}
      <ComponentCard id="chip-props" title="Chip Props">
        <PropsTable props={chipProps} />
      </ComponentCard>

      <ComponentCard id="chip-group-props" title="ChipGroup Props">
        <PropsTable props={chipGroupProps} />
      </ComponentCard>

      <ComponentCard id="info-tag-props" title="InfoTag Props">
        <PropsTable props={infoTagProps} />
      </ComponentCard>

      <ComponentCard id="category-tag-props" title="CategoryTag Props">
        <PropsTable props={categoryTagProps} />
      </ComponentCard>

      <ComponentCard id="pathway-tag-props" title="PathwayTag Props">
        <PropsTable props={pathwayTagProps} />
      </ComponentCard>

      {/* ============================================
          USAGE GUIDELINES
          ============================================ */}
      <UsageGuide
        dos={[
          "Use Chip for user-editable tags and filter selections",
          "Use InfoTag for displaying static metadata (job details, stats)",
          "Use CategoryTag for job categories with recognizable icons",
          "Use PathwayTag for climate industry pathway taxonomy",
          "Keep chip text concise (1-3 words)",
          "Use the selected prop for filter chips instead of wrapping in buttons",
          "Group related chips together with ChipGroup",
        ]}
        donts={[
          "Don't use chips for primary actions (use Buttons instead)",
          "Don't use chips for navigation",
          "Don't display too many chips at once (use maxVisible for truncation)",
          "Don't mix different chip types in the same visual group",
          "Don't use removable chips for system-generated content",
        ]}
      />

      {/* ============================================
          ACCESSIBILITY
          ============================================ */}
      <AccessibilityInfo
        items={[
          "**Keyboard**: Focusable with Tab. Removable chips respond to Delete/Backspace. Clickable chips respond to Enter/Space.",
          "**Focus indicator**: Visible focus ring using blue-500",
          "**ARIA**: Uses `role='button'` for clickable chips, `role='listitem'` for static chips. `aria-selected` for filter chips.",
          "**Screen readers**: Remove button has `aria-label` describing which chip will be removed",
          "**Color contrast**: All chip variants meet WCAG AA contrast requirements",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/chip" />
    </div>
  );
}

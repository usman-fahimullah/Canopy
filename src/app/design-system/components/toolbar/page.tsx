"use client";

import React from "react";
import {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarMultiToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarLabel,
  ToolbarActions,
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
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  TextAlignLeft,
  TextAlignCenter,
  TextAlignRight,
  TextAlignJustify,
  ListBullets,
  ListNumbers,
  Link,
  Image as ImageIcon,
  Code,
  Quotes,
  Table,
  ArrowCounterClockwise,
  ArrowClockwise,
  Copy,
  Scissors,
  ClipboardText,
  Eraser,
  Eye,
  FloppyDisk,
  Printer,
  Share,
  DotsThree,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";

// ============================================
// PROPS DEFINITIONS
// ============================================

const toolbarProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Toolbar content including sections, groups, and buttons.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Layout direction of the toolbar.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables all buttons within the toolbar.",
  },
  {
    name: "aria-label",
    type: "string",
    default: '"Formatting toolbar"',
    description: "Accessible label for the toolbar.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes.",
  },
];

const toolbarButtonProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Button content, typically an icon.",
  },
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Whether the button is in a selected/active state.",
  },
  {
    name: "grouped",
    type: "boolean",
    default: "false",
    description: "Whether the button is inside a grouped container (affects styling).",
  },
  {
    name: "tooltip",
    type: "string",
    description: "Tooltip text shown on hover.",
  },
  {
    name: "shortcut",
    type: "string",
    description: "Keyboard shortcut displayed in the tooltip.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a loading spinner in place of the icon.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the button.",
  },
];

const toolbarToggleGroupProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Toggle items within the group.",
  },
  {
    name: "value",
    type: "string",
    description: "Currently selected value (single-select).",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    description: "Callback when selection changes.",
  },
  {
    name: "allowDeselect",
    type: "boolean",
    default: "false",
    description: "Allow deselecting by clicking the selected item again.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible label for the group.",
  },
];

const toolbarMultiToggleGroupProps = [
  {
    name: "children",
    type: "ReactNode",
    description: "Toggle items within the group.",
  },
  {
    name: "values",
    type: "string[]",
    default: "[]",
    description: "Array of currently selected values.",
  },
  {
    name: "onValuesChange",
    type: "(values: string[]) => void",
    description: "Callback when selections change.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Accessible label for the group.",
  },
];

const toolbarToggleItemProps = [
  {
    name: "value",
    type: "string",
    description: "Unique value for this toggle item. Required.",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Item content, typically an icon.",
  },
  {
    name: "tooltip",
    type: "string",
    description: "Tooltip text shown on hover.",
  },
  {
    name: "shortcut",
    type: "string",
    description: "Keyboard shortcut displayed in the tooltip.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Disables this toggle item.",
  },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function ToolbarPage() {
  // State for interactive examples
  const [alignment, setAlignment] = React.useState("left");
  const [listType, setListType] = React.useState("");
  const [formatStyles, setFormatStyles] = React.useState<string[]>(["bold"]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="space-y-12">
      {/* ============================================ */}
      {/* 1. OVERVIEW */}
      {/* ============================================ */}
      <div id="overview">
        <h1 className="mb-2 text-heading-lg text-foreground">Toolbar</h1>
        <p className="max-w-3xl text-body text-foreground-muted">
          Toolbar provides a container for grouping related actions and controls. It&apos;s commonly
          used in editors, forms, and content management interfaces where users need quick access to
          formatting options and actions.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-background-brand-subtle px-3 py-1 text-caption font-medium text-foreground-brand">
            Interactive
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Composable
          </span>
          <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-foreground-muted">
            Keyboard Navigable
          </span>
        </div>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border-success bg-background-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Rich text editor formatting controls</li>
              <li>• Image/document editing tools</li>
              <li>• Table/spreadsheet controls</li>
              <li>• Form builder action buttons</li>
              <li>• Any interface with grouped related actions</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border-error bg-background-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Main navigation (use Navigation instead)</li>
              <li>• Form submission buttons (use Button)</li>
              <li>• Single actions (use standalone Button)</li>
              <li>• Tab switching (use Tabs component)</li>
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
            name: "Toolbar Container",
            description:
              "The root element with white background, rounded corners (16px), and subtle shadow.",
            required: true,
          },
          {
            name: "Section",
            description: "Logical grouping of related toolbar content with consistent spacing.",
          },
          {
            name: "Group (Plain)",
            description: "Groups related buttons with gap spacing, no background.",
          },
          {
            name: "Group (Grouped)",
            description:
              "Groups buttons inside a neutral-100 background container with rounded corners.",
          },
          {
            name: "Button",
            description: "Individual clickable action with icon. Can be selected or unselected.",
            required: true,
          },
          {
            name: "Toggle Group",
            description:
              "Mutually exclusive options where only one can be selected (like radio buttons).",
          },
          {
            name: "Multi Toggle Group",
            description: "Multiple options can be selected simultaneously (like checkboxes).",
          },
          {
            name: "Separator",
            description: "Visual divider between groups or sections.",
          },
          {
            name: "Spacer",
            description: "Flexible space that pushes content to the edges.",
          },
          {
            name: "Actions",
            description: "Right-aligned container for primary actions like Save.",
          },
        ]}
      />

      {/* ============================================ */}
      {/* 3. BASIC USAGE */}
      {/* ============================================ */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A simple toolbar with standalone buttons"
      >
        <CodePreview
          code={`import {
  Toolbar,
  ToolbarButton
} from "@/components/ui";

<Toolbar aria-label="Document actions">
  <ToolbarButton tooltip="Undo" shortcut="Ctrl+Z">
    <ArrowCounterClockwise weight="bold" />
  </ToolbarButton>
  <ToolbarButton tooltip="Redo" shortcut="Ctrl+Y">
    <ArrowClockwise weight="bold" />
  </ToolbarButton>
</Toolbar>`}
        >
          <Toolbar aria-label="Document actions">
            <ToolbarButton tooltip="Undo" shortcut="Ctrl+Z">
              <ArrowCounterClockwise weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Redo" shortcut="Ctrl+Y">
              <ArrowClockwise weight="bold" />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton tooltip="Copy" shortcut="Ctrl+C">
              <Copy weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Cut" shortcut="Ctrl+X">
              <Scissors weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Paste" shortcut="Ctrl+V">
              <ClipboardText weight="bold" />
            </ToolbarButton>
          </Toolbar>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 4. TOGGLE GROUPS */}
      {/* ============================================ */}
      <ComponentCard
        id="toggle-groups"
        title="Toggle Groups"
        description="Single-select and multi-select toggle groups for formatting options"
      >
        <div className="space-y-8">
          {/* Single Select */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Single Select (ToolbarToggleGroup)</Label>
              <span className="text-caption text-foreground-muted">
                — Only one option can be active
              </span>
            </div>
            <CodePreview
              code={`<ToolbarToggleGroup
  value={alignment}
  onValueChange={setAlignment}
  aria-label="Text alignment"
>
  <ToolbarToggleItem value="left" tooltip="Align left">
    <TextAlignLeft weight="bold" />
  </ToolbarToggleItem>
  <ToolbarToggleItem value="center" tooltip="Center">
    <TextAlignCenter weight="bold" />
  </ToolbarToggleItem>
  <ToolbarToggleItem value="right" tooltip="Align right">
    <TextAlignRight weight="bold" />
  </ToolbarToggleItem>
</ToolbarToggleGroup>`}
            >
              <Toolbar>
                <ToolbarToggleGroup
                  value={alignment}
                  onValueChange={setAlignment}
                  aria-label="Text alignment"
                >
                  <ToolbarToggleItem value="left" tooltip="Align left">
                    <TextAlignLeft weight="bold" />
                  </ToolbarToggleItem>
                  <ToolbarToggleItem value="center" tooltip="Center">
                    <TextAlignCenter weight="bold" />
                  </ToolbarToggleItem>
                  <ToolbarToggleItem value="right" tooltip="Align right">
                    <TextAlignRight weight="bold" />
                  </ToolbarToggleItem>
                  <ToolbarToggleItem value="justify" tooltip="Justify">
                    <TextAlignJustify weight="bold" />
                  </ToolbarToggleItem>
                </ToolbarToggleGroup>
              </Toolbar>
              <p className="mt-2 text-caption text-foreground-muted">
                Selected: <code className="rounded bg-background-muted px-1">{alignment}</code>
              </p>
            </CodePreview>
          </div>

          {/* Multi Select */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-body-strong">Multi Select (ToolbarMultiToggleGroup)</Label>
              <span className="text-caption text-foreground-muted">
                — Multiple options can be active simultaneously
              </span>
            </div>
            <CodePreview
              code={`<ToolbarMultiToggleGroup
  values={formatStyles}
  onValuesChange={setFormatStyles}
  aria-label="Text formatting"
>
  <ToolbarToggleItem value="bold" tooltip="Bold" shortcut="Ctrl+B">
    <TextB weight="bold" />
  </ToolbarToggleItem>
  <ToolbarToggleItem value="italic" tooltip="Italic" shortcut="Ctrl+I">
    <TextItalic weight="bold" />
  </ToolbarToggleItem>
  <ToolbarToggleItem value="underline" tooltip="Underline" shortcut="Ctrl+U">
    <TextUnderline weight="bold" />
  </ToolbarToggleItem>
</ToolbarMultiToggleGroup>`}
            >
              <Toolbar>
                <ToolbarMultiToggleGroup
                  values={formatStyles}
                  onValuesChange={setFormatStyles}
                  aria-label="Text formatting"
                >
                  <ToolbarToggleItem value="bold" tooltip="Bold" shortcut="Ctrl+B">
                    <TextB weight="bold" />
                  </ToolbarToggleItem>
                  <ToolbarToggleItem value="italic" tooltip="Italic" shortcut="Ctrl+I">
                    <TextItalic weight="bold" />
                  </ToolbarToggleItem>
                  <ToolbarToggleItem value="underline" tooltip="Underline" shortcut="Ctrl+U">
                    <TextUnderline weight="bold" />
                  </ToolbarToggleItem>
                  <ToolbarToggleItem value="strikethrough" tooltip="Strikethrough">
                    <TextStrikethrough weight="bold" />
                  </ToolbarToggleItem>
                </ToolbarMultiToggleGroup>
              </Toolbar>
              <p className="mt-2 text-caption text-foreground-muted">
                Selected:{" "}
                <code className="rounded bg-background-muted px-1">
                  {formatStyles.join(", ") || "(none)"}
                </code>
              </p>
            </CodePreview>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 5. GROUPED BUTTONS */}
      {/* ============================================ */}
      <ComponentCard
        id="grouped-buttons"
        title="Grouped vs Plain Buttons"
        description="Buttons can be grouped with a background or displayed plainly"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Plain Group (no background)</Label>
            <Toolbar>
              <ToolbarGroup variant="plain" aria-label="History">
                <ToolbarButton tooltip="Undo">
                  <ArrowCounterClockwise weight="bold" />
                </ToolbarButton>
                <ToolbarButton tooltip="Redo">
                  <ArrowClockwise weight="bold" />
                </ToolbarButton>
              </ToolbarGroup>
            </Toolbar>
          </div>
          <div className="space-y-3">
            <Label>Grouped (with background container)</Label>
            <Toolbar>
              <ToolbarGroup variant="grouped" aria-label="List type">
                <ToolbarButton grouped tooltip="Bulleted list">
                  <ListBullets weight="bold" />
                </ToolbarButton>
                <ToolbarButton grouped tooltip="Numbered list">
                  <ListNumbers weight="bold" />
                </ToolbarButton>
              </ToolbarGroup>
            </Toolbar>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 6. BUTTON STATES */}
      {/* ============================================ */}
      <ComponentCard
        id="states"
        title="Button States"
        description="Visual states for toolbar buttons"
      >
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Default</Label>
              <Toolbar>
                <ToolbarButton tooltip="Default state">
                  <TextB weight="bold" />
                </ToolbarButton>
              </Toolbar>
              <p className="text-caption text-foreground-muted">
                Unselected, ready for interaction
              </p>
            </div>
            <div className="space-y-2">
              <Label>Selected</Label>
              <Toolbar>
                <ToolbarButton selected tooltip="Selected state">
                  <TextB weight="bold" />
                </ToolbarButton>
              </Toolbar>
              <p className="text-caption text-foreground-muted">Active formatting option</p>
            </div>
            <div className="space-y-2">
              <Label>Loading</Label>
              <Toolbar>
                <ToolbarButton loading tooltip="Loading...">
                  <FloppyDisk weight="bold" />
                </ToolbarButton>
              </Toolbar>
              <p className="text-caption text-foreground-muted">Async operation in progress</p>
            </div>
            <div className="space-y-2">
              <Label>Disabled</Label>
              <Toolbar>
                <ToolbarButton disabled tooltip="Disabled button">
                  <ArrowCounterClockwise weight="bold" />
                </ToolbarButton>
              </Toolbar>
              <p className="text-caption text-foreground-muted">
                Cannot interact (e.g., no undo history)
              </p>
            </div>
          </div>

          {/* Grouped button states */}
          <div className="border-t border-border-muted pt-6">
            <Label className="mb-4 block">Grouped Button States</Label>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <span className="text-caption text-foreground-muted">
                  Unselected (inside group)
                </span>
                <Toolbar>
                  <ToolbarToggleGroup value="" aria-label="Demo">
                    <ToolbarToggleItem value="left">
                      <TextAlignLeft weight="bold" />
                    </ToolbarToggleItem>
                  </ToolbarToggleGroup>
                </Toolbar>
              </div>
              <div className="space-y-2">
                <span className="text-caption text-foreground-muted">
                  Selected (white bg + shadow)
                </span>
                <Toolbar>
                  <ToolbarToggleGroup value="left" aria-label="Demo">
                    <ToolbarToggleItem value="left">
                      <TextAlignLeft weight="bold" />
                    </ToolbarToggleItem>
                  </ToolbarToggleGroup>
                </Toolbar>
              </div>
              <div className="space-y-2">
                <span className="text-caption text-foreground-muted">Disabled item</span>
                <Toolbar>
                  <ToolbarToggleGroup value="" aria-label="Demo">
                    <ToolbarToggleItem value="left" disabled>
                      <TextAlignLeft weight="bold" />
                    </ToolbarToggleItem>
                  </ToolbarToggleGroup>
                </Toolbar>
              </div>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 7. SECTIONS AND LAYOUT */}
      {/* ============================================ */}
      <ComponentCard
        id="layout"
        title="Sections, Spacers, and Layout"
        description="Organize toolbar content with sections, separators, and spacers"
      >
        <CodePreview
          code={`<Toolbar>
  <ToolbarSection>
    {/* Left-aligned formatting controls */}
    <ToolbarMultiToggleGroup values={[]} aria-label="Format">
      <ToolbarToggleItem value="bold"><TextB weight="bold" /></ToolbarToggleItem>
      <ToolbarToggleItem value="italic"><TextItalic weight="bold" /></ToolbarToggleItem>
    </ToolbarMultiToggleGroup>
    <ToolbarSeparator />
    <ToolbarToggleGroup value="left" aria-label="Align">
      <ToolbarToggleItem value="left"><TextAlignLeft weight="bold" /></ToolbarToggleItem>
      <ToolbarToggleItem value="center"><TextAlignCenter weight="bold" /></ToolbarToggleItem>
    </ToolbarToggleGroup>
  </ToolbarSection>

  <ToolbarSpacer />

  <ToolbarActions>
    <ToolbarButton tooltip="Preview"><Eye weight="bold" /></ToolbarButton>
    <ToolbarButton tooltip="Save"><FloppyDisk weight="bold" /></ToolbarButton>
  </ToolbarActions>
</Toolbar>`}
        >
          <Toolbar>
            <ToolbarSection>
              <ToolbarMultiToggleGroup values={["bold"]} aria-label="Text formatting">
                <ToolbarToggleItem value="bold" tooltip="Bold">
                  <TextB weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="italic" tooltip="Italic">
                  <TextItalic weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="underline" tooltip="Underline">
                  <TextUnderline weight="bold" />
                </ToolbarToggleItem>
              </ToolbarMultiToggleGroup>
              <ToolbarSeparator />
              <ToolbarToggleGroup value="left" aria-label="Text alignment">
                <ToolbarToggleItem value="left" tooltip="Align left">
                  <TextAlignLeft weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="center" tooltip="Center">
                  <TextAlignCenter weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="right" tooltip="Align right">
                  <TextAlignRight weight="bold" />
                </ToolbarToggleItem>
              </ToolbarToggleGroup>
            </ToolbarSection>
            <ToolbarSpacer />
            <ToolbarActions>
              <ToolbarButton tooltip="Preview">
                <Eye weight="bold" />
              </ToolbarButton>
              <ToolbarButton tooltip="Save" onClick={handleSave} loading={isLoading}>
                <FloppyDisk weight="bold" />
              </ToolbarButton>
            </ToolbarActions>
          </Toolbar>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 8. TOOLTIPS WITH SHORTCUTS */}
      {/* ============================================ */}
      <ComponentCard
        id="tooltips"
        title="Tooltips with Keyboard Shortcuts"
        description="Buttons can display tooltips with optional keyboard shortcut hints"
      >
        <Toolbar>
          <ToolbarButton tooltip="Bold" shortcut="Ctrl+B">
            <TextB weight="bold" />
          </ToolbarButton>
          <ToolbarButton tooltip="Italic" shortcut="Ctrl+I">
            <TextItalic weight="bold" />
          </ToolbarButton>
          <ToolbarButton tooltip="Underline" shortcut="Ctrl+U">
            <TextUnderline weight="bold" />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton tooltip="Insert link" shortcut="Ctrl+K">
            <Link weight="bold" />
          </ToolbarButton>
          <ToolbarButton tooltip="Insert image" shortcut="Ctrl+Shift+I">
            <ImageIcon weight="bold" />
          </ToolbarButton>
          <ToolbarButton tooltip="Insert code block" shortcut="Ctrl+Shift+C">
            <Code weight="bold" />
          </ToolbarButton>
        </Toolbar>
        <p className="mt-3 text-caption text-foreground-muted">
          Hover over buttons to see tooltips with keyboard shortcuts.
        </p>
      </ComponentCard>

      {/* ============================================ */}
      {/* 9. DISABLED TOOLBAR */}
      {/* ============================================ */}
      <ComponentCard
        id="disabled"
        title="Disabled Toolbar"
        description="The entire toolbar can be disabled, affecting all child buttons"
      >
        <CodePreview
          code={`<Toolbar disabled aria-label="Disabled toolbar">
  <ToolbarButton tooltip="Bold">
    <TextB weight="bold" />
  </ToolbarButton>
  <ToolbarButton tooltip="Italic">
    <TextItalic weight="bold" />
  </ToolbarButton>
</Toolbar>`}
        >
          <Toolbar disabled aria-label="Disabled toolbar">
            <ToolbarButton tooltip="Bold">
              <TextB weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Italic">
              <TextItalic weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Underline">
              <TextUnderline weight="bold" />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarToggleGroup value="left" aria-label="Alignment">
              <ToolbarToggleItem value="left">
                <TextAlignLeft weight="bold" />
              </ToolbarToggleItem>
              <ToolbarToggleItem value="center">
                <TextAlignCenter weight="bold" />
              </ToolbarToggleItem>
            </ToolbarToggleGroup>
          </Toolbar>
          <p className="mt-2 text-caption text-foreground-muted">
            Set <code className="rounded bg-background-muted px-1">disabled</code> on the Toolbar to
            disable all children.
          </p>
        </CodePreview>
      </ComponentCard>

      {/* ============================================ */}
      {/* 10. PROPS TABLE */}
      {/* ============================================ */}
      <ComponentCard id="props" title="Props Reference">
        <div className="space-y-8">
          <div>
            <h4 className="mb-4 text-body-strong">Toolbar Props</h4>
            <PropsTable props={toolbarProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ToolbarButton Props</h4>
            <PropsTable props={toolbarButtonProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ToolbarToggleGroup Props (Single Select)</h4>
            <PropsTable props={toolbarToggleGroupProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ToolbarMultiToggleGroup Props (Multi Select)</h4>
            <PropsTable props={toolbarMultiToggleGroupProps} />
          </div>
          <div>
            <h4 className="mb-4 text-body-strong">ToolbarToggleItem Props</h4>
            <PropsTable props={toolbarToggleItemProps} />
          </div>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 11. COMPONENT COMPOSITION */}
      {/* ============================================ */}
      <ComponentCard
        id="composition"
        title="Component Composition"
        description="Available sub-components for building toolbars"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-muted">
                <th className="py-3 text-left font-medium text-foreground">Component</th>
                <th className="py-3 text-left font-medium text-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-muted">
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">Toolbar</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Root container with styling and keyboard navigation
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarSection</code>
                </td>
                <td className="py-3 text-foreground-muted">Logical grouping of related content</td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarGroup</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Visual grouping with optional background
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarButton</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Individual action button with optional tooltip
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarToggleGroup</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Single-select toggle container (radio behavior)
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarMultiToggleGroup</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Multi-select toggle container (checkbox behavior)
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarToggleItem</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Toggle button used inside toggle groups
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarSeparator</code>
                </td>
                <td className="py-3 text-foreground-muted">Vertical divider between groups</td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarSpacer</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Flexible space that pushes content apart
                </td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarLabel</code>
                </td>
                <td className="py-3 text-foreground-muted">Text label within the toolbar</td>
              </tr>
              <tr>
                <td className="py-3">
                  <code className="rounded bg-background-muted px-1">ToolbarActions</code>
                </td>
                <td className="py-3 text-foreground-muted">
                  Right-aligned action button container
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ComponentCard>

      {/* ============================================ */}
      {/* 12. USAGE GUIDELINES */}
      {/* ============================================ */}
      <div id="guidelines">
        <h2 className="mb-4 text-heading-sm text-foreground">Usage Guidelines</h2>
        <UsageGuide
          dos={[
            "Group related actions together (formatting, alignment, insert)",
            "Use tooltips with keyboard shortcuts for discoverability",
            "Use ToolbarToggleGroup for mutually exclusive options",
            "Use ToolbarMultiToggleGroup for options that can combine (bold + italic)",
            "Keep toolbars focused - don't include unrelated actions",
            "Use icon-only buttons with descriptive tooltips",
            "Disable individual buttons when actions are unavailable",
          ]}
          donts={[
            "Don't include too many actions (max 15-20 buttons)",
            "Don't use text labels inside toolbar buttons (use tooltips)",
            "Don't mix grouped and ungrouped buttons without separators",
            "Don't forget to set aria-label on toggle groups",
            "Don't use toolbars for navigation purposes",
            "Don't disable the entire toolbar when only some actions are unavailable",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 13. ACCESSIBILITY */}
      {/* ============================================ */}
      <div id="accessibility">
        <AccessibilityInfo
          items={[
            "**Keyboard navigation**: Arrow keys move focus between buttons, Home/End jump to first/last",
            "**ARIA role**: Uses role='toolbar' with aria-orientation and aria-label",
            "**Toggle state**: aria-pressed indicates button state for screen readers",
            "**Focus visible**: Clear focus ring using blue-500 for keyboard users",
            "**Disabled state**: Uses aria-disabled to communicate state",
            "**Tooltip delay**: 400ms delay prevents tooltip spam during keyboard navigation",
            "**Group labels**: Toggle groups have aria-label for context",
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 14. RELATED COMPONENTS */}
      {/* ============================================ */}
      <div id="related">
        <RelatedComponents
          components={[
            {
              name: "Button",
              href: "/design-system/components/buttons",
              description: "Standalone buttons for actions",
            },
            {
              name: "Rich Text Editor",
              href: "/design-system/components/rich-text-editor",
              description: "Full editor with integrated toolbar",
            },
            {
              name: "Tooltip",
              href: "/design-system/components/tooltip",
              description: "Standalone tooltip component",
            },
            {
              name: "Dropdown Menu",
              href: "/design-system/components/dropdown-menu",
              description: "For toolbar overflow menus",
            },
            {
              name: "Toggle",
              href: "/design-system/components/switch",
              description: "For on/off states",
            },
            {
              name: "Job Description Toolbar",
              href: "/design-system/components/job-description-toolbar",
              description: "Specialized toolbar for job posting editor",
            },
          ]}
        />
      </div>

      {/* ============================================ */}
      {/* 15. REAL-WORLD EXAMPLES */}
      {/* ============================================ */}
      <div id="examples" className="space-y-6">
        <h2 className="text-heading-sm text-foreground">Real-World Examples</h2>

        <RealWorldExample
          title="Rich Text Editor Toolbar"
          description="Complete formatting toolbar for job description editor"
        >
          <Toolbar aria-label="Rich text formatting">
            <ToolbarSection>
              <ToolbarMultiToggleGroup
                values={formatStyles}
                onValuesChange={setFormatStyles}
                aria-label="Text style"
              >
                <ToolbarToggleItem value="bold" tooltip="Bold" shortcut="Ctrl+B">
                  <TextB weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="italic" tooltip="Italic" shortcut="Ctrl+I">
                  <TextItalic weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="underline" tooltip="Underline" shortcut="Ctrl+U">
                  <TextUnderline weight="bold" />
                </ToolbarToggleItem>
              </ToolbarMultiToggleGroup>
              <ToolbarSeparator />
              <ToolbarToggleGroup
                value={alignment}
                onValueChange={setAlignment}
                aria-label="Text alignment"
              >
                <ToolbarToggleItem value="left" tooltip="Align left">
                  <TextAlignLeft weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="center" tooltip="Center">
                  <TextAlignCenter weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="right" tooltip="Align right">
                  <TextAlignRight weight="bold" />
                </ToolbarToggleItem>
              </ToolbarToggleGroup>
              <ToolbarSeparator />
              <ToolbarToggleGroup
                value={listType}
                onValueChange={setListType}
                allowDeselect
                aria-label="List type"
              >
                <ToolbarToggleItem value="bullet" tooltip="Bulleted list">
                  <ListBullets weight="bold" />
                </ToolbarToggleItem>
                <ToolbarToggleItem value="number" tooltip="Numbered list">
                  <ListNumbers weight="bold" />
                </ToolbarToggleItem>
              </ToolbarToggleGroup>
              <ToolbarSeparator />
              <ToolbarGroup variant="plain">
                <ToolbarButton tooltip="Insert link" shortcut="Ctrl+K">
                  <Link weight="bold" />
                </ToolbarButton>
                <ToolbarButton tooltip="Insert image">
                  <ImageIcon weight="bold" />
                </ToolbarButton>
                <ToolbarButton tooltip="Block quote">
                  <Quotes weight="bold" />
                </ToolbarButton>
                <ToolbarButton tooltip="Insert table">
                  <Table weight="bold" />
                </ToolbarButton>
              </ToolbarGroup>
            </ToolbarSection>
            <ToolbarSpacer />
            <ToolbarActions>
              <ToolbarButton tooltip="Clear formatting">
                <Eraser weight="bold" />
              </ToolbarButton>
            </ToolbarActions>
          </Toolbar>
        </RealWorldExample>

        <RealWorldExample
          title="Document Actions Toolbar"
          description="Actions toolbar for document management"
        >
          <Toolbar aria-label="Document actions">
            <ToolbarGroup variant="plain">
              <ToolbarButton tooltip="Undo" shortcut="Ctrl+Z">
                <ArrowCounterClockwise weight="bold" />
              </ToolbarButton>
              <ToolbarButton tooltip="Redo" shortcut="Ctrl+Y">
                <ArrowClockwise weight="bold" />
              </ToolbarButton>
            </ToolbarGroup>
            <ToolbarSeparator />
            <ToolbarGroup variant="plain">
              <ToolbarButton tooltip="Cut" shortcut="Ctrl+X">
                <Scissors weight="bold" />
              </ToolbarButton>
              <ToolbarButton tooltip="Copy" shortcut="Ctrl+C">
                <Copy weight="bold" />
              </ToolbarButton>
              <ToolbarButton tooltip="Paste" shortcut="Ctrl+V">
                <ClipboardText weight="bold" />
              </ToolbarButton>
            </ToolbarGroup>
            <ToolbarSpacer />
            <ToolbarActions>
              <ToolbarButton tooltip="Print" shortcut="Ctrl+P">
                <Printer weight="bold" />
              </ToolbarButton>
              <ToolbarButton tooltip="Share">
                <Share weight="bold" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Save"
                shortcut="Ctrl+S"
                onClick={handleSave}
                loading={isLoading}
              >
                <FloppyDisk weight="bold" />
              </ToolbarButton>
            </ToolbarActions>
          </Toolbar>
        </RealWorldExample>

        <RealWorldExample
          title="Minimal Actions Toolbar"
          description="Compact toolbar for inline editing"
        >
          <Toolbar aria-label="Quick actions">
            <ToolbarButton tooltip="Edit" shortcut="E">
              <PencilSimple weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Duplicate">
              <Copy weight="bold" />
            </ToolbarButton>
            <ToolbarButton tooltip="Delete">
              <Trash weight="bold" />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton tooltip="More options">
              <DotsThree weight="bold" />
            </ToolbarButton>
          </Toolbar>
        </RealWorldExample>
      </div>

      {/* Page Navigation */}
      <PageNavigation currentPath="/design-system/components/toolbar" />
    </div>
  );
}

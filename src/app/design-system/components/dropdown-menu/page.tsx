"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  MoreHorizontal,
  User,
  Settings,
  SignOut,
  Edit,
  Copy,
  Trash,
  Share,
  Download,
  Plus,
} from "@/components/Icons";

const dropdownMenuProps = [
  { name: "open", type: "boolean", default: "undefined", description: "Controlled open state" },
  { name: "onOpenChange", type: "(open: boolean) => void", default: "undefined", description: "Called when open state changes" },
  { name: "modal", type: "boolean", default: "true", description: "Whether to render as modal" },
];

const dropdownMenuContentProps = [
  { name: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment relative to trigger" },
  { name: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Preferred side to render" },
  { name: "sideOffset", type: "number", default: "4", description: "Distance from trigger" },
];

const dropdownMenuItemProps = [
  { name: "disabled", type: "boolean", default: "false", description: "Whether the item is disabled" },
  { name: "onSelect", type: "(event: Event) => void", default: "undefined", description: "Called when item is selected" },
];

export default function DropdownMenuPage() {
  const [showGrid, setShowGrid] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState("date");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Dropdown Menu
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Dropdown menus display a list of actions or options when triggered. Use them
          to group related actions and save space in the interface.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple dropdown with menu items"
      >
        <CodePreview
          code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="secondary">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem>Share</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-error">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                Actions
                <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CodePreview>
      </ComponentCard>

      {/* With Icons */}
      <ComponentCard
        id="with-icons"
        title="With Icons"
        description="Menu items with leading icons"
      >
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-error">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ComponentCard>

      {/* With Labels and Separators */}
      <ComponentCard
        id="with-labels"
        title="With Labels and Separators"
        description="Organized menu with labeled sections"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentCard>

      {/* Alignment */}
      <ComponentCard
        id="alignment"
        title="Alignment"
        description="Different alignment options"
      >
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Align Start</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Align Center</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">Align End</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Option 1</DropdownMenuItem>
              <DropdownMenuItem>Option 2</DropdownMenuItem>
              <DropdownMenuItem>Option 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ComponentCard>

      {/* With Checkbox Items */}
      <ComponentCard
        id="checkbox-items"
        title="With Checkbox Items"
        description="Toggle options within the menu"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">View Options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Display</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showGrid}
              onCheckedChange={setShowGrid}
            >
              Show Grid View
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentCard>

      {/* With Radio Items */}
      <ComponentCard
        id="radio-items"
        title="With Radio Items"
        description="Single selection within the menu"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
              <DropdownMenuRadioItem value="date">Date Added</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="match">Match Score</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ComponentCard>

      {/* Use Cases */}
      <ComponentCard
        id="use-cases"
        title="Use Cases"
        description="Common dropdown patterns in an ATS"
      >
        <div className="flex flex-wrap gap-4">
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Candidate Actions</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Move to Stage</DropdownMenuItem>
                <DropdownMenuItem>Add Note</DropdownMenuItem>
                <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-error">Reject</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Job Actions</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit Job</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Share Link</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Pause Job</DropdownMenuItem>
                <DropdownMenuItem>Close Job</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p className="text-caption-strong text-foreground-muted mb-2">Add New</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primary" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>New Job</DropdownMenuItem>
                <DropdownMenuItem>New Candidate</DropdownMenuItem>
                <DropdownMenuItem>New Template</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <div className="space-y-6">
          <div>
            <h4 className="text-body-strong mb-3">DropdownMenu</h4>
            <PropsTable props={dropdownMenuProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">DropdownMenuContent</h4>
            <PropsTable props={dropdownMenuContentProps} />
          </div>
          <div>
            <h4 className="text-body-strong mb-3">DropdownMenuItem</h4>
            <PropsTable props={dropdownMenuItemProps} />
          </div>
        </div>
      </ComponentCard>

      {/* Accessibility */}
      <ComponentCard
        id="accessibility"
        title="Accessibility"
        description="Dropdown menu accessibility features"
      >
        <div className="p-4 border border-border rounded-lg bg-background-subtle max-w-lg">
          <ul className="space-y-2 text-body-sm">
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Uses proper ARIA roles (menu, menuitem, menuitemcheckbox, etc.)
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Arrow keys navigate between items
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Enter/Space selects focused item
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Escape closes the menu
            </li>
            <li className="flex gap-2">
              <span className="text-semantic-success">✓</span>
              Focus is trapped within open menu
            </li>
          </ul>
        </div>
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Group related actions together",
          "Use icons to aid recognition",
          "Put destructive actions at the bottom with visual distinction",
          "Use separators to organize long menus",
        ]}
        donts={[
          "Don't hide critical or frequently used actions",
          "Don't nest dropdowns (use submenus sparingly)",
          "Don't use for navigation (use proper nav components)",
          "Don't include too many items (max 10-12)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/dropdown-menu" />
    </div>
  );
}

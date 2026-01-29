"use client";

import React from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Copy, Trash, PencilSimple, Share, Archive, Eye } from "@/components/Icons";

const contextMenuProps = [
  { name: "children", type: "ReactNode", required: true, description: "Trigger and content elements" },
];

const contextMenuItemProps = [
  { name: "children", type: "ReactNode", required: true, description: "Item content" },
  { name: "disabled", type: "boolean", default: "false", description: "Disable the item" },
  { name: "onSelect", type: "() => void", default: "undefined", description: "Selection callback" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

export default function ContextMenuPage() {
  const [showGrid, setShowGrid] = React.useState(true);
  const [showRulers, setShowRulers] = React.useState(false);
  const [viewMode, setViewMode] = React.useState("list");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Context Menu
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          ContextMenu displays a menu of actions triggered by right-clicking.
          Supports items, checkboxes, radio groups, submenus, and keyboard shortcuts.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Right-click to open context menu"
      >
        <CodePreview
          code={`<ContextMenu>
  <ContextMenuTrigger className="border rounded-lg p-8">
    Right-click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Edit</ContextMenuItem>
    <ContextMenuItem>Duplicate</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`}
        >
          <div className="flex justify-center">
            <ContextMenu>
              <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-foreground-muted">
                Right-click here
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48">
                <ContextMenuItem>
                  <PencilSimple className="w-4 h-4 mr-2" />
                  Edit
                </ContextMenuItem>
                <ContextMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem className="text-semantic-error">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Shortcuts */}
      <ComponentCard
        id="with-shortcuts"
        title="With Shortcuts"
        description="Menu items with keyboard shortcuts"
      >
        <div className="flex justify-center">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-foreground-muted">
              Right-click for shortcuts
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuItem>
                Copy
                <ContextMenuShortcut>⌘C</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Paste
                <ContextMenuShortcut>⌘V</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Cut
                <ContextMenuShortcut>⌘X</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                Undo
                <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Redo
                <ContextMenuShortcut>⌘⇧Z</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </ComponentCard>

      {/* Checkbox Items */}
      <ComponentCard
        id="checkbox-items"
        title="Checkbox Items"
        description="Toggle options in the menu"
      >
        <div className="flex justify-center">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-foreground-muted">
              Right-click for options
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuLabel>View Options</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuCheckboxItem
                checked={showGrid}
                onCheckedChange={setShowGrid}
              >
                Show Grid
              </ContextMenuCheckboxItem>
              <ContextMenuCheckboxItem
                checked={showRulers}
                onCheckedChange={setShowRulers}
              >
                Show Rulers
              </ContextMenuCheckboxItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </ComponentCard>

      {/* Radio Group */}
      <ComponentCard
        id="radio-group"
        title="Radio Group"
        description="Single selection from options"
      >
        <div className="flex justify-center">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-foreground-muted">
              Right-click for view mode
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48">
              <ContextMenuLabel>View Mode</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuRadioGroup value={viewMode} onValueChange={setViewMode}>
                <ContextMenuRadioItem value="list">List View</ContextMenuRadioItem>
                <ContextMenuRadioItem value="grid">Grid View</ContextMenuRadioItem>
                <ContextMenuRadioItem value="table">Table View</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </ComponentCard>

      {/* Submenus */}
      <ComponentCard
        id="submenus"
        title="Submenus"
        description="Nested menu options"
      >
        <div className="flex justify-center">
          <ContextMenu>
            <ContextMenuTrigger className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed border-border text-foreground-muted">
              Right-click for submenus
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View
              </ContextMenuItem>
              <ContextMenuItem>
                <PencilSimple className="w-4 h-4 mr-2" />
                Edit
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  <ContextMenuItem>Copy Link</ContextMenuItem>
                  <ContextMenuItem>Email</ContextMenuItem>
                  <ContextMenuItem>Slack</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>More options...</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSub>
                <ContextMenuSubTrigger>
                  <Archive className="w-4 h-4 mr-2" />
                  Move to
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  <ContextMenuItem>Archive</ContextMenuItem>
                  <ContextMenuItem>Drafts</ContextMenuItem>
                  <ContextMenuItem>Trash</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </ComponentCard>

      {/* Candidate Card Context */}
      <ComponentCard
        id="example"
        title="Candidate Card Example"
        description="Context menu for a candidate card"
      >
        <div className="flex justify-center">
          <ContextMenu>
            <ContextMenuTrigger className="p-4 border border-border rounded-lg w-64 cursor-context-menu hover:bg-background-subtle">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-700 font-medium text-sm">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-caption text-foreground-muted">Solar Engineer</p>
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
              <ContextMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Profile
                <ContextMenuShortcut>⌘O</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                <PencilSimple className="w-4 h-4 mr-2" />
                Edit Candidate
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>Move to Stage</ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-48">
                  <ContextMenuItem>Applied</ContextMenuItem>
                  <ContextMenuItem>Screening</ContextMenuItem>
                  <ContextMenuItem>Interview</ContextMenuItem>
                  <ContextMenuItem>Offer</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuItem>
                <Copy className="w-4 h-4 mr-2" />
                Copy Email
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </ContextMenuItem>
              <ContextMenuItem className="text-semantic-error">
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </ComponentCard>

      {/* Props - ContextMenu */}
      <ComponentCard id="props-root" title="ContextMenu Props">
        <PropsTable props={contextMenuProps} />
      </ComponentCard>

      {/* Props - ContextMenuItem */}
      <ComponentCard id="props-item" title="ContextMenuItem Props">
        <PropsTable props={contextMenuItemProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for secondary actions on elements",
          "Include keyboard shortcuts for common actions",
          "Group related actions with separators",
          "Use destructive styling for delete actions",
        ]}
        donts={[
          "Don't hide primary actions in context menus",
          "Don't make context menus the only way to access actions",
          "Don't nest too many levels of submenus",
          "Don't include too many items (max 10-12)",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/context-menu" />
    </div>
  );
}

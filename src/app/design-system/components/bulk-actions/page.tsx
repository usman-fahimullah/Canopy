"use client";

import React from "react";
import {
  BulkActionsToolbar,
  SelectableItem,
  useSelection,
  atsBulkActions,
} from "@/components/ui/bulk-actions";
import type { BulkAction, BulkActionsToolbarProps } from "@/components/ui/bulk-actions";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  EnvelopeSimple,
  Trash,
  Tag,
  ArrowRight,
  Export,
  Archive,
  Star,
  UserCirclePlus,
  X,
  CheckSquare,
  Square,
  MinusSquare,
} from "@phosphor-icons/react";

// Sample data for demonstrations
interface SampleCandidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: string;
}

const sampleCandidates: SampleCandidate[] = [
  { id: "1", name: "Sarah Chen", email: "sarah@example.com", role: "Senior Engineer", stage: "Interview" },
  { id: "2", name: "Michael Park", email: "michael@example.com", role: "Product Manager", stage: "Screening" },
  { id: "3", name: "Emily Davis", email: "emily@example.com", role: "Designer", stage: "Applied" },
  { id: "4", name: "David Kim", email: "david@example.com", role: "Data Scientist", stage: "Offer" },
  { id: "5", name: "Jennifer Lee", email: "jennifer@example.com", role: "Marketing Lead", stage: "Interview" },
];

// Sample stages and tags for dropdown actions
const sampleStages = [
  { id: "applied", name: "Applied" },
  { id: "screening", name: "Screening" },
  { id: "interview", name: "Interview" },
  { id: "offer", name: "Offer" },
  { id: "hired", name: "Hired" },
];

const sampleTags = [
  { id: "priority", name: "Priority" },
  { id: "climate-exp", name: "Climate Experience" },
  { id: "referred", name: "Referred" },
  { id: "remote", name: "Remote Only" },
];

const sampleUsers = [
  { id: "u1", name: "James Wilson" },
  { id: "u2", name: "Lisa Wang" },
  { id: "u3", name: "Robert Brown" },
];

// Props documentation
const bulkActionsToolbarProps = [
  {
    name: "selectedCount",
    type: "number",
    required: true,
    description: "Number of selected items",
  },
  {
    name: "totalCount",
    type: "number",
    required: true,
    description: "Total number of items",
  },
  {
    name: "onSelectAll",
    type: "() => void",
    required: true,
    description: "Callback to select all items",
  },
  {
    name: "onDeselectAll",
    type: "() => void",
    required: true,
    description: "Callback to deselect all items",
  },
  {
    name: "onAction",
    type: "(actionId: string, selectedIds?: string[]) => void",
    required: true,
    description: "Callback when an action is triggered",
  },
  {
    name: "actions",
    type: "BulkAction[]",
    required: true,
    description: "Array of available bulk actions",
  },
  {
    name: "selectedIds",
    type: "string[]",
    default: "[]",
    description: "Array of selected item IDs",
  },
  {
    name: "position",
    type: '"fixed" | "inline"',
    default: '"inline"',
    description: "Toolbar position: fixed at bottom or inline",
  },
  {
    name: "showWhenEmpty",
    type: "boolean",
    default: "false",
    description: "Show toolbar when no items selected",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes",
  },
];

const bulkActionProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the action",
  },
  {
    name: "label",
    type: "string",
    required: true,
    description: "Display label for the action",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    description: "Icon to display with the action",
  },
  {
    name: "variant",
    type: '"default" | "destructive"',
    default: '"default"',
    description: "Visual variant for the action button",
  },
  {
    name: "confirmMessage",
    type: "string",
    description: "Confirmation message (shows confirm dialog if provided)",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the action",
  },
  {
    name: "children",
    type: "BulkAction[]",
    description: "Submenu items for dropdown actions",
  },
  {
    name: "shortcut",
    type: "string",
    description: "Keyboard shortcut hint",
  },
];

const selectableItemProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the item",
  },
  {
    name: "selected",
    type: "boolean",
    required: true,
    description: "Whether the item is selected",
  },
  {
    name: "onSelect",
    type: "(id: string) => void",
    required: true,
    description: "Callback when selection changes",
  },
  {
    name: "children",
    type: "React.ReactNode",
    required: true,
    description: "Content to render inside the selectable wrapper",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable selection for this item",
  },
];

const useSelectionReturn = [
  {
    name: "selectedIds",
    type: "Set<string>",
    description: "Set of currently selected IDs",
  },
  {
    name: "isAllSelected",
    type: "boolean",
    description: "True if all items are selected",
  },
  {
    name: "isPartiallySelected",
    type: "boolean",
    description: "True if some (but not all) items are selected",
  },
  {
    name: "toggleSelection",
    type: "(id: string) => void",
    description: "Toggle selection state for an item",
  },
  {
    name: "selectAll",
    type: "() => void",
    description: "Select all items",
  },
  {
    name: "deselectAll",
    type: "() => void",
    description: "Deselect all items",
  },
  {
    name: "isSelected",
    type: "(id: string) => boolean",
    description: "Check if an item is selected",
  },
  {
    name: "selectedItems",
    type: "T[]",
    description: "Array of selected item objects",
  },
];

export default function BulkActionsPage() {
  // Selection state using the hook
  const {
    selectedIds,
    isAllSelected,
    isPartiallySelected,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
  } = useSelection(sampleCandidates);

  // Simple selection state for basic demos
  const [basicSelectedCount, setBasicSelectedCount] = React.useState(3);
  const [actionLog, setActionLog] = React.useState<string[]>([]);

  const logAction = (actionId: string, selectedIds?: string[]) => {
    const message = `Action: ${actionId} on ${selectedIds?.length || 0} items`;
    setActionLog((prev) => [message, ...prev.slice(0, 4)]);
  };

  // Basic actions for demos
  const basicActions: BulkAction[] = [
    {
      id: "email",
      label: "Email",
      icon: <EnvelopeSimple className="h-4 w-4" />,
    },
    {
      id: "export",
      label: "Export",
      icon: <Export className="h-4 w-4" />,
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      confirmMessage: "Are you sure you want to archive the selected candidates?",
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      variant: "destructive",
      confirmMessage: "Are you sure you want to permanently delete the selected candidates? This action cannot be undone.",
    },
  ];

  // Full ATS actions with dropdowns
  const atsActions: BulkAction[] = [
    atsBulkActions.email(),
    atsBulkActions.moveToStage(sampleStages),
    atsBulkActions.addTag(sampleTags),
    atsBulkActions.assignTo(sampleUsers),
    atsBulkActions.export(),
    atsBulkActions.archive(),
    atsBulkActions.reject(),
  ];

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Bulk Actions
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl mb-4">
          Multi-select toolbar for batch operations on candidates, jobs, or other items.
          Provides selection indicators, action menus, and confirmation dialogs for
          destructive operations.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 bg-background-success/10 rounded-lg border border-border-success">
            <h3 className="font-semibold text-foreground-success mb-2">When to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Managing multiple candidates at once</li>
              <li>Batch stage changes in pipelines</li>
              <li>Mass email or communication</li>
              <li>Exporting selected data</li>
              <li>Bulk tagging or categorization</li>
            </ul>
          </div>
          <div className="p-4 bg-background-error/10 rounded-lg border border-border-error">
            <h3 className="font-semibold text-foreground-error mb-2">When not to use</h3>
            <ul className="text-sm space-y-1 text-foreground-muted">
              <li>Single item actions (use context menu)</li>
              <li>Form submissions (use form actions)</li>
              <li>Navigation actions (use nav components)</li>
              <li>Real-time collaborative edits</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Inline toolbar with selection count and actions"
      >
        <CodePreview
          code={`import { BulkActionsToolbar } from "@/components/ui/bulk-actions";

const actions = [
  { id: "email", label: "Email", icon: <EnvelopeSimple /> },
  { id: "export", label: "Export", icon: <Export /> },
  { id: "delete", label: "Delete", icon: <Trash />, variant: "destructive" },
];

<BulkActionsToolbar
  selectedCount={3}
  totalCount={10}
  onSelectAll={() => selectAll()}
  onDeselectAll={() => deselectAll()}
  onAction={(actionId) => handleAction(actionId)}
  actions={actions}
/>`}
        >
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBasicSelectedCount(Math.max(0, basicSelectedCount - 1))}
              >
                -
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBasicSelectedCount(Math.min(10, basicSelectedCount + 1))}
              >
                +
              </Button>
              <span className="text-sm text-foreground-muted self-center ml-2">
                Adjust selection count
              </span>
            </div>
            <BulkActionsToolbar
              selectedCount={basicSelectedCount}
              totalCount={10}
              onSelectAll={() => setBasicSelectedCount(10)}
              onDeselectAll={() => setBasicSelectedCount(0)}
              onAction={logAction}
              actions={basicActions}
              showWhenEmpty={true}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Selection States */}
      <ComponentCard
        id="selection-states"
        title="Selection States"
        description="Visual indicators for selection state"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label>None Selected</Label>
            <div className="flex items-center gap-3 p-3 border border-border-muted rounded-lg bg-background-subtle">
              <Square className="h-5 w-5 text-foreground-muted" />
              <span className="text-sm">0 of 10 selected</span>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Partially Selected</Label>
            <div className="flex items-center gap-3 p-3 border border-border-muted rounded-lg bg-background-subtle">
              <MinusSquare className="h-5 w-5 text-foreground-brand" weight="fill" />
              <span className="text-sm">5 of 10 selected</span>
            </div>
          </div>
          <div className="space-y-3">
            <Label>All Selected</Label>
            <div className="flex items-center gap-3 p-3 border border-border-muted rounded-lg bg-background-subtle">
              <CheckSquare className="h-5 w-5 text-foreground-brand" weight="fill" />
              <span className="text-sm">10 of 10 selected</span>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Position Variants */}
      <ComponentCard
        id="positions"
        title="Position Variants"
        description="Inline or fixed bottom positioning"
      >
        <div className="space-y-8">
          {/* Inline Position */}
          <div>
            <h4 className="text-body-strong mb-4">Inline (Default)</h4>
            <BulkActionsToolbar
              selectedCount={3}
              totalCount={10}
              onSelectAll={() => {}}
              onDeselectAll={() => {}}
              onAction={logAction}
              actions={basicActions.slice(0, 3)}
              position="inline"
              showWhenEmpty={true}
            />
          </div>

          {/* Fixed Position Note */}
          <div>
            <h4 className="text-body-strong mb-4">Fixed Bottom</h4>
            <div className="p-4 border border-dashed border-border-muted rounded-lg bg-background-subtle">
              <p className="text-sm text-foreground-muted">
                Use <code className="bg-background-muted px-1 rounded">position=&quot;fixed&quot;</code> to display
                the toolbar fixed at the bottom of the viewport. This is ideal for long lists
                where the toolbar should remain accessible during scrolling.
              </p>
              <CodePreview
                code={`<BulkActionsToolbar
  position="fixed"
  // ... other props
/>`}
              >
                <div className="h-16 flex items-center justify-center text-foreground-muted text-sm">
                  Fixed toolbar appears at bottom of screen when items are selected
                </div>
              </CodePreview>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Dropdown Actions */}
      <ComponentCard
        id="dropdown-actions"
        title="Dropdown Actions"
        description="Actions with submenu options"
      >
        <CodePreview
          code={`import { atsBulkActions } from "@/components/ui/bulk-actions";

const actions = [
  atsBulkActions.email(),
  atsBulkActions.moveToStage([
    { id: "screening", name: "Screening" },
    { id: "interview", name: "Interview" },
    { id: "offer", name: "Offer" },
  ]),
  atsBulkActions.addTag([
    { id: "priority", name: "Priority" },
    { id: "referred", name: "Referred" },
  ]),
  atsBulkActions.assignTo([
    { id: "u1", name: "James Wilson" },
    { id: "u2", name: "Lisa Wang" },
  ]),
];`}
        >
          <BulkActionsToolbar
            selectedCount={5}
            totalCount={20}
            onSelectAll={() => {}}
            onDeselectAll={() => {}}
            onAction={logAction}
            actions={atsActions}
          />
        </CodePreview>
      </ComponentCard>

      {/* Confirmation Dialog */}
      <ComponentCard
        id="confirmation"
        title="Confirmation Dialog"
        description="Require confirmation for destructive actions"
      >
        <CodePreview
          code={`const deleteAction: BulkAction = {
  id: "delete",
  label: "Delete",
  icon: <Trash />,
  variant: "destructive",
  confirmMessage: "Are you sure you want to permanently delete the selected items? This action cannot be undone.",
};`}
        >
          <div className="space-y-4">
            <p className="text-sm text-foreground-muted">
              Click &quot;Delete&quot; or &quot;Archive&quot; to see the confirmation dialog.
            </p>
            <BulkActionsToolbar
              selectedCount={3}
              totalCount={10}
              onSelectAll={() => {}}
              onDeselectAll={() => {}}
              onAction={logAction}
              actions={[
                atsBulkActions.archive(),
                atsBulkActions.delete(),
              ]}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* useSelection Hook */}
      <ComponentCard
        id="use-selection"
        title="useSelection Hook"
        description="Manage selection state with the built-in hook"
      >
        <CodePreview
          code={`import { useSelection } from "@/components/ui/bulk-actions";

const items = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
];

const {
  selectedIds,
  isAllSelected,
  isPartiallySelected,
  toggleSelection,
  selectAll,
  deselectAll,
  isSelected,
  selectedItems,
} = useSelection(items);

// Use in your component
<BulkActionsToolbar
  selectedCount={selectedIds.size}
  totalCount={items.length}
  onSelectAll={selectAll}
  onDeselectAll={deselectAll}
  selectedIds={Array.from(selectedIds)}
  // ...
/>`}
        >
          <div className="space-y-4">
            <BulkActionsToolbar
              selectedCount={selectedIds.size}
              totalCount={sampleCandidates.length}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              onAction={logAction}
              actions={basicActions.slice(0, 2)}
              selectedIds={Array.from(selectedIds)}
              showWhenEmpty={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sampleCandidates.map((candidate) => (
                <SelectableItem
                  key={candidate.id}
                  id={candidate.id}
                  selected={isSelected(candidate.id)}
                  onSelect={toggleSelection}
                >
                  <Card className="cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={candidate.name} size="sm" />
                        <div>
                          <p className="font-medium text-sm">{candidate.name}</p>
                          <p className="text-xs text-foreground-muted">{candidate.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SelectableItem>
              ))}
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* SelectableItem Wrapper */}
      <ComponentCard
        id="selectable-item"
        title="SelectableItem Wrapper"
        description="Wrapper component that adds selection checkbox to any content"
      >
        <CodePreview
          code={`import { SelectableItem } from "@/components/ui/bulk-actions";

<SelectableItem
  id={item.id}
  selected={isSelected(item.id)}
  onSelect={toggleSelection}
>
  <Card>
    {/* Your card content */}
  </Card>
</SelectableItem>`}
        >
          <div className="space-y-3 max-w-md">
            {sampleCandidates.slice(0, 3).map((candidate) => (
              <SelectableItem
                key={candidate.id}
                id={candidate.id}
                selected={isSelected(candidate.id)}
                onSelect={toggleSelection}
              >
                <div className="p-4 border border-border-muted rounded-lg bg-surface-default hover:bg-card-background-hover transition-colors">
                  <div className="flex items-center gap-3 pl-8">
                    <Avatar name={candidate.name} size="sm" />
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-foreground-muted">{candidate.email}</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {candidate.stage}
                    </Badge>
                  </div>
                </div>
              </SelectableItem>
            ))}
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Pre-built ATS Actions */}
      <ComponentCard
        id="ats-actions"
        title="Pre-built ATS Actions"
        description="Ready-to-use action configurations for ATS workflows"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground-muted">
            The <code className="bg-background-muted px-1 rounded">atsBulkActions</code> object
            provides pre-configured actions for common ATS operations:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "email()", desc: "Send email", icon: <EnvelopeSimple className="h-4 w-4" /> },
              { name: "moveToStage()", desc: "Change stage", icon: <ArrowRight className="h-4 w-4" /> },
              { name: "addTag()", desc: "Add tags", icon: <Tag className="h-4 w-4" /> },
              { name: "assignTo()", desc: "Assign to user", icon: <UserCirclePlus className="h-4 w-4" /> },
              { name: "export()", desc: "Export data", icon: <Export className="h-4 w-4" /> },
              { name: "archive()", desc: "Archive items", icon: <Archive className="h-4 w-4" /> },
              { name: "favorite()", desc: "Star items", icon: <Star className="h-4 w-4" /> },
              { name: "reject()", desc: "Reject candidates", icon: <X className="h-4 w-4" /> },
            ].map((action) => (
              <div
                key={action.name}
                className="flex items-center gap-2 p-3 border border-border-muted rounded-lg"
              >
                {action.icon}
                <div>
                  <p className="font-mono text-xs">{action.name}</p>
                  <p className="text-xs text-foreground-muted">{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ComponentCard>

      {/* Real-world Examples */}
      <ComponentCard
        id="examples"
        title="Real-World Examples"
        description="Common usage patterns in ATS workflows"
      >
        <div className="space-y-8">
          {/* Candidate Pipeline */}
          <div>
            <h4 className="text-body-strong mb-4">Candidate Pipeline with Bulk Actions</h4>
            <div className="border border-border-muted rounded-xl overflow-hidden">
              <div className="p-4 border-b border-border-muted bg-background-subtle">
                <BulkActionsToolbar
                  selectedCount={selectedIds.size}
                  totalCount={sampleCandidates.length}
                  onSelectAll={selectAll}
                  onDeselectAll={deselectAll}
                  onAction={logAction}
                  actions={atsActions.slice(0, 5)}
                  selectedIds={Array.from(selectedIds)}
                  showWhenEmpty={true}
                />
              </div>
              <div className="divide-y divide-border-muted">
                {sampleCandidates.map((candidate) => (
                  <SelectableItem
                    key={candidate.id}
                    id={candidate.id}
                    selected={isSelected(candidate.id)}
                    onSelect={toggleSelection}
                  >
                    <div className="p-4 hover:bg-card-background-hover transition-colors">
                      <div className="flex items-center gap-4 pl-8">
                        <Avatar name={candidate.name} size="default" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{candidate.name}</p>
                          <p className="text-sm text-foreground-muted">{candidate.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{candidate.stage}</Badge>
                          <p className="text-xs text-foreground-muted mt-1">{candidate.role}</p>
                        </div>
                      </div>
                    </div>
                  </SelectableItem>
                ))}
              </div>
            </div>
          </div>

          {/* Action Log */}
          <div>
            <h4 className="text-body-strong mb-4">Action Log</h4>
            <Card className="max-w-md">
              <CardHeader>
                <CardTitle className="text-body-strong">Recent Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {actionLog.length === 0 ? (
                  <p className="text-sm text-foreground-muted">
                    Perform bulk actions above to see them logged here
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {actionLog.map((log, index) => (
                      <li key={index} className="text-sm text-foreground-muted">
                        {log}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="text-body-strong mb-3">BulkActionsToolbar</h4>
              <PropsTable props={bulkActionsToolbarProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">BulkAction Object</h4>
              <PropsTable props={bulkActionProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">SelectableItem</h4>
              <PropsTable props={selectableItemProps} />
            </div>

            <div>
              <h4 className="text-body-strong mb-3">useSelection Hook Return</h4>
              <PropsTable props={useSelectionReturn} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Show clear selection count and total",
          "Provide quick select all / deselect all",
          "Group related actions together",
          "Require confirmation for destructive actions",
          "Show keyboard shortcuts for power users",
          "Use fixed position for long scrollable lists",
        ]}
        donts={[
          "Don't auto-execute destructive actions",
          "Don't hide the toolbar when items are selected",
          "Don't show too many actions (use overflow menu)",
          "Don't forget to handle empty state",
          "Don't mix unrelated actions in same toolbar",
          "Don't disable actions without explanation",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard Navigation**: Tab through actions, Enter/Space to activate",
          "**Selection Feedback**: Clear visual indication of selection state",
          "**Checkbox States**: Proper indeterminate state for partial selection",
          "**Focus Management**: Focus moves to confirmation dialog when opened",
          "**Screen Readers**: Action counts and states announced",
          "**Escape Key**: Closes dropdowns and confirmation dialogs",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Bulk Actions"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/design-system/components/checkbox"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Checkbox</p>
            <p className="text-caption text-foreground-muted">Selection input</p>
          </a>
          <a
            href="/design-system/components/dropdown-menu"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Dropdown Menu</p>
            <p className="text-caption text-foreground-muted">Action menus</p>
          </a>
          <a
            href="/design-system/components/modal"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Modal</p>
            <p className="text-caption text-foreground-muted">Confirmation dialogs</p>
          </a>
          <a
            href="/design-system/components/kanban"
            className="p-4 border border-border-muted rounded-lg hover:border-border-brand transition-colors"
          >
            <p className="font-medium">Kanban</p>
            <p className="text-caption text-foreground-muted">Pipeline view</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/bulk-actions" />
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "./dropdown-menu";
import {
  X,
  DotsThree,
  Trash,
  EnvelopeSimple,
  Tag,
  UserCirclePlus,
  ArrowRight,
  Export,
  CheckSquare,
  Square,
  MinusSquare,
  Archive,
  Star,
  CaretDown,
} from "@phosphor-icons/react";

/* ============================================
   Bulk Actions Types
   ============================================ */
export interface BulkAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  /** Confirmation message - if provided, shows confirm dialog */
  confirmMessage?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Submenu items */
  children?: BulkAction[];
  /** Keyboard shortcut */
  shortcut?: string;
}

export interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onAction: (actionId: string, selectedIds?: string[]) => void;
  actions: BulkAction[];
  selectedIds?: string[];
  className?: string;
  /** Position: fixed at bottom or inline */
  position?: "fixed" | "inline";
  /** Show when no items selected */
  showWhenEmpty?: boolean;
}

export interface SelectionState {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
}

/* ============================================
   Selection Hook
   ============================================ */
export function useSelection<T extends { id: string }>(
  items: T[]
): {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  selectedItems: T[];
} {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const isPartiallySelected = selectedIds.size > 0 && selectedIds.size < items.length;

  const toggleSelection = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const selectAll = React.useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const deselectAll = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = React.useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const selectedItems = React.useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  return {
    selectedIds,
    isAllSelected,
    isPartiallySelected,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
    selectedItems,
  };
}

/* ============================================
   Bulk Actions Toolbar
   ============================================ */
const BulkActionsToolbar = React.forwardRef<HTMLDivElement, BulkActionsToolbarProps>(
  (
    {
      selectedCount,
      totalCount,
      onSelectAll,
      onDeselectAll,
      onAction,
      actions,
      selectedIds = [],
      className,
      position = "inline",
      showWhenEmpty = false,
    },
    ref
  ) => {
    const [confirmAction, setConfirmAction] = React.useState<BulkAction | null>(null);

    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    const isPartiallySelected = selectedCount > 0 && selectedCount < totalCount;

    // Don't render if nothing selected and showWhenEmpty is false
    if (selectedCount === 0 && !showWhenEmpty) {
      return null;
    }

    const handleAction = (action: BulkAction) => {
      if (action.confirmMessage) {
        setConfirmAction(action);
      } else {
        onAction(action.id, selectedIds);
      }
    };

    const confirmAndExecute = () => {
      if (confirmAction) {
        onAction(confirmAction.id, selectedIds);
        setConfirmAction(null);
      }
    };

    // Split actions into primary (first 3) and overflow
    const primaryActions = actions.filter((a) => !a.children).slice(0, 3);
    const overflowActions = actions.filter((a) => !a.children).slice(3);
    const nestedActions = actions.filter((a) => a.children);

    const toolbarContent = (
      <>
        {/* Selection indicator */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={isAllSelected || isPartiallySelected ? onDeselectAll : onSelectAll}
            className="transition-all duration-fast hover:scale-110 active:scale-95"
          >
            {isAllSelected ? (
              <CheckSquare className="h-5 w-5 text-foreground-brand transition-transform duration-fast" weight="fill" />
            ) : isPartiallySelected ? (
              <MinusSquare className="h-5 w-5 text-foreground-brand transition-transform duration-fast" weight="fill" />
            ) : (
              <Square className="h-5 w-5 text-foreground-muted transition-colors duration-fast" />
            )}
          </Button>

          <div className="text-sm">
            <span className="font-medium tabular-nums">{selectedCount}</span>
            <span className="text-foreground-muted"> of {totalCount} selected</span>
          </div>

          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              className="text-foreground-muted transition-all duration-fast hover:text-foreground-error hover:scale-105 active:scale-95"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Separator */}
        {selectedCount > 0 && (
          <div className="h-6 w-px bg-border-default mx-2" />
        )}

        {/* Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-1">
            {/* Primary actions */}
            {primaryActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant === "destructive" ? "destructive" : "ghost"}
                size="sm"
                onClick={() => handleAction(action)}
                disabled={action.disabled}
                className="gap-1.5 transition-all duration-fast hover:scale-105 active:scale-95"
              >
                {action.icon}
                {action.label}
              </Button>
            ))}

            {/* Nested actions (dropdowns) */}
            {nestedActions.map((action) => (
              <DropdownMenu key={action.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={action.disabled}
                    className="gap-1.5 transition-all duration-fast hover:scale-105 active:scale-95"
                  >
                    {action.icon}
                    {action.label}
                    <CaretDown className="h-3 w-3 transition-transform duration-fast group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="animate-scale-in">
                  {action.children?.map((child) => (
                    <DropdownMenuItem
                      key={child.id}
                      onClick={() => handleAction(child)}
                      disabled={child.disabled}
                      className={cn(
                        "transition-colors duration-fast",
                        child.variant === "destructive" && "text-foreground-error"
                      )}
                    >
                      {child.icon}
                      {child.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {/* Overflow menu */}
            {overflowActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <DotsThree className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {overflowActions.map((action, index) => (
                    <React.Fragment key={action.id}>
                      {action.variant === "destructive" && index > 0 && (
                        <DropdownMenuSeparator />
                      )}
                      <DropdownMenuItem
                        onClick={() => handleAction(action)}
                        disabled={action.disabled}
                        className={cn(
                          action.variant === "destructive" && "text-foreground-error"
                        )}
                      >
                        {action.icon}
                        {action.label}
                        {action.shortcut && (
                          <span className="ml-auto text-xs text-foreground-muted">
                            {action.shortcut}
                          </span>
                        )}
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        {/* Confirmation dialog */}
        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
            <div
              className="absolute inset-0 bg-overlay-default/80"
              onClick={() => setConfirmAction(null)}
            />
            <div className="relative bg-surface-default rounded-xl shadow-modal p-6 max-w-md mx-4 animate-scale-in">
              <h3 className="text-lg font-medium mb-2">Confirm action</h3>
              <p className="text-foreground-muted mb-4">
                {confirmAction.confirmMessage}
              </p>
              <p className="text-sm text-foreground-muted mb-4">
                This will affect{" "}
                <span className="font-medium text-foreground-default">
                  {selectedCount} {selectedCount === 1 ? "item" : "items"}
                </span>
                .
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setConfirmAction(null)}
                  className="transition-all duration-fast"
                >
                  Cancel
                </Button>
                <Button
                  variant={confirmAction.variant === "destructive" ? "destructive" : "primary"}
                  onClick={confirmAndExecute}
                  className="transition-all duration-fast hover:scale-105 active:scale-95"
                >
                  {confirmAction.label}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );

    if (position === "fixed") {
      return (
        <div
          ref={ref}
          className={cn(
            "fixed bottom-4 left-1/2 -translate-x-1/2 z-40",
            "flex items-center gap-2 px-4 py-3",
            "bg-surface-default rounded-2xl shadow-elevated border border-border-muted",
            "animate-slide-up",
            className
          )}
        >
          {toolbarContent}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-2 px-4 py-2",
          "bg-background-subtle rounded-lg border border-border-muted",
          "transition-all duration-fast animate-fade-in",
          className
        )}
      >
        {toolbarContent}
      </div>
    );
  }
);
BulkActionsToolbar.displayName = "BulkActionsToolbar";

/* ============================================
   Selectable Item Wrapper
   ============================================ */
interface SelectableItemProps {
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SelectableItem = React.forwardRef<HTMLDivElement, SelectableItemProps>(
  ({ id, selected, onSelect, children, className, disabled = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative transition-all duration-fast",
          selected && "ring-2 ring-ring-color ring-offset-1 rounded-lg bg-background-brand-subtle/30",
          className
        )}
      >
        {/* Selection checkbox */}
        <div
          className={cn(
            "absolute left-2 top-2 z-10",
            "opacity-0 group-hover:opacity-100 transition-all duration-fast",
            "scale-90 group-hover:scale-100",
            selected && "opacity-100 scale-100"
          )}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={() => onSelect(id)}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
            className="transition-transform duration-fast hover:scale-110"
          />
        </div>
        {children}
      </div>
    );
  }
);
SelectableItem.displayName = "SelectableItem";

/* ============================================
   Pre-built ATS Bulk Actions
   ============================================ */
const atsBulkActions = {
  email: (): BulkAction => ({
    id: "email",
    label: "Email",
    icon: <EnvelopeSimple className="h-4 w-4" />,
  }),

  moveToStage: (stages: { id: string; name: string }[]): BulkAction => ({
    id: "move-stage",
    label: "Move to stage",
    icon: <ArrowRight className="h-4 w-4" />,
    children: stages.map((stage) => ({
      id: `move-to-${stage.id}`,
      label: stage.name,
    })),
  }),

  addTag: (tags: { id: string; name: string }[]): BulkAction => ({
    id: "add-tag",
    label: "Add tag",
    icon: <Tag className="h-4 w-4" />,
    children: tags.map((tag) => ({
      id: `add-tag-${tag.id}`,
      label: tag.name,
    })),
  }),

  assignTo: (users: { id: string; name: string }[]): BulkAction => ({
    id: "assign",
    label: "Assign",
    icon: <UserCirclePlus className="h-4 w-4" />,
    children: users.map((user) => ({
      id: `assign-to-${user.id}`,
      label: user.name,
    })),
  }),

  export: (): BulkAction => ({
    id: "export",
    label: "Export",
    icon: <Export className="h-4 w-4" />,
  }),

  archive: (): BulkAction => ({
    id: "archive",
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    confirmMessage: "Are you sure you want to archive the selected candidates?",
  }),

  reject: (): BulkAction => ({
    id: "reject",
    label: "Reject",
    icon: <X className="h-4 w-4" />,
    variant: "destructive",
    confirmMessage:
      "Are you sure you want to reject the selected candidates? They will be moved to the rejected stage.",
  }),

  delete: (): BulkAction => ({
    id: "delete",
    label: "Delete",
    icon: <Trash className="h-4 w-4" />,
    variant: "destructive",
    confirmMessage:
      "Are you sure you want to permanently delete the selected candidates? This action cannot be undone.",
  }),

  favorite: (): BulkAction => ({
    id: "favorite",
    label: "Star",
    icon: <Star className="h-4 w-4" />,
  }),
};

/* ============================================
   Exports
   ============================================ */
export {
  BulkActionsToolbar,
  SelectableItem,
  atsBulkActions,
};

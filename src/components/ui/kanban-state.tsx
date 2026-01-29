"use client";

import * as React from "react";

/**
 * Kanban State Management Hook
 *
 * Separated from kanban-dnd.tsx to avoid pulling in @dnd-kit dependencies
 * when only the state management is needed.
 */

// ============================================
// TYPES (copied to avoid circular dependencies)
// ============================================

export type UniqueIdentifier = string | number;

export interface KanbanItem<T = unknown> {
  id: UniqueIdentifier;
  columnId: UniqueIdentifier;
  /** Content to render inside the card */
  content: React.ReactNode;
  /** Optional data payload for the item */
  data?: T;
}

// ============================================
// HOOK: useKanbanState
// ============================================

/**
 * Hook to manage Kanban board state with optimistic updates
 */
export interface UseKanbanStateOptions<T extends KanbanItem> {
  initialItems: T[];
  onMoveItem?: (
    itemId: UniqueIdentifier,
    fromColumnId: UniqueIdentifier,
    toColumnId: UniqueIdentifier
  ) => Promise<void>;
}

export function useKanbanState<T extends KanbanItem>({
  initialItems,
  onMoveItem,
}: UseKanbanStateOptions<T>) {
  const [items, setItems] = React.useState<T[]>(initialItems);
  const [isMoving, setIsMoving] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Keep items in sync with initialItems
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleItemsChange = React.useCallback(
    async (newItems: KanbanItem[]) => {
      // Optimistic update
      setItems(newItems as T[]);
      setError(null);
    },
    []
  );

  const handleDragEnd = React.useCallback(
    async (event: {
      itemId: UniqueIdentifier;
      fromColumnId: UniqueIdentifier;
      toColumnId: UniqueIdentifier;
    }) => {
      if (!onMoveItem) return;

      if (event.fromColumnId !== event.toColumnId) {
        setIsMoving(true);
        try {
          await onMoveItem(event.itemId, event.fromColumnId, event.toColumnId);
        } catch (err) {
          // Revert on error
          setItems(initialItems);
          setError(err instanceof Error ? err : new Error("Failed to move item"));
        } finally {
          setIsMoving(false);
        }
      }
    },
    [onMoveItem, initialItems]
  );

  return {
    items,
    setItems,
    handleItemsChange,
    handleDragEnd,
    isMoving,
    error,
  };
}

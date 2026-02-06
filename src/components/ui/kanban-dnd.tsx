"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
  type CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import {
  KanbanBoard,
  KanbanColumn,
  KanbanEmpty,
  KanbanDropPlaceholder,
  type KanbanStageType,
} from "./kanban";

/**
 * Kanban DnD Components
 *
 * Provides drag-and-drop functionality for the Kanban board using @dnd-kit.
 * Wraps the presentational Kanban components with interactive behavior.
 */

// ============================================
// TYPES
// ============================================

// Re-export KanbanItem from kanban-state to ensure type compatibility
export { type KanbanItem } from "./kanban-state";
import { type KanbanItem } from "./kanban-state";

export interface KanbanColumnData {
  id: UniqueIdentifier;
  title: string;
  stage?: KanbanStageType;
  color?: string;
  icon?: React.ReactNode;
}

export interface DndKanbanBoardProps {
  /** Column definitions */
  columns: KanbanColumnData[];
  /** Items to display in the board */
  items: KanbanItem[];
  /** Callback when items are reordered or moved between columns */
  onItemsChange: (items: KanbanItem[]) => void;
  /** Callback when a drag operation completes */
  onDragEnd?: (event: {
    itemId: UniqueIdentifier;
    fromColumnId: UniqueIdentifier;
    toColumnId: UniqueIdentifier;
    fromIndex: number;
    toIndex: number;
  }) => void;
  /** Render function for the drag overlay */
  renderDragOverlay?: (item: KanbanItem) => React.ReactNode;
  /** Whether the board is in a loading state */
  loading?: boolean;
  /** Empty state message for columns */
  emptyMessage?: string;
  /** Custom class for the board container */
  className?: string;
  /** Custom class applied to each column */
  columnClassName?: string;
  /** Header actions slot for columns */
  columnHeaderActions?: (columnId: UniqueIdentifier) => React.ReactNode;
}

// ============================================
// CUSTOM COLLISION DETECTION
// ============================================

/**
 * Custom collision detection that prioritizes:
 * 1. Pointer within droppable areas
 * 2. Rectangle intersection
 * 3. Closest corners as fallback
 */
const customCollisionDetection: CollisionDetection = (args) => {
  // First, check if pointer is within a droppable
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // Then check rectangle intersection
  const rectCollisions = rectIntersection(args);
  if (rectCollisions.length > 0) {
    return rectCollisions;
  }

  // Fall back to closest corners
  return closestCorners(args);
};

// ============================================
// SORTABLE CARD COMPONENT
// ============================================

interface SortableCardProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  disabled?: boolean;
}

const SortableCard = ({ id, children, disabled = false }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({
      id,
      disabled,
    });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Render a transparent DnD wrapper. The visual card styling is provided
  // by the consumer's content (e.g. CandidateCard) to avoid double card nesting.
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing",
        isDragging && "z-50",
        isOver && "rounded-xl ring-2 ring-[var(--border-brand)] ring-offset-2"
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

// ============================================
// DROPPABLE COLUMN COMPONENT
// ============================================

interface DroppableColumnProps {
  column: KanbanColumnData;
  items: KanbanItem[];
  headerActions?: React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

const DroppableColumn = ({
  column,
  items,
  headerActions,
  emptyMessage = "No candidates",
  className,
}: DroppableColumnProps) => {
  const itemIds = items.map((item) => item.id);

  // Register column itself as a droppable zone so items can be
  // dragged into empty columns and cross-column drops are detected.
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <KanbanColumn
        ref={setNodeRef}
        title={column.title}
        count={items.length}
        stage={column.stage}
        color={column.color}
        icon={column.icon}
        headerActions={headerActions}
        className={cn(className, isOver && "bg-[var(--background-interactive-hover)]")}
        data-column-id={column.id}
      >
        {items.length === 0 ? (
          <KanbanEmpty message={emptyMessage} />
        ) : (
          items.map((item) => (
            <SortableCard key={item.id} id={item.id}>
              {item.content}
            </SortableCard>
          ))
        )}
      </KanbanColumn>
    </SortableContext>
  );
};

// ============================================
// MAIN DND KANBAN BOARD
// ============================================

export const DndKanbanBoard = ({
  columns,
  items,
  onItemsChange,
  onDragEnd,
  renderDragOverlay,
  loading = false,
  emptyMessage,
  className,
  columnClassName,
  columnHeaderActions,
}: DndKanbanBoardProps) => {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  // Track which column the item was originally in before the drag started.
  // handleDragOver updates the item's columnId mid-drag, so we need this
  // to report the correct fromColumnId in the onDragEnd callback.
  const [originColumnId, setOriginColumnId] = React.useState<UniqueIdentifier | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  // Ensure we only render DnD context on client
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Configure sensors for mouse/touch and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get items for a specific column
  const getColumnItems = (columnId: UniqueIdentifier) => {
    return items.filter((item) => item.columnId === columnId);
  };

  // Find which column an item belongs to
  const findColumnForItem = (itemId: UniqueIdentifier) => {
    const item = items.find((i) => i.id === itemId);
    return item?.columnId;
  };

  // Get the active item being dragged
  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    setActiveId(id);
    setOriginColumnId(findColumnForItem(id) ?? null);
  };

  // Handle drag over (for moving between columns)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the columns
    const activeColumn = findColumnForItem(activeId);

    // Check if we're over a column or an item
    const isOverColumn = columns.some((col) => col.id === overId);
    const overColumn = isOverColumn ? overId : findColumnForItem(overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) {
      return;
    }

    // Move item to new column
    const newItems = items.map((item) => {
      if (item.id === activeId) {
        return { ...item, columnId: overColumn };
      }
      return item;
    });

    onItemsChange(newItems);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const dragOriginColumn = originColumnId;
    setActiveId(null);
    setOriginColumnId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // The item may have already been moved to a new column by handleDragOver,
    // so activeColumn reflects the CURRENT column (possibly the target).
    const activeColumn = findColumnForItem(activeId);

    // Check if we're over a column or an item
    const isOverColumn = columns.some((col) => col.id === overId);
    const overColumn = isOverColumn ? overId : findColumnForItem(overId);

    if (!activeColumn || !overColumn) return;

    // Get items in the target column
    const columnItems = getColumnItems(overColumn);
    const oldIndex = columnItems.findIndex((item) => item.id === activeId);
    const newIndex = isOverColumn
      ? columnItems.length // Add to end if dropping on column
      : columnItems.findIndex((item) => item.id === overId);

    // Use the original column (before drag started) for the callback
    const originalFromColumn = dragOriginColumn ?? activeColumn;
    const columnChanged = originalFromColumn !== overColumn;

    if (oldIndex !== newIndex || columnChanged) {
      // Reorder within the same column or after moving to new column
      const reorderedColumnItems = arrayMove(
        columnItems,
        oldIndex >= 0 ? oldIndex : columnItems.length - 1,
        newIndex >= 0 ? newIndex : columnItems.length - 1
      );

      // Rebuild the full items array with the new order
      const otherItems = items.filter((item) => item.columnId !== overColumn);

      const newItems = [...otherItems, ...reorderedColumnItems];

      onItemsChange(newItems);

      // Fire callback with the ORIGINAL column as fromColumnId
      if (onDragEnd) {
        const fromIndex = items.findIndex((item) => item.id === activeId);
        const toIndex = newItems.findIndex((item) => item.id === activeId);

        onDragEnd({
          itemId: activeId,
          fromColumnId: originalFromColumn,
          toColumnId: overColumn,
          fromIndex,
          toIndex,
        });
      }
    }
  };

  if (loading || !isMounted) {
    return (
      <KanbanBoard loading skeletonColumns={columns.length} className={className}>
        {null}
      </KanbanBoard>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <KanbanBoard className={className}>
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            items={getColumnItems(column.id)}
            headerActions={columnHeaderActions?.(column.id)}
            emptyMessage={emptyMessage}
            className={columnClassName}
          />
        ))}
      </KanbanBoard>

      {/* Drag Overlay - Shows a preview while dragging */}
      <DragOverlay
        dropAnimation={{
          duration: 200,
          easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
        }}
      >
        {activeItem && (
          <div className="rotate-3 scale-105 opacity-90">
            {renderDragOverlay ? renderDragOverlay(activeItem) : activeItem.content}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

// ============================================
// RE-EXPORTS FROM KANBAN-STATE
// ============================================

// Re-export the state hook and types from the separate file
// to avoid breaking existing imports
export { useKanbanState, type UseKanbanStateOptions } from "./kanban-state";

// ============================================
// EXPORTS
// ============================================

export { SortableCard, DroppableColumn };

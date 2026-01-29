/**
 * DataTable Module
 *
 * Unified DataTable component system with shared types, primitives,
 * and helper components.
 *
 * Usage:
 * ```tsx
 * import { DataTable, Column, BulkAction } from "@/components/ui/data-table";
 * import { StageBadge, MatchScore } from "@/components/ui/data-table/helpers";
 * ```
 */

// ============================================
// Types (single source of truth)
// ============================================

export type {
  // Core types
  TableDensity,
  Column,
  BulkAction,
  RowAction,
  SortConfig,
  // Filter types
  ColumnFilterType,
  ColumnFilterConfig,
  ColumnFilterValue,
  ActiveFilter,
  // Editable cell types
  EditableCellType,
  EditableCellConfig,
  // Field types (enhanced)
  FieldType,
  // View types (enhanced)
  ViewType,
  QuickFilter,
  SavedView,
  // Pagination
  PaginationState,
  // Selection
  SelectionState,
  // ATS types
  CandidateStage,
  CandidateSource,
  DecisionType,
  CandidateReviewer,
  Candidate,
  StageConfig,
  SourceConfig,
  DecisionConfig,
  // Expansion
  RowExpansionPanelProps,
} from "./types";

// ============================================
// Table Primitives
// ============================================

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableLink,
  type TableRootProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
  type TableLinkProps,
} from "./primitives";

// ============================================
// Shared Components
// ============================================

export {
  // Bulk actions
  BulkActionsToolbar,
  CompactBulkActions,
  type BulkActionsToolbarProps,
  type CompactBulkActionsProps,
  // Row actions
  RowActionsCell,
  QuickActionsRow,
  type RowActionsCellProps,
  type QuickActionsRowProps,
  // Column filters
  ColumnFilterPopover,
  FilterChip,
  ActiveFiltersDisplay,
  type ColumnFilterPopoverProps,
  type FilterChipProps,
  type ActiveFiltersDisplayProps,
  // Column visibility
  ColumnVisibilityMenu,
  type ColumnVisibilityMenuProps,
  // Pagination
  TablePagination,
  SimplePagination,
  type TablePaginationProps,
  type SimplePaginationProps,
  // Skeletons
  SkeletonCell,
  SkeletonRow,
  SkeletonRows,
  SkeletonTable,
  type SkeletonCellProps,
  type SkeletonRowProps,
  type SkeletonRowsProps,
  type SkeletonTableProps,
} from "./components";

// ============================================
// ATS Helpers
// ============================================

export {
  // Components
  StageBadge,
  SourceBadge,
  MatchScore,
  MatchScoreDisplay,
  DaysInStage,
  NextAction,
  ReviewersDisplay,
  DecisionPill,
  // Configurations
  stageConfig,
  stageVariantMap,
  sourceConfig,
  decisionConfig,
  // Utility functions
  getStageConfig,
  getSourceConfig,
  getDecisionConfig,
  calculateDaysAgo,
  getMatchScoreColor,
  getMatchScoreLabel,
  // Types
  type StageBadgeProps,
  type SourceBadgeProps,
  type MatchScoreProps,
  type DaysInStageProps,
  type NextActionProps,
  type ReviewersDisplayProps,
  type DecisionPillProps,
} from "./helpers";

// ============================================
// Backward Compatibility Note
// ============================================

/**
 * The full DataTable and EnhancedDataTable components are still in
 * the parent directory for backward compatibility:
 *
 * - ../data-table.tsx - Full DataTable with all features
 * - ../data-table-enhanced.tsx - Enhanced version with views, quick filters
 * - ../candidate-table.tsx - ATS-specific wrapper
 *
 * These will be gradually migrated to use the shared modules above.
 *
 * For now, import the main components from @/components/ui:
 * ```tsx
 * import { DataTable, EnhancedDataTable, CandidateTable } from "@/components/ui";
 * ```
 */

/**
 * DataTable Shared Types
 *
 * Single source of truth for all DataTable-related type definitions.
 * Used by DataTable, EnhancedDataTable, and CandidateTable.
 */

import * as React from "react";

// ============================================
// Table Density
// ============================================

export type TableDensity = "compact" | "default" | "comfortable";

// ============================================
// Column Filter Types
// ============================================

export type ColumnFilterType = "text" | "select" | "multiSelect" | "number" | "date" | "dateRange";

export interface ColumnFilterConfig {
  /** Filter type */
  type: ColumnFilterType;
  /** Options for select/multiSelect filter */
  options?: { label: string; value: string; icon?: React.ReactNode }[];
  /** Placeholder text */
  placeholder?: string;
}

export type ColumnFilterValue =
  | string
  | string[]
  | number
  | { min?: number; max?: number }
  | { start?: Date; end?: Date }
  | null;

export interface ActiveFilter {
  columnId: string;
  columnHeader: string;
  value: ColumnFilterValue;
  type: ColumnFilterType;
}

// ============================================
// Editable Cell Types
// ============================================

export type EditableCellType = "text" | "number" | "select" | "date";

export interface EditableCellConfig {
  /** Type of editor to show */
  type: EditableCellType;
  /** Options for select type */
  options?: { label: string; value: string }[];
  /** Placeholder text */
  placeholder?: string;
  /** Validation function - return error message or undefined if valid */
  validate?: (value: unknown) => string | undefined;
}

// ============================================
// Field Types (for Enhanced DataTable)
// ============================================

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "select"
  | "multiSelect"
  | "user"
  | "badge"
  | "link"
  | "email"
  | "phone"
  | "currency"
  | "percent"
  | "rating"
  | "checkbox"
  | "progress";

// ============================================
// Column Configuration
// ============================================

export interface Column<T> {
  /** Unique column identifier */
  id: string;
  /** Column header text */
  header: string;
  /** Object key to access data */
  accessorKey?: keyof T;
  /** Function to access data */
  accessorFn?: (row: T) => React.ReactNode;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Include in search filter (default: true) */
  filterable?: boolean;
  /** Column filter configuration */
  filterConfig?: ColumnFilterConfig;
  /** Custom cell renderer */
  cell?: (row: T) => React.ReactNode;
  /** Column cell className */
  className?: string;
  /** Column width (e.g., "200px", "20%") */
  width?: string;
  /** Minimum width */
  minWidth?: string;
  /** Make column sticky */
  sticky?: boolean;
  /** Pin column to left or right */
  pinned?: "left" | "right";
  /** Column is visible by default (default: true) */
  defaultVisible?: boolean;
  /** Enable inline editing for this column */
  editable?: boolean;
  /** Configuration for editable cell */
  editConfig?: EditableCellConfig;
  /** Enable column resizing */
  resizable?: boolean;
  /** Field type for enhanced rendering */
  fieldType?: FieldType;
}

// ============================================
// Bulk Action Types
// ============================================

export interface BulkAction<T> {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Action handler - receives selected rows */
  onAction: (selectedRows: T[]) => void;
  /** Variant for styling */
  variant?: "default" | "destructive";
  /** Show in primary toolbar or overflow menu */
  showInToolbar?: boolean;
  /** Keyboard shortcut hint */
  shortcut?: string;
}

// ============================================
// Row Action Types
// ============================================

export interface RowAction<T> {
  /** Unique action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: React.ReactNode;
  /** Action handler - receives the row */
  onAction: (row: T) => void;
  /** Variant for styling */
  variant?: "default" | "destructive";
  /** Whether this action should be hidden for certain rows */
  hidden?: (row: T) => boolean;
  /** Whether this action should be disabled for certain rows */
  disabled?: (row: T) => boolean;
}

// ============================================
// View Types (for Enhanced DataTable)
// ============================================

export type ViewType = "table" | "kanban" | "calendar" | "cards" | "list";

export interface QuickFilter {
  /** Unique filter identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Filter values to apply */
  filters: Record<string, ColumnFilterValue>;
  /** Optional sort to apply with filter */
  sort?: { key: string; direction: "asc" | "desc" };
  /** Badge count (optional) */
  count?: number;
}

export interface SavedView {
  /** Unique view identifier */
  id: string;
  /** View name */
  name: string;
  /** Column visibility */
  visibleColumns?: string[];
  /** Column order */
  columnOrder?: string[];
  /** Applied filters */
  filters?: Record<string, ColumnFilterValue>;
  /** Sort configuration */
  sort?: { key: string; direction: "asc" | "desc" } | null;
  /** View type */
  viewType?: ViewType;
  /** Whether this is the default view */
  isDefault?: boolean;
  /** Creation timestamp */
  createdAt?: Date;
}

// ============================================
// Sort Configuration
// ============================================

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ============================================
// Selection Types
// ============================================

export interface SelectionState<T> {
  selectedRows: Set<string>;
  selectedRowObjects: T[];
  isAllSelected: boolean;
  isSomeSelected: boolean;
}

// ============================================
// ATS-Specific Types
// ============================================

export type CandidateStage =
  | "new"
  | "applied"
  | "screening"
  | "interview"
  | "assessment"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn";

export type CandidateSource =
  | "green_jobs_board"
  | "linkedin"
  | "indeed"
  | "referral"
  | "website"
  | "other";

export type DecisionType = "strong_yes" | "yes" | "maybe" | "no" | "pending";

export interface CandidateReviewer {
  id: string;
  name: string;
  avatar?: string;
  decision: DecisionType;
}

export interface Candidate extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  yearsExperience?: number;
  stage: CandidateStage;
  source: CandidateSource;
  matchScore?: number;
  appliedAt: Date | string;
  stageChangedAt?: Date | string;
  lastActivityAt?: Date | string;
  skills?: string[];
  greenSkills?: string[];
  certifications?: string[];
  tags?: string[];
  reviewers?: CandidateReviewer[];
  nextAction?: string;
  nextActionUrgent?: boolean;
  notes?: number;
  jobId?: string;
  jobTitle?: string;
}

// ============================================
// Stage Configuration Type
// ============================================

export interface StageConfig {
  label: string;
  variant: "secondary" | "info" | "default" | "warning" | "success" | "error";
  icon: React.ReactNode;
  color: string;
}

export interface SourceConfig {
  label: string;
  color: string;
}

export interface DecisionConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// ============================================
// Row Expansion Types
// ============================================

export interface RowExpansionPanelProps<T> {
  row: T | null;
  open: boolean;
  onClose: () => void;
  title?: string | ((row: T) => string);
  description?: string | ((row: T) => string);
  children: (row: T) => React.ReactNode;
  side?: "right" | "left";
  className?: string;
}

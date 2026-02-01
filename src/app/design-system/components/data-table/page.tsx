"use client";

import React from "react";
import {
  // Unified module imports (NEW - preferred)
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableLink,
  // Unified components
  UnifiedBulkActionsToolbar,
  UnifiedRowActionsCell,
  ColumnFilterPopover,
  FilterChip,
  UnifiedActiveFiltersDisplay,
  ColumnVisibilityMenu,
  TablePagination,
  UnifiedSkeletonTable,
  UnifiedSkeletonRows,
  // Unified ATS helpers
  UnifiedStageBadge,
  UnifiedSourceBadge,
  UnifiedMatchScore,
  UnifiedDaysInStage,
  UnifiedNextAction,
  UnifiedReviewersDisplay,
  UnifiedDecisionPill,
  unifiedStageConfig,
  unifiedSourceConfig,
  // Unified types
  type Column,
  type TableBulkAction,
  type RowAction,
  type TableDensity,
  type UnifiedCandidateStage,
  type UnifiedCandidateSource,
  type UnifiedSelectionState,
  type UnifiedSortConfig,
  type UnifiedPaginationState,
  // Legacy imports (DEPRECATED - for backward compatibility only)
  DataTable,
  EnhancedDataTable,
  TableStageBadge,
  TableMatchScore,
  TableDaysInStage,
  TableNextAction,
  createATSBulkActions,
  type QuickFilter,
  type SavedView,
  type ViewType,
  // UI primitives
  Badge,
  Avatar,
  Button,
  Checkbox,
  Input,
} from "@/components/ui";
import {
  Trash,
  Eye,
  EnvelopeSimple,
  Star,
  Clock,
  CheckCircle,
  Lightning,
  User,
  Warning,
  ArrowUp,
  ArrowDown,
  Funnel,
  DotsThree,
  CaretRight,
  CaretDown,
} from "@phosphor-icons/react";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
// Use a simple type for demo purposes to avoid type conflicts
type DemoFilterValue = string | null;

// ============================================
// SAMPLE DATA
// ============================================

interface Candidate {
  id: string;
  name: string;
  email: string;
  role: string;
  stage: string;
  matchScore: number;
  appliedDate: string;
  stageChangedDate?: string;
  nextAction?: string;
  source?: string;
  reviewers?: Array<{ id: string; name: string; avatar?: string }>;
  [key: string]: unknown;
}

const sampleCandidates: Candidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    role: "Solar Engineer",
    stage: "Interview",
    matchScore: 92,
    appliedDate: "2024-01-15",
    stageChangedDate: "2024-01-18",
    nextAction: "Schedule final interview",
    source: "LinkedIn",
    reviewers: [{ id: "r1", name: "John Doe" }],
  },
  {
    id: "2",
    name: "Marcus Johnson",
    email: "marcus@example.com",
    role: "Wind Technician",
    stage: "Screening",
    matchScore: 85,
    appliedDate: "2024-01-14",
    stageChangedDate: "2024-01-14",
    nextAction: "Review resume",
    source: "Referral",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    email: "elena@example.com",
    role: "ESG Analyst",
    stage: "Applied",
    matchScore: 78,
    appliedDate: "2024-01-13",
    nextAction: "Initial screening",
    source: "Website",
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james@example.com",
    role: "Sustainability Manager",
    stage: "Offer",
    matchScore: 95,
    appliedDate: "2024-01-12",
    stageChangedDate: "2024-01-20",
    nextAction: "Send offer letter",
    source: "Green Jobs Board",
  },
  {
    id: "5",
    name: "Aisha Patel",
    email: "aisha@example.com",
    role: "Carbon Analyst",
    stage: "Interview",
    matchScore: 88,
    appliedDate: "2024-01-11",
    stageChangedDate: "2024-01-15",
    nextAction: "Technical assessment",
    source: "LinkedIn",
  },
];

// ============================================
// PROPS DOCUMENTATION
// ============================================

// Unified Module Types
const unifiedModuleExports = [
  {
    name: "Table",
    type: "Component",
    default: "-",
    description: "Base table container with striped/hoverable/bordered options",
  },
  {
    name: "TableHeader",
    type: "Component",
    default: "-",
    description: "Table header wrapper (<thead>)",
  },
  {
    name: "TableBody",
    type: "Component",
    default: "-",
    description: "Table body wrapper (<tbody>)",
  },
  {
    name: "TableHead",
    type: "Component",
    default: "-",
    description: "Table header cell (<th>) with sorting support",
  },
  {
    name: "TableRow",
    type: "Component",
    default: "-",
    description: "Table row (<tr>) with selection and hover states",
  },
  {
    name: "TableCell",
    type: "Component",
    default: "-",
    description: "Table data cell (<td>) with density options",
  },
  {
    name: "TableCaption",
    type: "Component",
    default: "-",
    description: "Table caption for accessibility",
  },
  {
    name: "TableLink",
    type: "Component",
    default: "-",
    description: "Clickable link styled for table cells",
  },
];

const unifiedComponentExports = [
  {
    name: "BulkActionsToolbar",
    type: "Component",
    default: "-",
    description: "Toolbar shown when rows are selected with bulk actions",
  },
  {
    name: "CompactBulkActions",
    type: "Component",
    default: "-",
    description: "Compact variant of bulk actions for smaller spaces",
  },
  {
    name: "RowActionsCell",
    type: "Component",
    default: "-",
    description: "Row-level action buttons with dropdown overflow",
  },
  {
    name: "QuickActionsRow",
    type: "Component",
    default: "-",
    description: "Inline quick action buttons for rows",
  },
  {
    name: "ColumnFilterPopover",
    type: "Component",
    default: "-",
    description: "Filter popover for individual columns",
  },
  {
    name: "FilterChip",
    type: "Component",
    default: "-",
    description: "Active filter chip with remove button",
  },
  {
    name: "ActiveFiltersDisplay",
    type: "Component",
    default: "-",
    description: "Display all active filters with clear all",
  },
  {
    name: "ColumnVisibilityMenu",
    type: "Component",
    default: "-",
    description: "Dropdown to toggle column visibility",
  },
  {
    name: "TablePagination",
    type: "Component",
    default: "-",
    description: "Full pagination with page size selector",
  },
  {
    name: "SimplePagination",
    type: "Component",
    default: "-",
    description: "Minimal prev/next pagination",
  },
  {
    name: "SkeletonTable",
    type: "Component",
    default: "-",
    description: "Loading skeleton for entire table",
  },
  { name: "SkeletonRows", type: "Component", default: "-", description: "Loading skeleton rows" },
];

const unifiedATSHelperExports = [
  {
    name: "StageBadge",
    type: "Component",
    default: "-",
    description: "ATS stage badge with automatic color coding",
  },
  {
    name: "SourceBadge",
    type: "Component",
    default: "-",
    description: "Candidate source badge (LinkedIn, Referral, etc.)",
  },
  {
    name: "MatchScore",
    type: "Component",
    default: "-",
    description: "Match score with progress bar visualization",
  },
  {
    name: "MatchScoreDisplay",
    type: "Component",
    default: "-",
    description: "Compact match score display",
  },
  {
    name: "DaysInStage",
    type: "Component",
    default: "-",
    description: "Days in current stage with thresholds",
  },
  {
    name: "NextAction",
    type: "Component",
    default: "-",
    description: "Next action indicator with urgent flag",
  },
  {
    name: "ReviewersDisplay",
    type: "Component",
    default: "-",
    description: "Avatar stack of assigned reviewers",
  },
  {
    name: "DecisionPill",
    type: "Component",
    default: "-",
    description: "Hire/reject decision indicator",
  },
];

const unifiedTypeExports = [
  {
    name: "Column<T>",
    type: "Type",
    default: "-",
    description: "Column configuration with sorting, filtering, cell rendering",
  },
  { name: "BulkAction<T>", type: "Type", default: "-", description: "Bulk action configuration" },
  { name: "RowAction<T>", type: "Type", default: "-", description: "Row action configuration" },
  { name: "SortConfig", type: "Type", default: "-", description: "Sort state: { key, direction }" },
  {
    name: "PaginationState",
    type: "Type",
    default: "-",
    description: "Pagination state: { page, pageSize, total }",
  },
  {
    name: "SelectionState",
    type: "Type",
    default: "-",
    description: "Selection state: { selected, allSelected }",
  },
  {
    name: "ColumnFilterConfig",
    type: "Type",
    default: "-",
    description: "Filter config: { type, options, placeholder }",
  },
  { name: "ColumnFilterValue", type: "Type", default: "-", description: "Filter value union type" },
  {
    name: "ActiveFilter",
    type: "Type",
    default: "-",
    description: "Active filter: { columnId, columnHeader, value }",
  },
  {
    name: "TableDensity",
    type: "Type",
    default: "-",
    description: '"compact" | "default" | "comfortable"',
  },
  { name: "CandidateStage", type: "Type", default: "-", description: "ATS stage type" },
  { name: "CandidateSource", type: "Type", default: "-", description: "Candidate source type" },
  { name: "DecisionType", type: "Type", default: "-", description: "Hire/reject decision type" },
];

const tablePrimitiveProps = [
  { name: "striped", type: "boolean", default: "false", description: "Enable striped rows" },
  {
    name: "hoverable",
    type: "boolean",
    default: "false",
    description: "Enable hover state on rows",
  },
  {
    name: "bordered",
    type: "boolean",
    default: "true",
    description: "Add border around the table",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

const tableHeadProps = [
  {
    name: "sortable",
    type: "boolean",
    default: "false",
    description: "Enable sorting for this column",
  },
  {
    name: "sorted",
    type: '"asc" | "desc" | false',
    default: "false",
    description: "Current sort direction",
  },
  { name: "onSort", type: "() => void", default: "undefined", description: "Sort click handler" },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

const tableRowProps = [
  { name: "selected", type: "boolean", default: "false", description: "Row is selected" },
  { name: "hoverable", type: "boolean", default: "true", description: "Enable hover state" },
  { name: "onClick", type: "() => void", default: "undefined", description: "Row click handler" },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

const tableCellProps = [
  {
    name: "density",
    type: '"compact" | "default" | "comfortable"',
    default: '"default"',
    description: "Cell padding density",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Additional CSS classes",
  },
];

const bulkActionsToolbarProps = [
  {
    name: "selectedCount",
    type: "number",
    default: "required",
    description: "Number of selected rows",
  },
  { name: "totalCount", type: "number", default: "required", description: "Total number of rows" },
  {
    name: "actions",
    type: "BulkAction<T>[]",
    default: "required",
    description: "Available bulk actions",
  },
  { name: "selectedRows", type: "T[]", default: "required", description: "Selected row objects" },
  {
    name: "onClearSelection",
    type: "() => void",
    default: "required",
    description: "Clear selection callback",
  },
  {
    name: "onSelectAll",
    type: "() => void",
    default: "required",
    description: "Select all callback",
  },
  {
    name: "allSelected",
    type: "boolean",
    default: "required",
    description: "Whether all rows are selected",
  },
];

const rowActionsCellProps = [
  {
    name: "actions",
    type: "RowAction<T>[]",
    default: "required",
    description: "Available row actions",
  },
  { name: "row", type: "T", default: "required", description: "Row data object" },
  {
    name: "maxInline",
    type: "number",
    default: "2",
    description: "Max actions before overflow menu",
  },
];

const columnFilterPopoverProps = [
  { name: "column", type: "Column<T>", default: "required", description: "Column configuration" },
  {
    name: "value",
    type: "ColumnFilterValue",
    default: "required",
    description: "Current filter value",
  },
  {
    name: "onChange",
    type: "(value: ColumnFilterValue) => void",
    default: "required",
    description: "Filter change callback",
  },
  { name: "data", type: "T[]", default: "[]", description: "Data for auto-detecting options" },
];

const paginationProps = [
  {
    name: "currentPage",
    type: "number",
    default: "required",
    description: "Current page (1-indexed)",
  },
  { name: "totalPages", type: "number", default: "required", description: "Total number of pages" },
  { name: "pageSize", type: "number", default: "required", description: "Items per page" },
  { name: "totalItems", type: "number", default: "required", description: "Total number of items" },
  {
    name: "onPageChange",
    type: "(page: number) => void",
    default: "required",
    description: "Page change callback",
  },
  {
    name: "onPageSizeChange",
    type: "(size: number) => void",
    default: "undefined",
    description: "Page size change callback",
  },
  {
    name: "pageSizeOptions",
    type: "number[]",
    default: "[10, 25, 50, 100]",
    description: "Available page sizes",
  },
];

const stageBadgeProps = [
  { name: "stage", type: "CandidateStage", default: "required", description: "Stage value" },
  { name: "size", type: '"sm" | "default"', default: '"default"', description: "Badge size" },
  { name: "showIcon", type: "boolean", default: "true", description: "Show stage icon" },
];

const matchScoreProps = [
  { name: "score", type: "number", default: "required", description: "Score value (0-100)" },
  { name: "showLabel", type: "boolean", default: "true", description: "Show text label" },
  {
    name: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Display size",
  },
];

const daysInStageProps = [
  {
    name: "appliedDate",
    type: "string",
    default: "required",
    description: "Application date (ISO string)",
  },
  {
    name: "stageChangedDate",
    type: "string",
    default: "undefined",
    description: "Date stage changed",
  },
  {
    name: "warningThreshold",
    type: "number",
    default: "7",
    description: "Days before warning color",
  },
  {
    name: "dangerThreshold",
    type: "number",
    default: "14",
    description: "Days before danger color",
  },
];

// Legacy DataTable props (deprecated)
const legacyDataTableProps = [
  { name: "data", type: "T[]", default: "required", description: "Array of data objects" },
  {
    name: "columns",
    type: "Column<T>[]",
    default: "required",
    description: "Column configuration",
  },
  { name: "selectable", type: "boolean", default: "false", description: "Enable row selection" },
  { name: "searchable", type: "boolean", default: "false", description: "Enable search input" },
  { name: "paginated", type: "boolean", default: "false", description: "Enable pagination" },
  { name: "loading", type: "boolean", default: "false", description: "Show loading state" },
  {
    name: "bulkActions",
    type: "BulkAction<T>[]",
    default: "[]",
    description: "Bulk actions for selected rows",
  },
  { name: "rowActions", type: "RowAction<T>[]", default: "[]", description: "Per-row actions" },
];

const columnProps = [
  { name: "id", type: "string", default: "required", description: "Unique column identifier" },
  { name: "header", type: "string", default: "required", description: "Column header text" },
  {
    name: "accessorKey",
    type: "keyof T",
    default: "undefined",
    description: "Object key to access data",
  },
  {
    name: "accessorFn",
    type: "(row: T) => ReactNode",
    default: "undefined",
    description: "Function to access data",
  },
  { name: "sortable", type: "boolean", default: "false", description: "Enable sorting" },
  { name: "filterable", type: "boolean", default: "true", description: "Include in search filter" },
  {
    name: "filterConfig",
    type: "ColumnFilterConfig",
    default: "undefined",
    description: "Column filter configuration",
  },
  {
    name: "cell",
    type: "(row: T) => ReactNode",
    default: "undefined",
    description: "Custom cell renderer",
  },
  { name: "width", type: "string", default: "undefined", description: "Column width" },
  { name: "sticky", type: "boolean", default: "false", description: "Make column sticky" },
  { name: "defaultVisible", type: "boolean", default: "true", description: "Visible by default" },
  { name: "editable", type: "boolean", default: "false", description: "Enable inline editing" },
];

export default function DataTablePage() {
  // State for demos
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterValues, setFilterValues] = React.useState<Record<string, DemoFilterValue>>({});
  const [visibleColumns, setVisibleColumns] = React.useState<Set<string>>(
    new Set(["name", "role", "stage", "matchScore", "appliedDate"])
  );

  // Sorted data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return sampleCandidates;
    return [...sampleCandidates].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof Candidate];
      const bVal = b[sortConfig.key as keyof Candidate];
      if (aVal === bVal) return 0;
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [sortConfig]);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  // Handle row selection
  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Sample bulk actions
  const sampleBulkActions = [
    {
      id: "email",
      label: "Send Email",
      icon: <EnvelopeSimple className="h-4 w-4" />,
      // eslint-disable-next-line no-console
      onAction: (rows: Candidate[]) => console.log("Email:", rows),
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      // eslint-disable-next-line no-console
      onAction: (rows: Candidate[]) => console.log("Delete:", rows),
      variant: "destructive" as const,
    },
  ];

  // Sample row actions
  const sampleRowActions = [
    {
      id: "view",
      label: "View Details",
      icon: <Eye className="h-4 w-4" />,
      // eslint-disable-next-line no-console
      onAction: (row: Candidate) => console.log("View:", row),
    },
    {
      id: "email",
      label: "Send Email",
      icon: <EnvelopeSimple className="h-4 w-4" />,
      // eslint-disable-next-line no-console
      onAction: (row: Candidate) => console.log("Email:", row),
    },
  ];

  // Sample columns
  const columns: Column<Candidate>[] = [
    {
      id: "name",
      header: "Candidate",
      accessorKey: "name",
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-[var(--foreground-muted)]">{row.email}</div>
          </div>
        </div>
      ),
    },
    { id: "role", header: "Role", accessorKey: "role", sortable: true },
    {
      id: "stage",
      header: "Stage",
      accessorKey: "stage",
      sortable: true,
      cell: (row) => <UnifiedStageBadge stage={row.stage as UnifiedCandidateStage} />,
    },
    {
      id: "matchScore",
      header: "Match",
      accessorKey: "matchScore",
      sortable: true,
      cell: (row) => <UnifiedMatchScore score={row.matchScore} />,
    },
    { id: "appliedDate", header: "Applied", accessorKey: "appliedDate", sortable: true },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-heading-lg text-foreground">Data Table</h1>
        <p className="max-w-2xl text-body text-foreground-muted">
          A modular, composable data table system with primitives, shared components, and
          ATS-specific helpers. Build custom tables with full control or use the pre-built DataTable
          component.
        </p>
      </div>

      {/* Deprecation Notice */}
      <div className="rounded-lg border border-[var(--border-warning)] bg-[var(--background-warning)] p-4">
        <div className="flex items-start gap-3">
          <Warning className="mt-0.5 h-5 w-5 text-[var(--foreground-warning)]" weight="fill" />
          <div>
            <h3 className="font-semibold text-[var(--foreground-warning)]">Migration Notice</h3>
            <p className="mt-1 text-sm text-[var(--foreground-default)]">
              The unified data-table module at{" "}
              <code className="rounded bg-[var(--background-muted)] px-1.5 py-0.5 text-xs">
                @/components/ui/data-table
              </code>{" "}
              is the recommended approach. Direct imports from{" "}
              <code className="rounded bg-[var(--background-muted)] px-1.5 py-0.5 text-xs">
                data-table.tsx
              </code>
              ,
              <code className="rounded bg-[var(--background-muted)] px-1.5 py-0.5 text-xs">
                data-table-enhanced.tsx
              </code>
              , and
              <code className="rounded bg-[var(--background-muted)] px-1.5 py-0.5 text-xs">
                candidate-table.tsx
              </code>{" "}
              are deprecated and will be removed in a future version.
            </p>
            <div className="mt-3 text-sm">
              <strong>New imports:</strong>
              <pre className="mt-2 overflow-x-auto rounded bg-[var(--background-muted)] p-3 text-xs">
                {`// Preferred - import from unified module
import {
  Table, TableHeader, TableBody, TableRow, TableCell,
  StageBadge, MatchScore, BulkActionsToolbar,
  type Column, type BulkAction
} from "@/components/ui/data-table";

// Or via main UI index with Unified prefix
import {
  UnifiedStageBadge,
  UnifiedMatchScore
} from "@/components/ui";`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Module Overview */}
      <ComponentCard
        id="module-overview"
        title="Module Structure"
        description="The data-table module is organized into primitives, components, and helpers"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
              <h4 className="mb-2 font-semibold text-[var(--foreground-default)]">Primitives</h4>
              <p className="mb-3 text-sm text-[var(--foreground-muted)]">
                Low-level table building blocks for custom implementations.
              </p>
              <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
                <li>• Table, TableHeader, TableBody</li>
                <li>• TableRow, TableHead, TableCell</li>
                <li>• TableCaption, TableLink</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
              <h4 className="mb-2 font-semibold text-[var(--foreground-default)]">Components</h4>
              <p className="mb-3 text-sm text-[var(--foreground-muted)]">
                Reusable UI components for common table features.
              </p>
              <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
                <li>• BulkActionsToolbar</li>
                <li>• RowActionsCell</li>
                <li>• ColumnFilterPopover</li>
                <li>• Pagination, SkeletonTable</li>
              </ul>
            </div>
            <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
              <h4 className="mb-2 font-semibold text-[var(--foreground-default)]">ATS Helpers</h4>
              <p className="mb-3 text-sm text-[var(--foreground-muted)]">
                Domain-specific components for ATS workflows.
              </p>
              <ul className="space-y-1 text-xs text-[var(--foreground-muted)]">
                <li>• StageBadge, SourceBadge</li>
                <li>• MatchScore, DaysInStage</li>
                <li>• ReviewersDisplay, DecisionPill</li>
              </ul>
            </div>
          </div>

          <CodePreview
            code={`// Import structure
import {
  // Primitives
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,

  // Components
  BulkActionsToolbar, RowActionsCell, ColumnFilterPopover,
  TablePagination, SkeletonTable,

  // ATS Helpers
  StageBadge, SourceBadge, MatchScore, DaysInStage,

  // Types
  type Column, type BulkAction, type RowAction,
  type CandidateStage, type SortConfig,
} from "@/components/ui/data-table";`}
          >
            <div className="text-sm text-[var(--foreground-muted)]">
              See the import example above for the full module structure.
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* Table Primitives */}
      <ComponentCard
        id="primitives"
        title="Table Primitives"
        description="Build custom tables with full control using low-level primitives"
      >
        <CodePreview
          code={`import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/data-table";

<Table striped hoverable>
  <TableHeader>
    <TableRow>
      <TableHead sortable sorted="asc" onSort={() => handleSort("name")}>Name</TableHead>
      <TableHead sortable onSort={() => handleSort("role")}>Role</TableHead>
      <TableHead>Stage</TableHead>
      <TableHead>Match</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id} selected={selectedRows.has(row.id)}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.role}</TableCell>
        <TableCell><StageBadge stage={row.stage} /></TableCell>
        <TableCell><MatchScore score={row.matchScore} /></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
        >
          <Table striped hoverable className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead
                  sortable
                  sorted={sortConfig?.key === "name" ? sortConfig.direction : false}
                  onSort={() => handleSort("name")}
                >
                  Name
                </TableHead>
                <TableHead
                  sortable
                  sorted={sortConfig?.key === "role" ? sortConfig.direction : false}
                  onSort={() => handleSort("role")}
                >
                  Role
                </TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Match</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.slice(0, 5).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={row.name} size="sm" />
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <UnifiedStageBadge stage={row.stage as UnifiedCandidateStage} />
                  </TableCell>
                  <TableCell>
                    <UnifiedMatchScore score={row.matchScore} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CodePreview>
      </ComponentCard>

      {/* ATS Helper Components */}
      <ComponentCard
        id="ats-helpers"
        title="ATS Helper Components"
        description="Domain-specific components for ATS candidate tables"
      >
        <div className="space-y-8">
          {/* StageBadge */}
          <div>
            <h4 className="mb-3 text-body-strong">StageBadge</h4>
            <div className="flex flex-wrap gap-3">
              <UnifiedStageBadge stage="new" />
              <UnifiedStageBadge stage="applied" />
              <UnifiedStageBadge stage="screening" />
              <UnifiedStageBadge stage="interview" />
              <UnifiedStageBadge stage="offer" />
              <UnifiedStageBadge stage="hired" />
              <UnifiedStageBadge stage="rejected" />
              <UnifiedStageBadge stage="withdrawn" />
            </div>
            <CodePreview
              code={`import { StageBadge } from "@/components/ui/data-table";

<StageBadge stage="interview" />
<StageBadge stage="offer" />
<StageBadge stage="hired" />`}
            >
              <div className="flex gap-3">
                <UnifiedStageBadge stage="interview" />
                <UnifiedStageBadge stage="offer" />
                <UnifiedStageBadge stage="hired" />
              </div>
            </CodePreview>
          </div>

          {/* SourceBadge */}
          <div>
            <h4 className="mb-3 text-body-strong">SourceBadge</h4>
            <div className="flex flex-wrap gap-3">
              <UnifiedSourceBadge source="linkedin" />
              <UnifiedSourceBadge source="referral" />
              <UnifiedSourceBadge source="website" />
              <UnifiedSourceBadge source="green_jobs_board" />
              <UnifiedSourceBadge source="indeed" />
              <UnifiedSourceBadge source="other" />
            </div>
          </div>

          {/* MatchScore */}
          <div>
            <h4 className="mb-3 text-body-strong">MatchScore</h4>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <UnifiedMatchScore score={95} />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">High (80+)</p>
              </div>
              <div className="text-center">
                <UnifiedMatchScore score={68} />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">Medium (50-79)</p>
              </div>
              <div className="text-center">
                <UnifiedMatchScore score={35} />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">Low (&lt;50)</p>
              </div>
            </div>
          </div>

          {/* DaysInStage */}
          <div>
            <h4 className="mb-3 text-body-strong">DaysInStage</h4>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <UnifiedDaysInStage appliedDate="2024-01-20" />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">Normal</p>
              </div>
              <div className="text-center">
                <UnifiedDaysInStage appliedDate="2024-01-10" warningThreshold={7} />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">Warning</p>
              </div>
              <div className="text-center">
                <UnifiedDaysInStage appliedDate="2024-01-01" dangerThreshold={14} />
                <p className="mt-1 text-xs text-[var(--foreground-muted)]">Danger</p>
              </div>
            </div>
          </div>

          {/* NextAction */}
          <div>
            <h4 className="mb-3 text-body-strong">NextAction</h4>
            <div className="flex flex-wrap items-center gap-4">
              <UnifiedNextAction action="Schedule interview" />
              <UnifiedNextAction action="Send offer letter" urgent />
            </div>
          </div>

          {/* DecisionPill */}
          <div>
            <h4 className="mb-3 text-body-strong">DecisionPill</h4>
            <div className="flex flex-wrap items-center gap-4">
              <UnifiedDecisionPill decision="strong_yes" />
              <UnifiedDecisionPill decision="yes" />
              <UnifiedDecisionPill decision="maybe" />
              <UnifiedDecisionPill decision="no" />
              <UnifiedDecisionPill decision="pending" />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* BulkActionsToolbar */}
      <ComponentCard
        id="bulk-actions"
        title="Bulk Actions Toolbar"
        description="Toolbar shown when rows are selected with available bulk actions"
      >
        <CodePreview
          code={`import { BulkActionsToolbar } from "@/components/ui/data-table";

<BulkActionsToolbar
  selectedCount={3}
  totalCount={100}
  actions={[
    { id: "email", label: "Send Email", icon: <EnvelopeSimple />, onAction: (rows) => {...} },
    { id: "delete", label: "Delete", icon: <Trash />, onAction: (rows) => {...}, variant: "destructive" },
  ]}
  selectedRows={selectedRows}
  onClearSelection={() => setSelectedRows(new Set())}
  onSelectAll={() => setSelectedRows(new Set(data.map(d => d.id)))}
  allSelected={false}
/>`}
        >
          <UnifiedBulkActionsToolbar
            selectedCount={3}
            totalCount={sampleCandidates.length}
            actions={sampleBulkActions}
            selectedRows={sampleCandidates.slice(0, 3)}
            onClearSelection={() => {}}
            onSelectAll={() => {}}
            allSelected={false}
          />
        </CodePreview>
      </ComponentCard>

      {/* RowActionsCell */}
      <ComponentCard
        id="row-actions"
        title="Row Actions Cell"
        description="Per-row action buttons with overflow menu"
      >
        <CodePreview
          code={`import { RowActionsCell } from "@/components/ui/data-table";

<RowActionsCell
  actions={[
    { id: "view", label: "View", icon: <Eye />, onAction: (row) => {...} },
    { id: "email", label: "Email", icon: <EnvelopeSimple />, onAction: (row) => {...} },
    { id: "delete", label: "Delete", icon: <Trash />, onAction: (row) => {...}, variant: "destructive" },
  ]}
  row={candidate}
  maxInline={2}
/>`}
        >
          <div className="flex items-center gap-4">
            <span className="text-sm">Sarah Chen</span>
            <UnifiedRowActionsCell
              actions={[
                ...sampleRowActions,
                {
                  id: "delete",
                  label: "Delete",
                  icon: <Trash className="h-4 w-4" />,
                  onAction: () => {},
                  variant: "destructive" as const,
                },
              ]}
              row={sampleCandidates[0]}
              maxInline={2}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Column Filters */}
      <ComponentCard
        id="column-filters"
        title="Column Filters"
        description="Filter popover for individual columns with various filter types"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Stage Filter:</span>
            <ColumnFilterPopover
              column={{
                id: "stage",
                header: "Stage",
                accessorKey: "stage",
                filterConfig: {
                  type: "select",
                  options: [
                    { label: "Applied", value: "Applied" },
                    { label: "Screening", value: "Screening" },
                    { label: "Interview", value: "Interview" },
                    { label: "Offer", value: "Offer" },
                  ],
                },
              }}
              value={filterValues.stage ?? null}
              onChange={(value) =>
                setFilterValues((prev) => ({ ...prev, stage: value as DemoFilterValue }))
              }
              data={sampleCandidates}
            />
            {filterValues.stage && (
              <FilterChip
                filter={{
                  columnId: "stage",
                  columnHeader: "Stage",
                  value: filterValues.stage,
                  type: "select",
                }}
                onRemove={() =>
                  setFilterValues((prev) => {
                    const { stage, ...rest } = prev;
                    return rest;
                  })
                }
              />
            )}
          </div>

          <CodePreview
            code={`import { ColumnFilterPopover, FilterChip, ActiveFiltersDisplay } from "@/components/ui/data-table";

// In table header
<ColumnFilterPopover
  column={{
    id: "stage",
    header: "Stage",
    filterConfig: {
      type: "select",
      options: [
        { label: "Applied", value: "Applied" },
        { label: "Interview", value: "Interview" },
      ],
    },
  }}
  value={filterValues.stage}
  onChange={(value) => setFilterValues(prev => ({ ...prev, stage: value }))}
/>

// Show active filters
<ActiveFiltersDisplay
  filters={activeFilters}
  onRemoveFilter={(columnId) => {...}}
  onClearAll={() => setFilterValues({})}
/>`}
          >
            <div className="text-sm text-[var(--foreground-muted)]">
              Click the filter icon above to see the filter popover in action.
            </div>
          </CodePreview>
        </div>
      </ComponentCard>

      {/* Pagination */}
      <ComponentCard
        id="pagination"
        title="Pagination"
        description="Full pagination controls with page size selector"
      >
        <CodePreview
          code={`import { TablePagination, SimplePagination } from "@/components/ui/data-table";

// Full pagination
<TablePagination
  currentPage={1}
  totalPages={10}
  pageSize={25}
  totalItems={250}
  onPageChange={(page) => setCurrentPage(page)}
  onPageSizeChange={(size) => setPageSize(size)}
  pageSizeOptions={[10, 25, 50, 100]}
/>

// Simple pagination
<SimplePagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setCurrentPage(page)}
/>`}
        >
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium">Full Pagination:</p>
              <TablePagination
                currentPage={currentPage}
                totalPages={10}
                pageSize={25}
                totalItems={250}
                onPageChange={setCurrentPage}
                onPageSizeChange={() => {}}
                pageSizeOptions={[10, 25, 50, 100]}
              />
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Skeleton Loading */}
      <ComponentCard id="skeleton" title="Skeleton Loading" description="Loading states for tables">
        <CodePreview
          code={`import { SkeletonTable, SkeletonRows } from "@/components/ui/data-table";

// Full table skeleton
<SkeletonTable columns={5} rows={5} />

// Just rows (when you have the header)
<SkeletonRows columns={5} rows={3} />`}
        >
          <UnifiedSkeletonTable columns={5} rows={3} />
        </CodePreview>
      </ComponentCard>

      {/* Column Visibility */}
      <ComponentCard
        id="column-visibility"
        title="Column Visibility Menu"
        description="Toggle column visibility with a dropdown menu"
      >
        <CodePreview
          code={`import { ColumnVisibilityMenu } from "@/components/ui/data-table";

<ColumnVisibilityMenu
  columns={columns}
  visibleColumns={visibleColumns}
  onToggleColumn={(columnId) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(columnId)) next.delete(columnId);
      else next.add(columnId);
      return next;
    });
  }}
  onResetColumns={() => setVisibleColumns(new Set(columns.map(c => c.id)))}
/>`}
        >
          <div className="flex items-center gap-4">
            <span className="text-sm">Toggle columns:</span>
            <ColumnVisibilityMenu
              columns={columns}
              visibleColumns={visibleColumns}
              onToggleColumn={(columnId) => {
                setVisibleColumns((prev) => {
                  const next = new Set(prev);
                  if (next.has(columnId)) next.delete(columnId);
                  else next.add(columnId);
                  return next;
                });
              }}
              onResetColumns={() => setVisibleColumns(new Set(columns.map((c) => c.id)))}
            />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Complete Example */}
      <ComponentCard
        id="complete-example"
        title="Complete Example"
        description="Putting it all together - a full-featured candidate table"
      >
        <div className="space-y-4">
          {/* Toolbar */}
          {selectedRows.size > 0 && (
            <UnifiedBulkActionsToolbar
              selectedCount={selectedRows.size}
              totalCount={sampleCandidates.length}
              actions={sampleBulkActions}
              selectedRows={sampleCandidates.filter((c) => selectedRows.has(c.id))}
              onClearSelection={() => setSelectedRows(new Set())}
              onSelectAll={() => setSelectedRows(new Set(sampleCandidates.map((c) => c.id)))}
              allSelected={selectedRows.size === sampleCandidates.length}
            />
          )}

          {/* Table */}
          <Table striped hoverable>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedRows.size === sampleCandidates.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRows(new Set(sampleCandidates.map((c) => c.id)));
                      } else {
                        setSelectedRows(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead
                  sortable
                  sorted={sortConfig?.key === "name" ? sortConfig.direction : false}
                  onSort={() => handleSort("name")}
                >
                  Candidate
                </TableHead>
                <TableHead
                  sortable
                  sorted={sortConfig?.key === "role" ? sortConfig.direction : false}
                  onSort={() => handleSort("role")}
                >
                  Role
                </TableHead>
                <TableHead>Stage</TableHead>
                <TableHead
                  sortable
                  sorted={sortConfig?.key === "matchScore" ? sortConfig.direction : false}
                  onSort={() => handleSort("matchScore")}
                >
                  Match
                </TableHead>
                <TableHead>Days in Stage</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} selected={selectedRows.has(row.id)}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => handleRowSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={row.name} size="sm" />
                      <div>
                        <div className="font-medium">{row.name}</div>
                        <div className="text-sm text-[var(--foreground-muted)]">{row.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <UnifiedStageBadge stage={row.stage as UnifiedCandidateStage} />
                  </TableCell>
                  <TableCell>
                    <UnifiedMatchScore score={row.matchScore} />
                  </TableCell>
                  <TableCell>
                    <UnifiedDaysInStage
                      appliedDate={row.appliedDate}
                      stageChangedDate={row.stageChangedDate}
                      warningThreshold={7}
                      dangerThreshold={14}
                    />
                  </TableCell>
                  <TableCell>
                    <UnifiedRowActionsCell actions={sampleRowActions} row={row} maxInline={2} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <TablePagination
            currentPage={1}
            totalPages={1}
            pageSize={25}
            totalItems={sampleCandidates.length}
            onPageChange={() => {}}
          />
        </div>
      </ComponentCard>

      {/* Legacy DataTable (Deprecated) */}
      <ComponentCard
        id="legacy-datatable"
        title="Legacy DataTable (Deprecated)"
        description="The monolithic DataTable component - use primitives instead for new code"
      >
        <div className="mb-4 rounded-lg border border-[var(--border-warning)] bg-[var(--background-warning)] p-3">
          <p className="text-sm text-[var(--foreground-warning)]">
            <strong>Deprecated:</strong> This component is maintained for backward compatibility.
            New implementations should use the table primitives and shared components above.
          </p>
        </div>
        <CodePreview
          code={`// DEPRECATED - use primitives instead
import { DataTable, type Column } from "@/components/ui";

<DataTable
  data={candidates}
  columns={columns}
  selectable
  searchable
  paginated
  bulkActions={bulkActions}
  rowActions={rowActions}
/>`}
        >
          <DataTable
            data={sampleCandidates}
            columns={columns}
            selectable
            pageSize={5}
            aria-label="Legacy DataTable example"
          />
        </CodePreview>
      </ComponentCard>

      {/* Props Tables */}
      <ComponentCard id="unified-exports" title="Unified Module Exports">
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-body-strong">Primitives</h4>
            <PropsTable props={unifiedModuleExports} />
          </div>
          <div>
            <h4 className="mb-2 text-body-strong">Components</h4>
            <PropsTable props={unifiedComponentExports} />
          </div>
          <div>
            <h4 className="mb-2 text-body-strong">ATS Helpers</h4>
            <PropsTable props={unifiedATSHelperExports} />
          </div>
          <div>
            <h4 className="mb-2 text-body-strong">Types</h4>
            <PropsTable props={unifiedTypeExports} />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard id="table-props" title="Table Primitive Props">
        <PropsTable props={tablePrimitiveProps} />
      </ComponentCard>

      <ComponentCard id="tablehead-props" title="TableHead Props">
        <PropsTable props={tableHeadProps} />
      </ComponentCard>

      <ComponentCard id="tablerow-props" title="TableRow Props">
        <PropsTable props={tableRowProps} />
      </ComponentCard>

      <ComponentCard id="tablecell-props" title="TableCell Props">
        <PropsTable props={tableCellProps} />
      </ComponentCard>

      <ComponentCard id="bulk-actions-props" title="BulkActionsToolbar Props">
        <PropsTable props={bulkActionsToolbarProps} />
      </ComponentCard>

      <ComponentCard id="row-actions-props" title="RowActionsCell Props">
        <PropsTable props={rowActionsCellProps} />
      </ComponentCard>

      <ComponentCard id="filter-props" title="ColumnFilterPopover Props">
        <PropsTable props={columnFilterPopoverProps} />
      </ComponentCard>

      <ComponentCard id="pagination-props" title="TablePagination Props">
        <PropsTable props={paginationProps} />
      </ComponentCard>

      <ComponentCard id="stagebadge-props" title="StageBadge Props">
        <PropsTable props={stageBadgeProps} />
      </ComponentCard>

      <ComponentCard id="matchscore-props" title="MatchScore Props">
        <PropsTable props={matchScoreProps} />
      </ComponentCard>

      <ComponentCard id="daysinstage-props" title="DaysInStage Props">
        <PropsTable props={daysInStageProps} />
      </ComponentCard>

      <ComponentCard id="column-config" title="Column Configuration">
        <PropsTable props={columnProps} />
      </ComponentCard>

      <ComponentCard id="legacy-props" title="Legacy DataTable Props (Deprecated)">
        <PropsTable props={legacyDataTableProps} />
      </ComponentCard>

      {/* Usage Guide */}
      <UsageGuide
        dos={[
          "Use table primitives for custom implementations with full control",
          "Import from @/components/ui/data-table for new code",
          "Compose with ATS helpers (StageBadge, MatchScore) for candidate tables",
          "Use BulkActionsToolbar when implementing row selection",
          "Add proper aria-labels for accessibility",
          "Use skeleton loading states for async data",
        ]}
        donts={[
          "Don't import directly from data-table.tsx (deprecated)",
          "Don't mix unified and legacy imports in the same component",
          "Don't hardcode stage/source colors - use the helper components",
          "Don't forget to handle empty states",
          "Don't skip keyboard navigation support",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Keyboard Navigation**: Arrow keys move between cells, Enter activates row actions, Space toggles selection",
          "**Screen Readers**: Tables use proper semantic markup (thead, tbody, th, td) with scope attributes",
          "**Focus Management**: Focus is visible and trapped appropriately in popovers and dropdowns",
          "**ARIA**: Tables include aria-label, sortable columns announce sort state, selection state is announced",
          "**Color Contrast**: All text meets WCAG AA contrast requirements, status colors have text labels",
        ]}
      />

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/data-table" />
    </div>
  );
}

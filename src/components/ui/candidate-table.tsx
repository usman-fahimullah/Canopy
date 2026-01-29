"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  EnhancedDataTable,
  QuickFilter,
  SavedView,
  Column,
  BulkAction,
  RowAction,
  ViewType,
} from "./data-table-enhanced";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  Star,
  StarHalf,
  Envelope,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Calendar,
  ArrowRight,
  Trash,
  PencilSimple,
  Eye,
  UserMinus,
  EnvelopeSimple,
  ChatCircle,
  CalendarPlus,
  Tag,
  Export,
  Archive,
  Lightning,
  CheckCircle,
  XCircle,
  Warning,
  Hourglass,
  User,
  Buildings,
  GraduationCap,
  Certificate,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

// ============================================
// Candidate Types
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

export type Decision = "strong_yes" | "yes" | "maybe" | "no" | "pending";

export interface CandidateReviewer {
  id: string;
  name: string;
  avatar?: string;
  decision: Decision;
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
// Stage Configuration
// ============================================

export const stageConfig: Record<CandidateStage, {
  label: string;
  variant: "secondary" | "info" | "default" | "warning" | "success" | "error";
  icon: React.ReactNode;
  color: string;
}> = {
  new: {
    label: "New",
    variant: "secondary",
    icon: <Lightning className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-muted)",
  },
  applied: {
    label: "Applied",
    variant: "info",
    icon: <Hourglass className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-info)",
  },
  screening: {
    label: "Screening",
    variant: "info",
    icon: <Eye className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-info)",
  },
  interview: {
    label: "Interview",
    variant: "default",
    icon: <ChatCircle className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-brand)",
  },
  assessment: {
    label: "Assessment",
    variant: "default",
    icon: <GraduationCap className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-brand)",
  },
  offer: {
    label: "Offer",
    variant: "warning",
    icon: <Briefcase className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-warning)",
  },
  hired: {
    label: "Hired",
    variant: "success",
    icon: <CheckCircle className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-success)",
  },
  rejected: {
    label: "Rejected",
    variant: "error",
    icon: <XCircle className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-error)",
  },
  withdrawn: {
    label: "Withdrawn",
    variant: "secondary",
    icon: <UserMinus className="h-3 w-3" weight="fill" />,
    color: "var(--foreground-muted)",
  },
};

// ============================================
// Source Configuration
// ============================================

export const sourceConfig: Record<CandidateSource, {
  label: string;
  color: string;
}> = {
  green_jobs_board: { label: "Green Jobs Board", color: "var(--foreground-brand)" },
  linkedin: { label: "LinkedIn", color: "#0077B5" },
  indeed: { label: "Indeed", color: "#2164F3" },
  referral: { label: "Referral", color: "var(--foreground-success)" },
  website: { label: "Website", color: "var(--foreground-info)" },
  other: { label: "Other", color: "var(--foreground-muted)" },
};

// ============================================
// Decision Configuration
// ============================================

export const decisionConfig: Record<Decision, {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = {
  strong_yes: {
    label: "Strong Yes",
    icon: <Heart className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-success)",
    bgColor: "var(--background-success)",
  },
  yes: {
    label: "Yes",
    icon: <ThumbsUp className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-success)",
    bgColor: "var(--background-success)",
  },
  maybe: {
    label: "Maybe",
    icon: <Minus className="h-3.5 w-3.5" weight="bold" />,
    color: "var(--foreground-warning)",
    bgColor: "var(--background-warning)",
  },
  no: {
    label: "No",
    icon: <ThumbsDown className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-error)",
    bgColor: "var(--background-error)",
  },
  pending: {
    label: "Pending",
    icon: <Hourglass className="h-3.5 w-3.5" weight="fill" />,
    color: "var(--foreground-muted)",
    bgColor: "var(--background-muted)",
  },
};

// ============================================
// Helper Components
// ============================================

/** Stage badge with icon */
export function StageBadge({ stage, className }: { stage: CandidateStage; className?: string }) {
  const config = stageConfig[stage];
  return (
    <Badge variant={config.variant} className={cn("gap-1", className)}>
      {config.icon}
      {config.label}
    </Badge>
  );
}

/** Source badge */
export function SourceBadge({ source, className }: { source: CandidateSource; className?: string }) {
  const config = sourceConfig[source];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      style={{ color: config.color }}
    >
      {config.label}
    </span>
  );
}

/** Match score with color coding */
export function MatchScoreDisplay({ score, showLabel = false, className }: {
  score: number;
  showLabel?: boolean;
  className?: string;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return { text: "var(--foreground-success)", bg: "var(--background-success)" };
    if (s >= 50) return { text: "var(--foreground-warning)", bg: "var(--background-warning)" };
    return { text: "var(--foreground-error)", bg: "var(--background-error)" };
  };

  const colors = getScoreColor(score);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="px-2 py-0.5 rounded-full text-sm font-semibold"
        style={{ color: colors.text, backgroundColor: colors.bg }}
      >
        {score}%
      </div>
      {showLabel && (
        <span className="text-sm text-[var(--foreground-muted)]">
          {score >= 80 ? "High" : score >= 50 ? "Medium" : "Low"} match
        </span>
      )}
    </div>
  );
}

/** Days in stage indicator */
export function DaysInStage({
  appliedDate,
  stageChangedDate,
  warningThreshold = 7,
  dangerThreshold = 14,
  className,
}: {
  appliedDate: Date | string;
  stageChangedDate?: Date | string;
  warningThreshold?: number;
  dangerThreshold?: number;
  className?: string;
}) {
  const referenceDate = stageChangedDate ? new Date(stageChangedDate) : new Date(appliedDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - referenceDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getColor = () => {
    if (days >= dangerThreshold) return "var(--foreground-error)";
    if (days >= warningThreshold) return "var(--foreground-warning)";
    return "var(--foreground-muted)";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn("text-sm font-medium", className)}
            style={{ color: getColor() }}
          >
            {days}d
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{days} days in current stage</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/** Reviewer avatars with decision indicators */
export function ReviewersDisplay({ reviewers, className }: {
  reviewers: CandidateReviewer[];
  className?: string;
}) {
  if (!reviewers || reviewers.length === 0) return null;

  return (
    <div className={cn("flex items-center -space-x-1", className)}>
      {reviewers.slice(0, 4).map((reviewer) => {
        const config = decisionConfig[reviewer.decision];
        return (
          <TooltipProvider key={reviewer.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className="h-6 w-6 border-2 border-[var(--background-default)]">
                    {reviewer.avatar ? (
                      <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                    ) : null}
                    <AvatarFallback className="text-xs">
                      {reviewer.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: config.bgColor, color: config.color }}
                  >
                    {React.cloneElement(config.icon as React.ReactElement, { className: "h-2 w-2" })}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{reviewer.name}: {config.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      {reviewers.length > 4 && (
        <span className="text-xs text-[var(--foreground-muted)] pl-2">
          +{reviewers.length - 4}
        </span>
      )}
    </div>
  );
}

/** Candidate name cell with avatar */
function CandidateNameCell({ candidate }: { candidate: Candidate }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {candidate.avatar ? (
          <AvatarImage src={candidate.avatar} alt={candidate.name} />
        ) : null}
        <AvatarFallback className="text-xs bg-[var(--background-brand-subtle)] text-[var(--foreground-brand)]">
          {candidate.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="font-medium text-[var(--foreground-default)] truncate">
          {candidate.name}
        </div>
        {candidate.currentTitle && (
          <div className="text-xs text-[var(--foreground-muted)] truncate">
            {candidate.currentTitle}
            {candidate.currentCompany && ` at ${candidate.currentCompany}`}
          </div>
        )}
      </div>
    </div>
  );
}

/** Skills tags display */
function SkillsCell({ skills, greenSkills, max = 3 }: {
  skills?: string[];
  greenSkills?: string[];
  max?: number;
}) {
  const allSkills = [...(greenSkills || []), ...(skills || [])];
  if (allSkills.length === 0) return <span className="text-[var(--foreground-muted)]">—</span>;

  const displaySkills = allSkills.slice(0, max);
  const remaining = allSkills.length - max;

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {displaySkills.map((skill, i) => (
        <Badge
          key={skill}
          variant={greenSkills?.includes(skill) ? "default" : "secondary"}
          className="text-xs"
        >
          {skill}
        </Badge>
      ))}
      {remaining > 0 && (
        <span className="text-xs text-[var(--foreground-muted)]">+{remaining}</span>
      )}
    </div>
  );
}

/** Next action cell */
function NextActionCell({ action, urgent }: { action?: string; urgent?: boolean }) {
  if (!action) return <span className="text-[var(--foreground-muted)]">—</span>;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "w-2 h-2 rounded-full flex-shrink-0",
          urgent ? "bg-[var(--foreground-error)] animate-pulse" : "bg-[var(--foreground-muted)]"
        )}
      />
      <span className={cn("text-sm", urgent && "font-medium text-[var(--foreground-error)]")}>
        {action}
      </span>
    </div>
  );
}

// ============================================
// Default Columns Configuration
// ============================================

export function createDefaultColumns(): Column<Candidate>[] {
  return [
    {
      id: "name",
      header: "Candidate",
      accessorKey: "name",
      sortable: true,
      filterable: true,
      sticky: true,
      minWidth: "250px",
      cell: (row) => <CandidateNameCell candidate={row} />,
    },
    {
      id: "stage",
      header: "Stage",
      accessorKey: "stage",
      sortable: true,
      filterConfig: {
        type: "select",
        options: Object.entries(stageConfig).map(([value, config]) => ({
          label: config.label,
          value,
          icon: config.icon,
        })),
      },
      minWidth: "130px",
      cell: (row) => <StageBadge stage={row.stage} />,
    },
    {
      id: "matchScore",
      header: "Match",
      accessorKey: "matchScore",
      sortable: true,
      filterConfig: {
        type: "number",
        placeholder: "Score range",
      },
      minWidth: "90px",
      cell: (row) => row.matchScore !== undefined
        ? <MatchScoreDisplay score={row.matchScore} />
        : <span className="text-[var(--foreground-muted)]">—</span>,
    },
    {
      id: "location",
      header: "Location",
      accessorKey: "location",
      sortable: true,
      filterable: true,
      defaultVisible: true,
      minWidth: "150px",
      cell: (row) => row.location || <span className="text-[var(--foreground-muted)]">—</span>,
    },
    {
      id: "source",
      header: "Source",
      accessorKey: "source",
      sortable: true,
      filterConfig: {
        type: "select",
        options: Object.entries(sourceConfig).map(([value, config]) => ({
          label: config.label,
          value,
        })),
      },
      minWidth: "130px",
      cell: (row) => <SourceBadge source={row.source} />,
    },
    {
      id: "skills",
      header: "Skills",
      accessorFn: (row) => [...(row.greenSkills || []), ...(row.skills || [])].join(", "),
      filterable: true,
      minWidth: "200px",
      defaultVisible: false,
      cell: (row) => <SkillsCell skills={row.skills} greenSkills={row.greenSkills} />,
    },
    {
      id: "reviewers",
      header: "Reviewers",
      accessorFn: (row) => row.reviewers?.map(r => r.name).join(", "),
      minWidth: "120px",
      defaultVisible: true,
      cell: (row) => row.reviewers
        ? <ReviewersDisplay reviewers={row.reviewers} />
        : <span className="text-[var(--foreground-muted)]">—</span>,
    },
    {
      id: "daysInStage",
      header: "Days",
      accessorFn: (row) => {
        const date = row.stageChangedAt || row.appliedAt;
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      },
      sortable: true,
      minWidth: "70px",
      cell: (row) => (
        <DaysInStage
          appliedDate={row.appliedAt}
          stageChangedDate={row.stageChangedAt}
        />
      ),
    },
    {
      id: "nextAction",
      header: "Next Action",
      accessorKey: "nextAction",
      minWidth: "180px",
      defaultVisible: true,
      cell: (row) => <NextActionCell action={row.nextAction} urgent={row.nextActionUrgent} />,
    },
    {
      id: "appliedAt",
      header: "Applied",
      accessorKey: "appliedAt",
      sortable: true,
      minWidth: "100px",
      cell: (row) => {
        const date = new Date(row.appliedAt);
        return (
          <span className="text-sm text-[var(--foreground-muted)]">
            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        );
      },
    },
  ];
}

// ============================================
// Default Quick Filters
// ============================================

export const defaultQuickFilters: QuickFilter[] = [
  {
    id: "high-match",
    label: "High Match",
    icon: <Star className="h-3.5 w-3.5" weight="fill" />,
    filters: {},
    sort: { key: "matchScore", direction: "desc" },
  },
  {
    id: "needs-review",
    label: "Needs Review",
    icon: <Warning className="h-3.5 w-3.5" weight="fill" />,
    filters: { stage: "screening" },
  },
  {
    id: "in-interview",
    label: "In Interview",
    icon: <ChatCircle className="h-3.5 w-3.5" weight="fill" />,
    filters: { stage: "interview" },
  },
  {
    id: "offer-stage",
    label: "Offer Stage",
    icon: <Briefcase className="h-3.5 w-3.5" weight="fill" />,
    filters: { stage: "offer" },
  },
];

// ============================================
// Default Bulk Actions
// ============================================

export function createDefaultBulkActions(
  onAction: (action: string, candidates: Candidate[]) => void
): BulkAction<Candidate>[] {
  return [
    {
      id: "move-stage",
      label: "Move to Stage",
      icon: <ArrowRight className="h-4 w-4" />,
      onAction: (rows) => onAction("move-stage", rows),
      showInToolbar: true,
    },
    {
      id: "send-email",
      label: "Send Email",
      icon: <EnvelopeSimple className="h-4 w-4" />,
      onAction: (rows) => onAction("send-email", rows),
      showInToolbar: true,
      shortcut: "⌘E",
    },
    {
      id: "schedule",
      label: "Schedule Interview",
      icon: <CalendarPlus className="h-4 w-4" />,
      onAction: (rows) => onAction("schedule", rows),
      showInToolbar: true,
    },
    {
      id: "add-tags",
      label: "Add Tags",
      icon: <Tag className="h-4 w-4" />,
      onAction: (rows) => onAction("add-tags", rows),
      showInToolbar: false,
    },
    {
      id: "export",
      label: "Export",
      icon: <Export className="h-4 w-4" />,
      onAction: (rows) => onAction("export", rows),
      showInToolbar: false,
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive className="h-4 w-4" />,
      onAction: (rows) => onAction("archive", rows),
      showInToolbar: false,
    },
    {
      id: "reject",
      label: "Reject",
      icon: <XCircle className="h-4 w-4" />,
      onAction: (rows) => onAction("reject", rows),
      variant: "destructive",
      showInToolbar: false,
      shortcut: "⌘⇧R",
    },
  ];
}

// ============================================
// Default Row Actions
// ============================================

export function createDefaultRowActions(
  onAction: (action: string, candidate: Candidate) => void
): RowAction<Candidate>[] {
  return [
    {
      id: "view",
      label: "View Profile",
      icon: <Eye className="h-4 w-4" />,
      onAction: (row) => onAction("view", row),
    },
    {
      id: "edit",
      label: "Edit",
      icon: <PencilSimple className="h-4 w-4" />,
      onAction: (row) => onAction("edit", row),
    },
    {
      id: "email",
      label: "Send Email",
      icon: <EnvelopeSimple className="h-4 w-4" />,
      onAction: (row) => onAction("email", row),
    },
    {
      id: "schedule",
      label: "Schedule Interview",
      icon: <CalendarPlus className="h-4 w-4" />,
      onAction: (row) => onAction("schedule", row),
      hidden: (row) => ["hired", "rejected", "withdrawn"].includes(row.stage),
    },
    {
      id: "reject",
      label: "Reject",
      icon: <XCircle className="h-4 w-4" />,
      onAction: (row) => onAction("reject", row),
      variant: "destructive",
      hidden: (row) => ["hired", "rejected", "withdrawn"].includes(row.stage),
    },
  ];
}

// ============================================
// CandidateTable Component
// ============================================

export interface CandidateTableProps {
  /** Array of candidates */
  candidates: Candidate[];
  /** Loading state */
  loading?: boolean;
  /** Callback when a candidate row is clicked */
  onCandidateClick?: (candidate: Candidate) => void;
  /** Callback for bulk actions */
  onBulkAction?: (action: string, candidates: Candidate[]) => void;
  /** Callback for row actions */
  onRowAction?: (action: string, candidate: Candidate) => void;
  /** Additional columns to display */
  additionalColumns?: Column<Candidate>[];
  /** Override default columns */
  columns?: Column<Candidate>[];
  /** Custom quick filters */
  quickFilters?: QuickFilter[];
  /** Custom bulk actions */
  bulkActions?: BulkAction<Candidate>[];
  /** Custom row actions */
  rowActions?: RowAction<Candidate>[];
  /** Enable view switching */
  enableViewSwitcher?: boolean;
  /** Current view type */
  viewType?: ViewType;
  /** Callback when view changes */
  onViewChange?: (view: ViewType) => void;
  /** Available views */
  availableViews?: ViewType[];
  /** Saved views */
  savedViews?: SavedView[];
  /** Active saved view ID */
  activeSavedViewId?: string | null;
  /** Callback when saved view is selected */
  onSavedViewSelect?: (viewId: string) => void;
  /** Callback to save current view */
  onSaveView?: (name: string) => void;
  /** Page size */
  pageSize?: number;
  /** Additional className */
  className?: string;
  /** Custom toolbar content */
  toolbar?: React.ReactNode;
  /** Empty state action */
  emptyAction?: { label: string; onClick: () => void };
  /** Job filter - show candidates for specific job */
  jobId?: string;
}

export function CandidateTable({
  candidates,
  loading = false,
  onCandidateClick,
  onBulkAction,
  onRowAction,
  additionalColumns = [],
  columns: overrideColumns,
  quickFilters = defaultQuickFilters,
  bulkActions: customBulkActions,
  rowActions: customRowActions,
  enableViewSwitcher = false,
  viewType = "table",
  onViewChange,
  availableViews = ["table", "kanban"],
  savedViews = [],
  activeSavedViewId = null,
  onSavedViewSelect,
  onSaveView,
  pageSize = 25,
  className,
  toolbar,
  emptyAction,
  jobId,
}: CandidateTableProps) {
  // State for quick filter
  const [activeQuickFilterId, setActiveQuickFilterId] = React.useState<string | null>(null);

  // Create columns
  const tableColumns = React.useMemo(() => {
    if (overrideColumns) return overrideColumns;
    return [...createDefaultColumns(), ...additionalColumns];
  }, [overrideColumns, additionalColumns]);

  // Create bulk actions
  const tableBulkActions = React.useMemo(() => {
    if (customBulkActions) return customBulkActions;
    return createDefaultBulkActions(onBulkAction || (() => {}));
  }, [customBulkActions, onBulkAction]);

  // Create row actions
  const tableRowActions = React.useMemo(() => {
    if (customRowActions) return customRowActions;
    return createDefaultRowActions(onRowAction || (() => {}));
  }, [customRowActions, onRowAction]);

  // Handle quick filter change
  const handleQuickFilterChange = (filterId: string | null) => {
    setActiveQuickFilterId(filterId);
    // In a real implementation, this would apply the filter
  };

  return (
    <EnhancedDataTable<Candidate>
      data={candidates}
      columns={tableColumns}
      getRowId={(row) => row.id}
      loading={loading}
      selectable
      searchable
      searchPlaceholder="Search candidates..."
      paginated
      pageSize={pageSize}
      columnToggle
      resizable
      density="default"
      emptyMessage="No candidates found"
      emptyAction={emptyAction}
      onRowClick={onCandidateClick}
      bulkActions={tableBulkActions}
      rowActions={tableRowActions}
      viewType={viewType}
      onViewChange={enableViewSwitcher ? onViewChange : undefined}
      availableViews={enableViewSwitcher ? availableViews : ["table"]}
      quickFilters={quickFilters}
      activeQuickFilterId={activeQuickFilterId}
      onQuickFilterChange={handleQuickFilterChange}
      savedViews={savedViews}
      activeSavedViewId={activeSavedViewId}
      onSavedViewSelect={onSavedViewSelect}
      onSaveView={onSaveView}
      toolbar={toolbar}
      className={className}
      aria-label="Candidates table"
    />
  );
}


/**
 * Trails Design System - UI Components
 *
 * Based on Trails Design System from Figma
 * https://www.figma.com/design/q1985VWRuwMkSc1hIqu5X9/Trails-Design-System
 *
 * Usage:
 * import { Button, Input, Card } from "@/components/ui";
 */

// Form Controls
export { Button, buttonVariants, type ButtonProps } from "./button";
export { SplitButton, splitButtonVariants, type SplitButtonProps } from "./split-button";
export { SaveButton, saveButtonVariants, type SaveButtonProps } from "./save-button";
export {
  Input,
  inputVariants,
  InputMessage,
  InputWithMessage,
  type InputProps,
  type InputMessageProps,
  type InputMessageStatus,
  type InputWithMessageProps,
} from "./input";
export { Textarea, textareaVariants, type TextareaProps } from "./textarea";
export { Label, labelVariants, type LabelProps } from "./label";
export {
  // New Dropdown names (preferred)
  Dropdown,
  DropdownGroup,
  DropdownValue,
  DropdownTrigger,
  DropdownContent,
  DropdownLabel,
  DropdownItem,
  DropdownSeparator,
  DropdownScrollUpButton,
  DropdownScrollDownButton,
  // Backward compatibility aliases (deprecated - use Dropdown* instead)
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./dropdown";
export { Checkbox, CheckboxWithLabel, CheckboxGroup, type CheckboxProps } from "./checkbox";
export {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemWithLabel,
  RadioGroupCard,
  RadioGroupWithLabel,
  type RadioGroupProps,
  type RadioGroupItemProps,
} from "./radio-group";
export { Switch, SwitchWithLabel, SwitchGroup, type SwitchProps } from "./switch";
export { Slider, sliderVariants, type SliderProps } from "./slider";
export {
  SegmentedController,
  segmentedControllerVariants,
  type SegmentedControllerOption,
  type SegmentedControllerProps,
} from "./segmented-controller";
export {
  SearchInput,
  searchInputVariants,
  LocationInput,
  locationInputVariants,
  RecentlySearchedItem,
  RecentlySearchedDropdown,
  SearchBar,
  type SearchInputProps,
  type LocationInputProps,
  type RecentlySearchedItemProps,
  type RecentlySearchedDropdownProps,
  type SearchBarProps,
} from "./search-input";
// Chip components (split into separate files for maintainability)
export {
  Chip,
  ChipMore,
  ChipGroup,
  AddChipButton,
  chipVariants,
  closeButtonVariants,
  type ChipProps,
  type ChipMoreProps,
  type ChipGroupProps,
  type AddChipButtonProps,
} from "./chip";
export { InfoTag, type InfoTagProps } from "./info-tag";
export {
  CategoryTag,
  jobCategoryLabels,
  type CategoryTagProps,
  type JobCategoryType,
} from "./category-tag";
export {
  PathwayTag,
  pathwayColors,
  pathwayLabels,
  pathwayDefaultIcons,
  type PathwayTagProps,
  type PathwayType,
} from "./pathway-tag";
export {
  PathwayIllustration,
  getAllPathwayIllustrationPaths,
  PATHWAY_ILLUSTRATION_PATHS,
  type PathwayIllustrationProps,
  type PathwayIllustrationSize,
} from "./pathway-illustration";
export { PathwayCard, type PathwayCardProps } from "./pathway-card";

// Layout & Display
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./card";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export {
  Avatar,
  AvatarGroup,
  AvatarStack,
  avatarVariants,
  type AvatarProps,
  type AvatarGroupProps,
  type AvatarStackProps,
  type AvatarData,
  type AvatarStatus,
  type AvatarColor,
  type AvatarBadge,
} from "./avatar";

// Overlays
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalClose,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalContentBox,
  ModalIconBadge,
  ModalSidebarLayout,
  ModalSidebar,
  ModalSidebarItem,
  ModalSidebarContent,
} from "./modal";
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipProvider,
  SimpleTooltip,
  type TooltipContentProps,
  type SimpleTooltipProps,
} from "./tooltip";
export { TruncateText, type TruncateTextProps } from "./truncate-text";
export {
  CoachTip,
  CoachTipTrigger,
  CoachTipAnchor,
  CoachTipContent,
  SimpleCoachTip,
  type CoachTipProps,
  type CoachTipContentProps,
  type CoachTipType,
  type SimpleCoachTipProps,
} from "./coach-tip";
export {
  Toolbar,
  ToolbarSection,
  ToolbarGroup,
  ToolbarButton,
  ToolbarToggleGroup,
  ToolbarMultiToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarLabel,
  ToolbarActions,
} from "./toolbar";
export { Toast, toastVariants, toastConfig, type ToastProps, type ToastVariant } from "./toast";

// Navigation
export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsListUnderline,
  TabsTriggerUnderline,
  TabsListAnimated,
  TabsTriggerAnimated,
  TabsListVertical,
  TabsTriggerVertical,
} from "./tabs";
export { Breadcrumbs, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "./breadcrumbs";
export { Pagination, PaginationButton, PaginationEllipsis, SimplePagination } from "./pagination";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./dropdown-menu";

// Data Display - Legacy exports from data-table.tsx (for backward compatibility)
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableLink,
  DataTable,
  // ATS Helper Components
  StageBadge as TableStageBadge,
  MatchScore as TableMatchScore,
  DaysInStage as TableDaysInStage,
  NextAction as TableNextAction,
  // Utility function
  createATSBulkActions,
  // Types
  type Column,
  type BulkAction as TableBulkAction,
  type DataTableProps,
  type TableRootProps,
  type TableHeaderProps,
  type TableBodyProps,
  type TableFooterProps,
  type TableRowProps,
  type TableHeadProps,
  type TableCellProps,
  type TableCaptionProps,
  type TableLinkProps,
  type StageBadgeProps as TableStageBadgeProps,
  type MatchScoreProps as TableMatchScoreProps,
  type DaysInStageProps as TableDaysInStageProps,
  type NextActionProps as TableNextActionProps,
  type RowExpansionPanelProps,
  type RowAction,
  type TableDensity,
  type ColumnFilterConfig,
  type ColumnFilterValue,
  type EditableCellConfig,
  type EditableCellType,
  type ColumnFilterType,
} from "./data-table";

// Data Table Module - New unified shared components
// Note: Exports are aliased to avoid conflicts with legacy exports
export {
  // Shared Components (new)
  BulkActionsToolbar as UnifiedBulkActionsToolbar,
  CompactBulkActions,
  RowActionsCell as UnifiedRowActionsCell,
  QuickActionsRow,
  ColumnFilterPopover,
  FilterChip,
  ActiveFiltersDisplay as UnifiedActiveFiltersDisplay,
  ColumnVisibilityMenu,
  TablePagination,
  SimplePagination as UnifiedSimplePagination,
  SkeletonCell,
  SkeletonRow,
  SkeletonRows as UnifiedSkeletonRows,
  SkeletonTable as UnifiedSkeletonTable,
  // Unified ATS Helpers
  StageBadge as UnifiedStageBadge,
  SourceBadge as UnifiedSourceBadge,
  MatchScore as UnifiedMatchScore,
  MatchScoreDisplay as UnifiedMatchScoreDisplay,
  DaysInStage as UnifiedDaysInStage,
  NextAction as UnifiedNextAction,
  ReviewersDisplay as UnifiedReviewersDisplay,
  DecisionPill as UnifiedDecisionPill,
  // Unified Configurations
  stageConfig as unifiedStageConfig,
  stageVariantMap,
  sourceConfig as unifiedSourceConfig,
  decisionConfig as unifiedDecisionConfig,
  // Utility functions
  getStageConfig,
  getSourceConfig,
  getDecisionConfig,
  calculateDaysAgo,
  getMatchScoreColor,
  getMatchScoreLabel,
  // Component prop types
  type BulkActionsToolbarProps as UnifiedBulkActionsToolbarProps,
  type CompactBulkActionsProps,
  type RowActionsCellProps as UnifiedRowActionsCellProps,
  type QuickActionsRowProps,
  type ColumnFilterPopoverProps,
  type FilterChipProps,
  type ActiveFiltersDisplayProps as UnifiedActiveFiltersDisplayProps,
  type ColumnVisibilityMenuProps,
  type TablePaginationProps,
  type SimplePaginationProps as UnifiedSimplePaginationProps,
  type SkeletonCellProps,
  type SkeletonRowProps,
  type SkeletonRowsProps as UnifiedSkeletonRowsProps,
  type SkeletonTableProps as UnifiedSkeletonTableProps,
  type StageBadgeProps as UnifiedStageBadgeProps,
  type SourceBadgeProps as UnifiedSourceBadgeProps,
  type MatchScoreProps as UnifiedMatchScoreProps,
  type DaysInStageProps as UnifiedDaysInStageProps,
  type NextActionProps as UnifiedNextActionProps,
  type ReviewersDisplayProps as UnifiedReviewersDisplayProps,
  type DecisionPillProps as UnifiedDecisionPillProps,
  // Shared types from unified module
  type SortConfig as UnifiedSortConfig,
  type PaginationState as UnifiedPaginationState,
  type SelectionState as UnifiedSelectionState,
  type StageConfig as UnifiedStageConfig,
  type SourceConfig as UnifiedSourceConfig,
  type DecisionConfig as UnifiedDecisionConfig,
  type Candidate as UnifiedCandidate,
  type CandidateStage as UnifiedCandidateStage,
  type CandidateSource as UnifiedCandidateSource,
  type DecisionType as UnifiedDecisionType,
  type CandidateReviewer as UnifiedCandidateReviewer,
} from "./data-table/index";

// Enhanced Data Table (Airtable/Rippling patterns)
export {
  EnhancedDataTable,
  ViewSwitcher,
  QuickFiltersBar,
  SavedViewsDropdown,
  EnhancedSearch,
  ActiveFiltersDisplay,
  BulkActionsToolbar as EnhancedBulkActionsToolbar,
  EmptyState as DataTableEmptyState,
  SkeletonTable,
  Pagination as DataTablePagination,
  RowActionsCell as DataTableRowActionsCell,
  type EnhancedDataTableProps,
  type ViewType,
  type QuickFilter,
  type SavedView,
  type Column as EnhancedColumn,
  type BulkAction as EnhancedBulkAction,
  type RowAction as EnhancedRowAction,
  type ActiveFilter,
  type ColumnFilterValue as EnhancedColumnFilterValue,
  type ColumnFilterConfig as EnhancedColumnFilterConfig,
  type FieldType,
} from "./data-table-enhanced";

// Candidate Table (ATS-specific)
export {
  CandidateTable,
  StageBadge as CandidateTableStageBadge,
  SourceBadge,
  MatchScoreDisplay,
  DaysInStage as CandidateTableDaysInStage,
  ReviewersDisplay,
  stageConfig as candidateStageConfig,
  sourceConfig as candidateSourceConfig,
  decisionConfig as candidateTableDecisionConfig,
  createDefaultColumns as createCandidateTableColumns,
  createDefaultBulkActions as createCandidateTableBulkActions,
  createDefaultRowActions as createCandidateTableRowActions,
  defaultQuickFilters as candidateTableQuickFilters,
  type CandidateTableProps,
  type Candidate as CandidateTableCandidate,
  type CandidateStage as CandidateTableStage,
  type CandidateSource as CandidateTableSource,
  type Decision as CandidateTableDecision,
  type CandidateReviewer as CandidateTableReviewer,
} from "./candidate-table";

// ATS Components
export {
  KanbanBoard,
  KanbanColumn,
  KanbanEmpty,
  KanbanDropPlaceholder,
  KanbanAddCard,
  type KanbanStageType,
} from "./kanban";
export {
  DndKanbanBoard,
  SortableCard,
  DroppableColumn,
  type KanbanColumnData,
  type DndKanbanBoardProps,
} from "./kanban-dnd";
// State hook exported separately to avoid pulling in @dnd-kit dependencies
export {
  useKanbanState,
  type KanbanItem,
  type UseKanbanStateOptions,
  type UniqueIdentifier,
} from "./kanban-state";
export {
  CandidateCard,
  CandidateHeader,
  CandidateMeta,
  CandidateMetaItem,
  CandidateSkills,
  CandidateScore,
  CandidateActions,
  CandidateStage,
  CandidateDate,
  CandidateKanbanHeader,
  CandidateReviewers,
  ReviewerRow,
  StarRating as CandidateStarRating,
  // New ATS components
  DecisionPill,
  decisionConfig,
  DaysInStage,
  CandidateActivity,
  CandidateTags,
  tagVariantClasses,
  type DecisionType,
  type ReviewerData,
  type CandidateTag,
  type TagVariant,
} from "./candidate-card";
export {
  Scorecard,
  ScorecardHeader,
  ScorecardSection,
  ScorecardCriterion,
  StarRating,
  RecommendationSelect,
  ScorecardSummary,
  type RecommendationType,
} from "./scorecard";
export {
  StageBadge,
  StageIndicator,
  StageProgress,
  StageList,
  type StageVariant,
} from "./stage-badge";

// Charts & Analytics — EXCLUDED from barrel to reduce bundle size.
// Import directly from "@/components/ui/charts" or "@/components/ui/chart" instead.
// These pull in Recharts (~300-400KB) which should only load on pages that need it.

// Rich Text Editor — EXCLUDED from barrel to reduce bundle size.
// Import directly from "@/components/ui/rich-text-editor" instead.
// This pulls in Tiptap (~150-200KB) which should only load on pages that need it.

// Type-only re-exports are zero-cost and safe to keep in the barrel
export type {
  ChartConfig,
  ChartContainerProps,
  ChartTooltipContentProps,
  ChartLegendContentProps,
  ChartCardProps,
  AreaChartProps,
  BarChartProps,
  LineChartProps,
  DonutChartProps,
  ChartDataPoint,
  AreaChartVariant,
  CurveType,
  TooltipPayloadItem,
  LegendPayloadItem,
} from "./chart";
export type {
  PipelineStage,
  StageData,
  ScoreRange,
  TrendDataPoint,
  SourceData,
  ComparisonSeries,
} from "./charts";
export type {
  RichTextEditorProps,
  RichTextToolbarProps,
  RichTextExtendedToolbarProps,
  RichTextRendererProps,
} from "./rich-text-editor";

// Combobox / Autocomplete
export {
  Combobox,
  MultiCombobox,
  AsyncCombobox,
  type ComboboxOption,
  type ComboboxProps,
  type MultiComboboxProps,
} from "./combobox";

// Time Picker
export {
  TimePicker,
  TimeInput,
  TimeSpinner,
  DateTimePicker,
  DurationInput,
  formatDuration,
  parseDuration,
  formatTime,
  parseTimeSmart,
  getTimezoneAbbr,
  type TimePickerProps,
  type TimeInputProps,
  type TimeSpinnerProps,
  type DateTimePickerProps,
  type DurationInputProps,
} from "./time-picker";

// Filter Panel
export {
  FilterPanel,
  FilterPanelInline,
  FilterPanelSheet,
  FilterGroup,
  ActiveFiltersBar,
  atsFilterConfigs,
  countActiveFilters,
  getActiveFilterLabels,
  type FilterConfig,
  type FilterValue,
  type FilterState,
  type FilterPanelProps,
} from "./filter-panel";

// Bulk Actions
export {
  BulkActionsToolbar,
  SelectableItem,
  useSelection,
  atsBulkActions,
  type BulkAction,
  type BulkActionsToolbarProps,
  type SelectionState,
} from "./bulk-actions";

// Activity Feed
export {
  ActivityFeed,
  ActivityItem,
  CompactActivityList,
  activityIcons,
  activityColors,
  generateActivityMessage,
  formatActivityDate,
  formatGroupDate,
  type Activity,
  type ActivityType,
  type ActivityActor,
  type ActivityMetadata,
  type ActivityFeedProps,
} from "./activity-feed";

// PDF / Resume Viewer
export {
  PdfViewer,
  PdfToolbar,
  ResumeViewer,
  DocumentPreviewCard,
  type PdfViewerProps,
  type ResumeViewerProps,
} from "./pdf-viewer";

// Mention Input
export {
  MentionInput,
  MentionTextarea,
  MentionHighlight,
  MentionSuggestionList,
  NoteInput,
  mentionInputVariants,
  mentionTextareaVariants,
  type MentionUser,
  type MentionData,
  type MentionInputProps,
  type MentionTextareaProps,
  type MentionHighlightProps,
  type MentionSuggestionListProps,
  type NoteInputProps,
} from "./mention-input";

// Scheduler / Calendar — extracted components
export { TimezoneSelector, type TimezoneSelectorProps } from "./timezone-selector";
export { EventCard, type EventCardProps } from "./event-card";
export { TimeSlotPicker, type TimeSlotPickerProps } from "./time-slot-picker";
export { UpcomingInterviews, type UpcomingInterviewsProps } from "./upcoming-interviews";
export { BookingLink, type BookingLinkProps } from "./booking-link";

// Scheduling utilities — re-exported from @/lib/scheduling
export { getInterviewIcon, defaultEventColors } from "@/lib/scheduling";
export type { SchedulerEvent, InterviewType } from "@/lib/scheduling";

// Email Composer
export {
  EmailComposer,
  QuickReply,
  RecipientInput,
  VariableInserter,
  defaultVariables as emailDefaultVariables,
  type EmailRecipient,
  type EmailAttachment,
  type EmailTemplate,
  type EmailVariable,
  type EmailComposerProps,
} from "./email-composer";

// Job Description Toolbar
export {
  JobDescriptionToolbar,
  JobDescriptionToolbarCompact,
  defaultJobSections,
  defaultVariables as jobDefaultVariables,
  type JobSection,
  type TemplateVariable,
  type JobDescriptionToolbarProps,
} from "./job-description-toolbar";

// Calendar
export { Calendar, type CalendarProps } from "./calendar";
export { MonthYearSelector, type MonthYearSelectorProps } from "./calendar-month-year-selector";

// Character Counter
export {
  CharacterCounter,
  RichTextCharacterCounter,
  type CharacterCounterProps,
  type RichTextCharacterCounterProps,
} from "./character-counter";

// Benefits Selector
export {
  BenefitsSelector,
  defaultBenefitCategories,
  type BenefitCategory,
  type BenefitItem,
  type BenefitsSelectorProps,
} from "./benefits-selector";

// Form Section
export {
  FormCard,
  FormSection,
  FormField,
  FormTitleInput,
  FormRow,
  type FormCardProps,
  type FormSectionProps,
  type FormFieldProps,
  type FormTitleInputProps,
  type FormRowProps,
} from "./form-section";

// Inline Editable Title
export { InlineEditableTitle, type InlineEditableTitleProps } from "./inline-editable-title";

// Role Template Card
export { RoleTemplateCard, type RoleTemplateCardProps } from "./role-template-card";

// Collapsible
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";

// Command
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "./command";

// Context Menu
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from "./context-menu";

// Date Picker
export {
  DatePicker,
  DateRangePicker,
  defaultSinglePresets,
  defaultRangePresets,
  type DatePickerProps,
  type DateRangePickerProps,
  // Legacy aliases (deprecated)
  DatePickerEnhanced,
  DateRangePickerEnhanced,
} from "./date-picker";
export type {
  DatePreset,
  DatePickerEnhancedProps,
  DateRangePickerEnhancedProps,
} from "./date-picker";

// Empty State
export {
  EmptyState,
  EmptyStateNoCandidates,
  EmptyStateNoJobs,
  EmptyStateNoResults,
  EmptyStateNoActivity,
  EmptyStateError,
  type EmptyStateProps,
} from "./empty-state";

// File Upload
export { FileUpload, type FileUploadProps } from "./file-upload";

// Hover Card
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardDescription,
} from "./hover-card";

// Popover
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "./popover";

// Match Score
export {
  MatchScore,
  MatchScoreBadge,
  MatchScoreBreakdown,
  type MatchScoreProps,
} from "./match-score";

// Scroll Area
export { ScrollArea, ScrollBar } from "./scroll-area";

// Separator
export { Separator, type SeparatorProps } from "./separator";

// Sheet
export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";

// Spinner
export { Spinner, LoadingOverlay, LoadingInline, type SpinnerProps } from "./spinner";

// Data View
export { DataView } from "./data-view";

// Stat Card
export { StatCard, StatCardGroup, MiniStat, type StatCardProps } from "./stat-card";

// Timeline
export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
} from "./timeline";

// Accordion
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./accordion";

// Alert
export {
  Alert,
  AlertTitle,
  AlertDescription,
  alertVariants,
  alertConfig,
  type AlertProps,
  type AlertType,
} from "./alert";

// Progress
export { Progress, CircularProgress, type ProgressProps } from "./progress";

// Progress Meter
export {
  ProgressMeterCircular,
  ProgressMeterLinear,
  ProgressMeterSteps,
  goalConfig,
  type ProgressMeterCircularProps,
  type ProgressMeterLinearProps,
  type ProgressMeterStepsProps,
  type GoalType,
} from "./progress-meter";

// Goal Card
export { GoalCard, goalCardBg, type GoalCardProps } from "./goal-card";

// Progress Steps (Job Seeker Pipeline)
export {
  ProgressStep,
  ProgressStepsBar,
  stepColors as progressStepColors,
  stepLabels as progressStepLabels,
  type ProgressStepProps,
  type ProgressStepsBarProps,
  type ProgressStepType,
  type ProgressStepPosition,
} from "./progress-steps";

// Skeleton
export { Skeleton, SkeletonText, SkeletonCard } from "./skeleton";

// Notification Badge
export {
  NotificationBadge,
  notificationBadgeVariants,
  type NotificationBadgeProps,
} from "./notification-badge";

// List Status (Status Badge)
export {
  ListStatus,
  listStatusVariants,
  listStatusConfig,
  type ListStatusProps,
  type ListStatusVariant,
} from "./list-status";

// Banner
export { Banner, bannerVariants, bannerConfig, type BannerProps, type BannerType } from "./banner";

// Inline Message (Contextual Alert)
export {
  InlineMessage,
  inlineMessageVariants,
  inlineMessageConfig,
  type InlineMessageProps,
  type InlineMessageVariant,
} from "./inline-message";

// Job Post Card
export {
  JobPostCard,
  jobPostCardVariants,
  type JobPostCardProps,
  type JobPostStatus,
} from "./job-post-card";

// Job Note Card
export {
  JobNoteCard,
  jobNoteCardVariants,
  noteTypeConfig,
  type JobNoteCardProps,
  type JobNoteType,
} from "./job-note-card";

// Company Card
export { CompanyCard, companyCardVariants, type CompanyCardProps } from "./company-card";

// Interview Scheduling — Extracted Components
export { AttendeeChip, type AttendeeChipProps } from "./attendee-chip";
export { TimeSlotChip, type TimeSlotChipProps } from "./time-slot-chip";
export { InternalNotesSection, type InternalNotesSectionProps } from "./internal-notes-section";
export { AddAttendeePopover, type AddAttendeePopoverProps } from "./add-attendee-popover";
export { SuggestTimesButton, type SuggestTimesButtonProps } from "./suggest-times-button";
export { CalendarOverlayToggle, type CalendarOverlayToggleProps } from "./calendar-overlay-toggle";
export { CandidatePreviewCard, type CandidatePreviewCardProps } from "./candidate-preview-card";

// Availability Calendar (extracted from interview-scheduling-modal)
export {
  AvailabilityCalendar,
  DraggableSlot,
  type AvailabilityCalendarProps,
  type DraggableSlotProps,
  type WeekViewType,
} from "./availability-calendar";

// Your Calendar View (extracted from interview-scheduling-modal)
export { YourCalendarView, type YourCalendarViewProps } from "./your-calendar-view";

// Interview Scheduling Modal (orchestrator)
export {
  InterviewSchedulingModal,
  type Attendee,
  type AttendeeAvailability,
  type TimeSlot,
  type InterviewSchedulingModalProps,
  type RecruiterEvent,
} from "./interview-scheduling-modal";

// Recruiter Calendar
export {
  RecruiterCalendarView,
  CalendarSidebar,
  CalendarHeader,
  CalendarEventCard,
  CalendarDayGrid,
  CalendarWeekGrid,
  CalendarMonthGrid,
  MiniCalendar,
  getEventPosition as getCalendarEventPosition,
  getEventTypeIcon,
  getEventColorClass,
  DEFAULT_FILTERS as CALENDAR_DEFAULT_FILTERS,
  KEYBOARD_SHORTCUTS as CALENDAR_KEYBOARD_SHORTCUTS,
  type CalendarEvent,
  type CalendarFilter,
  type CalendarConfig,
  type RecruiterCalendarViewProps,
} from "./recruiter-calendar";

// Collection Card (Job Seeker Portal)
export { CollectionCard, type CollectionCardProps } from "./collection-card";

// Currency Input
export {
  CurrencyInput,
  SalaryRangeInput,
  type CurrencyCode,
  type CurrencyInputProps,
  type SalaryRangeInputProps,
} from "./currency-input";

// List Item
export {
  List,
  listVariants,
  ListItem,
  listItemVariants,
  ListItemLeading,
  ListItemContent,
  ListItemDateBadge,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemTrailing,
  ListItemTrailingText,
  ListGroup,
  ListGroupHeader,
  type ListProps,
  type ListItemProps,
  type ListItemLeadingProps,
  type ListItemMetaProps,
} from "./list-item";

// Job Application Table (Job Seeker Portal)
export {
  JobApplicationTable,
  ApplicationTracker,
  sectionConfig as applicationSectionConfig,
  stageColors as applicationStageColors,
  type ApplicationSection,
  type EmojiReaction,
  type JobApplication,
  type JobApplicationTableProps,
  type ApplicationTrackerProps,
} from "./job-application-table";

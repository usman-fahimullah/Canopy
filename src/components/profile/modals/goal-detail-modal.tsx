"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Modal, ModalContent, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CharacterCounter } from "@/components/ui/character-counter";
import { EmptyState } from "@/components/ui/empty-state";
import { DatePicker } from "@/components/ui/date-picker";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui";
import {
  X,
  Plus,
  CaretLeft,
  CaretRight,
  PencilSimple,
  DotsSixVertical,
  ListChecks,
  Target,
  Lightning,
  Equals,
  ArrowDown,
  CalendarBlank,
  Check,
  Confetti,
  Trash,
  CaretUpDown,
  CaretDown,
  NotePencil,
  Briefcase,
  ArrowSquareOut,
  Link as LinkIcon,
  LinkSimple,
} from "@phosphor-icons/react";
import {
  GOAL_CATEGORIES,
  getGoalCategory,
  type GoalCategoryKey,
} from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// =============================================================================
// TYPES
// =============================================================================

interface MilestoneResource {
  title: string;
  url: string;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  resources?: MilestoneResource[] | null;
}

type PriorityLevel = "high" | "medium" | "low";

interface LinkedApplication {
  id: string;
  job: {
    id: string;
    title: string;
    company: string | null;
  };
}

interface GoalDetailData {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategoryKey | null;
  progress: number;
  milestones: Milestone[];
  dueDate?: Date | null;
  priority?: PriorityLevel;
  notes?: string | null;
  application?: LinkedApplication | null;
}

interface GoalDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: GoalDetailData;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (description: string) => void;
  onUpdateCategory: (category: GoalCategoryKey) => void;
  onToggleMilestone: (milestoneId: string) => void;
  onAddMilestone: (title: string) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  onReorderMilestones?: (milestoneIds: string[]) => void;
  onUpdateDueDate?: (dueDate: Date | null) => void;
  onUpdatePriority?: (priority: PriorityLevel) => void;
  onUpdateNotes?: (notes: string) => void;
  onUpdateMilestoneResources?: (milestoneId: string, resources: MilestoneResource[]) => void;
  onCompleteGoal: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_TITLE_LENGTH = 100;
const MAX_DESC_LENGTH = 250;
const MAX_NOTES_LENGTH = 1000;

const PRIORITY_CONFIG: Record<
  PriorityLevel,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  high: {
    label: "High",
    icon: Lightning,
    color: "text-[var(--primitive-red-600)]",
    bg: "bg-[var(--primitive-red-100)]",
  },
  medium: {
    label: "Medium",
    icon: Equals,
    color: "text-[var(--primitive-orange-600)]",
    bg: "bg-[var(--primitive-orange-100)]",
  },
  low: {
    label: "Low",
    icon: ArrowDown,
    color: "text-[var(--primitive-blue-600)]",
    bg: "bg-[var(--primitive-blue-100)]",
  },
};

// =============================================================================
// SORTABLE TASK COMPONENT
// =============================================================================

interface SortableTaskProps {
  milestone: Milestone;
  onToggle: () => void;
  onDelete: () => void;
  onUpdateResources?: (resources: MilestoneResource[]) => void;
}

function SortableTask({ milestone, onToggle, onDelete, onUpdateResources }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: milestone.id,
  });

  const [showAddLink, setShowAddLink] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const linkInputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const resources = milestone.resources ?? [];
  const canAddMore = resources.length < 3;

  const handleAddResource = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    // Simple URL validation
    let url = newLinkUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    try {
      new URL(url); // Validate URL
      const newResources = [...resources, { title: newLinkTitle.trim(), url }];
      onUpdateResources?.(newResources);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setShowAddLink(false);
    } catch {
      // Invalid URL, do nothing
    }
  };

  const handleRemoveResource = (index: number) => {
    const newResources = resources.filter((_, i) => i !== index);
    onUpdateResources?.(newResources);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border border-transparent py-1.5 transition-all",
        isDragging &&
          "z-10 border-[var(--border-brand)] bg-[var(--background-default)] shadow-[var(--shadow-card)]"
      )}
    >
      {/* Main task row */}
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
          aria-label="Drag to reorder"
        >
          <DotsSixVertical size={16} className="text-[var(--foreground-subtle)]" />
        </button>
        <Checkbox
          checked={milestone.completed}
          onCheckedChange={onToggle}
          aria-label={`Mark "${milestone.title}" as ${milestone.completed ? "incomplete" : "complete"}`}
        />
        <span
          className={cn(
            "flex-1 text-body transition-all",
            milestone.completed
              ? "text-[var(--foreground-muted)] line-through"
              : "text-[var(--foreground-default)]"
          )}
        >
          {milestone.title}
        </span>
        {/* Add link button (shows on hover) */}
        {canAddMore && onUpdateResources && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              setShowAddLink(!showAddLink);
              setTimeout(() => linkInputRef.current?.focus(), 100);
            }}
            aria-label="Add resource link"
            className="opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
          >
            <LinkSimple size={14} className="text-[var(--foreground-subtle)]" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDelete}
          aria-label={`Delete task: ${milestone.title}`}
          className="opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
        >
          <Trash size={14} className="text-[var(--foreground-subtle)]" />
        </Button>
      </div>

      {/* Resource links display */}
      {resources.length > 0 && (
        <div className="ml-10 mt-1 flex flex-wrap gap-1.5">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group/link inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-caption transition-colors",
                "bg-[var(--background-info)] text-[var(--foreground-info)]",
                "hover:bg-[var(--primitive-blue-200)]"
              )}
              title={resource.url}
            >
              <LinkIcon size={12} />
              <span className="max-w-[120px] truncate">{resource.title}</span>
              {onUpdateResources && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveResource(idx);
                  }}
                  className="ml-0.5 rounded opacity-0 transition-opacity hover:text-[var(--foreground-error)] group-hover/link:opacity-100"
                  aria-label={`Remove link: ${resource.title}`}
                >
                  <X size={12} />
                </button>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Add link form (inline) */}
      {showAddLink && (
        <div className="ml-10 mt-2 flex flex-col gap-2 rounded-lg bg-[var(--background-default)] p-2">
          <div className="flex gap-2">
            <Input
              ref={linkInputRef}
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              placeholder="Link title"
              className="flex-1 text-caption"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddResource();
                }
                if (e.key === "Escape") {
                  setShowAddLink(false);
                  setNewLinkTitle("");
                  setNewLinkUrl("");
                }
              }}
            />
            <Input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 text-caption"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddResource();
                }
                if (e.key === "Escape") {
                  setShowAddLink(false);
                  setNewLinkTitle("");
                  setNewLinkUrl("");
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption-sm text-[var(--foreground-subtle)]">
              {3 - resources.length} links remaining
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddLink(false);
                  setNewLinkTitle("");
                  setNewLinkUrl("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddResource}
                disabled={!newLinkTitle.trim() || !newLinkUrl.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPLETION CELEBRATION
// =============================================================================

function CompletionCelebration({ onClose }: { onClose: () => void }) {
  // Fire confetti animation on mount
  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import("canvas-confetti").then((confettiModule) => {
      const confetti = confettiModule.default;

      // Fire multiple bursts for a more celebratory effect
      const duration = 2000;
      const end = Date.now() + duration;

      // Hex values required by canvas-confetti library (doesn't accept CSS variables).
      // These map to our design token primitives for brand consistency.
      const colors = [
        "#5ECC70", // --primitive-green-400
        "#3BA36F", // --primitive-green-600
        "#408CFF", // --primitive-blue-400
        "#FFCE47", // --primitive-yellow-400
        "#9C59FF", // --primitive-purple-400
      ];

      // Initial burst from center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      // Continuous confetti for duration
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
        <Confetti size={32} weight="fill" className="text-[var(--primitive-green-600)]" />
      </div>
      <h3 className="mb-2 text-heading-sm font-bold text-[var(--foreground-default)]">
        Goal Completed!
      </h3>
      <p className="mb-6 text-body text-[var(--foreground-muted)]">
        Congratulations on achieving your goal! Keep up the great work.
      </p>
      <Button variant="primary" onClick={onClose}>
        Continue
      </Button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function GoalDetailModal({
  open,
  onOpenChange,
  goal,
  onUpdateTitle,
  onUpdateDescription,
  onUpdateCategory,
  onToggleMilestone,
  onAddMilestone,
  onDeleteMilestone,
  onReorderMilestones,
  onUpdateDueDate,
  onUpdatePriority,
  onUpdateNotes,
  onUpdateMilestoneResources,
  onCompleteGoal,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: GoalDetailModalProps) {
  const cat = getGoalCategory(goal.category);
  const IconComponent = cat.icon;

  // Editing states
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(goal.title);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(goal.description ?? "");
  const [notesValue, setNotesValue] = useState(goal.notes ?? "");
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [taskInput, setTaskInput] = useState("");
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Local milestones for drag-and-drop
  const [localMilestones, setLocalMilestones] = useState(goal.milestones);

  // Refs
  const taskInputRef = useRef<HTMLInputElement>(null);

  // Screen reader announcements
  const [announcement, setAnnouncement] = useState("");

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync state when goal prop changes (e.g., navigating between goals)
  useEffect(() => {
    setTitleValue(goal.title);
    setDescValue(goal.description ?? "");
    setNotesValue(goal.notes ?? "");
    setLocalMilestones(goal.milestones);
    setEditingTitle(false);
    setEditingDesc(false);
    setNotesExpanded(false);
    setShowConfirmComplete(false);
    setShowCelebration(false);
  }, [goal.id, goal.title, goal.description, goal.notes, goal.milestones]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(""), 1000);
  }, []);

  const handleTitleSave = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== goal.title) {
      onUpdateTitle(trimmed);
      announce("Title updated");
    } else {
      setTitleValue(goal.title);
    }
    setEditingTitle(false);
  };

  const handleDescSave = () => {
    const trimmed = descValue.trim();
    if (trimmed !== (goal.description ?? "")) {
      onUpdateDescription(trimmed);
      announce("Description updated");
    }
    setEditingDesc(false);
  };

  const handleNotesSave = () => {
    const trimmed = notesValue.trim();
    if (onUpdateNotes && trimmed !== (goal.notes ?? "")) {
      onUpdateNotes(trimmed);
      announce("Notes saved");
    }
  };

  const handleAddTask = useCallback(() => {
    const trimmed = taskInput.trim();
    if (trimmed) {
      onAddMilestone(trimmed);
      setTaskInput("");
      announce(`Task added: ${trimmed}`);
      taskInputRef.current?.focus();
    }
  }, [taskInput, onAddMilestone, announce]);

  const handleDeleteTask = useCallback(
    (id: string, title: string) => {
      onDeleteMilestone(id);
      announce(`Task deleted: ${title}`);
    },
    [onDeleteMilestone, announce]
  );

  const handleToggleTask = useCallback(
    (id: string, title: string, completed: boolean) => {
      onToggleMilestone(id);
      announce(`Task "${title}" marked as ${completed ? "incomplete" : "complete"}`);
    },
    [onToggleMilestone, announce]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setLocalMilestones((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          const newItems = arrayMove(items, oldIndex, newIndex);

          // Notify parent of reorder
          if (onReorderMilestones) {
            onReorderMilestones(newItems.map((m) => m.id));
          }

          announce(`Task moved to position ${newIndex + 1}`);
          return newItems;
        });
      }
    },
    [onReorderMilestones, announce]
  );

  const handleCompleteGoal = () => {
    setShowConfirmComplete(false);
    setShowCelebration(true);
    onCompleteGoal();
  };

  const handleAddTaskClick = () => {
    taskInputRef.current?.focus();
  };

  const priority = goal.priority ?? "medium";
  const PriorityIcon = PRIORITY_CONFIG[priority].icon;

  // Use local milestones for rendering (supports optimistic drag updates)
  const displayMilestones = localMilestones;

  // Format due date for display
  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Overdue", color: "text-[var(--foreground-error)]" };
    if (diffDays === 0) return { text: "Due today", color: "text-[var(--primitive-orange-600)]" };
    if (diffDays === 1)
      return { text: "Due tomorrow", color: "text-[var(--primitive-orange-600)]" };
    if (diffDays <= 7)
      return { text: `Due in ${diffDays} days`, color: "text-[var(--foreground-muted)]" };

    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      color: "text-[var(--foreground-muted)]",
    };
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl">
        <ModalBody className="p-0">
          {/* Screen reader announcements */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {announcement}
          </div>

          {showCelebration ? (
            <CompletionCelebration onClose={() => onOpenChange(false)} />
          ) : (
            <>
              {/* Header bar with category tint */}
              <div className={cn("flex items-center justify-between px-6 py-3", cat.bg)}>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onOpenChange(false)}
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </Button>

                  {/* Category dropdown pill */}
                  <Dropdown
                    value={goal.category ?? ""}
                    onValueChange={(v) => onUpdateCategory(v as GoalCategoryKey)}
                  >
                    <DropdownTrigger asChild>
                      <button
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors",
                          cat.tint,
                          cat.text,
                          "text-caption font-medium",
                          "focus:ring-[var(--primitive-green-500)]/20 hover:opacity-90 focus:outline-none focus:ring-2"
                        )}
                        aria-label={`Category: ${cat.label}. Click to change.`}
                      >
                        <IconComponent size={16} weight="fill" />
                        <span>{cat.label}</span>
                        <CaretUpDown size={12} />
                      </button>
                    </DropdownTrigger>
                    <DropdownContent>
                      {(
                        Object.entries(GOAL_CATEGORIES) as Array<
                          [GoalCategoryKey, (typeof GOAL_CATEGORIES)[GoalCategoryKey]]
                        >
                      ).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <DropdownItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "flex h-5 w-5 items-center justify-center rounded-full",
                                  config.bg
                                )}
                              >
                                <Icon size={12} weight="fill" className={config.text} />
                              </span>
                              {config.label}
                            </div>
                          </DropdownItem>
                        );
                      })}
                    </DropdownContent>
                  </Dropdown>

                  {/* Priority badge */}
                  {onUpdatePriority ? (
                    <Dropdown
                      value={priority}
                      onValueChange={(v) => onUpdatePriority(v as PriorityLevel)}
                    >
                      <DropdownTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center gap-1 rounded-full px-2 py-1 transition-colors",
                            PRIORITY_CONFIG[priority].bg,
                            "text-caption font-medium",
                            "focus:ring-[var(--primitive-green-500)]/20 hover:opacity-90 focus:outline-none focus:ring-2"
                          )}
                          aria-label={`Priority: ${PRIORITY_CONFIG[priority].label}. Click to change.`}
                        >
                          <PriorityIcon
                            size={12}
                            weight="bold"
                            className={PRIORITY_CONFIG[priority].color}
                          />
                          <span className={PRIORITY_CONFIG[priority].color}>
                            {PRIORITY_CONFIG[priority].label}
                          </span>
                        </button>
                      </DropdownTrigger>
                      <DropdownContent>
                        {(
                          Object.entries(PRIORITY_CONFIG) as Array<
                            [PriorityLevel, (typeof PRIORITY_CONFIG)[PriorityLevel]]
                          >
                        ).map(([key, config]) => {
                          const Icon = config.icon;
                          return (
                            <DropdownItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full",
                                    config.bg
                                  )}
                                >
                                  <Icon size={12} weight="bold" className={config.color} />
                                </span>
                                {config.label}
                              </div>
                            </DropdownItem>
                          );
                        })}
                      </DropdownContent>
                    </Dropdown>
                  ) : (
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-full px-2 py-1",
                        PRIORITY_CONFIG[priority].bg,
                        "text-caption font-medium"
                      )}
                    >
                      <PriorityIcon
                        size={12}
                        weight="bold"
                        className={PRIORITY_CONFIG[priority].color}
                      />
                      <span className={PRIORITY_CONFIG[priority].color}>
                        {PRIORITY_CONFIG[priority].label}
                      </span>
                    </span>
                  )}
                </div>

                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                  {/* Due date indicator */}
                  {goal.dueDate && (
                    <span
                      className={cn(
                        "flex items-center gap-1 text-caption",
                        formatDueDate(goal.dueDate).color
                      )}
                    >
                      <CalendarBlank size={14} />
                      {formatDueDate(goal.dueDate).text}
                    </span>
                  )}

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={onPrev}
                      disabled={!hasPrev}
                      aria-label="Previous goal"
                    >
                      <CaretLeft size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={onNext}
                      disabled={!hasNext}
                      aria-label="Next goal"
                    >
                      <CaretRight size={16} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Two-panel content */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left panel — Goal info */}
                <div className="p-6">
                  {/* Editable title */}
                  <div className="mb-4">
                    {editingTitle ? (
                      <div>
                        <Label htmlFor="edit-title" className="sr-only">
                          Goal title
                        </Label>
                        <Input
                          id="edit-title"
                          variant="dashed-title"
                          value={titleValue}
                          onChange={(e) => setTitleValue(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                          onBlur={handleTitleSave}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleTitleSave();
                            if (e.key === "Escape") {
                              setTitleValue(goal.title);
                              setEditingTitle(false);
                            }
                          }}
                          autoFocus
                          aria-describedby="title-edit-counter"
                        />
                        <div className="mt-1 flex justify-end" id="title-edit-counter">
                          <CharacterCounter current={titleValue.length} max={MAX_TITLE_LENGTH} />
                        </div>
                      </div>
                    ) : (
                      <h2
                        className="cursor-pointer border-b-2 border-dashed border-transparent text-heading-sm font-bold text-[var(--foreground-brand)] transition-colors hover:border-[var(--border-muted)]"
                        onClick={() => setEditingTitle(true)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setEditingTitle(true);
                          }
                        }}
                        aria-label={`Goal title: ${goal.title}. Click to edit.`}
                      >
                        {goal.title}
                      </h2>
                    )}
                  </div>

                  {/* Goal Description */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-body-strong text-[var(--foreground-default)]">
                        Goal Description
                      </h3>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setEditingDesc(!editingDesc)}
                        aria-label={editingDesc ? "Cancel editing" : "Edit description"}
                      >
                        <PencilSimple size={16} />
                      </Button>
                    </div>
                    {editingDesc ? (
                      <div>
                        <Label htmlFor="edit-desc" className="sr-only">
                          Goal description
                        </Label>
                        <Textarea
                          id="edit-desc"
                          value={descValue}
                          onChange={(e) => setDescValue(e.target.value.slice(0, MAX_DESC_LENGTH))}
                          onBlur={handleDescSave}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") {
                              setDescValue(goal.description ?? "");
                              setEditingDesc(false);
                            }
                          }}
                          placeholder="Add a description..."
                          rows={3}
                          autoFocus
                          aria-describedby="desc-edit-counter"
                        />
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-caption-sm text-[var(--foreground-subtle)]">
                            Press Escape to cancel
                          </span>
                          <CharacterCounter current={descValue.length} max={MAX_DESC_LENGTH} />
                        </div>
                      </div>
                    ) : (
                      <p
                        className="cursor-pointer text-body text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground-default)]"
                        onClick={() => setEditingDesc(true)}
                      >
                        {goal.description || "Click to add a description..."}
                      </p>
                    )}
                  </div>

                  {/* Notes/Journal (collapsible) */}
                  {onUpdateNotes && (
                    <div className="mt-6">
                      <button
                        onClick={() => setNotesExpanded(!notesExpanded)}
                        className="flex w-full items-center justify-between rounded-lg p-2 transition-colors hover:bg-[var(--background-subtle)]"
                        aria-expanded={notesExpanded}
                        aria-controls="notes-section"
                      >
                        <div className="flex items-center gap-2">
                          <NotePencil size={18} className="text-[var(--foreground-brand)]" />
                          <h3 className="text-body-strong text-[var(--foreground-default)]">
                            Notes & Reflections
                          </h3>
                          {notesValue && !notesExpanded && (
                            <span className="text-caption text-[var(--foreground-muted)]">
                              ({notesValue.length} chars)
                            </span>
                          )}
                        </div>
                        <CaretDown
                          size={16}
                          className={cn(
                            "text-[var(--foreground-subtle)] transition-transform",
                            notesExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      {notesExpanded && (
                        <div id="notes-section" className="mt-2">
                          <Label htmlFor="goal-notes" className="sr-only">
                            Notes and reflections
                          </Label>
                          <Textarea
                            id="goal-notes"
                            value={notesValue}
                            onChange={(e) =>
                              setNotesValue(e.target.value.slice(0, MAX_NOTES_LENGTH))
                            }
                            onBlur={handleNotesSave}
                            placeholder="Record your thoughts, progress, learnings..."
                            rows={4}
                            className="resize-none"
                            aria-describedby="notes-counter notes-hint"
                          />
                          <div className="mt-1 flex items-center justify-between">
                            <span
                              id="notes-hint"
                              className="text-caption-sm text-[var(--foreground-subtle)]"
                            >
                              Auto-saves when you click away
                            </span>
                            <CharacterCounter current={notesValue.length} max={MAX_NOTES_LENGTH} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Due Date (if editable) */}
                  {onUpdateDueDate && (
                    <div className="mt-6">
                      <h3 className="mb-2 text-body-strong text-[var(--foreground-default)]">
                        Due Date
                      </h3>
                      <DatePicker
                        value={goal.dueDate ?? undefined}
                        onChange={(date) => onUpdateDueDate(date ?? null)}
                        placeholder="Set due date"
                        minDate={new Date()}
                        clearable
                      />
                    </div>
                  )}

                  {/* Linked Application */}
                  {goal.application && (
                    <div className="mt-6">
                      <h3 className="mb-2 text-body-strong text-[var(--foreground-default)]">
                        Linked Application
                      </h3>
                      <a
                        href={`/jobs/applications/${goal.application.id}`}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                          "border-[var(--border-muted)] bg-[var(--background-default)]",
                          "hover:border-[var(--border-brand)] hover:shadow-[var(--shadow-xs)]"
                        )}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--background-info)]">
                          <Briefcase
                            size={20}
                            weight="fill"
                            className="text-[var(--foreground-info)]"
                          />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body-strong text-[var(--foreground-default)]">
                            {goal.application.job.title}
                          </p>
                          {goal.application.job.company && (
                            <p className="truncate text-caption text-[var(--foreground-muted)]">
                              {goal.application.job.company}
                            </p>
                          )}
                        </div>
                        <ArrowSquareOut
                          size={16}
                          className="shrink-0 text-[var(--foreground-subtle)]"
                        />
                      </a>
                    </div>
                  )}

                  {/* Goal Progress */}
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-body-strong text-[var(--foreground-default)]">
                        Goal Progress
                      </h3>
                      <span className="text-caption-strong text-[var(--foreground-brand)]">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--background-muted)]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            cat.progress
                          )}
                          style={{ width: `${goal.progress}%` }}
                          role="progressbar"
                          aria-valuenow={goal.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label="Goal progress"
                        />
                      </div>
                      <p className="text-caption text-[var(--foreground-muted)]">
                        {displayMilestones.filter((m) => m.completed).length} of{" "}
                        {displayMilestones.length} tasks completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right panel — Tasks */}
                <div className="rounded-r-[var(--radius-modal)] bg-[var(--background-subtle)] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListChecks
                        size={18}
                        weight="bold"
                        className="text-[var(--foreground-brand)]"
                      />
                      <h3 className="text-body-strong text-[var(--foreground-default)]">
                        Task List
                      </h3>
                      {displayMilestones.length > 0 && (
                        <span className="text-caption text-[var(--foreground-muted)]">
                          ({displayMilestones.filter((m) => m.completed).length}/
                          {displayMilestones.length})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="link"
                      leftIcon={<Plus size={14} />}
                      onClick={handleAddTaskClick}
                    >
                      Add task
                    </Button>
                  </div>

                  {displayMilestones.length === 0 ? (
                    <EmptyState
                      icon={<ListChecks size={32} weight="light" />}
                      title="No tasks yet"
                      description="Add tasks to track your progress"
                      size="sm"
                    />
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={displayMilestones.map((m) => m.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-1" role="list" aria-label="Task list">
                          {displayMilestones.map((milestone) => (
                            <SortableTask
                              key={milestone.id}
                              milestone={milestone}
                              onToggle={() =>
                                handleToggleTask(milestone.id, milestone.title, milestone.completed)
                              }
                              onDelete={() => handleDeleteTask(milestone.id, milestone.title)}
                              onUpdateResources={
                                onUpdateMilestoneResources
                                  ? (resources) =>
                                      onUpdateMilestoneResources(milestone.id, resources)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}

                  {/* Inline task input */}
                  <div className="mt-4">
                    <Input
                      ref={taskInputRef}
                      variant="dashed"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder="Write another task"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTask();
                        }
                      }}
                      aria-label="New task"
                      aria-describedby="task-input-hint"
                    />
                    <p
                      id="task-input-hint"
                      className="mt-1.5 text-caption-sm text-[var(--foreground-subtle)]"
                    >
                      Press{" "}
                      <kbd className="rounded bg-[var(--background-muted)] px-1 font-mono text-caption-sm">
                        Enter
                      </kbd>{" "}
                      to add
                      {displayMilestones.length > 0 && " • Drag to reorder"}
                    </p>
                  </div>

                  {/* Complete Goal button */}
                  <div className="mt-6">
                    {showConfirmComplete ? (
                      <div className="space-y-2">
                        <p className="text-center text-caption text-[var(--foreground-muted)]">
                          Mark this goal as complete?
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="tertiary"
                            className="flex-1"
                            onClick={() => setShowConfirmComplete(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="primary"
                            className="flex-1"
                            onClick={handleCompleteGoal}
                            leftIcon={<Check size={16} />}
                          >
                            Complete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-full"
                        disabled={goal.progress < 100}
                        onClick={() => setShowConfirmComplete(true)}
                        leftIcon={goal.progress >= 100 ? <Confetti size={16} /> : undefined}
                      >
                        {goal.progress >= 100
                          ? "Complete Goal"
                          : `${100 - goal.progress}% remaining`}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

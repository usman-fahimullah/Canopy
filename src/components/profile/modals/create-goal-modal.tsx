"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Modal, ModalContent, ModalClose, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CharacterCounter } from "@/components/ui/character-counter";
import { EmptyState } from "@/components/ui/empty-state";
import { DatePicker } from "@/components/ui/date-picker";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui";
import {
  Plus,
  X,
  Target,
  ListChecks,
  DotsSixVertical,
  CaretUpDown,
  Lightning,
  Equals,
  ArrowDown,
  CalendarBlank,
  Lightbulb,
  Briefcase,
  Link as LinkIcon,
} from "@phosphor-icons/react";
import { GOAL_CATEGORIES, type GoalCategoryKey } from "@/lib/profile/goal-categories";
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

interface Task {
  id: string;
  title: string;
}

type PriorityLevel = "high" | "medium" | "low";

interface TemplateData {
  title: string;
  description: string;
  category: GoalCategoryKey;
  tasks: string[];
}

interface ApplicationOption {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
}

interface CreateGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    title: string;
    description: string;
    category: GoalCategoryKey | null;
    milestones: string[];
    dueDate: Date | null;
    priority: PriorityLevel;
    applicationId: string | null;
  }) => void;
  loading?: boolean;
  /** Initial data from a template selection */
  initialTemplate?: TemplateData | null;
  /** Recent applications to link goals to */
  applications?: ApplicationOption[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const MAX_TITLE_LENGTH = 100;
const MAX_DESC_LENGTH = 250;
const MAX_TASKS = 20;

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

const GOAL_TEMPLATES = [
  {
    id: "networking",
    title: "Expand professional network",
    description: "Connect with industry professionals to explore opportunities",
    category: "NETWORKING" as GoalCategoryKey,
    tasks: [
      "Reach out to 3 professionals on LinkedIn",
      "Schedule 2 informational interviews",
      "Attend 1 industry networking event",
      "Follow up with new connections",
    ],
  },
  {
    id: "interview-prep",
    title: "Prepare for interviews",
    description: "Build confidence and skills for upcoming interviews",
    category: "INTERVIEWING" as GoalCategoryKey,
    tasks: [
      "Research common interview questions",
      "Practice STAR method responses",
      "Prepare questions for interviewers",
      "Do a mock interview with a friend",
    ],
  },
  {
    id: "salary-research",
    title: "Research salary expectations",
    description: "Understand market rates for target roles",
    category: "COMPENSATION" as GoalCategoryKey,
    tasks: [
      "Research salaries on Glassdoor/Levels.fyi",
      "Talk to 2 people in similar roles",
      "List your unique value propositions",
      "Practice salary negotiation responses",
    ],
  },
  {
    id: "job-search-organize",
    title: "Organize job search",
    description: "Create a structured approach to finding opportunities",
    category: "ORGANIZATION" as GoalCategoryKey,
    tasks: [
      "Set up job tracking spreadsheet",
      "Create target company list",
      "Update resume and LinkedIn",
      "Set daily/weekly application goals",
    ],
  },
];

// =============================================================================
// SORTABLE TASK COMPONENT
// =============================================================================

interface SortableTaskProps {
  task: Task;
  onRemove: () => void;
  isNew?: boolean;
}

function SortableTask({ task, onRemove, isNew }: SortableTaskProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-2 rounded-lg border border-transparent py-1.5 transition-all",
        isDragging &&
          "z-10 border-[var(--border-brand)] bg-[var(--background-default)] shadow-[var(--shadow-card)]",
        isNew && "animate-in fade-in slide-in-from-top-2 duration-200"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
        aria-label="Drag to reorder"
      >
        <DotsSixVertical size={16} className="text-[var(--foreground-subtle)]" />
      </button>
      <Checkbox checked={false} disabled aria-hidden="true" />
      <span className="flex-1 text-body text-[var(--foreground-default)]">{task.title}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        aria-label={`Remove task: ${task.title}`}
        className="opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
      >
        <X size={14} />
      </Button>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CreateGoalModal({
  open,
  onOpenChange,
  onSave,
  loading,
  initialTemplate,
  applications = [],
}: CreateGoalModalProps) {
  const generateTaskId = () => `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategoryKey | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<PriorityLevel>("medium");
  const [linkedApplicationId, setLinkedApplicationId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [newTaskId, setNewTaskId] = useState<string | null>(null);

  // Refs
  const titleInputRef = useRef<HTMLInputElement>(null);
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

  // Pre-fill form with template data when provided
  useEffect(() => {
    if (open && initialTemplate) {
      setTitle(initialTemplate.title);
      setDescription(initialTemplate.description);
      setCategory(initialTemplate.category);
      setTasks(initialTemplate.tasks.map((t) => ({ id: generateTaskId(), title: t })));
      setShowTemplates(false);
    }
  }, [open, initialTemplate]);

  // Auto-focus title on open
  useEffect(() => {
    if (open) {
      // Small delay to ensure modal is rendered
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Clear new task animation after it plays
  useEffect(() => {
    if (newTaskId) {
      const timer = setTimeout(() => setNewTaskId(null), 300);
      return () => clearTimeout(timer);
    }
  }, [newTaskId]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    // Clear after announcement is read
    setTimeout(() => setAnnouncement(""), 1000);
  }, []);

  const addTask = useCallback(() => {
    const trimmed = taskInput.trim();
    if (trimmed && tasks.length < MAX_TASKS) {
      const newId = generateTaskId();
      setTasks((prev) => [...prev, { id: newId, title: trimmed }]);
      setTaskInput("");
      setNewTaskId(newId);
      announce(`Task added: ${trimmed}. ${tasks.length + 1} of ${MAX_TASKS} tasks.`);
      // Keep focus on input for rapid entry
      taskInputRef.current?.focus();
    }
  }, [taskInput, tasks.length, announce]);

  const removeTask = useCallback(
    (id: string, taskTitle: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      announce(`Task removed: ${taskTitle}`);
    },
    [announce]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setTasks((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          const newItems = arrayMove(items, oldIndex, newIndex);
          announce(`Task moved to position ${newIndex + 1}`);
          return newItems;
        });
      }
    },
    [announce]
  );

  const handleBulkImport = useCallback(() => {
    // Parse multiple lines from input
    const lines = taskInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length > 1) {
      const available = MAX_TASKS - tasks.length;
      const toAdd = lines.slice(0, available);
      const newTasks = toAdd.map((title) => ({ id: generateTaskId(), title }));
      setTasks((prev) => [...prev, ...newTasks]);
      setTaskInput("");
      announce(`${toAdd.length} tasks added`);
    }
  }, [taskInput, tasks.length, announce]);

  const applyTemplate = useCallback(
    (template: (typeof GOAL_TEMPLATES)[number]) => {
      setTitle(template.title);
      setDescription(template.description);
      setCategory(template.category);
      setTasks(template.tasks.map((t) => ({ id: generateTaskId(), title: t })));
      setShowTemplates(false);
      announce(`Template applied: ${template.title}`);
    },
    [announce]
  );

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      milestones: tasks.map((t) => t.title),
      dueDate: dueDate ?? null,
      priority,
      applicationId: linkedApplicationId,
    });
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form
      setTitle("");
      setDescription("");
      setCategory(null);
      setTasks([]);
      setTaskInput("");
      setDueDate(undefined);
      setPriority("medium");
      setLinkedApplicationId(null);
      setShowTemplates(true);
      setNewTaskId(null);
    }
    onOpenChange(newOpen);
  };

  const handleAddTaskClick = () => {
    taskInputRef.current?.focus();
  };

  const selectedCategory = category ? GOAL_CATEGORIES[category] : null;
  const CategoryIcon = selectedCategory?.icon;
  const PriorityIcon = PRIORITY_CONFIG[priority].icon;

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent size="xl">
        <ModalBody className="p-0">
          {/* Screen reader announcements */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {announcement}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left panel — Goal details */}
            <div className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <ModalClose asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Close modal">
                    <X size={18} />
                  </Button>
                </ModalClose>
                <div className="flex items-center gap-2">
                  <Target size={20} weight="fill" className="text-[var(--foreground-brand)]" />
                  <span className="text-body-strong text-[var(--foreground-default)]">
                    Create Goal
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="goal-title" className="sr-only">
                    Goal title
                  </Label>
                  <Input
                    ref={titleInputRef}
                    id="goal-title"
                    variant="dashed-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH))}
                    placeholder="Write your goal"
                    aria-describedby="title-counter"
                  />
                  <div className="mt-1 flex justify-end" id="title-counter">
                    <CharacterCounter current={title.length} max={MAX_TITLE_LENGTH} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="goal-description"
                    className="mb-1 block text-caption text-[var(--foreground-muted)]"
                  >
                    Description (optional)
                  </Label>
                  <Textarea
                    id="goal-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_LENGTH))}
                    placeholder="Describe what you want to achieve"
                    rows={3}
                    aria-describedby="desc-counter"
                  />
                  <div className="mt-1 flex justify-end" id="desc-counter">
                    <CharacterCounter current={description.length} max={MAX_DESC_LENGTH} />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label
                    htmlFor="goal-category"
                    className="mb-1 block text-caption text-[var(--foreground-muted)]"
                  >
                    Category
                  </Label>
                  <Dropdown
                    value={category ?? ""}
                    onValueChange={(v) => setCategory(v as GoalCategoryKey)}
                  >
                    <DropdownTrigger asChild>
                      <button
                        id="goal-category"
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                          "border-[var(--input-border)] bg-[var(--input-background)]",
                          "focus:ring-[var(--primitive-green-500)]/20 hover:border-[var(--input-border-hover)] focus:border-[var(--input-border-focus)] focus:outline-none focus:ring-2"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {selectedCategory ? (
                            <>
                              <span
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full",
                                  selectedCategory.bg
                                )}
                              >
                                {CategoryIcon && (
                                  <CategoryIcon
                                    size={14}
                                    weight="fill"
                                    className={selectedCategory.text}
                                  />
                                )}
                              </span>
                              <span className="text-body text-[var(--foreground-default)]">
                                {selectedCategory.label}
                              </span>
                            </>
                          ) : (
                            <span className="text-body text-[var(--foreground-subtle)]">
                              Select category
                            </span>
                          )}
                        </div>
                        <CaretUpDown size={16} className="text-[var(--foreground-subtle)]" />
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
                </div>

                {/* Link to Application (optional) */}
                {applications.length > 0 && (
                  <div>
                    <Label
                      htmlFor="goal-application"
                      className="mb-1 block text-caption text-[var(--foreground-muted)]"
                    >
                      Link to application (optional)
                    </Label>
                    <Dropdown
                      value={linkedApplicationId ?? ""}
                      onValueChange={(v) => setLinkedApplicationId(v || null)}
                    >
                      <DropdownTrigger asChild>
                        <button
                          id="goal-application"
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                            "border-[var(--input-border)] bg-[var(--input-background)]",
                            "focus:ring-[var(--primitive-green-500)]/20 hover:border-[var(--input-border-hover)] focus:border-[var(--input-border-focus)] focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {linkedApplicationId ? (
                              <>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--background-info)]">
                                  <Briefcase
                                    size={14}
                                    weight="fill"
                                    className="text-[var(--foreground-info)]"
                                  />
                                </span>
                                <span className="text-body text-[var(--foreground-default)]">
                                  {applications.find((a) => a.id === linkedApplicationId)
                                    ?.jobTitle ?? "Application"}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--background-muted)]">
                                  <LinkIcon size={14} className="text-[var(--foreground-subtle)]" />
                                </span>
                                <span className="text-body text-[var(--foreground-subtle)]">
                                  Select application
                                </span>
                              </>
                            )}
                          </div>
                          <CaretUpDown size={16} className="text-[var(--foreground-subtle)]" />
                        </button>
                      </DropdownTrigger>
                      <DropdownContent>
                        <DropdownItem value="">
                          <span className="text-[var(--foreground-subtle)]">No application</span>
                        </DropdownItem>
                        {applications.map((app) => (
                          <DropdownItem key={app.id} value={app.id}>
                            <div className="flex flex-col">
                              <span className="text-body">{app.jobTitle}</span>
                              <span className="text-caption-sm text-[var(--foreground-muted)]">
                                {app.company}
                              </span>
                            </div>
                          </DropdownItem>
                        ))}
                      </DropdownContent>
                    </Dropdown>
                  </div>
                )}

                {/* Priority & Due Date Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Priority */}
                  <div>
                    <Label
                      htmlFor="goal-priority"
                      className="mb-1 block text-caption text-[var(--foreground-muted)]"
                    >
                      Priority
                    </Label>
                    <Dropdown
                      value={priority}
                      onValueChange={(v) => setPriority(v as PriorityLevel)}
                    >
                      <DropdownTrigger asChild>
                        <button
                          id="goal-priority"
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
                            "border-[var(--input-border)] bg-[var(--input-background)]",
                            "focus:ring-[var(--primitive-green-500)]/20 hover:border-[var(--input-border-hover)] focus:border-[var(--input-border-focus)] focus:outline-none focus:ring-2"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full",
                                PRIORITY_CONFIG[priority].bg
                              )}
                            >
                              <PriorityIcon
                                size={14}
                                weight="bold"
                                className={PRIORITY_CONFIG[priority].color}
                              />
                            </span>
                            <span className="text-body text-[var(--foreground-default)]">
                              {PRIORITY_CONFIG[priority].label}
                            </span>
                          </div>
                          <CaretUpDown size={16} className="text-[var(--foreground-subtle)]" />
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
                  </div>

                  {/* Due Date */}
                  <div>
                    <Label
                      htmlFor="goal-due-date"
                      className="mb-1 block text-caption text-[var(--foreground-muted)]"
                    >
                      Due date (optional)
                    </Label>
                    <DatePicker
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder="Set due date"
                      minDate={new Date()}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2">
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={handleSave}
                    loading={loading}
                    disabled={!title.trim()}
                  >
                    Create goal
                  </Button>
                  <div className="mt-2 text-center">
                    <Button variant="link" onClick={() => handleClose(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel — Task list */}
            <div className="rounded-r-[var(--radius-modal)] bg-[var(--background-subtle)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListChecks size={18} weight="bold" className="text-[var(--foreground-brand)]" />
                  <h3 className="text-body-strong text-[var(--foreground-default)]">Task List</h3>
                  {tasks.length > 0 && (
                    <span className="text-caption text-[var(--foreground-muted)]">
                      ({tasks.length}/{MAX_TASKS})
                    </span>
                  )}
                </div>
                <Button
                  variant="link"
                  leftIcon={<Plus size={14} />}
                  onClick={handleAddTaskClick}
                  disabled={tasks.length >= MAX_TASKS}
                >
                  Add task
                </Button>
              </div>

              {/* Templates Section */}
              {showTemplates && tasks.length === 0 && !title && (
                <div className="mb-4">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Lightbulb
                      size={14}
                      weight="fill"
                      className="text-[var(--primitive-yellow-600)]"
                    />
                    <span className="text-caption-strong text-[var(--foreground-muted)]">
                      Quick start with a template
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {GOAL_TEMPLATES.map((template) => {
                      const TemplateIcon = GOAL_CATEGORIES[template.category].icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          className={cn(
                            "flex items-start gap-2 rounded-lg border p-2.5 text-left transition-all",
                            "border-[var(--border-muted)] bg-[var(--background-default)]",
                            "hover:border-[var(--border-brand)] hover:shadow-[var(--shadow-xs)]",
                            "focus:ring-[var(--primitive-green-500)]/20 focus:border-[var(--border-brand)] focus:outline-none focus:ring-2"
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                              GOAL_CATEGORIES[template.category].bg
                            )}
                          >
                            <TemplateIcon
                              size={12}
                              weight="fill"
                              className={GOAL_CATEGORIES[template.category].text}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-caption-strong text-[var(--foreground-default)]">
                              {template.title}
                            </p>
                            <p className="text-caption-sm text-[var(--foreground-subtle)]">
                              {template.tasks.length} tasks
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="mt-2 w-full text-center text-caption text-[var(--foreground-subtle)] hover:text-[var(--foreground-muted)]"
                  >
                    or start from scratch
                  </button>
                </div>
              )}

              {/* Task List */}
              {tasks.length === 0 && !showTemplates ? (
                <EmptyState
                  icon={<ListChecks size={32} weight="light" />}
                  title="No tasks yet"
                  description="Break down your goal into actionable steps"
                  size="sm"
                />
              ) : tasks.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={tasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-1" role="list" aria-label="Task list">
                      {tasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onRemove={() => removeTask(task.id, task.title)}
                          isNew={task.id === newTaskId}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : null}

              {/* Task Input */}
              {(tasks.length > 0 || !showTemplates) && (
                <div className="mt-4">
                  <div className="relative">
                    <Input
                      ref={taskInputRef}
                      variant="dashed"
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      placeholder={
                        tasks.length >= MAX_TASKS ? "Maximum tasks reached" : "Write a task"
                      }
                      disabled={tasks.length >= MAX_TASKS}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (taskInput.includes("\n")) {
                            handleBulkImport();
                          } else {
                            addTask();
                          }
                        }
                      }}
                      aria-label="New task"
                      aria-describedby="task-hint"
                    />
                  </div>
                  <p
                    id="task-hint"
                    className="mt-1.5 text-caption-sm text-[var(--foreground-subtle)]"
                  >
                    Press{" "}
                    <kbd className="rounded bg-[var(--background-muted)] px-1 font-mono text-caption-sm">
                      Enter
                    </kbd>{" "}
                    to add
                    {tasks.length > 0 && " • Drag to reorder"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

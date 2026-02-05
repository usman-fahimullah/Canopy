"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui";
import { X, Plus, CaretLeft, CaretRight, PencilSimple } from "@phosphor-icons/react";
import {
  GOAL_CATEGORIES,
  getGoalCategory,
  type GoalCategoryKey,
} from "@/lib/profile/goal-categories";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalDetailData {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategoryKey | null;
  progress: number;
  milestones: Milestone[];
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
  onCompleteGoal: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

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
  onCompleteGoal,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: GoalDetailModalProps) {
  const cat = getGoalCategory(goal.category);
  const IconComponent = cat.icon;
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(goal.title);
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(goal.description ?? "");
  const [taskInput, setTaskInput] = useState("");

  const handleTitleSave = () => {
    if (titleValue.trim()) {
      onUpdateTitle(titleValue.trim());
    }
    setEditingTitle(false);
  };

  const handleDescSave = () => {
    onUpdateDescription(descValue.trim());
    setEditingDesc(false);
  };

  const handleAddTask = () => {
    const trimmed = taskInput.trim();
    if (trimmed) {
      onAddMilestone(trimmed);
      setTaskInput("");
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl">
        <ModalBody className="p-0">
          {/* Header bar with category tint */}
          <div className={cn("flex items-center justify-between px-6 py-3", cat.bg)}>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
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
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5",
                      cat.tint,
                      cat.text,
                      "text-caption font-medium"
                    )}
                  >
                    <IconComponent size={16} weight="fill" />
                    <DropdownValue placeholder="Category" />
                  </button>
                </DropdownTrigger>
                <DropdownContent>
                  {(
                    Object.entries(GOAL_CATEGORIES) as Array<
                      [GoalCategoryKey, (typeof GOAL_CATEGORIES)[GoalCategoryKey]]
                    >
                  ).map(([key, config]) => (
                    <DropdownItem key={key} value={key}>
                      {config.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>

            {/* Navigation arrows */}
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

          {/* Two-panel content */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left panel — Goal info */}
            <div className="p-6">
              {/* Editable title */}
              {editingTitle ? (
                <Input
                  variant="dashed-title"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                  }}
                  autoFocus
                />
              ) : (
                <h2
                  className="mb-4 cursor-pointer border-b-2 border-dashed border-transparent text-heading-sm font-bold text-[var(--foreground-brand)] hover:border-[var(--border-muted)]"
                  onClick={() => setEditingTitle(true)}
                >
                  {goal.title}
                </h2>
              )}

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
                    aria-label="Edit description"
                  >
                    <PencilSimple size={16} />
                  </Button>
                </div>
                {editingDesc ? (
                  <Input
                    value={descValue}
                    onChange={(e) => setDescValue(e.target.value)}
                    onBlur={handleDescSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleDescSave();
                    }}
                    placeholder="Add a description..."
                    autoFocus
                  />
                ) : (
                  <p className="text-body text-[var(--foreground-muted)]">
                    {goal.description || "No description yet"}
                  </p>
                )}
              </div>

              {/* Goal Progress */}
              <div className="mt-6">
                <h3 className="mb-2 text-body-strong text-[var(--foreground-default)]">
                  Goal Progress
                </h3>
                <div className="space-y-2">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--background-muted)]">
                    <div
                      className={cn("h-full rounded-full transition-all", cat.progress)}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    {goal.progress}% Complete
                  </p>
                </div>
              </div>
            </div>

            {/* Right panel — Tasks */}
            <div className="rounded-r-[var(--radius-modal)] bg-[var(--background-subtle)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-body-strong text-[var(--foreground-default)]">
                  Your Task list
                </h3>
                <Button
                  variant="link"
                  leftIcon={<Plus size={14} />}
                  onClick={() => {
                    /* focus task input */
                  }}
                >
                  Add Task
                </Button>
              </div>

              {goal.milestones.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  description="Add tasks to track your progress"
                  size="sm"
                />
              ) : (
                <div className="space-y-2">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={milestone.completed}
                        onCheckedChange={() => onToggleMilestone(milestone.id)}
                      />
                      <span
                        className={cn(
                          "flex-1 text-body",
                          milestone.completed
                            ? "text-[var(--foreground-muted)] line-through"
                            : "text-[var(--foreground-default)]"
                        )}
                      >
                        {milestone.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Inline task input */}
              <div className="mt-4">
                <Input
                  variant="dashed"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Write another Task"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTask();
                    }
                  }}
                />
              </div>

              {/* Complete Goal button */}
              <div className="mt-6">
                <Button
                  variant="primary"
                  className="w-full"
                  disabled={goal.progress < 100}
                  onClick={onCompleteGoal}
                >
                  Complete Goal
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

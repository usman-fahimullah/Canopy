"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalClose, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CharacterCounter } from "@/components/ui/character-counter";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui";
import { Plus, X } from "@phosphor-icons/react";
import { GOAL_CATEGORIES, type GoalCategoryKey } from "@/lib/profile/goal-categories";

interface CreateGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    title: string;
    description: string;
    category: GoalCategoryKey | null;
    milestones: string[];
  }) => void;
  loading?: boolean;
}

const MAX_DESC_LENGTH = 250;

export function CreateGoalModal({ open, onOpenChange, onSave, loading }: CreateGoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GoalCategoryKey | null>(null);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const addTask = () => {
    const trimmed = taskInput.trim();
    if (trimmed) {
      setMilestones((prev) => [...prev, trimmed]);
      setTaskInput("");
    }
  };

  const removeTask = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      milestones,
    });
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle("");
      setDescription("");
      setCategory(null);
      setMilestones([]);
      setTaskInput("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent size="xl">
        <ModalBody className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left panel — Goal details */}
            <div className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <ModalClose asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Close">
                    <X size={18} />
                  </Button>
                </ModalClose>
                <span className="text-body-strong text-[var(--foreground-default)]">
                  Create Goal
                </span>
              </div>

              <div className="space-y-4">
                <Input
                  variant="dashed-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Write your goal"
                />

                <div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESC_LENGTH))}
                    placeholder="Goal description (optional)"
                    rows={3}
                  />
                  <div className="mt-1 flex justify-end">
                    <CharacterCounter current={description.length} max={MAX_DESC_LENGTH} />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-caption text-[var(--foreground-muted)]">
                    Category
                  </label>
                  <Dropdown
                    value={category ?? ""}
                    onValueChange={(v) => setCategory(v as GoalCategoryKey)}
                  >
                    <DropdownTrigger>
                      <DropdownValue placeholder="Select category" />
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

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSave}
                  loading={loading}
                  disabled={!title.trim()}
                >
                  Create goal
                </Button>
                <div className="text-center">
                  <Button variant="link" onClick={() => handleClose(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* Right panel — Task list */}
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
                  Add task
                </Button>
              </div>

              {milestones.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  description="Add tasks to break down your goal into actionable steps"
                  size="sm"
                />
              ) : (
                <div className="space-y-2">
                  {milestones.map((task, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox checked={false} disabled />
                      <span className="flex-1 text-body text-[var(--foreground-default)]">
                        {task}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeTask(i)}
                        aria-label="Remove task"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <Input
                  variant="dashed"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Write another Task"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTask();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

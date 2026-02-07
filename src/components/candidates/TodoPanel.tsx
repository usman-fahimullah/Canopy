"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import { X, Plus } from "@phosphor-icons/react";

/**
 * TodoPanel — Candidate hiring task checklist.
 * Triggered by ListChecks icon in navbar.
 */

interface TodoItem {
  id: string;
  label: string;
  checked: boolean;
}

interface TodoPanelProps {
  onClose: () => void;
  /** Pipeline stages to auto-generate default items */
  stages?: Array<{ id: string; name: string }>;
}

const DEFAULT_ITEMS: TodoItem[] = [
  { id: "review", label: "Review application", checked: false },
  { id: "screen", label: "Screen candidate", checked: false },
  { id: "schedule", label: "Schedule interview", checked: false },
  { id: "conduct", label: "Conduct interview", checked: false },
  { id: "feedback", label: "Collect team feedback", checked: false },
  { id: "decision", label: "Make decision", checked: false },
];

export function TodoPanel({ onClose, stages }: TodoPanelProps) {
  const [items, setItems] = React.useState<TodoItem[]>(DEFAULT_ITEMS);
  const [newTaskText, setNewTaskText] = React.useState("");

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddTask = () => {
    const text = newTaskText.trim();
    if (!text) return;

    setItems((prev) => [...prev, { id: `custom-${Date.now()}`, label: text, checked: false }]);
    setNewTaskText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  const completedCount = items.filter((i) => i.checked).length;
  const allComplete = completedCount === items.length && items.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">To-Do</h2>
          <span className="text-caption text-[var(--foreground-muted)]">
            {completedCount}/{items.length}
          </span>
        </div>
        <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </Button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-4">
        {allComplete ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 text-4xl">🎉</div>
            <p className="text-body font-medium text-[var(--foreground-default)]">
              All tasks complete!
            </p>
            <p className="mt-1 text-caption text-[var(--foreground-muted)]">
              Great job on this candidate review.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[var(--background-interactive-hover)]"
              >
                <CheckboxWithLabel
                  label={item.label}
                  checked={item.checked}
                  onCheckedChange={() => handleToggle(item.id)}
                  className={item.checked ? "text-[var(--foreground-disabled)] line-through" : ""}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add task input */}
      <div className="border-t border-[var(--border-muted)] p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleAddTask}
            disabled={!newTaskText.trim()}
            aria-label="Add task"
          >
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

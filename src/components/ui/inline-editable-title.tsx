"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PencilSimple } from "@phosphor-icons/react";

/**
 * InlineEditableTitle component
 *
 * Displays text that can be clicked to edit inline.
 * Used for editable role titles, job names, etc.
 *
 * Features:
 * - Click to edit
 * - Press Enter or blur to save
 * - Press Escape to cancel
 * - Optional placeholder when empty
 * - Pencil icon indicator on hover
 */

export interface InlineEditableTitleProps {
  /** Current value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Size variant */
  size?: "sm" | "default" | "lg";
  /** Disable editing */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Called when editing starts */
  onEditStart?: () => void;
  /** Called when editing ends (save or cancel) */
  onEditEnd?: () => void;
}

const sizeStyles = {
  sm: "text-body-sm",
  default: "text-heading-sm",
  lg: "text-heading-md",
};

const InlineEditableTitle = React.forwardRef<HTMLDivElement, InlineEditableTitleProps>(
  (
    {
      value,
      onChange,
      placeholder = "Untitled",
      size = "default",
      disabled = false,
      className,
      onEditStart,
      onEditEnd,
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Update edit value when value prop changes (and not editing)
    React.useEffect(() => {
      if (!isEditing) {
        setEditValue(value);
      }
    }, [value, isEditing]);

    // Focus input when editing starts
    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const startEditing = () => {
      if (disabled) return;
      setIsEditing(true);
      setEditValue(value);
      onEditStart?.();
    };

    const saveAndClose = () => {
      const trimmedValue = editValue.trim();
      if (trimmedValue !== value) {
        onChange(trimmedValue || placeholder);
      }
      setIsEditing(false);
      onEditEnd?.();
    };

    const cancelEditing = () => {
      setEditValue(value);
      setIsEditing(false);
      onEditEnd?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveAndClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEditing();
      }
    };

    const displayValue = value || placeholder;
    const isPlaceholder = !value;

    if (isEditing) {
      return (
        <div ref={ref} className={cn("inline-flex items-center", className)}>
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveAndClose}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "border-b-2 border-[var(--input-border-focus)] bg-transparent outline-none",
              "font-semibold text-foreground",
              "transition-colors duration-150",
              sizeStyles[size]
            )}
            style={{ width: `${Math.max(editValue.length, placeholder.length) + 2}ch` }}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={startEditing}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            startEditing();
          }
        }}
        className={cn(
          "group inline-flex cursor-pointer items-center gap-2",
          "-mx-1 rounded-md px-1",
          "hover:bg-background-muted",
          "focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:ring-offset-2",
          "transition-all duration-150",
          disabled && "cursor-default opacity-50 hover:bg-transparent",
          className
        )}
      >
        <span
          className={cn(
            "font-semibold",
            sizeStyles[size],
            isPlaceholder ? "text-foreground-muted" : "text-foreground"
          )}
        >
          {displayValue}
        </span>
        {!disabled && (
          <PencilSimple
            className={cn(
              "h-4 w-4 text-foreground-muted",
              "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
              "transition-opacity duration-150"
            )}
            weight="regular"
          />
        )}
      </div>
    );
  }
);

InlineEditableTitle.displayName = "InlineEditableTitle";

export { InlineEditableTitle };

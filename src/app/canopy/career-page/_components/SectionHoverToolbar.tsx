"use client";

import { useState, useEffect } from "react";
import { DotsSixVertical, Trash, Check, X, Copy, Eye, EyeSlash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface SectionHoverToolbarProps {
  label: string;
  dragHandleProps?: Record<string, unknown>;
  isHidden?: boolean;
  onDelete: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: () => void;
}

export function SectionHoverToolbar({
  label,
  dragHandleProps,
  isHidden,
  onDelete,
  onDuplicate,
  onToggleVisibility,
}: SectionHoverToolbarProps) {
  const [confirming, setConfirming] = useState(false);

  // Reset confirmation state when toolbar hides/shows
  useEffect(() => {
    return () => setConfirming(false);
  }, []);

  return (
    <div className="absolute -top-3 right-3 z-10 flex items-center gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--background-default)] px-2 py-1 shadow-[var(--shadow-sm)]">
      <span className="mr-1 text-xs font-medium text-[var(--foreground-muted)]">{label}</span>

      {/* One-off: Raw button required — dnd-kit drag handle spreads listener props
          that need direct DOM element access; <Button> would interfere with drag behavior */}
      <button
        {...dragHandleProps}
        className="cursor-grab rounded p-0.5 text-[var(--foreground-subtle)] transition-colors hover:text-[var(--foreground-default)] active:cursor-grabbing"
        title="Drag to reorder"
        aria-label="Drag to reorder"
      >
        <DotsSixVertical size={14} weight="bold" />
      </button>

      {/* Duplicate */}
      {onDuplicate && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate section"
          aria-label="Duplicate section"
        >
          <Copy size={14} weight="bold" />
        </Button>
      )}

      {/* Visibility toggle */}
      {onToggleVisibility && (
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 ${isHidden ? "text-[var(--foreground-disabled)]" : "text-[var(--foreground-subtle)] hover:text-[var(--foreground-default)]"}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          title={isHidden ? "Show section" : "Hide section"}
          aria-label={isHidden ? "Show section" : "Hide section"}
        >
          {isHidden ? <EyeSlash size={14} weight="bold" /> : <Eye size={14} weight="bold" />}
        </Button>
      )}

      {confirming ? (
        <div className="flex items-center gap-0.5">
          <span className="text-xs font-medium text-[var(--foreground-error)]">Delete?</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setConfirming(false);
            }}
            aria-label="Confirm delete"
          >
            <Check size={14} weight="bold" className="text-[var(--foreground-error)]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              setConfirming(false);
            }}
            aria-label="Cancel delete"
          >
            <X size={14} weight="bold" />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-[var(--foreground-subtle)] hover:text-[var(--foreground-error)]"
          onClick={(e) => {
            e.stopPropagation();
            setConfirming(true);
          }}
          title="Delete section"
          aria-label="Delete section"
        >
          <Trash size={14} weight="bold" />
        </Button>
      )}
    </div>
  );
}

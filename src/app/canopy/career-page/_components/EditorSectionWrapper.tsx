"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SectionHoverToolbar } from "./SectionHoverToolbar";

interface EditorSectionWrapperProps {
  id: string;
  index: number;
  isSelected: boolean;
  isHidden?: boolean;
  sectionLabel: string;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
  onToggleVisibility?: () => void;
  children: React.ReactNode;
}

export function EditorSectionWrapper({
  id,
  index,
  isSelected,
  isHidden,
  sectionLabel,
  onSelect,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  children,
}: EditorSectionWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isHidden ? 0.4 : 1,
  };

  const showToolbar = isHovered || isSelected;

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-section-index={index}
      className={cn(
        "relative cursor-pointer transition-all",
        isSelected &&
          "ring-2 ring-[var(--border-brand)] ring-offset-2 ring-offset-[var(--background-muted)]",
        !isSelected &&
          isHovered &&
          "ring-dashed ring-[var(--border-brand)]/40 ring-2 ring-offset-2 ring-offset-[var(--background-muted)]",
        isDragging && "z-10"
      )}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover/selected toolbar */}
      {showToolbar && (
        <SectionHoverToolbar
          label={sectionLabel}
          dragHandleProps={{ ...attributes, ...listeners }}
          isHidden={isHidden}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleVisibility={onToggleVisibility}
        />
      )}

      {/* Actual section content (pointer-events disabled to prevent inner click conflicts) */}
      <div className="pointer-events-none">{children}</div>
    </div>
  );
}

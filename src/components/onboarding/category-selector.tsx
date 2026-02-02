"use client";

import {
  CategoryTag,
  jobCategoryLabels,
  type JobCategoryType,
} from "@/components/ui/category-tag";
import {
  Code,
  Package,
  UsersThree,
  Megaphone,
  Leaf,
  ChartLineUp,
  Handshake,
  PenNib,
  PaintBrush,
  Cube,
  ChartBar,
  GraduationCap,
  Scales,
  Gear,
  Flask,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/** Icon mapping for each job category type */
const categoryIcons: Record<JobCategoryType, React.ReactNode> = {
  "software-engineering": <Code />,
  "supply-chain": <Package />,
  administration: <UsersThree />,
  "advocacy-policy": <Megaphone />,
  "climate-sustainability": <Leaf />,
  investment: <ChartLineUp />,
  sales: <Handshake />,
  content: <PenNib />,
  "marketing-design": <PaintBrush />,
  product: <Cube />,
  data: <ChartBar />,
  education: <GraduationCap />,
  "finance-compliance": <Scales />,
  operations: <Gear />,
  science: <Flask />,
};

/** All category types in display order */
const ALL_CATEGORIES: JobCategoryType[] = Object.keys(
  jobCategoryLabels
) as JobCategoryType[];

interface CategorySelectorProps {
  /** Currently selected category slugs */
  selected: string[];
  /** Called when selection changes */
  onChange: (selected: string[]) => void;
  /** Maximum number of selections allowed */
  max?: number;
  /** Additional class names for the container */
  className?: string;
}

export function CategorySelector({
  selected,
  onChange,
  max = 3,
  className,
}: CategorySelectorProps) {
  function toggle(category: string) {
    if (selected.includes(category)) {
      onChange(selected.filter((c) => c !== category));
    } else if (selected.length < max) {
      onChange([...selected, category]);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {ALL_CATEGORIES.map((category) => {
          const isSelected = selected.includes(category);
          const isDisabled = !isSelected && selected.length >= max;

          return (
            <button
              key={category}
              type="button"
              onClick={() => toggle(category)}
              disabled={isDisabled}
              className={cn(
                "rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-interactive-focus)] focus-visible:ring-offset-2",
                isSelected &&
                  "ring-2 ring-[var(--border-interactive-focus)] ring-offset-2",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              <CategoryTag
                category={category}
                icon={categoryIcons[category]}
                variant="full"
              />
            </button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <p className="text-caption-sm text-foreground-muted">
          {selected.length}/{max} selected
        </p>
      )}
    </div>
  );
}

"use client";

import { PathwayTag, pathwayLabels, type PathwayType } from "@/components/ui/pathway-tag";
import { cn } from "@/lib/utils";

/** All pathway types in display order */
const ALL_PATHWAYS: PathwayType[] = Object.keys(pathwayLabels) as PathwayType[];

interface PathwaySelectorProps {
  /** Currently selected pathway slugs */
  selected: string[];
  /** Called when selection changes */
  onChange: (selected: string[]) => void;
  /** Maximum number of selections allowed */
  max?: number;
  /** Additional class names for the container */
  className?: string;
}

export function PathwaySelector({ selected, onChange, max = 5, className }: PathwaySelectorProps) {
  function toggle(pathway: string) {
    if (selected.includes(pathway)) {
      onChange(selected.filter((p) => p !== pathway));
    } else if (selected.length < max) {
      onChange([...selected, pathway]);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap gap-2">
        {ALL_PATHWAYS.map((pathway) => {
          const isSelected = selected.includes(pathway);
          const isDisabled = !isSelected && selected.length >= max;

          return (
            <div key={pathway} className={cn(isDisabled && "cursor-not-allowed opacity-40")}>
              <PathwayTag
                pathway={pathway}
                selected={isSelected}
                onClick={isDisabled ? undefined : () => toggle(pathway)}
              />
            </div>
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

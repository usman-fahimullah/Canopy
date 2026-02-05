/**
 * Canopy symbol/mark for collapsed sidebar and favicon use.
 *
 * A stylized "C" letterform. Uses `currentColor` so the symbol
 * inherits the text color of its parent.
 */

import { cn } from "@/lib/utils";

interface CanopySymbolProps {
  /** Size in pixels (square) */
  size?: number;
  /** Optional className for the SVG element */
  className?: string;
  /** Accessible label (defaults to "Canopy") */
  "aria-label"?: string;
}

export function CanopySymbol({
  size = 24,
  className,
  "aria-label": ariaLabel = "Canopy",
}: CanopySymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cn("shrink-0", className)}
    >
      <path
        d="M4.62 9.384C3.676 9.384 2.856 9.18 2.16 8.772C1.464 8.356 0.928 7.796 0.552 7.092C0.184 6.38 0 5.584 0 4.704C0 3.776 0.2 2.956 0.6 2.244C1 1.532 1.556 0.98 2.268 0.588C2.988 0.196 3.808 0 4.728 0C5.832 0 6.776 0.28 7.56 0.84C8.344 1.4 8.86 2.216 9.108 3.288H7.788C7.596 2.464 7.232 1.816 6.696 1.344C6.168 0.872 5.512 0.636 4.728 0.636C4.064 0.636 3.48 0.808 2.976 1.152C2.472 1.496 2.084 1.964 1.812 2.556C1.548 3.148 1.416 3.808 1.416 4.536C1.416 5.28 1.548 5.952 1.812 6.552C2.076 7.152 2.468 7.628 2.988 7.98C3.508 8.324 4.136 8.496 4.872 8.496C5.832 8.496 6.62 8.216 7.236 7.656C7.852 7.088 8.244 6.324 8.412 5.364H9.192C9.064 6.188 8.8 6.9 8.4 7.5C8 8.1 7.476 8.564 6.828 8.892C6.188 9.22 5.452 9.384 4.62 9.384Z"
        fill="currentColor"
      />
    </svg>
  );
}

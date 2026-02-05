/**
 * Candid 4-pointed star symbol/mark for collapsed sidebar and favicon use.
 *
 * A 4-pointed compass/star shape. Uses `currentColor` so the symbol
 * inherits the text color of its parent.
 */

import { cn } from "@/lib/utils";

interface CandidSymbolProps {
  /** Size in pixels (square) */
  size?: number;
  /** Optional className for the SVG element */
  className?: string;
  /** Accessible label (defaults to "Candid") */
  "aria-label"?: string;
}

export function CandidSymbol({
  size = 24,
  className,
  "aria-label": ariaLabel = "Candid",
}: CandidSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 297 298"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cn("shrink-0", className)}
    >
      <path
        d="M77.0453 0L77.9919 1.08004C132.183 62.8866 214.536 91.944 295.311 77.7587L296.722 77.5108L246.081 122.164C215.298 149.307 200.857 190.59 207.972 231.104L219.677 297.756L218.731 296.676C164.539 234.869 82.1859 205.812 1.41142 219.997L0 220.245L50.6414 175.592C81.4242 148.449 95.8657 107.166 88.7505 66.6516L77.0453 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

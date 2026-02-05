/**
 * Green Jobs Board starburst symbol/mark for collapsed sidebar and favicon use.
 *
 * An 8-pointed starburst icon. Uses `currentColor` so the symbol
 * inherits the text color of its parent.
 */

import { cn } from "@/lib/utils";

interface GreenJobsBoardSymbolProps {
  /** Size in pixels (square) */
  size?: number;
  /** Optional className for the SVG element */
  className?: string;
  /** Accessible label (defaults to "Green Jobs Board") */
  "aria-label"?: string;
}

export function GreenJobsBoardSymbol({
  size = 24,
  className,
  "aria-label": ariaLabel = "Green Jobs Board",
}: GreenJobsBoardSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 268 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cn("shrink-0", className)}
    >
      <path
        d="M124.755 7.66779C126.655 -2.55591 141.345 -2.55594 143.245 7.66775L152.393 56.8805C153.752 64.1938 162.7 67.0931 168.11 61.9734L204.516 27.5217C212.079 20.3646 223.963 28.9751 219.475 38.3602L197.87 83.5365C194.659 90.2499 200.189 97.8403 207.583 96.8698L257.342 90.3385C267.679 88.9817 272.218 102.914 263.056 107.876L218.951 131.76C212.396 135.309 212.396 144.691 218.951 148.24L263.056 172.124C272.218 177.086 267.679 191.018 257.342 189.661L207.583 183.13C200.189 182.16 194.659 189.75 197.87 196.464L219.475 241.64C223.963 251.025 212.079 259.635 204.516 252.478L168.11 218.027C162.7 212.907 153.752 215.806 152.393 223.119L143.245 272.332C141.345 282.556 126.655 282.556 124.755 272.332L115.607 223.119C114.248 215.806 105.3 212.907 99.8903 218.027L63.4842 252.478C55.921 259.635 44.0372 251.025 48.5255 241.64L70.1302 196.464C73.3409 189.75 67.8111 182.16 60.4166 183.13L10.658 189.661C0.320914 191.018 -4.21832 177.086 4.94426 172.124L49.0493 148.24C55.6036 144.691 55.6036 135.309 49.0493 131.76L4.94429 107.876C-4.21829 102.914 0.320878 88.9817 10.658 90.3385L60.4166 96.8698C67.8111 97.8403 73.3409 90.2499 70.1302 83.5365L48.5255 38.3603C44.0372 28.9751 55.921 20.3645 63.4842 27.5217L99.8903 61.9734C105.3 67.0931 114.248 64.1938 115.607 56.8805L124.755 7.66779Z"
        fill="currentColor"
      />
    </svg>
  );
}

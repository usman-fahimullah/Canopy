/**
 * ShellLogo — renders the correct logo or symbol for the active shell.
 *
 * When collapsed, renders the compact symbol mark.
 * When expanded, renders the full wordmark logo.
 *
 * | Shell    | Symbol               | Wordmark             |
 * | -------- | -------------------- | -------------------- |
 * | talent   | GreenJobsBoardSymbol | GreenJobsBoardLogo   |
 * | coach    | CandidSymbol         | CandidLogo           |
 * | employer | CanopySymbol         | CanopyLogo           |
 */

import type { Shell } from "@/lib/onboarding/types";
import { GreenJobsBoardLogo } from "./green-jobs-board-logo";
import { GreenJobsBoardSymbol } from "./green-jobs-board-symbol";
import { CandidLogo } from "./candid-logo";
import { CandidSymbol } from "./candid-symbol";
import { CanopyLogo } from "./canopy-logo";
import { CanopySymbol } from "./canopy-symbol";

interface ShellLogoProps {
  /** Which shell to render the logo for */
  shell: Shell;
  /** Whether the sidebar is collapsed (shows symbol instead of wordmark) */
  collapsed?: boolean;
  /** CSS class applied to the wrapper */
  className?: string;
}

/** Symbol size when sidebar is collapsed (px) */
const SYMBOL_SIZE = 28;

/** Wordmark width when sidebar is expanded (px) */
const WORDMARK_WIDTHS: Record<Shell, number> = {
  talent: 140,
  coach: 100,
  employer: 100,
};

export function ShellLogo({ shell, collapsed = false, className }: ShellLogoProps) {
  if (collapsed) {
    return <ShellSymbol shell={shell} className={className} />;
  }

  return <ShellWordmark shell={shell} className={className} />;
}

function ShellSymbol({ shell, className }: { shell: Shell; className?: string }) {
  switch (shell) {
    case "talent":
      return <GreenJobsBoardSymbol size={SYMBOL_SIZE} className={className} />;
    case "coach":
      return <CandidSymbol size={SYMBOL_SIZE} className={className} />;
    case "employer":
      return <CanopySymbol size={SYMBOL_SIZE} className={className} />;
    default:
      return null;
  }
}

function ShellWordmark({ shell, className }: { shell: Shell; className?: string }) {
  const width = WORDMARK_WIDTHS[shell];

  switch (shell) {
    case "talent":
      return <GreenJobsBoardLogo width={width} className={className} />;
    case "coach":
      return <CandidLogo width={width} className={className} />;
    case "employer":
      return <CanopyLogo width={width} className={className} />;
    default:
      return null;
  }
}

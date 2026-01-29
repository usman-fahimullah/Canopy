"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  // Only run on client
  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.removeAttribute("data-theme");
    root.classList.remove("dark");

    if (newTheme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
    } else if (newTheme === "system") {
      root.setAttribute("data-theme", "system");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      }
    } else {
      root.setAttribute("data-theme", "light");
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) {
    return <div className={cn("h-9 w-[140px]", className)} />;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-lg bg-background-muted",
        className
      )}
    >
      <ThemeButton
        active={theme === "light"}
        onClick={() => handleThemeChange("light")}
        aria-label="Light theme"
      >
        <SunIcon />
      </ThemeButton>
      <ThemeButton
        active={theme === "dark"}
        onClick={() => handleThemeChange("dark")}
        aria-label="Dark theme"
      >
        <MoonIcon />
      </ThemeButton>
      <ThemeButton
        active={theme === "system"}
        onClick={() => handleThemeChange("system")}
        aria-label="System theme"
      >
        <MonitorIcon />
      </ThemeButton>
    </div>
  );
}

interface ThemeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  "aria-label": string;
}

function ThemeButton({ active, onClick, children, ...props }: ThemeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-8 h-7 rounded-md transition-all duration-150",
        active
          ? "bg-surface shadow-sm text-foreground"
          : "text-foreground-muted hover:text-foreground"
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

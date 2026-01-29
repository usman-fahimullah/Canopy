"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Search } from "@/components/Icons";
import { DesignSystemSearchModal, useSearchModal } from "./DesignSystemSearchModal";

// Dynamically import ThemeToggle with no SSR to avoid hydration issues
const ThemeToggle = dynamic(
  () => import("./ThemeToggle").then((mod) => ({ default: mod.ThemeToggle })),
  {
    ssr: false,
    loading: () => <div className="h-9 w-[140px]" />,
  }
);

interface DesignSystemHeaderProps {
  className?: string;
}

export function DesignSystemHeader({ className }: DesignSystemHeaderProps) {
  const { open, setOpen } = useSearchModal();
  const pathname = usePathname();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80",
          className
        )}
      >
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-6">
            <Link href="/design-system" className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 149 149"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-[var(--primitive-green-700)]"
              >
                <path
                  d="M133 0C141.837 0 149 7.16344 149 16V133C149 141.837 141.837 149 133 149H16C7.16344 149 4.02687e-08 141.837 0 133V16C0 7.16344 7.16344 4.02661e-08 16 0H133ZM98.1553 32C76.2113 32.0002 58.4219 49.7894 58.4219 71.7334V118.089H84.9111V78.3555C84.9112 67.3836 93.8055 58.4895 104.777 58.4893H128.783V32H98.1553ZM22 32V58.4893H53.7197C57.047 47.3098 64.4778 37.8975 74.2656 32H22Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-body-strong font-semibold text-foreground">
                Trails Design System
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="/design-system/foundations" active={pathname.startsWith("/design-system/foundations")}>
                Foundations
              </NavLink>
              <NavLink href="/design-system/components" active={pathname.startsWith("/design-system/components")}>
                Components
              </NavLink>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setOpen(true)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg",
                "bg-background-muted hover:bg-background-emphasized",
                "text-foreground-muted text-caption",
                "transition-colors duration-150",
                "w-64"
              )}
            >
              <Search className="w-4 h-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface border border-border text-caption-sm text-foreground-subtle">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-interactive-hover transition-colors"
              aria-label="View on GitHub"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <DesignSystemSearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ href, active, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-lg text-caption font-medium transition-colors",
        active
          ? "bg-background-interactive-selected text-foreground-brand"
          : "text-foreground-muted hover:text-foreground hover:bg-background-interactive-hover"
      )}
    >
      {children}
    </Link>
  );
}

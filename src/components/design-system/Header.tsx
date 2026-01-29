"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Search } from "@/components/Icons";
import { SearchModal, useSearchModal } from "./SearchModal";

// Dynamically import ThemeToggle with no SSR to avoid hydration issues
const ThemeToggle = dynamic(() => import("./ThemeToggle").then(mod => ({ default: mod.ThemeToggle })), {
  ssr: false,
  loading: () => <div className="h-9 w-[140px]" />,
});

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { open, setOpen } = useSearchModal();

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
            <a href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M12 22V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12L3 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 12L21 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-body-strong font-semibold text-foreground">
                Trails
              </span>
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink href="#foundations">Foundations</NavLink>
              <NavLink href="#components">Components</NavLink>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

function NavLink({ href, children }: NavLinkProps) {
  const [isActive, setIsActive] = useState(false);
  const sectionId = href.replace("#", "");

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        "px-3 py-2 rounded-lg text-caption font-medium transition-colors",
        isActive
          ? "bg-background-interactive-selected text-foreground-brand"
          : "text-foreground-muted hover:text-foreground hover:bg-background-interactive-hover"
      )}
    >
      {children}
    </a>
  );
}

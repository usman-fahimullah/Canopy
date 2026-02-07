"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  House,
  UsersFour,
  UsersThree,
  Envelope,
  Calendar,
  ChartBar,
  Gear,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  type: "candidate" | "role";
  subtitle?: string;
}

/**
 * Command Palette Component
 *
 * Opens with Cmd+K (Mac) or Ctrl+K (Windows/Linux).
 * Provides unified search and navigation across the application.
 *
 * Features:
 * - Navigation shortcuts to main pages
 * - Quick actions (Create role, Invite team member)
 * - Real-time search across candidates and roles
 * - Keyboard navigation (arrow keys, Enter to select, Escape to close)
 * - Uses the design system Command components
 */

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Register keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Auto-focus search input when dialog opens
  React.useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSearch = React.useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        q: query,
        type: "all",
        limit: "10",
      });

      const response = await fetch(`/api/canopy/search?${params}`);
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      const results: SearchResult[] = [];

      // Add candidates to results
      if (data.candidates && Array.isArray(data.candidates)) {
        results.push(
          ...data.candidates.map((c: { id: string; name: string; email: string }) => ({
            id: c.id,
            title: c.name,
            type: "candidate" as const,
            subtitle: c.email,
          }))
        );
      }

      // Add roles to results
      if (data.roles && Array.isArray(data.roles)) {
        results.push(
          ...data.roles.map((r: { id: string; title: string }) => ({
            id: r.id,
            title: r.title,
            type: "role" as const,
          }))
        );
      }

      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Navigation items
  const navigationItems = [
    {
      label: "Dashboard",
      icon: House,
      href: "/canopy",
      shortcut: "Cmd+Shift+D",
    },
    {
      label: "Roles",
      icon: UsersThree,
      href: "/canopy/roles",
      shortcut: "Cmd+Shift+R",
    },
    {
      label: "Candidates",
      icon: UsersFour,
      href: "/canopy/candidates",
      shortcut: "Cmd+Shift+C",
    },
    {
      label: "Messages",
      icon: Envelope,
      href: "/canopy/messages",
      shortcut: "Cmd+Shift+M",
    },
    {
      label: "Calendar",
      icon: Calendar,
      href: "/canopy/calendar",
      shortcut: "Cmd+Shift+K",
    },
    {
      label: "Analytics",
      icon: ChartBar,
      href: "/canopy/analytics",
      shortcut: "Cmd+Shift+A",
    },
    {
      label: "Team",
      icon: UsersThree,
      href: "/canopy/team",
      shortcut: "Cmd+Shift+T",
    },
    {
      label: "Settings",
      icon: Gear,
      href: "/canopy/settings",
      shortcut: "Cmd+Shift+S",
    },
  ];

  const quickActions = [
    {
      label: "Create new role",
      href: "/canopy/roles/new",
    },
    {
      label: "Invite team member",
      href: "/canopy/team/invite",
    },
  ];

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        ref={searchInputRef}
        placeholder="Search candidates, roles, or navigate..."
        showClear={true}
        onClear={() => {
          setSearchResults([]);
          if (searchInputRef.current) {
            searchInputRef.current.value = "";
            searchInputRef.current.focus();
          }
        }}
        onValueChange={handleSearch}
      />

      <CommandList>
        <CommandEmpty>
          {isSearching ? "Searching..." : "No results found."}
        </CommandEmpty>

        {/* Navigation Section */}
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={item.href}
                onSelect={() => handleSelect(item.href)}
                className="cursor-pointer"
              >
                <Icon className="mr-2 h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Quick Actions Section */}
        <CommandGroup heading="Quick Actions">
          {quickActions.map((action) => (
            <CommandItem
              key={action.href}
              onSelect={() => handleSelect(action.href)}
              className="cursor-pointer"
            >
              <span>+ {action.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Search Results Section */}
        {searchResults.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Search Results">
              {searchResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => {
                    const href =
                      result.type === "candidate"
                        ? `/canopy/candidates/${result.id}`
                        : `/canopy/roles/${result.id}`;
                    handleSelect(href);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-1 flex-col">
                    <span className="text-body-sm">{result.title}</span>
                    {result.subtitle && (
                      <span className="text-caption text-foreground-muted">
                        {result.subtitle}
                      </span>
                    )}
                  </div>
                  <span className="text-caption-sm text-foreground-muted">
                    {result.type === "candidate" ? "Candidate" : "Role"}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>

      {/* Footer with keyboard shortcut hint */}
      <div className="border-border-default border-t px-3 py-2">
        <p className="text-caption-sm text-foreground-muted">
          Press <kbd className="rounded bg-background-muted px-1.5 py-0.5 font-mono">Esc</kbd> to close
        </p>
      </div>
    </CommandDialog>
  );
}

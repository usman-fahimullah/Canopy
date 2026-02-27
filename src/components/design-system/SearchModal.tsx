"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "@/components/Icons";

interface SearchItem {
  id: string;
  title: string;
  category: string;
  href: string;
  keywords?: string[];
}

// Smooth scroll helper function
const scrollToSection = (href: string) => {
  const sectionId = href.replace("#", "");
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
};

// Search index - components and sections (hrefs must match actual section IDs in page.tsx)
const searchItems: SearchItem[] = [
  // Foundations
  {
    id: "colors",
    title: "Colors",
    category: "Foundations",
    href: "#colors",
    keywords: ["palette", "primary", "neutral"],
  },
  {
    id: "typography",
    title: "Typography",
    category: "Foundations",
    href: "#typography",
    keywords: ["font", "text", "heading"],
  },
  {
    id: "spacing",
    title: "Spacing",
    category: "Foundations",
    href: "#spacing",
    keywords: ["gap", "margin", "padding"],
  },
  {
    id: "shadows",
    title: "Shadows",
    category: "Foundations",
    href: "#shadows",
    keywords: ["elevation", "depth"],
  },
  {
    id: "borders",
    title: "Borders & Radius",
    category: "Foundations",
    href: "#borders",
    keywords: ["rounded", "corner"],
  },
  // Components
  {
    id: "buttons",
    title: "Buttons",
    category: "Components",
    href: "#buttons",
    keywords: ["cta", "action", "click"],
  },
  {
    id: "form-controls",
    title: "Form Controls",
    category: "Components",
    href: "#form-controls",
    keywords: ["input", "form", "field"],
  },
  {
    id: "input",
    title: "Input",
    category: "Components",
    href: "#input",
    keywords: ["text", "field", "form"],
  },
  {
    id: "textarea",
    title: "Textarea",
    category: "Components",
    href: "#textarea",
    keywords: ["multiline", "text"],
  },
  {
    id: "select",
    title: "Select",
    category: "Components",
    href: "#select",
    keywords: ["dropdown", "picker", "option"],
  },
  {
    id: "checkbox",
    title: "Checkbox",
    category: "Components",
    href: "#checkbox",
    keywords: ["check", "toggle", "boolean"],
  },
  {
    id: "radio",
    title: "Radio Group",
    category: "Components",
    href: "#radio",
    keywords: ["option", "choice"],
  },
  {
    id: "switch",
    title: "Switch",
    category: "Components",
    href: "#switch",
    keywords: ["toggle", "on", "off"],
  },
  {
    id: "slider",
    title: "Slider",
    category: "Components",
    href: "#slider",
    keywords: ["range", "value"],
  },
  {
    id: "data-display",
    title: "Data Display",
    category: "Components",
    href: "#data-display",
    keywords: ["badge", "avatar", "card"],
  },
  {
    id: "badge",
    title: "Badge",
    category: "Components",
    href: "#badge",
    keywords: ["tag", "label", "status"],
  },
  {
    id: "avatar",
    title: "Avatar",
    category: "Components",
    href: "#avatar",
    keywords: ["user", "profile", "image"],
  },
  {
    id: "card",
    title: "Card",
    category: "Components",
    href: "#card",
    keywords: ["container", "box"],
  },
  {
    id: "toast",
    title: "Toast",
    category: "Components",
    href: "#toast",
    keywords: ["notification", "alert", "message"],
  },
  {
    id: "overlays",
    title: "Overlays",
    category: "Components",
    href: "#overlays",
    keywords: ["dialog", "modal", "popup"],
  },
  {
    id: "dialog",
    title: "Dialog",
    category: "Components",
    href: "#dialog",
    keywords: ["modal", "popup", "overlay"],
  },
  {
    id: "modal",
    title: "Modal",
    category: "Components",
    href: "#modal",
    keywords: ["dialog", "popup"],
  },
  {
    id: "tooltip",
    title: "Tooltip",
    category: "Components",
    href: "#tooltip",
    keywords: ["hint", "hover"],
  },
  {
    id: "toolbar",
    title: "Toolbar",
    category: "Components",
    href: "#toolbar",
    keywords: ["actions", "editor"],
  },
  {
    id: "tabs",
    title: "Tabs",
    category: "Components",
    href: "#tabs",
    keywords: ["navigation", "panel"],
  },
  {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    category: "Components",
    href: "#breadcrumbs",
    keywords: ["navigation", "path"],
  },
  {
    id: "pagination",
    title: "Pagination",
    category: "Components",
    href: "#pagination",
    keywords: ["pages", "navigation"],
  },
  {
    id: "dropdown-menu",
    title: "Dropdown Menu",
    category: "Components",
    href: "#dropdown-menu",
    keywords: ["menu", "context", "dropdown"],
  },
  {
    id: "kanban",
    title: "Kanban Board",
    category: "Components",
    href: "#kanban",
    keywords: ["board", "drag", "drop", "pipeline"],
  },
  {
    id: "candidate-card",
    title: "Candidate Card",
    category: "Components",
    href: "#candidate-card",
    keywords: ["ats", "profile", "applicant"],
  },
  {
    id: "stage-badge",
    title: "Stage Badge",
    category: "Components",
    href: "#stage-badge",
    keywords: ["pipeline", "status", "progress"],
  },
  {
    id: "scorecard",
    title: "Scorecard",
    category: "Components",
    href: "#scorecard",
    keywords: ["rating", "evaluation", "feedback"],
  },
  {
    id: "chips",
    title: "Chips",
    category: "Components",
    href: "#chips",
    keywords: ["tag", "filter", "removable"],
  },
  {
    id: "segmented-controller",
    title: "Segmented Controller",
    category: "Components",
    href: "#segmented-controller",
    keywords: ["toggle", "switch", "options"],
  },
  {
    id: "search-input",
    title: "Search Input",
    category: "Components",
    href: "#search-input",
    keywords: ["search", "location", "filter"],
  },
];

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = React.useMemo(() => {
    if (!query) return searchItems.slice(0, 8);
    const lower = query.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.keywords?.some((k) => k.includes(lower))
    );
  }, [query]);

  // Reset selection when results change
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  // Focus input when opened
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredItems.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          scrollToSection(filteredItems[selectedIndex].href);
          onOpenChange(false);
        }
        break;
      case "Escape":
        onOpenChange(false);
        break;
    }
  };

  // Handle click on search result
  const handleResultClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    scrollToSection(href);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 animate-fade-in bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[20%] z-50 mx-auto max-w-xl animate-scale-in">
        <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-5 w-5 text-foreground-subtle" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search components, tokens..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent py-4 text-body text-foreground outline-none placeholder:text-foreground-subtle"
            />
            <kbd className="hidden items-center gap-1 rounded bg-background-muted px-2 py-1 text-xs text-foreground-muted sm:inline-flex">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-foreground-muted">
                No results found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, index) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleResultClick(e, item.href)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors",
                      index === selectedIndex
                        ? "bg-background-interactive-selected text-foreground-interactive-selected"
                        : "text-foreground hover:bg-background-interactive-hover"
                    )}
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-foreground-muted">{item.category}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border bg-background-subtle px-4 py-3 text-xs text-foreground-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface px-1.5 py-0.5">↑</kbd>
                <kbd className="rounded border border-border bg-surface px-1.5 py-0.5">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface px-1.5 py-0.5">↵</kbd>
                <span>Select</span>
              </span>
            </div>
            <span>Press ESC to close</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to open search with Cmd+K
export function useSearchModal() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return { open, setOpen };
}

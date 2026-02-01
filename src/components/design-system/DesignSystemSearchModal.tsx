"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "@/components/Icons";
import { searchIndex, type SearchItem } from "@/lib/design-system-nav";

interface SearchModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchModalContext = React.createContext<SearchModalContextType | null>(null);

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
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

  return (
    <SearchModalContext.Provider value={{ open, setOpen }}>{children}</SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = React.useContext(SearchModalContext);

  // Always call hooks unconditionally (React rules of hooks)
  const [fallbackOpen, setFallbackOpen] = React.useState(false);

  React.useEffect(() => {
    // Only attach the listener if there's no provider
    if (context) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setFallbackOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [context]);

  if (context) {
    return context;
  }

  // Fallback for usage outside provider
  return { open: fallbackOpen, setOpen: setFallbackOpen };
}

interface DesignSystemSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesignSystemSearchModal({ open, onOpenChange }: DesignSystemSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = React.useMemo(() => {
    if (!query) return searchIndex.slice(0, 10);
    const lower = query.toLowerCase();
    return searchIndex.filter(
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

  const navigateToItem = (item: SearchItem) => {
    router.push(item.href);
    onOpenChange(false);
  };

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
          navigateToItem(filteredItems[selectedIndex]);
        }
        break;
      case "Escape":
        onOpenChange(false);
        break;
    }
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
                  <button
                    key={item.id}
                    onClick={() => navigateToItem(item)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors",
                      index === selectedIndex
                        ? "bg-background-interactive-selected text-foreground-brand"
                        : "text-foreground hover:bg-background-interactive-hover"
                    )}
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-foreground-muted">{item.category}</span>
                  </button>
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

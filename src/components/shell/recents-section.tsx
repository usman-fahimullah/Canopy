"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { useSidebar } from "./sidebar-context";
import type { RecentsConfig, RecentItem } from "@/lib/shell/types";
import { cn } from "@/lib/utils";

interface RecentsSectionProps {
  config: RecentsConfig;
}

export function RecentsSection({ config }: RecentsSectionProps) {
  const { collapsed } = useSidebar();
  const [items, setItems] = useState<RecentItem[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  // Determine how many items to show based on viewport
  const [maxItems, setMaxItems] = useState(5);

  useEffect(() => {
    function updateMaxItems() {
      // Show 3 items on shorter viewports, 5 on taller ones
      setMaxItems(window.innerHeight < 800 ? 3 : 5);
    }
    updateMaxItems();
    window.addEventListener("resize", updateMaxItems);
    return () => window.removeEventListener("resize", updateMaxItems);
  }, []);

  const fetchRecents = useCallback(async () => {
    try {
      const res = await fetch(config.apiEndpoint);
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items || []);
    } catch {
      // Silently fail — recents are non-critical
    } finally {
      setLoading(false);
    }
  }, [config.apiEndpoint]);

  useEffect(() => {
    fetchRecents();
  }, [fetchRecents]);

  // Don't render when sidebar is collapsed
  if (collapsed) return null;

  const visibleItems = items.slice(0, maxItems);

  return (
    <div className="mt-2 px-3">
      {/* Section header with toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="hover:text-foreground-default flex w-full items-center justify-between px-2 py-1.5 text-caption text-foreground-muted transition-colors"
      >
        <span className="font-medium">{config.label}</span>
        {expanded ? <CaretUp size={14} weight="bold" /> : <CaretDown size={14} weight="bold" />}
      </button>

      {/* Items list */}
      {expanded && (
        <div className="mt-0.5 space-y-0.5">
          {loading ? (
            // Skeleton
            <div className="space-y-1 px-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 animate-pulse rounded-md bg-[var(--background-subtle)]"
                />
              ))}
            </div>
          ) : visibleItems.length > 0 ? (
            visibleItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5",
                  "text-caption text-foreground-muted",
                  "hover:text-foreground-default hover:bg-[var(--shell-nav-item-hover)]",
                  "truncate transition-colors"
                )}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-foreground-subtle" />
                <span className="truncate">{item.title}</span>
              </Link>
            ))
          ) : (
            <p className="px-2 py-1.5 text-caption text-foreground-subtle">{config.emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}

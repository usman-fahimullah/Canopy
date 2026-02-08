"use client";

import { useRef, useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PencilSimple, Export } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StickyProfileBarProps {
  name: string | null;
  avatar: string | null;
  location: string | null;
  isOwner?: boolean;
  onEditCover?: () => void;
  onShare?: () => void;
}

/**
 * A sticky bar that appears at the top of the page when the user scrolls
 * past the main profile header. Uses IntersectionObserver on a sentinel
 * element to trigger the transition.
 *
 * Render this component right after <ProfileHeader /> in the page layout.
 * It renders a zero-height sentinel element that triggers the sticky bar
 * when it scrolls out of view.
 */
export function StickyProfileBar({
  name,
  avatar,
  location,
  isOwner = true,
  onEditCover,
  onShare,
}: StickyProfileBarProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sentinel — zero-height element that acts as the scroll trigger */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

      {/* Sticky bar — uses sticky positioning so it respects the sidebar layout */}
      <div
        className={cn(
          "sticky top-0 z-[var(--z-sticky)] overflow-hidden border-b transition-all duration-300 ease-out",
          visible
            ? "bg-[var(--background-default)]/95 max-h-16 border-[var(--border-default)] opacity-100 backdrop-blur-md"
            : "max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="flex items-center justify-between px-12 py-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "transition-all duration-300",
                visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
              )}
            >
              <Avatar
                src={avatar ?? undefined}
                name={name ?? undefined}
                size="sm"
                shape="circle"
                color="purple"
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-2 transition-all duration-300",
                visible ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
              )}
            >
              <span className="text-body-sm font-semibold text-[var(--foreground-default)]">
                {name ?? "Your Name"}
              </span>
              {location && (
                <>
                  <span className="text-[var(--foreground-subtle)]">·</span>
                  <span className="text-caption text-[var(--foreground-muted)]">{location}</span>
                </>
              )}
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              visible ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
            )}
          >
            {isOwner && (
              <Button variant="outline" size="sm" onClick={onEditCover} tabIndex={visible ? 0 : -1}>
                <PencilSimple size={16} weight="regular" className="mr-1.5" />
                Edit
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onShare} tabIndex={visible ? 0 : -1}>
              <Export size={16} weight="regular" className="mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

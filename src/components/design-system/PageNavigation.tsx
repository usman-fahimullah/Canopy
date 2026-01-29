"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "@/components/Icons";
import { getPrevNext } from "@/lib/design-system-nav";

interface PageNavigationProps {
  currentPath: string;
}

export function PageNavigation({ currentPath }: PageNavigationProps) {
  const { prev, next } = getPrevNext(currentPath);

  if (!prev && !next) return null;

  return (
    <nav className="flex items-center justify-between pt-8 mt-8 border-t border-border">
      {prev ? (
        <Link
          href={prev.href}
          className={cn(
            "group flex items-center gap-2 px-4 py-3 rounded-xl",
            "text-foreground-muted hover:text-foreground",
            "bg-surface hover:bg-background-subtle border border-border",
            "transition-all duration-200"
          )}
        >
          <ChevronRight className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" />
          <div className="text-left">
            <div className="text-caption text-foreground-muted">Previous</div>
            <div className="text-body-sm font-medium">{prev.label}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={next.href}
          className={cn(
            "group flex items-center gap-2 px-4 py-3 rounded-xl",
            "text-foreground-muted hover:text-foreground",
            "bg-surface hover:bg-background-subtle border border-border",
            "transition-all duration-200"
          )}
        >
          <div className="text-right">
            <div className="text-caption text-foreground-muted">Next</div>
            <div className="text-body-sm font-medium">{next.label}</div>
          </div>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

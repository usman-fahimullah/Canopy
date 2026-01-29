"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}

interface OnThisPageProps {
  items: TocItem[];
  className?: string;
}

export function OnThisPage({ items, className }: OnThisPageProps) {
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Update URL without scroll
      window.history.pushState(null, "", `#${id}`);
      setActiveId(id);
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className={cn("", className)} aria-label="On this page">
      <h3 className="text-caption-sm font-semibold text-foreground-muted uppercase tracking-wider mb-3">
        On This Page
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={cn(
                "block py-1 text-caption transition-colors duration-150",
                item.level === 3 && "pl-3",
                activeId === item.id
                  ? "text-foreground-brand font-medium"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Helper to extract headings from the page
export function useTableOfContents() {
  const [items, setItems] = React.useState<TocItem[]>([]);

  React.useEffect(() => {
    const headings = document.querySelectorAll("h2[id], h3[id]");
    const tocItems: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id;
      const title = heading.textContent || "";
      const level = heading.tagName === "H2" ? 2 : 3;

      if (id && title) {
        tocItems.push({ id, title, level });
      }
    });

    setItems(tocItems);
  }, []);

  return items;
}

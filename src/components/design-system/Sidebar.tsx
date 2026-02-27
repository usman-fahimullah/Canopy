"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "@/components/Icons";

interface NavItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Foundations",
    items: [
      {
        id: "colors",
        label: "Colors",
        children: [
          { id: "colors-primary", label: "Primary" },
          { id: "colors-neutral", label: "Neutral" },
          { id: "colors-semantic", label: "Semantic" },
          { id: "colors-secondary", label: "Secondary" },
        ],
      },
      {
        id: "typography",
        label: "Typography",
        children: [
          { id: "typography-scale", label: "Type Scale" },
          { id: "typography-weights", label: "Weights" },
        ],
      },
      {
        id: "spacing",
        label: "Spacing",
      },
      {
        id: "shadows",
        label: "Shadows",
      },
      {
        id: "borders",
        label: "Borders & Radius",
      },
    ],
  },
  {
    title: "Components",
    items: [
      {
        id: "buttons",
        label: "Buttons",
        children: [
          { id: "buttons-primary", label: "Primary" },
          { id: "buttons-secondary", label: "Secondary" },
          { id: "buttons-tertiary", label: "Tertiary" },
          { id: "buttons-destructive", label: "Destructive" },
          { id: "buttons-utility", label: "Utility" },
        ],
      },
      {
        id: "form-controls",
        label: "Form Controls",
        children: [
          { id: "input", label: "Input" },
          { id: "textarea", label: "Textarea" },
          { id: "select", label: "Select" },
          { id: "checkbox", label: "Checkbox" },
          { id: "radio", label: "Radio" },
          { id: "switch", label: "Switch" },
          { id: "slider", label: "Slider" },
          { id: "segmented-controller", label: "Segmented Controller" },
          { id: "search-input", label: "Search Input" },
          { id: "chips", label: "Chips" },
        ],
      },
      {
        id: "data-display",
        label: "Data Display",
        children: [
          { id: "badge", label: "Badge" },
          { id: "avatar", label: "Avatar" },
          { id: "card", label: "Card" },
          { id: "toast", label: "Toast" },
        ],
      },
      {
        id: "overlays",
        label: "Overlays",
        children: [
          { id: "dialog", label: "Dialog" },
          { id: "modal", label: "Modal" },
          { id: "tooltip", label: "Tooltip" },
        ],
      },
      {
        id: "toolbar",
        label: "Toolbar",
      },
      {
        id: "navigation",
        label: "Navigation",
        children: [
          { id: "tabs", label: "Tabs" },
          { id: "breadcrumbs", label: "Breadcrumbs" },
          { id: "pagination", label: "Pagination" },
          { id: "dropdown-menu", label: "Dropdown Menu" },
        ],
      },
      {
        id: "ats-components",
        label: "ATS Components",
        children: [
          { id: "kanban", label: "Kanban Board" },
          { id: "candidate-card", label: "Candidate Card" },
          { id: "stage-badge", label: "Stage Badge" },
          { id: "scorecard", label: "Scorecard" },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "colors",
    "typography",
    "buttons",
    "form-controls",
    "data-display",
    "overlays",
    "navigation",
    "ats-components",
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    // Observe all sections
    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const renderNavItem = (item: NavItem) => (
    <li key={item.id}>
      {item.children ? (
        <>
          <button
            onClick={() => toggleExpand(item.id)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-body-sm transition-colors",
              "hover:bg-background-interactive-hover",
              activeSection === item.id || item.children.some((c) => c.id === activeSection)
                ? "font-medium text-foreground-brand"
                : "text-foreground"
            )}
          >
            <span>{item.label}</span>
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                expandedItems.includes(item.id) && "rotate-90"
              )}
            />
          </button>
          {expandedItems.includes(item.id) && (
            <ul className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
              {item.children.map((child) => (
                <li key={child.id}>
                  <button
                    onClick={() => scrollToSection(child.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-1.5 text-left text-caption transition-colors",
                      "hover:bg-background-interactive-hover",
                      activeSection === child.id
                        ? "bg-background-interactive-selected font-medium text-foreground-interactive-selected"
                        : "text-foreground-muted"
                    )}
                  >
                    {child.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <button
          onClick={() => scrollToSection(item.id)}
          className={cn(
            "w-full rounded-lg px-3 py-2 text-left text-body-sm transition-colors",
            "hover:bg-background-interactive-hover",
            activeSection === item.id
              ? "bg-background-interactive-selected font-medium text-foreground-interactive-selected"
              : "text-foreground"
          )}
        >
          {item.label}
        </button>
      )}
    </li>
  );

  return (
    <nav className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto pr-4">
      {navSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h2 className="mb-3 px-3 text-caption-strong uppercase tracking-wide text-foreground-muted">
            {section.title}
          </h2>
          <ul className="space-y-1">{section.items.map(renderNavItem)}</ul>
        </div>
      ))}
    </nav>
  );
}

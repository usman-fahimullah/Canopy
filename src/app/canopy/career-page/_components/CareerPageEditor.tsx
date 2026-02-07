"use client";

import { useState, useEffect, useCallback } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Banner } from "@/components/ui/banner";
import type {
  CareerPageConfig,
  CareerPageSection,
  CareerPageTheme,
} from "@/lib/career-pages/types";
import { DEFAULT_CAREER_PAGE_CONFIG } from "@/lib/career-pages/default-template";
import { logger, formatError } from "@/lib/logger";
import { arrayMove } from "@dnd-kit/sortable";
import { EditorToolbar } from "./EditorToolbar";
import { EditorCanvas } from "./EditorCanvas";
import { SectionEditPanel } from "./SectionEditPanel";
import { PageSettingsSheet } from "./PageSettingsSheet";
import type { DeviceMode } from "./DeviceFrame";

interface CareerPageData {
  slug: string | null;
  enabled: boolean;
  config: CareerPageConfig;
  orgName: string;
  orgSlug: string;
}

/* ------------------------------------------------------------------ */
/* Default section factory (moved from old page.tsx)                   */
/* ------------------------------------------------------------------ */

function createDefaultSection(type: CareerPageSection["type"]): CareerPageSection {
  switch (type) {
    case "hero":
      return { type: "hero", headline: "Join Our Team", subheadline: "Explore open positions" };
    case "about":
      return { type: "about", title: "About Us", content: "" };
    case "values":
      return {
        type: "values",
        title: "Our Values",
        items: [
          { icon: "Leaf", title: "Sustainability", description: "" },
          { icon: "Users", title: "Teamwork", description: "" },
          { icon: "Lightbulb", title: "Innovation", description: "" },
        ],
      };
    case "impact":
      return {
        type: "impact",
        title: "Our Impact",
        metrics: [
          { value: "0", label: "Metric 1" },
          { value: "0", label: "Metric 2" },
          { value: "0", label: "Metric 3" },
        ],
      };
    case "benefits":
      return {
        type: "benefits",
        title: "Benefits",
        items: [
          { icon: "Heart", title: "Health & Wellness", description: "" },
          { icon: "House", title: "Remote Work", description: "" },
        ],
      };
    case "team":
      return {
        type: "team",
        title: "Meet the Team",
        members: [{ name: "Team Member", role: "Role" }],
      };
    case "openRoles":
      return { type: "openRoles", title: "Open Positions", showFilters: true };
    case "cta":
      return { type: "cta", headline: "Ready to join us?", buttonText: "View All Roles" };
    case "testimonials":
      return {
        type: "testimonials",
        title: "What Our Team Says",
        items: [
          {
            quote: "Great company to work for",
            author: "Jane Doe",
            role: "Engineer",
            photo: undefined,
          },
        ],
      };
    case "faq":
      return {
        type: "faq",
        title: "Frequently Asked Questions",
        items: [
          {
            question: "What is the hiring process?",
            answer:
              "Our hiring process typically takes 2-3 weeks and includes initial screening, technical interviews, and a final round.",
          },
        ],
      };
  }
}

/* ------------------------------------------------------------------ */
/* Main editor                                                         */
/* ------------------------------------------------------------------ */

export function CareerPageEditor() {
  // Data loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core state
  const [config, setConfig] = useState<CareerPageConfig>(DEFAULT_CAREER_PAGE_CONFIG);
  const [slug, setSlug] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [orgSlug, setOrgSlug] = useState("");

  // UI state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ----- Fetch config on mount -----
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/canopy/career-page");
        if (!res.ok) throw new Error("Failed to load career page config");
        const json = await res.json();
        const pageData = json.data as CareerPageData;
        setConfig(pageData.config);
        setEnabled(pageData.enabled);
        setSlug(pageData.slug || pageData.orgSlug);
        setOrgSlug(pageData.orgSlug);
      } catch (err) {
        logger.error("Error fetching career page config", { error: formatError(err) });
        setError("Failed to load career page settings");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // ----- Unsaved changes warning -----
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ----- Save -----
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/canopy/career-page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, enabled, slug }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save");
      }

      setSaveSuccess(true);
      setIsDirty(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save career page";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  }, [config, enabled, slug]);

  // ----- Keyboard shortcuts -----
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Escape to deselect
      if (e.key === "Escape" && selectedIndex !== null) {
        setSelectedIndex(null);
      }
      // Cmd/Ctrl+S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleSave]);

  // ----- Section CRUD -----
  const markDirty = useCallback(() => setIsDirty(true), []);

  const updateSection = useCallback(
    (index: number, updates: Partial<CareerPageSection>) => {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.map((s, i) =>
          i === index ? ({ ...s, ...updates } as CareerPageSection) : s
        ),
      }));
      markDirty();
    },
    [markDirty]
  );

  const deleteSection = useCallback(
    (index: number) => {
      setConfig((prev) => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== index),
      }));
      if (selectedIndex === index) setSelectedIndex(null);
      else if (selectedIndex !== null && selectedIndex > index) setSelectedIndex(selectedIndex - 1);
      markDirty();
    },
    [selectedIndex, markDirty]
  );

  const moveSection = useCallback(
    (oldIndex: number, newIndex: number) => {
      setConfig((prev) => ({
        ...prev,
        sections: arrayMove(prev.sections, oldIndex, newIndex),
      }));
      // Keep selection following the moved section
      if (selectedIndex === oldIndex) {
        setSelectedIndex(newIndex);
      } else if (selectedIndex !== null) {
        if (oldIndex < selectedIndex && newIndex >= selectedIndex) {
          setSelectedIndex(selectedIndex - 1);
        } else if (oldIndex > selectedIndex && newIndex <= selectedIndex) {
          setSelectedIndex(selectedIndex + 1);
        }
      }
      markDirty();
    },
    [selectedIndex, markDirty]
  );

  const insertSection = useCallback(
    (type: CareerPageSection["type"], atIndex: number) => {
      const newSection = createDefaultSection(type);
      setConfig((prev) => {
        const sections = [...prev.sections];
        sections.splice(atIndex, 0, newSection);
        return { ...prev, sections };
      });
      setSelectedIndex(atIndex);
      markDirty();
    },
    [markDirty]
  );

  const handleThemeChange = useCallback(
    (theme: CareerPageTheme) => {
      setConfig((prev) => ({ ...prev, theme }));
      markDirty();
    },
    [markDirty]
  );

  const handleSlugChange = useCallback(
    (newSlug: string) => {
      setSlug(newSlug);
      markDirty();
    },
    [markDirty]
  );

  const handleEnabledChange = useCallback(
    (newEnabled: boolean) => {
      setEnabled(newEnabled);
      markDirty();
    },
    [markDirty]
  );

  // ----- Preview URL -----
  const previewUrl =
    typeof window !== "undefined" && slug ? `${window.location.origin}/careers/${slug}` : null;

  // ----- Loading state -----
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background-default)]">
        <Spinner size="lg" />
      </div>
    );
  }

  // ----- Selected section -----
  const selectedSection = selectedIndex !== null ? (config.sections[selectedIndex] ?? null) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background-default)]">
      {/* Error banner */}
      {error && (
        <div className="px-4 pt-2">
          <Banner type="critical" title={error} />
        </div>
      )}

      {/* Toolbar */}
      <EditorToolbar
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onSave={handleSave}
        onOpenSettings={() => setSettingsOpen(true)}
        isSaving={isSaving}
        saveSuccess={saveSuccess}
        isDirty={isDirty}
        isPublished={enabled}
        previewUrl={previewUrl}
      />

      {/* Main area: canvas + optional edit panel */}
      <div className="flex min-h-0 flex-1">
        {/* Canvas */}
        <EditorCanvas
          config={config}
          deviceMode={deviceMode}
          selectedIndex={selectedIndex}
          onSelectSection={setSelectedIndex}
          onDeleteSection={deleteSection}
          onMoveSection={moveSection}
          onInsertSection={insertSection}
          orgSlug={orgSlug}
        />

        {/* Edit panel (slides in when section selected) */}
        {selectedSection && selectedIndex !== null && (
          <SectionEditPanel
            section={selectedSection}
            onUpdate={(updates) => updateSection(selectedIndex, updates)}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </div>

      {/* Page settings sheet */}
      <PageSettingsSheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        slug={slug}
        onSlugChange={handleSlugChange}
        enabled={enabled}
        onEnabledChange={handleEnabledChange}
        theme={config.theme}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}

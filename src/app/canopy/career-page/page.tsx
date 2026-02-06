"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch, SwitchWithLabel } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Banner } from "@/components/ui/banner";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import { Plus, Trash, DotsSixVertical, Eye, ArrowSquareOut, Globe } from "@phosphor-icons/react";
import type { CareerPageConfig, CareerPageSection } from "@/lib/career-pages/types";
import { DEFAULT_CAREER_PAGE_CONFIG } from "@/lib/career-pages/default-template";
import { logger, formatError } from "@/lib/logger";

interface CareerPageData {
  slug: string | null;
  enabled: boolean;
  config: CareerPageConfig;
  orgName: string;
  orgSlug: string;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Banner",
  about: "About Us",
  values: "Our Values",
  impact: "Impact Metrics",
  benefits: "Benefits",
  team: "Team Members",
  openRoles: "Open Positions",
  cta: "Call to Action",
};

export default function CareerPageEditor() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const [data, setData] = React.useState<CareerPageData | null>(null);
  const [config, setConfig] = React.useState<CareerPageConfig>(DEFAULT_CAREER_PAGE_CONFIG);
  const [enabled, setEnabled] = React.useState(false);
  const [slug, setSlug] = React.useState("");
  const [selectedSectionIndex, setSelectedSectionIndex] = React.useState<number | null>(null);

  // Fetch current config
  React.useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/canopy/career-page");
        if (!res.ok) throw new Error("Failed to load career page config");
        const json = await res.json();
        const pageData = json.data as CareerPageData;
        setData(pageData);
        setConfig(pageData.config);
        setEnabled(pageData.enabled);
        setSlug(pageData.slug || pageData.orgSlug);
      } catch (err) {
        logger.error("Error fetching career page config", { error: formatError(err) });
        setError("Failed to load career page settings");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, []);

  // Save handler
  const handleSave = async () => {
    setSaving(true);
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
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save career page";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Section helpers
  const addSection = (type: CareerPageSection["type"]) => {
    const newSection = createDefaultSection(type);
    setConfig((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setSelectedSectionIndex(config.sections.length);
  };

  const removeSection = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    if (selectedSectionIndex === index) setSelectedSectionIndex(null);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.sections.length) return;
    setConfig((prev) => {
      const sections = [...prev.sections];
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return { ...prev, sections };
    });
    setSelectedSectionIndex(newIndex);
  };

  const updateSection = (index: number, updates: Partial<CareerPageSection>) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s, i) =>
        i === index ? ({ ...s, ...updates } as CareerPageSection) : s
      ),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const previewUrl = slug ? `${window.location.origin}/careers/${slug}` : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
            Career Page
          </h1>
          <p className="text-body-sm text-[var(--foreground-muted)]">
            Customize your public career page to attract talent
          </p>
        </div>
        <div className="flex items-center gap-3">
          {previewUrl && enabled && (
            <Button variant="tertiary" size="sm" onClick={() => window.open(previewUrl, "_blank")}>
              <Eye size={16} weight="bold" className="mr-1.5" />
              Preview
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>
      </div>

      {error && <Banner type="critical" title={error} />}
      {saveSuccess && <Banner type="success" title="Career page saved successfully" />}

      {/* Settings Card */}
      <FormCard>
        <FormSection
          title="Page Settings"
          description="Configure your career page URL and visibility"
        >
          <FormField label="Career Page URL">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--foreground-muted)]">
                {typeof window !== "undefined" ? window.location.origin : ""}/careers/
              </span>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-company"
                className="max-w-xs"
              />
            </div>
          </FormField>

          <div className="mt-4">
            <SwitchWithLabel
              label="Publish Career Page"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
            <p className="mt-1.5 text-caption text-[var(--foreground-muted)]">
              When enabled, your career page is publicly accessible
            </p>
          </div>

          {enabled && previewUrl && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--foreground-brand)]">
              <Globe size={16} />
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="underline">
                {previewUrl}
              </a>
              <ArrowSquareOut size={14} />
            </div>
          )}
        </FormSection>
      </FormCard>

      {/* Theme Card */}
      <FormCard>
        <FormSection title="Brand Theme" description="Customize colors and typography">
          <div className="flex gap-6">
            <FormField label="Primary Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="primaryColor"
                  value={config.theme.primaryColor}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value },
                    }))
                  }
                  className="h-10 w-10 cursor-pointer rounded border border-[var(--border-muted)]"
                />
                <Input
                  value={config.theme.primaryColor}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      theme: { ...prev.theme, primaryColor: e.target.value },
                    }))
                  }
                  className="w-28"
                />
              </div>
            </FormField>
            <FormField label="Font Family">
              <Input
                id="fontFamily"
                value={config.theme.fontFamily}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    theme: { ...prev.theme, fontFamily: e.target.value },
                  }))
                }
                className="w-48"
              />
            </FormField>
          </div>
        </FormSection>
      </FormCard>

      {/* Sections List + Editor */}
      <div className="flex gap-6">
        {/* Left: Section List */}
        <div className="w-72 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-caption-strong">Sections</Label>
            <AddSectionMenu onAdd={addSection} />
          </div>

          {config.sections.map((section, index) => (
            <button
              key={index}
              onClick={() => setSelectedSectionIndex(index)}
              className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                selectedSectionIndex === index
                  ? "border-[var(--border-brand)] bg-[var(--background-brand-subtle)]"
                  : "border-[var(--border-muted)] hover:border-[var(--border-default)]"
              }`}
            >
              <DotsSixVertical size={16} className="shrink-0 text-[var(--foreground-subtle)]" />
              <span className="flex-1 font-medium text-[var(--foreground-default)]">
                {SECTION_LABELS[section.type] || section.type}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(index);
                }}
                className="rounded p-1 text-[var(--foreground-subtle)] hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]"
              >
                <Trash size={14} />
              </button>
            </button>
          ))}
        </div>

        {/* Right: Section Editor */}
        <div className="flex-1">
          {selectedSectionIndex !== null && config.sections[selectedSectionIndex] ? (
            <SectionEditor
              section={config.sections[selectedSectionIndex]}
              index={selectedSectionIndex}
              total={config.sections.length}
              onUpdate={(updates) => updateSection(selectedSectionIndex, updates)}
              onMove={(dir) => moveSection(selectedSectionIndex, dir)}
            />
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[var(--border-muted)] text-[var(--foreground-muted)]">
              Select a section to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Add Section Menu
// =====================================================================

function AddSectionMenu({ onAdd }: { onAdd: (type: CareerPageSection["type"]) => void }) {
  const [open, setOpen] = React.useState(false);

  const types: CareerPageSection["type"][] = [
    "hero",
    "about",
    "values",
    "impact",
    "benefits",
    "team",
    "openRoles",
    "cta",
  ];

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
        <Plus size={16} weight="bold" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-[var(--border-muted)] bg-[var(--background-default)] py-1 shadow-[var(--shadow-dropdown)]">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--background-interactive-hover)]"
            >
              {SECTION_LABELS[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// Section Editor — form fields per section type
// =====================================================================

function SectionEditor({
  section,
  index,
  total,
  onUpdate,
  onMove,
}: {
  section: CareerPageSection;
  index: number;
  total: number;
  onUpdate: (updates: Partial<CareerPageSection>) => void;
  onMove: (dir: "up" | "down") => void;
}) {
  return (
    <FormCard>
      <FormSection
        title={SECTION_LABELS[section.type] || section.type}
        description={`Edit the content for this ${section.type} section`}
      >
        <div className="mb-4 flex gap-2">
          <Button variant="tertiary" size="sm" disabled={index === 0} onClick={() => onMove("up")}>
            Move Up
          </Button>
          <Button
            variant="tertiary"
            size="sm"
            disabled={index === total - 1}
            onClick={() => onMove("down")}
          >
            Move Down
          </Button>
        </div>

        {section.type === "hero" && (
          <div className="space-y-4">
            <FormField label="Headline">
              <Input
                id="hero-headline"
                value={section.headline}
                onChange={(e) => onUpdate({ headline: e.target.value })}
              />
            </FormField>
            <FormField label="Subheadline">
              <Input
                id="hero-subheadline"
                value={section.subheadline}
                onChange={(e) => onUpdate({ subheadline: e.target.value })}
              />
            </FormField>
            <FormField label="Background Image URL (optional)">
              <Input
                id="hero-bg"
                value={section.backgroundImage || ""}
                onChange={(e) => onUpdate({ backgroundImage: e.target.value || undefined })}
                placeholder="https://..."
              />
            </FormField>
          </div>
        )}

        {section.type === "about" && (
          <div className="space-y-4">
            <FormField label="Title">
              <Input
                id="about-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            <FormField label="Content">
              <textarea
                id="about-content"
                value={section.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                rows={5}
                className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
              />
            </FormField>
            <FormField label="Image URL (optional)">
              <Input
                id="about-image"
                value={section.image || ""}
                onChange={(e) => onUpdate({ image: e.target.value || undefined })}
                placeholder="https://..."
              />
            </FormField>
          </div>
        )}

        {section.type === "values" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="values-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            {section.items.map((item, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-[var(--border-muted)] p-3">
                <Label className="text-caption-strong">Value {i + 1}</Label>
                <Input
                  placeholder="Icon name (e.g., Leaf, Users, Lightbulb)"
                  value={item.icon}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], icon: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], title: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], description: e.target.value };
                    onUpdate({ items });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {section.type === "impact" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="impact-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            {section.metrics.map((metric, i) => (
              <div key={i} className="flex gap-3">
                <Input
                  placeholder="Value (e.g., 50K)"
                  value={metric.value}
                  onChange={(e) => {
                    const metrics = [...section.metrics];
                    metrics[i] = { ...metrics[i], value: e.target.value };
                    onUpdate({ metrics });
                  }}
                  className="w-32"
                />
                <Input
                  placeholder="Label (e.g., Tons CO2 Reduced)"
                  value={metric.label}
                  onChange={(e) => {
                    const metrics = [...section.metrics];
                    metrics[i] = { ...metrics[i], label: e.target.value };
                    onUpdate({ metrics });
                  }}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        )}

        {section.type === "benefits" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="benefits-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            {section.items.map((item, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-[var(--border-muted)] p-3">
                <Label className="text-caption-strong">Benefit {i + 1}</Label>
                <Input
                  placeholder="Icon name"
                  value={item.icon}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], icon: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], title: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], description: e.target.value };
                    onUpdate({ items });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {section.type === "team" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="team-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            {section.members.map((member, i) => (
              <div key={i} className="flex gap-3">
                <Input
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => {
                    const members = [...section.members];
                    members[i] = { ...members[i], name: e.target.value };
                    onUpdate({ members });
                  }}
                />
                <Input
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => {
                    const members = [...section.members];
                    members[i] = { ...members[i], role: e.target.value };
                    onUpdate({ members });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {section.type === "openRoles" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="roles-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            <SwitchWithLabel
              label="Show Filters"
              checked={section.showFilters}
              onCheckedChange={(checked) => onUpdate({ showFilters: checked })}
            />
            <p className="mt-1.5 text-caption text-[var(--foreground-muted)]">
              Allow visitors to filter by location type or employment type
            </p>
          </div>
        )}

        {section.type === "cta" && (
          <div className="space-y-4">
            <FormField label="Headline">
              <Input
                id="cta-headline"
                value={section.headline}
                onChange={(e) => onUpdate({ headline: e.target.value })}
              />
            </FormField>
            <FormField label="Button Text">
              <Input
                id="cta-button"
                value={section.buttonText}
                onChange={(e) => onUpdate({ buttonText: e.target.value })}
              />
            </FormField>
          </div>
        )}
      </FormSection>
    </FormCard>
  );
}

// =====================================================================
// Section defaults
// =====================================================================

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
  }
}

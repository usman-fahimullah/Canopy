"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch, SwitchWithLabel } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { Banner } from "@/components/ui/banner";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import {
  Plus,
  Trash,
  DotsSixVertical,
  Eye,
  ArrowSquareOut,
  Globe,
  Quotes,
  Question,
} from "@phosphor-icons/react";
import type { CareerPageConfig, CareerPageSection } from "@/lib/career-pages/types";
import { DEFAULT_CAREER_PAGE_CONFIG } from "@/lib/career-pages/default-template";
import { logger, formatError } from "@/lib/logger";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SimpleRichTextEditor } from "@/components/ui/rich-text-editor";

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
  testimonials: "Testimonials",
  faq: "FAQ",
};

// =====================================================================
// SortableSectionItem — drag-and-drop list item
// =====================================================================

function SortableSectionItem({
  section,
  index,
  isSelected,
  onSelect,
  onDelete,
}: {
  section: CareerPageSection;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `section-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 transition-colors ${
        isSelected
          ? "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand-emphasis)]"
          : "text-[var(--foreground-muted)] hover:bg-[var(--background-interactive-hover)]"
      }`}
      onClick={onSelect}
    >
      <button {...attributes} {...listeners} className="cursor-grab touch-none">
        <DotsSixVertical size={16} weight="bold" />
      </button>
      <span className="flex-1 truncate text-sm font-medium">
        {SECTION_LABELS[section.type] || section.type}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Trash
          size={14}
          className="text-[var(--foreground-muted)] hover:text-[var(--foreground-error)]"
        />
      </button>
    </div>
  );
}

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

  // Drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.replace("section-", ""));
    const newIndex = parseInt(over.id.replace("section-", ""));

    const newSections = arrayMove(config.sections, oldIndex, newIndex);
    setConfig({ ...config, sections: newSections });

    // Adjust selected index
    if (selectedSectionIndex === oldIndex) {
      setSelectedSectionIndex(newIndex);
    } else if (selectedSectionIndex !== null) {
      if (oldIndex < selectedSectionIndex && newIndex >= selectedSectionIndex) {
        setSelectedSectionIndex(selectedSectionIndex - 1);
      } else if (oldIndex > selectedSectionIndex && newIndex <= selectedSectionIndex) {
        setSelectedSectionIndex(selectedSectionIndex + 1);
      }
    }
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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={config.sections.map((_, i) => `section-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {config.sections.map((section, index) => (
                <SortableSectionItem
                  key={index}
                  section={section}
                  index={index}
                  isSelected={selectedSectionIndex === index}
                  onSelect={() => setSelectedSectionIndex(index)}
                  onDelete={() => removeSection(index)}
                />
              ))}
            </SortableContext>
          </DndContext>
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
    "testimonials",
    "faq",
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
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-[var(--background-interactive-hover)]"
            >
              {type === "testimonials" && <Quotes size={16} weight="bold" />}
              {type === "faq" && <Question size={16} weight="bold" />}
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
              <SimpleRichTextEditor
                value={(section as any).content || ""}
                onChange={(html) => onUpdate({ content: html })}
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

        {section.type === "testimonials" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="testimonials-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            {section.items.map((item, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-[var(--border-muted)] p-3">
                <Label className="text-caption-strong">Testimonial {i + 1}</Label>
                <Input
                  placeholder="Quote"
                  value={item.quote}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], quote: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Author Name"
                  value={item.author}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], author: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Author Role"
                  value={item.role}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], role: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <Input
                  placeholder="Photo URL (optional)"
                  value={item.photo || ""}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], photo: e.target.value || undefined };
                    onUpdate({ items });
                  }}
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    const items = section.items.filter((_, idx) => idx !== i);
                    onUpdate({ items });
                  }}
                >
                  <Trash size={14} className="mr-1.5" />
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const items = [
                  ...section.items,
                  { quote: "", author: "", role: "", photo: undefined },
                ];
                onUpdate({ items });
              }}
            >
              <Plus size={14} className="mr-1.5" />
              Add Testimonial
            </Button>
          </div>
        )}

        {section.type === "faq" && (
          <div className="space-y-4">
            <FormField label="Section Title">
              <Input
                id="faq-title"
                value={section.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
              />
            </FormField>
            {section.items.map((item, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-[var(--border-muted)] p-3">
                <Label className="text-caption-strong">Question {i + 1}</Label>
                <Input
                  placeholder="Question"
                  value={item.question}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], question: e.target.value };
                    onUpdate({ items });
                  }}
                />
                <textarea
                  placeholder="Answer"
                  value={item.answer}
                  onChange={(e) => {
                    const items = [...section.items];
                    items[i] = { ...items[i], answer: e.target.value };
                    onUpdate({ items });
                  }}
                  rows={3}
                  className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2"
                />
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    const items = section.items.filter((_, idx) => idx !== i);
                    onUpdate({ items });
                  }}
                >
                  <Trash size={14} className="mr-1.5" />
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                const items = [...section.items, { question: "", answer: "" }];
                onUpdate({ items });
              }}
            >
              <Plus size={14} className="mr-1.5" />
              Add Question
            </Button>
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

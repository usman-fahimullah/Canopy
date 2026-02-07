"use client";

import { X, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SwitchWithLabel } from "@/components/ui/switch";
import { SimpleRichTextEditor } from "@/components/ui/rich-text-editor";
import type { CareerPageSection } from "@/lib/career-pages/types";
import { SECTION_LABELS } from "./constants";

interface SectionEditPanelProps {
  section: CareerPageSection;
  onUpdate: (updates: Partial<CareerPageSection>) => void;
  onClose: () => void;
}

export function SectionEditPanel({ section, onUpdate, onClose }: SectionEditPanelProps) {
  return (
    <div className="flex h-full w-[380px] shrink-0 flex-col border-l border-[var(--border-default)] bg-[var(--background-default)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
        <h2 className="text-sm font-semibold text-[var(--foreground-default)]">
          {SECTION_LABELS[section.type] || section.type}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
          aria-label="Close edit panel"
        >
          <X size={18} />
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4">
        <SectionFields section={section} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section-specific form fields                                        */
/* ------------------------------------------------------------------ */

function SectionFields({
  section,
  onUpdate,
}: {
  section: CareerPageSection;
  onUpdate: (updates: Partial<CareerPageSection>) => void;
}) {
  switch (section.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <Field label="Headline">
            <Input
              value={section.headline}
              onChange={(e) => onUpdate({ headline: e.target.value })}
            />
          </Field>
          <Field label="Subheadline">
            <Input
              value={section.subheadline}
              onChange={(e) => onUpdate({ subheadline: e.target.value })}
            />
          </Field>
          <Field label="Background Image URL">
            <Input
              value={section.backgroundImage || ""}
              onChange={(e) => onUpdate({ backgroundImage: e.target.value || undefined })}
              placeholder="https://..."
            />
          </Field>
        </div>
      );

    case "about":
      return (
        <div className="space-y-4">
          <Field label="Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          <Field label="Content">
            <SimpleRichTextEditor
              value={section.content || ""}
              onChange={(html) => onUpdate({ content: html })}
            />
          </Field>
          <Field label="Image URL">
            <Input
              value={section.image || ""}
              onChange={(e) => onUpdate({ image: e.target.value || undefined })}
              placeholder="https://..."
            />
          </Field>
        </div>
      );

    case "values":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.items.map((item, i) => (
            <ItemCard key={i} label={`Value ${i + 1}`}>
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
            </ItemCard>
          ))}
        </div>
      );

    case "impact":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.metrics.map((metric, i) => (
            <div key={i} className="flex gap-2">
              <Input
                placeholder="Value (e.g., 50K)"
                value={metric.value}
                onChange={(e) => {
                  const metrics = [...section.metrics];
                  metrics[i] = { ...metrics[i], value: e.target.value };
                  onUpdate({ metrics });
                }}
                className="w-24"
              />
              <Input
                placeholder="Label"
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
      );

    case "benefits":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.items.map((item, i) => (
            <ItemCard key={i} label={`Benefit ${i + 1}`}>
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
            </ItemCard>
          ))}
        </div>
      );

    case "team":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.members.map((member, i) => (
            <div key={i} className="flex gap-2">
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
      );

    case "openRoles":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          <SwitchWithLabel
            label="Show Filters"
            checked={section.showFilters}
            onCheckedChange={(checked) => onUpdate({ showFilters: checked })}
          />
          <p className="text-xs text-[var(--foreground-subtle)]">
            Allow visitors to filter by location type or employment type
          </p>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <Field label="Headline">
            <Input
              value={section.headline}
              onChange={(e) => onUpdate({ headline: e.target.value })}
            />
          </Field>
          <Field label="Button Text">
            <Input
              value={section.buttonText}
              onChange={(e) => onUpdate({ buttonText: e.target.value })}
            />
          </Field>
        </div>
      );

    case "testimonials":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.items.map((item, i) => (
            <ItemCard key={i} label={`Testimonial ${i + 1}`}>
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
            </ItemCard>
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
      );

    case "faq":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.items.map((item, i) => (
            <ItemCard key={i} label={`Question ${i + 1}`}>
              <Input
                placeholder="Question"
                value={item.question}
                onChange={(e) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], question: e.target.value };
                  onUpdate({ items });
                }}
              />
              <Textarea
                placeholder="Answer"
                value={item.answer}
                onChange={(e) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], answer: e.target.value };
                  onUpdate({ items });
                }}
                rows={3}
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
            </ItemCard>
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
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Shared field components                                             */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-[var(--foreground-muted)]">{label}</Label>
      {children}
    </div>
  );
}

function ItemCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border border-[var(--border-muted)] p-3">
      <Label className="text-xs font-semibold text-[var(--foreground-muted)]">{label}</Label>
      {children}
    </div>
  );
}

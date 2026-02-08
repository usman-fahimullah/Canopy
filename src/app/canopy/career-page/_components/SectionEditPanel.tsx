"use client";

import { ArrowLeft, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SwitchWithLabel } from "@/components/ui/switch";
import { SimpleRichTextEditor } from "@/components/ui/rich-text-editor";
import { Tabs, TabsContent, TabsListUnderline, TabsTriggerUnderline } from "@/components/ui/tabs";
import type { CareerPageSection, CareerPageTheme, SectionStyle } from "@/lib/career-pages/types";
import { SectionStyleControls } from "./SectionStyleControls";
import { SECTION_LABELS } from "./constants";

interface SectionEditPanelProps {
  section: CareerPageSection;
  onUpdate: (updates: Partial<CareerPageSection>) => void;
  onClose: () => void;
  theme?: CareerPageTheme;
}

export function SectionEditPanel({ section, onUpdate, onClose, theme }: SectionEditPanelProps) {
  const handleStyleChange = (styleUpdates: Partial<SectionStyle>) => {
    const currentStyle = section.style || {};
    onUpdate({ style: { ...currentStyle, ...styleUpdates } } as Partial<CareerPageSection>);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header with back button + section name */}
      <div className="flex items-center gap-2 border-b border-[var(--border-default)] px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={onClose}
          aria-label="Back to page overview"
        >
          <ArrowLeft size={18} />
        </Button>
        <h2 className="text-sm font-semibold text-[var(--foreground-default)]">
          {SECTION_LABELS[section.type] || section.type}
        </h2>
      </div>

      {/* Tabs: Content / Design */}
      <Tabs defaultValue="content" className="flex min-h-0 flex-1 flex-col">
        <TabsListUnderline className="shrink-0 px-4">
          <TabsTriggerUnderline value="content">Content</TabsTriggerUnderline>
          <TabsTriggerUnderline value="design">Design</TabsTriggerUnderline>
        </TabsListUnderline>

        {/* Content Tab */}
        <TabsContent
          value="content"
          className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden"
        >
          <SectionFields section={section} onUpdate={onUpdate} />
        </TabsContent>

        {/* Design Tab */}
        <TabsContent
          value="design"
          className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden"
        >
          {theme ? (
            <SectionStyleControls
              style={section.style}
              theme={theme}
              onStyleChange={handleStyleChange}
            />
          ) : (
            <p className="text-xs text-[var(--foreground-subtle)]">
              Theme not available. Save and reload to enable design controls.
            </p>
          )}
        </TabsContent>
      </Tabs>
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
          <Field label="CTA Button Text">
            <Input
              value={section.ctaButtonText || ""}
              onChange={(e) => onUpdate({ ctaButtonText: e.target.value || undefined })}
              placeholder="e.g., View Open Roles"
            />
          </Field>
          <Field label="CTA Button URL">
            <Input
              value={section.ctaButtonUrl || ""}
              onChange={(e) => onUpdate({ ctaButtonUrl: e.target.value || undefined })}
              placeholder="#open-positions or https://..."
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
            <ItemCard
              key={i}
              label={`Value ${i + 1}`}
              onRemove={() => {
                const items = section.items.filter((_, idx) => idx !== i);
                onUpdate({ items });
              }}
            >
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const items = [...section.items, { icon: "Star", title: "", description: "" }];
              onUpdate({ items });
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Add Value
          </Button>
        </div>
      );

    case "impact":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.metrics.map((metric, i) => (
            <ItemCard
              key={i}
              label={`Metric ${i + 1}`}
              onRemove={() => {
                const metrics = section.metrics.filter((_, idx) => idx !== i);
                onUpdate({ metrics });
              }}
            >
              <div className="flex gap-2">
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
            </ItemCard>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const metrics = [...section.metrics, { value: "0", label: "" }];
              onUpdate({ metrics });
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Add Metric
          </Button>
        </div>
      );

    case "benefits":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.items.map((item, i) => (
            <ItemCard
              key={i}
              label={`Benefit ${i + 1}`}
              onRemove={() => {
                const items = section.items.filter((_, idx) => idx !== i);
                onUpdate({ items });
              }}
            >
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
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const items = [...section.items, { icon: "CheckCircle", title: "", description: "" }];
              onUpdate({ items });
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Add Benefit
          </Button>
        </div>
      );

    case "team":
      return (
        <div className="space-y-4">
          <Field label="Section Title">
            <Input value={section.title} onChange={(e) => onUpdate({ title: e.target.value })} />
          </Field>
          {section.members.map((member, i) => (
            <ItemCard
              key={i}
              label={`Member ${i + 1}`}
              onRemove={() => {
                const members = section.members.filter((_, idx) => idx !== i);
                onUpdate({ members });
              }}
            >
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
              <Input
                placeholder="Photo URL (optional)"
                value={member.photo || ""}
                onChange={(e) => {
                  const members = [...section.members];
                  members[i] = { ...members[i], photo: e.target.value || undefined };
                  onUpdate({ members });
                }}
              />
              <Input
                placeholder="Bio (optional)"
                value={member.bio || ""}
                onChange={(e) => {
                  const members = [...section.members];
                  members[i] = { ...members[i], bio: e.target.value || undefined };
                  onUpdate({ members });
                }}
              />
            </ItemCard>
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const members = [...section.members, { name: "", role: "" }];
              onUpdate({ members });
            }}
          >
            <Plus size={14} className="mr-1.5" />
            Add Member
          </Button>
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
            <ItemCard
              key={i}
              label={`Testimonial ${i + 1}`}
              onRemove={() => {
                const items = section.items.filter((_, idx) => idx !== i);
                onUpdate({ items });
              }}
            >
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
            <ItemCard
              key={i}
              label={`Question ${i + 1}`}
              onRemove={() => {
                const items = section.items.filter((_, idx) => idx !== i);
                onUpdate({ items });
              }}
            >
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

function ItemCard({
  label,
  children,
  onRemove,
}: {
  label: string;
  children: React.ReactNode;
  onRemove?: () => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-[var(--border-muted)] p-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-[var(--foreground-muted)]">{label}</Label>
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-[var(--foreground-subtle)] hover:text-[var(--foreground-error)]"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
          >
            <Trash size={14} />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

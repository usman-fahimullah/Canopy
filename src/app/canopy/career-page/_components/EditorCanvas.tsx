"use client";

import { useRef, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { CareerPageConfig, CareerPageSection } from "@/lib/career-pages/types";
import type { DeviceMode } from "./DeviceFrame";
import { DeviceFrame } from "./DeviceFrame";
import { EditorSectionWrapper } from "./EditorSectionWrapper";
import { SectionInsertButton } from "./SectionInsertButton";
import { HeroBlock } from "@/components/career-pages/sections/HeroBlock";
import { AboutBlock } from "@/components/career-pages/sections/AboutBlock";
import { ValuesBlock } from "@/components/career-pages/sections/ValuesBlock";
import { ImpactBlock } from "@/components/career-pages/sections/ImpactBlock";
import { BenefitsBlock } from "@/components/career-pages/sections/BenefitsBlock";
import { TeamBlock } from "@/components/career-pages/sections/TeamBlock";
import { OpenRolesBlock } from "@/components/career-pages/sections/OpenRolesBlock";
import { CTABlock } from "@/components/career-pages/sections/CTABlock";
import { TestimonialsBlock } from "@/components/career-pages/sections/TestimonialsBlock";
import { FAQBlock } from "@/components/career-pages/sections/FAQBlock";
import type {
  HeroSection,
  AboutSection,
  ValuesSection,
  ImpactSection,
  BenefitsSection,
  TeamSection,
  OpenRolesSection,
  CTASection,
  TestimonialsSection,
  FAQSection,
} from "@/lib/career-pages/types";
import { Plus } from "@phosphor-icons/react";
import { SECTION_LABELS } from "./constants";

interface EditorCanvasProps {
  config: CareerPageConfig;
  deviceMode: DeviceMode;
  selectedIndex: number | null;
  onSelectSection: (index: number | null) => void;
  onDeleteSection: (index: number) => void;
  onMoveSection: (oldIndex: number, newIndex: number) => void;
  onInsertSection: (type: CareerPageSection["type"], atIndex: number) => void;
  orgSlug: string;
}

export function EditorCanvas({
  config,
  deviceMode,
  selectedIndex,
  onSelectSection,
  onDeleteSection,
  onMoveSection,
  onInsertSection,
  orgSlug,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = parseInt(String(active.id).replace("section-", ""));
      const newIndex = parseInt(String(over.id).replace("section-", ""));
      onMoveSection(oldIndex, newIndex);
    },
    [onMoveSection]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Deselect when clicking the canvas background (not a section)
      if (e.target === canvasRef.current || e.target === canvasRef.current?.firstChild) {
        onSelectSection(null);
      }
    },
    [onSelectSection]
  );

  const { sections, theme } = config;

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-y-auto bg-[var(--background-muted)] p-6"
      onClick={handleCanvasClick}
      style={{ fontFamily: theme.fontFamily }}
    >
      <DeviceFrame mode={deviceMode}>
        <div className="bg-[var(--background-default)]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((_, i) => `section-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {/* Insert button before first section */}
              <SectionInsertButton onInsert={(type) => onInsertSection(type, 0)} />

              {sections.map((section, index) => (
                <div key={`${section.type}-${index}`}>
                  <EditorSectionWrapper
                    id={`section-${index}`}
                    index={index}
                    isSelected={selectedIndex === index}
                    sectionLabel={SECTION_LABELS[section.type] || section.type}
                    onSelect={() => onSelectSection(index)}
                    onDelete={() => onDeleteSection(index)}
                  >
                    {renderSection(section, theme, orgSlug)}
                  </EditorSectionWrapper>

                  {/* Insert button after each section */}
                  <SectionInsertButton onInsert={(type) => onInsertSection(type, index + 1)} />
                </div>
              ))}
            </SortableContext>
          </DndContext>

          {/* Empty state */}
          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                <Plus size={28} weight="bold" className="text-[var(--foreground-brand)]" />
              </div>
              <h3 className="text-body-strong text-[var(--foreground-default)]">
                Add your first section
              </h3>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                Use the + button above to add sections to your career page
              </p>
            </div>
          )}
        </div>
      </DeviceFrame>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section rendering (reuses the existing block components)            */
/* ------------------------------------------------------------------ */

function renderSection(
  section: CareerPageSection,
  theme: CareerPageConfig["theme"],
  orgSlug: string
) {
  switch (section.type) {
    case "hero":
      return <HeroBlock section={section as HeroSection} theme={theme} />;
    case "about":
      return <AboutBlock section={section as AboutSection} />;
    case "values":
      return <ValuesBlock section={section as ValuesSection} />;
    case "impact":
      return <ImpactBlock section={section as ImpactSection} theme={theme} />;
    case "benefits":
      return <BenefitsBlock section={section as BenefitsSection} />;
    case "team":
      return <TeamBlock section={section as TeamSection} />;
    case "openRoles":
      return <OpenRolesBlock section={section as OpenRolesSection} jobs={[]} orgSlug={orgSlug} />;
    case "cta":
      return <CTABlock section={section as CTASection} theme={theme} />;
    case "testimonials":
      return (
        <TestimonialsBlock
          title={section.title}
          items={(section as TestimonialsSection).items}
          theme={theme}
        />
      );
    case "faq":
      return <FAQBlock title={section.title} items={(section as FAQSection).items} theme={theme} />;
    default:
      return null;
  }
}

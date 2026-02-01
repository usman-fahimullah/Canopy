"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip, ChipGroup } from "@/components/ui/chip";
import { PathwayTag, PathwayType, pathwayLabels } from "@/components/ui/pathway-tag";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Plus } from "@phosphor-icons/react";
import {
  Plant,
  Bank,
  Tree,
  Car,
  Recycle,
  Mountains,
  Flask,
  Baseball,
  Drop,
  HardHat,
  Factory,
  House,
  City,
  GraduationCap,
  FirstAid,
  Airplane,
  Lightning,
  Cpu,
  Palette,
  Broadcast,
  Scroll,
} from "@phosphor-icons/react";

/**
 * Skills & Pathways Screen - Onboarding Step 4 (Seeker Flow)
 *
 * Based on Figma design (146:3576)
 * User adds their skills and selects interested career pathways
 */

// Pathway icons mapping
const pathwayIcons: Record<PathwayType, React.ReactNode> = {
  agriculture: <Plant />,
  finance: <Bank />,
  forestry: <Tree />,
  transportation: <Car />,
  "waste-management": <Recycle />,
  conservation: <Mountains />,
  research: <Flask />,
  sports: <Baseball />,
  water: <Drop />,
  construction: <HardHat />,
  manufacturing: <Factory />,
  "real-estate": <House />,
  "urban-planning": <City />,
  education: <GraduationCap />,
  medical: <FirstAid />,
  tourism: <Airplane />,
  energy: <Lightning />,
  technology: <Cpu />,
  "arts-culture": <Palette />,
  media: <Broadcast />,
  policy: <Scroll />,
};

// All available pathways
const allPathways: PathwayType[] = [
  "agriculture",
  "conservation",
  "construction",
  "education",
  "energy",
  "finance",
  "forestry",
  "manufacturing",
  "media",
  "medical",
  "policy",
  "real-estate",
  "research",
  "technology",
  "tourism",
  "transportation",
  "urban-planning",
  "waste-management",
  "water",
  "arts-culture",
  "sports",
];

export default function SkillsPathwaysPage() {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [selectedPathways, setSelectedPathways] = useState<PathwayType[]>([]);
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    router.push("/seeker/career-journey");
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "seeker-skills",
          data: { skills, selectedPathways },
        }),
      });
    } catch (err) {
      console.error("Failed to save skills:", err);
    }
    setSaving(false);
    router.push("/candid/dashboard");
  };

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const togglePathway = (pathway: PathwayType) => {
    setSelectedPathways((prev) =>
      prev.includes(pathway)
        ? prev.filter((p) => p !== pathway)
        : [...prev, pathway]
    );
  };

  const isFormValid = selectedPathways.length > 0;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          Skills & Interests
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Add your skills and select the climate sectors that interest you
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8 mb-8">
        {/* Skills Input */}
        <div className="space-y-3">
          <Label htmlFor="skills">
            Your skills
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="skills"
              type="text"
              placeholder="e.g., Python, Project Management, Data Analysis"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addSkill}
              disabled={!skillInput.trim()}
              leftIcon={<Plus weight="bold" size={20} />}
            >
              Add
            </Button>
          </div>

          {/* Skills chips */}
          {skills.length > 0 && (
            <ChipGroup gap={2}>
              {skills.map((skill) => (
                <Chip
                  key={skill}
                  variant="primary"
                  removable
                  onRemove={() => removeSkill(skill)}
                >
                  {skill}
                </Chip>
              ))}
            </ChipGroup>
          )}
        </div>

        {/* Pathways Selection */}
        <div className="space-y-3">
          <Label required>
            Which climate sectors interest you?
          </Label>
          <p className="text-sm text-[var(--primitive-neutral-500)] -mt-1">
            Select one or more pathways to see relevant opportunities
          </p>

          <div className="flex flex-wrap gap-2">
            {allPathways.map((pathway) => (
              <PathwayTag
                key={pathway}
                pathway={pathway}
                icon={pathwayIcons[pathway]}
                selected={selectedPathways.includes(pathway)}
                onClick={() => togglePathway(pathway)}
              />
            ))}
          </div>

          {selectedPathways.length > 0 && (
            <p className="text-sm text-[var(--primitive-green-600)] font-medium">
              {selectedPathways.length} pathway{selectedPathways.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          onClick={handleBack}
          leftIcon={<ArrowLeft weight="bold" size={20} />}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          loading={saving}
          className="flex-1"
          rightIcon={<ArrowRight weight="bold" size={20} />}
        >
          Complete Setup
        </Button>
      </div>
    </div>
  );
}

"use client";

import { Chip } from "@/components/ui/chip";
import { Leaf, Certificate, Toolbox } from "@phosphor-icons/react";

interface SkillsCertificationsSectionProps {
  skills: string[];
  greenSkills: string[];
  certifications: string[];
  yearsExperience: number | null;
}

export function SkillsCertificationsSection({
  skills,
  greenSkills,
  certifications,
  yearsExperience,
}: SkillsCertificationsSectionProps) {
  const hasContent =
    skills.length > 0 ||
    greenSkills.length > 0 ||
    certifications.length > 0 ||
    yearsExperience !== null;

  if (!hasContent) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-caption-strong font-semibold text-[var(--foreground-default)]">
        Skills & Certifications
      </h3>

      {yearsExperience !== null && (
        <p className="text-caption text-[var(--foreground-muted)]">
          {yearsExperience} year{yearsExperience !== 1 ? "s" : ""} of experience
        </p>
      )}

      {greenSkills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-caption text-[var(--foreground-success)]">
            <Leaf size={14} weight="bold" />
            <span className="font-medium">Green Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {greenSkills.map((skill) => (
              <Chip key={skill} variant="primary" size="sm">
                {skill}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-caption text-[var(--foreground-muted)]">
            <Toolbox size={14} weight="bold" />
            <span className="font-medium">Skills</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Chip key={skill} variant="neutral" size="sm">
                {skill}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-caption text-[var(--foreground-info)]">
            <Certificate size={14} weight="bold" />
            <span className="font-medium">Certifications</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <Chip key={cert} variant="blue" size="sm">
                {cert}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AboutSectionProps {
  createdAt: Date;
  source: string | null;
  skills: string[];
  certifications: string[];
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <dt className="text-caption text-[var(--foreground-muted)]">{label}</dt>
      <dd className="text-caption font-medium text-[var(--foreground-default)]">{children}</dd>
    </div>
  );
}

export function AboutSection({ createdAt, source, skills, certifications }: AboutSectionProps) {
  return (
    <section>
      <h3 className="mb-3 text-body font-semibold text-[var(--foreground-default)]">About</h3>
      <dl className="divide-y divide-[var(--border-muted)]">
        <InfoRow label="Created">{format(new Date(createdAt), "MMM dd, yyyy")}</InfoRow>
        <InfoRow label="Origin">Applied</InfoRow>
        {source && (
          <InfoRow label="Source">
            <div className="flex items-center gap-2">
              <Chip size="sm" variant="neutral">
                {source}
              </Chip>
              <button className="text-caption text-[var(--foreground-link)] hover:underline">
                + Add source
              </button>
            </div>
          </InfoRow>
        )}

        {/* Skills as tags */}
        {skills.length > 0 && (
          <div className="py-3">
            <dt className="mb-2 text-caption text-[var(--foreground-muted)]">Skills</dt>
            <dd className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <Chip key={skill} size="sm" variant="neutral">
                  {skill}
                </Chip>
              ))}
            </dd>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="py-3">
            <dt className="mb-2 text-caption text-[var(--foreground-muted)]">Certifications</dt>
            <dd className="flex flex-wrap gap-1.5">
              {certifications.map((cert) => (
                <Badge key={cert} variant="success" size="sm">
                  {cert}
                </Badge>
              ))}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}

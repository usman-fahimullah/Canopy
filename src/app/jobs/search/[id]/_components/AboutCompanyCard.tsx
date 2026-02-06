"use client";

import { Avatar, Button } from "@/components/ui";
import type { Organization } from "./types";

interface AboutCompanyCardProps {
  organization: Organization;
}

export function AboutCompanyCard({ organization }: AboutCompanyCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border-muted)] bg-[var(--background-default)] p-6">
      <div className="flex flex-col items-center gap-3">
        <Avatar
          size="xl"
          src={organization.logo ?? undefined}
          name={organization.name}
          className="rounded-2xl"
        />
        <div className="text-center">
          <p className="text-body font-bold text-[var(--foreground-default)]">
            About {organization.name}
          </p>
          {organization.description && (
            <p className="mt-1 line-clamp-3 text-body text-[var(--foreground-muted)]">
              {organization.description}
            </p>
          )}
        </div>
      </div>
      <Button variant="tertiary" className="w-full">
        Read More
      </Button>
    </div>
  );
}

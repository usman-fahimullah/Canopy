"use client";

import { HouseSimple } from "@phosphor-icons/react";

export default function EmployerDashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-[var(--primitive-blue-100)] flex items-center justify-center">
            <HouseSimple size={22} weight="fill" className="text-[var(--candid-foreground-brand)]" />
          </div>
          <div>
            <h1 className="text-heading-sm font-bold text-foreground-default">
              Welcome to Canopy
            </h1>
            <p className="text-body-sm text-foreground-muted">
              Your climate hiring dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Active Roles</h3>
            <p className="text-caption text-foreground-muted">
              No roles posted yet. Create your first job listing.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Candidates</h3>
            <p className="text-caption text-foreground-muted">
              Candidates will appear once you start receiving applications.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Team</h3>
            <p className="text-caption text-foreground-muted">
              Invite your team members to collaborate on hiring.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Analytics</h3>
            <p className="text-caption text-foreground-muted">
              Hiring analytics will populate as you start using the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

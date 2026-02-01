"use client";

import { HouseSimple } from "@phosphor-icons/react";

export default function TalentDashboardPage() {
  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-[var(--primitive-green-100)] flex items-center justify-center">
            <HouseSimple size={22} weight="fill" className="text-[var(--candid-foreground-brand)]" />
          </div>
          <div>
            <h1 className="text-heading-sm font-bold text-foreground-default">
              Welcome to Green Jobs
            </h1>
            <p className="text-body-sm text-foreground-muted">
              Your climate career dashboard
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Job Matches</h3>
            <p className="text-caption text-foreground-muted">
              No matches yet. We&apos;ll start finding roles that fit your profile.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Applications</h3>
            <p className="text-caption text-foreground-muted">
              You haven&apos;t applied to any roles yet.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Skills Progress</h3>
            <p className="text-caption text-foreground-muted">
              Track your climate skills growth over time.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-[var(--primitive-neutral-200)] bg-white">
            <h3 className="font-semibold text-foreground-default mb-2">Messages</h3>
            <p className="text-caption text-foreground-muted">
              No new messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

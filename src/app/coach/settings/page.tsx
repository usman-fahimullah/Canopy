"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  ShieldCheck,
  Clock,
  CurrencyDollar,
  SignOut,
  CaretRight,
} from "@phosphor-icons/react";

const SETTING_SECTIONS = [
  { id: "profile", label: "Profile", description: "Manage your coach profile", icon: User },
  { id: "availability", label: "Availability", description: "Set your available hours", icon: Clock },
  { id: "payments", label: "Payments", description: "Manage Stripe and payouts", icon: CurrencyDollar },
  { id: "notifications", label: "Notifications", description: "Notification preferences", icon: Bell },
  { id: "privacy", label: "Privacy", description: "Privacy and account settings", icon: ShieldCheck },
];

export default function CoachSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="flex flex-col lg:flex-row gap-6 px-8 py-6 lg:px-12">
        <nav className="lg:w-64 flex-shrink-0">
          <div className="space-y-1">
            {SETTING_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[var(--primitive-yellow-100)] text-[var(--primitive-green-800)]"
                      : "text-foreground-muted hover:bg-[var(--primitive-neutral-100)]"
                  }`}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span className="text-body-sm font-medium">{section.label}</span>
                </button>
              );
            })}
            <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[var(--primitive-red-600)] hover:bg-[var(--primitive-red-100)] transition-colors">
              <SignOut size={20} weight="regular" />
              <span className="text-body-sm font-medium">Sign out</span>
            </button>
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="space-y-6">
            <h2 className="text-heading-sm font-medium text-foreground-default capitalize">
              {activeSection}
            </h2>
            <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8 text-center">
              <p className="text-body text-foreground-muted">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} settings will be available here.
              </p>
              <p className="text-caption text-foreground-muted mt-2">
                This section is under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

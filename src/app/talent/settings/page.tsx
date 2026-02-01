"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import {
  User,
  Bell,
  ShieldCheck,
  SignOut,
  CaretRight,
} from "@phosphor-icons/react";

const SETTING_SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    description: "Manage your name, email, and avatar",
    icon: User,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Choose what notifications you receive",
    icon: Bell,
  },
  {
    id: "privacy",
    label: "Privacy",
    description: "Control your profile visibility and data",
    icon: ShieldCheck,
  },
];

export default function TalentSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="flex flex-col lg:flex-row gap-6 px-8 py-6 lg:px-12">
        {/* Sidebar nav */}
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
                      ? "bg-[var(--primitive-green-100)] text-[var(--primitive-green-800)]"
                      : "text-foreground-muted hover:bg-[var(--primitive-neutral-100)]"
                  }`}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span className="text-body-sm font-medium">{section.label}</span>
                </button>
              );
            })}
            <button
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[var(--primitive-red-600)] hover:bg-[var(--primitive-red-100)] transition-colors"
            >
              <SignOut size={20} weight="regular" />
              <span className="text-body-sm font-medium">Sign out</span>
            </button>
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          {activeSection === "profile" && (
            <div className="space-y-6">
              <h2 className="text-heading-sm font-medium text-foreground-default">Profile</h2>
              <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white divide-y divide-[var(--primitive-neutral-200)]">
                {[
                  { label: "Full name", value: "Your Name" },
                  { label: "Email", value: "you@example.com" },
                  { label: "Avatar", value: "Upload a photo" },
                ].map((field) => (
                  <div key={field.label} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-body-sm font-medium text-foreground-default">{field.label}</p>
                      <p className="text-caption text-foreground-muted">{field.value}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CaretRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-heading-sm font-medium text-foreground-default">Notifications</h2>
              <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white divide-y divide-[var(--primitive-neutral-200)]">
                {[
                  { label: "Job alerts", description: "Get notified about new matching jobs" },
                  { label: "Application updates", description: "Status changes on your applications" },
                  { label: "Messages", description: "New messages from employers and coaches" },
                  { label: "Email digest", description: "Weekly summary of activity" },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-body-sm font-medium text-foreground-default">{pref.label}</p>
                      <p className="text-caption text-foreground-muted">{pref.description}</p>
                    </div>
                    <div
                      className="w-10 h-6 rounded-full bg-[var(--primitive-green-500)] relative cursor-pointer"
                    >
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-6">
              <h2 className="text-heading-sm font-medium text-foreground-default">Privacy</h2>
              <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white divide-y divide-[var(--primitive-neutral-200)]">
                {[
                  { label: "Profile visibility", description: "Control who can see your profile" },
                  { label: "Search visibility", description: "Appear in employer search results" },
                  { label: "Download my data", description: "Export all your data" },
                  { label: "Delete account", description: "Permanently delete your account and data", danger: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className={`text-body-sm font-medium ${item.danger ? "text-[var(--primitive-red-600)]" : "text-foreground-default"}`}>
                        {item.label}
                      </p>
                      <p className="text-caption text-foreground-muted">{item.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CaretRight size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

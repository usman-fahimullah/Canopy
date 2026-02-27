"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Buildings,
  Palette,
  UsersThree,
  TreeStructure,
  Bell,
  ShieldCheck,
  EnvelopeSimple,
  Plugs,
  CreditCard,
  SignOut,
} from "@phosphor-icons/react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Navigation Config
   ------------------------------------------------------------------- */

interface NavItem {
  href: string;
  label: string;
  icon: PhosphorIcon;
}

interface NavCategory {
  category: string;
  items: NavItem[];
}

const SETTINGS_NAV: NavCategory[] = [
  {
    category: "Organization",
    items: [
      { href: "/canopy/settings/company", label: "Company Profile", icon: Buildings },
      { href: "/canopy/settings/branding", label: "Logo & Branding", icon: Palette },
      { href: "/canopy/settings/departments", label: "Departments", icon: TreeStructure },
      { href: "/canopy/settings/team", label: "Team Permissions", icon: UsersThree },
    ],
  },
  {
    category: "Preferences",
    items: [
      { href: "/canopy/settings/notifications", label: "Notifications", icon: Bell },
      { href: "/canopy/settings/privacy", label: "Privacy & Account", icon: ShieldCheck },
    ],
  },
  {
    category: "Account & Tools",
    items: [
      { href: "/canopy/settings/email-templates", label: "Email Templates", icon: EnvelopeSimple },
      { href: "/canopy/settings/billing", label: "Plan & Billing", icon: CreditCard },
      { href: "/canopy/settings/integrations", label: "Integrations", icon: Plugs },
    ],
  },
];

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

/** Returns the sidebar label for the given pathname (used by the layout breadcrumb). */
export function getSettingsPageLabel(pathname: string): string | undefined {
  for (const group of SETTINGS_NAV) {
    for (const item of group.items) {
      if (pathname === item.href) return item.label;
    }
  }
  return undefined;
}

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

interface SettingsSidebarProps {
  /** Which rendering mode — the layout controls responsive visibility. */
  variant: "desktop" | "mobile";
}

export function SettingsSidebar({ variant }: SettingsSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // sign-out request may fail if session already expired
    }
    router.push("/login");
  };

  /* ---- Desktop: vertical sidebar ---- */
  if (variant === "desktop") {
    return (
      <nav className="py-4">
        <div className="space-y-1">
          {SETTINGS_NAV.map((group, groupIdx) => (
            <div key={group.category}>
              {groupIdx > 0 && <Separator spacing="md" />}
              <p className="mb-2 px-4 text-caption-sm font-semibold uppercase tracking-wider text-foreground-subtle">
                {group.category}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-colors ${
                      isActive
                        ? "bg-[var(--background-interactive-selected)] text-[var(--foreground-default)]"
                        : "text-foreground-muted hover:bg-[var(--background-interactive-hover)]"
                    }`}
                  >
                    <Icon size={20} weight={isActive ? "fill" : "regular"} />
                    <span className="text-body-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          <Separator spacing="md" />

          {/* Sign out */}
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start gap-3 rounded-xl px-4 py-2.5 text-[var(--foreground-error)] hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]"
          >
            <SignOut size={20} weight="regular" />
            <span className="text-body-sm font-medium">Sign out</span>
          </Button>
        </div>
      </nav>
    );
  }

  /* ---- Mobile: horizontal scrollable strip ---- */
  return (
    <nav className="flex gap-1 overflow-x-auto">
      {SETTINGS_NAV.map((group, groupIdx) => (
        <React.Fragment key={group.category}>
          {groupIdx > 0 && (
            <span className="flex flex-shrink-0 items-center px-1">
              <span className="h-1 w-1 rounded-full bg-[var(--border-emphasis)]" />
            </span>
          )}
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-caption font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--background-interactive-selected)] text-[var(--foreground-default)]"
                    : "text-foreground-muted hover:bg-[var(--background-interactive-hover)]"
                }`}
              >
                <Icon size={16} weight={isActive ? "fill" : "regular"} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
  );
}

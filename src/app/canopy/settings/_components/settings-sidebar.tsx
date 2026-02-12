"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import {
  Buildings,
  Palette,
  UsersThree,
  Bell,
  ShieldCheck,
  Globe,
  EnvelopeSimple,
  Plugs,
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
    category: "Publishing",
    items: [
      { href: "/canopy/settings/career-page", label: "Career Page", icon: Globe },
      { href: "/canopy/settings/email-templates", label: "Email Templates", icon: EnvelopeSimple },
    ],
  },
  {
    category: "Connections",
    items: [{ href: "/canopy/settings/integrations", label: "Integrations", icon: Plugs }],
  },
];

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export function SettingsSidebar() {
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

  return (
    <nav className="flex-shrink-0">
      {/* Desktop: vertical sidebar */}
      <div className="hidden lg:sticky lg:top-6 lg:block lg:w-64 lg:self-start">
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
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[var(--foreground-error)] transition-colors hover:bg-[var(--background-error)]"
          >
            <SignOut size={20} weight="regular" />
            <span className="text-body-sm font-medium">Sign out</span>
          </button>
        </div>
      </div>

      {/* Mobile: horizontal scrollable strip */}
      <div className="flex gap-1 overflow-x-auto pb-2 lg:hidden">
        {SETTINGS_NAV.flatMap((group) =>
          group.items.map((item) => {
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
          })
        )}
      </div>
    </nav>
  );
}

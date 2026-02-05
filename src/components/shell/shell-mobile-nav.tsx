"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { List, X, SignOut } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useShell } from "@/lib/shell/shell-context";
import { ShellNotificationBell } from "./notification-bell";
import { ProfileDropdown } from "./profile-dropdown";
import type { ShellNavConfig, ShellNavItem, EmployerOrgRole } from "@/lib/shell/types";
import { ShellLogo } from "@/components/brand/shell-logo";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MENU_ICON_SIZE = 18;
const TAB_ICON_SIZE = 22;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ShellMobileNavProps {
  config: ShellNavConfig;
}

export function ShellMobileNav({ config }: ShellMobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useShell();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isItemVisible = useCallback(
    (item: ShellNavItem): boolean => {
      if (!item.requiredRoles) return true;
      if (!user?.employerOrgRole) return false;
      return item.requiredRoles.includes(user.employerOrgRole as EmployerOrgRole);
    },
    [user?.employerOrgRole]
  );

  function isActive(href: string): boolean {
    if (href === config.logoHref) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  async function handleSignOut() {
    setMenuOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  // First 4 visible nav items for bottom tab bar (exclude progressive sections)
  const allVisibleItems = config.sections
    .filter((s) => {
      if (!s.progressive) return true;
      if (!s.progressiveFeature) return true;
      return user?.progressiveFeatures?.includes(s.progressiveFeature) ?? false;
    })
    .flatMap((s) => s.items)
    .filter(isItemVisible);
  const tabBarItems = allVisibleItems.slice(0, 4);

  /** Render icon for slide-out menu items (18px) */
  function renderMenuIcon(item: ShellNavItem) {
    if (item.useProfileImage && user?.avatar) {
      return (
        <Image
          src={user.avatar}
          alt=""
          width={MENU_ICON_SIZE}
          height={MENU_ICON_SIZE}
          className="rounded-full object-cover"
        />
      );
    }

    if (item.customIcon) {
      const CustomIcon = item.customIcon;
      return <CustomIcon size={MENU_ICON_SIZE} />;
    }

    if (item.icon) {
      const Icon = item.icon;
      return <Icon size={MENU_ICON_SIZE} weight={item.iconWeight || "fill"} />;
    }

    return null;
  }

  /** Render icon for bottom tab bar (22px) */
  function renderTabIcon(item: ShellNavItem) {
    if (item.useProfileImage && user?.avatar) {
      return (
        <Image
          src={user.avatar}
          alt=""
          width={TAB_ICON_SIZE}
          height={TAB_ICON_SIZE}
          className="rounded-full object-cover"
        />
      );
    }

    if (item.customIcon) {
      const CustomIcon = item.customIcon;
      return <CustomIcon size={TAB_ICON_SIZE} />;
    }

    if (item.icon) {
      const Icon = item.icon;
      return <Icon size={TAB_ICON_SIZE} weight={item.iconWeight || "fill"} />;
    }

    return null;
  }

  return (
    <>
      {/* ── Sticky Header ────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden",
          "bg-[var(--shell-nav-sidebar-bg)] transition-shadow",
          scrolled && "shadow-sm"
        )}
      >
        {/* Logo */}
        <Link href={config.logoHref} className="flex items-center">
          <ShellLogo shell={config.shell} collapsed className="text-[var(--foreground-default)]" />
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ShellNotificationBell shell={config.shell} />
          <ProfileDropdown>
            <button className="rounded-full p-1.5 transition-colors hover:bg-[var(--shell-nav-item-hover)]">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--background-emphasized)]">
                  <span className="text-caption-sm font-semibold text-foreground-muted">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </button>
          </ProfileDropdown>
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 text-foreground-muted transition-colors hover:bg-[var(--shell-nav-item-hover)]"
            aria-label="Open menu"
          >
            <List size={20} weight="bold" />
          </button>
        </div>
      </header>

      {/* ── Slide-out menu ───────────────────────────────── */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/30 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          {/* Panel */}
          <div className="animate-in slide-in-from-right fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--shell-nav-sidebar-bg)] shadow-xl lg:hidden">
            {/* Menu header */}
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--shell-nav-sidebar-border)] px-4">
              <span className="text-body-sm font-semibold text-[var(--foreground-default)]">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 text-foreground-muted hover:bg-[var(--shell-nav-item-hover)]"
                aria-label="Close menu"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Full nav */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {config.sections
                .filter((s) => {
                  if (!s.progressive) return true;
                  if (!s.progressiveFeature) return true;
                  return user?.progressiveFeatures?.includes(s.progressiveFeature) ?? false;
                })
                .map((section) => (
                  <div key={section.id}>
                    {section.label && (
                      <p className="px-3 pb-1 pt-3 text-caption font-medium text-foreground-subtle">
                        {section.label}
                      </p>
                    )}
                    {section.items.filter(isItemVisible).map((item) => {
                      const active = isActive(item.href);
                      const hasBadge = item.badgeKey === "unreadMessages" && unreadCount > 0;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3 transition-colors",
                            active
                              ? "bg-[var(--shell-nav-item-active-bg)]"
                              : "opacity-[var(--shell-nav-item-inactive-opacity)] hover:bg-[var(--shell-nav-item-hover)]"
                          )}
                        >
                          {renderMenuIcon(item)}
                          <span className="flex-1 text-caption font-semibold">{item.label}</span>
                          {hasBadge && (
                            <NotificationBadge count={unreadCount} variant="alert" size="sm" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}
            </nav>

            {/* Bottom utility section */}
            <div className="shrink-0 space-y-0.5 border-t border-[var(--shell-nav-sidebar-border)] p-3">
              {/* Utility items from config */}
              {config.utilityItems?.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3 transition-colors",
                      active
                        ? "bg-[var(--shell-nav-item-active-bg)]"
                        : "opacity-[var(--shell-nav-utility-opacity)] hover:bg-[var(--shell-nav-item-hover)]"
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        size={MENU_ICON_SIZE}
                        weight={item.iconWeight || "fill"}
                        className="shrink-0"
                      />
                    )}
                    <span className="text-caption font-semibold">{item.label}</span>
                  </Link>
                );
              })}

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3 text-[var(--shell-nav-signout-color)] transition-colors hover:bg-[var(--background-error)]"
              >
                <SignOut size={MENU_ICON_SIZE} weight="bold" className="shrink-0" />
                <span className="text-caption font-semibold">Sign out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Bottom Tab Bar ───────────────────────────────── */}
      <div className="safe-area-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--shell-nav-sidebar-border)] bg-[var(--background-default)] lg:hidden">
        <div className="flex h-14 items-center justify-around px-2">
          {tabBarItems.map((item) => {
            const active = isActive(item.href);
            const hasBadge = item.badgeKey === "unreadMessages" && unreadCount > 0;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1",
                  "transition-colors",
                  active ? "text-[var(--shell-nav-accent)]" : "text-foreground-muted"
                )}
              >
                <span className="relative">
                  {renderTabIcon(item)}
                  {hasBadge && (
                    <span className="absolute -right-1.5 -top-1">
                      <NotificationBadge count={unreadCount} variant="alert" size="sm" max={9} />
                    </span>
                  )}
                </span>
                <span
                  className={cn("text-[10px] leading-tight", active ? "font-bold" : "font-medium")}
                >
                  {item.label}
                </span>
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-1/4 right-1/4 top-0 h-0.5 rounded-full bg-[var(--shell-nav-accent)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

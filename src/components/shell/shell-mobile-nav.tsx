"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { List, X, Gear } from "@phosphor-icons/react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useShell } from "@/lib/shell/shell-context";
import { ShellNotificationBell } from "./notification-bell";
import { ProfileDropdown } from "./profile-dropdown";
import type { ShellNavConfig, ShellNavItem, EmployerOrgRole } from "@/lib/shell/types";
import { cn } from "@/lib/utils";

interface ShellMobileNavProps {
  config: ShellNavConfig;
}

export function ShellMobileNav({ config }: ShellMobileNavProps) {
  const pathname = usePathname();
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

  function renderTabIcon(item: ShellNavItem) {
    const iconSize = 22;

    if (item.useProfileImage && user?.avatar) {
      return (
        <Image
          src={user.avatar}
          alt=""
          width={iconSize}
          height={iconSize}
          className="rounded-full object-cover"
        />
      );
    }

    if (item.customIcon) {
      const CustomIcon = item.customIcon;
      return <CustomIcon size={iconSize} />;
    }

    if (item.icon) {
      const Icon = item.icon;
      return <Icon size={iconSize} weight={item.iconWeight || "fill"} />;
    }

    return null;
  }

  return (
    <>
      {/* ── Sticky Header ────────────────────────────────── */}
      <header
        className={cn(
          "sticky top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden",
          "bg-[var(--background-default)] transition-shadow",
          scrolled && "shadow-sm"
        )}
      >
        {/* Logo */}
        <Link href={config.logoHref} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[var(--candid-background-brand)] flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {config.shell === "talent"
                ? "G"
                : config.shell === "coach"
                  ? "C"
                  : "E"}
            </span>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <ShellNotificationBell shell={config.shell} />
          <ProfileDropdown>
            <button className="rounded-full p-1.5 hover:bg-[var(--candid-nav-item-hover)] transition-colors">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-[var(--background-emphasized)] flex items-center justify-center">
                  <span className="text-caption-sm font-semibold text-foreground-muted">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </button>
          </ProfileDropdown>
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] transition-colors"
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
          <div className="fixed inset-y-0 right-0 z-50 w-72 bg-[var(--background-default)] shadow-xl lg:hidden animate-in slide-in-from-right">
            {/* Menu header */}
            <div className="flex h-14 items-center justify-between px-4 border-b border-[var(--candid-nav-sidebar-border)]">
              <span className="text-body-sm font-semibold text-foreground-default">
                Menu
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
                aria-label="Close menu"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Full nav */}
            <nav className="overflow-y-auto p-3 space-y-1" style={{ maxHeight: "calc(100vh - 56px)" }}>
              {config.sections
                .filter((s) => {
                  if (!s.progressive) return true;
                  if (!s.progressiveFeature) return true;
                  return user?.progressiveFeatures?.includes(s.progressiveFeature) ?? false;
                })
                .map((section) => (
                  <div key={section.id}>
                    {section.label && (
                      <p className="px-2 pt-3 pb-1 text-caption text-foreground-subtle font-medium">
                        {section.label}
                      </p>
                    )}
                    {section.items.filter(isItemVisible).map((item) => {
                      const active = isActive(item.href);
                      const hasBadge =
                        item.badgeKey === "unreadMessages" && unreadCount > 0;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-lg h-11 px-3 transition-colors",
                            active
                              ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
                              : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
                          )}
                        >
                          {renderTabIcon(item)}
                          <span className="flex-1 text-body-sm">{item.label}</span>
                          {hasBadge && (
                            <NotificationBadge
                              count={unreadCount}
                              variant="alert"
                              size="sm"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                ))}

              {/* Settings */}
              <div className="border-t border-[var(--candid-nav-sidebar-border)] mt-2 pt-2">
                <Link
                  href={config.settingsHref}
                  className={cn(
                    "flex items-center gap-3 rounded-lg h-11 px-3 transition-colors",
                    pathname.startsWith(config.settingsHref)
                      ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
                      : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
                  )}
                >
                  <Gear size={22} weight="fill" className="shrink-0" />
                  <span className="text-body-sm">Settings</span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}

      {/* ── Bottom Tab Bar ───────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 border-t border-[var(--candid-nav-sidebar-border)] bg-[var(--background-default)] lg:hidden safe-area-bottom">
        <div className="flex h-14 items-center justify-around px-2">
          {tabBarItems.map((item) => {
            const active = isActive(item.href);
            const hasBadge =
              item.badgeKey === "unreadMessages" && unreadCount > 0;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-0.5 flex-1 py-1",
                  "transition-colors",
                  active
                    ? "text-[var(--candid-foreground-brand)]"
                    : "text-foreground-muted"
                )}
              >
                <span className="relative">
                  {renderTabIcon(item)}
                  {hasBadge && (
                    <span className="absolute -right-1.5 -top-1 ">
                      <NotificationBadge
                        count={unreadCount}
                        variant="alert"
                        size="sm"
                        max={9}
                      />
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] leading-tight",
                    active ? "font-bold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full bg-[var(--candid-foreground-brand)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Gear, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useShell } from "@/lib/shell/shell-context";
import { useSidebar } from "./sidebar-context";
import { ProfileDropdown } from "./profile-dropdown";
import { ShellNotificationBell } from "./notification-bell";
import { RecentsSection } from "./recents-section";
import type { ShellNavConfig, ShellNavItem, EmployerOrgRole } from "@/lib/shell/types";
import { ShellLogo } from "@/components/brand/shell-logo";
import { cn } from "@/lib/utils";

interface ShellSidebarProps {
  config: ShellNavConfig;
}

export function ShellSidebar({ config }: ShellSidebarProps) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const { user } = useShell();
  const { unreadCount } = useNotifications();

  /** Check if a nav item should be visible to the current user */
  function isItemVisible(item: ShellNavItem): boolean {
    if (!item.requiredRoles) return true;
    if (!user?.employerOrgRole) return false;
    return item.requiredRoles.includes(user.employerOrgRole as EmployerOrgRole);
  }

  /** Check if a nav item or its children is active */
  function isActive(href: string): boolean {
    if (href === config.logoHref) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  }

  /** Render icon for a nav item — handles Phosphor, custom SVG, and profile image */
  function renderIcon(item: ShellNavItem) {
    const iconSize = 22;

    // Profile image
    if (item.useProfileImage && user?.avatar) {
      return (
        <Image
          src={user.avatar}
          alt=""
          width={iconSize}
          height={iconSize}
          className="shrink-0 rounded-full object-cover"
        />
      );
    }

    // Custom SVG icon
    if (item.customIcon) {
      const CustomIcon = item.customIcon;
      return <CustomIcon size={iconSize} className="shrink-0" />;
    }

    // Phosphor icon
    if (item.icon) {
      const Icon = item.icon;
      return <Icon size={iconSize} weight={item.iconWeight || "fill"} className="shrink-0" />;
    }

    return null;
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex",
        "border-r border-[var(--shell-nav-sidebar-border)]",
        "bg-[var(--background-default)]",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* ── Logo ────────────────────────────────────────────── */}
      <div className="flex h-[72px] shrink-0 items-center px-4">
        <Link
          href={config.logoHref}
          className={cn("flex items-center", collapsed ? "justify-center" : "gap-2.5")}
        >
          <ShellLogo
            shell={config.shell}
            collapsed={collapsed}
            className="text-[var(--foreground-default)]"
          />
        </Link>
      </div>

      {/* ── Header: Notifications + Profile ────────────────── */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 pb-3",
          collapsed ? "justify-center" : "justify-between"
        )}
      >
        {/* Profile avatar */}
        <ProfileDropdown>
          <button
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5",
              "transition-colors hover:bg-[var(--shell-nav-item-hover)]",
              collapsed ? "justify-center" : "min-w-0 flex-1"
            )}
          >
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt=""
                width={32}
                height={32}
                className="shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--background-emphasized)]">
                <span className="text-caption font-semibold text-foreground-muted">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {!collapsed && (
              <span className="text-foreground-default truncate text-caption font-medium">
                {user?.name || "User"}
              </span>
            )}
          </button>
        </ProfileDropdown>

        {/* Notification bell — only when expanded */}
        {!collapsed && <ShellNotificationBell shell={config.shell} />}
      </div>

      {/* ── Navigation sections ────────────────────────────── */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {config.sections
          .filter((section) => {
            if (!section.progressive) return true;
            if (!section.progressiveFeature) return true;
            return user?.progressiveFeatures?.includes(section.progressiveFeature) ?? false;
          })
          .map((section) => (
            <div key={section.id}>
              {/* Section heading */}
              {section.label && !collapsed && (
                <p className="px-2 pb-1 pt-4 text-caption font-medium text-foreground-subtle">
                  {section.label}
                </p>
              )}

              {/* Nav items */}
              <div className="space-y-0.5">
                {section.items.filter(isItemVisible).map((item) => {
                  const active = isActive(item.href);
                  const hasBadge = item.badgeKey === "unreadMessages" && unreadCount > 0;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "relative flex h-11 items-center gap-3 rounded-lg transition-colors",
                        collapsed ? "mx-1 justify-center px-0" : "px-3",
                        active
                          ? "bg-[var(--shell-nav-item-active-bg)] font-bold text-[var(--shell-nav-item-active-text)]"
                          : "font-normal text-foreground-muted hover:bg-[var(--shell-nav-item-hover)]"
                      )}
                      title={collapsed ? item.label : undefined}
                    >
                      {renderIcon(item)}

                      {/* Label */}
                      {!collapsed && (
                        <span className="flex-1 truncate text-body-sm">{item.label}</span>
                      )}

                      {/* Badge — expanded: NotificationBadge pill */}
                      {!collapsed && hasBadge && (
                        <NotificationBadge count={unreadCount} variant="alert" size="sm" />
                      )}

                      {/* Badge — collapsed: red dot */}
                      {collapsed && hasBadge && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primitive-red-500)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

        {/* ── Recents section ──────────────────────────────── */}
        {config.recents && <RecentsSection config={config.recents} />}
      </nav>

      {/* ── Footer: Settings + Collapse ────────────────────── */}
      <div className="shrink-0 space-y-0.5 border-t border-[var(--shell-nav-sidebar-border)] p-3">
        {/* Settings */}
        <Link
          href={config.settingsHref}
          className={cn(
            "flex h-11 items-center gap-3 rounded-lg transition-colors",
            collapsed ? "mx-1 justify-center px-0" : "px-3",
            pathname.startsWith(config.settingsHref)
              ? "bg-[var(--shell-nav-item-active-bg)] font-bold text-[var(--shell-nav-item-active-text)]"
              : "text-foreground-muted hover:bg-[var(--shell-nav-item-hover)]"
          )}
          title={collapsed ? "Settings" : undefined}
        >
          <Gear size={22} weight="fill" className="shrink-0" />
          {!collapsed && <span className="text-body-sm">Settings</span>}
        </Link>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-lg transition-colors",
            collapsed ? "mx-1 justify-center px-0" : "px-3",
            "text-foreground-muted hover:bg-[var(--shell-nav-item-hover)]"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <CaretRight size={18} weight="bold" className="shrink-0" />
          ) : (
            <>
              <CaretLeft size={18} weight="bold" className="shrink-0" />
              <span className="text-body-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

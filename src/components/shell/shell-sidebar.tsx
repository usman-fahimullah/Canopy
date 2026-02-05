"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CaretLeft, CaretRight, CaretDown, CaretUp, SignOut } from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";
import { useNotifications } from "@/hooks/use-notifications";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useShell } from "@/lib/shell/shell-context";
import { useSidebar } from "./sidebar-context";
import { ProfileDropdown } from "./profile-dropdown";
import { RecentsSection } from "./recents-section";
import type { ShellNavConfig, ShellNavItem, EmployerOrgRole } from "@/lib/shell/types";
import type { Shell } from "@/lib/onboarding/types";
import { ShellLogo } from "@/components/brand/shell-logo";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_SIZE = 18;

const SHELL_ROLE_LABELS: Record<Shell, string> = {
  talent: "Job Seeker",
  coach: "Career Coach",
  employer: "Employer",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ShellSidebarProps {
  config: ShellNavConfig;
}

export function ShellSidebar({ config }: ShellSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggle } = useSidebar();
  const { user } = useShell();
  const { unreadCount } = useNotifications();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // ── Helpers ──────────────────────────────────────────────

  function isItemVisible(item: ShellNavItem): boolean {
    if (!item.requiredRoles) return true;
    if (!user?.employerOrgRole) return false;
    return item.requiredRoles.includes(user.employerOrgRole as EmployerOrgRole);
  }

  function isActive(href: string): boolean {
    if (href === config.logoHref) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  function toggleExpand(itemId: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  /** Render icon for a nav item — handles Phosphor, custom SVG, and profile image */
  function renderIcon(item: ShellNavItem, size = ICON_SIZE) {
    if (item.useProfileImage && user?.avatar) {
      return (
        <Image
          src={user.avatar}
          alt=""
          width={size}
          height={size}
          className="shrink-0 rounded-full object-cover"
        />
      );
    }

    if (item.customIcon) {
      const CustomIcon = item.customIcon;
      return <CustomIcon size={size} className="shrink-0" />;
    }

    if (item.icon) {
      const Icon = item.icon;
      return <Icon size={size} weight={item.iconWeight || "fill"} className="shrink-0" />;
    }

    return null;
  }

  // ── Shared class builders ────────────────────────────────

  const itemBase = cn(
    "relative flex items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3 transition-colors",
    collapsed && "justify-center"
  );

  function navItemClasses(active: boolean) {
    return cn(
      itemBase,
      active
        ? "bg-[var(--shell-nav-item-active-bg)]"
        : "opacity-[var(--shell-nav-item-inactive-opacity)] hover:bg-[var(--shell-nav-item-hover)]"
    );
  }

  // ── Render ───────────────────────────────────────────────

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex",
        "border-r border-[var(--shell-nav-sidebar-border)]",
        "bg-[var(--shell-nav-sidebar-bg)]",
        "transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* ── TOP ZONE: Logo ──────────────────────────────── */}
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-[var(--shell-nav-sidebar-border)]",
          collapsed ? "justify-center px-3 py-5" : "px-6 py-7"
        )}
      >
        <Link href={config.logoHref} className="flex items-center">
          <ShellLogo
            shell={config.shell}
            collapsed={collapsed}
            className="text-[var(--foreground-default)]"
          />
        </Link>
      </div>

      {/* ── MIDDLE ZONE: Profile + Nav + Recents ────────── */}
      <div className="flex flex-1 flex-col overflow-y-auto">
        {/* Profile card */}
        <div className="px-3 pb-2 pt-3">
          <ProfileDropdown>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3",
                "transition-colors hover:bg-[var(--shell-nav-item-hover)]",
                collapsed && "justify-center"
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
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-body-sm font-semibold text-[var(--foreground-default)]">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-caption text-[var(--foreground-muted)]">
                    {user?.employerOrgRole
                      ? user.employerOrgRole.charAt(0) + user.employerOrgRole.slice(1).toLowerCase()
                      : SHELL_ROLE_LABELS[config.shell]}
                  </p>
                </div>
              )}
            </button>
          </ProfileDropdown>
        </div>

        {/* Primary navigation */}
        <nav className="flex-1 space-y-0.5 px-3">
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
                  <p className="px-3 pb-1 pt-4 text-caption font-medium text-foreground-subtle">
                    {section.label}
                  </p>
                )}

                {/* Nav items */}
                <div className="space-y-0.5">
                  {section.items.filter(isItemVisible).map((item) => {
                    const active = isActive(item.href);
                    const hasBadge = item.badgeKey === "unreadMessages" && unreadCount > 0;
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedItems.has(item.id);

                    return (
                      <div key={item.id}>
                        {/* Parent item */}
                        {hasChildren ? (
                          <button
                            onClick={() => toggleExpand(item.id)}
                            className={cn("flex w-full", navItemClasses(active))}
                            title={collapsed ? item.label : undefined}
                          >
                            {renderIcon(item)}
                            {!collapsed && (
                              <>
                                <span className="flex-1 truncate text-left text-caption font-semibold">
                                  {item.label}
                                </span>
                                {isExpanded ? (
                                  <CaretUp size={14} weight="bold" className="shrink-0" />
                                ) : (
                                  <CaretDown size={14} weight="bold" className="shrink-0" />
                                )}
                              </>
                            )}
                          </button>
                        ) : (
                          <Link
                            href={item.href}
                            className={navItemClasses(active)}
                            title={collapsed ? item.label : undefined}
                          >
                            {renderIcon(item)}

                            {/* Label */}
                            {!collapsed && (
                              <span className="flex-1 truncate text-caption font-semibold">
                                {item.label}
                              </span>
                            )}

                            {/* Badge — expanded */}
                            {!collapsed && hasBadge && (
                              <NotificationBadge count={unreadCount} variant="alert" size="sm" />
                            )}

                            {/* Badge — collapsed: red dot */}
                            {collapsed && hasBadge && (
                              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primitive-red-500)]" />
                            )}
                          </Link>
                        )}

                        {/* Child items (expandable) */}
                        {hasChildren && isExpanded && !collapsed && (
                          <div className="ml-6 space-y-0.5 border-l border-[var(--border-muted)] pl-3">
                            {item.children!.filter(isItemVisible).map((child) => {
                              const childActive = isActive(child.href);
                              return (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className={cn(
                                    "flex items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-2 transition-colors",
                                    childActive
                                      ? "bg-[var(--shell-nav-item-active-bg)]"
                                      : "opacity-[var(--shell-nav-item-inactive-opacity)] hover:bg-[var(--shell-nav-item-hover)]"
                                  )}
                                >
                                  {renderIcon(child, 16)}
                                  <span className="truncate text-caption font-medium">
                                    {child.label}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* Recents section */}
          {config.recents && <RecentsSection config={config.recents} />}
        </nav>
      </div>

      {/* ── BOTTOM ZONE: Utility + Collapse + Sign out ── */}
      <div className="shrink-0 space-y-0.5 border-t border-[var(--shell-nav-sidebar-border)] px-3 py-6">
        {/* Utility items from config (Settings, etc.) */}
        {config.utilityItems?.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                itemBase,
                active
                  ? "bg-[var(--shell-nav-item-active-bg)]"
                  : "opacity-[var(--shell-nav-utility-opacity)] hover:bg-[var(--shell-nav-item-hover)]"
              )}
              title={collapsed ? item.label : undefined}
            >
              {renderIcon(item)}
              {!collapsed && <span className="text-caption font-semibold">{item.label}</span>}
            </Link>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3 transition-colors",
            collapsed && "justify-center",
            "opacity-[var(--shell-nav-utility-opacity)] hover:bg-[var(--shell-nav-item-hover)]"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <CaretRight size={ICON_SIZE} weight="bold" className="shrink-0" />
          ) : (
            <>
              <CaretLeft size={ICON_SIZE} weight="bold" className="shrink-0" />
              <span className="text-caption font-semibold">Collapse</span>
            </>
          )}
        </button>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-[var(--shell-nav-item-radius)] p-3 transition-colors",
            collapsed && "justify-center",
            "text-[var(--shell-nav-signout-color)] hover:bg-[var(--background-error)]"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <SignOut size={ICON_SIZE} weight="bold" className="shrink-0" />
          {!collapsed && <span className="text-caption font-semibold">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

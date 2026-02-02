"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CandidLogo } from "./CandidLogo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "./SidebarContext";
import {
  House,
  ChatCircle,
  CalendarDots,
  Gear,
  SignOut,
  Users,
  ChartLine,
  Clock,
  Bell,
  Note,
  Certificate,
  Folder,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

type CandidRole = "seeker" | "mentor" | "coach" | "admin";

// Navigation items for seekers (default)
const seekerNavItems = [
  { href: "/candid/dashboard", label: "Home", icon: House },
  { href: "/candid/notifications", label: "Notifications", icon: Bell },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarDots },
  { href: "/candid/mentors", label: "Mentors", icon: Users },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
];

// Navigation items for coaches
const coachNavItems = [
  { href: "/candid/coach-dashboard", label: "Dashboard", icon: House },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarDots },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
  { href: "/candid/settings/availability", label: "Availability", icon: Clock },
  { href: "/candid/settings/payments", label: "Earnings", icon: ChartLine },
];

// Navigation items for mentors (seekers who are also mentors)
const mentorNavItems = [
  { href: "/candid/dashboard", label: "Home", icon: House },
  { href: "/candid/notifications", label: "Notifications", icon: Bell },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarDots },
  { href: "/candid/mentors", label: "Mentors", icon: Users },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
];

const menteeToolsNavItems = [
  { href: "/candid/notes", label: "1:1 Notes", icon: Note },
  { href: "/candid/courses", label: "Courses", icon: Certificate },
  { href: "/candid/documents", label: "Documents", icon: Folder },
];

interface UserData {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: CandidRole;
  roles: CandidRole[];
}

const roleLabels: Record<CandidRole, string> = {
  seeker: "Mentee",
  mentor: "Mentor",
  coach: "Coach",
  admin: "Admin",
};

export function CandidSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggle } = useSidebar();
  const [user, setUser] = useState<UserData | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(4);
  const [notificationCount, setNotificationCount] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      setLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch role from API
        try {
          const roleRes = await fetch("/api/profile/role");
          const roleData = roleRes.ok
            ? await roleRes.json()
            : { role: "seeker", roles: ["seeker"] };

          // Fetch profile for name and avatar
          const profileRes = await fetch("/api/profile");
          const profileData = profileRes.ok ? await profileRes.json() : null;

          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name:
              profileData?.name ||
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              authUser.email?.split("@")[0] ||
              "User",
            avatar: profileData?.avatar || authUser.user_metadata?.avatar_url || null,
            role: roleData.role || "seeker",
            roles: roleData.roles || ["seeker"],
          });
        } catch {
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name:
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              authUser.email?.split("@")[0] ||
              "User",
            avatar: authUser.user_metadata?.avatar_url || null,
            role: "seeker",
            roles: ["seeker"],
          });
        }
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Get navigation items based on role
  const mainNavItems = useMemo(() => {
    if (!user) return seekerNavItems;

    switch (user.role) {
      case "coach":
        return coachNavItems;
      case "mentor":
        return mentorNavItems;
      case "admin":
        return seekerNavItems; // Admins see seeker nav + admin links
      default:
        return seekerNavItems;
    }
  }, [user]);

  const displayName = user?.name || "User";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-[var(--candid-nav-sidebar-border)] bg-[var(--background-default)] transition-[width] duration-200 ease-in-out lg:flex",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-[72px] items-center border-b border-[var(--primitive-neutral-200)]",
          collapsed ? "justify-center px-0" : "justify-center px-6"
        )}
      >
        <Link href="/candid" className="transition-opacity hover:opacity-80">
          {collapsed ? (
            <CandidLogo width={32} height={32} />
          ) : (
            <CandidLogo width={127} height={32} />
          )}
        </Link>
      </div>

      {/* User Profile */}
      {user && (
        <div
          className={cn(
            "flex items-center border-b border-[var(--primitive-neutral-200)]",
            collapsed ? "justify-center px-0 py-4" : "gap-3 px-5 py-4"
          )}
        >
          <Avatar
            size="default"
            src={user.avatar || undefined}
            name={displayName}
            color="green"
            className="shrink-0 border-[var(--primitive-neutral-300)]"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-foreground-default truncate text-body-sm font-medium">
                {displayName}
              </p>
              <p className="text-caption text-foreground-muted">{roleLabels[user.role]}</p>
            </div>
          )}
        </div>
      )}

      {/* Role Switcher (if user has multiple roles) - hidden when collapsed */}
      {!collapsed && user && user.roles.length > 1 && (
        <div className="border-b border-[var(--primitive-neutral-200)] px-5 py-3">
          <p className="px-1 pb-2 text-caption font-medium text-foreground-muted">Switch View</p>
          <div className="flex gap-1">
            {user.roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setUser((prev) => (prev ? { ...prev, role } : null));
                  if (role === "coach") {
                    router.push("/candid/coach-dashboard");
                  } else {
                    router.push("/candid/dashboard");
                  }
                }}
                className={cn(
                  "flex-1 rounded-md px-2 py-1.5 text-caption font-medium transition-colors",
                  user.role === role
                    ? "bg-[var(--background-brand-subtle)] text-[var(--candid-foreground-brand)]"
                    : "text-foreground-muted hover:bg-[var(--background-subtle)]"
                )}
              >
                {roleLabels[role]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {/* Primary Nav */}
        <div
          className={cn(
            "space-y-1 border-b border-[var(--primitive-neutral-200)] py-3",
            collapsed ? "px-2" : "px-3"
          )}
        >
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            const isMessages = item.href === "/candid/messages";
            const isNotifications = item.href === "/candid/notifications";
            const showMessagesBadge = isMessages && unreadMessages > 0;
            const showNotificationBadge = isNotifications && notificationCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-lg px-3 text-body-sm transition-all duration-150",
                  collapsed && "justify-center px-0",
                  isActive && isMessages
                    ? "bg-[var(--primitive-blue-100)] font-bold text-[var(--candid-foreground-brand)]"
                    : isActive
                      ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
                      : "hover:text-foreground-default font-normal text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
                )}
              >
                <Icon size={22} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                {!collapsed && (
                  <>
                    {item.label}
                    {showNotificationBadge && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded bg-[var(--primitive-red-500)] px-0.5 text-[12px] font-bold leading-5 text-white">
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </span>
                    )}
                    {showMessagesBadge && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded bg-[var(--primitive-red-500)] px-0.5 text-[12px] font-bold leading-5 text-white">
                        {unreadMessages > 9 ? "9+" : unreadMessages}
                      </span>
                    )}
                  </>
                )}
                {/* Dot indicator when collapsed with badges */}
                {collapsed && (showNotificationBadge || showMessagesBadge) && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--primitive-red-500)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mentee Tools Section */}
        <div
          className={cn(
            "space-y-1 border-b border-[var(--primitive-neutral-200)] py-3",
            collapsed ? "px-2" : "px-3"
          )}
        >
          {!collapsed && (
            <p className="px-3 py-2 text-caption-strong font-bold text-foreground-muted">
              Mentee Tools
            </p>
          )}
          {menteeToolsNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-body-sm transition-all duration-150",
                  collapsed && "justify-center px-0",
                  isActive
                    ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
                    : "hover:text-foreground-default font-normal text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
                )}
              >
                <Icon size={22} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn("space-y-1 py-3", collapsed ? "px-2" : "px-3")}>
        <Link
          href="/candid/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex h-11 items-center gap-3 rounded-lg px-3 text-body-sm transition-all duration-150",
            collapsed && "justify-center px-0",
            pathname === "/candid/settings" || pathname.startsWith("/candid/settings/")
              ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
              : "hover:text-foreground-default font-normal text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
          )}
        >
          <Gear
            size={22}
            weight={pathname.startsWith("/candid/settings") ? "fill" : "regular"}
            className="shrink-0"
          />
          {!collapsed && "Settings"}
        </Link>
        <button
          onClick={handleSignOut}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex h-11 w-full items-center gap-3 rounded-lg px-3 text-body-sm font-normal text-[var(--primitive-red-500)] transition-all duration-150 hover:bg-[var(--primitive-red-100)]",
            collapsed && "justify-center px-0"
          )}
        >
          <SignOut size={22} className="shrink-0" />
          {!collapsed && "Log out"}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="hover:text-foreground-default flex h-11 w-full items-center justify-center gap-3 rounded-lg px-3 text-body-sm font-normal text-foreground-muted transition-all duration-150 hover:bg-[var(--candid-nav-item-hover)]"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <CaretRight size={18} weight="bold" />
          ) : (
            <>
              <CaretLeft size={18} weight="bold" className="shrink-0" />
              <span className="text-caption">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

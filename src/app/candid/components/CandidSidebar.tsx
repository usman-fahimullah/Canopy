"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CandidLogo } from "./CandidLogo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  const [user, setUser] = useState<UserData | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(4);
  const [notificationCount, setNotificationCount] = useState(4);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        // Fetch role from API
        try {
          const roleRes = await fetch("/api/profile/role");
          const roleData = roleRes.ok ? await roleRes.json() : { role: "seeker", roles: ["seeker"] };

          // Fetch profile for name and avatar
          const profileRes = await fetch("/api/profile");
          const profileData = profileRes.ok ? await profileRes.json() : null;

          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: profileData?.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
            avatar: profileData?.avatar || authUser.user_metadata?.avatar_url || null,
            role: roleData.role || "seeker",
            roles: roleData.roles || ["seeker"],
          });
        } catch {
          setUser({
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
            avatar: authUser.user_metadata?.avatar_url || null,
            role: "seeker",
            roles: ["seeker"],
          });
        }
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
  }, [user?.role]);

  const displayName = user?.name || "User";

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[360px] flex-col border-r border-[var(--candid-nav-sidebar-border)] bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-[108px] items-center justify-center border-b border-[var(--primitive-neutral-200)]">
        <Link href="/candid" className="transition-opacity hover:opacity-80">
          <CandidLogo width={127} height={32} />
        </Link>
      </div>

      {/* User Profile */}
      {user && (
        <div className="flex items-center gap-3 border-b border-[var(--primitive-neutral-200)] px-6 py-4">
          <Avatar
            size="default"
            src={user.avatar || undefined}
            name={displayName}
            color="green"
            className="border-[var(--primitive-neutral-300)]"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-heading-sm font-medium text-foreground-default">
              {displayName}
            </p>
            <p className="text-caption text-foreground-muted">
              {roleLabels[user.role]}
            </p>
          </div>
        </div>
      )}

      {/* Role Switcher (if user has multiple roles) */}
      {user && user.roles.length > 1 && (
        <div className="border-b border-[var(--primitive-neutral-200)] px-6 py-3">
          <p className="px-1 pb-2 text-caption font-medium text-foreground-muted">
            Switch View
          </p>
          <div className="flex gap-1">
            {user.roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  setUser((prev) => prev ? { ...prev, role } : null);
                  if (role === "coach") {
                    router.push("/candid/coach-dashboard");
                  } else {
                    router.push("/candid/dashboard");
                  }
                }}
                className={cn(
                  "flex-1 px-2 py-1.5 rounded-md text-caption font-medium transition-colors",
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
        <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3 space-y-1">
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
                className={cn(
                  "relative flex h-12 items-center gap-3 rounded-lg px-4 py-3 text-body transition-all duration-150",
                  isActive && isMessages
                    ? "bg-[var(--primitive-blue-100)] font-bold text-[var(--candid-foreground-brand)]"
                    : isActive
                      ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
                      : "font-normal text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
                )}
              >
                <Icon size={24} weight={isActive ? "fill" : "regular"} />
                {item.label}
                {showNotificationBadge && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded px-0.5 bg-[var(--primitive-red-500)] text-[14px] font-bold leading-5 text-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
                {showMessagesBadge && (
                  <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded px-0.5 bg-[var(--primitive-red-500)] text-[14px] font-bold leading-5 text-white">
                    {unreadMessages > 9 ? "9+" : unreadMessages}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Mentee Tools Section */}
        <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3 space-y-1">
          <p className="px-4 py-2 text-caption-strong font-bold text-foreground-muted">
            Mentee Tools
          </p>
          {menteeToolsNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-12 items-center gap-3 rounded-lg px-4 py-3 text-body transition-all duration-150",
                  isActive
                    ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
                    : "font-normal text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
                )}
              >
                <Icon size={24} weight={isActive ? "fill" : "regular"} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 space-y-1">
        <Link
          href="/candid/settings"
          className={cn(
            "flex h-12 items-center gap-3 rounded-lg px-4 py-3 text-body transition-all duration-150",
            pathname === "/candid/settings" || pathname.startsWith("/candid/settings/")
              ? "bg-[var(--candid-nav-sidebar-item-active)] font-bold text-[var(--candid-foreground-brand)]"
              : "font-normal text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
          )}
        >
          <Gear size={24} weight={pathname.startsWith("/candid/settings") ? "fill" : "regular"} />
          Setting
        </Link>
        <button
          onClick={handleSignOut}
          className="flex h-12 w-full items-center gap-3 rounded-lg px-4 py-3 text-body font-normal text-[var(--primitive-red-500)] hover:bg-[var(--primitive-red-100)] transition-all duration-150"
        >
          <SignOut size={24} />
          Log out
        </button>
      </div>
    </aside>
  );
}

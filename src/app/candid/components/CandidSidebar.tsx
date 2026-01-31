"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CandidLogo } from "./CandidLogo";
import { CandidSymbol } from "./CandidSymbol";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  House,
  ChatCircle,
  CalendarBlank,
  Gear,
  SignOut,
  Question,
  BookOpen,
  MapTrifold,
  Users,
  Briefcase,
  ChartLine,
  Clock,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

type CandidRole = "seeker" | "mentor" | "coach" | "admin";

// Navigation items for seekers (default)
const seekerNavItems = [
  { href: "/candid/dashboard", label: "Home", icon: House },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarBlank },
  { href: "/candid/jobs", label: "Jobs", icon: Briefcase },
  { href: "/candid/mentors", label: "Mentors", icon: Users },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
];

// Navigation items for coaches
const coachNavItems = [
  { href: "/candid/coach-dashboard", label: "Dashboard", icon: House },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarBlank },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
  { href: "/candid/settings/availability", label: "Availability", icon: Clock },
  { href: "/candid/settings/payments", label: "Earnings", icon: ChartLine },
];

// Navigation items for mentors (seekers who are also mentors)
const mentorNavItems = [
  { href: "/candid/dashboard", label: "Home", icon: House },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarBlank },
  { href: "/candid/jobs", label: "Jobs", icon: Briefcase },
  { href: "/candid/mentors", label: "Mentors", icon: Users },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
];

const resourceNavItems = [
  { href: "/candid/resources", label: "Resources", icon: BookOpen },
  { href: "/candid/faqs", label: "FAQs", icon: Question },
  { href: "/candid/careers", label: "Career Paths", icon: MapTrifold },
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
  seeker: "Job Seeker",
  mentor: "Mentor",
  coach: "Coach",
  admin: "Admin",
};

export function CandidSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[260px] flex-col border-r border-[var(--border-default)] bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center px-5">
        <Link href="/candid" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <CandidSymbol size={28} />
          <CandidLogo className="h-5" />
        </Link>
      </div>

      {/* User Profile */}
      {user && (
        <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg bg-[var(--background-subtle)] px-3 py-2.5">
          <Avatar
            size="default"
            src={user.avatar || undefined}
            name={displayName}
            color="green"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-medium text-foreground-default">
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
        <div className="mx-4 mb-4">
          <p className="px-1 pb-2 text-caption font-medium text-foreground-muted">
            Switch View
          </p>
          <div className="flex gap-1">
            {user.roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  // Update role and navigate to appropriate dashboard
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
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const showBadge = item.href === "/candid/messages" && unreadMessages > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--candid-nav-item-active)] text-[var(--candid-foreground-brand)]"
                  : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              {item.label}
              {showBadge && (
                <Badge variant="error" size="sm" className="ml-auto">
                  {unreadMessages > 9 ? "9+" : unreadMessages}
                </Badge>
              )}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-[var(--border-default)]" />

        {/* Resources Section */}
        <p className="px-3 pb-2 text-caption font-medium text-foreground-muted">
          Resources
        </p>
        {resourceNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--candid-nav-item-active)] text-[var(--candid-foreground-brand)]"
                  : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
              )}
            >
              <Icon size={20} weight={isActive ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border-default)] p-3 space-y-1">
        <Link
          href="/candid/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150",
            pathname === "/candid/settings" || pathname.startsWith("/candid/settings/")
              ? "bg-[var(--candid-nav-item-active)] text-[var(--candid-foreground-brand)]"
              : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
          )}
        >
          <Gear size={20} weight={pathname.startsWith("/candid/settings") ? "fill" : "regular"} />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium text-foreground-muted hover:bg-[var(--primitive-red-50)] hover:text-[var(--primitive-red-600)] transition-all duration-150"
        >
          <SignOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}

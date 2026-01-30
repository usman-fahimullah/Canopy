"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CandidLogo } from "./CandidLogo";
import { CandidSymbol } from "./CandidSymbol";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  House,
  MagnifyingGlass,
  ChatCircle,
  CalendarBlank,
  Gear,
  SignOut,
  Question,
  BookOpen,
  MapTrifold,
  Users,
  Briefcase,
  Leaf,
} from "@phosphor-icons/react";
import { createClient } from "@/lib/supabase/client";

const mainNavItems = [
  { href: "/candid/dashboard", label: "Home", icon: House },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarBlank },
  { href: "/candid/mentors", label: "Mentors", icon: Users },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
];

const ecosystemNavItems = [
  { href: "https://greenjobsboard.us", label: "Green Jobs Board", icon: Briefcase, external: true },
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
  role: string;
}

export function CandidSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
          avatar: authUser.user_metadata?.avatar_url || null,
          role: "mentee", // Default role, could be fetched from profile
        });
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
          avatar: session.user.user_metadata?.avatar_url || null,
          role: "mentee",
        });
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

  const displayName = user?.name || "User";
  const nameParts = displayName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "";

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
            <p className="text-caption text-foreground-muted capitalize">{user.role}</p>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
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

        {/* Ecosystem Section */}
        <p className="px-3 pb-2 text-caption font-medium text-foreground-muted">
          Ecosystem
        </p>
        {ecosystemNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-all duration-150 text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
            >
              <Icon size={20} weight="regular" />
              {item.label}
            </a>
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
            pathname === "/candid/settings"
              ? "bg-[var(--candid-nav-item-active)] text-[var(--candid-foreground-brand)]"
              : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
          )}
        >
          <Gear size={20} weight={pathname === "/candid/settings" ? "fill" : "regular"} />
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

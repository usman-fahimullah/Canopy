"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CandidLogo } from "./CandidLogo";
import { CandidSymbol } from "./CandidSymbol";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  House,
  MagnifyingGlass,
  ChatCircle,
  CalendarBlank,
  Gear,
  User,
  CaretDown,
  List,
  X,
  ArrowRight,
  SignOut,
  Question,
  Users,
} from "@phosphor-icons/react";
import { NotificationBell } from "./NotificationBell";

const navItems = [
  { href: "/candid/dashboard", label: "Dashboard", icon: House },
  { href: "/candid/browse", label: "Find Coaches", icon: MagnifyingGlass },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarBlank },
];

const mobileNavItems = [
  { href: "/candid/dashboard", label: "Home", icon: House },
  { href: "/candid/browse", label: "Browse", icon: Users },
  { href: "/candid/messages", label: "Messages", icon: ChatCircle },
  { href: "/candid/sessions", label: "Sessions", icon: CalendarBlank },
];

interface UserData {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
}

export function CandidNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const unreadMessages = 0; // Will be replaced when useConversations is wired globally

  // Fetch user data
  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "User",
          avatar: authUser.user_metadata?.avatar_url || null,
        });
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name:
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
          avatar: session.user.user_metadata?.avatar_url || null,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const displayName = user?.name || "User";
  const firstName = displayName.split(" ")[0];

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          "bg-[var(--background-default)]/95 sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-200",
          hasScrolled ? "border-[var(--candid-nav-border)]" : "border-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/candid"
            className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
          >
            <CandidSymbol size={24} />
            <CandidLogo className="hidden h-5 sm:block" />
          </Link>

          {/* Main Nav (Desktop) - Centered */}
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              const showBadge = item.href === "/candid/messages" && unreadMessages > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-caption font-medium transition-all duration-200",
                    isActive
                      ? "bg-[var(--candid-nav-item-active)] text-[var(--candid-foreground-brand)]"
                      : "hover:text-foreground-default text-foreground-muted hover:bg-[var(--candid-nav-item-hover)]"
                  )}
                >
                  <Icon size={16} weight={isActive ? "fill" : "regular"} />
                  {item.label}
                  {showBadge && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primitive-red-500)] text-[9px] font-bold text-white ring-2 ring-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <NotificationBell />

            {/* Settings (Desktop) */}
            <Link
              href="/candid/settings"
              className="hover:text-foreground-default hidden rounded-full p-2 text-foreground-muted transition-colors duration-200 hover:bg-[var(--candid-nav-item-hover)] sm:flex"
            >
              <Gear size={18} />
            </Link>

            {/* User Menu (Desktop) */}
            {user ? (
              <button className="ml-2 hidden items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-all duration-200 hover:bg-[var(--background-subtle)] sm:flex">
                <Avatar size="sm" src={user.avatar || undefined} name={displayName} color="green" />
                <span className="text-foreground-default hidden text-caption font-medium lg:block">
                  {firstName}
                </span>
                <CaretDown size={12} className="text-foreground-muted" />
              </button>
            ) : (
              <Link
                href="/login"
                className="ml-2 hidden items-center gap-2 rounded-full bg-[var(--candid-dark)] px-3 py-1.5 text-caption font-medium text-white transition-all duration-200 hover:opacity-90 sm:flex"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:text-foreground-default rounded-lg p-2 text-foreground-muted transition-colors duration-200 hover:bg-[var(--candid-nav-item-hover)] md:hidden"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-40 bg-black/50 duration-200 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sheet */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[280px] bg-[var(--background-default)] shadow-xl transition-transform duration-300 ease-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-default)] p-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar
                size="default"
                src={user.avatar || undefined}
                name={displayName}
                color="green"
              />
              <div>
                <p className="text-foreground-default font-semibold">{displayName}</p>
                <p className="text-caption-sm text-foreground-muted">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar size="default" name="Guest" color="green" />
              <div>
                <p className="text-foreground-default font-semibold">Guest</p>
                <Link
                  href="/login"
                  className="text-caption-sm text-[var(--candid-foreground-brand)]"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-foreground-muted hover:bg-[var(--background-subtle)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex h-[calc(100%-80px)] flex-col">
          {/* Nav Links */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--candid-background-subtle)] text-[var(--candid-foreground-brand)]"
                      : "hover:text-foreground-default text-foreground-muted hover:bg-[var(--background-subtle)]"
                  )}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  {item.label}
                  {item.href === "/candid/messages" && unreadMessages > 0 && (
                    <Badge variant="error" size="sm" className="ml-auto">
                      {unreadMessages}
                    </Badge>
                  )}
                </Link>
              );
            })}

            <div className="my-4 border-t border-[var(--border-default)]" />

            <Link
              href="/candid/settings"
              className="hover:text-foreground-default flex items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium text-foreground-muted transition-colors hover:bg-[var(--background-subtle)]"
            >
              <Gear size={20} />
              Settings
            </Link>

            <Link
              href="/candid/help"
              className="hover:text-foreground-default flex items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium text-foreground-muted transition-colors hover:bg-[var(--background-subtle)]"
            >
              <Question size={20} />
              Help & Support
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-[var(--border-default)] p-4">
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium text-foreground-muted transition-colors hover:bg-[var(--primitive-red-50)] hover:text-[var(--primitive-red-600)]"
              >
                <SignOut size={20} />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--candid-dark)] px-4 py-3 text-body-sm font-medium text-white transition-colors hover:opacity-90"
              >
                Sign In
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="bg-[var(--background-default)]/95 safe-area-inset-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-default)] backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            const showBadge = item.href === "/candid/messages" && unreadMessages > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors",
                  isActive ? "text-[var(--candid-foreground-brand)]" : "text-foreground-muted"
                )}
              >
                <div className="relative">
                  <Icon size={22} weight={isActive ? "fill" : "regular"} />
                  {showBadge && (
                    <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primitive-red-500)] text-[9px] font-bold text-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </div>
                <span className={cn("text-caption-sm", isActive && "font-medium")}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--candid-dark)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

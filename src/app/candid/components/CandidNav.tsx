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
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
          avatar: authUser.user_metadata?.avatar_url || null,
        });
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
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
          "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md transition-all duration-200",
          hasScrolled ? "border-[var(--candid-nav-border)]" : "border-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/candid" className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <CandidSymbol size={24} />
            <CandidLogo className="hidden sm:block h-5" />
          </Link>

          {/* Main Nav (Desktop) - Centered */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-1">
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
                      : "text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default"
                  )}
                >
                  <Icon size={16} weight={isActive ? "fill" : "regular"} />
                  {item.label}
                  {showBadge && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primitive-red-500)] text-[9px] font-bold text-white ring-2 ring-white">
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
              className="hidden sm:flex rounded-full p-2 text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default transition-colors duration-200"
            >
              <Gear size={18} />
            </Link>

            {/* User Menu (Desktop) */}
            {user ? (
              <button
                className="hidden sm:flex ml-2 items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-[var(--background-subtle)] transition-all duration-200"
              >
                <Avatar
                  size="sm"
                  src={user.avatar || undefined}
                  name={displayName}
                  color="green"
                />
                <span className="hidden lg:block text-caption font-medium text-foreground-default">
                  {firstName}
                </span>
                <CaretDown size={12} className="text-foreground-muted" />
              </button>
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex ml-2 items-center gap-2 rounded-full py-1.5 px-3 bg-[var(--candid-dark)] text-white text-caption font-medium hover:opacity-90 transition-all duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-foreground-muted hover:bg-[var(--candid-nav-item-hover)] hover:text-foreground-default transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sheet */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-xl md:hidden transition-transform duration-300 ease-out",
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
                <p className="font-semibold text-foreground-default">
                  {displayName}
                </p>
                <p className="text-caption-sm text-foreground-muted">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar size="default" name="Guest" color="green" />
              <div>
                <p className="font-semibold text-foreground-default">Guest</p>
                <Link href="/login" className="text-caption-sm text-[var(--candid-foreground-brand)]">
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
        <div className="flex flex-col h-[calc(100%-80px)]">
          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1">
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
                      : "text-foreground-muted hover:bg-[var(--background-subtle)] hover:text-foreground-default"
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
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium text-foreground-muted hover:bg-[var(--background-subtle)] hover:text-foreground-default transition-colors"
            >
              <Gear size={20} />
              Settings
            </Link>

            <Link
              href="/candid/help"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium text-foreground-muted hover:bg-[var(--background-subtle)] hover:text-foreground-default transition-colors"
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
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-body-sm font-medium text-foreground-muted hover:bg-[var(--primitive-red-50)] hover:text-[var(--primitive-red-600)] transition-colors"
              >
                <SignOut size={20} />
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 bg-[var(--candid-dark)] text-white text-body-sm font-medium hover:opacity-90 transition-colors"
              >
                Sign In
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border-default)] bg-white/95 backdrop-blur-md md:hidden safe-area-inset-bottom">
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
                    <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--primitive-red-500)] text-[9px] font-bold text-white">
                      {unreadMessages > 9 ? "9+" : unreadMessages}
                    </span>
                  )}
                </div>
                <span className={cn("text-caption-sm", isActive && "font-medium")}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[var(--candid-dark)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

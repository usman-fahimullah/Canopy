"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Gear,
  SignOut,
  UserCircle,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShell } from "@/lib/shell/shell-context";
import { SHELL_CONFIGS } from "@/lib/onboarding/types";
import type { Shell } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  children: React.ReactNode;
}

const SHELL_LABELS: Record<Shell, string> = {
  talent: "Job Search",
  coach: "Coaching",
  employer: "Hiring",
};

export function ProfileDropdown({ children }: ProfileDropdownProps) {
  const router = useRouter();
  const { user, currentShell, activeShells, switchShell } = useShell();

  const showSwitcher = activeShells.length > 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-64"
      >
        {/* User info */}
        <div className="px-3 py-2.5">
          <p className="text-body-sm font-semibold text-foreground-default truncate">
            {user?.name || "User"}
          </p>
          <p className="text-caption text-foreground-muted truncate">
            {user?.email || ""}
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* Quick links */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/${currentShell}/${currentShell === "talent" ? "profile" : "settings"}`
              )
            }
          >
            <UserCircle size={18} weight="fill" className="mr-2" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                SHELL_CONFIGS[currentShell]
                  ? `/${currentShell}/settings`
                  : "/settings"
              )
            }
          >
            <Gear size={18} weight="fill" className="mr-2" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Shell switcher */}
        {showSwitcher && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-1.5">
              <ArrowsLeftRight size={14} weight="bold" />
              Switch to
            </DropdownMenuLabel>
            <DropdownMenuGroup>
              {activeShells.map((shell) => (
                <DropdownMenuItem
                  key={shell}
                  onClick={() => {
                    if (shell !== currentShell) {
                      switchShell(shell);
                    }
                  }}
                  className={cn(
                    "pl-6",
                    shell === currentShell &&
                      "bg-[var(--background-interactive-selected)] font-medium"
                  )}
                >
                  <span className="flex-1">{SHELL_LABELS[shell]}</span>
                  {shell === currentShell && (
                    <span className="text-caption text-foreground-muted">
                      Current
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuItem
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="text-foreground-muted"
        >
          <SignOut size={18} weight="bold" className="mr-2" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

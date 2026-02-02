"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { Shell } from "@/lib/onboarding/types";
import { SHELL_CONFIGS } from "@/lib/onboarding/types";
import type { ShellUser, EmployerOrgRole } from "./types";
import { logger, formatError } from "@/lib/logger";

interface ShellContextValue {
  currentShell: Shell;
  user: ShellUser | null;
  loading: boolean;
  activeShells: Shell[];
  /** Navigate to another shell's dashboard */
  switchShell: (shell: Shell) => void;
}

const ShellContext = createContext<ShellContextValue>({
  currentShell: "talent",
  user: null,
  loading: true,
  activeShells: [],
  switchShell: () => {},
});

interface ShellProviderProps {
  shell: Shell;
  children: ReactNode;
}

export function ShellProvider({ shell, children }: ShellProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<ShellUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const res = await fetch("/api/profile/role");
        if (!res.ok) throw new Error("Failed to fetch role");
        const data = await res.json();

        if (cancelled) return;

        const shellUser: ShellUser = {
          id: data.id || "",
          email: data.email || "",
          name: data.name || "",
          avatar: data.avatar || null,
          activeShells: data.activeShells || [],
          primaryShell: data.primaryShell || shell,
          currentShell: shell,
          employerOrgRole: data.employerOrgRole as EmployerOrgRole | undefined,
          badges: {},
          progressiveFeatures: data.progressiveFeatures || (shell === "talent" ? ["coaching", "mentoring"] : []),
        };

        setUser(shellUser);
      } catch (err) {
        logger.error("ShellProvider fetch failed", { error: formatError(err), endpoint: "lib/shell/shell-context" });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [shell]);

  const switchShell = useCallback(
    (targetShell: Shell) => {
      const config = SHELL_CONFIGS[targetShell];
      if (config) {
        router.push(config.dashboardPath);
      }
    },
    [router]
  );

  const activeShells = user?.activeShells || [];

  return (
    <ShellContext.Provider
      value={{ currentShell: shell, user, loading, activeShells, switchShell }}
    >
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  return useContext(ShellContext);
}

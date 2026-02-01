"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Shell } from "@/lib/onboarding/types";
import { SHELL_CONFIGS } from "@/lib/onboarding/types";

// Per-shell localStorage key so each shell remembers its own collapse state
function getStorageKey(shell: Shell): string {
  return `shell-sidebar-collapsed-${shell}`;
}

function getDefaultCollapsed(shell: Shell): boolean {
  return SHELL_CONFIGS[shell].sidebarDefault === "collapsed";
}

interface SidebarContextValue {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  toggle: () => {},
  setCollapsed: () => {},
});

interface SidebarProviderProps {
  shell: Shell;
  children: ReactNode;
}

export function SidebarProvider({ shell, children }: SidebarProviderProps) {
  const [collapsed, setCollapsedState] = useState(getDefaultCollapsed(shell));

  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey(shell));
    if (stored !== null) {
      setCollapsedState(stored === "true");
    }
  }, [shell]);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      localStorage.setItem(getStorageKey(shell), String(next));
      return next;
    });
  }, [shell]);

  const setCollapsed = useCallback(
    (value: boolean) => {
      setCollapsedState(value);
      localStorage.setItem(getStorageKey(shell), String(value));
    },
    [shell]
  );

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

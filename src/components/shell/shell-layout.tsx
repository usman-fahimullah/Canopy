"use client";

import type { ReactNode } from "react";
import type { Shell } from "@/lib/onboarding/types";
import { shellNavConfigs } from "@/lib/shell/nav-config";
import { ShellProvider } from "@/lib/shell/shell-context";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { ShellSidebar } from "./shell-sidebar";
import { ShellMobileNav } from "./shell-mobile-nav";
import { cn } from "@/lib/utils";

interface ShellLayoutProps {
  shell: Shell;
  children: ReactNode;
}

function ShellLayoutInner({ shell, children }: { shell: Shell; children: ReactNode }) {
  const { collapsed } = useSidebar();
  const config = shellNavConfigs[shell];

  return (
    <div className="min-h-screen bg-[var(--shell-page-bg)]" data-shell={shell}>
      {/* Desktop sidebar */}
      <ShellSidebar config={config} />

      {/* Mobile header + bottom nav */}
      <ShellMobileNav config={config} />

      {/* Main content area */}
      <main
        className={cn(
          "pb-20 transition-[padding-left] duration-200 ease-in-out lg:pb-0",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function ShellLayout({ shell, children }: ShellLayoutProps) {
  return (
    <ShellProvider shell={shell}>
      <SidebarProvider shell={shell}>
        <ShellLayoutInner shell={shell}>{children}</ShellLayoutInner>
      </SidebarProvider>
    </ShellProvider>
  );
}

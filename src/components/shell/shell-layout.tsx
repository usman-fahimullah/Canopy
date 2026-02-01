"use client";

import type { ReactNode } from "react";
import type { Shell } from "@/lib/onboarding/types";
import type { ShellNavConfig } from "@/lib/shell/types";
import { ShellProvider } from "@/lib/shell/shell-context";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { ShellSidebar } from "./shell-sidebar";
import { ShellMobileNav } from "./shell-mobile-nav";
import { cn } from "@/lib/utils";

interface ShellLayoutProps {
  shell: Shell;
  config: ShellNavConfig;
  children: ReactNode;
}

function ShellLayoutInner({
  config,
  children,
}: {
  config: ShellNavConfig;
  children: ReactNode;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Desktop sidebar */}
      <ShellSidebar config={config} />

      {/* Mobile header + bottom nav */}
      <ShellMobileNav config={config} />

      {/* Main content area */}
      <main
        className={cn(
          "pb-20 lg:pb-0 transition-[padding-left] duration-200 ease-in-out",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function ShellLayout({ shell, config, children }: ShellLayoutProps) {
  return (
    <ShellProvider shell={shell}>
      <SidebarProvider shell={shell}>
        <ShellLayoutInner config={config}>{children}</ShellLayoutInner>
      </SidebarProvider>
    </ShellProvider>
  );
}

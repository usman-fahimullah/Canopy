"use client";

import { cn } from "@/lib/utils";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { CandidNav } from "./CandidNav";
import { CandidSidebar } from "./CandidSidebar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <CandidSidebar />

      <div className="lg:hidden">
        <CandidNav />
      </div>

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

export function CandidLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}

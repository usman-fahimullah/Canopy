"use client";

import React from "react";
import { DesignSystemHeader } from "@/components/design-system/DesignSystemHeader";
import { DesignSystemSidebar } from "@/components/design-system/DesignSystemSidebar";
import { SearchModalProvider } from "@/components/design-system/DesignSystemSearchModal";
import { OnThisPage, useTableOfContents } from "@/components/design-system/OnThisPage";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const tocItems = useTableOfContents();

  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Left Sidebar - Navigation */}
      <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
        <DesignSystemSidebar />
      </aside>

      {/* Main Content - Fluid width, expands to fill available space */}
      <main className="flex-1 min-w-0">
        {children}
      </main>

      {/* Right Sidebar - On This Page */}
      <aside className="hidden xl:block w-48 2xl:w-56 shrink-0">
        <div className="sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto">
          <OnThisPage items={tocItems} />
        </div>
      </aside>
    </div>
  );
}

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchModalProvider>
      <div className="min-h-screen bg-background">
        <DesignSystemHeader />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <LayoutContent>{children}</LayoutContent>
        </div>
      </div>
    </SearchModalProvider>
  );
}

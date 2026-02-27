import { PageHeader } from "@/components/shell/page-header";
import { SettingsSidebar } from "./_components/settings-sidebar";
import { SettingsPageTitle } from "./_components/settings-page-title";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader>
        <SettingsPageTitle />
      </PageHeader>
      <div className="px-8 py-6 lg:px-12">
        {/* Two-panel layout: sidebar + content in a unified card */}
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--card-background)]">
          {/* Mobile: horizontal nav strip above content */}
          <div className="border-b border-[var(--border-default)] px-4 py-3 lg:hidden">
            <SettingsSidebar variant="mobile" />
          </div>

          <div className="flex">
            {/* Desktop: vertical sidebar panel */}
            <div className="hidden w-64 flex-shrink-0 border-r border-[var(--border-default)] lg:block">
              <SettingsSidebar variant="desktop" />
            </div>

            {/* Content panel */}
            <div className="min-w-0 flex-1 p-6 lg:p-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

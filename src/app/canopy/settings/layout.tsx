import { PageHeader } from "@/components/shell/page-header";
import { SettingsSidebar } from "./_components/settings-sidebar";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader title="Settings" />
      <div className="flex flex-col gap-6 px-8 py-6 lg:flex-row lg:px-12">
        <SettingsSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

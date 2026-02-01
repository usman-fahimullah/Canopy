import type { Metadata } from "next";
import { ShellLayout } from "@/components/shell/shell-layout";
import { coachNavConfig } from "@/lib/shell/nav-config";

export const metadata: Metadata = {
  title: "Candid - Climate Career Coaching",
  description:
    "Manage your coaching practice, connect with clients, and grow your impact in climate careers.",
};

export default function CoachLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ShellLayout shell="coach" config={coachNavConfig}>
      {children}
    </ShellLayout>
  );
}

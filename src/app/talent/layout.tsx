import type { Metadata } from "next";
import { ShellLayout } from "@/components/shell/shell-layout";
import { talentNavConfig } from "@/lib/shell/nav-config";

export const metadata: Metadata = {
  title: "Green Jobs Board - Find Climate Careers",
  description:
    "Discover climate jobs and grow your career in sustainability, renewable energy, and environmental impact.",
};

export default function TalentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ShellLayout shell="talent" config={talentNavConfig}>
      {children}
    </ShellLayout>
  );
}

import type { Metadata } from "next";
import { ShellLayout } from "@/components/shell/shell-layout";
import { authorizeShell } from "@/lib/shell/authorize-shell";

export const metadata: Metadata = {
  title: "Green Jobs Board - Find Climate Careers",
  description:
    "Discover climate jobs and grow your career in sustainability, renewable energy, and environmental impact.",
};

export default async function TalentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authorizeShell("talent");

  return <ShellLayout shell="talent">{children}</ShellLayout>;
}

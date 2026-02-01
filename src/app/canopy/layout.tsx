import type { Metadata } from "next";
import { ShellLayout } from "@/components/shell/shell-layout";
import { authorizeShell } from "@/lib/shell/authorize-shell";

export const metadata: Metadata = {
  title: "Canopy - Climate Talent Hiring",
  description:
    "Hire climate talent with AI-powered sourcing and a design-forward applicant tracking system.",
};

export default async function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await authorizeShell("employer");

  return <ShellLayout shell="employer">{children}</ShellLayout>;
}

import type { Metadata } from "next";
import { ShellLayout } from "@/components/shell/shell-layout";
import { employerNavConfig } from "@/lib/shell/nav-config";

export const metadata: Metadata = {
  title: "Canopy - Climate Talent Hiring",
  description:
    "Hire climate talent with AI-powered sourcing and a design-forward applicant tracking system.",
};

export default function EmployerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ShellLayout shell="employer" config={employerNavConfig}>
      {children}
    </ShellLayout>
  );
}

import type { Metadata } from "next";
import { ShellLayout } from "@/components/shell/shell-layout";
import { CommandPalette } from "@/components/canopy/CommandPalette";
import { authorizeShell } from "@/lib/shell/authorize-shell";
import { getImpersonatedOrgId } from "@/lib/admin/impersonation";
import { getAuthenticatedAccount, isAdminAccount } from "@/lib/auth-helpers";
import { prisma } from "@/lib/db";
import { ImpersonationBanner } from "@/components/admin";

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

  // Check for admin impersonation
  let impersonationData: { orgName: string; planTier: string } | null = null;
  const impersonatedOrgId = await getImpersonatedOrgId();

  if (impersonatedOrgId) {
    const account = await getAuthenticatedAccount();
    if (account && isAdminAccount(account)) {
      const org = await prisma.organization.findUnique({
        where: { id: impersonatedOrgId },
        select: { name: true, planTier: true },
      });
      if (org) {
        impersonationData = { orgName: org.name, planTier: org.planTier };
      }
    }
  }

  return (
    <>
      {impersonationData && (
        <ImpersonationBanner
          orgName={impersonationData.orgName}
          planTier={impersonationData.planTier}
        />
      )}
      <div className={impersonationData ? "pt-10" : ""}>
        <CommandPalette />
        <ShellLayout shell="employer">{children}</ShellLayout>
      </div>
    </>
  );
}

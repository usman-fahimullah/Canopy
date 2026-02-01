import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getServerUser } from "@/lib/supabase/get-server-user";
import type { Shell } from "@/lib/onboarding/types";

/**
 * Server-side authorization guard for shell layouts.
 * Verifies the authenticated user has the appropriate role/profile
 * for the shell they are accessing.
 *
 * Redirects to /onboarding if the user lacks the required role.
 * Redirects to /login if the user is not authenticated.
 */
export async function authorizeShell(shell: Shell): Promise<void> {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    select: {
      activeRoles: true,
      seekerProfile: { select: { id: true } },
      coachProfile: { select: { id: true } },
      orgMemberships: { select: { id: true } },
    },
  });

  if (!account) {
    redirect("/login");
  }

  const activeRoles = account.activeRoles || [];
  let authorized = false;

  switch (shell) {
    case "talent":
      // User needs a seeker profile or "talent" in activeRoles
      authorized = !!account.seekerProfile || activeRoles.includes("talent");
      break;
    case "coach":
      // User needs a coach profile or "coach" in activeRoles
      authorized = !!account.coachProfile || activeRoles.includes("coach");
      break;
    case "employer":
      // User needs an org membership or "employer" in activeRoles
      authorized =
        account.orgMemberships.length > 0 || activeRoles.includes("employer");
      break;
  }

  if (!authorized) {
    redirect("/onboarding");
  }
}

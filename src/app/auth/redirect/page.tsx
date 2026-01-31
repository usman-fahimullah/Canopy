import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import {
  getOnboardingRedirect,
  getDashboardPath,
  type OnboardingProgress,
  type EntryIntent,
  type Shell,
} from "@/lib/onboarding/types";

/**
 * Auth redirect resolver.
 * After login, this server component checks the user's onboarding state
 * and routes them to the correct destination:
 * - Incomplete onboarding → /onboarding/[shell]/[step]
 * - Complete onboarding → primary shell's dashboard
 * - No account → /onboarding (fresh start)
 */
export default async function AuthRedirectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const account = await prisma.account.findUnique({
    where: { supabaseId: user.id },
    select: {
      entryIntent: true,
      primaryRole: true,
      onboardingProgress: true,
    },
  });

  if (!account) {
    // Account doesn't exist yet — send to onboarding start
    redirect("/onboarding");
  }

  const progress = account.onboardingProgress as OnboardingProgress | null;
  const entryIntent = account.entryIntent as EntryIntent | null;

  // Check if there's incomplete onboarding to finish
  const onboardingRedirect = getOnboardingRedirect(progress, entryIntent);
  if (onboardingRedirect) {
    redirect(onboardingRedirect);
  }

  // All onboarding complete — go to primary shell's dashboard
  const primaryRole = account.primaryRole as Shell | null;
  redirect(getDashboardPath(primaryRole));
}

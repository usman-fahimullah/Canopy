import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
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

  // If user has no email, can't create an account — send back to login
  if (!user.email) {
    redirect("/login");
  }

  try {
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      select: {
        entryIntent: true,
        primaryRole: true,
        onboardingProgress: true,
      },
    });

    if (!account) {
      // Account doesn't exist yet — create it from Supabase auth metadata.
      // Use upsert to handle race conditions (concurrent requests both see null).
      const metadata = user.user_metadata || {};
      try {
        await prisma.account.upsert({
          where: { supabaseId: user.id },
          update: {},
          create: {
            supabaseId: user.id,
            email: user.email,
            name: metadata.name || metadata.full_name || null,
          },
        });
      } catch (error) {
        logger.error("Failed to create account", { error: formatError(error) });
        // Still redirect to onboarding — the /api/onboarding fallback will retry
      }
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
  } catch (error) {
    logger.error("Auth redirect error", { error: formatError(error) });
    // Fallback: send to onboarding rather than crashing
    redirect("/onboarding");
  }
}

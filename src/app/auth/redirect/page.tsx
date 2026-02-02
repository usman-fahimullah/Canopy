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

  let destination = "/onboarding"; // Default fallback

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
      } catch (dbError) {
        logger.error("Failed to create account", { error: formatError(dbError) });
        // Still redirect to onboarding — the /api/onboarding fallback will retry
      }
    } else {
      const progress = account.onboardingProgress as OnboardingProgress | null;
      const entryIntent = account.entryIntent as EntryIntent | null;

      // Check if there's incomplete onboarding to finish
      const onboardingRedirect = getOnboardingRedirect(progress, entryIntent);
      if (onboardingRedirect) {
        destination = onboardingRedirect;
      } else {
        // If profile is done but no role has been activated, send to role selection
        const primaryRole = account.primaryRole as Shell | null;
        if (!primaryRole && progress?.baseProfileComplete) {
          destination = "/onboarding";
        } else {
          // All onboarding complete — go to primary shell's dashboard
          destination = getDashboardPath(primaryRole);
        }
      }
    }
  } catch (error) {
    logger.error("Auth redirect error", { error: formatError(error) });
    // Fallback: send to onboarding rather than crashing
  }

  // redirect() is called OUTSIDE try/catch since it works by throwing
  // a special NEXT_REDIRECT error that must not be caught
  redirect(destination);
}

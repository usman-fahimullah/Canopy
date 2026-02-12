import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import {
  getOnboardingRedirect,
  type OnboardingProgress,
  type EntryIntent,
} from "@/lib/onboarding/types";
import RoleSelectionView from "./_components/RoleSelectionView";

/**
 * Onboarding entry page.
 *
 * Server component that checks if the user has incomplete onboarding.
 * If so, redirects them to the correct step (Story 1.5: resume onboarding).
 * Otherwise, renders the role selection UI for new users.
 */
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      const account = await prisma.account.findUnique({
        where: { supabaseId: user.id },
        select: {
          entryIntent: true,
          onboardingProgress: true,
        },
      });

      if (account) {
        const progress = account.onboardingProgress as OnboardingProgress | null;
        const entryIntent = account.entryIntent as EntryIntent | null;
        const resumeUrl = getOnboardingRedirect(progress, entryIntent);

        // If there's an incomplete onboarding flow, resume it
        if (resumeUrl && resumeUrl !== "/onboarding") {
          redirect(resumeUrl);
        }
      }
    } catch {
      // If DB query fails, fall through to role selection
    }
  }

  return <RoleSelectionView />;
}

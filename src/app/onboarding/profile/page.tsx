"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { SHELL_ONBOARDING_SLUGS, STEPS_BY_SHELL } from "@/lib/onboarding/types";

/**
 * Legacy redirect: The standalone profile step has been merged into each
 * shell's first onboarding step. This page redirects users who arrive here
 * via stale bookmarks, browser history, or back-navigation.
 */
export default function OnboardingProfileRedirect() {
  const router = useRouter();
  const { selectedShell } = useOnboardingForm();

  useEffect(() => {
    if (selectedShell) {
      const slug = SHELL_ONBOARDING_SLUGS[selectedShell];
      const firstStep = STEPS_BY_SHELL[selectedShell][0];
      router.replace(`/onboarding/${slug}/${firstStep.path}`);
    } else {
      router.replace("/onboarding");
    }
  }, [selectedShell, router]);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { Button } from "@/components/ui/button";
import type { Shell } from "@/lib/onboarding/types";
import { SHELL_CONFIGS } from "@/lib/onboarding/types";

const SHELL_MESSAGES: Record<Shell, { heading: string; description: string }> = {
  talent: {
    heading: "You're all set to find your climate career!",
    description:
      "We'll start matching you with opportunities based on your preferences. Browse jobs, explore your dashboard, or connect with a coach.",
  },
  coach: {
    heading: "Your coaching profile has been submitted!",
    description:
      "Our team will review your application and get back to you shortly. In the meantime, explore your dashboard and set up your schedule.",
  },
  employer: {
    heading: "Your company is ready to hire!",
    description:
      "Start posting roles, sourcing candidates, and building your climate team. Your dashboard has everything you need to get started.",
  },
};

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { clearAll } = useOnboardingForm();
  const [shell, setShell] = useState<Shell | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's primary shell to show the right message
  useEffect(() => {
    async function fetchRole() {
      try {
        const res = await fetch("/api/profile/role");
        if (res.ok) {
          const data = await res.json();
          setShell(data.primaryShell || data.entryIntent || "talent");
        }
      } catch {
        // Fallback to talent
        setShell("talent");
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
    // Clear form data from localStorage now that onboarding is done
    clearAll();
  }, [clearAll]);

  if (loading || !shell) {
    return (
      <OnboardingShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primitive-neutral-300)] border-t-[var(--candid-foreground-brand)]" />
        </div>
      </OnboardingShell>
    );
  }

  const config = SHELL_CONFIGS[shell];
  const message = SHELL_MESSAGES[shell];

  return (
    <OnboardingShell shell={shell}>
      <div className="max-w-lg mx-auto text-center py-8">
        {/* Success icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primitive-green-100)] mb-6">
          <CheckCircle
            size={40}
            weight="fill"
            className="text-[var(--candid-foreground-brand)]"
          />
        </div>

        <h1 className="text-heading-sm font-bold text-foreground-default mb-3">
          {message.heading}
        </h1>
        <p className="text-body-sm text-foreground-muted mb-8">
          {message.description}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild>
            <Link href={config.dashboardPath}>
              Go to your dashboard
            </Link>
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}

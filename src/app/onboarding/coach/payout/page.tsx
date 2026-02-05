"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { FormCard, FormField } from "@/components/ui/form-section";
import { InlineMessage } from "@/components/ui/inline-message";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";
import { CreditCard, ShieldCheck, ArrowSquareOut, CheckCircle } from "@phosphor-icons/react";

export default function CoachPayoutPage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();
  const [isConnecting, setIsConnecting] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);

  const step = COACH_STEPS[4]; // payout

  async function handleConnectStripe() {
    setIsConnecting(true);
    setStripeError(null);

    try {
      const res = await fetch("/api/stripe/connect", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
      // If we couldn't get a redirect URL, let the user know
      setStripeError(
        "Stripe setup is not available right now. You can skip this step and set up payouts later from your dashboard."
      );
    } catch {
      setStripeError(
        "Could not connect to Stripe. Please check your internet connection and try again, or skip this step for now."
      );
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={4}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/availability")}
          onContinue={() => router.push("/onboarding/coach/preview")}
          onSkip={() => router.push("/onboarding/coach/preview")}
          skipLabel="Set up later"
          canContinue={coachData.stripeConnected}
        />
      }
    >
      <div className="space-y-6">
        {/* Stripe Connect Card */}
        <FormCard>
          <FormField
            label="Connect your payout account"
            helpText="We use Stripe to securely handle payments and payouts"
          >
            {coachData.stripeConnected ? (
              <div className="flex items-center gap-3 rounded-xl border-2 border-[var(--border-success)] bg-[var(--background-success)] p-4">
                <CheckCircle
                  size={24}
                  weight="fill"
                  className="shrink-0 text-[var(--foreground-success)]"
                />
                <div>
                  <p className="text-body-sm font-medium text-[var(--foreground-success)]">
                    Stripe account connected
                  </p>
                  <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                    You can manage your payout settings from your dashboard
                  </p>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConnectStripe}
                disabled={isConnecting}
                className={cn(
                  "flex w-full items-center gap-4 rounded-xl border-2 border-dashed p-5 text-left transition-all",
                  "border-[var(--border-muted)] hover:border-[var(--border-interactive-hover)]",
                  "bg-[var(--background-interactive-default)] hover:bg-[var(--background-interactive-hover)]",
                  isConnecting && "cursor-wait opacity-60"
                )}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--background-brand-subtle)]">
                  <CreditCard size={24} weight="bold" className="text-[var(--foreground-brand)]" />
                </div>
                <div className="flex-1">
                  <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                    {isConnecting ? "Connecting to Stripe..." : "Connect with Stripe"}
                  </p>
                  <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                    Set up direct deposits to your bank account
                  </p>
                </div>
                <ArrowSquareOut size={20} className="shrink-0 text-[var(--foreground-subtle)]" />
              </button>
            )}
          </FormField>
          {stripeError && <InlineMessage variant="warning">{stripeError}</InlineMessage>}
        </FormCard>

        {/* Security Note */}
        <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              weight="bold"
              className="mt-0.5 shrink-0 text-[var(--foreground-brand)]"
            />
            <div>
              <p className="text-caption font-medium text-[var(--foreground-default)]">
                Secure payments
              </p>
              <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                Stripe handles all payment processing. We never store your banking details.
                You&apos;ll receive payouts directly to your bank account within 2-7 business days
                of each session.
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <FormCard>
          <p className="mb-4 text-body-sm font-medium text-[var(--foreground-default)]">
            How payouts work
          </p>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Client books & pays",
                description:
                  "When a client books a session, they pay upfront through our secure checkout.",
              },
              {
                step: "2",
                title: "You deliver the session",
                description: "Conduct your coaching session via video call or in person.",
              },
              {
                step: "3",
                title: "Payout is sent",
                description:
                  "After the session, your earnings are transferred to your bank account.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--background-brand)] text-caption font-bold text-[var(--foreground-on-emphasis)]">
                  {item.step}
                </span>
                <div>
                  <p className="text-caption font-medium text-[var(--foreground-default)]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </OnboardingShell>
  );
}

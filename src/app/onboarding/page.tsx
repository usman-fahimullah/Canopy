"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MagnifyingGlass, GraduationCap, Buildings } from "@phosphor-icons/react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import type { Shell } from "@/lib/onboarding/types";

const intentOptions: {
  shell: Shell;
  title: string;
  description: string;
  icon: React.ElementType;
  features: string[];
  iconBg: string;
}[] = [
  {
    shell: "talent",
    title: "I'm looking for a climate job",
    description:
      "Search climate jobs, get matched with opportunities, and connect with coaches and mentors.",
    icon: MagnifyingGlass,
    features: ["Job matching", "Career coaching", "Skill tracking"],
    iconBg: "var(--primitive-green-100)",
  },
  {
    shell: "coach",
    title: "I want to coach others",
    description:
      "Build your coaching practice, manage clients, and help people transition into climate work.",
    icon: GraduationCap,
    features: ["Client management", "Session booking", "Earnings dashboard"],
    iconBg: "var(--primitive-yellow-100)",
  },
  {
    shell: "employer",
    title: "I'm hiring climate talent",
    description: "Post roles, manage candidates, and build your team with AI-powered sourcing.",
    icon: Buildings,
    features: ["Job posting", "Candidate pipeline", "Team collaboration"],
    iconBg: "var(--primitive-blue-100)",
  },
];

export default function OnboardingIntentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function selectIntent(shell: Shell) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-intent",
          entryIntent: shell,
        }),
      });

      if (res.status === 401) {
        // Not authenticated — redirect to signup with intent
        router.push(`/signup?intent=${shell}`);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      // Navigate to base profile step
      router.push("/onboarding/profile");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <OnboardingShell>
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-foreground-default text-heading-sm font-bold">
            Welcome! What brings you here?
          </h1>
          <p className="mt-2 text-body-sm text-foreground-muted">
            Choose your starting point. You can always add more roles later.
          </p>
        </div>

        {/* Intent cards */}
        <div className="space-y-4">
          {intentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.shell}
                onClick={() => selectIntent(option.shell)}
                disabled={loading}
                className="group w-full rounded-2xl border-2 border-[var(--primitive-neutral-200)] bg-white p-6 text-left transition-all hover:border-[var(--candid-foreground-brand)] hover:shadow-[var(--shadow-card-hover)] disabled:opacity-50"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: option.iconBg }}
                  >
                    <Icon size={24} weight="bold" className="text-foreground-default" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground-default mb-1 font-semibold">{option.title}</h3>
                    <p className="mb-3 text-caption text-foreground-muted">{option.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center rounded-full bg-[var(--primitive-neutral-100)] px-2.5 py-0.5 text-caption-sm font-medium text-foreground-muted"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="mt-4 text-center text-caption text-[var(--primitive-red-600)]">{error}</p>
        )}

        {/* Sign in link */}
        <p className="mt-8 text-center text-caption text-foreground-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--candid-foreground-brand)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </OnboardingShell>
  );
}

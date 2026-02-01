"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { CandidLogo } from "@/app/candid/components/CandidLogo";
import { cn } from "@/lib/utils";

/**
 * Onboarding Layout - Trails Design System
 *
 * Provides consistent layout for all onboarding screens with:
 * - Canopy/GJB logo header
 * - Progress indicator
 * - Centered content container
 */

// Define onboarding steps for each flow
const seekerSteps = [
  { path: "/role-selection", label: "Account Type" },
  { path: "/seeker/profile", label: "Profile" },
  { path: "/seeker/career-journey", label: "Career Journey" },
  { path: "/seeker/skills-pathways", label: "Skills & Pathways" },
];

const employerSteps = [
  { path: "/role-selection", label: "Account Type" },
  { path: "/employer/company", label: "Company" },
  { path: "/employer/your-role", label: "Your Role" },
  { path: "/employer/invite-team", label: "Team" },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine which flow we're in based on current path
  const isEmployerFlow = pathname.includes("/employer/");
  const isSeekerFlow = pathname.includes("/seeker/");
  const steps = isEmployerFlow ? employerSteps : isSeekerFlow ? seekerSteps : null;

  // Find current step index
  const currentStepIndex = steps
    ? steps.findIndex(step => pathname.endsWith(step.path))
    : 0;

  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] flex flex-col">
      {/* Header with Logo and Progress */}
      <header className="px-6 py-4 border-b border-[var(--primitive-neutral-200)] bg-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-block">
            <CandidLogo width={100} height={24} />
          </Link>

          {/* Progress indicator - only show when in a specific flow */}
          {steps && currentStepIndex >= 0 && (
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.path} className="flex items-center">
                  {/* Step indicator */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                      index < currentStepIndex
                        ? "bg-[var(--primitive-green-600)] text-white"
                        : index === currentStepIndex
                        ? "bg-[var(--primitive-green-800)] text-white"
                        : "bg-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-600)]"
                    )}
                  >
                    {index < currentStepIndex ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M13.3333 4L6 11.3333L2.66667 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-1",
                        index < currentStepIndex
                          ? "bg-[var(--primitive-green-600)]"
                          : "bg-[var(--primitive-neutral-200)]"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}

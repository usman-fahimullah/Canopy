"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Briefcase, MagnifyingGlass, ArrowRight } from "@phosphor-icons/react";

/**
 * Role Selection Screen - Onboarding Step 1
 *
 * Based on Figma design (137:8036)
 * User selects whether they are a Job Seeker or Employer
 */

type AccountType = "seeker" | "employer" | null;

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AccountType>(null);

  const handleContinue = () => {
    if (selectedType === "seeker") {
      router.push("/seeker/profile");
    } else if (selectedType === "employer") {
      router.push("/employer/company");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          Which best describes you?
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Select your account type to get started
        </p>
      </div>

      {/* Selection Cards */}
      <div className="grid gap-4 mb-8">
        {/* Job Seeker Card */}
        <button
          type="button"
          onClick={() => setSelectedType("seeker")}
          className={cn(
            "relative flex items-start gap-4 p-6 rounded-xl border-2 text-left transition-all",
            "hover:border-[var(--primitive-green-500)] hover:bg-[var(--primitive-green-50)]",
            selectedType === "seeker"
              ? "border-[var(--primitive-green-600)] bg-[var(--primitive-green-50)]"
              : "border-[var(--primitive-neutral-200)] bg-white"
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
              selectedType === "seeker"
                ? "bg-[var(--primitive-green-600)] text-white"
                : "bg-[var(--primitive-green-100)] text-[var(--primitive-green-700)]"
            )}
          >
            <MagnifyingGlass weight="bold" size={24} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--primitive-green-800)] mb-1">
              Job Seeker
            </h2>
            <p className="text-[var(--primitive-neutral-600)]">
              I&apos;m looking for opportunities in the green economy and want to explore climate careers.
            </p>
          </div>

          {/* Selection indicator */}
          <div
            className={cn(
              "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center",
              selectedType === "seeker"
                ? "border-[var(--primitive-green-600)] bg-[var(--primitive-green-600)]"
                : "border-[var(--primitive-neutral-300)] bg-white"
            )}
          >
            {selectedType === "seeker" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Employer Card */}
        <button
          type="button"
          onClick={() => setSelectedType("employer")}
          className={cn(
            "relative flex items-start gap-4 p-6 rounded-xl border-2 text-left transition-all",
            "hover:border-[var(--primitive-blue-500)] hover:bg-[var(--primitive-blue-50)]",
            selectedType === "employer"
              ? "border-[var(--primitive-blue-600)] bg-[var(--primitive-blue-50)]"
              : "border-[var(--primitive-neutral-200)] bg-white"
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
              selectedType === "employer"
                ? "bg-[var(--primitive-blue-600)] text-white"
                : "bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)]"
            )}
          >
            <Briefcase weight="bold" size={24} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[var(--primitive-green-800)] mb-1">
              Employer
            </h2>
            <p className="text-[var(--primitive-neutral-600)]">
              I&apos;m hiring for climate-focused roles and want to connect with talented candidates.
            </p>
          </div>

          {/* Selection indicator */}
          <div
            className={cn(
              "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center",
              selectedType === "employer"
                ? "border-[var(--primitive-blue-600)] bg-[var(--primitive-blue-600)]"
                : "border-[var(--primitive-neutral-300)] bg-white"
            )}
          >
            {selectedType === "employer" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10 3L4.5 8.5L2 6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!selectedType}
        className="w-full"
        rightIcon={<ArrowRight weight="bold" size={20} />}
      >
        Continue
      </Button>
    </div>
  );
}

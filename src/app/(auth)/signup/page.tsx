"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  EnvelopeSimple,
  Lock,
  User,
  GoogleLogo,
  LinkedinLogo,
  MagnifyingGlass,
  GraduationCap,
  Buildings,
} from "@phosphor-icons/react";

type AccountType = "talent" | "coach" | "employer";

const typeOptions: {
  value: AccountType;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
}[] = [
  {
    value: "talent",
    title: "I'm looking for a climate job",
    description: "Search jobs, get matched with opportunities, and connect with career coaches",
    icon: MagnifyingGlass,
    iconBg: "var(--primitive-green-100)",
  },
  {
    value: "coach",
    title: "I want to coach others",
    description: "Share your expertise and help career changers transition into climate work",
    icon: GraduationCap,
    iconBg: "var(--primitive-yellow-100)",
  },
  {
    value: "employer",
    title: "I'm hiring climate talent",
    description: "Post roles, manage candidates, and build your team with AI-powered sourcing",
    icon: Buildings,
    iconBg: "var(--primitive-blue-100)",
  },
];

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"type" | "details">("type");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Pre-select account type from URL param (e.g., /signup?intent=talent)
  useEffect(() => {
    const intent = searchParams.get("intent");
    if (intent && ["talent", "coach", "employer"].includes(intent)) {
      setAccountType(intent as AccountType);
      setStep("details");
    }
  }, [searchParams]);

  const handleTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep("details");
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            account_type: accountType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/auth/redirect`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = async (provider: "google" | "linkedin_oidc") => {
    if (!accountType) {
      setError("Please select an account type first");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=/auth/redirect&type=${accountType}`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
            <EnvelopeSimple className="h-8 w-8 text-[var(--primitive-green-600)]" weight="bold" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[var(--primitive-green-800)]">
            Check your email
          </h1>
          <p className="mb-6 text-[var(--primitive-neutral-600)]">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to
            activate your account.
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSuccess(false);
              setStep("type");
              setAccountType(null);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setName("");
            }}
          >
            Back to sign up
          </Button>
        </div>
      </div>
    );
  }

  // Account type selection
  if (step === "type") {
    return (
      <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-[var(--primitive-green-800)]">Get started</h1>
          <p className="text-[var(--primitive-neutral-600)]">What brings you here?</p>
        </div>

        <div className="space-y-3">
          {typeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => handleTypeSelect(option.value)}
                className="group w-full rounded-xl border-2 border-[var(--primitive-neutral-200)] p-5 text-left transition-all hover:border-[var(--primitive-green-600)] hover:bg-[var(--primitive-green-100)]"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: option.iconBg }}
                  >
                    <Icon className="text-foreground-default h-5 w-5" weight="bold" />
                  </div>
                  <div>
                    <h3 className="mb-0.5 font-semibold text-[var(--primitive-green-800)]">
                      {option.title}
                    </h3>
                    <p className="text-sm text-[var(--primitive-neutral-600)]">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-[var(--primitive-neutral-600)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--primitive-green-600)] hover:text-[var(--primitive-green-700)]"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // Details form
  const typeLabel =
    accountType === "talent"
      ? "Start your climate career journey"
      : accountType === "coach"
        ? "Apply to become a coach"
        : "Start hiring climate talent";

  const buttonLabel =
    accountType === "talent"
      ? "Create account"
      : accountType === "coach"
        ? "Apply to coach"
        : "Create account";

  return (
    <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-white p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[var(--primitive-green-800)]">
          Create your account
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">{typeLabel}</p>
      </div>

      {/* OAuth Buttons */}
      <div className="mb-6 space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthSignup("google")}
          disabled={loading}
          leftIcon={<GoogleLogo weight="bold" className="h-5 w-5" />}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthSignup("linkedin_oidc")}
          disabled={loading}
          leftIcon={<LinkedinLogo weight="bold" className="h-5 w-5" />}
        >
          Continue with LinkedIn
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--primitive-neutral-200)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-[var(--primitive-neutral-600)]">
            or continue with email
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailSignup} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-[var(--primitive-green-800)]">
            Full name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftAddon={<User weight="bold" />}
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-[var(--primitive-green-800)]">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftAddon={<EnvelopeSimple weight="bold" />}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--primitive-green-800)]"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftAddon={<Lock weight="bold" />}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-[var(--primitive-green-800)]"
          >
            Confirm password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftAddon={<Lock weight="bold" />}
            required
            autoComplete="new-password"
            error={confirmPassword.length > 0 && password !== confirmPassword}
          />
        </div>

        {error && <InputMessage status="error">{error}</InputMessage>}

        <Button type="submit" className="w-full" loading={loading} disabled={loading}>
          {buttonLabel}
        </Button>
      </form>

      {/* Back button */}
      <div className="mt-4">
        <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("type")}>
          Back
        </Button>
      </div>

      {/* Terms */}
      <p className="mt-6 text-center text-xs text-[var(--primitive-neutral-600)]">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-[var(--primitive-green-600)]">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-[var(--primitive-green-600)]">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { createClient } from "@/lib/supabase/client";
import { EnvelopeSimple, GoogleLogo, LinkedinLogo, ArrowLeft } from "@phosphor-icons/react";
import { OtpInput } from "./components/otp-input";
import {
  isValidOtpFormat,
  canResendOtp,
  getResendCooldownRemaining,
  getOtpErrorMessage,
  formatCooldownTime,
} from "@/lib/auth/otp-utils";

/**
 * Sign Up page — Figma: node 714:9370
 *
 * Flow: Sign Up (name + email + OAuth) → OTP Verify → /auth/redirect → /onboarding
 * No account type selection here — role selection happens on /onboarding after auth.
 */
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

  // Form state
  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // OTP verification state
  const [otpCode, setOtpCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Intent from URL (preserved for after auth)
  const intent = searchParams.get("intent");

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (!lastResendTime) return;

    const timer = setInterval(() => {
      const remaining = getResendCooldownRemaining(lastResendTime);
      setResendCooldown(remaining);

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastResendTime]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // Passwordless sign-up: Supabase sends an OTP to the email
      const { error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID() + "Aa1!", // Generate a strong random password (required by Supabase)
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            name: `${firstName} ${lastName}`.trim(),
            ...(intent ? { account_type: intent } : {}),
          },
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Move to OTP verification step
      setStep("verify");
      setLastResendTime(Date.now());
      setResendCooldown(60);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);

    if (!isValidOtpFormat(otpCode)) {
      setVerifyError("Please enter all 6 digits");
      return;
    }

    setVerifyLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });

      if (error) {
        setVerifyError(getOtpErrorMessage(error.message));
        return;
      }

      // Success! Redirect to auth resolver
      router.push("/auth/redirect");
      router.refresh();
    } catch {
      setVerifyError("Verification failed. Please try again.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResendOtp(lastResendTime, resendCount)) {
      return;
    }

    setVerifyError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) {
        setVerifyError(getOtpErrorMessage(error.message));
        return;
      }

      setResendCount((prev) => prev + 1);
      setLastResendTime(Date.now());
      setResendCooldown(60);
      setOtpCode("");
    } catch {
      setVerifyError("Failed to resend code. Please try again.");
    }
  };

  const handleBackFromVerify = () => {
    setStep("signup");
    setOtpCode("");
    setVerifyError(null);
  };

  const handleOAuthSignup = async (provider: "google" | "linkedin_oidc") => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const redirectParams = new URLSearchParams({
        redirect: "/auth/redirect",
        ...(intent ? { type: intent } : {}),
      });

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?${redirectParams.toString()}`,
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

  // ─── OTP Verification Step ───
  if (step === "verify") {
    const canResend = canResendOtp(lastResendTime, resendCount);
    const maxResendsReached = resendCount >= 5;

    return (
      <div className="rounded-3xl bg-[var(--card-background)] px-8 py-8 shadow-[var(--shadow-card)]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
            <EnvelopeSimple className="h-8 w-8 text-[var(--primitive-green-600)]" weight="bold" />
          </div>
          <h1 className="mb-2 text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
            Check your email
          </h1>
          <p className="text-body-sm text-[var(--foreground-muted)]">
            We sent a 6-digit code to <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <OtpInput
            value={otpCode}
            onChange={setOtpCode}
            disabled={verifyLoading}
            error={!!verifyError}
          />

          {verifyError && (
            <InputMessage status="error" className="text-center">
              {verifyError}
            </InputMessage>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            loading={verifyLoading}
            disabled={verifyLoading || otpCode.length < 6}
          >
            Verify email
          </Button>
        </form>

        {/* Resend code */}
        <div className="mt-6 text-center">
          {maxResendsReached ? (
            <p className="text-caption text-[var(--foreground-muted)]">
              Too many resend attempts. Please try again later.
            </p>
          ) : (
            <p className="text-caption text-[var(--foreground-muted)]">
              Didn&apos;t receive the code?{" "}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="font-medium text-[var(--foreground-brand)] hover:text-[var(--foreground-brand-emphasis)]"
                >
                  Resend
                </button>
              ) : (
                <span className="text-[var(--foreground-subtle)]">
                  Resend in {formatCooldownTime(resendCooldown)}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Back button */}
        <div className="mt-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleBackFromVerify}
            leftIcon={<ArrowLeft weight="bold" />}
          >
            Back
          </Button>
        </div>
      </div>
    );
  }

  // ─── Sign Up Form (Figma: 714:9370) ───
  return (
    <div className="rounded-3xl bg-[var(--card-background)] px-8 py-8 shadow-[var(--shadow-card)]">
      <div className="flex flex-col items-center gap-6">
        {/* Segmented Controller: Sign Up / Log In */}
        <SegmentedController
          options={[
            { value: "signup", label: "Sign Up" },
            { value: "login", label: "Log In" },
          ]}
          value="signup"
          onValueChange={(val) => {
            if (val === "login") router.push("/login");
          }}
          aria-label="Authentication mode"
        />

        {/* Heading */}
        <h1 className="text-center text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
          Sign up to Green Jobs Board
        </h1>

        {/* Form */}
        <div className="flex w-full flex-col gap-6">
          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3">
            {/* Google — Figma: black background, white text, rounded-2xl, p-4 */}
            <button
              type="button"
              onClick={() => handleOAuthSignup("google")}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primitive-neutral-900)] p-4 text-body font-bold text-[var(--primitive-neutral-0)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <GoogleLogo size={24} weight="bold" />
              Sign in with Google
            </button>

            {/* LinkedIn — Figma: #0a66c2 background, white text, rounded-2xl, p-4 */}
            <button
              type="button"
              onClick={() => handleOAuthSignup("linkedin_oidc")}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0a66c2] p-4 text-body font-bold text-[var(--primitive-neutral-0)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <LinkedinLogo size={24} weight="fill" />
              Sign in with LinkedIn
            </button>
          </div>

          {/* Or Divider — Figma: neutral-300 line, "Or" in neutral-500, bold caption */}
          <div className="flex items-center gap-2.5">
            <div className="h-px flex-1 bg-[var(--border-muted)]" />
            <span className="text-caption font-bold text-[var(--foreground-subtle)]">Or</span>
            <div className="h-px flex-1 bg-[var(--border-muted)]" />
          </div>

          {/* Email Form Fields */}
          <form onSubmit={handleEmailSignup} className="flex flex-col gap-4">
            {/* First Name + Last Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="firstName"
                  className="text-caption font-medium text-[var(--primitive-neutral-900)]"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Usman"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="lastName"
                  className="text-caption font-medium text-[var(--primitive-neutral-900)]"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="i.e. Appleseed"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-caption font-medium text-[var(--primitive-neutral-900)]"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && <InputMessage status="error">{error}</InputMessage>}

            {/* Sign Up Button — Figma: primary, full width, large */}
            <Button type="submit" className="w-full" size="lg" loading={loading} disabled={loading}>
              Sign Up
            </Button>
          </form>
        </div>

        {/* Terms */}
        <p className="text-center text-caption-sm text-[var(--foreground-muted)]">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-[var(--foreground-brand)]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-[var(--foreground-brand)]">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

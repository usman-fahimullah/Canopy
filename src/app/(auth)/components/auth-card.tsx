"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, InputMessage } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { createClient } from "@/lib/supabase/client";
import { EnvelopeSimple, ArrowLeft } from "@phosphor-icons/react";
import { GoogleIcon, LinkedInIcon } from "@/components/brand/oauth-icons";
import { OtpInput } from "../signup/components/otp-input";
import {
  isValidOtpFormat,
  canResendOtp,
  getResendCooldownRemaining,
  getOtpErrorMessage,
  formatCooldownTime,
} from "@/lib/auth/otp-utils";

type AuthMode = "signup" | "login";

/**
 * Shared auth card with SegmentedController that switches between
 * Sign Up and Log In forms in-place with a crossfade transition.
 *
 * Both /signup and /login pages render this component. Tab switching
 * uses shallow URL replacement (no full page navigation) so the
 * SegmentedController pill slides and the content crossfades smoothly.
 */
export function AuthCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Determine initial mode from URL
  const initialMode: AuthMode = pathname === "/login" ? "login" : "signup";
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Track which content is visible for crossfade
  const [displayMode, setDisplayMode] = useState<AuthMode>(initialMode);
  const [transitioning, setTransitioning] = useState(false);

  // Signup state
  const [signupStep, setSignupStep] = useState<"signup" | "verify">("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  // OTP state
  const [otpCode, setOtpCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [lastResendTime, setLastResendTime] = useState<number | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Intent from URL (preserved for after auth)
  const intent = searchParams.get("intent");
  const redirect = searchParams.get("redirect") || "/auth/redirect";

  // Sync mode from URL on initial load / browser back/forward
  useEffect(() => {
    const urlMode: AuthMode = pathname === "/login" ? "login" : "signup";
    if (urlMode !== mode) {
      setMode(urlMode);
      setDisplayMode(urlMode);
    }
    // Only sync on pathname changes (browser navigation)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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

  // ─── Tab switching with crossfade ───
  const handleModeChange = (newMode: string) => {
    if (newMode === mode) return;
    const targetMode = newMode as AuthMode;

    // Start crossfade: fade out current content
    setTransitioning(true);

    // After fade-out, swap content and fade in
    setTimeout(() => {
      setMode(targetMode);
      setDisplayMode(targetMode);

      // Update URL without full navigation
      const newPath = targetMode === "login" ? "/login" : "/signup";
      window.history.replaceState(null, "", newPath);

      // Fade in
      requestAnimationFrame(() => {
        setTransitioning(false);
      });
    }, 150); // Match the CSS transition duration
  };

  // ─── Signup handlers ───
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!firstName.trim()) {
      setSignupError("First name is required");
      return;
    }

    if (!signupEmail.trim()) {
      setSignupError("Email is required");
      return;
    }

    setSignupLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: crypto.randomUUID() + "Aa1!",
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
        setSignupError(error.message);
        return;
      }

      setSignupStep("verify");
      setLastResendTime(Date.now());
      setResendCooldown(60);
    } catch {
      setSignupError("An unexpected error occurred. Please try again.");
    } finally {
      setSignupLoading(false);
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
        email: signupEmail,
        token: otpCode,
        type: "signup",
      });

      if (error) {
        setVerifyError(getOtpErrorMessage(error.message));
        return;
      }

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
        email: signupEmail,
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
    setSignupStep("signup");
    setOtpCode("");
    setVerifyError(null);
  };

  const handleOAuthSignup = async (provider: "google" | "linkedin_oidc") => {
    setSignupError(null);
    setSignupLoading(true);

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
        setSignupError(error.message);
        setSignupLoading(false);
      }
    } catch {
      setSignupError("An unexpected error occurred. Please try again.");
      setSignupLoading(false);
    }
  };

  // ─── Login handlers ───
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        setLoginError(error.message);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "linkedin_oidc") => {
    setLoginError(null);
    setLoginLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      });

      if (error) {
        setLoginError(error.message);
        setLoginLoading(false);
      }
    } catch {
      setLoginError("An unexpected error occurred. Please try again.");
      setLoginLoading(false);
    }
  };

  // ─── OTP Verification view ───
  if (signupStep === "verify" && mode === "signup") {
    const canResend = canResendOtp(lastResendTime, resendCount);
    const maxResendsReached = resendCount >= 5;

    return (
      <div className="rounded-3xl bg-[var(--card-background)] px-8 py-8 shadow-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
            <EnvelopeSimple className="h-8 w-8 text-[var(--primitive-green-600)]" weight="bold" />
          </div>
          <h1 className="mb-2 text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
            Check your email
          </h1>
          <p className="text-body-sm text-[var(--foreground-muted)]">
            We sent a 6-digit code to <strong>{signupEmail}</strong>
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

  // ─── Main auth card with tabs ───
  return (
    <div className="rounded-3xl bg-[var(--card-background)] px-8 py-8 shadow-card">
      <div className="flex flex-col items-center gap-6">
        {/* Segmented Controller — stays static, content below transitions */}
        <SegmentedController
          options={[
            { value: "signup", label: "Sign Up" },
            { value: "login", label: "Log In" },
          ]}
          value={mode}
          onValueChange={handleModeChange}
          className="w-[343px]"
          aria-label="Authentication mode"
        />

        {/* Content area with crossfade transition */}
        <div
          className="w-full transition-opacity duration-150 ease-out"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          {displayMode === "signup" ? (
            <SignupForm
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={signupEmail}
              setEmail={setSignupEmail}
              error={signupError}
              loading={signupLoading}
              onSubmit={handleEmailSignup}
              onOAuth={handleOAuthSignup}
              intent={intent}
            />
          ) : (
            <LoginForm
              email={loginEmail}
              setEmail={setLoginEmail}
              password={password}
              setPassword={setPassword}
              error={loginError}
              loading={loginLoading}
              onSubmit={handleEmailLogin}
              onOAuth={handleOAuthLogin}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Signup Form (inner) ───

function SignupForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  error,
  loading,
  onSubmit,
  onOAuth,
  intent,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onOAuth: (provider: "google" | "linkedin_oidc") => void;
  intent: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Heading */}
      <h1 className="text-center text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
        Sign up to Green Jobs Board
      </h1>

      {/* Form */}
      <div className="flex w-full flex-col gap-6">
        {/* OAuth Buttons */}
        <OAuthButtons loading={loading} onOAuth={onOAuth} />

        {/* Or Divider */}
        <OrDivider />

        {/* Email Form Fields */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* First Name + Last Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="signup-firstName"
                className="text-caption font-medium text-[var(--primitive-neutral-900)]"
              >
                First Name
              </label>
              <Input
                id="signup-firstName"
                type="text"
                placeholder="Usman"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="signup-lastName"
                className="text-caption font-medium text-[var(--primitive-neutral-900)]"
              >
                Last Name
              </label>
              <Input
                id="signup-lastName"
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
              htmlFor="signup-email"
              className="text-caption font-medium text-[var(--primitive-neutral-900)]"
            >
              Email Address
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && <InputMessage status="error">{error}</InputMessage>}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[var(--button-primary-background)] p-4 text-body font-bold text-[var(--button-primary-foreground)] transition-all hover:bg-[var(--button-primary-background-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:bg-[var(--button-primary-background-active)] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Signing up…
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
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
  );
}

// ─── Login Form (inner) ───

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  onOAuth,
}: {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onOAuth: (provider: "google" | "linkedin_oidc") => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Heading */}
      <h1 className="text-center text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
        Log in to Green Jobs Board
      </h1>

      {/* Form */}
      <div className="flex w-full flex-col gap-6">
        {/* OAuth Buttons */}
        <OAuthButtons loading={loading} onOAuth={onOAuth} />

        {/* Or Divider */}
        <OrDivider />

        {/* Email/Password Form */}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-email"
              className="text-caption font-medium text-[var(--primitive-neutral-900)]"
            >
              Email Address
            </label>
            <Input
              id="login-email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="login-password"
                className="text-caption font-medium text-[var(--primitive-neutral-900)]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-caption-sm font-medium text-[var(--foreground-brand)] hover:text-[var(--foreground-brand-emphasis)]"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <InputMessage status="error">{error}</InputMessage>}

          {/* Log In Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[var(--button-primary-background)] p-4 text-body font-bold text-[var(--button-primary-foreground)] transition-all hover:bg-[var(--button-primary-background-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:bg-[var(--button-primary-background-active)] disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Logging in…
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Shared sub-components ───

function OAuthButtons({
  loading,
  onOAuth,
}: {
  loading: boolean;
  onOAuth: (provider: "google" | "linkedin_oidc") => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Google */}
      <button
        type="button"
        onClick={() => onOAuth("google")}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[var(--primitive-neutral-900)] p-4 text-body font-bold text-[var(--primitive-neutral-0)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      >
        <GoogleIcon size={24} />
        Sign in with Google
      </button>

      {/* LinkedIn — One-off hex: LinkedIn brand color, no design system token */}
      <button
        type="button"
        onClick={() => onOAuth("linkedin_oidc")}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[#0a66c2] p-4 text-body font-bold text-[var(--primitive-neutral-0)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      >
        <LinkedInIcon size={24} />
        Sign in with LinkedIn
      </button>
    </div>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-px flex-1 bg-[var(--border-muted)]" />
      <span className="text-caption font-bold text-[var(--foreground-subtle)]">Or</span>
      <div className="h-px flex-1 bg-[var(--border-muted)]" />
    </div>
  );
}

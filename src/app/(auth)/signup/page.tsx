"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { EnvelopeSimple, Lock, User, GoogleLogo, LinkedinLogo } from "@phosphor-icons/react";

type AccountType = "mentee" | "coach";

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<"type" | "details">("type");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep("details");
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
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
          redirectTo: `${window.location.origin}/auth/callback?type=${accountType}`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--primitive-green-100)] rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeSimple className="w-8 h-8 text-[var(--primitive-green-600)]" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
            Check your email
          </h1>
          <p className="text-[var(--primitive-neutral-600)] mb-6">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
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
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
            Join Candid
          </h1>
          <p className="text-[var(--primitive-neutral-600)]">
            How would you like to participate?
          </p>
        </div>

        <div className="space-y-4">
          {/* Mentee option */}
          <button
            onClick={() => handleTypeSelect("mentee")}
            className="w-full p-6 rounded-xl border-2 border-[var(--primitive-neutral-200)] hover:border-[var(--primitive-green-600)] hover:bg-[var(--primitive-green-100)] transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--primitive-green-100)] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[var(--primitive-green-200)]">
                <User className="w-6 h-6 text-[var(--primitive-green-700)]" weight="bold" />
              </div>
              <div>
                <h3 className="font-bold text-[var(--primitive-green-800)] mb-1">
                  I&apos;m looking for guidance
                </h3>
                <p className="text-sm text-[var(--primitive-neutral-600)]">
                  Connect with coaches and mentors to accelerate your climate career transition
                </p>
              </div>
            </div>
          </button>

          {/* Coach option */}
          <button
            onClick={() => handleTypeSelect("coach")}
            className="w-full p-6 rounded-xl border-2 border-[var(--primitive-neutral-200)] hover:border-[var(--primitive-green-600)] hover:bg-[var(--primitive-green-100)] transition-all text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--primitive-blue-100)] rounded-full flex items-center justify-center shrink-0 group-hover:bg-[var(--primitive-blue-200)]">
                <svg className="w-6 h-6 text-[var(--primitive-blue-700)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[var(--primitive-green-800)] mb-1">
                  I want to coach others
                </h3>
                <p className="text-sm text-[var(--primitive-neutral-600)]">
                  Share your expertise and help career changers transition into climate work
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-[var(--primitive-neutral-600)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--primitive-green-600)] hover:text-[var(--primitive-green-700)] font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  // Details form
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
          Create your account
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">
          {accountType === "mentee"
            ? "Start your climate career journey"
            : "Apply to become a coach"}
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthSignup("google")}
          disabled={loading}
          leftIcon={<GoogleLogo weight="bold" className="w-5 h-5" />}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthSignup("linkedin_oidc")}
          disabled={loading}
          leftIcon={<LinkedinLogo weight="bold" className="w-5 h-5" />}
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
          <span className="px-4 bg-white text-[var(--primitive-neutral-600)]">
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
          <label htmlFor="password" className="text-sm font-medium text-[var(--primitive-green-800)]">
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
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--primitive-green-800)]">
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

        {error && (
          <InputMessage status="error">{error}</InputMessage>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          {accountType === "mentee" ? "Create account" : "Apply to coach"}
        </Button>
      </form>

      {/* Back button */}
      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => setStep("type")}
        >
          ← Back to account type
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

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, InputMessage } from "@/components/ui/input";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon, LinkedInIcon } from "@/components/brand/oauth-icons";

/**
 * Log In page — mirrors the Sign Up design with SegmentedController toggle.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-3xl bg-[var(--card-background)] shadow-[var(--shadow-card)]" />
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/auth/redirect";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "linkedin_oidc") => {
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
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

  return (
    <div className="rounded-3xl bg-[var(--card-background)] px-8 py-8 shadow-[var(--shadow-card)]">
      <div className="flex flex-col items-center gap-6">
        {/* Segmented Controller: Sign Up / Log In — Figma: each tab 167.5px */}
        <SegmentedController
          options={[
            { value: "signup", label: "Sign Up" },
            { value: "login", label: "Log In" },
          ]}
          value="login"
          onValueChange={(val) => {
            if (val === "signup") router.push("/signup");
          }}
          className="w-[343px]"
          aria-label="Authentication mode"
        />

        {/* Heading */}
        <h1 className="text-center text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
          Log in to Green Jobs Board
        </h1>

        {/* Form */}
        <div className="flex w-full flex-col gap-6">
          {/* OAuth Buttons — Figma: rounded-[16px], p-16, gap-8, full width */}
          <div className="flex flex-col gap-3">
            {/* Google — Figma: black bg, white text, multicolor G icon */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[var(--primitive-neutral-900)] p-4 text-body font-bold text-[var(--primitive-neutral-0)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <GoogleIcon size={24} />
              Sign in with Google
            </button>

            {/* LinkedIn — Figma: #0a66c2 bg, white text, white "in" icon
                One-off hex: LinkedIn brand color, no design system token */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("linkedin_oidc")}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-2xl)] bg-[#0a66c2] p-4 text-body font-bold text-[var(--primitive-neutral-0)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primitive-green-500)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
            >
              <LinkedInIcon size={24} />
              Sign in with LinkedIn
            </button>
          </div>

          {/* Or Divider */}
          <div className="flex items-center gap-2.5">
            <div className="h-px flex-1 bg-[var(--border-muted)]" />
            <span className="text-caption font-bold text-[var(--foreground-subtle)]">Or</span>
            <div className="h-px flex-1 bg-[var(--border-muted)]" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
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
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
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
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <InputMessage status="error">{error}</InputMessage>}

            {/* Log In Button — Figma: g800 bg, b100 text, rounded-16, p-16, full width */}
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
    </div>
  );
}

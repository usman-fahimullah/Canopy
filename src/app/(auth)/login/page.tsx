"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { EnvelopeSimple, Lock, GoogleLogo, LinkedinLogo } from "@phosphor-icons/react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/candid/dashboard";

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
    } catch (err) {
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
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
          Welcome back
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">
          Sign in to continue your climate career journey
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("google")}
          disabled={loading}
          leftIcon={<GoogleLogo weight="bold" className="w-5 h-5" />}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin("linkedin_oidc")}
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
      <form onSubmit={handleEmailLogin} className="space-y-4">
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
            error={!!error}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[var(--primitive-green-800)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--primitive-green-600)] hover:text-[var(--primitive-green-700)] font-medium"
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
            leftAddon={<Lock weight="bold" />}
            required
            autoComplete="current-password"
            error={!!error}
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
          Sign in
        </Button>
      </form>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm text-[var(--primitive-neutral-600)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[var(--primitive-green-600)] hover:text-[var(--primitive-green-700)] font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { EnvelopeSimple, ArrowLeft } from "@phosphor-icons/react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
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

  // Success state
  if (success) {
    return (
      <div className="bg-[var(--card-background)] rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
        <div className="text-center">
          <div className="w-16 h-16 bg-[var(--primitive-green-100)] rounded-full flex items-center justify-center mx-auto mb-4">
            <EnvelopeSimple className="w-8 h-8 text-[var(--primitive-green-600)]" weight="bold" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
            Check your email
          </h1>
          <p className="text-[var(--primitive-neutral-600)] mb-6">
            We&apos;ve sent password reset instructions to <strong>{email}</strong>.
          </p>
          <div className="space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                setSuccess(false);
                setEmail("");
              }}
            >
              Try another email
            </Button>
            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-background)] rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
          Forgot your password?
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">
          Enter your email and we&apos;ll send you instructions to reset it
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {error && (
          <InputMessage status="error">{error}</InputMessage>
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Send reset instructions
        </Button>
      </form>

      {/* Back to login */}
      <div className="mt-6">
        <Link href="/login">
          <Button variant="ghost" className="w-full" leftIcon={<ArrowLeft weight="bold" />}>
            Back to sign in
          </Button>
        </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Lock, CheckCircle } from "@phosphor-icons/react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({
        password,
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
      <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
            <CheckCircle className="h-8 w-8 text-[var(--primitive-green-600)]" weight="bold" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[var(--primitive-green-800)]">
            Password updated
          </h1>
          <p className="mb-6 text-[var(--primitive-neutral-600)]">
            Your password has been successfully reset. You can now sign in with your new password.
          </p>
          <Button className="w-full" onClick={() => router.push("/jobs")}>
            Go to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-[var(--primitive-green-800)]">
          Set new password
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--primitive-green-800)]"
          >
            New password
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
            Confirm new password
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
          Update password
        </Button>
      </form>
    </div>
  );
}

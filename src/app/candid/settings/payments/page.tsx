"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Warning,
  Bank,
  CurrencyDollar,
  ArrowRight,
  ShieldCheck
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

interface StripeStatus {
  connected: boolean;
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
}

export default function PaymentSettingsPage() {
  return (
    <Suspense fallback={<div className="p-8"><div className="max-w-2xl mx-auto animate-pulse space-y-4"><div className="h-8 bg-[var(--primitive-neutral-200)] rounded w-1/3" /><div className="h-4 bg-[var(--primitive-neutral-200)] rounded w-2/3" /><div className="h-48 bg-[var(--primitive-neutral-200)] rounded" /></div></div>}>
      <PaymentSettingsContent />
    </Suspense>
  );
}

function PaymentSettingsContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const refresh = searchParams.get("refresh");

  const [status, setStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStripeStatus();
  }, []);

  const fetchStripeStatus = async () => {
    try {
      const response = await fetch("/api/stripe/connect");
      const data = await response.json();

      if (response.ok) {
        setStatus(data);
      } else {
        setError(data.error || "Failed to fetch payment status");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectStripe = async () => {
    setConnecting(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start Stripe setup");
        setConnecting(false);
      }
    } catch (err) {
      setError("Failed to connect to server");
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--primitive-neutral-200)] rounded w-1/3" />
            <div className="h-4 bg-[var(--primitive-neutral-200)] rounded w-2/3" />
            <div className="h-48 bg-[var(--primitive-neutral-200)] rounded" />
          </div>
        </div>
      </div>
    );
  }

  const isFullySetup = status?.connected && status?.onboardingComplete && status?.payoutsEnabled;

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
            Payment Settings
          </h1>
          <p className="text-[var(--primitive-neutral-600)]">
            Set up your payment account to receive earnings from coaching sessions.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-[var(--primitive-green-50)] border border-[var(--primitive-green-200)] rounded-xl flex items-start gap-3">
            <CheckCircle size={24} className="text-[var(--primitive-green-600)] shrink-0" />
            <div>
              <p className="font-medium text-[var(--primitive-green-800)]">
                Payment account connected!
              </p>
              <p className="text-sm text-[var(--primitive-green-700)]">
                You can now receive payments for your coaching sessions.
              </p>
            </div>
          </div>
        )}

        {/* Refresh/Continue Message */}
        {refresh && !isFullySetup && (
          <div className="mb-6 p-4 bg-[var(--primitive-yellow-50)] border border-[var(--primitive-yellow-200)] rounded-xl flex items-start gap-3">
            <Warning size={24} className="text-[var(--primitive-yellow-600)] shrink-0" />
            <div>
              <p className="font-medium text-[var(--primitive-yellow-800)]">
                Setup incomplete
              </p>
              <p className="text-sm text-[var(--primitive-yellow-700)]">
                Please continue setting up your payment account to receive earnings.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-[var(--primitive-red-50)] border border-[var(--primitive-red-200)] rounded-xl">
            <p className="text-[var(--primitive-red-600)]">{error}</p>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-[var(--card-background)] border border-[var(--primitive-neutral-200)] rounded-2xl overflow-hidden mb-6">
          {/* Status Header */}
          <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isFullySetup
                    ? "bg-[var(--primitive-green-100)]"
                    : "bg-[var(--primitive-neutral-100)]"
                }`}>
                  <Bank size={24} className={
                    isFullySetup
                      ? "text-[var(--primitive-green-600)]"
                      : "text-[var(--primitive-neutral-600)]"
                  } />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--primitive-green-800)]">
                    Stripe Connect
                  </h2>
                  <p className="text-sm text-[var(--primitive-neutral-600)]">
                    {isFullySetup ? "Connected and ready" : "Set up to receive payments"}
                  </p>
                </div>
              </div>
              {isFullySetup && (
                <div className="flex items-center gap-2 text-[var(--primitive-green-600)]">
                  <CheckCircle size={20} weight="fill" />
                  <span className="text-sm font-medium">Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Status Details */}
          <div className="p-6">
            {!status?.connected ? (
              <div className="text-center py-4">
                <p className="text-[var(--primitive-neutral-600)] mb-4">
                  Connect your Stripe account to start receiving payments from mentees.
                </p>
                <Button
                  onClick={handleConnectStripe}
                  loading={connecting}
                  disabled={connecting}
                  leftIcon={<ArrowRight size={18} />}
                >
                  Set Up Payments
                </Button>
              </div>
            ) : !isFullySetup ? (
              <div className="text-center py-4">
                <p className="text-[var(--primitive-neutral-600)] mb-4">
                  Complete your Stripe account setup to start receiving payments.
                </p>
                <Button
                  onClick={handleConnectStripe}
                  loading={connecting}
                  disabled={connecting}
                  leftIcon={<ArrowRight size={18} />}
                >
                  Continue Setup
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-[var(--primitive-neutral-600)]">Account Status</span>
                  <span className="flex items-center gap-2 text-[var(--primitive-green-600)]">
                    <CheckCircle size={16} weight="fill" />
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[var(--primitive-neutral-600)]">Payouts</span>
                  <span className="flex items-center gap-2 text-[var(--primitive-green-600)]">
                    <CheckCircle size={16} weight="fill" />
                    Enabled
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-[var(--primitive-neutral-600)]">Charges</span>
                  <span className="flex items-center gap-2 text-[var(--primitive-green-600)]">
                    <CheckCircle size={16} weight="fill" />
                    Enabled
                  </span>
                </div>
                <div className="pt-4 border-t border-[var(--primitive-neutral-200)]">
                  <Button
                    variant="secondary"
                    onClick={handleConnectStripe}
                    loading={connecting}
                  >
                    Update Payment Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-[var(--primitive-neutral-50)] rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CurrencyDollar size={20} className="text-[var(--primitive-green-600)]" />
              <span className="font-medium text-[var(--primitive-green-800)]">Platform Fee</span>
            </div>
            <p className="text-sm text-[var(--primitive-neutral-600)]">
              Candid charges an 18% platform fee on each session. You receive 82% of your session rate.
            </p>
          </div>

          <div className="p-4 bg-[var(--primitive-neutral-50)] rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={20} className="text-[var(--primitive-green-600)]" />
              <span className="font-medium text-[var(--primitive-green-800)]">Secure Payments</span>
            </div>
            <p className="text-sm text-[var(--primitive-neutral-600)]">
              All payments are processed securely through Stripe. Your banking info is never stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

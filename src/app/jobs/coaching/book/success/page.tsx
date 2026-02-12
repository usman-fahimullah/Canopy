"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, CalendarDots, Envelope, ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import { Button, Card, CardContent } from "@/components/ui";

// ---------------------------------------------------------------------------
// Booking Success Page
// ---------------------------------------------------------------------------

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  return (
    <div>
      <PageHeader title="Booking Confirmed" />

      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-12">
        {/* Success Icon & Message */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-success)]">
            <CheckCircle size={40} weight="fill" className="text-[var(--foreground-success)]" />
          </div>
          <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
            Session Booked!
          </h1>
          <p className="mt-2 text-body-sm text-[var(--foreground-muted)]">
            Your coaching session has been confirmed. You&apos;re all set!
          </p>
        </div>

        {/* What's Next Card */}
        <Card className="mb-6">
          <CardContent className="space-y-4 p-5">
            <h2 className="text-body-strong font-semibold text-[var(--foreground-default)]">
              What happens next
            </h2>

            <div className="flex items-start gap-3">
              <Envelope size={20} className="mt-0.5 text-[var(--foreground-brand)]" />
              <div>
                <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                  Confirmation email sent
                </p>
                <p className="text-caption text-[var(--foreground-muted)]">
                  Check your inbox for session details and meeting link.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDots size={20} className="mt-0.5 text-[var(--foreground-brand)]" />
              <div>
                <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                  Calendar invite
                </p>
                <p className="text-caption text-[var(--foreground-muted)]">
                  A calendar invite has been added to your schedule. Reminders will be sent 24 hours
                  and 1 hour before the session.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preparation tips */}
        <Card className="mb-8">
          <CardContent className="space-y-3 p-5">
            <h2 className="text-body-strong font-semibold text-[var(--foreground-default)]">
              Prepare for your session
            </h2>
            <ul className="space-y-2 text-body-sm text-[var(--foreground-muted)]">
              <li className="flex items-start gap-2">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--foreground-success)]"
                />
                Write down your goals and questions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--foreground-success)]"
                />
                Have your resume or portfolio ready to share
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--foreground-success)]"
                />
                Find a quiet space with a stable internet connection
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle
                  size={16}
                  weight="fill"
                  className="mt-0.5 shrink-0 text-[var(--foreground-success)]"
                />
                Test your camera and microphone before the session
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => router.push("/jobs/coaching")}
          >
            View My Sessions
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => router.push("/jobs/dashboard")}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, CalendarCheck, VideoCamera, ArrowRight } from "@phosphor-icons/react";

interface SessionDetails {
  coachName: string;
  date: string;
  time: string;
  duration: number;
  videoLink?: string;
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primitive-green-600)] border-t-transparent" /></div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch session details from API using sessionId
    // For now, show a generic success message
    setLoading(false);
    setSessionDetails({
      coachName: "Your Coach",
      date: "Soon",
      time: "",
      duration: 60,
    });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primitive-green-600)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-50)] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--primitive-neutral-200)] max-w-lg w-full p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-[var(--primitive-green-100)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} weight="fill" className="text-[var(--primitive-green-600)]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-2">
          Session Booked!
        </h1>
        <p className="text-[var(--primitive-neutral-600)] mb-8">
          Your coaching session has been confirmed. You&apos;ll receive a confirmation email shortly.
        </p>

        {/* Session Details */}
        <div className="bg-[var(--primitive-neutral-50)] rounded-xl p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CalendarCheck size={24} className="text-[var(--primitive-green-600)]" />
              <div className="text-left">
                <p className="text-sm text-[var(--primitive-neutral-600)]">Date & Time</p>
                <p className="font-medium">Check your email for session details</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <VideoCamera size={24} className="text-[var(--primitive-green-600)]" />
              <div className="text-left">
                <p className="text-sm text-[var(--primitive-neutral-600)]">Video Call</p>
                <p className="font-medium">Link will be in your dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="text-left mb-8">
          <h2 className="font-semibold text-[var(--primitive-green-800)] mb-3">
            What&apos;s Next?
          </h2>
          <ul className="space-y-2 text-sm text-[var(--primitive-neutral-600)]">
            <li className="flex items-start gap-2">
              <ArrowRight size={16} className="mt-0.5 text-[var(--primitive-green-600)]" />
              Check your email for confirmation and calendar invite
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight size={16} className="mt-0.5 text-[var(--primitive-green-600)]" />
              Prepare any questions or topics you want to discuss
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight size={16} className="mt-0.5 text-[var(--primitive-green-600)]" />
              Join the video call 5 minutes before your session starts
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/candid/sessions">
            <Button className="w-full">
              View My Sessions
            </Button>
          </Link>
          <Link href="/candid/dashboard">
            <Button variant="secondary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

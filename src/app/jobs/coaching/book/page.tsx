"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import { Button, Spinner } from "@/components/ui";
import { BookingWizard } from "@/components/coaching";
import type { BookingData, Coach, AvailableSlot } from "@/lib/coaching";
import { logger, formatError } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BookSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCoachId = searchParams.get("coach") ?? undefined;

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

  // ---- Fetch coaches ----
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch("/api/coaches");
        const data = res.ok ? await res.json() : { coaches: [] };
        setCoaches(data.coaches || []);
      } catch (error) {
        logger.error("Error fetching coaches", {
          error: formatError(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // ---- Fetch availability for a coach + date ----
  const handleFetchAvailability = useCallback(
    async (coachId: string, date: Date): Promise<AvailableSlot[]> => {
      try {
        const dateStr = date.toISOString().split("T")[0];
        const res = await fetch(`/api/availability?coachId=${coachId}&date=${dateStr}`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.slots || [];
      } catch (error) {
        logger.error("Error fetching availability", {
          error: formatError(error),
        });
        return [];
      }
    },
    []
  );

  // ---- Submit booking ----
  const handleBook = useCallback(async (booking: BookingData): Promise<{ sessionId: string }> => {
    const res = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Failed to create session. Please try again.");
    }

    const data = await res.json();
    return { sessionId: data.session?.id || data.id || "new" };
  }, []);

  // ---- Success handler ----
  const handleSuccess = useCallback(
    (sessionId: string) => {
      router.push(`/jobs/coaching/book/success?session=${sessionId}`);
    },
    [router]
  );

  // ---- Cancel handler ----
  const handleCancel = useCallback(() => {
    router.push("/jobs/coaching");
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Book a Session"
        actions={
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft size={16} className="mr-1" />
            Back to Coaching
          </Button>
        }
      />

      <div className="px-8 py-8 lg:px-12">
        <BookingWizard
          coaches={coaches}
          initialCoachId={initialCoachId}
          onFetchAvailability={handleFetchAvailability}
          onBook={handleBook}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

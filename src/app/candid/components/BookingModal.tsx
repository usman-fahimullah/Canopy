"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Clock, CurrencyDollar, X } from "@phosphor-icons/react";
import { formatCurrency, PLATFORM_FEE_PERCENT } from "@/lib/stripe";

interface Coach {
  id: string;
  name: string;
  avatar?: string;
  headline?: string;
  sessionRate: number;
  sessionDuration: number;
}

interface AvailableSlot {
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingModalProps {
  coach: Coach;
  onClose: () => void;
}

export function BookingModal({ coach, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);

  // Fetch real available slots from the API
  useEffect(() => {
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const from = new Date();
        const to = new Date();
        to.setDate(to.getDate() + 14);

        const res = await fetch(
          `/api/availability/${coach.id}/slots?from=${from.toISOString().split("T")[0]}&to=${to.toISOString().split("T")[0]}`
        );

        if (res.ok) {
          const data = await res.json();
          setSlots(data.slots || []);
        } else {
          setSlots([]);
        }
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [coach.id]);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const grouped = new Map<string, AvailableSlot[]>();
    for (const slot of slots) {
      if (!grouped.has(slot.date)) {
        grouped.set(slot.date, []);
      }
      const dateSlots = grouped.get(slot.date);
      if (dateSlots) dateSlots.push(slot);
    }
    return grouped;
  }, [slots]);

  const availableDates = useMemo(() => {
    return Array.from(slotsByDate.keys()).sort();
  }, [slotsByDate]);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    return (slotsByDate.get(selectedDate) || []).map((s) => s.startTime);
  }, [selectedDate, slotsByDate]);

  // Reset time when date changes
  useEffect(() => {
    setSelectedTime("");
  }, [selectedDate]);

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and time");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionDate = new Date(`${selectedDate}T${selectedTime}:00`);

      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId: coach.id,
          sessionDate: sessionDate.toISOString(),
          sessionDuration: coach.sessionDuration,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const platformFee = Math.round(coach.sessionRate * (PLATFORM_FEE_PERCENT / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-[var(--background-default)] rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--primitive-neutral-200)]">
          <h2 className="text-xl font-bold text-[var(--primitive-green-800)]">
            Book a Session
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--primitive-neutral-100)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Coach Info */}
        <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
          <div className="flex items-center gap-4">
            <Avatar size="lg" src={coach.avatar} name={coach.name} color="green" />
            <div>
              <h3 className="font-semibold text-[var(--primitive-green-800)]">{coach.name}</h3>
              <p className="text-sm text-[var(--primitive-neutral-600)]">{coach.headline}</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--primitive-green-800)] mb-3">
            <Calendar size={18} />
            Select Date
          </label>

          {slotsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : availableDates.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {availableDates.slice(0, 8).map((date) => {
                const d = new Date(date + "T12:00:00");
                const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = d.getDate();
                const monthName = d.toLocaleDateString("en-US", { month: "short" });

                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedDate === date
                        ? "border-[var(--primitive-green-600)] bg-[var(--primitive-green-50)]"
                        : "border-[var(--primitive-neutral-200)] hover:border-[var(--primitive-neutral-300)]"
                    }`}
                  >
                    <div className="text-xs text-[var(--primitive-neutral-600)]">{dayName}</div>
                    <div className="text-lg font-semibold">{dayNum}</div>
                    <div className="text-xs text-[var(--primitive-neutral-500)]">{monthName}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-[var(--primitive-neutral-500)] py-4">
              No available dates in the next 2 weeks
            </p>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--primitive-green-800)] mb-3">
              <Clock size={18} />
              Select Time
            </label>
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedTime === time
                        ? "border-[var(--primitive-green-600)] bg-[var(--primitive-green-50)]"
                        : "border-[var(--primitive-neutral-200)] hover:border-[var(--primitive-neutral-300)]"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-[var(--primitive-neutral-500)] py-4">
                No available times for this date
              </p>
            )}
          </div>
        )}

        {/* Pricing */}
        <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--primitive-green-800)] mb-3">
            <CurrencyDollar size={18} />
            Session Details
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--primitive-neutral-600)]">
                {coach.sessionDuration}-minute session
              </span>
              <span className="font-medium">{formatCurrency(coach.sessionRate)}</span>
            </div>
            <div className="flex justify-between text-[var(--primitive-neutral-500)]">
              <span>Platform fee ({PLATFORM_FEE_PERCENT}%)</span>
              <span>{formatCurrency(platformFee)}</span>
            </div>
            <div className="border-t border-[var(--primitive-neutral-200)] pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(coach.sessionRate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-3 bg-[var(--primitive-red-50)] text-[var(--primitive-red-600)] text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <Button
            className="w-full"
            onClick={handleBookSession}
            loading={loading}
            disabled={!selectedDate || !selectedTime || loading}
          >
            Continue to Payment
          </Button>
          <p className="mt-3 text-xs text-center text-[var(--primitive-neutral-500)]">
            You won&apos;t be charged until you complete checkout
          </p>
        </div>
      </div>
    </div>
  );
}

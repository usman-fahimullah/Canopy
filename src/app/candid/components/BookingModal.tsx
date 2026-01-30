"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
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

interface BookingModalProps {
  coach: Coach;
  onClose: () => void;
}

export function BookingModal({ coach, onClose }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock available times - in production, fetch from coach's availability
  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ];

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split("T")[0];
  });

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

      // Redirect to Stripe Checkout
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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
            <Avatar
              size="lg"
              src={coach.avatar}
              name={coach.name}
              color="green"
            />
            <div>
              <h3 className="font-semibold text-[var(--primitive-green-800)]">
                {coach.name}
              </h3>
              <p className="text-sm text-[var(--primitive-neutral-600)]">
                {coach.headline}
              </p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--primitive-green-800)] mb-3">
            <Calendar size={18} />
            Select Date
          </label>
          <div className="grid grid-cols-4 gap-2">
            {availableDates.slice(0, 8).map((date) => {
              const d = new Date(date);
              const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = d.getDate();

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
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--primitive-green-800)] mb-3">
            <Clock size={18} />
            Select Time
          </label>
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
        </div>

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

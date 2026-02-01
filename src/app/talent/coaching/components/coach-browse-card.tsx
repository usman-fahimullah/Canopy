"use client";

import { Star, ChatCircle } from "@phosphor-icons/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CoachBrowseCardProps {
  coach: {
    id: string;
    name: string;
    avatar: string | null;
    headline: string;
    specialties: string[];
    hourlyRate: number;
    currency: string;
    rating: number;
    reviewCount: number;
  };
}

function formatCurrency(amount: number, currency: string) {
  const symbol = currency === "USD" ? "$" : currency;
  return `${symbol}${amount}/hr`;
}

export function CoachBrowseCard({ coach }: CoachBrowseCardProps) {
  return (
    <div className="flex flex-col rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      {/* Top section: avatar + info */}
      <div className="flex items-start gap-4">
        <Avatar
          src={coach.avatar ?? undefined}
          name={coach.name}
          size="lg"
          shape="square"
        />
        <div className="flex-1 min-w-0">
          <p className="text-body font-semibold text-[var(--primitive-green-800)] truncate">
            {coach.name}
          </p>
          <p className="text-caption text-[var(--primitive-neutral-600)] truncate">
            {coach.headline}
          </p>
        </div>
      </div>

      {/* Specialties */}
      {coach.specialties.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {coach.specialties.map((specialty) => (
            <Badge key={specialty} variant="neutral" size="sm">
              {specialty}
            </Badge>
          ))}
        </div>
      )}

      {/* Bottom row: rating + price */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-caption text-[var(--foreground-muted)]">
          <Star
            size={16}
            weight="fill"
            className="text-[var(--primitive-yellow-500)]"
          />
          <span className="font-semibold text-[var(--foreground-default)]">
            {coach.rating.toFixed(1)}
          </span>
          <span>({coach.reviewCount})</span>
        </div>
        <Badge variant="feature" size="sm">
          {formatCurrency(coach.hourlyRate, coach.currency)}
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-center gap-2">
        <Button variant="primary" size="sm" className="flex-1">
          Book Session
        </Button>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ChatCircle size={16} weight="bold" />}
        >
          Message
        </Button>
      </div>
    </div>
  );
}

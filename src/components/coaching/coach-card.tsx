"use client";

import { Star, MapPin, Users } from "@phosphor-icons/react";
import { Avatar, Badge, Button, Card, CardContent, Chip } from "@/components/ui";
import type { Coach, Sector, SECTOR_INFO } from "@/lib/coaching";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CoachCardProps {
  coach: Coach;
  /** Display mode */
  variant?: "grid" | "list";
  /** Whether this card is currently selected (e.g., in booking wizard) */
  selected?: boolean;
  /** Callback when the card is clicked */
  onClick?: (coach: Coach) => void;
  /** Callback for the primary CTA */
  onViewProfile?: (coach: Coach) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getCoachDisplayName(coach: Coach): string {
  return [coach.firstName, coach.lastName].filter(Boolean).join(" ") || "Coach";
}

function formatRate(coach: Coach): string | null {
  const rate = coach.sessionRate ?? coach.hourlyRate;
  if (!rate) return null;
  return `$${rate}/session`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CoachCard({
  coach,
  variant = "grid",
  selected = false,
  onClick,
  onViewProfile,
  className,
}: CoachCardProps) {
  const name = getCoachDisplayName(coach);
  const rate = formatRate(coach);

  if (variant === "list") {
    return (
      <Card
        className={cn(
          "cursor-pointer transition-all",
          selected && "border-[var(--border-brand-emphasis)] bg-[var(--background-brand-subtle)]",
          className
        )}
        onClick={() => onClick?.(coach)}
      >
        <CardContent className="flex items-start gap-4 p-4">
          <Avatar size="lg" src={coach.avatar ?? undefined} fallback={name.charAt(0)} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-body-strong font-semibold text-[var(--foreground-default)]">
                {name}
              </h3>
              {coach.isFeatured && <Badge variant="feature">Top Rated</Badge>}
            </div>

            {coach.headline && (
              <p className="mt-0.5 truncate text-body-sm text-[var(--foreground-muted)]">
                {coach.headline}
              </p>
            )}

            {coach.bio && (
              <p className="mt-1 line-clamp-2 text-caption text-[var(--foreground-subtle)]">
                {coach.bio}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {coach.sectors?.slice(0, 3).map((sector) => (
                <Chip key={sector} variant="neutral" size="sm">
                  {sector.replace(/-/g, " ")}
                </Chip>
              ))}
              {(coach.sectors?.length ?? 0) > 3 && (
                <span className="text-caption text-[var(--foreground-subtle)]">
                  +{(coach.sectors?.length ?? 0) - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {coach.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={14} weight="fill" className="text-[var(--foreground-warning)]" />
                <span className="text-caption-strong font-semibold text-[var(--foreground-default)]">
                  {coach.rating.toFixed(1)}
                </span>
                {coach.reviewCount != null && coach.reviewCount > 0 && (
                  <span className="text-caption text-[var(--foreground-subtle)]">
                    ({coach.reviewCount})
                  </span>
                )}
              </div>
            )}

            {rate && (
              <span className="text-caption-strong font-semibold text-[var(--foreground-brand)]">
                {rate}
              </span>
            )}

            {onViewProfile && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewProfile(coach);
                }}
              >
                View Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-card-hover",
        selected && "border-[var(--border-brand-emphasis)] bg-[var(--background-brand-subtle)]",
        className
      )}
      onClick={() => onClick?.(coach)}
    >
      <CardContent className="flex flex-col items-center p-5 text-center">
        <Avatar size="xl" src={coach.avatar ?? undefined} fallback={name.charAt(0)} />

        <div className="mt-3 flex items-center gap-2">
          <h3 className="text-body-strong font-semibold text-[var(--foreground-default)]">
            {name}
          </h3>
          {coach.isFeatured && <Badge variant="feature">Top Rated</Badge>}
        </div>

        {coach.headline && (
          <p className="mt-1 line-clamp-1 text-body-sm text-[var(--foreground-muted)]">
            {coach.headline}
          </p>
        )}

        {coach.rating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <Star size={14} weight="fill" className="text-[var(--foreground-warning)]" />
            <span className="text-caption-strong font-semibold text-[var(--foreground-default)]">
              {coach.rating.toFixed(1)}
            </span>
            {coach.reviewCount != null && coach.reviewCount > 0 && (
              <span className="text-caption text-[var(--foreground-subtle)]">
                ({coach.reviewCount})
              </span>
            )}
          </div>
        )}

        <div className="mt-2 flex items-center gap-3 text-caption text-[var(--foreground-subtle)]">
          {coach.menteeCount > 0 && (
            <span className="flex items-center gap-1">
              <Users size={14} />
              {coach.menteeCount} mentees
            </span>
          )}
          {coach.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {coach.location}
            </span>
          )}
        </div>

        {rate && (
          <p className="mt-2 text-caption-strong font-semibold text-[var(--foreground-brand)]">
            {rate}
          </p>
        )}

        <div className="mt-3 flex flex-wrap justify-center gap-1">
          {coach.sectors?.slice(0, 2).map((sector) => (
            <Chip key={sector} variant="neutral" size="sm">
              {sector.replace(/-/g, " ")}
            </Chip>
          ))}
        </div>

        {onViewProfile && (
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-full"
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(coach);
            }}
          >
            View Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import {
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Leaf,
} from "@phosphor-icons/react";

interface SaatheStudioCardProps {
  /** Compact version for dashboard widgets */
  variant?: "default" | "compact" | "featured";
  className?: string;
}

/**
 * SaatheStudioCard displays Saathe Studio as Candid's coaching partner.
 * This is the single coaching partner for MVP.
 */
export function SaatheStudioCard({
  variant = "default",
  className,
}: SaatheStudioCardProps) {
  const stats = [
    { label: "Climate transitions", value: "500+" },
    { label: "Avg. time to placement", value: "3 mo" },
    { label: "Client satisfaction", value: "4.9" },
  ];

  const highlights = [
    "1:1 personalized coaching sessions",
    "Resume reviews & interview prep",
    "Job search strategy & networking",
    "Climate sector expertise",
  ];

  if (variant === "compact") {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
            <Leaf size={24} className="text-emerald-700" weight="fill" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-body-strong font-semibold text-foreground-default">
              Saathe Studio
            </h3>
            <p className="text-caption text-foreground-muted">
              Your climate career coaching partner
            </p>
            <div className="mt-2 flex items-center gap-3 text-caption">
              <span className="flex items-center gap-1">
                <Star size={12} weight="fill" className="text-amber-500" />
                <span className="font-medium">4.9</span>
              </span>
              <span className="flex items-center gap-1 text-foreground-muted">
                <Users size={12} />
                500+ transitions
              </span>
            </div>
          </div>
          <Button variant="primary" size="sm" asChild>
            <Link href="/candid/sessions/schedule">
              Book Session
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "relative overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50",
          className
        )}
      >
        {/* Background decoration */}
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-emerald-100/50" />
        <div className="absolute right-12 top-12 h-16 w-16 rounded-full bg-teal-100/50" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Leaf size={32} className="text-white" weight="fill" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-heading-sm font-semibold text-foreground-default">
                  Saathe Studio
                </h3>
                <Chip variant="primary" size="sm">
                  Featured Partner
                </Chip>
              </div>
              <p className="mt-1 text-body text-foreground-muted">
                Climate Career Coaching Experts
              </p>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="mb-6 border-l-2 border-emerald-300 pl-4 text-body italic text-foreground-muted">
            "We help ambitious professionals find their place in the climate solution space."
          </blockquote>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-3 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-heading-sm font-bold text-emerald-700">
                  {stat.value}
                </div>
                <div className="text-caption text-foreground-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Highlights */}
          <div className="mb-6 space-y-2">
            {highlights.map((highlight) => (
              <div key={highlight} className="flex items-center gap-2 text-body-sm">
                <CheckCircle size={16} className="text-emerald-600" weight="fill" />
                <span className="text-foreground-default">{highlight}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button variant="primary" className="w-full" asChild>
            <Link href="/candid/sessions/schedule">
              Book Your First Session
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn("p-6", className)}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100">
          <Leaf size={28} className="text-emerald-700" weight="fill" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-body-strong font-semibold text-foreground-default">
              Saathe Studio
            </h3>
            <Chip variant="primary" size="sm">
              Coaching Partner
            </Chip>
          </div>
          <p className="mt-1 text-caption text-foreground-muted">
            Climate Career Coaching Experts
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 text-body text-foreground-muted">
        Saathe Studio has helped 500+ professionals successfully transition into climate careers.
        Get personalized coaching to accelerate your journey.
      </p>

      {/* Quick stats */}
      <div className="mb-6 flex items-center gap-4 text-caption">
        <span className="flex items-center gap-1">
          <Star size={14} weight="fill" className="text-amber-500" />
          <span className="font-semibold text-foreground-default">4.9</span>
          <span className="text-foreground-muted">rating</span>
        </span>
        <span className="flex items-center gap-1 text-foreground-muted">
          <Users size={14} />
          500+ transitions
        </span>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Button variant="primary" className="flex-1" asChild>
          <Link href="/candid/sessions/schedule">
            Book a Session
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/candid/coach/saathe-studio">
            Learn More
          </Link>
        </Button>
      </div>
    </Card>
  );
}

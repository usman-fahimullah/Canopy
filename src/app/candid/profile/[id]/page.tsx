"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import {
  ArrowLeft,
  Star,
  MapPin,
  CalendarBlank,
  ChatCircle,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Lightning,
  LinkedinLogo,
  Spinner,
} from "@phosphor-icons/react";

interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  currentRole: string;
  currentCompany: string;
  location: string | null;
  linkedIn: string | null;
  expertise: string[];
  sectors: string[];
  rating: number | null;
  reviewCount: number;
  sessionRate: number;
  sessionDuration: number;
  timezone: string | null;
  isFoundingMember: boolean;
  isFeatured: boolean;
  status: string;
}

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const res = await fetch(`/api/coaches/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setCoach(data.coach);
        } else if (res.status === 404) {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching coach:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoach();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} className="animate-spin text-[var(--primitive-green-600)]" />
      </div>
    );
  }

  if (notFound || !coach) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
        <div className="rounded-card bg-white p-12 text-center shadow-card">
          <h2 className="text-foreground-default text-heading-sm font-semibold">
            Profile not found
          </h2>
          <p className="mt-2 text-body text-foreground-muted">
            The user you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button variant="primary" className="mt-4" leftIcon={<ArrowLeft size={16} />} asChild>
            <Link href="/candid/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
      {/* Back Link */}
      <Button variant="ghost" size="sm" className="mb-6" leftIcon={<ArrowLeft size={16} />} asChild>
        <Link href="/candid/browse">Back to Browse</Link>
      </Button>

      {/* Profile Card - White card with shadow */}
      <div className="overflow-hidden rounded-card bg-white shadow-card">
        {/* Header with solid Green 800 background */}
        <div className="relative h-32 bg-[var(--primitive-green-800)]">
          {coach.isFeatured && (
            <Chip variant="yellow" size="sm" className="absolute right-4 top-4">
              <Lightning size={14} weight="fill" className="mr-1" />
              Featured Coach
            </Chip>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <Avatar
              size="xl"
              src={coach.avatar || undefined}
              name={`${coach.firstName} ${coach.lastName}`}
              color="green"
              className="h-32 w-32 border-4 border-white shadow-lg"
            />
            {coach.isFoundingMember && (
              <Chip variant="blue" size="sm" className="absolute -right-2 bottom-2 shadow-sm">
                Founding Member
              </Chip>
            )}
          </div>

          {/* Name & Role */}
          <div className="mb-6">
            <h1 className="text-foreground-default text-heading-md font-semibold">
              {coach.firstName} {coach.lastName}
            </h1>
            <p className="text-body-lg text-foreground-muted">
              {coach.currentRole} at {coach.currentCompany}
            </p>

            {/* Rating & Stats */}
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {coach.rating && (
                <div className="flex items-center gap-1.5">
                  <Star size={16} weight="fill" className="text-[#F59E0B]" />
                  <span className="text-body font-medium">{coach.rating.toFixed(1)}</span>
                  <span className="text-caption text-foreground-muted">
                    ({coach.reviewCount} reviews)
                  </span>
                </div>
              )}
              {coach.location && (
                <div className="flex items-center gap-1.5 text-caption text-foreground-muted">
                  <MapPin size={16} />
                  <span>{coach.location}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="mt-3 flex items-center gap-2">
              {coach.linkedIn && (
                <a
                  href={coach.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-foreground-muted hover:bg-[var(--background-subtle)] hover:text-[#0077b5]"
                >
                  <LinkedinLogo size={20} weight="fill" />
                </a>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-3">
            <Button variant="primary" leftIcon={<CalendarBlank size={18} />} asChild>
              <Link href={`/candid/sessions/schedule?mentor=${coach.id}`}>Schedule Session</Link>
            </Button>
            <Button variant="secondary" leftIcon={<ChatCircle size={18} />} asChild>
              <Link href={`/candid/messages?new=${coach.id}`}>Send Message</Link>
            </Button>
          </div>

          {/* Bio */}
          {coach.bio && (
            <div className="mb-6">
              <h2 className="mb-2 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                About
              </h2>
              <p className="text-foreground-default text-body leading-relaxed">{coach.bio}</p>
            </div>
          )}

          {/* Sectors */}
          {coach.sectors && coach.sectors.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Sectors
              </h2>
              <div className="flex flex-wrap gap-2">
                {coach.sectors.map((sector) => (
                  <Chip key={sector} variant="blue" size="sm">
                    {sector}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Expertise */}
          {coach.expertise && coach.expertise.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {coach.expertise.map((skill) => (
                  <Chip key={skill} variant="neutral" size="sm">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {coach.sessionRate > 0 && (
            <div className="rounded-card bg-[var(--background-subtle)] p-5">
              <h2 className="mb-4 text-caption font-semibold uppercase tracking-wide text-foreground-muted">
                Session Rate
              </h2>
              <div className="rounded-lg bg-white p-4 shadow-card">
                <p className="text-caption text-foreground-muted">
                  Per Session ({coach.sessionDuration} min)
                </p>
                <p className="mt-1 text-heading-sm font-semibold text-[var(--primitive-green-800)]">
                  ${(coach.sessionRate / 100).toFixed(0)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

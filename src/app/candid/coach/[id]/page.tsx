"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { SECTOR_INFO, type Sector } from "@/lib/candid/types";
import { BookingModal } from "../../components/BookingModal";
import {
  ArrowLeft,
  Star,
  MapPin,
  Clock,
  Calendar,
  Users,
  Certificate,
  LinkedinLogo,
  Play,
  Briefcase,
  CurrencyDollar,
  ChatCircle,
  Spinner,
  Warning,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  coachResponse: string | null;
  reviewerName: string;
  createdAt: string;
}

interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  headline: string | null;
  bio: string | null;
  expertise: string[];
  sectors: string[];
  yearsInClimate: number | null;
  sessionRate: number;
  sessionDuration: number;
  videoLink: string | null;
  rating: number | null;
  reviewCount: number;
  totalSessions: number;
  isFeatured: boolean;
  location: string | null;
  timezone: string | null;
  availability: {
    description?: string;
    slots?: { day: string; times: string[] }[];
  } | null;
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          weight={star <= rating ? "fill" : "regular"}
          className={star <= rating ? "text-[var(--primitive-yellow-500)]" : "text-[var(--primitive-neutral-300)]"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-xl bg-[var(--card-background)] p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-medium text-foreground-default">{review.reviewerName}</p>
          <p className="text-caption text-foreground-muted">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <StarRating rating={review.rating} />
      </div>
      {review.comment && (
        <p className="text-body text-foreground-default">{review.comment}</p>
      )}
      {review.coachResponse && (
        <div className="mt-4 pl-4 border-l-2 border-[var(--primitive-green-200)]">
          <p className="text-caption text-foreground-muted mb-1">Coach response:</p>
          <p className="text-caption text-foreground-default">{review.coachResponse}</p>
        </div>
      )}
    </div>
  );
}

export default function CoachProfilePage() {
  const params = useParams();
  const router = useRouter();
  const coachId = params.id as string;

  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [nextAvailable, setNextAvailable] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/coaches/${coachId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Coach not found");
          } else {
            throw new Error("Failed to fetch coach");
          }
          return;
        }
        const data = await response.json();
        setCoach(data.coach);

        // Fetch next available slot
        const from = new Date().toISOString().split("T")[0];
        const to = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        const slotsRes = await fetch(`/api/availability/${coachId}/slots?from=${from}&to=${to}`);
        if (slotsRes.ok) {
          const slotsData = await slotsRes.json();
          if (slotsData.slots?.length > 0) {
            const slot = slotsData.slots[0];
            const slotDate = new Date(`${slot.date}T${slot.startTime}:00`);
            setNextAvailable(slotDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
          }
        }
      } catch (err) {
        logger.error("Error fetching coach", { error: formatError(err) });
        setError("Failed to load coach profile");
      } finally {
        setLoading(false);
      }
    };

    if (coachId) {
      fetchCoach();
    }
  }, [coachId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size={40} className="animate-spin mx-auto text-[var(--primitive-green-600)]" />
          <p className="mt-4 text-body text-foreground-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-red-100)]">
            <Warning size={32} className="text-[var(--primitive-red-600)]" />
          </div>
          <h1 className="text-heading-sm font-semibold text-foreground-default">
            {error || "Coach not found"}
          </h1>
          <p className="mt-2 text-body text-foreground-muted">
            This coach profile may not exist or is no longer available.
          </p>
          <Button variant="primary" className="mt-6" onClick={() => router.push("/candid/browse")}>
            Browse coaches
          </Button>
        </div>
      </div>
    );
  }

  const sessionRateFormatted = `$${(coach.sessionRate / 100).toFixed(0)}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Back Navigation */}
      <Link
        href="/candid/browse"
        className="inline-flex items-center gap-2 text-body text-foreground-muted hover:text-foreground-default mb-6"
      >
        <ArrowLeft size={18} />
        Back to coaches
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Header */}
          <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-card">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-shrink-0">
                <Avatar
                  size="2xl"
                  src={coach.photoUrl || undefined}
                  name={`${coach.firstName} ${coach.lastName}`}
                  color="green"
                  className="ring-4 ring-[var(--primitive-green-100)]"
                />
                {coach.isFeatured && (
                  <div className="absolute -top-2 -right-2">
                    <Chip variant="yellow" size="sm">
                      <Star size={10} weight="fill" className="mr-1" />
                      Featured
                    </Chip>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-heading-md font-semibold text-foreground-default">
                      {coach.firstName} {coach.lastName}
                    </h1>
                    <p className="text-body text-foreground-muted mt-1">
                      {coach.headline}
                    </p>
                  </div>
                  <Certificate size={24} weight="fill" className="text-[var(--primitive-green-600)]" />
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-caption">
                  {coach.rating && coach.rating > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Star size={16} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                      <span className="font-semibold text-foreground-default">
                        {coach.rating.toFixed(1)}
                      </span>
                      <span className="text-foreground-muted">
                        ({coach.reviewCount} reviews)
                      </span>
                    </div>
                  )}
                  <span className="flex items-center gap-1.5 text-foreground-muted">
                    <Users size={16} />
                    {coach.totalSessions} sessions
                  </span>
                  {coach.location && (
                    <span className="flex items-center gap-1.5 text-foreground-muted">
                      <MapPin size={16} />
                      {coach.location}
                    </span>
                  )}
                  {coach.yearsInClimate && (
                    <span className="flex items-center gap-1.5 text-foreground-muted">
                      <Briefcase size={16} />
                      {coach.yearsInClimate}+ years in climate
                    </span>
                  )}
                  {nextAvailable && (
                    <span className="flex items-center gap-1.5 text-[var(--primitive-green-600)]">
                      <Calendar size={16} />
                      Next: {nextAvailable}
                    </span>
                  )}
                </div>

                {/* Sectors */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {coach.sectors.map((sector) => {
                    const sectorInfo = SECTOR_INFO[sector as Sector];
                    return (
                      <Chip key={sector} variant="neutral" size="sm">
                        {sectorInfo?.label || sector}
                      </Chip>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Video Introduction */}
          {coach.videoLink && (
            <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-card">
              <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">
                Video Introduction
              </h2>
              <div className="relative aspect-video rounded-lg bg-[var(--primitive-neutral-100)] overflow-hidden">
                <iframe
                  src={coach.videoLink}
                  title={`${coach.firstName}'s introduction video`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* About */}
          <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-card">
            <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">
              About {coach.firstName}
            </h2>
            <div className="prose prose-sm max-w-none text-foreground-default">
              {coach.bio ? (
                <p className="whitespace-pre-wrap">{coach.bio}</p>
              ) : (
                <p className="text-foreground-muted italic">No bio available.</p>
              )}
            </div>
          </div>

          {/* Expertise */}
          {coach.expertise && coach.expertise.length > 0 && (
            <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-card">
              <h2 className="text-heading-sm font-semibold text-foreground-default mb-4">
                Areas of Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {coach.expertise.map((skill) => (
                  <Chip key={skill} variant="primary" size="sm">
                    {skill}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="rounded-xl bg-[var(--card-background)] p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-heading-sm font-semibold text-foreground-default">
                Reviews
              </h2>
              {coach.rating && coach.rating > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(coach.rating)} />
                  <span className="text-body font-semibold text-foreground-default">
                    {coach.rating.toFixed(1)}
                  </span>
                  <span className="text-caption text-foreground-muted">
                    ({coach.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {coach.reviews && coach.reviews.length > 0 ? (
              <div className="space-y-4">
                {coach.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Star size={40} className="mx-auto text-[var(--primitive-neutral-300)] mb-3" />
                <p className="text-body text-foreground-muted">
                  No reviews yet. Be the first to book a session!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-[var(--card-background)] p-6 shadow-card">
            <div className="text-center mb-6">
              <div className="text-heading-md font-bold text-[var(--primitive-green-800)]">
                {sessionRateFormatted}
              </div>
              <p className="text-caption text-foreground-muted">
                per {coach.sessionDuration || 60}-minute session
              </p>
            </div>

            {/* Session Details */}
            <div className="space-y-3 mb-6 pb-6 border-b border-[var(--border-default)]">
              <div className="flex items-center gap-3 text-body text-foreground-default">
                <Clock size={18} className="text-[var(--primitive-green-600)]" />
                <span>{coach.sessionDuration || 60} minutes</span>
              </div>
              <div className="flex items-center gap-3 text-body text-foreground-default">
                <Calendar size={18} className="text-[var(--primitive-green-600)]" />
                <span>Video call</span>
              </div>
              {coach.timezone && (
                <div className="flex items-center gap-3 text-body text-foreground-default">
                  <MapPin size={18} className="text-[var(--primitive-green-600)]" />
                  <span>{coach.timezone}</span>
                </div>
              )}
            </div>

            {/* Availability Preview */}
            {coach.availability?.description && (
              <div className="mb-6 pb-6 border-b border-[var(--border-default)]">
                <p className="text-caption text-foreground-muted mb-2">Availability</p>
                <p className="text-body text-foreground-default">
                  {coach.availability.description}
                </p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setShowBookingModal(true)}
              >
                <Calendar size={18} className="mr-2" />
                Book a Session
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                asChild
              >
                <Link href={`/candid/messages?new=${coach.id}`}>
                  <ChatCircle size={18} className="mr-2" />
                  Send Message
                </Link>
              </Button>
            </div>

            {/* Platform Fee Note */}
            <p className="mt-4 text-caption text-foreground-muted text-center">
              Sessions are conducted via video call. An 18% platform fee is included.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          coach={{
            id: coach.id,
            name: `${coach.firstName} ${coach.lastName}`,
            avatar: coach.photoUrl || undefined,
            headline: coach.headline || "",
            sessionRate: coach.sessionRate,
            sessionDuration: coach.sessionDuration || 60,
          }}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
}

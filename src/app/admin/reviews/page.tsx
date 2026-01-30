"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import {
  Star,
  Flag,
  Eye,
  EyeSlash,
  ChatCircle,
  Warning,
} from "@phosphor-icons/react";

interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  coachResponse: string | null;
  isFlagged: boolean;
  flagReason: string | null;
  isVisible: boolean;
  createdAt: string;
  mentee: {
    account: { name: string | null; avatar: string | null };
  };
  coach: {
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
  };
  session: {
    scheduledAt: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [flaggedOnly]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (flaggedOnly) params.set("flagged", "true");

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    reviewId: string,
    action: "hide" | "unhide" | "unflag"
  ) => {
    setUpdating(reviewId);
    try {
      const body: Record<string, unknown> = { reviewId };
      if (action === "hide") body.isVisible = false;
      if (action === "unhide") body.isVisible = true;
      if (action === "unflag") body.isFlagged = false;

      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error("Failed to update review:", err);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)]">
            Reviews
          </h1>
          <p className="text-sm text-[var(--primitive-neutral-600)]">
            Moderate reviews and handle flagged content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={flaggedOnly ? "primary" : "secondary"}
            onClick={() => setFlaggedOnly(!flaggedOnly)}
          >
            <Flag size={16} className="mr-2" />
            {flaggedOnly ? "Showing Flagged" : "Show Flagged Only"}
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-[var(--primitive-neutral-500)]">
          <Star size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">
            {flaggedOnly ? "No flagged reviews" : "No reviews yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-xl border p-5 ${
                review.isFlagged
                  ? "border-[var(--primitive-red-300)]"
                  : !review.isVisible
                    ? "border-[var(--primitive-neutral-300)] opacity-60"
                    : "border-[var(--primitive-neutral-200)]"
              }`}
            >
              {/* Flags */}
              {review.isFlagged && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-[var(--primitive-red-100)] rounded-lg">
                  <Warning
                    size={16}
                    className="text-[var(--primitive-red-600)]"
                  />
                  <span className="text-sm font-medium text-[var(--primitive-red-700)]">
                    Flagged
                  </span>
                  {review.flagReason && (
                    <span className="text-sm text-[var(--primitive-red-600)]">
                      — {review.flagReason}
                    </span>
                  )}
                </div>
              )}

              {!review.isVisible && (
                <div className="flex items-center gap-2 mb-3 p-2 bg-[var(--primitive-neutral-100)] rounded-lg">
                  <EyeSlash
                    size={16}
                    className="text-[var(--primitive-neutral-600)]"
                  />
                  <span className="text-sm font-medium text-[var(--primitive-neutral-700)]">
                    Hidden from public view
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    src={review.mentee.account.avatar || undefined}
                    name={review.mentee.account.name || "Anonymous"}
                    color="blue"
                  />
                  <div>
                    <p className="font-medium text-[var(--primitive-green-800)]">
                      {review.mentee.account.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-[var(--primitive-neutral-500)]">
                      {formatDate(review.createdAt)} · Session on{" "}
                      {formatDate(review.session.scheduledAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        weight={s <= review.rating ? "fill" : "regular"}
                        className={
                          s <= review.rating
                            ? "text-[#F59E0B]"
                            : "text-[var(--primitive-neutral-300)]"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Coach info */}
              <div className="flex items-center gap-2 mb-3 text-sm text-[var(--primitive-neutral-600)]">
                <span>Coach:</span>
                <Avatar
                  size="xs"
                  src={review.coach.photoUrl || undefined}
                  name={`${review.coach.firstName || ""} ${review.coach.lastName || ""}`.trim()}
                  color="green"
                />
                <span className="font-medium">
                  {review.coach.firstName} {review.coach.lastName}
                </span>
              </div>

              {/* Comment */}
              {review.comment && (
                <p className="text-sm text-[var(--primitive-neutral-700)] mb-3">
                  {review.comment}
                </p>
              )}

              {/* Coach Response */}
              {review.coachResponse && (
                <div className="pl-4 border-l-2 border-[var(--primitive-green-200)] mb-3">
                  <p className="text-xs text-[var(--primitive-neutral-500)] mb-1">
                    <ChatCircle size={12} className="inline mr-1" />
                    Coach response:
                  </p>
                  <p className="text-sm text-[var(--primitive-neutral-700)]">
                    {review.coachResponse}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-[var(--primitive-neutral-100)]">
                {review.isVisible ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(review.id, "hide")}
                    loading={updating === review.id}
                  >
                    <EyeSlash size={14} className="mr-1.5" />
                    Hide
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(review.id, "unhide")}
                    loading={updating === review.id}
                  >
                    <Eye size={14} className="mr-1.5" />
                    Unhide
                  </Button>
                )}
                {review.isFlagged && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(review.id, "unflag")}
                    loading={updating === review.id}
                  >
                    <Flag size={14} className="mr-1.5" />
                    Dismiss Flag
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

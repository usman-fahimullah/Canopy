"use client";

import { Avatar } from "@/components/ui/avatar";
import { StarRating } from "@/components/ui/scorecard";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ReviewCardProps {
  scorerName: string;
  scorerAvatar: string | null;
  rating: number;
  comments: string | null;
  createdAt: Date;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ReviewCard({
  scorerName,
  scorerAvatar,
  rating,
  comments,
  createdAt,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const formattedDate = format(new Date(createdAt), "'today at' h:mm a");

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar size="sm" name={scorerName} src={scorerAvatar ?? undefined} />
        <div className="flex-1">
          <p className="text-body-sm font-medium text-[var(--foreground-default)]">{scorerName}</p>
          <StarRating value={rating} readOnly size="sm" />
        </div>
      </div>

      {comments && <p className="text-body-sm text-[var(--foreground-default)]">{comments}</p>}

      <div className="flex items-center gap-3 text-caption text-[var(--foreground-muted)]">
        <span>{formattedDate}</span>
        {onEdit && (
          <button onClick={onEdit} className="text-[var(--foreground-link)] hover:underline">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-[var(--foreground-link)] hover:underline">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

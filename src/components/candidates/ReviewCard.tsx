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
  isDeleting?: boolean;
}

export function ReviewCard({
  scorerName,
  scorerAvatar,
  rating,
  comments,
  createdAt,
  onEdit,
  onDelete,
  isDeleting,
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
          <Button variant="link" size="sm" onClick={onEdit} className="h-auto p-0 text-caption">
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="link"
            size="sm"
            onClick={onDelete}
            loading={isDeleting}
            className="h-auto p-0 text-caption"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

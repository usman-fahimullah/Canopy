"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { format } from "date-fns";

interface MessageBubbleProps {
  content: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
  /** Whether this message was sent by the current user/org */
  isSent: boolean;
}

export function MessageBubble({
  content,
  senderName,
  senderAvatar,
  timestamp,
  isSent,
}: MessageBubbleProps) {
  const formattedTime = format(new Date(timestamp), "h:mm a");

  return (
    <div className={cn("flex gap-3", isSent ? "flex-row-reverse" : "flex-row")}>
      {!isSent && <Avatar size="sm" name={senderName} src={senderAvatar} />}

      <div className={cn("max-w-[75%] space-y-1", isSent ? "items-end" : "items-start")}>
        {/* Sender label */}
        <p
          className={cn(
            "text-caption-sm font-medium",
            isSent ? "text-right" : "text-left",
            "text-[var(--foreground-muted)]"
          )}
        >
          {senderName}
        </p>

        {/* Message bubble */}
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-body-sm",
            isSent
              ? "bg-[var(--primitive-green-600)] text-white"
              : "bg-[var(--background-subtle)] text-[var(--foreground-default)]"
          )}
        >
          <p className="whitespace-pre-wrap">{content}</p>
        </div>

        {/* Timestamp */}
        <p
          className={cn(
            "text-caption-sm text-[var(--foreground-disabled)]",
            isSent ? "text-right" : "text-left"
          )}
        >
          {formattedTime}
        </p>
      </div>
    </div>
  );
}

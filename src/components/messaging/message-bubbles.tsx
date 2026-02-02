"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import type { MessageItem } from "@/hooks/use-messages";

export interface MessageBubblesProps {
  messages: MessageItem[];
  currentAccountId: string | null;
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

interface MessageGroup {
  senderId: string;
  isOwn: boolean;
  messages: MessageItem[];
}

export function MessageBubbles({
  messages,
  currentAccountId,
  otherUser,
}: MessageBubblesProps) {
  // Group consecutive messages from the same sender
  const groups: MessageGroup[] = [];

  for (const msg of messages) {
    const isOwn = msg.senderId === currentAccountId;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.senderId === msg.senderId) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({
        senderId: msg.senderId,
        isOwn,
        messages: [msg],
      });
    }
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.messages[0].id}
          className={cn(
            "flex items-end gap-3 px-0 py-0",
            group.isOwn ? "justify-end" : "justify-start"
          )}
        >
          {/* Avatar for received messages */}
          {!group.isOwn && (
            <Avatar
              size="sm"
              src={otherUser.avatar || undefined}
              name={otherUser.name}
              color="green"
              className="h-8 w-8 shrink-0 rounded-xl border border-[var(--primitive-neutral-300)]"
            />
          )}

          {/* Bubble cluster */}
          <div
            className={cn(
              "flex flex-col gap-1 max-w-[480px]",
              group.isOwn ? "items-end" : "items-start"
            )}
          >
            {/* Sender label for received messages */}
            {!group.isOwn && (
              <p className="text-sm leading-5 text-[var(--primitive-neutral-800)] mb-0.5">
                {otherUser.name}
              </p>
            )}

            {group.messages.map((msg, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === group.messages.length - 1;
              const isSingle = group.messages.length === 1;

              // Bubble radius logic:
              // Single bubble flattens the tail corner
              // First in group: fully rounded
              // Last in group: flattens the tail corner
              // Middle: fully rounded
              let radiusClass: string;
              if (isSingle) {
                radiusClass = group.isOwn
                  ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-[4px]"
                  : "rounded-tl-xl rounded-tr-xl rounded-bl-[4px] rounded-br-xl";
              } else if (isFirst) {
                radiusClass = "rounded-xl";
              } else if (isLast) {
                radiusClass = group.isOwn
                  ? "rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-[4px]"
                  : "rounded-tl-xl rounded-tr-xl rounded-bl-[4px] rounded-br-xl";
              } else {
                radiusClass = "rounded-xl";
              }

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "px-3 py-3 text-lg leading-6",
                    radiusClass,
                    group.isOwn
                      ? "bg-[var(--primitive-blue-200)] text-[var(--primitive-blue-800)]"
                      : "bg-[var(--primitive-neutral-200)] text-[var(--foreground-default)]",
                    !isSingle && isFirst && !group.isOwn && "w-full",
                    !isSingle && !isFirst && !isLast && !group.isOwn && "w-full"
                  )}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              );
            })}
          </div>

          {/* Avatar for sent messages */}
          {group.isOwn && (
            <Avatar
              size="sm"
              src={undefined}
              name="You"
              color="green"
              className="h-8 w-8 shrink-0 rounded-xl border border-[var(--primitive-neutral-300)]"
            />
          )}
        </div>
      ))}
    </div>
  );
}

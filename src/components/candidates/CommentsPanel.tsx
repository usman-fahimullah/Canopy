"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { MentionTextarea, MentionHighlight } from "@/components/ui/mention-input";
import type { MentionUser, MentionData } from "@/components/ui/mention-input";
import { X, ChatCircleDots } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";

/**
 * CommentsPanel — Right-side panel for adding/viewing comments on a candidate.
 * Uses MentionTextarea for @mention support and wires to POST /api/canopy/candidates/[id]/notes.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1245
 */

interface NoteData {
  id: string;
  content: string;
  mentions: string[];
  createdAt: Date;
  orgMemberAuthor: {
    account: {
      name: string | null;
      avatar: string | null;
    };
  } | null;
}

interface CommentsPanelProps {
  seekerId: string;
  notes: NoteData[];
  onClose: () => void;
}

function CommentCard({ note }: { note: NoteData }) {
  const authorName = note.orgMemberAuthor?.account?.name ?? "Unknown User";
  const authorAvatar = note.orgMemberAuthor?.account?.avatar ?? undefined;
  const createdAt = note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt);

  // Parse stored mentions into MentionData for highlighting
  const noteMentions: MentionData[] = (note.mentions ?? []).map((id, idx) => ({
    id,
    display: `@${id}`,
    startIndex: idx,
    endIndex: idx + 1,
  }));

  return (
    <div className="space-y-2 py-3">
      <div className="flex items-center gap-2">
        <Avatar size="xs" src={authorAvatar} name={authorName} alt={authorName} />
        <span className="text-caption-strong text-[var(--foreground-default)]">{authorName}</span>
        <span className="text-caption text-[var(--foreground-muted)]">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </span>
      </div>
      <div className="pl-8">
        <MentionHighlight
          text={note.content}
          mentions={noteMentions}
          variant="subtle"
          className="text-body-sm text-[var(--foreground-default)]"
        />
      </div>
    </div>
  );
}

export function CommentsPanel({ seekerId, notes, onClose }: CommentsPanelProps) {
  const router = useRouter();
  const [commentText, setCommentText] = React.useState("");
  const [mentions, setMentions] = React.useState<MentionData[]>([]);
  const [mentionUsers, setMentionUsers] = React.useState<MentionUser[]>([]);
  const [isPosting, setIsPosting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = React.useCallback(async (query: string): Promise<MentionUser[]> => {
    try {
      const res = await fetch(`/api/canopy/team/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const data = await res.json();
      const users: MentionUser[] = (data.data ?? data ?? []).map(
        (m: {
          id: string;
          account: {
            name: string | null;
            avatar: string | null;
            email: string;
          };
        }) => ({
          id: m.id,
          name: m.account?.name ?? m.account?.email ?? "Unknown",
          email: m.account?.email,
          avatar: m.account?.avatar ?? undefined,
        })
      );
      setMentionUsers(users);
      return users;
    } catch {
      return [];
    }
  }, []);

  async function handlePostComment() {
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsPosting(true);
    setError(null);

    try {
      const mentionIds = mentions.map((m) => m.id);
      const response = await fetch(`/api/canopy/candidates/${seekerId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed, mentions: mentionIds }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to post comment. Please try again.");
      }

      setCommentText("");
      setMentions([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsPosting(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-4 py-3">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">Comments</h2>
        <Button variant="outline" size="icon-sm" onClick={onClose} aria-label="Close panel">
          <X size={18} />
        </Button>
      </div>

      {/* Input area — MentionTextarea with @mention support */}
      <div className="space-y-3 border-b border-[var(--border-muted)] p-4">
        <MentionTextarea
          value={commentText}
          onChange={setCommentText}
          mentions={mentions}
          onMentionsChange={setMentions}
          users={mentionUsers}
          onSearch={handleSearch}
          placeholder="Leave a comment..."
          rows={3}
          size="compact"
          disabled={isPosting}
          aria-label="Comment text"
        />
        {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}
        <Button
          variant="primary"
          className="w-full"
          onClick={handlePostComment}
          disabled={!commentText.trim() || isPosting}
          loading={isPosting}
        >
          Post Comment
        </Button>
      </div>

      {/* Comments list - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {notes.length === 0 ? (
          <EmptyState
            icon={
              <ChatCircleDots size={32} weight="light" className="text-[var(--foreground-muted)]" />
            }
            title="No Comments Yet"
            description="Be the first to leave a comment on this candidate."
            size="sm"
          />
        ) : (
          <div>
            {notes.map((note, index) => (
              <React.Fragment key={note.id}>
                <CommentCard note={note} />
                {index < notes.length - 1 && <Separator variant="muted" />}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

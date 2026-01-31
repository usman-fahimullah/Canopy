"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ChatCircle, GraduationCap } from "@phosphor-icons/react";
import type { MyMentorData } from "./types";

const statusConfig: Record<
  MyMentorData["status"],
  { label: string; variant: "success" | "warning" | "neutral" | "feature" }
> = {
  ACTIVE: { label: "Active", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  PAUSED: { label: "Paused", variant: "neutral" },
  COMPLETED: { label: "Completed", variant: "feature" },
};

function MentorCard({ mentor }: { mentor: MyMentorData }) {
  const status = statusConfig[mentor.status];
  const started = new Date(mentor.startedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border-default bg-background-default p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <Avatar
        size="default"
        src={mentor.avatar || undefined}
        name={mentor.name}
        color="green"
        className="shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-semibold text-foreground-default truncate">
            {mentor.name}
          </p>
          <Badge variant={status.variant} size="sm">
            {status.label}
          </Badge>
        </div>
        {mentor.role && (
          <p className="text-caption text-foreground-muted truncate mt-0.5">
            {mentor.role}
          </p>
        )}
        {mentor.specialty && (
          <p className="text-caption font-medium text-[var(--primitive-green-600)] truncate mt-0.5">
            {mentor.specialty}
          </p>
        )}
        <p className="text-caption text-foreground-subtle mt-1">
          Since {started}
        </p>
      </div>
      <Button variant="secondary" size="sm" asChild>
        <Link href={`/candid/messages?new=${mentor.accountId}`}>
          <ChatCircle size={16} className="mr-1.5" />
          Message
        </Link>
      </Button>
    </div>
  );
}

export function MyMentorsView() {
  const [mentors, setMentors] = useState<MyMentorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/mentor-assignments/mine?role=mentee");
      if (res.ok) {
        const data = await res.json();
        setMentors(data.assignments || []);
      } else {
        throw new Error("Failed to fetch");
      }
    } catch {
      setError("Failed to load your mentors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <EmptyState
          icon={<GraduationCap size={32} className="text-foreground-muted" />}
          title="Something went wrong"
          description={error}
          size="sm"
          action={{ label: "Try again", onClick: fetchMentors }}
        />
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto">
        <EmptyState
          icon={<GraduationCap size={32} className="text-foreground-muted" />}
          title="No mentors yet"
          description="Browse the Find Mentors tab to connect with experienced climate professionals."
          size="sm"
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-2xl mx-auto overflow-y-auto">
      <div className="space-y-3">
        {mentors.map((mentor) => (
          <MentorCard key={mentor.assignmentId} mentor={mentor} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Handshake, ChatCircle, MagnifyingGlass } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsListUnderline, TabsTriggerUnderline, TabsContent } from "@/components/ui/tabs";
import type { MyMentorData } from "./components/types";
import { logger, formatError } from "@/lib/logger";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusBadgeVariant(status: MyMentorData["status"]) {
  switch (status) {
    case "active":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "completed":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

function statusLabel(status: MyMentorData["status"]): string {
  switch (status) {
    case "active":
      return "Active";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MentoringPage() {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<MyMentorData[]>([]);

  /* ---- data fetch ------------------------------------------------ */
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/mentor-assignments/mine");

        if (res.ok) {
          const data = await res.json();
          setAssignments(data.assignments ?? []);
        } else {
          setAssignments([]);
        }
      } catch (err) {
        logger.error("Error fetching mentor assignments", { error: formatError(err) });
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Mentoring" />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  /* ---- render ---------------------------------------------------- */
  return (
    <div>
      <PageHeader title="Mentoring" />

      <div className="px-8 py-8 lg:px-12">
        <Tabs defaultValue="my-mentors">
          <TabsListUnderline>
            <TabsTriggerUnderline value="my-mentors">My Mentors</TabsTriggerUnderline>
            <TabsTriggerUnderline value="find-mentors">Find Mentors</TabsTriggerUnderline>
          </TabsListUnderline>

          {/* ---- My Mentors Tab ----------------------------------- */}
          <TabsContent value="my-mentors">
            <div className="mt-6">
              {assignments.length > 0 ? (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-0)] p-5"
                    >
                      {/* Avatar */}
                      <Avatar
                        src={assignment.mentor.avatar ?? undefined}
                        name={assignment.mentor.name}
                        size="default"
                        className="shrink-0"
                      />

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {/* Name + status */}
                        <div className="mb-1 flex items-center gap-3">
                          <p className="truncate text-body-sm font-semibold text-[var(--primitive-green-800)]">
                            {assignment.mentor.name}
                          </p>
                          <Badge variant={statusBadgeVariant(assignment.status)} size="sm">
                            {statusLabel(assignment.status)}
                          </Badge>
                        </div>

                        {/* Headline */}
                        <p className="mb-2 truncate text-caption text-[var(--primitive-neutral-600)]">
                          {assignment.mentor.headline}
                        </p>

                        {/* Specialties */}
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {assignment.mentor.specialties.map((specialty) => (
                            <Badge key={specialty} variant="neutral" size="sm">
                              {specialty}
                            </Badge>
                          ))}
                        </div>

                        {/* Action for active mentors */}
                        {assignment.status === "active" && (
                          <Button
                            variant="tertiary"
                            size="sm"
                            leftIcon={<ChatCircle size={16} weight="regular" />}
                          >
                            Message
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-0)] p-8 text-center">
                  <Handshake
                    size={48}
                    weight="light"
                    className="mx-auto mb-3 text-[var(--foreground-subtle)]"
                  />
                  <p className="text-body font-medium text-[var(--foreground-default)]">
                    No mentors yet
                  </p>
                  <p className="mt-1 text-caption text-[var(--foreground-muted)]">
                    Find a mentor to guide your climate career.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ---- Find Mentors Tab --------------------------------- */}
          <TabsContent value="find-mentors">
            <div className="mt-6">
              <div className="rounded-[16px] bg-[var(--primitive-green-100)] p-8 text-center">
                <MagnifyingGlass
                  size={40}
                  weight="light"
                  className="mx-auto mb-4 text-[var(--primitive-green-700)]"
                />
                <p className="mb-4 text-body text-[var(--primitive-green-800)]">
                  Browse available mentors and send introduction requests
                </p>
                <Link href="/jobs/mentoring/connect">
                  <Button variant="primary">Find Mentors</Button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

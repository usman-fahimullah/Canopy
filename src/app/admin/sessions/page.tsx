"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import {
  CalendarCheck,
  Clock,
  CurrencyDollar,
  CaretLeft,
  CaretRight,
  Funnel,
  X,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

interface AdminSession {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  coachName: string;
  coachAvatar: string | null;
  coachId: string;
  menteeName: string;
  menteeAvatar: string | null;
  bookingAmount: number;
  platformFee: number;
  bookingStatus: string | null;
  hasReview: boolean;
  reviewRating: number | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No Show" },
];

const STATUS_CHIP_VARIANT: Record<
  string,
  "neutral" | "primary" | "blue" | "red" | "orange" | "yellow" | "purple"
> = {
  SCHEDULED: "blue",
  IN_PROGRESS: "primary",
  COMPLETED: "primary",
  CANCELLED: "red",
  NO_SHOW: "orange",
};

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/sessions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (err) {
      logger.error("Failed to fetch sessions", { error: formatError(err) });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)]">Sessions</h1>
          <p className="text-sm text-[var(--primitive-neutral-600)]">{total} total sessions</p>
        </div>
        <Button
          variant={showFilters ? "primary" : "secondary"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Funnel size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--primitive-green-800)]">
              Filter by Status
            </p>
            {statusFilter && (
              <button
                className="text-xs text-[var(--primitive-neutral-600)] hover:text-[var(--primitive-green-700)]"
                onClick={() => {
                  setStatusFilter("");
                  setPage(1);
                }}
              >
                <X size={14} className="mr-1 inline" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                variant={statusFilter === opt.value ? "primary" : "neutral"}
                size="sm"
                onClick={() => {
                  setStatusFilter(opt.value);
                  setPage(1);
                }}
                className="cursor-pointer"
              >
                {opt.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-16 text-center text-[var(--primitive-neutral-500)]">
          <CalendarCheck size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No sessions found</p>
          <p className="mt-1 text-sm">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--primitive-neutral-600)]">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--primitive-neutral-600)]">
                    Coach
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--primitive-neutral-600)]">
                    Mentee
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--primitive-neutral-600)]">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--primitive-neutral-600)]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--primitive-neutral-600)]">
                    Platform Fee
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-[var(--primitive-neutral-600)]">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-[var(--primitive-neutral-100)] transition-colors hover:bg-[var(--background-interactive-hover)]"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-[var(--primitive-green-800)]">
                        {formatDate(session.scheduledAt)}
                      </div>
                      <div className="flex items-center gap-1 text-[var(--primitive-neutral-500)]">
                        <Clock size={12} />
                        {formatTime(session.scheduledAt)} · {session.duration}min
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="sm"
                          src={session.coachAvatar || undefined}
                          name={session.coachName}
                          color="green"
                        />
                        <span className="text-[var(--primitive-green-800)]">
                          {session.coachName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="sm"
                          src={session.menteeAvatar || undefined}
                          name={session.menteeName}
                          color="blue"
                        />
                        <span className="text-[var(--primitive-green-800)]">
                          {session.menteeName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Chip variant={STATUS_CHIP_VARIANT[session.status] || "neutral"} size="sm">
                        {session.status
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Chip>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-medium text-[var(--primitive-green-800)]">
                        ${(session.bookingAmount / 100).toFixed(0)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-[var(--primitive-neutral-600)]">
                        ${(session.platformFee / 100).toFixed(0)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {session.hasReview ? (
                        <Chip variant="yellow" size="sm">
                          {session.reviewRating?.toFixed(1)}★
                        </Chip>
                      ) : session.status === "COMPLETED" ? (
                        <span className="text-[var(--primitive-neutral-400)]">Pending</span>
                      ) : (
                        <span className="text-[var(--primitive-neutral-300)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[var(--primitive-neutral-200)] px-4 py-3">
              <span className="text-sm text-[var(--primitive-neutral-600)]">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <CaretLeft size={14} className="mr-1" />
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <CaretRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LinkedinLogo,
  CheckCircle,
  XCircle,
  Clock,
  EnvelopeSimple,
  Briefcase,
  Calendar,
  CurrencyDollar,
  Star,
  CaretDown,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

export default function AdminCoachesPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse p-8">
          <div className="mb-4 h-8 w-1/3 rounded bg-[var(--primitive-neutral-200)]" />
          <div className="h-64 rounded bg-[var(--primitive-neutral-200)]" />
        </div>
      }
    >
      <AdminCoachesContent />
    </Suspense>
  );
}

interface Coach {
  id: string;
  firstName: string | null;
  lastName: string | null;
  headline: string | null;
  bio: string | null;
  expertise: string[];
  sectors: string[];
  yearsInClimate: number | null;
  sessionRate: number;
  status: string;
  applicationDate: string | null;
  rating: number | null;
  totalSessions: number;
  account: {
    email: string;
    name: string | null;
  };
  availability: string | null;
}

const STATUS_TABS = [
  { value: "PENDING", label: "Pending", color: "warning" },
  { value: "APPROVED", label: "Approved", color: "info" },
  { value: "ACTIVE", label: "Active", color: "success" },
  { value: "REJECTED", label: "Rejected", color: "error" },
  { value: "PAUSED", label: "Paused", color: "default" },
];

function AdminCoachesContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "PENDING";

  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCoaches(selectedStatus);
  }, [selectedStatus]);

  const fetchCoaches = async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/coaches/apply?status=${status}`);
      if (response.ok) {
        const data = await response.json();
        setCoaches(data.coaches || []);
      }
    } catch (error) {
      logger.error("Failed to fetch coaches", { error: formatError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (coachId: string, action: "approve" | "reject") => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/coaches/${coachId}/${action}`, {
        method: "POST",
      });

      if (response.ok) {
        // Refresh the list
        fetchCoaches(selectedStatus);
        setSelectedCoach(null);
      }
    } catch (error) {
      logger.error(`Failed to ${action} coach`, { error: formatError(error) });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCoaches = coaches.filter((coach) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      coach.firstName?.toLowerCase().includes(query) ||
      coach.lastName?.toLowerCase().includes(query) ||
      coach.account.email.toLowerCase().includes(query) ||
      coach.headline?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)]">Coach Management</h1>
        <p className="text-[var(--primitive-neutral-600)]">
          Review applications and manage coach accounts.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedStatus === tab.value
                ? "bg-[var(--primitive-green-600)] text-white"
                : "border border-[var(--primitive-neutral-200)] bg-[var(--background-interactive-default)] text-[var(--primitive-neutral-700)] hover:bg-[var(--background-interactive-hover)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primitive-neutral-400)]"
          />
          <input
            type="text"
            placeholder="Search coaches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--primitive-neutral-200)] py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-600)]"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Coach List */}
        <div className="flex-1">
          {loading ? (
            <div className="rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--primitive-green-600)] border-t-transparent" />
              <p className="mt-4 text-[var(--primitive-neutral-600)]">Loading coaches...</p>
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-8 text-center">
              <User size={48} className="mx-auto mb-4 text-[var(--primitive-neutral-400)]" />
              <p className="text-[var(--primitive-neutral-600)]">
                No {selectedStatus.toLowerCase()} coaches found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCoaches.map((coach) => (
                <button
                  key={coach.id}
                  onClick={() => setSelectedCoach(coach)}
                  className={`w-full rounded-xl border bg-[var(--card-background)] p-4 text-left transition-all ${
                    selectedCoach?.id === coach.id
                      ? "border-[var(--primitive-green-600)] ring-2 ring-[var(--primitive-green-100)]"
                      : "border-[var(--primitive-neutral-200)] hover:border-[var(--primitive-neutral-300)]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primitive-green-100)] text-lg font-bold text-[var(--primitive-green-700)]">
                      {coach.firstName?.[0]}
                      {coach.lastName?.[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="truncate font-semibold text-[var(--primitive-green-800)]">
                          {coach.firstName} {coach.lastName}
                        </h3>
                        <StatusBadge status={coach.status} />
                      </div>
                      <p className="truncate text-sm text-[var(--primitive-neutral-600)]">
                        {coach.headline}
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-[var(--primitive-neutral-500)]">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {coach.yearsInClimate}+ years
                        </span>
                        <span className="flex items-center gap-1">
                          <CurrencyDollar size={14} />${coach.sessionRate / 100}/session
                        </span>
                        {coach.applicationDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(coach.applicationDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Coach Detail Panel */}
        {selectedCoach && (
          <div className="w-96 shrink-0">
            <div className="sticky top-24 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
              {/* Header */}
              <div className="border-b border-[var(--primitive-neutral-200)] p-6">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-green-100)] text-2xl font-bold text-[var(--primitive-green-700)]">
                    {selectedCoach.firstName?.[0]}
                    {selectedCoach.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--primitive-green-800)]">
                      {selectedCoach.firstName} {selectedCoach.lastName}
                    </h2>
                    <p className="text-sm text-[var(--primitive-neutral-600)]">
                      {selectedCoach.headline}
                    </p>
                  </div>
                </div>
                <StatusBadge status={selectedCoach.status} />
              </div>

              {/* Details */}
              <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
                <DetailItem
                  icon={EnvelopeSimple}
                  label="Email"
                  value={selectedCoach.account.email}
                />
                <DetailItem
                  icon={Briefcase}
                  label="Years in Climate"
                  value={`${selectedCoach.yearsInClimate} years`}
                />
                <DetailItem
                  icon={CurrencyDollar}
                  label="Session Rate"
                  value={`$${selectedCoach.sessionRate / 100}/session`}
                />
                {selectedCoach.rating && (
                  <DetailItem
                    icon={Star}
                    label="Rating"
                    value={`${selectedCoach.rating.toFixed(1)} (${selectedCoach.totalSessions} sessions)`}
                  />
                )}

                <div>
                  <p className="mb-2 text-sm font-medium text-[var(--primitive-neutral-600)]">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCoach.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="rounded bg-[var(--primitive-green-100)] px-2 py-1 text-xs text-[var(--primitive-green-700)]"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-[var(--primitive-neutral-600)]">
                    Sectors
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCoach.sectors.map((sector) => (
                      <span
                        key={sector}
                        className="rounded bg-[var(--primitive-blue-100)] px-2 py-1 text-xs text-[var(--primitive-blue-700)]"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCoach.bio && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-[var(--primitive-neutral-600)]">
                      Bio
                    </p>
                    <p className="text-sm text-[var(--primitive-neutral-700)]">
                      {selectedCoach.bio}
                    </p>
                  </div>
                )}

                {selectedCoach.availability && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-[var(--primitive-neutral-600)]">
                      Availability & Motivation
                    </p>
                    <p className="text-sm text-[var(--primitive-neutral-700)]">
                      {(() => {
                        try {
                          const parsed = JSON.parse(selectedCoach.availability);
                          return `${parsed.description}\n\nMotivation: ${parsed.motivation}`;
                        } catch {
                          return selectedCoach.availability;
                        }
                      })()}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {selectedCoach.status === "PENDING" && (
                <div className="border-t border-[var(--primitive-neutral-200)] p-6">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-[var(--primitive-red-300)] text-[var(--primitive-red-600)] hover:bg-[var(--primitive-red-50)]"
                      onClick={() => handleAction(selectedCoach.id, "reject")}
                      disabled={actionLoading}
                      leftIcon={<XCircle size={18} />}
                    >
                      Reject
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleAction(selectedCoach.id, "approve")}
                      disabled={actionLoading}
                      loading={actionLoading}
                      leftIcon={<CheckCircle size={18} />}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { variant: "warning" | "info" | "success" | "error" | "default"; label: string }
  > = {
    PENDING: { variant: "warning", label: "Pending Review" },
    APPROVED: { variant: "info", label: "Approved" },
    ACTIVE: { variant: "success", label: "Active" },
    REJECTED: { variant: "error", label: "Rejected" },
    PAUSED: { variant: "default", label: "Paused" },
  };

  const { variant, label } = config[status] || { variant: "default", label: status };

  return <Badge variant={variant}>{label}</Badge>;
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 text-[var(--primitive-neutral-400)]" />
      <div>
        <p className="text-xs text-[var(--primitive-neutral-500)]">{label}</p>
        <p className="text-sm font-medium text-[var(--primitive-green-800)]">{value}</p>
      </div>
    </div>
  );
}

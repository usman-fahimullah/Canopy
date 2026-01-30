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

export default function AdminCoachesPage() {
  return (
    <Suspense fallback={<div className="animate-pulse p-8"><div className="h-8 bg-[var(--primitive-neutral-200)] rounded w-1/3 mb-4" /><div className="h-64 bg-[var(--primitive-neutral-200)] rounded" /></div>}>
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
      console.error("Failed to fetch coaches:", error);
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
      console.error(`Failed to ${action} coach:`, error);
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
        <h1 className="text-2xl font-bold text-[var(--primitive-green-800)]">
          Coach Management
        </h1>
        <p className="text-[var(--primitive-neutral-600)]">
          Review applications and manage coach accounts.
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedStatus === tab.value
                ? "bg-[var(--primitive-green-600)] text-white"
                : "bg-white border border-[var(--primitive-neutral-200)] text-[var(--primitive-neutral-700)] hover:bg-[var(--primitive-neutral-50)]"
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
            className="w-full pl-10 pr-4 py-2 border border-[var(--primitive-neutral-200)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-600)] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Coach List */}
        <div className="flex-1">
          {loading ? (
            <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--primitive-green-600)] border-t-transparent rounded-full mx-auto" />
              <p className="mt-4 text-[var(--primitive-neutral-600)]">Loading coaches...</p>
            </div>
          ) : filteredCoaches.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] p-8 text-center">
              <User size={48} className="mx-auto text-[var(--primitive-neutral-400)] mb-4" />
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
                  className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${
                    selectedCoach?.id === coach.id
                      ? "border-[var(--primitive-green-600)] ring-2 ring-[var(--primitive-green-100)]"
                      : "border-[var(--primitive-neutral-200)] hover:border-[var(--primitive-neutral-300)]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--primitive-green-100)] flex items-center justify-center text-lg font-bold text-[var(--primitive-green-700)]">
                      {coach.firstName?.[0]}{coach.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[var(--primitive-green-800)] truncate">
                          {coach.firstName} {coach.lastName}
                        </h3>
                        <StatusBadge status={coach.status} />
                      </div>
                      <p className="text-sm text-[var(--primitive-neutral-600)] truncate">
                        {coach.headline}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[var(--primitive-neutral-500)]">
                        <span className="flex items-center gap-1">
                          <Briefcase size={14} />
                          {coach.yearsInClimate}+ years
                        </span>
                        <span className="flex items-center gap-1">
                          <CurrencyDollar size={14} />
                          ${coach.sessionRate / 100}/session
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
            <div className="bg-white rounded-xl border border-[var(--primitive-neutral-200)] sticky top-24">
              {/* Header */}
              <div className="p-6 border-b border-[var(--primitive-neutral-200)]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--primitive-green-100)] flex items-center justify-center text-2xl font-bold text-[var(--primitive-green-700)]">
                    {selectedCoach.firstName?.[0]}{selectedCoach.lastName?.[0]}
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
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
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
                  <p className="text-sm font-medium text-[var(--primitive-neutral-600)] mb-2">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCoach.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="px-2 py-1 bg-[var(--primitive-green-100)] text-[var(--primitive-green-700)] text-xs rounded"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--primitive-neutral-600)] mb-2">
                    Sectors
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedCoach.sectors.map((sector) => (
                      <span
                        key={sector}
                        className="px-2 py-1 bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)] text-xs rounded"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCoach.bio && (
                  <div>
                    <p className="text-sm font-medium text-[var(--primitive-neutral-600)] mb-2">
                      Bio
                    </p>
                    <p className="text-sm text-[var(--primitive-neutral-700)]">
                      {selectedCoach.bio}
                    </p>
                  </div>
                )}

                {selectedCoach.availability && (
                  <div>
                    <p className="text-sm font-medium text-[var(--primitive-neutral-600)] mb-2">
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
                <div className="p-6 border-t border-[var(--primitive-neutral-200)]">
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
  const config: Record<string, { variant: any; label: string }> = {
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
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-[var(--primitive-neutral-400)] mt-0.5" />
      <div>
        <p className="text-xs text-[var(--primitive-neutral-500)]">{label}</p>
        <p className="text-sm font-medium text-[var(--primitive-green-800)]">{value}</p>
      </div>
    </div>
  );
}

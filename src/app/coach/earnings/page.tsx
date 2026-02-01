"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CurrencyDollar,
  CalendarDots,
  ChartLine,
  Hourglass,
  StripeLogo,
  ArrowSquareOut,
  Warning,
} from "@phosphor-icons/react";
import { format, parse } from "date-fns";

interface MonthlyBreakdown {
  month: string;
  earnings: number;
  sessions: number;
}

interface EarningsData {
  totalEarnings: number;
  totalSessions: number;
  monthlyBreakdown: MonthlyBreakdown[];
  pendingPayouts: {
    amount: number;
    count: number;
  };
}

interface Session {
  id: string;
  status: string;
}

export default function CoachEarningsPage() {
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earningsRes, sessionsRes] = await Promise.all([
          fetch("/api/coach/earnings"),
          fetch("/api/sessions?role=coach"),
        ]);

        if (earningsRes.ok) {
          const earningsData = await earningsRes.json();
          setEarnings(earningsData);
        }

        if (sessionsRes.ok) {
          const sessionsData = await sessionsRes.json();
          const completed = (sessionsData.sessions || []).filter(
            (s: Session) => s.status === "COMPLETED"
          );
          setSessionsCompleted(completed.length);
        }
      } catch (error) {
        console.error("Error fetching earnings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate this month's earnings from breakdown
  const thisMonthEarnings =
    earnings?.monthlyBreakdown?.[0]?.earnings ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasEarnings =
    earnings &&
    (earnings.totalEarnings > 0 || earnings.totalSessions > 0);

  return (
    <div>
      <PageHeader title="Earnings" />

      <div className="px-8 py-6 lg:px-12">
        {hasEarnings ? (
          <div className="space-y-8">
            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Total Earnings",
                  value: `$${(earnings.totalEarnings / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  icon: CurrencyDollar,
                },
                {
                  label: "This Month",
                  value: `$${(thisMonthEarnings / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  icon: ChartLine,
                },
                {
                  label: "Pending",
                  value: `$${(earnings.pendingPayouts.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  icon: Hourglass,
                },
                {
                  label: "Sessions Completed",
                  value: sessionsCompleted || earnings.totalSessions,
                  icon: CalendarDots,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-3 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-4 py-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-caption text-[var(--primitive-neutral-600)]">
                      {stat.label}
                    </p>
                    <div className="rounded-lg bg-[var(--primitive-yellow-100)] p-1.5">
                      <stat.icon
                        size={16}
                        weight="bold"
                        className="text-[var(--primitive-yellow-600)]"
                      />
                    </div>
                  </div>
                  <p className="text-heading-sm font-semibold text-[var(--primitive-neutral-800)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Monthly breakdown */}
            {earnings.monthlyBreakdown &&
              earnings.monthlyBreakdown.length > 0 && (
                <div>
                  <h2 className="mb-4 text-heading-sm font-medium text-[var(--primitive-neutral-800)]">
                    Monthly Breakdown
                  </h2>
                  <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white">
                    {earnings.monthlyBreakdown.map(
                      (month, index) => {
                        // Parse "YYYY-MM" format
                        const monthDate = parse(
                          `${month.month}-01`,
                          "yyyy-MM-dd",
                          new Date()
                        );
                        const monthLabel = format(
                          monthDate,
                          "MMMM yyyy"
                        );

                        return (
                          <div
                            key={month.month}
                            className={`flex items-center justify-between px-6 py-4 ${
                              index <
                              earnings.monthlyBreakdown.length - 1
                                ? "border-b border-[var(--primitive-neutral-200)]"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-[var(--primitive-yellow-100)] p-1.5">
                                <CalendarDots
                                  size={16}
                                  weight="bold"
                                  className="text-[var(--primitive-yellow-600)]"
                                />
                              </div>
                              <div>
                                <p className="text-body font-medium text-[var(--primitive-neutral-800)]">
                                  {monthLabel}
                                </p>
                                <p className="text-caption text-[var(--primitive-neutral-500)]">
                                  {month.sessions}{" "}
                                  {month.sessions === 1
                                    ? "session"
                                    : "sessions"}
                                </p>
                              </div>
                            </div>
                            <p className="text-body font-semibold text-[var(--primitive-neutral-800)]">
                              $
                              {(month.earnings / 100).toLocaleString(
                                undefined,
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {/* Stripe connect banner */}
            <div className="flex items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-6 py-5">
              <div className="rounded-xl bg-[var(--primitive-purple-100)] p-3">
                <StripeLogo
                  size={24}
                  weight="bold"
                  className="text-[var(--primitive-purple-600)]"
                />
              </div>
              <div className="flex-1">
                <p className="text-body font-medium text-[var(--primitive-neutral-800)]">
                  Connect Stripe to receive payouts
                </p>
                <p className="text-caption text-[var(--primitive-neutral-500)]">
                  Link your Stripe account to automatically receive
                  earnings from coaching sessions.
                </p>
              </div>
              <Button variant="primary" size="sm">
                <ArrowSquareOut size={16} weight="bold" />
                Connect
              </Button>
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white px-8 py-16 text-center">
            <div className="mb-4 rounded-xl bg-[var(--primitive-yellow-100)] p-3">
              <CurrencyDollar
                size={28}
                weight="bold"
                className="text-[var(--primitive-yellow-600)]"
              />
            </div>
            <p className="text-body font-medium text-[var(--primitive-neutral-800)]">
              No earnings yet
            </p>
            <p className="mt-1 max-w-md text-caption text-[var(--primitive-neutral-500)]">
              Your earnings will appear here once you complete coaching
              sessions. Connect your Stripe account to receive payouts.
            </p>

            {/* Stripe connect banner (even in empty state) */}
            <div className="mt-8 flex w-full max-w-lg items-center gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-6 py-5 text-left">
              <div className="rounded-xl bg-[var(--primitive-purple-100)] p-3">
                <StripeLogo
                  size={24}
                  weight="bold"
                  className="text-[var(--primitive-purple-600)]"
                />
              </div>
              <div className="flex-1">
                <p className="text-body font-medium text-[var(--primitive-neutral-800)]">
                  Connect Stripe to receive payouts
                </p>
                <p className="text-caption text-[var(--primitive-neutral-500)]">
                  Link your Stripe account to get started.
                </p>
              </div>
              <Button variant="primary" size="sm">
                <ArrowSquareOut size={16} weight="bold" />
                Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

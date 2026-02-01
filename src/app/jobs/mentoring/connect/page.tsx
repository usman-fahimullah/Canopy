"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { MentorFilterPills } from "../components/mentor-filter-pills";
import { MentorListItem } from "../components/mentor-list-item";
import { MentorDetailPanel } from "../components/mentor-detail-panel";
import type { Mentor, MentorFilterType } from "../components/types";

/* ------------------------------------------------------------------ */
/*  Inner content (needs useSearchParams inside Suspense)              */
/* ------------------------------------------------------------------ */

function ConnectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<MentorFilterType>("all");

  const selectedMentorId = searchParams.get("mentor");

  /* ---- data fetch ------------------------------------------------ */
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filter !== "all") params.set("filter", filter);

        const url = `/api/mentors${params.toString() ? `?${params.toString()}` : ""}`;
        const res = await fetch(url);

        if (res.ok) {
          const data = await res.json();
          setMentors(data.mentors ?? []);
        } else {
          setMentors([]);
        }
      } catch (err) {
        console.error("Error fetching mentors:", err);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, [search, filter]);

  /* ---- filtering ------------------------------------------------- */
  const filteredMentors = useMemo(() => {
    let result = mentors;

    // Client-side search filtering (name, role, company, specialties)
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.company.toLowerCase().includes(q) ||
          m.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Client-side filter logic
    if (filter === "recommended") {
      result = result.filter((m) => m.matchScore >= 70);
    }
    // "available" is a placeholder -- show all for now

    return result;
  }, [mentors, search, filter]);

  /* ---- selected mentor ------------------------------------------- */
  const selectedMentor = useMemo(
    () => filteredMentors.find((m) => m.id === selectedMentorId) ?? null,
    [filteredMentors, selectedMentorId]
  );

  function selectMentor(id: string) {
    router.push(`/jobs/mentoring/connect?mentor=${id}`, { scroll: false });
  }

  function clearSelection() {
    router.push("/jobs/mentoring/connect", { scroll: false });
  }

  /* ---- loading state --------------------------------------------- */
  if (loading) {
    return (
      <div>
        <PageHeader title="Find Mentors" />
        <div className="flex items-center justify-center py-32">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  /* ---- render ---------------------------------------------------- */
  return (
    <div>
      <PageHeader title="Find Mentors" />

      <div className="flex h-[calc(100vh-108px)]">
        {/* Left panel: mentor list */}
        <div
          className={`flex w-full flex-col border-[var(--primitive-neutral-200)] lg:w-[400px] lg:shrink-0 lg:border-r ${
            selectedMentor ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search input */}
          <div className="px-4 pb-3 pt-4">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                weight="regular"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--primitive-neutral-500)]"
              />
              <input
                type="text"
                placeholder="Search mentors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl bg-[var(--primitive-neutral-100)] py-2.5 pl-10 pr-4 text-body-sm text-[var(--foreground-default)] outline-none transition-colors placeholder:text-[var(--primitive-neutral-500)] focus:bg-[var(--primitive-neutral-0)] focus:ring-2 focus:ring-[var(--primitive-green-500)]"
              />
            </div>
          </div>

          {/* Filter pills */}
          <div className="px-4 pb-3">
            <MentorFilterPills active={filter} onChange={setFilter} />
          </div>

          {/* Scrollable mentor list */}
          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {filteredMentors.length > 0 ? (
              <div className="space-y-1">
                {filteredMentors.map((mentor) => (
                  <MentorListItem
                    key={mentor.id}
                    mentor={mentor}
                    isSelected={mentor.id === selectedMentorId}
                    onClick={() => selectMentor(mentor.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MagnifyingGlass
                  size={32}
                  weight="light"
                  className="mb-3 text-[var(--foreground-subtle)]"
                />
                <p className="text-body-sm text-[var(--foreground-muted)]">No mentors found</p>
                <p className="mt-1 text-caption text-[var(--primitive-neutral-500)]">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: mentor detail */}
        <div className={`flex-1 ${selectedMentor ? "flex" : "hidden lg:flex"}`}>
          {selectedMentor ? (
            <div className="w-full">
              <MentorDetailPanel mentor={selectedMentor} onClose={clearSelection} />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MagnifyingGlass
                  size={48}
                  weight="light"
                  className="mx-auto mb-4 text-[var(--primitive-neutral-400)]"
                />
                <p className="text-body text-[var(--foreground-muted)]">
                  Select a mentor to view their profile
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page export (Suspense wrapper for useSearchParams)                 */
/* ------------------------------------------------------------------ */

export default function MentorConnectPage() {
  return (
    <Suspense
      fallback={
        <div>
          <PageHeader title="Find Mentors" />
          <div className="flex items-center justify-center py-32">
            <Spinner size="lg" />
          </div>
        </div>
      }
    >
      <ConnectContent />
    </Suspense>
  );
}

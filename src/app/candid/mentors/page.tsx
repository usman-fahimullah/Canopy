"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/ui/search-input";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { Alert } from "@/components/ui/alert";
import { GraduationCap } from "@phosphor-icons/react";

import { MentorshipTabs } from "./components/MentorshipTabs";
import { MentorFilterPills } from "./components/MentorFilterPills";
import { MentorListItem } from "./components/MentorListItem";
import { MentorListItemSkeleton } from "./components/MentorListItemSkeleton";
import { MentorDetailPanel } from "./components/MentorDetailPanel";
import { MentorDetailPanelSkeleton } from "./components/MentorDetailPanelSkeleton";
import { EmptySelectionState } from "./components/EmptySelectionState";
import { MyMentorsView } from "./components/MyMentorsView";
import { MyMenteesView } from "./components/MyMenteesView";

import type {
  Mentor,
  MentorshipTabType,
  MentorFilterType,
} from "./components/types";

export default function MentorsBrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <MentorsContent />
    </Suspense>
  );
}

function MentorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMentorId = searchParams.get("mentor");

  const [activeTab, setActiveTab] = useState<MentorshipTabType>("find");
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<MentorFilterType>("all");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);

  // Fetch mentors
  const fetchMentors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/mentors?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setMentors(data.mentors || []);
      } else {
        throw new Error("Failed to fetch mentors");
      }
    } catch {
      setError("Failed to load mentors");
      setMentors([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (activeTab !== "find") return;
    const debounce = setTimeout(fetchMentors, 300);
    return () => clearTimeout(debounce);
  }, [fetchMentors, activeTab]);

  const handleSelectMentor = (mentorId: string) => {
    router.push(`/candid/mentors?mentor=${mentorId}`, { scroll: false });
  };

  const handleBackToList = () => {
    router.push("/candid/mentors", { scroll: false });
  };

  const handleSendIntro = (accountId: string) => {
    setSending(accountId);
    router.push(`/candid/messages?new=${accountId}`);
  };

  // Filter mentors based on active filter
  const filteredMentors = useMemo(() => {
    let filtered = [...mentors];

    if (activeFilter === "recommended") {
      filtered = filtered.sort((a, b) => {
        const aScore =
          (a.matchQuality === "great_match"
            ? 3
            : a.matchQuality === "good_match"
              ? 2
              : 0) + a.matchReasons.length;
        const bScore =
          (b.matchQuality === "great_match"
            ? 3
            : b.matchQuality === "good_match"
              ? 2
              : 0) + b.matchReasons.length;
        return bScore - aScore;
      });
    } else if (activeFilter === "available") {
      filtered = filtered.filter((m) => m.menteeCount < 10);
    }

    return filtered;
  }, [mentors, activeFilter]);

  const selectedMentor = useMemo(() => {
    return mentors.find((m) => m.id === selectedMentorId) || null;
  }, [mentors, selectedMentorId]);

  return (
    <div className="h-[calc(100vh-5rem)] lg:h-screen flex flex-col">
      {/* Page Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[var(--primitive-neutral-200)] bg-white shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-heading-sm font-bold text-foreground-default shrink-0">
            Mentorship
          </h1>
          <MentorshipTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "find" && (
          <div className="h-full flex">
            {/* Left Panel - Mentor List */}
            <div
              className={`w-full lg:w-[480px] flex-shrink-0 bg-white border-r border-[var(--primitive-neutral-200)] flex flex-col ${
                selectedMentorId ? "hidden lg:flex" : "flex"
              }`}
            >
              {/* Search & Filters */}
              <div className="px-6 py-4 border-b border-[var(--primitive-neutral-200)] bg-white space-y-3">
                <SearchInput
                  placeholder="Search mentors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="compact"
                />
                <MentorFilterPills
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div>

              {/* Error State */}
              {error && (
                <div className="px-4 py-3">
                  <Alert
                    variant="critical"
                    dismissible
                    onDismiss={() => setError(null)}
                  >
                    {error}
                  </Alert>
                </div>
              )}

              {/* Mentor List */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {loading ? (
                  <div>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <MentorListItemSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredMentors.length > 0 ? (
                  <div>
                    {filteredMentors.map((mentor, index) => (
                      <div
                        key={mentor.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <MentorListItem
                          mentor={mentor}
                          isSelected={mentor.id === selectedMentorId}
                          onClick={() => handleSelectMentor(mentor.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4">
                    <EmptyState
                      icon={
                        <GraduationCap
                          size={32}
                          className="text-foreground-muted"
                        />
                      }
                      title="No mentors found"
                      description={
                        searchQuery
                          ? "Try adjusting your search"
                          : "Check back soon!"
                      }
                      size="sm"
                      action={
                        searchQuery
                          ? {
                              label: "Clear search",
                              onClick: () => setSearchQuery(""),
                            }
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-[var(--primitive-neutral-200)] shrink-0">
                <p className="text-caption text-foreground-muted">
                  {filteredMentors.length} mentor
                  {filteredMentors.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            {/* Right Panel - Mentor Detail */}
            <div
              className={`flex-1 bg-background-subtle relative ${
                selectedMentorId
                  ? "flex flex-col"
                  : "hidden lg:flex lg:flex-col"
              }`}
            >
              {selectedMentorId && loading ? (
                <MentorDetailPanelSkeleton />
              ) : selectedMentor ? (
                <MentorDetailPanel
                  key={selectedMentor.id}
                  mentor={selectedMentor}
                  onSendIntro={handleSendIntro}
                  sending={sending === selectedMentor.accountId}
                  onBack={handleBackToList}
                />
              ) : (
                <EmptySelectionState />
              )}
            </div>
          </div>
        )}

        {activeTab === "my_mentors" && (
          <div className="h-full overflow-y-auto">
            <MyMentorsView />
          </div>
        )}

        {activeTab === "my_mentees" && (
          <div className="h-full overflow-y-auto">
            <MyMenteesView />
          </div>
        )}
      </div>
    </div>
  );
}

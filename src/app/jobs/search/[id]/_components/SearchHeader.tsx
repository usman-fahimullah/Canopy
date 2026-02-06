"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import { SearchBar } from "@/components/ui";

export function SearchHeader() {
  const router = useRouter();

  const handleSearch = useCallback(
    (search: string, location?: string) => {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (location?.trim()) params.set("location", location.trim());
      router.push(`/jobs/search?${params.toString()}`);
    },
    [router]
  );

  return (
    <PageHeader sticky showNotificationBell={false}>
      <SearchBar
        searchPlaceholder="Search by title, company name, etc."
        locationPlaceholder="City, state, or zip..."
        showLocation={true}
        buttonText="Search Jobs"
        onSearch={handleSearch}
        className="flex-1"
      />
    </PageHeader>
  );
}

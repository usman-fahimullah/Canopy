"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 2 minutes before background refetch
            staleTime: 2 * 60 * 1000,
            // Cache data for 5 minutes after component unmounts
            gcTime: 5 * 60 * 1000,
            // Don't refetch when window regains focus (reduces reloads)
            refetchOnWindowFocus: false,
            // Retry once on failure
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

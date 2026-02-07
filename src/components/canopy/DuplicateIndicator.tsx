"use client";

import React, { useEffect, useState, useCallback } from "react";
import { logger } from "@/lib/logger";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar } from "@/components/ui/avatar";
import { Warning } from "@phosphor-icons/react";

interface DuplicateCandidate {
  seekerId: string;
  name: string;
  email: string;
  applicationCount: number;
  jobs: string[];
}

interface DuplicateCheckResponse {
  data: {
    duplicates: DuplicateCandidate[];
    hasDuplicates: boolean;
  };
}

interface DuplicateIndicatorProps {
  candidateEmail: string;
}

// Simple cache to avoid repeated API calls
const duplicateCache = new Map<
  string,
  { data: DuplicateCheckResponse["data"]; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function DuplicateIndicator({ candidateEmail }: DuplicateIndicatorProps) {
  const [duplicates, setDuplicates] = useState<DuplicateCandidate[]>([]);
  const [hasDuplicates, setHasDuplicates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForDuplicates = useCallback(async () => {
    // Check cache first
    const cached = duplicateCache.get(candidateEmail);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setDuplicates(cached.data.duplicates);
      setHasDuplicates(cached.data.hasDuplicates);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        email: candidateEmail,
      });

      const response = await fetch(`/api/canopy/candidates/duplicates?${params}`);

      if (!response.ok) {
        throw new Error("Failed to check for duplicates");
      }

      const data: DuplicateCheckResponse = await response.json();

      // Cache the result
      duplicateCache.set(candidateEmail, {
        data: data.data,
        timestamp: Date.now(),
      });

      setDuplicates(data.data.duplicates);
      setHasDuplicates(data.data.hasDuplicates);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      logger.error("Failed to check for duplicate candidates", {
        error: message,
        email: candidateEmail,
      });
    } finally {
      setIsLoading(false);
    }
  }, [candidateEmail]);

  useEffect(() => {
    checkForDuplicates();
  }, [checkForDuplicates]);

  if (!hasDuplicates || isLoading) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-block">
          <Badge
            variant="warning"
            className="flex cursor-pointer items-center gap-1 transition-opacity hover:opacity-80"
          >
            <Warning size={14} weight="fill" />
            <span>Possible duplicate</span>
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <h4 className="text-foreground-default text-caption-strong font-semibold">
            Duplicate candidates found
          </h4>
          <p className="text-caption text-foreground-muted">
            {duplicates.length} candidate(s) with the same email address:
          </p>

          <div className="max-h-64 space-y-3 overflow-y-auto">
            {duplicates.map((dup) => (
              <div
                key={dup.seekerId}
                className="rounded-lg border border-border-muted bg-background-subtle p-3"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={dup.name} size="sm" className="flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground-default text-caption-strong font-semibold">
                      {dup.name}
                    </p>
                    <p className="break-all text-caption text-foreground-muted">{dup.email}</p>
                    <p className="mt-1 text-caption text-foreground-subtle">
                      {dup.applicationCount} application{dup.applicationCount !== 1 ? "s" : ""}
                    </p>
                    {dup.jobs.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {dup.jobs.slice(0, 2).map((job) => (
                          <p key={job} className="text-caption text-foreground-muted">
                            • {job}
                          </p>
                        ))}
                        {dup.jobs.length > 2 && (
                          <p className="text-caption text-foreground-subtle">
                            + {dup.jobs.length - 2} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-caption text-foreground-subtle">
            Consider merging these candidates to avoid duplicate records.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

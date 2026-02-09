"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { logger, formatError } from "@/lib/logger";

/**
 * Supabase Realtime hook for near-instant application stage updates.
 *
 * Subscribes to postgres_changes on the Application table filtered
 * by seekerId. When the employer moves a candidate through the pipeline,
 * the seeker's "Your Jobs" page updates without manual refresh.
 *
 * Pattern follows the existing `useMessages` hook in `src/hooks/use-messages.ts`.
 */

export interface ApplicationChangePayload {
  id: string;
  stage: string;
  seekerId: string;
  jobId: string;
  updatedAt: string;
  rejectedAt: string | null;
  hiredAt: string | null;
  offeredAt: string | null;
}

interface UseApplicationUpdatesOptions {
  /** The seeker profile ID to subscribe to */
  seekerId: string | null;
  /** Callback when an application stage changes */
  onStageChange?: (payload: ApplicationChangePayload) => void;
  /** Callback when a new application is created (e.g., via apply) */
  onNewApplication?: (payload: ApplicationChangePayload) => void;
  /** Called when the realtime connection state changes */
  onConnectionChange?: (connected: boolean) => void;
}

export function useApplicationUpdates({
  seekerId,
  onStageChange,
  onNewApplication,
  onConnectionChange,
}: UseApplicationUpdatesOptions) {
  const seekerIdRef = useRef(seekerId);
  const onStageChangeRef = useRef(onStageChange);
  const onNewApplicationRef = useRef(onNewApplication);
  const onConnectionChangeRef = useRef(onConnectionChange);

  // Keep refs in sync
  useEffect(() => {
    seekerIdRef.current = seekerId;
    onStageChangeRef.current = onStageChange;
    onNewApplicationRef.current = onNewApplication;
    onConnectionChangeRef.current = onConnectionChange;
  });

  useEffect(() => {
    if (!seekerId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`application-updates:${seekerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Application",
          filter: `seekerId=eq.${seekerId}`,
        },
        (payload) => {
          if (seekerIdRef.current !== seekerId) return;

          const record = payload.new as {
            id: string;
            stage: string;
            seekerId: string;
            jobId: string;
            updatedAt: string;
            rejectedAt: string | null;
            hiredAt: string | null;
            offeredAt: string | null;
          };

          logger.info("Application stage updated via Realtime", {
            applicationId: record.id,
            newStage: record.stage,
          });

          onStageChangeRef.current?.({
            id: record.id,
            stage: record.stage,
            seekerId: record.seekerId,
            jobId: record.jobId,
            updatedAt: record.updatedAt,
            rejectedAt: record.rejectedAt,
            hiredAt: record.hiredAt,
            offeredAt: record.offeredAt,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Application",
          filter: `seekerId=eq.${seekerId}`,
        },
        (payload) => {
          if (seekerIdRef.current !== seekerId) return;

          const record = payload.new as {
            id: string;
            stage: string;
            seekerId: string;
            jobId: string;
            updatedAt: string;
            rejectedAt: string | null;
            hiredAt: string | null;
            offeredAt: string | null;
          };

          logger.info("New application detected via Realtime", {
            applicationId: record.id,
            stage: record.stage,
          });

          onNewApplicationRef.current?.({
            id: record.id,
            stage: record.stage,
            seekerId: record.seekerId,
            jobId: record.jobId,
            updatedAt: record.updatedAt,
            rejectedAt: record.rejectedAt,
            hiredAt: record.hiredAt,
            offeredAt: record.offeredAt,
          });
        }
      )
      .subscribe((status) => {
        const connected = status === "SUBSCRIBED";
        onConnectionChangeRef.current?.(connected);

        if (status === "CHANNEL_ERROR") {
          logger.warn("Application Realtime channel error — falling back to polling", {
            seekerId,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [seekerId]);
}

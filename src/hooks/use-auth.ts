"use client";

import { useEffect, useState, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { logger, formatError } from "@/lib/logger";

export interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        logger.error("Error getting session", {
          error: formatError(error),
          endpoint: "hooks/use-auth",
        });
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Refresh server-side data only on meaningful auth changes.
      // TOKEN_REFRESHED fires periodically and must NOT trigger a full
      // page re-render — it causes visible loading-spinner flashes and
      // re-fetches all data across every mounted component.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // supabase client and router are stable across the component lifecycle.
    // Listing them causes the effect to re-run on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      logger.error("Error signing out", { error: formatError(error), endpoint: "hooks/use-auth" });
    }
  }, [supabase, router]);

  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.refreshSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      logger.error("Error refreshing session", {
        error: formatError(error),
        endpoint: "hooks/use-auth",
      });
    }
  }, [supabase]);

  return {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };
}

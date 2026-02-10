"use client";

import { Suspense } from "react";
import { AuthCard } from "../components/auth-card";

/**
 * Log In page — renders the shared AuthCard with the "login" tab active.
 *
 * The AuthCard handles in-place tab switching with crossfade transitions
 * so navigating between Sign Up ↔ Log In doesn't cause layout jumps.
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-3xl bg-[var(--card-background)] shadow-card" />
      }
    >
      <AuthCard />
    </Suspense>
  );
}

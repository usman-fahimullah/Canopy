"use client";

import { Suspense } from "react";
import { AuthCard } from "../components/auth-card";

/**
 * Sign Up page — renders the shared AuthCard with the "signup" tab active.
 *
 * The AuthCard handles in-place tab switching with crossfade transitions
 * so navigating between Sign Up ↔ Log In doesn't cause layout jumps.
 *
 * @figma https://www.figma.com/design/pYb1oVPjAokb91tZAEFQ1J/Green-Jobs-Board-2.0?node-id=714-9370
 */
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-3xl bg-[var(--card-background)] shadow-[var(--shadow-card)]" />
      }
    >
      <AuthCard />
    </Suspense>
  );
}

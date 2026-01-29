"use client";

import { redirect } from "next/navigation";

// Main entry redirects to dashboard
export default function CandidPage() {
  redirect("/candid/dashboard");
}

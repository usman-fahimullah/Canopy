"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MessagesLayout } from "@/components/messaging";

function EmployerMessagesContent() {
  return (
    <MessagesLayout
      basePath="/canopy/messages"
      emptyMessage="No conversations yet"
      emptyActionLabel="Browse Candidates"
      emptyActionHref="/canopy/candidates"
    />
  );
}

export default function EmployerMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] items-center justify-center lg:h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <EmployerMessagesContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MessagesLayout } from "@/components/messaging";

function CoachMessagesContent() {
  return (
    <MessagesLayout
      basePath="/coach/messages"
      emptyMessage="No client conversations yet"
      emptyActionLabel="View Clients"
      emptyActionHref="/coach/clients"
    />
  );
}

export default function CoachMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] lg:h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <CoachMessagesContent />
    </Suspense>
  );
}

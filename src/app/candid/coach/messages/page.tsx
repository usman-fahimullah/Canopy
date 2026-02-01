"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MessagesLayout } from "@/components/messaging";

function CoachMessagesContent() {
  return (
    <MessagesLayout
      basePath="/candid/coach/messages"
      emptyMessage="No client conversations yet"
      emptyActionLabel="View Clients"
      emptyActionHref="/candid/coach/clients"
    />
  );
}

export default function CoachMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] items-center justify-center lg:h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <CoachMessagesContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MessagesLayout } from "@/components/messaging";

function TalentMessagesContent() {
  return (
    <MessagesLayout
      basePath="/talent/messages"
      emptyMessage="No conversations yet"
      emptyActionLabel="Browse Jobs"
      emptyActionHref="/talent/jobs"
    />
  );
}

export default function TalentMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] lg:h-screen items-center justify-center">
          <Spinner size="lg" />
        </div>
      }
    >
      <TalentMessagesContent />
    </Suspense>
  );
}

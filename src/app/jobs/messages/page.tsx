"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { MessagesLayout } from "@/components/messaging";

function TalentMessagesContent() {
  return (
    <MessagesLayout
      basePath="/jobs/messages"
      emptyMessage="No conversations yet"
      emptyActionLabel="Browse Jobs"
      emptyActionHref="/jobs/search"
    />
  );
}

export default function TalentMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-5rem)] items-center justify-center lg:h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <TalentMessagesContent />
    </Suspense>
  );
}

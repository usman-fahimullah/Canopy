"use client";

import { Users } from "@phosphor-icons/react";

export function EmptySelectionState() {
  return (
    <div className="h-full flex items-center justify-center p-8 animate-fade-in">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-muted">
          <Users size={28} className="text-foreground-muted" />
        </div>
        <h2 className="text-heading-sm font-semibold text-foreground-default mb-2">
          Select a mentor
        </h2>
        <p className="text-body text-foreground-muted">
          Choose a mentor from the list to view their profile and send an intro
          message.
        </p>
      </div>
    </div>
  );
}

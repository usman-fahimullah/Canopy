"use client";

import { cn } from "@/lib/utils";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface DeviceFrameProps {
  mode: DeviceMode;
  children: React.ReactNode;
}

export function DeviceFrame({ mode, children }: DeviceFrameProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full transition-all duration-300 ease-in-out",
        mode === "tablet" && "max-w-[768px]",
        mode === "mobile" && "max-w-[375px]",
        mode !== "desktop" &&
          "rounded-2xl border border-[var(--border-default)] bg-[var(--background-default)] shadow-[var(--shadow-elevated)]"
      )}
    >
      {children}
    </div>
  );
}

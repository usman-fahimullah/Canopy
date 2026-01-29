"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Warning, Info } from "@/components/Icons";

type StatusType = "ready" | "beta" | "alpha" | "deprecated" | "new" | "experimental";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    icon?: React.ReactNode;
    className: string;
  }
> = {
  ready: {
    label: "Ready",
    icon: <Check className="w-3 h-3" />,
    className: "bg-primary-100 text-primary-800 border-primary-200",
  },
  beta: {
    label: "Beta",
    icon: <Info className="w-3 h-3" />,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  alpha: {
    label: "Alpha",
    icon: <Info className="w-3 h-3" />,
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  deprecated: {
    label: "Deprecated",
    icon: <Warning className="w-3 h-3" />,
    className: "bg-red-100 text-red-700 border-red-200",
  },
  new: {
    label: "New",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  experimental: {
    label: "Experimental",
    icon: <Info className="w-3 h-3" />,
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-caption-sm font-medium",
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// Component header with title and status
interface ComponentHeaderProps {
  title: string;
  status?: StatusType;
  description?: string;
  className?: string;
}

export function ComponentHeader({
  title,
  status,
  description,
  className,
}: ComponentHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-heading-md font-bold text-foreground">{title}</h1>
        {status && <StatusBadge status={status} />}
      </div>
      {description && (
        <p className="text-body text-foreground-muted max-w-2xl">{description}</p>
      )}
    </div>
  );
}

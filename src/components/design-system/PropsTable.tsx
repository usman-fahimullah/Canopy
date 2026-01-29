"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropDefinition[];
  className?: string;
}

export function PropsTable({ props, className }: PropsTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 pr-4 text-caption-sm font-semibold text-foreground-muted">
              Prop
            </th>
            <th className="py-3 px-4 text-caption-sm font-semibold text-foreground-muted">
              Type
            </th>
            <th className="py-3 px-4 text-caption-sm font-semibold text-foreground-muted">
              Default
            </th>
            <th className="py-3 pl-4 text-caption-sm font-semibold text-foreground-muted">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr
              key={prop.name}
              className="border-b border-border-subtle last:border-0"
            >
              <td className="py-3 pr-4 align-top">
                <code className="text-caption font-mono text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded">
                  {prop.name}
                </code>
                {prop.required && (
                  <span className="ml-1.5 text-caption-sm text-red-500">*</span>
                )}
              </td>
              <td className="py-3 px-4 align-top">
                <code className="text-caption-sm font-mono text-foreground-muted bg-background-muted px-1.5 py-0.5 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="py-3 px-4 align-top">
                {prop.default ? (
                  <code className="text-caption-sm font-mono text-foreground-subtle">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-caption-sm text-foreground-subtle">—</span>
                )}
              </td>
              <td className="py-3 pl-4 align-top text-caption text-foreground-muted">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Compact variant for smaller spaces
interface PropsListProps {
  props: PropDefinition[];
  className?: string;
}

export function PropsList({ props, className }: PropsListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {props.map((prop) => (
        <div
          key={prop.name}
          className="p-3 bg-background-subtle rounded-lg border border-border"
        >
          <div className="flex items-center gap-2 mb-1">
            <code className="text-caption font-mono font-medium text-primary-700">
              {prop.name}
            </code>
            <code className="text-caption-sm font-mono text-foreground-subtle">
              {prop.type}
            </code>
            {prop.required && (
              <span className="text-caption-sm text-red-500 font-medium">
                required
              </span>
            )}
          </div>
          <p className="text-caption-sm text-foreground-muted">{prop.description}</p>
          {prop.default && (
            <p className="text-caption-sm text-foreground-subtle mt-1">
              Default: <code className="font-mono">{prop.default}</code>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

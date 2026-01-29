"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropTableProps {
  props: PropDefinition[];
  className?: string;
}

export function PropTable({ props, className }: PropTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Prop</th>
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Type</th>
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Default</th>
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border-subtle hover:bg-background-muted">
              <td className="py-3 px-4">
                <code className="text-caption font-mono text-primary-700 bg-primary-100 px-1.5 py-0.5 rounded">
                  {prop.name}
                </code>
                {prop.required && (
                  <Badge variant="critical" size="sm" className="ml-2">
                    Required
                  </Badge>
                )}
              </td>
              <td className="py-3 px-4">
                <code className="text-caption font-mono text-foreground-muted bg-background-muted px-1.5 py-0.5 rounded">
                  {prop.type}
                </code>
              </td>
              <td className="py-3 px-4 text-caption text-foreground-muted">
                {prop.default ? (
                  <code className="font-mono bg-background-muted px-1.5 py-0.5 rounded">
                    {prop.default}
                  </code>
                ) : (
                  <span className="text-foreground-subtle">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-caption text-foreground-muted">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface VariantTableProps {
  variants: {
    name: string;
    description: string;
    preview?: React.ReactNode;
  }[];
  className?: string;
}

export function VariantTable({ variants, className }: VariantTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Variant</th>
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Preview</th>
            <th className="py-3 px-4 text-caption-strong text-foreground-muted">Description</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.name} className="border-b border-border-subtle hover:bg-background-muted">
              <td className="py-3 px-4">
                <code className="text-caption font-mono text-primary-700 bg-primary-100 px-1.5 py-0.5 rounded">
                  {variant.name}
                </code>
              </td>
              <td className="py-3 px-4">{variant.preview}</td>
              <td className="py-3 px-4 text-caption text-foreground-muted">{variant.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

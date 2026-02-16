"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@/components/ui";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface DepartmentOption {
  id: string;
  name: string;
  parentId: string | null;
  color: string | null;
}

interface TreeOption extends DepartmentOption {
  depth: number;
}

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function buildFlatTree(departments: DepartmentOption[]): TreeOption[] {
  const byParent = new Map<string | null, DepartmentOption[]>();
  for (const dept of departments) {
    const key = dept.parentId ?? "__root__";
    const list = byParent.get(key) ?? [];
    list.push(dept);
    byParent.set(key, list);
  }

  const result: TreeOption[] = [];

  function walk(parentId: string | null, depth: number) {
    const key = parentId ?? "__root__";
    const children = byParent.get(key) ?? [];
    for (const child of children) {
      result.push({ ...child, depth });
      walk(child.id, depth + 1);
    }
  }

  walk(null, 0);
  return result;
}

const COLOR_DOT: Record<string, string> = {
  green: "bg-[var(--primitive-green-500)]",
  blue: "bg-[var(--primitive-blue-500)]",
  purple: "bg-[var(--primitive-purple-500)]",
  orange: "bg-[var(--primitive-orange-500)]",
  red: "bg-[var(--primitive-red-500)]",
  yellow: "bg-[var(--primitive-yellow-500)]",
  neutral: "bg-[var(--primitive-neutral-500)]",
};

/* -------------------------------------------------------------------
   Component
   ------------------------------------------------------------------- */

export interface DepartmentPickerProps {
  /** Currently selected department ID */
  value: string | null;
  /** Called when a department is selected or cleared */
  onChange: (departmentId: string | null) => void;
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Show "None" option to clear selection */
  allowNone?: boolean;
  /** Label for the none option */
  noneLabel?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Pre-loaded departments (skip fetch) */
  departments?: DepartmentOption[];
}

export function DepartmentPicker({
  value,
  onChange,
  placeholder = "Select department",
  allowNone = true,
  noneLabel = "None",
  disabled = false,
  departments: externalDepartments,
}: DepartmentPickerProps) {
  const [departments, setDepartments] = useState<DepartmentOption[]>(externalDepartments ?? []);
  const [loading, setLoading] = useState(!externalDepartments);
  const [error, setError] = useState(false);

  // Fetch departments if not provided externally
  useEffect(() => {
    if (externalDepartments) {
      setDepartments(externalDepartments);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    async function fetchDepartments() {
      try {
        setError(false);
        const res = await fetch("/api/canopy/departments");
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setDepartments(
              (data.departments ?? []).map((d: DepartmentOption & Record<string, unknown>) => ({
                id: d.id,
                name: d.name,
                parentId: d.parentId,
                color: d.color,
              }))
            );
          }
        } else if (!cancelled) {
          setError(true);
        }
      } catch (err) {
        logger.error("DepartmentPicker fetch error", {
          error: formatError(err),
        });
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDepartments();
    return () => {
      cancelled = true;
    };
  }, [externalDepartments]);

  const treeOptions = useMemo(() => buildFlatTree(departments), [departments]);

  const handleChange = useCallback(
    (val: string) => {
      onChange(val === "__none__" ? null : val);
    },
    [onChange]
  );

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-[var(--radius-input)] border border-[var(--border-error)] bg-[var(--background-error)] px-3 py-2">
        <span className="text-caption text-[var(--foreground-error)]">
          Failed to load departments
        </span>
      </div>
    );
  }

  return (
    <Dropdown
      value={value ?? "__none__"}
      onValueChange={handleChange}
      disabled={disabled || loading}
    >
      <DropdownTrigger>
        <DropdownValue placeholder={loading ? "Loading..." : placeholder} />
      </DropdownTrigger>
      <DropdownContent>
        {allowNone && (
          <>
            <DropdownItem value="__none__">
              <span className="text-[var(--foreground-muted)]">{noneLabel}</span>
            </DropdownItem>
            {treeOptions.length > 0 && <DropdownSeparator />}
          </>
        )}
        {treeOptions.map((opt) => (
          <DropdownItem key={opt.id} value={opt.id}>
            <span
              className="flex items-center gap-2"
              style={{ paddingLeft: `${opt.depth * 16}px` }}
            >
              {/* Primitive tokens used here intentionally — department colors
                  are user-configured values that don't map to semantic tokens */}
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  COLOR_DOT[opt.color ?? ""] ?? "bg-[var(--primitive-neutral-400)]"
                }`}
              />
              {opt.name}
            </span>
          </DropdownItem>
        ))}
        {treeOptions.length === 0 && !loading && (
          <div className="px-3 py-2 text-caption text-[var(--foreground-muted)]">
            No departments found
          </div>
        )}
      </DropdownContent>
    </Dropdown>
  );
}

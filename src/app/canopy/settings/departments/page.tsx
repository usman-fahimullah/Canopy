"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Spinner,
  Skeleton,
  Avatar,
  Badge,
  FormCard,
  FormSection,
  FormField,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
  TruncateText,
  Toast,
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
  EmptyState,
} from "@/components/ui";
import {
  Plus,
  TreeStructure,
  PencilSimple,
  Trash,
  CaretRight,
  CaretDown,
  UsersThree,
  Briefcase,
  UserCircle,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

interface DepartmentHead {
  id: string;
  title: string | null;
  account: { name: string | null; avatar: string | null };
}

interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  displayOrder: number;
  parentId: string | null;
  headId: string | null;
  head: DepartmentHead | null;
  _count: {
    members: number;
    jobs: number;
    children: number;
  };
}

type DepartmentColor = "green" | "blue" | "purple" | "orange" | "red" | "yellow" | "neutral";

interface DepartmentFormData {
  name: string;
  description: string;
  color: DepartmentColor | "";
  parentId: string;
}

/* -------------------------------------------------------------------
   Color Config
   ------------------------------------------------------------------- */

const COLOR_OPTIONS: { value: DepartmentColor; label: string; dot: string }[] = [
  {
    value: "green",
    label: "Green",
    dot: "bg-[var(--primitive-green-500)]",
  },
  { value: "blue", label: "Blue", dot: "bg-[var(--primitive-blue-500)]" },
  {
    value: "purple",
    label: "Purple",
    dot: "bg-[var(--primitive-purple-500)]",
  },
  {
    value: "orange",
    label: "Orange",
    dot: "bg-[var(--primitive-orange-500)]",
  },
  { value: "red", label: "Red", dot: "bg-[var(--primitive-red-500)]" },
  {
    value: "yellow",
    label: "Yellow",
    dot: "bg-[var(--primitive-yellow-500)]",
  },
  {
    value: "neutral",
    label: "Neutral",
    dot: "bg-[var(--primitive-neutral-500)]",
  },
];

function colorDotClass(color: string | null): string {
  return COLOR_OPTIONS.find((c) => c.value === color)?.dot ?? "bg-[var(--primitive-neutral-400)]";
}

/* -------------------------------------------------------------------
   Tree Builder
   ------------------------------------------------------------------- */

interface TreeNode extends Department {
  children: TreeNode[];
  depth: number;
}

function buildTree(departments: Department[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Create nodes
  for (const dept of departments) {
    map.set(dept.id, { ...dept, children: [], depth: 0 });
  }

  // Build hierarchy
  for (const dept of departments) {
    const node = map.get(dept.id)!;
    if (dept.parentId && map.has(dept.parentId)) {
      const parent = map.get(dept.parentId)!;
      node.depth = parent.depth + 1;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort children by displayOrder
  function sortChildren(nodes: TreeNode[]) {
    nodes.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
    for (const node of nodes) sortChildren(node.children);
  }
  sortChildren(roots);

  return roots;
}

/* -------------------------------------------------------------------
   Skeleton
   ------------------------------------------------------------------- */

function DepartmentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-36 rounded-lg" />
      </div>
      <div className="space-y-3 rounded-2xl border border-[var(--border-default)] p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3"
          >
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-5 w-32" />
            <div className="ml-auto flex items-center gap-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Department Row
   ------------------------------------------------------------------- */

function DepartmentRow({
  node,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  node: TreeNode;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expanded.has(node.id);

  return (
    <>
      <div
        className="group flex items-center gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3 transition-colors hover:bg-[var(--background-interactive-hover)]"
        style={{ marginLeft: `${node.depth * 24}px` }}
      >
        {/* Expand/collapse */}
        <button
          type="button"
          onClick={() => hasChildren && onToggle(node.id)}
          className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
            hasChildren
              ? "text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
              : "text-transparent"
          }`}
          aria-label={isExpanded ? "Collapse" : "Expand"}
          disabled={!hasChildren}
        >
          {hasChildren &&
            (isExpanded ? (
              <CaretDown size={14} weight="bold" />
            ) : (
              <CaretRight size={14} weight="bold" />
            ))}
        </button>

        {/* Color dot */}
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${colorDotClass(node.color)}`} />

        {/* Name */}
        <div className="min-w-0 flex-1">
          <TruncateText className="text-body-sm font-medium text-[var(--foreground-default)]">
            {node.name}
          </TruncateText>
        </div>

        {/* Head avatar */}
        {node.head && (
          <div className="flex items-center gap-1.5">
            <Avatar
              src={node.head.account.avatar ?? undefined}
              name={node.head.account.name ?? undefined}
              size="xs"
            />
            <span className="hidden text-caption text-foreground-muted sm:inline">
              {node.head.account.name}
            </span>
          </div>
        )}

        {/* Counts */}
        <div className="flex items-center gap-3 text-caption text-foreground-muted">
          <span className="flex items-center gap-1" title="Members">
            <UsersThree size={14} />
            {node._count.members}
          </span>
          <span className="flex items-center gap-1" title="Jobs">
            <Briefcase size={14} />
            {node._count.jobs}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit(node)}
            className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-interactive-hover)] hover:text-[var(--foreground-default)]"
            aria-label={`Edit ${node.name}`}
          >
            <PencilSimple size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(node)}
            className="rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]"
            aria-label={`Delete ${node.name}`}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>

      {/* Render children if expanded */}
      {isExpanded &&
        node.children.map((child) => (
          <DepartmentRow
            key={child.id}
            node={child}
            expanded={expanded}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
    </>
  );
}

/* -------------------------------------------------------------------
   Create / Edit Modal
   ------------------------------------------------------------------- */

function DepartmentFormModal({
  open,
  onOpenChange,
  department,
  departments,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null; // null = create
  departments: Department[];
  onSaved: () => void;
}) {
  const isEdit = !!department;
  const [form, setForm] = useState<DepartmentFormData>({
    name: "",
    description: "",
    color: "",
    parentId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      if (department) {
        setForm({
          name: department.name,
          description: department.description ?? "",
          color: (department.color as DepartmentColor) ?? "",
          parentId: department.parentId ?? "",
        });
      } else {
        setForm({ name: "", description: "", color: "", parentId: "" });
      }
      setError(null);
    }
  }, [open, department]);

  // Filter valid parents (can't be self or descendant for edit)
  const parentOptions = useMemo(() => {
    if (!isEdit) return departments;
    // Exclude self and descendants
    const excludeIds = new Set<string>([department.id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const d of departments) {
        if (d.parentId && excludeIds.has(d.parentId) && !excludeIds.has(d.id)) {
          excludeIds.add(d.id);
          changed = true;
        }
      }
    }
    return departments.filter((d) => !excludeIds.has(d.id));
  }, [departments, department, isEdit]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError("Department name is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        color: form.color || undefined,
        parentId: form.parentId || undefined,
      };

      const url = isEdit ? `/api/canopy/departments/${department.id}` : "/api/canopy/departments";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save department");
      }

      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{isEdit ? "Edit Department" : "Create Department"}</ModalTitle>
          <ModalDescription>
            {isEdit
              ? "Update department details and hierarchy."
              : "Add a new department to your organization."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}

            <FormField label="Name" required>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Engineering"
                autoFocus
              />
            </FormField>

            <FormField label="Description">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="What this department does..."
                rows={2}
              />
            </FormField>

            <FormField label="Color">
              <Dropdown
                value={form.color}
                onValueChange={(val) =>
                  setForm((prev) => ({
                    ...prev,
                    color: val as DepartmentColor,
                  }))
                }
              >
                <DropdownTrigger>
                  <DropdownValue placeholder="Select a color" />
                </DropdownTrigger>
                <DropdownContent>
                  {COLOR_OPTIONS.map((opt) => (
                    <DropdownItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${opt.dot}`} />
                        {opt.label}
                      </span>
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </FormField>

            <FormField label="Parent Department">
              <Dropdown
                value={form.parentId}
                onValueChange={(val) => setForm((prev) => ({ ...prev, parentId: val }))}
              >
                <DropdownTrigger>
                  <DropdownValue placeholder="None (top-level)" />
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="">None (top-level)</DropdownItem>
                  {parentOptions.map((d) => (
                    <DropdownItem key={d.id} value={d.id}>
                      {d.name}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </FormField>
          </div>
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <Button variant="tertiary" disabled={saving}>
              Cancel
            </Button>
          </ModalClose>
          <Button variant="primary" onClick={handleSave} loading={saving}>
            {isEdit ? "Save Changes" : "Create Department"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* -------------------------------------------------------------------
   Delete Confirmation Modal
   ------------------------------------------------------------------- */

function DeleteDepartmentModal({
  open,
  onOpenChange,
  department,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setError(null);
  }, [open]);

  const handleDelete = async () => {
    if (!department) return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/canopy/departments/${department.id}`, {
        method: "DELETE",
      });

      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete department");
      }

      onDeleted();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(false);
    }
  };

  if (!department) return null;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Delete {department.name}?</ModalTitle>
          <ModalDescription>
            This will permanently remove the department. Members and jobs assigned to this
            department will be unlinked. Child departments will be moved to the parent level.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          {error && <p className="text-caption text-[var(--foreground-error)]">{error}</p>}

          {(department._count.members > 0 || department._count.jobs > 0) && (
            <div className="rounded-lg border border-[var(--border-default)] bg-[var(--background-subtle)] p-4">
              <p className="text-caption text-foreground-muted">This department currently has:</p>
              <ul className="mt-2 space-y-1 text-body-sm text-[var(--foreground-default)]">
                {department._count.members > 0 && (
                  <li>
                    {department._count.members} member
                    {department._count.members !== 1 ? "s" : ""} (will become unassigned)
                  </li>
                )}
                {department._count.jobs > 0 && (
                  <li>
                    {department._count.jobs} job
                    {department._count.jobs !== 1 ? "s" : ""} (will become unassigned)
                  </li>
                )}
              </ul>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <ModalClose asChild>
            <Button variant="tertiary" disabled={deleting}>
              Cancel
            </Button>
          </ModalClose>
          <Button variant="destructive" onClick={handleDelete} loading={deleting}>
            Delete Department
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

/* -------------------------------------------------------------------
   Main Page
   ------------------------------------------------------------------- */

export default function DepartmentsSettingsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingDept, setDeletingDept] = useState<Department | null>(null);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch("/api/canopy/departments");
      if (!res.ok) throw new Error("Failed to load departments");
      const data = await res.json();
      setDepartments(data.departments ?? []);
      setError(null);
    } catch (err) {
      setError("Failed to load departments");
      logger.error("Fetch departments error", { error: formatError(err) });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const tree = useMemo(() => buildTree(departments), [departments]);

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleEdit = useCallback((dept: Department) => {
    setEditingDept(dept);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((dept: Department) => {
    setDeletingDept(dept);
    setDeleteOpen(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingDept(null);
    setFormOpen(true);
  }, []);

  const handleSaved = useCallback(() => {
    fetchDepartments();
    setToast({
      message: editingDept ? "Department updated" : "Department created",
      variant: "success",
    });
  }, [fetchDepartments, editingDept]);

  const handleDeleted = useCallback(() => {
    fetchDepartments();
    setToast({ message: "Department deleted", variant: "success" });
  }, [fetchDepartments]);

  if (loading) return <DepartmentsSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Departments
        </h2>
        <Button variant="primary" size="sm" onClick={handleCreate}>
          <Plus size={16} weight="bold" />
          Add Department
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-[var(--border-error)] bg-[var(--background-error)] px-4 py-3">
          <p className="text-body-sm text-[var(--foreground-error)]">{error}</p>
          <Button variant="tertiary" size="sm" className="mt-2" onClick={fetchDepartments}>
            Try again
          </Button>
        </div>
      )}

      {/* Department Tree */}
      {departments.length === 0 && !error ? (
        <FormCard>
          <EmptyState
            icon={<TreeStructure size={48} />}
            title="No departments yet"
            description="Organize your team into departments and teams. Members and jobs can be assigned to departments for scoped access."
            action={{
              label: "Create your first department",
              onClick: handleCreate,
              icon: <Plus size={16} weight="bold" />,
            }}
          />
        </FormCard>
      ) : (
        <FormCard>
          <p className="mb-3 text-caption text-foreground-muted">
            {departments.length} department
            {departments.length !== 1 ? "s" : ""}
          </p>
          <div className="space-y-2">
            {tree.map((node) => (
              <DepartmentRow
                key={node.id}
                node={node}
                expanded={expanded}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </FormCard>
      )}

      {/* Modals */}
      <DepartmentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        department={editingDept}
        departments={departments}
        onSaved={handleSaved}
      />

      <DeleteDepartmentModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        department={deletingDept}
        onDeleted={handleDeleted}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[var(--z-toast)]">
          <Toast
            variant={toast.variant}
            dismissible
            autoDismiss={4000}
            onDismiss={() => setToast(null)}
          >
            {toast.message}
          </Toast>
        </div>
      )}
    </div>
  );
}

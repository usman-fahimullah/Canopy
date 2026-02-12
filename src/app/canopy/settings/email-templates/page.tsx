"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownValue,
} from "@/components/ui/dropdown";
import { Plus, WarningCircle, Eye } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

type TemplateType = "REJECTION" | "INTERVIEW_INVITE" | "OFFER" | "APPLICATION_ACK";

interface EmailTemplate {
  id: string;
  name: string;
  type: TemplateType;
  subject: string;
  content?: string;
  body?: string;
  createdAt: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const TEMPLATE_TYPE_LABELS: Record<TemplateType, { label: string; color: string }> = {
  REJECTION: { label: "Rejection", color: "error" },
  INTERVIEW_INVITE: { label: "Interview Invite", color: "info" },
  OFFER: { label: "Offer", color: "success" },
  APPLICATION_ACK: { label: "Application Acknowledgment", color: "warning" },
};

const TEMPLATE_TYPE_OPTIONS = Object.entries(TEMPLATE_TYPE_LABELS).map(([value, { label }]) => ({
  value,
  label,
}));

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<TemplateType>("REJECTION");
  const [formSubject, setFormSubject] = useState("");
  const [formContent, setFormContent] = useState("");

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/canopy/email-templates");
      if (!res.ok) {
        throw new Error("Failed to fetch email templates");
      }
      const data = await res.json();
      // API returns { data: [...] } not { templates: [...] }
      setTemplates(data.data || data.templates || []);
    } catch (err) {
      const message = formatError(err);
      logger.error("Failed to fetch email templates", { error: message });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Create template
  const handleCreate = useCallback(async () => {
    if (!formName.trim() || !formSubject.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/canopy/email-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          type: formType,
          subject: formSubject,
          content: formContent,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create template");
      }
      setCreateModalOpen(false);
      resetForm();
      fetchTemplates();
    } catch (err) {
      logger.error("Failed to create email template", { error: formatError(err) });
    } finally {
      setIsSaving(false);
    }
  }, [formName, formType, formSubject, formContent, fetchTemplates]);

  // Update template
  const handleUpdate = useCallback(async () => {
    if (!editingTemplate || !formName.trim() || !formSubject.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/canopy/email-templates/${editingTemplate.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          subject: formSubject,
          content: formContent,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update template");
      }
      setEditingTemplate(null);
      resetForm();
      fetchTemplates();
    } catch (err) {
      logger.error("Failed to update email template", { error: formatError(err) });
    } finally {
      setIsSaving(false);
    }
  }, [editingTemplate, formName, formSubject, formContent, fetchTemplates]);

  const resetForm = () => {
    setFormName("");
    setFormType("REJECTION");
    setFormSubject("");
    setFormContent("");
  };

  const openEditModal = (template: EmailTemplate) => {
    setFormName(template.name);
    setFormType(template.type);
    setFormSubject(template.subject);
    setFormContent(template.content || template.body || "");
    setEditingTemplate(template);
  };

  const openCreateModal = (type?: TemplateType) => {
    resetForm();
    if (type) setFormType(type);
    setCreateModalOpen(true);
  };

  // Group templates by type
  const templatesByType = Object.keys(TEMPLATE_TYPE_LABELS).reduce(
    (acc, type) => {
      acc[type as TemplateType] = templates.filter((t) => t.type === type);
      return acc;
    },
    {} as Record<TemplateType, EmailTemplate[]>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Email Templates
        </h2>
        <Button variant="primary" size="sm" onClick={() => openCreateModal()}>
          <Plus size={16} weight="bold" />
          Create Template
        </Button>
      </div>

      <p className="text-body text-[var(--foreground-muted)]">
        Create and manage email templates for candidate communications
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="border-l-4 border-l-[var(--border-error)]">
          <div className="flex gap-4 p-6">
            <WarningCircle size={24} className="shrink-0 text-[var(--foreground-error)]" />
            <div>
              <p className="font-medium text-[var(--foreground-error)]">Failed to load templates</p>
              <p className="mt-1 text-sm text-[var(--foreground-muted)]">{error}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={fetchTemplates}>
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Content State */}
      {!isLoading && !error && (
        <div className="space-y-8">
          {Object.entries(TEMPLATE_TYPE_LABELS).map(([type, { label, color }]) => {
            const typeTemplates = templatesByType[type as TemplateType];

            return (
              <div key={type}>
                <h2 className="mb-4 text-heading-sm font-semibold text-[var(--foreground-default)]">
                  {label}
                </h2>

                {typeTemplates.length === 0 ? (
                  <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-8 text-center">
                    <p className="text-body text-[var(--foreground-muted)]">
                      No {label} templates yet
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                      onClick={() => openCreateModal(type as TemplateType)}
                    >
                      <Plus size={16} />
                      Create Template
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {typeTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="group cursor-pointer transition-colors hover:border-[var(--border-emphasis)]"
                      >
                        <div className="flex flex-col gap-3 p-6">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-2 text-body-strong font-semibold text-[var(--foreground-default)] group-hover:text-[var(--foreground-brand)]">
                              {template.name}
                            </h3>
                            <Badge
                              variant={color as "error" | "info" | "success" | "warning"}
                              className="shrink-0"
                            >
                              {label}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-caption font-medium uppercase text-[var(--foreground-subtle)]">
                              Subject
                            </p>
                            <p className="mt-1 line-clamp-2 text-caption text-[var(--foreground-muted)]">
                              {template.subject}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="flex-1"
                              onClick={() => openEditModal(template)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="tertiary"
                              size="sm"
                              className="flex-1"
                              onClick={() => setPreviewTemplate(template)}
                            >
                              <Eye size={14} />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state if no templates at all */}
          {templates.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-body text-[var(--foreground-muted)]">
                No email templates found. Create your first template to get started.
              </p>
              <Button
                variant="primary"
                size="lg"
                className="mt-6"
                onClick={() => openCreateModal()}
              >
                <Plus size={18} />
                Create First Template
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={createModalOpen || !!editingTemplate}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditingTemplate(null);
            resetForm();
          }
        }}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle>{editingTemplate ? "Edit Template" : "Create Template"}</ModalTitle>
          </ModalHeader>

          <div className="space-y-4 px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Standard Rejection"
              />
            </div>

            {!editingTemplate && (
              <div className="space-y-2">
                <Label>Template Type</Label>
                <Dropdown value={formType} onValueChange={(v) => setFormType(v as TemplateType)}>
                  <DropdownTrigger className="w-full">
                    <DropdownValue placeholder="Select type" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {TEMPLATE_TYPE_OPTIONS.map((opt) => (
                      <DropdownItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </DropdownItem>
                    ))}
                  </DropdownContent>
                </Dropdown>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="template-subject">Subject Line</Label>
              <Input
                id="template-subject"
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                placeholder="e.g. Update on your application"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-content">Email Body</Label>
              <Textarea
                id="template-content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Write your email template content..."
                rows={8}
              />
              <p className="text-caption text-[var(--foreground-muted)]">
                Use {"{{candidateName}}"}, {"{{jobTitle}}"}, {"{{companyName}}"} as variables.
              </p>
            </div>
          </div>

          <ModalFooter>
            <Button
              variant="tertiary"
              onClick={() => {
                setCreateModalOpen(false);
                setEditingTemplate(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={editingTemplate ? handleUpdate : handleCreate}
              loading={isSaving}
              disabled={!formName.trim() || !formSubject.trim()}
            >
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Preview Modal */}
      <Modal open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Preview: {previewTemplate?.name}</ModalTitle>
          </ModalHeader>

          <div className="space-y-4 px-6 py-4">
            <div>
              <p className="text-caption font-medium uppercase text-[var(--foreground-subtle)]">
                Subject
              </p>
              <p className="mt-1 text-body text-[var(--foreground-default)]">
                {previewTemplate?.subject}
              </p>
            </div>

            <div>
              <p className="text-caption font-medium uppercase text-[var(--foreground-subtle)]">
                Body
              </p>
              <div className="mt-2 whitespace-pre-wrap rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-4 text-body-sm text-[var(--foreground-default)]">
                {previewTemplate?.content || previewTemplate?.body || "No content"}
              </div>
            </div>
          </div>

          <ModalFooter>
            <Button variant="tertiary" onClick={() => setPreviewTemplate(null)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

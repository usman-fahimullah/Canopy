"use client";

import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Plus, WarningCircle } from "@phosphor-icons/react";
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
  body: string;
  createdAt: string;
  updatedAt: string;
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

/* -------------------------------------------------------------------
   Main Component
   ------------------------------------------------------------------- */

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setTemplates(data.templates || []);
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
      {/* Page Header */}
      <PageHeader
        title="Email Templates"
        actions={[
          <Button key="create" variant="primary" leftIcon={<Plus size={18} />}>
            Create Template
          </Button>,
        ]}
      />

      <div className="px-8 py-2 lg:px-12">
        <p className="text-body text-[var(--foreground-muted)]">
          Create and manage email templates for candidate communications
        </p>
      </div>

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
                    <p className="text-body text-[var(--foreground-muted)]">No {label} templates yet</p>
                    <Button variant="secondary" size="sm" className="mt-4" leftIcon={<Plus size={16} />}>
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
                            <h3 className="text-body-strong font-semibold text-[var(--foreground-default)] line-clamp-2 group-hover:text-[var(--foreground-brand)]">
                              {template.name}
                            </h3>
                            <Badge variant={color as any} className="shrink-0">
                              {label}
                            </Badge>
                          </div>

                          <div>
                            <p className="text-caption font-medium text-[var(--foreground-subtle)] uppercase">
                              Subject
                            </p>
                            <p className="mt-1 text-caption text-[var(--foreground-muted)] line-clamp-2">
                              {template.subject}
                            </p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="secondary" size="sm" className="flex-1">
                              Edit
                            </Button>
                            <Button variant="tertiary" size="sm" className="flex-1">
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
              <Button variant="primary" size="lg" leftIcon={<Plus size={18} />} className="mt-6">
                Create First Template
              </Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Banner } from "@/components/ui/banner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import { ArrowLeft, FloppyDisk, Trash } from "@phosphor-icons/react";
import { toast } from "sonner";
import { logger, formatError } from "@/lib/logger";

export default function TemplateEditPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [name, setName] = React.useState("");
  const [activeFields, setActiveFields] = React.useState<string[]>([]);
  const [fieldData, setFieldData] = React.useState<Record<string, unknown>>({});

  // Fetch template data
  React.useEffect(() => {
    async function fetchTemplate() {
      try {
        const res = await fetch(`/api/canopy/templates/${templateId}`);
        if (!res.ok) throw new Error("Template not found");
        const data = await res.json();
        const template = data.template;
        setName(template.name);
        setActiveFields(template.activeFields || []);
        setFieldData(template.fieldData || {});
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load template";
        logger.error("Error loading template", { error: formatError(err) });
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/canopy/templates/${templateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save template");
      }

      toast.success("Template saved");
      router.push("/canopy/roles");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save";
      logger.error("Error saving template", { error: formatError(err) });
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const res = await fetch(`/api/canopy/templates/${templateId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete template");
      toast.success("Template deleted");
      router.push("/canopy/roles");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      logger.error("Error deleting template", { error: formatError(err) });
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-12 py-6">
        <Banner type="critical" title={error} />
        <div className="mt-4">
          <Link href="/canopy/roles">
            <Button variant="ghost">
              <ArrowLeft size={18} weight="bold" />
              Back to Roles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const FIELD_LABELS: Record<string, string> = {
    title: "Job Title",
    climateCategory: "Climate Category",
    employmentType: "Employment Type",
    experienceLevel: "Experience Level",
    educationLevel: "Education Level",
    description: "Job Description",
    responsibilities: "Responsibilities",
    qualifications: "Qualifications & Skills",
    specialEducation: "Special Education",
  };

  return (
    <div>
      <PageHeader
        title="Edit Template"
        actions={
          <div className="flex items-center gap-3">
            <Link href="/canopy/roles">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} weight="bold" />
                Back to Roles
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash size={18} weight="bold" />
              Delete
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Spinner size="sm" /> : <FloppyDisk size={18} weight="bold" />}
              Save Template
            </Button>
          </div>
        }
      />

      <div className="mx-auto max-w-3xl space-y-6 px-8 py-8">
        <FormCard>
          <FormSection title="Template Details">
            <FormField label="Template Name" required>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Template name"
                inputSize="lg"
              />
            </FormField>
          </FormSection>
        </FormCard>

        <FormCard>
          <FormSection title="Included Fields">
            <p className="text-caption text-[var(--foreground-muted)]">
              These fields are included when this template is used to create a new role.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {activeFields.map((field) => (
                <Badge key={field} variant="info" size="sm">
                  {FIELD_LABELS[field] || field}
                </Badge>
              ))}
              {activeFields.length === 0 && (
                <p className="text-caption text-[var(--foreground-subtle)]">No fields selected.</p>
              )}
            </div>
          </FormSection>
        </FormCard>

        {/* Preview of field data */}
        <FormCard>
          <FormSection title="Template Content Preview">
            {Object.entries(fieldData).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-caption-strong text-[var(--foreground-muted)]">
                  {FIELD_LABELS[key] || key}
                </p>
                <Card variant="flat" className="bg-[var(--background-subtle)] p-3">
                  <p className="text-caption text-[var(--foreground-default)]">
                    {typeof value === "string"
                      ? value.substring(0, 200) + (value.length > 200 ? "..." : "")
                      : JSON.stringify(value)}
                  </p>
                </Card>
              </div>
            ))}
          </FormSection>
        </FormCard>
      </div>
    </div>
  );
}

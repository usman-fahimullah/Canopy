"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { FormCard, FormSection, FormField, FormRow } from "@/components/ui/form-section";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { Banner } from "@/components/ui/banner";
import { PencilSimple, FloppyDisk, X, ArrowSquareOut } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import {
  type CompanyData,
  EMPTY_COMPANY,
  COMPANY_SIZE_OPTIONS,
  INDUSTRY_OPTIONS,
} from "../_components/types";

/* -------------------------------------------------------------------
   Loading Skeleton
   ------------------------------------------------------------------- */

function CompanyProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
          <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
        </div>
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-24 w-full rounded-[var(--radius-input)]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Page Component
   ------------------------------------------------------------------- */

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<CompanyData>(EMPTY_COMPANY);
  const [formFields, setFormFields] = useState<CompanyData>(EMPTY_COMPANY);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  const showToast = useCallback((message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  }, []);

  /* ---------- Fetch ---------- */
  useEffect(() => {
    let cancelled = false;

    async function fetchOrganization() {
      try {
        const res = await fetch("/api/canopy/organization");
        if (res.ok) {
          const data = await res.json();
          if (data?.organization && !cancelled) {
            const org = data.organization;
            const loaded: CompanyData = {
              name: org.name || "",
              website: org.website || "",
              size: org.size || "",
              sector: org.industries?.[0] || "",
              description: org.description || "",
              location: org.location || "",
            };
            setCompany(loaded);
            setFormFields(loaded);
          }
        }
      } catch (err) {
        logger.error("Fetch organization error", { error: formatError(err) });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchOrganization();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Handlers ---------- */
  const handleEdit = useCallback(() => {
    setFormFields({ ...company });
    setIsEditing(true);
  }, [company]);

  const handleCancel = useCallback(() => {
    setFormFields({ ...company });
    setIsEditing(false);
  }, [company]);

  const handleFieldChange = useCallback((field: keyof CompanyData, value: string) => {
    setFormFields((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/canopy/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formFields.name,
          website: formFields.website || null,
          size: formFields.size || null,
          industries: formFields.sector ? [formFields.sector] : [],
          description: formFields.description || null,
          location: formFields.location || null,
        }),
      });

      if (res.ok) {
        setCompany({ ...formFields });
        setIsEditing(false);
        showToast("Company profile updated");
      } else {
        showToast("Failed to save company profile", "critical");
      }
    } catch (err) {
      logger.error("Save company profile error", { error: formatError(err) });
      showToast("Something went wrong. Please try again.", "critical");
    } finally {
      setSaving(false);
    }
  }, [formFields, showToast]);

  /* ---------- Loading ---------- */
  if (loading) {
    return <CompanyProfileSkeleton />;
  }

  /* ---------- Edit mode ---------- */
  if (isEditing) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
              Company Profile
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="tertiary" size="sm" onClick={handleCancel} disabled={saving}>
                <X size={16} weight="bold" />
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Spinner size="xs" variant="inverse" />
                ) : (
                  <FloppyDisk size={16} weight="bold" />
                )}
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>

          <FormCard>
            <FormSection>
              <FormField label="Company name" required>
                <Input
                  value={formFields.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="e.g. Aurora Climate"
                />
              </FormField>

              <FormField label="Website URL">
                <Input
                  value={formFields.website}
                  onChange={(e) => handleFieldChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </FormField>

              <FormRow>
                <FormField label="Company size">
                  <Dropdown
                    value={formFields.size}
                    onValueChange={(val) => handleFieldChange("size", val)}
                  >
                    <DropdownTrigger>
                      <DropdownValue placeholder="Select size" />
                    </DropdownTrigger>
                    <DropdownContent>
                      {COMPANY_SIZE_OPTIONS.map((opt) => (
                        <DropdownItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </FormField>

                <FormField label="Industry / Sector">
                  <Dropdown
                    value={formFields.sector}
                    onValueChange={(val) => handleFieldChange("sector", val)}
                  >
                    <DropdownTrigger>
                      <DropdownValue placeholder="Select industry" />
                    </DropdownTrigger>
                    <DropdownContent>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <DropdownItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </DropdownItem>
                      ))}
                    </DropdownContent>
                  </Dropdown>
                </FormField>
              </FormRow>

              <FormField label="Location">
                <Input
                  value={formFields.location}
                  onChange={(e) => handleFieldChange("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={formFields.description}
                  onChange={(e) => handleFieldChange("description", e.target.value)}
                  placeholder="Tell candidates about your company and mission..."
                  className="min-h-[140px]"
                />
              </FormField>
            </FormSection>
          </FormCard>
        </div>

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
      </>
    );
  }

  /* ---------- View mode ---------- */
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Company Profile
          </h2>
          <Button variant="tertiary" size="sm" onClick={handleEdit}>
            <PencilSimple size={16} weight="bold" />
            Edit
          </Button>
        </div>

        <FormCard>
          <dl className="space-y-5">
            <div>
              <dt className="mb-1 text-caption font-medium text-foreground-muted">Company name</dt>
              <dd className="text-body text-[var(--foreground-default)]">
                {company.name || <span className="italic text-foreground-muted">Not set</span>}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-caption font-medium text-foreground-muted">Website URL</dt>
              <dd className="text-body text-[var(--foreground-default)]">
                {company.website ? (
                  <span className="flex items-center gap-1.5">
                    {company.website}
                    <ArrowSquareOut size={14} weight="bold" className="text-foreground-muted" />
                  </span>
                ) : (
                  <span className="italic text-foreground-muted">Not set</span>
                )}
              </dd>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <dt className="mb-1 text-caption font-medium text-foreground-muted">
                  Company size
                </dt>
                <dd className="text-body text-[var(--foreground-default)]">
                  {company.size || <span className="italic text-foreground-muted">Not set</span>}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-caption font-medium text-foreground-muted">
                  Industry / Sector
                </dt>
                <dd className="text-body text-[var(--foreground-default)]">
                  {company.sector || <span className="italic text-foreground-muted">Not set</span>}
                </dd>
              </div>
            </div>

            <div>
              <dt className="mb-1 text-caption font-medium text-foreground-muted">Location</dt>
              <dd className="text-body text-[var(--foreground-default)]">
                {company.location || <span className="italic text-foreground-muted">Not set</span>}
              </dd>
            </div>

            <div>
              <dt className="mb-1 text-caption font-medium text-foreground-muted">Description</dt>
              <dd className="whitespace-pre-wrap text-body text-[var(--foreground-default)]">
                {company.description || (
                  <span className="italic text-foreground-muted">No description yet</span>
                )}
              </dd>
            </div>
          </dl>
        </FormCard>
      </div>

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
    </>
  );
}

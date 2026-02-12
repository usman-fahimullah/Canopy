"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Banner } from "@/components/ui/banner";
import { FormCard, FormSection, FormField } from "@/components/ui/form-section";
import { PencilSimple, FloppyDisk, ArrowSquareOut } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Loading Skeleton
   ------------------------------------------------------------------- */

function CareerPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-64" />
      </div>
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full rounded-[var(--radius-input)]" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Page Component
   ------------------------------------------------------------------- */

export default function CareerPageSettingsPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [initialSlug, setInitialSlug] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [initialEnabled, setInitialEnabled] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  const showToast = useCallback((message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/canopy/career-page");
        if (res.ok) {
          const json = await res.json();
          const pageData = json.data;
          const loadedSlug = pageData?.slug || pageData?.orgSlug || "";
          const loadedEnabled = pageData?.enabled ?? false;
          setSlug(loadedSlug);
          setInitialSlug(loadedSlug);
          setEnabled(loadedEnabled);
          setInitialEnabled(loadedEnabled);
        } else {
          setFetchError("Failed to load career page settings");
        }
      } catch {
        setFetchError("Failed to load career page settings");
      } finally {
        setLoadingConfig(false);
      }
    }
    fetchConfig();
  }, []);

  const isDirty = slug !== initialSlug || enabled !== initialEnabled;

  const handleSave = useCallback(async () => {
    setSavingConfig(true);
    try {
      const res = await fetch("/api/canopy/career-page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, enabled }),
      });
      if (res.ok) {
        setInitialSlug(slug);
        setInitialEnabled(enabled);
        showToast("Career page updated");
      } else {
        showToast("Failed to save career page settings", "critical");
      }
    } catch (err) {
      logger.error("Save career page error", { error: formatError(err) });
      showToast("Failed to save career page settings", "critical");
    } finally {
      setSavingConfig(false);
    }
  }, [slug, enabled, showToast]);

  if (loadingConfig) {
    return <CareerPageSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Career Page
          </h2>
          <div className="flex items-center gap-2">
            {isDirty && (
              <Button variant="primary" size="sm" onClick={handleSave} loading={savingConfig}>
                <FloppyDisk size={16} weight="bold" />
                Save
              </Button>
            )}
            <Button variant="tertiary" size="sm" onClick={() => router.push("/canopy/career-page")}>
              <PencilSimple size={16} weight="bold" />
              Open Visual Editor
            </Button>
          </div>
        </div>

        {fetchError ? (
          <Banner type="critical" subtle dismissible={false} title={fetchError} />
        ) : (
          <>
            {/* Publish toggle */}
            <FormCard>
              <SwitchWithLabel
                label="Published"
                helperText="When enabled, your career page is publicly visible to candidates"
                checked={enabled}
                onCheckedChange={(checked) => setEnabled(checked)}
              />
            </FormCard>

            {/* URL slug */}
            <FormCard>
              <FormSection>
                <FormField label="Career page URL">
                  <Input
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                    }
                    placeholder="your-company"
                  />
                  {slug && (
                    <p className="text-caption text-foreground-muted">
                      Public URL:{" "}
                      <span className="font-medium text-[var(--foreground-default)]">
                        {typeof window !== "undefined" ? window.location.origin : ""}/careers/{slug}
                      </span>
                    </p>
                  )}
                </FormField>
              </FormSection>
            </FormCard>

            {/* Quick links */}
            {enabled && slug && (
              <Banner
                type="info"
                subtle
                dismissible={false}
                title={
                  <>
                    Your career page is live.{" "}
                    <a
                      href={`/careers/${slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium underline underline-offset-2 transition-colors hover:text-[var(--foreground-link-hover)]"
                    >
                      View career page
                      <ArrowSquareOut size={14} weight="bold" />
                    </a>
                  </>
                }
              />
            )}
          </>
        )}
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

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Toast } from "@/components/ui/toast";
import { Avatar } from "@/components/ui/avatar";
import { Banner } from "@/components/ui/banner";
import { FormCard, FormSection, FormField, FormRow } from "@/components/ui/form-section";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { FloppyDisk, Trash, UploadSimple, Image as ImageIcon } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "Outfit", label: "Outfit" },
  { value: "Manrope", label: "Manrope" },
  { value: "Sora", label: "Sora" },
  { value: "Work Sans", label: "Work Sans" },
];

interface BrandingData {
  logo: string | null;
  name: string;
  primaryColor: string;
  secondaryColor: string | null;
  fontFamily: string;
}

const DEFAULTS: BrandingData = {
  logo: null,
  name: "",
  primaryColor: "#0F766E",
  secondaryColor: null,
  fontFamily: "Inter",
};

/* -------------------------------------------------------------------
   Loading Skeleton
   ------------------------------------------------------------------- */

function BrandingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-36" />
      {/* Logo card */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-20" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      {/* Colors card */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-40 rounded-[var(--radius-input)]" />
          <Skeleton className="h-10 w-40 rounded-[var(--radius-input)]" />
        </div>
      </div>
      {/* Font card */}
      <div className="space-y-4 rounded-2xl border border-[var(--border-default)] p-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-64 rounded-[var(--radius-input)]" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------
   Page Component
   ------------------------------------------------------------------- */

export default function BrandingPage() {
  const [data, setData] = useState<BrandingData>(DEFAULTS);
  const [initial, setInitial] = useState<BrandingData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  }, []);

  /* Fetch current branding data */
  useEffect(() => {
    async function fetchBranding() {
      try {
        const res = await fetch("/api/canopy/organization");
        if (res.ok) {
          const json = await res.json();
          const org = json.data;
          const loaded: BrandingData = {
            logo: org?.logo ?? null,
            name: org?.name ?? "",
            primaryColor: org?.primaryColor ?? DEFAULTS.primaryColor,
            secondaryColor: org?.secondaryColor ?? null,
            fontFamily: org?.fontFamily ?? DEFAULTS.fontFamily,
          };
          setData(loaded);
          setInitial(loaded);
        }
      } catch (err) {
        logger.error("Failed to fetch branding", { error: formatError(err) });
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, []);

  const isDirty =
    data.primaryColor !== initial.primaryColor ||
    data.secondaryColor !== initial.secondaryColor ||
    data.fontFamily !== initial.fontFamily;

  /* Save branding fields (colors + font) */
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/canopy/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor || null,
          fontFamily: data.fontFamily,
        }),
      });
      if (res.ok) {
        setInitial((prev) => ({
          ...prev,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          fontFamily: data.fontFamily,
        }));
        showToast("Brand settings saved");
      } else {
        showToast("Failed to save brand settings", "critical");
      }
    } catch (err) {
      logger.error("Save branding error", { error: formatError(err) });
      showToast("Failed to save brand settings", "critical");
    } finally {
      setSaving(false);
    }
  }, [data.primaryColor, data.secondaryColor, data.fontFamily, showToast]);

  /* Upload logo */
  const handleLogoUpload = useCallback(
    async (file: File) => {
      setUploadingLogo(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/canopy/organization/logo", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const json = await res.json();
          setData((prev) => ({ ...prev, logo: json.url }));
          setInitial((prev) => ({ ...prev, logo: json.url }));
          showToast("Logo uploaded");
        } else {
          const errorJson = await res.json().catch(() => ({}));
          showToast(errorJson.error || "Failed to upload logo", "critical");
        }
      } catch (err) {
        logger.error("Logo upload error", { error: formatError(err) });
        showToast("Failed to upload logo", "critical");
      } finally {
        setUploadingLogo(false);
      }
    },
    [showToast]
  );

  /* Remove logo */
  const handleLogoRemove = useCallback(async () => {
    try {
      const res = await fetch("/api/canopy/organization/logo", {
        method: "DELETE",
      });
      if (res.ok) {
        setData((prev) => ({ ...prev, logo: null }));
        setInitial((prev) => ({ ...prev, logo: null }));
        showToast("Logo removed");
      } else {
        showToast("Failed to remove logo", "critical");
      }
    } catch (err) {
      logger.error("Logo remove error", { error: formatError(err) });
      showToast("Failed to remove logo", "critical");
    }
  }, [showToast]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Client-side validation
      const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
      if (!ALLOWED.includes(file.type)) {
        showToast("Only JPEG, PNG, WebP, and SVG images are allowed.", "critical");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("File size must be 5MB or less.", "critical");
        return;
      }

      handleLogoUpload(file);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [handleLogoUpload, showToast]
  );

  if (loading) {
    return <BrandingSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
            Logo & Branding
          </h2>
          {isDirty && (
            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
              <FloppyDisk size={16} weight="bold" />
              Save
            </Button>
          )}
        </div>

        {/* Logo Section */}
        <FormCard>
          <FormSection title="Organization Logo">
            <div className="flex items-center gap-6">
              {data.logo ? (
                <Avatar src={data.logo} name={data.name} size="xl" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-[var(--border-default)] bg-[var(--background-subtle)]">
                  <ImageIcon size={28} className="text-[var(--foreground-subtle)]" />
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    loading={uploadingLogo}
                    disabled={uploadingLogo}
                  >
                    <UploadSimple size={16} weight="bold" />
                    {data.logo ? "Change Logo" : "Upload Logo"}
                  </Button>

                  {data.logo && (
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={handleLogoRemove}
                      disabled={uploadingLogo}
                    >
                      <Trash size={16} weight="bold" />
                      Remove
                    </Button>
                  )}
                </div>

                <p className="text-caption text-[var(--foreground-muted)]">
                  JPEG, PNG, WebP, or SVG. Max 5MB.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </FormSection>
        </FormCard>

        {/* Brand Colors Section */}
        <FormCard>
          <FormSection title="Brand Colors">
            <FormRow>
              <FormField label="Primary color">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={data.primaryColor}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, primaryColor: e.target.value }))
                      }
                      className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--border-default)] bg-transparent p-0.5"
                    />
                  </div>
                  <Input
                    value={data.primaryColor}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9a-fA-F]{0,6}$/.test(val)) {
                        setData((prev) => ({ ...prev, primaryColor: val }));
                      }
                    }}
                    placeholder="#0F766E"
                    className="w-28 font-mono"
                  />
                </div>
              </FormField>

              <FormField label="Secondary color">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={data.secondaryColor || "#FFFFFF"}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, secondaryColor: e.target.value }))
                      }
                      className="h-10 w-10 cursor-pointer rounded-lg border border-[var(--border-default)] bg-transparent p-0.5"
                    />
                  </div>
                  <Input
                    value={data.secondaryColor || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^#[0-9a-fA-F]{0,6}$/.test(val)) {
                        setData((prev) => ({
                          ...prev,
                          secondaryColor: val || null,
                        }));
                      }
                    }}
                    placeholder="#FFFFFF"
                    className="w-28 font-mono"
                  />
                </div>
              </FormField>
            </FormRow>
          </FormSection>
        </FormCard>

        {/* Typography Section */}
        <FormCard>
          <FormSection title="Typography">
            <FormField label="Font family">
              <Dropdown
                value={data.fontFamily}
                onValueChange={(val) => setData((prev) => ({ ...prev, fontFamily: val }))}
              >
                <DropdownTrigger className="w-64">
                  <DropdownValue placeholder="Select font" />
                </DropdownTrigger>
                <DropdownContent>
                  {FONT_OPTIONS.map((opt) => (
                    <DropdownItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </FormField>
          </FormSection>
        </FormCard>

        {/* Info banner */}
        <Banner
          type="info"
          subtle
          dismissible={false}
          title="Brand settings apply to your public career page and candidate emails."
        />
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

"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Banner } from "@/components/ui/banner";
import { Spinner } from "@/components/ui/spinner";
import { WarningCircle, ArrowLeft } from "@phosphor-icons/react";
import { SyndicationPanel } from "@/components/canopy/roles/SyndicationPanel";
import { logger, formatError } from "@/lib/logger";
import { useRoleForm } from "../_lib/use-role-form";
import { RoleHeader } from "./RoleHeader";
import { JobPostTab } from "./JobPostTab";
import { ApplyFormTab } from "./ApplyFormTab";
import { CandidatesTab } from "./CandidatesTab";

// ============================================
// TYPES
// ============================================

interface RoleEditViewProps {
  roleId: string;
}

// ============================================
// COMPONENT
// ============================================

export function RoleEditView({ roleId }: RoleEditViewProps) {
  const [activeTab, setActiveTab] = React.useState("job-post");

  const {
    loading,
    saving,
    fetchError,
    saveError,
    setSaveError,
    jobData,
    setJobData,
    applications,
    setApplications,
    jobPostState,
    applyFormState,
    handleReviewRole,
    handleCandidateAdded,
  } = useRoleForm(roleId);

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--primitive-neutral-100)]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-body text-[var(--foreground-muted)]">Loading role...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================

  if (fetchError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--primitive-neutral-100)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <WarningCircle size={48} weight="regular" className="text-[var(--foreground-error)]" />
          <h2 className="text-heading-sm text-foreground">{fetchError}</h2>
          <p className="text-body text-[var(--foreground-muted)]">
            The role you&apos;re looking for may have been removed or you don&apos;t have access.
          </p>
          <Link href="/canopy/roles">
            <Button variant="primary">
              <ArrowLeft size={18} weight="bold" />
              Back to Roles
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="overflow-x-hidden">
      {/* Save Error Banner */}
      {saveError && (
        <div className="px-8 pt-4">
          <Banner
            type="critical"
            title={saveError}
            dismissible
            onDismiss={() => setSaveError(null)}
          />
        </div>
      )}

      {/* Sticky Header */}
      <RoleHeader
        roleTitle={jobPostState.roleTitle}
        jobStatus={jobData?.status}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReviewRole={handleReviewRole}
        saving={saving}
      />

      {/* Main Content */}
      <main className="min-w-0 bg-[var(--primitive-neutral-100)] px-12 py-6">
        {/* Job Post Tab */}
        {activeTab === "job-post" && <JobPostTab jobPostState={jobPostState} />}

        {/* Apply Form Tab */}
        {activeTab === "apply-form" && (
          <ApplyFormTab roleId={roleId} applyFormState={applyFormState} />
        )}

        {/* Candidates Tab */}
        {activeTab === "candidates" && (
          <CandidatesTab
            roleId={roleId}
            jobData={jobData}
            applications={applications}
            setApplications={setApplications}
            onCandidateAdded={handleCandidateAdded}
          />
        )}

        {/* Syndication Tab */}
        {activeTab === "syndication" && jobData && (
          <SyndicationPanel
            jobId={jobData.id}
            syndicationEnabled={jobData.syndicationEnabled}
            jobStatus={jobData.status}
            onToggleSyndication={async (enabled) => {
              try {
                const res = await fetch(`/api/canopy/roles/${jobData.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ syndicationEnabled: enabled }),
                });
                if (res.ok) {
                  setJobData((prev) => (prev ? { ...prev, syndicationEnabled: enabled } : prev));
                }
              } catch (error) {
                logger.error("Failed to toggle syndication", { error: formatError(error) });
              }
            }}
          />
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-caption">
            <span className="text-foreground-brand">Make an </span>
            <span className="font-semibold text-foreground-brand">Impact.</span>
          </p>
        </div>
      </main>
    </div>
  );
}

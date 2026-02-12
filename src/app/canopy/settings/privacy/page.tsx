"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormCard, FormSection } from "@/components/ui/form-section";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
import { Export, SignOut, Trash, Warning } from "@phosphor-icons/react";

export default function PrivacyAccountPage() {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // sign-out request may fail if session already expired
    }
    router.push("/login");
  }, [router]);

  return (
    <div className="space-y-6">
      <h2 className="text-heading-sm font-medium text-[var(--foreground-default)]">
        Privacy & Account
      </h2>

      {/* Export data */}
      <FormCard>
        <FormSection>
          <div>
            <h3 className="mb-1 text-body font-medium text-[var(--foreground-default)]">
              Export company data
            </h3>
            <p className="mb-4 text-caption text-foreground-muted">
              Download a copy of all your organization data including jobs, candidates, and team
              information.
            </p>
            <SimpleTooltip content="Coming soon" side="right">
              <span>
                <Button variant="tertiary" size="sm" disabled>
                  <Export size={16} weight="bold" />
                  Export data
                </Button>
              </span>
            </SimpleTooltip>
          </div>
        </FormSection>
      </FormCard>

      {/* Sign out */}
      <FormCard>
        <FormSection>
          <div>
            <h3 className="mb-1 text-body font-medium text-[var(--foreground-default)]">
              Sign out
            </h3>
            <p className="mb-4 text-caption text-foreground-muted">
              Sign out of your Canopy employer account on this device.
            </p>
            <Button variant="tertiary" size="sm" onClick={handleSignOut}>
              <SignOut size={16} weight="bold" />
              Sign out
            </Button>
          </div>
        </FormSection>
      </FormCard>

      {/* Delete organization */}
      <div className="rounded-2xl border border-[var(--border-error)] bg-[var(--background-error)] p-6">
        <h3 className="mb-1 text-body font-medium text-[var(--foreground-error)]">
          Delete organization
        </h3>
        <div className="mb-4 flex items-start gap-2">
          <Warning
            size={16}
            weight="fill"
            className="mt-0.5 shrink-0 text-[var(--foreground-error)]"
          />
          <p className="text-caption text-[var(--foreground-error)]">
            This will permanently delete your organization and all associated data. This action
            cannot be undone.
          </p>
        </div>
        <SimpleTooltip content="Coming soon" side="right">
          <span>
            <Button variant="destructive" size="sm" disabled>
              <Trash size={16} weight="bold" />
              Delete organization
            </Button>
          </span>
        </SimpleTooltip>
      </div>
    </div>
  );
}

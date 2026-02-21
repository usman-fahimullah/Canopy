"use client";

import Link from "next/link";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Lightning } from "@phosphor-icons/react";

// =================================================================
// Plan display names
// =================================================================

const TIER_NAMES: Record<string, string> = {
  PAY_AS_YOU_GO: "Pay As You Go",
  LISTINGS: "Listings",
  ATS: "ATS",
};

// =================================================================
// Feature descriptions for upgrade prompts
// =================================================================

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  hasApplyForm: "built-in apply form",
  hasApplicantList: "applicant viewing",
  hasATS: "full ATS pipeline",
  pipeline: "pipeline management",
  messaging: "candidate messaging",
  scoring: "candidate scoring",
  interviews: "interview scheduling",
  templates: "unlimited email templates",
  teamCollaboration: "team collaboration",
};

// =================================================================
// UpgradePrompt Component
// =================================================================

interface UpgradePromptProps {
  /** The feature that is gated */
  feature: string;
  /** The plan tier required to access this feature */
  requiredTier: string;
  /** The user's current plan tier */
  currentTier?: string;
  /** Optional custom message (overrides auto-generated one) */
  message?: string;
}

/**
 * Inline banner shown when a billing feature gate blocks an action.
 * Directs users to the billing settings page to upgrade.
 */
export function UpgradePrompt({ feature, requiredTier, currentTier, message }: UpgradePromptProps) {
  const featureLabel = FEATURE_DESCRIPTIONS[feature] || feature;
  const tierName = TIER_NAMES[requiredTier] || requiredTier;

  const defaultMessage = `${featureLabel.charAt(0).toUpperCase() + featureLabel.slice(1)} requires the ${tierName} plan.${currentTier ? ` You're currently on ${TIER_NAMES[currentTier] || currentTier}.` : ""} Upgrade to unlock this feature.`;

  return (
    <Banner
      type="info"
      title={message || defaultMessage}
      icon={<Lightning size={20} weight="fill" />}
      action={
        <Link href="/canopy/settings/billing">
          <Button variant="primary" size="sm">
            <Lightning size={16} weight="fill" />
            Upgrade
          </Button>
        </Link>
      }
    />
  );
}

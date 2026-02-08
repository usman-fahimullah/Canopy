"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { SwitchWithLabel } from "@/components/ui/switch";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { logger, formatError } from "@/lib/logger";
import {
  Buildings,
  Bell,
  ShieldCheck,
  UsersThree,
  SignOut,
  PencilSimple,
  FloppyDisk,
  X,
  EnvelopeSimple,
  ArrowSquareOut,
  Warning,
  Export,
  Trash,
  Globe,
} from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

type SettingSection = "company" | "team" | "notifications" | "privacy" | "career-page";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  role: "ADMIN" | "RECRUITER" | "HIRING_TEAM" | "VIEWER";
}

interface CompanyData {
  name: string;
  website: string;
  size: string;
  sector: string;
  description: string;
}

interface NotificationPrefs {
  newApplications: boolean;
  messages: boolean;
  jobExpiring: boolean;
  teamActivity: boolean;
}

/* -------------------------------------------------------------------
   Constants
   ------------------------------------------------------------------- */

const SETTING_SECTIONS = [
  {
    id: "company" as const,
    label: "Company Profile",
    description: "Manage company info and branding",
    icon: Buildings,
  },
  {
    id: "team" as const,
    label: "Team Permissions",
    description: "Manage roles and access",
    icon: UsersThree,
  },
  {
    id: "notifications" as const,
    label: "Notifications",
    description: "Notification preferences",
    icon: Bell,
  },
  {
    id: "privacy" as const,
    label: "Privacy & Account",
    description: "Privacy and account settings",
    icon: ShieldCheck,
  },
  {
    id: "career-page" as const,
    label: "Career Page",
    description: "Public career page settings",
    icon: Globe,
  },
];

const EMPTY_COMPANY: CompanyData = {
  name: "",
  website: "",
  size: "",
  sector: "",
  description: "",
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  newApplications: true,
  messages: true,
  jobExpiring: false,
  teamActivity: false,
};

/** Maps our UI toggle keys to the API's inAppPrefs keys */
const NOTIF_KEY_MAP: Record<keyof NotificationPrefs, string> = {
  newApplications: "NEW_APPLICATION",
  messages: "NEW_MESSAGE",
  jobExpiring: "OFFER_RECEIVED",
  teamActivity: "APPROVAL_PENDING",
};

/* -------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------- */

function roleBadgeVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "default" as const;
    case "RECRUITER":
      return "info" as const;
    case "HIRING_TEAM":
      return "neutral" as const;
    case "VIEWER":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
}

function formatRole(role: string) {
  switch (role) {
    case "ADMIN":
      return "Admin";
    case "RECRUITER":
      return "Recruiter";
    case "HIRING_TEAM":
      return "Hiring Team";
    case "VIEWER":
      return "Viewer";
    default:
      return role;
  }
}

/** Convert API inAppPrefs to our UI toggle state */
function mapApiPrefsToUI(
  inAppPrefs: Record<string, boolean> | null | undefined
): NotificationPrefs {
  if (!inAppPrefs) return DEFAULT_NOTIFICATION_PREFS;
  return {
    newApplications:
      inAppPrefs[NOTIF_KEY_MAP.newApplications] ?? DEFAULT_NOTIFICATION_PREFS.newApplications,
    messages: inAppPrefs[NOTIF_KEY_MAP.messages] ?? DEFAULT_NOTIFICATION_PREFS.messages,
    jobExpiring: inAppPrefs[NOTIF_KEY_MAP.jobExpiring] ?? DEFAULT_NOTIFICATION_PREFS.jobExpiring,
    teamActivity: inAppPrefs[NOTIF_KEY_MAP.teamActivity] ?? DEFAULT_NOTIFICATION_PREFS.teamActivity,
  };
}

/** Convert UI toggle state to API inAppPrefs */
function mapUIPrefsToApi(prefs: NotificationPrefs): Record<string, boolean> {
  return {
    [NOTIF_KEY_MAP.newApplications]: prefs.newApplications,
    [NOTIF_KEY_MAP.messages]: prefs.messages,
    [NOTIF_KEY_MAP.jobExpiring]: prefs.jobExpiring,
    [NOTIF_KEY_MAP.teamActivity]: prefs.teamActivity,
  };
}

/* -------------------------------------------------------------------
   Section Components
   ------------------------------------------------------------------- */

function CompanyProfileSection({
  company,
  isEditing,
  saving,
  formFields,
  onEdit,
  onCancel,
  onSave,
  onFieldChange,
}: {
  company: CompanyData;
  isEditing: boolean;
  saving: boolean;
  formFields: CompanyData;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onFieldChange: (field: keyof CompanyData, value: string) => void;
}) {
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground-default text-heading-sm font-medium">Company Profile</h2>
          <div className="flex items-center gap-2">
            <Button variant="tertiary" size="sm" onClick={onCancel} disabled={saving}>
              <X size={16} weight="bold" />
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onSave} disabled={saving}>
              {saving ? (
                <Spinner size="xs" variant="inverse" />
              ) : (
                <FloppyDisk size={16} weight="bold" />
              )}
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
          <div className="max-w-xl space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="company-name">Company name</Label>
              <Input
                id="company-name"
                value={formFields.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder="e.g. Aurora Climate"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-website">Website URL</Label>
              <Input
                id="company-website"
                value={formFields.website}
                onChange={(e) => onFieldChange("website", e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-size">Company size</Label>
              <Input
                id="company-size"
                value={formFields.size}
                onChange={(e) => onFieldChange("size", e.target.value)}
                placeholder="e.g. 1-10, 11-50, 51-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-sector">Industry / Sector</Label>
              <Input
                id="company-sector"
                value={formFields.sector}
                onChange={(e) => onFieldChange("sector", e.target.value)}
                placeholder="e.g. Climate Tech, Renewable Energy"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-description">Description</Label>
              <Textarea
                id="company-description"
                value={formFields.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                placeholder="Tell candidates about your company and mission..."
                className="min-h-[140px]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground-default text-heading-sm font-medium">Company Profile</h2>
        <Button variant="tertiary" size="sm" onClick={onEdit}>
          <PencilSimple size={16} weight="bold" />
          Edit
        </Button>
      </div>

      <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
        <dl className="max-w-xl space-y-5">
          <div>
            <dt className="mb-1 text-caption font-medium text-foreground-muted">Company name</dt>
            <dd className="text-foreground-default text-body">
              {company.name || <span className="italic text-foreground-muted">Not set</span>}
            </dd>
          </div>

          <div>
            <dt className="mb-1 text-caption font-medium text-foreground-muted">Website URL</dt>
            <dd className="text-foreground-default text-body">
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

          <div>
            <dt className="mb-1 text-caption font-medium text-foreground-muted">Company size</dt>
            <dd className="text-foreground-default text-body">
              {company.size || <span className="italic text-foreground-muted">Not set</span>}
            </dd>
          </div>

          <div>
            <dt className="mb-1 text-caption font-medium text-foreground-muted">
              Industry / Sector
            </dt>
            <dd className="text-foreground-default text-body">
              {company.sector || <span className="italic text-foreground-muted">Not set</span>}
            </dd>
          </div>

          <div>
            <dt className="mb-1 text-caption font-medium text-foreground-muted">Description</dt>
            <dd className="text-foreground-default whitespace-pre-wrap text-body">
              {company.description || (
                <span className="italic text-foreground-muted">No description yet</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function TeamPermissionsSection({
  members,
  loadingTeam,
  teamError,
}: {
  members: TeamMember[];
  loadingTeam: boolean;
  teamError: string | null;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground-default text-heading-sm font-medium">Team Permissions</h2>
        <SimpleTooltip content="Coming soon" side="left">
          <span>
            <Button variant="tertiary" size="sm" disabled>
              <EnvelopeSimple size={16} weight="bold" />
              Invite Member
            </Button>
          </span>
        </SimpleTooltip>
      </div>

      <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-6">
        {loadingTeam ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : teamError ? (
          <p className="py-4 text-center text-body-sm text-[var(--foreground-error)]">
            {teamError}
          </p>
        ) : (
          <>
            <p className="mb-4 text-caption text-foreground-muted">
              {members.length} member{members.length !== 1 ? "s" : ""}
            </p>

            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-xl border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3"
                >
                  <Avatar
                    src={member.avatar ?? undefined}
                    name={member.name ?? undefined}
                    size="sm"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground-default truncate text-body-sm font-medium">
                      {member.name || "Unnamed"}
                    </p>
                    <p className="truncate text-caption text-foreground-muted">{member.email}</p>
                  </div>

                  <Badge variant={roleBadgeVariant(member.role)} size="sm">
                    {formatRole(member.role)}
                  </Badge>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl border border-[var(--border-info)] bg-[var(--background-info)] px-5 py-4">
        <p className="text-body-sm text-[var(--foreground-default)]">
          Manage detailed team settings on the{" "}
          <Link
            href="/canopy/team"
            className="font-medium underline underline-offset-2 transition-colors hover:text-[var(--foreground-link-hover)]"
          >
            Team page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function NotificationsSection({
  prefs,
  onToggle,
}: {
  prefs: NotificationPrefs;
  onToggle: (key: keyof NotificationPrefs) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-foreground-default text-heading-sm font-medium">Notifications</h2>

      <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
        <div className="max-w-xl space-y-6">
          <SwitchWithLabel
            label="New applications"
            helperText="Get notified when candidates apply to your roles"
            checked={prefs.newApplications}
            onCheckedChange={() => onToggle("newApplications")}
          />

          <div className="border-t border-[var(--border-default)]" />

          <SwitchWithLabel
            label="Messages"
            helperText="New messages from candidates"
            checked={prefs.messages}
            onCheckedChange={() => onToggle("messages")}
          />

          <div className="border-t border-[var(--border-default)]" />

          <SwitchWithLabel
            label="Job expiring"
            helperText="Reminders when job postings are about to expire"
            checked={prefs.jobExpiring}
            onCheckedChange={() => onToggle("jobExpiring")}
          />

          <div className="border-t border-[var(--border-default)]" />

          <SwitchWithLabel
            label="Team activity"
            helperText="When team members comment on candidates"
            checked={prefs.teamActivity}
            onCheckedChange={() => onToggle("teamActivity")}
          />
        </div>
      </div>
    </div>
  );
}

function PrivacyAccountSection({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="space-y-6">
      <h2 className="text-foreground-default text-heading-sm font-medium">Privacy & Account</h2>

      {/* Export data */}
      <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
        <h3 className="text-foreground-default mb-1 text-body font-medium">Export company data</h3>
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

      {/* Sign out */}
      <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
        <h3 className="text-foreground-default mb-1 text-body font-medium">Sign out</h3>
        <p className="mb-4 text-caption text-foreground-muted">
          Sign out of your Canopy employer account on this device.
        </p>
        <Button variant="tertiary" size="sm" onClick={onSignOut}>
          <SignOut size={16} weight="bold" />
          Sign out
        </Button>
      </div>

      {/* Delete organization */}
      <div className="rounded-[16px] border border-[var(--border-error)] bg-[var(--background-error)] p-8">
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
        <Button variant="destructive" size="sm" disabled>
          <Trash size={16} weight="bold" />
          Delete organization
        </Button>
      </div>
    </div>
  );
}

function CareerPageSettingsSection({
  showToast,
}: {
  showToast: (message: string, variant?: "success" | "critical") => void;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [initialSlug, setInitialSlug] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [initialEnabled, setInitialEnabled] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-foreground-default text-heading-sm font-medium">Career Page</h2>
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

      {loadingConfig ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : fetchError ? (
        <div className="rounded-[16px] border border-[var(--border-error)] bg-[var(--background-error)] px-5 py-4">
          <p className="text-body-sm text-[var(--foreground-error)]">{fetchError}</p>
        </div>
      ) : (
        <>
          {/* Publish toggle */}
          <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
            <SwitchWithLabel
              label="Published"
              helperText="When enabled, your career page is publicly visible to candidates"
              checked={enabled}
              onCheckedChange={(checked) => setEnabled(checked)}
            />
          </div>

          {/* URL slug */}
          <div className="rounded-[16px] border border-[var(--card-border)] bg-[var(--card-background)] p-8">
            <div className="max-w-xl space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="career-slug">Career page URL</Label>
                <Input
                  id="career-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="your-company"
                />
                {slug && (
                  <p className="text-caption text-foreground-muted">
                    Public URL:{" "}
                    <span className="text-foreground-default font-medium">
                      {typeof window !== "undefined" ? window.location.origin : ""}/careers/{slug}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick links */}
          {enabled && slug && (
            <div className="rounded-xl border border-[var(--border-info)] bg-[var(--background-info)] px-5 py-4">
              <p className="text-body-sm text-[var(--foreground-default)]">
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
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------
   Page
   ------------------------------------------------------------------- */

export default function EmployerSettingsPage() {
  const router = useRouter();

  /* ---------- State ---------- */
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SettingSection>("company");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "critical";
  } | null>(null);

  const showToast = useCallback((message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  }, []);

  // Company data
  const [company, setCompany] = useState<CompanyData>(EMPTY_COMPANY);
  const [formFields, setFormFields] = useState<CompanyData>(EMPTY_COMPANY);

  // Team data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [teamError, setTeamError] = useState<string | null>(null);

  // Notification prefs
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(
    DEFAULT_NOTIFICATION_PREFS
  );

  /* ---------- Fetch data on mount ---------- */
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

    async function fetchTeam() {
      try {
        const res = await fetch("/api/canopy/team");
        if (res.ok) {
          const data = await res.json();
          if (data?.members && !cancelled) {
            setTeamMembers(data.members);
          }
        } else {
          if (!cancelled) setTeamError("Failed to load team members");
        }
      } catch {
        if (!cancelled) setTeamError("Failed to load team members");
      } finally {
        if (!cancelled) setLoadingTeam(false);
      }
    }

    async function fetchNotificationPrefs() {
      try {
        const res = await fetch("/api/notifications/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data?.preferences && !cancelled) {
            setNotificationPrefs(mapApiPrefsToUI(data.preferences.inAppPrefs));
          }
        }
      } catch {
        // Fall back to defaults silently
      }
    }

    fetchOrganization();
    fetchTeam();
    fetchNotificationPrefs();

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

  const handleToggleNotification = useCallback(
    async (key: keyof NotificationPrefs) => {
      const updated = { ...notificationPrefs, [key]: !notificationPrefs[key] };
      setNotificationPrefs(updated);

      try {
        const res = await fetch("/api/notifications/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inAppPrefs: mapUIPrefsToApi(updated) }),
        });
        if (!res.ok) {
          // Revert on failure
          setNotificationPrefs(notificationPrefs);
          showToast("Failed to save notification preference", "critical");
        }
      } catch {
        // Revert on failure
        setNotificationPrefs(notificationPrefs);
        showToast("Failed to save notification preference", "critical");
      }
    },
    [notificationPrefs, showToast]
  );

  const handleSignOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // sign-out request may fail if session already expired
    }
    router.push("/login");
  }, [router]);

  /* ---------- Loading state ---------- */

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" />
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading settings" />
        </div>
      </div>
    );
  }

  /* ---------- Render active section ---------- */

  function renderSection() {
    switch (activeSection) {
      case "company":
        return (
          <CompanyProfileSection
            company={company}
            isEditing={isEditing}
            saving={saving}
            formFields={formFields}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onSave={handleSave}
            onFieldChange={handleFieldChange}
          />
        );
      case "team":
        return (
          <TeamPermissionsSection
            members={teamMembers}
            loadingTeam={loadingTeam}
            teamError={teamError}
          />
        );
      case "notifications":
        return (
          <NotificationsSection prefs={notificationPrefs} onToggle={handleToggleNotification} />
        );
      case "privacy":
        return <PrivacyAccountSection onSignOut={handleSignOut} />;
      case "career-page":
        return <CareerPageSettingsSection showToast={showToast} />;
      default:
        return null;
    }
  }

  /* ---------- Page ---------- */

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="flex flex-col gap-6 px-8 py-6 lg:flex-row lg:px-12">
        {/* Sidebar nav */}
        <nav className="flex-shrink-0 lg:w-64">
          <div className="space-y-1">
            {SETTING_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsEditing(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[var(--background-interactive-selected)] text-[var(--foreground-default)]"
                      : "text-foreground-muted hover:bg-[var(--background-interactive-hover)]"
                  }`}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span className="text-body-sm font-medium">{section.label}</span>
                </button>
              );
            })}

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[var(--foreground-error)] transition-colors hover:bg-[var(--background-error)]"
            >
              <SignOut size={20} weight="regular" />
              <span className="text-body-sm font-medium">Sign out</span>
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="min-w-0 flex-1">{renderSection()}</div>
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
    </div>
  );
}

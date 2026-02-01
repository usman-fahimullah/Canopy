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
import { SwitchWithLabel } from "@/components/ui/switch";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { createClient } from "@/lib/supabase/client";
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
} from "@phosphor-icons/react";

/* -------------------------------------------------------------------
   Types
   ------------------------------------------------------------------- */

type SettingSection = "company" | "team" | "notifications" | "privacy";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "RECRUITER" | "HIRING_TEAM" | "VIEWER";
  avatarColor?: "green" | "blue" | "purple" | "orange";
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
];

const MOCK_COMPANY: CompanyData = {
  name: "Your Company",
  website: "",
  size: "1-10",
  sector: "Climate Tech",
  description: "",
};

const MOCK_TEAM: TeamMember[] = [
  {
    id: "tm_001",
    name: "Jordan Rivera",
    email: "jordan@canopy.co",
    role: "ADMIN",
    avatarColor: "green",
  },
  {
    id: "tm_002",
    name: "Alex Chen",
    email: "alex@canopy.co",
    role: "RECRUITER",
    avatarColor: "blue",
  },
  {
    id: "tm_003",
    name: "Sam Okafor",
    email: "sam@canopy.co",
    role: "HIRING_TEAM",
    avatarColor: "purple",
  },
  {
    id: "tm_004",
    name: "Casey Nguyen",
    email: "casey@canopy.co",
    role: "RECRUITER",
    avatarColor: "orange",
  },
];

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  newApplications: true,
  messages: true,
  jobExpiring: false,
  teamActivity: false,
};

const NOTIFICATION_PREFS_KEY = "employer-notification-prefs";

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

        <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8">
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

      <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8">
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

function TeamPermissionsSection() {
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

      <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-6">
        <p className="mb-4 text-caption text-foreground-muted">
          {MOCK_TEAM.length} member{MOCK_TEAM.length !== 1 ? "s" : ""}
        </p>

        <div className="space-y-3">
          {MOCK_TEAM.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 rounded-xl border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-3"
            >
              <Avatar name={member.name} color={member.avatarColor} size="sm" />

              <div className="min-w-0 flex-1">
                <p className="text-foreground-default truncate text-body-sm font-medium">
                  {member.name}
                </p>
                <p className="truncate text-caption text-foreground-muted">{member.email}</p>
              </div>

              <Badge variant={roleBadgeVariant(member.role)} size="sm">
                {formatRole(member.role)}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--primitive-blue-200)] bg-[var(--primitive-blue-100)] px-5 py-4">
        <p className="text-body-sm text-[var(--primitive-green-800)]">
          Manage detailed team settings on the{" "}
          <Link
            href="/canopy/team"
            className="font-medium underline underline-offset-2 transition-colors hover:text-[var(--primitive-blue-600)]"
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

      <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8">
        <div className="max-w-xl space-y-6">
          <SwitchWithLabel
            label="New applications"
            helperText="Get notified when candidates apply to your roles"
            checked={prefs.newApplications}
            onCheckedChange={() => onToggle("newApplications")}
          />

          <div className="border-t border-[var(--primitive-neutral-200)]" />

          <SwitchWithLabel
            label="Messages"
            helperText="New messages from candidates"
            checked={prefs.messages}
            onCheckedChange={() => onToggle("messages")}
          />

          <div className="border-t border-[var(--primitive-neutral-200)]" />

          <SwitchWithLabel
            label="Job expiring"
            helperText="Reminders when job postings are about to expire"
            checked={prefs.jobExpiring}
            onCheckedChange={() => onToggle("jobExpiring")}
          />

          <div className="border-t border-[var(--primitive-neutral-200)]" />

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
      <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8">
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
      <div className="rounded-[16px] border border-[var(--primitive-neutral-200)] bg-white p-8">
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
      <div className="rounded-[16px] border border-[var(--primitive-red-200)] bg-[var(--primitive-red-100)] p-8">
        <h3 className="mb-1 text-body font-medium text-[var(--primitive-red-700)]">
          Delete organization
        </h3>
        <div className="mb-4 flex items-start gap-2">
          <Warning
            size={16}
            weight="fill"
            className="mt-0.5 shrink-0 text-[var(--primitive-red-600)]"
          />
          <p className="text-caption text-[var(--primitive-red-700)]">
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

  // Company data
  const [company, setCompany] = useState<CompanyData>(MOCK_COMPANY);
  const [formFields, setFormFields] = useState<CompanyData>(MOCK_COMPANY);

  // Notification prefs
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(
    DEFAULT_NOTIFICATION_PREFS
  );

  /* ---------- Fetch profile on mount ---------- */
  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          // If the API returns org/company info, use it
          if (data?.organization && !cancelled) {
            const org = data.organization;
            const loaded: CompanyData = {
              name: org.name || MOCK_COMPANY.name,
              website: org.website || MOCK_COMPANY.website,
              size: org.size || MOCK_COMPANY.size,
              sector: org.sector || org.industry || MOCK_COMPANY.sector,
              description: org.description || MOCK_COMPANY.description,
            };
            setCompany(loaded);
            setFormFields(loaded);
          }
        }
      } catch {
        // API not available - fall back to mock data silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Load notification prefs from localStorage
    try {
      const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY);
      if (stored) {
        setNotificationPrefs(JSON.parse(stored));
      }
    } catch {
      // localStorage unavailable
    }

    fetchProfile();

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
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formFields.name,
          website: formFields.website,
          size: formFields.size,
          sector: formFields.sector,
          description: formFields.description,
        }),
      });

      if (res.ok) {
        setCompany({ ...formFields });
        setIsEditing(false);
      } else {
        // Fallback: persist to localStorage as a mock save
        localStorage.setItem("employer-company-profile", JSON.stringify(formFields));
        setCompany({ ...formFields });
        setIsEditing(false);
      }
    } catch {
      // API unavailable - persist to localStorage as a fallback
      localStorage.setItem("employer-company-profile", JSON.stringify(formFields));
      setCompany({ ...formFields });
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  }, [formFields]);

  const handleToggleNotification = useCallback((key: keyof NotificationPrefs) => {
    setNotificationPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updated));
      } catch {
        // localStorage unavailable
      }
      return updated;
    });
  }, []);

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
        return <TeamPermissionsSection />;
      case "notifications":
        return (
          <NotificationsSection prefs={notificationPrefs} onToggle={handleToggleNotification} />
        );
      case "privacy":
        return <PrivacyAccountSection onSignOut={handleSignOut} />;
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
                      ? "bg-[var(--primitive-blue-100)] text-[var(--primitive-green-800)]"
                      : "text-foreground-muted hover:bg-[var(--primitive-neutral-100)]"
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
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[var(--primitive-red-600)] transition-colors hover:bg-[var(--primitive-red-100)]"
            >
              <SignOut size={20} weight="regular" />
              <span className="text-body-sm font-medium">Sign out</span>
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="min-w-0 flex-1">{renderSection()}</div>
      </div>
    </div>
  );
}

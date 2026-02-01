"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Bell,
  ShieldCheck,
  Clock,
  CurrencyDollar,
  SignOut,
  PencilSimple,
  ArrowSquareOut,
  StripeLogo,
  Download,
  Trash,
  Eye,
  MapPin,
  Phone,
  Envelope,
  CurrencyCircleDollar,
} from "@phosphor-icons/react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CoachProfile {
  headline?: string;
  specialties?: string[];
  hourlyRate?: number;
  totalEarnings?: number;
  stripeConnected?: boolean;
}

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  coachProfile?: CoachProfile;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SETTING_SECTIONS = [
  { id: "profile", label: "Profile", description: "Manage your coach profile", icon: User },
  { id: "availability", label: "Availability", description: "Set your available hours", icon: Clock },
  { id: "payments", label: "Payments", description: "Manage Stripe and payouts", icon: CurrencyDollar },
  { id: "notifications", label: "Notifications", description: "Notification preferences", icon: Bell },
  { id: "privacy", label: "Privacy", description: "Privacy and account settings", icon: ShieldCheck },
] as const;

const NOTIFICATION_STORAGE_KEY = "coach-notification-prefs";

interface NotificationPrefs {
  newBookings: boolean;
  sessionReminders: boolean;
  messages: boolean;
  paymentReceived: boolean;
}

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  newBookings: true,
  sessionReminders: true,
  messages: true,
  paymentReceived: false,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadNotificationPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFS;
  try {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as NotificationPrefs;
  } catch {
    // ignore
  }
  return DEFAULT_NOTIFICATION_PREFS;
}

function saveNotificationPrefs(prefs: NotificationPrefs) {
  try {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Section Components
// ---------------------------------------------------------------------------

function ProfileSection({
  profile,
  isEditing,
  setIsEditing,
  saving,
  onSave,
}: {
  profile: ProfileData;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  saving: boolean;
  onSave: (fields: {
    name: string;
    bio: string;
    headline: string;
    hourlyRate: string;
  }) => void;
}) {
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [headline, setHeadline] = useState(
    profile.coachProfile?.headline || ""
  );
  const [hourlyRate, setHourlyRate] = useState(
    profile.coachProfile?.hourlyRate?.toString() || ""
  );

  // Sync form fields when profile data changes or edit mode is entered
  useEffect(() => {
    setName(profile.name || "");
    setBio(profile.bio || "");
    setHeadline(profile.coachProfile?.headline || "");
    setHourlyRate(profile.coachProfile?.hourlyRate?.toString() || "");
  }, [profile, isEditing]);

  const handleCancel = () => {
    setName(profile.name || "");
    setBio(profile.bio || "");
    setHeadline(profile.coachProfile?.headline || "");
    setHourlyRate(profile.coachProfile?.hourlyRate?.toString() || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <h2 className="text-heading-sm font-medium text-foreground-default">
          Profile
        </h2>
        {!isEditing && (
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<PencilSimple size={16} />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile card */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-6">
        {/* Header row: avatar + identity */}
        <div className="flex items-center gap-5 mb-6">
          <Avatar
            src={profile.avatar}
            name={profile.name}
            size="lg"
            color="yellow"
          />
          <div className="min-w-0 flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-body-strong font-semibold text-foreground-default truncate">
                  {profile.name}
                </h3>
                {profile.coachProfile?.headline && (
                  <p className="text-body-sm text-foreground-muted mt-0.5">
                    {profile.coachProfile.headline}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info rows (read-only) */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-body-sm text-foreground-muted">
            <Envelope size={18} className="flex-shrink-0 text-foreground-subtle" />
            <span>{profile.email}</span>
            <Badge variant="neutral" size="sm">
              Read-only
            </Badge>
          </div>
          {profile.location && (
            <div className="flex items-center gap-3 text-body-sm text-foreground-muted">
              <MapPin size={18} className="flex-shrink-0 text-foreground-subtle" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-3 text-body-sm text-foreground-muted">
              <Phone size={18} className="flex-shrink-0 text-foreground-subtle" />
              <span>{profile.phone}</span>
            </div>
          )}
        </div>

        {/* Editable fields */}
        {isEditing ? (
          <div className="space-y-4 border-t border-[var(--border-muted)] pt-5">
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Executive Career Coach for Climate Leaders"
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell clients about your coaching experience and approach..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="hourly-rate">Hourly rate (USD)</Label>
              <div className="relative">
                <CurrencyCircleDollar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none"
                />
                <Input
                  id="hourly-rate"
                  type="number"
                  min="0"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="150"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Save / Cancel */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="sm"
                loading={saving}
                onClick={() =>
                  onSave({ name, bio, headline, hourlyRate })
                }
              >
                Save Changes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Bio */}
            {profile.bio && (
              <div className="border-t border-[var(--border-muted)] pt-5 mb-5">
                <Label className="mb-1">Bio</Label>
                <p className="text-body-sm text-foreground-muted whitespace-pre-line">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Specialties */}
            {profile.coachProfile?.specialties &&
              profile.coachProfile.specialties.length > 0 && (
                <div className="border-t border-[var(--border-muted)] pt-5 mb-5">
                  <Label className="mb-2">Specialties</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.coachProfile.specialties.map((s) => (
                      <Badge key={s} variant="default" size="sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

            {/* Hourly Rate */}
            {profile.coachProfile?.hourlyRate != null && (
              <div className="border-t border-[var(--border-muted)] pt-5">
                <Label className="mb-1">Hourly Rate</Label>
                <p className="text-body-strong font-semibold text-foreground-default">
                  ${profile.coachProfile.hourlyRate}
                  <span className="text-body-sm font-normal text-foreground-muted">
                    {" "}
                    / hour
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AvailabilitySection() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h2 className="text-heading-sm font-medium text-foreground-default">
        Availability
      </h2>

      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primitive-yellow-100)]">
            <Clock size={20} weight="fill" className="text-[var(--primitive-yellow-600)]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-body-strong font-semibold text-foreground-default mb-1">
              Manage your availability on the Schedule page
            </h3>
            <p className="text-body-sm text-foreground-muted mb-4">
              Configure your weekly availability and timezone settings. Clients
              will only be able to book during the hours you set.
            </p>
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowSquareOut size={16} />}
              onClick={() => router.push("/coach/schedule")}
            >
              Go to Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentsSection({ profile }: { profile: ProfileData }) {
  const stripeConnected = profile.coachProfile?.stripeConnected ?? false;
  const hourlyRate = profile.coachProfile?.hourlyRate;
  const totalEarnings = profile.coachProfile?.totalEarnings ?? 0;

  return (
    <div className="space-y-6">
      <h2 className="text-heading-sm font-medium text-foreground-default">
        Payments
      </h2>

      {/* Stripe connect card */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primitive-blue-100)]">
            <StripeLogo size={20} weight="fill" className="text-[var(--primitive-blue-500)]" />
          </div>
          <div className="flex-1 min-w-0">
            {stripeConnected ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-body-strong font-semibold text-foreground-default">
                    Stripe Connected
                  </h3>
                  <Badge variant="success" size="sm">
                    Active
                  </Badge>
                </div>
                <p className="text-body-sm text-foreground-muted">
                  Your Stripe account is connected and ready to receive payments.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-body-strong font-semibold text-foreground-default mb-1">
                  Connect your Stripe account
                </h3>
                <p className="text-body-sm text-foreground-muted mb-4">
                  Connect your Stripe account to receive payments from coaching
                  sessions. Payouts are processed weekly.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<StripeLogo size={16} />}
                  disabled
                >
                  Connect Stripe
                  <Badge variant="neutral" size="sm" className="ml-2">
                    Coming soon
                  </Badge>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rate & earnings summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-5">
          <p className="text-caption text-foreground-muted mb-1">
            Current Hourly Rate
          </p>
          <p className="text-heading-sm font-semibold text-foreground-default">
            {hourlyRate != null ? `$${hourlyRate}` : "Not set"}
          </p>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-5">
          <p className="text-caption text-foreground-muted mb-1">
            Total Earnings
          </p>
          <div className="flex items-center gap-2">
            <p className="text-heading-sm font-semibold text-foreground-default">
              ${totalEarnings.toLocaleString()}
            </p>
            <Badge variant="success" size="sm">
              Lifetime
            </Badge>
          </div>
        </div>
      </div>

      {/* Payout info */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-subtle)] p-5">
        <p className="text-body-sm text-foreground-muted">
          Payouts are processed weekly via Stripe. Funds typically arrive in
          your bank account within 2-3 business days after processing.
        </p>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);

  useEffect(() => {
    setPrefs(loadNotificationPrefs());
  }, []);

  const toggle = useCallback(
    (key: keyof NotificationPrefs) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: !prev[key] };
        saveNotificationPrefs(next);
        return next;
      });
    },
    []
  );

  return (
    <div className="space-y-6">
      <h2 className="text-heading-sm font-medium text-foreground-default">
        Notifications
      </h2>

      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-6 space-y-5">
        <SwitchWithLabel
          label="New bookings"
          helperText="Get notified when a client books a session"
          checked={prefs.newBookings}
          onCheckedChange={() => toggle("newBookings")}
        />
        <div className="border-t border-[var(--border-muted)]" />

        <SwitchWithLabel
          label="Session reminders"
          helperText="Reminders 24h and 1h before sessions"
          checked={prefs.sessionReminders}
          onCheckedChange={() => toggle("sessionReminders")}
        />
        <div className="border-t border-[var(--border-muted)]" />

        <SwitchWithLabel
          label="Messages"
          helperText="New messages from clients"
          checked={prefs.messages}
          onCheckedChange={() => toggle("messages")}
        />
        <div className="border-t border-[var(--border-muted)]" />

        <SwitchWithLabel
          label="Payment received"
          helperText="When a payout is processed"
          checked={prefs.paymentReceived}
          onCheckedChange={() => toggle("paymentReceived")}
        />
      </div>
    </div>
  );
}

function PrivacySection() {
  const [profileVisible, setProfileVisible] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-heading-sm font-medium text-foreground-default">
        Privacy
      </h2>

      {/* Profile visibility */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--primitive-green-100)]">
            <Eye size={20} weight="fill" className="text-[var(--primitive-green-600)]" />
          </div>
          <div className="flex-1 min-w-0">
            <SwitchWithLabel
              label="Profile visibility"
              helperText="Control who can find your coaching profile"
              checked={profileVisible}
              onCheckedChange={(checked) =>
                setProfileVisible(checked as boolean)
              }
            />
          </div>
        </div>
      </div>

      {/* Data & account actions */}
      <div className="rounded-[var(--radius-xl)] border border-[var(--border-muted)] bg-[var(--background-default)] p-6 space-y-5">
        {/* Download data */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body-strong font-medium text-foreground-default">
              Download my data
            </h3>
            <p className="text-body-sm text-foreground-muted">
              Export all your data in a portable format
            </p>
          </div>
          <Button
            variant="tertiary"
            size="sm"
            leftIcon={<Download size={16} />}
            disabled
          >
            Download
            <Badge variant="neutral" size="sm" className="ml-2">
              Coming soon
            </Badge>
          </Button>
        </div>

        <div className="border-t border-[var(--border-muted)]" />

        {/* Delete account */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body-strong font-medium text-[var(--foreground-error)]">
              Delete account
            </h3>
            <p className="text-body-sm text-foreground-muted">
              Permanently delete your account and all associated data
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            leftIcon={<Trash size={16} />}
            disabled
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CoachSettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const [profileRes, coachRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/profile/coach"),
        ]);

        let accountData: ProfileData | null = null;

        if (profileRes.ok) {
          const json = await profileRes.json();
          accountData = json.account ?? json;
        }

        if (coachRes.ok && accountData) {
          const coachJson = await coachRes.json();
          // Merge coach-specific data into coachProfile
          accountData.coachProfile = {
            ...accountData.coachProfile,
            ...coachJson,
          };
        }

        setProfile(accountData);
      } catch {
        // Fallback to empty profile so the page still renders
        setProfile({
          id: "",
          name: "",
          email: "",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Save profile handler
  const handleSaveProfile = useCallback(
    async (fields: {
      name: string;
      bio: string;
      headline: string;
      hourlyRate: string;
    }) => {
      setSaving(true);
      try {
        const body: Record<string, unknown> = {
          name: fields.name,
          bio: fields.bio,
        };
        // Include coach-specific fields
        if (fields.headline) body.headline = fields.headline;
        if (fields.hourlyRate) body.hourlyRate = Number(fields.hourlyRate);

        const res = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const json = await res.json();
          const updated = json.account ?? json;
          setProfile((prev) =>
            prev
              ? {
                  ...prev,
                  ...updated,
                  coachProfile: {
                    ...prev.coachProfile,
                    ...updated.coachProfile,
                    headline:
                      fields.headline ||
                      prev.coachProfile?.headline,
                    hourlyRate: fields.hourlyRate
                      ? Number(fields.hourlyRate)
                      : prev.coachProfile?.hourlyRate,
                  },
                }
              : prev
          );
          setIsEditing(false);
        }
      } catch {
        // silently handle; could add toast in the future
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // Sign out handler
  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }, [router]);

  // Render active section content
  function renderSection() {
    if (loading || !profile) {
      return (
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" label="Loading settings..." />
        </div>
      );
    }

    switch (activeSection) {
      case "profile":
        return (
          <ProfileSection
            profile={profile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            saving={saving}
            onSave={handleSaveProfile}
          />
        );
      case "availability":
        return <AvailabilitySection />;
      case "payments":
        return <PaymentsSection profile={profile} />;
      case "notifications":
        return <NotificationsSection />;
      case "privacy":
        return <PrivacySection />;
      default:
        return null;
    }
  }

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="flex flex-col lg:flex-row gap-6 px-8 py-6 lg:px-12">
        {/* Left sidebar nav */}
        <nav className="lg:w-64 flex-shrink-0">
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
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[var(--primitive-yellow-100)] text-[var(--primitive-green-800)]"
                      : "text-foreground-muted hover:bg-[var(--primitive-neutral-100)]"
                  }`}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span className="text-body-sm font-medium">
                    {section.label}
                  </span>
                </button>
              );
            })}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[var(--primitive-red-600)] hover:bg-[var(--primitive-red-100)] transition-colors"
            >
              <SignOut size={20} weight="regular" />
              <span className="text-body-sm font-medium">Sign out</span>
            </button>
          </div>
        </nav>

        {/* Main content */}
        <div className="flex-1 min-w-0">{renderSection()}</div>
      </div>
    </div>
  );
}

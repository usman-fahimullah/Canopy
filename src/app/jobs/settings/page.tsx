"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { SwitchWithLabel } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItemWithLabel } from "@/components/ui/radio-group";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import {
  User,
  Bell,
  ShieldCheck,
  SignOut,
  Pencil,
  Check,
  X,
  MapPin,
  Download,
  Trash,
  Eye,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import { NOTIFICATION_CATEGORIES } from "@/lib/validators/notifications";

type SettingsSection = "profile" | "notifications" | "privacy";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  headline: string | null;
}

const SIDEBAR_ITEMS = [
  { id: "profile" as SettingsSection, label: "Profile", icon: User },
  { id: "notifications" as SettingsSection, label: "Notifications", icon: Bell },
  { id: "privacy" as SettingsSection, label: "Privacy", icon: ShieldCheck },
];

export default function TalentSettingsPage() {
  const router = useRouter();

  // Section state
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  // Profile loading / data
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formLocation, setFormLocation] = useState("");

  // Notification prefs
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifPrefs, setNotifPrefs] = useState<{
    inAppPrefs: Record<string, boolean>;
    emailPrefs: Record<string, boolean>;
    emailFrequency: string;
  }>({
    inAppPrefs: {},
    emailPrefs: {},
    emailFrequency: "immediate",
  });

  // Privacy toggles
  const [profileVisible, setProfileVisible] = useState(true);
  const [searchVisible, setSearchVisible] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const acct = data.account;
          const profileData: ProfileData = {
            id: acct.id,
            name: acct.name || "",
            email: acct.email || "",
            avatar: acct.avatar || null,
            bio: acct.bio || null,
            location: acct.location || null,
            phone: acct.phone || null,
            headline: acct.seekerProfile?.headline || null,
          };
          setProfile(profileData);
          setFormName(profileData.name);
          setFormBio(profileData.bio || "");
          setFormLocation(profileData.location || "");
        } else {
          logger.error("Failed to fetch profile", { error: formatError(res.status) });
        }
      } catch (err) {
        logger.error("Error fetching profile", { error: formatError(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch notification prefs from API
  useEffect(() => {
    if (activeSection !== "notifications") return;
    const fetchPrefs = async () => {
      try {
        const res = await fetch("/api/notifications/preferences");
        if (res.ok) {
          const data = await res.json();
          setNotifPrefs({
            inAppPrefs:
              typeof data.preferences.inAppPrefs === "string"
                ? JSON.parse(data.preferences.inAppPrefs)
                : data.preferences.inAppPrefs || {},
            emailPrefs:
              typeof data.preferences.emailPrefs === "string"
                ? JSON.parse(data.preferences.emailPrefs)
                : data.preferences.emailPrefs || {},
            emailFrequency: data.preferences.emailFrequency || "immediate",
          });
        }
      } catch (err) {
        logger.error("Failed to fetch notification prefs", { error: formatError(err) });
      } finally {
        setNotifLoading(false);
      }
    };
    fetchPrefs();
  }, [activeSection]);

  const handleNotifToggle = async (type: string, channel: "inApp" | "email", value: boolean) => {
    const key = channel === "inApp" ? "inAppPrefs" : "emailPrefs";
    const updated = { ...notifPrefs, [key]: { ...notifPrefs[key], [type]: value } };
    setNotifPrefs(updated); // optimistic
    try {
      await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: updated[key] }),
      });
    } catch (err) {
      logger.error("Failed to save notification pref", { error: formatError(err) });
    }
  };

  const handleFrequencyChange = async (frequency: string) => {
    setNotifPrefs((prev) => ({ ...prev, emailFrequency: frequency }));
    try {
      await fetch("/api/notifications/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailFrequency: frequency }),
      });
    } catch (err) {
      logger.error("Failed to save email frequency", { error: formatError(err) });
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          bio: formBio.trim() || null,
          location: formLocation.trim() || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const acct = data.account;
        const updated: ProfileData = {
          id: acct.id,
          name: acct.name || "",
          email: acct.email || "",
          avatar: acct.avatar || null,
          bio: acct.bio || null,
          location: acct.location || null,
          phone: acct.phone || null,
          headline: acct.seekerProfile?.headline || null,
        };
        setProfile(updated);
        setFormName(updated.name);
        setFormBio(updated.bio || "");
        setFormLocation(updated.location || "");
        setIsEditing(false);
      } else {
        logger.error("Failed to save profile", { error: formatError(res.status) });
      }
    } catch (err) {
      logger.error("Error saving profile", { error: formatError(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormName(profile.name);
      setFormBio(profile.bio || "");
      setFormLocation(profile.location || "");
    }
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err) {
      logger.error("Error signing out", { error: formatError(err) });
    }
  };

  // Loading state
  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" />
        <div className="flex items-center justify-center py-24">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (!profile) {
    return (
      <div>
        <PageHeader title="Settings" />
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-body text-foreground-muted">
            Unable to load your profile. Please try again.
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-12">
        {/* Sidebar nav */}
        <nav className="flex-shrink-0 lg:w-64">
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-[var(--background-brand-subtle)] text-[var(--foreground-brand-emphasis)]"
                      : "text-foreground-muted hover:bg-[var(--background-interactive-hover)]"
                  }`}
                >
                  <Icon size={20} weight={isActive ? "fill" : "regular"} />
                  <span className="text-body-sm font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[var(--foreground-error)] transition-colors hover:bg-[var(--background-error)]"
            >
              <SignOut size={20} weight="regular" />
              <span className="text-body-sm font-medium">Sign out</span>
            </button>
          </div>
        </nav>

        {/* Content area */}
        <div className="min-w-0 flex-1">
          {/* ========== PROFILE SECTION ========== */}
          {activeSection === "profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-foreground-default text-heading-sm font-medium">Profile</h2>
                {!isEditing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Pencil size={16} />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<X size={16} />}
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Check size={16} />}
                      onClick={handleSave}
                      loading={saving}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)]">
                {/* Avatar & name header */}
                <div className="flex items-center gap-4 border-b border-[var(--border-muted)] px-6 py-6">
                  <Avatar
                    size="lg"
                    src={profile.avatar || undefined}
                    name={profile.name}
                    color="green"
                  />
                  <div className="min-w-0 flex-1">
                    {!isEditing ? (
                      <>
                        <p className="text-foreground-default truncate text-body-strong font-semibold">
                          {profile.name || "No name set"}
                        </p>
                        {profile.headline && (
                          <p className="truncate text-caption text-foreground-muted">
                            {profile.headline}
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="space-y-1.5">
                        <Label htmlFor="edit-name">Full name</Label>
                        <Input
                          id="edit-name"
                          type="text"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Your full name"
                          inputSize="sm"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="flex items-center justify-between border-b border-[var(--border-muted)] px-6 py-4">
                  <div>
                    <p className="text-foreground-default text-body-sm font-medium">Email</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-caption text-foreground-muted">{profile.email}</p>
                      <Badge variant="neutral" size="sm">
                        Read-only
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="border-b border-[var(--border-muted)] px-6 py-4">
                  <p className="text-foreground-default mb-1 text-body-sm font-medium">Bio</p>
                  {!isEditing ? (
                    <p className="text-caption text-foreground-muted">
                      {profile.bio || "No bio added yet"}
                    </p>
                  ) : (
                    <Textarea
                      id="edit-bio"
                      value={formBio}
                      onChange={(e) => setFormBio(e.target.value)}
                      placeholder="Tell employers a bit about yourself..."
                      rows={4}
                    />
                  )}
                </div>

                {/* Location */}
                <div className="px-6 py-4">
                  <p className="text-foreground-default mb-1 text-body-sm font-medium">Location</p>
                  {!isEditing ? (
                    <div className="flex items-center gap-1.5 text-caption text-foreground-muted">
                      <MapPin size={14} weight="regular" />
                      <span>{profile.location || "No location set"}</span>
                    </div>
                  ) : (
                    <Input
                      id="edit-location"
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="City, Country"
                      inputSize="sm"
                      leftAddon={<MapPin size={18} />}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== NOTIFICATIONS SECTION ========== */}
          {activeSection === "notifications" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground-default text-heading-sm font-medium">
                  Notifications
                </h2>
                <p className="mt-1 text-caption text-foreground-muted">
                  Choose what notifications you receive
                </p>
              </div>

              {notifLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Email Frequency Selector */}
                  <div className="rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)] p-6">
                    <div className="space-y-3">
                      <Label className="text-foreground-default font-medium">Email Frequency</Label>
                      <RadioGroup
                        value={notifPrefs.emailFrequency}
                        onValueChange={handleFrequencyChange}
                        className="space-y-2"
                      >
                        {["immediate", "daily", "weekly", "never"].map((freq) => (
                          <RadioGroupItemWithLabel
                            key={freq}
                            value={freq}
                            label={
                              freq === "immediate"
                                ? "Immediate"
                                : freq.charAt(0).toUpperCase() + freq.slice(1)
                            }
                          />
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Categorized Notification Preferences */}
                  {NOTIFICATION_CATEGORIES.map((category) => (
                    <div key={category.label} className="space-y-3">
                      <h3 className="text-foreground-default text-body-sm font-semibold">
                        {category.label}
                      </h3>
                      <div className="divide-y divide-[var(--border-muted)] rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)]">
                        {category.types.map((notification) => (
                          <div key={notification.type} className="px-6 py-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-foreground-default text-body-sm font-medium">
                                  {notification.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-6">
                                <CheckboxWithLabel
                                  id={`inapp-${notification.type}`}
                                  label="In-app"
                                  checked={notifPrefs.inAppPrefs[notification.type] !== false}
                                  onCheckedChange={(checked) =>
                                    handleNotifToggle(notification.type, "inApp", checked === true)
                                  }
                                />
                                <CheckboxWithLabel
                                  id={`email-${notification.type}`}
                                  label="Email"
                                  checked={notifPrefs.emailPrefs[notification.type] !== false}
                                  onCheckedChange={(checked) =>
                                    handleNotifToggle(notification.type, "email", checked === true)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== PRIVACY SECTION ========== */}
          {activeSection === "privacy" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-foreground-default text-heading-sm font-medium">Privacy</h2>
                <p className="mt-1 text-caption text-foreground-muted">
                  Control your profile visibility and data
                </p>
              </div>

              <div className="divide-y divide-[var(--border-muted)] rounded-[var(--radius-2xl)] border border-[var(--border-muted)] bg-[var(--card-background)]">
                {/* Profile visibility */}
                <div className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-[var(--background-brand-subtle)] p-2">
                      <Eye size={18} className="text-[var(--foreground-brand)]" />
                    </div>
                    <div className="flex-1">
                      <SwitchWithLabel
                        label="Profile visibility"
                        helperText="Control who can see your profile"
                        checked={profileVisible}
                        onCheckedChange={setProfileVisible}
                      />
                    </div>
                  </div>
                </div>

                {/* Search visibility */}
                <div className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-[var(--background-brand-subtle)] p-2">
                      <MagnifyingGlass size={18} className="text-[var(--foreground-brand)]" />
                    </div>
                    <div className="flex-1">
                      <SwitchWithLabel
                        label="Search visibility"
                        helperText="Appear in employer search results"
                        checked={searchVisible}
                        onCheckedChange={setSearchVisible}
                      />
                    </div>
                  </div>
                </div>

                {/* Download my data */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-[var(--background-muted)] p-2">
                        <Download size={18} className="text-[var(--foreground-muted)]" />
                      </div>
                      <div>
                        <p className="text-foreground-default text-body-sm font-medium">
                          Download my data
                        </p>
                        <p className="text-caption text-foreground-muted">Export all your data</p>
                      </div>
                    </div>
                    <Button variant="tertiary" size="sm" disabled>
                      Coming soon
                    </Button>
                  </div>
                </div>

                {/* Delete account */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-[var(--background-error)] p-2">
                        <Trash size={18} className="text-[var(--foreground-error)]" />
                      </div>
                      <div>
                        <p className="text-body-sm font-medium text-[var(--foreground-error)]">
                          Delete account
                        </p>
                        <p className="text-caption text-foreground-muted">
                          Permanently delete your account and data
                        </p>
                      </div>
                    </div>
                    {!showDeleteConfirm ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(true)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-caption font-medium text-[var(--foreground-error)]">
                          Not available yet
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

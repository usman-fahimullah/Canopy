"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SwitchWithLabel } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsListVertical, TabsTriggerVertical } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  SignOut,
  Camera,
  Pencil,
  Check,
  X,
} from "@phosphor-icons/react";

type SettingsTab = "profile" | "notifications" | "privacy" | "billing";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  targetSectors: string[];
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Notification settings (must be declared before any conditional returns)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      let profileLoaded = false;

      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          const acct = data.account;
          const nameParts = (acct.name || "").split(" ");
          const userData: UserData = {
            id: acct.id,
            email: acct.email || "",
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            avatar: acct.avatar || null,
            bio: acct.bio || null,
            location: acct.location || null,
            targetSectors: acct.seekerProfile?.targetSectors || [],
          };
          setUser(userData);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setBio(userData.bio || "");
          setLocation(userData.location || "");
          profileLoaded = true;
        }
      } catch {
        // API fetch failed, will fall through to Supabase fallback
      }

      // Fallback to Supabase auth if API didn't return profile data
      if (!profileLoaded) {
        try {
          const supabase = createClient();
          const {
            data: { user: authUser },
          } = await supabase.auth.getUser();
          if (authUser) {
            const nameParts = (
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              authUser.email?.split("@")[0] ||
              "User"
            ).split(" ");
            setUser({
              id: authUser.id,
              email: authUser.email || "",
              firstName: nameParts[0] || "",
              lastName: nameParts.slice(1).join(" ") || "",
              avatar: authUser.user_metadata?.avatar_url || null,
              bio: null,
              location: null,
              targetSectors: [],
            });
          }
        } catch {
          // Supabase auth also failed
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-foreground-muted">Unable to load your profile. Please try again.</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const tabItems = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "privacy" as SettingsTab, label: "Privacy", icon: Shield },
    { id: "billing" as SettingsTab, label: "Billing", icon: CreditCard },
  ];

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          bio: bio || null,
          location: location || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const acct = data.account;
        const nameParts = (acct.name || "").split(" ");
        setUser({
          id: acct.id,
          email: acct.email || "",
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          avatar: acct.avatar || null,
          bio: acct.bio || null,
          location: acct.location || null,
          targetSectors: acct.seekerProfile?.targetSectors || [],
        });
      }
    } catch {
      // Save failed silently
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setBio(user.bio || "");
      setLocation(user.location || "");
    }
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-24 sm:px-6 md:pb-8 lg:px-8">
      <h1 className="text-foreground-default text-heading-md font-semibold">Settings</h1>
      <p className="mt-1 text-body text-foreground-muted">
        Manage your account settings and preferences
      </p>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsTab)}
        className="mt-8 flex flex-col gap-8 lg:flex-row"
      >
        {/* Vertical Tabs Navigation */}
        <TabsListVertical className="flex flex-row gap-1 lg:w-48 lg:flex-col">
          {tabItems.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTriggerVertical key={tab.id} value={tab.id} className="flex items-center gap-3">
                <Icon size={18} weight={activeTab === tab.id ? "fill" : "regular"} />
                <span className="hidden lg:inline">{tab.label}</span>
              </TabsTriggerVertical>
            );
          })}
        </TabsListVertical>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Pencil size={16} />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<X size={16} />}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Check size={16} />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      size="xl"
                      src={user.avatar || undefined}
                      name={`${user.firstName} ${user.lastName}`}
                      color="green"
                    />
                    {isEditing && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="absolute bottom-0 right-0 rounded-full p-2"
                      >
                        <Camera size={14} />
                      </Button>
                    )}
                  </div>
                  <div>
                    <p className="text-foreground-default text-body-strong font-medium">
                      Profile Photo
                    </p>
                    <p className="text-caption text-foreground-muted">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      inputSize="sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      inputSize="sm"
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" description="Contact support to change your email address">
                    Email
                  </Label>
                  <Input id="email" type="email" value={user.email} disabled inputSize="sm" />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, Country"
                    inputSize="sm"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                {/* Sectors */}
                <div className="space-y-1.5">
                  <Label>Target Sectors</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.targetSectors.length > 0 ? (
                      user.targetSectors.map((sector) => (
                        <Badge key={sector} variant="info" size="sm">
                          {sector}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-caption text-foreground-muted">No sectors selected</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <p className="text-caption text-foreground-muted">
                  Choose how you want to receive updates
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <SwitchWithLabel
                    label="Email Notifications"
                    helperText="Receive important updates via email"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <SwitchWithLabel
                    label="Session Reminders"
                    helperText="Get reminded before your scheduled sessions"
                    checked={sessionReminders}
                    onCheckedChange={setSessionReminders}
                  />
                </div>
                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <SwitchWithLabel
                    label="New Messages"
                    helperText="Be notified when you receive a new message"
                    checked={newMessages}
                    onCheckedChange={setNewMessages}
                  />
                </div>
                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <SwitchWithLabel
                    label="Community Updates"
                    helperText="Receive updates about community events and news"
                    checked={communityUpdates}
                    onCheckedChange={setCommunityUpdates}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <p className="text-caption text-foreground-muted">
                  Control your data and privacy preferences
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <h3 className="text-foreground-default text-body-strong font-medium">
                    Profile Visibility
                  </h3>
                  <p className="mt-1 text-caption text-foreground-muted">
                    Your profile is visible to other Candid members
                  </p>
                </div>

                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <h3 className="text-foreground-default text-body-strong font-medium">
                    Data Export
                  </h3>
                  <p className="mt-1 text-caption text-foreground-muted">
                    Download a copy of your data
                  </p>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Request Export
                  </Button>
                </div>

                <div className="rounded-lg bg-[var(--primitive-red-100)] p-4">
                  <h3 className="text-body-strong font-medium text-[var(--primitive-red-700)]">
                    Delete Account
                  </h3>
                  <p className="mt-1 text-caption text-[var(--primitive-red-600)]">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive" size="sm" className="mt-3">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <p className="text-caption text-foreground-muted">
                  Manage your payment methods and billing history
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="rounded-lg bg-[var(--candid-background-subtle)] p-4">
                  <p className="text-body-strong font-medium text-[var(--candid-foreground-brand)]">
                    Free Plan
                  </p>
                  <p className="text-[var(--candid-foreground-brand)]/70 mt-1 text-caption">
                    You&apos;re currently on the free tier. Upgrade to access premium features.
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground-default text-body-strong font-medium">
                    Payment History
                  </h3>
                  <p className="mt-2 text-caption text-foreground-muted">No payments yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Out */}
          <Button
            variant="ghost"
            className="mt-6 text-[var(--primitive-red-600)] hover:bg-[var(--primitive-red-100)] hover:text-[var(--primitive-red-700)]"
            leftIcon={<SignOut size={18} />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </Tabs>
    </div>
  );
}

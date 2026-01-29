"use client";

import { useState } from "react";
import { currentUser } from "@/lib/candid";
import { SECTOR_INFO } from "@/lib/candid/types";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [bio, setBio] = useState(currentUser.bio || "");
  const [location, setLocation] = useState(currentUser.location || "");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "privacy" as SettingsTab, label: "Privacy", icon: Shield },
    { id: "billing" as SettingsTab, label: "Billing", icon: CreditCard },
  ];

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setFirstName(currentUser.firstName);
    setLastName(currentUser.lastName);
    setBio(currentUser.bio || "");
    setLocation(currentUser.location || "");
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <h1 className="text-heading-md font-semibold text-foreground-default">Settings</h1>
      <p className="mt-1 text-body text-foreground-muted">
        Manage your account settings and preferences
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        {/* Tabs */}
        <nav className="flex flex-row gap-1 lg:flex-col lg:w-48">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-body font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[var(--primitive-blue-200)] text-[var(--primitive-green-800)]"
                    : "text-foreground-muted hover:bg-[var(--background-subtle)]"
                }`}
              >
                <Icon size={18} weight={activeTab === tab.id ? "fill" : "regular"} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content */}
        <div className="flex-1">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="rounded-card bg-white shadow-card">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-default)] p-6">
                <h2 className="text-heading-sm font-semibold text-foreground-default">Profile Information</h2>
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
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar
                      size="xl"
                      src={currentUser.avatar}
                      name={`${currentUser.firstName} ${currentUser.lastName}`}
                      color="green"
                    />
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 rounded-full bg-[var(--primitive-green-800)] p-2 text-white shadow-lg">
                        <Camera size={14} />
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-body-strong font-medium text-foreground-default">Profile Photo</p>
                    <p className="text-caption text-foreground-muted">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-caption font-medium text-foreground-default">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-white px-4 py-2.5 text-body text-foreground-default disabled:bg-[var(--background-subtle)] disabled:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
                    />
                  </div>
                  <div>
                    <label className="block text-caption font-medium text-foreground-default">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-white px-4 py-2.5 text-body text-foreground-default disabled:bg-[var(--background-subtle)] disabled:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
                    />
                  </div>
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-caption font-medium text-foreground-default">
                    Email
                  </label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-2.5 text-body text-foreground-muted"
                  />
                  <p className="mt-1 text-caption text-foreground-muted">
                    Contact support to change your email address
                  </p>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-caption font-medium text-foreground-default">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, Country"
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-white px-4 py-2.5 text-body text-foreground-default placeholder:text-foreground-muted disabled:bg-[var(--background-subtle)] disabled:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-caption font-medium text-foreground-default">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-[var(--border-default)] bg-white px-4 py-2.5 text-body text-foreground-default disabled:bg-[var(--background-subtle)] disabled:text-foreground-muted focus:border-[var(--primitive-green-800)] focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-800)]/10"
                  />
                </div>

                {/* Sectors */}
                <div>
                  <label className="block text-caption font-medium text-foreground-default">
                    Target Sectors
                  </label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentUser.targetSectors.map((sector) => (
                      <Chip key={sector} variant="blue" size="sm">
                        {SECTOR_INFO[sector].label}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="rounded-card bg-white shadow-card">
              <div className="p-6">
              <h2 className="text-heading-sm font-semibold text-foreground-default">
                Notification Preferences
              </h2>
              <p className="mt-1 text-caption text-foreground-muted">
                Choose how you want to receive updates
              </p>

              <div className="mt-6 space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    description: "Receive important updates via email",
                    value: emailNotifications,
                    onChange: setEmailNotifications,
                  },
                  {
                    label: "Session Reminders",
                    description: "Get reminded before your scheduled sessions",
                    value: sessionReminders,
                    onChange: setSessionReminders,
                  },
                  {
                    label: "New Messages",
                    description: "Be notified when you receive a new message",
                    value: newMessages,
                    onChange: setNewMessages,
                  },
                  {
                    label: "Community Updates",
                    description: "Receive updates about community events and news",
                    value: communityUpdates,
                    onChange: setCommunityUpdates,
                  },
                ].map((setting) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between rounded-lg bg-[var(--background-subtle)] p-4"
                  >
                    <div>
                      <p className="text-body-strong font-medium text-foreground-default">{setting.label}</p>
                      <p className="text-caption text-foreground-muted">{setting.description}</p>
                    </div>
                    <button
                      onClick={() => setting.onChange(!setting.value)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        setting.value ? "bg-[var(--primitive-green-800)]" : "bg-[var(--primitive-neutral-300)]"
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          setting.value ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="rounded-card bg-white shadow-card">
              <div className="p-6">
              <h2 className="text-heading-sm font-semibold text-foreground-default">
                Privacy Settings
              </h2>
              <p className="mt-1 text-caption text-foreground-muted">
                Control your data and privacy preferences
              </p>

              <div className="mt-6 space-y-6">
                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <h3 className="text-body-strong font-medium text-foreground-default">Profile Visibility</h3>
                  <p className="mt-1 text-caption text-foreground-muted">
                    Your profile is visible to other Candid members
                  </p>
                </div>

                <div className="rounded-lg bg-[var(--background-subtle)] p-4">
                  <h3 className="text-body-strong font-medium text-foreground-default">Data Export</h3>
                  <p className="mt-1 text-caption text-foreground-muted">
                    Download a copy of your data
                  </p>
                  <Button variant="secondary" size="sm" className="mt-3">
                    Request Export
                  </Button>
                </div>

                <div className="rounded-lg bg-[var(--primitive-red-100)] p-4">
                  <h3 className="text-body-strong font-medium text-[var(--primitive-red-700)]">Delete Account</h3>
                  <p className="mt-1 text-caption text-[var(--primitive-red-600)]">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="ghost" size="sm" className="mt-3 text-[var(--primitive-red-700)] hover:bg-[var(--primitive-red-200)]">
                    Delete Account
                  </Button>
                </div>
              </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="rounded-card bg-white shadow-card">
              <div className="p-6">
              <h2 className="text-heading-sm font-semibold text-foreground-default">
                Billing & Payments
              </h2>
              <p className="mt-1 text-caption text-foreground-muted">
                Manage your payment methods and billing history
              </p>

              <div className="mt-6 rounded-lg bg-[var(--primitive-blue-200)] p-4">
                <p className="text-body-strong font-medium text-[var(--primitive-green-800)]">Free Plan</p>
                <p className="mt-1 text-caption text-[var(--primitive-green-800)]/70">
                  You're currently on the free tier. Upgrade to access premium features.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-body-strong font-medium text-foreground-default">Payment History</h3>
                <p className="mt-2 text-caption text-foreground-muted">No payments yet</p>
              </div>
              </div>
            </div>
          )}

          {/* Sign Out */}
          <Button variant="ghost" className="mt-6 text-[var(--primitive-red-600)] hover:text-[var(--primitive-red-700)] hover:bg-[var(--primitive-red-100)]" leftIcon={<SignOut size={18} />}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

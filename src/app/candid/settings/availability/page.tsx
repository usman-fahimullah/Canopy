"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Clock,
  Plus,
  Trash,
  FloppyDisk,
  CalendarBlank,
  ArrowLeft,
  Timer,
  UsersThree,
  VideoCamera,
} from "@phosphor-icons/react";
import Link from "next/link";

interface TimeSlot {
  start: string;
  end: string;
}

interface WeeklyAvailability {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

type DayKey = keyof WeeklyAvailability;

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const EMPTY_AVAILABILITY: WeeklyAvailability = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function AvailabilitySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [availability, setAvailability] = useState<WeeklyAvailability>(EMPTY_AVAILABILITY);
  const [sessionDuration, setSessionDuration] = useState(60);
  const [bufferTime, setBufferTime] = useState(15);
  const [maxSessionsPerWeek, setMaxSessionsPerWeek] = useState(20);
  const [videoLink, setVideoLink] = useState("");

  const fetchAvailability = useCallback(async () => {
    try {
      const res = await fetch("/api/availability");
      if (res.ok) {
        const data = await res.json();
        if (data.availability) {
          setAvailability(data.availability);
        }
        if (data.sessionDuration) setSessionDuration(data.sessionDuration);
        if (data.bufferTime !== undefined) setBufferTime(data.bufferTime);
        if (data.maxSessionsPerWeek) setMaxSessionsPerWeek(data.maxSessionsPerWeek);
        if (data.videoLink) setVideoLink(data.videoLink);
      }
    } catch {
      setError("Failed to load availability settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availability,
          sessionDuration,
          bufferTime,
          maxSessionsPerWeek,
          videoLink: videoLink || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  const addSlot = (day: DayKey) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { start: "09:00", end: "17:00" }],
    }));
  };

  const removeSlot = (day: DayKey, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const updateSlot = (day: DayKey, index: number, field: "start" | "end", value: string) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const copyToAll = (sourceDay: DayKey) => {
    const sourceSlots = availability[sourceDay];
    setAvailability((prev) => {
      const updated = { ...prev };
      for (const day of DAYS) {
        if (day.key !== sourceDay) {
          updated[day.key] = sourceSlots.map((s) => ({ ...s }));
        }
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/candid/settings"
          className="inline-flex items-center gap-1.5 text-caption text-foreground-muted hover:text-foreground-default transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Settings
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-heading-sm font-semibold text-foreground-default">
              Availability Settings
            </h1>
            <p className="mt-1 text-body-sm text-foreground-muted">
              Set your weekly availability so seekers can book sessions with you
            </p>
          </div>
          <Button
            onClick={handleSave}
            loading={saving}
            leftIcon={<FloppyDisk size={18} />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status messages */}
      {error && (
        <div className="mb-6 rounded-lg bg-[var(--background-error)] px-4 py-3 text-sm text-[var(--foreground-error)]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-lg bg-[var(--background-success)] px-4 py-3 text-sm text-[var(--foreground-success)]">
          Availability saved successfully
        </div>
      )}

      <div className="space-y-6">
        {/* Session Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Session Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="duration" description="Length of each coaching session">
                  <span className="flex items-center gap-1.5">
                    <Timer size={16} />
                    Session Duration (minutes)
                  </span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min={15}
                  max={180}
                  step={15}
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number(e.target.value))}
                  inputSize="sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="buffer" description="Break time between consecutive sessions">
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} />
                    Buffer Time (minutes)
                  </span>
                </Label>
                <Input
                  id="buffer"
                  type="number"
                  min={0}
                  max={60}
                  step={5}
                  value={bufferTime}
                  onChange={(e) => setBufferTime(Number(e.target.value))}
                  inputSize="sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maxSessions" description="Limit how many sessions you take per week">
                  <span className="flex items-center gap-1.5">
                    <UsersThree size={16} />
                    Max Sessions / Week
                  </span>
                </Label>
                <Input
                  id="maxSessions"
                  type="number"
                  min={1}
                  max={50}
                  value={maxSessionsPerWeek}
                  onChange={(e) => setMaxSessionsPerWeek(Number(e.target.value))}
                  inputSize="sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="videoLink" description="Meeting link shared with seekers upon booking">
                  <span className="flex items-center gap-1.5">
                    <VideoCamera size={16} />
                    Video Meeting Link
                  </span>
                </Label>
                <Input
                  id="videoLink"
                  type="url"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  inputSize="sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarBlank size={20} />
              Weekly Availability
            </CardTitle>
            <p className="text-caption text-foreground-muted mt-1">
              Set the hours you&apos;re available for each day of the week. Leave a day empty if unavailable.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS.map((day) => (
                <div
                  key={day.key}
                  className="rounded-lg border border-[var(--border-muted)] p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-body-strong font-medium text-foreground-default w-24">
                        {day.label}
                      </span>
                      {availability[day.key].length === 0 && (
                        <span className="text-caption text-foreground-subtle">
                          Unavailable
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {availability[day.key].length > 0 && (
                        <button
                          onClick={() => copyToAll(day.key)}
                          className="text-caption text-[var(--foreground-link)] hover:text-[var(--foreground-link-hover)] transition-colors"
                        >
                          Copy to all days
                        </button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Plus size={14} />}
                        onClick={() => addSlot(day.key)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {availability[day.key].length > 0 && (
                    <div className="space-y-2">
                      {availability[day.key].map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(day.key, idx, "start", e.target.value)}
                            inputSize="sm"
                            className="w-32"
                          />
                          <span className="text-caption text-foreground-muted">to</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(day.key, idx, "end", e.target.value)}
                            inputSize="sm"
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSlot(day.key, idx)}
                            className="text-[var(--foreground-error)] hover:bg-[var(--background-error)]"
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom save button for mobile */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            loading={saving}
            leftIcon={<FloppyDisk size={18} />}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

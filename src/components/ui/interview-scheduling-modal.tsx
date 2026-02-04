"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./dropdown";
import { Avatar } from "./avatar";
import { Banner } from "./banner";
import { SegmentedController } from "./segmented-controller";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import {
  X,
  Clock,
  VideoCamera,
  MapPin,
  Users,
  GlobeHemisphereWest,
  GoogleLogo,
  TextAlignLeft,
  CalendarBlank,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import {
  type Attendee,
  type AttendeeAvailability,
  type InterviewTimeSlot as TimeSlot,
  type RecruiterEvent,
  type InterviewSchedulingModalProps,
  DURATION_OPTIONS,
  ROLE_LABELS,
  ROLE_COLORS,
  getTimezoneAbbr,
} from "@/lib/scheduling";

// Re-export types for consumers importing from this file
export type { Attendee, AttendeeAvailability, RecruiterEvent, InterviewSchedulingModalProps };
export type { InterviewTimeSlot as TimeSlot } from "@/lib/scheduling";

import { AttendeeChip } from "./attendee-chip";
import { TimeSlotChip } from "./time-slot-chip";
import { InternalNotesSection } from "./internal-notes-section";
import { AddAttendeePopover } from "./add-attendee-popover";
import { CandidatePreviewCard } from "./candidate-preview-card";
import { SuggestTimesButton } from "./suggest-times-button";
import { CalendarOverlayToggle } from "./calendar-overlay-toggle";
import { AvailabilityCalendar } from "./availability-calendar";
import { YourCalendarView } from "./your-calendar-view";

/* ============================================
   Constants (component-local — references React icons)
   ============================================ */
const VIDEO_PROVIDER_OPTIONS = [
  { value: "google-meet", label: "Google Meet", icon: GoogleLogo },
  { value: "zoom", label: "Zoom", icon: VideoCamera },
  { value: "microsoft-teams", label: "MS Teams", icon: VideoCamera },
  { value: "none", label: "In person", icon: MapPin },
];

/* ============================================
   Main InterviewSchedulingModal Component
   ============================================ */
export const InterviewSchedulingModal: React.FC<InterviewSchedulingModalProps> = ({
  open,
  onOpenChange,
  candidate,
  job,
  initialAttendees = [],
  defaults = {},
  onSchedule,
  onPreview,
  onSuggestTimes,
  teamMembers = [],
  calendars = [],
  myCalendarEvents = [],
  className,
}) => {
  // Form state
  const [title, setTitle] = React.useState(job ? `${job.title} Interview` : "Interview");
  const [duration, setDuration] = React.useState(String(defaults.duration || 60));
  const [videoProvider, setVideoProvider] = React.useState<string>(
    defaults.videoProvider || "google-meet"
  );
  const [selectedCalendar, setSelectedCalendar] = React.useState(calendars[0]?.id || "");
  const [instructions, setInstructions] = React.useState("");
  const [internalNotes, setInternalNotes] = React.useState("");
  const [showInternalNotes, setShowInternalNotes] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Tab state - "find-time" or "your-calendar"
  const [activeTab, setActiveTab] = React.useState<"find-time" | "your-calendar">("find-time");

  // Calendar overlay state for Find a Time view - default to showing your own events
  const [showCalendarOverlay, setShowCalendarOverlay] = React.useState(true);

  // Attendees state - candidate always first and non-removable
  const candidateAsAttendee: Attendee = {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    avatar: candidate.avatar,
    role: "candidate",
    timezone: candidate.timezone || "America/New_York",
  };

  const [attendees, setAttendees] = React.useState<Attendee[]>([
    candidateAsAttendee,
    ...initialAttendees,
  ]);

  const [selectedSlots, setSelectedSlots] = React.useState<TimeSlot[]>([]);

  const handleAddAttendee = (attendee: Attendee) => {
    setAttendees((prev) => [...prev, { ...attendee, calendarStatus: "loading" }]);
    // Simulate loading calendar availability
    setTimeout(() => {
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendee.id ? { ...a, calendarStatus: "loaded" } : a))
      );
    }, 800);
  };

  const handleRemoveAttendee = (attendeeId: string) => {
    // Prevent removing candidate
    const attendee = attendees.find((a) => a.id === attendeeId);
    if (attendee?.role === "candidate") return;

    setAttendees((prev) => prev.filter((a) => a.id !== attendeeId));
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlots((prev) => [...prev, slot]);
  };

  const handleSlotRemove = (slotId: string) => {
    setSelectedSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleSlotUpdate = (slotId: string, newStart: Date, newEnd: Date) => {
    setSelectedSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? { ...slot, id: `${newStart.getTime()}`, start: newStart, end: newEnd }
          : slot
      )
    );
  };

  const handleSuggestedSlots = (slots: TimeSlot[]) => {
    setSelectedSlots((prev) => {
      const existingIds = new Set(prev.map((s) => s.id));
      const newSlots = slots.filter((s) => !existingIds.has(s.id));
      return [...prev, ...newSlots].slice(0, 5);
    });
  };

  const handleSubmit = () => {
    if (onSchedule) {
      onSchedule({
        title,
        attendees,
        timeSlots: selectedSlots,
        duration: parseInt(duration),
        videoProvider,
        instructions: instructions || undefined,
        internalNotes: internalNotes || undefined,
        calendarId: selectedCalendar || undefined,
      });
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview({
        title,
        attendees,
        timeSlots: selectedSlots,
        duration: parseInt(duration),
        videoProvider,
        instructions,
      });
    }
  };

  const canSubmit = selectedSlots.length >= 1 && attendees.length >= 2;

  if (!open) return null;

  const selectedVideoProvider = VIDEO_PROVIDER_OPTIONS.find((v) => v.value === videoProvider);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={() => onOpenChange(false)} />

      {/* Modal - Full screen with margins */}
      <div
        className={cn(
          "relative m-4 flex max-h-[calc(100vh-32px)] w-full overflow-hidden rounded-2xl bg-[var(--background-default)] shadow-2xl",
          className
        )}
      >
        {/* Left Panel - Form */}
        <div className="flex h-full w-[340px] flex-shrink-0 flex-col border-r border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
          {/* Header - X button on left */}
          <div className="flex flex-shrink-0 items-center gap-3 border-b border-[var(--primitive-neutral-200)] px-4 py-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="-ml-1 flex items-center justify-center rounded-lg p-1.5 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-100)] hover:text-[var(--foreground-default)]"
              aria-label="Close modal"
            >
              <X size={20} weight="bold" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[15px] font-semibold text-[var(--foreground-default)]">
                Schedule interview with {candidate.name}
              </h2>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-auto">
            {/* Interview Details Section */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Interview Details
              </span>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
                className="h-auto border-0 bg-transparent px-0 py-1 text-[15px] font-medium placeholder:text-[var(--foreground-muted)] focus:ring-0"
              />

              {/* Event Settings - Stacked rows */}
              <div className="mt-3 space-y-2">
                {/* Row 1: Duration */}
                <div className="flex items-center gap-2">
                  <Clock size={14} className="flex-shrink-0 text-[var(--foreground-muted)]" />
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-8 flex-1 rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 2: Video Provider */}
                <div className="flex items-center gap-2">
                  {selectedVideoProvider ? (
                    <selectedVideoProvider.icon
                      size={14}
                      className="flex-shrink-0 text-[var(--foreground-muted)]"
                    />
                  ) : (
                    <VideoCamera
                      size={14}
                      className="flex-shrink-0 text-[var(--foreground-muted)]"
                    />
                  )}
                  <Select value={videoProvider} onValueChange={setVideoProvider}>
                    <SelectTrigger className="h-8 flex-1 rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VIDEO_PROVIDER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon size={14} />
                            <span>{opt.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 3: Calendar Selection */}
                {calendars.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CalendarBlank
                      size={14}
                      className="flex-shrink-0 text-[var(--foreground-muted)]"
                    />
                    <Select value={selectedCalendar} onValueChange={setSelectedCalendar}>
                      <SelectTrigger className="h-8 flex-1 rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px]">
                        <SelectValue placeholder="Select calendar" />
                      </SelectTrigger>
                      <SelectContent>
                        {calendars.map((cal) => (
                          <SelectItem key={cal.id} value={cal.id}>
                            {cal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Attendees Section */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Attendees
                </span>
                <span className="text-[11px] text-[var(--primitive-green-700)]">
                  <GlobeHemisphereWest size={12} className="mr-1 inline" />
                  {getTimezoneAbbr(candidate.timezone) || "EST"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {attendees.map((attendee) => (
                  <AttendeeChip
                    key={attendee.id}
                    attendee={attendee}
                    onRemove={() => handleRemoveAttendee(attendee.id)}
                    removable={attendee.role !== "candidate"}
                    showRole={true}
                  />
                ))}
                <AddAttendeePopover
                  teamMembers={teamMembers}
                  existingAttendeeIds={attendees.map((a) => a.id)}
                  onAdd={handleAddAttendee}
                />
              </div>
            </div>

            {/* Proposed Times Section */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Proposed times
                </span>
                <span className="text-[11px] text-[var(--foreground-muted)]">
                  {selectedSlots.length}/5
                  {selectedSlots.length === 5 && (
                    <span className="ml-1 text-[var(--primitive-yellow-600)]">max</span>
                  )}
                </span>
              </div>
              {selectedSlots.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedSlots.map((slot) => (
                    <TimeSlotChip
                      key={slot.id}
                      slot={slot}
                      onRemove={() => handleSlotRemove(slot.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-3 text-center">
                  <CalendarBlank
                    size={24}
                    className="mx-auto mb-2 text-[var(--foreground-muted)] opacity-50"
                  />
                  <p className="mb-2 text-[12px] text-[var(--foreground-muted)]">
                    No times proposed yet
                  </p>
                  <p className="mb-3 text-[11px] text-[var(--foreground-muted)]">
                    Click available slots in the calendar →
                  </p>
                  {onSuggestTimes && (
                    <button
                      type="button"
                      onClick={() => {
                        onSuggestTimes?.()
                          .then((slots) => {
                            if (slots.length > 0) {
                              handleSuggestedSlots(slots);
                            }
                          })
                          .catch((err) =>
                            logger.error("Async operation failed", { error: formatError(err) })
                          );
                      }}
                      disabled={attendees.length < 2}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all",
                        attendees.length < 2
                          ? "cursor-not-allowed bg-[var(--primitive-neutral-100)] text-[var(--foreground-muted)]"
                          : "bg-[var(--primitive-yellow-100)] text-[var(--primitive-yellow-800)] hover:bg-[var(--primitive-yellow-200)]"
                      )}
                    >
                      <Sparkle size={12} weight="fill" />
                      <span>Suggest available times</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Candidate Preview */}
            <div className="border-b border-[var(--primitive-neutral-200)] px-4 py-3">
              <CandidatePreviewCard selectedSlots={selectedSlots} duration={parseInt(duration)} />
            </div>

            {/* Instructions - Collapsible */}
            <div className="space-y-3 px-4 py-3">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <TextAlignLeft size={14} className="text-[var(--foreground-muted)]" />
                  <span className="text-[12px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                    Instructions
                  </span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">(optional)</span>
                </div>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Agenda, preparation tips..."
                  className="min-h-[60px] resize-none rounded-lg border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] text-[13px] focus:border-[var(--primitive-neutral-400)]"
                />
              </div>

              {/* Internal Notes */}
              <InternalNotesSection
                value={internalNotes}
                onChange={setInternalNotes}
                isOpen={showInternalNotes}
                onToggle={() => setShowInternalNotes(!showInternalNotes)}
              />
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-50)] px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg px-3 py-1.5 text-[13px] text-[var(--foreground-muted)] transition-colors hover:bg-[var(--primitive-neutral-200)] hover:text-[var(--foreground-default)]"
              >
                Cancel
              </button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        onClick={handlePreview}
                        disabled={!canSubmit}
                        size="sm"
                        className="gap-1.5"
                      >
                        <span>Preview & Send</span>
                        <ArrowRight size={14} weight="bold" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canSubmit && (
                    <TooltipContent>
                      <p className="text-xs">
                        {selectedSlots.length === 0
                          ? "Select at least one time slot"
                          : "Add at least one interviewer"}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Right Panel - Calendar with Tabs */}
        <div className="flex h-full flex-1 flex-col overflow-hidden bg-[var(--primitive-neutral-100)]">
          {/* Tab Header - Fixed at top */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-4 py-2">
            {/* Tab Switcher */}
            <SegmentedController
              options={[
                { value: "find-time", label: "Find a Time", icon: <Users size={16} /> },
                {
                  value: "your-calendar",
                  label: "Your Calendar",
                  icon: <CalendarBlank size={16} />,
                },
              ]}
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "find-time" | "your-calendar")}
            />

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Calendar overlay toggle (only in Find a Time tab) */}
              {activeTab === "find-time" && myCalendarEvents.length > 0 && (
                <CalendarOverlayToggle
                  enabled={showCalendarOverlay}
                  onToggle={setShowCalendarOverlay}
                />
              )}

              {/* Suggest times button */}
              {onSuggestTimes && (
                <SuggestTimesButton
                  onSuggest={onSuggestTimes}
                  onSuggestComplete={handleSuggestedSlots}
                  disabled={attendees.length < 2}
                />
              )}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "find-time" ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              {/* Info Banner */}
              <Banner
                type="info"
                subtle
                title="Click on available time slots to propose times. The candidate will choose their preferred option."
                dismissible={false}
                hideIcon={false}
                className="flex-shrink-0 rounded-none"
              />

              <AvailabilityCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                attendees={attendees}
                selectedSlots={selectedSlots}
                onSlotSelect={handleSlotSelect}
                onSlotRemove={handleSlotRemove}
                onSlotUpdate={handleSlotUpdate}
                maxSlots={5}
                duration={parseInt(duration)}
                startHour={0}
                endHour={24}
                showAttendeeCalendars={showCalendarOverlay}
                onToggleAttendeeCalendars={setShowCalendarOverlay}
                className="min-h-0 flex-1"
              />
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <YourCalendarView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                myEvents={myCalendarEvents}
                selectedSlots={selectedSlots}
                onSlotSelect={handleSlotSelect}
                onSlotRemove={handleSlotRemove}
                maxSlots={5}
                duration={parseInt(duration)}
                startHour={0}
                endHour={24}
                className="min-h-0 flex-1"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

InterviewSchedulingModal.displayName = "InterviewSchedulingModal";

/* ============================================
   Exports
   ============================================ */
export {
  AttendeeChip,
  TimeSlotChip,
  InternalNotesSection,
  AddAttendeePopover,
  CandidatePreviewCard,
  SuggestTimesButton,
  CalendarOverlayToggle,
};

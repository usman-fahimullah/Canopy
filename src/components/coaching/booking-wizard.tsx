"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDots,
  Check,
  Clock,
  MagnifyingGlass,
  Notepad,
  User,
  VideoCamera,
} from "@phosphor-icons/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CheckboxWithLabel,
  DatePicker,
  DurationInput,
  Progress,
  RadioGroup,
  RadioGroupCard,
  SearchInput,
  Spinner,
  Textarea,
  TimePicker,
} from "@/components/ui";
import type { BookingData, Coach, SessionType, AvailableSlot } from "@/lib/coaching";
import { SESSION_TYPE_INFO } from "@/lib/coaching";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BookingWizardProps {
  /** Available coaches to select from */
  coaches: Coach[];
  /** Pre-selected coach (e.g., from URL param) */
  initialCoachId?: string;
  /** Whether coaches are loading */
  isLoadingCoaches?: boolean;
  /** Called when the user requests available slots for a coach + date */
  onFetchAvailability?: (coachId: string, date: Date) => Promise<AvailableSlot[]>;
  /** Called to complete the booking */
  onBook?: (booking: BookingData) => Promise<{ sessionId: string }>;
  /** Called when wizard is cancelled */
  onCancel?: () => void;
  /** Called on successful booking */
  onSuccess?: (sessionId: string) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const STEPS = [
  { id: "coach", label: "Select Coach", icon: User },
  { id: "datetime", label: "Date & Time", icon: CalendarDots },
  { id: "details", label: "Session Details", icon: Notepad },
  { id: "confirm", label: "Confirm", icon: Check },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const PREP_ITEMS = [
  "Prepare your goals for this session",
  "Write down specific questions you want to ask",
  "Have relevant documents or materials ready",
  "Ensure you have a quiet space and stable internet",
  "Test your camera and microphone",
];

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function getCoachDisplayName(coach: Coach): string {
  return [coach.firstName, coach.lastName].filter(Boolean).join(" ") || "Coach";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: typeof STEPS }) {
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <Progress value={progressValue} size="sm" className="mb-4" />
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const StepIcon = step.icon;
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-caption transition-colors",
                  isCompleted &&
                    "bg-[var(--background-success-emphasis)] text-[var(--foreground-on-emphasis)]",
                  isActive && "bg-[var(--background-brand)] text-[var(--foreground-on-emphasis)]",
                  !isActive &&
                    !isCompleted &&
                    "bg-[var(--background-muted)] text-[var(--foreground-disabled)]"
                )}
              >
                {isCompleted ? <Check size={14} weight="bold" /> : <StepIcon size={14} />}
              </div>
              <span
                className={cn(
                  "hidden text-caption sm:inline",
                  isActive
                    ? "font-semibold text-[var(--foreground-default)]"
                    : "text-[var(--foreground-subtle)]"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Select Coach
// ---------------------------------------------------------------------------

function SelectCoachStep({
  coaches,
  selectedCoachId,
  onSelect,
  isLoading,
}: {
  coaches: Coach[];
  selectedCoachId: string | null;
  onSelect: (coachId: string) => void;
  isLoading?: boolean;
}) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!search.trim()) return coaches;
    const q = search.toLowerCase();
    return coaches.filter((c) => {
      const name = getCoachDisplayName(c).toLowerCase();
      const headline = (c.headline ?? "").toLowerCase();
      const expertise = c.expertise?.join(" ").toLowerCase() ?? "";
      return name.includes(q) || headline.includes(q) || expertise.includes(q);
    });
  }, [coaches, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">
          Select a Coach
        </h2>
        <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
          Choose a coach for your session
        </p>
      </div>

      <SearchInput
        placeholder="Search by name, expertise, or company…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="py-8 text-center">
          <MagnifyingGlass size={40} className="mx-auto mb-2 text-[var(--foreground-disabled)]" />
          <p className="text-body-sm text-[var(--foreground-muted)]">
            No coaches found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((coach) => {
            const name = getCoachDisplayName(coach);
            const isSelected = coach.id === selectedCoachId;

            return (
              <Card
                key={coach.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-card-hover",
                  isSelected &&
                    "border-[var(--border-brand-emphasis)] bg-[var(--background-brand-subtle)]"
                )}
                onClick={() => onSelect(coach.id)}
              >
                <CardContent className="flex flex-col items-center p-4 text-center">
                  <Avatar size="lg" src={coach.avatar ?? undefined} fallback={name.charAt(0)} />

                  <p className="mt-2 text-body-sm font-semibold text-[var(--foreground-default)]">
                    {name}
                  </p>

                  {coach.headline && (
                    <p className="mt-0.5 line-clamp-1 text-caption text-[var(--foreground-muted)]">
                      {coach.headline}
                    </p>
                  )}

                  {coach.rating > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 text-caption">
                      <span className="text-[var(--foreground-warning)]">★</span>
                      <span className="font-semibold text-[var(--foreground-default)]">
                        {coach.rating.toFixed(1)}
                      </span>
                      {coach.reviewCount != null && coach.reviewCount > 0 && (
                        <span className="text-[var(--foreground-subtle)]">
                          ({coach.reviewCount})
                        </span>
                      )}
                    </div>
                  )}

                  {isSelected && (
                    <Badge variant="success" size="sm" className="mt-2">
                      Selected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Date & Time
// ---------------------------------------------------------------------------

function DateTimeStep({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  availableDates,
  blockedDates,
  minTime,
  maxTime,
  isLoadingSlots,
}: {
  selectedDate: Date | undefined;
  selectedTime: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: Date | undefined) => void;
  availableDates?: Date[];
  blockedDates?: Date[];
  minTime?: Date;
  maxTime?: Date;
  isLoadingSlots?: boolean;
}) {
  const today = React.useMemo(() => new Date(), []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">
          Pick Date & Time
        </h2>
        <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
          Choose when you&apos;d like your session
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Date Picker */}
        <div className="space-y-2">
          <label className="text-caption-strong font-semibold text-[var(--foreground-default)]">
            Date
          </label>
          <DatePicker
            value={selectedDate}
            onChange={onDateChange}
            placeholder="Select a date"
            minDate={today}
            availableDates={availableDates}
            blockedDates={blockedDates}
            showPresets={false}
          />
        </div>

        {/* Time Picker */}
        <div className="space-y-2">
          <label className="text-caption-strong font-semibold text-[var(--foreground-default)]">
            Time
          </label>
          {isLoadingSlots ? (
            <div className="flex h-11 items-center justify-center rounded-[var(--radius-input)] border border-[var(--border-default)] bg-[var(--input-background)]">
              <Spinner size="sm" />
              <span className="ml-2 text-caption text-[var(--foreground-muted)]">
                Loading available times…
              </span>
            </div>
          ) : (
            <TimePicker
              value={selectedTime}
              onChange={onTimeChange}
              placeholder="Select a time"
              minuteStep={30}
              minTime={minTime}
              maxTime={maxTime}
              disabled={!selectedDate}
              showNowButton={false}
              showSmartSuggestions={false}
            />
          )}
        </div>
      </div>

      {/* Selection summary */}
      {selectedDate && selectedTime && (
        <Card className="border-[var(--border-brand)] bg-[var(--background-brand-subtle)]">
          <CardContent className="flex items-center gap-3 p-4">
            <CalendarDots size={20} className="text-[var(--foreground-brand)]" />
            <div>
              <p className="text-body-sm font-semibold text-[var(--foreground-default)]">
                {formatDate(selectedDate)}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">
                {formatTime(selectedTime)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Session Details
// ---------------------------------------------------------------------------

function SessionDetailsStep({
  selectedType,
  duration,
  notes,
  checkedItems,
  onTypeChange,
  onDurationChange,
  onNotesChange,
  onCheckItem,
}: {
  selectedType: SessionType | null;
  duration: number | undefined;
  notes: string;
  checkedItems: Set<number>;
  onTypeChange: (type: SessionType) => void;
  onDurationChange: (duration: number | undefined) => void;
  onNotesChange: (notes: string) => void;
  onCheckItem: (index: number, checked: boolean) => void;
}) {
  const sessionTypes = Object.entries(SESSION_TYPE_INFO) as [
    SessionType,
    (typeof SESSION_TYPE_INFO)[SessionType],
  ][];

  // When session type changes, auto-set its default duration
  const handleTypeChange = React.useCallback(
    (value: string) => {
      const type = value as SessionType;
      onTypeChange(type);
      onDurationChange(SESSION_TYPE_INFO[type].defaultDuration);
    },
    [onTypeChange, onDurationChange]
  );

  const prepProgress =
    PREP_ITEMS.length > 0 ? Math.round((checkedItems.size / PREP_ITEMS.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">
          Session Details
        </h2>
        <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
          Choose the type of session and any preparation details
        </p>
      </div>

      {/* Session Type */}
      <div className="space-y-3">
        <label className="text-caption-strong font-semibold text-[var(--foreground-default)]">
          Session Type
        </label>
        <RadioGroup value={selectedType ?? ""} onValueChange={handleTypeChange}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sessionTypes.map(([type, info]) => (
              <RadioGroupCard
                key={type}
                value={type}
                label={info.label}
                description={`${info.defaultDuration} min — ${info.description}`}
                icon={<Clock size={18} className="text-[var(--foreground-brand)]" />}
              />
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Duration */}
      {selectedType && (
        <div className="space-y-2">
          <label className="text-caption-strong font-semibold text-[var(--foreground-default)]">
            Duration
          </label>
          <DurationInput value={duration} onChange={onDurationChange} presets={[30, 45, 60, 90]} />
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-caption-strong font-semibold text-[var(--foreground-default)]">
          Notes for your coach{" "}
          <span className="font-normal text-[var(--foreground-subtle)]">(optional)</span>
        </label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Share what you'd like to focus on, specific questions, or any context that would help your coach prepare…"
          rows={3}
        />
      </div>

      {/* Prep Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-caption-strong font-semibold text-[var(--foreground-default)]">
            Preparation Checklist
          </label>
          <span className="text-caption text-[var(--foreground-muted)]">
            {checkedItems.size}/{PREP_ITEMS.length} complete
          </span>
        </div>
        <Progress value={prepProgress} size="sm" variant="success" />
        <div className="space-y-2">
          {PREP_ITEMS.map((item, i) => (
            <CheckboxWithLabel
              key={i}
              label={item}
              checked={checkedItems.has(i)}
              onCheckedChange={(checked) => onCheckItem(i, checked === true)}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4: Confirmation
// ---------------------------------------------------------------------------

function ConfirmStep({
  coach,
  selectedDate,
  selectedTime,
  sessionType,
  duration,
  notes,
  prepProgress,
  isSubmitting,
}: {
  coach: Coach;
  selectedDate: Date;
  selectedTime: Date;
  sessionType: SessionType;
  duration: number;
  notes: string;
  prepProgress: number;
  isSubmitting: boolean;
}) {
  const name = getCoachDisplayName(coach);
  const typeInfo = SESSION_TYPE_INFO[sessionType];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">
          Confirm Your Booking
        </h2>
        <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
          Review your session details before confirming
        </p>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5">
          {/* Coach */}
          <div className="flex items-center gap-3">
            <Avatar size="lg" src={coach.avatar ?? undefined} fallback={name.charAt(0)} />
            <div>
              <p className="text-body-sm font-semibold text-[var(--foreground-default)]">{name}</p>
              {coach.headline && (
                <p className="text-caption text-[var(--foreground-muted)]">{coach.headline}</p>
              )}
            </div>
          </div>

          <hr className="border-[var(--border-muted)]" />

          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <CalendarDots size={18} className="mt-0.5 text-[var(--foreground-brand)]" />
            <div>
              <p className="text-body-sm font-semibold text-[var(--foreground-default)]">
                {formatDate(selectedDate)}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">
                {formatTime(selectedTime)} · {duration} minutes
              </p>
            </div>
          </div>

          {/* Session Type */}
          <div className="flex items-start gap-3">
            <VideoCamera size={18} className="mt-0.5 text-[var(--foreground-brand)]" />
            <div>
              <p className="text-body-sm font-semibold text-[var(--foreground-default)]">
                {typeInfo.label}
              </p>
              <p className="text-caption text-[var(--foreground-muted)]">{typeInfo.description}</p>
            </div>
          </div>

          {/* Notes */}
          {notes && (
            <>
              <hr className="border-[var(--border-muted)]" />
              <div className="flex items-start gap-3">
                <Notepad size={18} className="mt-0.5 text-[var(--foreground-brand)]" />
                <div>
                  <p className="text-caption-strong font-semibold text-[var(--foreground-default)]">
                    Session Notes
                  </p>
                  <p className="mt-0.5 text-caption text-[var(--foreground-muted)]">{notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Prep Progress */}
          <hr className="border-[var(--border-muted)]" />
          <div className="flex items-center justify-between">
            <span className="text-caption text-[var(--foreground-muted)]">Preparation</span>
            <Badge variant={prepProgress === 100 ? "success" : "neutral"} size="sm">
              {prepProgress}% ready
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="rounded-[var(--radius-card)] bg-[var(--background-info)] p-4">
        <p className="text-caption text-[var(--foreground-info)]">
          You&apos;ll receive a calendar invite and confirmation email after booking. Reminders will
          be sent 24 hours and 1 hour before your session.
        </p>
      </div>

      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 py-2">
          <Spinner size="sm" />
          <span className="text-caption text-[var(--foreground-muted)]">
            Creating your session…
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function BookingWizard({
  coaches,
  initialCoachId,
  isLoadingCoaches = false,
  onFetchAvailability,
  onBook,
  onCancel,
  onSuccess,
  className,
}: BookingWizardProps) {
  // ---- Step state ----
  const [currentStep, setCurrentStep] = React.useState(0);

  // ---- Step 1: Coach selection ----
  const [selectedCoachId, setSelectedCoachId] = React.useState<string | null>(
    initialCoachId ?? null
  );

  // ---- Step 2: Date & Time ----
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = React.useState<Date | undefined>();
  const [availableDates, setAvailableDates] = React.useState<Date[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = React.useState(false);

  // ---- Step 3: Details ----
  const [selectedType, setSelectedType] = React.useState<SessionType | null>(null);
  const [duration, setDuration] = React.useState<number | undefined>();
  const [notes, setNotes] = React.useState("");
  const [checkedItems, setCheckedItems] = React.useState<Set<number>>(new Set());

  // ---- Submission ----
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // ---- Derived values ----
  const selectedCoach = React.useMemo(
    () => coaches.find((c) => c.id === selectedCoachId) ?? null,
    [coaches, selectedCoachId]
  );

  const prepProgress =
    PREP_ITEMS.length > 0 ? Math.round((checkedItems.size / PREP_ITEMS.length) * 100) : 0;

  // ---- When coach changes, fetch availability ----
  React.useEffect(() => {
    if (selectedCoachId && onFetchAvailability) {
      // Reset date/time when coach changes
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  }, [selectedCoachId, onFetchAvailability]);

  // ---- When date changes, fetch time slots ----
  React.useEffect(() => {
    if (selectedCoachId && selectedDate && onFetchAvailability) {
      setIsLoadingSlots(true);
      setSelectedTime(undefined);
      onFetchAvailability(selectedCoachId, selectedDate)
        .then(() => {
          // Availability data would be used to filter TimePicker
          // For now the TimePicker handles its own constraints
        })
        .finally(() => setIsLoadingSlots(false));
    }
  }, [selectedCoachId, selectedDate, onFetchAvailability]);

  // ---- Auto-select coach if initialCoachId provided and skip to step 2 ----
  React.useEffect(() => {
    if (initialCoachId && coaches.some((c) => c.id === initialCoachId) && currentStep === 0) {
      setSelectedCoachId(initialCoachId);
      setCurrentStep(1);
    }
  }, [initialCoachId, coaches, currentStep]);

  // ---- Validation per step ----
  const canProceed = React.useMemo(() => {
    switch (currentStep) {
      case 0:
        return selectedCoachId !== null;
      case 1:
        return selectedDate !== undefined && selectedTime !== undefined;
      case 2:
        return selectedType !== null;
      case 3:
        return !isSubmitting;
      default:
        return false;
    }
  }, [currentStep, selectedCoachId, selectedDate, selectedTime, selectedType, isSubmitting]);

  // ---- Navigation ----
  const goNext = React.useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      setError(null);
    }
  }, [currentStep]);

  const goBack = React.useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      setError(null);
    }
  }, [currentStep]);

  // ---- Submit booking ----
  const handleSubmit = React.useCallback(async () => {
    if (!selectedCoach || !selectedDate || !selectedTime || !selectedType || !duration) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Combine date + time into ISO string
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);

    const bookingData: BookingData = {
      coachId: selectedCoach.id,
      scheduledAt: scheduledAt.toISOString(),
      duration,
      sessionType: selectedType,
      notes: notes.trim() || undefined,
      prepItems: PREP_ITEMS.filter((_, i) => checkedItems.has(i)),
    };

    try {
      if (onBook) {
        const result = await onBook(bookingData);
        onSuccess?.(result.sessionId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedCoach,
    selectedDate,
    selectedTime,
    selectedType,
    duration,
    notes,
    checkedItems,
    onBook,
    onSuccess,
  ]);

  // ---- Check item handler ----
  const handleCheckItem = React.useCallback((index: number, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(index);
      } else {
        next.delete(index);
      }
      return next;
    });
  }, []);

  return (
    <div className={cn("mx-auto max-w-3xl", className)}>
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step Content */}
      <div className="min-h-[400px]">
        {currentStep === 0 && (
          <SelectCoachStep
            coaches={coaches}
            selectedCoachId={selectedCoachId}
            onSelect={setSelectedCoachId}
            isLoading={isLoadingCoaches}
          />
        )}

        {currentStep === 1 && (
          <DateTimeStep
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            availableDates={availableDates}
            isLoadingSlots={isLoadingSlots}
          />
        )}

        {currentStep === 2 && (
          <SessionDetailsStep
            selectedType={selectedType}
            duration={duration}
            notes={notes}
            checkedItems={checkedItems}
            onTypeChange={setSelectedType}
            onDurationChange={setDuration}
            onNotesChange={setNotes}
            onCheckItem={handleCheckItem}
          />
        )}

        {currentStep === 3 &&
          selectedCoach &&
          selectedDate &&
          selectedTime &&
          selectedType &&
          duration && (
            <ConfirmStep
              coach={selectedCoach}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              sessionType={selectedType}
              duration={duration}
              notes={notes}
              prepProgress={prepProgress}
              isSubmitting={isSubmitting}
            />
          )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-[var(--radius-card)] bg-[var(--background-error)] p-3">
          <p className="text-caption text-[var(--foreground-error)]">{error}</p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between border-t border-[var(--border-muted)] pt-4">
        <div>
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={goBack} disabled={isSubmitting}>
              <ArrowLeft size={16} className="mr-1" />
              Back
            </Button>
          ) : (
            onCancel && (
              <Button variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )
          )}
        </div>

        <div>
          {currentStep < STEPS.length - 1 ? (
            <Button variant="primary" onClick={goNext} disabled={!canProceed}>
              Continue
              <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              loading={isSubmitting}
            >
              Confirm Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

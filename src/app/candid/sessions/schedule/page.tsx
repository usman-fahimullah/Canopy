"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { coaches, mentors, getUserById } from "@/lib/candid";
import { type CandidCoach, type CandidMentor, type SessionType, SECTOR_INFO } from "@/lib/candid/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  VideoCamera,
  User,
  Star,
  CheckCircle,
  X,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  Check,
  FileText,
  ChatCircle,
  ChartLine,
  Briefcase,
  Lightning,
  Target,
  Lightbulb,
  ListChecks,
  Sparkle,
  Info,
  Warning,
} from "@phosphor-icons/react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";

type Step = "mentor" | "datetime" | "details" | "confirm";

const sessionTypes: { value: SessionType; label: string; description: string; duration: number; icon: React.ElementType }[] = [
  {
    value: "coaching",
    label: "Coaching Session",
    description: "General career coaching and guidance",
    duration: 60,
    icon: ChatCircle,
  },
  {
    value: "mock-interview",
    label: "Mock Interview",
    description: "Practice interviews with real feedback",
    duration: 45,
    icon: User,
  },
  {
    value: "resume-review",
    label: "Resume Review",
    description: "Get expert feedback on your resume",
    duration: 30,
    icon: FileText,
  },
  {
    value: "career-planning",
    label: "Career Planning",
    description: "Strategic planning for your career path",
    duration: 60,
    icon: ChartLine,
  },
  {
    value: "networking",
    label: "Networking Call",
    description: "Expand your professional network",
    duration: 30,
    icon: Briefcase,
  },
];

const prepChecklist = [
  { id: "goals", label: "Write down your top 3 goals for this session", icon: Target },
  { id: "questions", label: "Prepare 2-3 specific questions you want answered", icon: Lightbulb },
  { id: "materials", label: "Have any relevant documents ready (resume, portfolio, etc.)", icon: FileText },
  { id: "quiet", label: "Find a quiet space with good internet connection", icon: VideoCamera },
  { id: "camera", label: "Test your camera and microphone beforehand", icon: CheckCircle },
];

// Generate time slots
const generateTimeSlots = (startHour: number = 9, endHour: number = 18, interval: number = 30) => {
  const slots: string[] = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += interval) {
      const time = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      slots.push(time);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

export default function ScheduleSessionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-[#FAF9F7] to-[#E5F1FF]/30" />}>
      <ScheduleSessionContent />
    </Suspense>
  );
}

function ScheduleSessionContent() {
  const searchParams = useSearchParams();
  const preSelectedMentorId = searchParams.get("mentor");

  const [step, setStep] = useState<Step>(preSelectedMentorId ? "datetime" : "mentor");
  const [selectedMentor, setSelectedMentor] = useState<CandidCoach | CandidMentor | null>(
    preSelectedMentorId ? (getUserById(preSelectedMentorId) as CandidCoach | CandidMentor) : null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<SessionType | null>(null);
  const [notes, setNotes] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const allMentors = useMemo(() => [...coaches, ...mentors], []);
  const filteredMentors = useMemo(() => {
    if (!searchQuery) return allMentors;
    const query = searchQuery.toLowerCase();
    return allMentors.filter(
      (m) =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(query) ||
        m.currentCompany.toLowerCase().includes(query) ||
        m.expertise.some((e) => e.toLowerCase().includes(query))
    );
  }, [allMentors, searchQuery]);

  const steps: Step[] = ["mentor", "datetime", "details", "confirm"];
  const currentStepIndex = steps.indexOf(step);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const canProceed = () => {
    switch (step) {
      case "mentor":
        return selectedMentor !== null;
      case "datetime":
        return selectedDate !== null && selectedTime !== null;
      case "details":
        return selectedType !== null;
      case "confirm":
        return true;
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedSessionType = sessionTypes.find((t) => t.value === selectedType);

  // Simulated available slots (in real app, this would come from mentor's calendar)
  const getAvailableSlots = (date: Date): string[] => {
    if (isBefore(startOfDay(date), startOfDay(new Date()))) return [];
    // Simulate some unavailable slots
    const unavailable = ["10:00", "10:30", "14:00", "14:30", "15:00"];
    return timeSlots.filter((slot) => !unavailable.includes(slot));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F7] to-[#E5F1FF]/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link
            href="/candid/sessions"
            className="flex items-center gap-2 text-foreground-muted hover:text-foreground-default transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-body-sm font-medium">Back to Sessions</span>
          </Link>

          {/* Step Indicator */}
          <div className="hidden sm:flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-caption-sm font-bold transition-all",
                    i < currentStepIndex
                      ? "bg-[var(--primitive-green-500)] text-white"
                      : i === currentStepIndex
                      ? "bg-[#072924] text-white"
                      : "bg-[var(--background-subtle)] text-foreground-muted"
                  )}
                >
                  {i < currentStepIndex ? <Check size={14} weight="bold" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-caption font-medium capitalize",
                    i === currentStepIndex ? "text-foreground-default" : "text-foreground-muted"
                  )}
                >
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <div className="mx-2 h-0.5 w-8 rounded-full bg-[var(--border-default)]" />
                )}
              </div>
            ))}
          </div>

          <div className="text-body-sm text-foreground-muted">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-[var(--background-subtle)]">
        <div
          className="h-full bg-gradient-to-r from-[#072924] to-[#099C73] transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Step 1: Select Mentor */}
        {step === "mentor" && (
          <div>
            <div className="mb-6">
              <h1 className="text-display font-semibold text-foreground-default">
                Choose Your Mentor
              </h1>
              <p className="mt-2 text-body-lg text-foreground-muted">
                Select a mentor to schedule your session with
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <MagnifyingGlass
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
              />
              <Input
                type="text"
                placeholder="Search by name, company, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Mentor Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {filteredMentors.map((mentor) => {
                const isSelected = selectedMentor?.id === mentor.id;
                return (
                  <button
                    key={mentor.id}
                    onClick={() => setSelectedMentor(mentor)}
                    className={cn(
                      "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                      isSelected
                        ? "border-[#072924] bg-[var(--candid-background-subtle)] shadow-md"
                        : "border-[var(--border-default)] bg-white hover:border-[var(--candid-border-accent)] hover:shadow-sm"
                    )}
                  >
                    <Avatar
                      size="lg"
                      src={mentor.avatar}
                      name={`${mentor.firstName} ${mentor.lastName}`}
                      color="green"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground-default">
                          {mentor.firstName} {mentor.lastName}
                        </h3>
                        {mentor.isFoundingMember && (
                          <Badge variant="feature" size="sm">Founding</Badge>
                        )}
                      </div>
                      <p className="text-body-sm text-foreground-muted mt-0.5">
                        {mentor.currentRole} at {mentor.currentCompany}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {mentor.rating && (
                          <span className="flex items-center gap-1 text-body-sm">
                            <Star size={14} weight="fill" className="text-[var(--primitive-yellow-500)]" />
                            {mentor.rating.toFixed(1)}
                          </span>
                        )}
                        <span className="text-body-sm text-foreground-muted">
                          {mentor.menteeCount} mentees
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                        isSelected
                          ? "border-[#072924] bg-[#072924]"
                          : "border-[var(--border-default)]"
                      )}
                    >
                      {isSelected && <Check size={14} weight="bold" className="text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === "datetime" && selectedMentor && (
          <div>
            <div className="mb-6">
              <h1 className="text-display font-semibold text-foreground-default">
                Pick a Date & Time
              </h1>
              <p className="mt-2 text-body-lg text-foreground-muted">
                Select when you'd like to meet with {selectedMentor.firstName}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Calendar */}
              <Card variant="outlined">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setWeekStart(subWeeks(weekStart, 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--background-subtle)] text-foreground-muted"
                    >
                      <CaretLeft size={20} />
                    </button>
                    <CardTitle className="text-body-strong">
                      {format(weekStart, "MMMM yyyy")}
                    </CardTitle>
                    <button
                      onClick={() => setWeekStart(addWeeks(weekStart, 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[var(--background-subtle)] text-foreground-muted"
                    >
                      <CaretRight size={20} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
                      const hasAvailable = getAvailableSlots(day).length > 0;

                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => !isPast && hasAvailable && setSelectedDate(day)}
                          disabled={isPast || !hasAvailable}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-xl p-3 transition-all",
                            isSelected
                              ? "bg-[#072924] text-white"
                              : isPast || !hasAvailable
                              ? "cursor-not-allowed opacity-40"
                              : isToday(day)
                              ? "bg-[var(--candid-background-subtle)] text-[#072924] hover:bg-[var(--candid-background-accent)]"
                              : "hover:bg-[var(--background-subtle)]"
                          )}
                        >
                          <span className="text-caption-sm font-medium uppercase">
                            {format(day, "EEE")}
                          </span>
                          <span className={cn("text-heading-sm font-semibold", isSelected && "text-white")}>
                            {format(day, "d")}
                          </span>
                          {!isPast && hasAvailable && (
                            <div className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              isSelected ? "bg-white" : "bg-[var(--primitive-green-500)]"
                            )} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card variant="outlined">
                <CardHeader className="pb-3">
                  <CardTitle className="text-body-strong flex items-center gap-2">
                    <Clock size={18} />
                    Available Times
                    {selectedDate && (
                      <span className="text-foreground-muted font-normal">
                        – {format(selectedDate, "EEEE, MMM d")}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                      {getAvailableSlots(selectedDate).map((time) => {
                        const isSelected = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "rounded-lg border px-3 py-2.5 text-body-sm font-medium transition-all",
                              isSelected
                                ? "border-[#072924] bg-[#072924] text-white"
                                : "border-[var(--border-default)] hover:border-[var(--candid-border-accent)] hover:bg-[var(--background-subtle)]"
                            )}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Calendar size={40} className="text-foreground-muted/40" />
                      <p className="mt-3 text-body text-foreground-muted">
                        Select a date to see available times
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Selected Summary */}
            {selectedDate && selectedTime && (
              <div className="mt-6 rounded-xl border border-[var(--candid-border-accent)] bg-[var(--candid-background-subtle)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#072924] text-white">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground-default">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                    </p>
                    <p className="text-body-sm text-foreground-muted">
                      Session with {selectedMentor.firstName} {selectedMentor.lastName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Session Details */}
        {step === "details" && selectedMentor && (
          <div>
            <div className="mb-6">
              <h1 className="text-display font-semibold text-foreground-default">
                Session Details
              </h1>
              <p className="mt-2 text-body-lg text-foreground-muted">
                Choose the type of session and add any notes
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Session Type */}
              <div>
                <h2 className="text-body-strong font-semibold text-foreground-default mb-4">
                  Session Type
                </h2>
                <div className="space-y-3">
                  {sessionTypes.map((type) => {
                    const isSelected = selectedType === type.value;
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={cn(
                          "w-full flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                          isSelected
                            ? "border-[#072924] bg-[var(--candid-background-subtle)]"
                            : "border-[var(--border-default)] bg-white hover:border-[var(--candid-border-accent)]"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                            isSelected
                              ? "bg-[#072924] text-white"
                              : "bg-[var(--background-subtle)] text-foreground-muted"
                          )}
                        >
                          <Icon size={20} weight={isSelected ? "fill" : "regular"} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground-default">{type.label}</h3>
                          <p className="text-body-sm text-foreground-muted mt-0.5">
                            {type.description}
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-body-sm text-foreground-muted">
                            <Clock size={14} />
                            {type.duration} minutes
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all",
                            isSelected
                              ? "border-[#072924] bg-[#072924]"
                              : "border-[var(--border-default)]"
                          )}
                        >
                          {isSelected && <Check size={14} weight="bold" className="text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes & Prep */}
              <div className="space-y-6">
                {/* Notes */}
                <div>
                  <label className="block text-body-strong font-semibold text-foreground-default mb-2">
                    Session Notes <span className="font-normal text-foreground-muted">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-[var(--primitive-neutral-200)] bg-[var(--primitive-neutral-100)] px-4 py-3 text-body text-foreground-default placeholder:text-foreground-muted focus:border-[var(--primitive-green-600)] focus:outline-none transition-colors"
                    placeholder="Share what you'd like to focus on during this session..."
                  />
                </div>

                {/* Preparation Checklist */}
                <Card variant="outlined">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-body-strong flex items-center gap-2">
                      <ListChecks size={18} />
                      Preparation Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prepChecklist.map((item) => {
                        const isChecked = checkedItems.includes(item.id);
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => toggleCheckItem(item.id)}
                            className="flex items-start gap-3 w-full text-left group"
                          >
                            <div
                              className={cn(
                                "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all mt-0.5",
                                isChecked
                                  ? "border-[var(--primitive-green-500)] bg-[var(--primitive-green-500)]"
                                  : "border-[var(--border-default)] group-hover:border-[var(--candid-border-accent)]"
                              )}
                            >
                              {isChecked && <Check size={12} weight="bold" className="text-white" />}
                            </div>
                            <span
                              className={cn(
                                "text-body-sm transition-colors",
                                isChecked ? "text-foreground-muted line-through" : "text-foreground-default"
                              )}
                            >
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--border-default)]">
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-foreground-muted">Preparation progress</span>
                        <span className="font-medium text-foreground-default">
                          {checkedItems.length}/{prepChecklist.length}
                        </span>
                      </div>
                      <Progress
                        value={(checkedItems.length / prepChecklist.length) * 100}
                        className="mt-2"
                        size="sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === "confirm" && selectedMentor && selectedDate && selectedTime && selectedSessionType && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#E5F1FF] to-[#99C9FF]">
                <Sparkle size={40} weight="fill" className="text-[#072924]" />
              </div>
              <h1 className="text-display font-semibold text-foreground-default">
                Confirm Your Session
              </h1>
              <p className="mt-2 text-body-lg text-foreground-muted">
                Review the details and book your session
              </p>
            </div>

            {/* Session Summary Card */}
            <Card variant="outlined" className="mb-6">
              <CardContent className="p-6">
                {/* Mentor */}
                <div className="flex items-center gap-4 pb-4 border-b border-[var(--border-default)]">
                  <Avatar
                    size="lg"
                    src={selectedMentor.avatar}
                    name={`${selectedMentor.firstName} ${selectedMentor.lastName}`}
                    color="green"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground-default">
                      {selectedMentor.firstName} {selectedMentor.lastName}
                    </h3>
                    <p className="text-body-sm text-foreground-muted">
                      {selectedMentor.currentRole} at {selectedMentor.currentCompany}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="py-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--candid-background-subtle)]">
                      <Calendar size={20} className="text-[#072924]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground-default">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-body-sm text-foreground-muted">
                        {selectedTime} · {selectedSessionType.duration} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--candid-background-subtle)]">
                      <selectedSessionType.icon size={20} className="text-[#072924]" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground-default">
                        {selectedSessionType.label}
                      </p>
                      <p className="text-body-sm text-foreground-muted">
                        {selectedSessionType.description}
                      </p>
                    </div>
                  </div>

                  {notes && (
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--candid-background-subtle)]">
                        <FileText size={20} className="text-[#072924]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground-default">Session Notes</p>
                        <p className="text-body-sm text-foreground-muted">{notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Preparation Status */}
                <div className="pt-4 border-t border-[var(--border-default)]">
                  <div className="flex items-center gap-2">
                    {checkedItems.length === prepChecklist.length ? (
                      <>
                        <CheckCircle size={16} weight="fill" className="text-[var(--primitive-green-600)]" />
                        <span className="text-body-sm text-[var(--primitive-green-600)] font-medium">
                          Preparation complete!
                        </span>
                      </>
                    ) : checkedItems.length > 0 ? (
                      <>
                        <Info size={16} className="text-[var(--primitive-orange-500)]" />
                        <span className="text-body-sm text-foreground-muted">
                          {checkedItems.length}/{prepChecklist.length} preparation items completed
                        </span>
                      </>
                    ) : (
                      <>
                        <Warning size={16} className="text-[var(--primitive-orange-500)]" />
                        <span className="text-body-sm text-foreground-muted">
                          Don't forget to prepare for your session!
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="rounded-xl border border-[var(--candid-border-accent)] bg-[var(--candid-background-subtle)] p-4 mb-6">
              <div className="flex items-start gap-3">
                <VideoCamera size={20} className="text-[#072924] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground-default">
                    You'll receive a calendar invite with the meeting link
                  </p>
                  <p className="text-body-sm text-foreground-muted mt-1">
                    A reminder will be sent 24 hours and 1 hour before your session
                  </p>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <Button
              onClick={() => {
                // In real app, this would create the session
                window.location.href = "/candid/sessions?booked=true";
              }}
              variant="primary"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight size={18} />}
            >
              Confirm & Book Session
            </Button>
          </div>
        )}

        {/* Navigation */}
        {step !== "confirm" && (
          <div className="mt-10 flex items-center justify-between">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0 || (step === "datetime" && preSelectedMentorId !== null)}
              variant="ghost"
              leftIcon={<ArrowLeft size={18} />}
              className={cn((currentStepIndex === 0 || (step === "datetime" && preSelectedMentorId !== null)) && "invisible")}
            >
              Back
            </Button>
            <Button
              onClick={goToNextStep}
              disabled={!canProceed()}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight size={18} />}
            >
              Continue
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

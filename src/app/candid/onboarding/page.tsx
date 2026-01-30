"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { CandidLogo, CandidSymbol } from "../components";
import { SECTOR_INFO, type Sector, type CandidRole } from "@/lib/candid/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupCard } from "@/components/ui/radio-group";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Users,
  GraduationCap,
  CheckCircle,
  Target,
  Sparkle,
  Briefcase,
  Lightning,
  Leaf,
  Lightbulb,
  Calendar,
  ChatCircle,
  Star,
  Trophy,
  Rocket,
  Heart,
  TreeEvergreen,
  SolarPanel,
  Wind,
  Drop,
  Buildings,
  Truck,
  Recycle,
  Plant,
  Globe,
  Bank,
  Handshake,
} from "@phosphor-icons/react";

type Step = "welcome" | "role" | "profile" | "goals" | "sectors" | "availability" | "complete";

const roleOptions = [
  {
    value: "seeker" as CandidRole,
    title: "I'm exploring climate careers",
    description: "Get matched with experienced mentors to guide your climate career journey",
    icon: Rocket,
    features: ["1:1 coaching", "Resume help", "Industry insights"],
    color: "var(--candid-background-subtle)",
    highlight: "Most popular",
  },
  {
    value: "mentor" as CandidRole,
    title: "I want to guide others",
    description: "Share your experience with those transitioning into climate careers",
    icon: Handshake,
    features: ["Flexible hours", "Give back", "Expand network"],
    color: "var(--primitive-green-100)",
  },
  {
    value: "coach" as CandidRole,
    title: "I'm a career coach",
    description: "Offer structured coaching and build your climate coaching practice",
    icon: GraduationCap,
    features: ["Set your rates", "Featured profile", "Client matching"],
    color: "var(--primitive-yellow-100)",
  },
];

const goalSuggestions = [
  { text: "Land a role in climate tech", icon: Lightning },
  { text: "Transition from traditional energy", icon: Leaf },
  { text: "Build a climate-focused network", icon: Users },
  { text: "Develop sustainability expertise", icon: Lightbulb },
  { text: "Lead climate initiatives", icon: Target },
];

const sectorIcons: Record<Sector, React.ElementType> = {
  "climate-tech": Lightning,
  "clean-energy": SolarPanel,
  "policy": Globe,
  "finance": Bank,
  "nonprofit": Heart,
  "corporate-sustainability": Buildings,
  "agriculture": Plant,
  "transportation": Truck,
};

const sectors = Object.entries(SECTOR_INFO).map(([key, value]) => ({
  value: key as Sector,
  label: value.label,
  icon: sectorIcons[key as Sector] || Globe,
}));

const availabilityOptions = [
  { value: "1-2", label: "1-2 hours/month", description: "Light commitment" },
  { value: "3-5", label: "3-5 hours/month", description: "Regular engagement" },
  { value: "5+", label: "5+ hours/month", description: "Deep involvement" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [selectedRole, setSelectedRole] = useState<CandidRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSectors, setSelectedSectors] = useState<Sector[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [currentGoal, setCurrentGoal] = useState("");
  const [availability, setAvailability] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const steps: Step[] = selectedRole === "seeker"
    ? ["welcome", "role", "profile", "goals", "sectors", "complete"]
    : ["welcome", "role", "profile", "sectors", "availability", "complete"];

  const currentStepIndex = steps.indexOf(step);
  const progressPercentage = ((currentStepIndex) / (steps.length - 1)) * 100;

  const submitOnboarding = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          firstName,
          lastName,
          email,
          linkedinUrl: linkedIn,
          bio,
          sectors: selectedSectors,
          goals,
          availability,
        }),
      });
    } catch (err) {
      console.error("Onboarding submit error:", err);
    } finally {
      setSubmitting(false);
    }
  }, [submitting, selectedRole, firstName, lastName, email, linkedIn, bio, selectedSectors, goals, availability]);

  const goToNextStep = () => {
    setIsAnimating(true);
    setTimeout(async () => {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        // If moving to the complete step, submit data first
        if (steps[nextIndex] === "complete") {
          await submitOnboarding();
        }
        setStep(steps[nextIndex]);
      }
      setIsAnimating(false);
    }, 150);
  };

  const goToPreviousStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const prevIndex = currentStepIndex - 1;
      if (prevIndex >= 0) {
        setStep(steps[prevIndex]);
      }
      setIsAnimating(false);
    }, 150);
  };

  const toggleSector = (sector: Sector) => {
    setSelectedSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : prev.length < 5
        ? [...prev, sector]
        : prev
    );
  };

  const addGoal = (goalText?: string) => {
    const text = goalText || currentGoal.trim();
    if (text && goals.length < 5 && !goals.includes(text)) {
      setGoals((prev) => [...prev, text]);
      setCurrentGoal("");
    }
  };

  const removeGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (step) {
      case "welcome":
        return true;
      case "role":
        return selectedRole !== null;
      case "profile":
        return firstName.trim() && lastName.trim() && email.trim();
      case "sectors":
        return selectedSectors.length > 0;
      case "goals":
        return goals.length > 0;
      case "availability":
        return availability !== null;
      default:
        return true;
    }
  };

  // Step title and subtitle configuration
  const stepContent: Record<Step, { title: string; subtitle: string }> = {
    welcome: {
      title: "Welcome to Candid",
      subtitle: "Your climate career journey starts here",
    },
    role: {
      title: "How will you participate?",
      subtitle: "Choose the role that best describes you",
    },
    profile: {
      title: "Let's get to know you",
      subtitle: "This helps us personalize your experience",
    },
    goals: {
      title: "What are your goals?",
      subtitle: "Help your mentors understand what you're working towards",
    },
    sectors: {
      title: selectedRole === "seeker" ? "What sectors interest you?" : "What are your areas of expertise?",
      subtitle: "Select up to 5 sectors for better matching",
    },
    availability: {
      title: "How much time can you commit?",
      subtitle: "This helps us match you with the right mentees",
    },
    complete: {
      title: "You're all set!",
      subtitle: "Welcome to the Candid community",
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background-subtle)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/candid" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <CandidSymbol size={28} />
            <CandidLogo className="hidden sm:block" />
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <span className="text-caption text-foreground-muted">
              Step {Math.max(1, currentStepIndex)} of {steps.length - 1}
            </span>
            <div className="hidden sm:flex items-center gap-1.5">
              {steps.slice(1, -1).map((s, i) => (
                <div
                  key={s}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    i < currentStepIndex - 1
                      ? "bg-[var(--candid-dark)]"
                      : i === currentStepIndex - 1
                      ? "bg-[var(--candid-dark)] w-6"
                      : "bg-[var(--primitive-neutral-300)]"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-[var(--primitive-neutral-200)]">
        <div
          className="h-full bg-[var(--primitive-green-800)] transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div
          className={cn(
            "transition-all duration-150",
            isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
          )}
        >
          {/* Step: Welcome */}
          {step === "welcome" && (
            <div className="text-center">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--primitive-blue-200)]">
                <TreeEvergreen size={48} weight="fill" className="text-[var(--primitive-green-800)]" />
              </div>
              <h1 className="text-display font-semibold text-foreground-default">
                {stepContent.welcome.title}
              </h1>
              <p className="mt-3 text-body-lg text-foreground-muted">
                {stepContent.welcome.subtitle}
              </p>

              <div className="mt-10 grid gap-4 text-left">
                {[
                  { icon: Users, title: "Connect with mentors", desc: "Get matched with climate professionals who've been where you want to go" },
                  { icon: Target, title: "Achieve your goals", desc: "Set clear objectives and track your progress with personalized guidance" },
                  { icon: Leaf, title: "Make an impact", desc: "Join a community dedicated to building a sustainable future" },
                ].map((item, i) => (
                  <Card
                    key={i}
                    className="flex items-start gap-4 p-4 transition-all duration-200 hover:shadow-card-hover"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--primitive-blue-200)]">
                      <item.icon size={20} className="text-[var(--primitive-green-800)]" />
                    </div>
                    <div>
                      <h3 className="text-body-strong font-semibold text-foreground-default">{item.title}</h3>
                      <p className="mt-0.5 text-caption text-foreground-muted">{item.desc}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step: Role Selection */}
          {step === "role" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-display font-semibold text-foreground-default">
                  {stepContent.role.title}
                </h1>
                <p className="mt-2 text-body-lg text-foreground-muted">
                  {stepContent.role.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRole === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => setSelectedRole(option.value)}
                      className={cn(
                        "relative w-full rounded-card p-5 text-left transition-all duration-200",
                        isSelected
                          ? "bg-[var(--primitive-blue-200)]"
                          : "bg-white shadow-card hover:shadow-card-hover"
                      )}
                    >
                      {option.highlight && (
                        <Badge
                          variant="feature"
                          size="sm"
                          className="absolute -top-2.5 right-4"
                        >
                          {option.highlight}
                        </Badge>
                      )}
                      <div className="flex items-start gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200",
                            isSelected
                              ? "bg-[var(--primitive-green-800)] text-white"
                              : "bg-[var(--primitive-blue-200)] text-[var(--primitive-green-800)]"
                          )}
                        >
                          <Icon size={24} weight={isSelected ? "fill" : "regular"} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-body-strong font-semibold text-foreground-default">
                            {option.title}
                          </h3>
                          <p className="mt-1 text-caption text-foreground-muted">
                            {option.description}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {option.features.map((feature) => (
                              <span
                                key={feature}
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-caption font-medium",
                                  isSelected
                                    ? "bg-[var(--primitive-green-800)]/10 text-[var(--primitive-green-800)]"
                                    : "bg-[var(--background-subtle)] text-foreground-muted"
                                )}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
                            isSelected
                              ? "border-[var(--primitive-green-800)] bg-[var(--primitive-green-800)]"
                              : "border-[var(--border-default)]"
                          )}
                        >
                          {isSelected && <CheckCircle size={16} weight="fill" className="text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step: Profile Info */}
          {step === "profile" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-display font-semibold text-foreground-default">
                  {stepContent.profile.title}
                </h1>
                <p className="mt-2 text-body-lg text-foreground-muted">
                  {stepContent.profile.subtitle}
                </p>
              </div>

              {/* Avatar Preview */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <Avatar
                    size="xl"
                    name={firstName && lastName ? `${firstName} ${lastName}` : undefined}
                    color="green"
                    className="ring-4 ring-[var(--primitive-blue-200)]"
                  />
                  <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primitive-green-800)] text-white shadow-lg transition-transform hover:scale-110">
                    <User size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label required>First Name</Label>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jamie"
                      inputSize="lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label required>Last Name</Label>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Wilson"
                      inputSize="lg"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label required>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jamie@example.com"
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>
                    LinkedIn Profile <span className="text-foreground-muted font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="url"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    placeholder="linkedin.com/in/yourprofile"
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>
                    Short Bio <span className="text-foreground-muted font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    placeholder="Tell us about your background and what you're looking for..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step: Goals (Mentees only) */}
          {step === "goals" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-display font-semibold text-foreground-default">
                  {stepContent.goals.title}
                </h1>
                <p className="mt-2 text-body-lg text-foreground-muted">
                  {stepContent.goals.subtitle}
                </p>
              </div>

              {/* Goal input */}
              <div className="flex gap-2 mb-4">
                <Input
                  type="text"
                  value={currentGoal}
                  onChange={(e) => setCurrentGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addGoal();
                    }
                  }}
                  placeholder="Type your goal or select from suggestions..."
                  inputSize="lg"
                  className="flex-1"
                />
                <Button
                  onClick={() => addGoal()}
                  disabled={!currentGoal.trim() || goals.length >= 5}
                  variant="primary"
                  size="lg"
                >
                  Add
                </Button>
              </div>

              {/* Goal suggestions */}
              <div className="mb-6">
                <p className="text-caption text-foreground-muted mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {goalSuggestions.map((suggestion) => {
                    const isAdded = goals.includes(suggestion.text);
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={suggestion.text}
                        onClick={() => !isAdded && addGoal(suggestion.text)}
                        disabled={isAdded || goals.length >= 5}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption transition-all",
                          isAdded
                            ? "border-[var(--primitive-green-800)] bg-[var(--primitive-green-800)]/5 text-[var(--primitive-green-800)] cursor-default"
                            : "border-[var(--border-default)] bg-white hover:border-[var(--primitive-green-800)] hover:bg-[var(--primitive-blue-200)]"
                        )}
                      >
                        <Icon size={14} weight={isAdded ? "fill" : "regular"} />
                        {suggestion.text}
                        {isAdded && <CheckCircle size={14} weight="fill" className="ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Added goals */}
              {goals.length > 0 && (
                <div className="space-y-2">
                  <p className="text-caption font-medium text-foreground-default">Your goals ({goals.length}/5):</p>
                  {goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg bg-[var(--primitive-blue-200)] p-3 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primitive-green-800)]/10">
                        <Target size={16} className="text-[var(--primitive-green-800)]" />
                      </div>
                      <span className="flex-1 text-body text-foreground-default">{goal}</span>
                      <button
                        onClick={() => removeGoal(index)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-foreground-muted hover:bg-[var(--primitive-red-100)] hover:text-[var(--primitive-red-600)] transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {goals.length === 0 && (
                <div className="mt-8 rounded-xl border-2 border-dashed border-[var(--border-default)] bg-[var(--primitive-blue-200)]/50 p-8 text-center">
                  <Target size={40} className="mx-auto text-[var(--primitive-green-800)]/40" />
                  <p className="mt-3 text-body text-foreground-muted">
                    Add at least one goal to help your mentor understand what you're working towards
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step: Sectors */}
          {step === "sectors" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-display font-semibold text-foreground-default">
                  {stepContent.sectors.title}
                </h1>
                <p className="mt-2 text-body-lg text-foreground-muted">
                  {stepContent.sectors.subtitle}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {sectors.map((sector) => {
                  const isSelected = selectedSectors.includes(sector.value);
                  const isDisabled = !isSelected && selectedSectors.length >= 5;
                  const Icon = sector.icon;

                  return (
                    <button
                      key={sector.value}
                      onClick={() => toggleSector(sector.value)}
                      disabled={isDisabled}
                      className={cn(
                        "flex items-center gap-3 rounded-card p-4 text-left transition-all duration-200",
                        isSelected
                          ? "bg-[var(--primitive-blue-200)]"
                          : "bg-white shadow-card hover:shadow-card-hover",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors duration-200",
                          isSelected
                            ? "bg-[var(--primitive-green-800)] text-white"
                            : "bg-[var(--background-subtle)] text-foreground-muted"
                        )}
                      >
                        <Icon size={20} weight={isSelected ? "fill" : "regular"} />
                      </div>
                      <span
                        className={cn(
                          "flex-1 font-medium transition-colors",
                          isSelected ? "text-[var(--primitive-green-800)]" : "text-foreground-default"
                        )}
                      >
                        {sector.label}
                      </span>
                      {isSelected && (
                        <CheckCircle size={20} weight="fill" className="text-[var(--primitive-green-800)]" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg bg-[var(--background-subtle)] px-4 py-3">
                <span className="text-body-sm text-foreground-muted">
                  {selectedSectors.length}/5 sectors selected
                </span>
                <Progress
                  value={(selectedSectors.length / 5) * 100}
                  size="sm"
                  className="w-24"
                />
              </div>
            </div>
          )}

          {/* Step: Availability (Mentors only) */}
          {step === "availability" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-display font-semibold text-foreground-default">
                  {stepContent.availability.title}
                </h1>
                <p className="mt-2 text-body-lg text-foreground-muted">
                  {stepContent.availability.subtitle}
                </p>
              </div>

              <div className="space-y-4">
                {availabilityOptions.map((option) => {
                  const isSelected = availability === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setAvailability(option.value)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-card p-5 text-left transition-all duration-200",
                        isSelected
                          ? "bg-[var(--primitive-blue-200)]"
                          : "bg-white shadow-card hover:shadow-card-hover"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                            isSelected
                              ? "bg-[var(--primitive-green-800)] text-white"
                              : "bg-[var(--background-subtle)] text-foreground-muted"
                          )}
                        >
                          <Calendar size={24} weight={isSelected ? "fill" : "regular"} />
                        </div>
                        <div>
                          <h3 className="text-body-strong font-semibold text-foreground-default">
                            {option.label}
                          </h3>
                          <p className="text-caption text-foreground-muted">{option.description}</p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                          isSelected
                            ? "border-[var(--primitive-green-800)] bg-[var(--primitive-green-800)]"
                            : "border-[var(--border-default)]"
                        )}
                      >
                        {isSelected && <CheckCircle size={16} weight="fill" className="text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 rounded-card bg-[var(--primitive-blue-200)] p-5">
                <h4 className="text-body-strong font-semibold text-foreground-default flex items-center gap-2">
                  <Lightbulb size={18} className="text-[var(--primitive-green-800)]" />
                  What to expect
                </h4>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start gap-2 text-caption text-foreground-muted">
                    <CheckCircle size={16} className="flex-shrink-0 text-[var(--primitive-green-600)] mt-0.5" weight="fill" />
                    You'll receive mentee requests based on your availability
                  </li>
                  <li className="flex items-start gap-2 text-caption text-foreground-muted">
                    <CheckCircle size={16} className="flex-shrink-0 text-[var(--primitive-green-600)] mt-0.5" weight="fill" />
                    Accept only the requests that work for your schedule
                  </li>
                  <li className="flex items-start gap-2 text-caption text-foreground-muted">
                    <CheckCircle size={16} className="flex-shrink-0 text-[var(--primitive-green-600)] mt-0.5" weight="fill" />
                    You can update your availability anytime
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === "complete" && (
            <div className="text-center">
              <div className="mx-auto mb-6 relative">
                <div className="h-28 w-28 mx-auto rounded-full bg-[var(--primitive-blue-200)] flex items-center justify-center animate-in zoom-in duration-500">
                  <Sparkle size={56} weight="fill" className="text-[var(--primitive-green-800)]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-[var(--primitive-green-800)] animate-ping"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: "1.5s",
                      }}
                    />
                  ))}
                </div>
              </div>

              <h1 className="text-display font-semibold text-foreground-default animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                {stepContent.complete.title}
              </h1>
              <p className="mt-2 text-body-lg text-foreground-muted animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                {stepContent.complete.subtitle}
              </p>

              {/* Summary Card */}
              <div className="mt-8 text-left rounded-card bg-white shadow-card animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      size="lg"
                      name={`${firstName} ${lastName}`}
                      color="green"
                    />
                    <div>
                      <h3 className="text-body-strong font-semibold text-foreground-default">
                        {firstName} {lastName}
                      </h3>
                      <p className="text-caption text-foreground-muted">
                        {selectedRole === "seeker" ? "Climate Career Explorer" :
                         selectedRole === "mentor" ? "Light Mentor" : "Career Coach"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[var(--border-default)] pt-4 space-y-3">
                    {selectedSectors.length > 0 && (
                      <div>
                        <p className="text-caption text-foreground-muted mb-1.5">Interested sectors</p>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSectors.map((sector) => (
                            <Badge key={sector} variant="secondary" size="sm">
                              {SECTOR_INFO[sector].label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {goals.length > 0 && (
                      <div>
                        <p className="text-caption text-foreground-muted mb-1.5">Goals</p>
                        <ul className="text-caption text-foreground-default space-y-1">
                          {goals.slice(0, 2).map((goal, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Target size={14} className="text-[var(--primitive-green-800)]" />
                              {goal}
                            </li>
                          ))}
                          {goals.length > 2 && (
                            <li className="text-foreground-muted">+{goals.length - 2} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight size={18} />}
                  onClick={() => router.push(selectedRole === "coach" ? "/candid/coach-dashboard" : "/candid/dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => router.push("/candid/browse")}
                >
                  Browse {selectedRole === "seeker" ? "Mentors" : "Mentees"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {step !== "complete" && (
          <div className="mt-10 flex items-center justify-between">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStepIndex === 0}
              variant="ghost"
              leftIcon={<ArrowLeft size={18} />}
              className={cn(currentStepIndex === 0 && "invisible")}
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
              {step === "welcome" ? "Get Started" :
               currentStepIndex === steps.length - 2 ? "Complete" : "Continue"}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

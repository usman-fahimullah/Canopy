"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, InputMessage } from "@/components/ui/input";
import { CandidLogo } from "@/app/candid/components/CandidLogo";
import {
  User,
  Briefcase,
  LinkedinLogo,
  EnvelopeSimple,
  Clock,
  CurrencyDollar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "@phosphor-icons/react";

type Step = "intro" | "personal" | "experience" | "details" | "review" | "success";

const EXPERTISE_OPTIONS = [
  "Career Transitions",
  "Interview Prep",
  "Resume Review",
  "Networking Strategy",
  "Salary Negotiation",
  "Sector Navigation",
  "Leadership",
  "Technical Skills",
];

const SECTOR_OPTIONS = [
  "Climate Tech",
  "Clean Energy",
  "Policy & Government",
  "Climate Finance",
  "Nonprofit / NGO",
  "Corporate Sustainability",
  "Agriculture & Food",
  "Transportation",
  "Built Environment",
];

export default function CoachApplicationPage() {
  const [step, setStep] = useState<Step>("intro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    linkedinUrl: "",
    headline: "",
    bio: "",
    yearsInClimate: "",
    expertise: [] as string[],
    sectors: [] as string[],
    sessionRate: "150",
    availability: "",
    motivation: "",
  });

  const updateField = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: "expertise" | "sectors", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coaches/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          yearsInClimate: parseInt(formData.yearsInClimate),
          sessionRate: parseInt(formData.sessionRate) * 100, // Convert to cents
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit application");
      }

      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Intro Step
  if (step === "intro") {
    return (
      <ApplicationLayout>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-4">
            Become a Candid Coach
          </h1>
          <p className="text-lg text-[var(--primitive-neutral-600)] max-w-md mx-auto">
            Share your climate expertise and help others transition into impactful careers.
          </p>
        </div>

        <div className="bg-[var(--primitive-green-50)] rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-[var(--primitive-green-800)] mb-4">
            What you&apos;ll get:
          </h2>
          <ul className="space-y-3 text-[var(--primitive-green-700)]">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 shrink-0" weight="fill" />
              <span>Set your own rates ($75-$500/session)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 shrink-0" weight="fill" />
              <span>Flexible schedule - coach when it works for you</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 shrink-0" weight="fill" />
              <span>We handle payments, scheduling, and admin</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="mt-0.5 shrink-0" weight="fill" />
              <span>Build your reputation with reviews and ratings</span>
            </li>
          </ul>
        </div>

        <div className="bg-[var(--card-background)] border border-[var(--primitive-neutral-200)] rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-[var(--primitive-green-800)] mb-4">
            Requirements:
          </h2>
          <ul className="space-y-2 text-[var(--primitive-neutral-600)]">
            <li>• 3+ years of experience in climate-related work</li>
            <li>• Active LinkedIn profile</li>
            <li>• Commitment to 4+ hours/month of coaching</li>
            <li>• Passion for helping others succeed</li>
          </ul>
        </div>

        <Button className="w-full" onClick={() => setStep("personal")}>
          Start Application
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </ApplicationLayout>
    );
  }

  // Success Step
  if (step === "success") {
    return (
      <ApplicationLayout>
        <div className="text-center">
          <div className="w-20 h-20 bg-[var(--primitive-green-100)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} weight="fill" className="text-[var(--primitive-green-600)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--primitive-green-800)] mb-4">
            Application Submitted!
          </h1>
          <p className="text-[var(--primitive-neutral-600)] mb-8">
            Thanks for applying to become a Candid coach. We&apos;ll review your application and get back to you within 3-5 business days.
          </p>
          <div className="bg-[var(--primitive-neutral-50)] rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-[var(--primitive-green-800)] mb-3">
              What happens next?
            </h2>
            <ol className="space-y-2 text-sm text-[var(--primitive-neutral-600)]">
              <li>1. Our team reviews your application</li>
              <li>2. If approved, we&apos;ll schedule a brief video call</li>
              <li>3. Complete onboarding and set up payments</li>
              <li>4. Start coaching!</li>
            </ol>
          </div>
          <Link href="/">
            <Button variant="secondary">Back to Home</Button>
          </Link>
        </div>
      </ApplicationLayout>
    );
  }

  // Form Steps
  return (
    <ApplicationLayout>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-[var(--primitive-neutral-600)] mb-2">
          <span>Step {["personal", "experience", "details", "review"].indexOf(step) + 1} of 4</span>
          <span>{step === "personal" ? "Personal Info" : step === "experience" ? "Experience" : step === "details" ? "Coaching Details" : "Review"}</span>
        </div>
        <div className="h-2 bg-[var(--primitive-neutral-200)] rounded-full">
          <div
            className="h-full bg-[var(--primitive-green-600)] rounded-full transition-all"
            style={{ width: `${(["personal", "experience", "details", "review"].indexOf(step) + 1) * 25}%` }}
          />
        </div>
      </div>

      {/* Personal Info */}
      {step === "personal" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--primitive-green-800)]">
            Personal Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--primitive-green-800)]">
                First Name *
              </label>
              <Input
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                leftAddon={<User weight="bold" />}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--primitive-green-800)]">
                Last Name *
              </label>
              <Input
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
              leftAddon={<EnvelopeSimple weight="bold" />}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              LinkedIn Profile *
            </label>
            <Input
              value={formData.linkedinUrl}
              onChange={(e) => updateField("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
              leftAddon={<LinkedinLogo weight="bold" />}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Professional Headline *
            </label>
            <Input
              value={formData.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              placeholder="VP of Engineering at CleanTech Co"
              leftAddon={<Briefcase weight="bold" />}
            />
            <p className="text-xs text-[var(--primitive-neutral-500)]">
              This will be displayed on your coach profile
            </p>
          </div>

          <NavigationButtons
            onBack={() => setStep("intro")}
            onNext={() => setStep("experience")}
            nextDisabled={!formData.firstName || !formData.lastName || !formData.email || !formData.linkedinUrl || !formData.headline}
          />
        </div>
      )}

      {/* Experience */}
      {step === "experience" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--primitive-green-800)]">
            Your Experience
          </h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Years in Climate *
            </label>
            <Input
              type="number"
              value={formData.yearsInClimate}
              onChange={(e) => updateField("yearsInClimate", e.target.value)}
              placeholder="5"
              min="1"
              max="50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Areas of Expertise * (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {EXPERTISE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayField("expertise", option)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.expertise.includes(option)
                      ? "bg-[var(--primitive-green-600)] text-white"
                      : "bg-[var(--primitive-neutral-100)] text-[var(--primitive-neutral-700)] hover:bg-[var(--primitive-neutral-200)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Climate Sectors * (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {SECTOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayField("sectors", option)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    formData.sectors.includes(option)
                      ? "bg-[var(--primitive-green-600)] text-white"
                      : "bg-[var(--primitive-neutral-100)] text-[var(--primitive-neutral-700)] hover:bg-[var(--primitive-neutral-200)]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Bio *
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              placeholder="Tell us about your background and what makes you a great coach..."
              className="w-full px-4 py-3 border border-[var(--primitive-neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-600)] focus:border-transparent resize-none"
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-[var(--primitive-neutral-500)]">
              {formData.bio.length}/1000 characters
            </p>
          </div>

          <NavigationButtons
            onBack={() => setStep("personal")}
            onNext={() => setStep("details")}
            nextDisabled={!formData.yearsInClimate || formData.expertise.length === 0 || formData.sectors.length === 0 || !formData.bio}
          />
        </div>
      )}

      {/* Coaching Details */}
      {step === "details" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--primitive-green-800)]">
            Coaching Details
          </h2>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Session Rate (USD) *
            </label>
            <Input
              type="number"
              value={formData.sessionRate}
              onChange={(e) => updateField("sessionRate", e.target.value)}
              placeholder="150"
              min="75"
              max="500"
              leftAddon={<CurrencyDollar weight="bold" />}
            />
            <p className="text-xs text-[var(--primitive-neutral-500)]">
              Per 60-minute session. You&apos;ll receive 82% after platform fee.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Availability *
            </label>
            <Input
              value={formData.availability}
              onChange={(e) => updateField("availability", e.target.value)}
              placeholder="e.g., 4-6 hours/month, weekday evenings"
              leftAddon={<Clock weight="bold" />}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--primitive-green-800)]">
              Why do you want to coach? *
            </label>
            <textarea
              value={formData.motivation}
              onChange={(e) => updateField("motivation", e.target.value)}
              placeholder="What motivates you to help others transition into climate careers?"
              className="w-full px-4 py-3 border border-[var(--primitive-neutral-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-600)] focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-[var(--primitive-neutral-500)]">
              {formData.motivation.length}/500 characters
            </p>
          </div>

          <NavigationButtons
            onBack={() => setStep("experience")}
            onNext={() => setStep("review")}
            nextDisabled={!formData.sessionRate || !formData.availability || !formData.motivation}
          />
        </div>
      )}

      {/* Review */}
      {step === "review" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--primitive-green-800)]">
            Review Your Application
          </h2>

          <div className="bg-[var(--primitive-neutral-50)] rounded-xl p-6 space-y-4">
            <ReviewItem label="Name" value={`${formData.firstName} ${formData.lastName}`} />
            <ReviewItem label="Email" value={formData.email} />
            <ReviewItem label="LinkedIn" value={formData.linkedinUrl} />
            <ReviewItem label="Headline" value={formData.headline} />
            <ReviewItem label="Years in Climate" value={formData.yearsInClimate} />
            <ReviewItem label="Expertise" value={formData.expertise.join(", ")} />
            <ReviewItem label="Sectors" value={formData.sectors.join(", ")} />
            <ReviewItem label="Session Rate" value={`$${formData.sessionRate}/session`} />
            <ReviewItem label="Availability" value={formData.availability} />
          </div>

          {error && <InputMessage status="error">{error}</InputMessage>}

          <NavigationButtons
            onBack={() => setStep("details")}
            onNext={handleSubmit}
            nextLabel="Submit Application"
            loading={loading}
          />
        </div>
      )}
    </ApplicationLayout>
  );
}

function ApplicationLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-50)]">
      <header className="p-6">
        <Link href="/">
          <CandidLogo width={120} height={30} />
        </Link>
      </header>
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-[var(--card-background)] rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavigationButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  loading = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-4">
      <Button variant="secondary" onClick={onBack} className="flex-1">
        <ArrowLeft size={18} className="mr-2" />
        Back
      </Button>
      <Button onClick={onNext} disabled={nextDisabled || loading} loading={loading} className="flex-1">
        {nextLabel}
        {!loading && <ArrowRight size={18} className="ml-2" />}
      </Button>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-[var(--primitive-neutral-600)]">{label}</dt>
      <dd className="font-medium text-[var(--primitive-green-800)]">{value}</dd>
    </div>
  );
}

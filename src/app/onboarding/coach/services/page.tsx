"use client";

import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { StepNavigation } from "@/components/onboarding/step-navigation";
import { useOnboardingForm, type CoachService } from "@/components/onboarding/form-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormField } from "@/components/ui/form-section";
import { COACH_STEPS } from "@/lib/onboarding/types";
import { cn } from "@/lib/utils";
import { Plus, Trash } from "@phosphor-icons/react";

const DURATION_OPTIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "60 min" },
  { value: 90, label: "90 min" },
  { value: 120, label: "2 hours" },
];

function generateId() {
  return `svc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export default function CoachServicesPage() {
  const router = useRouter();
  const { coachData, setCoachData } = useOnboardingForm();

  const step = COACH_STEPS[2]; // services
  const canContinue =
    coachData.services.length > 0 &&
    coachData.services.every((s) => s.name.trim().length >= 3 && s.description.trim().length >= 10);

  function updateService(id: string, updates: Partial<CoachService>) {
    setCoachData({
      services: coachData.services.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  }

  function removeService(id: string) {
    if (coachData.services.length <= 1) return;
    setCoachData({
      services: coachData.services.filter((s) => s.id !== id),
    });
  }

  function addService() {
    const newService: CoachService = {
      id: generateId(),
      name: "",
      duration: 60,
      price: 15000,
      description: "",
    };
    setCoachData({
      services: [...coachData.services, newService],
    });
  }

  return (
    <OnboardingShell
      shell="coach"
      step={step}
      currentStepIndex={2}
      totalSteps={COACH_STEPS.length}
      footer={
        <StepNavigation
          onBack={() => router.push("/onboarding/coach/expertise")}
          onContinue={() => router.push("/onboarding/coach/availability")}
          canContinue={canContinue}
        />
      }
    >
      <div className="space-y-6">
        {coachData.services.map((service, index) => (
          <FormCard key={service.id}>
            <div className="flex items-center justify-between">
              <p className="text-body-sm font-medium text-[var(--foreground-default)]">
                Service {index + 1}
              </p>
              {coachData.services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(service.id)}
                  className="rounded-lg p-1.5 text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--background-error)] hover:text-[var(--foreground-error)]"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>

            <FormField label="Service name" required>
              <Input
                placeholder="e.g. Discovery Call, Coaching Session"
                value={service.name}
                onChange={(e) => updateService(service.id, { name: e.target.value })}
              />
            </FormField>

            <FormField label="Duration">
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => updateService(service.id, { duration: opt.value })}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-caption font-medium transition-all",
                      service.duration === opt.value
                        ? "border-[var(--border-interactive-focus)] bg-[var(--background-interactive-selected)] text-[var(--foreground-interactive-selected)]"
                        : "border-[var(--border-muted)] bg-[var(--background-interactive-default)] text-[var(--foreground-muted)] hover:border-[var(--border-interactive-hover)]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField
              label="Price"
              helpText={service.price === 0 ? "Free session" : "Per session in USD"}
            >
              <div className="flex items-center gap-3">
                <span className="text-body-sm font-medium text-[var(--foreground-muted)]">$</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={service.price === 0 ? "0" : Math.round(service.price / 100).toString()}
                  onChange={(e) => {
                    const dollars = parseInt(e.target.value) || 0;
                    updateService(service.id, {
                      price: Math.max(0, Math.min(dollars, 1000)) * 100,
                    });
                  }}
                  className="max-w-[120px]"
                />
                <span className="text-caption text-[var(--foreground-muted)]">
                  {service.price === 0 ? "(free)" : "per session"}
                </span>
              </div>
            </FormField>

            <FormField label="Description" required>
              <Textarea
                placeholder="Describe what clients can expect from this session..."
                value={service.description}
                onChange={(e) => updateService(service.id, { description: e.target.value })}
                rows={3}
              />
            </FormField>
          </FormCard>
        ))}

        {/* Add service button */}
        <button
          type="button"
          onClick={addService}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border-muted)] p-4 text-caption font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--border-interactive-hover)] hover:text-[var(--foreground-default)]"
        >
          <Plus size={18} weight="bold" />
          Add another service
        </button>
      </div>
    </OnboardingShell>
  );
}

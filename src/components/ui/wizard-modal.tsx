"use client";

import * as React from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "./modal";
import { Button } from "./button";

/**
 * WizardModal — Multi-step wizard variant of Modal.
 *
 * Composes existing Modal primitives with step state management,
 * a segmented step indicator, and consistent Back/Next navigation.
 *
 * Supports both controlled (step/onStepChange) and uncontrolled modes.
 *
 * Usage:
 *   <WizardModal
 *     open={open}
 *     onOpenChange={setOpen}
 *     steps={[
 *       { id: "basics", label: "Basics" },
 *       { id: "details", label: "Details" },
 *       { id: "review", label: "Review" },
 *     ]}
 *     step={currentStep}
 *     onStepChange={setCurrentStep}
 *     title="Create Something"
 *     onComplete={handleSave}
 *   >
 *     <WizardStep stepId="basics">...</WizardStep>
 *     <WizardStep stepId="details">...</WizardStep>
 *     <WizardStep stepId="review">...</WizardStep>
 *   </WizardModal>
 */

// ============================================================================
// Types
// ============================================================================

export interface WizardStepDef {
  id: string;
  label: string;
  description?: string;
}

interface WizardContextValue {
  steps: WizardStepDef[];
  currentStep: number;
  totalSteps: number;
  currentStepDef: WizardStepDef;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => void;
  goBack: () => void;
  goTo: (step: number) => void;
}

export interface WizardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  steps: WizardStepDef[];
  children: React.ReactNode;
  /** Controlled step index (0-based). Omit for uncontrolled mode. */
  step?: number;
  /** Callback when step changes. Required for controlled mode. */
  onStepChange?: (step: number) => void;
  /** Modal size variant */
  size?: "default" | "md" | "lg" | "xl";
  /** Icon rendered in ModalHeader icon badge */
  icon?: React.ReactNode;
  /** Background class for the icon badge */
  iconBg?: string;
  /** Modal title (shown in header) */
  title?: string;
  /** Optional description below title */
  description?: string;
  /** Additional className on ModalContent */
  className?: string;
  /** Label for the final step's action button */
  completeLabel?: string;
  /** Label for the Next button */
  nextLabel?: string;
  /** Label for the Back button */
  backLabel?: string;
  /** Called when the user clicks the final step's action button */
  onComplete?: () => void | Promise<void>;
  /** Whether the complete action is in progress */
  isCompleting?: boolean;
  /** Whether the Next button should be disabled */
  nextDisabled?: boolean;
  /** Hide the footer entirely */
  hideFooter?: boolean;
  /** Hide the back button on the first step (default: true) */
  hideBackOnFirstStep?: boolean;
  /** Hide the close button in the header */
  hideCloseButton?: boolean;
  /** Called when the user clicks the Next button (for validation before advancing) */
  onNext?: () => boolean | void;
  /** Called when the user clicks the Back button */
  onBack?: () => void;
}

export interface WizardStepProps {
  /** Must match a step id from the steps array */
  stepId: string;
  children: React.ReactNode;
  className?: string;
}

// ============================================================================
// Context
// ============================================================================

const WizardContext = React.createContext<WizardContextValue | null>(null);

/**
 * Hook to access wizard state from within step content.
 *
 * Returns: { steps, currentStep, totalSteps, currentStepDef, isFirstStep, isLastStep, goNext, goBack, goTo }
 */
export function useWizardModal(): WizardContextValue {
  const ctx = React.useContext(WizardContext);
  if (!ctx) {
    throw new Error("useWizardModal must be used within a <WizardModal>");
  }
  return ctx;
}

// ============================================================================
// WizardStepIndicator (internal)
// ============================================================================

function WizardStepIndicator({
  steps,
  currentStep,
}: {
  steps: WizardStepDef[];
  currentStep: number;
}) {
  const percentage = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div
      className="flex w-full flex-col gap-2 border-b border-[var(--border-muted)] px-8 py-3"
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-valuetext={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]?.label}`}
    >
      {/* Segmented bars */}
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "h-1.5 flex-1 rounded-sm transition-colors duration-200",
              index <= currentStep ? "bg-[var(--background-brand)]" : "bg-[var(--background-muted)]"
            )}
          />
        ))}
      </div>

      {/* Step labels */}
      <div className="flex gap-2">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={cn(
              "flex-1 text-caption-sm transition-colors duration-200",
              index === currentStep && "font-medium text-[var(--foreground-default)]",
              index < currentStep && "text-[var(--foreground-muted)]",
              index > currentStep && "text-[var(--foreground-subtle)]"
            )}
          >
            {step.label}
          </span>
        ))}
      </div>

      {/* Screen reader: percentage */}
      <span className="sr-only">{percentage}% complete</span>
    </div>
  );
}

// ============================================================================
// WizardStep
// ============================================================================

/**
 * WizardStep — Wrapper for each step's content.
 * Only the step matching the current wizard state is rendered.
 */
export function WizardStep({ stepId: _stepId, children, className }: WizardStepProps) {
  return <div className={cn("flex w-full flex-1 flex-col", className)}>{children}</div>;
}

WizardStep.displayName = "WizardStep";

// ============================================================================
// WizardModal
// ============================================================================

export function WizardModal({
  open,
  onOpenChange,
  steps,
  children,
  step: controlledStep,
  onStepChange,
  size = "default",
  icon,
  iconBg,
  title,
  description,
  className,
  completeLabel = "Complete",
  nextLabel = "Continue",
  backLabel = "Back",
  onComplete,
  isCompleting = false,
  nextDisabled = false,
  hideFooter = false,
  hideBackOnFirstStep = true,
  hideCloseButton = false,
  onNext,
  onBack,
}: WizardModalProps) {
  // Internal state for uncontrolled mode
  const [internalStep, setInternalStep] = React.useState(0);

  const isControlled = controlledStep !== undefined;
  const currentStep = isControlled ? controlledStep : internalStep;

  const setStep = React.useCallback(
    (next: number) => {
      if (isControlled && onStepChange) {
        onStepChange(next);
      } else {
        setInternalStep(next);
      }
    },
    [isControlled, onStepChange]
  );

  // Reset internal step when modal closes
  const handleOpenChange = React.useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isControlled) {
        setInternalStep(0);
      }
      onOpenChange(isOpen);
    },
    [isControlled, onOpenChange]
  );

  const totalSteps = steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepDef = steps[currentStep] ?? steps[0];

  const goNext = React.useCallback(() => {
    if (!isLastStep) {
      setStep(currentStep + 1);
    }
  }, [currentStep, isLastStep, setStep]);

  const goBack = React.useCallback(() => {
    if (!isFirstStep) {
      setStep(currentStep - 1);
    }
  }, [currentStep, isFirstStep, setStep]);

  const goTo = React.useCallback(
    (stepIndex: number) => {
      if (stepIndex >= 0 && stepIndex < totalSteps) {
        setStep(stepIndex);
      }
    },
    [totalSteps, setStep]
  );

  const contextValue = React.useMemo<WizardContextValue>(
    () => ({
      steps,
      currentStep,
      totalSteps,
      currentStepDef,
      isFirstStep,
      isLastStep,
      goNext,
      goBack,
      goTo,
    }),
    [steps, currentStep, totalSteps, currentStepDef, isFirstStep, isLastStep, goNext, goBack, goTo]
  );

  // Find the active WizardStep child based on current step
  const stepChildren = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<WizardStepProps> =>
      React.isValidElement(child) && child.type === WizardStep
  );
  const activeChild = stepChildren.find((child) => child.props.stepId === currentStepDef?.id);

  // Handle Next button click
  const handleNext = React.useCallback(() => {
    if (onNext) {
      const result = onNext();
      if (result === false) return; // validation failed
    }
    goNext();
  }, [onNext, goNext]);

  // Handle Back button click
  const handleBack = React.useCallback(() => {
    if (onBack) {
      onBack();
    }
    goBack();
  }, [onBack, goBack]);

  // Handle Complete button click
  const handleComplete = React.useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const showBack = !isFirstStep || !hideBackOnFirstStep;

  return (
    <WizardContext.Provider value={contextValue}>
      <Modal open={open} onOpenChange={handleOpenChange}>
        <ModalContent size={size} className={cn("max-h-[90vh]", className)}>
          {/* Header */}
          <ModalHeader icon={icon} iconBg={iconBg} hideCloseButton={hideCloseButton}>
            {title && <ModalTitle>{title}</ModalTitle>}
            {description && <ModalDescription>{description}</ModalDescription>}
          </ModalHeader>

          {/* Step indicator */}
          {totalSteps > 1 && <WizardStepIndicator steps={steps} currentStep={currentStep} />}

          {/* Active step content with fade transition */}
          <ModalBody className="p-0">
            <div
              key={currentStep}
              className="flex w-full flex-1 flex-col duration-150 animate-in fade-in"
            >
              {activeChild}
            </div>
          </ModalBody>

          {/* Footer */}
          {!hideFooter && (
            <ModalFooter>
              {showBack && (
                <Button
                  variant="tertiary"
                  leftIcon={<ArrowLeft size={16} />}
                  onClick={handleBack}
                  className="mr-auto"
                >
                  {backLabel}
                </Button>
              )}

              {isLastStep ? (
                <Button
                  variant="primary"
                  onClick={handleComplete}
                  loading={isCompleting}
                  disabled={isCompleting}
                >
                  {completeLabel}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNext} disabled={nextDisabled}>
                  {nextLabel}
                </Button>
              )}
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </WizardContext.Provider>
  );
}

WizardModal.displayName = "WizardModal";

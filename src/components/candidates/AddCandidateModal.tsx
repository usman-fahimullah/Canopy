"use client";

import * as React from "react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

// Icons
import { User, Link as LinkIcon } from "@phosphor-icons/react";

// Logger
import { logger, formatError } from "@/lib/logger";

// ============================================
// TYPES
// ============================================

interface ApplicationData {
  id: string;
  stage: string;
  stageOrder: number;
  matchScore: number | null;
  matchReasons: string | null;
  source: string | null;
  coverLetter: string | null;
  formResponses: string | null;
  knockoutPassed: boolean;
  rejectedAt: string | null;
  hiredAt: string | null;
  createdAt: string;
  updatedAt: string;
  seeker: {
    id: string;
    headline: string | null;
    resumeUrl: string | null;
    skills: string[];
    greenSkills: string[];
    certifications: string[];
    yearsExperience: number | null;
    account: {
      id: string;
      name: string | null;
      email: string;
      avatar: string | null;
    };
  };
}

interface AddCandidateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roleId: string;
  /** Called after a candidate is successfully added, with the new application data for optimistic update */
  onSuccess: (newApplication: ApplicationData) => void;
}

// ============================================
// FORM DEFAULTS
// ============================================

const defaultCandidateForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  pronouns: "",
  linkedinUrl: "",
  websiteUrl: "",
  headline: "",
  source: "",
};

type CandidateFormField = keyof typeof defaultCandidateForm;

// ============================================
// COMPONENT
// ============================================

export function AddCandidateModal({
  open,
  onOpenChange,
  roleId,
  onSuccess,
}: AddCandidateModalProps) {
  const [form, setForm] = React.useState(defaultCandidateForm);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setForm(defaultCandidateForm);
      setErrors({});
    }
  }, [open]);

  // ============================================
  // HANDLERS
  // ============================================

  const updateField = (field: CandidateFormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.firstName.trim() && !form.lastName.trim()) {
      newErrors.firstName = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/canopy/roles/${roleId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();

        if (res.status === 409) {
          setErrors({ email: "This candidate has already been added to this role" });
          return;
        }

        if (res.status === 422 && errorData.details?.fieldErrors?.email) {
          setErrors({ email: errorData.details.fieldErrors.email[0] });
          return;
        }

        logger.error("Failed to add candidate", {
          status: res.status,
          error: errorData.error,
        });
        toast.error(errorData.error || "Failed to add candidate");
        return;
      }

      const newApplication: ApplicationData = await res.json();

      // Close modal
      onOpenChange(false);

      // Optimistic update — pass new application to parent
      onSuccess(newApplication);

      // Toast success
      const candidateName = `${form.firstName} ${form.lastName}`.trim() || form.email;
      toast.success(`${candidateName} added successfully`);
    } catch (err) {
      logger.error("Error adding candidate", { error: formatError(err) });
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    onOpenChange(false);
  };

  // ============================================
  // DERIVED
  // ============================================

  const fullName = `${form.firstName} ${form.lastName}`.trim();

  // ============================================
  // RENDER
  // ============================================

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader
          icon={<User weight="regular" className="h-6 w-6 text-[var(--primitive-green-700)]" />}
          iconBg="bg-[var(--primitive-green-100)]"
        >
          <ModalTitle>Add Candidate</ModalTitle>
        </ModalHeader>

        <ModalBody>
          <div className="flex flex-col gap-5">
            {/* Section 1: Profile Information */}
            <div className="flex flex-col gap-3">
              <h3 className="text-caption-strong uppercase tracking-wide text-foreground-muted">
                Profile Information
              </h3>

              {/* Avatar preview — compact */}
              <div className="flex items-center gap-3">
                <Avatar
                  name={fullName || undefined}
                  email={form.email || undefined}
                  size="lg"
                  color="green"
                />
                <div className="flex flex-col">
                  <span className="text-body font-medium text-foreground">
                    {fullName || "New Candidate"}
                  </span>
                  {form.email && (
                    <span className="text-caption text-foreground-muted">{form.email}</span>
                  )}
                </div>
              </div>

              {/* First Name + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-firstName">First Name*</Label>
                  <Input
                    id="candidate-firstName"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Jane"
                    error={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <span className="text-caption-sm text-[var(--foreground-error)]">
                      {errors.firstName}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-lastName">Last Name</Label>
                  <Input
                    id="candidate-lastName"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="candidate-email">Email*</Label>
                <Input
                  id="candidate-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="jane@example.com"
                  error={!!errors.email}
                />
                {errors.email && (
                  <span className="text-caption-sm text-[var(--foreground-error)]">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Phone + Pronouns — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-phone">Phone Number</Label>
                  <Input
                    id="candidate-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-pronouns">Pronouns</Label>
                  <Select
                    value={form.pronouns}
                    onValueChange={(value) => updateField("pronouns", value)}
                  >
                    <SelectTrigger id="candidate-pronouns">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="he/him">He/Him</SelectItem>
                      <SelectItem value="she/her">She/Her</SelectItem>
                      <SelectItem value="they/them">They/Them</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* City + Country */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-city">City</Label>
                  <Input
                    id="candidate-city"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-country">Country</Label>
                  <Input
                    id="candidate-country"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border-muted)]" />

            {/* Section 2: Contact & Links — side by side */}
            <div className="flex flex-col gap-3">
              <h3 className="text-caption-strong uppercase tracking-wide text-foreground-muted">
                Contact & Links
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-linkedin">LinkedIn</Label>
                  <Input
                    id="candidate-linkedin"
                    type="url"
                    value={form.linkedinUrl}
                    onChange={(e) => updateField("linkedinUrl", e.target.value)}
                    placeholder="linkedin.com/in/..."
                    leftAddon={<LinkIcon weight="regular" />}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="candidate-website">Website / Portfolio</Label>
                  <Input
                    id="candidate-website"
                    type="url"
                    value={form.websiteUrl}
                    onChange={(e) => updateField("websiteUrl", e.target.value)}
                    placeholder="https://..."
                    leftAddon={<LinkIcon weight="regular" />}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border-muted)]" />

            {/* Section 3: Professional — side by side */}
            <div className="flex flex-col gap-3">
              <h3 className="text-caption-strong uppercase tracking-wide text-foreground-muted">
                Professional
              </h3>

              <div className="flex flex-col gap-1">
                <Label htmlFor="candidate-headline">Headline</Label>
                <Input
                  id="candidate-headline"
                  value={form.headline}
                  onChange={(e) => updateField("headline", e.target.value)}
                  placeholder="e.g., Solar Engineer with 5 years in renewable energy"
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label htmlFor="candidate-source">Source</Label>
                <Select value={form.source} onValueChange={(value) => updateField("source", value)}>
                  <SelectTrigger id="candidate-source">
                    <SelectValue placeholder="How did this candidate come in?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green-jobs-board">Green Jobs Board</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="career-fair">Career Fair</SelectItem>
                    <SelectItem value="company-website">Company Website</SelectItem>
                    <SelectItem value="direct-outreach">Direct Outreach</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="tertiary"
            size="default"
            onClick={handleDiscard}
            disabled={isSubmitting}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Add Candidate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

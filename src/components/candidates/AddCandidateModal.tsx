"use client";

import * as React from "react";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { FileUpload } from "@/components/ui/file-upload";
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

// Hooks
import { useAsyncData } from "@/hooks/use-async-data";

// Icons
import { User, Link as LinkIcon, Paperclip } from "@phosphor-icons/react";

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

interface RoleOption {
  id: string;
  title: string;
  location: string | null;
  locationType: string;
}

interface AddCandidateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the role selector is hidden and this role is used. When omitted, user must select a role. */
  roleId?: string;
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
  const [selectedRoleId, setSelectedRoleId] = React.useState(roleId ?? "");
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);

  // Fetch published roles when no roleId is provided
  const { data: rolesData, isLoading: rolesLoading } = useAsyncData(
    async () => {
      const res = await fetch("/api/canopy/roles?status=PUBLISHED&take=100");
      if (!res.ok) throw new Error("Failed to load roles");
      return res.json();
    },
    [open],
    { enabled: open && !roleId }
  );

  const roleOptions: ComboboxOption[] = React.useMemo(() => {
    if (!rolesData?.jobs) return [];
    return rolesData.jobs.map((job: RoleOption) => ({
      value: job.id,
      label: job.title,
      description: [job.location, job.locationType].filter(Boolean).join(" · "),
    }));
  }, [rolesData]);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setForm(defaultCandidateForm);
      setSelectedRoleId(roleId ?? "");
      setErrors({});
      setResumeFile(null);
    }
  }, [open, roleId]);

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

  const effectiveRoleId = roleId ?? selectedRoleId;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!effectiveRoleId) {
      newErrors.role = "Please select a role";
    }

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
      // Step 1: Upload resume if attached
      let resumeUrl: string | undefined;
      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);

        const uploadRes = await fetch("/api/canopy/resume-upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          resumeUrl = uploadData.url;
        } else {
          // Resume upload failed — warn but continue without it
          toast.error("Resume upload failed. Candidate will be added without a resume.");
          logger.error("Resume upload failed during add candidate", {
            status: uploadRes.status,
          });
        }
      }

      // Step 2: Create the candidate application
      const res = await fetch(`/api/canopy/roles/${effectiveRoleId}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...(resumeUrl ? { resumeUrl } : {}),
        }),
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

      // Auto-trigger resume parsing in background (fire-and-forget)
      if (resumeUrl) {
        fetch("/api/canopy/resume-parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seekerId: newApplication.seeker.id,
            resumeUrl,
          }),
        })
          .then((parseRes) => {
            if (parseRes.ok) {
              toast.success("Resume parsed successfully");
            }
          })
          .catch((err) => {
            logger.warn("Background resume parse failed", { error: formatError(err) });
          });
      }

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

  const handleResumeChange = (files: File[]) => {
    setResumeFile(files[0] || null);
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
            {/* Role Selection — only shown when roleId is not pre-set */}
            {!roleId && (
              <>
                <div className="flex flex-col gap-3">
                  <h3 className="text-caption-strong uppercase tracking-wide text-foreground-muted">
                    Role
                  </h3>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="candidate-role">Select Role*</Label>
                    <Combobox
                      options={roleOptions}
                      value={selectedRoleId}
                      onValueChange={(value) => {
                        setSelectedRoleId(value);
                        if (errors.role) {
                          setErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.role;
                            return updated;
                          });
                        }
                      }}
                      placeholder="Search roles..."
                      searchPlaceholder="Search by title..."
                      emptyMessage="No published roles found."
                      loading={rolesLoading}
                      error={!!errors.role}
                    />
                    {errors.role && (
                      <span className="text-caption-sm text-[var(--foreground-error)]">
                        {errors.role}
                      </span>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border-muted)]" />
              </>
            )}

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

            {/* Section 3: Professional */}
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

            {/* Divider */}
            <div className="border-t border-[var(--border-muted)]" />

            {/* Section 4: Resume Upload */}
            <div className="flex flex-col gap-3">
              <h3 className="text-caption-strong uppercase tracking-wide text-foreground-muted">
                <span className="flex items-center gap-1.5">
                  <Paperclip size={14} weight="bold" />
                  Resume
                  <span className="font-normal normal-case">(optional)</span>
                </span>
              </h3>

              {resumeFile ? (
                <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--background-subtle)] px-4 py-3">
                  <Paperclip size={18} className="shrink-0 text-[var(--foreground-muted)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-caption font-medium text-[var(--foreground-default)]">
                      {resumeFile.name}
                    </p>
                    <p className="text-caption-sm text-[var(--foreground-muted)]">
                      {(resumeFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setResumeFile(null)}
                    aria-label="Remove resume"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <FileUpload
                  accept=".pdf,.doc,.docx"
                  maxSize={5 * 1024 * 1024}
                  multiple={false}
                  size="sm"
                  onChange={handleResumeChange}
                >
                  <div className="text-center">
                    <p className="text-caption font-medium text-[var(--foreground-default)]">
                      Drop resume here or click to upload
                    </p>
                    <p className="mt-0.5 text-caption-sm text-[var(--foreground-muted)]">
                      PDF, DOC, or DOCX up to 5MB
                    </p>
                  </div>
                </FileUpload>
              )}
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

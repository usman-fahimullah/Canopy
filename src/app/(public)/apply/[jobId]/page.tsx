"use client";

import * as React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/dropdown";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Banner } from "@/components/ui/banner";
import { SegmentedController } from "@/components/ui/segmented-controller";
import { Spinner } from "@/components/ui/spinner";

// Icons
import {
  Buildings,
  MapPin,
  Clock,
  Upload,
  CheckCircle,
  ArrowLeft,
  FloppyDisk,
  Eye,
  Pencil,
  WarningCircle,
} from "@phosphor-icons/react";

// Storage
import { uploadResume, uploadCoverLetter } from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";

// Types
interface FormFieldConfig {
  visible: boolean;
  required: boolean;
}

interface CustomQuestion {
  id: string;
  type: "text" | "yes-no" | "multiple-choice";
  title: string;
  required: boolean;
  description?: string;
  options?: string[];
}

interface JobApplyConfig {
  id: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string | null;
  locationType: string;
  employmentType: string;
  personalDetails: {
    name: FormFieldConfig;
    email: FormFieldConfig;
    dateOfBirth: FormFieldConfig;
    pronouns: FormFieldConfig;
    location: FormFieldConfig;
  };
  careerDetails: {
    currentRole: FormFieldConfig;
    currentCompany: FormFieldConfig;
    yearsExperience: FormFieldConfig;
    linkedIn: FormFieldConfig;
    portfolio: FormFieldConfig;
  };
  requiredFiles: {
    resume: boolean;
    coverLetter: boolean;
    portfolio: boolean;
  };
  questions: CustomQuestion[];
}

type FormData = {
  name: string;
  email: string;
  dateOfBirth?: Date;
  pronouns: string;
  location: string;
  currentRole: string;
  currentCompany: string;
  yearsExperience: string;
  linkedIn: string;
  portfolio: string;
  resumeFile: File | null;
  coverLetterFile: File | null;
  portfolioFile: File | null;
  questionAnswers: Record<string, string>;
};

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  dateOfBirth: undefined,
  pronouns: "",
  location: "",
  currentRole: "",
  currentCompany: "",
  yearsExperience: "",
  linkedIn: "",
  portfolio: "",
  resumeFile: null,
  coverLetterFile: null,
  portfolioFile: null,
  questionAnswers: {},
};

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = params.jobId as string;

  // Check if in preview mode (employer view)
  const isPreviewMode = searchParams.get("preview") === "true";
  const [viewMode, setViewMode] = React.useState<"employer" | "candidate">(
    isPreviewMode ? "employer" : "candidate"
  );

  // Data loading state
  const [jobConfig, setJobConfig] = React.useState<JobApplyConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true);
  const [configError, setConfigError] = React.useState<string | null>(null);
  const [seekerId, setSeekerId] = React.useState<string | null>(null);

  // Form state
  const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  // Fetch job config and seeker profile on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        // Fetch job apply config
        const configRes = await fetch(`/api/jobs/${jobId}/apply-config`);
        if (!configRes.ok) {
          if (configRes.status === 404) {
            setConfigError("This job is no longer accepting applications.");
          } else {
            setConfigError("Failed to load application form.");
          }
          setIsLoadingConfig(false);
          return;
        }
        const { data: config } = await configRes.json();
        setJobConfig(config);

        // Try to load seeker profile for pre-fill (if logged in)
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          try {
            const profileRes = await fetch("/api/profile");
            if (profileRes.ok) {
              const profileData = await profileRes.json();
              const account = profileData.data || profileData;
              setSeekerId(account.seekerProfile?.id ?? null);

              // Pre-fill form with profile data
              setFormData((prev) => ({
                ...prev,
                name: account.name || prev.name,
                email: account.email || prev.email,
                pronouns: account.pronouns || prev.pronouns,
                location: account.location || prev.location,
                linkedIn: account.linkedinUrl || prev.linkedIn,
                portfolio: account.websiteUrl || prev.portfolio,
              }));
            }
          } catch {
            // Profile fetch is optional — continue without pre-fill
          }
        }

        // Restore draft from localStorage
        const savedDraft = localStorage.getItem(`application-draft-${jobId}`);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            resumeFile: null,
            coverLetterFile: null,
            portfolioFile: null,
            dateOfBirth: parsed.dateOfBirth ? new Date(parsed.dateOfBirth) : undefined,
          }));
        }
      } catch {
        setConfigError("Failed to load application form. Please try again.");
      } finally {
        setIsLoadingConfig(false);
      }
    }

    loadData();
  }, [jobId]);

  // Auto-save to localStorage
  React.useEffect(() => {
    if (!jobConfig) return;
    const timer = setTimeout(() => {
      const dataToSave = {
        ...formData,
        resumeFile: null,
        coverLetterFile: null,
        portfolioFile: null,
      };
      localStorage.setItem(`application-draft-${jobId}`, JSON.stringify(dataToSave));
      setLastSaved(new Date());
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, jobId, jobConfig]);

  // Calculate progress
  React.useEffect(() => {
    if (!jobConfig) return;
    let completed = 0;
    let total = 0;

    // Personal info
    if (jobConfig.personalDetails.name.required) {
      total++;
      if (formData.name) completed++;
    }
    if (jobConfig.personalDetails.email.required) {
      total++;
      if (formData.email) completed++;
    }
    if (jobConfig.personalDetails.location.required) {
      total++;
      if (formData.location) completed++;
    }

    // Career details
    if (jobConfig.careerDetails.yearsExperience.required) {
      total++;
      if (formData.yearsExperience) completed++;
    }

    // Required files
    if (jobConfig.requiredFiles.resume) {
      total++;
      if (formData.resumeFile) completed++;
    }
    if (jobConfig.requiredFiles.coverLetter) {
      total++;
      if (formData.coverLetterFile) completed++;
    }

    // Required questions
    jobConfig.questions.forEach((q) => {
      if (q.required) {
        total++;
        if (formData.questionAnswers[q.id]) completed++;
      }
    });

    setProgress(total > 0 ? Math.round((completed / total) * 100) : 0);
  }, [formData, jobConfig]);

  // File upload handlers
  const handleFileUpload =
    (field: keyof Pick<FormData, "resumeFile" | "coverLetterFile" | "portfolioFile">) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData({ ...formData, [field]: file });
      }
    };

  // Validation
  const validateForm = () => {
    if (!jobConfig) return false;
    const newErrors: Record<string, string> = {};

    if (jobConfig.personalDetails.name.required && !formData.name.trim())
      newErrors.name = "Name is required";
    if (jobConfig.personalDetails.email.required && !formData.email.trim())
      newErrors.email = "Email is required";
    if (
      jobConfig.personalDetails.email.required &&
      formData.email &&
      !/^\S+@\S+\.\S+$/.test(formData.email)
    )
      newErrors.email = "Invalid email format";

    if (jobConfig.personalDetails.location.required && !formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (jobConfig.careerDetails.yearsExperience.required && !formData.yearsExperience) {
      newErrors.yearsExperience = "Years of experience is required";
    }

    if (jobConfig.requiredFiles.resume && !formData.resumeFile) {
      newErrors.resumeFile = "Resume is required";
    }
    if (jobConfig.requiredFiles.coverLetter && !formData.coverLetterFile) {
      newErrors.coverLetterFile = "Cover letter is required";
    }

    jobConfig.questions.forEach((q) => {
      if (q.required && !formData.questionAnswers[q.id]) {
        newErrors[`question_${q.id}`] = "This question is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files to Supabase Storage
      let resumeUrl: string | undefined;
      let coverLetterUrl: string | undefined;

      // Use seekerId for file path, or a temp ID if not authenticated
      const fileOwnerId = seekerId || `anon-${jobId}`;

      if (formData.resumeFile) {
        const result = await uploadResume(formData.resumeFile, fileOwnerId);
        if (result.error) {
          setSubmitError("Failed to upload resume. Please try again.");
          setIsSubmitting(false);
          return;
        }
        resumeUrl = result.url;
      }

      if (formData.coverLetterFile) {
        const result = await uploadCoverLetter(formData.coverLetterFile, fileOwnerId);
        if (result.error) {
          setSubmitError("Failed to upload cover letter. Please try again.");
          setIsSubmitting(false);
          return;
        }
        coverLetterUrl = result.url;
      }

      // Submit application
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          name: formData.name,
          email: formData.email,
          phone: undefined,
          dateOfBirth: formData.dateOfBirth?.toISOString(),
          pronouns: formData.pronouns || undefined,
          location: formData.location || undefined,
          currentRole: formData.currentRole || undefined,
          currentCompany: formData.currentCompany || undefined,
          yearsExperience: formData.yearsExperience || undefined,
          linkedIn: formData.linkedIn || undefined,
          portfolio: formData.portfolio || undefined,
          resumeUrl,
          resumeFileName: formData.resumeFile?.name,
          coverLetterUrl,
          coverLetterFileName: formData.coverLetterFile?.name,
          questionAnswers:
            Object.keys(formData.questionAnswers).length > 0 ? formData.questionAnswers : undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 409) {
          setSubmitError("You have already applied to this job.");
        } else if (res.status === 401) {
          setSubmitError("Please sign in to submit your application.");
        } else {
          setSubmitError(errorData.error || "Failed to submit application. Please try again.");
        }
        setIsSubmitting(false);
        return;
      }

      // Clear draft from localStorage
      localStorage.removeItem(`application-draft-${jobId}`);

      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Save draft handler
  const handleSaveDraft = () => {
    const dataToSave = {
      ...formData,
      resumeFile: null,
      coverLetterFile: null,
      portfolioFile: null,
    };
    localStorage.setItem(`application-draft-${jobId}`, JSON.stringify(dataToSave));
    setLastSaved(new Date());
  };

  // Loading state
  if (isLoadingConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--primitive-neutral-100)]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-body text-foreground-muted">Loading application form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (configError || !jobConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--primitive-neutral-100)]">
        <div className="max-w-md rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)] p-12 text-center">
          <WarningCircle
            weight="regular"
            className="mx-auto mb-4 h-12 w-12 text-[var(--foreground-error)]"
          />
          <h1 className="mb-2 text-heading-sm text-foreground">
            {configError || "Application unavailable"}
          </h1>
          <p className="mb-6 text-body text-foreground-muted">
            This job may no longer be accepting applications.
          </p>
          <Button variant="primary" onClick={() => router.push("/jobs/search")}>
            Browse Jobs
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--primitive-neutral-100)]">
        <div className="mx-auto max-w-2xl px-4 py-16">
          <div className="rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)] p-12 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primitive-green-100)]">
              <CheckCircle weight="fill" className="h-10 w-10 text-[var(--primitive-green-600)]" />
            </div>

            <h1 className="mb-3 text-heading-md text-foreground">Application Submitted!</h1>

            <p className="mb-8 text-body text-foreground-muted">
              Thank you for applying to <span className="font-semibold">{jobConfig.title}</span> at{" "}
              {jobConfig.company}. We&apos;ve received your application and will review it shortly.
            </p>

            <div className="mb-8 rounded-xl bg-[var(--primitive-neutral-100)] p-6 text-left">
              <h3 className="mb-3 text-body-strong text-foreground">What&apos;s Next?</h3>
              <ul className="space-y-2 text-body-sm text-foreground-muted">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-[var(--primitive-green-600)]">•</span>
                  <span>You&apos;ll receive a confirmation email within a few minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-[var(--primitive-green-600)]">•</span>
                  <span>Our team will review your application within 5-7 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-[var(--primitive-green-600)]">•</span>
                  <span>We&apos;ll reach out via email with next steps or updates</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                variant="tertiary"
                size="lg"
                leftIcon={<ArrowLeft weight="regular" className="h-5 w-5" />}
                onClick={() => router.push("/jobs/search")}
              >
                Browse Jobs
              </Button>
              <Button variant="primary" size="lg" onClick={() => router.push("/jobs/applications")}>
                View My Applications
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--primitive-neutral-300)] bg-[var(--background-default)]">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-heading-sm text-foreground">{jobConfig.title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-body-sm text-foreground-muted">
                <div className="flex items-center gap-1">
                  <Buildings weight="regular" className="h-4 w-4" />
                  <span>{jobConfig.company}</span>
                </div>
                {jobConfig.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin weight="regular" className="h-4 w-4" />
                      <span>{jobConfig.location}</span>
                    </div>
                  </>
                )}
                <span>•</span>
                <span>{jobConfig.locationType}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-caption text-foreground-muted">
                <Clock weight="regular" className="h-4 w-4" />
                <span>~5 minutes</span>
              </div>
              {lastSaved && (
                <span className="text-caption text-foreground-subtle">
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-caption text-foreground-muted">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--primitive-neutral-200)]">
              <div
                className="h-full bg-[var(--primitive-green-500)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Employer Preview Controls */}
      {isPreviewMode && (
        <div className="border-b border-[var(--primitive-blue-300)] bg-[var(--primitive-blue-100)]">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye weight="fill" className="h-5 w-5 text-[var(--primitive-blue-600)]" />
                <div>
                  <h3 className="text-body-sm font-semibold text-foreground">Preview Mode</h3>
                  <p className="text-caption text-foreground-muted">
                    {viewMode === "employer"
                      ? "Viewing as employer - data is interactive but won't be saved"
                      : "Viewing as candidate - this is exactly what job seekers will see"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <SegmentedController
                  options={[
                    {
                      value: "employer",
                      label: "Employer View",
                      icon: <Pencil weight="regular" />,
                    },
                    { value: "candidate", label: "Candidate View", icon: <Eye weight="regular" /> },
                  ]}
                  value={viewMode}
                  onValueChange={(value) => setViewMode(value as "employer" | "candidate")}
                  className="w-auto"
                />
                <Button variant="tertiary" size="sm" onClick={() => window.close()}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Employer View Info Banner */}
        {isPreviewMode && viewMode === "employer" && (
          <div className="mb-6">
            <Banner
              type="feature"
              subtle
              dismissible={false}
              title="Test the form"
              description="All fields are interactive. Try filling them out to see how candidates will experience your application form. Changes won't be saved."
              className="rounded-xl"
            />
          </div>
        )}

        {/* Submit error */}
        {submitError && (
          <div className="mb-6">
            <Banner
              type="critical"
              dismissible
              onDismiss={() => setSubmitError(null)}
              title="Submission failed"
              description={submitError}
              className="rounded-xl"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info Section */}
          <section className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
            <div className="border-b border-[var(--primitive-neutral-200)] p-6">
              <h2 className="mb-1 text-body-strong text-foreground">Personal Info</h2>
              <p className="text-caption text-foreground-muted">Tell us about yourself</p>
            </div>

            <div className="space-y-4 p-6">
              {/* Name */}
              {jobConfig.personalDetails.name.visible && (
                <div className="space-y-2" data-error={!!errors.name}>
                  <Label>
                    Name{" "}
                    {jobConfig.personalDetails.name.required && (
                      <span className="text-[var(--primitive-red-600)]">*</span>
                    )}
                  </Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    inputSize="lg"
                    className="rounded-xl"
                    error={!!errors.name}
                  />
                  {errors.name && (
                    <p className="text-caption text-[var(--primitive-red-600)]">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email */}
              {jobConfig.personalDetails.email.visible && (
                <div className="space-y-2" data-error={!!errors.email}>
                  <Label>
                    Email{" "}
                    {jobConfig.personalDetails.email.required && (
                      <span className="text-[var(--primitive-red-600)]">*</span>
                    )}
                  </Label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    inputSize="lg"
                    className="rounded-xl"
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-caption text-[var(--primitive-red-600)]">{errors.email}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Date of Birth */}
                {jobConfig.personalDetails.dateOfBirth.visible && (
                  <div className="space-y-2">
                    <Label>
                      Date of Birth
                      {jobConfig.personalDetails.dateOfBirth.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    <DatePicker
                      placeholder="Select date"
                      value={formData.dateOfBirth}
                      onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                      className="rounded-xl"
                    />
                  </div>
                )}

                {/* Pronouns */}
                {jobConfig.personalDetails.pronouns.visible && (
                  <div className="space-y-2">
                    <Label>
                      Pronouns
                      {jobConfig.personalDetails.pronouns.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    <Select
                      value={formData.pronouns}
                      onValueChange={(value) => setFormData({ ...formData, pronouns: value })}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select pronouns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he">He/Him</SelectItem>
                        <SelectItem value="she">She/Her</SelectItem>
                        <SelectItem value="they">They/Them</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Location */}
              {jobConfig.personalDetails.location.visible && (
                <div className="space-y-2" data-error={!!errors.location}>
                  <Label>
                    Location
                    {jobConfig.personalDetails.location.required && (
                      <span className="text-[var(--primitive-red-600)]"> *</span>
                    )}
                  </Label>
                  <Input
                    placeholder="City, State/Province, Country"
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      if (errors.location) setErrors({ ...errors, location: "" });
                    }}
                    inputSize="lg"
                    className="rounded-xl"
                    error={!!errors.location}
                  />
                  {errors.location && (
                    <p className="text-caption text-[var(--primitive-red-600)]">
                      {errors.location}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Career Details Section */}
          <section className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
            <div className="border-b border-[var(--primitive-neutral-200)] p-6">
              <h2 className="mb-1 text-body-strong text-foreground">Career Details</h2>
              <p className="text-caption text-foreground-muted">
                Share your professional background
              </p>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Current Role */}
                {jobConfig.careerDetails.currentRole.visible && (
                  <div className="space-y-2">
                    <Label>
                      Current Role
                      {jobConfig.careerDetails.currentRole.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    <Input
                      placeholder="e.g., Software Engineer"
                      value={formData.currentRole}
                      onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                      inputSize="lg"
                      className="rounded-xl"
                    />
                  </div>
                )}

                {/* Current Company */}
                {jobConfig.careerDetails.currentCompany.visible && (
                  <div className="space-y-2">
                    <Label>
                      Current Company
                      {jobConfig.careerDetails.currentCompany.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    <Input
                      placeholder="e.g., Solaris Energy Co."
                      value={formData.currentCompany}
                      onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                      inputSize="lg"
                      className="rounded-xl"
                    />
                  </div>
                )}

                {/* Years Experience */}
                {jobConfig.careerDetails.yearsExperience.visible && (
                  <div className="space-y-2" data-error={!!errors.yearsExperience}>
                    <Label>
                      Years of Experience
                      {jobConfig.careerDetails.yearsExperience.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    <Select
                      value={formData.yearsExperience}
                      onValueChange={(value) => {
                        setFormData({ ...formData, yearsExperience: value });
                        if (errors.yearsExperience) setErrors({ ...errors, yearsExperience: "" });
                      }}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.yearsExperience && (
                      <p className="text-caption text-[var(--primitive-red-600)]">
                        {errors.yearsExperience}
                      </p>
                    )}
                  </div>
                )}

                {/* LinkedIn */}
                {jobConfig.careerDetails.linkedIn.visible && (
                  <div className="space-y-2">
                    <Label>
                      LinkedIn Profile
                      {jobConfig.careerDetails.linkedIn.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    <Input
                      placeholder="linkedin.com/in/yourprofile"
                      value={formData.linkedIn}
                      onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                      inputSize="lg"
                      className="rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Portfolio */}
              {jobConfig.careerDetails.portfolio.visible && (
                <div className="space-y-2">
                  <Label>
                    Portfolio
                    {jobConfig.careerDetails.portfolio.required && (
                      <span className="text-[var(--primitive-red-600)]"> *</span>
                    )}
                  </Label>
                  <Input
                    placeholder="yourportfolio.com"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    inputSize="lg"
                    className="rounded-xl"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Required Files Section */}
          {(jobConfig.requiredFiles.resume ||
            jobConfig.requiredFiles.coverLetter ||
            jobConfig.requiredFiles.portfolio) && (
            <section className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
              <div className="border-b border-[var(--primitive-neutral-200)] p-6">
                <h2 className="mb-1 text-body-strong text-foreground">Required Files</h2>
                <p className="text-caption text-foreground-muted">Upload the following documents</p>
              </div>

              <div className="space-y-4 p-6">
                {/* Resume */}
                {jobConfig.requiredFiles.resume && (
                  <div className="space-y-2" data-error={!!errors.resumeFile}>
                    <Label>
                      Resume <span className="text-[var(--primitive-red-600)]">*</span>
                    </Label>
                    <label className="block">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload("resumeFile")}
                        className="hidden"
                      />
                      <div
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                          formData.resumeFile
                            ? "border-[var(--primitive-green-500)] bg-[var(--primitive-green-100)]"
                            : errors.resumeFile
                              ? "border-[var(--primitive-red-500)] bg-[var(--primitive-red-100)]"
                              : "border-[var(--primitive-neutral-300)] hover:border-[var(--primitive-neutral-400)]"
                        }`}
                      >
                        {formData.resumeFile ? (
                          <>
                            <CheckCircle
                              weight="fill"
                              className="mx-auto mb-2 h-8 w-8 text-[var(--primitive-green-600)]"
                            />
                            <p className="text-body-sm text-foreground">
                              {formData.resumeFile.name}
                            </p>
                            <p className="text-caption text-foreground-subtle">Click to replace</p>
                          </>
                        ) : (
                          <>
                            <Upload
                              weight="regular"
                              className="mx-auto mb-2 h-8 w-8 text-[var(--primitive-neutral-500)]"
                            />
                            <p className="text-body-sm text-foreground-muted">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-caption text-foreground-subtle">
                              PDF, DOC, DOCX (max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                    {errors.resumeFile && (
                      <p className="text-caption text-[var(--primitive-red-600)]">
                        {errors.resumeFile}
                      </p>
                    )}
                  </div>
                )}

                {/* Cover Letter */}
                {jobConfig.requiredFiles.coverLetter && (
                  <div className="space-y-2" data-error={!!errors.coverLetterFile}>
                    <Label>
                      Cover Letter <span className="text-[var(--primitive-red-600)]">*</span>
                    </Label>
                    <label className="block">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload("coverLetterFile")}
                        className="hidden"
                      />
                      <div
                        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                          formData.coverLetterFile
                            ? "border-[var(--primitive-green-500)] bg-[var(--primitive-green-100)]"
                            : errors.coverLetterFile
                              ? "border-[var(--primitive-red-500)] bg-[var(--primitive-red-100)]"
                              : "border-[var(--primitive-neutral-300)] hover:border-[var(--primitive-neutral-400)]"
                        }`}
                      >
                        {formData.coverLetterFile ? (
                          <>
                            <CheckCircle
                              weight="fill"
                              className="mx-auto mb-2 h-8 w-8 text-[var(--primitive-green-600)]"
                            />
                            <p className="text-body-sm text-foreground">
                              {formData.coverLetterFile.name}
                            </p>
                            <p className="text-caption text-foreground-subtle">Click to replace</p>
                          </>
                        ) : (
                          <>
                            <Upload
                              weight="regular"
                              className="mx-auto mb-2 h-8 w-8 text-[var(--primitive-neutral-500)]"
                            />
                            <p className="text-body-sm text-foreground-muted">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-caption text-foreground-subtle">
                              PDF, DOC, DOCX (max 10MB)
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                    {errors.coverLetterFile && (
                      <p className="text-caption text-[var(--primitive-red-600)]">
                        {errors.coverLetterFile}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Additional Questions Section */}
          {jobConfig.questions.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)]">
              <div className="border-b border-[var(--primitive-neutral-200)] p-6">
                <h2 className="mb-1 text-body-strong text-foreground">Additional Questions</h2>
                <p className="text-caption text-foreground-muted">Help us get to know you better</p>
              </div>

              <div className="space-y-6 p-6">
                {jobConfig.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="space-y-2"
                    data-error={!!errors[`question_${question.id}`]}
                  >
                    <Label>
                      {index + 1}. {question.title}
                      {question.required && (
                        <span className="text-[var(--primitive-red-600)]"> *</span>
                      )}
                    </Label>
                    {question.description && (
                      <p className="mb-2 text-caption text-foreground-muted">
                        {question.description}
                      </p>
                    )}

                    {question.type === "text" && (
                      <>
                        <Input
                          placeholder="Type your answer here..."
                          value={formData.questionAnswers[question.id] || ""}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              questionAnswers: {
                                ...formData.questionAnswers,
                                [question.id]: e.target.value,
                              },
                            });
                            if (errors[`question_${question.id}`]) {
                              const newErrors = { ...errors };
                              delete newErrors[`question_${question.id}`];
                              setErrors(newErrors);
                            }
                          }}
                          inputSize="lg"
                          className="rounded-xl"
                          error={!!errors[`question_${question.id}`]}
                        />
                        {errors[`question_${question.id}`] && (
                          <p className="text-caption text-[var(--primitive-red-600)]">
                            {errors[`question_${question.id}`]}
                          </p>
                        )}
                      </>
                    )}

                    {question.type === "yes-no" && (
                      <>
                        <RadioGroup
                          value={formData.questionAnswers[question.id] || ""}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              questionAnswers: {
                                ...formData.questionAnswers,
                                [question.id]: value,
                              },
                            });
                            if (errors[`question_${question.id}`]) {
                              const newErrors = { ...errors };
                              delete newErrors[`question_${question.id}`];
                              setErrors(newErrors);
                            }
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                            <Label htmlFor={`${question.id}-yes`} className="font-normal">
                              Yes
                            </Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="no" id={`${question.id}-no`} />
                            <Label htmlFor={`${question.id}-no`} className="font-normal">
                              No
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors[`question_${question.id}`] && (
                          <p className="text-caption text-[var(--primitive-red-600)]">
                            {errors[`question_${question.id}`]}
                          </p>
                        )}
                      </>
                    )}

                    {question.type === "multiple-choice" && (
                      <>
                        <RadioGroup
                          value={formData.questionAnswers[question.id] || ""}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              questionAnswers: {
                                ...formData.questionAnswers,
                                [question.id]: value,
                              },
                            });
                            if (errors[`question_${question.id}`]) {
                              const newErrors = { ...errors };
                              delete newErrors[`question_${question.id}`];
                              setErrors(newErrors);
                            }
                          }}
                        >
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                              <Label htmlFor={`${question.id}-${optIndex}`} className="font-normal">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        {errors[`question_${question.id}`] && (
                          <p className="text-caption text-[var(--primitive-red-600)]">
                            {errors[`question_${question.id}`]}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Submit Section */}
          <div className="rounded-2xl border border-[var(--primitive-neutral-300)] bg-[var(--card-background)] p-6">
            <div className="mb-6 flex items-start gap-3">
              <Checkbox id="consent" required />
              <Label htmlFor="consent" className="text-caption font-normal leading-relaxed">
                I certify that the information provided in this application is true and complete. I
                understand that false information may be grounds for not hiring me or for immediate
                termination of employment at any point in the future.
              </Label>
            </div>

            <div className="flex justify-end gap-3">
              {!isPreviewMode && (
                <Button
                  type="button"
                  variant="tertiary"
                  size="lg"
                  leftIcon={<FloppyDisk weight="regular" className="h-5 w-5" />}
                  onClick={handleSaveDraft}
                >
                  Save as Draft
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isSubmitting || isPreviewMode}
              >
                {isPreviewMode
                  ? "Preview Only - Submit Disabled"
                  : isSubmitting
                    ? "Submitting..."
                    : "Submit Application"}
              </Button>
            </div>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-caption text-foreground-muted">
          Powered by <span className="font-semibold">Canopy ATS</span>
        </p>
      </footer>
    </div>
  );
}

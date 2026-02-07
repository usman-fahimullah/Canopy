"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { logger, formatError } from "@/lib/logger";
import type {
  JobData,
  ApplicationData,
  PersonalDetailsConfig,
  CareerDetailsConfig,
  FormQuestion,
} from "./types";
import {
  employmentTypeToForm,
  formToEmploymentType,
  locationTypeToForm,
  formToLocationType,
  experienceLevelToForm,
  formToExperienceLevel,
  usStates,
  countries,
} from "./constants";

// ============================================
// TYPES
// ============================================

export interface OrgMemberOption {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  title: string | null;
}

// ============================================
// RETURN TYPE
// ============================================

export interface JobPostState {
  roleTitle: string;
  setRoleTitle: (v: string) => void;
  jobCategory: string;
  setJobCategory: (v: string) => void;
  positionType: string;
  setPositionType: (v: string) => void;
  experienceLevel: string;
  setExperienceLevel: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  responsibilities: string;
  setResponsibilities: (v: string) => void;
  requiredQuals: string;
  setRequiredQuals: (v: string) => void;
  desiredQuals: string;
  setDesiredQuals: (v: string) => void;
  educationLevel: string;
  setEducationLevel: (v: string) => void;
  educationDetails: string;
  setEducationDetails: (v: string) => void;
  workplaceType: string;
  setWorkplaceType: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  state: string;
  setState: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
  payType: string;
  setPayType: (v: string) => void;
  minPay: string;
  setMinPay: (v: string) => void;
  maxPay: string;
  setMaxPay: (v: string) => void;
  payFrequency: string;
  setPayFrequency: (v: string) => void;
  useCompanyBenefits: boolean;
  setUseCompanyBenefits: (v: boolean) => void;
  selectedBenefits: string[];
  setSelectedBenefits: (v: string[]) => void;
  compensationDetails: string;
  setCompensationDetails: (v: string) => void;
  showRecruiter: boolean;
  setShowRecruiter: (v: boolean) => void;
  recruiterId: string | null;
  setRecruiterId: (v: string | null) => void;
  showHiringManager: boolean;
  setShowHiringManager: (v: boolean) => void;
  hiringManagerId: string | null;
  setHiringManagerId: (v: string | null) => void;
  orgMembers: OrgMemberOption[];
  reviewerIds: string[];
  setReviewerIds: (v: string[]) => void;
  closingDate: Date | undefined;
  setClosingDate: (v: Date | undefined) => void;
  externalLink: string;
  setExternalLink: (v: string) => void;
  requireResume: boolean;
  setRequireResume: (v: boolean) => void;
  requireCoverLetter: boolean;
  setRequireCoverLetter: (v: boolean) => void;
  requirePortfolio: boolean;
  setRequirePortfolio: (v: boolean) => void;
  templateSaved: boolean;
  savingTemplate: boolean;
  handleSaveTemplate: () => Promise<void>;
}

export interface ApplyFormState {
  personalDetails: PersonalDetailsConfig;
  setPersonalDetails: React.Dispatch<React.SetStateAction<PersonalDetailsConfig>>;
  careerDetails: CareerDetailsConfig;
  setCareerDetails: React.Dispatch<React.SetStateAction<CareerDetailsConfig>>;
  questionsEnabled: boolean;
  setQuestionsEnabled: (v: boolean) => void;
  questions: FormQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<FormQuestion[]>>;
}

export interface UseRoleFormReturn {
  // Lifecycle
  loading: boolean;
  saving: boolean;
  fetchError: string | null;
  saveError: string | null;
  setSaveError: (error: string | null) => void;

  // Raw data
  jobData: JobData | null;
  setJobData: React.Dispatch<React.SetStateAction<JobData | null>>;
  applications: ApplicationData[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationData[]>>;
  stageCounts: Record<string, number>;
  totalApplications: number;

  // Grouped state
  jobPostState: JobPostState;
  applyFormState: ApplyFormState;

  // Actions
  handleSaveRole: () => Promise<boolean>;
  handleReviewRole: () => Promise<void>;
  handleCandidateAdded: (app: ApplicationData) => void;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useRoleForm(roleId: string): UseRoleFormReturn {
  const router = useRouter();

  // ---- Data Fetching State ----
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  // ---- Raw API Data ----
  const [jobData, setJobData] = React.useState<JobData | null>(null);
  const [applications, setApplications] = React.useState<ApplicationData[]>([]);
  const [stageCounts, setStageCounts] = React.useState<Record<string, number>>({});
  const [totalApplications, setTotalApplications] = React.useState(0);

  // ---- Job Post Form State ----
  const [roleTitle, setRoleTitle] = React.useState("");
  const [jobCategory, setJobCategory] = React.useState("");
  const [positionType, setPositionType] = React.useState("");
  const [experienceLevel, setExperienceLevel] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [responsibilities, setResponsibilities] = React.useState("");
  const [requiredQuals, setRequiredQuals] = React.useState("");
  const [desiredQuals, setDesiredQuals] = React.useState("");
  const [educationLevel, setEducationLevel] = React.useState("");
  const [educationDetails, setEducationDetails] = React.useState("");
  const [workplaceType, setWorkplaceType] = React.useState("onsite");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [payType, setPayType] = React.useState("salary");
  const [minPay, setMinPay] = React.useState("");
  const [maxPay, setMaxPay] = React.useState("");
  const [payFrequency, setPayFrequency] = React.useState("weekly");
  const [useCompanyBenefits, setUseCompanyBenefits] = React.useState(true);
  const [selectedBenefits, setSelectedBenefits] = React.useState<string[]>([]);
  const [compensationDetails, setCompensationDetails] = React.useState("");
  const [showRecruiter, setShowRecruiter] = React.useState(false);
  const [recruiterId, setRecruiterId] = React.useState<string | null>(null);
  const [showHiringManager, setShowHiringManager] = React.useState(false);
  const [hiringManagerId, setHiringManagerId] = React.useState<string | null>(null);
  const [orgMembers, setOrgMembers] = React.useState<OrgMemberOption[]>([]);
  const [reviewerIds, setReviewerIds] = React.useState<string[]>([]);
  const [closingDate, setClosingDate] = React.useState<Date | undefined>();
  const [externalLink, setExternalLink] = React.useState("");
  const [requireResume, setRequireResume] = React.useState(true);
  const [requireCoverLetter, setRequireCoverLetter] = React.useState(true);
  const [requirePortfolio, setRequirePortfolio] = React.useState(false);
  const [templateSaved, setTemplateSaved] = React.useState(false);
  const [savingTemplate, setSavingTemplate] = React.useState(false);

  // ---- Apply Form State ----
  const [personalDetails, setPersonalDetails] = React.useState<PersonalDetailsConfig>({
    name: { visible: true, required: true },
    email: { visible: true, required: true },
    dateOfBirth: { visible: true, required: false },
    pronouns: { visible: true, required: false },
    location: { visible: true, required: false },
  });

  const [careerDetails, setCareerDetails] = React.useState<CareerDetailsConfig>({
    currentRole: { visible: true, required: false },
    currentCompany: { visible: true, required: false },
    yearsExperience: { visible: true, required: false },
    linkedIn: { visible: true, required: false },
    portfolio: { visible: true, required: false },
  });

  const [questionsEnabled, setQuestionsEnabled] = React.useState(true);
  const [questions, setQuestions] = React.useState<FormQuestion[]>([
    { id: "q1", type: "text", title: "Why are you interested in this role?", required: true },
    {
      id: "q2",
      type: "yes-no",
      title: "Do you have experience with renewable energy projects?",
      required: false,
    },
    {
      id: "q3",
      type: "multiple-choice",
      title: "What is your preferred work style?",
      required: false,
      options: ["Remote", "Hybrid", "On-site"],
    },
  ]);

  // ---- Template Handler ----
  const handleSaveTemplate = React.useCallback(async () => {
    setSavingTemplate(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTemplateSaved(true);
    setSavingTemplate(false);
  }, []);

  // ---- Add Candidate — optimistic update ----
  const handleCandidateAdded = React.useCallback((newApplication: ApplicationData) => {
    setApplications((prev) => [...prev, newApplication]);
    setTotalApplications((prev) => prev + 1);
    setStageCounts((prev) => ({
      ...prev,
      [newApplication.stage]: (prev[newApplication.stage] || 0) + 1,
    }));
  }, []);

  // ---- Fetch Role from API ----
  const fetchRole = React.useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);

      const res = await fetch(`/api/canopy/roles/${roleId}`);
      if (!res.ok) {
        if (res.status === 404) {
          setFetchError("Role not found");
        } else {
          setFetchError("Failed to load role details");
        }
        return;
      }

      const data = await res.json();
      const job = data.job as JobData;

      // Store raw API data
      setJobData(job);
      setApplications(data.applications || []);
      setStageCounts(data.stageCounts || {});
      setTotalApplications(data.totalApplications || 0);

      // Map DB values → form state
      if (job.title) setRoleTitle(job.title);
      if (job.climateCategory) setJobCategory(job.climateCategory);
      if (job.employmentType) {
        setPositionType(employmentTypeToForm[job.employmentType] || "");
      }
      if (job.experienceLevel) {
        setExperienceLevel(experienceLevelToForm[job.experienceLevel] || "");
      }
      if (job.location) {
        const parts = job.location.split(", ");
        if (parts[0]) setCity(parts[0]);
        if (parts[1]) {
          const stateMatch = usStates.find(
            (s) =>
              s.label.toLowerCase() === parts[1].toLowerCase() || s.value === parts[1].toLowerCase()
          );
          if (stateMatch) setState(stateMatch.value);
        }
        if (parts[2]) {
          const countryMatch = countries.find(
            (c) =>
              c.label.toLowerCase() === parts[2].toLowerCase() || c.value === parts[2].toLowerCase()
          );
          if (countryMatch) setCountry(countryMatch.value);
        }
      }
      if (job.locationType) {
        setWorkplaceType(locationTypeToForm[job.locationType] || "onsite");
      }
      if (job.salaryMin) setMinPay(String(job.salaryMin));
      if (job.salaryMax) setMaxPay(String(job.salaryMax));
      if (job.closesAt) setClosingDate(new Date(job.closesAt));

      // Initialize apply form config from DB
      if (job.formConfig) {
        const fc = job.formConfig as Record<string, unknown>;
        const personalDeets = fc.personalDetails as
          | Record<string, { visible: boolean; required: boolean }>
          | undefined;
        const careerDeets = fc.careerDetails as
          | Record<string, { visible: boolean; required: boolean }>
          | undefined;

        if (personalDeets) {
          setPersonalDetails((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(personalDeets).map(([k, v]) => [
                k,
                { visible: v.visible, required: v.required },
              ])
            ),
          }));
        }
        if (careerDeets) {
          setCareerDetails((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(careerDeets).map(([k, v]) => [
                k,
                { visible: v.visible, required: v.required },
              ])
            ),
          }));
        }

        // Restore structured description fields
        const structured = fc.structuredDescription as
          | {
              description?: string;
              responsibilities?: string;
              requiredQuals?: string;
              desiredQuals?: string;
            }
          | undefined;
        if (structured) {
          if (structured.description) setDescription(structured.description);
          if (structured.responsibilities) setResponsibilities(structured.responsibilities);
          if (structured.requiredQuals) setRequiredQuals(structured.requiredQuals);
          if (structured.desiredQuals) setDesiredQuals(structured.desiredQuals);
        } else if (job.description) {
          // Fallback: if no structured data stored yet, put full description in the main field
          setDescription(job.description);
        }

        // Restore additional form fields
        const requiredFiles = fc.requiredFiles as
          | { resume?: boolean; coverLetter?: boolean; portfolio?: boolean }
          | undefined;
        if (requiredFiles) {
          if (requiredFiles.resume !== undefined) setRequireResume(requiredFiles.resume);
          if (requiredFiles.coverLetter !== undefined)
            setRequireCoverLetter(requiredFiles.coverLetter);
          if (requiredFiles.portfolio !== undefined) setRequirePortfolio(requiredFiles.portfolio);
        }
        if (typeof fc.educationLevel === "string") setEducationLevel(fc.educationLevel);
        if (typeof fc.educationDetails === "string") setEducationDetails(fc.educationDetails);
        if (typeof fc.payType === "string") setPayType(fc.payType);
        if (typeof fc.payFrequency === "string") setPayFrequency(fc.payFrequency);
        if (Array.isArray(fc.selectedBenefits))
          setSelectedBenefits(fc.selectedBenefits as string[]);
        if (typeof fc.compensationDetails === "string")
          setCompensationDetails(fc.compensationDetails);
        if (typeof fc.showRecruiter === "boolean") setShowRecruiter(fc.showRecruiter);
        if (typeof fc.showHiringManager === "boolean") setShowHiringManager(fc.showHiringManager);
        if (typeof fc.externalLink === "string") setExternalLink(fc.externalLink);
      } else if (job.description) {
        // No formConfig at all — use the raw description
        setDescription(job.description);
      }

      // Read team assignment from top-level job fields (proper FK columns)
      // Falls back to formConfig for backward compat with un-migrated data
      if (job.recruiterId) {
        setRecruiterId(job.recruiterId);
      } else if (job.formConfig) {
        const fc = job.formConfig as Record<string, unknown>;
        if (typeof fc.recruiterId === "string") setRecruiterId(fc.recruiterId);
      }

      if (job.hiringManagerId) {
        setHiringManagerId(job.hiringManagerId);
      } else if (job.formConfig) {
        const fc = job.formConfig as Record<string, unknown>;
        if (typeof fc.hiringManagerId === "string") setHiringManagerId(fc.hiringManagerId);
      }

      // Load reviewer assignments from the assignments endpoint
      if (job.reviewerAssignments && Array.isArray(job.reviewerAssignments)) {
        setReviewerIds(job.reviewerAssignments.map((a: { member: { id: string } }) => a.member.id));
      }

      if (job.formQuestions && Array.isArray(job.formQuestions) && job.formQuestions.length > 0) {
        setQuestions(job.formQuestions);
      }
    } catch (err) {
      logger.error("Error fetching role detail", { error: formatError(err) });
      setFetchError("Failed to load role details");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId]);

  React.useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  // ---- Fetch org members for recruiter/hiring manager pickers ----
  React.useEffect(() => {
    fetch("/api/canopy/members")
      .then((res) => (res.ok ? res.json() : { members: [] }))
      .then((data: { members?: OrgMemberOption[] }) => setOrgMembers(data.members ?? []))
      .catch(() => setOrgMembers([]));
  }, []);

  // ---- Compose full description from structured fields ----
  const composeFullDescription = React.useCallback((): string => {
    const sections: string[] = [];

    if (description) {
      sections.push(description);
    }

    if (responsibilities) {
      sections.push(`<h3>Primary Responsibilities</h3>${responsibilities}`);
    }

    if (requiredQuals) {
      sections.push(`<h3>Required Qualifications</h3>${requiredQuals}`);
    }

    if (desiredQuals) {
      sections.push(`<h3>Desired Qualifications</h3>${desiredQuals}`);
    }

    return sections.join("\n") || "";
  }, [description, responsibilities, requiredQuals, desiredQuals]);

  // ---- Save Handler — PATCH role to API ----
  const handleSaveRole = React.useCallback(async (): Promise<boolean> => {
    setSaving(true);
    setSaveError(null);

    try {
      // Build location string from parts
      const locationParts = [city, state, country].filter(Boolean);
      const locationString = locationParts.length > 0 ? locationParts.join(", ") : null;

      // Compose the full description from structured fields
      const fullDescription = composeFullDescription();

      const payload: Record<string, unknown> = {
        title: roleTitle || undefined,
        description: fullDescription || undefined,
        location: locationString,
        locationType: formToLocationType[workplaceType] || "ONSITE",
        employmentType: formToEmploymentType[positionType] || undefined,
        climateCategory: jobCategory || null,
        experienceLevel: formToExperienceLevel[experienceLevel] || null,
        salaryMin: minPay ? Number(minPay) : null,
        salaryMax: maxPay ? Number(maxPay) : null,
        salaryCurrency: "USD",
        requiredCerts: educationLevel && educationLevel !== "none" ? [educationLevel] : [],
        closesAt: closingDate ? closingDate.toISOString() : null,
        // Team assignment — top-level fields (proper FK columns)
        recruiterId: recruiterId || null,
        hiringManagerId: hiringManagerId || null,
        formConfig: {
          personalDetails,
          careerDetails,
          requiredFiles: {
            resume: requireResume,
            coverLetter: requireCoverLetter,
            portfolio: requirePortfolio,
          },
          // Store structured description sections so we can decompose on load
          structuredDescription: {
            description,
            responsibilities,
            requiredQuals,
            desiredQuals,
          },
          // Store additional form fields not in the DB schema
          educationLevel,
          educationDetails,
          payType,
          payFrequency,
          selectedBenefits,
          compensationDetails,
          showRecruiter,
          showHiringManager,
          externalLink,
        },
        formQuestions: questionsEnabled ? questions : [],
      };

      // Remove undefined values
      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) delete payload[key];
      });

      const res = await fetch(`/api/canopy/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save role");
      }

      // Sync reviewer assignments via separate endpoint
      const assignRes = await fetch(`/api/canopy/roles/${roleId}/assignments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewerIds }),
      });
      if (!assignRes.ok) {
        logger.warn("Failed to sync reviewer assignments", { roleId });
      }

      // Update local jobData to reflect changes
      if (jobData) {
        setJobData({
          ...jobData,
          title: roleTitle || jobData.title,
          description: fullDescription || jobData.description,
          location: locationString,
          locationType: formToLocationType[workplaceType] || jobData.locationType,
          employmentType: formToEmploymentType[positionType] || jobData.employmentType,
          climateCategory: jobCategory || null,
          salaryMin: minPay ? Number(minPay) : null,
          salaryMax: maxPay ? Number(maxPay) : null,
          closesAt: closingDate ? closingDate.toISOString() : null,
        });
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save role";
      logger.error("Error saving role", { error: formatError(err) });
      setSaveError(message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [
    roleId,
    roleTitle,
    description,
    responsibilities,
    requiredQuals,
    desiredQuals,
    composeFullDescription,
    city,
    state,
    country,
    workplaceType,
    positionType,
    jobCategory,
    experienceLevel,
    educationLevel,
    educationDetails,
    minPay,
    maxPay,
    payType,
    payFrequency,
    selectedBenefits,
    compensationDetails,
    showRecruiter,
    recruiterId,
    showHiringManager,
    hiringManagerId,
    reviewerIds,
    externalLink,
    requireResume,
    requireCoverLetter,
    requirePortfolio,
    closingDate,
    personalDetails,
    careerDetails,
    questionsEnabled,
    questions,
    jobData,
  ]);

  // ---- Review Role — Save draft then navigate ----
  const handleReviewRole = React.useCallback(async () => {
    const saved = await handleSaveRole();
    if (saved) {
      router.push(`/canopy/roles/${roleId}/review`);
    }
  }, [handleSaveRole, router, roleId]);

  // ---- Build grouped state objects ----
  const jobPostState: JobPostState = React.useMemo(
    () => ({
      roleTitle,
      setRoleTitle,
      jobCategory,
      setJobCategory,
      positionType,
      setPositionType,
      experienceLevel,
      setExperienceLevel,
      description,
      setDescription,
      responsibilities,
      setResponsibilities,
      requiredQuals,
      setRequiredQuals,
      desiredQuals,
      setDesiredQuals,
      educationLevel,
      setEducationLevel,
      educationDetails,
      setEducationDetails,
      workplaceType,
      setWorkplaceType,
      city,
      setCity,
      state,
      setState,
      country,
      setCountry,
      payType,
      setPayType,
      minPay,
      setMinPay,
      maxPay,
      setMaxPay,
      payFrequency,
      setPayFrequency,
      useCompanyBenefits,
      setUseCompanyBenefits,
      selectedBenefits,
      setSelectedBenefits,
      compensationDetails,
      setCompensationDetails,
      showRecruiter,
      setShowRecruiter,
      recruiterId,
      setRecruiterId,
      showHiringManager,
      setShowHiringManager,
      hiringManagerId,
      setHiringManagerId,
      orgMembers,
      reviewerIds,
      setReviewerIds,
      closingDate,
      setClosingDate,
      externalLink,
      setExternalLink,
      requireResume,
      setRequireResume,
      requireCoverLetter,
      setRequireCoverLetter,
      requirePortfolio,
      setRequirePortfolio,
      templateSaved,
      savingTemplate,
      handleSaveTemplate,
    }),
    // We intentionally include all values so downstream components re-render on changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      roleTitle,
      jobCategory,
      positionType,
      experienceLevel,
      description,
      responsibilities,
      requiredQuals,
      desiredQuals,
      educationLevel,
      educationDetails,
      workplaceType,
      city,
      state,
      country,
      payType,
      minPay,
      maxPay,
      payFrequency,
      useCompanyBenefits,
      selectedBenefits,
      compensationDetails,
      showRecruiter,
      recruiterId,
      showHiringManager,
      hiringManagerId,
      orgMembers,
      reviewerIds,
      closingDate,
      externalLink,
      requireResume,
      requireCoverLetter,
      requirePortfolio,
      templateSaved,
      savingTemplate,
      handleSaveTemplate,
    ]
  );

  const applyFormState: ApplyFormState = React.useMemo(
    () => ({
      personalDetails,
      setPersonalDetails,
      careerDetails,
      setCareerDetails,
      questionsEnabled,
      setQuestionsEnabled,
      questions,
      setQuestions,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [personalDetails, careerDetails, questionsEnabled, questions]
  );

  return {
    loading,
    saving,
    fetchError,
    saveError,
    setSaveError,
    jobData,
    setJobData,
    applications,
    setApplications,
    stageCounts,
    totalApplications,
    jobPostState,
    applyFormState,
    handleSaveRole,
    handleReviewRole,
    handleCandidateAdded,
  };
}

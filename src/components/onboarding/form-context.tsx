"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Shell } from "@/lib/onboarding/types";

// ─── Form data types per shell ────────────────────────────────────

export interface BaseProfileData {
  firstName: string;
  lastName: string;
  linkedinUrl: string;
  bio: string;
}

export interface TalentFormData {
  careerStage: string | null;
  yearsExperience: string | null;
  jobTitle: string;
  skills: string[];
  sectors: string[];
  roleTypes: string[];
  transitionTimeline: string | null;
  locationPreference: string | null;
  salaryMin: string;
  salaryMax: string;
}

export interface CoachFormData {
  headline: string;
  bio: string;
  yearsInClimate: string | null;
  sectors: string[];
  expertise: string[];
  sessionTypes: string[];
  sessionRate: number;
  availability: string | null;
}

export interface EmployerFormData {
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  companyLocation: string;
  companySize: string | null;
  userTitle: string;
}

// ─── Initial values ───────────────────────────────────────────────

const INITIAL_BASE: BaseProfileData = {
  firstName: "",
  lastName: "",
  linkedinUrl: "",
  bio: "",
};

const INITIAL_TALENT: TalentFormData = {
  careerStage: null,
  yearsExperience: null,
  jobTitle: "",
  skills: [],
  sectors: [],
  roleTypes: [],
  transitionTimeline: null,
  locationPreference: null,
  salaryMin: "",
  salaryMax: "",
};

const INITIAL_COACH: CoachFormData = {
  headline: "",
  bio: "",
  yearsInClimate: null,
  sectors: [],
  expertise: [],
  sessionTypes: [],
  sessionRate: 15000,
  availability: null,
};

const INITIAL_EMPLOYER: EmployerFormData = {
  companyName: "",
  companyDescription: "",
  companyWebsite: "",
  companyLocation: "",
  companySize: null,
  userTitle: "",
};

// ─── Context shape ────────────────────────────────────────────────

interface OnboardingFormContextValue {
  baseProfile: BaseProfileData;
  setBaseProfile: (data: Partial<BaseProfileData>) => void;

  talentData: TalentFormData;
  setTalentData: (data: Partial<TalentFormData>) => void;

  coachData: CoachFormData;
  setCoachData: (data: Partial<CoachFormData>) => void;

  employerData: EmployerFormData;
  setEmployerData: (data: Partial<EmployerFormData>) => void;

  /** Clear all persisted data (call after successful submission) */
  clearAll: () => void;
}

const OnboardingFormContext = createContext<OnboardingFormContextValue>({
  baseProfile: INITIAL_BASE,
  setBaseProfile: () => {},
  talentData: INITIAL_TALENT,
  setTalentData: () => {},
  coachData: INITIAL_COACH,
  setCoachData: () => {},
  employerData: INITIAL_EMPLOYER,
  setEmployerData: () => {},
  clearAll: () => {},
});

// ─── Storage helpers ──────────────────────────────────────────────

const STORAGE_KEY = "onboarding-form-data";

interface StoredFormData {
  baseProfile: BaseProfileData;
  talent: TalentFormData;
  coach: CoachFormData;
  employer: EmployerFormData;
}

function loadFromStorage(): StoredFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(data: StoredFormData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Silently fail — localStorage might be full or disabled
  }
}

function clearStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

// ─── Provider ─────────────────────────────────────────────────────

interface OnboardingFormProviderProps {
  children: ReactNode;
}

export function OnboardingFormProvider({ children }: OnboardingFormProviderProps) {
  const [baseProfile, setBaseProfileState] = useState<BaseProfileData>(INITIAL_BASE);
  const [talentData, setTalentDataState] = useState<TalentFormData>(INITIAL_TALENT);
  const [coachData, setCoachDataState] = useState<CoachFormData>(INITIAL_COACH);
  const [employerData, setEmployerDataState] = useState<EmployerFormData>(INITIAL_EMPLOYER);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      setBaseProfileState(stored.baseProfile);
      setTalentDataState(stored.talent);
      setCoachDataState(stored.coach);
      setEmployerDataState(stored.employer);
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes (after initial hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage({
      baseProfile,
      talent: talentData,
      coach: coachData,
      employer: employerData,
    });
  }, [hydrated, baseProfile, talentData, coachData, employerData]);

  const setBaseProfile = useCallback((data: Partial<BaseProfileData>) => {
    setBaseProfileState((prev) => ({ ...prev, ...data }));
  }, []);

  const setTalentData = useCallback((data: Partial<TalentFormData>) => {
    setTalentDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setCoachData = useCallback((data: Partial<CoachFormData>) => {
    setCoachDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const setEmployerData = useCallback((data: Partial<EmployerFormData>) => {
    setEmployerDataState((prev) => ({ ...prev, ...data }));
  }, []);

  const clearAll = useCallback(() => {
    setBaseProfileState(INITIAL_BASE);
    setTalentDataState(INITIAL_TALENT);
    setCoachDataState(INITIAL_COACH);
    setEmployerDataState(INITIAL_EMPLOYER);
    clearStorage();
  }, []);

  return (
    <OnboardingFormContext.Provider
      value={{
        baseProfile,
        setBaseProfile,
        talentData,
        setTalentData,
        coachData,
        setCoachData,
        employerData,
        setEmployerData,
        clearAll,
      }}
    >
      {children}
    </OnboardingFormContext.Provider>
  );
}

export function useOnboardingForm() {
  return useContext(OnboardingFormContext);
}

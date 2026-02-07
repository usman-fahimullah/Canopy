// ============================================
// CONSTANTS — Role Edit Page
// ============================================

export const jobCategories = [
  { value: "software-engineering", label: "Software Engineering" },
  { value: "supply-chain", label: "Supply Chain" },
  { value: "administration", label: "People, Administration, HR, & Recruitment" },
  { value: "advocacy-policy", label: "Advocacy & Policy" },
  { value: "climate-sustainability", label: "Climate & Sustainability" },
  { value: "investment", label: "Investment" },
  { value: "sales", label: "Sales & Account Management" },
  { value: "content", label: "Content" },
  { value: "marketing-design", label: "Marketing & Design" },
  { value: "product", label: "Product" },
  { value: "data", label: "Data" },
  { value: "education", label: "Education" },
  { value: "finance-compliance", label: "Finance, Legal, & Compliance" },
  { value: "operations", label: "Operations, Program/Project Management & Strategy" },
  { value: "science", label: "Science" },
];

export const positionTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
];

export const experienceLevels = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead / Principal" },
  { value: "executive", label: "Executive" },
];

export const educationLevels = [
  { value: "none", label: "No Requirement" },
  { value: "high-school", label: "High School Diploma" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (PhD)" },
];

export const payTypes = [
  { value: "salary", label: "Salary" },
  { value: "hourly", label: "Hourly" },
  { value: "commission", label: "Commission" },
];

export const countries = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "de", label: "Germany" },
  { value: "au", label: "Australia" },
  { value: "remote", label: "Remote (Worldwide)" },
];

export const usStates = [
  { value: "ca", label: "California" },
  { value: "ny", label: "New York" },
  { value: "tx", label: "Texas" },
  { value: "wa", label: "Washington" },
  { value: "co", label: "Colorado" },
  { value: "ma", label: "Massachusetts" },
];

// Enum mapping helpers: DB enums → form values
export const employmentTypeToForm: Record<string, string> = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
};

export const formToEmploymentType: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACT",
  internship: "INTERNSHIP",
};

export const locationTypeToForm: Record<string, string> = {
  ONSITE: "onsite",
  REMOTE: "remote",
  HYBRID: "hybrid",
};

export const formToLocationType: Record<string, string> = {
  onsite: "ONSITE",
  remote: "REMOTE",
  hybrid: "HYBRID",
};

// Experience level mapping: DB enum → form value
export const experienceLevelToForm: Record<string, string> = {
  ENTRY: "entry",
  INTERMEDIATE: "mid",
  SENIOR: "senior",
  EXECUTIVE: "executive",
};

// Experience level mapping: form value → DB enum
export const formToExperienceLevel: Record<string, string> = {
  entry: "ENTRY",
  mid: "INTERMEDIATE",
  senior: "SENIOR",
  lead: "SENIOR",
  executive: "EXECUTIVE",
};

export const defaultStages = [
  { id: "applied", name: "Applied" },
  { id: "screening", name: "Screening" },
  { id: "qualified", name: "Qualified" },
  { id: "interview", name: "Interview" },
  { id: "offer", name: "Offer" },
  { id: "hired", name: "Hired" },
];

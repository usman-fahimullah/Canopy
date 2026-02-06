// ============================================
// CONSTANTS — Role Edit Page
// ============================================

export const jobCategories = [
  { value: "renewable-energy", label: "Renewable Energy" },
  { value: "sustainability", label: "Sustainability" },
  { value: "climate-tech", label: "Climate Tech" },
  { value: "conservation", label: "Conservation" },
  { value: "clean-transportation", label: "Clean Transportation" },
  { value: "circular-economy", label: "Circular Economy" },
  { value: "green-building", label: "Green Building" },
  { value: "environmental-policy", label: "Environmental Policy" },
  { value: "other", label: "Other" },
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

export const defaultStages = [
  { id: "applied", name: "Applied" },
  { id: "screening", name: "Screening" },
  { id: "interview", name: "Interview" },
  { id: "offer", name: "Offer" },
  { id: "hired", name: "Hired" },
];

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
  { value: "volunteer", label: "Volunteer" },
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
  { value: "vocational", label: "Vocational / Trade School" },
  { value: "professional", label: "Professional Degree" },
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
  VOLUNTEER: "volunteer",
};

export const formToEmploymentType: Record<string, string> = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACT",
  internship: "INTERNSHIP",
  temporary: "CONTRACT",
  volunteer: "VOLUNTEER",
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

// Education level mapping: DB enum → form value
export const educationLevelToForm: Record<string, string> = {
  NONE: "none",
  HIGH_SCHOOL: "high-school",
  ASSOCIATE: "associate",
  BACHELOR: "bachelor",
  MASTER: "master",
  DOCTORATE: "doctorate",
  VOCATIONAL: "vocational",
  PROFESSIONAL: "professional",
};

// Education level mapping: form value → DB enum
export const formToEducationLevel: Record<string, string> = {
  none: "NONE",
  "high-school": "HIGH_SCHOOL",
  associate: "ASSOCIATE",
  bachelor: "BACHELOR",
  master: "MASTER",
  doctorate: "DOCTORATE",
  vocational: "VOCATIONAL",
  professional: "PROFESSIONAL",
};

// Salary period mapping: DB enum → form value
export const salaryPeriodToForm: Record<string, string> = {
  ANNUAL: "salary",
  HOURLY: "hourly",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

// Salary period mapping: form value → DB enum
export const formToSalaryPeriod: Record<string, string> = {
  salary: "ANNUAL",
  hourly: "HOURLY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  commission: "ANNUAL", // fallback
};

// ============================================
// CLIMATE-SPECIFIC OPTIONS
// ============================================

export const greenSkillsOptions = [
  { value: "renewable-energy", label: "Renewable Energy" },
  { value: "solar-pv-design", label: "Solar PV System Design" },
  { value: "wind-energy", label: "Wind Energy" },
  { value: "energy-storage", label: "Energy Storage" },
  { value: "energy-auditing", label: "Energy Auditing" },
  { value: "carbon-accounting", label: "Carbon Accounting" },
  { value: "carbon-capture", label: "Carbon Capture & Storage" },
  { value: "lifecycle-assessment", label: "Life Cycle Assessment (LCA)" },
  { value: "esg-reporting", label: "ESG Reporting" },
  { value: "esg-strategy", label: "ESG Strategy" },
  { value: "circular-economy", label: "Circular Economy" },
  { value: "waste-reduction", label: "Waste Reduction & Diversion" },
  { value: "water-management", label: "Water Management" },
  { value: "sustainable-supply-chain", label: "Sustainable Supply Chain" },
  { value: "green-building-design", label: "Green Building Design" },
  { value: "environmental-compliance", label: "Environmental Compliance" },
  { value: "environmental-impact-assessment", label: "Environmental Impact Assessment" },
  { value: "climate-risk-analysis", label: "Climate Risk Analysis" },
  { value: "clean-transportation", label: "Clean Transportation" },
  { value: "ev-infrastructure", label: "EV Infrastructure" },
  { value: "biodiversity-conservation", label: "Biodiversity Conservation" },
  { value: "sustainable-agriculture", label: "Sustainable Agriculture" },
  { value: "climate-policy", label: "Climate Policy & Advocacy" },
  { value: "green-finance", label: "Green Finance & Impact Investing" },
  { value: "clean-tech", label: "Clean Technology" },
  { value: "sustainability-consulting", label: "Sustainability Consulting" },
  { value: "environmental-remediation", label: "Environmental Remediation" },
  { value: "climate-modeling", label: "Climate Modeling" },
];

export const certificationsOptions = [
  { value: "LEED", label: "LEED (Leadership in Energy & Environmental Design)" },
  { value: "NABCEP", label: "NABCEP (North American Board of Certified Energy Practitioners)" },
  { value: "B-Corp", label: "B Corp Certification" },
  { value: "PMP", label: "PMP (Project Management Professional)" },
  { value: "CEM", label: "CEM (Certified Energy Manager)" },
  { value: "WELL-AP", label: "WELL AP (WELL Accredited Professional)" },
  { value: "ISSP", label: "ISSP (International Society of Sustainability Professionals)" },
  { value: "GRI", label: "GRI (Global Reporting Initiative) Certified" },
  { value: "CDP", label: "CDP (Carbon Disclosure Project) Reporter" },
  { value: "PEER", label: "PEER (Performance Excellence in Electricity Renewal)" },
  { value: "TRUE", label: "TRUE (Total Resource Use & Efficiency) Zero Waste" },
  { value: "FSC", label: "FSC (Forest Stewardship Council)" },
  { value: "ISO-14001", label: "ISO 14001 (Environmental Management)" },
  { value: "ISO-50001", label: "ISO 50001 (Energy Management)" },
  { value: "OSHA-30", label: "OSHA 30-Hour Safety" },
  { value: "PE", label: "PE (Professional Engineer)" },
  { value: "CPESC", label: "CPESC (Certified Professional in Erosion & Sediment Control)" },
  { value: "AWS", label: "Alliance for Water Stewardship" },
  { value: "Envision-SP", label: "Envision Sustainability Professional" },
];

export const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD (C$)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "CHF", label: "CHF (Fr)" },
  { value: "INR", label: "INR (₹)" },
];

export const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AUD: "A$",
  CHF: "Fr",
  INR: "₹",
};

export const defaultStages = [
  { id: "applied", name: "Applied", phaseGroup: "applied" as const },
  { id: "screening", name: "Screening", phaseGroup: "review" as const },
  { id: "qualified", name: "Qualified", phaseGroup: "review" as const },
  { id: "interview", name: "Interview", phaseGroup: "interview" as const },
  { id: "offer", name: "Offer", phaseGroup: "offer" as const },
  { id: "hired", name: "Hired", phaseGroup: "hired" as const },
];

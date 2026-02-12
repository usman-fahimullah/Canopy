/**
 * Pre-built climate job templates.
 *
 * These ship with the product so new customers have ready-to-use
 * role templates for common climate/sustainability positions.
 */

type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "VOLUNTEER";
type ExperienceLevel = "ENTRY" | "INTERMEDIATE" | "SENIOR" | "EXECUTIVE";

export interface ClimateTemplate {
  id: string;
  name: string;
  title: string;
  description: string;
  climateCategory: string;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  greenSkills: string[];
  requiredCerts: string[];
  impactDescription: string;
  suggestedStages: { id: string; name: string; phaseGroup: string }[];
}

export const CLIMATE_TEMPLATES: ClimateTemplate[] = [
  {
    id: "tpl-solar-installer",
    name: "Solar Installation Technician",
    title: "Solar Installation Technician",
    description:
      "<p>We are looking for a skilled Solar Installation Technician to join our team. In this role, you will be responsible for installing, maintaining, and repairing solar panel systems on residential and commercial properties.</p>" +
      "<h3>What you'll do</h3><ul><li>Install solar PV systems on rooftops and ground-mount structures</li><li>Perform site assessments and determine optimal panel placement</li><li>Wire solar panels, inverters, and electrical systems according to code</li><li>Conduct system testing, commissioning, and troubleshooting</li><li>Maintain detailed installation documentation and safety records</li></ul>" +
      "<h3>Required Qualifications</h3><ul><li>2+ years experience in solar PV installation</li><li>Knowledge of NEC electrical codes and local building codes</li><li>Comfortable working at heights and in outdoor conditions</li><li>Valid driver's license</li></ul>",
    climateCategory: "renewable-energy",
    employmentType: "FULL_TIME",
    experienceLevel: "INTERMEDIATE",
    greenSkills: ["solar-pv-design", "renewable-energy", "energy-auditing"],
    requiredCerts: ["NABCEP", "OSHA-30"],
    impactDescription:
      "Each system you install offsets approximately 4-8 tons of CO2 annually, directly accelerating the transition to clean energy.",
    suggestedStages: [
      { id: "applied", name: "Applied", phaseGroup: "applied" },
      { id: "phone-screen", name: "Phone Screen", phaseGroup: "review" },
      { id: "skills-test", name: "Skills Assessment", phaseGroup: "review" },
      { id: "onsite-interview", name: "On-site Interview", phaseGroup: "interview" },
      { id: "offer", name: "Offer", phaseGroup: "offer" },
      { id: "hired", name: "Hired", phaseGroup: "hired" },
    ],
  },
  {
    id: "tpl-esg-analyst",
    name: "ESG Analyst",
    title: "ESG Analyst",
    description:
      "<p>We are seeking an ESG Analyst to support our sustainability reporting and environmental, social, and governance strategy. You will collect, analyze, and report on ESG metrics to help drive data-informed sustainability decisions.</p>" +
      "<h3>What you'll do</h3><ul><li>Collect and analyze ESG data across the organization</li><li>Prepare sustainability reports aligned with GRI, SASB, and TCFD frameworks</li><li>Monitor regulatory developments and assess compliance implications</li><li>Support carbon footprint calculations and climate risk assessments</li><li>Collaborate with cross-functional teams to improve ESG performance</li></ul>" +
      "<h3>Required Qualifications</h3><ul><li>Bachelor's degree in sustainability, environmental science, finance, or related field</li><li>1-3 years experience in ESG analysis, sustainability reporting, or related role</li><li>Familiarity with ESG frameworks (GRI, SASB, TCFD, CDP)</li><li>Strong analytical and data visualization skills</li></ul>",
    climateCategory: "climate-sustainability",
    employmentType: "FULL_TIME",
    experienceLevel: "INTERMEDIATE",
    greenSkills: ["esg-reporting", "esg-strategy", "carbon-accounting", "climate-risk-analysis"],
    requiredCerts: ["GRI", "CDP"],
    impactDescription:
      "Your analysis will guide corporate sustainability strategy, helping reduce our environmental footprint and improve transparency for stakeholders.",
    suggestedStages: [
      { id: "applied", name: "Applied", phaseGroup: "applied" },
      { id: "screening", name: "Resume Review", phaseGroup: "review" },
      { id: "case-study", name: "Case Study", phaseGroup: "review" },
      { id: "interview", name: "Interview", phaseGroup: "interview" },
      { id: "final-round", name: "Final Round", phaseGroup: "interview" },
      { id: "offer", name: "Offer", phaseGroup: "offer" },
      { id: "hired", name: "Hired", phaseGroup: "hired" },
    ],
  },
  {
    id: "tpl-sustainability-manager",
    name: "Sustainability Manager",
    title: "Sustainability Manager",
    description:
      "<p>We are looking for a Sustainability Manager to lead our environmental sustainability initiatives. You will develop and execute sustainability strategy, manage reporting, and drive operational improvements to reduce our environmental impact.</p>" +
      "<h3>What you'll do</h3><ul><li>Develop and implement the company's sustainability strategy and roadmap</li><li>Lead carbon reduction, waste diversion, and resource efficiency programs</li><li>Manage sustainability reporting (annual reports, CDP, B Corp assessments)</li><li>Engage stakeholders across departments to embed sustainability into operations</li><li>Track and report on KPIs, targets, and progress toward sustainability goals</li></ul>" +
      "<h3>Required Qualifications</h3><ul><li>5+ years experience in sustainability, environmental management, or CSR</li><li>Proven track record of implementing sustainability programs</li><li>Knowledge of carbon accounting methodologies (GHG Protocol)</li><li>Experience with sustainability frameworks and certifications</li></ul>",
    climateCategory: "climate-sustainability",
    employmentType: "FULL_TIME",
    experienceLevel: "SENIOR",
    greenSkills: [
      "carbon-accounting",
      "esg-reporting",
      "lifecycle-assessment",
      "sustainability-consulting",
      "waste-reduction",
    ],
    requiredCerts: ["B-Corp", "ISSP", "GRI"],
    impactDescription:
      "You will shape the company's environmental strategy, driving measurable reductions in carbon emissions and waste across our operations.",
    suggestedStages: [
      { id: "applied", name: "Applied", phaseGroup: "applied" },
      { id: "screening", name: "Screening", phaseGroup: "review" },
      { id: "interview-1", name: "First Interview", phaseGroup: "interview" },
      { id: "interview-2", name: "Leadership Interview", phaseGroup: "interview" },
      { id: "offer", name: "Offer", phaseGroup: "offer" },
      { id: "hired", name: "Hired", phaseGroup: "hired" },
    ],
  },
  {
    id: "tpl-green-building-engineer",
    name: "Green Building Engineer",
    title: "Green Building Engineer",
    description:
      "<p>Join our team as a Green Building Engineer to design and certify high-performance, sustainable buildings. You will work on LEED and WELL projects from concept through certification.</p>" +
      "<h3>What you'll do</h3><ul><li>Design energy-efficient HVAC, lighting, and envelope systems</li><li>Lead LEED and WELL certification processes</li><li>Conduct energy modeling and daylight analysis</li><li>Collaborate with architects and contractors on sustainable design solutions</li><li>Evaluate building materials for environmental impact and performance</li></ul>" +
      "<h3>Required Qualifications</h3><ul><li>Bachelor's degree in mechanical, civil, or architectural engineering</li><li>3+ years experience in green building design or sustainability consulting</li><li>LEED AP credential required</li><li>Proficiency in energy modeling software (eQUEST, EnergyPlus, or similar)</li></ul>",
    climateCategory: "renewable-energy",
    employmentType: "FULL_TIME",
    experienceLevel: "INTERMEDIATE",
    greenSkills: ["green-building-design", "energy-auditing", "lifecycle-assessment"],
    requiredCerts: ["LEED", "WELL-AP", "PE"],
    impactDescription:
      "Your designs will create buildings that consume 30-50% less energy than conventional construction, significantly reducing lifetime carbon emissions.",
    suggestedStages: [
      { id: "applied", name: "Applied", phaseGroup: "applied" },
      { id: "portfolio-review", name: "Portfolio Review", phaseGroup: "review" },
      { id: "technical-interview", name: "Technical Interview", phaseGroup: "interview" },
      { id: "team-fit", name: "Team Fit Interview", phaseGroup: "interview" },
      { id: "offer", name: "Offer", phaseGroup: "offer" },
      { id: "hired", name: "Hired", phaseGroup: "hired" },
    ],
  },
  {
    id: "tpl-ev-infrastructure-specialist",
    name: "EV Infrastructure Specialist",
    title: "EV Charging Infrastructure Specialist",
    description:
      "<p>We are hiring an EV Charging Infrastructure Specialist to plan, deploy, and manage electric vehicle charging networks. You will play a key role in expanding EV charging access.</p>" +
      "<h3>What you'll do</h3><ul><li>Plan and design EV charging station deployments for commercial and public sites</li><li>Manage relationships with site hosts, utilities, and equipment vendors</li><li>Oversee installation projects from permitting through commissioning</li><li>Analyze charging network performance data to optimize utilization</li><li>Support grant applications and incentive program compliance</li></ul>" +
      "<h3>Required Qualifications</h3><ul><li>2+ years experience in EV charging, electrical infrastructure, or clean transportation</li><li>Understanding of electrical systems, utility interconnection, and permitting</li><li>Project management experience with multiple concurrent deployments</li><li>Knowledge of EV charging standards (OCPP, J1772, CCS, NACS)</li></ul>",
    climateCategory: "renewable-energy",
    employmentType: "FULL_TIME",
    experienceLevel: "INTERMEDIATE",
    greenSkills: ["ev-infrastructure", "clean-transportation", "renewable-energy"],
    requiredCerts: ["PMP"],
    impactDescription:
      "Every charging station you deploy enables hundreds of drivers to switch from gasoline to electric, reducing transportation emissions in your community.",
    suggestedStages: [
      { id: "applied", name: "Applied", phaseGroup: "applied" },
      { id: "screening", name: "Screening", phaseGroup: "review" },
      { id: "interview", name: "Interview", phaseGroup: "interview" },
      { id: "offer", name: "Offer", phaseGroup: "offer" },
      { id: "hired", name: "Hired", phaseGroup: "hired" },
    ],
  },
  {
    id: "tpl-climate-policy-analyst",
    name: "Climate Policy Analyst",
    title: "Climate Policy Analyst",
    description:
      "<p>We are seeking a Climate Policy Analyst to research, analyze, and advocate for climate legislation and regulation. You will translate complex policy into actionable insights for our organization and partners.</p>" +
      "<h3>What you'll do</h3><ul><li>Monitor and analyze federal, state, and local climate and energy policy developments</li><li>Draft policy briefs, white papers, and comment letters</li><li>Model the impact of proposed regulations on emissions and markets</li><li>Support coalition building and stakeholder engagement</li><li>Represent the organization at hearings, conferences, and working groups</li></ul>" +
      "<h3>Required Qualifications</h3><ul><li>Master's degree in public policy, environmental studies, or related field</li><li>2-4 years experience in climate or energy policy analysis</li><li>Strong writing and communication skills</li><li>Understanding of carbon markets, renewable energy policy, and environmental regulation</li></ul>",
    climateCategory: "advocacy-policy",
    employmentType: "FULL_TIME",
    experienceLevel: "INTERMEDIATE",
    greenSkills: ["climate-policy", "climate-risk-analysis", "carbon-accounting"],
    requiredCerts: [],
    impactDescription:
      "Your policy research will shape legislation that accelerates the clean energy transition and protects communities from climate impacts.",
    suggestedStages: [
      { id: "applied", name: "Applied", phaseGroup: "applied" },
      { id: "writing-sample", name: "Writing Sample Review", phaseGroup: "review" },
      { id: "interview", name: "Panel Interview", phaseGroup: "interview" },
      { id: "offer", name: "Offer", phaseGroup: "offer" },
      { id: "hired", name: "Hired", phaseGroup: "hired" },
    ],
  },
];

/**
 * Lookup a pre-built climate template by ID.
 */
export function getClimateTemplate(id: string): ClimateTemplate | undefined {
  return CLIMATE_TEMPLATES.find((t) => t.id === id);
}

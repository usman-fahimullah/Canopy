import {
  PrismaClient,
  JobStatus,
  LocationType,
  EmploymentType,
  OrgMemberRole,
  Recommendation,
  MentorshipStatus,
  CoachingStatus,
  GoalStatus,
  NoteCategory,
  ExperienceLevel,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data (reverse order of creation due to foreign keys)
  await prisma.score.deleteMany();
  await prisma.note.deleteMany();
  await prisma.application.deleteMany();
  await prisma.coachAssignment.deleteMany();
  await prisma.mentorAssignment.deleteMany();

  // Clean Job Seeker Portal data
  await prisma.jobNoteSave.deleteMany();
  await prisma.jobNote.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.workExperience.deleteMany();
  await prisma.collectionJob.deleteMany();
  await prisma.collection.deleteMany();

  await prisma.coachProfile.deleteMany();
  await prisma.seekerProfile.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.job.deleteMany();
  await prisma.pathway.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.account.deleteMany();

  console.log("  Cleaned existing data\n");

  // ============ ORGANIZATIONS ============

  const solarisEnergy = await prisma.organization.create({
    data: {
      name: "Solaris Energy Co.",
      slug: "solaris-energy",
      logo: null,
      primaryColor: "#0F766E",
      fontFamily: "DM Sans",
    },
  });

  const auroraClimate = await prisma.organization.create({
    data: {
      name: "Aurora Climate",
      slug: "aurora-climate",
      logo: null,
      primaryColor: "#0D9488",
      fontFamily: "DM Sans",
    },
  });

  console.log("  Organizations: %s, %s", solarisEnergy.name, auroraClimate.name);

  // ============ PATHWAYS ============
  // Career pathway categories matching design system PathwayTag component
  // Colors reference CSS variables: --primitive-{color}-200 for bg, --primitive-{color}-700 for text

  // GREEN family pathways
  const agriculturePathway = await prisma.pathway.create({
    data: {
      name: "Agriculture",
      slug: "agriculture",
      description: "Sustainable farming, regenerative agriculture, food systems, and agricultural technology roles focused on climate-smart practices.",
      icon: "Carrot", // Phosphor: Agriculture -> Carrot
      color: "green",
      displayOrder: 1,
      isActive: true,
    },
  });

  const financePathway = await prisma.pathway.create({
    data: {
      name: "Finance",
      slug: "finance",
      description: "ESG investing, carbon markets, green bonds, climate risk assessment, and sustainable finance positions.",
      icon: "ChartLineUp",
      color: "green",
      displayOrder: 2,
      isActive: true,
    },
  });

  const forestryPathway = await prisma.pathway.create({
    data: {
      name: "Forestry",
      slug: "forestry",
      description: "Forest management, reforestation, carbon sequestration, and sustainable timber positions.",
      icon: "Tree",
      color: "green",
      displayOrder: 3,
      isActive: true,
    },
  });

  const transportationPathway = await prisma.pathway.create({
    data: {
      name: "Transportation",
      slug: "transportation",
      description: "Electric vehicles, public transit, sustainable logistics, and clean mobility solutions.",
      icon: "Train",
      color: "green",
      displayOrder: 4,
      isActive: true,
    },
  });

  const wasteManagementPathway = await prisma.pathway.create({
    data: {
      name: "Waste Management",
      slug: "waste-management",
      description: "Recycling, composting, circular economy, waste reduction, and sustainable materials management.",
      icon: "Recycle",
      color: "green",
      displayOrder: 5,
      isActive: true,
    },
  });

  // BLUE family pathways
  const conservationPathway = await prisma.pathway.create({
    data: {
      name: "Conservation",
      slug: "conservation",
      description: "Wildlife protection, land preservation, ecosystem restoration, and natural resource management positions.",
      icon: "Mountains",
      color: "blue",
      displayOrder: 6,
      isActive: true,
    },
  });

  const researchPathway = await prisma.pathway.create({
    data: {
      name: "Research",
      slug: "research",
      description: "Climate science, environmental research, data analysis, and academic positions.",
      icon: "Flask",
      color: "blue",
      displayOrder: 7,
      isActive: true,
    },
  });

  const sportsPathway = await prisma.pathway.create({
    data: {
      name: "Sports",
      slug: "sports",
      description: "Sustainable sports facilities, eco-friendly events, and green athletics management.",
      icon: "Basketball",
      color: "blue",
      displayOrder: 8,
      isActive: true,
    },
  });

  const waterPathway = await prisma.pathway.create({
    data: {
      name: "Water",
      slug: "water",
      description: "Water conservation, treatment, ocean preservation, and aquatic ecosystem management.",
      icon: "Drop",
      color: "blue",
      displayOrder: 9,
      isActive: true,
    },
  });

  // ORANGE family pathways
  const constructionPathway = await prisma.pathway.create({
    data: {
      name: "Construction",
      slug: "construction",
      description: "Green building, sustainable infrastructure, LEED certification, and energy-efficient construction.",
      icon: "HardHat",
      color: "orange",
      displayOrder: 10,
      isActive: true,
    },
  });

  const manufacturingPathway = await prisma.pathway.create({
    data: {
      name: "Manufacturing",
      slug: "manufacturing",
      description: "Sustainable manufacturing, clean production, and eco-friendly industrial processes.",
      icon: "Factory",
      color: "orange",
      displayOrder: 11,
      isActive: true,
    },
  });

  const realEstatePathway = await prisma.pathway.create({
    data: {
      name: "Real Estate",
      slug: "real-estate",
      description: "Green real estate development, sustainable property management, and eco-friendly buildings.",
      icon: "Buildings",
      color: "orange",
      displayOrder: 12,
      isActive: true,
    },
  });

  const urbanPlanningPathway = await prisma.pathway.create({
    data: {
      name: "Urban Planning",
      slug: "urban-planning",
      description: "Sustainable city planning, smart cities, green urban development, and climate adaptation.",
      icon: "MapTrifold",
      color: "orange",
      displayOrder: 13,
      isActive: true,
    },
  });

  // RED/PINK family pathways
  const educationPathway = await prisma.pathway.create({
    data: {
      name: "Education",
      slug: "education",
      description: "Environmental education, sustainability training, climate communication, and academic positions.",
      icon: "GraduationCap",
      color: "red",
      displayOrder: 14,
      isActive: true,
    },
  });

  const medicalPathway = await prisma.pathway.create({
    data: {
      name: "Medical",
      slug: "medical",
      description: "Environmental health, climate medicine, sustainable healthcare, and public health.",
      icon: "FirstAidKit",
      color: "red",
      displayOrder: 15,
      isActive: true,
    },
  });

  const tourismPathway = await prisma.pathway.create({
    data: {
      name: "Tourism",
      slug: "tourism",
      description: "Sustainable tourism, ecotourism, responsible travel, and conservation tourism.",
      icon: "Compass",
      color: "red",
      displayOrder: 16,
      isActive: true,
    },
  });

  // YELLOW family pathways
  const energyPathway = await prisma.pathway.create({
    data: {
      name: "Energy",
      slug: "energy",
      description: "Renewable energy, clean technology, grid modernization, energy storage, and decarbonization roles.",
      icon: "Lightning",
      color: "yellow",
      displayOrder: 17,
      isActive: true,
    },
  });

  const technologyPathway = await prisma.pathway.create({
    data: {
      name: "Technology",
      slug: "technology",
      description: "Climate tech, sustainability software, environmental monitoring, and green IT.",
      icon: "Circuitry",
      color: "yellow",
      displayOrder: 18,
      isActive: true,
    },
  });

  // PURPLE family pathways
  const artsCulturePathway = await prisma.pathway.create({
    data: {
      name: "Arts & Culture",
      slug: "arts-culture",
      description: "Environmental art, climate communication, sustainable media, and cultural sustainability.",
      icon: "Palette",
      color: "purple",
      displayOrder: 19,
      isActive: true,
    },
  });

  const mediaPathway = await prisma.pathway.create({
    data: {
      name: "Media",
      slug: "media",
      description: "Climate journalism, environmental communications, and sustainability storytelling.",
      icon: "Broadcast",
      color: "purple",
      displayOrder: 20,
      isActive: true,
    },
  });

  const policyPathway = await prisma.pathway.create({
    data: {
      name: "Policy",
      slug: "policy",
      description: "Climate policy, environmental law, government relations, and nonprofit advocacy roles.",
      icon: "Scales",
      color: "purple",
      displayOrder: 21,
      isActive: true,
    },
  });

  console.log("  Pathways: 21 created (matching design system PathwayTag component)");

  // ============ ACCOUNTS ============
  // Every authenticated person gets an Account (maps 1:1 to Clerk)

  // Employer accounts
  const jordanAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_admin_001",
      email: "jordan@canopy.co",
      name: "Jordan Rivera",
      location: "Austin, TX",
      timezone: "America/Chicago",
    },
  });

  const alexAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_recruiter_001",
      email: "alex@canopy.co",
      name: "Alex Chen",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
    },
  });

  const samAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_hm_001",
      email: "sam@canopy.co",
      name: "Sam Patel",
      location: "Austin, TX",
      timezone: "America/Chicago",
    },
  });

  const morganAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_aurora_admin",
      email: "morgan@aurora-climate.canopy.co",
      name: "Morgan Walsh",
      location: "Denver, CO",
      timezone: "America/Denver",
    },
  });

  // Seeker accounts
  const mayaAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_seeker_001",
      email: "maya.thompson@canopy.co",
      name: "Maya Thompson",
      phone: "+1-555-0101",
      location: "Austin, TX",
      timezone: "America/Chicago",
    },
  });

  const ryanAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_seeker_002",
      email: "ryan.oconnor@canopy.co",
      name: "Ryan O'Connor",
      phone: "+1-555-0102",
      location: "Denver, CO",
      timezone: "America/Denver",
    },
  });

  const priyaAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_seeker_003",
      email: "priya.sharma@canopy.co",
      name: "Priya Sharma",
      phone: "+1-555-0103",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
    },
  });

  const carlosAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_seeker_004",
      email: "carlos.mendez@canopy.co",
      name: "Carlos Mendez",
      phone: "+1-555-0104",
      location: "Portland, OR",
      timezone: "America/Los_Angeles",
    },
  });

  // Elena is both a seeker AND a coach (dual role)
  const elenaAccount = await prisma.account.create({
    data: {
      supabaseId: "clerk_seed_seeker_005",
      email: "elena.volkov@canopy.co",
      name: "Elena Volkov",
      phone: "+1-555-0105",
      location: "New York, NY",
      timezone: "America/New_York",
      bio: "Finance professional with growing ESG specialization. Also coaching job seekers transitioning into climate finance.",
    },
  });

  console.log("  Accounts: 9 created (4 employer, 5 seeker)");

  // ============ ORGANIZATION MEMBERS ============

  const jordanMember = await prisma.organizationMember.create({
    data: {
      accountId: jordanAccount.id,
      organizationId: solarisEnergy.id,
      role: OrgMemberRole.OWNER,
      title: "CEO",
    },
  });

  const alexMember = await prisma.organizationMember.create({
    data: {
      accountId: alexAccount.id,
      organizationId: solarisEnergy.id,
      role: OrgMemberRole.RECRUITER,
      title: "Senior Recruiter",
    },
  });

  const samMember = await prisma.organizationMember.create({
    data: {
      accountId: samAccount.id,
      organizationId: solarisEnergy.id,
      role: OrgMemberRole.MEMBER,
      title: "Hiring Manager",
    },
  });

  const morganMember = await prisma.organizationMember.create({
    data: {
      accountId: morganAccount.id,
      organizationId: auroraClimate.id,
      role: OrgMemberRole.OWNER,
      title: "Founder & CEO",
    },
  });

  console.log("  Org Members: 4 (1 owner, 1 recruiter, 1 member, 1 owner)");

  // ============ SEEKER PROFILES ============

  const mayaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: mayaAccount.id,
      linkedinUrl: "https://linkedin.com/in/mayathompson",
      headline: "Senior Solar Engineer | NABCEP Certified | 8 Years in Commercial PV",
      skills: ["Project Management", "AutoCAD", "Electrical Engineering", "Team Leadership"],
      greenSkills: ["Solar PV Design", "NABCEP Certified", "Energy Storage Systems"],
      certifications: ["NABCEP PV Installation Professional", "PMP", "OSHA 30"],
      yearsExperience: 8,
      aiSummary:
        "Experienced solar engineer with 8 years in commercial PV installations. NABCEP certified with strong project management background. Excellent match for senior technical roles.",
      targetSectors: ["clean-energy", "climate-tech"],
    },
  });

  const ryanSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: ryanAccount.id,
      linkedinUrl: "https://linkedin.com/in/ryanoconnor",
      headline: "Data Analyst | ESG Enthusiast | GRI Certified",
      skills: ["Python", "SQL", "Tableau", "Statistical Analysis", "Data Visualization"],
      greenSkills: ["GHG Protocol", "CDP Reporting", "SASB Standards"],
      certifications: ["GRI Certified Sustainability Professional"],
      yearsExperience: 4,
      aiSummary:
        "Data analyst transitioning into ESG space with strong quantitative skills and sustainability certification. Good fit for ESG data analyst roles.",
      targetSectors: ["corporate-sustainability", "finance"],
    },
  });

  const priyaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: priyaAccount.id,
      linkedinUrl: "https://linkedin.com/in/priyasharma",
      headline: "Full-Stack Engineer | Climate Tech | Carbon Tracking",
      skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
      greenSkills: ["Carbon Accounting Platforms", "Climate Data APIs"],
      certifications: [],
      yearsExperience: 6,
      aiSummary:
        "Full-stack engineer with 6 years of experience and a growing focus on climate tech. Currently building carbon tracking tools. Strong technical foundation.",
      targetSectors: ["climate-tech"],
    },
  });

  // Carlos is a seeker AND a peer mentor (pro-bono)
  const carlosSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: carlosAccount.id,
      linkedinUrl: "https://linkedin.com/in/carlosmendez",
      headline: "Solar Technician | Aspiring Senior Engineer",
      skills: ["Solar Installation", "Electrical Wiring", "Safety Compliance"],
      greenSkills: ["Solar PV Installation", "Battery Storage"],
      certifications: ["OSHA 30", "CPR/First Aid"],
      yearsExperience: 3,
      aiSummary:
        "Junior solar technician with 3 years of hands-on installation experience. Eager to grow into a senior role. Solid safety record.",
      targetSectors: ["clean-energy"],
      // Mentorship fields
      isMentor: true,
      mentorBio:
        "I know the hands-on side of solar installation inside and out. Happy to help anyone breaking into the field with practical advice and resume tips.",
      mentorTopics: ["Solar Installation Basics", "Safety Certifications", "Field Work Tips"],
    },
  });

  // Elena is a seeker AND a coach (dual role — professional coaching)
  const elenaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: elenaAccount.id,
      linkedinUrl: "https://linkedin.com/in/elenavolkov",
      headline: "Climate Finance Analyst | CFA Candidate | SASB Credentialed",
      skills: ["Financial Analysis", "ESG Integration", "Risk Assessment", "Excel"],
      greenSkills: ["TCFD Reporting", "Climate Risk Assessment", "Green Bond Frameworks"],
      certifications: ["CFA Level II", "SASB FSA Credential"],
      yearsExperience: 5,
      aiSummary:
        "Finance professional with growing ESG specialization. CFA candidate with SASB credential. Strong quantitative and analytical skills for sustainability reporting.",
      targetSectors: ["finance", "corporate-sustainability"],
    },
  });

  console.log("  Seeker Profiles: 5 (Carlos is also a mentor, Elena is also a coach)");

  // ============ COACH PROFILES ============

  const elenaCoach = await prisma.coachProfile.create({
    data: {
      accountId: elenaAccount.id,
      headline: "Climate Finance Career Coach",
      expertise: ["Climate Finance", "ESG Careers", "CFA Preparation", "Career Transitions"],
      sectors: ["finance", "corporate-sustainability"],
      sessionTypes: ["coaching", "resume-review", "career-planning"],
      hourlyRate: 12000, // $120 in cents
      monthlyRate: 35000, // $350 in cents
      rating: 4.7,
      reviewCount: 14,
      successStories: 6,
      isActive: true,
      isFeatured: false,
    },
  });

  console.log("  Coach Profiles: 1 (Elena Volkov)");

  // ============ JOBS ============

  const solarEngineerJob = await prisma.job.create({
    data: {
      title: "Senior Solar Installation Engineer",
      slug: "senior-solar-installation-engineer",
      description:
        "Lead the design and installation of commercial-scale solar photovoltaic systems. You will oversee a team of installation technicians, manage project timelines, and ensure compliance with local building codes and NEC standards. This role combines hands-on technical work with project leadership in our mission to accelerate clean energy adoption.",
      location: "Austin, TX",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 95000,
      salaryMax: 130000,
      salaryCurrency: "USD",
      climateCategory: "Renewable Energy",
      impactDescription:
        "Your work will directly contribute to deploying 50+ MW of solar capacity annually, offsetting approximately 35,000 tons of CO2 per year.",
      requiredCerts: ["NABCEP PV Installation Professional", "OSHA 30"],
      greenSkills: ["Solar PV Design", "Energy Storage", "Grid Integration", "Project Management"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-15"),
      closesAt: new Date("2025-03-15"),
      stages: JSON.stringify([
        { id: "applied", name: "Applied" },
        { id: "screening", name: "Phone Screen" },
        { id: "technical", name: "Technical Interview" },
        { id: "onsite", name: "On-Site Visit" },
        { id: "offer", name: "Offer" },
        { id: "hired", name: "Hired" },
      ]),
      organizationId: solarisEnergy.id,
      // Job Seeker Portal fields
      pathwayId: energyPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: true,
    },
  });

  const esgAnalystJob = await prisma.job.create({
    data: {
      title: "ESG Data Analyst",
      slug: "esg-data-analyst",
      description:
        "Analyze environmental, social, and governance data to support our sustainability reporting and strategic decision-making. Build dashboards, automate data collection pipelines, and translate complex sustainability metrics into actionable insights for leadership.",
      location: "Remote",
      locationType: LocationType.REMOTE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 75000,
      salaryMax: 100000,
      salaryCurrency: "USD",
      climateCategory: "ESG & Sustainability",
      impactDescription:
        "Help organizations measure and reduce their environmental footprint through data-driven sustainability strategies.",
      requiredCerts: [],
      greenSkills: ["ESG Reporting", "GHG Protocol", "TCFD", "Sustainability Metrics", "Data Analysis"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-20"),
      closesAt: new Date("2025-04-01"),
      organizationId: solarisEnergy.id,
      // Job Seeker Portal fields
      pathwayId: financePathway.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      isFeatured: true,
    },
  });

  const climateEngineerJob = await prisma.job.create({
    data: {
      title: "Climate Software Engineer",
      slug: "climate-software-engineer",
      description:
        "Build the technology platform powering next-generation carbon accounting and climate risk assessment. Work with climate scientists and engineers to develop scalable systems that help organizations understand and reduce their environmental impact.",
      location: "San Francisco, CA",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 120000,
      salaryMax: 165000,
      salaryCurrency: "USD",
      climateCategory: "Climate Tech",
      impactDescription:
        "Our platform helps enterprises track and reduce over 2 million tons of CO2 emissions annually.",
      requiredCerts: [],
      greenSkills: ["Carbon Accounting", "Climate Modeling", "Full-Stack Development"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-10"),
      organizationId: auroraClimate.id,
      // Job Seeker Portal fields
      pathwayId: energyPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: true,
    },
  });

  const circularEconomyJob = await prisma.job.create({
    data: {
      title: "Circular Economy Program Manager",
      slug: "circular-economy-program-manager",
      description:
        "Design and implement circular economy initiatives across our supply chain. Partner with vendors, logistics teams, and product designers to minimize waste and maximize material recovery.",
      location: "Portland, OR",
      locationType: LocationType.ONSITE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 85000,
      salaryMax: 115000,
      climateCategory: "Circular Economy",
      impactDescription: "Drive our goal of achieving zero-waste operations by 2030.",
      requiredCerts: ["LEED Green Associate"],
      greenSkills: ["Circular Economy", "Supply Chain Sustainability", "Waste Reduction"],
      status: JobStatus.DRAFT,
      organizationId: solarisEnergy.id,
      // Job Seeker Portal fields
      pathwayId: constructionPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: false,
    },
  });

  // Add more jobs to populate pathways
  const conservationJob = await prisma.job.create({
    data: {
      title: "Conservation Crew Corpsmember",
      slug: "conservation-crew-corpsmember",
      description:
        "Join our conservation corps to restore ecosystems, maintain trails, and protect natural habitats. This hands-on role offers training in ecological restoration while making a direct impact on land conservation.",
      location: "Denver, CO",
      locationType: LocationType.ONSITE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 35000,
      salaryMax: 45000,
      climateCategory: "Conservation",
      impactDescription: "Restore over 500 acres of natural habitat annually.",
      requiredCerts: [],
      greenSkills: ["Trail Maintenance", "Ecological Restoration", "Wildlife Monitoring"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-22"),
      organizationId: auroraClimate.id,
      pathwayId: conservationPathway.id,
      experienceLevel: ExperienceLevel.ENTRY,
      isFeatured: true,
    },
  });

  const policyAnalystJob = await prisma.job.create({
    data: {
      title: "Policy Analyst I",
      slug: "policy-analyst-i",
      description:
        "Research and analyze climate policy proposals at the state and federal level. Support advocacy campaigns with data-driven insights and policy recommendations.",
      location: "Washington, DC",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 65000,
      salaryMax: 80000,
      climateCategory: "Policy & Advocacy",
      impactDescription: "Shape policies that will reduce emissions across entire industries.",
      requiredCerts: [],
      greenSkills: ["Policy Analysis", "Climate Legislation", "Stakeholder Engagement"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-18"),
      organizationId: auroraClimate.id,
      pathwayId: policyPathway.id,
      experienceLevel: ExperienceLevel.ENTRY,
      isFeatured: true,
    },
  });

  // Add more jobs to showcase pathway variety
  const waterEngineerJob = await prisma.job.create({
    data: {
      title: "Water Resources Engineer",
      slug: "water-resources-engineer",
      description:
        "Design and implement sustainable water management solutions including stormwater systems, watershed restoration, and water treatment facilities.",
      location: "Seattle, WA",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 85000,
      salaryMax: 110000,
      climateCategory: "Water Resources",
      impactDescription: "Protect and restore critical watersheds serving over 1 million residents.",
      requiredCerts: ["PE License"],
      greenSkills: ["Hydrology", "Watershed Management", "Water Quality"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-20"),
      organizationId: auroraClimate.id,
      pathwayId: waterPathway.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      isFeatured: false,
    },
  });

  const sustainableFarmerJob = await prisma.job.create({
    data: {
      title: "Regenerative Agriculture Manager",
      slug: "regenerative-agriculture-manager",
      description:
        "Lead our regenerative farming operations, implementing carbon sequestration practices, cover cropping, and soil health programs.",
      location: "Davis, CA",
      locationType: LocationType.ONSITE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 65000,
      salaryMax: 85000,
      climateCategory: "Agriculture",
      impactDescription: "Sequester 500+ tons of carbon annually through regenerative practices.",
      requiredCerts: [],
      greenSkills: ["Regenerative Agriculture", "Soil Health", "Carbon Farming"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-19"),
      organizationId: solarisEnergy.id,
      pathwayId: agriculturePathway.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      isFeatured: true,
    },
  });

  const climateResearcherJob = await prisma.job.create({
    data: {
      title: "Climate Data Scientist",
      slug: "climate-data-scientist",
      description:
        "Analyze climate datasets, develop predictive models, and support research on climate adaptation strategies using machine learning.",
      location: "Remote",
      locationType: LocationType.REMOTE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 95000,
      salaryMax: 130000,
      climateCategory: "Research",
      impactDescription: "Advance climate science that informs global policy decisions.",
      requiredCerts: [],
      greenSkills: ["Climate Modeling", "Data Science", "Python", "Machine Learning"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-21"),
      organizationId: auroraClimate.id,
      pathwayId: researchPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: true,
    },
  });

  console.log("  Jobs: 9 (8 published, 1 draft)");

  // ============ APPLICATIONS ============

  const app1 = await prisma.application.create({
    data: {
      seekerId: mayaSeeker.id,
      jobId: solarEngineerJob.id,
      stage: "technical",
      stageOrder: 0,
      matchScore: 92,
      matchReasons: JSON.stringify({
        strengths: [
          "NABCEP PV Installation Professional certified (required)",
          "8 years of commercial solar experience",
          "OSHA 30 certified (required)",
          "Strong project management background",
        ],
        gaps: ["No explicit grid integration experience listed"],
        overallAssessment:
          "Excellent match. Meets all required certifications and exceeds experience requirements.",
      }),
      source: "Green Jobs Board",
      coverLetter:
        "I am passionate about accelerating clean energy adoption and believe my 8 years of experience in commercial solar installation makes me an ideal fit for this role...",
    },
  });

  const app2 = await prisma.application.create({
    data: {
      seekerId: ryanSeeker.id,
      jobId: esgAnalystJob.id,
      stage: "screening",
      stageOrder: 0,
      matchScore: 78,
      matchReasons: JSON.stringify({
        strengths: [
          "Strong data analysis skills (Python, SQL, Tableau)",
          "GHG Protocol knowledge",
          "GRI certification",
        ],
        gaps: [
          "Limited direct ESG reporting experience",
          "No TCFD experience mentioned",
        ],
        overallAssessment:
          "Good match with strong analytical foundation. Some ESG-specific skill gaps that could be addressed through training.",
      }),
      source: "LinkedIn",
    },
  });

  await prisma.application.create({
    data: {
      seekerId: carlosSeeker.id,
      jobId: solarEngineerJob.id,
      stage: "applied",
      stageOrder: 1,
      matchScore: 45,
      matchReasons: JSON.stringify({
        strengths: [
          "Hands-on solar installation experience",
          "OSHA 30 certified",
          "Demonstrated growth trajectory",
        ],
        gaps: [
          "Only 3 years experience (role requires 5+)",
          "Missing NABCEP certification (required)",
          "No project management experience",
        ],
        overallAssessment:
          "Below threshold for senior role. May be a good fit for mid-level positions.",
      }),
      source: "Referral",
    },
  });

  await prisma.application.create({
    data: {
      seekerId: elenaSeeker.id,
      jobId: esgAnalystJob.id,
      stage: "screening",
      stageOrder: 1,
      matchScore: 85,
      matchReasons: JSON.stringify({
        strengths: [
          "TCFD reporting experience",
          "SASB FSA credential",
          "5 years in financial analysis with ESG focus",
          "Strong quantitative skills",
        ],
        gaps: ["Less hands-on with data visualization tools"],
        overallAssessment:
          "Strong match. ESG credentials and financial analysis background align well with role requirements.",
      }),
      source: "Green Jobs Board",
    },
  });

  await prisma.application.create({
    data: {
      seekerId: priyaSeeker.id,
      jobId: climateEngineerJob.id,
      stage: "screening",
      stageOrder: 0,
      matchScore: 88,
      matchReasons: JSON.stringify({
        strengths: [
          "6 years full-stack engineering experience",
          "TypeScript/React/Node.js stack matches",
          "Already working on carbon tracking tools",
          "PostgreSQL and AWS experience",
        ],
        gaps: ["No formal climate science background"],
        overallAssessment:
          "Excellent technical match with relevant climate tech experience. Strong candidate.",
      }),
      source: "Green Jobs Board",
    },
  });

  console.log("  Applications: 5 created");

  // ============ MENTOR ASSIGNMENTS ============
  // Carlos (mentor, seeker with isMentor=true) is mentoring Ryan (mentee)

  await prisma.mentorAssignment.create({
    data: {
      mentorId: carlosSeeker.id,
      menteeId: ryanSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes: "Carlos is helping Ryan understand the practical side of renewable energy field work to complement his data skills.",
    },
  });

  console.log("  Mentor Assignments: 1 (Carlos -> Ryan)");

  // ============ COACH ASSIGNMENTS ============
  // Elena (coach) is coaching Priya (seeker)

  await prisma.coachAssignment.create({
    data: {
      coachId: elenaCoach.id,
      seekerId: priyaSeeker.id,
      status: CoachingStatus.ACTIVE,
      sessionsCompleted: 3,
      plan: JSON.stringify({
        goals: [
          "Transition from general full-stack to climate tech specialization",
          "Build network in climate finance and carbon accounting",
          "Prepare for senior engineering roles at climate startups",
        ],
        milestones: [
          { title: "Update resume with climate focus", completed: true },
          { title: "Attend 2 climate tech meetups", completed: true },
          { title: "Apply to 5 target companies", completed: false },
        ],
      }),
    },
  });

  console.log("  Coach Assignments: 1 (Elena -> Priya)");

  // ============ NOTES ============

  await prisma.note.create({
    data: {
      content:
        "Strong phone screen. Maya demonstrated deep knowledge of commercial solar installations and referenced specific projects with 500kW+ capacity. Very articulate about safety protocols. Moving to technical interview.",
      seekerId: mayaSeeker.id,
      orgMemberAuthorId: alexMember.id,
      mentions: [samAccount.id],
    },
  });

  await prisma.note.create({
    data: {
      content:
        "Background check clear. References confirm leadership capabilities and technical expertise. One reference specifically mentioned her ability to manage complex multi-site installations.",
      seekerId: mayaSeeker.id,
      orgMemberAuthorId: samMember.id,
      mentions: [],
    },
  });

  await prisma.note.create({
    data: {
      content:
        "Initial review - solid data background but may need some ramp-up on ESG-specific frameworks. Worth a screening call to assess learning trajectory.",
      seekerId: ryanSeeker.id,
      orgMemberAuthorId: alexMember.id,
      mentions: [],
    },
  });

  // Note from a coach (Elena) about her coaching client (Priya)
  await prisma.note.create({
    data: {
      content:
        "Priya has strong technical fundamentals and genuine passion for climate impact. After 3 coaching sessions, she has refined her narrative around climate tech and is actively networking in the carbon accounting space. Recommend she apply to Aurora Climate's engineering role.",
      seekerId: priyaSeeker.id,
      coachAuthorId: elenaCoach.id,
      mentions: [],
    },
  });

  console.log("  Notes: 4 (3 from org members, 1 from coach)");

  // ============ SCORES ============

  await prisma.score.create({
    data: {
      applicationId: app1.id,
      scorerId: alexMember.id,
      responses: JSON.stringify({
        technicalSkills: { score: 5, notes: "Exceptional technical depth in solar PV systems" },
        communication: { score: 4, notes: "Clear communicator, good at explaining complex concepts" },
        leadershipExperience: { score: 4, notes: "Led teams of up to 12 technicians" },
        cultureFit: { score: 5, notes: "Passionate about clean energy mission alignment" },
        problemSolving: { score: 4, notes: "Gave good examples of troubleshooting installations" },
      }),
      overallRating: 5,
      recommendation: Recommendation.STRONG_YES,
      comments:
        "Top candidate. Technical skills are outstanding and she has clear passion for our mission. Strongly recommend advancing to technical interview.",
    },
  });

  await prisma.score.create({
    data: {
      applicationId: app1.id,
      scorerId: samMember.id,
      responses: JSON.stringify({
        technicalSkills: { score: 5, notes: "Deep expertise, exactly what we need" },
        communication: { score: 5, notes: "Excellent presentation of past projects" },
        leadershipExperience: { score: 4, notes: "Good track record but wants more strategic scope" },
        cultureFit: { score: 5, notes: "Values alignment is perfect" },
        problemSolving: { score: 5, notes: "Impressive systematic approach to challenges" },
      }),
      overallRating: 5,
      recommendation: Recommendation.STRONG_YES,
      comments:
        "Best candidate I have seen for this role in months. Let us fast-track the process.",
    },
  });

  await prisma.score.create({
    data: {
      applicationId: app2.id,
      scorerId: alexMember.id,
      responses: JSON.stringify({
        technicalSkills: { score: 3, notes: "Strong data skills, limited ESG-specific tooling experience" },
        communication: { score: 4, notes: "Articulate, asked thoughtful questions" },
        domainKnowledge: { score: 3, notes: "Good foundation, needs ESG ramp-up" },
        cultureFit: { score: 4, notes: "Genuine interest in sustainability" },
        growthPotential: { score: 5, notes: "Quick learner, self-taught GHG Protocol" },
      }),
      overallRating: 4,
      recommendation: Recommendation.YES,
      comments:
        "Solid analytical foundation with genuine passion for sustainability. Worth investing in training. Recommend moving forward.",
    },
  });

  console.log("  Scores: 3 created");

  // ============ COLLECTIONS ============
  // Curated job collections from Figma designs

  const urbanDwellersCollection = await prisma.collection.create({
    data: {
      title: "Urban Dwellers",
      slug: "urban-dwellers",
      description: "City-based sustainability roles for those who want to make an impact without leaving the urban jungle. From green building to urban farming, these jobs let you transform cities from the inside.",
      gradientColors: JSON.stringify(["#10B981", "#0EA5E9"]),
      isFeatured: true,
      displayOrder: 1,
      isActive: true,
    },
  });

  const planetWideSolutionsCollection = await prisma.collection.create({
    data: {
      title: "Planet-wide Solutions",
      slug: "planet-wide-solutions",
      description: "Roles focused on global climate challenges. Work on international climate policy, cross-border conservation, and solutions that scale across continents.",
      gradientColors: JSON.stringify(["#8B5CF6", "#EC4899"]),
      isFeatured: true,
      displayOrder: 2,
      isActive: true,
    },
  });

  const itsGameTimeCollection = await prisma.collection.create({
    data: {
      title: "It's Game Time",
      slug: "its-game-time",
      description: "Sports meets sustainability! From stadium greening to sustainable sporting goods, these roles combine athletic passion with environmental impact.",
      gradientColors: JSON.stringify(["#F59E0B", "#EF4444"]),
      isFeatured: true,
      displayOrder: 3,
      isActive: true,
    },
  });

  const knowledgeBuildersCollection = await prisma.collection.create({
    data: {
      title: "Knowledge Builders",
      slug: "knowledge-builders",
      description: "Education and research roles for those who want to shape the next generation of climate leaders. Teach, research, and inspire.",
      gradientColors: JSON.stringify(["#6366F1", "#8B5CF6"]),
      isFeatured: true,
      displayOrder: 4,
      isActive: true,
    },
  });

  // Add jobs to collections
  await prisma.collectionJob.createMany({
    data: [
      // Urban Dwellers - city-focused roles
      { collectionId: urbanDwellersCollection.id, jobId: climateEngineerJob.id, displayOrder: 1 },
      { collectionId: urbanDwellersCollection.id, jobId: esgAnalystJob.id, displayOrder: 2 },
      { collectionId: urbanDwellersCollection.id, jobId: waterEngineerJob.id, displayOrder: 3 },
      // Planet-wide Solutions - global impact
      { collectionId: planetWideSolutionsCollection.id, jobId: policyAnalystJob.id, displayOrder: 1 },
      { collectionId: planetWideSolutionsCollection.id, jobId: conservationJob.id, displayOrder: 2 },
      { collectionId: planetWideSolutionsCollection.id, jobId: climateResearcherJob.id, displayOrder: 3 },
      // Knowledge Builders - research & education
      { collectionId: knowledgeBuildersCollection.id, jobId: esgAnalystJob.id, displayOrder: 1 },
      { collectionId: knowledgeBuildersCollection.id, jobId: climateResearcherJob.id, displayOrder: 2 },
      // It's Game Time - placeholder (no sports jobs yet)
    ],
  });

  console.log("  Collections: 4 created (Urban Dwellers, Planet-wide Solutions, Game Time, Knowledge Builders)");

  // ============ GOALS ============
  // Career goals for seekers

  const mayaGoal1 = await prisma.goal.create({
    data: {
      seekerId: mayaSeeker.id,
      title: "Complete technical interview preparation",
      description: "Prepare for the Solaris Energy technical interview by reviewing solar PV design principles and practicing system sizing calculations.",
      icon: "Target",
      progress: 75,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-02-15"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { goalId: mayaGoal1.id, title: "Review NEC code requirements", completed: true, order: 1 },
      { goalId: mayaGoal1.id, title: "Practice system sizing calculations", completed: true, order: 2 },
      { goalId: mayaGoal1.id, title: "Prepare project portfolio presentation", completed: true, order: 3 },
      { goalId: mayaGoal1.id, title: "Mock interview with mentor", completed: false, order: 4 },
    ],
  });

  await prisma.goal.create({
    data: {
      seekerId: ryanSeeker.id,
      title: "Learn to scan and negotiate an offer letter",
      description: "Understand the key components of job offers in the ESG space and practice negotiation techniques.",
      icon: "FileText",
      progress: 30,
      status: GoalStatus.ACTIVE,
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: ryanSeeker.id,
      title: "Message network for potential roles",
      description: "Reach out to 10 contacts in my network who work in sustainability to learn about opportunities.",
      icon: "Users",
      progress: 50,
      status: GoalStatus.ACTIVE,
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: priyaSeeker.id,
      title: "Improve job interview skills",
      description: "Practice behavioral interview questions and prepare STAR stories from my climate tech experience.",
      icon: "ChatCircle",
      progress: 60,
      status: GoalStatus.ACTIVE,
    },
  });

  console.log("  Goals: 4 created (with milestones)");

  // ============ WORK EXPERIENCE ============
  // Work history for seekers

  await prisma.workExperience.create({
    data: {
      seekerId: mayaSeeker.id,
      companyName: "SunPower Corporation",
      jobTitle: "Solar Installation Engineer",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2020-03-01"),
      endDate: new Date("2024-12-31"),
      isCurrent: false,
      description: "Led installation of 200+ commercial solar systems. Managed teams of up to 12 technicians across multi-site projects.",
      skills: ["Solar PV Design", "Project Management", "Team Leadership", "NEC Compliance"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: mayaSeeker.id,
      companyName: "Tesla Energy",
      jobTitle: "Junior Solar Technician",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.ONSITE,
      startDate: new Date("2017-06-01"),
      endDate: new Date("2020-02-28"),
      isCurrent: false,
      description: "Installed residential solar systems and Powerwall batteries. Completed NABCEP certification during tenure.",
      skills: ["Solar Installation", "Battery Storage", "Customer Service"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: priyaSeeker.id,
      companyName: "Watershed",
      jobTitle: "Software Engineer",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.REMOTE,
      startDate: new Date("2022-01-01"),
      isCurrent: true,
      description: "Building carbon accounting platform used by Fortune 500 companies. Full-stack development with focus on data visualization.",
      skills: ["TypeScript", "React", "Node.js", "Carbon Accounting", "Data Visualization"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: elenaSeeker.id,
      companyName: "BlackRock",
      jobTitle: "ESG Investment Analyst",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2021-06-01"),
      isCurrent: true,
      description: "Analyze ESG factors for equity investments. Lead climate risk assessments using TCFD framework.",
      skills: ["ESG Analysis", "TCFD Reporting", "Climate Risk", "Financial Modeling"],
    },
  });

  console.log("  Work Experience: 4 entries created");

  // ============ SAVED JOBS ============
  // Jobs saved by seekers

  await prisma.savedJob.create({
    data: {
      seekerId: ryanSeeker.id,
      jobId: esgAnalystJob.id,
      notes: "Great match for my data analysis background. Need to emphasize GHG Protocol experience.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: ryanSeeker.id,
      jobId: policyAnalystJob.id,
      notes: "Stretch role but interesting policy focus. Could leverage my research skills.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: priyaSeeker.id,
      jobId: climateEngineerJob.id,
      notes: "Applied! Great fit with my current work at Watershed.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: carlosSeeker.id,
      jobId: solarEngineerJob.id,
      notes: "Reach goal - need to get NABCEP certification first.",
    },
  });

  console.log("  Saved Jobs: 4 entries created");

  // ============ JOB NOTES ============
  // Community resources and tips

  const interviewPrepNote = await prisma.jobNote.create({
    data: {
      authorId: mayaSeeker.id,
      category: NoteCategory.PREP_TALK,
      title: "How to prep for your first climate tech interview",
      content: `After going through dozens of interviews in the solar industry, here are my top tips:

1. **Know your climate impact story** - Be ready to explain why you're passionate about climate work. Companies want people who genuinely care.

2. **Quantify your impact** - Instead of saying "I worked on solar projects," say "I led the installation of 15MW of solar capacity, offsetting 10,000 tons of CO2 annually."

3. **Research the company's climate commitments** - Look at their sustainability reports, press releases, and any climate pledges they've made.

4. **Prepare questions about impact** - Ask how they measure climate impact and what their biggest sustainability challenges are.

Good luck out there! We need more people in this fight.`,
      isPublished: true,
      isFeatured: true,
      savedCount: 47,
    },
  });

  const resumeNote = await prisma.jobNote.create({
    data: {
      authorId: elenaSeeker.id,
      category: NoteCategory.WRITE_YOUR_STORY,
      title: "Translating your finance skills for ESG roles",
      content: `Making the switch from traditional finance to ESG? Here's how to reframe your experience:

**Reframe your skills:**
- Financial modeling → Climate risk scenario analysis
- Due diligence → ESG materiality assessment
- Portfolio analysis → Sustainable investment screening

**Add these keywords to your resume:**
- TCFD, SASB, GRI (if you have exposure)
- Climate risk, ESG integration, sustainable finance
- Stakeholder engagement, materiality assessment

**Get certified:** The SASB FSA Credential is relatively quick and shows commitment to the space.

The finance-to-ESG pipeline is real - your quantitative skills are highly valued!`,
      isPublished: true,
      isFeatured: true,
      savedCount: 32,
    },
  });

  await prisma.jobNote.create({
    data: {
      authorId: carlosSeeker.id,
      category: NoteCategory.BUILDING_PATHS,
      title: "Breaking into solar without a degree",
      content: `I got into the solar industry without a 4-year degree, and you can too. Here's my path:

1. Started with OSHA 30 certification ($25-50 online)
2. Got hired as a solar installation helper at a local company
3. Learned on the job for 2 years
4. Company sponsored my NABCEP Associate certification
5. Now working toward NABCEP PV Installation Professional

The industry needs hands-on workers. Don't let lack of a degree stop you!`,
      isPublished: true,
      isFeatured: false,
      savedCount: 89,
    },
  });

  await prisma.jobNote.create({
    data: {
      authorId: ryanSeeker.id,
      category: NoteCategory.THE_SEARCH,
      title: "Best job boards for climate careers",
      content: `Here are the job boards I check weekly:

**Climate-specific:**
- Green Jobs Board (obviously!)
- Climate Base
- Climate Tech List

**General with good climate filters:**
- LinkedIn (filter by "Sustainability" or "Renewable Energy")
- Indeed (search "climate" or "ESG")

**Company career pages to watch:**
- Tesla, Rivian, Lucid (EVs)
- Watershed, Persefoni (carbon accounting)
- Generation IM, Breakthrough Energy (climate investing)

Pro tip: Set up alerts so you don't miss new postings!`,
      isPublished: true,
      isFeatured: false,
      savedCount: 156,
    },
  });

  // Save some notes for users
  await prisma.jobNoteSave.createMany({
    data: [
      { seekerId: ryanSeeker.id, noteId: interviewPrepNote.id },
      { seekerId: ryanSeeker.id, noteId: resumeNote.id },
      { seekerId: priyaSeeker.id, noteId: interviewPrepNote.id },
      { seekerId: carlosSeeker.id, noteId: resumeNote.id },
    ],
  });

  console.log("  Job Notes: 4 created (community resources)");

  console.log("\n✅ Seed completed successfully!");
  console.log("\n  Summary:");
  console.log("  ├── Accounts: 9 (4 employer, 5 seeker)");
  console.log("  ├── Organizations: 2 (Solaris Energy Co., Aurora Climate)");
  console.log("  ├── Pathways: 21 (matching design system - 5 green, 4 blue, 4 orange, 3 red, 2 yellow, 3 purple)");
  console.log("  ├── Org Members: 4 (1 owner + 1 recruiter + 1 member + 1 owner)");
  console.log("  ├── Seeker Profiles: 5 (1 also mentor, 1 also coach)");
  console.log("  ├── Coach Profiles: 1 (Elena Volkov)");
  console.log("  ├── Jobs: 6 (5 published, 1 draft)");
  console.log("  ├── Collections: 4 (with job associations)");
  console.log("  ├── Applications: 5 (with AI match scores)");
  console.log("  ├── Mentor Assignments: 1 (Carlos -> Ryan)");
  console.log("  ├── Coach Assignments: 1 (Elena -> Priya)");
  console.log("  ├── Notes: 4 (3 from org members, 1 from coach)");
  console.log("  ├── Scores: 3");
  console.log("  ├── Goals: 4 (with milestones)");
  console.log("  ├── Work Experience: 4 entries");
  console.log("  ├── Saved Jobs: 4 entries");
  console.log("  └── Job Notes: 4 (community resources)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

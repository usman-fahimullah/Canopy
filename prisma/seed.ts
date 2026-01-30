import {
  PrismaClient,
  JobStatus,
  LocationType,
  EmploymentType,
  OrgMemberRole,
  Recommendation,
  MentorshipStatus,
  CoachingStatus,
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
  await prisma.coachProfile.deleteMany();
  await prisma.seekerProfile.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.job.deleteMany();
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

  // ============ ACCOUNTS ============
  // Every authenticated person gets an Account (maps 1:1 to Clerk)

  // Employer accounts
  const jordanAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_admin_001",
      email: "jordan@canopy.co",
      name: "Jordan Rivera",
      location: "Austin, TX",
      timezone: "America/Chicago",
    },
  });

  const alexAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_recruiter_001",
      email: "alex@canopy.co",
      name: "Alex Chen",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
    },
  });

  const samAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_hm_001",
      email: "sam@canopy.co",
      name: "Sam Patel",
      location: "Austin, TX",
      timezone: "America/Chicago",
    },
  });

  const morganAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_aurora_admin",
      email: "morgan@aurora-climate.canopy.co",
      name: "Morgan Walsh",
      location: "Denver, CO",
      timezone: "America/Denver",
    },
  });

  // Seeker accounts
  const mayaAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_seeker_001",
      email: "maya.thompson@canopy.co",
      name: "Maya Thompson",
      phone: "+1-555-0101",
      location: "Austin, TX",
      timezone: "America/Chicago",
    },
  });

  const ryanAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_seeker_002",
      email: "ryan.oconnor@canopy.co",
      name: "Ryan O'Connor",
      phone: "+1-555-0102",
      location: "Denver, CO",
      timezone: "America/Denver",
    },
  });

  const priyaAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_seeker_003",
      email: "priya.sharma@canopy.co",
      name: "Priya Sharma",
      phone: "+1-555-0103",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
    },
  });

  const carlosAccount = await prisma.account.create({
    data: {
      clerkId: "clerk_seed_seeker_004",
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
      clerkId: "clerk_seed_seeker_005",
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
    },
  });

  await prisma.job.create({
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
    },
  });

  console.log("  Jobs: 4 (3 published, 1 draft)");

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

  console.log("\n✅ Seed completed successfully!");
  console.log("\n  Summary:");
  console.log("  ├── Accounts: 9 (4 employer, 5 seeker)");
  console.log("  ├── Organizations: 2 (Solaris Energy Co., Aurora Climate)");
  console.log("  ├── Org Members: 4 (1 owner + 1 recruiter + 1 member + 1 owner)");
  console.log("  ├── Seeker Profiles: 5 (1 also mentor, 1 also coach)");
  console.log("  ├── Coach Profiles: 1 (Elena Volkov)");
  console.log("  ├── Jobs: 4 (3 published, 1 draft)");
  console.log("  ├── Applications: 5 (with AI match scores)");
  console.log("  ├── Mentor Assignments: 1 (Carlos -> Ryan)");
  console.log("  ├── Coach Assignments: 1 (Elena -> Priya)");
  console.log("  ├── Notes: 4 (3 from org members, 1 from coach)");
  console.log("  └── Scores: 3");
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

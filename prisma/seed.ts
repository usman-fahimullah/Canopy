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
  CareerStage,
} from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// ============ SUPABASE ADMIN CLIENT ============
// Requires SUPABASE_SERVICE_ROLE_KEY in .env / .env.local
// This key has admin privileges and can create auth users directly.
// Find it in: Supabase Dashboard → Settings → API → service_role (secret)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Default password for all seed accounts (change for production!)
const SEED_PASSWORD = "TestPassword123!";

/**
 * Create a Supabase Auth user (or return existing one).
 * Returns the Supabase user ID to link with the Prisma Account.
 * Falls back to a placeholder ID if the admin client is not configured.
 */
async function ensureAuthUser(email: string, name: string, fallbackId: string): Promise<string> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.log(`    ⚠  No SUPABASE_SERVICE_ROLE_KEY — using placeholder ID for ${email}`);
    return fallbackId;
  }

  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === email);

  if (existing) {
    console.log(`    ✓  Auth user exists: ${email} (${existing.id})`);
    return existing.id;
  }

  // Create new auth user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: SEED_PASSWORD,
    email_confirm: true, // Skip email verification
    user_metadata: { name },
  });

  if (error) {
    console.error(`    ✗  Failed to create auth user for ${email}:`, error.message);
    return fallbackId;
  }

  console.log(`    ✓  Created auth user: ${email} (${data.user.id})`);
  return data.user.id;
}

// Helper: Generate completed onboarding progress for seed data
function seedOnboarding(shell: "talent" | "coach" | "employer") {
  const progress = {
    baseProfileComplete: true,
    roles: {
      talent: null as { complete: boolean; completedAt: string; currentStep: null } | null,
      coach: null as { complete: boolean; completedAt: string; currentStep: null } | null,
      employer: null as { complete: boolean; completedAt: string; currentStep: null } | null,
    },
  };
  progress.roles[shell] = {
    complete: true,
    completedAt: new Date().toISOString(),
    currentStep: null,
  };
  return {
    activeRoles: [shell],
    primaryRole: shell,
    onboardingProgress: progress,
  };
}

// Helper: Generate multi-role onboarding progress
function seedMultiOnboarding(shells: ("talent" | "coach" | "employer")[]) {
  const progress = {
    baseProfileComplete: true,
    roles: {
      talent: null as { complete: boolean; completedAt: string; currentStep: null } | null,
      coach: null as { complete: boolean; completedAt: string; currentStep: null } | null,
      employer: null as { complete: boolean; completedAt: string; currentStep: null } | null,
    },
  };
  for (const shell of shells) {
    progress.roles[shell] = {
      complete: true,
      completedAt: new Date().toISOString(),
      currentStep: null,
    };
  }
  return {
    activeRoles: shells,
    primaryRole: shells[0],
    onboardingProgress: progress,
  };
}

async function main() {
  console.log("🌱 Seeding database...\n");

  // Check Supabase Admin availability
  const supabaseAdmin = getSupabaseAdmin();
  if (supabaseAdmin) {
    console.log("  ✓ Supabase Admin client configured — will create loginable auth users");
    console.log(`    Default password for all seed accounts: ${SEED_PASSWORD}\n`);
  } else {
    console.log("  ⚠ SUPABASE_SERVICE_ROLE_KEY not set — seed accounts will NOT be loginable");
    console.log("    Add the key to .env.local to create real auth users.");
    console.log("    Find it at: Supabase Dashboard → Settings → API → service_role (secret)\n");
  }

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
  await prisma.seekerPathway.deleteMany();

  await prisma.coachProfile.deleteMany();
  await prisma.seekerProfile.deleteMany();
  await prisma.organizationMember.deleteMany();
  await prisma.job.deleteMany();
  await prisma.pathway.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.account.deleteMany();

  // Also clean up Supabase auth users from previous seeds
  if (supabaseAdmin) {
    console.log("  Cleaning previous seed auth users...");
    const seedEmails = [
      // Employers (10)
      "jordan@canopy.co",
      "alex@canopy.co",
      "sam@canopy.co",
      "morgan@aurora-climate.canopy.co",
      "dana@verdant-systems.canopy.co",
      "kevin@terrawatt.canopy.co",
      "rachel@evergreen-tech.canopy.co",
      "tomas@canopy.co",
      "nina@terrawatt.canopy.co",
      "derek@evergreen-tech.canopy.co",
      // Seekers (40)
      "maya.thompson@canopy.co",
      "ryan.oconnor@canopy.co",
      "priya.sharma@canopy.co",
      "carlos.mendez@canopy.co",
      "elena.volkov@canopy.co",
      "aisha.johnson@canopy.co",
      "ben.nakamura@canopy.co",
      "chloe.dupont@canopy.co",
      "david.okafor@canopy.co",
      "fatima.hassan@canopy.co",
      "gabriel.santos@canopy.co",
      "hannah.kim@canopy.co",
      "ian.macleod@canopy.co",
      "jasmine.patel@canopy.co",
      "kai.anderson@canopy.co",
      "lucia.martinez@canopy.co",
      "marcus.williams@canopy.co",
      "nadia.petrova@canopy.co",
      "omar.farah@canopy.co",
      "penny.chen@canopy.co",
      "quinn.taylor@canopy.co",
      "rosa.gutierrez@canopy.co",
      "sanjay.reddy@canopy.co",
      "tara.obrien@canopy.co",
      "victor.chang@canopy.co",
      "wendy.adeyemi@canopy.co",
      "xavier.moreau@canopy.co",
      "yuki.tanaka@canopy.co",
      "zara.khan@canopy.co",
      "amber.whitfield@canopy.co",
      "brian.hernandez@canopy.co",
      "camille.nguyen@canopy.co",
      "dante.jackson@canopy.co",
      "eva.lindgren@canopy.co",
      "finn.oleary@canopy.co",
      "grace.wu@canopy.co",
      "hassan.ali@canopy.co",
      "iris.kowalski@canopy.co",
      "james.blackwood@canopy.co",
      "keiko.sato@canopy.co",
    ];
    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
    if (allUsers?.users) {
      for (const user of allUsers.users) {
        if (user.email && seedEmails.includes(user.email)) {
          await supabaseAdmin.auth.admin.deleteUser(user.id);
          console.log(`    ✓  Deleted auth user: ${user.email}`);
        }
      }
    }
  }

  console.log("  Cleaned existing data\n");

  // ============ CREATE SUPABASE AUTH USERS ============
  console.log("  Creating Supabase Auth users...");

  const jordanAuthId = await ensureAuthUser("jordan@canopy.co", "Jordan Rivera", "seed_admin_001");
  const alexAuthId = await ensureAuthUser("alex@canopy.co", "Alex Chen", "seed_recruiter_001");
  const samAuthId = await ensureAuthUser("sam@canopy.co", "Sam Patel", "seed_hm_001");
  const morganAuthId = await ensureAuthUser(
    "morgan@aurora-climate.canopy.co",
    "Morgan Walsh",
    "seed_aurora_admin"
  );
  const mayaAuthId = await ensureAuthUser(
    "maya.thompson@canopy.co",
    "Maya Thompson",
    "seed_seeker_001"
  );
  const ryanAuthId = await ensureAuthUser(
    "ryan.oconnor@canopy.co",
    "Ryan O'Connor",
    "seed_seeker_002"
  );
  const priyaAuthId = await ensureAuthUser(
    "priya.sharma@canopy.co",
    "Priya Sharma",
    "seed_seeker_003"
  );
  const carlosAuthId = await ensureAuthUser(
    "carlos.mendez@canopy.co",
    "Carlos Mendez",
    "seed_seeker_004"
  );
  const elenaAuthId = await ensureAuthUser(
    "elena.volkov@canopy.co",
    "Elena Volkov",
    "seed_seeker_005"
  );

  // New employer auth users
  const danaAuthId = await ensureAuthUser(
    "dana@verdant-systems.canopy.co",
    "Dana Flores",
    "seed_employer_005"
  );
  const kevinAuthId = await ensureAuthUser(
    "kevin@terrawatt.canopy.co",
    "Kevin Park",
    "seed_employer_006"
  );
  const rachelAuthId = await ensureAuthUser(
    "rachel@evergreen-tech.canopy.co",
    "Rachel Adams",
    "seed_employer_007"
  );
  const tomasAuthId = await ensureAuthUser("tomas@canopy.co", "Tomas Reyes", "seed_employer_008");
  const ninaAuthId = await ensureAuthUser(
    "nina@terrawatt.canopy.co",
    "Nina Johansson",
    "seed_employer_009"
  );
  const derekAuthId = await ensureAuthUser(
    "derek@evergreen-tech.canopy.co",
    "Derek Osei",
    "seed_employer_010"
  );

  // New seeker auth users (35 more)
  const aishaAuthId = await ensureAuthUser(
    "aisha.johnson@canopy.co",
    "Aisha Johnson",
    "seed_seeker_006"
  );
  const benAuthId = await ensureAuthUser(
    "ben.nakamura@canopy.co",
    "Ben Nakamura",
    "seed_seeker_007"
  );
  const chloeAuthId = await ensureAuthUser(
    "chloe.dupont@canopy.co",
    "Chloe Dupont",
    "seed_seeker_008"
  );
  const davidAuthId = await ensureAuthUser(
    "david.okafor@canopy.co",
    "David Okafor",
    "seed_seeker_009"
  );
  const fatimaAuthId = await ensureAuthUser(
    "fatima.hassan@canopy.co",
    "Fatima Hassan",
    "seed_seeker_010"
  );
  const gabrielAuthId = await ensureAuthUser(
    "gabriel.santos@canopy.co",
    "Gabriel Santos",
    "seed_seeker_011"
  );
  const hannahAuthId = await ensureAuthUser(
    "hannah.kim@canopy.co",
    "Hannah Kim",
    "seed_seeker_012"
  );
  const ianAuthId = await ensureAuthUser("ian.macleod@canopy.co", "Ian MacLeod", "seed_seeker_013");
  const jasmineAuthId = await ensureAuthUser(
    "jasmine.patel@canopy.co",
    "Jasmine Patel",
    "seed_seeker_014"
  );
  const kaiAuthId = await ensureAuthUser(
    "kai.anderson@canopy.co",
    "Kai Anderson",
    "seed_seeker_015"
  );
  const luciaAuthId = await ensureAuthUser(
    "lucia.martinez@canopy.co",
    "Lucia Martinez",
    "seed_seeker_016"
  );
  const marcusAuthId = await ensureAuthUser(
    "marcus.williams@canopy.co",
    "Marcus Williams",
    "seed_seeker_017"
  );
  const nadiaAuthId = await ensureAuthUser(
    "nadia.petrova@canopy.co",
    "Nadia Petrova",
    "seed_seeker_018"
  );
  const omarAuthId = await ensureAuthUser("omar.farah@canopy.co", "Omar Farah", "seed_seeker_019");
  const pennyAuthId = await ensureAuthUser("penny.chen@canopy.co", "Penny Chen", "seed_seeker_020");
  const quinnAuthId = await ensureAuthUser(
    "quinn.taylor@canopy.co",
    "Quinn Taylor",
    "seed_seeker_021"
  );
  const rosaAuthId = await ensureAuthUser(
    "rosa.gutierrez@canopy.co",
    "Rosa Gutierrez",
    "seed_seeker_022"
  );
  const sanjayAuthId = await ensureAuthUser(
    "sanjay.reddy@canopy.co",
    "Sanjay Reddy",
    "seed_seeker_023"
  );
  const taraAuthId = await ensureAuthUser(
    "tara.obrien@canopy.co",
    "Tara O'Brien",
    "seed_seeker_024"
  );
  const victorAuthId = await ensureAuthUser(
    "victor.chang@canopy.co",
    "Victor Chang",
    "seed_seeker_025"
  );
  const wendyAuthId = await ensureAuthUser(
    "wendy.adeyemi@canopy.co",
    "Wendy Adeyemi",
    "seed_seeker_026"
  );
  const xavierAuthId = await ensureAuthUser(
    "xavier.moreau@canopy.co",
    "Xavier Moreau",
    "seed_seeker_027"
  );
  const yukiAuthId = await ensureAuthUser(
    "yuki.tanaka@canopy.co",
    "Yuki Tanaka",
    "seed_seeker_028"
  );
  const zaraAuthId = await ensureAuthUser("zara.khan@canopy.co", "Zara Khan", "seed_seeker_029");
  const amberAuthId = await ensureAuthUser(
    "amber.whitfield@canopy.co",
    "Amber Whitfield",
    "seed_seeker_030"
  );
  const brianAuthId = await ensureAuthUser(
    "brian.hernandez@canopy.co",
    "Brian Hernandez",
    "seed_seeker_031"
  );
  const camilleAuthId = await ensureAuthUser(
    "camille.nguyen@canopy.co",
    "Camille Nguyen",
    "seed_seeker_032"
  );
  const danteAuthId = await ensureAuthUser(
    "dante.jackson@canopy.co",
    "Dante Jackson",
    "seed_seeker_033"
  );
  const evaAuthId = await ensureAuthUser(
    "eva.lindgren@canopy.co",
    "Eva Lindgren",
    "seed_seeker_034"
  );
  const finnAuthId = await ensureAuthUser(
    "finn.oleary@canopy.co",
    "Finn O'Leary",
    "seed_seeker_035"
  );
  const graceAuthId = await ensureAuthUser("grace.wu@canopy.co", "Grace Wu", "seed_seeker_036");
  const hassanAuthId = await ensureAuthUser(
    "hassan.ali@canopy.co",
    "Hassan Ali",
    "seed_seeker_037"
  );
  const irisAuthId = await ensureAuthUser(
    "iris.kowalski@canopy.co",
    "Iris Kowalski",
    "seed_seeker_038"
  );
  const jamesAuthId = await ensureAuthUser(
    "james.blackwood@canopy.co",
    "James Blackwood",
    "seed_seeker_039"
  );
  const keikoAuthId = await ensureAuthUser("keiko.sato@canopy.co", "Keiko Sato", "seed_seeker_040");

  console.log("");

  // ============ ORGANIZATIONS ============

  // Note: We'll update organizations with pathwayId after pathways are created
  const solarisEnergy = await prisma.organization.create({
    data: {
      name: "Solaris Energy Co.",
      slug: "solaris-energy",
      logo: null,
      description:
        "Leading provider of commercial solar solutions, dedicated to accelerating the transition to clean energy across North America.",
      website: "https://solaris-energy.example.com",
      location: "Austin, TX",
      primaryColor: "#0F766E",
      fontFamily: "DM Sans",
      onboardingCompleted: true,
    },
  });

  const auroraClimate = await prisma.organization.create({
    data: {
      name: "Aurora Climate",
      slug: "aurora-climate",
      logo: null,
      description:
        "Climate tech startup building next-generation carbon accounting and climate risk assessment tools for enterprises.",
      website: "https://aurora-climate.example.com",
      location: "Denver, CO",
      primaryColor: "#0D9488",
      fontFamily: "DM Sans",
      onboardingCompleted: true,
    },
  });

  const verdantSystems = await prisma.organization.create({
    data: {
      name: "Verdant Systems",
      slug: "verdant-systems",
      logo: null,
      description:
        "Circular economy platform helping manufacturers eliminate waste through smart materials tracking and lifecycle optimization.",
      website: "https://verdant-systems.example.com",
      location: "Portland, OR",
      primaryColor: "#059669",
      fontFamily: "DM Sans",
      onboardingCompleted: true,
    },
  });

  const terraWatt = await prisma.organization.create({
    data: {
      name: "TerraWatt Industries",
      slug: "terrawatt",
      logo: null,
      description:
        "Grid-scale energy storage company deploying next-generation battery systems to accelerate the renewable energy transition.",
      website: "https://terrawatt.example.com",
      location: "Boston, MA",
      primaryColor: "#7C3AED",
      fontFamily: "DM Sans",
      onboardingCompleted: true,
    },
  });

  const evergreenTech = await prisma.organization.create({
    data: {
      name: "Evergreen Tech",
      slug: "evergreen-tech",
      logo: null,
      description:
        "Conservation technology company using AI and remote sensing to protect biodiversity and monitor ecosystem health at scale.",
      website: "https://evergreen-tech.example.com",
      location: "Denver, CO",
      primaryColor: "#15803D",
      fontFamily: "DM Sans",
      onboardingCompleted: true,
    },
  });

  console.log("  Organizations: 5 created");

  // ============ PATHWAYS ============
  // Career pathway categories matching design system PathwayTag component
  // Colors reference CSS variables: --primitive-{color}-200 for bg, --primitive-{color}-700 for text

  // GREEN family pathways
  const agriculturePathway = await prisma.pathway.create({
    data: {
      name: "Agriculture",
      slug: "agriculture",
      description:
        "Sustainable farming, regenerative agriculture, food systems, and agricultural technology roles focused on climate-smart practices.",
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
      description:
        "ESG investing, carbon markets, green bonds, climate risk assessment, and sustainable finance positions.",
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
      description:
        "Forest management, reforestation, carbon sequestration, and sustainable timber positions.",
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
      description:
        "Electric vehicles, public transit, sustainable logistics, and clean mobility solutions.",
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
      description:
        "Recycling, composting, circular economy, waste reduction, and sustainable materials management.",
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
      description:
        "Wildlife protection, land preservation, ecosystem restoration, and natural resource management positions.",
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
      description:
        "Climate science, environmental research, data analysis, and academic positions.",
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
      description:
        "Sustainable sports facilities, eco-friendly events, and green athletics management.",
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
      description:
        "Water conservation, treatment, ocean preservation, and aquatic ecosystem management.",
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
      description:
        "Green building, sustainable infrastructure, LEED certification, and energy-efficient construction.",
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
      description:
        "Sustainable manufacturing, clean production, and eco-friendly industrial processes.",
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
      description:
        "Green real estate development, sustainable property management, and eco-friendly buildings.",
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
      description:
        "Sustainable city planning, smart cities, green urban development, and climate adaptation.",
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
      description:
        "Environmental education, sustainability training, climate communication, and academic positions.",
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
      description:
        "Environmental health, climate medicine, sustainable healthcare, and public health.",
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
      description:
        "Renewable energy, clean technology, grid modernization, energy storage, and decarbonization roles.",
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
      description:
        "Environmental art, climate communication, sustainable media, and cultural sustainability.",
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
      description:
        "Climate journalism, environmental communications, and sustainability storytelling.",
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
      description:
        "Climate policy, environmental law, government relations, and nonprofit advocacy roles.",
      icon: "Scales",
      color: "purple",
      displayOrder: 21,
      isActive: true,
    },
  });

  console.log("  Pathways: 21 created (matching design system PathwayTag component)");

  // Update organizations with primary pathway
  await prisma.organization.update({
    where: { id: solarisEnergy.id },
    data: { primaryPathwayId: energyPathway.id },
  });

  await prisma.organization.update({
    where: { id: auroraClimate.id },
    data: { primaryPathwayId: technologyPathway.id },
  });

  await prisma.organization.update({
    where: { id: verdantSystems.id },
    data: { primaryPathwayId: wasteManagementPathway.id },
  });

  await prisma.organization.update({
    where: { id: terraWatt.id },
    data: { primaryPathwayId: energyPathway.id },
  });

  await prisma.organization.update({
    where: { id: evergreenTech.id },
    data: { primaryPathwayId: conservationPathway.id },
  });

  console.log("  Organization pathways: linked");

  // ============ ACCOUNTS ============
  // Every authenticated person gets an Account (maps 1:1 to Clerk)

  // Employer accounts
  const jordanAccount = await prisma.account.create({
    data: {
      supabaseId: jordanAuthId,
      email: "jordan@canopy.co",
      name: "Jordan Rivera",
      location: "Austin, TX",
      timezone: "America/Chicago",
      pronouns: "they/them",
      linkedinUrl: "https://linkedin.com/in/jordanrivera",
      ...seedOnboarding("coach"),
    },
  });

  const alexAccount = await prisma.account.create({
    data: {
      supabaseId: alexAuthId,
      email: "alex@canopy.co",
      name: "Alex Chen",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      linkedinUrl: "https://linkedin.com/in/alexchen",
      ...seedOnboarding("coach"),
    },
  });

  const samAccount = await prisma.account.create({
    data: {
      supabaseId: samAuthId,
      email: "sam@canopy.co",
      name: "Sam Patel",
      location: "Austin, TX",
      timezone: "America/Chicago",
      pronouns: "he/him",
      linkedinUrl: "https://linkedin.com/in/sampatel",
      ...seedOnboarding("coach"),
    },
  });

  const morganAccount = await prisma.account.create({
    data: {
      supabaseId: morganAuthId,
      email: "morgan@aurora-climate.canopy.co",
      name: "Morgan Walsh",
      location: "Denver, CO",
      timezone: "America/Denver",
      pronouns: "she/her",
      linkedinUrl: "https://linkedin.com/in/morganwalsh",
      ...seedOnboarding("coach"),
    },
  });

  // Seeker accounts
  const mayaAccount = await prisma.account.create({
    data: {
      supabaseId: mayaAuthId,
      email: "maya.thompson@canopy.co",
      name: "Maya Thompson",
      phone: "+1-555-0101",
      location: "Austin, TX",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "Black or African American",
      linkedinUrl: "https://linkedin.com/in/mayathompson",
      ...seedOnboarding("talent"),
    },
  });

  const ryanAccount = await prisma.account.create({
    data: {
      supabaseId: ryanAuthId,
      email: "ryan.oconnor@canopy.co",
      name: "Ryan O'Connor",
      phone: "+1-555-0102",
      location: "Denver, CO",
      timezone: "America/Denver",
      pronouns: "he/him",
      ethnicity: "White",
      linkedinUrl: "https://linkedin.com/in/ryanoconnor",
      ...seedOnboarding("talent"),
    },
  });

  const priyaAccount = await prisma.account.create({
    data: {
      supabaseId: priyaAuthId,
      email: "priya.sharma@canopy.co",
      name: "Priya Sharma",
      phone: "+1-555-0103",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Asian",
      linkedinUrl: "https://linkedin.com/in/priyasharma",
      ...seedOnboarding("talent"),
    },
  });

  const carlosAccount = await prisma.account.create({
    data: {
      supabaseId: carlosAuthId,
      email: "carlos.mendez@canopy.co",
      name: "Carlos Mendez",
      phone: "+1-555-0104",
      location: "Portland, OR",
      timezone: "America/Los_Angeles",
      pronouns: "he/him",
      ethnicity: "Hispanic or Latino",
      linkedinUrl: "https://linkedin.com/in/carlosmendez",
      ...seedOnboarding("talent"),
    },
  });

  // Elena is both a seeker AND a coach (dual role)
  const elenaAccount = await prisma.account.create({
    data: {
      supabaseId: elenaAuthId,
      email: "elena.volkov@canopy.co",
      name: "Elena Volkov",
      phone: "+1-555-0105",
      location: "New York, NY",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "White",
      linkedinUrl: "https://linkedin.com/in/elenavolkov",
      bio: "Finance professional with growing ESG specialization. Also coaching job seekers transitioning into climate finance.",
      ...seedMultiOnboarding(["talent", "coach"]),
    },
  });

  // New employer accounts
  const danaAccount = await prisma.account.create({
    data: {
      supabaseId: danaAuthId,
      email: "dana@verdant-systems.canopy.co",
      name: "Dana Flores",
      location: "Portland, OR",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Hispanic or Latino",
      ...seedOnboarding("employer"),
    },
  });
  const kevinAccount = await prisma.account.create({
    data: {
      supabaseId: kevinAuthId,
      email: "kevin@terrawatt.canopy.co",
      name: "Kevin Park",
      location: "Boston, MA",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Asian",
      ...seedOnboarding("employer"),
    },
  });
  const rachelAccount = await prisma.account.create({
    data: {
      supabaseId: rachelAuthId,
      email: "rachel@evergreen-tech.canopy.co",
      name: "Rachel Adams",
      location: "Denver, CO",
      timezone: "America/Denver",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("employer"),
    },
  });
  const tomasAccount = await prisma.account.create({
    data: {
      supabaseId: tomasAuthId,
      email: "tomas@canopy.co",
      name: "Tomas Reyes",
      location: "Austin, TX",
      timezone: "America/Chicago",
      pronouns: "he/him",
      ethnicity: "Hispanic or Latino",
      ...seedOnboarding("employer"),
    },
  });
  const ninaAccount = await prisma.account.create({
    data: {
      supabaseId: ninaAuthId,
      email: "nina@terrawatt.canopy.co",
      name: "Nina Johansson",
      location: "Boston, MA",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("employer"),
    },
  });
  const derekAccount = await prisma.account.create({
    data: {
      supabaseId: derekAuthId,
      email: "derek@evergreen-tech.canopy.co",
      name: "Derek Osei",
      location: "Denver, CO",
      timezone: "America/Denver",
      pronouns: "he/him",
      ethnicity: "Black or African American",
      ...seedOnboarding("employer"),
    },
  });

  // New seeker accounts (35 more)
  const aishaAccount = await prisma.account.create({
    data: {
      supabaseId: aishaAuthId,
      email: "aisha.johnson@canopy.co",
      name: "Aisha Johnson",
      phone: "+1-555-0201",
      location: "Atlanta, GA",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const benAccount = await prisma.account.create({
    data: {
      supabaseId: benAuthId,
      email: "ben.nakamura@canopy.co",
      name: "Ben Nakamura",
      phone: "+1-555-0202",
      location: "Seattle, WA",
      timezone: "America/Los_Angeles",
      pronouns: "he/him",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const chloeAccount = await prisma.account.create({
    data: {
      supabaseId: chloeAuthId,
      email: "chloe.dupont@canopy.co",
      name: "Chloe Dupont",
      phone: "+1-555-0203",
      location: "New Orleans, LA",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const davidAccount = await prisma.account.create({
    data: {
      supabaseId: davidAuthId,
      email: "david.okafor@canopy.co",
      name: "David Okafor",
      phone: "+1-555-0204",
      location: "Houston, TX",
      timezone: "America/Chicago",
      pronouns: "he/him",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const fatimaAccount = await prisma.account.create({
    data: {
      supabaseId: fatimaAuthId,
      email: "fatima.hassan@canopy.co",
      name: "Fatima Hassan",
      phone: "+1-555-0205",
      location: "Minneapolis, MN",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "Middle Eastern or North African",
      ...seedOnboarding("talent"),
    },
  });
  const gabrielAccount = await prisma.account.create({
    data: {
      supabaseId: gabrielAuthId,
      email: "gabriel.santos@canopy.co",
      name: "Gabriel Santos",
      phone: "+1-555-0206",
      location: "Miami, FL",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Hispanic or Latino",
      ...seedOnboarding("talent"),
    },
  });
  const hannahAccount = await prisma.account.create({
    data: {
      supabaseId: hannahAuthId,
      email: "hannah.kim@canopy.co",
      name: "Hannah Kim",
      phone: "+1-555-0207",
      location: "Los Angeles, CA",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const ianAccount = await prisma.account.create({
    data: {
      supabaseId: ianAuthId,
      email: "ian.macleod@canopy.co",
      name: "Ian MacLeod",
      phone: "+1-555-0208",
      location: "Portland, OR",
      timezone: "America/Los_Angeles",
      pronouns: "he/him",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const jasmineAccount = await prisma.account.create({
    data: {
      supabaseId: jasmineAuthId,
      email: "jasmine.patel@canopy.co",
      name: "Jasmine Patel",
      phone: "+1-555-0209",
      location: "Chicago, IL",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const kaiAccount = await prisma.account.create({
    data: {
      supabaseId: kaiAuthId,
      email: "kai.anderson@canopy.co",
      name: "Kai Anderson",
      phone: "+1-555-0210",
      location: "San Francisco, CA",
      timezone: "America/Los_Angeles",
      pronouns: "they/them",
      ethnicity: "Multiracial",
      ...seedOnboarding("talent"),
    },
  });
  const luciaAccount = await prisma.account.create({
    data: {
      supabaseId: luciaAuthId,
      email: "lucia.martinez@canopy.co",
      name: "Lucia Martinez",
      phone: "+1-555-0211",
      location: "Phoenix, AZ",
      timezone: "America/Phoenix",
      pronouns: "she/her",
      ethnicity: "Hispanic or Latino",
      ...seedOnboarding("talent"),
    },
  });
  const marcusAccount = await prisma.account.create({
    data: {
      supabaseId: marcusAuthId,
      email: "marcus.williams@canopy.co",
      name: "Marcus Williams",
      phone: "+1-555-0212",
      location: "Washington, DC",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const nadiaAccount = await prisma.account.create({
    data: {
      supabaseId: nadiaAuthId,
      email: "nadia.petrova@canopy.co",
      name: "Nadia Petrova",
      phone: "+1-555-0213",
      location: "New York, NY",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const omarAccount = await prisma.account.create({
    data: {
      supabaseId: omarAuthId,
      email: "omar.farah@canopy.co",
      name: "Omar Farah",
      phone: "+1-555-0214",
      location: "Columbus, OH",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const pennyAccount = await prisma.account.create({
    data: {
      supabaseId: pennyAuthId,
      email: "penny.chen@canopy.co",
      name: "Penny Chen",
      phone: "+1-555-0215",
      location: "San Jose, CA",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const quinnAccount = await prisma.account.create({
    data: {
      supabaseId: quinnAuthId,
      email: "quinn.taylor@canopy.co",
      name: "Quinn Taylor",
      phone: "+1-555-0216",
      location: "Nashville, TN",
      timezone: "America/Chicago",
      pronouns: "they/them",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const rosaAccount = await prisma.account.create({
    data: {
      supabaseId: rosaAuthId,
      email: "rosa.gutierrez@canopy.co",
      name: "Rosa Gutierrez",
      phone: "+1-555-0217",
      location: "Albuquerque, NM",
      timezone: "America/Denver",
      pronouns: "she/her",
      ethnicity: "Hispanic or Latino",
      ...seedOnboarding("talent"),
    },
  });
  const sanjayAccount = await prisma.account.create({
    data: {
      supabaseId: sanjayAuthId,
      email: "sanjay.reddy@canopy.co",
      name: "Sanjay Reddy",
      phone: "+1-555-0218",
      location: "Raleigh, NC",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const taraAccount = await prisma.account.create({
    data: {
      supabaseId: taraAuthId,
      email: "tara.obrien@canopy.co",
      name: "Tara O'Brien",
      phone: "+1-555-0219",
      location: "Boston, MA",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const victorAccount = await prisma.account.create({
    data: {
      supabaseId: victorAuthId,
      email: "victor.chang@canopy.co",
      name: "Victor Chang",
      phone: "+1-555-0220",
      location: "Sacramento, CA",
      timezone: "America/Los_Angeles",
      pronouns: "he/him",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const wendyAccount = await prisma.account.create({
    data: {
      supabaseId: wendyAuthId,
      email: "wendy.adeyemi@canopy.co",
      name: "Wendy Adeyemi",
      phone: "+1-555-0221",
      location: "Dallas, TX",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const xavierAccount = await prisma.account.create({
    data: {
      supabaseId: xavierAuthId,
      email: "xavier.moreau@canopy.co",
      name: "Xavier Moreau",
      phone: "+1-555-0222",
      location: "Detroit, MI",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Multiracial",
      ...seedOnboarding("talent"),
    },
  });
  const yukiAccount = await prisma.account.create({
    data: {
      supabaseId: yukiAuthId,
      email: "yuki.tanaka@canopy.co",
      name: "Yuki Tanaka",
      phone: "+1-555-0223",
      location: "Honolulu, HI",
      timezone: "Pacific/Honolulu",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const zaraAccount = await prisma.account.create({
    data: {
      supabaseId: zaraAuthId,
      email: "zara.khan@canopy.co",
      name: "Zara Khan",
      phone: "+1-555-0224",
      location: "Philadelphia, PA",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const amberAccount = await prisma.account.create({
    data: {
      supabaseId: amberAuthId,
      email: "amber.whitfield@canopy.co",
      name: "Amber Whitfield",
      phone: "+1-555-0225",
      location: "Charlotte, NC",
      timezone: "America/New_York",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const brianAccount = await prisma.account.create({
    data: {
      supabaseId: brianAuthId,
      email: "brian.hernandez@canopy.co",
      name: "Brian Hernandez",
      phone: "+1-555-0226",
      location: "San Antonio, TX",
      timezone: "America/Chicago",
      pronouns: "he/him",
      ethnicity: "Hispanic or Latino",
      ...seedOnboarding("talent"),
    },
  });
  const camilleAccount = await prisma.account.create({
    data: {
      supabaseId: camilleAuthId,
      email: "camille.nguyen@canopy.co",
      name: "Camille Nguyen",
      phone: "+1-555-0227",
      location: "Oakland, CA",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const danteAccount = await prisma.account.create({
    data: {
      supabaseId: danteAuthId,
      email: "dante.jackson@canopy.co",
      name: "Dante Jackson",
      phone: "+1-555-0228",
      location: "Baltimore, MD",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const evaAccount = await prisma.account.create({
    data: {
      supabaseId: evaAuthId,
      email: "eva.lindgren@canopy.co",
      name: "Eva Lindgren",
      phone: "+1-555-0229",
      location: "Minneapolis, MN",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const finnAccount = await prisma.account.create({
    data: {
      supabaseId: finnAuthId,
      email: "finn.oleary@canopy.co",
      name: "Finn O'Leary",
      phone: "+1-555-0230",
      location: "Pittsburgh, PA",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const graceAccount = await prisma.account.create({
    data: {
      supabaseId: graceAuthId,
      email: "grace.wu@canopy.co",
      name: "Grace Wu",
      phone: "+1-555-0231",
      location: "San Diego, CA",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });
  const hassanAccount = await prisma.account.create({
    data: {
      supabaseId: hassanAuthId,
      email: "hassan.ali@canopy.co",
      name: "Hassan Ali",
      phone: "+1-555-0232",
      location: "Dearborn, MI",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Middle Eastern or North African",
      ...seedOnboarding("talent"),
    },
  });
  const irisAccount = await prisma.account.create({
    data: {
      supabaseId: irisAuthId,
      email: "iris.kowalski@canopy.co",
      name: "Iris Kowalski",
      phone: "+1-555-0233",
      location: "Milwaukee, WI",
      timezone: "America/Chicago",
      pronouns: "she/her",
      ethnicity: "White",
      ...seedOnboarding("talent"),
    },
  });
  const jamesAccount = await prisma.account.create({
    data: {
      supabaseId: jamesAuthId,
      email: "james.blackwood@canopy.co",
      name: "James Blackwood",
      phone: "+1-555-0234",
      location: "Asheville, NC",
      timezone: "America/New_York",
      pronouns: "he/him",
      ethnicity: "Black or African American",
      ...seedOnboarding("talent"),
    },
  });
  const keikoAccount = await prisma.account.create({
    data: {
      supabaseId: keikoAuthId,
      email: "keiko.sato@canopy.co",
      name: "Keiko Sato",
      phone: "+1-555-0235",
      location: "Portland, OR",
      timezone: "America/Los_Angeles",
      pronouns: "she/her",
      ethnicity: "Asian",
      ...seedOnboarding("talent"),
    },
  });

  console.log("  Accounts: 50 created (10 employer, 40 seeker)");

  // ============ ORGANIZATION MEMBERS ============

  const jordanMember = await prisma.organizationMember.create({
    data: {
      accountId: jordanAccount.id,
      organizationId: solarisEnergy.id,
      role: OrgMemberRole.ADMIN,
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
      role: OrgMemberRole.ADMIN,
      title: "Founder & CEO",
    },
  });

  // Verdant Systems members
  const danaMember = await prisma.organizationMember.create({
    data: {
      accountId: danaAccount.id,
      organizationId: verdantSystems.id,
      role: OrgMemberRole.ADMIN,
      title: "Founder & CEO",
    },
  });

  // TerraWatt members
  const kevinMember = await prisma.organizationMember.create({
    data: {
      accountId: kevinAccount.id,
      organizationId: terraWatt.id,
      role: OrgMemberRole.ADMIN,
      title: "CTO",
    },
  });
  const ninaMember = await prisma.organizationMember.create({
    data: {
      accountId: ninaAccount.id,
      organizationId: terraWatt.id,
      role: OrgMemberRole.RECRUITER,
      title: "Talent Acquisition Lead",
    },
  });

  // Evergreen Tech members
  const rachelMember = await prisma.organizationMember.create({
    data: {
      accountId: rachelAccount.id,
      organizationId: evergreenTech.id,
      role: OrgMemberRole.ADMIN,
      title: "CEO",
    },
  });
  const derekMember = await prisma.organizationMember.create({
    data: {
      accountId: derekAccount.id,
      organizationId: evergreenTech.id,
      role: OrgMemberRole.ADMIN,
      title: "VP Engineering",
    },
  });

  // Extra member for Solaris
  const tomasMember = await prisma.organizationMember.create({
    data: {
      accountId: tomasAccount.id,
      organizationId: solarisEnergy.id,
      role: OrgMemberRole.ADMIN,
      title: "VP Operations",
    },
  });

  console.log("  Org Members: 10 across 5 organizations");

  // ============ SEEKER PROFILES ============

  const mayaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: mayaAccount.id,
      headline: "Senior Solar Engineer | NABCEP Certified | 8 Years in Commercial PV",
      // Onboarding fields
      careerStage: CareerStage.SENIOR,
      motivations: ["finding-job", "career-advancement"],
      // Skills
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
      headline: "Data Analyst | ESG Enthusiast | GRI Certified",
      // Onboarding fields
      careerStage: CareerStage.CAREER_CHANGER,
      motivations: ["finding-job", "exploring-options", "learning-skills"],
      // Skills
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
      headline: "Full-Stack Engineer | Climate Tech | Carbon Tracking",
      // Onboarding fields
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      // Skills
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
      headline: "Solar Technician | Aspiring Senior Engineer",
      // Onboarding fields
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "learning-skills", "networking"],
      // Skills
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
      mentorSpecialty: "Solar Installation Careers",
      mentorBadge: "featured",
      mentorRating: 4.7,
      mentorReviewCount: 3,
    },
  });

  // Elena is a seeker AND a coach (dual role — professional coaching)
  const elenaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: elenaAccount.id,
      headline: "Climate Finance Analyst | CFA Candidate | SASB Credentialed",
      // Onboarding fields
      careerStage: CareerStage.MID_CAREER,
      motivations: ["exploring-options", "networking"],
      // Skills
      skills: ["Financial Analysis", "ESG Integration", "Risk Assessment", "Excel"],
      greenSkills: ["TCFD Reporting", "Climate Risk Assessment", "Green Bond Frameworks"],
      certifications: ["CFA Level II", "SASB FSA Credential"],
      yearsExperience: 5,
      aiSummary:
        "Finance professional with growing ESG specialization. CFA candidate with SASB credential. Strong quantitative and analytical skills for sustainability reporting.",
      targetSectors: ["finance", "corporate-sustainability"],
    },
  });

  // ============ NEW SEEKER PROFILES (35 more) ============

  const aishaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: aishaAccount.id,
      headline: "Environmental Engineer | Water Quality Specialist",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Water Treatment Design", "Environmental Compliance", "AutoCAD", "GIS"],
      greenSkills: ["Stormwater Management", "Wetland Restoration"],
      certifications: ["PE License", "LEED AP"],
      yearsExperience: 6,
      aiSummary:
        "Solid environmental engineering background with specialization in water systems. PE licensed with strong compliance track record.",
      targetSectors: ["water", "infrastructure"],
    },
  });
  const benSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: benAccount.id,
      headline: "UX Designer | Climate Tech Focused",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "exploring-options"],
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      greenSkills: ["Sustainability Dashboard Design", "Behavior Change UX"],
      certifications: [],
      yearsExperience: 5,
      aiSummary:
        "Talented UX designer looking to apply human-centered design skills to climate and sustainability products.",
      targetSectors: ["climate-tech"],
    },
  });
  const chloeSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: chloeAccount.id,
      headline: "Marine Biologist | Coastal Restoration",
      careerStage: CareerStage.SENIOR,
      motivations: ["finding-job", "networking"],
      skills: ["Marine Ecology", "Field Research", "Grant Writing", "R"],
      greenSkills: ["Coral Restoration", "Marine Protected Areas", "Blue Carbon"],
      certifications: ["PADI Divemaster", "Wilderness First Responder"],
      yearsExperience: 10,
      aiSummary:
        "Experienced marine scientist with decade of coastal restoration fieldwork. Strong publication record and grant writing skills.",
      targetSectors: ["conservation", "research"],
    },
  });
  const davidSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: davidAccount.id,
      headline: "Mechanical Engineer | EV Battery Systems",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Battery Design", "Thermal Management", "MATLAB", "SolidWorks"],
      greenSkills: ["EV Battery Pack Design", "Energy Storage Systems"],
      certifications: ["FE Exam Passed"],
      yearsExperience: 5,
      aiSummary:
        "Strong mechanical engineer pivoting from automotive to clean energy storage. Deep thermal management expertise.",
      targetSectors: ["clean-energy", "transportation"],
    },
  });
  const fatimaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: fatimaAccount.id,
      headline: "Sustainability Consultant | B Corp Specialist",
      careerStage: CareerStage.SENIOR,
      motivations: ["exploring-options", "networking"],
      skills: [
        "Sustainability Reporting",
        "Stakeholder Engagement",
        "Life Cycle Assessment",
        "ISO 14001",
      ],
      greenSkills: ["B Corp Assessment", "Science Based Targets", "CDP Disclosure"],
      certifications: ["B Corp Consultant", "ISO 14001 Lead Auditor"],
      yearsExperience: 9,
      aiSummary:
        "Expert sustainability consultant who has guided 20+ companies through B Corp certification. Excellent at translating sustainability into business value.",
      targetSectors: ["corporate-sustainability", "consulting"],
      isMentor: true,
      mentorBio:
        "I love helping people navigate the sustainability consulting landscape. Ask me anything about certifications and career paths.",
      mentorTopics: ["B Corp Certification", "Sustainability Consulting Careers", "ESG Frameworks"],
      mentorSpecialty: "Sustainability Consulting",
      mentorBadge: "quick_responder",
      mentorRating: 4.9,
      mentorReviewCount: 5,
    },
  });
  const gabrielSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: gabrielAccount.id,
      headline: "Solar Sales Manager | Community Solar Champion",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Solar Sales", "CRM Management", "Community Outreach", "Team Leadership"],
      greenSkills: ["Community Solar Programs", "Net Metering", "Solar Financing"],
      certifications: ["NABCEP PV Associate"],
      yearsExperience: 6,
      aiSummary:
        "Proven solar sales leader who has closed over $10M in community solar contracts. Strong community engagement skills.",
      targetSectors: ["clean-energy"],
    },
  });
  const hannahSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: hannahAccount.id,
      headline: "Climate Policy Researcher | Just Transition Focus",
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "learning-skills"],
      skills: ["Policy Analysis", "Qualitative Research", "Technical Writing", "Spanish"],
      greenSkills: ["Environmental Justice", "Just Transition Frameworks"],
      certifications: [],
      yearsExperience: 2,
      aiSummary:
        "Recent MPP graduate with strong research skills and passion for equitable climate policy. Published thesis on just transition.",
      targetSectors: ["policy", "nonprofit"],
    },
  });
  const ianSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: ianAccount.id,
      headline: "Circular Economy Analyst | Zero Waste Advocate",
      careerStage: CareerStage.CAREER_CHANGER,
      motivations: ["finding-job", "exploring-options", "learning-skills"],
      skills: ["Supply Chain Analysis", "Waste Auditing", "Excel", "Process Improvement"],
      greenSkills: ["Circular Economy Principles", "Waste Stream Analysis", "Material Recovery"],
      certifications: ["TRUE Zero Waste Advisor"],
      yearsExperience: 3,
      aiSummary:
        "Former supply chain analyst transitioning into circular economy work. Practical experience in waste auditing and material flow analysis.",
      targetSectors: ["circular-economy", "waste-management"],
    },
  });
  const jasmineSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: jasmineAccount.id,
      headline: "Environmental Educator | Curriculum Designer",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Curriculum Development", "Public Speaking", "Program Management", "Grant Writing"],
      greenSkills: ["Climate Literacy", "Outdoor Education", "Youth Engagement"],
      certifications: ["Certified Environmental Educator"],
      yearsExperience: 7,
      aiSummary:
        "Passionate environmental educator with experience developing K-12 sustainability curricula reaching 10,000+ students.",
      targetSectors: ["education", "nonprofit"],
      isMentor: true,
      mentorBio:
        "Helping aspiring environmental educators find their path. I can advise on certifications, curriculum design, and breaking into the field.",
      mentorTopics: [
        "Environmental Education Careers",
        "Curriculum Design",
        "Nonprofit Job Search",
      ],
      mentorSpecialty: "Environmental Education Careers",
      mentorRating: 4.6,
      mentorReviewCount: 4,
    },
  });
  const kaiSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: kaiAccount.id,
      headline: "Climate Data Journalist | Storytelling with Impact",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["exploring-options", "networking"],
      skills: ["Data Journalism", "Python", "D3.js", "Investigative Reporting"],
      greenSkills: ["Climate Data Visualization", "Environmental Reporting"],
      certifications: [],
      yearsExperience: 5,
      aiSummary:
        "Data journalist specializing in climate stories. Published in major outlets with strong Python and visualization skills.",
      targetSectors: ["media", "communications"],
    },
  });
  const luciaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: luciaAccount.id,
      headline: "Solar Installation Apprentice | Eager Learner",
      careerStage: CareerStage.STUDENT,
      motivations: ["finding-job", "learning-skills", "networking"],
      skills: ["Electrical Basics", "Blueprint Reading", "Hand Tools"],
      greenSkills: ["Solar PV Basics"],
      certifications: ["OSHA 10"],
      yearsExperience: 0,
      aiSummary:
        "Enthusiastic trade school student in solar installation program. Strong work ethic and eager to learn.",
      targetSectors: ["clean-energy"],
    },
  });
  const marcusSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: marcusAccount.id,
      headline: "Climate Lobbyist | Legislative Strategy",
      careerStage: CareerStage.SENIOR,
      motivations: ["finding-job", "career-advancement"],
      skills: [
        "Legislative Advocacy",
        "Coalition Building",
        "Public Policy",
        "Government Relations",
      ],
      greenSkills: ["Clean Energy Policy", "Climate Legislation", "Carbon Pricing"],
      certifications: [],
      yearsExperience: 12,
      aiSummary:
        "Seasoned government relations professional with track record of advancing clean energy legislation at state and federal levels.",
      targetSectors: ["policy", "government"],
      isMentor: true,
      mentorBio:
        "I can help you understand how climate policy careers work, from think tanks to Capitol Hill. Happy to share my network.",
      mentorTopics: ["Climate Policy Careers", "Government Relations", "Legislative Advocacy"],
      mentorSpecialty: "Climate Policy Careers",
      mentorRating: 4.9,
      mentorReviewCount: 6,
    },
  });
  const nadiaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: nadiaAccount.id,
      headline: "Green Building Architect | Passive House Designer",
      careerStage: CareerStage.SENIOR,
      motivations: ["finding-job", "networking"],
      skills: ["Revit", "Passive House Design", "Energy Modeling", "Project Management"],
      greenSkills: ["Net Zero Design", "Passive House Standard", "LEED Design"],
      certifications: ["CPHD (Certified Passive House Designer)", "LEED AP BD+C", "AIA"],
      yearsExperience: 11,
      aiSummary:
        "Award-winning architect specializing in passive house and net-zero buildings. Designed 15+ certified projects.",
      targetSectors: ["construction", "real-estate"],
    },
  });
  const omarSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: omarAccount.id,
      headline: "Sustainable Agriculture Researcher | Soil Science",
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "learning-skills"],
      skills: ["Soil Analysis", "Lab Research", "Data Collection", "Scientific Writing"],
      greenSkills: ["Soil Carbon Sequestration", "Regenerative Practices"],
      certifications: [],
      yearsExperience: 1,
      aiSummary:
        "Recent agriculture science graduate with hands-on soil research experience. Strong lab skills and passion for regenerative farming.",
      targetSectors: ["agriculture", "research"],
    },
  });
  const pennySeeker = await prisma.seekerProfile.create({
    data: {
      accountId: pennyAccount.id,
      headline: "Product Manager | CleanTech SaaS",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Product Management", "Agile/Scrum", "SQL", "User Research", "Roadmap Planning"],
      greenSkills: ["Carbon Accounting Products", "ESG Software"],
      certifications: ["Certified Scrum Product Owner"],
      yearsExperience: 6,
      aiSummary:
        "Product manager with SaaS background now focused on climate tech products. Strong analytical skills and user empathy.",
      targetSectors: ["climate-tech"],
    },
  });
  const quinnSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: quinnAccount.id,
      headline: "Ecotourism Guide | Conservation Storyteller",
      careerStage: CareerStage.CAREER_CHANGER,
      motivations: ["finding-job", "exploring-options"],
      skills: ["Nature Interpretation", "Group Facilitation", "Photography", "Wildlife ID"],
      greenSkills: ["Ecotourism Best Practices", "Leave No Trace"],
      certifications: ["Certified Interpretive Guide", "Wilderness First Aid"],
      yearsExperience: 2,
      aiSummary:
        "Former hospitality professional transitioning to ecotourism and conservation. Excellent communication and outdoor skills.",
      targetSectors: ["tourism", "conservation"],
    },
  });
  const rosaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: rosaAccount.id,
      headline: "Wind Turbine Technician | O&M Specialist",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: [
        "Wind Turbine Maintenance",
        "Electrical Troubleshooting",
        "Safety Compliance",
        "Hydraulics",
      ],
      greenSkills: ["Wind Energy O&M", "Predictive Maintenance"],
      certifications: ["GWO Basic Safety Training", "OSHA 30"],
      yearsExperience: 5,
      aiSummary:
        "Skilled wind technician with excellent safety record. Experienced with multiple turbine platforms and predictive maintenance systems.",
      targetSectors: ["clean-energy"],
    },
  });
  const sanjaySeeker = await prisma.seekerProfile.create({
    data: {
      accountId: sanjayAccount.id,
      headline: "Backend Engineer | Energy Grid Software",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Go", "Python", "Kubernetes", "PostgreSQL", "gRPC"],
      greenSkills: ["Grid Management Software", "Energy APIs"],
      certifications: ["AWS Solutions Architect"],
      yearsExperience: 7,
      aiSummary:
        "Strong backend engineer building distributed systems for energy grid management. Deep expertise in Go and infrastructure.",
      targetSectors: ["climate-tech", "clean-energy"],
    },
  });
  const taraSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: taraAccount.id,
      headline: "Returning Professional | Environmental Compliance",
      careerStage: CareerStage.RETURNING,
      motivations: ["finding-job", "learning-skills", "networking"],
      skills: ["Environmental Compliance", "Permitting", "Regulatory Analysis", "Report Writing"],
      greenSkills: ["EPA Regulations", "Air Quality Monitoring"],
      certifications: ["CHMM"],
      yearsExperience: 8,
      aiSummary:
        "Experienced environmental compliance professional returning after a career break. Strong regulatory knowledge and permitting background.",
      targetSectors: ["corporate-sustainability", "consulting"],
    },
  });
  const victorSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: victorAccount.id,
      headline: "Urban Farmer | Community Food Systems",
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "learning-skills"],
      skills: ["Urban Agriculture", "Composting", "Community Engagement", "Farm Management"],
      greenSkills: ["Urban Food Production", "Composting Systems", "Food Justice"],
      certifications: ["Organic Grower Certificate"],
      yearsExperience: 2,
      aiSummary:
        "Passionate urban farmer building community food systems. Hands-on experience managing a 2-acre urban farm serving 200+ families.",
      targetSectors: ["agriculture", "community-development"],
    },
  });
  const wendySeeker = await prisma.seekerProfile.create({
    data: {
      accountId: wendyAccount.id,
      headline: "ESG Program Manager | Supply Chain Sustainability",
      careerStage: CareerStage.SENIOR,
      motivations: ["finding-job", "career-advancement"],
      skills: [
        "Program Management",
        "Supply Chain Analysis",
        "Vendor Auditing",
        "Sustainability Reporting",
      ],
      greenSkills: ["Scope 3 Emissions", "Supplier ESG Assessment", "Science Based Targets"],
      certifications: ["PMP", "GRI Certified"],
      yearsExperience: 9,
      aiSummary:
        "Senior ESG professional with deep supply chain sustainability experience. Led Scope 3 reduction programs for Fortune 500.",
      targetSectors: ["corporate-sustainability", "consulting"],
      isMentor: true,
      mentorBio:
        "I mentor people breaking into corporate sustainability, especially supply chain ESG roles. Happy to review resumes and do mock interviews.",
      mentorTopics: ["Corporate Sustainability Careers", "Supply Chain ESG", "Resume Review"],
      mentorSpecialty: "Corporate Sustainability Careers",
      mentorBadge: "featured",
      mentorRating: 5,
      mentorReviewCount: 12,
    },
  });
  const xavierSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: xavierAccount.id,
      headline: "EV Charging Infrastructure Manager",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "exploring-options"],
      skills: ["Project Management", "Electrical Systems", "Permitting", "Vendor Management"],
      greenSkills: ["EV Charging Networks", "Grid Integration", "NEVI Program"],
      certifications: ["PMP", "EVSE Installer Certified"],
      yearsExperience: 5,
      aiSummary:
        "Infrastructure manager specializing in EV charging network deployment. Experience with both Level 2 and DC fast charger installations.",
      targetSectors: ["transportation", "clean-energy"],
    },
  });
  const yukiSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: yukiAccount.id,
      headline: "Ocean Conservation Researcher | Coral Ecology",
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "learning-skills"],
      skills: ["Marine Research", "Scuba Diving", "GIS Mapping", "Python"],
      greenSkills: ["Coral Reef Monitoring", "Marine Conservation"],
      certifications: ["AAUS Scientific Diver"],
      yearsExperience: 1,
      aiSummary:
        "Recent marine biology graduate with fieldwork experience in coral reef ecosystems. Strong GIS and data analysis skills.",
      targetSectors: ["conservation", "research"],
    },
  });
  const zaraSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: zaraAccount.id,
      headline: "Climate Finance Associate | Green Bonds",
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Financial Modeling", "Bloomberg Terminal", "Risk Analysis", "Excel"],
      greenSkills: ["Green Bond Frameworks", "Climate Risk Assessment"],
      certifications: ["CFA Level I"],
      yearsExperience: 2,
      aiSummary:
        "Early-career finance professional with green bond experience. Strong quantitative skills and growing ESG knowledge.",
      targetSectors: ["finance", "climate-tech"],
    },
  });
  const amberSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: amberAccount.id,
      headline: "Sustainability Communications Manager",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["PR Strategy", "Content Marketing", "Social Media", "Crisis Communications"],
      greenSkills: ["Greenwashing Prevention", "Sustainability Storytelling"],
      certifications: ["APR"],
      yearsExperience: 6,
      aiSummary:
        "Communications professional specializing in authentic sustainability messaging. Expert at avoiding greenwashing while driving brand value.",
      targetSectors: ["media", "corporate-sustainability"],
    },
  });
  const brianSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: brianAccount.id,
      headline: "HVAC Technician | Building Decarbonization",
      careerStage: CareerStage.CAREER_CHANGER,
      motivations: ["finding-job", "learning-skills"],
      skills: [
        "HVAC Systems",
        "Heat Pump Installation",
        "Building Energy Audits",
        "Refrigerant Management",
      ],
      greenSkills: ["Heat Pump Conversions", "Building Electrification"],
      certifications: ["EPA 608 Universal", "NATE Certified"],
      yearsExperience: 8,
      aiSummary:
        "Experienced HVAC tech transitioning to building decarbonization. Expert in heat pump installations and building electrification.",
      targetSectors: ["construction", "clean-energy"],
      isMentor: true,
      mentorBio:
        "I can help tradespeople understand the building decarbonization opportunity. Heat pumps are the future and we need skilled workers.",
      mentorTopics: ["Heat Pump Careers", "Building Trades to Clean Energy", "HVAC Certifications"],
      mentorSpecialty: "Heat Pump Careers",
      mentorBadge: "quick_responder",
      mentorRating: 4.9,
      mentorReviewCount: 4,
    },
  });
  const camilleSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: camilleAccount.id,
      headline: "Climate Adaptation Planner | Urban Resilience",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "networking"],
      skills: ["Urban Planning", "Climate Modeling", "Community Engagement", "GIS"],
      greenSkills: [
        "Climate Adaptation Planning",
        "Flood Risk Assessment",
        "Heat Island Mitigation",
      ],
      certifications: ["AICP Certified Planner"],
      yearsExperience: 6,
      aiSummary:
        "Urban planner focused on climate adaptation and resilience. Experience developing city-wide climate action plans.",
      targetSectors: ["urban-planning", "policy"],
    },
  });
  const danteSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: danteAccount.id,
      headline: "Environmental Justice Organizer | Community Advocate",
      careerStage: CareerStage.ENTRY_LEVEL,
      motivations: ["finding-job", "networking", "learning-skills"],
      skills: ["Community Organizing", "Public Speaking", "Event Planning", "Grant Writing"],
      greenSkills: ["Environmental Justice", "Community Advocacy", "Frontline Communities"],
      certifications: [],
      yearsExperience: 2,
      aiSummary:
        "Grassroots organizer with strong community ties and passion for environmental justice. Skilled public speaker and event organizer.",
      targetSectors: ["policy", "nonprofit"],
    },
  });
  const evaSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: evaAccount.id,
      headline: "Forest Ecologist | Carbon Offset Verification",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Forest Inventory", "Remote Sensing", "Carbon Modeling", "R/Python"],
      greenSkills: ["Carbon Offset Verification", "Forest Carbon Projects", "Verra VCS"],
      certifications: ["SAF Certified Forester"],
      yearsExperience: 7,
      aiSummary:
        "Forest ecologist with specialization in carbon offset project development and verification. Published researcher.",
      targetSectors: ["forestry", "conservation"],
    },
  });
  const finnSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: finnAccount.id,
      headline: "Manufacturing Engineer | Clean Production",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "exploring-options"],
      skills: ["Lean Manufacturing", "Six Sigma", "Process Optimization", "CAD/CAM"],
      greenSkills: ["Clean Manufacturing", "Waste Reduction", "Energy Efficiency"],
      certifications: ["Six Sigma Green Belt", "Lean Certified"],
      yearsExperience: 6,
      aiSummary:
        "Manufacturing engineer with strong continuous improvement background looking to apply lean skills to sustainable production.",
      targetSectors: ["manufacturing", "circular-economy"],
      isMentor: true,
      mentorBio:
        "Lean manufacturing veteran happy to mentor people interested in sustainable manufacturing careers.",
      mentorTopics: [
        "Sustainable Manufacturing",
        "Lean/Six Sigma in Green Jobs",
        "Manufacturing Careers",
      ],
      mentorSpecialty: "Sustainable Manufacturing",
      mentorBadge: "top_mentor",
      mentorRating: 4.9,
      mentorReviewCount: 7,
    },
  });
  const graceSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: graceAccount.id,
      headline: "Renewable Energy Attorney | Clean Energy Law",
      careerStage: CareerStage.SENIOR,
      motivations: ["finding-job", "career-advancement"],
      skills: ["Energy Law", "Regulatory Compliance", "Contract Negotiation", "PPA Structuring"],
      greenSkills: [
        "Renewable Energy Project Development",
        "Clean Energy Policy",
        "Carbon Markets",
      ],
      certifications: ["Bar Admission (CA, NY)"],
      yearsExperience: 10,
      aiSummary:
        "Clean energy attorney with decade of experience structuring PPAs and navigating renewable energy regulations across multiple states.",
      targetSectors: ["clean-energy", "policy"],
    },
  });
  const hassanSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: hassanAccount.id,
      headline: "Automotive Engineer | EV Powertrain",
      careerStage: CareerStage.CAREER_CHANGER,
      motivations: ["finding-job", "learning-skills", "exploring-options"],
      skills: [
        "Powertrain Engineering",
        "MATLAB/Simulink",
        "Vehicle Dynamics",
        "Testing & Validation",
      ],
      greenSkills: ["EV Motor Design", "Battery Management Systems"],
      certifications: ["FE Exam Passed"],
      yearsExperience: 7,
      aiSummary:
        "Experienced automotive engineer transitioning from ICE to EV powertrain design. Strong modeling and simulation background.",
      targetSectors: ["transportation", "clean-energy"],
    },
  });
  const irisSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: irisAccount.id,
      headline: "Sustainable Tourism Consultant | Eco-lodge Design",
      careerStage: CareerStage.MID_CAREER,
      motivations: ["finding-job", "networking"],
      skills: ["Tourism Management", "Sustainable Hospitality", "Business Planning", "Marketing"],
      greenSkills: [
        "Eco-certification Standards",
        "Sustainable Tourism Planning",
        "Community Tourism",
      ],
      certifications: ["Sustainable Tourism Certification (GSTC)"],
      yearsExperience: 5,
      aiSummary:
        "Tourism professional focused on sustainable hospitality design. Has consulted on 10+ eco-lodge and sustainable tourism projects.",
      targetSectors: ["tourism", "consulting"],
    },
  });
  const jamesSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: jamesAccount.id,
      headline: "Forestry Technician | Trail Builder | Veteran",
      careerStage: CareerStage.RETURNING,
      motivations: ["finding-job", "learning-skills", "networking"],
      skills: [
        "Forestry Operations",
        "Trail Construction",
        "Chainsaw Operation",
        "Heavy Equipment",
      ],
      greenSkills: ["Forest Management", "Trail Restoration", "Erosion Control"],
      certifications: ["S-212 Wildfire Chainsaw", "CDL Class B"],
      yearsExperience: 4,
      aiSummary:
        "Military veteran returning to civilian workforce with forestry and land management skills. Strong work ethic and leadership.",
      targetSectors: ["forestry", "conservation"],
    },
  });
  const keikoSeeker = await prisma.seekerProfile.create({
    data: {
      accountId: keikoAccount.id,
      headline: "Climate Art Director | Environmental Media",
      careerStage: CareerStage.SENIOR,
      motivations: ["exploring-options", "networking"],
      skills: ["Art Direction", "Brand Strategy", "Video Production", "Adobe Creative Suite"],
      greenSkills: ["Climate Communication", "Environmental Documentary", "Impact Storytelling"],
      certifications: [],
      yearsExperience: 10,
      aiSummary:
        "Award-winning art director and visual storyteller focused on climate and environmental narratives. Strong documentary background.",
      targetSectors: ["media", "arts-culture"],
    },
  });

  console.log("  Seeker Profiles: 40 total (6 mentors, Elena also a coach)");

  // ============ SEEKER PATHWAY INTERESTS ============
  // Connect seekers to pathways they're interested in

  await prisma.seekerPathway.createMany({
    data: [
      // Maya - interested in Energy and Technology
      { seekerId: mayaSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: mayaSeeker.id, pathwayId: technologyPathway.id, priority: 2 },
      { seekerId: mayaSeeker.id, pathwayId: constructionPathway.id, priority: 3 },
      // Ryan - interested in Finance, Research, and Policy
      { seekerId: ryanSeeker.id, pathwayId: financePathway.id, priority: 1 },
      { seekerId: ryanSeeker.id, pathwayId: researchPathway.id, priority: 2 },
      { seekerId: ryanSeeker.id, pathwayId: policyPathway.id, priority: 3 },
      // Priya - interested in Technology, Energy, and Research
      { seekerId: priyaSeeker.id, pathwayId: technologyPathway.id, priority: 1 },
      { seekerId: priyaSeeker.id, pathwayId: energyPathway.id, priority: 2 },
      { seekerId: priyaSeeker.id, pathwayId: researchPathway.id, priority: 3 },
      // Carlos - interested in Energy and Construction
      { seekerId: carlosSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: carlosSeeker.id, pathwayId: constructionPathway.id, priority: 2 },
      { seekerId: carlosSeeker.id, pathwayId: manufacturingPathway.id, priority: 3 },
      // Elena - interested in Finance and Policy
      { seekerId: elenaSeeker.id, pathwayId: financePathway.id, priority: 1 },
      { seekerId: elenaSeeker.id, pathwayId: policyPathway.id, priority: 2 },
      // New seekers
      { seekerId: aishaSeeker.id, pathwayId: waterPathway.id, priority: 1 },
      { seekerId: aishaSeeker.id, pathwayId: conservationPathway.id, priority: 2 },
      { seekerId: benSeeker.id, pathwayId: technologyPathway.id, priority: 1 },
      { seekerId: benSeeker.id, pathwayId: energyPathway.id, priority: 2 },
      { seekerId: chloeSeeker.id, pathwayId: conservationPathway.id, priority: 1 },
      { seekerId: chloeSeeker.id, pathwayId: researchPathway.id, priority: 2 },
      { seekerId: davidSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: davidSeeker.id, pathwayId: transportationPathway.id, priority: 2 },
      { seekerId: fatimaSeeker.id, pathwayId: financePathway.id, priority: 1 },
      { seekerId: fatimaSeeker.id, pathwayId: policyPathway.id, priority: 2 },
      { seekerId: gabrielSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: gabrielSeeker.id, pathwayId: constructionPathway.id, priority: 2 },
      { seekerId: hannahSeeker.id, pathwayId: policyPathway.id, priority: 1 },
      { seekerId: hannahSeeker.id, pathwayId: educationPathway.id, priority: 2 },
      { seekerId: ianSeeker.id, pathwayId: wasteManagementPathway.id, priority: 1 },
      { seekerId: ianSeeker.id, pathwayId: manufacturingPathway.id, priority: 2 },
      { seekerId: jasmineSeeker.id, pathwayId: educationPathway.id, priority: 1 },
      { seekerId: jasmineSeeker.id, pathwayId: conservationPathway.id, priority: 2 },
      { seekerId: kaiSeeker.id, pathwayId: mediaPathway.id, priority: 1 },
      { seekerId: kaiSeeker.id, pathwayId: artsCulturePathway.id, priority: 2 },
      { seekerId: luciaSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: luciaSeeker.id, pathwayId: constructionPathway.id, priority: 2 },
      { seekerId: marcusSeeker.id, pathwayId: policyPathway.id, priority: 1 },
      { seekerId: marcusSeeker.id, pathwayId: energyPathway.id, priority: 2 },
      { seekerId: nadiaSeeker.id, pathwayId: constructionPathway.id, priority: 1 },
      { seekerId: nadiaSeeker.id, pathwayId: realEstatePathway.id, priority: 2 },
      { seekerId: omarSeeker.id, pathwayId: agriculturePathway.id, priority: 1 },
      { seekerId: omarSeeker.id, pathwayId: researchPathway.id, priority: 2 },
      { seekerId: pennySeeker.id, pathwayId: technologyPathway.id, priority: 1 },
      { seekerId: pennySeeker.id, pathwayId: financePathway.id, priority: 2 },
      { seekerId: quinnSeeker.id, pathwayId: tourismPathway.id, priority: 1 },
      { seekerId: quinnSeeker.id, pathwayId: conservationPathway.id, priority: 2 },
      { seekerId: rosaSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: rosaSeeker.id, pathwayId: manufacturingPathway.id, priority: 2 },
      { seekerId: sanjaySeeker.id, pathwayId: technologyPathway.id, priority: 1 },
      { seekerId: sanjaySeeker.id, pathwayId: energyPathway.id, priority: 2 },
      { seekerId: taraSeeker.id, pathwayId: policyPathway.id, priority: 1 },
      { seekerId: taraSeeker.id, pathwayId: waterPathway.id, priority: 2 },
      { seekerId: victorSeeker.id, pathwayId: agriculturePathway.id, priority: 1 },
      { seekerId: victorSeeker.id, pathwayId: educationPathway.id, priority: 2 },
      { seekerId: wendySeeker.id, pathwayId: financePathway.id, priority: 1 },
      { seekerId: wendySeeker.id, pathwayId: technologyPathway.id, priority: 2 },
      { seekerId: xavierSeeker.id, pathwayId: transportationPathway.id, priority: 1 },
      { seekerId: xavierSeeker.id, pathwayId: energyPathway.id, priority: 2 },
      { seekerId: yukiSeeker.id, pathwayId: conservationPathway.id, priority: 1 },
      { seekerId: yukiSeeker.id, pathwayId: waterPathway.id, priority: 2 },
      { seekerId: zaraSeeker.id, pathwayId: financePathway.id, priority: 1 },
      { seekerId: zaraSeeker.id, pathwayId: technologyPathway.id, priority: 2 },
      { seekerId: amberSeeker.id, pathwayId: mediaPathway.id, priority: 1 },
      { seekerId: amberSeeker.id, pathwayId: artsCulturePathway.id, priority: 2 },
      { seekerId: brianSeeker.id, pathwayId: constructionPathway.id, priority: 1 },
      { seekerId: brianSeeker.id, pathwayId: energyPathway.id, priority: 2 },
      { seekerId: camilleSeeker.id, pathwayId: urbanPlanningPathway.id, priority: 1 },
      { seekerId: camilleSeeker.id, pathwayId: policyPathway.id, priority: 2 },
      { seekerId: danteSeeker.id, pathwayId: policyPathway.id, priority: 1 },
      { seekerId: danteSeeker.id, pathwayId: educationPathway.id, priority: 2 },
      { seekerId: evaSeeker.id, pathwayId: forestryPathway.id, priority: 1 },
      { seekerId: evaSeeker.id, pathwayId: conservationPathway.id, priority: 2 },
      { seekerId: finnSeeker.id, pathwayId: manufacturingPathway.id, priority: 1 },
      { seekerId: finnSeeker.id, pathwayId: wasteManagementPathway.id, priority: 2 },
      { seekerId: graceSeeker.id, pathwayId: energyPathway.id, priority: 1 },
      { seekerId: graceSeeker.id, pathwayId: policyPathway.id, priority: 2 },
      { seekerId: hassanSeeker.id, pathwayId: transportationPathway.id, priority: 1 },
      { seekerId: hassanSeeker.id, pathwayId: manufacturingPathway.id, priority: 2 },
      { seekerId: irisSeeker.id, pathwayId: tourismPathway.id, priority: 1 },
      { seekerId: irisSeeker.id, pathwayId: conservationPathway.id, priority: 2 },
      { seekerId: jamesSeeker.id, pathwayId: forestryPathway.id, priority: 1 },
      { seekerId: jamesSeeker.id, pathwayId: conservationPathway.id, priority: 2 },
      { seekerId: keikoSeeker.id, pathwayId: artsCulturePathway.id, priority: 1 },
      { seekerId: keikoSeeker.id, pathwayId: mediaPathway.id, priority: 2 },
    ],
  });

  console.log("  Seeker Pathway Interests: 84 connections");

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
      greenSkills: [
        "ESG Reporting",
        "GHG Protocol",
        "TCFD",
        "Sustainability Metrics",
        "Data Analysis",
      ],
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
      impactDescription:
        "Protect and restore critical watersheds serving over 1 million residents.",
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

  // --- New jobs for Verdant Systems ---
  const wasteReductionJob = await prisma.job.create({
    data: {
      title: "Waste Reduction Analyst",
      slug: "waste-reduction-analyst",
      description:
        "Analyze supply chain waste data and recommend circular economy interventions. Build dashboards to track material flows and identify opportunities for waste diversion and material recovery.",
      location: "Portland, OR",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 70000,
      salaryMax: 90000,
      salaryCurrency: "USD",
      climateCategory: "Circular Economy",
      impactDescription:
        "Help divert 10,000+ tons of waste from landfills annually through data-driven interventions.",
      requiredCerts: [],
      greenSkills: [
        "Waste Auditing",
        "Lifecycle Assessment",
        "Supply Chain Sustainability",
        "Data Analysis",
      ],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-25"),
      closesAt: new Date("2025-04-15"),
      organizationId: verdantSystems.id,
      pathwayId: wasteManagementPathway.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      isFeatured: true,
    },
  });

  const materialsEngineerJob = await prisma.job.create({
    data: {
      title: "Sustainable Materials Engineer",
      slug: "sustainable-materials-engineer",
      description:
        "Research and develop bio-based and recyclable materials to replace single-use plastics in packaging. Collaborate with manufacturing partners to scale sustainable alternatives.",
      location: "Portland, OR",
      locationType: LocationType.ONSITE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 90000,
      salaryMax: 120000,
      salaryCurrency: "USD",
      climateCategory: "Circular Economy",
      impactDescription:
        "Eliminate 500+ tons of single-use plastic per year through material innovation.",
      requiredCerts: [],
      greenSkills: [
        "Materials Science",
        "Lifecycle Assessment",
        "Bio-based Materials",
        "Polymer Chemistry",
      ],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-28"),
      organizationId: verdantSystems.id,
      pathwayId: manufacturingPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: false,
    },
  });

  // --- New jobs for TerraWatt Industries ---
  const batteryEngineerJob = await prisma.job.create({
    data: {
      title: "Battery Systems Engineer",
      slug: "battery-systems-engineer",
      description:
        "Design and optimize grid-scale lithium-ion and solid-state battery storage systems. Work with the R&D team to improve energy density, cycle life, and thermal management for utility-scale deployments.",
      location: "Boston, MA",
      locationType: LocationType.ONSITE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 110000,
      salaryMax: 145000,
      salaryCurrency: "USD",
      climateCategory: "Energy Storage",
      impactDescription:
        "Enable 2GW of renewable energy storage capacity, eliminating millions of tons of CO2 from fossil peaker plants.",
      requiredCerts: [],
      greenSkills: [
        "Battery Technology",
        "Energy Storage",
        "Electrochemistry",
        "Thermal Management",
      ],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-20"),
      closesAt: new Date("2025-03-31"),
      organizationId: terraWatt.id,
      pathwayId: energyPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: true,
    },
  });

  const gridAnalystJob = await prisma.job.create({
    data: {
      title: "Grid Integration Analyst",
      slug: "grid-integration-analyst",
      description:
        "Model and analyze the integration of battery storage with electrical grid infrastructure. Support utility partnerships by preparing interconnection studies and capacity planning reports.",
      location: "Boston, MA",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 80000,
      salaryMax: 105000,
      salaryCurrency: "USD",
      climateCategory: "Energy Storage",
      impactDescription:
        "Accelerate grid decarbonization by optimizing battery storage placement and dispatch.",
      requiredCerts: [],
      greenSkills: ["Grid Modeling", "Power Systems", "Energy Markets", "CAISO/PJM"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-22"),
      organizationId: terraWatt.id,
      pathwayId: energyPathway.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      isFeatured: false,
    },
  });

  // --- New jobs for Evergreen Tech ---
  const conservationTechJob = await prisma.job.create({
    data: {
      title: "Conservation Technology Specialist",
      slug: "conservation-technology-specialist",
      description:
        "Deploy and maintain remote sensing equipment (drones, camera traps, acoustic sensors) for wildlife monitoring. Manage data pipelines that feed into AI-powered species identification models.",
      location: "Denver, CO",
      locationType: LocationType.HYBRID,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 75000,
      salaryMax: 95000,
      salaryCurrency: "USD",
      climateCategory: "Conservation Tech",
      impactDescription:
        "Monitor and protect over 2 million acres of critical habitat using cutting-edge technology.",
      requiredCerts: ["FAA Part 107 Drone Pilot"],
      greenSkills: ["Remote Sensing", "Wildlife Monitoring", "GIS", "Drone Operations"],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-24"),
      organizationId: evergreenTech.id,
      pathwayId: conservationPathway.id,
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      isFeatured: true,
    },
  });

  const ecosystemDataJob = await prisma.job.create({
    data: {
      title: "Ecosystem Data Scientist",
      slug: "ecosystem-data-scientist",
      description:
        "Build machine learning models to analyze biodiversity data from remote sensing, eDNA, and acoustic monitoring. Translate complex ecological datasets into actionable conservation strategies.",
      location: "Remote",
      locationType: LocationType.REMOTE,
      employmentType: EmploymentType.FULL_TIME,
      salaryMin: 100000,
      salaryMax: 135000,
      salaryCurrency: "USD",
      climateCategory: "Conservation Tech",
      impactDescription:
        "Our AI models have identified 15 previously unknown endangered species populations.",
      requiredCerts: [],
      greenSkills: [
        "Machine Learning",
        "Ecological Modeling",
        "Remote Sensing",
        "Python",
        "Biodiversity Assessment",
      ],
      status: JobStatus.PUBLISHED,
      publishedAt: new Date("2025-01-26"),
      organizationId: evergreenTech.id,
      pathwayId: researchPathway.id,
      experienceLevel: ExperienceLevel.SENIOR,
      isFeatured: true,
    },
  });

  console.log("  Jobs: 15 (14 published, 1 draft) — across 5 organizations");

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
        gaps: ["Limited direct ESG reporting experience", "No TCFD experience mentioned"],
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

  // --- New applications for expanded user base ---

  // Aisha applied to Water Resources Engineer (strong match)
  await prisma.application.create({
    data: {
      seekerId: aishaSeeker.id,
      jobId: waterEngineerJob.id,
      stage: "screening",
      stageOrder: 0,
      matchScore: 84,
      matchReasons: JSON.stringify({
        strengths: [
          "Marine biology background",
          "Water conservation experience",
          "Field research skills",
        ],
        gaps: ["No PE License", "Limited engineering design experience"],
        overallAssessment:
          "Strong environmental science background. Would benefit from mentorship on engineering aspects.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Ben applied to Climate Software Engineer (excellent match)
  const app6 = await prisma.application.create({
    data: {
      seekerId: benSeeker.id,
      jobId: climateEngineerJob.id,
      stage: "technical",
      stageOrder: 1,
      matchScore: 90,
      matchReasons: JSON.stringify({
        strengths: [
          "10 years software engineering",
          "Full-stack TypeScript/React",
          "Cloud architecture experience",
        ],
        gaps: ["No direct climate tech experience", "Career changer from fintech"],
        overallAssessment:
          "Excellent technical match. Strong motivation to transition into climate tech.",
      }),
      source: "LinkedIn",
    },
  });

  // Fatima applied to ESG Data Analyst (great match)
  await prisma.application.create({
    data: {
      seekerId: fatimaSeeker.id,
      jobId: esgAnalystJob.id,
      stage: "applied",
      stageOrder: 2,
      matchScore: 82,
      matchReasons: JSON.stringify({
        strengths: [
          "MBA with sustainability focus",
          "ESG reporting knowledge",
          "Financial analysis skills",
        ],
        gaps: ["Less hands-on data visualization experience", "Limited Python skills"],
        overallAssessment: "Strong business and ESG background. Could grow quickly in this role.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Gabriel applied to Conservation Crew (good match)
  await prisma.application.create({
    data: {
      seekerId: gabrielSeeker.id,
      jobId: conservationJob.id,
      stage: "screening",
      stageOrder: 1,
      matchScore: 72,
      matchReasons: JSON.stringify({
        strengths: ["Outdoor experience", "Physical fitness", "Passion for conservation"],
        gaps: ["No formal ecology training", "Career changer from hospitality"],
        overallAssessment:
          "Motivated career changer with relevant outdoor skills. Good entry-level candidate.",
      }),
      source: "Referral",
    },
  });

  // Hannah applied to Ecosystem Data Scientist (strong match)
  await prisma.application.create({
    data: {
      seekerId: hannahSeeker.id,
      jobId: ecosystemDataJob.id,
      stage: "applied",
      stageOrder: 0,
      matchScore: 88,
      matchReasons: JSON.stringify({
        strengths: [
          "PhD in ecology",
          "Machine learning experience",
          "Published biodiversity research",
        ],
        gaps: ["Limited industry experience", "Academic background only"],
        overallAssessment:
          "Outstanding academic credentials. Would be a strong hire for ML-driven conservation.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Jasmine applied to Policy Analyst (excellent match)
  await prisma.application.create({
    data: {
      seekerId: jasmineSeeker.id,
      jobId: policyAnalystJob.id,
      stage: "applied",
      stageOrder: 1,
      matchScore: 86,
      matchReasons: JSON.stringify({
        strengths: [
          "Environmental law background",
          "Policy research experience",
          "Strong writing skills",
        ],
        gaps: ["Limited quantitative analysis", "No legislative experience"],
        overallAssessment:
          "Excellent policy foundation with strong legal background. High potential.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Marcus applied to Battery Systems Engineer (good match)
  await prisma.application.create({
    data: {
      seekerId: marcusSeeker.id,
      jobId: batteryEngineerJob.id,
      stage: "screening",
      stageOrder: 0,
      matchScore: 79,
      matchReasons: JSON.stringify({
        strengths: [
          "Electrical engineering degree",
          "Power systems knowledge",
          "5 years energy sector experience",
        ],
        gaps: ["Limited battery-specific experience", "No electrochemistry background"],
        overallAssessment:
          "Solid engineering foundation. Could transition well with focused training on battery systems.",
      }),
      source: "LinkedIn",
    },
  });

  // Penny applied to Conservation Tech Specialist (strong match)
  await prisma.application.create({
    data: {
      seekerId: pennySeeker.id,
      jobId: conservationTechJob.id,
      stage: "technical",
      stageOrder: 0,
      matchScore: 91,
      matchReasons: JSON.stringify({
        strengths: [
          "FAA Part 107 certified",
          "GIS expertise",
          "Remote sensing experience",
          "Conservation biology degree",
        ],
        gaps: ["Limited AI/ML experience"],
        overallAssessment:
          "Near-perfect match. Has both the technical drone skills and conservation background.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Sanjay applied to Grid Integration Analyst (good match)
  await prisma.application.create({
    data: {
      seekerId: sanjaySeeker.id,
      jobId: gridAnalystJob.id,
      stage: "applied",
      stageOrder: 0,
      matchScore: 76,
      matchReasons: JSON.stringify({
        strengths: [
          "Power systems coursework",
          "Strong quantitative skills",
          "Python and MATLAB proficiency",
        ],
        gaps: ["Recent graduate", "No industry experience yet", "No CAISO/PJM knowledge"],
        overallAssessment: "Promising entry-level candidate with relevant academic background.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Wendy applied to Waste Reduction Analyst (great match)
  await prisma.application.create({
    data: {
      seekerId: wendySeeker.id,
      jobId: wasteReductionJob.id,
      stage: "screening",
      stageOrder: 0,
      matchScore: 85,
      matchReasons: JSON.stringify({
        strengths: [
          "Supply chain management experience",
          "Data analysis skills",
          "Sustainability certification",
        ],
        gaps: ["No waste auditing experience specifically"],
        overallAssessment:
          "Strong analytical background with relevant sustainability experience. Good cultural fit.",
      }),
      source: "LinkedIn",
    },
  });

  // Brian applied to Sustainable Materials Engineer (moderate match)
  await prisma.application.create({
    data: {
      seekerId: brianSeeker.id,
      jobId: materialsEngineerJob.id,
      stage: "applied",
      stageOrder: 0,
      matchScore: 68,
      matchReasons: JSON.stringify({
        strengths: [
          "Chemical engineering degree",
          "Lab research experience",
          "Passion for sustainability",
        ],
        gaps: [
          "Limited materials science focus",
          "No bio-based materials experience",
          "Only 2 years experience",
        ],
        overallAssessment:
          "Entry-level candidate with potential. Would need significant mentoring for this senior role.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Camille applied to Climate Data Scientist (excellent match)
  await prisma.application.create({
    data: {
      seekerId: camilleSeeker.id,
      jobId: climateResearcherJob.id,
      stage: "screening",
      stageOrder: 0,
      matchScore: 93,
      matchReasons: JSON.stringify({
        strengths: [
          "PhD in atmospheric science",
          "Published ML research",
          "Python/R expertise",
          "Climate modeling experience",
        ],
        gaps: ["Limited industry experience"],
        overallAssessment:
          "Outstanding candidate. Academic research directly applicable to role requirements.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Eva applied to Regenerative Agriculture Manager (good match)
  await prisma.application.create({
    data: {
      seekerId: evaSeeker.id,
      jobId: sustainableFarmerJob.id,
      stage: "applied",
      stageOrder: 0,
      matchScore: 77,
      matchReasons: JSON.stringify({
        strengths: [
          "Organic farming certification",
          "3 years regenerative ag experience",
          "Soil health knowledge",
        ],
        gaps: ["No management experience", "Smaller scale operations only"],
        overallAssessment:
          "Good hands-on experience. Could grow into the management aspects with support.",
      }),
      source: "Referral",
    },
  });

  // Finn applied to Solar Installation Engineer (strong match)
  await prisma.application.create({
    data: {
      seekerId: finnSeeker.id,
      jobId: solarEngineerJob.id,
      stage: "screening",
      stageOrder: 2,
      matchScore: 81,
      matchReasons: JSON.stringify({
        strengths: ["NABCEP certified", "4 years commercial solar", "OSHA 30 certified"],
        gaps: ["Less project management experience", "No team leadership beyond 4 people"],
        overallAssessment:
          "Strong technical candidate. Growing into leadership. Good mid-level fit.",
      }),
      source: "Green Jobs Board",
    },
  });

  // Grace applied to ESG Data Analyst (strong match)
  await prisma.application.create({
    data: {
      seekerId: graceSeeker.id,
      jobId: esgAnalystJob.id,
      stage: "applied",
      stageOrder: 3,
      matchScore: 83,
      matchReasons: JSON.stringify({
        strengths: [
          "Data science background",
          "Sustainability reporting experience",
          "Strong Python/SQL skills",
        ],
        gaps: ["No formal ESG certification", "Limited GHG Protocol exposure"],
        overallAssessment:
          "Strong analytical skills with growing ESG knowledge. High-potential candidate.",
      }),
      source: "LinkedIn",
    },
  });

  console.log("  Applications: 20 created");

  // ============ MENTOR ASSIGNMENTS ============
  // Carlos (mentor, seeker with isMentor=true) is mentoring Ryan (mentee)

  await prisma.mentorAssignment.create({
    data: {
      mentorId: carlosSeeker.id,
      menteeId: ryanSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes:
        "Carlos is helping Ryan understand the practical side of renewable energy field work to complement his data skills.",
    },
  });

  // Fatima (mentor) mentoring Aisha on climate finance pathways
  await prisma.mentorAssignment.create({
    data: {
      mentorId: fatimaSeeker.id,
      menteeId: aishaSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes:
        "Fatima is guiding Aisha on transitioning from marine biology to water policy and sustainable finance.",
    },
  });

  // Jasmine (mentor) mentoring Jasmine -> not herself, mentoring Lucia on policy career paths
  await prisma.mentorAssignment.create({
    data: {
      mentorId: jasmineSeeker.id,
      menteeId: luciaSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes: "Jasmine is helping Lucia navigate environmental law and policy career options.",
    },
  });

  // Marcus (mentor) mentoring David on energy sector careers
  await prisma.mentorAssignment.create({
    data: {
      mentorId: marcusSeeker.id,
      menteeId: davidSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes:
        "Marcus is sharing his electrical engineering and energy sector experience with David.",
    },
  });

  // Wendy (mentor) mentoring Gabriel on supply chain sustainability
  await prisma.mentorAssignment.create({
    data: {
      mentorId: wendySeeker.id,
      menteeId: gabrielSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes:
        "Wendy is mentoring Gabriel on how to break into sustainability from a non-traditional background.",
    },
  });

  // Brian (mentor) mentoring Sanjay on energy engineering careers
  await prisma.mentorAssignment.create({
    data: {
      mentorId: brianSeeker.id,
      menteeId: sanjaySeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes:
        "Brian is helping Sanjay prepare for his first role in the energy sector after graduation.",
    },
  });

  // Finn (mentor) mentoring Kai on solar industry entry
  await prisma.mentorAssignment.create({
    data: {
      mentorId: finnSeeker.id,
      menteeId: kaiSeeker.id,
      status: MentorshipStatus.ACTIVE,
      notes:
        "Finn shares hands-on solar installation knowledge and helps Kai plan NABCEP certification path.",
    },
  });

  console.log(
    "  Mentor Assignments: 7 (Carlos, Fatima, Jasmine, Marcus, Wendy, Brian, Finn mentoring)"
  );

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
        communication: {
          score: 4,
          notes: "Clear communicator, good at explaining complex concepts",
        },
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
        leadershipExperience: {
          score: 4,
          notes: "Good track record but wants more strategic scope",
        },
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
        technicalSkills: {
          score: 3,
          notes: "Strong data skills, limited ESG-specific tooling experience",
        },
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
      description:
        "City-based sustainability roles for those who want to make an impact without leaving the urban jungle. From green building to urban farming, these jobs let you transform cities from the inside.",
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
      description:
        "Roles focused on global climate challenges. Work on international climate policy, cross-border conservation, and solutions that scale across continents.",
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
      description:
        "Sports meets sustainability! From stadium greening to sustainable sporting goods, these roles combine athletic passion with environmental impact.",
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
      description:
        "Education and research roles for those who want to shape the next generation of climate leaders. Teach, research, and inspire.",
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
      {
        collectionId: planetWideSolutionsCollection.id,
        jobId: policyAnalystJob.id,
        displayOrder: 1,
      },
      {
        collectionId: planetWideSolutionsCollection.id,
        jobId: conservationJob.id,
        displayOrder: 2,
      },
      {
        collectionId: planetWideSolutionsCollection.id,
        jobId: climateResearcherJob.id,
        displayOrder: 3,
      },
      // Knowledge Builders - research & education
      { collectionId: knowledgeBuildersCollection.id, jobId: esgAnalystJob.id, displayOrder: 1 },
      {
        collectionId: knowledgeBuildersCollection.id,
        jobId: climateResearcherJob.id,
        displayOrder: 2,
      },
      // Urban Dwellers - add new city-based roles
      { collectionId: urbanDwellersCollection.id, jobId: wasteReductionJob.id, displayOrder: 4 },
      { collectionId: urbanDwellersCollection.id, jobId: gridAnalystJob.id, displayOrder: 5 },
      // Planet-wide Solutions - add new conservation tech
      {
        collectionId: planetWideSolutionsCollection.id,
        jobId: conservationTechJob.id,
        displayOrder: 4,
      },
      {
        collectionId: planetWideSolutionsCollection.id,
        jobId: ecosystemDataJob.id,
        displayOrder: 5,
      },
      // Knowledge Builders - add new research roles
      { collectionId: knowledgeBuildersCollection.id, jobId: ecosystemDataJob.id, displayOrder: 3 },
      {
        collectionId: knowledgeBuildersCollection.id,
        jobId: batteryEngineerJob.id,
        displayOrder: 4,
      },
      // It's Game Time - placeholder (no sports jobs yet)
    ],
  });

  console.log(
    "  Collections: 4 created (Urban Dwellers, Planet-wide Solutions, Game Time, Knowledge Builders)"
  );

  // ============ GOALS ============
  // Career goals for seekers

  const mayaGoal1 = await prisma.goal.create({
    data: {
      seekerId: mayaSeeker.id,
      title: "Complete technical interview preparation",
      description:
        "Prepare for the Solaris Energy technical interview by reviewing solar PV design principles and practicing system sizing calculations.",
      icon: "Target",
      progress: 75,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-02-15"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { goalId: mayaGoal1.id, title: "Review NEC code requirements", completed: true, order: 1 },
      {
        goalId: mayaGoal1.id,
        title: "Practice system sizing calculations",
        completed: true,
        order: 2,
      },
      {
        goalId: mayaGoal1.id,
        title: "Prepare project portfolio presentation",
        completed: true,
        order: 3,
      },
      { goalId: mayaGoal1.id, title: "Mock interview with mentor", completed: false, order: 4 },
    ],
  });

  await prisma.goal.create({
    data: {
      seekerId: ryanSeeker.id,
      title: "Learn to scan and negotiate an offer letter",
      description:
        "Understand the key components of job offers in the ESG space and practice negotiation techniques.",
      icon: "FileText",
      progress: 30,
      status: GoalStatus.ACTIVE,
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: ryanSeeker.id,
      title: "Message network for potential roles",
      description:
        "Reach out to 10 contacts in my network who work in sustainability to learn about opportunities.",
      icon: "Users",
      progress: 50,
      status: GoalStatus.ACTIVE,
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: priyaSeeker.id,
      title: "Improve job interview skills",
      description:
        "Practice behavioral interview questions and prepare STAR stories from my climate tech experience.",
      icon: "ChatCircle",
      progress: 60,
      status: GoalStatus.ACTIVE,
    },
  });

  // More goals for new seekers
  const aishaGoal = await prisma.goal.create({
    data: {
      seekerId: aishaSeeker.id,
      title: "Earn water resources certification",
      description:
        "Complete the Association of State Floodplain Managers certification to strengthen my water resources credentials.",
      icon: "Certificate",
      progress: 40,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-06-01"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      { goalId: aishaGoal.id, title: "Register for ASFPM exam", completed: true, order: 1 },
      { goalId: aishaGoal.id, title: "Complete online study modules", completed: true, order: 2 },
      { goalId: aishaGoal.id, title: "Take practice exam", completed: false, order: 3 },
      { goalId: aishaGoal.id, title: "Pass certification exam", completed: false, order: 4 },
    ],
  });

  await prisma.goal.create({
    data: {
      seekerId: benSeeker.id,
      title: "Build climate tech portfolio projects",
      description:
        "Create 2-3 open source projects demonstrating climate tech skills to strengthen job applications.",
      icon: "Code",
      progress: 65,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-03-15"),
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: gabrielSeeker.id,
      title: "Complete wilderness first responder training",
      description: "Get WFR certified to be more competitive for conservation fieldwork positions.",
      icon: "FirstAidKit",
      progress: 20,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-05-01"),
    },
  });

  const hannahGoal = await prisma.goal.create({
    data: {
      seekerId: hannahSeeker.id,
      title: "Transition from academia to industry",
      description:
        "Translate my PhD research into industry-relevant experience and build a professional network outside academia.",
      icon: "Briefcase",
      progress: 45,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-04-30"),
    },
  });

  await prisma.milestone.createMany({
    data: [
      {
        goalId: hannahGoal.id,
        title: "Update resume for industry format",
        completed: true,
        order: 1,
      },
      {
        goalId: hannahGoal.id,
        title: "Attend 3 industry networking events",
        completed: true,
        order: 2,
      },
      {
        goalId: hannahGoal.id,
        title: "Complete informational interviews (5/5)",
        completed: false,
        order: 3,
      },
      { goalId: hannahGoal.id, title: "Apply to 10 industry roles", completed: false, order: 4 },
    ],
  });

  await prisma.goal.create({
    data: {
      seekerId: marcusSeeker.id,
      title: "Learn battery storage technology",
      description:
        "Self-study battery systems engineering to prepare for transition from general power systems to energy storage.",
      icon: "Lightning",
      progress: 55,
      status: GoalStatus.ACTIVE,
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: wendySeeker.id,
      title: "Get LEED Green Associate certification",
      description:
        "Earn LEED GA to complement my supply chain background for circular economy roles.",
      icon: "Leaf",
      progress: 80,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-02-28"),
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: camilleSeeker.id,
      title: "Publish climate ML research paper",
      description:
        "Complete and submit my research paper on ML applications in climate prediction to a peer-reviewed journal.",
      icon: "PencilSimple",
      progress: 70,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-03-31"),
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: finnSeeker.id,
      title: "Advance to NABCEP PV Design Specialist",
      description:
        "Build on existing NABCEP PV Installation Professional cert to earn the Design Specialist credential.",
      icon: "SunHorizon",
      progress: 35,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-07-01"),
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: graceSeeker.id,
      title: "Complete GRI Sustainability Reporting Standards training",
      description:
        "Finish the GRI Professional Certification Program to strengthen ESG reporting skills.",
      icon: "ChartBar",
      progress: 50,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-04-15"),
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: kaiSeeker.id,
      title: "Get OSHA 30 certification",
      description:
        "Complete OSHA 30-hour construction safety training as the first step toward a solar installation career.",
      icon: "HardHat",
      progress: 10,
      status: GoalStatus.ACTIVE,
      targetDate: new Date("2025-04-01"),
    },
  });

  await prisma.goal.create({
    data: {
      seekerId: sanjaySeeker.id,
      title: "Build power systems modeling portfolio",
      description:
        "Create 3 sample grid modeling projects using open-source tools to demonstrate skills to employers.",
      icon: "Lightning",
      progress: 25,
      status: GoalStatus.ACTIVE,
    },
  });

  console.log("  Goals: 15 created (with milestones for Maya, Aisha, Hannah)");

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
      description:
        "Led installation of 200+ commercial solar systems. Managed teams of up to 12 technicians across multi-site projects.",
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
      description:
        "Installed residential solar systems and Powerwall batteries. Completed NABCEP certification during tenure.",
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
      description:
        "Building carbon accounting platform used by Fortune 500 companies. Full-stack development with focus on data visualization.",
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
      description:
        "Analyze ESG factors for equity investments. Lead climate risk assessments using TCFD framework.",
      skills: ["ESG Analysis", "TCFD Reporting", "Climate Risk", "Financial Modeling"],
    },
  });

  // --- More work experience for new seekers ---
  await prisma.workExperience.create({
    data: {
      seekerId: aishaSeeker.id,
      companyName: "National Oceanic and Atmospheric Administration",
      jobTitle: "Marine Research Assistant",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2022-06-01"),
      isCurrent: true,
      description:
        "Conduct coastal ecosystem research and water quality monitoring. Analyze data from buoy networks and satellite imagery.",
      skills: ["Marine Biology", "Water Quality Analysis", "GIS", "R", "Field Research"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: benSeeker.id,
      companyName: "FinTech Global",
      jobTitle: "Senior Software Engineer",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.REMOTE,
      startDate: new Date("2019-01-01"),
      endDate: new Date("2024-11-30"),
      isCurrent: false,
      description:
        "Architected microservices platform handling $2B+ in annual transactions. Led team of 6 engineers.",
      skills: ["TypeScript", "React", "Node.js", "AWS", "PostgreSQL", "System Design"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: fatimaSeeker.id,
      companyName: "Deloitte",
      jobTitle: "Sustainability Consultant",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2021-09-01"),
      isCurrent: true,
      description:
        "Advise Fortune 500 clients on ESG reporting, climate risk assessment, and sustainable finance strategies.",
      skills: [
        "ESG Reporting",
        "TCFD",
        "Climate Risk",
        "Financial Analysis",
        "Stakeholder Engagement",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: hannahSeeker.id,
      companyName: "Stanford University",
      jobTitle: "PhD Research Fellow",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2020-09-01"),
      isCurrent: true,
      description:
        "Researching biodiversity loss patterns using machine learning on remote sensing data. Published 4 papers in Nature and Science.",
      skills: [
        "Machine Learning",
        "Python",
        "R",
        "Ecological Modeling",
        "Remote Sensing",
        "Scientific Writing",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: jasmineSeeker.id,
      companyName: "Earthjustice",
      jobTitle: "Legal Fellow",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2023-06-01"),
      isCurrent: true,
      description:
        "Research environmental case law, draft policy briefs, and support litigation on clean air and water regulations.",
      skills: ["Environmental Law", "Policy Research", "Legal Writing", "Regulatory Analysis"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: marcusSeeker.id,
      companyName: "National Grid",
      jobTitle: "Power Systems Engineer",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.ONSITE,
      startDate: new Date("2020-03-01"),
      isCurrent: true,
      description:
        "Design and optimize electrical grid infrastructure. Lead renewable energy interconnection projects for utility-scale solar and wind.",
      skills: [
        "Power Systems",
        "Grid Design",
        "Renewable Integration",
        "SCADA",
        "Project Management",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: pennySeeker.id,
      companyName: "The Nature Conservancy",
      jobTitle: "GIS Technician",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2021-04-01"),
      isCurrent: true,
      description:
        "Manage spatial data for conservation planning. Operate drones for habitat mapping and wildlife surveys.",
      skills: ["GIS", "ArcGIS", "Drone Operations", "Remote Sensing", "Conservation Planning"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: wendySeeker.id,
      companyName: "Patagonia",
      jobTitle: "Supply Chain Sustainability Coordinator",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2022-01-01"),
      isCurrent: true,
      description:
        "Track and improve environmental metrics across global supply chain. Lead waste reduction initiatives in manufacturing partners.",
      skills: [
        "Supply Chain Management",
        "Sustainability Metrics",
        "Waste Reduction",
        "Data Analysis",
        "Vendor Management",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: camilleSeeker.id,
      companyName: "MIT Lincoln Laboratory",
      jobTitle: "Climate Research Scientist",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.HYBRID,
      startDate: new Date("2022-08-01"),
      isCurrent: true,
      description:
        "Develop machine learning models for climate prediction and extreme weather forecasting. Collaborate with NOAA on atmospheric data analysis.",
      skills: [
        "Machine Learning",
        "Climate Modeling",
        "Python",
        "TensorFlow",
        "Atmospheric Science",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: finnSeeker.id,
      companyName: "SolarCity",
      jobTitle: "Solar Installation Specialist",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.ONSITE,
      startDate: new Date("2021-06-01"),
      isCurrent: true,
      description:
        "Install commercial solar PV systems up to 1MW capacity. Lead small installation crews and ensure NEC compliance.",
      skills: ["Solar PV Installation", "NEC Code", "Team Leadership", "System Commissioning"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: graceSeeker.id,
      companyName: "S&P Global",
      jobTitle: "Data Analyst — ESG Ratings",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.REMOTE,
      startDate: new Date("2023-01-01"),
      isCurrent: true,
      description:
        "Analyze corporate sustainability data for ESG ratings. Build automated data pipelines and quality checks for environmental metrics.",
      skills: ["Data Analysis", "Python", "SQL", "ESG Metrics", "Sustainability Reporting"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: danteSeeker.id,
      companyName: "Rivian",
      jobTitle: "Manufacturing Engineer",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.ONSITE,
      startDate: new Date("2023-03-01"),
      isCurrent: true,
      description:
        "Optimize EV manufacturing processes for sustainability. Lead initiatives to reduce production waste and energy consumption.",
      skills: [
        "Manufacturing Engineering",
        "Lean Manufacturing",
        "EV Technology",
        "Sustainability",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: evaSeeker.id,
      companyName: "Rodale Institute",
      jobTitle: "Regenerative Agriculture Technician",
      employmentType: EmploymentType.FULL_TIME,
      workType: LocationType.ONSITE,
      startDate: new Date("2022-03-01"),
      isCurrent: true,
      description:
        "Implement regenerative farming practices including cover cropping, composting, and no-till methods. Monitor soil health metrics.",
      skills: [
        "Regenerative Agriculture",
        "Soil Health",
        "Cover Cropping",
        "Composting",
        "Organic Certification",
      ],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: brianSeeker.id,
      companyName: "University of Michigan",
      jobTitle: "Graduate Research Assistant",
      employmentType: EmploymentType.PART_TIME,
      workType: LocationType.ONSITE,
      startDate: new Date("2023-09-01"),
      isCurrent: true,
      description:
        "Research sustainable polymer alternatives to single-use plastics. Lab work focused on bio-based material characterization.",
      skills: ["Chemical Engineering", "Polymer Chemistry", "Lab Research", "Materials Testing"],
    },
  });

  await prisma.workExperience.create({
    data: {
      seekerId: sanjaySeeker.id,
      companyName: "University of Texas at Austin",
      jobTitle: "Research Intern — Power Systems Lab",
      employmentType: EmploymentType.INTERNSHIP,
      workType: LocationType.ONSITE,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-08-31"),
      isCurrent: false,
      description:
        "Modeled renewable energy integration scenarios for ERCOT grid. Built simulation tools in Python and MATLAB.",
      skills: [
        "Power Systems Modeling",
        "Python",
        "MATLAB",
        "Renewable Integration",
        "Data Analysis",
      ],
    },
  });

  console.log("  Work Experience: 19 entries created");

  // ============ SAVED JOBS ============
  // Jobs saved by seekers

  await prisma.savedJob.create({
    data: {
      seekerId: ryanSeeker.id,
      jobId: esgAnalystJob.id,
      notes:
        "Great match for my data analysis background. Need to emphasize GHG Protocol experience.",
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

  // --- More saved jobs for new seekers ---
  await prisma.savedJob.create({
    data: {
      seekerId: aishaSeeker.id,
      jobId: waterEngineerJob.id,
      notes: "Applied! Perfect alignment with my marine bio background. Hope to hear back soon.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: aishaSeeker.id,
      jobId: conservationJob.id,
      notes: "Backup option - could use my field research skills here.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: benSeeker.id,
      jobId: climateEngineerJob.id,
      notes: "Applied - this is my top choice. Stack matches perfectly.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: hannahSeeker.id,
      jobId: ecosystemDataJob.id,
      notes: "Dream job! Applied. My PhD research is directly relevant.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: hannahSeeker.id,
      jobId: climateResearcherJob.id,
      notes: "Backup to Evergreen Tech. Also a great fit for my ML skills.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: marcusSeeker.id,
      jobId: batteryEngineerJob.id,
      notes: "Applied. Need to study more about battery chemistry before interview.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: marcusSeeker.id,
      jobId: gridAnalystJob.id,
      notes: "Could also apply here as fallback - more aligned with current experience.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: sanjaySeeker.id,
      jobId: gridAnalystJob.id,
      notes: "Applied! First choice after graduation. Matches my coursework.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: wendySeeker.id,
      jobId: wasteReductionJob.id,
      notes: "Applied. Great fit with my supply chain background at Patagonia.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: gabrielSeeker.id,
      jobId: conservationJob.id,
      notes: "Applied! Perfect entry-level role for my career change.",
    },
  });

  await prisma.savedJob.create({
    data: {
      seekerId: camilleSeeker.id,
      jobId: climateResearcherJob.id,
      notes: "Applied. My atmospheric science research is highly relevant.",
    },
  });

  console.log("  Saved Jobs: 15 entries created");

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
  console.log("  ├── Accounts: 50 (10 employer, 40 seeker)");
  console.log(
    "  ├── Organizations: 5 (Solaris Energy, Aurora Climate, Verdant Systems, TerraWatt, Evergreen Tech)"
  );
  console.log(
    "  ├── Pathways: 21 (matching design system - 5 green, 4 blue, 4 orange, 3 red, 2 yellow, 3 purple)"
  );
  console.log("  ├── Org Members: 10 (across 5 organizations)");
  console.log("  ├── Seeker Profiles: 40 (with careerStage, motivations)");
  console.log("  ├── Seeker Pathway Interests: 84 connections");
  console.log("  ├── Coach Profiles: 1 (Elena Volkov)");
  console.log("  ├── Jobs: 15 (14 published, 1 draft) across 5 orgs");
  console.log("  ├── Collections: 4 (with job associations)");
  console.log("  ├── Applications: 20 (with AI match scores)");
  console.log("  ├── Mentor Assignments: 7 (Carlos, Fatima, Jasmine, Marcus, Wendy, Brian, Finn)");
  console.log("  ├── Coach Assignments: 1 (Elena -> Priya)");
  console.log("  ├── Notes: 4 (3 from org members, 1 from coach)");
  console.log("  ├── Scores: 3");
  console.log("  ├── Goals: 15 (with milestones for Maya, Aisha, Hannah)");
  console.log("  ├── Work Experience: 19 entries");
  console.log("  ├── Saved Jobs: 15 entries");
  console.log("  └── Job Notes: 4 (community resources)");

  // Print login credentials table
  if (supabaseAdmin) {
    console.log(
      "\n  ╔════════════════════════════════════════════════════════════════════════════╗"
    );
    console.log("  ║                      🔑 TEST ACCOUNT CREDENTIALS                          ║");
    console.log("  ╠════════════════════════════════════════════════════════════════════════════╣");
    console.log("  ║  Password for ALL 50 accounts: TestPassword123!                           ║");
    console.log("  ╠════════════════════════════════════════════════════════════════════════════╣");
    console.log("  ║  EMPLOYERS (10 accounts across 5 organizations)                           ║");
    console.log("  ║  Solaris Energy:                                                          ║");
    console.log("  ║    ├── jordan@canopy.co              (Owner)                              ║");
    console.log("  ║    ├── alex@canopy.co                (Recruiter)                          ║");
    console.log("  ║    ├── sam@canopy.co                 (Member)                             ║");
    console.log("  ║    └── tomas@canopy.co               (Member)                             ║");
    console.log("  ║  Aurora Climate:                                                          ║");
    console.log("  ║    └── morgan@aurora-climate.canopy.co (Owner)                            ║");
    console.log("  ║  Verdant Systems:                                                         ║");
    console.log("  ║    └── dana@verdant-systems.canopy.co  (Owner)                            ║");
    console.log("  ║  TerraWatt Industries:                                                    ║");
    console.log("  ║    ├── kevin@terrawatt.canopy.co     (Owner)                              ║");
    console.log("  ║    └── nina@terrawatt.canopy.co      (Recruiter)                          ║");
    console.log("  ║  Evergreen Tech:                                                          ║");
    console.log("  ║    ├── rachel@evergreen-tech.canopy.co (Owner)                            ║");
    console.log("  ║    └── derek@evergreen-tech.canopy.co  (Member)                           ║");
    console.log("  ║                                                                            ║");
    console.log("  ║  JOB SEEKERS (40 accounts — showing key profiles)                         ║");
    console.log("  ║    ├── maya.thompson@canopy.co       (Senior, Solar Engineer)              ║");
    console.log("  ║    ├── ryan.oconnor@canopy.co        (Career Changer, Data Analyst)       ║");
    console.log("  ║    ├── priya.sharma@canopy.co        (Mid-Career, Software Eng)           ║");
    console.log("  ║    ├── carlos.mendez@canopy.co       (Entry Level, Solar Tech + Mentor)   ║");
    console.log("  ║    ├── elena.volkov@canopy.co        (Coach + Seeker, Climate Finance)    ║");
    console.log("  ║    ├── aisha.johnson@canopy.co       (Mid-Career, Marine Biology)         ║");
    console.log("  ║    ├── ben.nakamura@canopy.co        (Career Changer, Software Eng)       ║");
    console.log("  ║    ├── fatima.hassan@canopy.co       (Mid-Career, ESG + Mentor)           ║");
    console.log("  ║    ├── hannah.kim@canopy.co          (Student, Ecology PhD)               ║");
    console.log("  ║    ├── marcus.williams@canopy.co     (Senior, Power Systems + Mentor)     ║");
    console.log("  ║    └── ... + 30 more seekers (all @canopy.co)                             ║");
    console.log("  ║                                                                            ║");
    console.log("  ║  MENTORS (7 peer mentors — seekers with isMentor=true)                    ║");
    console.log("  ║    Carlos, Fatima, Jasmine, Marcus, Wendy, Brian, Finn                    ║");
    console.log("  ║                                                                            ║");
    console.log("  ║  COACH (1 professional coach)                                             ║");
    console.log("  ║    └── elena.volkov@canopy.co        (CoachProfile + SeekerProfile)       ║");
    console.log("  ╚════════════════════════════════════════════════════════════════════════════╝");
  } else {
    console.log("\n  ⚠  Accounts created with placeholder IDs (not loginable).");
    console.log(
      "     To make them loginable, add SUPABASE_SERVICE_ROLE_KEY to .env.local and re-seed."
    );
  }
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

import type {
  CandidCoach,
  CandidMentor,
  CandidSeeker,
  Session,
  Message,
  MessageThread,
  Notification,
  Resource,
} from "./types";

// Helper to create dates
const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

// ============ COACHES ============
export const coaches: CandidCoach[] = [
  {
    id: "coach-1",
    email: "sarah.chen@climate.vc",
    firstName: "Sarah",
    lastName: "Chen",
    role: "coach",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "Former McKinsey consultant turned climate investor. I help professionals transition from traditional industries into climate tech, particularly in deep tech and hardware. I've helped 50+ people make the leap.",
    linkedIn: "https://linkedin.com/in/sarahchen",
    location: "San Francisco, CA",
    timezone: "America/Los_Angeles",
    createdAt: daysAgo(180),
    isFoundingMember: true,
    sectors: ["climate-tech", "finance"],
    currentRole: "Partner",
    currentCompany: "Climate Capital",
    previousRoles: [
      { title: "Associate Partner", company: "McKinsey & Company", years: 6 },
      { title: "Investment Associate", company: "Breakthrough Energy Ventures", years: 3 },
    ],
    expertise: ["Career transitions", "VC/PE pathways", "Interview prep", "Networking strategy"],
    sessionTypes: ["coaching", "career-planning", "mock-interview"],
    hourlyRate: 150,
    monthlyRate: 400,
    availability: {
      monday: [{ start: "09:00", end: "12:00" }],
      tuesday: [{ start: "14:00", end: "17:00" }],
      wednesday: [{ start: "09:00", end: "12:00" }],
      thursday: [{ start: "14:00", end: "17:00" }],
      friday: [{ start: "10:00", end: "12:00" }],
      saturday: [],
      sunday: [],
    },
    menteeCount: 12,
    rating: 4.9,
    reviewCount: 47,
    successStories: 23,
    isFeatured: true,
  },
  {
    id: "coach-2",
    email: "marcus.johnson@doe.gov",
    firstName: "Marcus",
    lastName: "Johnson",
    role: "coach",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "20+ years in energy policy, from Capitol Hill to the Department of Energy. I specialize in helping people navigate government careers and understand the policy landscape.",
    linkedIn: "https://linkedin.com/in/marcusjohnson",
    location: "Washington, DC",
    timezone: "America/New_York",
    createdAt: daysAgo(120),
    isFoundingMember: true,
    sectors: ["policy", "clean-energy"],
    currentRole: "Senior Advisor",
    currentCompany: "Department of Energy",
    previousRoles: [
      { title: "Chief of Staff", company: "Senate Energy Committee", years: 8 },
      { title: "Policy Director", company: "Clean Air Task Force", years: 5 },
    ],
    expertise: ["Government careers", "Policy analysis", "Legislative process", "Federal hiring"],
    sessionTypes: ["coaching", "career-planning"],
    hourlyRate: 125,
    monthlyRate: 350,
    availability: {
      monday: [{ start: "18:00", end: "20:00" }],
      tuesday: [{ start: "18:00", end: "20:00" }],
      wednesday: [],
      thursday: [{ start: "18:00", end: "20:00" }],
      friday: [],
      saturday: [{ start: "10:00", end: "14:00" }],
      sunday: [],
    },
    menteeCount: 8,
    rating: 4.8,
    reviewCount: 32,
    successStories: 15,
    isFeatured: true,
  },
  {
    id: "coach-3",
    email: "elena.rodriguez@terra.com",
    firstName: "Elena",
    lastName: "Rodriguez",
    role: "coach",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    bio: "I've built sustainability programs at Fortune 500 companies and now run corporate climate strategy at a major tech company. I help people break into corporate sustainability roles.",
    linkedIn: "https://linkedin.com/in/elenarodriguez",
    location: "Seattle, WA",
    timezone: "America/Los_Angeles",
    createdAt: daysAgo(90),
    sectors: ["corporate-sustainability", "climate-tech"],
    currentRole: "Head of Climate Strategy",
    currentCompany: "Terra Technologies",
    previousRoles: [
      { title: "Director of Sustainability", company: "Microsoft", years: 4 },
      { title: "Sustainability Manager", company: "Patagonia", years: 3 },
    ],
    expertise: [
      "Corporate sustainability",
      "ESG strategy",
      "Stakeholder engagement",
      "Career pivots",
    ],
    sessionTypes: ["coaching", "career-planning", "resume-review"],
    hourlyRate: 135,
    monthlyRate: 375,
    availability: {
      monday: [{ start: "08:00", end: "10:00" }],
      tuesday: [],
      wednesday: [
        { start: "08:00", end: "10:00" },
        { start: "16:00", end: "18:00" },
      ],
      thursday: [],
      friday: [{ start: "08:00", end: "10:00" }],
      saturday: [],
      sunday: [],
    },
    menteeCount: 6,
    rating: 4.7,
    reviewCount: 24,
    successStories: 11,
    isFeatured: false,
  },
  {
    id: "coach-4",
    email: "david.okonkwo@sunpower.com",
    firstName: "David",
    lastName: "Okonkwo",
    role: "coach",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Engineer turned clean energy executive. I've helped scale solar companies from startup to IPO. I focus on helping technical professionals move into leadership roles in clean energy.",
    linkedIn: "https://linkedin.com/in/davidokonkwo",
    location: "Austin, TX",
    timezone: "America/Chicago",
    createdAt: daysAgo(60),
    sectors: ["clean-energy", "climate-tech"],
    currentRole: "VP of Engineering",
    currentCompany: "SunPower Corp",
    previousRoles: [
      { title: "Engineering Director", company: "First Solar", years: 5 },
      { title: "Senior Engineer", company: "Tesla Energy", years: 4 },
    ],
    expertise: [
      "Technical leadership",
      "Clean energy industry",
      "Engineering management",
      "Startup scaling",
    ],
    sessionTypes: ["coaching", "career-planning", "mock-interview"],
    hourlyRate: 140,
    monthlyRate: 380,
    availability: {
      monday: [{ start: "12:00", end: "14:00" }],
      tuesday: [{ start: "12:00", end: "14:00" }],
      wednesday: [{ start: "12:00", end: "14:00" }],
      thursday: [{ start: "12:00", end: "14:00" }],
      friday: [],
      saturday: [],
      sunday: [],
    },
    menteeCount: 5,
    rating: 4.9,
    reviewCount: 19,
    successStories: 8,
    isFeatured: true,
  },
  {
    id: "coach-5",
    email: "amanda.foster@greenfinance.org",
    firstName: "Amanda",
    lastName: "Foster",
    role: "coach",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Former Wall Street analyst who pivoted to climate finance. Now I help finance professionals understand how to apply their skills to climate investing and sustainable finance.",
    linkedIn: "https://linkedin.com/in/amandafoster",
    location: "New York, NY",
    timezone: "America/New_York",
    createdAt: daysAgo(45),
    sectors: ["finance", "nonprofit"],
    currentRole: "Managing Director",
    currentCompany: "Green Finance Institute",
    previousRoles: [
      { title: "VP, ESG Research", company: "Goldman Sachs", years: 6 },
      { title: "Analyst", company: "Morgan Stanley", years: 4 },
    ],
    expertise: ["Climate finance", "ESG investing", "Impact measurement", "Financial modeling"],
    sessionTypes: ["coaching", "career-planning", "resume-review"],
    hourlyRate: 160,
    monthlyRate: 450,
    availability: {
      monday: [],
      tuesday: [{ start: "07:00", end: "09:00" }],
      wednesday: [],
      thursday: [{ start: "07:00", end: "09:00" }],
      friday: [],
      saturday: [{ start: "09:00", end: "12:00" }],
      sunday: [],
    },
    menteeCount: 9,
    rating: 4.8,
    reviewCount: 36,
    successStories: 17,
    isFeatured: false,
  },
];

// ============ MENTORS ============
export const mentors: CandidMentor[] = [
  {
    id: "mentor-1",
    email: "jordan.lee@rivian.com",
    firstName: "Jordan",
    lastName: "Lee",
    role: "mentor",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Made the switch from automotive to EV industry 2 years ago. Happy to share my journey and help with resume reviews for anyone looking to break into clean transportation.",
    linkedIn: "https://linkedin.com/in/jordanlee",
    location: "Irvine, CA",
    timezone: "America/Los_Angeles",
    createdAt: daysAgo(60),
    sectors: ["transportation", "climate-tech"],
    currentRole: "Product Manager",
    currentCompany: "Rivian",
    expertise: ["Product management", "EV industry", "Career transitions"],
    availableFor: ["resume-review", "q-and-a", "peer-support"],
    menteeCount: 8,
    rating: 4.7,
    reviewCount: 12,
  },
  {
    id: "mentor-2",
    email: "priya.sharma@wri.org",
    firstName: "Priya",
    lastName: "Sharma",
    role: "mentor",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Research analyst at World Resources Institute. I transitioned from academia to think tanks and love helping researchers find impactful climate roles.",
    linkedIn: "https://linkedin.com/in/priyasharma",
    location: "Washington, DC",
    timezone: "America/New_York",
    createdAt: daysAgo(45),
    sectors: ["policy", "nonprofit"],
    currentRole: "Research Analyst",
    currentCompany: "World Resources Institute",
    expertise: ["Research careers", "Think tanks", "Academic transitions"],
    availableFor: ["resume-review", "mock-interview", "q-and-a"],
    menteeCount: 5,
    rating: 4.8,
    reviewCount: 8,
  },
  {
    id: "mentor-3",
    email: "alex.thompson@carbonplan.org",
    firstName: "Alex",
    lastName: "Thompson",
    role: "mentor",
    avatar:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    bio: "Data scientist focused on carbon removal research. Former software engineer who made the climate pivot. I help tech folks understand where their skills fit in climate.",
    linkedIn: "https://linkedin.com/in/alexthompson",
    location: "Oakland, CA",
    timezone: "America/Los_Angeles",
    createdAt: daysAgo(30),
    sectors: ["climate-tech", "nonprofit"],
    currentRole: "Data Scientist",
    currentCompany: "CarbonPlan",
    expertise: ["Data science", "Tech to climate", "Open source"],
    availableFor: ["resume-review", "q-and-a", "peer-support"],
    menteeCount: 11,
    rating: 4.9,
    reviewCount: 15,
  },
];

// ============ SEEKERS ============
export const seekers: CandidSeeker[] = [
  {
    id: "seeker-1",
    email: "jamie.wilson@gmail.com",
    firstName: "Jamie",
    lastName: "Wilson",
    role: "seeker",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    bio: "Marketing professional looking to transition into climate tech. Passionate about using storytelling to drive climate action.",
    location: "Los Angeles, CA",
    timezone: "America/Los_Angeles",
    createdAt: daysAgo(30),
    isFoundingMember: true,
    targetSectors: ["climate-tech", "corporate-sustainability"],
    currentRole: "Marketing Manager",
    currentCompany: "Spotify",
    yearsExperience: 5,
    goals: [
      "Find a climate-focused role within 6 months",
      "Build network in sustainability space",
      "Understand corporate sustainability landscape",
    ],
    skills: ["Brand strategy", "Content marketing", "Stakeholder communication", "Data analytics"],
    cohort: "January 2025",
    matchedCoachId: "coach-1",
    matchedMentorIds: ["mentor-1"],
  },
  {
    id: "seeker-2",
    email: "michael.chen@outlook.com",
    firstName: "Michael",
    lastName: "Chen",
    role: "seeker",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    bio: "Finance professional with 8 years in investment banking. Ready to apply my skills to climate finance and impact investing.",
    location: "New York, NY",
    timezone: "America/New_York",
    createdAt: daysAgo(21),
    isFoundingMember: true,
    targetSectors: ["finance", "climate-tech"],
    currentRole: "Vice President",
    currentCompany: "J.P. Morgan",
    yearsExperience: 8,
    goals: [
      "Transition to climate-focused fund",
      "Understand climate finance landscape",
      "Build relationships with climate investors",
    ],
    skills: ["Financial modeling", "Due diligence", "Deal structuring", "Investor relations"],
    cohort: "January 2025",
    matchedCoachId: "coach-5",
  },
  {
    id: "seeker-3",
    email: "sofia.martinez@gmail.com",
    firstName: "Sofia",
    lastName: "Martinez",
    role: "seeker",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Environmental science graduate looking to break into climate policy. Interned at EPA and passionate about environmental justice.",
    location: "Denver, CO",
    timezone: "America/Denver",
    createdAt: daysAgo(14),
    targetSectors: ["policy", "nonprofit"],
    currentRole: "Recent Graduate",
    yearsExperience: 1,
    goals: [
      "Land first full-time policy role",
      "Understand federal hiring process",
      "Build DC network",
    ],
    skills: ["Policy research", "Data analysis", "Technical writing", "Stakeholder engagement"],
    cohort: "January 2025",
    matchedCoachId: "coach-2",
    matchedMentorIds: ["mentor-2"],
  },
];

// Current user (for demo - logged in as seeker)
export const currentUser = seekers[0];

// ============ SESSIONS ============
export const sessions: Session[] = [
  // Upcoming sessions
  {
    id: "session-1",
    menteeId: "seeker-1",
    mentorId: "coach-1",
    mentorRole: "coach",
    type: "coaching",
    status: "scheduled",
    scheduledAt: daysFromNow(2),
    duration: 60,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Discuss target companies and networking strategy for climate tech roles",
  },
  {
    id: "session-2",
    menteeId: "seeker-1",
    mentorId: "mentor-1",
    mentorRole: "mentor",
    type: "resume-review",
    status: "scheduled",
    scheduledAt: daysFromNow(5),
    duration: 30,
    meetingLink: "https://meet.google.com/klm-nopq-rst",
    notes: "Review updated resume with climate focus",
  },
  {
    id: "session-3",
    menteeId: "seeker-2",
    mentorId: "coach-5",
    mentorRole: "coach",
    type: "career-planning",
    status: "scheduled",
    scheduledAt: daysFromNow(1),
    duration: 60,
    meetingLink: "https://meet.google.com/uvw-xyz-123",
  },
  // Completed sessions
  {
    id: "session-4",
    menteeId: "seeker-1",
    mentorId: "coach-1",
    mentorRole: "coach",
    type: "coaching",
    status: "completed",
    scheduledAt: daysAgo(7),
    duration: 60,
    notes: "Intro session - discussed background, goals, and created 90-day action plan",
    feedback: {
      rating: 5,
      comment:
        "Sarah was incredibly helpful! She gave me a clear framework for thinking about my transition and specific companies to target.",
      wouldRecommend: true,
      submittedAt: daysAgo(6),
    },
  },
  {
    id: "session-5",
    menteeId: "seeker-1",
    mentorId: "coach-1",
    mentorRole: "coach",
    type: "mock-interview",
    status: "completed",
    scheduledAt: daysAgo(14),
    duration: 60,
    notes: "Mock interview for sustainability marketing role",
    feedback: {
      rating: 5,
      comment: "Great practice session. The feedback on my storytelling was exactly what I needed.",
      wouldRecommend: true,
      submittedAt: daysAgo(13),
    },
  },
];

// ============ MESSAGES ============
export const messageThreads: MessageThread[] = [
  {
    id: "thread-1",
    participantIds: ["seeker-1", "coach-1"],
    unreadCount: 2,
    createdAt: daysAgo(30),
    updatedAt: daysAgo(0),
  },
  {
    id: "thread-2",
    participantIds: ["seeker-1", "mentor-1"],
    unreadCount: 0,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(2),
  },
];

export const messages: Message[] = [
  // Thread 1: Seeker-1 with Coach-1
  {
    id: "msg-1",
    threadId: "thread-1",
    senderId: "coach-1",
    content:
      "Hi Jamie! Looking forward to our first session. Before we meet, could you send me your current resume and a list of 5-10 companies you're interested in?",
    createdAt: daysAgo(8),
    readAt: daysAgo(8),
  },
  {
    id: "msg-2",
    threadId: "thread-1",
    senderId: "seeker-1",
    content:
      "Hi Sarah! So excited to work with you. I've attached my resume. For companies, I'm looking at: Watershed, Persefoni, Patch, Sylvera, and Climate Arc. Also interested in larger companies with strong sustainability programs.",
    createdAt: daysAgo(8),
    readAt: daysAgo(7),
  },
  {
    id: "msg-3",
    threadId: "thread-1",
    senderId: "coach-1",
    content:
      "Great list! I actually know people at Watershed and Sylvera. Let's discuss warm intros during our session. Also, I'd add Sphere and Sinai Technologies to your list - they're hiring for marketing roles right now.",
    createdAt: daysAgo(7),
    readAt: daysAgo(7),
  },
  {
    id: "msg-4",
    threadId: "thread-1",
    senderId: "coach-1",
    content:
      "Hey Jamie! Quick note - I saw that Persefoni just posted a Marketing Manager role that looks perfect for your background. Want me to make an intro to their Head of Marketing?",
    createdAt: daysAgo(0),
  },
  {
    id: "msg-5",
    threadId: "thread-1",
    senderId: "coach-1",
    content:
      "Also, don't forget to update your LinkedIn headline before you start reaching out. We talked about this in our last session!",
    createdAt: daysAgo(0),
  },
  // Thread 2: Seeker-1 with Mentor-1
  {
    id: "msg-6",
    threadId: "thread-2",
    senderId: "seeker-1",
    content:
      "Hey Jordan! Sarah recommended I reach out to you since you made the switch to Rivian. I'd love to learn about your experience transitioning into the EV space.",
    createdAt: daysAgo(14),
    readAt: daysAgo(14),
  },
  {
    id: "msg-7",
    threadId: "thread-2",
    senderId: "mentor-1",
    content:
      "Hi Jamie! Happy to help. The transition was definitely a journey but so worth it. I scheduled us for a resume review session next week - looking forward to it!",
    createdAt: daysAgo(13),
    readAt: daysAgo(13),
  },
  {
    id: "msg-8",
    threadId: "thread-2",
    senderId: "mentor-1",
    content:
      "Just saw your updated resume. Really strong! A few quick thoughts: 1) Lead with impact metrics, 2) Add a 'Climate Interest' section, 3) The Spotify work translates really well to mission-driven companies. Let's discuss more in our session!",
    createdAt: daysAgo(2),
    readAt: daysAgo(2),
  },
];

// ============ NOTIFICATIONS ============
export const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "seeker-1",
    type: "session-reminder",
    title: "Upcoming Session",
    body: "Your coaching session with Sarah Chen is in 2 days",
    read: false,
    createdAt: daysAgo(0),
    actionUrl: "/jobs/coaching",
  },
  {
    id: "notif-2",
    userId: "seeker-1",
    type: "new-message",
    title: "New Message from Sarah Chen",
    body: "I saw that Persefoni just posted a Marketing Manager role...",
    read: false,
    createdAt: daysAgo(0),
    actionUrl: "/jobs/messages?thread=thread-1",
  },
  {
    id: "notif-3",
    userId: "seeker-1",
    type: "cohort-update",
    title: "January Cohort Update",
    body: "New resources added: 'Breaking into Climate Tech' guide",
    read: true,
    createdAt: daysAgo(2),
    actionUrl: "/candid/resources",
  },
];

// ============ RESOURCES ============
export const resources: Resource[] = [
  {
    id: "resource-1",
    title: "Breaking into Climate Tech: A Complete Guide",
    description:
      "Everything you need to know about transitioning into climate tech, including top companies, skills in demand, and networking strategies.",
    type: "guide",
    sector: "climate-tech",
    url: "#",
    createdAt: daysAgo(30),
  },
  {
    id: "resource-2",
    title: "Climate Finance Career Pathways",
    description:
      "A comprehensive overview of roles in climate finance, from ESG analysis to impact investing, with salary benchmarks.",
    type: "guide",
    sector: "finance",
    url: "#",
    createdAt: daysAgo(21),
  },
  {
    id: "resource-3",
    title: "Resume Template: Climate Career Transition",
    description:
      "A proven resume template designed for career changers entering the climate space.",
    type: "template",
    url: "#",
    createdAt: daysAgo(14),
  },
  {
    id: "resource-4",
    title: "Federal Climate Jobs: How to Navigate USAJobs",
    description:
      "Step-by-step guide to finding and applying for climate roles in the federal government.",
    type: "guide",
    sector: "policy",
    url: "#",
    createdAt: daysAgo(7),
  },
];

// Helper functions
export function getUserById(id: string): CandidCoach | CandidMentor | CandidSeeker | undefined {
  return [...coaches, ...mentors, ...seekers].find((u) => u.id === id);
}

export function getCoachById(id: string): CandidCoach | undefined {
  return coaches.find((c) => c.id === id);
}

export function getMentorById(id: string): CandidMentor | undefined {
  return mentors.find((m) => m.id === id);
}

export function getSeekerById(id: string): CandidSeeker | undefined {
  return seekers.find((s) => s.id === id);
}

export function getSessionsForUser(userId: string): Session[] {
  return sessions.filter((s) => s.menteeId === userId || s.mentorId === userId);
}

export function getMessagesForThread(threadId: string): Message[] {
  return messages
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export function getThreadsForUser(userId: string): MessageThread[] {
  return messageThreads
    .filter((t) => t.participantIds.includes(userId))
    .map((thread) => ({
      ...thread,
      lastMessage: messages
        .filter((m) => m.threadId === thread.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0],
    }))
    .sort(
      (a, b) =>
        (b.lastMessage?.createdAt.getTime() || 0) - (a.lastMessage?.createdAt.getTime() || 0)
    );
}

export function getNotificationsForUser(userId: string): Notification[] {
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

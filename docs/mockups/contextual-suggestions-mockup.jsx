import React, { useState } from "react";

// =============================================================================
// MOCK USER CONTEXT - This would come from your app state
// =============================================================================

const MOCK_USER_CONTEXTS = {
  newUser: {
    name: "Sarah",
    stage: "just_started",
    daysActive: 2,
    profileComplete: 40,
    hasResume: false,
    applications: 0,
    upcomingInterviews: 0,
    activeGoals: 0,
    recentActivity: [],
    targetRoles: ["Product Manager"],
  },
  activeSearcher: {
    name: "Marcus",
    stage: "active_search",
    daysActive: 21,
    profileComplete: 85,
    hasResume: true,
    applications: 12,
    upcomingInterviews: 2,
    activeGoals: 2,
    recentActivity: [
      { type: "application", company: "Stripe", daysAgo: 1 },
      { type: "application", company: "Figma", daysAgo: 3 },
      { type: "interview_scheduled", company: "Notion", daysAgo: 2 },
    ],
    targetRoles: ["Senior Product Manager", "Director of Product"],
  },
  interviewPhase: {
    name: "Priya",
    stage: "interviewing",
    daysActive: 35,
    profileComplete: 100,
    hasResume: true,
    applications: 24,
    upcomingInterviews: 4,
    activeGoals: 3,
    recentActivity: [
      { type: "interview_scheduled", company: "Google", daysAgo: 0 },
      { type: "interview_completed", company: "Meta", daysAgo: 2 },
      { type: "offer_received", company: "Airbnb", daysAgo: 5 },
    ],
    targetRoles: ["Staff Engineer"],
  },
};

// =============================================================================
// SUGGESTION ENGINE - Logic for contextual recommendations
// =============================================================================

function generateSuggestions(user) {
  const suggestions = [];

  // Stage-based suggestions
  if (user.stage === "just_started") {
    if (user.profileComplete < 80) {
      suggestions.push({
        id: "complete-profile",
        type: "quick_win",
        priority: "high",
        title: "Complete Your Profile",
        description: `You're ${user.profileComplete}% there! A complete profile gets 3x more views from employers.`,
        icon: "👤",
        action: "Complete Profile",
        actionType: "navigate",
        estimatedTime: "10 min",
        reason: "Profiles with 80%+ completion get significantly more employer views",
      });
    }

    if (!user.hasResume) {
      suggestions.push({
        id: "upload-resume",
        type: "essential",
        priority: "high",
        title: "Upload Your Resume",
        description: "Your resume is the foundation of your job search. Let's get it uploaded.",
        icon: "📄",
        action: "Upload Resume",
        actionType: "navigate",
        estimatedTime: "5 min",
        reason: "Required for most job applications",
      });
    }

    suggestions.push({
      id: "first-goal",
      type: "recommended",
      priority: "medium",
      title: "Set Your First Goal",
      description: "Job seekers who set goals are 42% more likely to land interviews.",
      icon: "🎯",
      action: "Browse Templates",
      actionType: "goal_template",
      templateId: "job-search-organize",
      estimatedTime: "5 min",
      reason: "Based on successful job seeker patterns",
    });
  }

  if (user.stage === "active_search") {
    if (user.applications > 5 && user.upcomingInterviews === 0) {
      suggestions.push({
        id: "improve-applications",
        type: "insight",
        priority: "high",
        title: "Optimize Your Applications",
        description: `You've sent ${user.applications} applications but haven't gotten interviews yet. Let's improve your approach.`,
        icon: "📈",
        action: "Start Goal",
        actionType: "goal_template",
        templateId: "resume-refresh",
        estimatedTime: "1 week",
        reason: `Based on your ${user.applications} applications with low response rate`,
      });
    }

    if (user.applications > 0 && user.applications < 10) {
      suggestions.push({
        id: "expand-network",
        type: "recommended",
        priority: "medium",
        title: "Expand Your Network",
        description:
          "80% of jobs are filled through networking. Time to connect with people in your target companies.",
        icon: "🤝",
        action: "Start Goal",
        actionType: "goal_template",
        templateId: "networking",
        estimatedTime: "2-3 weeks",
        reason: "Networking significantly increases interview chances",
      });
    }

    // Company-specific suggestion
    const recentApps = user.recentActivity.filter((a) => a.type === "application");
    if (recentApps.length > 0) {
      suggestions.push({
        id: "research-companies",
        type: "timely",
        priority: "medium",
        title: `Research ${recentApps[0].company}`,
        description: `You applied to ${recentApps[0].company} recently. Deep research will help you ace the interview if you get one.`,
        icon: "🔍",
        action: "Start Research",
        actionType: "goal_create",
        prefill: {
          title: `Research ${recentApps[0].company}`,
          category: "RESEARCH",
          tasks: [
            `Read ${recentApps[0].company}'s latest blog posts and press releases`,
            "Find 3 employees to connect with on LinkedIn",
            "Understand their product/service deeply",
            "Prepare 3 thoughtful questions for interviewers",
          ],
        },
        estimatedTime: "2-3 days",
        reason: `You applied ${recentApps[0].daysAgo} day(s) ago`,
      });
    }
  }

  if (user.stage === "interviewing") {
    const upcomingInterview = user.recentActivity.find(
      (a) => a.type === "interview_scheduled" && a.daysAgo <= 7
    );

    if (upcomingInterview) {
      suggestions.push({
        id: "interview-prep",
        type: "urgent",
        priority: "critical",
        title: `Prepare for ${upcomingInterview.company} Interview`,
        description: `Your interview is ${upcomingInterview.daysAgo === 0 ? "TODAY" : `in ${7 - upcomingInterview.daysAgo} days`}. Let's make sure you're ready.`,
        icon: "⚡",
        action: "Start Prep",
        actionType: "goal_create",
        prefill: {
          title: `${upcomingInterview.company} Interview Prep`,
          category: "INTERVIEWING",
          priority: "high",
          tasks: [
            `Review ${upcomingInterview.company}'s recent news and product updates`,
            "Prepare STAR stories for behavioral questions",
            "Practice technical/role-specific questions",
            "Prepare 5 questions to ask the interviewer",
            "Plan your outfit and test your setup (if virtual)",
          ],
        },
        estimatedTime: "2-4 hours",
        reason: `Interview ${upcomingInterview.daysAgo === 0 ? "is today!" : `coming up in ${7 - upcomingInterview.daysAgo} days`}`,
      });
    }

    const hasOffer = user.recentActivity.some((a) => a.type === "offer_received");
    if (hasOffer) {
      suggestions.push({
        id: "negotiate-offer",
        type: "opportunity",
        priority: "high",
        title: "Prepare to Negotiate",
        description:
          "Congratulations on the offer! Most offers have room for negotiation. Let's prepare.",
        icon: "💰",
        action: "Start Goal",
        actionType: "goal_template",
        templateId: "salary-negotiation",
        estimatedTime: "1-2 days",
        reason: "You received an offer recently",
      });
    }

    if (user.upcomingInterviews >= 3) {
      suggestions.push({
        id: "wellness-check",
        type: "wellness",
        priority: "medium",
        title: "Don't Forget Self-Care",
        description: `You have ${user.upcomingInterviews} interviews lined up. That's exciting but can be draining. Take care of yourself.`,
        icon: "🧘",
        action: "Start Goal",
        actionType: "goal_template",
        templateId: "wellness",
        estimatedTime: "Ongoing",
        reason: "High interview activity detected",
      });
    }
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// =============================================================================
// COMPONENTS
// =============================================================================

function SuggestionCard({ suggestion, onAction }) {
  const typeStyles = {
    urgent: "border-l-red-500 bg-red-50",
    critical: "border-l-red-500 bg-red-50",
    quick_win: "border-l-emerald-500 bg-emerald-50",
    essential: "border-l-blue-500 bg-blue-50",
    recommended: "border-l-purple-500 bg-purple-50",
    insight: "border-l-amber-500 bg-amber-50",
    timely: "border-l-cyan-500 bg-cyan-50",
    opportunity: "border-l-green-500 bg-green-50",
    wellness: "border-l-pink-500 bg-pink-50",
  };

  const priorityBadge = {
    critical: { label: "Do Now", bg: "bg-red-100 text-red-700" },
    high: { label: "Important", bg: "bg-orange-100 text-orange-700" },
    medium: { label: "Recommended", bg: "bg-blue-100 text-blue-700" },
    low: { label: "Nice to Have", bg: "bg-gray-100 text-gray-600" },
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 ${typeStyles[suggestion.type]} mb-3`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{suggestion.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[suggestion.priority].bg}`}
            >
              {priorityBadge[suggestion.priority].label}
            </span>
          </div>
          <p className="mb-2 text-sm text-gray-600">{suggestion.description}</p>
          <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
            <span>⏱️ {suggestion.estimatedTime}</span>
            <span className="italic">Why: {suggestion.reason}</span>
          </div>
          <button
            onClick={() => onAction(suggestion)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            {suggestion.action}
          </button>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <span className="text-sm">✕</span>
        </button>
      </div>
    </div>
  );
}

function UserContextSwitcher({ currentContext, onChange }) {
  return (
    <div className="mb-6 rounded-lg bg-gray-800 p-4 text-white">
      <p className="mb-2 text-xs text-gray-400">
        🎭 Demo: Switch user context to see different suggestions
      </p>
      <div className="flex gap-2">
        {Object.entries(MOCK_USER_CONTEXTS).map(([key, context]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              currentContext === key
                ? "bg-emerald-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {context.name} ({context.stage.replace(/_/g, " ")})
          </button>
        ))}
      </div>
    </div>
  );
}

function UserStatusBar({ user }) {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Welcome back, {user.name}!</h2>
          <p className="text-sm text-gray-500">Day {user.daysActive} of your job search</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{user.applications}</p>
            <p className="text-xs text-gray-500">Applications</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{user.upcomingInterviews}</p>
            <p className="text-xs text-gray-500">Interviews</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{user.activeGoals}</p>
            <p className="text-xs text-gray-500">Active Goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function ContextualSuggestions() {
  const [currentContextKey, setCurrentContextKey] = useState("newUser");
  const user = MOCK_USER_CONTEXTS[currentContextKey];
  const suggestions = generateSuggestions(user);

  const handleAction = (suggestion) => {
    if (suggestion.actionType === "goal_template") {
      alert(`Opening template: ${suggestion.templateId}`);
    } else if (suggestion.actionType === "goal_create") {
      alert(
        `Creating goal: ${suggestion.prefill?.title}\n\nTasks:\n${suggestion.prefill?.tasks?.join("\n")}`
      );
    } else if (suggestion.actionType === "navigate") {
      alert(`Navigating to: ${suggestion.action}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        {/* Demo context switcher */}
        <UserContextSwitcher currentContext={currentContextKey} onChange={setCurrentContextKey} />

        {/* User status */}
        <UserStatusBar user={user} />

        {/* Suggestions header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
            <p className="text-sm text-gray-500">
              Personalized suggestions based on your job search progress
            </p>
          </div>
          <button className="text-sm text-emerald-600 hover:underline">
            View all suggestions →
          </button>
        </div>

        {/* Suggestion cards */}
        {suggestions.length > 0 ? (
          <div>
            {suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} onAction={handleAction} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <span className="mb-4 block text-4xl">🎉</span>
            <h3 className="mb-2 font-semibold text-gray-900">You're all caught up!</h3>
            <p className="text-gray-500">No new suggestions right now. Keep up the great work!</p>
          </div>
        )}

        {/* Debug panel */}
        <div className="mt-8 rounded-lg bg-gray-100 p-4">
          <p className="mb-2 font-mono text-xs text-gray-500">Debug: User context data</p>
          <pre className="overflow-auto text-xs text-gray-600">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

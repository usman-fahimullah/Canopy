import React, { useState } from "react";

// =============================================================================
// MOCK DATA
// =============================================================================

const CHALLENGES = [
  {
    id: "getting-started",
    label: "I don't know where to start",
    icon: "🤔",
    description: "New to job searching or feeling overwhelmed",
    suggestedGoals: ["job-search-organize", "resume-refresh"],
  },
  {
    id: "not-getting-responses",
    label: "Not getting responses",
    icon: "📭",
    description: "Applying but not hearing back",
    suggestedGoals: ["resume-refresh", "networking"],
  },
  {
    id: "interview-anxiety",
    label: "Interview anxiety",
    icon: "😰",
    description: "Getting interviews but struggling to convert",
    suggestedGoals: ["interview-prep", "wellness"],
  },
  {
    id: "career-change",
    label: "Switching careers",
    icon: "🔄",
    description: "Transitioning to a new field or role",
    suggestedGoals: ["career-transition", "portfolio-project"],
  },
  {
    id: "negotiation",
    label: "Salary negotiation",
    icon: "💰",
    description: "Have offers but unsure how to negotiate",
    suggestedGoals: ["salary-negotiation"],
  },
  {
    id: "motivation",
    label: "Staying motivated",
    icon: "🔋",
    description: "Job search fatigue is real",
    suggestedGoals: ["wellness", "networking"],
  },
];

const QUICK_START_GOALS = [
  {
    id: "job-search-organize",
    title: "Organize My Job Search",
    description: "Create a structured system to track applications",
    icon: "📁",
    color: "purple",
    tasks: 4,
    timeEstimate: "1 week",
    popularity: 89,
  },
  {
    id: "resume-refresh",
    title: "Update My Resume",
    description: "Polish your resume to stand out",
    icon: "📄",
    color: "blue",
    tasks: 5,
    timeEstimate: "3-5 days",
    popularity: 94,
  },
  {
    id: "networking",
    title: "Build My Network",
    description: "Connect with people in your target industry",
    icon: "🤝",
    color: "green",
    tasks: 5,
    timeEstimate: "2-3 weeks",
    popularity: 82,
  },
  {
    id: "interview-prep",
    title: "Ace My Interviews",
    description: "Systematic interview preparation",
    icon: "💬",
    color: "orange",
    tasks: 5,
    timeEstimate: "1-2 weeks",
    popularity: 91,
  },
];

const SUCCESS_STORIES = [
  {
    id: "1",
    name: "Sarah K.",
    role: "Product Manager",
    company: "Stripe",
    photo: "👩‍💼",
    quote: "Setting clear weekly goals kept me accountable. Landed my dream job in 6 weeks!",
    goalsUsed: ["networking", "interview-prep"],
    timeToOffer: "6 weeks",
  },
  {
    id: "2",
    name: "Marcus T.",
    role: "Senior Engineer",
    company: "Airbnb",
    photo: "👨‍💻",
    quote: "The interview prep goal template was a game-changer for my technical rounds.",
    goalsUsed: ["interview-prep", "portfolio-project"],
    timeToOffer: "8 weeks",
  },
  {
    id: "3",
    name: "Priya M.",
    role: "UX Designer",
    company: "Figma",
    photo: "👩‍🎨",
    quote: "Networking goals helped me get referrals. 80% of my interviews came from connections.",
    goalsUsed: ["networking", "resume-refresh"],
    timeToOffer: "5 weeks",
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [name, setName] = useState("");

  const handleChallengeToggle = (id) => {
    setSelectedChallenges((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id].slice(0, 3)
    );
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="text-center">
      <span className="mb-6 block text-6xl">🎯</span>
      <h2 className="mb-3 text-2xl font-bold text-gray-900">Welcome to Your Job Search Goals</h2>
      <p className="mx-auto mb-8 max-w-md text-gray-600">
        Job seekers who set clear goals are 42% more likely to land their dream job. Let's set you
        up for success.
      </p>
      <button
        onClick={() => setStep(1)}
        className="rounded-xl bg-emerald-600 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
      >
        Let's Get Started →
      </button>
    </div>,

    // Step 1: Name
    <div key="name" className="text-center">
      <span className="mb-4 block text-5xl">👋</span>
      <h2 className="mb-3 text-2xl font-bold text-gray-900">What should we call you?</h2>
      <p className="mb-6 text-gray-600">We'll personalize your experience</p>
      <input
        type="text"
        placeholder="Your first name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mx-auto w-full max-w-xs rounded-xl border-2 border-gray-200 px-4 py-3 text-center text-lg focus:border-emerald-500 focus:outline-none"
        autoFocus
      />
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={() => setStep(0)} className="px-6 py-2 text-gray-600 hover:text-gray-900">
          Back
        </button>
        <button
          onClick={() => setStep(2)}
          disabled={!name.trim()}
          className="rounded-xl bg-emerald-600 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </div>,

    // Step 2: Challenges
    <div key="challenges">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Hi {name}! What's your biggest challenge?
        </h2>
        <p className="text-gray-600">Select up to 3 challenges. We'll recommend goals to help.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {CHALLENGES.map((challenge) => (
          <button
            key={challenge.id}
            onClick={() => handleChallengeToggle(challenge.id)}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              selectedChallenges.includes(challenge.id)
                ? "border-emerald-500 bg-emerald-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="mb-2 block text-2xl">{challenge.icon}</span>
            <p className="text-sm font-medium text-gray-900">{challenge.label}</p>
            <p className="mt-1 text-xs text-gray-500">{challenge.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setStep(1)} className="px-6 py-2 text-gray-600 hover:text-gray-900">
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={selectedChallenges.length === 0}
          className="rounded-xl bg-emerald-600 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          See My Goals →
        </button>
      </div>
    </div>,

    // Step 3: Recommended Goals
    <div key="recommendations">
      <div className="mb-6 text-center">
        <span className="mb-3 block text-4xl">✨</span>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Perfect! Here's your personalized plan
        </h2>
        <p className="text-gray-600">
          Based on your challenges, we recommend starting with these goals
        </p>
      </div>

      <div className="mb-8 space-y-3">
        {QUICK_START_GOALS.slice(0, 3).map((goal, index) => (
          <div
            key={goal.id}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-600">
              {index + 1}
            </div>
            <span className="text-2xl">{goal.icon}</span>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900">{goal.title}</h3>
              <p className="text-sm text-gray-500">{goal.description}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium text-gray-900">{goal.tasks} tasks</p>
              <p className="text-gray-500">{goal.timeEstimate}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 rounded-xl bg-emerald-50 p-4">
        <p className="text-sm text-emerald-800">
          <strong>Pro tip:</strong> Start with just one goal. You can always add more later!
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={() => setStep(2)} className="px-6 py-2 text-gray-600 hover:text-gray-900">
          Back
        </button>
        <button
          onClick={() => onComplete({ name, challenges: selectedChallenges })}
          className="rounded-xl bg-emerald-600 px-8 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Create My First Goal 🎯
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-emerald-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {steps[step]}
    </div>
  );
}

function QuickStartCard({ goal, onSelect }) {
  const colorClasses = {
    purple: "bg-purple-100 text-purple-600 border-purple-200",
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200",
    orange: "bg-orange-100 text-orange-600 border-orange-200",
  };

  return (
    <button
      onClick={() => onSelect(goal)}
      className="group rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-emerald-300 hover:shadow-lg"
    >
      <div
        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${colorClasses[goal.color]}`}
      >
        {goal.icon}
      </div>
      <h3 className="mb-1 font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">
        {goal.title}
      </h3>
      <p className="mb-3 text-sm text-gray-500">{goal.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {goal.tasks} tasks · {goal.timeEstimate}
        </span>
        <span className="text-emerald-600">{goal.popularity}% use this</span>
      </div>
    </button>
  );
}

function SuccessStoryCard({ story }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-3xl">{story.photo}</span>
        <div>
          <p className="font-semibold text-gray-900">{story.name}</p>
          <p className="text-sm text-gray-500">
            {story.role} at {story.company}
          </p>
        </div>
      </div>
      <p className="mb-3 italic text-gray-600">"{story.quote}"</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
          ⏱️ {story.timeToOffer}
        </span>
        <span>using {story.goalsUsed.length} goals</span>
      </div>
    </div>
  );
}

function SimpleEmptyState({ onStartWizard, onBrowseTemplates, onCreateCustom }) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-green-200">
        <span className="text-5xl">🎯</span>
      </div>

      <h2 className="mb-2 text-2xl font-bold text-gray-900">Set Your First Goal</h2>
      <p className="mx-auto mb-8 max-w-md text-gray-600">
        Goals help you stay focused and track progress. Job seekers with goals land jobs 42% faster.
      </p>

      {/* Primary CTA */}
      <button
        onClick={onStartWizard}
        className="rounded-xl bg-emerald-600 px-8 py-4 font-medium text-white shadow-lg shadow-emerald-200 transition-colors hover:bg-emerald-700"
      >
        🚀 Get Personalized Goals
      </button>

      {/* Secondary options */}
      <div className="mt-6 flex justify-center gap-4">
        <button onClick={onBrowseTemplates} className="text-sm text-emerald-600 hover:underline">
          Browse all templates →
        </button>
        <span className="text-gray-300">|</span>
        <button onClick={onCreateCustom} className="text-sm text-gray-500 hover:text-gray-700">
          Create custom goal
        </button>
      </div>

      {/* Quick start section */}
      <div className="mt-12">
        <h3 className="mb-4 text-sm font-medium text-gray-700">
          Or quick start with a popular goal:
        </h3>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {QUICK_START_GOALS.map((goal) => (
            <QuickStartCard
              key={goal.id}
              goal={goal}
              onSelect={() => alert(`Creating goal: ${goal.title}`)}
            />
          ))}
        </div>
      </div>

      {/* Success stories */}
      <div className="mt-16">
        <h3 className="mb-4 text-sm font-medium text-gray-700">
          Success stories from our community
        </h3>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {SUCCESS_STORIES.map((story) => (
            <SuccessStoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function EnhancedEmptyState() {
  const [showWizard, setShowWizard] = useState(false);
  const [completedOnboarding, setCompletedOnboarding] = useState(null);

  const handleWizardComplete = (data) => {
    setCompletedOnboarding(data);
    setShowWizard(false);
    alert(
      `Welcome, ${data.name}! Creating your personalized goals based on: ${data.challenges.join(", ")}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Demo controls */}
        <div className="mb-6 rounded-lg bg-gray-800 p-4 text-white">
          <p className="mb-2 text-xs text-gray-400">🎭 Demo Controls</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowWizard(false)}
              className={`rounded-lg px-3 py-1.5 text-sm ${!showWizard ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              Empty State View
            </button>
            <button
              onClick={() => setShowWizard(true)}
              className={`rounded-lg px-3 py-1.5 text-sm ${showWizard ? "bg-emerald-500" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              Onboarding Wizard
            </button>
          </div>
        </div>

        {/* Main content */}
        {showWizard ? (
          <OnboardingWizard onComplete={handleWizardComplete} />
        ) : (
          <SimpleEmptyState
            onStartWizard={() => setShowWizard(true)}
            onBrowseTemplates={() => alert("Opening templates library...")}
            onCreateCustom={() => alert("Opening create goal modal...")}
          />
        )}

        {/* Completed state preview */}
        {completedOnboarding && (
          <div className="mt-8 rounded-lg bg-emerald-50 p-4">
            <p className="text-sm text-emerald-800">
              ✅ Onboarding completed for: <strong>{completedOnboarding.name}</strong>
            </p>
            <p className="mt-1 text-xs text-emerald-600">
              Challenges: {completedOnboarding.challenges.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";

// =============================================================================
// MOCK DATA - Goal Templates Library
// =============================================================================

const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All Templates", icon: "📋" },
  { id: "networking", label: "Networking", icon: "🤝" },
  { id: "interviewing", label: "Interviewing", icon: "💬" },
  { id: "skills", label: "Skills Development", icon: "📚" },
  { id: "portfolio", label: "Resume & Portfolio", icon: "📄" },
  { id: "research", label: "Research", icon: "🔍" },
  { id: "compensation", label: "Compensation", icon: "💰" },
  { id: "wellness", label: "Wellness", icon: "🧘" },
  { id: "organization", label: "Organization", icon: "📁" },
];

const EXPERIENCE_LEVELS = [
  { id: "all", label: "All Levels" },
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Career" },
  { id: "senior", label: "Senior" },
  { id: "switcher", label: "Career Switcher" },
];

const INDUSTRIES = [
  { id: "all", label: "All Industries" },
  { id: "tech", label: "Tech" },
  { id: "finance", label: "Finance" },
  { id: "healthcare", label: "Healthcare" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
];

const GOAL_TEMPLATES = [
  {
    id: "1",
    title: "Build Your Professional Network",
    description: "Connect with industry professionals to expand opportunities",
    category: "networking",
    experience: ["entry", "mid", "switcher"],
    industries: ["all"],
    popularity: 89,
    tasks: [
      "Optimize your LinkedIn headline and summary",
      "Connect with 5 people in your target role",
      "Schedule 2 coffee chats this week",
      "Join 2 relevant industry groups",
      "Share one insightful post or comment",
    ],
    estimatedTime: "2-3 weeks",
    difficulty: "Easy",
  },
  {
    id: "2",
    title: "Ace Your Technical Interviews",
    description: "Systematic preparation for coding interviews",
    category: "interviewing",
    experience: ["entry", "mid"],
    industries: ["tech"],
    popularity: 94,
    tasks: [
      "Complete 50 LeetCode problems (easy/medium)",
      "Review system design fundamentals",
      "Practice explaining your past projects",
      "Do 3 mock interviews with peers",
      "Prepare 5 questions for interviewers",
    ],
    estimatedTime: "4-6 weeks",
    difficulty: "Hard",
  },
  {
    id: "3",
    title: "Career Transition Roadmap",
    description: "Navigate your switch to a new industry or role",
    category: "skills",
    experience: ["switcher"],
    industries: ["all"],
    popularity: 76,
    tasks: [
      "Identify transferable skills from current role",
      "Research 3 target roles and requirements",
      "Enroll in one relevant course or certification",
      "Rewrite resume highlighting transferable skills",
      "Connect with 3 people who made similar transitions",
    ],
    estimatedTime: "6-8 weeks",
    difficulty: "Medium",
  },
  {
    id: "4",
    title: "Salary Negotiation Prep",
    description: "Research and prepare for compensation discussions",
    category: "compensation",
    experience: ["mid", "senior"],
    industries: ["all"],
    popularity: 82,
    tasks: [
      "Research market rates on Levels.fyi/Glassdoor",
      "Document your key achievements with metrics",
      "Practice negotiation scripts out loud",
      "Prepare responses to common pushbacks",
      "Identify your walk-away number and ideal",
    ],
    estimatedTime: "1-2 weeks",
    difficulty: "Medium",
  },
  {
    id: "5",
    title: "Portfolio Project Sprint",
    description: "Build a showcase project for your applications",
    category: "portfolio",
    experience: ["entry", "switcher"],
    industries: ["tech"],
    popularity: 71,
    tasks: [
      "Choose a project idea that solves a real problem",
      "Set up repository with clean README",
      "Build MVP in 2-week sprint",
      "Deploy to production",
      "Write a case study blog post",
    ],
    estimatedTime: "2-4 weeks",
    difficulty: "Hard",
  },
  {
    id: "6",
    title: "Company Deep Dive Research",
    description: "Thoroughly research your target companies",
    category: "research",
    experience: ["all"],
    industries: ["all"],
    popularity: 68,
    tasks: [
      "Create list of 10 target companies",
      "Research company culture, values, and recent news",
      "Find employees to connect with on LinkedIn",
      "Understand the product/service deeply",
      "Prepare company-specific interview answers",
    ],
    estimatedTime: "1-2 weeks",
    difficulty: "Easy",
  },
  {
    id: "7",
    title: "Job Search Wellness Plan",
    description: "Maintain mental health during your search",
    category: "wellness",
    experience: ["all"],
    industries: ["all"],
    popularity: 65,
    tasks: [
      "Set boundaries: max 4 hours of job search daily",
      "Schedule daily exercise or walks",
      "Connect with a friend or support group weekly",
      "Practice rejection resilience techniques",
      "Celebrate small wins each week",
    ],
    estimatedTime: "Ongoing",
    difficulty: "Easy",
  },
  {
    id: "8",
    title: "Resume Refresh",
    description: "Update and optimize your resume for ATS and humans",
    category: "portfolio",
    experience: ["all"],
    industries: ["all"],
    popularity: 91,
    tasks: [
      "Audit current resume for outdated info",
      "Quantify achievements with metrics",
      "Tailor summary for target role",
      "Run through ATS checker tool",
      "Get feedback from 2 people in your field",
    ],
    estimatedTime: "1 week",
    difficulty: "Medium",
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

function DifficultyBadge({ difficulty }) {
  const colors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
}

function PopularityBar({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-500">{value}% use this</span>
    </div>
  );
}

function TemplateCard({ template, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const category = TEMPLATE_CATEGORIES.find((c) => c.id === template.category);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{category?.icon}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {category?.label}
          </span>
        </div>
        <DifficultyBadge difficulty={template.difficulty} />
      </div>

      <h3 className="mb-1 font-semibold text-gray-900">{template.title}</h3>
      <p className="mb-3 text-sm text-gray-600">{template.description}</p>

      <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
        <span>⏱️ {template.estimatedTime}</span>
        <span>📝 {template.tasks.length} tasks</span>
      </div>

      <PopularityBar value={template.popularity} />

      {expanded && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-2 text-xs font-medium text-gray-700">Tasks included:</p>
          <ul className="space-y-1">
            {template.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-0.5 text-gray-400">○</span>
                {task}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          {expanded ? "Show Less" : "Preview Tasks"}
        </button>
        <button
          onClick={() => onSelect(template)}
          className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Use Template
        </button>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function GoalTemplatesLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const filteredTemplates = GOAL_TEMPLATES.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesExperience =
      selectedExperience === "all" ||
      template.experience.includes(selectedExperience) ||
      template.experience.includes("all");
    const matchesIndustry =
      selectedIndustry === "all" ||
      template.industries.includes(selectedIndustry) ||
      template.industries.includes("all");
    const matchesSearch =
      !searchQuery ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesExperience && matchesIndustry && matchesSearch;
  });

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Goal Templates Library</h1>
          <p className="text-gray-600">
            Choose from proven goal templates used by successful job seekers
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Category</p>
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map((cat) => (
              <FilterPill
                key={cat.id}
                label={`${cat.icon} ${cat.label}`}
                active={selectedCategory === cat.id}
                onClick={() => setSelectedCategory(cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Experience & Industry Filters */}
        <div className="mb-6 flex gap-8">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Experience Level</p>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <FilterPill
                  key={level.id}
                  label={level.label}
                  active={selectedExperience === level.id}
                  onClick={() => setSelectedExperience(level.id)}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">Industry</p>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => (
                <FilterPill
                  key={industry.id}
                  label={industry.label}
                  active={selectedIndustry === industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-gray-500">Showing {filteredTemplates.length} templates</p>

        {/* Template Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onSelect={handleSelectTemplate} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No templates match your filters</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedExperience("all");
                setSelectedIndustry("all");
                setSearchQuery("");
              }}
              className="mt-2 text-emerald-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Selected Template Modal Preview */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
              <div className="mb-4 flex items-start justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.title}</h2>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="mb-4 text-gray-600">{selectedTemplate.description}</p>

              <div className="mb-4 rounded-lg bg-emerald-50 p-4">
                <p className="mb-2 text-sm font-medium text-emerald-800">This template includes:</p>
                <ul className="space-y-2">
                  {selectedTemplate.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                      <span className="mt-1">☐</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(
                      `Goal "${selectedTemplate.title}" created with ${selectedTemplate.tasks.length} tasks!`
                    );
                    setSelectedTemplate(null);
                  }}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                >
                  Create This Goal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

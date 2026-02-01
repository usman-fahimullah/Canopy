import React, { useState } from "react";
import {
  MapPin,
  Briefcase,
  Settings,
  Users,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const user = {
  name: "Grace Han",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  headline: "Financial Analyst → Climate Finance",
  location: "San Francisco, CA",
  badge: "Just Graduated",

  // Mentee side
  lookingFor: {
    goal: "Transition into sustainable finance and ESG roles",
    topics: ["Sustainable Manufacturing", "ESG Strategy", "Career Transitions"],
    skills: ["Climate Risk Analysis", "Impact Investing", "Stakeholder Management"],
  },

  // Mentor side
  offering: {
    available: true,
    headline: "Happy to help with financial modeling and breaking into climate-focused finance",
    topics: ["Financial Modeling", "Carbon Accounting", "Getting Started in Climate"],
    skills: ["Excel", "Python", "Risk Analysis", "Budgeting & Portfolio Analysis"],
    mentees: 3,
  },
};

const SkillTag = ({ skill }) => (
  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">{skill}</span>
);

const TopicTag = ({ topic }) => (
  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">{topic}</span>
);

export default function DualRoleProfile() {
  const [activeTab, setActiveTab] = useState("mentee");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <h1 className="font-semibold text-gray-900">My Profile</h1>
          <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Profile Header */}
        <div className="mb-4 rounded-2xl bg-white p-8">
          <div className="flex items-start gap-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                  {user.badge}
                </span>
              </div>
              <p className="text-lg text-gray-600">{user.headline}</p>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                {user.location}
              </div>
            </div>
          </div>
        </div>

        {/* Role Toggle */}
        <div className="mb-4 rounded-2xl bg-white p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("mentee")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium transition-colors ${
                activeTab === "mentee"
                  ? "bg-green-700 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              Looking for mentorship
            </button>
            <button
              onClick={() => setActiveTab("mentor")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium transition-colors ${
                activeTab === "mentor"
                  ? "bg-green-700 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" />
              Available to mentor
            </button>
          </div>
        </div>

        {/* Mentee View */}
        {activeTab === "mentee" && (
          <>
            {/* Goal */}
            <div className="mb-4 rounded-2xl bg-white p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                My goal
              </h2>
              <p className="text-lg text-gray-700">{user.lookingFor.goal}</p>
            </div>

            {/* Topics I want to learn */}
            <div className="mb-4 rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Topics I want to learn
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.lookingFor.topics.map((topic) => (
                  <TopicTag key={topic} topic={topic} />
                ))}
              </div>
            </div>

            {/* Skills I'm building */}
            <div className="mb-6 rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Skills I'm building
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.lookingFor.skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Find mentors for your goals
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    We'll match you with mentors who can help
                  </p>
                </div>
                <button className="flex items-center gap-1 rounded-xl bg-green-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-800">
                  Browse mentors
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Mentor View */}
        {activeTab === "mentor" && (
          <>
            {/* Availability */}
            <div className="mb-4 rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </h2>
                  <p className="flex items-center gap-2 font-medium text-gray-900">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                    Taking mentees
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{user.offering.mentees}</p>
                  <p className="text-sm text-gray-500">current mentees</p>
                </div>
              </div>
            </div>

            {/* How I can help */}
            <div className="mb-4 rounded-2xl bg-white p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                How I can help
              </h2>
              <p className="text-lg text-gray-700">{user.offering.headline}</p>
            </div>

            {/* Topics I can mentor on */}
            <div className="mb-4 rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Topics I can help with
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.offering.topics.map((topic) => (
                  <TopicTag key={topic} topic={topic} />
                ))}
              </div>
            </div>

            {/* Skills I can share */}
            <div className="mb-6 rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Skills I can share
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.offering.skills.map((skill) => (
                  <SkillTag key={skill} skill={skill} />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">See how others view you</h3>
                  <p className="mt-1 text-sm text-gray-600">Preview your mentor profile</p>
                </div>
                <button className="flex items-center gap-1 rounded-xl bg-green-700 px-5 py-2.5 font-medium text-white transition-colors hover:bg-green-800">
                  View profile
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

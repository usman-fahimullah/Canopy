import React, { useState } from "react";
import { MapPin, Briefcase, Users, ArrowLeft, Heart, CheckCircle, Sparkles } from "lucide-react";

// Job seeker viewing the profile (Grace Han's data)
const currentUser = {
  name: "Grace",
  goal: "sustainable finance",
  skills: [
    "Financial modeling & forecasting",
    "Carbon accounting",
    "Excel",
    "Python",
    "Risk analysis",
  ],
  interests: ["Sustainable Manufacturing", "Clean Energy Finance", "ESG"],
};

// Mentor being viewed
const mentor = {
  id: 1,
  name: "Finn O'Leary",
  avatar:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  title: "Manufacturing Engineer",
  specialty: "Clean Production",
  location: "Pittsburgh",
  experience: "6+ yrs",
  mentees: 12,
  available: true,
  about:
    "Lean manufacturing veteran happy to mentor people interested in sustainable manufacturing careers. I've helped dozens of professionals transition into green manufacturing roles.",
  topics: [
    "Sustainable Manufacturing",
    "Lean/Six Sigma in Green Jobs",
    "Manufacturing Careers",
    "Career Transitions",
  ],
  skills: [
    "Clean Manufacturing",
    "Waste Reduction",
    "Energy Efficiency",
    "Process Optimization",
    "Carbon Accounting",
  ],
};

// Find matching skills
const matchingSkills = mentor.skills.filter((skill) =>
  currentUser.skills.some(
    (userSkill) =>
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
  )
);

// Find matching topics
const matchingTopics = mentor.topics.filter((topic) =>
  currentUser.interests.some(
    (interest) =>
      topic.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(topic.toLowerCase())
  )
);

const SkillTag = ({ skill, isMatch }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
      isMatch ? "bg-green-100 text-green-800 ring-1 ring-green-300" : "bg-gray-100 text-gray-700"
    }`}
  >
    {isMatch && <CheckCircle className="h-3.5 w-3.5" />}
    {skill}
  </span>
);

const TopicTag = ({ topic, isMatch }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ${
      isMatch ? "bg-green-100 text-green-800 ring-1 ring-green-300" : "bg-gray-100 text-gray-700"
    }`}
  >
    {isMatch && <CheckCircle className="h-3.5 w-3.5" />}
    {topic}
  </span>
);

export default function MentorProfileMVP() {
  const [isFavorited, setIsFavorited] = useState(false);

  const hasMatch = matchingSkills.length > 0 || matchingTopics.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to mentors</span>
          </button>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <Heart
              className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Profile Header */}
        <div className="mb-4 rounded-2xl bg-white p-8">
          <div className="flex items-start gap-6">
            <div className="relative">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              {mentor.available && (
                <div className="border-3 absolute bottom-1 right-1 h-6 w-6 rounded-full border-white bg-green-500" />
              )}
            </div>

            <div className="flex-1">
              <div className="mb-1 flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{mentor.name}</h1>
                {hasMatch && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                    <Sparkles className="h-3.5 w-3.5" />
                    Good Match
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-600">
                {mentor.title} · {mentor.specialty}
              </p>

              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {mentor.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {mentor.experience}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {mentor.mentees} mentees
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Why You Match - Only show if there are matches */}
        {hasMatch && (
          <div className="mb-4 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-green-800">
              <Sparkles className="h-4 w-4" />
              Why you match
            </h2>

            <div className="space-y-2 text-gray-700">
              {matchingSkills.length > 0 && (
                <p>
                  You both have experience with{" "}
                  <span className="font-semibold text-green-800">{matchingSkills.join(", ")}</span>
                </p>
              )}
              {matchingTopics.length > 0 && (
                <p>
                  Finn can help with your interest in{" "}
                  <span className="font-semibold text-green-800">{matchingTopics[0]}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* About */}
        <div className="mb-4 rounded-2xl bg-white p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            About
          </h2>
          <p className="leading-relaxed text-gray-700">{mentor.about}</p>
        </div>

        {/* Topics I Can Help With */}
        <div className="mb-4 rounded-2xl bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Topics I can help with
          </h2>
          <div className="flex flex-wrap gap-2">
            {mentor.topics.map((topic) => {
              const isMatch = matchingTopics.includes(topic);
              return <TopicTag key={topic} topic={topic} isMatch={isMatch} />;
            })}
          </div>
        </div>

        {/* Green Skills */}
        <div className="mb-6 rounded-2xl bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Green skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {mentor.skills.map((skill) => {
              const isMatch = matchingSkills.includes(skill);
              return <SkillTag key={skill} skill={skill} isMatch={isMatch} />;
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="sticky bottom-6 rounded-2xl bg-white p-6">
          <button className="w-full rounded-xl bg-green-700 py-4 font-semibold text-white transition-colors hover:bg-green-800">
            Send intro message
          </button>
          <p className="mt-3 text-center text-sm text-gray-500">
            Mention your interest in {currentUser.goal} to get started
          </p>
        </div>
      </div>
    </div>
  );
}

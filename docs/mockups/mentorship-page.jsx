import React, { useState } from "react";
import {
  Search,
  Star,
  MapPin,
  Users,
  ChevronRight,
  MessageCircle,
  Calendar,
  MoreHorizontal,
} from "lucide-react";

// Sample data
const findMentors = [
  {
    id: 1,
    name: "Finn O'Leary",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    title: "Manufacturing Engineer",
    specialty: "Clean Production",
    location: "Pittsburgh",
    rating: 4.9,
    available: true,
    match: true,
  },
  {
    id: 2,
    name: "Brian Hernandez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    title: "HVAC Technician",
    specialty: "Building Decarbonization",
    location: "San Antonio",
    rating: 4.8,
    available: true,
    match: false,
  },
  {
    id: 3,
    name: "Wendy Adeyemi",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    title: "ESG Program Manager",
    specialty: "Supply Chain Sustainability",
    location: "Dallas",
    rating: 5.0,
    available: false,
    match: true,
  },
];

const myMentors = [
  {
    id: 1,
    name: "Marcus Williams",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "Climate Lobbyist",
    specialty: "Legislative Strategy",
    status: "Active",
    nextSession: "Tomorrow, 3pm",
    lastMessage: "Looking forward to our call!",
  },
];

const myMentees = [
  {
    id: 1,
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
    goal: "Break into climate finance",
    status: "Active",
    lastMessage: "Thanks for the resume tips!",
    started: "2 months ago",
  },
  {
    id: 2,
    name: "Jordan Mills",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    goal: "Learn financial modeling",
    status: "Active",
    lastMessage: "Can we schedule another session?",
    started: "3 weeks ago",
  },
  {
    id: 3,
    name: "Sam Torres",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face",
    goal: "Career transition advice",
    status: "Pending",
    lastMessage: null,
    started: null,
  },
];

const MentorCard = ({ mentor }) => (
  <div className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-gray-50">
    <div className="relative">
      <img src={mentor.avatar} alt={mentor.name} className="h-12 w-12 rounded-full object-cover" />
      <div
        className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${mentor.available ? "bg-green-500" : "bg-orange-400"}`}
      />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-gray-900">{mentor.name}</h3>
        {mentor.match && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
            Recommended
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">
        {mentor.title} · {mentor.specialty}
      </p>
      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {mentor.location}
        </span>
        <span className="flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          {mentor.rating}
        </span>
      </div>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-300" />
  </div>
);

const MyMentorCard = ({ mentor }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="flex items-start gap-4">
      <img src={mentor.avatar} alt={mentor.name} className="h-14 w-14 rounded-full object-cover" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
            {mentor.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{mentor.title}</p>
        <p className="text-sm font-medium text-green-700">{mentor.specialty}</p>
      </div>
    </div>

    <div className="mt-4 border-t border-gray-100 pt-4">
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="h-4 w-4 text-gray-400" />
        Next session: <span className="font-medium text-gray-900">{mentor.nextSession}</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 rounded-lg bg-green-700 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800">
          Message
        </button>
        <button className="rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-50">
          <MoreHorizontal className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </div>
  </div>
);

const MyMenteeCard = ({ mentee }) => (
  <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
    <img src={mentee.avatar} alt={mentee.name} className="h-12 w-12 rounded-full object-cover" />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-gray-900">{mentee.name}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${
            mentee.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {mentee.status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{mentee.goal}</p>
      {mentee.lastMessage && (
        <p className="mt-1 truncate text-xs text-gray-500">"{mentee.lastMessage}"</p>
      )}
    </div>
    <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
      <MessageCircle className="h-5 w-5 text-gray-400" />
    </button>
  </div>
);

export default function MentorshipPage() {
  const [activeTab, setActiveTab] = useState("find");

  const tabs = [
    { id: "find", label: "Find Mentors", count: null },
    { id: "myMentors", label: "My Mentors", count: myMentors.length },
    { id: "myMentees", label: "My Mentees", count: myMentees.length },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="flex w-56 flex-col border-r border-gray-200 bg-white">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-lg font-bold">Candid</span>
          </div>
        </div>

        <div className="border-b border-gray-100 p-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              className="h-10 w-10 rounded-full object-cover"
              alt="User"
            />
            <div>
              <div className="text-sm font-medium">Grace Han</div>
              <div className="text-xs text-gray-500">SF, California</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2">
          {["Home", "Sessions", "Jobs"].map((item) => (
            <div
              key={item}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item}
            </div>
          ))}
          <div className="cursor-pointer rounded-lg bg-green-100 px-3 py-2.5 text-sm font-medium text-green-800">
            Mentorship
          </div>
          {["Messages", "Resources"].map((item) => (
            <div
              key={item}
              className="cursor-pointer rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 pb-0 pt-8">
          <h1 className="mb-1 text-2xl font-bold text-gray-900">Mentorship</h1>
          <p className="mb-6 text-gray-500">Find guidance and share your expertise</p>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-t-lg px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "-mb-px border-x border-t-2 border-gray-200 border-green-700 bg-gray-50 text-green-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      activeTab === tab.id
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {/* Find Mentors */}
          {activeTab === "find" && (
            <div className="max-w-2xl">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors..."
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="mb-6 flex gap-2">
                {["All", "Recommended", "Available"].map((filter) => (
                  <button
                    key={filter}
                    className={`rounded-full px-4 py-2 text-sm ${
                      filter === "All"
                        ? "bg-green-700 text-white"
                        : "border border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
                {findMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </div>
          )}

          {/* My Mentors */}
          {activeTab === "myMentors" && (
            <div className="max-w-2xl">
              {myMentors.length > 0 ? (
                <div className="space-y-4">
                  {myMentors.map((mentor) => (
                    <MyMentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-1 font-medium text-gray-900">No mentors yet</h3>
                  <p className="text-sm text-gray-500">Find a mentor to get started</p>
                </div>
              )}
            </div>
          )}

          {/* My Mentees */}
          {activeTab === "myMentees" && (
            <div className="max-w-2xl">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">{myMentees.length} mentees</p>
                <button className="text-sm font-medium text-green-700 hover:underline">
                  Manage availability
                </button>
              </div>

              <div className="space-y-3">
                {myMentees.map((mentee) => (
                  <MyMenteeCard key={mentee.id} mentee={mentee} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

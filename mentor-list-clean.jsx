import React, { useState } from "react";
import {
  Search,
  Star,
  MessageCircle,
  Heart,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const mentors = [
  {
    id: 1,
    name: "Finn O'Leary",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    title: "Manufacturing Engineer",
    specialty: "Clean Product Development",
    location: "Pittsburgh",
    experience: "6+ yrs",
    rating: 4.9,
    reviews: 23,
    mentees: 12,
    responseTime: "< 24 hrs",
    lastActive: "2 hours ago",
    available: true,
    badge: "Top Mentor",
    focus: "Helping engineers transition into sustainable manufacturing roles",
    about:
      "I've spent 6 years in manufacturing, with the last 3 focused on sustainable product development. I love helping engineers make the switch to climate-focused work.",
  },
  {
    id: 2,
    name: "Brian Hernandez",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    title: "HVAC Technician",
    specialty: "Building Decarbonization",
    location: "San Antonio",
    experience: "8+ yrs",
    rating: 4.8,
    reviews: 31,
    mentees: 18,
    responseTime: "< 12 hrs",
    lastActive: "30 min ago",
    available: true,
    badge: "Quick Responder",
    focus: "Career growth in green building technologies",
    about:
      "Started as a traditional HVAC tech and pivoted to building decarbonization. Happy to share what I've learned along the way.",
  },
  {
    id: 3,
    name: "Wendy Adeyemi",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    title: "ESG Program Manager",
    specialty: "Supply Chain Sustainability",
    location: "Dallas",
    experience: "9+ yrs",
    rating: 5.0,
    reviews: 47,
    mentees: 25,
    responseTime: "< 48 hrs",
    lastActive: "1 day ago",
    available: false,
    badge: "Featured",
    focus: "Breaking into ESG roles from traditional operations",
    about:
      "I transitioned from operations management to ESG leadership. I specialize in helping others make similar career pivots.",
  },
  {
    id: 4,
    name: "Marcus Williams",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "Climate Lobbyist",
    specialty: "Legislative Strategy",
    location: "Washington",
    experience: "12+ yrs",
    rating: 4.7,
    reviews: 19,
    mentees: 8,
    responseTime: "< 72 hrs",
    lastActive: "3 days ago",
    available: true,
    badge: null,
    focus: "Policy careers and government relations in climate",
    about:
      "12 years working at the intersection of policy and climate. I can help you navigate careers in government, advocacy, and lobbying.",
  },
  {
    id: 5,
    name: "Jasmine Patel",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    title: "Environmental Educator",
    specialty: "Curriculum Development",
    location: "Chicago",
    experience: "7+ yrs",
    rating: 4.9,
    reviews: 38,
    mentees: 22,
    responseTime: "< 24 hrs",
    lastActive: "5 hours ago",
    available: true,
    badge: null,
    focus: "Education and outreach roles in sustainability",
    about:
      "Passionate about climate education. I help people find meaningful work in environmental education and community outreach.",
  },
  {
    id: 6,
    name: "Fatima Hassan",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    title: "Sustainability Consultant",
    specialty: "B Corp Certification",
    location: "Minneapolis",
    experience: "9+ yrs",
    rating: 4.8,
    reviews: 29,
    mentees: 15,
    responseTime: "< 24 hrs",
    lastActive: "1 hour ago",
    available: true,
    badge: "Quick Responder",
    focus: "Consulting careers and B Corp ecosystem",
    about:
      "I've helped dozens of companies achieve B Corp certification. Now I help professionals break into sustainability consulting.",
  },
];

const Badge = ({ type }) => {
  const styles = {
    "Top Mentor": "bg-amber-50 text-amber-700",
    "Quick Responder": "bg-blue-50 text-blue-700",
    Featured: "bg-purple-50 text-purple-700",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[type]}`}>{type}</span>
  );
};

const MentorCard = ({ mentor, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-b border-gray-100 p-5 transition-all ${isSelected ? "bg-green-50" : "hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${mentor.available ? "bg-green-500" : "bg-orange-400"}`}
            title={mentor.available ? "Taking mentees" : "Waitlist"}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
            {mentor.badge && <Badge type={mentor.badge} />}
          </div>

          <p className="text-sm text-gray-600">{mentor.title}</p>
          <p className="text-sm font-medium text-green-700">{mentor.specialty}</p>

          <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {mentor.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {mentor.rating}
            </span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-300" />
      </div>
    </div>
  );
};

const MentorDetail = ({ mentor }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  if (!mentor) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <MessageCircle className="mx-auto mb-4 h-16 w-16 stroke-1" />
          <h3 className="text-lg font-medium text-gray-600">Select a mentor</h3>
          <p className="mt-1 text-sm">Choose from the list to view their profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-lg p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              <div
                className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white ${mentor.available ? "bg-green-500" : "bg-orange-400"}`}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{mentor.name}</h2>
              <p className="text-gray-600">{mentor.title}</p>
              <p className="font-medium text-green-700">{mentor.specialty}</p>
            </div>
          </div>
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <Heart
              className={`h-6 w-6 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
        </div>

        {/* Status */}
        <div className="mb-6 flex items-center gap-2">
          {mentor.badge && <Badge type={mentor.badge} />}
          {mentor.available ? (
            <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Taking Mentees
            </span>
          ) : (
            <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700">
              Waitlist Only
            </span>
          )}
        </div>

        {/* Focus */}
        <div className="mb-6 rounded-xl bg-gray-50 p-5">
          <p className="mb-2 font-medium text-gray-700">What I help with</p>
          <p className="text-gray-600">{mentor.focus}</p>
        </div>

        {/* About */}
        <div className="mb-6">
          <p className="mb-2 font-medium text-gray-700">About</p>
          <p className="leading-relaxed text-gray-600">{mentor.about}</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Star className="h-4 w-4" />
              Rating
            </div>
            <p className="text-xl font-bold text-gray-900">
              {mentor.rating}{" "}
              <span className="text-sm font-normal text-gray-500">({mentor.reviews} reviews)</span>
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              Mentees
            </div>
            <p className="text-xl font-bold text-gray-900">{mentor.mentees}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              Response Time
            </div>
            <p className="text-xl font-bold text-gray-900">{mentor.responseTime}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              Location
            </div>
            <p className="text-xl font-bold text-gray-900">{mentor.location}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white transition-colors hover:bg-green-700">
            Request Mentorship
          </button>
          <button className="w-full rounded-xl border border-gray-200 py-4 font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            Send Quick Intro
          </button>
        </div>

        {/* Activity */}
        <p className="mt-6 text-center text-sm text-gray-400">Active {mentor.lastActive}</p>
      </div>
    </div>
  );
};

export default function MentorListClean() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Available", "Top Rated", "Quick Responders"];

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Mentor List */}
      <div className="flex w-[420px] flex-col border-r border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <span>🌱</span> Climate Mentors
          </h1>
          <p className="mt-1 text-gray-500">Connect with experienced professionals</p>
        </div>

        {/* Search & Filters */}
        <div className="border-b border-gray-100 p-4">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-0 bg-gray-50 py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  activeFilter === filter
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="px-6 py-3 text-sm text-gray-500">{mentors.length} mentors available</div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              isSelected={selectedMentor?.id === mentor.id}
              onClick={() => setSelectedMentor(mentor)}
            />
          ))}
        </div>
      </div>

      {/* Detail Panel */}
      <MentorDetail mentor={selectedMentor} />
    </div>
  );
}

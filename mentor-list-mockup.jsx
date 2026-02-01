import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  MessageCircle,
  Heart,
  MapPin,
  Briefcase,
  CheckCircle,
  Users,
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
    badges: ["Top Mentor"],
    focus: "Helping engineers transition into sustainable manufacturing",
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
    badges: ["Quick Responder"],
    focus: "Career growth in green building technologies",
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
    badges: ["Top Mentor", "Featured"],
    focus: "Breaking into ESG roles from traditional operations",
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
    badges: [],
    focus: "Policy careers and government relations in climate",
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
    badges: ["New"],
    focus: "Education and outreach roles in sustainability",
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
    badges: ["Quick Responder"],
    focus: "Consulting careers and B Corp ecosystem",
  },
];

const Badge = ({ type }) => {
  const styles = {
    "Top Mentor": "bg-amber-100 text-amber-700 border-amber-200",
    "Quick Responder": "bg-blue-100 text-blue-700 border-blue-200",
    Featured: "bg-purple-100 text-purple-700 border-purple-200",
    New: "bg-green-100 text-green-700 border-green-200",
  };

  return <span className={`rounded-full border px-2 py-0.5 text-xs ${styles[type]}`}>{type}</span>;
};

const MentorCard = ({ mentor, isSelected, onClick }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border-b border-gray-100 p-4 transition-all hover:bg-gray-50 ${isSelected ? "border-l-4 border-l-green-600 bg-green-50" : ""}`}
    >
      <div className="flex gap-3">
        <div className="relative">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          {mentor.available ? (
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"
              title="Taking mentees"
            />
          ) : (
            <div
              className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-orange-400"
              title="Waitlist"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                {mentor.name}
                {mentor.badges.map((badge) => (
                  <Badge key={badge} type={badge} />
                ))}
              </h3>
              <p className="text-sm text-gray-700">{mentor.title}</p>
              <p className="text-sm font-medium text-green-700">{mentor.specialty}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
              className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
            >
              <Heart
                className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </button>
          </div>

          <p className="mt-1 line-clamp-1 text-xs text-gray-500">{mentor.focus}</p>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {mentor.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {mentor.experience}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {mentor.rating} ({mentor.reviews})
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {mentor.mentees} mentees
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Responds {mentor.responseTime}
            </span>
            <span className="text-green-600">Active {mentor.lastActive}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentorDetail = ({ mentor }) => {
  if (!mentor) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <MessageCircle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-700">Select a mentor</h3>
          <p className="text-sm">Choose a mentor from the list to view their profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white p-6">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="mx-auto h-24 w-24 rounded-full object-cover"
            />
            {mentor.available && (
              <div className="border-3 absolute bottom-1 right-1 h-5 w-5 rounded-full border-white bg-green-500" />
            )}
          </div>
          <h2 className="mt-3 text-xl font-bold text-gray-900">{mentor.name}</h2>
          <p className="text-gray-700">{mentor.title}</p>
          <p className="font-medium text-green-700">{mentor.specialty}</p>

          <div className="mt-3 flex justify-center gap-2">
            {mentor.badges.map((badge) => (
              <Badge key={badge} type={badge} />
            ))}
            {mentor.available ? (
              <span className="flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs text-green-700">
                <CheckCircle className="h-3 w-3" /> Taking Mentees
              </span>
            ) : (
              <span className="rounded-full border border-orange-200 bg-orange-100 px-2 py-0.5 text-xs text-orange-700">
                Waitlist Only
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-gray-50 p-4">
          <p className="text-sm italic text-gray-700">"{mentor.focus}"</p>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{mentor.rating}</div>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {mentor.reviews} reviews
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{mentor.mentees}</div>
            <div className="text-xs text-gray-500">Mentees</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 text-center">
            <div className="text-xl font-bold text-gray-900">{mentor.experience}</div>
            <div className="text-xs text-gray-500">Experience</div>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{mentor.location}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Usually responds {mentor.responseTime}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-green-600">Active {mentor.lastActive}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition-colors hover:bg-green-700">
            Request Mentorship
          </button>
          <button className="w-full rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Send Quick Intro
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MentorListMockup() {
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const filters = ["All", "Available Now", "Top Rated", "Quick Responders"];
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="flex h-screen bg-white font-sans">
      {/* Sidebar */}
      <div className="flex w-56 flex-col border-r border-gray-200">
        <div className="border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-green-600">
              <Star className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">Candid</span>
          </div>
        </div>

        <div className="border-b border-gray-100 p-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
              className="h-10 w-10 rounded-full"
              alt="User"
            />
            <div>
              <div className="text-sm font-medium">Usman Fahimullah</div>
              <div className="text-xs text-gray-500">Job Seeker</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-2">
          {["Home", "Sessions", "Jobs", "Mentors", "Messages"].map((item) => (
            <div
              key={item}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm ${item === "Mentors" ? "bg-green-100 font-medium text-green-800" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {item}
            </div>
          ))}
        </nav>
      </div>

      {/* Mentor List */}
      <div className="flex w-96 flex-col border-r border-gray-200">
        <div className="border-b border-gray-100 p-4">
          <h1 className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <span className="text-green-600">🌱</span> Climate Mentors
          </h1>
          <p className="text-sm text-gray-500">Connect with experienced professionals</p>
        </div>

        <div className="border-b border-gray-100 p-3">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs transition-colors ${activeFilter === filter ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
          <span className="text-xs text-gray-500">{mentors.length} mentors available</span>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cursor-pointer border-none bg-transparent font-medium focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rated</option>
              <option value="response">Fastest Response</option>
              <option value="experience">Most Experience</option>
            </select>
          </div>
        </div>

        {/* Mentor List */}
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

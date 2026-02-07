import React, { useState } from "react";
import { Inbox, Send, Clock, Check, X } from "lucide-react";

const incomingRequests = [
  {
    id: 1,
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
    goal: "Break into climate finance",
    message:
      "Hi! I'm transitioning from traditional finance and would love your guidance on breaking into climate-focused roles. Your experience with carbon accounting really resonates with my goals.",
    sentAt: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Jordan Mills",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    goal: "Learn financial modeling",
    message:
      "I saw that you have strong Excel and Python skills. I'm trying to level up my financial modeling abilities for sustainability projects. Would you be open to mentoring me?",
    sentAt: "1 day ago",
    status: "pending",
  },
];

const outgoingRequests = [
  {
    id: 1,
    name: "Wendy Adeyemi",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    title: "ESG Program Manager",
    message:
      "Hi Wendy! I'm interested in transitioning into ESG roles and your background in supply chain sustainability is exactly what I'm hoping to learn more about.",
    sentAt: "3 days ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Marcus Williams",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    title: "Climate Lobbyist",
    message:
      "Hi Marcus, I'd love to learn more about policy careers in climate. Your legislative experience is fascinating.",
    sentAt: "1 week ago",
    status: "accepted",
  },
];

const IncomingRequestCard = ({ request }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="flex items-start gap-4">
      <img
        src={request.avatar}
        alt={request.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{request.name}</h3>
          <span className="text-xs text-gray-500">{request.sentAt}</span>
        </div>
        <p className="mb-2 text-sm font-medium text-green-700">{request.goal}</p>
        <p className="line-clamp-2 text-sm text-gray-600">{request.message}</p>
      </div>
    </div>

    <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800">
        <Check className="h-4 w-4" />
        Accept
      </button>
      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
        <X className="h-4 w-4" />
        Decline
      </button>
    </div>
  </div>
);

const OutgoingRequestCard = ({ request }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5">
    <div className="flex items-start gap-4">
      <img
        src={request.avatar}
        alt={request.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{request.name}</h3>
            <p className="text-sm text-gray-500">{request.title}</p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              request.status === "accepted"
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {request.status === "accepted" ? "Accepted" : "Pending"}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{request.message}</p>
        <p className="mt-2 text-xs text-gray-400">Sent {request.sentAt}</p>
      </div>
    </div>

    {request.status === "accepted" && (
      <div className="mt-4 border-t border-gray-100 pt-4">
        <button className="w-full rounded-lg bg-green-700 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-800">
          Start conversation
        </button>
      </div>
    )}
  </div>
);

export default function RequestsList() {
  const [activeTab, setActiveTab] = useState("incoming");

  return (
    <div className="mx-auto max-w-xl p-6 font-sans">
      <h1 className="mb-6 text-xl font-bold text-gray-900">Requests</h1>

      {/* Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "incoming"
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Inbox className="h-4 w-4" />
          Incoming
          {incomingRequests.length > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === "incoming" ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              {incomingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "outgoing"
              ? "bg-green-700 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Send className="h-4 w-4" />
          Outgoing
          {outgoingRequests.filter((r) => r.status === "pending").length > 0 && (
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                activeTab === "outgoing" ? "bg-green-600" : "bg-gray-300"
              }`}
            >
              {outgoingRequests.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
      </div>

      {/* Incoming Requests */}
      {activeTab === "incoming" && (
        <div className="space-y-4">
          {incomingRequests.map((request) => (
            <IncomingRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}

      {/* Outgoing Requests */}
      {activeTab === "outgoing" && (
        <div className="space-y-4">
          {outgoingRequests.map((request) => (
            <OutgoingRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/shell/page-header";
import { Spinner } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { Users, MagnifyingGlass, CalendarDots } from "@phosphor-icons/react";
import { format } from "date-fns";
import { logger, formatError } from "@/lib/logger";

interface Session {
  id: string;
  scheduledAt: string;
  duration: number;
  status: string;
  meetingLink: string | null;
  mentee?: {
    id: string;
    account: { name: string; email: string };
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
  seeker?: {
    id: string;
    firstName: string;
    lastName: string;
    photoUrl: string | null;
  };
}

interface Client {
  id: string;
  name: string;
  photoUrl: string | null;
  sessionCount: number;
  lastSessionDate: string | null;
}

export default function CoachClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/sessions?role=coach");
        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        const sessions: Session[] = data.sessions || [];

        // Extract unique clients from sessions
        const clientMap = new Map<
          string,
          { name: string; photoUrl: string | null; sessions: string[] }
        >();

        sessions.forEach((session) => {
          const person = session.client || session.seeker || session.mentee;
          if (!person) return;

          const id = person.id;
          const name =
            "firstName" in person
              ? `${person.firstName} ${person.lastName}`
              : "account" in person
                ? person.account.name
                : "Unknown Client";
          const photoUrl = "photoUrl" in person ? person.photoUrl : null;

          const existing = clientMap.get(id);
          if (existing) {
            existing.sessions.push(session.scheduledAt);
          } else {
            clientMap.set(id, {
              name,
              photoUrl,
              sessions: [session.scheduledAt],
            });
          }
        });

        const clientList: Client[] = Array.from(clientMap.entries()).map(([id, info]) => {
          const sorted = info.sessions.sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
          );
          return {
            id,
            name: info.name,
            photoUrl: info.photoUrl,
            sessionCount: info.sessions.length,
            lastSessionDate: sorted[0] || null,
          };
        });

        // Sort by most recent session
        clientList.sort((a, b) => {
          if (!a.lastSessionDate) return 1;
          if (!b.lastSessionDate) return -1;
          return new Date(b.lastSessionDate).getTime() - new Date(a.lastSessionDate).getTime();
        });

        setClients(clientList);
      } catch (error) {
        logger.error("Error fetching clients", { error: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const query = search.toLowerCase();
    return clients.filter((c) => c.name.toLowerCase().includes(query));
  }, [clients, search]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Clients" />

      <div className="px-8 py-6 lg:px-12">
        {/* Search input */}
        <div className="relative mb-6">
          <MagnifyingGlass
            size={20}
            weight="regular"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--primitive-neutral-500)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="focus:ring-[var(--primitive-green-500)]/20 w-full rounded-[12px] border border-[var(--primitive-neutral-200)] bg-[var(--input-background)] py-3 pl-10 pr-4 text-body text-[var(--primitive-neutral-800)] outline-none transition-colors placeholder:text-[var(--primitive-neutral-500)] focus:border-[var(--primitive-green-500)] focus:ring-2"
          />
        </div>

        {/* Client grid */}
        {filteredClients.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="flex flex-col gap-4 rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] p-5 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    size="default"
                    src={client.photoUrl || undefined}
                    name={client.name}
                    color="green"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-medium text-[var(--primitive-neutral-800)]">
                      {client.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="rounded-md bg-[var(--primitive-yellow-100)] p-1">
                      <CalendarDots
                        size={14}
                        weight="bold"
                        className="text-[var(--primitive-yellow-600)]"
                      />
                    </div>
                    <span className="text-caption text-[var(--primitive-neutral-600)]">
                      {client.sessionCount} {client.sessionCount === 1 ? "session" : "sessions"}
                    </span>
                  </div>

                  {client.lastSessionDate && (
                    <span className="text-caption text-[var(--primitive-neutral-500)]">
                      Last: {format(new Date(client.lastSessionDate), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-[var(--primitive-neutral-200)] bg-[var(--card-background)] px-8 py-16 text-center">
            <div className="mb-4 rounded-xl bg-[var(--primitive-yellow-100)] p-3">
              <Users size={28} weight="bold" className="text-[var(--primitive-yellow-600)]" />
            </div>
            <p className="text-body font-medium text-[var(--primitive-neutral-800)]">
              {search.trim() ? "No clients match your search" : "No clients yet"}
            </p>
            <p className="mt-1 text-caption text-[var(--primitive-neutral-500)]">
              {search.trim()
                ? "Try a different search term."
                : "Clients will appear here once you start coaching."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import type { TeamSection } from "@/lib/career-pages/types";
import { User } from "@phosphor-icons/react/dist/ssr";

interface TeamBlockProps {
  section: TeamSection;
}

export function TeamBlock({ section }: TeamBlockProps) {
  return (
    <section className="bg-[var(--background-subtle)] px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-[var(--foreground-default)]">
          {section.title}
        </h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {section.members.map((member, i) => (
            <div key={i} className="text-center">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="mx-auto mb-3 h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--background-muted)]">
                  <User size={40} weight="regular" />
                </div>
              )}
              <h3 className="font-semibold text-[var(--foreground-default)]">{member.name}</h3>
              <p className="text-sm text-[var(--foreground-muted)]">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

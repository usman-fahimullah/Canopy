/**
 * Full-screen layout for the candidate detail view.
 * Overrides the parent canopy ShellLayout to provide
 * a borderless viewport for the detail experience.
 */
export default function CandidateDetailLayout({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 bg-[var(--background-default)]">{children}</div>;
}

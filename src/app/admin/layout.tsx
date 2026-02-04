import Link from "next/link";
import { CandidLogo } from "@/components/brand/candid-logo";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-50)]">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--primitive-neutral-200)] bg-[var(--background-default)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <CandidLogo width={100} height={25} />
              </Link>
              <span className="rounded bg-[var(--primitive-orange-100)] px-2 py-1 text-xs font-medium text-[var(--primitive-orange-700)]">
                Admin
              </span>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                href="/admin"
                className="text-sm font-medium text-[var(--primitive-neutral-600)] hover:text-[var(--primitive-green-700)]"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/coaches"
                className="text-sm font-medium text-[var(--primitive-neutral-600)] hover:text-[var(--primitive-green-700)]"
              >
                Coaches
              </Link>
              <Link
                href="/admin/sessions"
                className="text-sm font-medium text-[var(--primitive-neutral-600)] hover:text-[var(--primitive-green-700)]"
              >
                Sessions
              </Link>
              <Link
                href="/admin/reviews"
                className="text-sm font-medium text-[var(--primitive-neutral-600)] hover:text-[var(--primitive-green-700)]"
              >
                Reviews
              </Link>
              <Link
                href="/admin/analytics"
                className="text-sm font-medium text-[var(--primitive-neutral-600)] hover:text-[var(--primitive-green-700)]"
              >
                Analytics
              </Link>
              <Link
                href="/jobs"
                className="text-sm text-[var(--primitive-neutral-500)] hover:text-[var(--primitive-green-700)]"
              >
                ← Back to App
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

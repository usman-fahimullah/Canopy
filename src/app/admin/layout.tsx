import Link from "next/link";
import { CandidLogo } from "@/app/candid/components/CandidLogo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-50)]">
      {/* Admin Header */}
      <header className="bg-white border-b border-[var(--primitive-neutral-200)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <CandidLogo width={100} height={25} />
              </Link>
              <span className="px-2 py-1 bg-[var(--primitive-orange-100)] text-[var(--primitive-orange-700)] text-xs font-medium rounded">
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
                href="/candid/dashboard"
                className="text-sm text-[var(--primitive-neutral-500)] hover:text-[var(--primitive-green-700)]"
              >
                ← Back to App
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

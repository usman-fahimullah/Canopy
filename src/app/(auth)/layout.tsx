import Link from "next/link";
import { GreenJobsBoardLogo } from "@/components/brand/green-jobs-board-logo";

/**
 * Auth layout — Figma: node 714:9694
 *
 * Provides the full-page auth shell with:
 * - Header with Green Jobs Board SVG wordmark logo
 * - Centered content area
 * - Neutral-100 background
 *
 * Figma header: white bg, bottom border, px-48 py-16, 195×18 logo
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--primitive-neutral-100)]">
      {/* Header — Figma: white bg, border-bottom n200, px-48 py-16 */}
      <header className="border-b border-[var(--primitive-neutral-200)] bg-[var(--card-background)]">
        <div className="px-6 py-4 md:px-12">
          <Link href="/" className="inline-flex items-center py-[15px]">
            <GreenJobsBoardLogo width={195} className="text-[var(--primitive-green-800)]" />
          </Link>
        </div>
      </header>

      {/* Main content — centered card */}
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-[520px]">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-caption-sm text-[var(--foreground-muted)]">
          &copy; {new Date().getFullYear()} Green Jobs Board. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

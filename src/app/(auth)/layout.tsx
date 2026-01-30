import { CandidLogo } from "@/app/candid/components/CandidLogo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--primitive-neutral-100)] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-block">
          <CandidLogo width={120} height={30} />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-[var(--primitive-neutral-600)]">
          &copy; {new Date().getFullYear()} Candid. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

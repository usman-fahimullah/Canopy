import type { Metadata } from "next";
import { CandidNav } from "./components/CandidNav";
import { CandidSidebar } from "./components/CandidSidebar";

export const metadata: Metadata = {
  title: "Candid - Climate Career Mentorship & Coaching",
  description:
    "You Can & You Did. A climate career mentorship and coaching platform connecting job seekers with experienced climate professionals.",
};

export default function CandidLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      {/* Desktop: Sidebar Navigation */}
      <CandidSidebar />

      {/* Mobile/Tablet: Top & Bottom Navigation */}
      <div className="lg:hidden">
        <CandidNav />
      </div>

      {/* Main Content - offset by sidebar on desktop */}
      <main className="pb-20 lg:pb-0 lg:pl-[260px]">{children}</main>
    </div>
  );
}

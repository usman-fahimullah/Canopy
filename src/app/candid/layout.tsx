import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candid - Climate Career Coaching",
  description:
    "A climate career coaching platform connecting job seekers with experienced climate professionals.",
};

export default function CandidLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The coach sub-shell at /candid/coach/* has its own ShellLayout.
  // This parent layout provides only shared metadata.
  return <>{children}</>;
}

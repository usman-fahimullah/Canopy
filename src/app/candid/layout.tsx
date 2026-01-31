import type { Metadata } from "next";
import { CandidLayoutInner } from "./components/CandidLayoutInner";

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
  return <CandidLayoutInner>{children}</CandidLayoutInner>;
}

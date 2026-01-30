import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Candid - Climate Career Mentorship",
  description:
    "The premier marketplace for climate career mentorship - connecting professionals with vetted industry experts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

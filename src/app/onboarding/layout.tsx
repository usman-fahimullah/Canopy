import type { Metadata } from "next";
import { OnboardingFormProvider } from "@/components/onboarding/form-context";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Set up your account and get started with your climate career journey.",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <OnboardingFormProvider>{children}</OnboardingFormProvider>;
}

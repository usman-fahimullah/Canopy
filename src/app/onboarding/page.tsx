"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, Buildings } from "@phosphor-icons/react";
import { ProfileIcon } from "@/components/Icons/profile-icon";
import { Button, Card } from "@/components/ui";
import { useOnboardingForm } from "@/components/onboarding/form-context";
import { SHELL_ONBOARDING_SLUGS, STEPS_BY_SHELL, type Shell } from "@/lib/onboarding/types";

const roleCards: {
  shell: Shell;
  title: string;
  subtitle: string;
  renderIcon: () => React.ReactNode;
  iconBg: string;
  buttonLabel: string;
}[] = [
  {
    shell: "coach",
    title: "Career Coach",
    subtitle: "I want to coach others",
    renderIcon: () => (
      <GraduationCap size={48} weight="fill" style={{ color: "var(--primitive-green-800)" }} />
    ),
    iconBg: "var(--primitive-blue-200)",
    buttonLabel: "I\u2019m a Career Coach",
  },
  {
    shell: "talent",
    title: "Job Seeker",
    subtitle: "Finding a job",
    renderIcon: () => <ProfileIcon size={48} className="text-[var(--primitive-neutral-0)]" />,
    iconBg: "var(--primitive-green-800)",
    buttonLabel: "I\u2019m a Job Seeker",
  },
  {
    shell: "employer",
    title: "Employer",
    subtitle: "Looking to post a role",
    renderIcon: () => (
      <Buildings size={48} weight="fill" style={{ color: "var(--primitive-green-800)" }} />
    ),
    iconBg: "var(--primitive-neutral-200)",
    buttonLabel: "I\u2019m an Employer",
  },
];

export default function OnboardingIntentPage() {
  const router = useRouter();
  const { setSelectedShell } = useOnboardingForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function selectIntent(shell: Shell) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-intent",
          entryIntent: shell,
        }),
      });

      if (res.status === 401) {
        router.push(`/signup?intent=${shell}`);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        return;
      }

      // Store selected shell in form context and route to the shell's first step
      setSelectedShell(shell);
      const slug = SHELL_ONBOARDING_SLUGS[shell];
      const firstStep = STEPS_BY_SHELL[shell][0];
      router.push(`/onboarding/${slug}/${firstStep.path}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--primitive-neutral-100)]">
      {/* ── Top bar ────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-[var(--primitive-neutral-200)] bg-[var(--background-default)]">
        <div className="flex items-center justify-between px-4 py-4 sm:px-12">
          <Link href="/" className="flex items-center py-[15px]">
            <svg
              width="195"
              height="18"
              viewBox="0 0 195 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Green Jobs Board"
            >
              <path
                d="M186.135 0.492927C186.013 -0.16431 185.068 -0.164308 184.946 0.492929L184.357 3.6566C184.27 4.12675 183.694 4.31313 183.346 3.984L181.004 1.76925C180.518 1.30915 179.753 1.86269 180.042 2.46602L181.432 5.3702C181.638 5.80178 181.283 6.28974 180.807 6.22734L177.606 5.80748C176.941 5.72025 176.649 6.61589 177.238 6.93486L180.076 8.47026C180.497 8.69843 180.497 9.30157 180.076 9.52974L177.238 11.0651C176.649 11.3841 176.941 12.2797 177.606 12.1925L180.807 11.7727C181.283 11.7103 181.638 12.1982 181.432 12.6298L180.042 15.534C179.753 16.1373 180.518 16.6908 181.004 16.2307L183.346 14.016C183.694 13.6869 184.27 13.8733 184.357 14.3434L184.946 17.5071C185.068 18.1643 186.013 18.1643 186.135 17.5071L186.724 14.3434C186.811 13.8733 187.387 13.6869 187.735 14.016L190.077 16.2307C190.564 16.6909 191.328 16.1373 191.039 15.534L189.65 12.6298C189.443 12.1982 189.799 11.7103 190.274 11.7727L193.475 12.1925C194.14 12.2797 194.432 11.3841 193.843 11.0651L191.006 9.52974C190.584 9.30157 190.584 8.69843 191.006 8.47026L193.843 6.93486C194.432 6.61589 194.14 5.72025 193.475 5.80748L190.274 6.22734C189.799 6.28974 189.443 5.80178 189.65 5.3702L191.039 2.46601C191.328 1.86269 190.564 1.30915 190.077 1.76925L187.735 3.984C187.387 4.31313 186.811 4.12675 186.724 3.6566L186.135 0.492927Z"
                fill="currentColor"
              />
              <path
                d="M13.4459 14.5014H13.3951C12.7088 16.3775 10.8787 18 8.20989 18C3.32971 18 0 13.9944 0 9C0 4.00563 3.22804 4.79094e-09 8.33698 4.79094e-09C12.6071 4.79094e-09 15.4285 2.50986 15.9623 5.88169H12.9884C12.6326 3.92958 11.1583 2.35775 8.46407 2.35775C5.00727 2.35775 3.0247 4.96902 3.0247 9C3.0247 13.0056 5.05811 15.6423 8.56574 15.6423C11.3363 15.6423 13.3697 13.9437 13.3697 11.2817V10.7493H7.44736V8.44225H16.1402V17.7465H13.4459V14.5014Z"
                fill="currentColor"
              />
              <path
                d="M20.521 10.5718V17.7465H17.7504V5.07042H20.4447V7.55493H20.4955C21.0293 5.78028 22.351 4.8169 24.3082 4.8169V7.58028H23.8761C21.5122 7.58028 20.521 8.26479 20.521 10.5718Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M35.4945 13.8169H32.724C32.419 14.831 31.7073 15.9465 30.0551 15.9465C28.1234 15.9465 26.7763 14.6028 26.6492 12.2958H35.7233C36.1045 7.88451 33.6136 4.8169 29.8264 4.8169C26.0392 4.8169 23.8787 7.90986 23.8787 11.4085C23.8787 14.907 26.09 18 29.8772 18C32.9782 18 34.9607 16.3268 35.4945 13.8169ZM29.8264 6.87042C31.6819 6.87042 32.7748 8.18873 32.9528 10.2423H26.6746C26.8525 8.18873 27.9709 6.87042 29.8264 6.87042Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M45.0247 13.8169H47.7953C47.2615 16.3268 45.2789 18 42.178 18C38.3907 18 36.1794 14.907 36.1794 11.4085C36.1794 7.90986 38.3399 4.8169 42.1271 4.8169C45.9143 4.8169 48.4053 7.88451 48.024 12.2958H38.9499C39.077 14.6028 40.4241 15.9465 42.3559 15.9465C44.008 15.9465 44.7197 14.831 45.0247 13.8169ZM45.2535 10.2423C45.0756 8.18873 43.9826 6.87042 42.1271 6.87042C40.2716 6.87042 39.1533 8.18873 38.9753 10.2423H45.2535Z"
                fill="currentColor"
              />
              <path
                d="M51.9624 17.7465V10.1408C51.9624 8.06197 52.8011 6.89577 54.5041 6.89577C56.2071 6.89577 57.0459 7.96056 57.0459 10.3183V17.7465H59.8164V9.50704C59.8164 6.71831 58.4438 4.8169 55.6479 4.8169C53.7924 4.8169 52.4707 5.78028 51.9369 7.55493H51.8861V5.07042H49.1918V17.7465H51.9624Z"
                fill="currentColor"
              />
              <path
                d="M71.8707 13.5887C71.8707 16.9352 70.5744 17.7465 67.5497 17.7465H64.6267V15.3887H66.9905C68.6427 15.3887 68.9985 14.7803 68.9985 13.2085V0.253521H71.8707V13.5887Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M85.1907 11.4085C85.1907 7.98592 82.8269 4.8169 78.9634 4.8169C75.0999 4.8169 72.7361 7.98592 72.7361 11.4085C72.7361 14.831 75.0999 18 78.9634 18C82.8269 18 85.1907 14.831 85.1907 11.4085ZM75.6591 11.4085C75.6591 8.69577 76.8537 6.87042 78.9634 6.87042C81.0985 6.87042 82.2931 8.69577 82.2931 11.4085C82.2931 14.0958 81.0985 15.9465 78.9634 15.9465C76.8537 15.9465 75.6591 14.0958 75.6591 11.4085Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M92.6726 4.8169C96.0532 4.8169 98.0103 7.85915 98.0103 11.4085C98.0103 14.9577 96.1294 18 92.6726 18C90.7409 18 89.2667 16.8338 88.6567 15.0845H88.5804V17.7465H85.8607V0.253521H88.5804V7.70704H88.6567C89.2667 5.95775 90.7409 4.8169 92.6726 4.8169ZM91.783 6.87042C89.6479 6.87042 88.4787 8.69577 88.4787 11.4085C88.4787 14.0958 89.6479 15.9465 91.783 15.9465C93.8927 15.9465 95.0873 14.0958 95.0873 11.4085C95.0873 8.69577 93.8927 6.87042 91.783 6.87042Z"
                fill="currentColor"
              />
              <path
                d="M108.684 14.0958C108.684 12.1944 107.769 10.8254 105.024 10.2169L103.296 9.83662C101.669 9.45634 100.957 9.17746 100.957 8.34085C100.957 7.40282 101.898 6.87042 103.118 6.87042C104.363 6.87042 105.507 7.35211 105.685 8.82254H108.43C108.252 6.51549 106.117 4.8169 103.118 4.8169C100.398 4.8169 98.1613 6.26197 98.1613 8.56901C98.1613 10.5718 99.6355 11.7634 102.126 12.2958L103.855 12.6761C105.329 13.0056 105.914 13.5887 105.914 14.2986C105.914 15.3887 104.744 15.9465 103.499 15.9465C102.126 15.9465 100.83 15.0338 100.678 13.4113H97.9325C98.1104 15.7437 99.9913 18 103.474 18C106.397 18 108.684 16.5549 108.684 14.0958Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M126.615 12.7268C126.615 15.8958 124.404 17.7465 120.083 17.7465H113.653V0.253521H119.321C123.718 0.253521 125.777 1.82535 125.777 4.96902C125.777 7.04789 124.175 8.26479 122.371 8.61972V8.69577C125.218 8.92394 126.615 10.4197 126.615 12.7268ZM122.777 5.04507C122.777 3.44789 121.913 2.61127 119.549 2.61127H116.525V7.50423H119.371C121.735 7.50423 122.777 6.6169 122.777 5.04507ZM123.616 12.6254C123.616 10.8761 122.447 9.86197 119.905 9.86197H116.525V15.3887H120.134C122.676 15.3887 123.616 14.3493 123.616 12.6254Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M139.089 11.4085C139.089 7.98592 136.725 4.8169 132.862 4.8169C128.998 4.8169 126.634 7.98592 126.634 11.4085C126.634 14.831 128.998 18 132.862 18C136.725 18 139.089 14.831 139.089 11.4085ZM129.557 11.4085C129.557 8.69577 130.752 6.87042 132.862 6.87042C134.997 6.87042 136.191 8.69577 136.191 11.4085C136.191 14.0958 134.997 15.9465 132.862 15.9465C130.752 15.9465 129.557 14.0958 129.557 11.4085Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M147.384 15.262H147.308C146.774 17.0113 145.351 18 143.445 18C140.801 18 138.946 16.3521 138.946 14.0451C138.946 11.4338 141.233 10.4704 144.055 10.1662L147.283 9.83662V9.45634C147.283 7.75775 146.317 6.87042 144.715 6.87042C143.165 6.87042 142.25 7.65634 142.174 9.07606H139.403C139.505 6.6169 141.487 4.8169 144.766 4.8169C147.994 4.8169 150.053 6.54085 150.053 9.96338V17.7465H147.384V15.262ZM144.512 12.0676C142.835 12.2451 141.869 12.8535 141.869 14.0704C141.869 15.262 142.936 15.9465 144.156 15.9465C146.139 15.9465 147.283 14.6028 147.283 12.1944V11.7634L144.512 12.0676Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M154.074 17.7465V10.5718C154.074 8.26479 155.065 7.58028 157.429 7.58028H157.84C157.257 8.67077 156.948 9.99967 156.948 11.4085C156.948 14.9577 158.829 18 162.286 18C164.218 18 165.692 16.8338 166.302 15.0845H166.378V17.7465H169.098V0.253521H166.378V7.70704H166.302C165.692 5.95775 164.218 4.8169 162.286 4.8169C160.263 4.8169 158.75 5.90622 157.861 7.54167V4.8169C155.904 4.8169 154.582 5.78028 154.048 7.55493H153.997V5.07042H151.303V17.7465H154.074ZM163.176 6.87042C161.066 6.87042 159.871 8.69577 159.871 11.4085C159.871 14.0958 161.066 15.9465 163.176 15.9465C165.311 15.9465 166.48 14.0958 166.48 11.4085C166.48 8.69577 165.311 6.87042 163.176 6.87042Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-4">
            <Link
              href="/design-system"
              className="hover:text-foreground-default hidden text-caption text-foreground-muted transition-colors sm:inline"
            >
              Design System
            </Link>
            <Link
              href="/demo"
              className="hover:text-foreground-default hidden text-caption text-foreground-muted transition-colors sm:inline"
            >
              Demos
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-4 py-12 sm:px-6">
        <h1 className="text-center text-heading-lg font-medium text-[var(--foreground-default)]">
          Which best describes you?
        </h1>

        {/* Role cards */}
        <div className="flex w-full max-w-[1098px] flex-col items-center gap-6 md:flex-row md:items-stretch">
          {roleCards.map((card, index) => (
            <Card
              key={card.shell}
              className="flex w-full max-w-[350px] animate-slide-in-from-bottom flex-col items-center justify-between overflow-hidden p-6 opacity-0 md:h-[416px] md:w-[350px]"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              {/* Icon + text group */}
              <div className="flex flex-1 flex-col items-center justify-center gap-6">
                {/* Icon badge */}
                <div
                  className="flex items-center rounded-[var(--radius-md)] p-3"
                  style={{ backgroundColor: card.iconBg }}
                >
                  {card.renderIcon()}
                </div>

                {/* Title + subtitle */}
                <div className="flex w-full flex-col text-center text-[var(--primitive-green-800)]">
                  <p className="w-full text-heading-md font-medium">{card.title}</p>
                  <p className="w-full text-body font-normal">{card.subtitle}</p>
                </div>
              </div>

              {/* CTA button */}
              <Button
                variant="tertiary"
                size="default"
                onClick={() => selectIntent(card.shell)}
                disabled={loading}
                className="w-full"
                aria-label={card.buttonLabel}
              >
                {card.buttonLabel}
              </Button>
            </Card>
          ))}
        </div>

        {error && (
          <p className="text-center text-caption text-[var(--primitive-red-600)]">{error}</p>
        )}

        {/* Sign in link */}
        <p className="text-center text-caption text-foreground-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--primitive-green-800)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
}

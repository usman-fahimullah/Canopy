import Link from "next/link";
import {
  Palette,
  Briefcase,
  Kanban,
  Calendar,
  ArrowRight,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

const featuredDemos = [
  {
    title: "Job Form",
    description: "Complete job posting form builder",
    href: "/demo/job-form",
    icon: Briefcase,
    color: "green",
  },
  {
    title: "Kanban Pipeline",
    description: "Drag-and-drop candidate tracking",
    href: "/demo/kanban-dnd",
    icon: Kanban,
    color: "blue",
  },
  {
    title: "Interview Scheduling",
    description: "Modal-based scheduling flow",
    href: "/demo/interview-scheduling",
    icon: Calendar,
    color: "orange",
  },
];

const colorMap = {
  green: {
    bg: "bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-900)]/30",
    icon: "text-[var(--primitive-green-600)]",
    hover: "hover:border-[var(--primitive-green-500)]",
  },
  blue: {
    bg: "bg-[var(--primitive-blue-100)] dark:bg-[var(--primitive-blue-900)]/30",
    icon: "text-[var(--primitive-blue-600)]",
    hover: "hover:border-[var(--primitive-blue-500)]",
  },
  orange: {
    bg: "bg-[var(--primitive-orange-100)] dark:bg-[var(--primitive-orange-900)]/30",
    icon: "text-[var(--primitive-orange-600)]",
    hover: "hover:border-[var(--primitive-orange-500)]",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-heading-lg font-bold text-foreground">Canopy</h1>
          <p className="text-body text-foreground-muted">
            Applicant Tracking System for Climate Hiring
          </p>
        </div>

        {/* Candid - Climate Career Mentorship Platform */}
        <Link
          href="/candid"
          className="group block p-6 rounded-xl border-2 border-[#99C9FF] bg-gradient-to-r from-[#E5F1FF] to-[#CCE4FF] hover:border-[#072924] hover:shadow-xl transition-all duration-200"
        >
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-[#072924] flex items-center justify-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5211 0L11.5963 0.123572C15.9005 7.19555 23.5789 11.5142 31.8583 11.5199L32.003 11.52L26.1853 15.0602C22.649 17.2121 20.4895 21.0509 20.4866 25.1903L20.4819 32L20.4067 31.8764C16.1024 24.8044 8.42413 20.4858 0.144691 20.4801L0 20.48L5.81769 16.9398C9.354 14.7879 11.5135 10.9491 11.5164 6.80972L11.5211 0Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-heading-sm font-semibold text-[#072924] group-hover:text-[#072924] transition-colors">
                Candid
              </h2>
              <p className="text-caption text-[#072924]/70">
                Climate Career Mentorship Platform
              </p>
            </div>
            <ArrowRight
              size={24}
              className="ml-auto text-[#072924]/50 group-hover:text-[#072924] group-hover:translate-x-1 transition-all"
            />
          </div>
          <p className="text-body-sm text-[#072924]/80">
            You Can & You Did. Connect with experienced climate professionals for mentorship, coaching, and career guidance.
          </p>
        </Link>

        {/* Main Navigation Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Design System Card */}
          <Link
            href="/design-system"
            className="group p-6 rounded-xl border border-border bg-surface hover:border-[var(--primitive-green-500)] hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[var(--primitive-green-100)] dark:bg-[var(--primitive-green-900)]/30 flex items-center justify-center">
                <Palette
                  className="w-6 h-6 text-[var(--primitive-green-600)]"
                  weight="duotone"
                />
              </div>
              <div>
                <h2 className="text-heading-sm font-semibold text-foreground group-hover:text-[var(--primitive-green-600)] transition-colors">
                  Design System
                </h2>
                <p className="text-caption text-foreground-muted">
                  Trails by Green Jobs Board
                </p>
              </div>
            </div>
            <p className="text-body-sm text-foreground-muted">
              Explore components, foundations, and documentation for the design
              system.
            </p>
          </Link>

          {/* Demo Gallery Card */}
          <Link
            href="/demo"
            className="group p-6 rounded-xl border border-border bg-surface hover:border-[var(--primitive-blue-500)] hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-[var(--primitive-blue-100)] dark:bg-[var(--primitive-blue-900)]/30 flex items-center justify-center">
                <Kanban
                  className="w-6 h-6 text-[var(--primitive-blue-600)]"
                  weight="duotone"
                />
              </div>
              <div>
                <h2 className="text-heading-sm font-semibold text-foreground group-hover:text-[var(--primitive-blue-600)] transition-colors">
                  Demo Gallery
                </h2>
                <p className="text-caption text-foreground-muted">
                  6 interactive demos
                </p>
              </div>
            </div>
            <p className="text-body-sm text-foreground-muted">
              Try out interactive demos of ATS features including forms, Kanban,
              and more.
            </p>
          </Link>
        </div>

        {/* Featured Demos Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-body-strong font-semibold text-foreground">
              Featured Demos
            </h3>
            <Link
              href="/demo"
              className="flex items-center gap-1 text-caption text-[var(--primitive-green-600)] hover:text-[var(--primitive-green-700)] transition-colors"
            >
              View all
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {featuredDemos.map((demo) => {
              const colors = colorMap[demo.color as keyof typeof colorMap];
              const Icon = demo.icon;

              return (
                <Link
                  key={demo.href}
                  href={demo.href}
                  className={`group p-4 rounded-lg border border-[var(--primitive-neutral-200)] dark:border-[var(--primitive-neutral-700)] bg-[var(--primitive-neutral-100)]/50 dark:bg-[var(--primitive-neutral-800)]/20 ${colors.hover} hover:bg-white dark:hover:bg-[var(--primitive-neutral-800)]/40 transition-all duration-200`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-md ${colors.bg} flex items-center justify-center`}
                    >
                      <Icon className={`w-4 h-4 ${colors.icon}`} weight="duotone" />
                    </div>
                    <h4 className="text-body-sm font-medium text-foreground group-hover:text-[var(--primitive-green-600)] transition-colors">
                      {demo.title}
                    </h4>
                  </div>
                  <p className="text-caption text-foreground-muted line-clamp-2">
                    {demo.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-caption text-foreground-subtle">
          Part of the Green Jobs Board ecosystem
        </p>
      </div>
    </div>
  );
}

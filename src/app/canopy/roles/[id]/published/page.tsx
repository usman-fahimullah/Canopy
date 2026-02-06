"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * Role Published Confirmation Page
 *
 * Two-column layout: left text/CTA, right celebration illustration.
 * Shown after an employer successfully publishes a role.
 *
 * @figma https://www.figma.com/design/pYb1oVPjAokb91tZAEFQ1J/Green-Jobs-Board-2.0?node-id=293-4860
 */
export default function RolePublishedPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--primitive-neutral-100)] px-12 py-6">
      {/* Card container — two-column, rounded, full-width */}
      <div className="flex w-full flex-1 items-stretch overflow-clip rounded-[var(--radius-2xl)]">
        {/* Left column: Text + Buttons */}
        <div className="flex flex-1 flex-col justify-center gap-12 px-12 py-12">
          {/* Text content — gap-12px between heading and body */}
          <div className="flex flex-col gap-3">
            <h1 className="text-heading-lg font-medium text-[var(--primitive-green-800)]">
              Role posted successfully!
            </h1>
            <p className="text-body text-[var(--primitive-green-800)]">
              Congratulations! You&apos;ve successfully posted your roles, and we&apos;re excited to
              see the amazing candidates that will apply.
            </p>
          </div>

          {/* Action buttons — gap-12px between them */}
          <div className="flex items-start gap-3">
            <Button variant="primary" size="lg" onClick={() => router.push("/canopy/roles")}>
              View Open Roles
            </Button>
            <Button variant="secondary" size="lg" onClick={() => router.push("/canopy/roles/new")}>
              Submit another role
            </Button>
          </div>
        </div>

        {/* Right column: Illustration */}
        <div className="relative hidden flex-1 overflow-clip lg:block">
          <img
            src="/illustrations/role-success-illustration.svg"
            alt="Two people celebrating by jumping on a trampoline"
            className="h-full w-full object-contain object-center"
          />
        </div>
      </div>
    </div>
  );
}

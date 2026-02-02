"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  Buildings,
  CheckCircle,
  WarningCircle,
  UserPlus,
} from "@phosphor-icons/react";

interface InviteData {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  organization: {
    id: string;
    name: string;
    logo: string | null;
    description: string | null;
  };
  invitedBy: {
    name: string;
  };
}

type PageState = "loading" | "valid" | "error" | "accepting" | "accepted";

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--background-subtle)]">
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-body text-[var(--foreground-muted)]">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<PageState>("loading");
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acceptResult, setAcceptResult] = useState<{
    organizationName: string;
    role: string;
  } | null>(null);

  // Validate invite on mount
  useEffect(() => {
    if (!token) {
      setState("error");
      setError("No invitation token provided");
      return;
    }

    async function validateInvite() {
      try {
        const res = await fetch(`/api/invite/${token}`);
        if (!res.ok) {
          const data = await res.json();
          setState("error");
          setError(data.error || "Invalid invitation");
          return;
        }
        const data = await res.json();
        setInvite(data.invite);
        setState("valid");
      } catch {
        setState("error");
        setError("Failed to validate invitation. Please try again.");
      }
    }

    validateInvite();
  }, [token]);

  async function handleAccept() {
    if (!token) return;
    setState("accepting");

    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          // Not logged in — redirect to signup with invite token
          router.push(`/signup?invite=${token}&email=${invite?.email || ""}`);
          return;
        }
        setState("error");
        setError(data.error || "Failed to accept invitation");
        return;
      }

      setAcceptResult({
        organizationName: data.organizationName || invite?.organization.name || "",
        role: data.role || invite?.role || "",
      });
      setState("accepted");
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  function getRoleName(role: string) {
    return role === "RECRUITER" ? "Recruiter" : "Hiring Team Member";
  }

  // Loading state
  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background-subtle)]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-body text-[var(--foreground-muted)]">
            Validating invitation...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background-subtle)] p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <WarningCircle
              size={48}
              weight="duotone"
              className="mx-auto mb-4 text-[var(--foreground-error)]"
            />
            <h1 className="text-heading-sm font-bold text-[var(--foreground-default)] mb-2">
              Invitation Invalid
            </h1>
            <p className="text-body text-[var(--foreground-muted)] mb-6">
              {error}
            </p>
            <Button onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Accepted state
  if (state === "accepted" && acceptResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background-subtle)] p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle
              size={48}
              weight="duotone"
              className="mx-auto mb-4 text-[var(--foreground-success)]"
            />
            <h1 className="text-heading-sm font-bold text-[var(--foreground-default)] mb-2">
              Welcome to the team!
            </h1>
            <p className="text-body text-[var(--foreground-muted)] mb-6">
              You&apos;ve joined{" "}
              <span className="font-semibold text-[var(--foreground-default)]">
                {acceptResult.organizationName}
              </span>{" "}
              as a {getRoleName(acceptResult.role)}.
            </p>
            <Button onClick={() => router.push("/canopy/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Valid invite — show details and accept button
  if (!invite) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background-subtle)] p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            {invite.organization.logo ? (
              <img
                src={invite.organization.logo}
                alt={invite.organization.name}
                className="mx-auto mb-4 h-16 w-16 rounded-[var(--radius-card)] object-contain"
              />
            ) : (
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[var(--radius-card)] bg-[var(--background-brand-subtle)]">
                <Buildings
                  size={32}
                  weight="duotone"
                  className="text-[var(--foreground-brand)]"
                />
              </div>
            )}
            <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
              Join {invite.organization.name}
            </h1>
            <p className="mt-2 text-body text-[var(--foreground-muted)]">
              <span className="font-medium text-[var(--foreground-default)]">
                {invite.invitedBy.name}
              </span>{" "}
              invited you to join as a{" "}
              <span className="font-medium text-[var(--foreground-default)]">
                {getRoleName(invite.role)}
              </span>
            </p>
          </div>

          {invite.organization.description && (
            <div className="mb-6 rounded-[var(--radius-lg)] bg-[var(--background-subtle)] p-4">
              <p className="text-caption text-[var(--foreground-muted)]">
                {invite.organization.description}
              </p>
            </div>
          )}

          <div className="mb-6 rounded-[var(--radius-lg)] border border-[var(--border-muted)] p-4">
            <p className="text-caption font-medium text-[var(--foreground-default)] mb-2">
              What you&apos;ll be able to do
            </p>
            {invite.role === "RECRUITER" ? (
              <ul className="space-y-1 text-caption text-[var(--foreground-muted)]">
                <li>Post and manage job roles</li>
                <li>Review and manage candidates</li>
                <li>View hiring analytics</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-caption text-[var(--foreground-muted)]">
                <li>View candidates for your assigned roles</li>
                <li>Leave feedback and evaluations</li>
              </ul>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAccept}
              loading={state === "accepting"}
              className="w-full"
            >
              <UserPlus size={20} weight="bold" className="mr-2" />
              Accept Invitation
            </Button>
            <p className="text-center text-caption text-[var(--foreground-subtle)]">
              Accepting as {invite.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

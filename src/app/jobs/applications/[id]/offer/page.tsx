"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, EnvelopeSimple, PencilLine } from "@phosphor-icons/react";
import { Button, Spinner } from "@/components/ui";
import { OfferLetterPreview } from "@/components/offers";
import { OfferBadge } from "@/components/offers";
import Link from "next/link";
import { logger, formatError } from "@/lib/logger";

interface OfferData {
  id: string;
  status: string;
  salary: number | null;
  salaryCurrency: string;
  startDate: string;
  department: string | null;
  letterContent: string;
  signingMethod: string;
  signingLink: string | null;
  signingDocumentUrl: string | null;
  signingInstructions: string | null;
  sentAt: string | null;
  viewedAt: string | null;
  signedAt: string | null;
  organization: {
    name: string;
    logo: string | null;
    primaryColor: string;
    fontFamily: string;
  };
  application: {
    job: { title: string };
    seeker: {
      account: { name: string | null };
    };
  };
}

export default function CandidateOfferPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const [offer, setOffer] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        // First, find the offer by application ID
        const res = await fetch(`/api/jobs/applications/${applicationId}/offer`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("No offer found for this application.");
            return;
          }
          throw new Error("Failed to load offer");
        }
        const data = await res.json();
        setOffer(data.offer);

        // Mark as viewed if this is the first view
        if (data.offer?.id && data.offer.status === "SENT") {
          fetch(`/api/jobs/offers/${data.offer.id}/view`, {
            method: "POST",
          }).catch((err) => {
            logger.error("Failed to mark offer as viewed", { error: formatError(err) });
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load offer");
        logger.error("Error loading offer", { error: formatError(err) });
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-body text-[var(--foreground-muted)]">{error || "Offer not found"}</p>
        <Link href="/jobs/applications">
          <Button variant="ghost">
            <ArrowLeft size={16} className="mr-1" />
            Back to Applications
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-subtle)]">
      {/* Header */}
      <div className="border-b border-[var(--border-default)] bg-white px-8 py-6">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/jobs/applications"
            className="mb-4 inline-flex items-center gap-1 text-caption text-[var(--foreground-muted)] hover:text-[var(--foreground-default)]"
          >
            <ArrowLeft size={14} />
            Back to Applications
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-heading-sm font-bold text-[var(--foreground-default)]">
                Offer from {offer.organization.name}
              </h1>
              <p className="mt-1 text-body-sm text-[var(--foreground-muted)]">
                {offer.application.job.title}
              </p>
            </div>
            <OfferBadge status={offer.status as any} />
          </div>
        </div>
      </div>

      {/* Letter content */}
      <div className="px-8 py-8">
        <OfferLetterPreview
          letterContent={offer.letterContent}
          organization={{
            name: offer.organization.name,
            logo: offer.organization.logo,
            primaryColor: offer.organization.primaryColor,
          }}
        />

        {/* Next Steps */}
        <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-[var(--border-default)] bg-white p-8">
          <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">Next Steps</h2>

          {offer.signingMethod === "SIGNING_LINK" && offer.signingLink && (
            <div className="mt-4 space-y-3">
              <p className="text-body-sm text-[var(--foreground-muted)]">
                Your employer has provided a signing link. Click below to review and sign the formal
                offer document.
              </p>
              <a
                href={offer.signingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Button>
                  <PencilLine size={16} className="mr-1" />
                  Review & Sign
                </Button>
              </a>
              <p className="text-caption text-[var(--foreground-muted)]">
                You&apos;ll be taken to an external signing tool to review and sign the formal offer
                document.
              </p>
            </div>
          )}

          {offer.signingMethod === "DOCUMENT_UPLOAD" && offer.signingDocumentUrl && (
            <div className="mt-4 space-y-3">
              <p className="text-body-sm text-[var(--foreground-muted)]">
                Your employer has attached the formal offer document for your review.
              </p>
              <a href={offer.signingDocumentUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Download Document</Button>
              </a>
              <p className="text-caption text-[var(--foreground-muted)]">
                Follow your employer&apos;s instructions for signing and returning it.
              </p>
            </div>
          )}

          {offer.signingMethod === "OFFLINE" && (
            <div className="mt-4 space-y-3">
              <p className="text-body-sm text-[var(--foreground-muted)]">
                {offer.signingInstructions ||
                  "Your employer will reach out with signing details. If you have questions, you can message them directly."}
              </p>
              <Link href="/jobs/messages">
                <Button variant="outline">
                  <EnvelopeSimple size={16} className="mr-1" />
                  Go to Messages
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

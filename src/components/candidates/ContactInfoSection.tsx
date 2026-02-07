"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { PencilSimple } from "@phosphor-icons/react";

/**
 * ContactInfoSection — Figma-aligned 2-column contact info display.
 *
 * @figma https://figma.com/design/niUFJMIpfrizs1Kjsu1O4S/Candid?node-id=890-1346
 */

interface ContactInfoSectionProps {
  name: string | null;
  email: string;
  phone: string | null;
  pronouns: string | null;
  location: string | null;
  linkedinUrl: string | null;
  onEditContactInfo?: () => void;
}

interface InfoRowProps {
  label: string;
  value: string | null | undefined;
  href?: string;
  isLast?: boolean;
}

function InfoRow({ label, value, href, isLast = false }: InfoRowProps) {
  if (!value) return null;

  return (
    <div
      className={`flex items-baseline gap-32 py-3 ${
        !isLast ? "border-b border-[var(--border-emphasis)]" : ""
      }`}
    >
      <dt className="flex-[1_0_0] text-body text-[var(--foreground-muted)]">{label}</dt>
      <dd className="flex-[1_0_0] text-body text-[var(--foreground-default)]">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--foreground-link)] hover:text-[var(--foreground-link-hover)] hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function ContactInfoSection({
  name,
  email,
  phone,
  pronouns,
  location,
  linkedinUrl,
  onEditContactInfo,
}: ContactInfoSectionProps) {
  // Build rows array to know which is last
  const rows = [
    { label: "Full Name", value: name },
    { label: "Pronouns", value: pronouns },
    { label: "Email Address", value: email, href: `mailto:${email}` },
    { label: "Phone", value: phone, href: phone ? `tel:${phone}` : undefined },
    { label: "Location", value: location },
    {
      label: "LinkedIn",
      value: linkedinUrl ? "View profile" : null,
      href: linkedinUrl ?? undefined,
    },
  ].filter((row) => row.value);

  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="text-heading-sm font-medium text-[var(--foreground-default)]">
          Contact Info
        </h3>
        {onEditContactInfo && (
          <Button variant="tertiary" size="sm" onClick={onEditContactInfo}>
            <PencilSimple size={16} weight="regular" className="mr-1.5" />
            Edit Contact Info
          </Button>
        )}
      </div>
      <dl>
        {rows.map((row, idx) => (
          <InfoRow
            key={row.label}
            label={row.label}
            value={row.value}
            href={row.href}
            isLast={idx === rows.length - 1}
          />
        ))}
      </dl>
    </section>
  );
}

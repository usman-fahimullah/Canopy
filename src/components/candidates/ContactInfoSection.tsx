"use client";

import { EnvelopeSimple, Phone, MapPin, LinkedinLogo } from "@phosphor-icons/react";

interface ContactInfoSectionProps {
  name: string | null;
  email: string;
  phone: string | null;
  pronouns: string | null;
  location: string | null;
  linkedinUrl: string | null;
}

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-baseline justify-between py-2">
      <dt className="text-caption text-[var(--foreground-muted)]">{label}</dt>
      <dd className="text-caption font-medium text-[var(--foreground-default)]">
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
}: ContactInfoSectionProps) {
  return (
    <section>
      <h3 className="mb-3 text-body font-semibold text-[var(--foreground-default)]">
        Contact info
      </h3>
      <dl className="divide-y divide-[var(--border-muted)]">
        <InfoRow label="Name" value={name} />
        <InfoRow label="Pronouns" value={pronouns} />
        <InfoRow label="Email" value={email} href={`mailto:${email}`} />
        <InfoRow label="Phone" value={phone} href={phone ? `tel:${phone}` : undefined} />
        <InfoRow label="Location" value={location} />
        <InfoRow
          label="LinkedIn"
          value={linkedinUrl ? "View profile" : null}
          href={linkedinUrl ?? undefined}
        />
      </dl>
    </section>
  );
}

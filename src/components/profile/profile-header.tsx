"use client";

import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import {
  Camera,
  PencilSimple,
  Plus,
  MapPin,
  LinkedinLogo,
  FacebookLogo,
  InstagramLogo,
  Globe,
  Export,
} from "@phosphor-icons/react";
import { getCoverPreset } from "@/lib/profile/cover-presets";
import { cn } from "@/lib/utils";

interface SocialLinks {
  linkedinUrl?: string | null;
  instagramUrl?: string | null;
  threadsUrl?: string | null;
  facebookUrl?: string | null;
  blueskyUrl?: string | null;
  xUrl?: string | null;
  websiteUrl?: string | null;
}

interface ProfileHeaderProps {
  name: string | null;
  avatar: string | null;
  location: string | null;
  badge: string | null;
  coverImage: string | null;
  socialLinks: SocialLinks;
  summary: string | null;
  skills: string[];
  isOwner?: boolean;
  onEditCover?: () => void;
  onEditPhoto?: () => void;
  onEditContact?: () => void;
  onEditSocials?: () => void;
  onEditSummary?: () => void;
  onEditSkills?: () => void;
  onShare?: () => void;
}

const hasSocials = (links: SocialLinks) => Object.values(links).some((v) => v != null && v !== "");

export function ProfileHeader({
  name,
  avatar,
  location,
  badge,
  coverImage,
  socialLinks,
  summary,
  skills,
  isOwner = true,
  onEditCover,
  onEditPhoto,
  onEditContact,
  onEditSocials,
  onEditSummary,
  onEditSkills,
  onShare,
}: ProfileHeaderProps) {
  const cover = getCoverPreset(coverImage);

  return (
    <div className="relative w-full border-b border-[var(--border-muted)] bg-[var(--background-default)]">
      {/* Cover image - Figma: 256px height, full width */}
      <div className="relative h-[256px] w-full overflow-hidden">
        <Image src={cover.src} alt={cover.alt} fill className="object-cover" priority />
        {isOwner && (
          <div className="absolute right-6 top-6 flex gap-2">
            {/* Figma: rounded buttons with subtle background */}
            <Button
              variant="inverse"
              size="icon"
              onClick={onEditCover}
              aria-label="Edit background"
              className="h-11 w-11 rounded-[var(--radius-xl)]"
            >
              <PencilSimple size={20} weight="regular" />
            </Button>
            <Button
              variant="inverse"
              size="icon"
              onClick={onShare}
              aria-label="Share profile"
              className="h-11 w-11 rounded-[var(--radius-xl)]"
            >
              <Export size={20} weight="regular" />
            </Button>
          </div>
        )}
      </div>

      {/* Avatar + info area - with responsive padding matching content sections */}
      <div className="relative px-12 pb-8">
        {/* Avatar overlapping cover - positioned with negative margin */}
        <div className="relative -mt-16 mb-4">
          <div
            className={cn(
              "group relative inline-block rounded-full border-4 border-[var(--background-default)] shadow-[var(--shadow-sm)]",
              isOwner && "cursor-pointer"
            )}
            onClick={isOwner ? onEditPhoto : undefined}
            role={isOwner ? "button" : undefined}
            tabIndex={isOwner ? 0 : undefined}
            aria-label={isOwner ? "Change profile photo" : undefined}
            onKeyDown={
              isOwner
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onEditPhoto?.();
                    }
                  }
                : undefined
            }
          >
            <Avatar
              src={avatar ?? undefined}
              name={name ?? undefined}
              size="2xl"
              shape="circle"
              color="purple"
              className="!border-0"
            />
            {/* Hover overlay — sized to match the avatar (inside the border) */}
            {isOwner && (
              <div className="pointer-events-none absolute inset-1 flex items-center justify-center rounded-full opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
                <Camera
                  size={32}
                  weight="fill"
                  className="text-[var(--foreground-on-emphasis)] drop-shadow-md"
                />
              </div>
            )}
          </div>
        </div>

        {/* Name + badge - Figma: large name with badge inline */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-heading-md font-semibold leading-tight text-[var(--foreground-default)] md:text-heading-lg md:font-medium">
            {name ?? "Your Name"}
          </h1>
          {badge && (
            <Badge
              variant="success"
              size="default"
              className="border border-[var(--badge-success-border)] font-bold"
            >
              🎓 {badge}
            </Badge>
          )}
        </div>

        {/* Location + contact info */}
        <div className="mt-2 flex flex-wrap items-center gap-2 text-body text-[var(--foreground-muted)]">
          {location && (
            <>
              <span className="flex items-center gap-1">
                <MapPin size={16} weight="fill" />
                {location}
              </span>
              <span className="text-[var(--foreground-subtle)]">·</span>
            </>
          )}
          {isOwner && (
            <Button
              variant="link"
              onClick={onEditContact}
              className="p-0 text-body underline underline-offset-2"
            >
              Contact Info
            </Button>
          )}
        </div>

        {/* Social links */}
        <div className="mt-4">
          {hasSocials(socialLinks) ? (
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.linkedinUrl && (
                <SocialButton href={socialLinks.linkedinUrl} label="LinkedIn">
                  <LinkedinLogo size={18} weight="fill" />
                </SocialButton>
              )}
              {socialLinks.facebookUrl && (
                <SocialButton href={socialLinks.facebookUrl} label="Facebook">
                  <FacebookLogo size={18} weight="fill" />
                </SocialButton>
              )}
              {socialLinks.instagramUrl && (
                <SocialButton href={socialLinks.instagramUrl} label="Instagram">
                  <InstagramLogo size={18} weight="fill" />
                </SocialButton>
              )}
              {socialLinks.websiteUrl && (
                <SocialButton href={socialLinks.websiteUrl} label="Website">
                  <Globe size={18} weight="fill" />
                </SocialButton>
              )}
              {isOwner && (
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={onEditSocials}
                  aria-label="Add more socials"
                  className="!h-9 !w-9 !rounded-full"
                >
                  <Plus size={18} weight="bold" />
                </Button>
              )}
            </div>
          ) : isOwner ? (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={onEditSocials}
                aria-label="Add socials"
                className="!h-9 !w-9 !rounded-full"
              >
                <Plus size={18} weight="bold" />
              </Button>
              <span className="text-body text-[var(--foreground-muted)]">Add Your Socials</span>
            </div>
          ) : null}
        </div>

        {/* Summary + Skills — side by side */}
        {(summary || (skills && skills.length > 0) || isOwner) && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Summary column */}
            {(summary || isOwner) && (
              <div>
                {summary ? (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-caption-strong text-[var(--foreground-muted)]">
                        Summary
                      </h3>
                      {isOwner && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={onEditSummary}
                          className="p-0 text-caption"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    <p className="text-body-sm leading-relaxed text-[var(--foreground-default)]">
                      {summary}
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full items-start justify-between overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--background-info)] p-6">
                    <div className="flex max-w-[280px] flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-body-strong text-[var(--foreground-default)]">
                          Add a summary about yourself.
                        </h3>
                        <p className="text-caption text-[var(--foreground-muted)]">
                          Tell your career story, and show recruiters what you&apos;re made of!
                        </p>
                      </div>
                      <Button variant="inverse" onClick={onEditSummary} className="w-fit">
                        Write Your Story
                      </Button>
                    </div>
                    <div className="hidden shrink-0 sm:block">
                      <Image
                        src="/illustrations/profile-summary-illustration.svg"
                        alt=""
                        width={120}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Skills column */}
            {(skills && skills.length > 0) || isOwner ? (
              <div>
                {skills && skills.length > 0 ? (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-caption-strong text-[var(--foreground-muted)]">Skills</h3>
                      {isOwner && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={onEditSkills}
                          className="p-0 text-caption"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Chip key={skill} variant="neutral" size="md">
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full items-start justify-between overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--background-subtle)] p-6">
                    <div className="flex max-w-[280px] flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-body-strong text-[var(--foreground-default)]">
                          Add your skills
                        </h3>
                        <p className="text-caption text-[var(--foreground-muted)]">
                          Showcase your expertise to help you stand out in a competitive landscape.
                        </p>
                      </div>
                      <Button variant="inverse" onClick={onEditSkills} className="w-fit">
                        Add Skills
                      </Button>
                    </div>
                    <div className="hidden shrink-0 sm:block">
                      <Image
                        src="/illustrations/profile-skills-illustration.svg"
                        alt=""
                        width={120}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        "bg-[var(--button-primary-background)] text-[var(--button-primary-foreground)]",
        "transition-colors hover:bg-[var(--button-primary-background-hover)]"
      )}
    >
      {children}
    </a>
  );
}

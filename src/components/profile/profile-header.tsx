"use client";

import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PencilSimple,
  ShareNetwork,
  Plus,
  MapPin,
  LinkedinLogo,
  FacebookLogo,
  InstagramLogo,
  Globe,
} from "@phosphor-icons/react";
import { getCoverPreset } from "@/lib/profile/cover-presets";
import { cn } from "@/lib/utils";
import { SummaryIllustration, SkillsIllustration } from "./illustrations";

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
  /** Whether user has a bio/summary written */
  hasSummary?: boolean;
  /** Skills the user has added */
  skills?: string[];
  isOwner?: boolean;
  onEditCover?: () => void;
  onEditPhoto?: () => void;
  onEditContact?: () => void;
  onEditSocials?: () => void;
  onShare?: () => void;
  onEditSummary?: () => void;
  onEditSkills?: () => void;
}

const hasSocials = (links: SocialLinks) => Object.values(links).some((v) => v != null && v !== "");

export function ProfileHeader({
  name,
  avatar,
  location,
  badge,
  coverImage,
  socialLinks,
  hasSummary = false,
  skills = [],
  isOwner = true,
  onEditCover,
  onEditPhoto,
  onEditContact,
  onEditSocials,
  onShare,
  onEditSummary,
  onEditSkills,
}: ProfileHeaderProps) {
  const cover = getCoverPreset(coverImage);

  return (
    <div className="relative w-full">
      {/* Cover image - Figma: 256px height */}
      <div className="relative h-[256px] w-full overflow-hidden">
        <Image src={cover.src} alt={cover.alt} fill className="object-cover" priority />
        {isOwner && (
          <div className="absolute right-6 top-6 flex gap-2">
            {/* Figma: teal/green circular buttons */}
            <button
              onClick={onEditCover}
              aria-label="Edit background"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-green-700)] text-white transition-colors hover:bg-[var(--primitive-green-800)]"
            >
              <PencilSimple size={20} weight="bold" />
            </button>
            <button
              onClick={onShare}
              aria-label="Share profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primitive-green-700)] text-white transition-colors hover:bg-[var(--primitive-green-800)]"
            >
              <ShareNetwork size={20} weight="bold" />
            </button>
          </div>
        )}
      </div>

      {/* Avatar + info area */}
      <div className="px-6 pb-6">
        {/* Avatar overlapping cover - Figma: 128px, -80px overlap, 6px white border */}
        <div className="relative -mt-20 mb-4">
          <div className="relative inline-block">
            {/* White ring wrapper around avatar */}
            <div className="rounded-full border-[6px] border-white shadow-[0_0_0_2px_rgba(0,0,0,0.05)]">
              <Avatar
                src={avatar ?? undefined}
                name={name ?? undefined}
                size="2xl"
                shape="circle"
                color="purple"
                className="h-[116px] w-[116px] !border-0"
              />
            </div>
            {isOwner && (
              <button
                onClick={onEditPhoto}
                aria-label="Edit profile photo"
                className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primitive-green-700)] text-white transition-colors hover:bg-[var(--primitive-green-800)]"
              >
                <PencilSimple size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>

        {/* Name + badge - Figma: 48px medium weight, badge with emoji */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[48px] font-medium leading-tight text-[var(--foreground-default)]">
            {name ?? "Your Name"}
          </h1>
          {badge && (
            <Badge
              variant="default"
              size="lg"
              className="!bg-[var(--primitive-purple-200)] !text-[var(--primitive-purple-700)]"
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
                <MapPin size={16} />
                {location}
              </span>
              <span className="text-[var(--foreground-subtle)]">·</span>
            </>
          )}
          {isOwner && (
            <Button variant="link" onClick={onEditContact} className="p-0 text-body">
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
                <button
                  onClick={onEditSocials}
                  aria-label="Add more socials"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primitive-green-700)] text-white transition-colors hover:bg-[var(--primitive-green-800)]"
                >
                  <Plus size={16} weight="bold" />
                </button>
              )}
            </div>
          ) : isOwner ? (
            <Button
              variant="ghost"
              leftIcon={<Plus size={16} weight="bold" />}
              onClick={onEditSocials}
            >
              Add Your Socials
            </Button>
          ) : null}
        </div>

        {/* CTA Cards - Summary & Skills - Figma: horizontal layout with illustration on right */}
        {isOwner && (!hasSummary || skills.length === 0) && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Summary CTA Card - Figma: white bg, border, horizontal layout */}
            {!hasSummary && (
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--border-muted)] bg-white p-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-body-strong text-[var(--foreground-default)]">
                    Add a summary about yourself.
                  </h3>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    Tell your career story, and show recruiters what you&apos;re made of!
                  </p>
                  <Button variant="outline" onClick={onEditSummary} className="w-fit">
                    Write Your Story
                  </Button>
                </div>
                <div className="ml-4 shrink-0">
                  <SummaryIllustration width={100} height={100} />
                </div>
              </div>
            )}

            {/* Skills CTA Card - Figma: white bg, border, horizontal layout with person illustration */}
            {skills.length === 0 && (
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--border-muted)] bg-white p-6">
                <div className="flex flex-col gap-3">
                  <h3 className="text-body-strong text-[var(--foreground-default)]">
                    Add your skills
                  </h3>
                  <p className="text-caption text-[var(--foreground-muted)]">
                    Quickly add relevant skills to your profile, showcasing your expertise to help
                    you stand out in a competitive landscape.
                  </p>
                  <Button variant="outline" onClick={onEditSkills} className="w-fit">
                    Add Skills
                  </Button>
                </div>
                <div className="ml-4 shrink-0">
                  <SkillsIllustration width={100} height={100} />
                </div>
              </div>
            )}
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

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
    <div className="relative w-full border-b border-[var(--primitive-neutral-300)] bg-white pb-[104px]">
      {/* Cover image - Figma: 256px height */}
      <div className="relative mb-[-80px] h-[256px] w-full overflow-hidden">
        <Image src={cover.src} alt={cover.alt} fill className="object-cover" priority />
        {isOwner && (
          <div className="absolute right-14 top-12 flex gap-3">
            {/* Figma: cream/beige rounded-16px buttons with dark icons */}
            <button
              onClick={onEditCover}
              aria-label="Edit background"
              className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)] transition-colors hover:bg-[var(--primitive-neutral-300)]"
            >
              <PencilSimple size={24} weight="regular" />
            </button>
            <button
              onClick={onShare}
              aria-label="Share profile"
              className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[var(--primitive-neutral-200)] text-[var(--primitive-green-800)] transition-colors hover:bg-[var(--primitive-neutral-300)]"
            >
              <ShareNetwork size={24} weight="regular" />
            </button>
          </div>
        )}
      </div>

      {/* Avatar + info area */}
      <div className="px-12">
        {/* Avatar overlapping cover - Figma: 128px, 6px white border */}
        <div className="relative mb-3">
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
                className="absolute bottom-0 left-[101px] flex h-12 w-12 items-center justify-center rounded-[16px] border-[6px] border-white bg-[var(--primitive-blue-200)] text-[var(--primitive-green-800)] transition-colors hover:bg-[var(--primitive-blue-300)]"
              >
                <PencilSimple size={24} weight="regular" />
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
              className="!rounded-[48px] !bg-[var(--primitive-blue-100)] !px-2 !py-2 !text-[var(--primitive-blue-500)]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[var(--primitive-blue-200)] text-[var(--primitive-green-800)] transition-colors hover:bg-[var(--primitive-blue-300)]"
                >
                  <Plus size={20} weight="regular" />
                </button>
              )}
            </div>
          ) : isOwner ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onEditSocials}
                aria-label="Add socials"
                className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[var(--primitive-blue-200)] text-[var(--primitive-green-800)] transition-colors hover:bg-[var(--primitive-blue-300)]"
              >
                <Plus size={20} weight="regular" />
              </button>
              <span className="text-body text-[var(--foreground-muted)]">Add Your Socials</span>
            </div>
          ) : null}
        </div>

        {/* CTA Cards - Summary & Skills - Figma: horizontal layout with illustration on right */}
        {isOwner && (!hasSummary || skills.length === 0) && (
          <div className="mt-6 flex w-full gap-4 py-6">
            {/* Summary CTA Card - Figma: purple-100 bg, no border, horizontal layout */}
            {!hasSummary && (
              <div className="flex flex-1 items-start justify-between rounded-[16px] bg-[var(--primitive-purple-100)] px-6 py-4">
                <div className="flex w-[304px] flex-col gap-4 py-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-body-strong text-[var(--foreground-default)]">
                      Add a summary about yourself.
                    </h3>
                    <p className="text-caption text-[var(--foreground-default)]">
                      Tell your career story, and show recruiters what you&apos;re made of!
                    </p>
                  </div>
                  <Button variant="inverse" onClick={onEditSummary} className="w-fit">
                    Write Your Story
                  </Button>
                </div>
                <div className="shrink-0">
                  <SummaryIllustration width={166} height={138} />
                </div>
              </div>
            )}

            {/* Skills CTA Card - Figma: neutral-100 bg, no border, horizontal layout with person illustration */}
            {skills.length === 0 && (
              <div className="relative flex flex-1 items-start justify-between overflow-hidden rounded-[16px] bg-[var(--primitive-neutral-100)] px-6 py-4">
                <div className="flex w-[304px] flex-col gap-4 py-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-body-strong text-[var(--foreground-default)]">
                      Add your skills
                    </h3>
                    <p className="text-caption text-[var(--foreground-default)]">
                      Quickly add relevant skills to your profile, showcasing your expertise to help
                      you stand out in a competitive landscape.
                    </p>
                  </div>
                  <Button variant="inverse" onClick={onEditSkills} className="w-fit">
                    Add Skills
                  </Button>
                </div>
                <div className="absolute right-0 top-9 shrink-0">
                  <SkillsIllustration width={156} height={208} />
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

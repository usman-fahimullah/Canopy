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
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-[var(--primitive-blue-200)] hover:bg-[var(--primitive-blue-300)]"
              onClick={onEditCover}
              aria-label="Edit background"
            >
              <PencilSimple size={18} weight="bold" />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="bg-[var(--primitive-blue-200)] hover:bg-[var(--primitive-blue-300)]"
              onClick={onShare}
              aria-label="Share profile"
            >
              <ShareNetwork size={18} weight="bold" />
            </Button>
          </div>
        )}
      </div>

      {/* Avatar + info area */}
      <div className="px-6 pb-6">
        {/* Avatar overlapping cover - Figma: 128px, -80px overlap, 6px white border */}
        <div className="relative -mt-20 mb-4">
          <div className="relative inline-block">
            <div className="rounded-full border-[6px] border-white">
              <Avatar
                src={avatar ?? undefined}
                name={name ?? undefined}
                size="2xl"
                shape="circle"
                className="h-[128px] w-[128px]"
              />
            </div>
            {isOwner && (
              <Button
                variant="secondary"
                size="icon-sm"
                className="absolute -bottom-1 -right-1 bg-[var(--primitive-blue-200)] hover:bg-[var(--primitive-blue-300)]"
                onClick={onEditPhoto}
                aria-label="Edit profile photo"
              >
                <PencilSimple size={14} weight="bold" />
              </Button>
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
              variant="info"
              size="lg"
              className="bg-[var(--primitive-blue-100)] text-[var(--primitive-blue-700)]"
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
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="bg-[var(--primitive-blue-200)] hover:bg-[var(--primitive-blue-300)]"
                  onClick={onEditSocials}
                  aria-label="Add more socials"
                >
                  <Plus size={16} weight="bold" />
                </Button>
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

        {/* CTA Cards - Summary & Skills - Figma: inside header as containers */}
        {isOwner && (!hasSummary || skills.length === 0) && (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Summary CTA Card - Figma: purple background #f7f2ff */}
            {!hasSummary && (
              <div className="rounded-[16px] bg-[var(--primitive-purple-100)] p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <SummaryIllustration />
                  <div className="space-y-2">
                    <h3 className="text-body-strong text-[var(--foreground-default)]">
                      Tell Your Climate Story
                    </h3>
                    <p className="text-caption text-[var(--foreground-muted)]">
                      Share your journey and passion for sustainability
                    </p>
                  </div>
                  <Button variant="inverse" onClick={onEditSummary}>
                    Write Your Story
                  </Button>
                </div>
              </div>
            )}

            {/* Skills CTA Card - Figma: neutral background #faf9f7 */}
            {skills.length === 0 && (
              <div className="rounded-[16px] bg-[var(--primitive-neutral-100)] p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                  <SkillsIllustration />
                  <div className="space-y-2">
                    <h3 className="text-body-strong text-[var(--foreground-default)]">
                      Showcase Your Skills
                    </h3>
                    <p className="text-caption text-[var(--foreground-muted)]">
                      Add skills to help employers find you
                    </p>
                  </div>
                  <Button variant="inverse" onClick={onEditSkills}>
                    Add Skills
                  </Button>
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

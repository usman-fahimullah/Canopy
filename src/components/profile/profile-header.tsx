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
  Leaf,
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
  isOwner?: boolean;
  onEditCover?: () => void;
  onEditPhoto?: () => void;
  onEditContact?: () => void;
  onEditSocials?: () => void;
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
  isOwner = true,
  onEditCover,
  onEditPhoto,
  onEditContact,
  onEditSocials,
  onShare,
}: ProfileHeaderProps) {
  const cover = getCoverPreset(coverImage);

  return (
    <div className="relative">
      {/* Cover image */}
      <div className="relative h-[180px] w-full overflow-hidden rounded-t-[var(--radius-card)]">
        <Image src={cover.src} alt={cover.alt} fill className="object-cover" priority />
        {isOwner && (
          <div className="absolute right-4 top-4 flex gap-2">
            <Button
              variant="inverse"
              size="icon-sm"
              onClick={onEditCover}
              aria-label="Edit background"
            >
              <PencilSimple size={18} weight="bold" />
            </Button>
            <Button variant="inverse" size="icon-sm" onClick={onShare} aria-label="Share profile">
              <ShareNetwork size={18} weight="bold" />
            </Button>
          </div>
        )}
      </div>

      {/* Avatar + info area */}
      <div className="px-6 pb-6">
        {/* Avatar overlapping cover */}
        <div className="relative -mt-12 mb-4">
          <div className="relative inline-block">
            <Avatar src={avatar ?? undefined} name={name ?? undefined} size="xl" shape="circle" />
            {isOwner && (
              <Button
                variant="secondary"
                size="icon-sm"
                className="absolute -bottom-1 -right-1"
                onClick={onEditPhoto}
                aria-label="Edit profile photo"
              >
                <PencilSimple size={14} weight="bold" />
              </Button>
            )}
          </div>
        </div>

        {/* Name + badge */}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-heading-md font-bold text-[var(--foreground-default)]">
            {name ?? "Your Name"}
          </h1>
          {badge && (
            <Badge variant="success" icon={<Leaf size={14} weight="fill" />}>
              {badge}
            </Badge>
          )}
        </div>

        {/* Location + contact info */}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-body text-[var(--foreground-muted)]">
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

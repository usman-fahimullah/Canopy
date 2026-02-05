"use client";

import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/chip";
import { Card, CardContent } from "@/components/ui/card";
import {
  LinkedinLogo,
  InstagramLogo,
  FacebookLogo,
  Globe,
  DownloadSimple,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ShareProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string | null;
  avatar: string | null;
  location: string | null;
  skills: string[];
  profileUrl: string;
}

const SHARE_BUTTONS = [
  {
    label: "Share on LinkedIn",
    icon: LinkedinLogo,
    className: "bg-[#0077B5] text-white hover:bg-[#006699]",
  },
  {
    label: "Share on Instagram",
    icon: InstagramLogo,
    className: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white",
  },
  {
    label: "Share on Threads",
    icon: Globe,
    className:
      "bg-[var(--primitive-neutral-800)] text-white hover:bg-[var(--primitive-neutral-700)]",
  },
  {
    label: "Share on Bluesky",
    icon: Globe,
    className: "bg-[#0085FF] text-white hover:bg-[#0070D4]",
  },
  {
    label: "Share on Facebook",
    icon: FacebookLogo,
    className: "bg-[#1877F2] text-white hover:bg-[#1565C0]",
  },
  {
    label: "Share on X",
    icon: Globe,
    className:
      "bg-[var(--primitive-neutral-800)] text-white hover:bg-[var(--primitive-neutral-700)]",
  },
] as const;

export function ShareProfileModal({
  open,
  onOpenChange,
  name,
  avatar,
  location,
  skills,
  profileUrl,
}: ShareProfileModalProps) {
  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(`Check out my climate career profile!`);
    const url = encodeURIComponent(profileUrl);

    const urls: Record<string, string> = {
      "Share on LinkedIn": `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "Share on Facebook": `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "Share on X": `https://x.com/intent/tweet?text=${text}&url=${url}`,
    };

    const shareUrl = urls[platform];
    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader>
          <ModalTitle>Share Your Profile</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Left — share buttons */}
            <div className="space-y-3">
              {SHARE_BUTTONS.map((btn) => {
                const Icon = btn.icon;
                return (
                  <button
                    key={btn.label}
                    onClick={() => shareToSocial(btn.label)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-body font-medium transition-opacity hover:opacity-90",
                      btn.className
                    )}
                  >
                    <Icon size={20} weight="fill" />
                    {btn.label}
                  </button>
                );
              })}
              <Button variant="outline" leftIcon={<DownloadSimple size={16} />} className="w-full">
                Download as .png
              </Button>
            </div>

            {/* Right — profile preview card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={avatar ?? undefined}
                    name={name ?? undefined}
                    size="lg"
                    shape="circle"
                  />
                  <h3 className="mt-3 text-body-strong text-[var(--foreground-default)]">
                    {name ?? "Your Name"}
                  </h3>
                  {location && (
                    <p className="text-caption text-[var(--foreground-muted)]">{location}</p>
                  )}
                  {skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {skills.slice(0, 5).map((skill) => (
                        <Chip key={skill} variant="neutral" size="sm">
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="mt-4">
                    Checkout my profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

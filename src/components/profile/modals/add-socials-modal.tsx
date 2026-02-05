"use client";

import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkedinLogo, InstagramLogo, FacebookLogo, Globe } from "@phosphor-icons/react";

// Threads and Bluesky don't have dedicated Phosphor icons
// Using closest matches per the plan: ThreadsLogo → use text, Butterfly → Bluesky
// Actually checking Phosphor: ThreadsLogo exists, and we use Globe as fallback for Bluesky

interface SocialLinksData {
  linkedinUrl: string | null;
  instagramUrl: string | null;
  threadsUrl: string | null;
  facebookUrl: string | null;
  blueskyUrl: string | null;
  xUrl: string | null;
  websiteUrl: string | null;
}

interface AddSocialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SocialLinksData;
  onSave: (data: SocialLinksData) => void;
  loading?: boolean;
}

const SOCIAL_FIELDS = [
  {
    key: "linkedinUrl" as const,
    label: "LinkedIn URL",
    icon: LinkedinLogo,
    placeholder: "https://linkedin.com/in/...",
  },
  {
    key: "instagramUrl" as const,
    label: "Instagram URL",
    icon: InstagramLogo,
    placeholder: "https://instagram.com/...",
  },
  {
    key: "threadsUrl" as const,
    label: "Threads URL",
    icon: Globe,
    placeholder: "https://threads.net/@...",
  },
  {
    key: "facebookUrl" as const,
    label: "Facebook URL",
    icon: FacebookLogo,
    placeholder: "https://facebook.com/...",
  },
  {
    key: "blueskyUrl" as const,
    label: "Bluesky URL",
    icon: Globe,
    placeholder: "https://bsky.app/profile/...",
  },
  { key: "xUrl" as const, label: "X URL", icon: Globe, placeholder: "https://x.com/..." },
  {
    key: "websiteUrl" as const,
    label: "Personal Website URL",
    icon: Globe,
    placeholder: "https://...",
  },
] as const;

export function AddSocialsModal({
  open,
  onOpenChange,
  data,
  onSave,
  loading,
}: AddSocialsModalProps) {
  const [values, setValues] = useState<SocialLinksData>({
    linkedinUrl: data.linkedinUrl ?? "",
    instagramUrl: data.instagramUrl ?? "",
    threadsUrl: data.threadsUrl ?? "",
    facebookUrl: data.facebookUrl ?? "",
    blueskyUrl: data.blueskyUrl ?? "",
    xUrl: data.xUrl ?? "",
    websiteUrl: data.websiteUrl ?? "",
  });

  const handleChange = (key: keyof SocialLinksData, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const cleaned: SocialLinksData = {} as SocialLinksData;
    for (const key of Object.keys(values) as Array<keyof SocialLinksData>) {
      cleaned[key] = values[key] || null;
    }
    onSave(cleaned);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Add Your Socials</ModalTitle>
        </ModalHeader>
        <ModalBody className="space-y-3">
          {SOCIAL_FIELDS.map((field) => {
            const Icon = field.icon;
            return (
              <Input
                key={field.key}
                value={values[field.key] ?? ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                leftAddon={<Icon size={20} weight="fill" />}
              />
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={loading}>
            Save Your Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

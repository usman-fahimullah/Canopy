"use client";

import * as React from "react";
import {
  GearSix,
  ShareNetwork,
  Rss,
  EnvelopeSimple,
  ChatCircleDots,
  FunnelSimple,
  UsersFour,
} from "@phosphor-icons/react";
import { ModalSidebar, ModalSidebarItem } from "@/components/ui/modal";

// ============================================
// TYPES
// ============================================

export type SettingsSection =
  | "general"
  | "share"
  | "job-boards"
  | "confirmation-email"
  | "first-reply"
  | "hiring-stages"
  | "hiring-team";

interface JobSettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  stageNames?: string[];
}

// ============================================
// SIDEBAR ITEMS CONFIG
// ============================================

const sidebarItems: {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "general",
    label: "General",
    icon: <GearSix weight="fill" className="h-4 w-4" />,
  },
  {
    id: "share",
    label: "Share settings",
    icon: <ShareNetwork weight="fill" className="h-4 w-4" />,
  },
  {
    id: "job-boards",
    label: "Job boards",
    icon: <Rss weight="bold" className="h-4 w-4" />,
  },
  {
    id: "confirmation-email",
    label: "Confirmation email",
    icon: <EnvelopeSimple weight="fill" className="h-4 w-4" />,
  },
  {
    id: "first-reply",
    label: "First reply status",
    icon: <ChatCircleDots weight="fill" className="h-4 w-4" />,
  },
  {
    id: "hiring-stages",
    label: "Hiring stages",
    icon: <FunnelSimple weight="bold" className="h-4 w-4" />,
  },
  {
    id: "hiring-team",
    label: "Hiring team",
    icon: <UsersFour weight="bold" className="h-4 w-4" />,
  },
];

// ============================================
// COMPONENT
// ============================================

export function JobSettingsSidebar({ activeSection, onSectionChange }: JobSettingsSidebarProps) {
  return (
    <ModalSidebar>
      {sidebarItems.map((item) => (
        <ModalSidebarItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeSection === item.id}
          onClick={() => onSectionChange(item.id)}
        />
      ))}
    </ModalSidebar>
  );
}

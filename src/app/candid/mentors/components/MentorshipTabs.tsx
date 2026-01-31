"use client";

import { SegmentedController } from "@/components/ui/segmented-controller";
import { UsersThree, User, Star } from "@phosphor-icons/react";
import type { MentorshipTabType } from "./types";

const tabOptions = [
  {
    value: "find" as MentorshipTabType,
    label: "Find Mentors",
    icon: <UsersThree size={16} weight="bold" />,
  },
  {
    value: "my_mentors" as MentorshipTabType,
    label: "My Mentors",
    icon: <User size={16} weight="bold" />,
  },
  {
    value: "my_mentees" as MentorshipTabType,
    label: "My Mentees",
    icon: <Star size={16} weight="bold" />,
  },
];

export function MentorshipTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: MentorshipTabType;
  onTabChange: (tab: MentorshipTabType) => void;
}) {
  return (
    <SegmentedController
      options={tabOptions}
      value={activeTab}
      onValueChange={(v) => onTabChange(v as MentorshipTabType)}
      aria-label="Mentorship navigation"
    />
  );
}

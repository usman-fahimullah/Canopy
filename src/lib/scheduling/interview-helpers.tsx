"use client";

import * as React from "react";
import { VideoCamera, Phone, MapPin, Clock } from "@phosphor-icons/react";
import type { InterviewType } from "./types";

/**
 * Get the appropriate icon for an interview type.
 *
 * Used by EventCard and UpcomingInterviews components.
 */
export const getInterviewIcon = (type?: InterviewType) => {
  switch (type) {
    case "video":
      return <VideoCamera className="h-3 w-3" />;
    case "phone":
      return <Phone className="h-3 w-3" />;
    case "onsite":
      return <MapPin className="h-3 w-3" />;
    default:
      return <Clock className="h-3 w-3" />;
  }
};

/**
 * Default color classes for interview event types.
 *
 * Maps interview types to badge background/border token classes.
 */
export const defaultEventColors: Record<InterviewType, string> = {
  video: "bg-badge-info-background border-badge-info-border",
  phone: "bg-badge-success-background border-badge-success-border",
  onsite: "bg-badge-accent-background border-badge-accent-border",
};

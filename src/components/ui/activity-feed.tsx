"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from "date-fns";
import {
  EnvelopeSimple,
  Note,
  ArrowRight,
  User,
  Calendar,
  Star,
  ChatCircle,
  PaperPlaneTilt,
  Eye,
  FileText,
  Phone,
  VideoCamera,
  CheckCircle,
  XCircle,
  Clock,
  Pencil,
  Tag,
  At,
  LinkSimple,
  Sparkle,
} from "@phosphor-icons/react";

/* ============================================
   Activity Types
   ============================================ */
export type ActivityType =
  | "stage_change"
  | "note_added"
  | "email_sent"
  | "email_received"
  | "interview_scheduled"
  | "interview_completed"
  | "scorecard_submitted"
  | "application_received"
  | "candidate_viewed"
  | "document_uploaded"
  | "call_logged"
  | "rating_changed"
  | "tag_added"
  | "tag_removed"
  | "mention"
  | "assignment_changed"
  | "status_changed"
  | "ai_suggestion"
  | "custom";

export interface ActivityActor {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface ActivityMetadata {
  fromStage?: string;
  toStage?: string;
  score?: number;
  rating?: number;
  subject?: string;
  tagName?: string;
  assignee?: ActivityActor;
  noteContent?: string;
  documentName?: string;
  interviewType?: "phone" | "video" | "onsite";
  duration?: number;
  aiConfidence?: number;
  link?: string;
  [key: string]: unknown;
}

export interface Activity {
  id: string;
  type: ActivityType;
  actor?: ActivityActor;
  timestamp: string | Date;
  metadata?: ActivityMetadata;
  /** Optional custom message override */
  message?: string;
  /** For candidate-specific feeds */
  candidateId?: string;
  candidateName?: string;
  /** For job-specific feeds */
  jobId?: string;
  jobTitle?: string;
}

export interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  /** Group activities by date */
  groupByDate?: boolean;
  /** Show actor avatars */
  showAvatars?: boolean;
  /** Max height before scrolling */
  maxHeight?: string;
  /** Callback when an activity is clicked */
  onActivityClick?: (activity: Activity) => void;
  /** Load more callback */
  onLoadMore?: () => void;
  hasMore?: boolean;
}

/* ============================================
   Activity Icon Mapping
   ============================================ */
const activityIcons: Record<ActivityType, React.ReactNode> = {
  stage_change: <ArrowRight className="h-4 w-4" />,
  note_added: <Note className="h-4 w-4" />,
  email_sent: <PaperPlaneTilt className="h-4 w-4" />,
  email_received: <EnvelopeSimple className="h-4 w-4" />,
  interview_scheduled: <Calendar className="h-4 w-4" />,
  interview_completed: <CheckCircle className="h-4 w-4" />,
  scorecard_submitted: <Star className="h-4 w-4" />,
  application_received: <User className="h-4 w-4" />,
  candidate_viewed: <Eye className="h-4 w-4" />,
  document_uploaded: <FileText className="h-4 w-4" />,
  call_logged: <Phone className="h-4 w-4" />,
  rating_changed: <Star className="h-4 w-4" />,
  tag_added: <Tag className="h-4 w-4" />,
  tag_removed: <Tag className="h-4 w-4" />,
  mention: <At className="h-4 w-4" />,
  assignment_changed: <User className="h-4 w-4" />,
  status_changed: <Clock className="h-4 w-4" />,
  ai_suggestion: <Sparkle className="h-4 w-4" />,
  custom: <ChatCircle className="h-4 w-4" />,
};

const activityColors: Record<ActivityType, string> = {
  stage_change: "bg-badge-info-background text-badge-info-foreground",
  note_added: "bg-badge-neutral-background text-badge-neutral-foreground",
  email_sent: "bg-badge-primary-background text-badge-primary-foreground",
  email_received: "bg-badge-primary-background text-badge-primary-foreground",
  interview_scheduled: "bg-badge-accent-background text-badge-accent-foreground",
  interview_completed: "bg-badge-success-background text-badge-success-foreground",
  scorecard_submitted: "bg-badge-warning-background text-badge-warning-foreground",
  application_received: "bg-badge-success-background text-badge-success-foreground",
  candidate_viewed: "bg-badge-neutral-background text-badge-neutral-foreground",
  document_uploaded: "bg-badge-neutral-background text-badge-neutral-foreground",
  call_logged: "bg-badge-info-background text-badge-info-foreground",
  rating_changed: "bg-badge-warning-background text-badge-warning-foreground",
  tag_added: "bg-badge-accent-background text-badge-accent-foreground",
  tag_removed: "bg-badge-neutral-background text-badge-neutral-foreground",
  mention: "bg-badge-info-background text-badge-info-foreground",
  assignment_changed: "bg-badge-accent-background text-badge-accent-foreground",
  status_changed: "bg-badge-neutral-background text-badge-neutral-foreground",
  ai_suggestion: "bg-badge-primary-background text-badge-primary-foreground",
  custom: "bg-badge-neutral-background text-badge-neutral-foreground",
};

/* ============================================
   Activity Message Generator
   ============================================ */
const generateActivityMessage = (activity: Activity): React.ReactNode => {
  if (activity.message) return activity.message;

  const { type, actor, metadata, candidateName, jobTitle } = activity;
  const actorName = actor?.name || "Someone";

  switch (type) {
    case "stage_change":
      return (
        <>
          <span className="font-medium">{actorName}</span> moved{" "}
          {candidateName && <span className="font-medium">{candidateName}</span>} from{" "}
          <Badge variant="secondary" size="sm">
            {metadata?.fromStage}
          </Badge>{" "}
          to{" "}
          <Badge variant="secondary" size="sm">
            {metadata?.toStage}
          </Badge>
        </>
      );

    case "note_added":
      return (
        <>
          <span className="font-medium">{actorName}</span> added a note
          {candidateName && (
            <>
              {" "}
              on <span className="font-medium">{candidateName}</span>
            </>
          )}
        </>
      );

    case "email_sent":
      return (
        <>
          <span className="font-medium">{actorName}</span> sent an email
          {metadata?.subject && (
            <>
              : &quot;<span className="italic">{metadata.subject}</span>&quot;
            </>
          )}
        </>
      );

    case "email_received":
      return (
        <>
          New email received
          {candidateName && (
            <>
              {" "}
              from <span className="font-medium">{candidateName}</span>
            </>
          )}
          {metadata?.subject && (
            <>
              : &quot;<span className="italic">{metadata.subject}</span>&quot;
            </>
          )}
        </>
      );

    case "interview_scheduled":
      return (
        <>
          <span className="font-medium">{actorName}</span> scheduled a{" "}
          {metadata?.interviewType || "interview"} interview
          {candidateName && (
            <>
              {" "}
              with <span className="font-medium">{candidateName}</span>
            </>
          )}
        </>
      );

    case "interview_completed":
      return (
        <>
          Interview completed
          {candidateName && (
            <>
              {" "}
              with <span className="font-medium">{candidateName}</span>
            </>
          )}
        </>
      );

    case "scorecard_submitted":
      return (
        <>
          <span className="font-medium">{actorName}</span> submitted a scorecard
          {metadata?.rating && (
            <>
              {" "}
              with rating <span className="font-medium">{metadata.rating}/5</span>
            </>
          )}
        </>
      );

    case "application_received":
      return (
        <>
          <span className="font-medium">{candidateName || "New candidate"}</span> applied
          {jobTitle && (
            <>
              {" "}
              for <span className="font-medium">{jobTitle}</span>
            </>
          )}
        </>
      );

    case "candidate_viewed":
      return (
        <>
          <span className="font-medium">{actorName}</span> viewed{" "}
          {candidateName && <span className="font-medium">{candidateName}</span>}
          &apos;s profile
        </>
      );

    case "document_uploaded":
      return (
        <>
          <span className="font-medium">{actorName}</span> uploaded{" "}
          <span className="font-medium">{metadata?.documentName || "a document"}</span>
        </>
      );

    case "call_logged":
      return (
        <>
          <span className="font-medium">{actorName}</span> logged a call
          {metadata?.duration && <> ({metadata.duration} min)</>}
        </>
      );

    case "rating_changed":
      return (
        <>
          <span className="font-medium">{actorName}</span> changed the rating to{" "}
          <span className="font-medium">{metadata?.rating}/5</span>
        </>
      );

    case "tag_added":
      return (
        <>
          <span className="font-medium">{actorName}</span> added tag{" "}
          <Badge variant="secondary" size="sm">
            {metadata?.tagName}
          </Badge>
        </>
      );

    case "tag_removed":
      return (
        <>
          <span className="font-medium">{actorName}</span> removed tag{" "}
          <Badge variant="secondary" size="sm">
            {metadata?.tagName}
          </Badge>
        </>
      );

    case "mention":
      return (
        <>
          <span className="font-medium">{actorName}</span> mentioned you in a note
        </>
      );

    case "assignment_changed":
      return (
        <>
          <span className="font-medium">{actorName}</span> assigned{" "}
          {candidateName && <span className="font-medium">{candidateName}</span>} to{" "}
          <span className="font-medium">{metadata?.assignee?.name || "someone"}</span>
        </>
      );

    case "ai_suggestion":
      return (
        <>
          AI suggested an action
          {metadata?.aiConfidence && <> ({Math.round(metadata.aiConfidence * 100)}% confidence)</>}
        </>
      );

    default:
      return activity.message || "Activity recorded";
  }
};

/* ============================================
   Date Formatting
   ============================================ */
const formatActivityDate = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? parseISO(timestamp) : timestamp;
  return formatDistanceToNow(date, { addSuffix: true });
};

const formatGroupDate = (timestamp: string | Date): string => {
  const date = typeof timestamp === "string" ? parseISO(timestamp) : timestamp;
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMMM d, yyyy");
};

/* ============================================
   Activity Item Component
   ============================================ */
interface ActivityItemProps {
  activity: Activity;
  showAvatar?: boolean;
  onClick?: (activity: Activity) => void;
  index?: number;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  showAvatar = true,
  onClick,
  index = 0,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasExpandableContent = activity.type === "note_added" && activity.metadata?.noteContent;

  return (
    <div
      className={cn(
        "group flex gap-3 rounded-lg p-3",
        "transition-all duration-fast hover:bg-background-muted",
        "animate-fade-in",
        onClick && "cursor-pointer"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onClick?.(activity)}
    >
      {/* Icon or Avatar */}
      <div className="mt-0.5 flex-shrink-0">
        {showAvatar && activity.actor ? (
          <div className="transition-transform duration-fast group-hover:scale-110">
            <Avatar src={activity.actor.avatar} name={activity.actor.name} size="sm" />
          </div>
        ) : (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              "transition-all duration-fast group-hover:scale-110 group-hover:shadow-sm",
              activityColors[activity.type]
            )}
          >
            {activityIcons[activity.type]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground-default group-hover:text-foreground-default text-sm leading-relaxed transition-colors duration-fast">
          {generateActivityMessage(activity)}
        </p>

        {/* Note preview with expand affordance */}
        {hasExpandableContent && (
          <div
            className={cn(
              "mt-2 rounded-lg bg-background-subtle p-3 text-sm text-foreground-muted",
              "border border-transparent transition-all duration-fast",
              "cursor-pointer hover:border-border-muted hover:bg-background-muted",
              isExpanded ? "line-clamp-none" : "line-clamp-2"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {activity.metadata?.noteContent}
            {!isExpanded &&
              activity.metadata?.noteContent &&
              activity.metadata.noteContent.length > 100 && (
                <span className="ml-1 font-medium text-foreground-brand">Show more</span>
              )}
          </div>
        )}

        {/* Link */}
        {activity.metadata?.link && (
          <a
            href={activity.metadata.link}
            className={cn(
              "mt-2 inline-flex items-center gap-1.5 text-sm",
              "text-foreground-link hover:text-foreground-brand",
              "transition-colors duration-fast hover:underline"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <LinkSimple className="h-3.5 w-3.5 transition-transform duration-fast group-hover:scale-110" />
            View details
          </a>
        )}

        {/* Timestamp */}
        <p className="mt-1.5 text-xs text-foreground-subtle transition-colors duration-fast group-hover:text-foreground-muted">
          {formatActivityDate(activity.timestamp)}
        </p>
      </div>

      {/* Expand indicator for clickable items */}
      {onClick && (
        <div className="flex-shrink-0 self-center opacity-0 transition-opacity duration-fast group-hover:opacity-100">
          <ArrowRight className="h-4 w-4 text-foreground-muted" />
        </div>
      )}
    </div>
  );
};

/* ============================================
   Activity Feed Component
   ============================================ */
const ActivityFeed = React.forwardRef<HTMLDivElement, ActivityFeedProps>(
  (
    {
      activities,
      loading = false,
      emptyMessage = "No activity yet",
      className,
      groupByDate = true,
      showAvatars = true,
      maxHeight,
      onActivityClick,
      onLoadMore,
      hasMore = false,
    },
    ref
  ) => {
    // Group activities by date if enabled
    const groupedActivities = React.useMemo(() => {
      if (!groupByDate) {
        return { ungrouped: activities };
      }

      const groups: Record<string, Activity[]> = {};
      activities.forEach((activity) => {
        const dateKey = formatGroupDate(activity.timestamp);
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(activity);
      });
      return groups;
    }, [activities, groupByDate]);

    return (
      <div ref={ref} className={cn("relative", className)} style={{ maxHeight }}>
        <div className={cn(maxHeight && "overflow-y-auto", "space-y-1")}>
          {loading && activities.length === 0 ? (
            // Loading skeleton with staggered animation
            <div className="space-y-3 p-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse gap-3"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="bg-skeleton-background h-8 w-8 animate-shimmer rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div
                      className="bg-skeleton-background h-4 w-3/4 animate-shimmer rounded"
                      style={{ animationDelay: "100ms" }}
                    />
                    <div
                      className="bg-skeleton-background h-3 w-1/4 animate-shimmer rounded"
                      style={{ animationDelay: "200ms" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            // Empty state with animation
            <div className="flex animate-fade-in flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 animate-scale-in items-center justify-center rounded-full bg-background-muted">
                <ChatCircle className="h-8 w-8 text-foreground-muted" />
              </div>
              <p
                className="animate-fade-in text-foreground-muted"
                style={{ animationDelay: "100ms" }}
              >
                {emptyMessage}
              </p>
            </div>
          ) : groupByDate ? (
            // Grouped by date with staggered animations
            Object.entries(groupedActivities).map(([date, items], groupIndex) => (
              <div
                key={date}
                className="animate-fade-in"
                style={{ animationDelay: `${groupIndex * 100}ms` }}
              >
                <div className="bg-background-default/95 sticky top-0 z-10 px-3 py-2 backdrop-blur-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                    {date}
                  </p>
                </div>
                <div className="space-y-1">
                  {items.map((activity, itemIndex) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      showAvatar={showAvatars}
                      onClick={onActivityClick}
                      index={itemIndex}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Ungrouped with staggered animations
            activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                showAvatar={showAvatars}
                onClick={onActivityClick}
                index={index}
              />
            ))
          )}

          {/* Load more */}
          {hasMore && onLoadMore && (
            <div className="animate-fade-in p-3 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadMore}
                loading={loading}
                className="transition-all duration-fast hover:scale-105 active:scale-95"
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);
ActivityFeed.displayName = "ActivityFeed";

/* ============================================
   Compact Activity List (for sidebars)
   ============================================ */
interface CompactActivityListProps {
  activities: Activity[];
  maxItems?: number;
  onViewAll?: () => void;
  className?: string;
}

const CompactActivityList: React.FC<CompactActivityListProps> = ({
  activities,
  maxItems = 5,
  onViewAll,
  className,
}) => {
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className={cn("space-y-2", className)}>
      {displayedActivities.map((activity, index) => (
        <div
          key={activity.id}
          className={cn(
            "group -mx-2 flex items-start gap-2 rounded-lg p-2",
            "transition-all duration-fast hover:bg-background-muted",
            "animate-fade-in cursor-pointer"
          )}
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div
            className={cn(
              "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
              "transition-transform duration-fast group-hover:scale-110",
              activityColors[activity.type]
            )}
          >
            {React.cloneElement(activityIcons[activity.type] as React.ReactElement, {
              className: "h-3 w-3",
            })}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground-default group-hover:text-foreground-default line-clamp-2 text-xs transition-colors duration-fast">
              {generateActivityMessage(activity)}
            </p>
            <p className="text-xs text-foreground-subtle transition-colors duration-fast group-hover:text-foreground-muted">
              {formatActivityDate(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}

      {activities.length > maxItems && onViewAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="w-full text-xs transition-all duration-fast hover:scale-[1.02] active:scale-[0.98]"
        >
          View all ({activities.length})
        </Button>
      )}
    </div>
  );
};

/* ============================================
   Exports
   ============================================ */
export {
  ActivityFeed,
  ActivityItem,
  CompactActivityList,
  activityIcons,
  activityColors,
  generateActivityMessage,
  formatActivityDate,
  formatGroupDate,
};

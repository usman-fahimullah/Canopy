"use client";

import React from "react";
import { ActivityFeed, activityIcons, activityColors } from "@/components/ui/activity-feed";
import type { Activity, ActivityType } from "@/components/ui/activity-feed";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

// Sample activities for demonstration
const sampleActivities: Activity[] = [
  {
    id: "1",
    type: "stage_change",
    actor: { id: "u1", name: "Sarah Chen" },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    candidateName: "Michael Park",
    metadata: { fromStage: "Screening", toStage: "Interview" },
  },
  {
    id: "2",
    type: "note_added",
    actor: { id: "u2", name: "James Wilson" },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    candidateName: "Emily Davis",
    metadata: {
      noteContent:
        "Strong technical background. Very impressed with their climate tech experience at Rivian. Would be a great fit for the sustainability lead role.",
    },
  },
  {
    id: "3",
    type: "email_sent",
    actor: { id: "u1", name: "Sarah Chen" },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    metadata: { subject: "Next Steps - Interview Invitation" },
  },
  {
    id: "4",
    type: "scorecard_submitted",
    actor: { id: "u3", name: "Lisa Wang" },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    candidateName: "David Kim",
    metadata: { rating: 4 },
  },
  {
    id: "5",
    type: "interview_scheduled",
    actor: { id: "u2", name: "James Wilson" },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    candidateName: "Jennifer Lee",
    metadata: { interviewType: "video" },
  },
  {
    id: "6",
    type: "application_received",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    candidateName: "Robert Brown",
    jobTitle: "Senior Sustainability Engineer",
  },
];

// Props documentation
const activityFeedProps = [
  {
    name: "activities",
    type: "Activity[]",
    required: true,
    description: "Array of activity objects to display",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Show skeleton loading state",
  },
  {
    name: "emptyMessage",
    type: "string",
    default: '"No activity yet"',
    description: "Message shown when there are no activities",
  },
  {
    name: "groupByDate",
    type: "boolean",
    default: "true",
    description: "Group activities by date (Today, Yesterday, etc.)",
  },
  {
    name: "showAvatars",
    type: "boolean",
    default: "true",
    description: "Show actor avatars instead of type icons",
  },
  {
    name: "maxHeight",
    type: "string",
    description: "Max height before scrolling (e.g., '400px')",
  },
  {
    name: "onActivityClick",
    type: "(activity: Activity) => void",
    description: "Callback when an activity item is clicked",
  },
  {
    name: "onLoadMore",
    type: "() => void",
    description: "Callback to load more activities (infinite scroll)",
  },
  {
    name: "hasMore",
    type: "boolean",
    default: "false",
    description: "Whether there are more activities to load",
  },
];

const activityProps = [
  {
    name: "id",
    type: "string",
    required: true,
    description: "Unique identifier for the activity",
  },
  {
    name: "type",
    type: "ActivityType",
    required: true,
    description: "Type of activity (stage_change, note_added, email_sent, etc.)",
  },
  {
    name: "actor",
    type: "{ id: string; name: string; avatar?: string; email?: string }",
    description: "The user who performed the action",
  },
  {
    name: "timestamp",
    type: "string | Date",
    required: true,
    description: "When the activity occurred",
  },
  {
    name: "metadata",
    type: "ActivityMetadata",
    description: "Additional data specific to the activity type",
  },
  {
    name: "message",
    type: "string",
    description: "Custom message override",
  },
  {
    name: "candidateId",
    type: "string",
    description: "ID of the related candidate",
  },
  {
    name: "candidateName",
    type: "string",
    description: "Name of the related candidate",
  },
  {
    name: "jobId",
    type: "string",
    description: "ID of the related job",
  },
  {
    name: "jobTitle",
    type: "string",
    description: "Title of the related job",
  },
];

// Activity types for display
const activityTypes: ActivityType[] = [
  "stage_change",
  "note_added",
  "email_sent",
  "email_received",
  "interview_scheduled",
  "interview_completed",
  "scorecard_submitted",
  "application_received",
  "candidate_viewed",
  "document_uploaded",
  "call_logged",
  "rating_changed",
  "tag_added",
  "tag_removed",
  "mention",
  "assignment_changed",
  "status_changed",
  "ai_suggestion",
];

export default function ActivityFeedPage() {
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1 id="overview" className="mb-2 text-heading-lg text-foreground">
          Activity Feed
        </h1>
        <p className="mb-4 max-w-2xl text-body text-foreground-muted">
          Timeline of candidate interactions, status changes, and hiring activities. Displays a
          chronological log of all events with contextual icons, timestamps, and actor information.
        </p>

        {/* When to Use / When Not to Use */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-background-success/10 rounded-lg border border-border-success p-4">
            <h3 className="mb-2 font-semibold text-foreground-success">When to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Candidate profile activity history</li>
              <li>• Job pipeline activity logs</li>
              <li>• Team collaboration tracking</li>
              <li>• Audit trails for hiring decisions</li>
            </ul>
          </div>
          <div className="bg-background-error/10 rounded-lg border border-border-error p-4">
            <h3 className="mb-2 font-semibold text-foreground-error">When not to use</h3>
            <ul className="space-y-1 text-sm text-foreground-muted">
              <li>• Real-time chat (use messaging component)</li>
              <li>• Simple notifications (use Toast)</li>
              <li>• System logs (use dedicated log viewer)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="A standard activity feed with grouped dates"
      >
        <CodePreview
          code={`import { ActivityFeed } from "@/components/ui/activity-feed";
import type { Activity } from "@/components/ui/activity-feed";

const activities: Activity[] = [
  {
    id: "1",
    type: "stage_change",
    actor: { id: "u1", name: "Sarah Chen" },
    timestamp: new Date().toISOString(),
    candidateName: "Michael Park",
    metadata: { fromStage: "Screening", toStage: "Interview" },
  },
  // ...more activities
];

<ActivityFeed activities={activities} />`}
        >
          <div className="max-w-lg">
            <ActivityFeed activities={sampleActivities.slice(0, 4)} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Activity Types */}
      <ComponentCard
        id="activity-types"
        title="Activity Types"
        description="Each activity type has a unique icon and color scheme"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {activityTypes.map((type) => (
            <div
              key={type}
              className="flex items-center gap-3 rounded-lg border border-border-muted p-3"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${activityColors[type]}`}
              >
                {activityIcons[type]}
              </div>
              <span className="text-body-sm font-medium text-foreground">
                {type
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </span>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Variants */}
      <ComponentCard
        id="variants"
        title="Display Variants"
        description="Configure how activities are displayed"
      >
        <div className="space-y-8">
          {/* With Avatars */}
          <div>
            <h4 className="mb-4 text-body-strong">With Avatars (Default)</h4>
            <div className="max-w-lg rounded-lg border border-border-muted">
              <ActivityFeed activities={sampleActivities.slice(0, 3)} showAvatars={true} />
            </div>
          </div>

          {/* With Icons Only */}
          <div>
            <h4 className="mb-4 text-body-strong">With Icons Only</h4>
            <div className="max-w-lg rounded-lg border border-border-muted">
              <ActivityFeed activities={sampleActivities.slice(0, 3)} showAvatars={false} />
            </div>
          </div>

          {/* Without Date Grouping */}
          <div>
            <h4 className="mb-4 text-body-strong">Without Date Grouping</h4>
            <div className="max-w-lg rounded-lg border border-border-muted">
              <ActivityFeed activities={sampleActivities.slice(0, 3)} groupByDate={false} />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Loading State */}
      <ComponentCard
        id="loading"
        title="Loading State"
        description="Skeleton placeholder while activities load"
      >
        <div className="max-w-lg rounded-lg border border-border-muted">
          <ActivityFeed activities={[]} loading />
        </div>
      </ComponentCard>

      {/* Empty State */}
      <ComponentCard
        id="empty"
        title="Empty State"
        description="Shown when there are no activities"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <Label className="mb-2 block">Default Message</Label>
            <div className="rounded-lg border border-border-muted">
              <ActivityFeed activities={[]} />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">Custom Message</Label>
            <div className="rounded-lg border border-border-muted">
              <ActivityFeed
                activities={[]}
                emptyMessage="No interactions yet. Activity will appear here as you engage with candidates."
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Scrollable */}
      <ComponentCard
        id="scrollable"
        title="Scrollable Feed"
        description="Use maxHeight for a scrollable feed with many activities"
      >
        <CodePreview
          code={`<ActivityFeed
  activities={activities}
  maxHeight="300px"
  hasMore={true}
  onLoadMore={() => loadMoreActivities()}
/>`}
        >
          <div className="max-w-lg rounded-lg border border-border-muted">
            <ActivityFeed activities={sampleActivities} maxHeight="300px" />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Interactive */}
      <ComponentCard
        id="interactive"
        title="Interactive Feed"
        description="Click activities to view details or navigate"
      >
        <CodePreview
          code={`<ActivityFeed
  activities={activities}
  onActivityClick={(activity) => {
    // Navigate to candidate or show details
    console.log("Clicked:", activity);
  }}
/>`}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="max-w-lg rounded-lg border border-border-muted">
              <ActivityFeed
                activities={sampleActivities.slice(0, 4)}
                onActivityClick={setSelectedActivity}
              />
            </div>
            <div>
              <Label className="mb-2 block">Selected Activity</Label>
              {selectedActivity ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-body-strong">
                      {selectedActivity.type
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-auto rounded-lg bg-background-muted p-3 text-caption">
                      {JSON.stringify(selectedActivity, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              ) : (
                <p className="rounded-lg border border-dashed border-border-muted p-4 text-body-sm text-foreground-muted">
                  Click an activity to see its data
                </p>
              )}
            </div>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Real-world Examples */}
      <ComponentCard id="examples" title="Real-World Examples" description="Common usage patterns">
        <div className="space-y-8">
          {/* Candidate Profile Sidebar */}
          <div>
            <h4 className="mb-4 text-body-strong">Candidate Profile Sidebar</h4>
            <div className="max-w-sm overflow-hidden rounded-xl border border-border">
              <div className="border-b border-border bg-background-subtle p-4">
                <h3 className="text-body-strong">Activity</h3>
              </div>
              <ActivityFeed activities={sampleActivities.slice(0, 4)} maxHeight="300px" />
              <div className="border-t border-border p-3">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Activity
                </Button>
              </div>
            </div>
          </div>

          {/* Job Pipeline Activity */}
          <div>
            <h4 className="mb-4 text-body-strong">Job Pipeline Activity</h4>
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle>Senior Sustainability Engineer</CardTitle>
                <p className="text-body-sm text-foreground-muted">
                  Recent activity across all candidates
                </p>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={sampleActivities} maxHeight="250px" showAvatars={true} />
              </CardContent>
            </Card>
          </div>
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <div className="space-y-8">
        <ComponentCard id="props" title="Props">
          <div className="space-y-8">
            <div>
              <h4 className="mb-3 text-body-strong">ActivityFeed</h4>
              <PropsTable props={activityFeedProps} />
            </div>

            <div>
              <h4 className="mb-3 text-body-strong">Activity Object</h4>
              <PropsTable props={activityProps} />
            </div>
          </div>
        </ComponentCard>
      </div>

      {/* Guidelines */}
      <UsageGuide
        dos={[
          "Show actor information for human-initiated actions",
          "Group activities by date for easier scanning",
          "Provide click handlers for navigation to related items",
          "Use appropriate activity types for semantic icons",
          "Show expandable content for notes with long text",
        ]}
        donts={[
          "Don't show system-only activities to end users",
          "Don't display too many activities at once (use pagination)",
          "Don't mix activity feeds from unrelated contexts",
          "Don't auto-refresh too frequently (every 30s minimum)",
          "Don't show sensitive information in activity messages",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          "**Semantic HTML**: Uses proper list structure for screen readers",
          "**Timestamps**: Relative times have full date/time in title attribute",
          "**Focus States**: Clickable items have visible focus indicators",
          "**Animation**: Respects prefers-reduced-motion preference",
          "**Loading**: Skeleton states are aria-hidden",
          "**Empty State**: Descriptive message for screen readers",
        ]}
      />

      {/* Related Components */}
      <ComponentCard
        id="related"
        title="Related Components"
        description="Components commonly used with Activity Feed"
      >
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <a
            href="/design-system/components/candidate-card"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Candidate Card</p>
            <p className="text-caption text-foreground-muted">Profile cards</p>
          </a>
          <a
            href="/design-system/components/kanban"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Kanban Board</p>
            <p className="text-caption text-foreground-muted">Pipeline view</p>
          </a>
          <a
            href="/design-system/components/timeline"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Timeline</p>
            <p className="text-caption text-foreground-muted">Event timeline</p>
          </a>
          <a
            href="/design-system/components/avatar"
            className="rounded-lg border border-border-muted p-4 transition-colors hover:border-border-brand"
          >
            <p className="font-medium">Avatar</p>
            <p className="text-caption text-foreground-muted">User images</p>
          </a>
        </div>
      </ComponentCard>

      <PageNavigation currentPath="/design-system/components/activity-feed" />
    </div>
  );
}

"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { Check, EnvelopeSimple, Phone, Calendar } from "@/components/Icons";

const timelineProps = [
  { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout orientation" },
];

const timelineDotProps = [
  { name: "variant", type: '"default" | "primary" | "success" | "warning" | "error" | "info"', default: '"default"', description: "Color variant" },
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Dot size" },
  { name: "icon", type: "ReactNode", default: "undefined", description: "Custom icon inside the dot" },
];

export default function TimelinePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Timeline
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Timeline displays a list of events in chronological order. It&apos;s useful
          for activity logs, candidate history, and process visualization.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple vertical timeline"
      >
        <CodePreview
          code={`<Timeline>
  <TimelineItem>
    <TimelineDot />
    <TimelineConnector />
    <TimelineContent>
      <TimelineHeader>
        <TimelineTitle>Application Received</TimelineTitle>
        <TimelineTime>2 hours ago</TimelineTime>
      </TimelineHeader>
    </TimelineContent>
  </TimelineItem>
</Timeline>`}
        >
          <div className="max-w-md">
            <Timeline>
              <TimelineItem>
                <TimelineDot variant="success" />
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Application Received</TimelineTitle>
                    <TimelineTime>2 hours ago</TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    John Doe applied for Solar Energy Engineer position.
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot variant="primary" />
                <TimelineConnector />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Resume Reviewed</TimelineTitle>
                    <TimelineTime>1 hour ago</TimelineTime>
                  </TimelineHeader>
                  <TimelineDescription>
                    Screened by Sarah (Hiring Manager).
                  </TimelineDescription>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineDot />
                <TimelineContent>
                  <TimelineHeader>
                    <TimelineTitle>Awaiting Interview</TimelineTitle>
                    <TimelineTime>Now</TimelineTime>
                  </TimelineHeader>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Icons */}
      <ComponentCard
        id="with-icons"
        title="With Icons"
        description="Timeline dots with custom icons"
      >
        <div className="max-w-md">
          <Timeline>
            <TimelineItem>
              <TimelineDot
                variant="success"
                icon={<Check className="w-4 h-4 text-white" />}
              />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Application Submitted</TimelineTitle>
                  <TimelineTime>Jan 15, 2024</TimelineTime>
                </TimelineHeader>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot
                variant="primary"
                icon={<EnvelopeSimple className="w-4 h-4 text-white" />}
              />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Email Sent</TimelineTitle>
                  <TimelineTime>Jan 16, 2024</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                  Initial contact email sent to candidate.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot
                variant="info"
                icon={<Phone className="w-4 h-4 text-white" />}
              />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Phone Screen</TimelineTitle>
                  <TimelineTime>Jan 18, 2024</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                  30-minute phone screen completed.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot
                variant="warning"
                icon={<Calendar className="w-4 h-4 text-white" />}
              />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Interview Scheduled</TimelineTitle>
                  <TimelineTime>Jan 22, 2024</TimelineTime>
                </TimelineHeader>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </ComponentCard>

      {/* Dot Variants */}
      <ComponentCard
        id="variants"
        title="Dot Variants"
        description="Different status colors for timeline dots"
      >
        <div className="max-w-md">
          <Timeline>
            {[
              { variant: "default" as const, title: "Default" },
              { variant: "primary" as const, title: "Primary" },
              { variant: "success" as const, title: "Success" },
              { variant: "warning" as const, title: "Warning" },
              { variant: "error" as const, title: "Error" },
              { variant: "info" as const, title: "Info" },
            ].map((item, index, arr) => (
              <TimelineItem key={item.variant}>
                <TimelineDot variant={item.variant} />
                {index < arr.length - 1 && <TimelineConnector />}
                <TimelineContent>
                  <TimelineTitle>{item.title}</TimelineTitle>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </ComponentCard>

      {/* Candidate Activity */}
      <ComponentCard
        id="candidate-activity"
        title="Candidate Activity"
        description="Real-world example: candidate activity log"
      >
        <div className="max-w-lg p-4 border border-border rounded-lg">
          <h3 className="text-body-strong font-medium mb-4">Activity</h3>
          <Timeline>
            <TimelineItem>
              <TimelineDot variant="success" size="sm" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Offer Accepted</TimelineTitle>
                  <TimelineTime>Today, 10:30 AM</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                  Candidate accepted the offer for Solar Energy Engineer role.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot variant="primary" size="sm" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Offer Extended</TimelineTitle>
                  <TimelineTime>Yesterday, 3:00 PM</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                  Sent offer letter with $95,000 base salary.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot variant="info" size="sm" />
              <TimelineConnector />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Final Interview</TimelineTitle>
                  <TimelineTime>Jan 20, 2024</TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                  Panel interview with hiring team. Strong technical skills demonstrated.
                </TimelineDescription>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineDot size="sm" />
              <TimelineContent>
                <TimelineHeader>
                  <TimelineTitle>Applied</TimelineTitle>
                  <TimelineTime>Jan 10, 2024</TimelineTime>
                </TimelineHeader>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>
      </ComponentCard>

      {/* Props - Timeline */}
      <ComponentCard id="props-timeline" title="Timeline Props">
        <PropsTable props={timelineProps} />
      </ComponentCard>

      {/* Props - TimelineDot */}
      <ComponentCard id="props-dot" title="TimelineDot Props">
        <PropsTable props={timelineDotProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for chronological event sequences",
          "Include timestamps for context",
          "Use color variants to indicate status",
          "Add icons for visual distinction",
        ]}
        donts={[
          "Don't use for non-sequential content",
          "Don't show too many events at once (paginate)",
          "Don't mix horizontal and vertical in the same view",
          "Don't omit timestamps",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/timeline" />
    </div>
  );
}

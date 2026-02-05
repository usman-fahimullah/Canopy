"use client";

import * as React from "react";
import {
  List,
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemDateBadge,
  ListItemTitle,
  ListItemDescription,
  ListItemMeta,
  ListItemTrailing,
  ListItemTrailingText,
  ListGroup,
  ListGroupHeader,
  Button,
  Avatar,
  Badge,
  AvatarGroup,
  ProgressMeterCircular,
  Switch,
} from "@/components/ui";
import {
  ComponentCard,
  UsageGuide,
  AccessibilityInfo,
} from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import {
  Bell,
  CaretRight,
  Briefcase,
  EnvelopeSimple,
  Gear,
  User,
  Check,
  Warning,
  MapPin,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react";

const listProps = [
  {
    name: "divided",
    type: "boolean",
    default: "false",
    description: "Whether to show dividers between items",
  },
  {
    name: "spacing",
    type: '"none" | "sm" | "md" | "lg"',
    default: '"none"',
    description: "Gap between list items",
  },
];

const listItemProps = [
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Padding size of the list item",
  },
  {
    name: "interactive",
    type: "boolean",
    default: "false",
    description: "Whether the item is clickable with hover states",
  },
  {
    name: "selected",
    type: "boolean",
    default: "false",
    description: "Whether the item is in selected state",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Whether the item is disabled",
  },
  {
    name: "asChild",
    type: "boolean",
    default: "false",
    description: "Render as child element (for links)",
  },
];

export default function ListItemPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>("item-1");
  const [notifications, setNotifications] = React.useState(true);

  return (
    <div className="space-y-12">
      {/* Overview */}
      <div>
        <h1
          id="overview"
          className="mb-2 text-heading-lg font-bold text-[var(--foreground-default)]"
        >
          List Item
        </h1>
        <p className="mb-4 text-body text-[var(--foreground-muted)]">
          A composable list item component for displaying structured data in vertical lists. Follows
          the 3-slot pattern: Leading (optional) | Content (required) | Trailing (optional).
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="bg-[var(--background-success)]/10 rounded-lg border border-[var(--border-success)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-success)]">When to use</h3>
            <ul className="space-y-1 text-sm text-[var(--foreground-muted)]">
              <li>• Settings and preference rows</li>
              <li>• Navigation items</li>
              <li>• Simple selection lists</li>
              <li>• Generic data rows</li>
              <li>• Job listings with actions</li>
            </ul>
          </div>
          <div className="bg-[var(--background-error)]/10 rounded-lg border border-[var(--border-error)] p-4">
            <h3 className="mb-2 font-semibold text-[var(--foreground-error)]">When not to use</h3>
            <ul className="space-y-1 text-sm text-[var(--foreground-muted)]">
              <li>• Activity feeds → use ActivityFeed</li>
              <li>• Timelines with connectors → use Timeline</li>
              <li>• Candidate cards → use CandidateCard</li>
              <li>• Data tables → use DataTable</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Anatomy */}
      <ComponentCard
        id="anatomy"
        title="Anatomy"
        description="The component follows a 3-slot pattern"
      >
        <div className="rounded-lg border border-[var(--border-muted)] bg-[var(--background-subtle)] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-brand)] bg-[var(--background-brand-subtle)]">
              <span className="text-caption-strong text-[var(--foreground-brand)]">1</span>
            </div>
            <div className="flex-1 rounded-lg border-2 border-dashed border-[var(--border-brand)] bg-[var(--background-brand-subtle)] p-4">
              <span className="text-caption-strong text-[var(--foreground-brand)]">2</span>
              <span className="ml-2 text-caption text-[var(--foreground-muted)]">
                Content (Title, Description, Meta)
              </span>
            </div>
            <div className="flex h-10 items-center justify-center rounded-lg border-2 border-dashed border-[var(--border-brand)] bg-[var(--background-brand-subtle)] px-4">
              <span className="text-caption-strong text-[var(--foreground-brand)]">3</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-caption">
            <div>
              <strong>1. Leading</strong> - Avatar, icon, or progress
            </div>
            <div>
              <strong>2. Content</strong> - Title, description, meta
            </div>
            <div>
              <strong>3. Trailing</strong> - Button, text, or controls
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="The simplest list item configuration"
      >
        <CodePreview
          code={`import { List, ListItem, ListItemContent, ListItemTitle, ListItemDescription } from "@/components/ui";

<List divided>
  <ListItem>
    <ListItemContent>
      <ListItemTitle>Project Manager: Learning Platform</ListItemTitle>
      <ListItemDescription>Capital Good Fund</ListItemDescription>
    </ListItemContent>
  </ListItem>
</List>`}
        >
          <List divided className="w-full max-w-md rounded-lg border border-[var(--border-muted)]">
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Project Manager: Learning Platform</ListItemTitle>
                <ListItemDescription>Capital Good Fund</ListItemDescription>
              </ListItemContent>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* With Leading Content */}
      <ComponentCard
        id="leading-content"
        title="Leading Content"
        description="Add avatars, icons, or progress indicators"
      >
        <CodePreview
          code={`<List divided>
  {/* With Avatar */}
  <ListItem>
    <ListItemLeading size="lg">
      <Avatar src="/company.png" size="lg" shape="square" />
    </ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Human Resources Assistant</ListItemTitle>
      <ListItemDescription>Climate Power</ListItemDescription>
    </ListItemContent>
  </ListItem>

  {/* With Progress */}
  <ListItem>
    <ListItemLeading size="lg">
      <ProgressMeterCircular value={35} goal="interviewing" size="sm" />
    </ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Complete Interview Prep</ListItemTitle>
      <ListItemDescription>35% complete</ListItemDescription>
    </ListItemContent>
  </ListItem>

  {/* With Icon */}
  <ListItem>
    <ListItemLeading size="sm">
      <Bell size={20} className="text-[var(--foreground-muted)]" />
    </ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Notifications</ListItemTitle>
      <ListItemDescription>Manage alerts</ListItemDescription>
    </ListItemContent>
  </ListItem>
</List>`}
        >
          <List divided className="w-full max-w-md rounded-lg border border-[var(--border-muted)]">
            <ListItem>
              <ListItemLeading size="lg">
                <Avatar fallback="CP" size="lg" shape="square" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Human Resources Assistant</ListItemTitle>
                <ListItemDescription>Climate Power</ListItemDescription>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemLeading size="lg">
                <ProgressMeterCircular value={35} goal="interviewing" size="sm" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Complete Interview Prep</ListItemTitle>
                <ListItemDescription>35% complete</ListItemDescription>
              </ListItemContent>
            </ListItem>
            <ListItem>
              <ListItemLeading size="sm">
                <Bell size={20} className="text-[var(--foreground-muted)]" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Notifications</ListItemTitle>
                <ListItemDescription>Manage alerts</ListItemDescription>
              </ListItemContent>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* With Trailing Content */}
      <ComponentCard
        id="trailing-content"
        title="Trailing Content"
        description="Add buttons, text, or controls to the end"
      >
        <CodePreview
          code={`<List divided>
  {/* With Button */}
  <ListItem>
    <ListItemContent>
      <ListItemTitle>Project Manager</ListItemTitle>
      <ListItemDescription>Capital Good Fund</ListItemDescription>
    </ListItemContent>
    <ListItemTrailing>
      <Button variant="tertiary" size="sm">Apply Now</Button>
    </ListItemTrailing>
  </ListItem>

  {/* With Text */}
  <ListItem>
    <ListItemContent>
      <ListItemTitle>Senior Developer</ListItemTitle>
      <ListItemDescription>TerraWatt Energy</ListItemDescription>
    </ListItemContent>
    <ListItemTrailingText>
      Jan 2025 - Mar 2025
    </ListItemTrailingText>
  </ListItem>

  {/* With Switch */}
  <ListItem>
    <ListItemContent>
      <ListItemTitle>Email Notifications</ListItemTitle>
      <ListItemDescription>Receive updates via email</ListItemDescription>
    </ListItemContent>
    <ListItemTrailing>
      <Switch checked={notifications} onCheckedChange={setNotifications} />
    </ListItemTrailing>
  </ListItem>
</List>`}
        >
          <List divided className="w-full max-w-md rounded-lg border border-[var(--border-muted)]">
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Project Manager</ListItemTitle>
                <ListItemDescription>Capital Good Fund</ListItemDescription>
              </ListItemContent>
              <ListItemTrailing>
                <Button variant="tertiary" size="sm">
                  Apply Now
                </Button>
              </ListItemTrailing>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Senior Developer</ListItemTitle>
                <ListItemDescription>TerraWatt Energy</ListItemDescription>
              </ListItemContent>
              <ListItemTrailingText>Jan 2025 - Mar 2025</ListItemTrailingText>
            </ListItem>
            <ListItem>
              <ListItemContent>
                <ListItemTitle>Email Notifications</ListItemTitle>
                <ListItemDescription>Receive updates via email</ListItemDescription>
              </ListItemContent>
              <ListItemTrailing>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </ListItemTrailing>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* With Meta Information */}
      <ComponentCard
        id="meta-info"
        title="With Meta Information"
        description="Add dot-separated metadata below the description"
      >
        <CodePreview
          code={`<ListItem size="lg">
  <ListItemLeading size="lg">
    <Avatar fallback="GA" size="lg" shape="square" />
  </ListItemLeading>
  <ListItemContent>
    <ListItemTitle>Business Engagement Officer</ListItemTitle>
    <ListItemDescription>Greenbelt Alliance</ListItemDescription>
    <ListItemMeta separator="·">
      <span>Oakland, CA</span>
      <span>Full Time</span>
      <span>$80k - $100k</span>
    </ListItemMeta>
  </ListItemContent>
  <ListItemTrailing>
    <Button variant="secondary" size="sm">View Job</Button>
  </ListItemTrailing>
</ListItem>`}
        >
          <List className="w-full max-w-lg rounded-lg border border-[var(--border-muted)]">
            <ListItem size="lg">
              <ListItemLeading size="lg">
                <Avatar fallback="GA" size="lg" shape="square" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Business Engagement Officer</ListItemTitle>
                <ListItemDescription>Greenbelt Alliance</ListItemDescription>
                <ListItemMeta separator="·">
                  <span>Oakland, CA</span>
                  <span>Full Time</span>
                  <span>$80k - $100k</span>
                </ListItemMeta>
              </ListItemContent>
              <ListItemTrailing>
                <Button variant="secondary" size="sm">
                  View Job
                </Button>
              </ListItemTrailing>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* With Date Badge */}
      <ComponentCard
        id="date-badge"
        title="With Date Badge"
        description="Add a date badge above the content for grouped lists"
      >
        <CodePreview
          code={`<List divided>
  <ListItem size="lg">
    <ListItemContent>
      <ListItemDateBadge>April 21</ListItemDateBadge>
      <div className="flex items-center gap-3 mt-2">
        <Avatar fallback="GA" size="lg" shape="square" />
        <div>
          <ListItemTitle>List title</ListItemTitle>
          <ListItemMeta separator="·">
            <span>Greenbelt Alliance</span>
            <span>Oakland, CA</span>
          </ListItemMeta>
        </div>
      </div>
    </ListItemContent>
  </ListItem>
</List>`}
        >
          <List divided className="w-full max-w-md rounded-lg border border-[var(--border-muted)]">
            <ListItem size="lg">
              <ListItemContent>
                <ListItemDateBadge>April 21</ListItemDateBadge>
                <div className="mt-2 flex items-center gap-3">
                  <Avatar fallback="GA" size="lg" shape="square" />
                  <div>
                    <ListItemTitle>Business Engagement Officer</ListItemTitle>
                    <ListItemMeta separator="·">
                      <span>Greenbelt Alliance</span>
                      <span>Oakland, CA</span>
                    </ListItemMeta>
                  </div>
                </div>
              </ListItemContent>
            </ListItem>
            <ListItem size="lg">
              <ListItemContent>
                <ListItemDateBadge>April 20</ListItemDateBadge>
                <div className="mt-2 flex items-center gap-3">
                  <Avatar fallback="TW" size="lg" shape="square" />
                  <div>
                    <ListItemTitle>Solar Installation Lead</ListItemTitle>
                    <ListItemMeta separator="·">
                      <span>TerraWatt Energy</span>
                      <span>San Jose, CA</span>
                    </ListItemMeta>
                  </div>
                </div>
              </ListItemContent>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* Interactive Lists */}
      <ComponentCard
        id="interactive"
        title="Interactive & Selection"
        description="Clickable items with hover states and selection"
      >
        <CodePreview
          code={`const [selectedId, setSelectedId] = React.useState("item-1");

<List>
  {items.map((item) => (
    <ListItem
      key={item.id}
      interactive
      selected={selectedId === item.id}
      onClick={() => setSelectedId(item.id)}
    >
      <ListItemContent>
        <ListItemTitle>{item.name}</ListItemTitle>
      </ListItemContent>
      {selectedId === item.id && (
        <ListItemTrailing>
          <Check size={16} className="text-[var(--foreground-success)]" />
        </ListItemTrailing>
      )}
    </ListItem>
  ))}
</List>`}
        >
          <List className="w-full max-w-sm rounded-lg border border-[var(--border-muted)]">
            {[
              { id: "item-1", name: "All Notifications" },
              { id: "item-2", name: "Mentions Only" },
              { id: "item-3", name: "Direct Messages" },
              { id: "item-4", name: "None" },
            ].map((item) => (
              <ListItem
                key={item.id}
                interactive
                selected={selectedId === item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <ListItemContent>
                  <ListItemTitle>{item.name}</ListItemTitle>
                </ListItemContent>
                {selectedId === item.id && (
                  <ListItemTrailing>
                    <Check size={16} weight="bold" className="text-[var(--foreground-success)]" />
                  </ListItemTrailing>
                )}
              </ListItem>
            ))}
          </List>
        </CodePreview>
      </ComponentCard>

      {/* Settings Pattern */}
      <ComponentCard
        id="settings-pattern"
        title="Settings Pattern"
        description="Common pattern for settings and preferences screens"
      >
        <CodePreview
          code={`<List divided>
  <ListItem interactive onClick={() => navigate("/notifications")}>
    <ListItemLeading size="sm">
      <Bell size={20} />
    </ListItemLeading>
    <ListItemContent>
      <ListItemTitle>Notifications</ListItemTitle>
      <ListItemDescription>Manage notification preferences</ListItemDescription>
    </ListItemContent>
    <ListItemTrailing>
      <CaretRight size={16} className="text-[var(--foreground-subtle)]" />
    </ListItemTrailing>
  </ListItem>
</List>`}
        >
          <List divided className="w-full max-w-md rounded-lg border border-[var(--border-muted)]">
            <ListItem interactive>
              <ListItemLeading size="sm">
                <Bell size={20} className="text-[var(--foreground-muted)]" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Notifications</ListItemTitle>
                <ListItemDescription>Manage notification preferences</ListItemDescription>
              </ListItemContent>
              <ListItemTrailing>
                <CaretRight size={16} className="text-[var(--foreground-subtle)]" />
              </ListItemTrailing>
            </ListItem>
            <ListItem interactive>
              <ListItemLeading size="sm">
                <EnvelopeSimple size={20} className="text-[var(--foreground-muted)]" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Email</ListItemTitle>
                <ListItemDescription>Update email address</ListItemDescription>
              </ListItemContent>
              <ListItemTrailing>
                <CaretRight size={16} className="text-[var(--foreground-subtle)]" />
              </ListItemTrailing>
            </ListItem>
            <ListItem interactive>
              <ListItemLeading size="sm">
                <User size={20} className="text-[var(--foreground-muted)]" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Profile</ListItemTitle>
                <ListItemDescription>Edit your profile information</ListItemDescription>
              </ListItemContent>
              <ListItemTrailing>
                <CaretRight size={16} className="text-[var(--foreground-subtle)]" />
              </ListItemTrailing>
            </ListItem>
            <ListItem interactive>
              <ListItemLeading size="sm">
                <Gear size={20} className="text-[var(--foreground-muted)]" />
              </ListItemLeading>
              <ListItemContent>
                <ListItemTitle>Preferences</ListItemTitle>
                <ListItemDescription>Customize your experience</ListItemDescription>
              </ListItemContent>
              <ListItemTrailing>
                <CaretRight size={16} className="text-[var(--foreground-subtle)]" />
              </ListItemTrailing>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* Rich Job Listing */}
      <ComponentCard
        id="job-listing"
        title="Rich Job Listing"
        description="Full-featured job listing with badges, meta, and actions"
      >
        <CodePreview
          code={`<ListItem size="lg">
  <ListItemLeading size="lg">
    <Avatar src="/company.png" size="lg" shape="square" />
  </ListItemLeading>
  <ListItemContent>
    <div className="flex items-center gap-2 mb-1">
      <Badge variant="error" size="sm">
        <Warning size={12} className="mr-1" />
        Closing Soon
      </Badge>
    </div>
    <ListItemTitle>Business Engagement Officer</ListItemTitle>
    <ListItemDescription>Capital Good Fund</ListItemDescription>
    <ListItemMeta separator="·">
      <span>Atlanta, GA</span>
      <AvatarGroup avatars={applicants} size="xs" max={3} />
      <span>40 Applicants</span>
    </ListItemMeta>
  </ListItemContent>
  <ListItemTrailing>
    <Button variant="secondary" size="sm">View Job</Button>
  </ListItemTrailing>
</ListItem>`}
        >
          <List className="w-full rounded-lg border border-[var(--border-muted)]">
            <ListItem size="lg">
              <ListItemLeading size="lg">
                <Avatar fallback="CGF" size="lg" shape="square" />
              </ListItemLeading>
              <ListItemContent>
                <div className="mb-1 flex items-center gap-2">
                  <Badge variant="error" size="sm">
                    <Warning size={12} className="mr-1" />
                    Closing Soon
                  </Badge>
                </div>
                <ListItemTitle>Business Engagement Officer</ListItemTitle>
                <ListItemDescription>Capital Good Fund</ListItemDescription>
                <ListItemMeta separator="·">
                  <span>Atlanta, GA</span>
                  <AvatarGroup
                    avatars={[{ name: "John Doe" }, { name: "Alice Smith" }, { name: "Mike King" }]}
                    size="xs"
                    max={3}
                  />
                  <span>40 Applicants</span>
                </ListItemMeta>
              </ListItemContent>
              <ListItemTrailing>
                <Button variant="secondary" size="sm">
                  View Job
                </Button>
              </ListItemTrailing>
            </ListItem>
          </List>
        </CodePreview>
      </ComponentCard>

      {/* Grouped Lists */}
      <ComponentCard
        id="grouped-lists"
        title="Grouped Lists"
        description="Lists with section headers"
      >
        <CodePreview
          code={`<ListGroup>
  <ListGroupHeader>Experience</ListGroupHeader>
  <List divided>
    <ListItem>...</ListItem>
    <ListItem>...</ListItem>
  </List>
</ListGroup>`}
        >
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-[var(--border-muted)]">
            <ListGroup>
              <ListGroupHeader>Experience</ListGroupHeader>
              <List divided>
                <ListItem>
                  <ListItemLeading size="lg">
                    <Avatar fallback="CP" size="lg" shape="square" />
                  </ListItemLeading>
                  <ListItemContent>
                    <ListItemTitle>Human Resources Assistant</ListItemTitle>
                    <ListItemDescription>Climate Power • Full Time</ListItemDescription>
                  </ListItemContent>
                  <ListItemTrailing className="gap-1">
                    <Button variant="primary" size="icon-sm">
                      <PencilSimple size={16} />
                    </Button>
                    <Button variant="tertiary" size="icon-sm">
                      <Trash size={16} />
                    </Button>
                  </ListItemTrailing>
                </ListItem>
                <ListItem>
                  <ListItemLeading size="lg">
                    <Avatar fallback="TW" size="lg" shape="square" />
                  </ListItemLeading>
                  <ListItemContent>
                    <ListItemTitle>Project Coordinator</ListItemTitle>
                    <ListItemDescription>TerraWatt Energy • Contract</ListItemDescription>
                  </ListItemContent>
                  <ListItemTrailing className="gap-1">
                    <Button variant="primary" size="icon-sm">
                      <PencilSimple size={16} />
                    </Button>
                    <Button variant="tertiary" size="icon-sm">
                      <Trash size={16} />
                    </Button>
                  </ListItemTrailing>
                </ListItem>
              </List>
            </ListGroup>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* Size Variants */}
      <ComponentCard
        id="sizes"
        title="Size Variants"
        description="Different padding sizes for various contexts"
      >
        <div className="space-y-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div
              key={size}
              className="w-full max-w-md rounded-lg border border-[var(--border-muted)]"
            >
              <div className="border-b border-[var(--border-muted)] bg-[var(--background-subtle)] px-4 py-2">
                <span className="text-caption-strong">size=&quot;{size}&quot;</span>
              </div>
              <ListItem size={size}>
                <ListItemLeading>
                  <Avatar fallback="JD" />
                </ListItemLeading>
                <ListItemContent>
                  <ListItemTitle>List Item Title</ListItemTitle>
                  <ListItemDescription>Description text here</ListItemDescription>
                </ListItemContent>
              </ListItem>
            </div>
          ))}
        </div>
      </ComponentCard>

      {/* Props Tables */}
      <ComponentCard id="list-props" title="List Props">
        <PropsTable props={listProps} />
      </ComponentCard>

      <ComponentCard id="list-item-props" title="ListItem Props">
        <PropsTable props={listItemProps} />
      </ComponentCard>

      {/* Usage Guide */}
      <UsageGuide
        dos={[
          "Use consistent leading content types within a list",
          "Keep titles concise (truncate with ellipsis if needed)",
          "Use the 'divided' prop for clear item separation",
          "Provide clear action labels",
          "Include alt text for all avatars",
        ]}
        donts={[
          "Don't mix avatar shapes within the same list",
          "Don't use more than 2-3 trailing actions",
          "Don't use ListItem for complex card layouts",
          "Don't nest ListItems",
          "Don't use generic action labels like 'Click here'",
        ]}
      />

      {/* Accessibility */}
      <AccessibilityInfo
        items={[
          '**Role**: List uses `role="list"`, items use `role="listitem"`',
          "**Keyboard**: Tab to focus interactive items, Enter/Space to activate",
          "**Focus indicator**: Visible ring using the focus token",
          "**States**: Uses data attributes for selection and disabled states",
          "**Screen readers**: Title and description form a coherent label",
        ]}
      />

      {/* Navigation */}
      <PageNavigation currentPath="/design-system/components/list-item" />
    </div>
  );
}

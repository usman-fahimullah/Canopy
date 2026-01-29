"use client";

import React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  Button,
} from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";
import { User, Briefcase, Calendar, Settings, MagnifyingGlass } from "@/components/Icons";

const commandProps = [
  { name: "children", type: "ReactNode", required: true, description: "Command content" },
  { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
];

const commandInputProps = [
  { name: "placeholder", type: "string", default: "undefined", description: "Placeholder text" },
  { name: "showClear", type: "boolean", default: "false", description: "Show clear button when input has value" },
  { name: "onClear", type: "() => void", default: "undefined", description: "Callback when clear button is clicked" },
];

export default function CommandPage() {
  const [value, setValue] = React.useState("");

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Command
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Command is a command palette component for search and quick actions.
          It provides keyboard-accessible navigation through searchable lists.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple command palette"
      >
        <CodePreview
          code={`<Command className="border rounded-lg">
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Candidates</CommandItem>
      <CommandItem>Jobs</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`}
        >
          <div className="max-w-md">
            <Command className="border border-border rounded-lg">
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    Candidates
                  </CommandItem>
                  <CommandItem>
                    <Briefcase className="mr-2 h-4 w-4" />
                    Jobs
                  </CommandItem>
                  <CommandItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Groups */}
      <ComponentCard
        id="with-groups"
        title="With Groups"
        description="Organize items into groups"
      >
        <div className="max-w-md">
          <Command className="border border-border rounded-lg">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Quick Actions">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  Add Candidate
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Create Job
                  <CommandShortcut>⌘J</CommandShortcut>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Navigation">
                <CommandItem>
                  <User className="mr-2 h-4 w-4" />
                  View Candidates
                </CommandItem>
                <CommandItem>
                  <Briefcase className="mr-2 h-4 w-4" />
                  View Jobs
                </CommandItem>
                <CommandItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </ComponentCard>

      {/* With Shortcuts */}
      <ComponentCard
        id="with-shortcuts"
        title="With Keyboard Shortcuts"
        description="Display keyboard shortcuts for actions"
      >
        <div className="max-w-md">
          <Command className="border border-border rounded-lg">
            <CommandInput placeholder="Search commands..." />
            <CommandList>
              <CommandGroup heading="Actions">
                <CommandItem>
                  <MagnifyingGlass className="mr-2 h-4 w-4" />
                  Search
                  <CommandShortcut>⌘K</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  New Candidate
                  <CommandShortcut>⌘N</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  New Job
                  <CommandShortcut>⌘⇧J</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  Settings
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </ComponentCard>

      {/* Controlled Search */}
      <ComponentCard
        id="controlled"
        title="Controlled Search"
        description="Manage search state externally"
      >
        <div className="space-y-4 max-w-md">
          <Command className="border border-border rounded-lg">
            <CommandInput
              placeholder="Search candidates..."
              value={value}
              onValueChange={setValue}
              showClear={value.length > 0}
              onClear={() => setValue("")}
            />
            <CommandList>
              <CommandEmpty>No candidates found for &quot;{value}&quot;</CommandEmpty>
              <CommandGroup heading="Candidates">
                <CommandItem>John Doe - Solar Engineer</CommandItem>
                <CommandItem>Jane Smith - Project Manager</CommandItem>
                <CommandItem>Mike Johnson - Sales Lead</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
          {value && (
            <p className="text-caption text-foreground-muted">
              Searching for: <span className="font-medium">{value}</span>
            </p>
          )}
        </div>
      </ComponentCard>

      {/* Props - Command */}
      <ComponentCard id="props-command" title="Command Props">
        <PropsTable props={commandProps} />
      </ComponentCard>

      {/* Props - CommandInput */}
      <ComponentCard id="props-input" title="CommandInput Props">
        <PropsTable props={commandInputProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for quick navigation and search",
          "Include keyboard shortcuts for power users",
          "Group related items together",
          "Provide helpful empty states",
        ]}
        donts={[
          "Don't use for simple dropdowns (use Select)",
          "Don't include too many items without groups",
          "Don't hide critical actions behind the command palette",
          "Don't remove the search input",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/command" />
    </div>
  );
}

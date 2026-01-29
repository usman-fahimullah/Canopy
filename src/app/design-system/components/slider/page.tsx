"use client";

import React from "react";
import { Slider, Label } from "@/components/ui";
import { ComponentCard, UsageGuide } from "@/components/design-system/ComponentSection";
import { CodePreview } from "@/components/design-system/CodeBlock";
import { PropsTable } from "@/components/design-system/PropsTable";
import { PageNavigation } from "@/components/design-system/PageNavigation";

const sliderProps = [
  { name: "value", type: "number", default: "undefined", description: "Controlled value" },
  { name: "defaultValue", type: "number", default: "0", description: "Default value" },
  { name: "onValueChange", type: "(value: number) => void", default: "undefined", description: "Change handler" },
  { name: "min", type: "number", default: "0", description: "Minimum value" },
  { name: "max", type: "number", default: "100", description: "Maximum value" },
  { name: "step", type: "number", default: "1", description: "Step increment" },
  { name: "disabled", type: "boolean", default: "false", description: "Disables the slider" },
];

export default function SliderPage() {
  const [salary, setSalary] = React.useState(80);
  const [experience, setExperience] = React.useState(5);
  const [opacity, setOpacity] = React.useState(75);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 id="overview" className="text-heading-lg text-foreground mb-2">
          Slider
        </h1>
        <p className="text-body text-foreground-muted max-w-2xl">
          Sliders allow users to select a value from a continuous range by dragging
          a handle along a track.
        </p>
      </div>

      {/* Basic Usage */}
      <ComponentCard
        id="basic-usage"
        title="Basic Usage"
        description="Simple value slider"
      >
        <CodePreview
          code={`const [value, setValue] = React.useState(50);

<div className="space-y-2">
  <Label>Volume: {value}%</Label>
  <Slider value={value} onValueChange={setValue} />
</div>`}
        >
          <div className="space-y-2 max-w-sm">
            <Label>Volume: {opacity}%</Label>
            <Slider value={opacity} onValueChange={setOpacity} />
          </div>
        </CodePreview>
      </ComponentCard>

      {/* With Custom Range */}
      <ComponentCard
        id="custom-range"
        title="Custom Range"
        description="Set min, max, and step values"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label>Salary: ${salary}k / year</Label>
            <Slider
              value={salary}
              onValueChange={setSalary}
              min={40}
              max={200}
              step={5}
            />
            <div className="flex justify-between text-caption text-foreground-muted">
              <span>$40k</span>
              <span>$200k</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Years of experience: {experience}</Label>
            <Slider
              value={experience}
              onValueChange={setExperience}
              min={0}
              max={20}
              step={1}
            />
            <div className="flex justify-between text-caption text-foreground-muted">
              <span>0 years</span>
              <span>20+ years</span>
            </div>
          </div>
        </div>
      </ComponentCard>

      {/* With Formatted Values */}
      <ComponentCard
        id="formatted-values"
        title="Formatted Values"
        description="Display values with custom formatting"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Price range</Label>
              <span className="text-body font-medium">${salary * 1000}</span>
            </div>
            <Slider
              value={salary}
              onValueChange={setSalary}
              min={10}
              max={100}
              step={5}
            />
          </div>
        </div>
      </ComponentCard>

      {/* States */}
      <ComponentCard
        id="states"
        title="States"
        description="Different slider states"
      >
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <Label>Default</Label>
            <Slider defaultValue={50} />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground-muted">Disabled</Label>
            <Slider defaultValue={30} disabled />
          </div>
        </div>
      </ComponentCard>

      {/* Props */}
      <ComponentCard id="props" title="Props">
        <PropsTable props={sliderProps} />
      </ComponentCard>

      {/* Usage Guidelines */}
      <UsageGuide
        dos={[
          "Use for selecting values from a continuous range",
          "Display the current value clearly",
          "Show min/max labels for context",
          "Use appropriate step sizes for the data type",
        ]}
        donts={[
          "Don't use for discrete choices (use Select or Radio)",
          "Don't use for text or non-numeric input",
          "Don't make the slider too narrow to use",
          "Don't hide the current value from users",
        ]}
      />

      <PageNavigation currentPath="/design-system/components/slider" />
    </div>
  );
}

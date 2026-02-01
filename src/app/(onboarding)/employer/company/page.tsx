"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { ArrowRight, ArrowLeft, Buildings, Globe, MapPin } from "@phosphor-icons/react";
import { pathwayLabels, PathwayType } from "@/components/ui/pathway-tag";

/**
 * Employer Company Screen - Onboarding Step 2 (Employer Flow)
 *
 * Based on Figma design (157:2267)
 * User sets up their company workspace: name, description, URL, location, primary pathway
 */

// All available pathways
const allPathways: PathwayType[] = [
  "agriculture",
  "conservation",
  "construction",
  "education",
  "energy",
  "finance",
  "forestry",
  "manufacturing",
  "media",
  "medical",
  "policy",
  "real-estate",
  "research",
  "technology",
  "tourism",
  "transportation",
  "urban-planning",
  "waste-management",
  "water",
  "arts-culture",
  "sports",
];

export default function EmployerCompanyPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [primaryPathway, setPrimaryPathway] = useState("");
  const [saving, setSaving] = useState(false);

  const handleBack = () => {
    router.push("/role-selection");
  };

  const handleContinue = async () => {
    setSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: "employer-company",
          data: { companyName, description, website, location, primaryPathway },
        }),
      });
    } catch (err) {
      console.error("Failed to save company:", err);
    }
    setSaving(false);
    router.push("/employer/your-role");
  };

  const isFormValid = companyName && primaryPathway;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          Build your company workspace
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Set up your organization profile to start hiring
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 mb-8">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="company-name" required>
            Company name
          </Label>
          <Input
            id="company-name"
            type="text"
            placeholder="Your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            leftAddon={<Buildings weight="bold" />}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Company description
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Tell candidates about your company's mission and work in the climate space..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        {/* Website */}
        <div className="space-y-2">
          <Label htmlFor="website">
            Website
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourcompany.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            leftAddon={<Globe weight="bold" />}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">
            Headquarters location
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="City, State or Country"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            leftAddon={<MapPin weight="bold" />}
          />
        </div>

        {/* Primary Pathway */}
        <div className="space-y-2">
          <Label htmlFor="pathway" required>
            Primary climate sector
          </Label>
          <p className="text-sm text-[var(--primitive-neutral-500)] -mt-1">
            This helps candidates find your company
          </p>
          <Dropdown value={primaryPathway} onValueChange={setPrimaryPathway}>
            <DropdownTrigger id="pathway" className="w-full">
              <DropdownValue placeholder="Select your primary sector" />
            </DropdownTrigger>
            <DropdownContent maxHeight="250px">
              {allPathways.map((pathway) => (
                <DropdownItem key={pathway} value={pathway}>
                  {pathwayLabels[pathway]}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          onClick={handleBack}
          leftIcon={<ArrowLeft weight="bold" size={20} />}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          loading={saving}
          className="flex-1"
          rightIcon={<ArrowRight weight="bold" size={20} />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

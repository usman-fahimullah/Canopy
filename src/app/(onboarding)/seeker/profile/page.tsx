"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dropdown,
  DropdownTrigger,
  DropdownValue,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/dropdown";
import { ArrowRight, ArrowLeft, Phone, MapPin } from "@phosphor-icons/react";

/**
 * Job Seeker Profile Screen - Onboarding Step 2 (Seeker Flow)
 *
 * Based on Figma design (155:2577)
 * User provides basic profile information: pronouns, ethnicity, phone, location
 */

const pronounOptions = [
  { value: "he/him", label: "He/Him" },
  { value: "she/her", label: "She/Her" },
  { value: "they/them", label: "They/Them" },
  { value: "he/they", label: "He/They" },
  { value: "she/they", label: "She/They" },
  { value: "other", label: "Other" },
  { value: "prefer-not", label: "Prefer not to say" },
];

const ethnicityOptions = [
  { value: "american-indian", label: "American Indian or Alaska Native" },
  { value: "asian", label: "Asian" },
  { value: "black", label: "Black or African American" },
  { value: "hispanic", label: "Hispanic or Latino" },
  { value: "middle-eastern", label: "Middle Eastern or North African" },
  { value: "pacific-islander", label: "Native Hawaiian or Pacific Islander" },
  { value: "white", label: "White" },
  { value: "two-or-more", label: "Two or More Races" },
  { value: "prefer-not", label: "Prefer not to say" },
];

export default function SeekerProfilePage() {
  const router = useRouter();
  const [pronouns, setPronouns] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
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
          step: "seeker-profile",
          data: { pronouns, ethnicity, phone, location },
        }),
      });
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
    setSaving(false);
    router.push("/seeker/career-journey");
  };

  const isFormValid = pronouns && location;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          Build your profile
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Tell us a bit about yourself to personalize your experience
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 mb-8">
        {/* Pronouns */}
        <div className="space-y-2">
          <Label htmlFor="pronouns">
            Pronouns
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <Dropdown value={pronouns} onValueChange={setPronouns}>
            <DropdownTrigger id="pronouns" className="w-full">
              <DropdownValue placeholder="Select your pronouns" />
            </DropdownTrigger>
            <DropdownContent>
              {pronounOptions.map((option) => (
                <DropdownItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Ethnicity */}
        <div className="space-y-2">
          <Label htmlFor="ethnicity">
            Ethnicity
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <p className="text-sm text-[var(--primitive-neutral-500)] -mt-1">
            This helps us improve diversity in climate careers
          </p>
          <Dropdown value={ethnicity} onValueChange={setEthnicity}>
            <DropdownTrigger id="ethnicity" className="w-full">
              <DropdownValue placeholder="Select your ethnicity" />
            </DropdownTrigger>
            <DropdownContent>
              {ethnicityOptions.map((option) => (
                <DropdownItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone number
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftAddon={<Phone weight="bold" />}
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location" required>
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="City, State or ZIP code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            leftAddon={<MapPin weight="bold" />}
          />
          <p className="text-sm text-[var(--primitive-neutral-500)]">
            Used to show you relevant local opportunities
          </p>
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

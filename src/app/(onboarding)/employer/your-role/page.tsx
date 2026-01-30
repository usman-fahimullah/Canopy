"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Briefcase, Phone, LinkedinLogo, Camera, User } from "@phosphor-icons/react";

/**
 * Employer Your Role Screen - Onboarding Step 3 (Employer Flow)
 *
 * Based on Figma design (162:1878)
 * User provides their role information: job title, phone, LinkedIn, profile photo
 */

export default function EmployerYourRolePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleBack = () => {
    router.push("/employer/company");
  };

  const handleContinue = () => {
    // In a real app, we'd save this data first
    router.push("/employer/team");
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = jobTitle;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[var(--primitive-neutral-200)]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--primitive-green-800)] mb-3">
          What do you do at your company?
        </h1>
        <p className="text-lg text-[var(--primitive-neutral-600)]">
          Tell candidates about your role and how to connect with you
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6 mb-8">
        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handlePhotoClick}
            className={cn(
              "relative w-24 h-24 rounded-full overflow-hidden",
              "border-2 border-dashed border-[var(--primitive-neutral-300)]",
              "bg-[var(--primitive-neutral-100)]",
              "hover:border-[var(--primitive-green-500)] hover:bg-[var(--primitive-green-50)]",
              "transition-colors cursor-pointer",
              "flex items-center justify-center",
              "focus:outline-none focus:ring-2 focus:ring-[var(--primitive-green-500)] focus:ring-offset-2"
            )}
          >
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <User weight="bold" size={32} className="text-[var(--primitive-neutral-400)]" />
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primitive-green-600)] rounded-full flex items-center justify-center shadow-md">
              <Camera weight="bold" size={16} className="text-white" />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <span className="text-sm text-[var(--primitive-neutral-500)]">
            Add your profile photo (optional)
          </span>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <Label htmlFor="job-title" required>
            Your job title
          </Label>
          <Input
            id="job-title"
            type="text"
            placeholder="e.g., Talent Acquisition Manager"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            leftAddon={<Briefcase weight="bold" />}
          />
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

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">
            LinkedIn profile
            <span className="text-[var(--primitive-neutral-500)] font-normal ml-1">(optional)</span>
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            leftAddon={<LinkedinLogo weight="bold" />}
          />
          <p className="text-sm text-[var(--primitive-neutral-500)]">
            Helps candidates learn more about who they&apos;ll work with
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
          className="flex-1"
          rightIcon={<ArrowRight weight="bold" size={20} />}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

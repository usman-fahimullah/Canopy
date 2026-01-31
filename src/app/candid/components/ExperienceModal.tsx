"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Chip } from "@/components/ui/chip";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger, DropdownValue } from "@/components/ui/dropdown";
import { Checkbox } from "@/components/ui/checkbox";

export interface Experience {
  id?: string;
  companyName: string;
  jobTitle: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  workType: "ONSITE" | "REMOTE" | "HYBRID";
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  skills: string[];
}

interface ExperienceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience;
  onSave: (experience: Experience) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];

const WORK_TYPES = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "On-site" },
];

export function ExperienceModal({
  open,
  onOpenChange,
  experience,
  onSave,
  onDelete,
}: ExperienceModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [employmentType, setEmploymentType] = useState<string>("FULL_TIME");
  const [workType, setWorkType] = useState<string>("REMOTE");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with existing experience
  useEffect(() => {
    if (experience && open) {
      setCompanyName(experience.companyName);
      setJobTitle(experience.jobTitle);
      setEmploymentType(experience.employmentType);
      setWorkType(experience.workType);
      setIsCurrent(experience.isCurrent);
      setDescription(experience.description || "");
      setSkills(experience.skills || []);
      setSkillInput("");

      const startDate = new Date(experience.startDate);
      setStartMonth(String(startDate.getMonth() + 1).padStart(2, "0"));
      setStartYear(String(startDate.getFullYear()));

      if (experience.endDate) {
        const endDate = new Date(experience.endDate);
        setEndMonth(String(endDate.getMonth() + 1).padStart(2, "0"));
        setEndYear(String(endDate.getFullYear()));
      } else {
        setEndMonth("");
        setEndYear("");
      }
    } else if (!experience && open) {
      // Reset form for new experience
      setCompanyName("");
      setJobTitle("");
      setEmploymentType("FULL_TIME");
      setWorkType("REMOTE");
      setStartMonth("");
      setStartYear("");
      setEndMonth("");
      setEndYear("");
      setIsCurrent(false);
      setDescription("");
      setSkills([]);
      setSkillInput("");
      setError(null);
    }
  }, [experience, open]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    setError(null);

    // Validation
    if (!companyName.trim()) {
      setError("Company name is required");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Job title is required");
      return;
    }
    if (!startMonth || !startYear) {
      setError("Start date is required");
      return;
    }

    if (!isCurrent && (!endMonth || !endYear)) {
      setError("End date is required (or mark as current)");
      return;
    }

    try {
      setLoading(true);

      // Build dates
      const startDate = new Date(parseInt(startYear), parseInt(startMonth) - 1, 1);
      let endDate: Date | undefined;
      if (!isCurrent && endMonth && endYear) {
        endDate = new Date(parseInt(endYear), parseInt(endMonth) - 1, 1);
      }

      const payload: Experience = {
        ...(experience?.id && { id: experience.id }),
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        employmentType: employmentType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
        workType: workType as "ONSITE" | "REMOTE" | "HYBRID",
        startDate,
        endDate,
        isCurrent,
        description: description.trim() || undefined,
        skills,
      };

      await onSave(payload);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!experience?.id) return;

    if (!confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      setLoading(true);
      if (onDelete) {
        await onDelete(experience.id);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-[var(--primitive-red-100)] border border-[var(--primitive-red-300)] text-[var(--primitive-red-700)] text-sm">
              {error}
            </div>
          )}

          {/* Company & Job Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g., Solaris Energy Co."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Employment Type & Work Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employment">Employment Type</Label>
              <Dropdown value={employmentType} onValueChange={setEmploymentType}>
                <DropdownTrigger id="employment" disabled={loading}>
                  <DropdownValue />
                </DropdownTrigger>
                <DropdownContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <DropdownItem key={type.value} value={type.value}>
                      {type.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>
            <div className="space-y-2">
              <Label htmlFor="worktype">Work Type</Label>
              <Dropdown value={workType} onValueChange={setWorkType}>
                <DropdownTrigger id="worktype" disabled={loading}>
                  <DropdownValue />
                </DropdownTrigger>
                <DropdownContent>
                  {WORK_TYPES.map((type) => (
                    <DropdownItem key={type.value} value={type.value}>
                      {type.label}
                    </DropdownItem>
                  ))}
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="grid grid-cols-2 gap-2">
              <Dropdown value={startMonth} onValueChange={setStartMonth}>
                <DropdownTrigger disabled={loading}>
                  <DropdownValue placeholder="Month" />
                </DropdownTrigger>
                <DropdownContent>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const label = new Date(2000, i).toLocaleString("en-US", { month: "long" });
                    return (
                      <DropdownItem key={month} value={String(month).padStart(2, "0")}>
                        {label}
                      </DropdownItem>
                    );
                  })}
                </DropdownContent>
              </Dropdown>
              <Dropdown value={startYear} onValueChange={setStartYear}>
                <DropdownTrigger disabled={loading}>
                  <DropdownValue placeholder="Year" />
                </DropdownTrigger>
                <DropdownContent>
                  {Array.from({ length: 50 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <DropdownItem key={year} value={String(year)}>
                        {year}
                      </DropdownItem>
                    );
                  })}
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* Current Job Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="current"
              checked={isCurrent}
              onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="current" className="cursor-pointer">
              I currently work here
            </Label>
          </div>

          {/* End Date */}
          {!isCurrent && (
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="grid grid-cols-2 gap-2">
                <Dropdown value={endMonth} onValueChange={setEndMonth}>
                  <DropdownTrigger disabled={loading}>
                    <DropdownValue placeholder="Month" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      const label = new Date(2000, i).toLocaleString("en-US", { month: "long" });
                      return (
                        <DropdownItem key={month} value={String(month).padStart(2, "0")}>
                          {label}
                        </DropdownItem>
                      );
                    })}
                  </DropdownContent>
                </Dropdown>
                <Dropdown value={endYear} onValueChange={setEndYear}>
                  <DropdownTrigger disabled={loading}>
                    <DropdownValue placeholder="Year" />
                  </DropdownTrigger>
                  <DropdownContent>
                    {Array.from({ length: 50 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <DropdownItem key={year} value={String(year)}>
                          {year}
                        </DropdownItem>
                      );
                    })}
                  </DropdownContent>
                </Dropdown>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your responsibilities and achievements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="min-h-[100px]"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skill">Skills Used (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="skill"
                placeholder="Type a skill and press Add"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                disabled={loading}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSkill}
                disabled={loading || !skillInput.trim()}
              >
                Add
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    variant="neutral"
                    size="sm"
                    removable
                    onRemove={() => handleRemoveSkill(skill)}
                  >
                    {skill}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          {experience?.id && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

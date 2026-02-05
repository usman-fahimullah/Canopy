"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Toast } from "@/components/ui/toast";
import {
  Target,
  Briefcase,
  FolderSimple,
  Plus,
  PencilSimple,
  UploadSimple,
} from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import type { GoalCategoryKey } from "@/lib/profile/goal-categories";

// Profile components
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileSectionCard } from "@/components/profile/profile-section-card";
import { GoalListItem } from "@/components/profile/goal-list-item";
import { ExperienceListItem } from "@/components/profile/experience-list-item";
import { FileListItem } from "@/components/profile/file-list-item";

// Modals
import { ChangeCoverModal } from "@/components/profile/modals/change-cover-modal";
import { AddPhotoModal } from "@/components/profile/modals/add-photo-modal";
import { EditContactModal } from "@/components/profile/modals/edit-contact-modal";
import { AddSocialsModal } from "@/components/profile/modals/add-socials-modal";
import { WriteBioModal } from "@/components/profile/modals/write-bio-modal";
import { AddSkillsModal } from "@/components/profile/modals/add-skills-modal";
import { CreateGoalModal } from "@/components/profile/modals/create-goal-modal";
import { GoalDetailModal } from "@/components/profile/modals/goal-detail-modal";
import { AddExperienceModal } from "@/components/profile/modals/add-experience-modal";
import { EditExperienceListModal } from "@/components/profile/modals/edit-experience-list-modal";
import { UploadFilesModal } from "@/components/profile/modals/upload-files-modal";
import { ShareProfileModal } from "@/components/profile/modals/share-profile-modal";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

interface SeekerProfile {
  id: string;
  headline: string | null;
  skills: string[];
  greenSkills: string[];
  certifications: string[];
  yearsExperience: number | null;
  targetSectors: string[];
  resumeUrl: string | null;
  coverLetterUrl: string | null;
  portfolioUrl: string | null;
  summary: string | null;
  coverImage: string | null;
  badge: string | null;
  isMentor: boolean;
  mentorBio: string | null;
  mentorTopics: string[];
}

interface Account {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  pronouns: string | null;
  birthday: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  threadsUrl: string | null;
  facebookUrl: string | null;
  blueskyUrl: string | null;
  xUrl: string | null;
  websiteUrl: string | null;
  seekerProfile: SeekerProfile | null;
}

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: GoalCategoryKey | null;
  progress: number;
  status: string;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

interface Experience {
  id: string;
  companyName: string;
  companyLogo: string | null;
  jobTitle: string;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                      */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  // Data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [saving, setSaving] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; variant: "success" | "critical" } | null>(
    null
  );

  // Modal state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  /* ---- Data fetching ---------------------------------------------- */

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setAccount(data.account ?? null);
    } catch (err) {
      logger.error("Error fetching profile", { error: formatError(err) });
      throw err;
    }
  }, []);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to load goals");
      const data = await res.json();
      setGoals(data.goals ?? []);
    } catch (err) {
      logger.error("Error fetching goals", { error: formatError(err) });
      throw err;
    }
  }, []);

  const fetchExperiences = useCallback(async () => {
    try {
      const res = await fetch("/api/experience");
      if (!res.ok) throw new Error("Failed to load experiences");
      const data = await res.json();
      setExperiences(data.experiences ?? []);
    } catch (err) {
      logger.error("Error fetching experiences", { error: formatError(err) });
      throw err;
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchProfile(), fetchGoals(), fetchExperiences()]);
    } catch {
      setError("We couldn't load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, fetchGoals, fetchExperiences]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  /* ---- API helpers ------------------------------------------------ */

  const showToast = (message: string, variant: "success" | "critical" = "success") => {
    setToast({ message, variant });
  };

  const updateProfile = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchProfile();
        setActiveModal(null);
        showToast("Profile updated");
      } else {
        showToast("Failed to update profile", "critical");
      }
    } catch (err) {
      logger.error("Error updating profile", { error: formatError(err) });
      showToast("Something went wrong. Please try again.", "critical");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Loading state ---------------------------------------------- */
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        {/* Cover + avatar skeleton */}
        <Card className="overflow-hidden">
          <Skeleton className="h-[180px] w-full rounded-none" />
          <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-4">
              <Skeleton variant="circular" className="h-24 w-24" />
            </div>
            <Skeleton className="mb-2 h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </Card>

        {/* Summary + Skills skeleton */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-5 w-32" />
              <SkeletonText lines={3} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-5 w-20" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sections skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="mt-8">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Card className="mt-4">
              <CardContent className="p-6">
                <SkeletonText lines={2} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  /* ---- Error state ----------------------------------------------- */
  if (error) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardContent className="p-12">
            <EmptyState
              title="Unable to load your profile"
              description={error}
              preset="error"
              size="md"
              action={{
                label: "Try again",
                onClick: loadAllData,
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const seeker = account?.seekerProfile;
  const selectedGoal = goals.find((g) => g.id === selectedGoalId);
  const selectedGoalIndex = goals.findIndex((g) => g.id === selectedGoalId);

  /* ---- Render ----------------------------------------------------- */
  return (
    <div className="mx-auto max-w-4xl">
      {/* ---- Toast Notifications ----------------------------------- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[var(--z-toast)]">
          <Toast
            variant={toast.variant}
            dismissible
            autoDismiss={3000}
            onDismiss={() => setToast(null)}
          >
            {toast.message}
          </Toast>
        </div>
      )}
      {/* ---- Profile Header ---------------------------------------- */}
      <Card className="overflow-hidden">
        <ProfileHeader
          name={account?.name ?? null}
          avatar={account?.avatar ?? null}
          location={account?.location ?? null}
          badge={seeker?.badge ?? null}
          coverImage={seeker?.coverImage ?? null}
          socialLinks={{
            linkedinUrl: account?.linkedinUrl,
            instagramUrl: account?.instagramUrl,
            threadsUrl: account?.threadsUrl,
            facebookUrl: account?.facebookUrl,
            blueskyUrl: account?.blueskyUrl,
            xUrl: account?.xUrl,
            websiteUrl: account?.websiteUrl,
          }}
          onEditCover={() => setActiveModal("cover")}
          onEditPhoto={() => setActiveModal("photo")}
          onEditContact={() => setActiveModal("contact")}
          onEditSocials={() => setActiveModal("socials")}
          onShare={() => setActiveModal("share")}
        />
      </Card>

      {/* ---- Summary + Skills (side by side) ----------------------- */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ProfileSectionCard
          title="Your Summary"
          isEmpty={!seeker?.summary}
          emptyTitle="Add a summary about yourself"
          emptyDescription="Tell your career story in the climate space"
          emptyActionLabel="Write Your Story"
          onAction={() => setActiveModal("bio")}
          onEdit={() => setActiveModal("bio")}
        >
          <p className="text-body text-[var(--foreground-muted)]">{seeker?.summary}</p>
        </ProfileSectionCard>

        <ProfileSectionCard
          title="Skills"
          isEmpty={!seeker?.skills?.length}
          emptyTitle="Add your skills"
          emptyDescription="Quickly add relevant skills to your profile"
          emptyActionLabel="Add Skills"
          onAction={() => setActiveModal("skills")}
          onEdit={() => setActiveModal("skills")}
        >
          <div className="flex flex-wrap gap-2">
            {seeker?.skills?.map((skill) => (
              <Chip key={skill} variant="neutral" size="md">
                {skill}
              </Chip>
            ))}
          </div>
        </ProfileSectionCard>
      </div>

      {/* ---- Goals Section ----------------------------------------- */}
      <div className="mt-8">
        <SectionHeader
          icon={<Target size={20} weight="fill" />}
          title="Your Goals"
          count={goals.length}
          actionLabel="Add new goal"
          onAction={() => setActiveModal("createGoal")}
        />

        {goals.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="p-6">
              <EmptyState
                title="What are your goals?"
                description="Set career goals and track your progress"
                size="sm"
                action={{
                  label: "Add Goal",
                  onClick: () => setActiveModal("createGoal"),
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardContent className="px-6 py-2">
              {goals.map((goal) => (
                <GoalListItem
                  key={goal.id}
                  id={goal.id}
                  title={goal.title}
                  progress={goal.progress}
                  category={goal.category}
                  onView={(id) => {
                    setSelectedGoalId(id);
                    setActiveModal("goalDetail");
                  }}
                />
              ))}
              <div className="border-t border-[var(--border-muted)] py-3">
                <Button
                  variant="ghost"
                  leftIcon={<Plus size={16} weight="bold" />}
                  onClick={() => setActiveModal("createGoal")}
                >
                  Add another goal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ---- Work Experience Section ------------------------------- */}
      <div className="mt-8">
        <SectionHeader
          icon={<Briefcase size={20} weight="fill" />}
          title="Your Work Experience"
          count={experiences.length}
          actionLabel={experiences.length > 0 ? "Edit your experience" : "Add your experience"}
          onAction={() =>
            setActiveModal(experiences.length > 0 ? "editExperienceList" : "addExperience")
          }
        />

        {experiences.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="p-6">
              <EmptyState
                title="Tell us about your experiences."
                description="Share your work history to build your climate career profile"
                size="sm"
                action={{
                  label: "Add Experiences",
                  onClick: () => setActiveModal("addExperience"),
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardContent className="px-6 py-2">
              {experiences.map((exp) => (
                <ExperienceListItem
                  key={exp.id}
                  companyName={exp.companyName}
                  jobTitle={exp.jobTitle}
                  employmentType={exp.employmentType}
                  startDate={exp.startDate}
                  endDate={exp.endDate}
                  isCurrent={exp.isCurrent}
                  companyLogo={exp.companyLogo}
                />
              ))}
              <div className="border-t border-[var(--border-muted)] py-3">
                <Button
                  variant="ghost"
                  leftIcon={<Plus size={16} weight="bold" />}
                  onClick={() => setActiveModal("addExperience")}
                >
                  Add your experience
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ---- Files Section ----------------------------------------- */}
      <div className="mt-8">
        <SectionHeader
          icon={<FolderSimple size={20} weight="fill" />}
          title="Your Files"
          count={[seeker?.resumeUrl, seeker?.coverLetterUrl].filter(Boolean).length}
          actionLabel="Upload your files"
          onAction={() => setActiveModal("uploadFiles")}
          actionIcon={<UploadSimple size={16} />}
        />

        {!seeker?.resumeUrl && !seeker?.coverLetterUrl ? (
          <Card className="mt-4">
            <CardContent className="p-6">
              <EmptyState
                title="Nothing here yet."
                description="Upload your resume and cover letter"
                size="sm"
                action={{
                  label: "Upload Files",
                  onClick: () => setActiveModal("uploadFiles"),
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardContent className="px-6 py-2">
              {seeker?.resumeUrl && <FileListItem name="Resume.pdf" url={seeker.resumeUrl} />}
              {seeker?.coverLetterUrl && (
                <FileListItem name="Cover_Letter.pdf" url={seeker.coverLetterUrl} />
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ---- Footer ------------------------------------------------ */}
      <div className="mt-12 rounded-[var(--radius-card)] bg-[var(--background-brand-subtle)] py-8 text-center">
        <p className="bg-gradient-to-r from-[var(--primitive-green-600)] to-[var(--primitive-orange-500)] bg-clip-text text-heading-sm font-bold text-transparent">
          Building your climate career since 2024
        </p>
      </div>

      <div className="h-8" />

      {/* ---- All Modals -------------------------------------------- */}

      <ChangeCoverModal
        open={activeModal === "cover"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        currentCoverId={
          (seeker?.coverImage as import("@/lib/profile/cover-presets").CoverPresetId) ?? null
        }
        onSave={async (coverId) => {
          await updateProfile({ coverImage: coverId });
        }}
        loading={saving}
      />

      <AddPhotoModal
        open={activeModal === "photo"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        onSave={async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          setSaving(true);
          try {
            const res = await fetch("/api/profile/photo", {
              method: "POST",
              body: formData,
            });
            if (res.ok) {
              await fetchProfile();
              setActiveModal(null);
              showToast("Photo updated");
            } else {
              showToast("Failed to upload photo", "critical");
            }
          } catch (err) {
            logger.error("Error uploading photo", { error: formatError(err) });
            showToast("Something went wrong. Please try again.", "critical");
          } finally {
            setSaving(false);
          }
        }}
        loading={saving}
      />

      <EditContactModal
        open={activeModal === "contact"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        data={{
          email: account?.email ?? "",
          phone: account?.phone ?? null,
          city: account?.location?.split(",")[0]?.trim() ?? "",
          state: account?.location?.split(",")[1]?.trim() ?? "",
          country: account?.location?.split(",")[2]?.trim() ?? "",
          birthday: account?.birthday ?? null,
        }}
        onSave={async (data) => {
          const location = [data.city, data.state, data.country].filter(Boolean).join(", ");
          await updateProfile({
            phone: data.phone,
            location: location || null,
            birthday: data.birthday,
          });
        }}
        loading={saving}
      />

      <AddSocialsModal
        open={activeModal === "socials"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        data={{
          linkedinUrl: account?.linkedinUrl ?? null,
          instagramUrl: account?.instagramUrl ?? null,
          threadsUrl: account?.threadsUrl ?? null,
          facebookUrl: account?.facebookUrl ?? null,
          blueskyUrl: account?.blueskyUrl ?? null,
          xUrl: account?.xUrl ?? null,
          websiteUrl: account?.websiteUrl ?? null,
        }}
        onSave={async (data) => {
          await updateProfile({ ...data });
        }}
        loading={saving}
      />

      <WriteBioModal
        open={activeModal === "bio"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        currentBio={seeker?.summary ?? null}
        onSave={async (bio) => {
          await updateProfile({ summary: bio });
        }}
        loading={saving}
      />

      <AddSkillsModal
        open={activeModal === "skills"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        currentSkills={seeker?.skills ?? []}
        onSave={async (skills) => {
          await updateProfile({ skills });
        }}
        loading={saving}
      />

      <CreateGoalModal
        open={activeModal === "createGoal"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        onSave={async (data) => {
          setSaving(true);
          try {
            const res = await fetch("/api/goals", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: data.title,
                description: data.description || null,
                category: data.category,
                milestones: data.milestones.map((m) => ({ title: m })),
              }),
            });
            if (res.ok) {
              await fetchGoals();
              setActiveModal(null);
              showToast("Goal created");
            } else {
              showToast("Failed to create goal", "critical");
            }
          } catch (err) {
            logger.error("Error creating goal", { error: formatError(err) });
            showToast("Something went wrong. Please try again.", "critical");
          } finally {
            setSaving(false);
          }
        }}
        loading={saving}
      />

      {selectedGoal && (
        <GoalDetailModal
          open={activeModal === "goalDetail"}
          onOpenChange={(open) => {
            if (!open) {
              setActiveModal(null);
              setSelectedGoalId(null);
            }
          }}
          goal={selectedGoal}
          onUpdateTitle={async (title) => {
            await fetch(`/api/goals/${selectedGoal.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title }),
            });
            await fetchGoals();
          }}
          onUpdateDescription={async (description) => {
            await fetch(`/api/goals/${selectedGoal.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ description }),
            });
            await fetchGoals();
          }}
          onUpdateCategory={async (category) => {
            await fetch(`/api/goals/${selectedGoal.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ category }),
            });
            await fetchGoals();
          }}
          onToggleMilestone={async (milestoneId) => {
            await fetch(`/api/goals/${selectedGoal.id}/milestones/${milestoneId}`, {
              method: "PATCH",
            });
            await fetchGoals();
          }}
          onAddMilestone={async (title) => {
            await fetch(`/api/goals/${selectedGoal.id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ title }),
            });
            await fetchGoals();
          }}
          onDeleteMilestone={async (milestoneId) => {
            await fetch(`/api/goals/${selectedGoal.id}/milestones/${milestoneId}`, {
              method: "DELETE",
            });
            await fetchGoals();
          }}
          onCompleteGoal={async () => {
            await fetch(`/api/goals/${selectedGoal.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: "COMPLETED" }),
            });
            await fetchGoals();
            setActiveModal(null);
          }}
          hasPrev={selectedGoalIndex > 0}
          hasNext={selectedGoalIndex < goals.length - 1}
          onPrev={() => {
            if (selectedGoalIndex > 0) {
              setSelectedGoalId(goals[selectedGoalIndex - 1].id);
            }
          }}
          onNext={() => {
            if (selectedGoalIndex < goals.length - 1) {
              setSelectedGoalId(goals[selectedGoalIndex + 1].id);
            }
          }}
        />
      )}

      <AddExperienceModal
        open={activeModal === "addExperience"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        onSave={async (data) => {
          setSaving(true);
          try {
            const startDate = `${data.startYear}-${data.startMonth.padStart(2, "0")}-01`;
            const endDate =
              data.isCurrent || !data.endYear
                ? null
                : `${data.endYear}-${data.endMonth.padStart(2, "0")}-01`;
            const res = await fetch("/api/experience", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                employmentType: data.employmentType || undefined,
                startDate,
                endDate,
                isCurrent: data.isCurrent,
              }),
            });
            if (res.ok) {
              await fetchExperiences();
              setActiveModal(null);
              showToast("Experience added");
            } else {
              showToast("Failed to add experience", "critical");
            }
          } catch (err) {
            logger.error("Error creating experience", { error: formatError(err) });
            showToast("Something went wrong. Please try again.", "critical");
          } finally {
            setSaving(false);
          }
        }}
        loading={saving}
      />

      <AddExperienceModal
        open={activeModal === "editExperience"}
        onOpenChange={(open) => {
          if (!open) {
            setActiveModal("editExperienceList");
            setEditingExperienceId(null);
          }
        }}
        mode="edit"
        initialData={(() => {
          const exp = experiences.find((e) => e.id === editingExperienceId);
          if (!exp) return undefined;
          const start = new Date(exp.startDate);
          const end = exp.endDate ? new Date(exp.endDate) : null;
          return {
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            employmentType: exp.employmentType,
            isCurrent: exp.isCurrent,
            startMonth: String(start.getMonth() + 1),
            startYear: String(start.getFullYear()),
            endMonth: end ? String(end.getMonth() + 1) : "",
            endYear: end ? String(end.getFullYear()) : "",
          };
        })()}
        onSave={async (data) => {
          if (!editingExperienceId) return;
          setSaving(true);
          try {
            const startDate = `${data.startYear}-${data.startMonth.padStart(2, "0")}-01`;
            const endDate =
              data.isCurrent || !data.endYear
                ? null
                : `${data.endYear}-${data.endMonth.padStart(2, "0")}-01`;
            const res = await fetch(`/api/experience/${editingExperienceId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                companyName: data.companyName,
                jobTitle: data.jobTitle,
                employmentType: data.employmentType || undefined,
                startDate,
                endDate,
                isCurrent: data.isCurrent,
              }),
            });
            if (res.ok) {
              await fetchExperiences();
              setActiveModal("editExperienceList");
              setEditingExperienceId(null);
              showToast("Experience updated");
            } else {
              showToast("Failed to update experience", "critical");
            }
          } catch (err) {
            logger.error("Error updating experience", { error: formatError(err) });
            showToast("Something went wrong. Please try again.", "critical");
          } finally {
            setSaving(false);
          }
        }}
        onDelete={async () => {
          if (!editingExperienceId) return;
          setSaving(true);
          try {
            await fetch(`/api/experience/${editingExperienceId}`, {
              method: "DELETE",
            });
            await fetchExperiences();
            setActiveModal("editExperienceList");
            setEditingExperienceId(null);
          } catch (err) {
            logger.error("Error deleting experience", { error: formatError(err) });
          } finally {
            setSaving(false);
          }
        }}
        loading={saving}
      />

      <EditExperienceListModal
        open={activeModal === "editExperienceList"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        experiences={experiences}
        onEdit={(id) => {
          setEditingExperienceId(id);
          setActiveModal("editExperience");
        }}
        onDelete={async (id) => {
          try {
            await fetch(`/api/experience/${id}`, { method: "DELETE" });
            await fetchExperiences();
          } catch (err) {
            logger.error("Error deleting experience", { error: formatError(err) });
          }
        }}
        onAdd={() => setActiveModal("addExperience")}
      />

      <UploadFilesModal
        open={activeModal === "uploadFiles"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        resumeUrl={seeker?.resumeUrl ?? null}
        coverLetterUrl={seeker?.coverLetterUrl ?? null}
        onUpload={async (file, type) => {
          setSaving(true);
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);
            const res = await fetch("/api/profile/files", {
              method: "POST",
              body: formData,
            });
            if (res.ok) {
              await fetchProfile();
              setActiveModal(null);
              showToast("File uploaded");
            } else {
              showToast("Failed to upload file", "critical");
            }
          } catch (err) {
            logger.error("Error uploading file", { error: formatError(err) });
            showToast("Something went wrong. Please try again.", "critical");
          } finally {
            setSaving(false);
          }
        }}
        loading={saving}
      />

      <ShareProfileModal
        open={activeModal === "share"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        name={account?.name ?? null}
        avatar={account?.avatar ?? null}
        location={account?.location ?? null}
        skills={seeker?.skills ?? []}
        profileUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header (internal helper)                                    */
/* ------------------------------------------------------------------ */

function SectionHeader({
  icon,
  title,
  count,
  actionLabel,
  onAction,
  actionIcon,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
  actionLabel: string;
  onAction: () => void;
  actionIcon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[var(--foreground-brand)]">{icon}</span>
        <h2 className="text-heading-sm font-bold text-[var(--foreground-default)]">{title}</h2>
        {count > 0 && (
          <Badge variant="neutral" size="sm">
            {count}
          </Badge>
        )}
      </div>
      <Button variant="link" leftIcon={actionIcon || <PencilSimple size={16} />} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

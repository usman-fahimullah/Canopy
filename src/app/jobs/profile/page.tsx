"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Toast } from "@/components/ui/toast";
import { Target, Briefcase, FolderSimple, Plus } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import type { GoalCategoryKey } from "@/lib/profile/goal-categories";
import { type CoverPresetId, isCustomCoverUrl } from "@/lib/profile/cover-presets";

// Profile components
import { ProfileHeader } from "@/components/profile/profile-header";
import { StickyProfileBar } from "@/components/profile/sticky-profile-bar";
import {
  ProfileSectionContainer,
  ProfileSectionEmptyState,
  ProfileSectionListContent,
} from "@/components/profile/profile-section-container";
import { GoalListItem } from "@/components/profile/goal-list-item";
import { ExperienceListItem } from "@/components/profile/experience-list-item";
import { FileListItem } from "@/components/profile/file-list-item";
import {
  GoalsIllustration,
  ExperienceIllustration,
  FilesIllustration,
} from "@/components/profile/illustrations";
import { StreakBadge } from "@/components/profile/streak-badge";

// Modals
import { ChangeCoverModal } from "@/components/profile/modals/change-cover-modal";
import { ChangeAvatarModal } from "@/components/profile/modals/change-avatar-modal";
import { EditContactModal } from "@/components/profile/modals/edit-contact-modal";
import { AddSocialsModal } from "@/components/profile/modals/add-socials-modal";
import { WriteBioModal } from "@/components/profile/modals/write-bio-modal";
import { AddSkillsModal } from "@/components/profile/modals/add-skills-modal";
import { CreateGoalModal } from "@/components/profile/modals/create-goal-modal";
import { GoalDetailModal } from "@/components/profile/modals/goal-detail-modal";
import { BrowseTemplatesModal } from "@/components/profile/modals/browse-templates-modal";
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

interface MilestoneResource {
  title: string;
  url: string;
}

interface Goal {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;
  category: GoalCategoryKey | null;
  progress: number;
  status: string;
  targetDate: string | null;
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    resources?: MilestoneResource[] | null;
  }>;
  application?: {
    id: string;
    job: {
      id: string;
      title: string;
      organization?: { name: string } | null;
    };
  } | null;
}

interface ApplicationOption {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
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
  const [recentApplications, setRecentApplications] = useState<ApplicationOption[]>([]);
  const [streak, setStreak] = useState<{ streak: number; isActiveToday: boolean }>({
    streak: 0,
    isActiveToday: false,
  });
  const [saving, setSaving] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; variant: "success" | "critical" } | null>(
    null
  );

  // Modal state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    description: string;
    category: GoalCategoryKey;
    tasks: string[];
  } | null>(null);

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

  const fetchStreak = useCallback(async () => {
    try {
      const res = await fetch("/api/goals/streak");
      if (!res.ok) throw new Error("Failed to load streak");
      const data = await res.json();
      setStreak({ streak: data.streak ?? 0, isActiveToday: data.isActiveToday ?? false });
    } catch (err) {
      logger.error("Error fetching streak", { error: formatError(err) });
      // Don't throw - streak is not critical
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

  const fetchRecentApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs/applications?limit=10&days=30");
      if (!res.ok) return; // Not critical, just skip
      const data = await res.json();
      setRecentApplications(
        (data.applications ?? []).map(
          (app: { id: string; job: { title: string; company: string }; appliedAt: string }) => ({
            id: app.id,
            jobTitle: app.job?.title ?? "Unknown Job",
            company: app.job?.company ?? "Unknown Company",
            appliedAt: app.appliedAt,
          })
        )
      );
    } catch (err) {
      logger.error("Error fetching applications", { error: formatError(err) });
      // Not critical - just don't show application linking
    }
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchProfile(),
        fetchGoals(),
        fetchExperiences(),
        fetchStreak(),
        fetchRecentApplications(),
      ]);
    } catch {
      setError("We couldn't load your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchProfile, fetchGoals, fetchExperiences, fetchStreak, fetchRecentApplications]);

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
      <div>
        {/* Profile Header skeleton - Full width, 256px cover */}
        <div className="w-full border-b border-[var(--border-muted)]">
          <Skeleton className="h-[256px] w-full rounded-none" />
          <div className="px-4 pb-8 sm:px-6 lg:px-12 xl:px-[72px]">
            <div className="relative -mt-16 mb-4">
              <Skeleton variant="circular" className="h-[128px] w-[128px]" />
            </div>
            <Skeleton className="mb-3 h-12 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        {/* Content sections with responsive padding */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 xl:px-[72px]">
          {/* CTA Cards skeleton */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-[180px] rounded-[16px]" />
            <Skeleton className="h-[180px] rounded-[16px]" />
          </div>

          {/* Section containers skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="mt-8">
              <Skeleton className="h-[200px] w-full rounded-[16px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---- Error state ----------------------------------------------- */
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-12 xl:px-[72px]">
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
    <div>
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

      {/* ---- Profile Header (Full Width) ----------------------------- */}
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
        summary={seeker?.summary ?? null}
        skills={seeker?.skills ?? []}
        onEditCover={() => setActiveModal("cover")}
        onEditPhoto={() => setActiveModal("photo")}
        onEditContact={() => setActiveModal("contact")}
        onEditSocials={() => setActiveModal("socials")}
        onEditSummary={() => setActiveModal("bio")}
        onEditSkills={() => setActiveModal("skills")}
        onShare={() => setActiveModal("share")}
      />

      {/* ---- Sticky profile bar — appears when header scrolls away ---- */}
      <StickyProfileBar
        name={account?.name ?? null}
        avatar={account?.avatar ?? null}
        location={account?.location ?? null}
        onEditCover={() => setActiveModal("cover")}
        onShare={() => setActiveModal("share")}
      />

      {/* ---- Content sections — 48px padding per Figma (node 2219:6763) */}
      <div className="flex flex-col gap-12 px-12 pb-12 pt-8">
        {/* ---- Goals Section ----------------------------------------- */}
        <ProfileSectionContainer
          icon={<Target size={24} weight="fill" className="text-[var(--primitive-orange-500)]" />}
          title="Your Goals"
          count={goals.length}
          headerExtra={
            goals.length > 0 ? (
              <StreakBadge streak={streak.streak} isActiveToday={streak.isActiveToday} />
            ) : null
          }
          actionLabel="Add new goal"
          onAction={() => setActiveModal("createGoal")}
          secondaryActionLabel="Browse templates"
          onSecondaryAction={() => setActiveModal("browseTemplates")}
          isEmpty={goals.length === 0}
          emptyState={
            <ProfileSectionEmptyState
              illustration={<GoalsIllustration />}
              title="What are your goals?"
              description="Set career goals and track your progress towards your dream climate job."
              actionLabel="Add Goal"
              onAction={() => setActiveModal("createGoal")}
            />
          }
        >
          <ProfileSectionListContent
            showAddButton
            addLabel="Add another goal"
            onAdd={() => setActiveModal("createGoal")}
          >
            {goals.map((goal) => (
              <GoalListItem
                key={goal.id}
                id={goal.id}
                title={goal.title}
                progress={goal.progress}
                category={goal.category}
                targetDate={goal.targetDate}
                onView={(id) => {
                  setSelectedGoalId(id);
                  setActiveModal("goalDetail");
                }}
              />
            ))}
          </ProfileSectionListContent>
        </ProfileSectionContainer>

        {/* ---- Work Experience Section ------------------------------- */}
        <ProfileSectionContainer
          icon={<Briefcase size={24} weight="fill" />}
          title="Your Work Experience"
          count={experiences.length}
          actionLabel={experiences.length > 0 ? "Edit your experience" : "Add your experience"}
          onAction={() =>
            setActiveModal(experiences.length > 0 ? "editExperienceList" : "addExperience")
          }
          isEmpty={experiences.length === 0}
          emptyState={
            <ProfileSectionEmptyState
              illustration={<ExperienceIllustration />}
              title="Tell us about your experiences."
              description="Share your work history to build your climate career profile."
              actionLabel="Add Experience"
              onAction={() => setActiveModal("addExperience")}
            />
          }
        >
          <ProfileSectionListContent
            showAddButton
            addLabel="Add your experience"
            onAdd={() => setActiveModal("addExperience")}
          >
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
          </ProfileSectionListContent>
        </ProfileSectionContainer>

        {/* ---- Files Section ----------------------------------------- */}
        <ProfileSectionContainer
          icon={<FolderSimple size={24} weight="fill" />}
          title="Your Files"
          count={[seeker?.resumeUrl, seeker?.coverLetterUrl].filter(Boolean).length}
          actionLabel="Upload your files"
          onAction={() => setActiveModal("uploadFiles")}
          isEmpty={!seeker?.resumeUrl && !seeker?.coverLetterUrl}
          emptyState={
            <ProfileSectionEmptyState
              illustration={<FilesIllustration />}
              title="Nothing here yet."
              description="Upload your resume and cover letter to share with employers."
              actionLabel="Upload Files"
              onAction={() => setActiveModal("uploadFiles")}
            />
          }
        >
          <ProfileSectionListContent>
            {seeker?.resumeUrl && <FileListItem name="Resume.pdf" url={seeker.resumeUrl} />}
            {seeker?.coverLetterUrl && (
              <FileListItem name="Cover_Letter.pdf" url={seeker.coverLetterUrl} />
            )}
          </ProfileSectionListContent>
        </ProfileSectionContainer>

        {/* ---- Footer ------------------------------------------------ */}
        <div className="rounded-[var(--radius-card)] bg-[var(--background-brand-subtle)] py-8 text-center">
          <p className="bg-gradient-to-r from-[var(--primitive-green-600)] to-[var(--primitive-orange-500)] bg-clip-text text-heading-sm font-bold text-transparent">
            Building your climate career since 2024
          </p>
        </div>
      </div>
      {/* End of content sections wrapper */}

      {/* ---- All Modals -------------------------------------------- */}

      <ChangeCoverModal
        open={activeModal === "cover"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        currentCoverId={
          isCustomCoverUrl(seeker?.coverImage)
            ? null
            : ((seeker?.coverImage as CoverPresetId) ?? null)
        }
        currentCustomUrl={isCustomCoverUrl(seeker?.coverImage) ? seeker?.coverImage : null}
        onSave={async (coverId, customFile) => {
          if (customFile) {
            // Upload custom cover image
            const formData = new FormData();
            formData.append("file", customFile);
            setSaving(true);
            try {
              const res = await fetch("/api/profile/cover", {
                method: "POST",
                body: formData,
              });
              if (res.ok) {
                await fetchProfile();
                setActiveModal(null);
                showToast("Cover image updated");
              } else {
                const data = await res.json().catch(() => ({}));
                showToast(data.error || "Failed to upload cover image", "critical");
              }
            } catch (err) {
              logger.error("Error uploading cover", { error: formatError(err) });
              showToast("Something went wrong. Please try again.", "critical");
            } finally {
              setSaving(false);
            }
          } else if (coverId) {
            // Save preset selection
            await updateProfile({ coverImage: coverId });
          } else {
            // No change (existing custom URL kept)
            setActiveModal(null);
          }
        }}
        loading={saving}
      />

      <ChangeAvatarModal
        open={activeModal === "photo"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        currentAvatar={account?.avatar ?? null}
        onSave={async (presetSrc, customFile) => {
          setSaving(true);
          try {
            if (customFile) {
              // Upload custom photo via existing POST endpoint
              const formData = new FormData();
              formData.append("file", customFile);
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
            } else if (presetSrc) {
              // Select preset avatar via PATCH endpoint
              const res = await fetch("/api/profile/photo", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarSrc: presetSrc }),
              });
              if (res.ok) {
                await fetchProfile();
                setActiveModal(null);
                showToast("Profile picture updated");
              } else {
                showToast("Failed to update profile picture", "critical");
              }
            } else {
              // No change (existing custom URL kept)
              setActiveModal(null);
            }
          } catch (err) {
            logger.error("Error updating avatar", { error: formatError(err) });
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
        onOpenChange={(open) => {
          if (!open) {
            setActiveModal(null);
            setSelectedTemplate(null);
          }
        }}
        initialTemplate={selectedTemplate}
        applications={recentApplications}
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
                targetDate: data.dueDate?.toISOString() || null,
                milestones: data.milestones.map((m) => ({ title: m })),
                applicationId: data.applicationId || null,
              }),
            });
            if (res.ok) {
              await Promise.all([fetchGoals(), fetchStreak()]);
              setActiveModal(null);
              setSelectedTemplate(null);
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

      <BrowseTemplatesModal
        open={activeModal === "browseTemplates"}
        onOpenChange={(open) => !open && setActiveModal(null)}
        onSelectTemplate={(template) => {
          setSelectedTemplate({
            title: template.title,
            description: template.description,
            category: template.category,
            tasks: template.tasks,
          });
          setActiveModal("createGoal");
        }}
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
          goal={{
            ...selectedGoal,
            notes: selectedGoal.notes ?? null,
            application: selectedGoal.application
              ? {
                  id: selectedGoal.application.id,
                  job: {
                    id: selectedGoal.application.job.id,
                    title: selectedGoal.application.job.title,
                    company: selectedGoal.application.job.organization?.name ?? null,
                  },
                }
              : null,
          }}
          onUpdateTitle={async (title) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
              });
              if (res.ok) {
                await fetchGoals();
                showToast("Goal updated");
              } else {
                showToast("Failed to update goal", "critical");
              }
            } catch (err) {
              logger.error("Error updating goal title", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onUpdateDescription={async (description) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
              });
              if (res.ok) {
                await fetchGoals();
                showToast("Goal updated");
              } else {
                showToast("Failed to update goal", "critical");
              }
            } catch (err) {
              logger.error("Error updating goal description", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onUpdateNotes={async (notes) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notes }),
              });
              if (res.ok) {
                await fetchGoals();
                showToast("Notes saved");
              } else {
                showToast("Failed to save notes", "critical");
              }
            } catch (err) {
              logger.error("Error updating goal notes", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onUpdateCategory={async (category) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ category }),
              });
              if (res.ok) {
                await fetchGoals();
                showToast("Category updated");
              } else {
                showToast("Failed to update category", "critical");
              }
            } catch (err) {
              logger.error("Error updating goal category", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onToggleMilestone={async (milestoneId) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}/milestones/${milestoneId}`, {
                method: "PATCH",
              });
              if (res.ok) {
                await Promise.all([fetchGoals(), fetchStreak()]);
              } else {
                showToast("Failed to update milestone", "critical");
              }
            } catch (err) {
              logger.error("Error toggling milestone", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onAddMilestone={async (title) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
              });
              if (res.ok) {
                await Promise.all([fetchGoals(), fetchStreak()]);
                showToast("Milestone added");
              } else {
                showToast("Failed to add milestone", "critical");
              }
            } catch (err) {
              logger.error("Error adding milestone", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onDeleteMilestone={async (milestoneId) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}/milestones/${milestoneId}`, {
                method: "DELETE",
              });
              if (res.ok) {
                await Promise.all([fetchGoals(), fetchStreak()]);
                showToast("Milestone removed");
              } else {
                showToast("Failed to remove milestone", "critical");
              }
            } catch (err) {
              logger.error("Error deleting milestone", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onUpdateMilestoneResources={async (milestoneId, resources) => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}/milestones/${milestoneId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resources }),
              });
              if (res.ok) {
                await fetchGoals();
                showToast("Resources updated");
              } else {
                showToast("Failed to update resources", "critical");
              }
            } catch (err) {
              logger.error("Error updating milestone resources", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          onCompleteGoal={async () => {
            try {
              const res = await fetch(`/api/goals/${selectedGoal.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "COMPLETED" }),
              });
              if (res.ok) {
                await Promise.all([fetchGoals(), fetchStreak()]);
                setActiveModal(null);
                showToast("Goal completed!");
              } else {
                showToast("Failed to complete goal", "critical");
              }
            } catch (err) {
              logger.error("Error completing goal", { error: formatError(err) });
              showToast("Something went wrong", "critical");
            }
          }}
          hasPrev={selectedGoalIndex > 0}
          hasNext={selectedGoalIndex >= 0 && selectedGoalIndex < goals.length - 1}
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Toast } from "@/components/ui/toast";
import { ChartDonut, Briefcase, FolderSimple, Plus } from "@phosphor-icons/react";
import { logger, formatError } from "@/lib/logger";
import type { GoalCategoryKey } from "@/lib/profile/goal-categories";

// Profile components
import { ProfileHeader } from "@/components/profile/profile-header";
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
import { AddPhotoModal } from "@/components/profile/modals/add-photo-modal";
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
      <div className="mx-auto max-w-4xl">
        {/* Profile Header skeleton - Full width, 256px cover */}
        <div className="w-full">
          <Skeleton className="h-[256px] w-full rounded-none" />
          <div className="px-6 pb-6">
            <div className="relative -mt-20 mb-4">
              <Skeleton variant="circular" className="h-[128px] w-[128px]" />
            </div>
            <Skeleton className="mb-3 h-12 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>

        {/* CTA Cards skeleton */}
        <div className="mt-8 grid grid-cols-1 gap-4 px-6 md:grid-cols-2">
          <Skeleton className="h-[200px] rounded-[16px]" />
          <Skeleton className="h-[200px] rounded-[16px]" />
        </div>

        {/* Section containers skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="mt-8">
            <Skeleton className="h-[200px] w-full rounded-[16px]" />
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
        hasSummary={!!seeker?.summary}
        skills={seeker?.skills ?? []}
        onEditCover={() => setActiveModal("cover")}
        onEditPhoto={() => setActiveModal("photo")}
        onEditContact={() => setActiveModal("contact")}
        onEditSocials={() => setActiveModal("socials")}
        onShare={() => setActiveModal("share")}
        onEditSummary={() => setActiveModal("bio")}
        onEditSkills={() => setActiveModal("skills")}
      />

      {/* ---- Summary + Skills (show only when filled) -------------- */}
      {(seeker?.summary || (seeker?.skills && seeker.skills.length > 0)) && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {seeker?.summary && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-body-strong text-[var(--foreground-default)]">
                    Your Summary
                  </h3>
                  <Button variant="link" onClick={() => setActiveModal("bio")}>
                    Edit
                  </Button>
                </div>
                <p className="text-body text-[var(--foreground-muted)]">{seeker.summary}</p>
              </CardContent>
            </Card>
          )}

          {seeker?.skills && seeker.skills.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-body-strong text-[var(--foreground-default)]">Skills</h3>
                  <Button variant="link" onClick={() => setActiveModal("skills")}>
                    Edit
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {seeker.skills.map((skill) => (
                    <Chip key={skill} variant="neutral" size="md">
                      {skill}
                    </Chip>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ---- Goals Section ----------------------------------------- */}
      <div className="mt-8">
        <ProfileSectionContainer
          icon={<ChartDonut size={24} weight="fill" />}
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
      </div>

      {/* ---- Work Experience Section ------------------------------- */}
      <div className="mt-8">
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
      </div>

      {/* ---- Files Section ----------------------------------------- */}
      <div className="mt-8">
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
              await fetchGoals();
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
          onUpdateNotes={async (notes) => {
            await fetch(`/api/goals/${selectedGoal.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notes }),
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
            await Promise.all([fetchGoals(), fetchStreak()]);
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
          onUpdateMilestoneResources={async (milestoneId, resources) => {
            await fetch(`/api/goals/${selectedGoal.id}/milestones/${milestoneId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ resources }),
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

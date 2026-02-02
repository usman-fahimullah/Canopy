import { describe, it, expect } from "vitest";
import {
  getShellSlug,
  getShellFromSlug,
  SHELL_URL_SLUGS,
  URL_SLUG_TO_SHELL,
  createOnboardingProgress,
  createRoleOnboardingState,
  completeRoleOnboarding,
  advanceOnboardingStep,
  getOnboardingRedirect,
  getDashboardPath,
  hasCompletedAnyOnboarding,
  getActiveShells,
  STEPS_BY_SHELL,
  SHELL_CONFIGS,
  TALENT_STEPS,
  COACH_STEPS,
  EMPLOYER_STEPS,
} from "../onboarding/types";

describe("SHELL_URL_SLUGS", () => {
  it("maps talent to jobs", () => {
    expect(SHELL_URL_SLUGS.talent).toBe("jobs");
  });
  it("maps coach to candid/coach", () => {
    expect(SHELL_URL_SLUGS.coach).toBe("candid/coach");
  });
  it("maps employer to canopy", () => {
    expect(SHELL_URL_SLUGS.employer).toBe("canopy");
  });
});

describe("URL_SLUG_TO_SHELL", () => {
  it("maps jobs to talent", () => {
    expect(URL_SLUG_TO_SHELL.jobs).toBe("talent");
  });
  it("maps canopy to employer", () => {
    expect(URL_SLUG_TO_SHELL.canopy).toBe("employer");
  });
});

describe("getShellSlug", () => {
  it("returns jobs for talent", () => {
    expect(getShellSlug("talent")).toBe("jobs");
  });
  it("returns canopy for employer", () => {
    expect(getShellSlug("employer")).toBe("canopy");
  });
});

describe("getShellFromSlug", () => {
  it("returns talent for jobs", () => {
    expect(getShellFromSlug("jobs")).toBe("talent");
  });
  it("returns null for unknown slug", () => {
    expect(getShellFromSlug("unknown")).toBeNull();
  });
});

describe("STEPS_BY_SHELL", () => {
  it("has 3 talent steps", () => {
    expect(STEPS_BY_SHELL.talent).toHaveLength(3);
  });
  it("has 6 coach steps", () => {
    expect(STEPS_BY_SHELL.coach).toHaveLength(6);
  });
  it("has 6 employer steps", () => {
    expect(STEPS_BY_SHELL.employer).toHaveLength(6);
  });
});

describe("SHELL_CONFIGS", () => {
  it("has dashboard paths for all shells", () => {
    expect(SHELL_CONFIGS.talent.dashboardPath).toBe("/jobs/dashboard");
    expect(SHELL_CONFIGS.coach.dashboardPath).toBe("/candid/coach/dashboard");
    expect(SHELL_CONFIGS.employer.dashboardPath).toBe("/canopy/dashboard");
  });
});

describe("createOnboardingProgress", () => {
  it("creates fresh progress with all roles null", () => {
    const p = createOnboardingProgress();
    expect(p.baseProfileComplete).toBe(false);
    expect(p.roles.talent).toBeNull();
    expect(p.roles.coach).toBeNull();
    expect(p.roles.employer).toBeNull();
  });
});

describe("createRoleOnboardingState", () => {
  it("initializes talent with first step", () => {
    const s = createRoleOnboardingState("talent");
    expect(s.complete).toBe(false);
    expect(s.completedAt).toBeNull();
    expect(s.currentStep).toBe("profile");
  });
  it("initializes coach with first step", () => {
    expect(createRoleOnboardingState("coach").currentStep).toBe("about");
  });
  it("initializes employer with first step", () => {
    expect(createRoleOnboardingState("employer").currentStep).toBe("company");
  });
});

describe("completeRoleOnboarding", () => {
  it("marks a role as complete", () => {
    const p = createOnboardingProgress();
    p.roles.talent = createRoleOnboardingState("talent");
    const updated = completeRoleOnboarding(p, "talent");
    expect(updated.roles.talent!.complete).toBe(true);
    expect(updated.roles.talent!.completedAt).toBeTruthy();
    expect(updated.roles.talent!.currentStep).toBeNull();
  });
});

describe("advanceOnboardingStep", () => {
  it("advances to the next step", () => {
    const p = createOnboardingProgress();
    p.roles.talent = createRoleOnboardingState("talent");
    const updated = advanceOnboardingStep(p, "talent");
    expect(updated.roles.talent!.currentStep).toBe("career");
  });
  it("marks complete when no more steps", () => {
    const p = createOnboardingProgress();
    p.roles.talent = { complete: false, completedAt: null, currentStep: "skills" };
    const updated = advanceOnboardingStep(p, "talent");
    expect(updated.roles.talent!.complete).toBe(true);
  });
  it("returns unchanged if already complete", () => {
    const p = createOnboardingProgress();
    p.roles.talent = { complete: true, completedAt: "2025-01-01", currentStep: null };
    const updated = advanceOnboardingStep(p, "talent");
    expect(updated).toEqual(p);
  });
});

describe("getOnboardingRedirect", () => {
  it("returns /onboarding for null progress", () => {
    expect(getOnboardingRedirect(null, null)).toBe("/onboarding");
  });
  it("returns /onboarding when base not complete and no intent", () => {
    const p = createOnboardingProgress();
    expect(getOnboardingRedirect(p, null)).toBe("/onboarding");
  });
  it("returns shell first step when base not complete but role active", () => {
    const p = createOnboardingProgress();
    p.roles.talent = createRoleOnboardingState("talent");
    expect(getOnboardingRedirect(p, "talent")).toBe("/onboarding/jobs/profile");
  });
  it("returns null when all complete", () => {
    const p = createOnboardingProgress();
    p.baseProfileComplete = true;
    expect(getOnboardingRedirect(p, null)).toBeNull();
  });
  it("returns step URL for incomplete role", () => {
    const p = createOnboardingProgress();
    p.baseProfileComplete = true;
    p.roles.talent = createRoleOnboardingState("talent");
    const url = getOnboardingRedirect(p, "talent");
    expect(url).toContain("/onboarding/jobs/profile");
  });
});

describe("getDashboardPath", () => {
  it("returns onboarding for null role", () => {
    expect(getDashboardPath(null)).toBe("/onboarding");
  });
  it("returns correct dashboard for talent", () => {
    expect(getDashboardPath("talent")).toBe("/jobs/dashboard");
  });
  it("returns correct dashboard for employer", () => {
    expect(getDashboardPath("employer")).toBe("/canopy/dashboard");
  });
});

describe("hasCompletedAnyOnboarding", () => {
  it("returns false for null progress", () => {
    expect(hasCompletedAnyOnboarding(null)).toBe(false);
  });
  it("returns false when no roles complete", () => {
    expect(hasCompletedAnyOnboarding(createOnboardingProgress())).toBe(false);
  });
  it("returns true when a role is complete", () => {
    const p = createOnboardingProgress();
    p.roles.talent = { complete: true, completedAt: "2025-01-01", currentStep: null };
    expect(hasCompletedAnyOnboarding(p)).toBe(true);
  });
});

describe("getActiveShells", () => {
  it("returns empty for null progress", () => {
    expect(getActiveShells(null)).toEqual([]);
  });
  it("returns shells that have been activated", () => {
    const p = createOnboardingProgress();
    p.roles.talent = createRoleOnboardingState("talent");
    p.roles.employer = createRoleOnboardingState("employer");
    const shells = getActiveShells(p);
    expect(shells).toContain("talent");
    expect(shells).toContain("employer");
    expect(shells).not.toContain("coach");
  });
});

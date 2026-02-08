import { describe, it, expect } from "vitest";
import {
  CreateReviewSchema,
  RespondToReviewSchema,
  FlagReviewSchema,
  AdminReviewActionSchema,
  CreateGoalSchema,
  UpdateGoalSchema,
  AddMilestoneSchema,
  CreateExperienceSchema,
  UpdateExperienceSchema,
  CreateConversationSchema,
  SendMessageSchema,
  UpdateSessionSchema,
  CancelSessionSchema,
  RescheduleSessionSchema,
  CreateActionItemSchema,
  UpdateActionItemSchema,
  CreateMentorAssignmentSchema,
  UpdateMentorAssignmentSchema,
  RateMentorSchema,
  UpdateProfileSchema,
  UpdateCoachProfileSchema,
  CheckoutSchema,
  RefundSchema,
  UpdateAvailabilitySchema,
  CoachApplySchema,
  UpdateSavedJobNotesSchema,
  UpdateChecklistSchema,
} from "../validators/api";

// =========================================================================
// RespondToReviewSchema (not covered in existing tests)
// =========================================================================
describe("RespondToReviewSchema", () => {
  it("accepts a valid response string", () => {
    expect(RespondToReviewSchema.safeParse({ response: "Thank you!" }).success).toBe(true);
  });

  it("rejects empty string response", () => {
    expect(RespondToReviewSchema.safeParse({ response: "" }).success).toBe(false);
  });

  it("rejects missing response field", () => {
    expect(RespondToReviewSchema.safeParse({}).success).toBe(false);
  });

  it("trims whitespace from response", () => {
    const result = RespondToReviewSchema.safeParse({ response: "  hello  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.response).toBe("hello");
    }
  });
});

// =========================================================================
// FlagReviewSchema (not covered in existing tests)
// =========================================================================
describe("FlagReviewSchema", () => {
  it("accepts a valid reason", () => {
    expect(FlagReviewSchema.safeParse({ reason: "Inappropriate" }).success).toBe(true);
  });

  it("rejects empty string reason", () => {
    expect(FlagReviewSchema.safeParse({ reason: "" }).success).toBe(false);
  });

  it("rejects missing reason", () => {
    expect(FlagReviewSchema.safeParse({}).success).toBe(false);
  });

  it("trims whitespace from reason", () => {
    const result = FlagReviewSchema.safeParse({ reason: "  spam  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reason).toBe("spam");
    }
  });
});

// =========================================================================
// CreateReviewSchema - additional edge cases
// =========================================================================
describe("CreateReviewSchema - edge cases", () => {
  it("rejects rating of 0 (below minimum)", () => {
    const r = CreateReviewSchema.safeParse({ sessionId: "s1", rating: 0 });
    expect(r.success).toBe(false);
  });

  it("rejects rating of 6 (above maximum)", () => {
    const r = CreateReviewSchema.safeParse({ sessionId: "s1", rating: 6 });
    expect(r.success).toBe(false);
  });

  it("rejects negative rating", () => {
    const r = CreateReviewSchema.safeParse({ sessionId: "s1", rating: -1 });
    expect(r.success).toBe(false);
  });

  it("rejects string rating", () => {
    const r = CreateReviewSchema.safeParse({ sessionId: "s1", rating: "5" });
    expect(r.success).toBe(false);
  });

  it("rejects empty sessionId string", () => {
    const r = CreateReviewSchema.safeParse({ sessionId: "", rating: 3 });
    expect(r.success).toBe(false);
  });

  it("accepts comment at exactly 2000 characters", () => {
    const r = CreateReviewSchema.safeParse({
      sessionId: "s1",
      rating: 4,
      comment: "x".repeat(2000),
    });
    expect(r.success).toBe(true);
  });

  it("strips unknown fields", () => {
    const r = CreateReviewSchema.safeParse({
      sessionId: "s1",
      rating: 4,
      unknownField: "should be stripped",
    });
    expect(r.success).toBe(true);
  });
});

// =========================================================================
// UpdateGoalSchema (not covered in existing tests)
// =========================================================================
describe("UpdateGoalSchema", () => {
  it("accepts an empty object (all fields optional)", () => {
    expect(UpdateGoalSchema.safeParse({}).success).toBe(true);
  });

  it("accepts progress at boundary 0", () => {
    expect(UpdateGoalSchema.safeParse({ progress: 0 }).success).toBe(true);
  });

  it("accepts progress at boundary 100", () => {
    expect(UpdateGoalSchema.safeParse({ progress: 100 }).success).toBe(true);
  });

  it("rejects progress below 0", () => {
    expect(UpdateGoalSchema.safeParse({ progress: -1 }).success).toBe(false);
  });

  it("rejects progress above 100", () => {
    expect(UpdateGoalSchema.safeParse({ progress: 101 }).success).toBe(false);
  });

  it("accepts nullable description", () => {
    expect(UpdateGoalSchema.safeParse({ description: null }).success).toBe(true);
  });

  it("accepts nullable targetDate", () => {
    expect(UpdateGoalSchema.safeParse({ targetDate: null }).success).toBe(true);
  });
});

// =========================================================================
// AddMilestoneSchema (not covered)
// =========================================================================
describe("AddMilestoneSchema", () => {
  it("accepts a valid title", () => {
    expect(AddMilestoneSchema.safeParse({ title: "Complete module 1" }).success).toBe(true);
  });

  it("rejects empty title", () => {
    expect(AddMilestoneSchema.safeParse({ title: "" }).success).toBe(false);
  });

  it("rejects missing title", () => {
    expect(AddMilestoneSchema.safeParse({}).success).toBe(false);
  });

  it("trims whitespace from title", () => {
    const r = AddMilestoneSchema.safeParse({ title: "  Study  " });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.title).toBe("Study");
    }
  });
});

// =========================================================================
// CreateExperienceSchema (not covered)
// =========================================================================
describe("CreateExperienceSchema", () => {
  const validExperience = {
    companyName: "Solaris Energy Co.",
    jobTitle: "Engineer",
    startDate: "2023-01-01",
  };

  it("accepts valid experience data", () => {
    expect(CreateExperienceSchema.safeParse(validExperience).success).toBe(true);
  });

  it("rejects empty companyName", () => {
    expect(CreateExperienceSchema.safeParse({ ...validExperience, companyName: "" }).success).toBe(
      false
    );
  });

  it("rejects empty jobTitle", () => {
    expect(CreateExperienceSchema.safeParse({ ...validExperience, jobTitle: "" }).success).toBe(
      false
    );
  });

  it("rejects empty startDate", () => {
    expect(CreateExperienceSchema.safeParse({ ...validExperience, startDate: "" }).success).toBe(
      false
    );
  });

  it("rejects missing companyName", () => {
    const { companyName, ...rest } = validExperience;
    expect(CreateExperienceSchema.safeParse(rest).success).toBe(false);
  });

  it("defaults isCurrent to false", () => {
    const r = CreateExperienceSchema.safeParse(validExperience);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.isCurrent).toBe(false);
    }
  });

  it("defaults skills to empty array", () => {
    const r = CreateExperienceSchema.safeParse(validExperience);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.skills).toEqual([]);
    }
  });

  it("accepts nullable endDate", () => {
    expect(CreateExperienceSchema.safeParse({ ...validExperience, endDate: null }).success).toBe(
      true
    );
  });

  it("trims companyName whitespace", () => {
    const r = CreateExperienceSchema.safeParse({ ...validExperience, companyName: "  Solar Co  " });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.companyName).toBe("Solar Co");
    }
  });
});

// =========================================================================
// RescheduleSessionSchema (not covered)
// =========================================================================
describe("RescheduleSessionSchema", () => {
  it("accepts a valid date string", () => {
    expect(RescheduleSessionSchema.safeParse({ newDate: "2025-06-15T10:00:00Z" }).success).toBe(
      true
    );
  });

  it("rejects empty newDate", () => {
    expect(RescheduleSessionSchema.safeParse({ newDate: "" }).success).toBe(false);
  });

  it("rejects missing newDate", () => {
    expect(RescheduleSessionSchema.safeParse({}).success).toBe(false);
  });
});

// =========================================================================
// CreateActionItemSchema (not covered)
// =========================================================================
describe("CreateActionItemSchema", () => {
  it("accepts valid action item", () => {
    expect(CreateActionItemSchema.safeParse({ description: "Follow up" }).success).toBe(true);
  });

  it("rejects empty description", () => {
    expect(CreateActionItemSchema.safeParse({ description: "" }).success).toBe(false);
  });

  it("rejects missing description", () => {
    expect(CreateActionItemSchema.safeParse({}).success).toBe(false);
  });

  it("accepts nullable dueDate", () => {
    expect(CreateActionItemSchema.safeParse({ description: "Task", dueDate: null }).success).toBe(
      true
    );
  });
});

// =========================================================================
// UpdateActionItemSchema (not covered)
// =========================================================================
describe("UpdateActionItemSchema", () => {
  it("accepts an empty object (all optional)", () => {
    expect(UpdateActionItemSchema.safeParse({}).success).toBe(true);
  });

  it("accepts partial update with only status", () => {
    expect(UpdateActionItemSchema.safeParse({ status: "done" }).success).toBe(true);
  });
});

// =========================================================================
// CreateMentorAssignmentSchema (not covered)
// =========================================================================
describe("CreateMentorAssignmentSchema", () => {
  it("accepts valid assignment", () => {
    expect(CreateMentorAssignmentSchema.safeParse({ mentorProfileId: "mp_1" }).success).toBe(true);
  });

  it("rejects empty mentorProfileId", () => {
    expect(CreateMentorAssignmentSchema.safeParse({ mentorProfileId: "" }).success).toBe(false);
  });

  it("rejects missing mentorProfileId", () => {
    expect(CreateMentorAssignmentSchema.safeParse({}).success).toBe(false);
  });

  it("accepts nullable notes", () => {
    expect(
      CreateMentorAssignmentSchema.safeParse({ mentorProfileId: "mp_1", notes: null }).success
    ).toBe(true);
  });
});

// =========================================================================
// UpdateMentorAssignmentSchema (not covered)
// =========================================================================
describe("UpdateMentorAssignmentSchema", () => {
  it("accepts ACTIVE status", () => {
    expect(
      UpdateMentorAssignmentSchema.safeParse({ assignmentId: "a1", status: "ACTIVE" }).success
    ).toBe(true);
  });

  it("accepts PAUSED status", () => {
    expect(
      UpdateMentorAssignmentSchema.safeParse({ assignmentId: "a1", status: "PAUSED" }).success
    ).toBe(true);
  });

  it("accepts COMPLETED status", () => {
    expect(
      UpdateMentorAssignmentSchema.safeParse({ assignmentId: "a1", status: "COMPLETED" }).success
    ).toBe(true);
  });

  it("rejects invalid status value", () => {
    expect(
      UpdateMentorAssignmentSchema.safeParse({ assignmentId: "a1", status: "CANCELLED" }).success
    ).toBe(false);
  });

  it("rejects empty assignmentId", () => {
    expect(
      UpdateMentorAssignmentSchema.safeParse({ assignmentId: "", status: "ACTIVE" }).success
    ).toBe(false);
  });

  it("rejects missing assignmentId", () => {
    expect(UpdateMentorAssignmentSchema.safeParse({ status: "ACTIVE" }).success).toBe(false);
  });
});

// =========================================================================
// RateMentorSchema (not covered)
// =========================================================================
describe("RateMentorSchema", () => {
  it("accepts valid rating", () => {
    expect(RateMentorSchema.safeParse({ rating: 4 }).success).toBe(true);
  });

  it("accepts rating with nullable comment", () => {
    expect(RateMentorSchema.safeParse({ rating: 5, comment: null }).success).toBe(true);
  });

  it("rejects rating of 0", () => {
    expect(RateMentorSchema.safeParse({ rating: 0 }).success).toBe(false);
  });

  it("rejects rating of 6", () => {
    expect(RateMentorSchema.safeParse({ rating: 6 }).success).toBe(false);
  });

  it("rejects non-integer rating", () => {
    expect(RateMentorSchema.safeParse({ rating: 3.7 }).success).toBe(false);
  });

  it("rejects missing rating", () => {
    expect(RateMentorSchema.safeParse({}).success).toBe(false);
  });

  it("rejects negative rating", () => {
    expect(RateMentorSchema.safeParse({ rating: -2 }).success).toBe(false);
  });
});

// =========================================================================
// UpdateProfileSchema - extended edge cases
// =========================================================================
describe("UpdateProfileSchema - extended", () => {
  it("rejects name exceeding 100 characters", () => {
    expect(UpdateProfileSchema.safeParse({ name: "a".repeat(101) }).success).toBe(false);
  });

  it("accepts name at exactly 100 characters", () => {
    expect(UpdateProfileSchema.safeParse({ name: "a".repeat(100) }).success).toBe(true);
  });

  it("rejects avatar with invalid URL", () => {
    expect(UpdateProfileSchema.safeParse({ avatar: "not-a-url" }).success).toBe(false);
  });

  it("accepts avatar with valid URL", () => {
    expect(UpdateProfileSchema.safeParse({ avatar: "https://example.com/photo.jpg" }).success).toBe(
      true
    );
  });

  it("accepts avatar as null", () => {
    expect(UpdateProfileSchema.safeParse({ avatar: null }).success).toBe(true);
  });

  it("accepts skills as array of strings", () => {
    expect(UpdateProfileSchema.safeParse({ skills: ["React", "Node.js"] }).success).toBe(true);
  });

  it("accepts nullable yearsExperience", () => {
    expect(UpdateProfileSchema.safeParse({ yearsExperience: null }).success).toBe(true);
  });

  it("accepts isMentor boolean", () => {
    expect(UpdateProfileSchema.safeParse({ isMentor: true }).success).toBe(true);
  });
});

// =========================================================================
// CoachApplySchema (not covered)
// =========================================================================
describe("CoachApplySchema", () => {
  const validApplication = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    linkedinUrl: "https://linkedin.com/in/jane",
    headline: "Climate Coach",
    bio: "Experienced in sustainability consulting",
    expertise: ["Climate Strategy"],
    sectors: ["Renewable Energy"],
  };

  it("accepts valid coach application", () => {
    expect(CoachApplySchema.safeParse(validApplication).success).toBe(true);
  });

  it("rejects invalid email format", () => {
    expect(CoachApplySchema.safeParse({ ...validApplication, email: "bad-email" }).success).toBe(
      false
    );
  });

  it("rejects empty email", () => {
    expect(CoachApplySchema.safeParse({ ...validApplication, email: "" }).success).toBe(false);
  });

  it("rejects empty firstName", () => {
    expect(CoachApplySchema.safeParse({ ...validApplication, firstName: "" }).success).toBe(false);
  });

  it("rejects empty lastName", () => {
    expect(CoachApplySchema.safeParse({ ...validApplication, lastName: "" }).success).toBe(false);
  });

  it("rejects empty expertise array", () => {
    expect(CoachApplySchema.safeParse({ ...validApplication, expertise: [] }).success).toBe(false);
  });

  it("rejects empty sectors array", () => {
    expect(CoachApplySchema.safeParse({ ...validApplication, sectors: [] }).success).toBe(false);
  });

  it("rejects missing required fields", () => {
    expect(CoachApplySchema.safeParse({ firstName: "Jane" }).success).toBe(false);
  });
});

// =========================================================================
// RefundSchema (not covered)
// =========================================================================
describe("RefundSchema", () => {
  it("accepts valid refund request", () => {
    expect(RefundSchema.safeParse({ bookingId: "bk_123" }).success).toBe(true);
  });

  it("accepts refund with optional reason", () => {
    expect(RefundSchema.safeParse({ bookingId: "bk_123", reason: "Changed mind" }).success).toBe(
      true
    );
  });

  it("rejects empty bookingId", () => {
    expect(RefundSchema.safeParse({ bookingId: "" }).success).toBe(false);
  });

  it("rejects missing bookingId", () => {
    expect(RefundSchema.safeParse({}).success).toBe(false);
  });
});

// =========================================================================
// CheckoutSchema - extended
// =========================================================================
describe("CheckoutSchema - extended", () => {
  it("accepts duration at boundary 15", () => {
    expect(
      CheckoutSchema.safeParse({
        coachId: "c1",
        sessionDate: "2025-03-15T10:00:00.000Z",
        sessionDuration: 15,
      }).success
    ).toBe(true);
  });

  it("accepts duration at boundary 180", () => {
    expect(
      CheckoutSchema.safeParse({
        coachId: "c1",
        sessionDate: "2025-03-15T10:00:00.000Z",
        sessionDuration: 180,
      }).success
    ).toBe(true);
  });

  it("rejects non-integer duration", () => {
    expect(
      CheckoutSchema.safeParse({
        coachId: "c1",
        sessionDate: "2025-03-15T10:00:00.000Z",
        sessionDuration: 30.5,
      }).success
    ).toBe(false);
  });

  it("rejects empty coachId", () => {
    expect(
      CheckoutSchema.safeParse({
        coachId: "",
        sessionDate: "2025-03-15T10:00:00.000Z",
        sessionDuration: 60,
      }).success
    ).toBe(false);
  });

  it("rejects missing sessionDate", () => {
    expect(CheckoutSchema.safeParse({ coachId: "c1", sessionDuration: 60 }).success).toBe(false);
  });
});

// =========================================================================
// UpdateSavedJobNotesSchema (not covered)
// =========================================================================
describe("UpdateSavedJobNotesSchema", () => {
  it("accepts valid notes", () => {
    expect(UpdateSavedJobNotesSchema.safeParse({ notes: "Interesting role" }).success).toBe(true);
  });

  it("accepts empty object (notes optional)", () => {
    expect(UpdateSavedJobNotesSchema.safeParse({}).success).toBe(true);
  });

  it("rejects notes exceeding 10000 characters", () => {
    expect(UpdateSavedJobNotesSchema.safeParse({ notes: "x".repeat(10001) }).success).toBe(false);
  });

  it("accepts notes at exactly 10000 characters", () => {
    expect(UpdateSavedJobNotesSchema.safeParse({ notes: "x".repeat(10000) }).success).toBe(true);
  });
});

// =========================================================================
// UpdateChecklistSchema (not covered)
// =========================================================================
describe("UpdateChecklistSchema", () => {
  it("accepts valid checklist update", () => {
    expect(UpdateChecklistSchema.safeParse({ itemId: "item_1", completed: true }).success).toBe(
      true
    );
  });

  it("rejects empty itemId", () => {
    expect(UpdateChecklistSchema.safeParse({ itemId: "" }).success).toBe(false);
  });

  it("rejects missing itemId", () => {
    expect(UpdateChecklistSchema.safeParse({ completed: true }).success).toBe(false);
  });

  it("accepts without completed field (optional)", () => {
    expect(UpdateChecklistSchema.safeParse({ itemId: "item_1" }).success).toBe(true);
  });
});

// =========================================================================
// UpdateSessionSchema (not covered)
// =========================================================================
describe("UpdateSessionSchema", () => {
  it("accepts valid session update", () => {
    expect(
      UpdateSessionSchema.safeParse({ sessionId: "sess_1", status: "completed" }).success
    ).toBe(true);
  });

  it("rejects empty sessionId", () => {
    expect(UpdateSessionSchema.safeParse({ sessionId: "" }).success).toBe(false);
  });

  it("rejects missing sessionId", () => {
    expect(UpdateSessionSchema.safeParse({ status: "completed" }).success).toBe(false);
  });

  it("accepts optional coachNotes", () => {
    expect(
      UpdateSessionSchema.safeParse({ sessionId: "sess_1", coachNotes: "Good progress" }).success
    ).toBe(true);
  });
});

// =========================================================================
// UpdateAvailabilitySchema (not covered)
// =========================================================================
describe("UpdateAvailabilitySchema", () => {
  it("accepts an empty object (all fields optional)", () => {
    expect(UpdateAvailabilitySchema.safeParse({}).success).toBe(true);
  });

  it("accepts numeric sessionDuration", () => {
    expect(UpdateAvailabilitySchema.safeParse({ sessionDuration: 60 }).success).toBe(true);
  });

  it("accepts nullable videoLink", () => {
    expect(UpdateAvailabilitySchema.safeParse({ videoLink: null }).success).toBe(true);
  });
});

// =========================================================================
// UpdateCoachProfileSchema (not covered)
// =========================================================================
describe("UpdateCoachProfileSchema", () => {
  it("accepts empty object (all fields optional)", () => {
    expect(UpdateCoachProfileSchema.safeParse({}).success).toBe(true);
  });

  it("accepts partial coach profile update", () => {
    expect(
      UpdateCoachProfileSchema.safeParse({ firstName: "Jane", headline: "Coach" }).success
    ).toBe(true);
  });

  it("accepts nullable fields", () => {
    expect(
      UpdateCoachProfileSchema.safeParse({ bio: null, photoUrl: null, headline: null }).success
    ).toBe(true);
  });

  it("accepts numeric rates", () => {
    expect(UpdateCoachProfileSchema.safeParse({ hourlyRate: 150, monthlyRate: 2000 }).success).toBe(
      true
    );
  });

  it("accepts expertise array", () => {
    expect(UpdateCoachProfileSchema.safeParse({ expertise: ["Leadership", "ESG"] }).success).toBe(
      true
    );
  });
});

// =========================================================================
// UpdateExperienceSchema (not covered)
// =========================================================================
describe("UpdateExperienceSchema", () => {
  it("accepts empty object (all optional)", () => {
    expect(UpdateExperienceSchema.safeParse({}).success).toBe(true);
  });

  it("rejects empty companyName when provided", () => {
    expect(UpdateExperienceSchema.safeParse({ companyName: "" }).success).toBe(false);
  });

  it("rejects empty jobTitle when provided", () => {
    expect(UpdateExperienceSchema.safeParse({ jobTitle: "" }).success).toBe(false);
  });

  it("accepts nullable endDate", () => {
    expect(UpdateExperienceSchema.safeParse({ endDate: null }).success).toBe(true);
  });

  it("accepts skills array update", () => {
    expect(UpdateExperienceSchema.safeParse({ skills: ["React", "Python"] }).success).toBe(true);
  });
});

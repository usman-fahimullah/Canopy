import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { logger, formatError } from "@/lib/logger";
import { UpdateChecklistSchema } from "@/lib/validators/api";

// Default checklist items with their IDs
const DEFAULT_CHECKLIST_ITEMS = [
  { id: "complete_profile", label: "Complete your profile" },
  { id: "set_goals", label: "Set your career goals" },
  { id: "book_session", label: "Book a coaching session" },
  { id: "browse_jobs", label: "Browse climate jobs" },
  { id: "connect_mentor", label: "Connect with a mentor" },
];

// GET - Get checklist completion status for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's account with seeker profile
    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: {
          include: {
            goals: true,
            sessions: true,
            mentorAssignmentsAsMentee: true,
            savedJobs: true,
          },
        },
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Calculate auto-completion status based on user data
    const seeker = account.seekerProfile;
    const autoCompletedItems: Record<string, boolean> = {};

    // Check profile completeness
    const profileComplete = !!(
      account.name &&
      account.bio &&
      seeker?.skills?.length
    );
    autoCompletedItems["complete_profile"] = profileComplete;

    // Check if goals are set
    autoCompletedItems["set_goals"] = (seeker?.goals?.length || 0) > 0;

    // Check if they've booked a session
    autoCompletedItems["book_session"] = (seeker?.sessions?.length || 0) > 0;

    // Check if they've saved/viewed jobs
    autoCompletedItems["browse_jobs"] = (seeker?.savedJobs?.length || 0) > 0;

    // Check if they've connected with a mentor
    autoCompletedItems["connect_mentor"] = (seeker?.mentorAssignmentsAsMentee?.length || 0) > 0;

    // Get manually completed items from account metadata (stored as JSON in bio or separate field)
    // For now, we'll rely on auto-detection and localStorage fallback on client

    // Build response
    const checklistItems = DEFAULT_CHECKLIST_ITEMS.map((item) => ({
      ...item,
      completed: autoCompletedItems[item.id] || false,
      autoDetected: true,
    }));

    // Calculate overall progress
    const completedCount = checklistItems.filter((item) => item.completed).length;
    const totalCount = checklistItems.length;
    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    return NextResponse.json({
      items: checklistItems,
      completed: completedCount,
      total: totalCount,
      progress: progressPercentage,
    });
  } catch (error) {
    logger.error("Fetch checklist error", { error: formatError(error), endpoint: "/api/checklist" });
    return NextResponse.json(
      { error: "Failed to fetch checklist" },
      { status: 500 }
    );
  }
}

// PATCH - Mark a checklist item as manually completed
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = UpdateChecklistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const { itemId, completed } = result.data;


    // For now, we'll store manual completions in localStorage on the client
    // In a future iteration, we could add a ChecklistCompletion model to the schema
    // This endpoint can be used to track analytics or trigger actions

    return NextResponse.json({
      message: "Checklist item updated",
      itemId,
      completed,
    });
  } catch (error) {
    logger.error("Update checklist error", { error: formatError(error), endpoint: "/api/checklist" });
    return NextResponse.json(
      { error: "Failed to update checklist" },
      { status: 500 }
    );
  }
}

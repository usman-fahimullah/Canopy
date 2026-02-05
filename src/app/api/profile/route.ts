import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { logger, formatError } from "@/lib/logger";
import { standardLimiter } from "@/lib/rate-limit";
import { UpdateProfileSchema } from "@/lib/validators/api";

// GET — current user's account + seekerProfile + coachProfile
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: {
        seekerProfile: true,
        coachProfile: true,
      },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    logger.error("Fetch profile error", { error: formatError(error), endpoint: "/api/profile" });
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PATCH — update account and profile fields
export async function PATCH(request: NextRequest) {
  try {
    // Rate limit: 10 profile updates per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = await standardLimiter.check(10, `profile-update:${ip}`);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again shortly." },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const account = await prisma.account.findUnique({
      where: { supabaseId: user.id },
      include: { seekerProfile: true, coachProfile: true },
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const body = await request.json();
    const result = UpdateProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 422 }
      );
    }
    const {
      name,
      avatar,
      phone,
      location,
      timezone,
      bio,
      pronouns,
      ethnicity,
      birthday,
      linkedinUrl,
      instagramUrl,
      threadsUrl,
      facebookUrl,
      blueskyUrl,
      xUrl,
      websiteUrl,
      // Seeker profile fields
      headline,
      skills,
      greenSkills,
      certifications,
      yearsExperience,
      targetSectors,
      resumeUrl,
      coverLetterUrl,
      portfolioUrl,
      summary,
      coverImage,
      badge,
      isMentor,
      mentorBio,
      mentorTopics,
    } = result.data;

    // Update account
    const accountUpdate: Record<string, unknown> = {};
    if (name !== undefined) accountUpdate.name = name;
    if (avatar !== undefined) accountUpdate.avatar = avatar;
    if (phone !== undefined) accountUpdate.phone = phone;
    if (location !== undefined) accountUpdate.location = location;
    if (timezone !== undefined) accountUpdate.timezone = timezone;
    if (bio !== undefined) accountUpdate.bio = bio;
    if (pronouns !== undefined) accountUpdate.pronouns = pronouns;
    if (ethnicity !== undefined) accountUpdate.ethnicity = ethnicity;
    if (birthday !== undefined) accountUpdate.birthday = birthday ? new Date(birthday) : null;
    if (linkedinUrl !== undefined) accountUpdate.linkedinUrl = linkedinUrl;
    if (instagramUrl !== undefined) accountUpdate.instagramUrl = instagramUrl;
    if (threadsUrl !== undefined) accountUpdate.threadsUrl = threadsUrl;
    if (facebookUrl !== undefined) accountUpdate.facebookUrl = facebookUrl;
    if (blueskyUrl !== undefined) accountUpdate.blueskyUrl = blueskyUrl;
    if (xUrl !== undefined) accountUpdate.xUrl = xUrl;
    if (websiteUrl !== undefined) accountUpdate.websiteUrl = websiteUrl;

    if (Object.keys(accountUpdate).length > 0) {
      await prisma.account.update({
        where: { id: account.id },
        data: accountUpdate,
      });
    }

    // Update seeker profile if fields provided
    if (account.seekerProfile) {
      const seekerUpdate: Record<string, unknown> = {};
      if (headline !== undefined) seekerUpdate.headline = headline;
      if (skills !== undefined) seekerUpdate.skills = skills;
      if (greenSkills !== undefined) seekerUpdate.greenSkills = greenSkills;
      if (certifications !== undefined) seekerUpdate.certifications = certifications;
      if (yearsExperience !== undefined) seekerUpdate.yearsExperience = yearsExperience;
      if (targetSectors !== undefined) seekerUpdate.targetSectors = targetSectors;
      if (resumeUrl !== undefined) seekerUpdate.resumeUrl = resumeUrl;
      if (coverLetterUrl !== undefined) seekerUpdate.coverLetterUrl = coverLetterUrl;
      if (portfolioUrl !== undefined) seekerUpdate.portfolioUrl = portfolioUrl;
      if (summary !== undefined) seekerUpdate.summary = summary;
      if (coverImage !== undefined) seekerUpdate.coverImage = coverImage;
      if (badge !== undefined) seekerUpdate.badge = badge;
      if (isMentor !== undefined) seekerUpdate.isMentor = isMentor;
      if (mentorBio !== undefined) seekerUpdate.mentorBio = mentorBio;
      if (mentorTopics !== undefined) seekerUpdate.mentorTopics = mentorTopics;

      if (Object.keys(seekerUpdate).length > 0) {
        await prisma.seekerProfile.update({
          where: { id: account.seekerProfile.id },
          data: seekerUpdate,
        });
      }
    }

    // Re-fetch updated profile
    const updated = await prisma.account.findUnique({
      where: { id: account.id },
      include: { seekerProfile: true, coachProfile: true },
    });

    return NextResponse.json({ account: updated });
  } catch (error) {
    logger.error("Update profile error", { error: formatError(error), endpoint: "/api/profile" });
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

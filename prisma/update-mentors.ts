/**
 * One-time script to populate mentorSpecialty, mentorBadge, mentorRating
 * on existing mentor SeekerProfiles.
 *
 * Run with: npx tsx prisma/update-mentors.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mentorUpdates: Record<
  string,
  { mentorSpecialty: string; mentorBadge: string | null; mentorRating: number; mentorReviewCount: number }
> = {
  // Finn O'Leary - Manufacturing Engineer
  "finn": {
    mentorSpecialty: "Sustainable Manufacturing",
    mentorBadge: "top_mentor",
    mentorRating: 4.9,
    mentorReviewCount: 7,
  },
  // Brian - HVAC Technician
  "brian": {
    mentorSpecialty: "Heat Pump Careers",
    mentorBadge: "quick_responder",
    mentorRating: 4.9,
    mentorReviewCount: 4,
  },
  // Wendy Adeyemi - ESG Program Manager
  "wendy": {
    mentorSpecialty: "Corporate Sustainability Careers",
    mentorBadge: "featured",
    mentorRating: 5,
    mentorReviewCount: 12,
  },
  // Marcus Williams - Climate Lobbyist
  "marcus": {
    mentorSpecialty: "Climate Policy Careers",
    mentorBadge: null,
    mentorRating: 4.9,
    mentorReviewCount: 6,
  },
  // Jasmine Patel - Environmental Educator
  "jasmine": {
    mentorSpecialty: "Environmental Education Careers",
    mentorBadge: null,
    mentorRating: 4.6,
    mentorReviewCount: 4,
  },
  // Fatima - Sustainability Consultant
  "fatima": {
    mentorSpecialty: "Sustainability Consulting",
    mentorBadge: "quick_responder",
    mentorRating: 4.9,
    mentorReviewCount: 5,
  },
  // Carlos - Solar Technician
  "carlos": {
    mentorSpecialty: "Solar Installation Careers",
    mentorBadge: "featured",
    mentorRating: 4.7,
    mentorReviewCount: 3,
  },
};

async function main() {
  console.log("Updating mentor profiles with specialty, badge, and rating...\n");

  // Get all mentors
  const mentors = await prisma.seekerProfile.findMany({
    where: { isMentor: true },
    include: { account: { select: { name: true } } },
  });

  console.log(`Found ${mentors.length} mentors in database.\n`);

  let updated = 0;

  for (const mentor of mentors) {
    const name = mentor.account.name || "";
    const firstName = name.split(" ")[0].toLowerCase();

    const updateData = mentorUpdates[firstName];

    if (updateData) {
      await prisma.seekerProfile.update({
        where: { id: mentor.id },
        data: {
          mentorSpecialty: updateData.mentorSpecialty,
          mentorBadge: updateData.mentorBadge,
          mentorRating: updateData.mentorRating,
          mentorReviewCount: updateData.mentorReviewCount,
        },
      });
      console.log(
        `  ✅ ${name}: specialty="${updateData.mentorSpecialty}", badge=${updateData.mentorBadge || "none"}, rating=${updateData.mentorRating}`
      );
      updated++;
    } else {
      // Fall back: use first mentorTopic as specialty, generate a rating
      const specialty = mentor.mentorTopics?.[0] || null;
      const rating = 4.5 + Math.random() * 0.5; // 4.5-5.0
      await prisma.seekerProfile.update({
        where: { id: mentor.id },
        data: {
          mentorSpecialty: specialty,
          mentorRating: Math.round(rating * 10) / 10,
          mentorReviewCount: Math.floor(Math.random() * 5) + 1,
        },
      });
      console.log(
        `  ⚡ ${name}: specialty="${specialty}" (auto), rating=${Math.round(rating * 10) / 10}`
      );
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} mentor profiles.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

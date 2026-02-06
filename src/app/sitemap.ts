import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Dynamic sitemap for SEO. Includes:
 * - Static pages (home, search)
 * - All PUBLISHED jobs
 * - Career pages (when enabled)
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    {
      url: `${appUrl}/jobs/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // Published jobs
  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });

  const jobPages: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${appUrl}/jobs/search/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Career pages
  const careerPages = await prisma.organization.findMany({
    where: { careerPageEnabled: true, careerPageSlug: { not: null } },
    select: { careerPageSlug: true, updatedAt: true },
  });

  const careerPageEntries: MetadataRoute.Sitemap = careerPages.map((org) => ({
    url: `${appUrl}/careers/${org.careerPageSlug}`,
    lastModified: org.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...jobPages, ...careerPageEntries];
}

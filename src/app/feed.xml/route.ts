import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /feed.xml
 *
 * RSS 2.0 feed of the latest 50 published jobs.
 * Used by job aggregators and RSS readers.
 */
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";

  const jobs = await prisma.job.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      locationType: true,
      publishedAt: true,
      organization: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  const items = jobs
    .map((job) => {
      const plainDesc = stripHtml(job.description).slice(0, 500);
      const link = `${appUrl}/jobs/search/${job.id}`;
      const pubDate = job.publishedAt
        ? new Date(job.publishedAt).toUTCString()
        : new Date().toUTCString();

      return `    <item>
      <title>${escapeXml(job.title)} at ${escapeXml(job.organization.name)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(plainDesc)}</description>
      <pubDate>${pubDate}</pubDate>
      ${job.location ? `<category>${escapeXml(job.location)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Green Jobs Board — Climate Jobs</title>
    <link>${appUrl}</link>
    <description>Latest climate and sustainability job openings</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${appUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

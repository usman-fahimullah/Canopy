import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/feeds/indeed.xml
 *
 * Indeed-compatible XML job feed.
 * Indeed's crawler scrapes this endpoint to ingest organic job listings.
 *
 * Feed spec: https://docs.indeed.com/indeed-apply/xml-feed-specification
 *
 * Only includes PUBLISHED jobs with syndicationEnabled = true.
 */
export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://greenjobsboard.us";

  const jobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      syndicationEnabled: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      locationType: true,
      employmentType: true,
      salaryMin: true,
      salaryMax: true,
      salaryCurrency: true,
      salaryPeriod: true,
      climateCategory: true,
      publishedAt: true,
      closesAt: true,
      organization: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
    take: 500,
  });

  const escapeXml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

  const mapEmploymentType = (type: string) => {
    const map: Record<string, string> = {
      FULL_TIME: "full-time",
      PART_TIME: "part-time",
      CONTRACT: "contract",
      INTERNSHIP: "internship",
      VOLUNTEER: "volunteer",
    };
    return map[type] || "full-time";
  };

  const mapSalaryType = (period: string | null) => {
    const map: Record<string, string> = {
      ANNUAL: "yearly",
      HOURLY: "hourly",
      WEEKLY: "weekly",
      MONTHLY: "monthly",
    };
    return period ? map[period] || "yearly" : "yearly";
  };

  const items = jobs
    .map((job) => {
      const plainDesc = escapeXml(stripHtml(job.description));
      const applyUrl = `${appUrl}/apply/${job.id}`;
      const pubDate = job.publishedAt
        ? new Date(job.publishedAt).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      let salaryXml = "";
      if (job.salaryMin) {
        salaryXml = `
      <salary>${job.salaryMin}${job.salaryMax ? ` - ${job.salaryMax}` : ""}</salary>
      <salary_type>${mapSalaryType(job.salaryPeriod)}</salary_type>
      <currency>${escapeXml(job.salaryCurrency)}</currency>`;
      }

      let locationXml: string;
      if (job.locationType === "REMOTE") {
        locationXml = `
      <city>Remote</city>
      <remotetype>Fully Remote</remotetype>`;
      } else {
        const parts = (job.location || "").split(",").map((s) => s.trim());
        locationXml = `
      <city>${escapeXml(parts[0] || "")}</city>
      ${parts[1] ? `<state>${escapeXml(parts[1])}</state>` : ""}
      <country>US</country>`;
        if (job.locationType === "HYBRID") {
          locationXml += `
      <remotetype>COVID-19: Hybrid</remotetype>`;
        }
      }

      return `  <job>
    <title><![CDATA[${job.title}]]></title>
    <date>${pubDate}</date>
    <referencenumber>${job.id}</referencenumber>
    <url>${escapeXml(applyUrl)}</url>
    <company><![CDATA[${job.organization.name}]]></company>
    <description><![CDATA[${stripHtml(job.description).slice(0, 4000)}]]></description>${locationXml}
    <jobtype>${mapEmploymentType(job.employmentType)}</jobtype>${salaryXml}${
      job.climateCategory ? `\n    <category><![CDATA[${job.climateCategory}]]></category>` : ""
    }${
      job.closesAt
        ? `\n    <expirationdate>${new Date(job.closesAt).toISOString().split("T")[0]}</expirationdate>`
        : ""
    }
  </job>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>Green Jobs Board</publisher>
  <publisherurl>${appUrl}</publisherurl>
  <lastBuildDate>${new Date().toISOString()}</lastBuildDate>
${items}
</source>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

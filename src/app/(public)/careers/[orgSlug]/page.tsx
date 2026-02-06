import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SectionRenderer } from "@/components/career-pages/SectionRenderer";
import type { CareerPageConfig } from "@/lib/career-pages/types";
import { DEFAULT_CAREER_PAGE_CONFIG } from "@/lib/career-pages/default-template";

interface CareerPageProps {
  params: Promise<{ orgSlug: string }>;
}

async function getCareerPageData(slug: string) {
  const org = await prisma.organization.findFirst({
    where: {
      careerPageSlug: slug,
      careerPageEnabled: true,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      description: true,
      careerPageSlug: true,
      careerPageConfig: true,
    },
  });

  if (!org) return null;

  // Fetch published jobs for this org
  const jobs = await prisma.job.findMany({
    where: {
      organizationId: org.id,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      title: true,
      location: true,
      locationType: true,
      employmentType: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 50,
  });

  const config = (org.careerPageConfig as CareerPageConfig | null) ?? DEFAULT_CAREER_PAGE_CONFIG;

  return { org, jobs, config };
}

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  const { orgSlug } = await params;
  const data = await getCareerPageData(orgSlug);

  if (!data) return { title: "Career Page Not Found" };

  const { org } = data;
  const title = `Careers at ${org.name}`;
  const description = org.description
    ? org.description.replace(/<[^>]*>/g, "").slice(0, 160)
    : `Explore open positions at ${org.name}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(org.logo ? { images: [{ url: org.logo, alt: org.name }] } : {}),
    },
  };
}

export default async function CareerPage({ params }: CareerPageProps) {
  const { orgSlug } = await params;
  const data = await getCareerPageData(orgSlug);

  if (!data) {
    notFound();
  }

  const { org, jobs, config } = data;

  return (
    <main style={{ fontFamily: config.theme.fontFamily }}>
      {/* Org logo header */}
      {org.logo && (
        <div className="flex items-center gap-3 border-b border-[var(--border-muted)] px-6 py-4">
          <img src={org.logo} alt={org.name} className="h-8 w-8 rounded-lg object-contain" />
          <span className="font-semibold text-[var(--foreground-default)]">{org.name}</span>
        </div>
      )}

      <SectionRenderer
        sections={config.sections}
        theme={config.theme}
        orgSlug={orgSlug}
        jobs={jobs}
      />
    </main>
  );
}

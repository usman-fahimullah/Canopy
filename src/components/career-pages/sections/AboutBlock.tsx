import type { AboutSection } from "@/lib/career-pages/types";

interface AboutBlockProps {
  section: AboutSection;
}

export function AboutBlock({ section }: AboutBlockProps) {
  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-6 text-3xl font-bold text-[var(--foreground-default)]">
          {section.title}
        </h2>
        <div className="flex flex-col gap-8 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="prose prose-sm max-w-none text-[var(--foreground-muted)]" dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
          {section.image && (
            <div className="w-full shrink-0 md:w-80">
              <img src={section.image} alt={section.title} className="rounded-xl object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import type { BenefitsSection } from "@/lib/career-pages/types";
import * as PhosphorIcons from "@phosphor-icons/react/dist/ssr";

interface BenefitsBlockProps {
  section: BenefitsSection;
}

function getIcon(iconName: string) {
  const icons = PhosphorIcons as unknown as Record<string, typeof PhosphorIcons.CheckCircle>;
  return icons[iconName] || PhosphorIcons.CheckCircle;
}

export function BenefitsBlock({ section }: BenefitsBlockProps) {
  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-[var(--foreground-default)]">
          {section.title}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {section.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={i}
                className="flex gap-4 rounded-xl border border-[var(--border-muted)] bg-[var(--background-default)] p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--background-brand-subtle)]">
                  <Icon size={20} weight="regular" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground-default)]">{item.title}</h3>
                  <p className="mt-1 text-sm text-[var(--foreground-muted)]">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

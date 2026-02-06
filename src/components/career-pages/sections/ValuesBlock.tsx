import type { ValuesSection } from "@/lib/career-pages/types";
import * as PhosphorIcons from "@phosphor-icons/react/dist/ssr";

interface ValuesBlockProps {
  section: ValuesSection;
}

function getIcon(iconName: string) {
  const icons = PhosphorIcons as unknown as Record<string, typeof PhosphorIcons.Star>;
  return icons[iconName] || PhosphorIcons.Star;
}

export function ValuesBlock({ section }: ValuesBlockProps) {
  return (
    <section className="bg-[var(--background-subtle)] px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold text-[var(--foreground-default)]">
          {section.title}
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {section.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--background-brand-subtle)]">
                  <Icon size={28} weight="regular" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[var(--foreground-default)]">
                  {item.title}
                </h3>
                <p className="text-[var(--foreground-muted)]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

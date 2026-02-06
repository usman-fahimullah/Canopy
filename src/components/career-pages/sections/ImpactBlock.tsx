import type { ImpactSection, CareerPageTheme } from "@/lib/career-pages/types";

interface ImpactBlockProps {
  section: ImpactSection;
  theme: CareerPageTheme;
}

export function ImpactBlock({ section, theme }: ImpactBlockProps) {
  return (
    <section className="px-6 py-16 md:px-12" style={{ backgroundColor: theme.primaryColor }}>
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold text-white">{section.title}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {section.metrics.map((metric, i) => (
            <div key={i} className="text-center">
              <div className="mb-2 text-5xl font-bold text-white">{metric.value}</div>
              <div className="text-lg text-white/80">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

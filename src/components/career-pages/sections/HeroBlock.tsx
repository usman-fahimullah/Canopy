import type { HeroSection, CareerPageTheme } from "@/lib/career-pages/types";

interface HeroBlockProps {
  section: HeroSection;
  theme: CareerPageTheme;
}

export function HeroBlock({ section, theme }: HeroBlockProps) {
  return (
    <section
      className="relative flex min-h-[400px] items-center justify-center px-6 py-20 text-center"
      style={{
        backgroundColor: theme.primaryColor,
        backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {section.backgroundImage && <div className="absolute inset-0 bg-black/50" />}
      <div className="relative z-10 mx-auto max-w-3xl">
        <h1
          className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
          style={{ fontFamily: theme.fontFamily }}
        >
          {section.headline}
        </h1>
        <p className="text-lg text-white/80 md:text-xl">{section.subheadline}</p>
      </div>
    </section>
  );
}

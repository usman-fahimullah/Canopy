import { Quotes } from "@phosphor-icons/react";

interface TestimonialsBlockProps {
  title: string;
  items: { quote: string; author: string; role: string; photo?: string }[];
  theme?: { primaryColor?: string };
}

export function TestimonialsBlock({ title, items, theme }: TestimonialsBlockProps) {
  return (
    <section className="px-6 py-16 md:px-12 lg:px-24">
      <h2 className="mb-10 text-center text-2xl font-bold text-[var(--foreground-default)]">
        {title}
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="relative rounded-2xl border border-[var(--border-muted)] bg-[var(--card-background)] p-6"
          >
            <Quotes
              size={24}
              weight="fill"
              className="mb-3"
              style={{ color: theme?.primaryColor || "var(--primitive-green-500)" }}
            />
            <p className="mb-4 text-sm leading-relaxed text-[var(--foreground-default)]">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: theme?.primaryColor || "var(--primitive-green-500)" }}
                >
                  {item.author.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-[var(--foreground-default)]">
                  {item.author}
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

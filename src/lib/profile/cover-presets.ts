export const COVER_PRESETS = [
  { id: "nature-01", src: "/images/covers/Nature-01.png", alt: "Spring forest" },
  { id: "abstract-01", src: "/images/covers/Abstract-01.png", alt: "Warm pastel gradient" },
  { id: "nature-02", src: "/images/covers/Nature-02.png", alt: "Autumn forest" },
  { id: "abstract-02", src: "/images/covers/Abstract-02.png", alt: "Purple gradient" },
  { id: "nature-03", src: "/images/covers/Nature-03.png", alt: "Moonlit forest" },
  { id: "abstract-03", src: "/images/covers/Abstract-03.png", alt: "Soft pastel gradient" },
] as const;

export type CoverPresetId = (typeof COVER_PRESETS)[number]["id"];

export const DEFAULT_COVER_ID: CoverPresetId = "abstract-01";

export function getCoverPreset(id: string | null | undefined) {
  return (
    COVER_PRESETS.find((p) => p.id === id) ?? COVER_PRESETS.find((p) => p.id === DEFAULT_COVER_ID)!
  );
}

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

/**
 * Returns cover image info. If the id matches a preset, returns that preset.
 * If the id looks like a URL (custom upload), returns it as a custom cover.
 * Falls back to the default preset.
 */
export function getCoverPreset(id: string | null | undefined): { src: string; alt: string } {
  if (!id) {
    return COVER_PRESETS.find((p) => p.id === DEFAULT_COVER_ID)!;
  }

  // Check if it's a preset ID
  const preset = COVER_PRESETS.find((p) => p.id === id);
  if (preset) return preset;

  // Check if it's a custom URL (uploaded cover)
  if (id.startsWith("http://") || id.startsWith("https://")) {
    return { src: id, alt: "Custom cover image" };
  }

  // Fallback to default
  return COVER_PRESETS.find((p) => p.id === DEFAULT_COVER_ID)!;
}

/** Check if a coverImage value is a custom upload URL vs a preset ID */
export function isCustomCoverUrl(coverImage: string | null | undefined): boolean {
  if (!coverImage) return false;
  return coverImage.startsWith("http://") || coverImage.startsWith("https://");
}

export const AVATAR_PRESETS = [
  { id: "bear", src: "/illustrations/avatars/Bear.png", alt: "Bear" },
  { id: "blue-jay", src: "/illustrations/avatars/Blue Jay.png", alt: "Blue Jay" },
  { id: "cardinal", src: "/illustrations/avatars/Cardinal.png", alt: "Cardinal" },
  { id: "deer", src: "/illustrations/avatars/Deer.png", alt: "Deer" },
  { id: "fox", src: "/illustrations/avatars/Fox.png", alt: "Fox" },
  { id: "hedgehog", src: "/illustrations/avatars/Hedgehog.png", alt: "Hedgehog" },
  { id: "otter", src: "/illustrations/avatars/Otter.png", alt: "Otter" },
  { id: "owl", src: "/illustrations/avatars/Owl.png", alt: "Owl" },
  { id: "rabbit", src: "/illustrations/avatars/Rabbit.png", alt: "Rabbit" },
  { id: "raccoon", src: "/illustrations/avatars/Raccoon.png", alt: "Raccoon" },
  { id: "red-panda", src: "/illustrations/avatars/Red Panda.png", alt: "Red Panda" },
  { id: "squirrel", src: "/illustrations/avatars/Squirrel.png", alt: "Squirrel" },
  { id: "tree-frog", src: "/illustrations/avatars/Tree Frog.png", alt: "Tree Frog" },
  { id: "wolf", src: "/illustrations/avatars/Wolf.png", alt: "Wolf" },
] as const;

export type AvatarPresetId = (typeof AVATAR_PRESETS)[number]["id"];

/** Returns a random avatar image path (for assigning to new accounts) */
export function getRandomAvatarSrc(): string {
  const index = Math.floor(Math.random() * AVATAR_PRESETS.length);
  return AVATAR_PRESETS[index].src;
}

/** Returns a deterministic avatar image path based on a seed string (e.g. email, name) */
export function getDeterministicAvatarSrc(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PRESETS.length;
  return AVATAR_PRESETS[index].src;
}

/** Find the preset ID that matches a given src path, or null if it's not a preset */
export function getAvatarPresetFromSrc(src: string | null | undefined): AvatarPresetId | null {
  if (!src) return null;
  const preset = AVATAR_PRESETS.find((p) => p.src === src);
  return preset ? preset.id : null;
}

/** Check if an avatar value is a custom upload URL (not a preset path) */
export function isCustomAvatarUrl(avatar: string | null | undefined): boolean {
  if (!avatar) return false;
  return avatar.startsWith("http://") || avatar.startsWith("https://");
}

/** Check if an avatar value is one of the preset illustration paths */
export function isAvatarPreset(avatar: string | null | undefined): boolean {
  if (!avatar) return false;
  return AVATAR_PRESETS.some((p) => p.src === avatar);
}

/** All valid preset src paths (for validation) */
export const AVATAR_PRESET_SRCS: Set<string> = new Set(AVATAR_PRESETS.map((p) => p.src));

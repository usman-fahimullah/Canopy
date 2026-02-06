/**
 * Platform adapter registry.
 *
 * Returns the correct adapter for a given platform name.
 * New platforms are added here as they're integrated.
 */

import type { SyndicationPlatform, PlatformAdapter } from "../types";
import { IndeedAdapter } from "./indeed";
import { LinkedInAdapter } from "./linkedin";

const adapters: Partial<Record<SyndicationPlatform, PlatformAdapter>> = {
  indeed: new IndeedAdapter(),
  linkedin: new LinkedInAdapter(),
};

export function getAdapter(platform: SyndicationPlatform): PlatformAdapter | null {
  return adapters[platform] ?? null;
}

export function getAvailablePlatforms(): SyndicationPlatform[] {
  return Object.keys(adapters) as SyndicationPlatform[];
}

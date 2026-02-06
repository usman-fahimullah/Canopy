/**
 * Shared types for the Canopy ATS product.
 * Used across API routes, pages, and components.
 */

/** A job template as returned by the /api/canopy/templates endpoint */
export interface RoleTemplate {
  id: string;
  name: string;
  sourceJobId: string | null;
  activeFields: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Module-level File reference for the company logo.
 * File objects can't be serialized to localStorage, so we keep
 * the raw File here and the preview URL in the form context.
 * This survives SPA navigations but not full page reloads.
 */
let pendingLogoFile: File | null = null;

/** Store a File for later upload at the invite-team step */
export function setPendingLogoFile(file: File) {
  pendingLogoFile = file;
}

/** Retrieve the pending logo File for upload at the invite-team step */
export function getPendingLogoFile(): File | null {
  return pendingLogoFile;
}

/** Clear the pending logo File after successful upload */
export function clearPendingLogoFile() {
  pendingLogoFile = null;
}

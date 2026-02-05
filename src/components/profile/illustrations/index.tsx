"use client";

/**
 * Profile Section Illustrations
 *
 * Custom SVG illustrations for empty states in profile sections.
 * Based on Figma designs for Goals, Experience, and Files sections.
 *
 * @figma https://figma.com/design/uyjitGccNs5zxBfJsfrgg8/Pathways-MVP?node-id=2215-7340
 */

interface IllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Goals section empty state illustration
 * Depicts a target/goal with progress indicator
 */
export function GoalsIllustration({ className, width = 120, height = 120 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="var(--primitive-green-100)" />
      {/* Target rings */}
      <circle
        cx="60"
        cy="60"
        r="35"
        stroke="var(--primitive-green-300)"
        strokeWidth="3"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r="22"
        stroke="var(--primitive-green-400)"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="60" cy="60" r="10" fill="var(--primitive-green-500)" />
      {/* Arrow pointing to center */}
      <path
        d="M85 35L65 55"
        stroke="var(--primitive-green-600)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M85 35L75 37L83 45L85 35Z" fill="var(--primitive-green-600)" />
      {/* Progress arc */}
      <path
        d="M60 15A45 45 0 0 1 98 72"
        stroke="var(--primitive-green-500)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Experience section empty state illustration
 * Depicts a briefcase/work symbol
 */
export function ExperienceIllustration({
  className,
  width = 120,
  height = 120,
}: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="var(--primitive-blue-100)" />
      {/* Briefcase body */}
      <rect
        x="28"
        y="45"
        width="64"
        height="40"
        rx="6"
        fill="var(--primitive-blue-200)"
        stroke="var(--primitive-blue-500)"
        strokeWidth="2"
      />
      {/* Handle */}
      <path
        d="M45 45V38C45 34.6863 47.6863 32 51 32H69C72.3137 32 75 34.6863 75 38V45"
        stroke="var(--primitive-blue-500)"
        strokeWidth="2"
        fill="none"
      />
      {/* Center line */}
      <rect x="28" y="58" width="64" height="3" fill="var(--primitive-blue-400)" />
      {/* Clasp */}
      <rect x="54" y="52" width="12" height="12" rx="2" fill="var(--primitive-blue-500)" />
    </svg>
  );
}

/**
 * Files section empty state illustration
 * Depicts a folder with documents
 */
export function FilesIllustration({ className, width = 120, height = 120 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="50" fill="var(--primitive-neutral-200)" />
      {/* Back folder */}
      <path
        d="M25 45C25 41.6863 27.6863 39 31 39H45L52 46H89C92.3137 46 95 48.6863 95 52V80C95 83.3137 92.3137 86 89 86H31C27.6863 86 25 83.3137 25 80V45Z"
        fill="var(--primitive-neutral-300)"
      />
      {/* Front folder */}
      <path
        d="M28 50C28 46.6863 30.6863 44 34 44H48L55 51H86C89.3137 51 92 53.6863 92 57V82C92 85.3137 89.3137 88 86 88H34C30.6863 88 28 85.3137 28 82V50Z"
        fill="var(--primitive-neutral-100)"
        stroke="var(--primitive-neutral-400)"
        strokeWidth="2"
      />
      {/* Document lines */}
      <path
        d="M40 62H80M40 70H65"
        stroke="var(--primitive-neutral-400)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Upload arrow */}
      <path
        d="M60 32V50M52 40L60 32L68 40"
        stroke="var(--primitive-green-500)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Summary CTA card illustration
 * Depicts a person/story symbol
 */
export function SummaryIllustration({ className, width = 80, height = 80 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="40" cy="40" r="36" fill="var(--primitive-purple-200)" />
      {/* Document/text lines */}
      <path
        d="M24 28H56M24 38H56M24 48H44"
        stroke="var(--primitive-purple-600)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Pen/edit icon */}
      <path d="M52 52L58 46L64 52L58 58L52 52Z" fill="var(--primitive-purple-500)" />
      <path d="M50 54L52 52L58 58L56 60L50 54Z" fill="var(--primitive-purple-400)" />
    </svg>
  );
}

/**
 * Skills CTA card illustration
 * Depicts skills/checkmarks
 */
export function SkillsIllustration({ className, width = 80, height = 80 }: IllustrationProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="40" cy="40" r="36" fill="var(--primitive-neutral-200)" />
      {/* Checkmark in circle */}
      <circle cx="40" cy="40" r="20" fill="var(--primitive-green-100)" />
      <path
        d="M30 40L37 47L50 34"
        stroke="var(--primitive-green-600)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Skill badges */}
      <rect x="16" y="18" width="16" height="8" rx="4" fill="var(--primitive-blue-300)" />
      <rect x="48" y="18" width="16" height="8" rx="4" fill="var(--primitive-purple-300)" />
      <rect x="16" y="54" width="16" height="8" rx="4" fill="var(--primitive-orange-300)" />
      <rect x="48" y="54" width="16" height="8" rx="4" fill="var(--primitive-green-300)" />
    </svg>
  );
}

"use client";

/**
 * Roles Page Illustrations
 *
 * SVG illustrations for the Roles page empty states and feature highlights.
 * All illustrations use design tokens (CSS variables) for dark mode compatibility.
 */

interface IllustrationProps {
  className?: string;
}

/**
 * Rocket launch illustration for the first-time empty state.
 * Shows a rocket launching with two people watching, sunrise in background.
 */
export function RolesEmptyHeroIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sunrise gradient circle */}
      <circle cx="300" cy="260" r="160" fill="url(#sunriseGradient)" />
      <defs>
        <radialGradient id="sunriseGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--primitive-yellow-200)" />
          <stop offset="60%" stopColor="var(--primitive-orange-200)" />
          <stop offset="100%" stopColor="var(--primitive-orange-300)" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      {/* Cloud shapes */}
      <ellipse cx="180" cy="180" rx="70" ry="25" fill="var(--primitive-neutral-0)" opacity="0.8" />
      <ellipse cx="440" cy="200" rx="55" ry="20" fill="var(--primitive-neutral-0)" opacity="0.7" />
      <ellipse cx="360" cy="150" rx="45" ry="15" fill="var(--primitive-neutral-0)" opacity="0.6" />

      {/* Ground hills */}
      <path
        d="M0 420 Q150 370, 300 400 Q450 430, 600 390 V500 H0 Z"
        fill="var(--primitive-green-100)"
      />

      {/* Grass tufts */}
      <path
        d="M230 410 Q235 390, 240 410"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M235 412 Q242 395, 248 412"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M370 405 Q375 385, 380 405"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Rocket */}
      <g transform="translate(280, 120)">
        {/* Rocket body */}
        <path
          d="M20 60 L20 200 Q20 210, 30 210 L50 210 Q60 210, 60 200 L60 60 Q40 20, 20 60Z"
          fill="var(--primitive-neutral-0)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2.5"
        />
        {/* Rocket nose cone */}
        <path
          d="M20 60 Q40 10, 60 60"
          fill="var(--primitive-neutral-0)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2.5"
        />
        {/* Window */}
        <circle
          cx="40"
          cy="100"
          r="15"
          fill="var(--primitive-green-100)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
        />
        {/* Leaf logo in window */}
        <path d="M35 105 Q40 90, 45 100 Q42 98, 38 103" fill="var(--primitive-green-700)" />
        {/* Fins */}
        <path
          d="M20 180 L0 220 L20 210Z"
          fill="var(--primitive-green-800)"
          stroke="var(--primitive-green-800)"
          strokeWidth="1.5"
        />
        <path
          d="M60 180 L80 220 L60 210Z"
          fill="var(--primitive-green-800)"
          stroke="var(--primitive-green-800)"
          strokeWidth="1.5"
        />
        {/* Exhaust flame */}
        <path d="M25 210 Q40 280, 55 210" fill="url(#flameGradient)" opacity="0.8" />
        <path d="M30 210 Q40 260, 50 210" fill="var(--primitive-yellow-300)" opacity="0.9" />
      </g>
      <defs>
        <linearGradient id="flameGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primitive-orange-400)" />
          <stop offset="50%" stopColor="var(--primitive-red-400)" />
          <stop offset="100%" stopColor="var(--primitive-purple-400)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Person 1 (woman, left) */}
      <g transform="translate(400, 280)">
        {/* Body */}
        <ellipse cx="30" cy="110" rx="25" ry="35" fill="var(--primitive-yellow-200)" />
        {/* Head */}
        <circle
          cx="30"
          cy="50"
          r="25"
          fill="var(--primitive-orange-200)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
        />
        {/* Hair */}
        <path
          d="M8 45 Q8 20, 30 20 Q52 20, 52 45 Q52 35, 40 28 Q30 22, 20 28 Q10 35, 8 45Z"
          fill="var(--primitive-green-800)"
        />
        {/* Hair flowing */}
        <path d="M52 40 Q60 55, 55 70 Q58 60, 54 48" fill="var(--primitive-green-800)" />
        {/* Eyes */}
        <circle cx="22" cy="50" r="2" fill="var(--primitive-green-800)" />
        <circle cx="38" cy="50" r="2" fill="var(--primitive-green-800)" />
      </g>

      {/* Person 2 (person, right) */}
      <g transform="translate(470, 270)">
        {/* Body */}
        <ellipse cx="30" cy="115" rx="28" ry="38" fill="var(--primitive-blue-200)" />
        {/* Head */}
        <circle
          cx="30"
          cy="50"
          r="25"
          fill="var(--primitive-orange-200)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
        />
        {/* Hair */}
        <path
          d="M8 42 Q15 15, 50 30 Q55 35, 52 48 Q50 38, 42 32 Q30 22, 15 35 Q10 40, 8 42Z"
          fill="var(--primitive-green-800)"
        />
        {/* Wavy hair accent */}
        <path
          d="M50 32 Q58 28, 55 38 Q60 32, 52 26"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
          fill="none"
        />
        {/* Eyes */}
        <circle cx="22" cy="50" r="2" fill="var(--primitive-green-800)" />
        <circle cx="38" cy="50" r="2" fill="var(--primitive-green-800)" />
      </g>

      {/* Ground shadow under people */}
      <ellipse cx="460" cy="425" rx="80" ry="10" fill="var(--primitive-green-300)" opacity="0.3" />
    </svg>
  );
}

/**
 * Template promo illustration for the "Create role templates" banner.
 * Shows a person checking off items on a checklist.
 */
export function RolesTemplatePromoIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 350"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Background blob */}
      <ellipse cx="200" cy="200" rx="180" ry="160" fill="var(--primitive-blue-100)" opacity="0.3" />

      {/* Person */}
      <g transform="translate(100, 50)">
        {/* Head */}
        <circle
          cx="60"
          cy="50"
          r="35"
          fill="var(--primitive-green-100)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2.5"
        />
        {/* Hair bun */}
        <circle cx="60" cy="20" r="18" fill="var(--primitive-green-800)" />
        <path
          d="M28 45 Q28 18, 60 15 Q92 18, 92 45 Q88 32, 75 25 Q60 18, 45 25 Q32 32, 28 45Z"
          fill="var(--primitive-green-800)"
        />
        {/* Eyes */}
        <circle cx="50" cy="50" r="2.5" fill="var(--primitive-green-800)" />
        <circle cx="70" cy="50" r="2.5" fill="var(--primitive-green-800)" />
        {/* Smile */}
        <path
          d="M50 60 Q60 68, 70 60"
          stroke="var(--primitive-green-700)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Body/shirt */}
        <path
          d="M30 85 Q25 130, 30 200 L90 200 Q95 130, 90 85 Q75 78, 60 78 Q45 78, 30 85Z"
          fill="var(--primitive-blue-200)"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
        />

        {/* Right arm extended (writing) */}
        <path
          d="M90 100 Q120 110, 150 100 Q165 95, 175 85"
          stroke="var(--primitive-green-800)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hand */}
        <circle
          cx="175"
          cy="85"
          r="8"
          fill="var(--primitive-orange-200)"
          stroke="var(--primitive-green-800)"
          strokeWidth="1.5"
        />

        {/* Pencil */}
        <rect
          x="170"
          y="60"
          width="6"
          height="35"
          rx="2"
          fill="var(--primitive-orange-400)"
          stroke="var(--primitive-green-800)"
          strokeWidth="1.5"
          transform="rotate(15, 173, 77)"
        />
        <path
          d="M167 57 L173 48 L179 57Z"
          fill="var(--primitive-red-400)"
          stroke="var(--primitive-green-800)"
          strokeWidth="1"
          transform="rotate(15, 173, 52)"
        />
      </g>

      {/* Checklist items */}
      <g transform="translate(240, 80)">
        {/* Checkbox 1 - checked */}
        <rect x="0" y="0" width="22" height="22" rx="4" fill="var(--primitive-blue-500)" />
        <path
          d="M5 11 L9 16 L17 6"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Line 1 */}
        <rect x="32" y="5" width="80" height="4" rx="2" fill="var(--primitive-green-800)" />
        <rect
          x="32"
          y="14"
          width="55"
          height="3"
          rx="1.5"
          fill="var(--primitive-green-800)"
          opacity="0.4"
        />

        {/* Checkbox 2 - checked */}
        <rect x="0" y="50" width="22" height="22" rx="4" fill="var(--primitive-blue-500)" />
        <path
          d="M5 61 L9 66 L17 56"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Line 2 */}
        <rect x="32" y="55" width="70" height="4" rx="2" fill="var(--primitive-green-800)" />
        <rect
          x="32"
          y="64"
          width="90"
          height="3"
          rx="1.5"
          fill="var(--primitive-green-800)"
          opacity="0.4"
        />

        {/* Checkbox 3 - unchecked */}
        <rect
          x="0"
          y="100"
          width="22"
          height="22"
          rx="4"
          fill="none"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
        />
        {/* Line 3 */}
        <rect
          x="32"
          y="105"
          width="60"
          height="4"
          rx="2"
          fill="var(--primitive-green-800)"
          opacity="0.5"
        />
        <rect
          x="32"
          y="114"
          width="75"
          height="3"
          rx="1.5"
          fill="var(--primitive-green-800)"
          opacity="0.3"
        />

        {/* Checkbox 4 - unchecked */}
        <rect
          x="0"
          y="150"
          width="22"
          height="22"
          rx="4"
          fill="none"
          stroke="var(--primitive-green-800)"
          strokeWidth="2"
        />
        {/* Line 4 */}
        <rect
          x="32"
          y="155"
          width="85"
          height="4"
          rx="2"
          fill="var(--primitive-green-800)"
          opacity="0.5"
        />
        <rect
          x="32"
          y="164"
          width="50"
          height="3"
          rx="1.5"
          fill="var(--primitive-green-800)"
          opacity="0.3"
        />
      </g>

      {/* Ground shadow */}
      <ellipse cx="200" cy="310" rx="130" ry="12" fill="var(--primitive-blue-200)" opacity="0.3" />
    </svg>
  );
}

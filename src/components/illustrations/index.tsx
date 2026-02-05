"use client";

/**
 * Shared Illustrations
 *
 * Reusable SVG illustrations for empty states and feature highlights.
 * All illustrations use design tokens (CSS variables) for dark mode compatibility.
 *
 * Profile-specific illustrations live in /src/components/profile/illustrations/.
 * This folder is for illustrations shared across multiple product areas.
 */

interface IllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Pipeline empty state illustration — person reading in an armchair under a lamp.
 * Used on the role detail page when no candidates have applied yet.
 */
export function PipelineEmptyIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 400 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Floor lamp */}
      <line
        x1="290"
        y1="40"
        x2="290"
        y2="320"
        stroke="var(--primitive-green-700)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Lamp arm */}
      <line
        x1="260"
        y1="40"
        x2="320"
        y2="40"
        stroke="var(--primitive-green-700)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Lamp base */}
      <line
        x1="270"
        y1="320"
        x2="310"
        y2="320"
        stroke="var(--primitive-green-700)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Lamp shade */}
      <path
        d="M260 40 L275 80 L305 80 L320 40Z"
        fill="var(--primitive-orange-200)"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
      />
      {/* Light glow */}
      <ellipse cx="290" cy="130" rx="60" ry="80" fill="var(--primitive-yellow-100)" opacity="0.4" />

      {/* Chair back */}
      <path
        d="M120 130 C120 90, 220 90, 230 130 L240 260 C240 270, 230 280, 220 280 L120 280 C110 280, 100 270, 100 260 Z"
        fill="var(--primitive-orange-300)"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
      />
      {/* Chair inner */}
      <path
        d="M130 150 C130 120, 210 120, 220 150 L225 250 C225 255, 220 260, 215 260 L130 260 C125 260, 120 255, 120 250 Z"
        fill="var(--primitive-orange-200)"
      />
      {/* Chair seat */}
      <ellipse
        cx="170"
        cy="260"
        rx="75"
        ry="20"
        fill="var(--primitive-orange-300)"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
      />
      {/* Chair legs */}
      <line
        x1="110"
        y1="275"
        x2="100"
        y2="320"
        stroke="var(--primitive-green-700)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="230"
        y1="275"
        x2="240"
        y2="320"
        stroke="var(--primitive-green-700)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Person — head */}
      <circle
        cx="195"
        cy="135"
        r="28"
        fill="var(--primitive-orange-200)"
        stroke="var(--primitive-green-700)"
        strokeWidth="2"
      />
      {/* Hair */}
      <path
        d="M168 130 C168 105, 222 105, 222 130 C222 115, 205 108, 195 108 C185 108, 168 115, 168 130Z"
        fill="var(--primitive-green-800)"
      />
      {/* Face — smile */}
      <path
        d="M186 145 Q195 152, 204 145"
        stroke="var(--primitive-green-700)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Eyes */}
      <circle cx="186" cy="136" r="2" fill="var(--primitive-green-800)" />
      <circle cx="204" cy="136" r="2" fill="var(--primitive-green-800)" />

      {/* Body / torso */}
      <path
        d="M180 163 C175 190, 165 220, 160 250"
        stroke="var(--primitive-green-700)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M210 163 C215 190, 220 220, 215 250"
        stroke="var(--primitive-green-700)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Shirt */}
      <path
        d="M180 163 C185 165, 205 165, 210 163 L215 195 C210 200, 185 200, 180 195 Z"
        fill="var(--primitive-neutral-200)"
        stroke="var(--primitive-green-700)"
        strokeWidth="1.5"
      />

      {/* Arms holding book */}
      <path
        d="M178 185 C165 195, 155 200, 150 205"
        stroke="var(--primitive-green-700)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M212 185 C225 195, 235 200, 240 205"
        stroke="var(--primitive-green-700)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Book */}
      <rect
        x="145"
        y="195"
        width="50"
        height="35"
        rx="3"
        fill="var(--primitive-red-500)"
        stroke="var(--primitive-green-700)"
        strokeWidth="1.5"
        transform="rotate(-10, 170, 212)"
      />
      {/* Book spine */}
      <line
        x1="170"
        y1="196"
        x2="167"
        y2="230"
        stroke="var(--primitive-green-700)"
        strokeWidth="1"
        transform="rotate(-10, 170, 212)"
      />

      {/* Legs */}
      <path
        d="M160 255 C155 280, 148 300, 140 315"
        stroke="var(--primitive-blue-500)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M215 255 C220 280, 230 300, 240 315"
        stroke="var(--primitive-blue-500)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Feet */}
      <ellipse cx="135" cy="318" rx="12" ry="6" fill="var(--primitive-green-800)" />
      <ellipse cx="245" cy="318" rx="12" ry="6" fill="var(--primitive-green-800)" />

      {/* Floor shadow */}
      <ellipse cx="190" cy="325" rx="110" ry="12" fill="var(--primitive-blue-200)" opacity="0.3" />
    </svg>
  );
}

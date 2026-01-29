"use client";

import React from "react";

interface CandidSymbolProps {
  className?: string;
  size?: number;
  color?: string;
}

export function CandidSymbol({
  className = "",
  size = 32,
  color = "#072924",
}: CandidSymbolProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M11.5211 0L11.5963 0.123572C15.9005 7.19555 23.5789 11.5142 31.8583 11.5199L32.003 11.52L26.1853 15.0602C22.649 17.2121 20.4895 21.0509 20.4866 25.1903L20.4819 32L20.4067 31.8764C16.1024 24.8044 8.42413 20.4858 0.144691 20.4801L0 20.48L5.81769 16.9398C9.354 14.7879 11.5135 10.9491 11.5164 6.80972L11.5211 0Z"
        fill={color}
      />
    </svg>
  );
}

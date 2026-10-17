'use client';

import React from 'react';

export type LogoStyle =
  | 'nozzle'
  | 'polestar'
  | 'diamond'
  | 'chevron'
  | 'delta'
  | 'square'
  | 'classic'
  | 'monoline'
  | 'stencil'
  | 'exponent';

interface BrandLogoProps {
  style?: LogoStyle;
  badgeText?: string;
  className?: string;
}

export function BrandLogo({
  style = 'classic',
  badgeText = 'sv7',
  className = '',
}: BrandLogoProps) {
  // 1. Classic Style (100% active fallback): High-contrast solid white square with bold text [sv7]
  if (style === 'classic') {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-white text-black font-archivo font-black text-xs tracking-tighter uppercase flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] shadow-sm shrink-0 ${className}`}
      >
        {badgeText}
      </div>
    );
  }

  // 2. Supersonic Nozzle: Two opposing aerodynamic chevrons creating a de Laval rocket nozzle throat in negative space
  if (style === 'nozzle') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Supersonic Nozzle"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          <g fill="#09090b">
            {/* Upper chevron pointing down */}
            <path d="M8 9 L18 13 L28 9 L28 12.5 L18 16.5 L8 12.5 Z" />
            {/* Lower chevron pointing up */}
            <path d="M8 27 L18 23 L28 27 L28 23.5 L18 19.5 L8 23.5 Z" />
          </g>
        </svg>
      </div>
    );
  }

  // 3. Polestar Guidance Star: Opposing 45° diagonal aerodynamic chevrons
  if (style === 'polestar') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Guidance Vector"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          <g fill="#09090b" transform="rotate(45 18 18)">
            <path d="M8 9 L18 13 L28 9 L28 12.5 L18 16.5 L8 12.5 Z" />
            <path d="M8 27 L18 23 L28 27 L28 23.5 L18 19.5 L8 23.5 Z" />
          </g>
        </svg>
      </div>
    );
  }

  // 4. Mach Diamond: Concentric precision diamond (Shock Diamond in supersonic exhaust / CAD datum target)
  if (style === 'diamond') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Mach Diamond"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          <g fill="#09090b" fillRule="evenodd">
            <path d="M18 7 L29 18 L18 29 L7 18 Z M18 11.5 L24.5 18 L18 24.5 L11.5 18 Z" />
            <rect x="15.5" y="15.5" width="5" height="5" rx="0.5" transform="rotate(45 18 18)" />
          </g>
        </svg>
      </div>
    );
  }

  // 5. Square CAD Datum: Direct Square-inspired concentric upright geometry
  if (style === 'square') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 CAD Datum"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:scale-105"
        >
          <g fill="#09090b" fillRule="evenodd">
            <path d="M8 8 H28 V28 H8 Z M11.5 11.5 H24.5 V24.5 H11.5 Z" />
            <rect x="14.5" y="14.5" width="7" height="7" rx="1.5" />
          </g>
        </svg>
      </div>
    );
  }

  // 6. Mach Delta Chevron ('chevron' or 'delta'): Single razor-sharp supersonic delta wing
  return (
    <div
      className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
      title="sv7 Delta Chevron"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path
          d="M18 7.5 L28.5 26 H22.5 L18 18.5 L13.5 26 H7.5 Z"
          fill="#09090b"
        />
      </svg>
    </div>
  );
}

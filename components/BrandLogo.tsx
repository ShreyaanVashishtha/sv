'use client';

import React from 'react';

export type LogoStyle = 'monoline' | 'stencil' | 'exponent' | 'delta' | 'classic';

interface BrandLogoProps {
  style?: LogoStyle;
  badgeText?: string;
  className?: string;
}

export function BrandLogo({
  style = 'monoline',
  badgeText = 'sv7',
  className = '',
}: BrandLogoProps) {
  // Fallback / Classic: original solid white square with bold monospace text
  if (style === 'classic') {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-white text-black font-archivo font-black text-xs tracking-tighter uppercase flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] shadow-sm shrink-0 ${className}`}
      >
        {badgeText}
      </div>
    );
  }

  // Concept B: Airframe Telemetry Stencil SV-7 (NASA / Rocket Airframe inspired)
  if (style === 'stencil') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Airframe Stencil"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:rotate-[1deg]"
        >
          <g fill="#09090b">
            {/* S with 45-deg airframe stencil cuts */}
            <path d="M6 10.5 H13 V13.5 H9 V15 H13 V23.5 H6 V20.5 H10 V19 H6 Z" />
            {/* V with precision chamfered apex */}
            <path d="M14.5 10.5 H18 L20.5 20 L23 10.5 H26.5 L22.5 23.5 H18.5 Z" />
            {/* 7 with aerodynamic diagonal */}
            <path d="M26.5 10.5 H33 L28 23.5 H24.5 L29 13.5 H26.5 Z" />
          </g>
        </svg>
      </div>
    );
  }

  // Concept C: Supersonic Exponent SV⁷ (Mach 7 / Orbital Velocity)
  if (style === 'exponent') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Supersonic Exponent"
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transition-transform duration-300 group-hover:rotate-[1deg]"
        >
          <g fill="#09090b">
            {/* S */}
            <path d="M5.5 12 H13.5 C14.3 12 15 12.7 15 13.5 V15.5 C15 16.3 14.3 17 13.5 17 H8.5 V21.5 H15 V24.5 H5.5 Z" />
            {/* V */}
            <path d="M16 12 H19.5 L22.5 21 L25.5 12 H29 L24.5 24.5 H20.5 Z" />
            {/* Elevated Supersonic Exponent 7 */}
            <path d="M24 7.5 H31 L27.5 15.5 H25 L27.8 9.8 H24 Z" />
          </g>
        </svg>
      </div>
    );
  }

  // Concept A (Default): Mach-7 Aerodynamic Monoline SV7
  // S, V, and 7 are 100% present, clear, and seamlessly interconnected.
  // The V and 7 share a unified ascending stroke resembling a supersonic airflow streamline.
  return (
    <div
      className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
      title="sv7 Aerodynamic Monogram"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
      >
        <g
          fill="none"
          stroke="#09090b"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* S: Clean aerodynamic curve */}
          <path d="M13 10.5 H8.5 C7.1 10.5 6 11.6 6 13 C6 14.4 7.1 15.5 8.5 15.5 H11 C12.4 15.5 13.5 16.6 13.5 18 C13.5 19.4 12.4 20.5 11 20.5 H6.5" />
          {/* V and 7: Interconnected supersonic flight path */}
          <path d="M14.5 11 L18.5 24.5 L22.5 11 H29.5 L24 24.5" />
        </g>
      </svg>
    </div>
  );
}

'use client';

import React from 'react';

interface BrandLogoProps {
  style?: 'delta' | 'classic';
  badgeText?: string;
  className?: string;
}

export function BrandLogo({
  style = 'delta',
  badgeText = 'sv7',
  className = '',
}: BrandLogoProps) {
  // Classic style: High-contrast solid white square with bold monospace brand text
  if (style === 'classic') {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-white text-black font-archivo font-black text-xs tracking-tighter uppercase flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] shadow-sm shrink-0 ${className}`}
      >
        {badgeText}
      </div>
    );
  }

  // Refined Concept 1: High-Contrast Supersonic Delta
  // Features a brilliant white squircle matching the original logo's contrast,
  // housing an ultra-sharp, laser-cut aerodynamic supersonic delta vector with an integrated '7'.
  return (
    <div
      className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
      title="sv7 Supersonic Delta"
    >
      {/* Precision Aerodynamic Supersonic Delta SV-7 Vector */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-transform duration-300 group-hover:rotate-[2deg]"
      >
        {/* Starboard Wing & Supersonic 7 Vector */}
        <path
          d="M17 5 L26.5 25 H20.5 L17 18 V5 Z"
          fill="#09090b"
        />

        {/* Port Wing & Swept Aerodynamic Fin */}
        <path
          d="M15 9 L5.5 25 H11.5 L15 18 V9 Z"
          fill="#09090b"
        />

        {/* Supersonic 7 Canard Crossbar */}
        <path
          d="M17 9 H23.5 L21.5 12.5 H17 V9 Z"
          fill="#09090b"
        />
      </svg>
    </div>
  );
}

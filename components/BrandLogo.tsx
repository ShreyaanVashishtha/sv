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
  // Classic fallback: original white square with black monospace text
  if (style === 'classic') {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-white text-black font-archivo font-black text-xs tracking-tighter uppercase flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] shadow-sm shrink-0 ${className}`}
      >
        {badgeText}
      </div>
    );
  }

  // Concept 1: "Supersonic Delta" (Aerospace aerodynamic precision mark)
  return (
    <div
      className={`relative w-9 h-9 rounded-xl bg-gradient-to-b from-zinc-800/90 to-zinc-950 border border-white/15 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/40 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:scale-[1.05] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
      title="sv7 Aerospace Vector Mark"
    >
      {/* Specular sheen sweep on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Supersonic Delta SV-7 SVG Vector */}
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white transition-transform duration-300 group-hover:rotate-[2deg]"
      >
        <defs>
          <linearGradient id="supersonicSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#E4E4E7" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>
          <linearGradient id="supersonicAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#71717A" />
          </linearGradient>
        </defs>

        {/* Left Winglet / S-V Vector */}
        <path
          d="M9 10.5 H16.2 L11.6 17.5 H17.8 L12.2 26 H7.5 L12.5 18.8 H7.8 Z"
          fill="url(#supersonicSilver)"
          className="transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Right Wing / Supersonic Delta 7 */}
        <path
          d="M18.8 10.5 H28.5 L19.2 26 H14.4 L23.2 14.2 H18.8 Z"
          fill="url(#supersonicSilver)"
          className="transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Subtle Mach-Cone Apex Vector Point */}
        <circle cx="18.5" cy="7.2" r="1.1" fill="url(#supersonicAccent)" />
      </svg>
    </div>
  );
}

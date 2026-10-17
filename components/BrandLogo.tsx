'use client';

import React from 'react';

export type LogoStyle =
  | 'nozzle'
  | 'nozzle-linear'
  | 'nozzle-bell'
  | 'nozzle-core'
  | 'nozzle-column'
  | 'polestar'
  | 'vector-polestar'
  | 'vector-kinetic'
  | 'vector-shock'
  | 'vector-monolith'
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

  // 1B. Parabolic Bell Nozzle (Rao expansion contour)
  if (style === 'nozzle-bell') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Parabolic Bell Nozzle"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b">
            <path d="M8 9.5 Q13 11 18 13.5 Q23 11 28 9.5 L28 12.5 Q23 14 18 16.5 Q13 14 8 12.5 Z"/>
            <path d="M8 26.5 Q13 25 18 22.5 Q23 25 28 26.5 L28 23.5 Q23 22 18 19.5 Q13 22 8 23.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // 1C. Injector Datum Core Nozzle
  if (style === 'nozzle-core') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Injector Datum Core"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b">
            <path d="M8 9 L18 13 L28 9 L28 12.5 L18 16.5 L8 12.5 Z"/>
            <path d="M8 27 L18 23 L28 27 L28 23.5 L18 19.5 L8 23.5 Z"/>
            <rect x="16.5" y="16.5" width="3" height="3" rx="0.5" transform="rotate(45 18 18)"/>
          </g>
        </svg>
      </div>
    );
  }

  // 1D. Vertical Thrust Column
  if (style === 'nozzle-column') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Vertical Thrust Column"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b">
            <path d="M9 27.5 L14 18 L9 8.5 L12.5 8.5 L17 18 L12.5 27.5 Z"/>
            <path d="M27 27.5 L22 18 L27 8.5 L23.5 8.5 L19 18 L23.5 27.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // 2A. Polestar Guidance Star
  if (style === 'polestar' || style === 'vector-polestar') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Polestar Guidance Star"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b" transform="rotate(45 18 18)">
            <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z"/>
            <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // 2B. Kinetic Forward Vector
  if (style === 'vector-kinetic') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Kinetic Forward Vector"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b">
            <path d="M7 7.5 L18 14 L29 7.5 L29 11 L18 17.5 L7 11 Z"/>
            <path d="M10 27.5 L18 23.5 L26 27.5 L26 24.5 L18 20.5 L10 24.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // 2C. Stratified Multi-Shock Wave
  if (style === 'vector-shock') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Multi-Shock Wave"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b">
            <path d="M7 8 L18 12.5 L29 8 L29 10.5 L18 15 L7 10.5 Z"/>
            <path d="M7 28 L18 23.5 L29 28 L29 25.5 L18 21 L7 25.5 Z"/>
            <path d="M11 14.5 L18 17 L25 14.5 L25 16 L18 18.5 L11 16 Z"/>
            <path d="M11 21.5 L18 19 L25 21.5 L25 20 L18 17.5 L11 20 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // 2D. Inverted Titanium Monolith
  if (style === 'vector-monolith') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Titanium Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z"/>
            <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // Diamond
  if (style === 'diamond') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Mach Diamond"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b" fillRule="evenodd">
            <path d="M18 7 L29 18 L18 29 L7 18 Z M18 11.5 L24.5 18 L18 24.5 L11.5 18 Z"/>
            <rect x="15.5" y="15.5" width="5" height="5" rx="0.5" transform="rotate(45 18 18)"/>
          </g>
        </svg>
      </div>
    );
  }

  // Square
  if (style === 'square') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 CAD Datum"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#09090b" fillRule="evenodd">
            <path d="M8 8 H28 V28 H8 Z M11.5 11.5 H24.5 V24.5 H11.5 Z"/>
            <rect x="14.5" y="14.5" width="7" height="7" rx="1.5"/>
          </g>
        </svg>
      </div>
    );
  }

  // Delta Chevron
  if (style === 'chevron' || style === 'delta') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Delta Chevron"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:-translate-y-0.5">
          <path d="M18 7.5 L28.5 26 H22.5 L18 18.5 L13.5 26 H7.5 Z" fill="#09090b"/>
        </svg>
      </div>
    );
  }

  // Default: Linear Razor Nozzle ('nozzle' or 'nozzle-linear')
  return (
    <div
      className={`relative w-9 h-9 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.25)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
      title="sv7 Razor Choke Nozzle"
    >
      <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
        <g fill="#09090b">
          <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z"/>
          <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z"/>
        </g>
      </svg>
    </div>
  );
}

'use client';

import React from 'react';

export type LogoStyle =
  | 'monolith-tri'
  | 'monolith-ribbon'
  | 'monolith-blueprint'
  | 'monolith-crest'
  | 'vector-monolith'
  | 'precision-monolith'
  | 'p1-standard'
  | 'p2-slim'
  | 'p3-chamfer'
  | 'p4-datum'
  | 'p5-bold'
  | 'p6-acute'
  | 'h1-hybrid'
  | 'h2-tapered'
  | 'h3-chamfered'
  | 'h4-knife'
  | 'h5-stealth'
  | 'h6-notch'
  | 'nozzle'
  | 'nozzle-linear'
  | 'nozzle-bell'
  | 'nozzle-core'
  | 'nozzle-column'
  | 'polestar'
  | 'vector-polestar'
  | 'vector-kinetic'
  | 'vector-shock'
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

  // M1. Monolith Stealth Tri-Vector (S upper chevron, N throat bridge, V lower chevron)
  if (style === 'monolith-tri') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Stealth Tri-Vector (S-N-V)"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff">
            <path d="M10 9 H18 L24 13.5 L24 16 L18 16 L14 13 L10 13 Z"/>
            <path d="M11 15 L14 15 L25 23 L22 23 Z"/>
            <path d="M12 27 L18 22.5 L24 27 L24 24 L18 19.5 L12 24 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // M2. Monolith Continuous Mach Ribbon
  if (style === 'monolith-ribbon') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Continuous Mach Ribbon (S-N-V)"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <path d="M10 9 H20 L15 14 H22 L22 17 L14 23 H21 L18 27.5 L12 27.5 L15 23 H8 L16 17 H9 L14 12 H10 Z" fill="#ffffff" fillRule="evenodd"/>
        </svg>
      </div>
    );
  }

  // M3. Monolith Laser Blueprint Superimposed
  if (style === 'monolith-blueprint') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Laser Blueprint (S-N-V)"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 9 L18 13.5 L28 9 L28 12.5 L18 17 L8 12.5 Z M12 10.5 H16 V11.5 H12 Z M20 14 H24 V15 H20 Z" fillRule="evenodd"/>
            <rect x="17.2" y="16.5" width="1.6" height="3" />
            <path d="M8 27 L18 22.5 L28 27 L28 23.5 L18 19 L8 23.5 Z M17.2 21 H18.8 V25 H17.2 Z" fillRule="evenodd"/>
          </g>
        </svg>
      </div>
    );
  }

  // M4. Monolith Coordinate Crest
  if (style === 'monolith-crest') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Coordinate Crest (S-N-V)"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff">
            <path d="M12 8.5 H21 L16 12.5 H24 L24 14.5 H15 L20 10.5 H12 Z"/>
            <path d="M10 16 H13.5 L22.5 21 H26 L26 16 H24 L24 19 L15 14 H10 Z"/>
            <path d="M11 25.5 L18 21.5 L25 25.5 L25 23 L18 19 L11 23 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // M0 / 2D. Inverted Titanium Monolith (Original pure baseline)
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

  // P1. Precision Monolith (Standard Baseline / High-DPI Retina Tune)
  if (style === 'precision-monolith' || style === 'p1-standard') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Precision Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 8.5 L18 13.5 L28 8.5 L28 12 L18 16.8 L8 12 Z"/>
            <path d="M8 27.5 L18 22.5 L28 27.5 L28 24 L18 19.2 L8 24 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // P2. The Slim Razor Spec (Slender 2.4px line weight)
  if (style === 'p2-slim') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Slim Razor Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 9.5 L18 14.2 L28 9.5 L28 12 L18 16.7 L8 12 Z"/>
            <path d="M8 26.5 L18 21.8 L28 26.5 L28 24 L18 19.3 L8 24 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // P3. Chamfered Wingtips (Machined 45° CAD chamfer)
  if (style === 'p3-chamfer') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Chamfered Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M9.5 8.5 L18 13 L26.5 8.5 L28 10 L18 16.8 L8 10 Z"/>
            <path d="M8 26 L18 19.2 L28 26 L26.5 27.5 L18 23 L9.5 27.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // P4. The Datum Core Reticle (Micro 2.2px origin diamond)
  if (style === 'p4-datum') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Datum Core Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 8.5 L18 13.5 L28 8.5 L28 12 L18 16.8 L8 12 Z"/>
            <path d="M8 27.5 L18 22.5 L28 27.5 L28 24 L18 19.2 L8 24 Z"/>
            <rect x="16.9" y="16.9" width="2.2" height="2.2" rx="0.4"/>
          </g>
        </svg>
      </div>
    );
  }

  // P5. The Heavy Thrust Spec (Bold 4.5px solid vector mass)
  if (style === 'p5-bold') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Heavy Thrust Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M7 7.5 L18 12.5 L29 7.5 L29 12 L18 16.7 L7 12 Z"/>
            <path d="M7 28.5 L18 23.5 L29 28.5 L29 24 L18 19.3 L7 24 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // P6. Hypersonic Delta Cone (Acute 60° sweep angle)
  if (style === 'p6-acute') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Hypersonic Monolith"
      >
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M9 7 L18 14.5 L27 7 L27 10 L18 17.2 L9 10 Z"/>
            <path d="M9 29 L18 21.5 L27 29 L27 26 L18 18.8 L9 26 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // H1. Hypersonic Heavy (The Direct Hybrid)
  if (style === 'h1-hybrid') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Hypersonic Heavy"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 7 L18 13.5 L28 7 L28 11.5 L18 17.2 L8 11.5 Z"/>
            <path d="M8 29 L18 22.5 L28 29 L28 24.5 L18 18.8 L8 24.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // H2. Tapered Mach Airfoil
  if (style === 'h2-tapered') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Tapered Mach Airfoil"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8.5 8.5 L18 12.8 L27.5 8.5 L27.5 10.8 L18 17.2 L8.5 10.8 Z"/>
            <path d="M8.5 27.5 L18 23.2 L27.5 27.5 L27.5 25.2 L18 18.8 L8.5 25.2 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // H3. Chamfered Hypersonic Wedge
  if (style === 'h3-chamfered') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Chamfered Hypersonic Wedge"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M9.5 7 L18 13 L26.5 7 L28 8.5 L18 17.2 L8 8.5 Z"/>
            <path d="M8 27.5 L18 18.8 L28 27.5 L26.5 29 L18 23 L9.5 29 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // H4. Razor Slit Compression
  if (style === 'h4-knife') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Razor Slit Compression"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 7.5 L18 13.5 L28 7.5 L28 12 L18 17.4 L8 12 Z"/>
            <path d="M8 28.5 L18 22.5 L28 28.5 L28 24 L18 18.6 L8 24 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // H5. Faceted Stealth Wedge
  if (style === 'h5-stealth') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Faceted Stealth Wedge"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 8 L13 11 L18 14 L23 11 L28 8 L28 12 L23 14.5 L18 17.2 L13 14.5 L8 12 Z"/>
            <path d="M8 28 L13 25 L18 22 L23 25 L28 28 L28 24 L23 21.5 L18 18.8 L13 21.5 L8 24 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // H6. Relief-Notched Choke
  if (style === 'h6-notch') {
    return (
      <div
        className={`relative w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.15)] group-hover:-translate-y-0.5 overflow-hidden shrink-0 ${className}`}
        title="sv7 Relief-Notched Choke"
      >
        <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-105">
          <g fill="#ffffff" transform="rotate(45 18 18)">
            <path d="M8 7 L18 13.5 L28 7 L28 11.5 L19 16.8 L17 16.8 L8 11.5 Z"/>
            <path d="M8 29 L18 22.5 L28 29 L28 24.5 L19 19.2 L17 19.2 L8 24.5 Z"/>
          </g>
        </svg>
      </div>
    );
  }

  // Parabolic Bell Nozzle
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

  // Injector Datum Core
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

  // Polestar Guidance Star
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

  // Kinetic Forward Vector
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

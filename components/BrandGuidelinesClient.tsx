'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Eye,
  Sliders,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Code,
  Terminal,
  Layers,
  Maximize2,
  Compass,
  FileCheck,
  ExternalLink,
} from 'lucide-react';

interface BrandGuidelinesClientProps {
  siteName?: string;
  brandTitle?: string;
}

export function BrandGuidelinesClient({
  siteName = 'sv7.dev',
  brandTitle = 'sv7.dev',
}: BrandGuidelinesClientProps) {
  // State for interactive inspector
  const [surfaceTheme, setSurfaceTheme] = useState<'dark' | 'blueprint' | 'light'>('dark');
  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  // Raw SVG Strings
  const rawVectorSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
  <g fill="#ffffff" transform="rotate(45 18 18)">
    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
  </g>
</svg>`;

  const rawBadgeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" width="36" height="36" fill="none">
  <rect width="36" height="36" rx="10" fill="#09090b" stroke="#3f3f46" stroke-width="1" />
  <g fill="#ffffff" transform="rotate(45 18 18)">
    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
  </g>
</svg>`;

  const reactComponentSnippet = `// components/BrandLogo.tsx
export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={\`w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm \${className}\`}>
      <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none">
        <g fill="#ffffff" transform="rotate(45 18 18)">
          <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
          <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
        </g>
      </svg>
    </div>
  );
}`;

  const downloadSvgFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const colors = [
    {
      name: 'Monolith Chassis',
      role: 'Primary Container Body',
      hex: '#09090b',
      rgb: 'rgb(9, 9, 11)',
      tailwind: 'bg-zinc-950',
      border: 'border-zinc-800',
    },
    {
      name: 'Titanium Border',
      role: 'Chassis Boundary (1px)',
      hex: '#3f3f46',
      rgb: 'rgb(63, 63, 70)',
      tailwind: 'border-zinc-700',
      border: 'border-zinc-600',
    },
    {
      name: 'Signal White',
      role: 'Vectors & 100% Contrast Fill',
      hex: '#ffffff',
      rgb: 'rgb(255, 255, 255)',
      tailwind: 'fill-white text-white',
      border: 'border-white/40',
    },
    {
      name: 'Mach Horizon Glow',
      role: 'Interactive Hover State',
      hex: 'rgba(255,255,255,0.15)',
      rgb: 'rgba(255, 255, 255, 0.15)',
      tailwind: 'shadow-[0_0_18px_rgba(255,255,255,0.15)]',
      border: 'border-white/20',
    },
    {
      name: 'Deep Canvas Void',
      role: 'Global Background Surface',
      hex: '#050505',
      rgb: 'rgb(5, 5, 5)',
      tailwind: 'bg-[#050505]',
      border: 'border-zinc-900',
    },
    {
      name: 'Telemetry Slate',
      role: 'Secondary Type & Annotations',
      hex: '#71717a',
      rgb: 'rgb(113, 113, 122)',
      tailwind: 'text-zinc-500',
      border: 'border-zinc-700',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Document Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-zinc-900 border border-zinc-700 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Specification v2.4 • Active
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 bg-white/[0.02] border border-white/5">
            Zero-Letter Engineering Identity
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Brand Guidelines &amp; Visual System
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
          The definitive geometric architecture, mathematical specifications, CAD drafting tolerances, and usage standards for the <strong className="text-white">sv7.dev</strong> brand identity.
        </p>
      </section>

      {/* Hero Showcase / Interactive HUD Inspector */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
                01
              </span>
              <span>The Primary Mark: Monolith TC-1</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Tapered Airfoil × Chamfered Wedge synthesis inside dark titanium chassis.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme switcher */}
            <div className="flex items-center p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setSurfaceTheme('dark')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  surfaceTheme === 'dark'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Obsidian
              </button>
              <button
                onClick={() => setSurfaceTheme('blueprint')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  surfaceTheme === 'blueprint'
                    ? 'bg-blue-950 text-blue-200 border border-blue-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                CAD Blueprint
              </button>
              <button
                onClick={() => setSurfaceTheme('light')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  surfaceTheme === 'light'
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Chalk
              </button>
            </div>

            {/* HUD Toggle */}
            <button
              onClick={() => setShowHUD(!showHUD)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                showHUD
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>CAD HUD: {showHUD ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* The Big Stage */}
        <div
          className={`relative rounded-3xl p-8 sm:p-14 border transition-all duration-300 flex flex-col items-center justify-center min-h-[420px] overflow-hidden ${
            surfaceTheme === 'dark'
              ? 'bg-zinc-950/90 border-zinc-800'
              : surfaceTheme === 'blueprint'
              ? 'bg-[#030914] border-blue-900/50'
              : 'bg-zinc-100 border-zinc-300'
          }`}
        >
          {/* Background Grid Pattern */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              surfaceTheme === 'light'
                ? 'opacity-30 [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]'
                : surfaceTheme === 'blueprint'
                ? 'opacity-40 [background-image:linear-gradient(to_right,#1e3a8a_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a_1px,transparent_1px)] [background-size:24px_24px]'
                : 'opacity-20 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:24px_24px]'
            }`}
          />

          {/* HUD Dimensions Overlay */}
          {showHUD && (
            <div className="absolute inset-0 pointer-events-none p-6 font-mono text-[10px] text-zinc-500 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-zinc-400">DATUM: X:18.00 Y:18.00</span>
                <span className="text-emerald-400 font-semibold">ROTATION: +45.00° FLUSH</span>
              </div>
              <div className="flex justify-between items-end">
                <span>SCALE: 1:1 VECTOR COORD</span>
                <span className="text-zinc-400">CHOKE GAP: 1.80px • APEX: 4.20px</span>
              </div>
            </div>
          )}

          {/* The Monolith Mark in Stage */}
          <div className="relative group cursor-crosshair z-10 flex flex-col items-center">
            {/* Center crosshairs if HUD enabled */}
            {showHUD && (
              <div className="absolute inset-0 -m-8 pointer-events-none flex items-center justify-center">
                <div className="w-full h-px bg-emerald-500/25" />
                <div className="h-full w-px bg-emerald-500/25 absolute" />
                <div className="w-56 h-56 rounded-full border border-dashed border-emerald-500/20 absolute" />
              </div>
            )}

            {/* The Badge Container */}
            <div
              className={`w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-6 sm:p-7 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-105 ${
                surfaceTheme === 'light'
                  ? 'bg-zinc-950 border-2 border-zinc-700 shadow-zinc-400/50'
                  : 'bg-zinc-950 border-2 border-zinc-700 shadow-black/80 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.18)]'
              }`}
            >
              <svg
                viewBox="0 0 36 36"
                width="100%"
                height="100%"
                fill="none"
                className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              >
                <g fill="#ffffff" transform="rotate(45 18 18)">
                  {/* Top chevron airfoil */}
                  <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                  {/* Bottom chevron airfoil */}
                  <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                </g>
              </svg>
            </div>

            {/* Wordmark Lockup Preview below badge */}
            <div className="mt-6 flex items-center gap-3">
              <span
                className={`font-bold text-xl sm:text-2xl tracking-tight transition-colors ${
                  surfaceTheme === 'light' ? 'text-zinc-900' : 'text-white'
                }`}
              >
                {brandTitle}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                AERO • CAD
              </span>
            </div>
          </div>

          {/* Quick Action Overlay inside Stage */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 z-10">
            <button
              onClick={() => copyToClipboard(rawVectorSvg, 'rawSvg')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900/90 text-white border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-500 transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copiedKey === 'rawSvg' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Vector SVG</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Vector SVG</span>
                </>
              )}
            </button>

            <button
              onClick={() => downloadSvgFile(rawBadgeSvg, 'sv7-monolith-badge.svg')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Monolith Badge (.svg)</span>
            </button>

            <button
              onClick={() => downloadSvgFile(rawVectorSvg, 'sv7-vectors-only.svg')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download Vectors Only</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 02: The Zero-Letter Philosophy & Aerodynamic Ethos */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            02
          </span>
          <span>Core Design Philosophy: The Zero-Letter Directive</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Pure Physical Mechanics</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The mark avoids distorted alphanumeric characters (S, N, V, 7). Instead, it communicates engineering mastery through physical aerospace concepts: De Laval throat compression, supersonic shock diamond convergence, and aerodynamic chord curvature.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Polestar-Inspired Duality</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Two opposing chevrons mirror each other across an acute central datum. Like opposing vector thrusters, they maintain equilibrium and visual tension, drawing the gaze into the high-velocity choke throat.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">CNC Machined Chamfers</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sharp knife-edge corners create structural stress risers. The 45° corner chamfers relieve edge fragility. When tilted at the badge's 45° angle, the chamfers rotate into perfectly flush horizontal and vertical bounds.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: CAD Drafting & Mathematical Grid */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            03
          </span>
          <span>Geometric Anatomy &amp; CAD Tolerances</span>
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Vector Blueprint Visualizer */}
            <div className="bg-black/60 rounded-xl p-6 border border-zinc-800 flex flex-col items-center justify-center relative font-mono text-[11px]">
              <div className="w-48 h-48 relative border border-dashed border-zinc-700/60 rounded-2xl flex items-center justify-center p-4">
                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px bg-zinc-800" />
                  <div className="h-full w-px bg-zinc-800 absolute" />
                </div>

                {/* Vector SVG */}
                <svg viewBox="0 0 36 36" width="100%" height="100%" fill="none" className="relative z-10">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>

                {/* Dimension annotations */}
                <span className="absolute top-1 left-2 text-[10px] text-zinc-500">36x36 Grid</span>
                <span className="absolute bottom-1 right-2 text-[10px] text-emerald-400">rotate(45 18 18)</span>
              </div>
            </div>

            {/* Dimension Breakdown Table */}
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Coordinate Grid</span>
                <span className="text-white font-semibold">36.00 × 36.00 units</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Chassis Dimensions</span>
                <span className="text-white font-semibold">36px container, rx: 12px (rounded-xl)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Apex Chord Thickness</span>
                <span className="text-emerald-400 font-semibold">4.20px (Maximum throat mass)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Wingtip Thickness</span>
                <span className="text-cyan-400 font-semibold">2.20px (Aerodynamic taper)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">Throat Choke Clearance</span>
                <span className="text-amber-400 font-semibold">1.80px gap at (18, 18)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-zinc-400">CNC Chamfer Cut</span>
                <span className="text-white font-semibold">1.50px bevel @ 45° (Flush bounds)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Optical Scaling Matrix */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            04
          </span>
          <span>Optical Scaling Matrix (16px to 180px)</span>
        </h2>
        <p className="text-xs text-zinc-400">
          The TC-1 Balanced Master is micro-calibrated to preserve vector contrast without choking or bleeding at any screen scale.
        </p>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-end text-center">
          {/* 16px Favicon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="w-4 h-4 rounded-[4px] bg-zinc-950 border border-zinc-700 p-0.5 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">16 × 16</span>
              <span className="text-zinc-500 text-[10px]">Browser Favicon</span>
            </div>
          </div>

          {/* 24px Mobile */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="w-6 h-6 rounded-md bg-zinc-950 border border-zinc-700 p-1 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">24 × 24</span>
              <span className="text-zinc-500 text-[10px]">Mobile Bar</span>
            </div>
          </div>

          {/* 36px Navbar Standard */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-zinc-700 p-1.5 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="font-mono text-xs">
              <span className="text-emerald-400 font-bold block">36 × 36</span>
              <span className="text-zinc-500 text-[10px]">Header Standard</span>
            </div>
          </div>

          {/* 48px Card */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-700 p-2 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">48 × 48</span>
              <span className="text-zinc-500 text-[10px]">Badge Card</span>
            </div>
          </div>

          {/* 96px Dock */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-zinc-950 border border-zinc-700 p-3.5 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">96 × 96</span>
              <span className="text-zinc-500 text-[10px]">App Icon</span>
            </div>
          </div>

          {/* 180px Apple Touch */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <div className="w-24 h-24 rounded-2xl bg-zinc-950 border-2 border-zinc-700 p-4 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>
            </div>
            <div className="font-mono text-xs">
              <span className="text-cyan-400 font-bold block">180 × 180</span>
              <span className="text-zinc-500 text-[10px]">Apple Touch Icon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Official Color Architecture */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            05
          </span>
          <span>Official Color Architecture</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Click any color block to immediately copy its hexadecimal code to your clipboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((c) => (
            <div
              key={c.hex}
              onClick={() => copyToClipboard(c.hex, c.hex)}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 rounded-xl border ${c.border} flex items-center justify-center shadow-inner`}
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-mono text-xs text-zinc-500 group-hover:text-white transition-colors flex items-center gap-1">
                  {copiedKey === c.hex ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                <span className="text-[11px] text-zinc-500 block">{c.role}</span>
              </div>

              <div className="pt-2 border-t border-zinc-900 font-mono text-[11px] text-zinc-400 space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-zinc-600">HEX</span>
                  <span className="text-white font-bold">{c.hex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600">RGB</span>
                  <span>{c.rgb}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 06: Typography & Wordmark Pairing */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            06
          </span>
          <span>Typography &amp; Wordmark Lockup</span>
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          {/* Live Lockup */}
          <div className="p-8 rounded-xl bg-black/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-700 p-2 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
                  <g fill="#ffffff" transform="rotate(45 18 18)">
                    <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                    <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                  </g>
                </svg>
              </div>

              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block">
                  {brandTitle}
                </span>
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block">
                  Aerospace Engineering • HKUST
                </span>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-zinc-500 hidden sm:block">
              <span>Standard Horizontal Lockup</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-white font-bold">Primary Logotype: Inter / SF Pro Display</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Weight: 600 Semi-Bold / 700 Bold<br />
                Tracking: -0.02em (-0.5px)<br />
                Alignment: Center-line aligned with Monolith horizontal datum.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-white font-bold">Technical Telemetry: JetBrains Mono</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Weight: 400 Regular / 500 Medium<br />
                Tracking: +0.05em to +0.1em uppercase<br />
                Usage: CAD dimensions, coordinates, metadata badges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 07: Strict Do's & Don'ts */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            07
          </span>
          <span>Brand Integrity: Strict Do&apos;s &amp; Don&apos;ts</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO Cards */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Approved Usage (DO)</span>
            </h3>

            <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Maintain 1:1 Aspect Ratio:</strong> Always enclose the vectors within the square titanium chassis (<code className="text-emerald-300">bg-zinc-950 border-zinc-700</code>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Flush Chamfer Orientation:</strong> The 45° rotation is mathematically aligned so that the wingtip chamfers sit completely horizontal and vertical with the badge bounds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>High Contrast Fill:</strong> Use 100% Signal White (<code className="text-emerald-300">#ffffff</code>) vectors against the obsidian background.
                </span>
              </li>
            </ul>
          </div>

          {/* DONT Cards */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
            <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Prohibited Misuse (DON&apos;T)</span>
            </h3>

            <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>
                  <strong>NEVER Superimpose Letters:</strong> Absolutely do not morph, engrave, or draw alphanumeric letterforms (S, N, V, 7) into the vector geometry.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>
                  <strong>NEVER Distort or Skew:</strong> Do not stretch, skew, or rotate the inner vectors independently of the badge coordinate system.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>
                  <strong>NEVER Apply Low-Contrast Gradients:</strong> Do not apply rainbow gradients, dropshadows, or 3D bevel beveling that soften the sharp CNC edges.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 08: Developer Integration Snippets */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            08
          </span>
          <span>Developer Integration &amp; Source Code</span>
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-zinc-400 flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              React / Next.js Component (TypeScript)
            </span>
            <button
              onClick={() => copyToClipboard(reactComponentSnippet, 'component')}
              className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'component' ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Copied Component
                </span>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-black/80 border border-zinc-800 overflow-x-auto text-[11px] font-mono text-zinc-300 leading-relaxed">
            {reactComponentSnippet}
          </pre>
        </div>
      </section>

      {/* Back to Home CTA */}
      <section className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-white text-base block">sv7.dev Engineering Identity</span>
          <span className="text-xs text-zinc-500">
            Engineered by Shreyaan Vashishtha • Hong Kong University of Science and Technology
          </span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-colors shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portfolio</span>
        </Link>
      </section>
    </div>
  );
}

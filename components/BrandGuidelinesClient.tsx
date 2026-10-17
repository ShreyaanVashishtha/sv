'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Eye,
  Layers,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Code,
  Maximize2,
  FileText,
  Sun,
  Moon,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

interface BrandGuidelinesClientProps {
  siteName?: string;
  brandTitle?: string;
}

export function BrandGuidelinesClient({
  siteName = 'sv7.dev',
  brandTitle = 'sv7.dev',
}: BrandGuidelinesClientProps) {
  const [surfaceTheme, setSurfaceTheme] = useState<'dark' | 'light'>('dark');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

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
import React from 'react';

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
      name: 'Primary Dark',
      role: 'Background & Primary Badge Container',
      hex: '#09090b',
      rgb: 'rgb(9, 9, 11)',
      tailwind: 'bg-zinc-950',
      border: 'border-zinc-800',
    },
    {
      name: 'Card Surface',
      role: 'Elevated Cards & Section Panels',
      hex: '#121215',
      rgb: 'rgb(18, 18, 21)',
      tailwind: 'bg-zinc-900',
      border: 'border-zinc-800',
    },
    {
      name: 'Border Subtle',
      role: 'Dividers & Container Outlines',
      hex: '#27272a',
      rgb: 'rgb(39, 39, 42)',
      tailwind: 'border-zinc-800',
      border: 'border-zinc-700',
    },
    {
      name: 'Titanium Border',
      role: 'Badge Stroke & Interactive Borders',
      hex: '#3f3f46',
      rgb: 'rgb(63, 63, 70)',
      tailwind: 'border-zinc-700',
      border: 'border-zinc-600',
    },
    {
      name: 'Pure White',
      role: 'Primary Mark & High-Contrast Typography',
      hex: '#ffffff',
      rgb: 'rgb(255, 255, 255)',
      tailwind: 'fill-white text-white',
      border: 'border-white/40',
    },
    {
      name: 'Muted Text',
      role: 'Body Copy & Supporting Metadata',
      hex: '#a1a1aa',
      rgb: 'rgb(161, 161, 170)',
      tailwind: 'text-zinc-400',
      border: 'border-zinc-700',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-700 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official Identity
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-zinc-400 bg-white/[0.03] border border-white/5">
            Minimal Geometric System
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Brand Guidelines
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-3xl leading-relaxed">
          The visual identity, logomark specifications, clearspace rules, color palette, and asset downloads for <strong className="text-white">sv7.dev</strong>.
        </p>
      </section>

      {/* Section 01: The Primary Mark */}
      <section className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
                01
              </span>
              <span>The Primary Mark</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Dual opposing chevrons enclosed within a dark square container.
            </p>
          </div>

          {/* Theme switcher */}
          <div className="flex items-center p-1 bg-zinc-900/90 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setSurfaceTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                surfaceTheme === 'dark'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setSurfaceTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                surfaceTheme === 'light'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Light</span>
            </button>
          </div>
        </div>

        {/* Clean Stage */}
        <div
          className={`relative rounded-3xl p-8 sm:p-14 border transition-all duration-300 flex flex-col items-center justify-center min-h-[380px] overflow-hidden ${
            surfaceTheme === 'dark'
              ? 'bg-zinc-950/80 border-zinc-800 shadow-2xl'
              : 'bg-zinc-100 border-zinc-300 shadow-inner'
          }`}
        >
          {/* Subtle background grid pattern */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              surfaceTheme === 'light'
                ? 'opacity-25 [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:32px_32px]'
                : 'opacity-15 [background-image:linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] [background-size:32px_32px]'
            }`}
          />

          {/* Centered Mark Presentation */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* The Badge Container */}
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-3xl p-6 sm:p-7 flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer ${
                surfaceTheme === 'light'
                  ? 'bg-zinc-950 border-2 border-zinc-700 shadow-zinc-400/50'
                  : 'bg-zinc-950 border-2 border-zinc-700 shadow-black/80 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)]'
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
                  <path d="M9.5 7.5 L18 13.0 L26.5 7.5 L28 9.0 L18 17.2 L8 9.0 Z" />
                  <path d="M8 27.0 L18 18.8 L28 27.0 L26.5 28.5 L18 23.0 L9.5 28.5 Z" />
                </g>
              </svg>
            </div>

            {/* Wordmark Lockup Preview below badge */}
            <div className="mt-8 flex items-center gap-3">
              <span
                className={`font-bold text-2xl tracking-tight transition-colors ${
                  surfaceTheme === 'light' ? 'text-zinc-900' : 'text-white'
                }`}
              >
                {brandTitle}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
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
              onClick={() => downloadSvgFile(rawBadgeSvg, 'sv7-badge.svg')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-white text-zinc-950 hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Badge (.svg)</span>
            </button>

            <button
              onClick={() => downloadSvgFile(rawVectorSvg, 'sv7-symbol.svg')}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium bg-zinc-900/90 text-zinc-300 border border-zinc-800 hover:text-white hover:border-zinc-700 transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span>Download Symbol (.svg)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 02: Design Principles */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            02
          </span>
          <span>Design Principles</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Pure Geometric Form</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The identity avoids distorted letterforms or alphanumeric monograms. It relies on clean geometric vectors, symmetry, and negative space to create a timeless mark.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Contrast &amp; Balance</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Two mirrored chevrons meet at an exact central gap, producing dynamic balance. The thick center tapers smoothly outward, maintaining visual weight and harmony.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-sm">Universal Legibility</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Engineered to perform cleanly across all display contexts, from a 16px browser tab favicon to billboard-scale outdoor signage.
            </p>
          </div>
        </div>
      </section>

      {/* Section 03: Clearspace & Proportions */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            03
          </span>
          <span>Clearspace &amp; Proportions</span>
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Visual representation */}
            <div className="bg-black/60 rounded-xl p-8 border border-zinc-800 flex flex-col items-center justify-center relative font-mono text-[11px]">
              <div className="relative border border-dashed border-zinc-700 p-8 rounded-2xl flex items-center justify-center">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                  0.5X Clearspace
                </span>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                  0.5X Clearspace
                </span>
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 -rotate-90 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                  0.5X
                </span>
                <span className="absolute -right-3 top-1/2 -translate-y-1/2 rotate-90 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
                  0.5X
                </span>

                <BrandLogo style="tc1-balanced" className="w-16 h-16 rounded-2xl" />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
              <p>
                To maintain the integrity and visual impact of the mark, always ensure an adequate margin of clearspace surrounding the logo.
              </p>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-400">Minimum Clearspace</span>
                  <span className="text-white font-semibold">0.5X (Half the mark&apos;s height)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-400">Aspect Ratio</span>
                  <span className="text-white font-semibold">1:1 (Always square)</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-400">Minimum Digital Size</span>
                  <span className="text-white font-semibold">16 × 16 px</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-zinc-400">Header Standard Size</span>
                  <span className="text-white font-semibold">36 × 36 px (w-9 h-9)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Size Scale */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            04
          </span>
          <span>Optical Scale (16px to 180px)</span>
        </h2>
        <p className="text-xs text-zinc-400">
          The mark remains sharp, balanced, and instantly recognizable at all standard display dimensions.
        </p>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-end text-center">
          {/* 16px Favicon */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <BrandLogo style="tc1-balanced" className="w-4 h-4 rounded-[4px] p-0.5" />
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">16 × 16</span>
              <span className="text-zinc-500 text-[10px]">Browser Favicon</span>
            </div>
          </div>

          {/* 24px Mobile */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <BrandLogo style="tc1-balanced" className="w-6 h-6 rounded-md p-1" />
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">24 × 24</span>
              <span className="text-zinc-500 text-[10px]">Mobile Bar</span>
            </div>
          </div>

          {/* 36px Navbar Standard */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <BrandLogo style="tc1-balanced" className="w-9 h-9 rounded-xl p-1.5" />
            </div>
            <div className="font-mono text-xs">
              <span className="text-emerald-400 font-bold block">36 × 36</span>
              <span className="text-zinc-500 text-[10px]">Header Standard</span>
            </div>
          </div>

          {/* 48px Card */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <BrandLogo style="tc1-balanced" className="w-12 h-12 rounded-xl p-2" />
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">48 × 48</span>
              <span className="text-zinc-500 text-[10px]">UI Cards</span>
            </div>
          </div>

          {/* 96px Dock */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <BrandLogo style="tc1-balanced" className="w-20 h-20 rounded-2xl p-3.5" />
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">96 × 96</span>
              <span className="text-zinc-500 text-[10px]">App Icon</span>
            </div>
          </div>

          {/* 180px Apple Touch */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-28 h-28 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <BrandLogo style="tc1-balanced" className="w-24 h-24 rounded-2xl p-4" />
            </div>
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">180 × 180</span>
              <span className="text-zinc-500 text-[10px]">Apple Touch</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 05: Color Palette */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            05
          </span>
          <span>Color Palette</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Click any color block to copy its hexadecimal value.
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

      {/* Section 06: Typography */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            06
          </span>
          <span>Typography &amp; Wordmark</span>
        </h2>

        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
          {/* Live Lockup */}
          <div className="p-8 rounded-xl bg-black/60 border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <BrandLogo style="tc1-balanced" className="w-12 h-12 rounded-xl p-2" />
              <div>
                <span className="font-bold text-2xl tracking-tight text-white block">
                  {brandTitle}
                </span>
                <span className="text-xs text-zinc-400 block">
                  Engineering &amp; Design Portfolio
                </span>
              </div>
            </div>

            <div className="text-right text-xs font-mono text-zinc-500 hidden sm:block">
              <span>Primary Brand Lockup</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-white font-bold">Primary Font: Inter / SF Pro Display</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Weights: 600 Semi-Bold (Headings), 400 Regular (Body)<br />
                Tracking: -0.02em for headings, normal for body copy.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h4 className="text-white font-bold">Monospace: SF Mono / JetBrains Mono</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Weights: 400 Regular, 500 Medium<br />
                Usage: Code blocks, metadata tags, numeric specifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 07: Dos and Don'ts */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            07
          </span>
          <span>Brand Rules: Do&apos;s &amp; Don&apos;ts</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DO Cards */}
          <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-4">
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Recommended Usage (DO)</span>
            </h3>

            <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Maintain Aspect Ratio:</strong> Always display the mark with a 1:1 square ratio.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Preserve Clearspace:</strong> Keep sufficient margin around the badge so it is never crowded by text or UI borders.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>High Contrast:</strong> Render in pure white on dark surfaces, or pure black on light surfaces.
                </span>
              </li>
            </ul>
          </div>

          {/* DONT Cards */}
          <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-4">
            <h3 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Unapproved Usage (DON&apos;T)</span>
            </h3>

            <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>
                  <strong>Do Not Superimpose Letters:</strong> Never attempt to force letters (S, N, V, 7) into the symbol.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>
                  <strong>Do Not Distort or Skew:</strong> Never stretch, skew, or rotate the symbol away from its calibrated orientation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>
                  <strong>Do Not Add Gradients or 3D Effects:</strong> Keep the mark clean, flat, and vector-pure without glows or bevels.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 08: Code Snippet */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
            08
          </span>
          <span>Developer Integration</span>
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

      {/* Footer Return */}
      <section className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-white text-base block">{brandTitle} Visual System</span>
          <span className="text-xs text-zinc-500">
            Shreyaan Vashishtha • All rights reserved
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

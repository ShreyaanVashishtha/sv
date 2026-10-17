'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Home,
  Camera,
  Cpu,
  Mail,
  RefreshCw,
  AlertTriangle,
  Terminal,
  ArrowRight,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface NotFoundContentProps {
  siteName: string;
}

export function NotFoundContent({ siteName }: NotFoundContentProps) {
  const [attemptedPath, setAttemptedPath] = useState('');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAttemptedPath(window.location.pathname + window.location.search);
      const timer = setTimeout(() => setIsScanning(false), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCopyDebug = () => {
    if (typeof window === 'undefined') return;
    const debugText = `[404_ERROR_REPORT]\nHost: ${window.location.host}\nPath: ${window.location.pathname}\nTimestamp: ${new Date().toISOString()}\nUserAgent: ${navigator.userAgent}`;
    navigator.clipboard.writeText(debugText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const quickVectors = [
    {
      label: 'Home Base',
      href: '/',
      desc: 'Return to primary portfolio & command interface',
      icon: Home,
      highlight: true,
    },
    {
      label: 'Visual Archive',
      href: '/photography',
      desc: 'Aerospace photography & 60fps motion reels (@sv.snap)',
      icon: Camera,
      highlight: false,
    },
    {
      label: 'Engineering Projects',
      href: '/#projects',
      desc: 'Rocketry airframes, robotics CAD, and simulations',
      icon: Cpu,
      highlight: false,
    },
    {
      label: 'Direct Contact',
      href: '/#contact',
      desc: 'Transmit a message to Shreyaan Vashishtha',
      icon: Mail,
      highlight: false,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6 flex flex-col items-center text-center relative z-10">
      {/* Top Status Header */}
      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest mb-6 animate-pulse">
        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
        <span>Telemetry Alert // ERR_ROUTE_NOT_FOUND</span>
      </div>

      {/* Hero 404 Headline */}
      <div className="relative mb-6 select-none">
        {/* Ambient Backlight Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none -z-10" />

        <h1 className="text-8xl sm:text-9xl md:text-[140px] font-black font-archivo tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 leading-none">
          404
        </h1>
        <div className="text-xs sm:text-sm font-mono tracking-widest uppercase text-zinc-400 mt-2 font-semibold flex items-center justify-center gap-2">
          <span>Orbital Trajectory Lost</span>
          <span className="text-zinc-600">•</span>
          <span>Vector Unreachable</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm sm:text-base text-zinc-400 max-w-lg mb-8 leading-relaxed">
        The coordinate vector you requested does not exist in the active telemetry matrix. It may have decayed from orbit, been relocated, or never launched.
      </p>

      {/* Terminal Diagnostic Card */}
      <div className="w-full max-w-xl text-left bg-zinc-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 font-mono text-xs shadow-2xl backdrop-blur-xl mb-10 overflow-hidden relative">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-zinc-500 text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-300 font-semibold">diagnostics.terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-red-400 uppercase text-[10px]">Disconnected</span>
          </div>
        </div>

        <div className="space-y-1.5 text-zinc-400 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-zinc-600 select-none">&gt;</span>
            <span>
              TARGET_VECTOR:{' '}
              <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono break-all">
                {attemptedPath || '/unresolved_path'}
              </strong>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-600 select-none">&gt;</span>
            <span>
              STATUS:{' '}
              {isScanning ? (
                <span className="text-amber-400 inline-flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> SCANNING SECTOR...
                </span>
              ) : (
                <span className="text-red-400">404 NOT_FOUND (STATUS_TERMINATED)</span>
              )}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-zinc-600 select-none">&gt;</span>
            <span className="text-zinc-400">
              RECOVERY_ACTION:{' '}
              <span className="text-emerald-400 font-semibold">
                EXECUTE_RETURN_TO_BASE
              </span>
            </span>
          </div>
        </div>

        {/* Copy Diagnostic Button */}
        <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-zinc-600">sv7.dev :: telemetry monitor</span>
          <button
            onClick={handleCopyDebug}
            type="button"
            className="inline-flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>Copy Diagnostics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Trajectories / Quick Links */}
      <div className="w-full max-w-2xl mb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 text-left">
          Available Recovery Trajectories
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickVectors.map((v) => {
            const Icon = v.icon;
            return (
              <Link
                key={v.href}
                href={v.href}
                className={`p-4 rounded-2xl border transition-all text-left flex items-start gap-3.5 group ${
                  v.highlight
                    ? 'bg-white text-black border-white shadow-lg shadow-white/10 hover:bg-zinc-200'
                    : 'bg-zinc-950/60 border-white/10 hover:border-white/25 text-white hover:bg-zinc-900/60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    v.highlight
                      ? 'bg-black text-white'
                      : 'bg-white/10 text-white group-hover:scale-105 transition-transform'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`text-xs font-bold flex items-center justify-between ${
                      v.highlight ? 'text-black' : 'text-white'
                    }`}
                  >
                    <span>{v.label}</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                        v.highlight ? 'text-black/60' : 'text-zinc-500'
                      }`}
                    />
                  </div>
                  <p
                    className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${
                      v.highlight ? 'text-zinc-700' : 'text-zinc-400'
                    }`}
                  >
                    {v.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Return to Top Button */}
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono font-semibold border border-white/10 hover:border-white/20 transition-all shadow-md group"
        >
          <Compass className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
          <span>Recalibrate &amp; Return to Home</span>
          <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

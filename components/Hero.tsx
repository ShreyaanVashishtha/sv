'use client';

import React, { useState } from 'react';
import { Profile, Social, HeroSettings, ContactSettings } from '@/types/content';
import {
  ArrowDown,
  Check,
  Copy,
  Github,
  Twitter,
  Linkedin,
  Mail,
  FileDown,
  ArrowUpRight,
} from 'lucide-react';

interface HeroProps {
  profile: Profile;
  socials: Social[];
  showMetrics?: boolean;
  cvUrl?: string;
  heroSettings?: HeroSettings;
  contactSettings?: ContactSettings;
}

export function Hero({
  profile,
  socials,
  showMetrics = true,
  cvUrl,
  heroSettings,
  contactSettings,
}: HeroProps) {
  const [copied, setCopied] = useState(false);

  const hideRawEmail = contactSettings?.hideEmailAddress !== false;
  const displayEmail = contactSettings?.publicDisplayEmail || 'contact@sv7.dev';

  const copyEmail = () => {
    navigator.clipboard.writeText(displayEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderSocialIcon = (icon: string) => {
    const lower = (icon || '').toLowerCase();
    if (lower.includes('git')) return <Github className="w-4 h-4" />;
    if (lower.includes('twit') || lower.includes('x')) return <Twitter className="w-4 h-4" />;
    if (lower.includes('link')) return <Linkedin className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  const statusPrefix = heroSettings?.statusBadgePrefix || (profile.status?.available ? 'Status' : 'Notice');
  const exploreText = heroSettings?.exploreButtonText || 'Explore Work';
  const exploreHref = heroSettings?.exploreButtonHref || '#projects';
  const copyText = heroSettings?.copyEmailText || (hideRawEmail ? 'Copy Contact Address' : 'Copy email');
  const showAvatar = heroSettings?.showAvatar && (heroSettings.avatarUrl || profile.avatar);
  const avatarSrc = heroSettings?.avatarUrl || profile.avatar;

  const validMetrics = (profile.metrics || []).filter(
    (m) => m && m.label && m.value !== undefined && m.value !== ''
  );

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-mesh">
      {/* Subtle backdrop lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Availability Badge */}
        {profile.status && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs text-zinc-300 mb-8 backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${profile.status.available ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${profile.status.available ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-400">
              {statusPrefix}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="font-medium text-zinc-200">{profile.status.text}</span>
          </div>
        )}

        {/* Hero Title & Optional Avatar */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 mb-4">
          {showAvatar && (
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl shrink-0">
              <img
                src={avatarSrc}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 font-mono text-xs border border-white/5">
                /{profile.handle || 'sv7'}
              </span>
            </div>

            <p className="text-xl md:text-2xl font-light text-zinc-300 leading-relaxed tracking-tight">
              {profile.title}
            </p>

            <p className="text-base md:text-lg text-zinc-400 leading-relaxed font-normal pt-2">
              {profile.tagline}
            </p>
          </div>
        </div>

        {/* Action Buttons & Social Links */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={exploreHref}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-all shadow-glow hover:scale-[1.02]"
          >
            <span>{exploreText}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center gap-2 bg-zinc-900 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all hover:bg-zinc-800/80"
            >
              <FileDown className="w-4 h-4 text-zinc-400" />
              <span>Download CV</span>
            </a>
          )}

          {hideRawEmail ? (
            <a
              href="#contact"
              className="flex items-center gap-2 bg-zinc-900 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all hover:bg-zinc-800/80"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Direct Dispatch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
            </a>
          ) : (
            <button
              onClick={copyEmail}
              className="flex items-center gap-2 bg-zinc-900 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all hover:bg-zinc-800/80"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-mono text-xs">Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>{copyText}</span>
                </>
              )}
            </button>
          )}

          {/* Social icons pills */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            {(socials || []).map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.url.startsWith('#') ? '_self' : '_blank'}
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 hover:bg-zinc-800 transition-all"
                title={social.name}
              >
                {renderSocialIcon(social.icon || social.name)}
              </a>
            ))}
          </div>
        </div>

        {/* High-level metrics row */}
        {showMetrics && validMetrics.length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {validMetrics.map((metric, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-zinc-900/30 border border-white/5 backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-bold tracking-tight text-white font-mono">
                  {metric.value}
                </div>
                <div className="text-xs text-zinc-400 font-medium mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

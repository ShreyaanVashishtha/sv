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

  // Avoid duplicating contact link in socials if Direct Dispatch button is already visible
  const cleanSocials = (socials || []).filter((s) => {
    if (hideRawEmail && (s.url === '#contact' || s.name.toLowerCase().includes('dispatch'))) {
      return false;
    }
    return true;
  });

  return (
    <section className="relative pt-32 pb-10 md:pt-36 md:pb-12 overflow-hidden bg-mesh">
      {/* Subtle ambient lighting drift */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-white/[0.03] blur-[130px] rounded-full pointer-events-none animate-ambient-drift" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Availability Badge (Hidden by default, toggleable in admin) */}
        {Boolean(heroSettings?.showStatusBadge) && profile.status && profile.status.text && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs text-zinc-300 mb-8 backdrop-blur-md shadow-sm animate-hero-fade">
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
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl shrink-0 animate-hero-fade">
              <img
                src={avatarSrc}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          )}

          <div className="space-y-4 max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 animate-hero-fade delay-100">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                {profile.name}
              </h1>
              {Boolean(profile.handle && profile.handle.trim()) && (
                <span className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-400 font-mono text-xs border border-white/5 transition-colors hover:border-white/15">
                  /{profile.handle.replace(/^\//, '')}
                </span>
              )}
            </div>

            {profile.title && (
              <p className="text-xl sm:text-2xl font-light text-zinc-300 leading-snug tracking-tight animate-hero-fade delay-200">
                {profile.title}
              </p>
            )}

            {profile.tagline && (
              <p className="text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed font-normal pt-1 max-w-2xl animate-hero-fade delay-300">
                {profile.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons & Social Links */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 animate-hero-fade delay-400">
          <a
            href={exploreHref}
            className="group flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-zinc-200 transition-all shadow-glow hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{exploreText}</span>
            <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>

          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
              download
              className="group flex items-center gap-2 bg-zinc-900/90 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all hover:bg-zinc-800/80 active:scale-[0.98]"
            >
              <FileDown className="w-4 h-4 text-zinc-400 transition-transform duration-300 group-hover:translate-y-0.5" />
              <span>Download CV</span>
            </a>
          )}

          {hideRawEmail ? (
            <a
              href="#contact"
              className="group flex items-center gap-2 bg-zinc-900/90 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all hover:bg-zinc-800/80 active:scale-[0.98]"
            >
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>Direct Dispatch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </a>
          ) : (
            <button
              onClick={copyEmail}
              className="group flex items-center gap-2 bg-zinc-900/90 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-white/10 hover:border-white/20 transition-all hover:bg-zinc-800/80 active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-mono text-xs">Copied to clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400 transition-transform duration-300 group-hover:scale-110" />
                  <span>{copyText}</span>
                </>
              )}
            </button>
          )}

          {/* Social icons pills */}
          {cleanSocials.length > 0 && (
            <div className="flex items-center gap-2 pl-1 sm:pl-3 sm:border-l border-white/10">
              {cleanSocials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith('#') ? '_self' : '_blank'}
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all duration-200"
                  title={social.name}
                >
                  {renderSocialIcon(social.icon || social.name)}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* High-level metrics / focus credentials bar */}
        {showMetrics && validMetrics.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/5 animate-hero-fade delay-500">
            <div className="flex flex-wrap items-center gap-3">
              {validMetrics.map((metric, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-white/25 hover:bg-zinc-850 hover:-translate-y-0.5 backdrop-blur-md transition-all duration-200 shadow-sm"
                >
                  <span className="text-sm font-semibold text-white tracking-tight">
                    {metric.value}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  <span className="text-xs text-zinc-400 font-medium">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

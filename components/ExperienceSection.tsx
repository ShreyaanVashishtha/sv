'use client';

import React from 'react';
import { ExperienceItem } from '@/types/content';
import { Briefcase, CheckCircle2 } from 'lucide-react';

interface ExperienceSectionProps {
  experience?: ExperienceItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function ExperienceSection({
  experience = [],
  eyebrow = 'Track Record',
  title = 'Experience & Milestones',
  subtitle,
}: ExperienceSectionProps) {
  const safeExperience = Array.isArray(experience) ? experience : [];

  if (safeExperience.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 border-t border-white/5 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <Briefcase className="w-4 h-4 text-white" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-12">
          {safeExperience.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline marker node */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-zinc-900 border-2 border-zinc-400 group-hover:border-white transition-colors" />

              <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {item.role}
                    </h3>
                    <p className="text-sm font-medium text-zinc-400">
                      {item.company}
                    </p>
                  </div>
                  {item.period && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-zinc-400 bg-zinc-800/60 border border-white/5 self-start sm:self-center">
                      {item.period}
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t border-white/5">
                    {item.highlights
                      .filter((h) => h && h.trim())
                      .map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

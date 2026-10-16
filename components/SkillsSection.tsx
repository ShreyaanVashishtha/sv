'use client';

import React from 'react';
import { SkillCategory } from '@/types/content';
import { Cpu, Layers, Terminal, Database } from 'lucide-react';

interface SkillsSectionProps {
  skills?: SkillCategory[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function SkillsSection({
  skills = [],
  eyebrow = 'Core Capabilities',
  title = 'Engineering Stack & Disciplines',
  subtitle = 'Selected technologies, protocols, and architectural patterns deployed in production environments.',
}: SkillsSectionProps) {
  const safeSkills = Array.isArray(skills) ? skills : [];

  if (safeSkills.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    const lower = (category || '').toLowerCase();
    if (lower.includes('lang')) return <Terminal className="w-4 h-4 text-sky-400" />;
    if (lower.includes('front') || lower.includes('ux')) return <Layers className="w-4 h-4 text-purple-400" />;
    if (lower.includes('back') || lower.includes('cloud')) return <Database className="w-4 h-4 text-emerald-400" />;
    return <Cpu className="w-4 h-4 text-zinc-300" />;
  };

  return (
    <section id="skills" className="py-24 border-t border-white/5 relative bg-zinc-950/40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <Cpu className="w-4 h-4 text-white" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {safeSkills.map((categoryGroup, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-zinc-900/30 border border-white/10 hover:border-white/25 hover:-translate-y-1 hover:shadow-card-subtle transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/5">
                {getCategoryIcon(categoryGroup.category)}
                <h3 className="font-semibold text-white tracking-tight text-base">
                  {categoryGroup.category}
                </h3>
              </div>

              {Array.isArray(categoryGroup.items) && categoryGroup.items.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categoryGroup.items.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/5 text-xs text-zinc-300 hover:text-white hover:border-white/20 hover:bg-zinc-800 hover:scale-[1.03] active:scale-95 transition-all duration-200"
                    >
                      <span className="font-medium">{skill.name}</span>
                      {skill.level && (
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

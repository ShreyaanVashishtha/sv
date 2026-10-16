'use client';

import React from 'react';
import { EducationItem, CertificationItem } from '@/types/content';
import { GraduationCap, Award, CheckCircle2, Calendar, MapPin } from 'lucide-react';

interface EducationSectionProps {
  education?: EducationItem[];
  certifications?: CertificationItem[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  certificationsEyebrow?: string;
  certificationsTitle?: string;
}

export function EducationSection({
  education = [],
  certifications = [],
  eyebrow = 'Academic Background',
  title = 'Education & Honors',
  subtitle = 'Undergraduate aerospace studies, International Baccalaureate diploma, and certified proficiencies.',
  certificationsEyebrow = 'Standardized Credentials',
  certificationsTitle = 'Standardized Exams & Certifications',
}: EducationSectionProps) {
  const safeEducation = Array.isArray(education) ? education : [];
  const safeCertifications = Array.isArray(certifications) ? certifications : [];

  if (safeEducation.length === 0 && safeCertifications.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-24 border-t border-white/5 relative bg-zinc-950/30">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <GraduationCap className="w-4 h-4 text-white" />
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

        {/* Education Cards */}
        {safeEducation.length > 0 && (
          <div className="space-y-6 mb-16">
            {safeEducation.map((item) => (
              <div
                key={item.id}
                className="p-6 md:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-white/25 hover:-translate-y-1 hover:shadow-card-subtle transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {item.degree}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400 mt-1">
                      <span className="font-semibold text-zinc-200">{item.institution}</span>
                      {item.location && (
                        <span className="flex items-center gap-1 text-xs text-zinc-500">
                          <MapPin className="w-3 h-3" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {item.score && item.score.trim() !== '' && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                        {item.score}
                      </span>
                    )}
                    {item.period && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-zinc-400 bg-zinc-800/60 border border-white/5">
                        <Calendar className="w-3 h-3" />
                        {item.period}
                      </span>
                    )}
                  </div>
                </div>

                {Array.isArray(item.highlights) && item.highlights.length > 0 && (
                  <ul className="space-y-2 pt-3 border-t border-white/5">
                    {item.highlights
                      .filter((h) => h && h.trim())
                      .map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications & Exams Row */}
        {safeCertifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-6">
              <Award className="w-4 h-4 text-white" />
              <span>{certificationsTitle}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {safeCertifications.map((cert) => (
                <div
                  key={cert.id}
                  className="p-5 rounded-2xl bg-zinc-900/30 border border-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-card-subtle transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 block mb-1">
                      {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-1.5">
                      {cert.title}
                    </h4>
                    {cert.details && (
                      <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                        {cert.details}
                      </p>
                    )}
                  </div>

                  {cert.score && cert.score.trim() !== '' && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500 font-medium">Result</span>
                      <span className="text-xs font-bold text-white font-mono bg-zinc-800 px-2 py-0.5 rounded">
                        {cert.score}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

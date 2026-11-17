'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/types/content';
import { ExternalLink, Github, Sparkles, FolderGit2, X, Box, ArrowRight } from 'lucide-react';

interface ProjectsSectionProps {
  projects?: Project[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
}

export function ProjectsSection({
  projects = [],
  eyebrow = 'Selected Works',
  title = 'Featured Projects & Systems',
  subtitle,
}: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Lock body scroll and listen for Escape key when project modal is open
  useEffect(() => {
    if (!activeModalProject) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalProject(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModalProject]);

  const safeProjects = Array.isArray(projects) ? projects : [];

  // Extract unique categories safely
  const rawCategories = safeProjects
    .map((p) => p.category)
    .filter((cat): cat is string => Boolean(cat && cat.trim()));
  const categories = ['All', ...Array.from(new Set(rawCategories))];

  const filteredProjects =
    selectedCategory === 'All'
      ? safeProjects
      : safeProjects.filter((p) => p.category === selectedCategory);

  if (safeProjects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="pt-10 pb-20 md:pt-14 md:pb-24 border-t border-white/5 relative">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <FolderGit2 className="w-4 h-4 text-white" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Category Filter Pills (Only shown when there are more than 3 projects across distinct categories) */}
        {safeProjects.length > 3 && categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === 'All'
                  ? safeProjects.length
                  : safeProjects.filter(
                      (p) => (p.category || '').toLowerCase() === cat.toLowerCase()
                    ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-sm scale-[1.02]'
                      : 'bg-zinc-900/80 text-zinc-400 border border-white/10 hover:text-white hover:border-white/20 hover:bg-zinc-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-black/15 text-black font-bold'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveModalProject(project)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalProject(project);
                }
              }}
              className="group relative rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-white/25 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <div>
                {/* Project Visual Image Banner */}
                {project.imageUrl && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-950 border-b border-white/5">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent pointer-events-none" />

                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="text-[11px] font-mono text-zinc-300 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                        {project.category || 'General'}
                      </span>

                      {project.featured && (
                        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-400/15 backdrop-blur-md border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Featured</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-6 sm:p-7">
                  {!project.imageUrl && (
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <span className="text-xs font-mono text-zinc-300 px-3 py-1 rounded-full bg-zinc-800/80 border border-white/10">
                        {project.category || 'General'}
                      </span>

                      {project.featured && (
                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Featured
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white group-hover:text-zinc-200 transition-colors mb-2 tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 mb-6">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 sm:px-7 sm:pb-7">
                {/* Tags */}
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono text-zinc-400 bg-zinc-800/40 px-2 py-0.5 rounded border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer links */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs">
                  <span className="text-zinc-400 group-hover:text-white transition-colors flex items-center gap-1 font-medium">
                    <span>Architecture &amp; Specs</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Source Code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.demoUrl && (
                      project.demoUrl.startsWith('/') ? (
                        <Link
                          href={project.demoUrl}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Interactive 3D CAD Lab"
                        >
                          <Box className="w-4 h-4 text-cyan-400" />
                        </Link>
                      ) : (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="External Project Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for In-Depth Project View */}
      {activeModalProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModalProject(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="relative w-full max-w-2xl bg-zinc-900 border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl text-left max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-5 right-5 z-10 p-2 rounded-full text-zinc-400 hover:text-white bg-black/60 hover:bg-white/10 backdrop-blur-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {activeModalProject.imageUrl && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-950 mb-6 border border-white/10 shadow-lg">
                <img
                  src={activeModalProject.imageUrl}
                  alt={activeModalProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <span>{activeModalProject.category || 'General'}</span>
              {activeModalProject.featured && (
                <>
                  <span>•</span>
                  <span className="text-amber-300">Featured System</span>
                </>
              )}
            </div>

            <h3 id="project-modal-title" className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
              {activeModalProject.title}
            </h3>

            <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6 font-sans">
              {activeModalProject.description}
            </p>

            {activeModalProject.longDescription && (
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 mb-6 text-xs md:text-sm text-zinc-300 leading-relaxed font-mono whitespace-pre-line space-y-2">
                <span className="text-white font-semibold block mb-2 font-sans text-xs uppercase tracking-wider text-zinc-400">
                  Architecture &amp; Engineering Notes:
                </span>
                {activeModalProject.longDescription}
              </div>
            )}

            {Array.isArray(activeModalProject.tags) && activeModalProject.tags.length > 0 && (
              <div className="space-y-3 mb-8">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                  Technologies &amp; Disciplines
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono text-white bg-zinc-800/80 px-3 py-1 rounded-lg border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              {activeModalProject.demoUrl && (
                activeModalProject.demoUrl.startsWith('/') ? (
                  <Link
                    href={activeModalProject.demoUrl}
                    className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    <Box className="w-4 h-4" />
                    <span>Launch Interactive 3D CAD Lab</span>
                  </Link>
                ) : (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-sm"
                  >
                    <span>
                      {activeModalProject.demoUrl.includes('linkedin.com')
                        ? 'View on LinkedIn'
                        : 'Launch External Link'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )
              )}
              {activeModalProject.githubUrl && (
                <a
                  href={activeModalProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-zinc-800 text-zinc-200 px-4 py-2.5 rounded-xl text-xs font-medium hover:bg-zinc-700 transition-colors border border-white/10"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

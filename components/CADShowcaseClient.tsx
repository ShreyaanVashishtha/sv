'use client';

import React, { useState } from 'react';
import { CADModelItem, CADSettings } from '@/types/content';
import { CADModelViewer } from '@/components/CADModelViewer';
import {
  Box,
  Layers,
  Cpu,
  FileDown,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Maximize2,
  Sliders,
} from 'lucide-react';

interface CADShowcaseClientProps {
  initialModels: CADModelItem[];
  cadSettings?: CADSettings;
}

export function CADShowcaseClient({ initialModels, cadSettings }: CADShowcaseClientProps) {
  const visibleModels = initialModels.filter((m) => !m.hidden);
  const [activeModelId, setActiveModelId] = useState<string>(
    visibleModels.find((m) => m.featured)?.id || visibleModels[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    ...Array.from(new Set(visibleModels.map((m) => m.category).filter(Boolean))),
  ];

  const filteredModels =
    selectedCategory === 'All'
      ? visibleModels
      : visibleModels.filter((m) => m.category === selectedCategory);

  const activeModel =
    visibleModels.find((m) => m.id === activeModelId) || visibleModels[0] || null;

  if (!activeModel) {
    return (
      <div className="text-center py-24 text-zinc-500 font-mono text-sm">
        No 3D CAD models published yet. Add models in the Admin Studio.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Main Split Stage: 3D Viewport (Left 7) + Engineering HUD (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Interactive 3D Canvas Container */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <CADModelViewer
            key={activeModel.id}
            model={activeModel}
            wireframeDefault={cadSettings?.wireframeDefault}
            className="w-full"
          />

          {/* Quick Caption Under Viewport */}
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <strong className="text-white">{activeModel.title}</strong>
            </span>
            <span className="text-zinc-500 text-[11px]">
              Tolerances: <span className="text-zinc-300">{activeModel.tolerances || '±0.05 mm'}</span>
            </span>
          </div>
        </div>

        {/* Engineering Specifications Panel */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header */}
          <div className="space-y-2 pb-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono uppercase tracking-wider">
                {activeModel.category || 'Mechanical CAD'}
              </span>
              {activeModel.featured && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono uppercase">
                  Featured Assembly
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
              {activeModel.title}
            </h2>

            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              {activeModel.description}
            </p>
          </div>

          {/* Technical Specifications Matrix */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              Engineering Parameters
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">CAD Software</span>
                <span className="text-white font-semibold flex items-center gap-1.5 truncate">
                  <Box className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{activeModel.cadSoftware || 'SolidWorks 2024'}</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">Material</span>
                <span className="text-white font-semibold flex items-center gap-1.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">{activeModel.material || '6061-T6 Aluminum'}</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">Manufacturing</span>
                <span className="text-white font-semibold flex items-center gap-1.5 truncate">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{activeModel.manufacturing || '5-Axis CNC Milling'}</span>
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase block">Machining Tolerance</span>
                <span className="text-white font-semibold flex items-center gap-1.5 truncate">
                  <Activity className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{activeModel.tolerances || '±0.05 mm'}</span>
                </span>
              </div>

              {activeModel.mass && (
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">Calculated Mass</span>
                  <span className="text-white font-semibold">{activeModel.mass}</span>
                </div>
              )}

              {activeModel.dimensions && (
                <div className="p-3 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase block">Envelope Dim</span>
                  <span className="text-white font-semibold truncate">{activeModel.dimensions}</span>
                </div>
              )}

              {activeModel.printablesUrl && (
                <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/25 space-y-1 col-span-2">
                  <div className="flex items-center justify-between text-[10px] text-orange-400 uppercase font-mono">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fa6400] animate-pulse" />
                      <span>Printables 3D Model Repository</span>
                    </span>
                    <span className="text-zinc-400">Available</span>
                  </div>
                  <a
                    href={activeModel.printablesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-orange-300 font-semibold flex items-center justify-between transition-colors pt-0.5 text-xs"
                  >
                    <span className="truncate">Download 3D Printing Files &amp; G-Code</span>
                    <ExternalLink className="w-3.5 h-3.5 text-orange-400 shrink-0 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action / Download Section */}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {activeModel.printablesUrl ? (
              <>
                <a
                  href={activeModel.printablesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#fa6400] to-[#e05800] hover:from-[#e05800] hover:to-[#c44c00] text-white font-semibold text-xs transition-all shadow-lg shadow-orange-500/20 active:scale-98 group"
                >
                  <span className="w-5 h-5 rounded-md bg-black/25 flex items-center justify-center font-black text-xs">
                    P
                  </span>
                  <span>Download on Printables</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {activeModel.downloadUrl && (
                  <a
                    href={activeModel.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white font-medium text-xs transition-all shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Direct CAD File (STEP / STL)</span>
                  </a>
                )}
              </>
            ) : activeModel.downloadUrl ? (
              <a
                href={activeModel.downloadUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all shadow-md active:scale-98"
              >
                <FileDown className="w-4 h-4" />
                <span>Download CAD File (STEP / STL)</span>
              </a>
            ) : (
              <div className="space-y-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Proprietary Astrix / Research Model</span>
                  </span>
                  <a
                    href="/#contact"
                    className="text-white hover:underline flex items-center gap-1 font-sans text-xs"
                  >
                    <span>Request File</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </div>

                {cadSettings?.printablesProfileUrl && (
                  <a
                    href={cadSettings.printablesProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-orange-500/30 text-[11px] font-mono text-zinc-400 hover:text-white transition-all"
                  >
                    <span className="text-[#fa6400] font-bold">Printables:</span>
                    <span>Browse Full Maker Profile</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Carousel / Selector Bar */}
      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" />
            <span>Select 3D Assembly ({filteredModels.length})</span>
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            Click any assembly to load in 3D viewport
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((m) => {
            const isSelected = m.id === activeModel.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModelId(m.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-zinc-950/60 border-white/10 hover:border-white/25 hover:bg-zinc-900/60'
                }`}
              >
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                      {m.category || 'CAD Model'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {m.printablesUrl && (
                        <span className="text-[9px] font-mono font-bold text-[#fa6400] bg-orange-500/10 border border-orange-500/20 px-1.5 py-0.5 rounded">
                          Printables
                        </span>
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>Active Viewport</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {m.title}
                  </h4>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500 w-full">
                  <span>{m.cadSoftware || 'SolidWorks'}</span>
                  <span>{m.material || 'Aluminum'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

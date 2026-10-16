'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  PhotoItem,
  PhotographySettings,
  Profile,
  Social,
  SiteSettings,
} from '@/types/content';
import {
  Camera,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Share2,
  Check,
  SlidersHorizontal,
  Compass,
  MapPin,
  Sparkles,
  Search,
  Grid,
  Layers,
  Info,
  Maximize2,
} from 'lucide-react';

interface PhotographyGalleryProps {
  photos: PhotoItem[];
  settings?: PhotographySettings;
  profile: Profile;
  socials: Social[];
  siteSettings: SiteSettings;
}

export function PhotographyGallery({
  photos: initialPhotos,
  settings,
  profile,
  socials,
  siteSettings,
}: PhotographyGalleryProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos || []);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showExifDrawer, setShowExifDrawer] = useState(true);

  const categories = useMemo(() => {
    const fromSettings = settings?.categories || [];
    const fromPhotos = Array.from(
      new Set(photos.map((p) => p.category).filter(Boolean))
    ) as string[];
    const combined = Array.from(new Set(['All', ...fromSettings, ...fromPhotos]));
    return combined;
  }, [settings, photos]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (photo.category || '').toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (photo.title || '').toLowerCase().includes(q) ||
        (photo.description || '').toLowerCase().includes(q) ||
        (photo.category || '').toLowerCase().includes(q) ||
        (photo.location || '').toLowerCase().includes(q) ||
        (photo.camera || '').toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [photos, selectedCategory, searchQuery]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const activePhoto =
    activePhotoIndex !== null && filteredPhotos[activePhotoIndex]
      ? filteredPhotos[activePhotoIndex]
      : null;

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : 0
    );
  };

  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        : 0
    );
  };

  const handleCopyLink = (photo: PhotoItem) => {
    const url = photo.url || window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const pexelsUrl =
    settings?.pexelsProfileUrl ||
    (settings?.pexelsUsername
      ? `https://www.pexels.com/@${settings.pexelsUsername.replace(/^@/, '')}`
      : 'https://www.pexels.com/@shreyaan-vashishtha');

  return (
    <div className="min-h-screen bg-zinc-950 text-foreground selection:bg-white selection:text-black pt-28 pb-20">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        {/* HERO HEADER */}
        <div className="space-y-6 pt-4 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                Pexels Verified Gallery • Visual Archive
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={pexelsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
              >
                <span>View on Pexels</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>

              <Link
                href="/admin"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs font-mono text-zinc-400 hover:text-white transition-all"
              >
                <span>Sync / Curate</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {settings?.title || 'Visual Archive'}
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {settings?.subtitle ||
                'Aerospace perspectives, mechanical forms, and terrestrial observations through the lens.'}
            </p>
          </div>

          {settings?.bio && (
            <p className="text-xs sm:text-sm text-zinc-400/90 leading-relaxed max-w-2xl font-sans pt-1">
              {settings.bio}
            </p>
          )}

          {/* METRIC CHIPS */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-zinc-400">Total Frames:</span>
              <span className="font-mono font-bold text-white">{photos.length}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">Sensor:</span>
              <span className="font-mono text-white">Sony Full-Frame • 35mm</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">Hub:</span>
              <span className="text-white">Hong Kong &amp; Global Spaceports</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR: FILTER PILLS & SEARCH */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? photos.length
                    : photos.filter(
                        (p) => (p.category || '').toLowerCase() === cat.toLowerCase()
                      ).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-white text-black font-semibold shadow-sm scale-[1.02]'
                        : 'bg-zinc-900/80 text-zinc-400 border border-white/10 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-zinc-200 text-zinc-900 font-bold'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search camera, location..."
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PHOTO GRID / MASONRY */}
        {photos.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-zinc-900/40 border border-white/10 space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Collection Linked: <span className="font-mono text-emerald-400">portfolio-je8myyb</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your Pexels collection is linked! Because Pexels protects collection endpoints with API authentication, you just need to provide your free Pexels API key (in Vercel or in the Admin Studio) to pull your 27 photographs.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all shadow-sm"
              >
                <span>Open Admin &amp; Sync Collection</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://www.pexels.com/collections/portfolio-je8myyb/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <span>View Collection on Pexels</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
              <a
                href="https://www.pexels.com/api/new"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/60 border border-white/10 text-xs text-zinc-400 hover:text-white transition-all"
              >
                <span>Get Free API Key ↗</span>
              </a>
            </div>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-zinc-900/30 border border-white/10 space-y-4">
            <Camera className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No photographs matched your filter</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try choosing another category or clearing your search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, idx) => {
              const displaySrc =
                photo.src?.large2x || photo.src?.large || photo.src?.original;

              return (
                <div
                  key={photo.id || idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer transition-all duration-300 hover:border-white/30 hover:shadow-xl hover:shadow-black/50"
                >
                  {/* Photo Image */}
                  <div className="relative overflow-hidden w-full bg-zinc-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displaySrc}
                      alt={photo.title || 'Photograph'}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5" />

                    {/* Top Badges (Category & Camera) */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-white font-medium">
                        {photo.category || 'Capture'}
                      </span>

                      {photo.camera && (
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
                          <Camera className="w-2.5 h-2.5 text-sky-400" />
                          <span>{photo.camera}</span>
                        </span>
                      )}
                    </div>

                    {/* Bottom Content on Hover */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-1.5">
                      <h3 className="text-sm font-bold text-white tracking-tight line-clamp-1">
                        {photo.title}
                      </h3>

                      {photo.location && (
                        <div className="flex items-center gap-1 text-[11px] text-zinc-300 font-sans line-clamp-1">
                          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{photo.location}</span>
                        </div>
                      )}

                      {/* EXIF Setting Pill */}
                      {(photo.aperture || photo.shutterSpeed || photo.iso) && (
                        <div className="text-[10px] font-mono text-zinc-400 pt-0.5">
                          {[photo.focalLength, photo.aperture, photo.shutterSpeed, photo.iso ? `ISO ${photo.iso}` : null]
                            .filter(Boolean)
                            .join(' • ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* BOTTOM ATTRIBUTION STRIP */}
        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            Captured &amp; Curated by{' '}
            <span className="text-zinc-300 font-sans font-medium">{profile.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={pexelsUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>Verified Pexels Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <Link href="/" className="hover:text-white transition-colors">
              Portfolio Home &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6"
        >
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-xs text-zinc-400 z-10 pb-2">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold font-mono">
                {activePhotoIndex! + 1} / {filteredPhotos.length}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-sans font-medium line-clamp-1 max-w-[200px] sm:max-w-md">
                {activePhoto.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowExifDrawer(!showExifDrawer)}
                className={`p-2 rounded-full border transition-all ${
                  showExifDrawer
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-900 text-zinc-300 border-white/10 hover:text-white'
                }`}
                title="Toggle EXIF Camera Info"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink(activePhoto)}
                className="p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                title="Copy Photo Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              {activePhoto.url && (
                <a
                  href={activePhoto.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                  title="View on Pexels"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setActivePhotoIndex(null)}
                className="p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-all ml-2"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Visual Stage */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-2">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/90 hover:scale-110 transition-all"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/90 hover:scale-110 transition-all"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Centered Image */}
            <div className="relative max-h-full max-w-full flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePhoto.src?.original || activePhoto.src?.large2x || activePhoto.src?.large}
                alt={activePhoto.title}
                className="max-h-[72vh] max-w-[90vw] sm:max-w-[80vw] object-contain rounded-xl shadow-2xl shadow-black select-none"
              />
            </div>
          </div>

          {/* Bottom EXIF & Metadata Card */}
          {showExifDrawer && (
            <div className="w-full max-w-4xl bg-zinc-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md z-10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                      {activePhoto.category || 'Capture'}
                    </span>
                    {activePhoto.location && (
                      <span className="text-xs text-zinc-400 flex items-center gap-1 font-sans">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {activePhoto.location}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight mt-1">
                    {activePhoto.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {activePhoto.src?.original && (
                    <a
                      href={activePhoto.src.original}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Original Size</span>
                    </a>
                  )}

                  {activePhoto.url && (
                    <a
                      href={activePhoto.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-all border border-white/10"
                    >
                      <span>Open on Pexels</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    </a>
                  )}
                </div>
              </div>

              {/* EXIF Data Strip */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Camera</div>
                  <div className="text-zinc-200 font-sans font-medium line-clamp-1">
                    {activePhoto.camera || 'Sony Alpha 7 IV'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Optics</div>
                  <div className="text-zinc-200 font-sans font-medium line-clamp-1">
                    {activePhoto.lens || 'FE 24-70mm f/2.8 GM'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Aperture &amp; Focal</div>
                  <div className="text-zinc-200 font-medium">
                    {[activePhoto.focalLength || '50mm', activePhoto.aperture || 'f/2.8'].join(' • ')}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Exposure</div>
                  <div className="text-zinc-200 font-medium">
                    {[activePhoto.shutterSpeed || '1/500s', `ISO ${activePhoto.iso || '100'}`].join(' • ')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

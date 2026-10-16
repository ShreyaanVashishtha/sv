'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  PhotoItem,
  VideoItem,
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
  Film,
  Play,
  Instagram,
  Video,
  Star,
} from 'lucide-react';

interface PhotographyGalleryProps {
  photos: PhotoItem[];
  videos?: VideoItem[];
  settings?: PhotographySettings;
  profile: Profile;
  socials: Social[];
  siteSettings: SiteSettings;
}

export function PhotographyGallery({
  photos: initialPhotos,
  videos: initialVideos,
  settings,
  profile,
  socials,
  siteSettings,
}: PhotographyGalleryProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos || []);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos || []);
  const [mediaType, setMediaType] = useState<'all' | 'photos' | 'videos'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showExifDrawer, setShowExifDrawer] = useState(true);

  const instagramHandle = settings?.instagramHandle || 'sv.snap';
  const instagramUrl =
    settings?.instagramProfileUrl || `https://www.instagram.com/${instagramHandle.replace(/^@/, '')}/`;

  const visiblePhotos = useMemo(() => {
    return photos.filter((p) => !p.hidden);
  }, [photos]);

  const visibleVideos = useMemo(() => {
    return (videos || []).filter((v) => !v.hidden);
  }, [videos]);

  const categories = useMemo(() => {
    const fromSettings = settings?.categories || [];
    const fromPhotos = visiblePhotos.map((p) => p.category).filter(Boolean) as string[];
    const fromVideos = visibleVideos.map((v) => v.category).filter(Boolean) as string[];
    const combined = Array.from(new Set(['All', ...fromSettings, ...fromPhotos, ...fromVideos]));
    return combined;
  }, [settings, visiblePhotos, visibleVideos]);

  // Combined or filtered items list for grid rendering
  type GalleryItem =
    | { type: 'photo'; item: PhotoItem; originalIndex: number }
    | { type: 'video'; item: VideoItem; originalIndex: number };

  const filteredItems = useMemo<GalleryItem[]>(() => {
    const q = searchQuery.toLowerCase().trim();
    const items: GalleryItem[] = [];

    // Include Photos if 'all' or 'photos'
    if (mediaType === 'all' || mediaType === 'photos') {
      visiblePhotos.forEach((photo, idx) => {
        const matchesCat =
          selectedCategory === 'All' ||
          (photo.category || '').toLowerCase() === selectedCategory.toLowerCase();
        const matchesQuery =
          !q ||
          (photo.title || '').toLowerCase().includes(q) ||
          (photo.description || '').toLowerCase().includes(q) ||
          (photo.category || '').toLowerCase().includes(q) ||
          (photo.location || '').toLowerCase().includes(q) ||
          (photo.camera || '').toLowerCase().includes(q);

        if (matchesCat && matchesQuery) {
          items.push({ type: 'photo', item: photo, originalIndex: idx });
        }
      });
    }

    // Include Videos if 'all' or 'videos'
    if (mediaType === 'all' || mediaType === 'videos') {
      visibleVideos.forEach((video, idx) => {
        const matchesCat =
          selectedCategory === 'All' ||
          (video.category || '').toLowerCase() === selectedCategory.toLowerCase();
        const matchesQuery =
          !q ||
          (video.title || '').toLowerCase().includes(q) ||
          (video.description || '').toLowerCase().includes(q) ||
          (video.category || '').toLowerCase().includes(q) ||
          (video.location || '').toLowerCase().includes(q) ||
          (video.camera || '').toLowerCase().includes(q) ||
          (video.resolution || '').toLowerCase().includes(q);

        if (matchesCat && matchesQuery) {
          items.push({ type: 'video', item: video, originalIndex: idx });
        }
      });
    }

    // If 'all' mode, place featured items first while keeping natural flow
    if (mediaType === 'all') {
      return [...items].sort((a, b) => {
        const aFeatured = Boolean(a.item.featured);
        const bFeatured = Boolean(b.item.featured);
        if (aFeatured && !bFeatured) return -1;
        if (!aFeatured && bFeatured) return 1;
        return 0;
      });
    }

    return items;
  }, [visiblePhotos, visibleVideos, mediaType, selectedCategory, searchQuery]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activePhotoIndex === null && activeVideoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
        setActiveVideoIndex(null);
      } else if (e.key === 'ArrowRight') {
        if (activePhotoIndex !== null) handleNextPhoto();
        if (activeVideoIndex !== null) handleNextVideo();
      } else if (e.key === 'ArrowLeft') {
        if (activePhotoIndex !== null) handlePrevPhoto();
        if (activeVideoIndex !== null) handlePrevVideo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, activeVideoIndex, visiblePhotos.length, visibleVideos.length]);

  const activePhoto =
    activePhotoIndex !== null && visiblePhotos[activePhotoIndex]
      ? visiblePhotos[activePhotoIndex]
      : null;

  const activeVideo =
    activeVideoIndex !== null && visibleVideos[activeVideoIndex]
      ? visibleVideos[activeVideoIndex]
      : null;

  const handleNextPhoto = () => {
    if (activePhotoIndex === null || visiblePhotos.length === 0) return;
    setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % visiblePhotos.length : 0));
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex === null || visiblePhotos.length === 0) return;
    setActivePhotoIndex((prev) =>
      prev !== null ? (prev - 1 + visiblePhotos.length) % visiblePhotos.length : 0
    );
  };

  const handleNextVideo = () => {
    if (activeVideoIndex === null || visibleVideos.length === 0) return;
    setActiveVideoIndex((prev) => (prev !== null ? (prev + 1) % visibleVideos.length : 0));
  };

  const handlePrevVideo = () => {
    if (activeVideoIndex === null || visibleVideos.length === 0) return;
    setActiveVideoIndex((prev) =>
      prev !== null ? (prev - 1 + visibleVideos.length) % visibleVideos.length : 0
    );
  };

  const handleCopyLink = (url?: string) => {
    const finalUrl = url || window.location.href;
    navigator.clipboard.writeText(finalUrl);
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
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-10">
        {/* HERO HEADER */}
        <div className="space-y-6 pt-4 border-b border-white/10 pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                Visual Archive &bull; Stills &amp; Cinematography
              </span>
            </div>

            {/* Profile Links Header: Instagram @sv.snap + Pexels */}
            <div className="flex flex-wrap items-center gap-2">
              {instagramHandle && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 border border-pink-500/30 hover:border-pink-500/60 text-xs font-medium text-zinc-200 hover:text-white transition-all shadow-sm group"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
                  <span>@{instagramHandle}</span>
                  <ExternalLink className="w-3 h-3 text-pink-300/60 group-hover:text-pink-300 transition-colors" />
                </a>
              )}

              <a
                href={pexelsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-500/40 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
              >
                <span>Pexels Stills</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            </div>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              {settings?.title || 'Visual Archive & Cinematography'}
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              {settings?.subtitle ||
                'Aerospace perspectives, mechanical forms, and terrestrial observations through stills & motion.'}
            </p>
          </div>

          {settings?.bio && (
            <p className="text-xs sm:text-sm text-zinc-400/90 leading-relaxed max-w-2xl font-sans pt-1">
              {settings.bio}
            </p>
          )}

          {/* METRIC CHIPS & INSTAGRAM SPOTLIGHT */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-zinc-400">Stills:</span>
              <span className="font-mono font-bold text-white">{visiblePhotos.length}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-zinc-400">Reels &amp; Motion:</span>
              <span className="font-mono font-bold text-white">{visibleVideos.length}</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-zinc-400">Sensors:</span>
              <span className="font-mono text-white">Sony Full-Frame &bull; 4K Cinema</span>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900/60 border border-white/10 text-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">Hub:</span>
              <span className="text-white">Hong Kong SAR &bull; Spaceports</span>
            </div>
          </div>
        </div>

        {/* MEDIA TYPE SELECTOR TABS & SEARCH */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Mode Tabs: All / Photos / Videos */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/90 border border-white/10 w-fit backdrop-blur-md">
              <button
                type="button"
                onClick={() => setMediaType('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  mediaType === 'all'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Works</span>
                <span className="text-[10px] font-mono opacity-70">
                  {visiblePhotos.length + visibleVideos.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('photos')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  mediaType === 'photos'
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photography</span>
                <span className="text-[10px] font-mono opacity-70">{visiblePhotos.length}</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('videos')}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  mediaType === 'videos'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>Motion &amp; Reels</span>
                <span className="text-[10px] font-mono opacity-70">{visibleVideos.length}</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search camera, location, story..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-zinc-900/80 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? filteredItems.length
                  : filteredItems.filter(
                      (item) => (item.item.category || '').toLowerCase() === cat.toLowerCase()
                    ).length;
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  type="button"
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
        </div>

        {/* MEDIA GRID / MASONRY STREAM */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 rounded-3xl bg-zinc-900/30 border border-white/10 space-y-4">
            <Camera className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-semibold text-white">No items matched your filter</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try choosing another category, switching to All Works, or clearing your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setMediaType('all');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((entry, idx) => {
              if (entry.type === 'photo') {
                const photo = entry.item;
                const displaySrc =
                  photo.src?.large2x || photo.src?.large || photo.src?.original;

                return (
                  <div
                    key={`photo-${photo.id || entry.originalIndex}`}
                    onClick={() => setActivePhotoIndex(entry.originalIndex)}
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
                            {[
                              photo.focalLength,
                              photo.aperture,
                              photo.shutterSpeed,
                              photo.iso ? `ISO ${photo.iso}` : null,
                            ]
                              .filter(Boolean)
                              .join(' • ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // VIDEO / MOTION REEL CARD
              const video = entry.item;
              return (
                <div
                  key={`video-${video.id || entry.originalIndex}`}
                  onClick={() => setActiveVideoIndex(entry.originalIndex)}
                  className="break-inside-avoid group relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer transition-all duration-300 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10"
                >
                  <div className="relative overflow-hidden w-full bg-zinc-950 aspect-[9/13] sm:aspect-[9/14]">
                    {/* Poster Image */}
                    {video.posterUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={video.posterUrl}
                        alt={video.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex items-center justify-center">
                        <Film className="w-12 h-12 text-zinc-700" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:from-black/95 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 border border-pink-500/40 backdrop-blur-md text-[10px] font-mono text-pink-300 font-semibold flex items-center gap-1.5 shadow-sm">
                        <Instagram className="w-3 h-3 text-pink-400" />
                        <span>@{instagramHandle}</span>
                      </span>

                      {video.duration && (
                        <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10">
                          {video.duration}
                        </span>
                      )}
                    </div>

                    {/* Centered Glowing Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md text-black flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-115 group-hover:bg-white group-hover:shadow-pink-500/30">
                        <Play className="w-6 h-6 fill-black ml-1 text-black" />
                      </div>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1.5 z-10">
                      <span className="px-2 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/15 text-[9px] font-mono text-zinc-300 uppercase">
                        {video.category || 'Motion Reel'}
                      </span>

                      <h3 className="text-sm font-bold text-white tracking-tight leading-snug line-clamp-2">
                        {video.title}
                      </h3>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{video.location || 'Hong Kong'}</span>
                        </span>
                        <span className="text-pink-400 font-semibold">
                          {video.resolution || '4K 60fps'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* INSTAGRAM SPOTLIGHT BANNER */}
        {instagramHandle && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-pink-950/20 via-zinc-900/60 to-purple-950/20 border border-pink-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-pink-400 font-semibold">
                  Official Motion Channel &bull; Instagram
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Follow @{instagramHandle} for Live Aviation &amp; Motion Cinema
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {settings?.instagramBio ||
                  'High-speed aircraft approaches, mechanical sound studies, and vertical cinema reels direct from the flight line.'}
              </p>
            </div>

            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-lg shadow-pink-500/20 shrink-0 group"
            >
              <Instagram className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Follow @{instagramHandle} on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </a>
          </div>
        )}

        {/* BOTTOM ATTRIBUTION STRIP */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            Captured &amp; Curated by{' '}
            <span className="text-zinc-300 font-sans font-medium">{profile.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 flex items-center gap-1 transition-colors"
            >
              <span>@{instagramHandle}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <a
              href={pexelsUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>Pexels Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <Link href="/" className="hover:text-white transition-colors">
              Portfolio Home &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
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
                {activePhotoIndex! + 1} / {visiblePhotos.length}
              </span>
              <span className="text-zinc-600">&bull;</span>
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
                onClick={() => handleCopyLink(activePhoto.url)}
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
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/90 hover:scale-110 transition-all"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/90 hover:scale-110 transition-all"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

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
                  {activePhoto.description && (
                    <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                      {activePhoto.description}
                    </p>
                  )}
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

      {/* FULLSCREEN CINEMA VIDEO LIGHTBOX MODAL */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6"
        >
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex items-center justify-between text-xs text-zinc-400 z-10 pb-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-xs font-mono text-pink-300 font-semibold flex items-center gap-1.5 shadow-sm">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@{instagramHandle} Reel</span>
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-zinc-300 font-sans font-medium line-clamp-1 max-w-[200px] sm:max-w-md">
                {activeVideo.title}
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
                title="Toggle Video Info Drawer"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleCopyLink(activeVideo.instagramUrl || activeVideo.videoUrl)}
                className="p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                title="Copy Reel Link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveVideoIndex(null)}
                className="p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-all ml-2"
                title="Close (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Stage: Responsive Video Player */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden my-2">
            <button
              type="button"
              onClick={handlePrevVideo}
              className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/90 hover:scale-110 transition-all"
              aria-label="Previous Video"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNextVideo}
              className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/60 border border-white/15 text-white hover:bg-black/90 hover:scale-110 transition-all"
              aria-label="Next Video"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Video Player Box */}
            <div
              className={`relative max-h-full max-w-full flex items-center justify-center p-2 ${
                activeVideo.aspectRatio === '9:16' ? 'w-[360px] max-w-[85vw]' : 'w-full max-w-4xl'
              }`}
            >
              <video
                key={activeVideo.id || activeVideo.videoUrl}
                src={activeVideo.videoUrl}
                poster={activeVideo.posterUrl}
                controls
                autoPlay
                playsInline
                loop
                className={`max-h-[70vh] rounded-2xl shadow-2xl shadow-black bg-black border border-white/15 object-contain ${
                  activeVideo.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'w-full aspect-video'
                }`}
              />
            </div>
          </div>

          {/* Bottom Video Metadata & Instagram Reel CTA */}
          {showExifDrawer && (
            <div className="w-full max-w-4xl bg-zinc-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md z-10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/25 text-[10px] font-mono text-pink-400 font-semibold uppercase">
                      {activeVideo.category || 'Motion Reel'}
                    </span>
                    {activeVideo.duration && (
                      <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded">
                        {activeVideo.duration}
                      </span>
                    )}
                    {activeVideo.location && (
                      <span className="text-xs text-zinc-400 flex items-center gap-1 font-sans">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {activeVideo.location}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white tracking-tight mt-1">
                    {activeVideo.title}
                  </h2>
                  {activeVideo.description && (
                    <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                      {activeVideo.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activeVideo.instagramUrl || instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md group"
                  >
                    <Instagram className="w-3.5 h-3.5 text-white" />
                    <span>Watch on Instagram (@{instagramHandle})</span>
                    <ExternalLink className="w-3 h-3 text-white/80" />
                  </a>
                </div>
              </div>

              {/* Video Technical Strip */}
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Camera Sensor</div>
                  <div className="text-zinc-200 font-sans font-medium line-clamp-1">
                    {activeVideo.camera || 'Sony Alpha 7 IV'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Optics</div>
                  <div className="text-zinc-200 font-sans font-medium line-clamp-1">
                    {activeVideo.lens || 'FE 24-70mm f/2.8 GM'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Format &amp; Framerate</div>
                  <div className="text-zinc-200 font-medium">
                    {[activeVideo.resolution || '4K', activeVideo.fps || '60fps'].join(' • ')}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-zinc-950/60 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Aspect &amp; Date</div>
                  <div className="text-zinc-200 font-medium">
                    {[activeVideo.aspectRatio || '9:16', activeVideo.date || '2024'].join(' • ')}
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

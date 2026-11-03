'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Status, HeaderSettings } from '@/types/content';
import { Menu, X, ArrowUpRight, Linkedin, Camera } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

interface NavbarProps {
  status: Status;
  siteName: string;
  cvUrl?: string;
  headerSettings?: HeaderSettings;
}

export function Navbar({ status, siteName, cvUrl, headerSettings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const pathname = usePathname() || '/';

  // ScrollSpy: Automatically highlight active section on the homepage
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = ['projects', 'skills', 'experience', 'education', 'contact'];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (window.scrollY < 200) {
          setActiveSection('');
          return;
        }

        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: '-15% 0px -40% 0px',
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    const handleScrollCheck = () => {
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScrollCheck, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScrollCheck);
    };
  }, [pathname]);

  const isLinkActive = (linkHref: string) => {
    if (linkHref === '/cad') {
      return pathname.startsWith('/cad');
    }
    if (linkHref === '/photography') {
      return pathname.startsWith('/photography');
    }
    if (pathname === '/') {
      if (linkHref === '#projects') {
        return activeSection === 'projects' || activeSection === 'skills';
      }
      if (linkHref === '#experience') {
        return activeSection === 'experience' || activeSection === 'education';
      }
      if (linkHref === '#contact') {
        return activeSection === 'contact';
      }
    }
    return pathname === linkHref;
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#') && pathname === '/') {
      e.preventDefault();
      const id = href.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const logoBadge = headerSettings?.logoBadge || 'sv7';
  const brandTitle = headerSettings?.brandTitle || siteName || 'sv7.dev';
  const ctaText = headerSettings?.ctaText || 'Get in Touch';
  const rawCtaHref = headerSettings?.ctaHref || '#contact';
  const ctaHref = rawCtaHref.startsWith('#') && pathname !== '/' ? `/${rawCtaHref}` : rawCtaHref;
  const resumeButtonText = headerSettings?.resumeButtonText || 'LinkedIn';
  const showResume = Boolean(headerSettings?.showResumeButton);

  const defaultNavLinks = [
    { name: 'Work', href: '#projects', enabled: true },
    { name: 'Experience', href: '#experience', enabled: true },
    { name: '3D CAD', href: '/cad', enabled: true },
    { name: 'Photography', href: '/photography', enabled: true },
  ];

  const rawNavLinks = headerSettings?.navLinks && headerSettings.navLinks.length > 0
    ? headerSettings.navLinks
    : defaultNavLinks;

  // Filter out redundant items if legacy 7-item menu is saved
  let effectiveNavLinks = rawNavLinks.filter((l) => {
    const n = l.name.toLowerCase();
    // Capabilities and Education are scroll sub-sections under Work and Experience
    if (n === 'capabilities' || n === 'skills') return false;
    if (n === 'education') return false;
    // Contact is already served by the dedicated primary CTA button
    if (n === 'contact') return false;
    return true;
  });

  if (!effectiveNavLinks.some((l) => l.href.includes('cad'))) {
    effectiveNavLinks.push({ name: '3D CAD', href: '/cad', enabled: true });
  }
  if (!effectiveNavLinks.some((l) => l.href.includes('photography'))) {
    effectiveNavLinks.push({ name: 'Photography', href: '/photography', enabled: true });
  }

  const navLinks = effectiveNavLinks.filter((link) => link.enabled !== false);

  const resolveHref = (href: string) => {
    if (href.startsWith('#') && pathname !== '/') {
      return `/${href}`;
    }
    return href;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-nav py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandLogo
            style={headerSettings?.logoStyle || 'classic'}
            badgeText={logoBadge}
          />
          <span className="font-semibold text-sm tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            {brandTitle}
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        {navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
            {navLinks.map((link) => {
              const target = resolveHref(link.href);
              const isActive = isLinkActive(link.href);
              const isInternalPage = target.startsWith('/') && !target.includes('#');
              const linkClass = `px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95'
              }`;

              if (isInternalPage) {
                return (
                  <Link key={link.name} href={target} className={linkClass}>
                    {link.name}
                  </Link>
                );
              }

              return (
                <a
                  key={link.name}
                  href={target}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className={linkClass}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>
        )}

        {/* Right CTA Links */}
        <div className="hidden md:flex items-center gap-3">
          {showResume && (
            <a
              href={cvUrl || 'https://www.linkedin.com/in/shreyaanv/'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 bg-zinc-900/50 hover:bg-zinc-800/80 active:scale-95"
              title={resumeButtonText}
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
              <span>{resumeButtonText}</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-500" />
            </a>
          )}

          <a
            href={ctaHref}
            className="flex items-center gap-1 text-xs font-semibold bg-white text-black px-3.5 py-1.5 rounded-lg hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-sm"
          >
            <span>{ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg border border-white/10 bg-zinc-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Toggle Menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden glass-nav border-t border-white/10 px-6 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => {
            const target = resolveHref(link.href);
            const isActive = isLinkActive(link.href);
            const isInternalPage = target.startsWith('/') && !target.includes('#');
            const linkClass = `block text-sm font-medium py-1.5 transition-colors ${
              isActive ? 'text-white font-bold' : 'text-zinc-300 hover:text-white'
            }`;

            if (isInternalPage) {
              return (
                <Link
                  key={link.name}
                  href={target}
                  onClick={() => setMobileMenuOpen(false)}
                  className={linkClass}
                >
                  {link.name}
                </Link>
              );
            }

            return (
              <a
                key={link.name}
                href={target}
                onClick={(e) => handleAnchorClick(e, link.href)}
                className={linkClass}
              >
                {link.name}
              </a>
            );
          })}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            {showResume && (
              <a
                href={cvUrl || 'https://www.linkedin.com/in/shreyaanv/'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white py-2"
              >
                <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                <span>{resumeButtonText}</span>
                <ArrowUpRight className="w-3 h-3 text-zinc-500" />
              </a>
            )}
            <a
              href={ctaHref}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs bg-white text-black font-semibold px-4 py-2 rounded-lg"
            >
              {ctaText}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

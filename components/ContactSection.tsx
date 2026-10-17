'use client';

import React, { useState, useEffect } from 'react';
import { Social, Profile, ContactSettings } from '@/types/content';
import {
  Mail,
  ArrowUpRight,
  Copy,
  Check,
  MessageSquare,
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Instagram,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';

interface ContactSectionProps {
  profile: Profile;
  socials: Social[];
  contactMessage?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  contactSettings?: ContactSettings;
}

export function ContactSection({
  profile,
  socials,
  contactMessage,
  eyebrow = 'Initiate Contact',
  title = "Let's Build Something Meaningful",
  subtitle,
  contactSettings,
}: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formTitle = contactSettings?.formTitle || 'Send a Direct Dispatch';
  const subjectLabel = contactSettings?.subjectLabel || 'Subject / Topic';
  const subjectPlaceholder =
    contactSettings?.subjectPlaceholder || 'e.g. Rocketry Systems, Collaboration, IB Tutoring';
  const messageLabel = contactSettings?.messageLabel || 'Your Message';
  const messagePlaceholder =
    contactSettings?.messagePlaceholder || 'Tell me about your project, inquiry, or question...';
  const submitButtonText = contactSettings?.submitButtonText || 'Send Dispatch';
  const responseDisclaimer =
    contactSettings?.responseDisclaimer || 'Typically replies within 24 business hours.';
  const displayEmail =
    contactSettings?.publicDisplayEmail || profile.email || 'contact@sv7.dev';

  const copyEmail = () => {
    navigator.clipboard.writeText(displayEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setErrorMessage(json.error || 'Failed to deliver message. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while delivering message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out redundant circular contact links
  const activeSocials = (socials || []).filter(
    (s) =>
      s.url !== '#contact' &&
      !s.name.toLowerCase().includes('dispatch') &&
      !s.name.toLowerCase().includes('contact')
  );

  // If Instagram @sv.snap is not explicitly in socials, include it for completeness
  const hasInstagram = activeSocials.some((s) => s.name.toLowerCase().includes('insta'));
  const effectiveSocials = hasInstagram
    ? activeSocials
    : [
        ...activeSocials,
        {
          name: 'Instagram (@sv.snap)',
          url: 'https://www.instagram.com/sv.snap/',
          icon: 'instagram',
        },
      ];

  const renderSocialIcon = (nameOrIcon: string) => {
    const lower = nameOrIcon.toLowerCase();
    if (lower.includes('git')) return <Github className="w-4 h-4" />;
    if (lower.includes('link')) return <Linkedin className="w-4 h-4" />;
    if (lower.includes('insta')) return <Instagram className="w-4 h-4 text-pink-400" />;
    if (lower.includes('twit') || lower.includes('x')) return <Twitter className="w-4 h-4" />;
    return <ArrowUpRight className="w-4 h-4 text-zinc-400" />;
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-white/5 relative bg-mesh">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-xl leading-relaxed">
            {subtitle ||
              contactMessage ||
              'Open for select consulting, high-impact systems architecture, and engineering advisory.'}
          </p>
        </div>

        {/* Two-Column Responsive Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (7 cols): Direct Dispatch Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">{formTitle}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Routed securely to private inbox. Zero spam bots.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Channel Open</span>
                </div>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Transmission Delivered</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Thank you! Your dispatch has been securely encrypted and delivered to Shreyaan&apos;s primary inbox. You will receive a direct reply shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white underline pt-4 font-mono transition-colors"
                  >
                    <span>Transmit Another Message</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                        Your Email (for reply)
                      </label>
                      <input
                        type="email"
                        placeholder="jane@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                      {subjectLabel}
                    </label>
                    <input
                      type="text"
                      placeholder={subjectPlaceholder}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                      {messageLabel}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={messagePlaceholder}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-200 resize-none leading-relaxed"
                      required
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-xs py-3.5 rounded-xl hover:bg-zinc-200 transition-all duration-200 hover:scale-[1.008] active:scale-[0.99] shadow-md disabled:opacity-50 mt-2"
                  >
                    <span>{submitting ? 'Encrypting & Delivering...' : submitButtonText}</span>
                    <Send className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Secured Transmission</span>
              </span>
              <span>BotId Protected</span>
            </div>
          </div>

          {/* Right Column (5 cols): Direct Channels & Context */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {/* Direct Email Card */}
            <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-white" />
                  <span>Direct Communication</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Direct Channel</span>
                </span>
              </div>

              <div className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {contactSettings?.directTitle || 'Direct Inquiries & RFPs'}
              </div>

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {responseDisclaimer} Prefer writing directly via your email client? Inquiries routed directly or via the dispatch console are received into private inbox.
              </p>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Address Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{contactSettings?.copyAddressText || 'Copy Address'}</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${displayEmail}`}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-semibold transition-all shrink-0 active:scale-95 shadow-sm"
                >
                  <span>Compose</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Connected Digital Networks Grid */}
            <div className="space-y-2">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-1">
                Verified External Channels
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {effectiveSocials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/20 hover:bg-zinc-850/80 transition-all duration-200 flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-white">
                        {renderSocialIcon(social.icon || social.name)}
                      </div>
                      <span className="text-xs font-medium text-zinc-300 group-hover:text-white truncate">
                        {social.name}
                      </span>
                    </div>

                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

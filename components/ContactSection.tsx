'use client';

import React, { useState } from 'react';
import { Social, Profile, ContactSettings } from '@/types/content';
import { Mail, ArrowUpRight, Copy, Check, MessageSquare, Send, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const subjectPlaceholder = contactSettings?.subjectPlaceholder || 'Collaboration / Inquiry...';
  const messageLabel = contactSettings?.messageLabel || 'Brief Overview';
  const messagePlaceholder = contactSettings?.messagePlaceholder || "Tell me about what you're building, requirements, or timeline...";
  const submitButtonText = contactSettings?.submitButtonText || 'Send Secure Message';
  const directTitle = contactSettings?.directTitle || 'Direct Inquiries';
  const responseDisclaimer = contactSettings?.responseDisclaimer || 'Responses typically sent within 24 business hours.';
  const copyAddressText = contactSettings?.copyAddressText || 'Copy Address';

  const hideRawEmail = contactSettings?.hideEmailAddress !== false;
  const displayEmail = contactSettings?.publicDisplayEmail || profile.email || 'contact@sv7.dev';

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
    } catch (err) {
      setErrorMessage('Network error while delivering message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 border-t border-white/5 relative bg-mesh">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <MessageSquare className="w-4 h-4 text-white" />
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {title}
          </h2>
          <p className="text-sm md:text-base text-zinc-400 mt-2 max-w-xl">
            {subtitle || contactMessage || 'Open for aerospace engineering research, Astrix rocketry, tutoring, or technical collaboration.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Server-Side Direct Contact Form */}
          <div className="p-6 md:p-8 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-md">
            <h3 className="text-lg font-bold text-white mb-2">{formTitle}</h3>
            <p className="text-xs text-zinc-400 mb-6">
              Messages are routed securely to my inbox. No email clients required.
            </p>

            {submitted ? (
              <div className="py-8 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Message Securely Delivered</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                  Thank you! Your dispatch has been received and routed to my inbox. I'll get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-zinc-400 hover:text-white underline pt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                      Your Email (for reply)
                    </label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                    {subjectLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={subjectPlaceholder}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase">
                    {messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950/80 border border-white/10 text-sm text-white focus:outline-none focus:border-white/30 transition-colors resize-none"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-xs py-3 rounded-xl hover:bg-zinc-200 transition-all shadow-sm disabled:opacity-50"
                >
                  <span>{submitting ? 'Encrypting & Delivering...' : submitButtonText}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Privacy & Direct Inquiries Info */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-zinc-900/30 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Privacy Protected</span>
                </div>

                <div className="text-xl md:text-2xl font-mono font-semibold text-white">
                  {hideRawEmail ? 'Contact Form Dispatch' : displayEmail}
                </div>

                <p className="text-xs text-zinc-400 mt-3 leading-relaxed">
                  {hideRawEmail ? (
                    <>
                      Direct personal email addresses are kept private from public web scrapers.
                      Messages sent via this dispatch form are forwarded to my private inbox.
                    </>
                  ) : (
                    responseDisclaimer
                  )}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {!hideRawEmail ? (
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-2 bg-zinc-800 text-zinc-200 px-4 py-2 rounded-xl text-xs font-medium hover:bg-zinc-700 transition-colors border border-white/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copyAddressText}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-zinc-500 bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
                    Forwarding via Cloudflare Edge
                  </span>
                )}
              </div>
            </div>

            {/* Social channels grid */}
            <div className="grid grid-cols-2 gap-3">
              {(socials || []).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith('#') ? '_self' : '_blank'}
                  rel="noreferrer"
                  className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-medium text-zinc-300 group-hover:text-white">
                    {social.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

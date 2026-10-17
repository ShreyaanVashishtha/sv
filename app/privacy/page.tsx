import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { LegalLayout } from '@/components/LegalLayout';
import Link from 'next/link';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContent();
  const siteName = data.settings?.siteName || 'sv7.dev';
  return {
    title: `Privacy Policy | ${siteName}`,
    description:
      'Privacy policy for sv7.dev detailing privacy-first data practices, contact communications, cookieless analytics, and data rights under Hong Kong PDPO.',
    alternates: {
      canonical: `${data.settings?.canonicalUrl || 'https://sv7.dev'}/privacy`,
    },
  };
}

export default async function PrivacyPage() {
  const data = await getContent();

  return (
    <LegalLayout
      title="Privacy Policy"
      subtitle="Transparency regarding data collection, privacy-first analytics, contact communications, and security on sv7.dev."
      documentType="Privacy Policy"
      lastUpdated="October 17, 2026"
      activeSlug="privacy"
      data={data}
    >
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              01
            </span>
            <span>Privacy-First Philosophy</span>
          </h2>
          <p>
            At <strong className="text-white">sv7.dev</strong>, we believe in privacy-by-design. This Website is an engineering portfolio, research showcase, and visual archive. <strong className="text-white">We do not sell, rent, monetize, or broker your personal information to third-party data brokers or advertising networks.</strong> We only collect the minimal information necessary to deliver content, ensure website security, and communicate with you when you reach out.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              02
            </span>
            <span>Information We Collect</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                A. Information You Voluntarily Provide
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                When you initiate contact through our terminal or contact form, you may provide personal details such as your name, email address, organization, and the content of your message. This information is used strictly to evaluate your communication and provide a direct response.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                B. Automated Telemetry &amp; Cookieless Analytics
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                We utilize <strong className="text-zinc-200">Vercel Web Analytics</strong> and <strong className="text-zinc-200">Speed Insights</strong> to monitor technical performance, page render latency, error rates, and aggregate visitor counts. These services operate on a cookieless, privacy-preserving model:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                <li>No persistent tracking cookies are written to your device.</li>
                <li>IP addresses are anonymized and never stored in identifiable form.</li>
                <li>No cross-site tracking or profiling across different domains occurs.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                C. Client-Side Browser Storage
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                The Website may use client-side <code className="text-zinc-200 font-mono">localStorage</code> or <code className="text-zinc-200 font-mono">sessionStorage</code> solely for functional UI states (such as remembering gallery view preferences, Cinema Lightbox state, or temporary security session tokens for authorized administrative maintenance).
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              03
            </span>
            <span>Third-Party Subprocessors &amp; Integrations</span>
          </h2>
          <p>
            To deliver global high-availability performance and interactive media, we engage selected trusted infrastructure providers:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-zinc-400">
            <li>
              <strong className="text-zinc-200">Vercel Inc. (Hosting &amp; Edge Network):</strong> Hosts the website infrastructure, edge compute, and TLS certificates. Server log records (request path, status codes, user-agent) are processed for infrastructure defense and DDoS mitigation.
            </li>
            <li>
              <strong className="text-zinc-200">Behold.so &amp; Meta / Instagram CDN:</strong> Delivers live MP4 video streams and poster assets for motion reels published on <strong className="text-zinc-200">@sv.snap</strong>. When playing a video, your browser establishes a secure connection to CDN nodes to stream video data.
            </li>
            <li>
              <strong className="text-zinc-200">Pexels (Canva Germany GmbH):</strong> Serves curated photography assets via high-speed global image CDNs.
            </li>
            <li>
              <strong className="text-zinc-200">BotId:</strong> Client-side threat intelligence used to verify legitimate human interaction on form dispatches and prevent automated bot spam.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              04
            </span>
            <span>Purpose &amp; Legal Basis for Processing</span>
          </h2>
          <p>We process personal data based on the following legitimate interests and legal bases:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-white">Legitimate Interests:</strong> Operating, safeguarding, maintaining, and improving the stability, accessibility, and security of our technical portfolio.</li>
            <li><strong className="text-white">Consent:</strong> Responding directly to inquiries initiated by you through email or form submissions.</li>
            <li><strong className="text-white">Legal Obligations:</strong> Compliance with applicable laws and regulatory requests in Hong Kong SAR.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              05
            </span>
            <span>Data Security &amp; Encryption</span>
          </h2>
          <p>
            All network communication with <strong className="text-white">sv7.dev</strong> is enforced via modern Transport Layer Security (<strong className="text-white">HTTPS / TLS 1.3</strong>) with automated SSL certificate renewal and HTTP Strict Transport Security (HSTS). Administrative access is protected via cryptographic biometrics, passkeys, and multi-factor authentication.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              06
            </span>
            <span>Your Data Rights (Hong Kong PDPO &amp; Global Standards)</span>
          </h2>
          <p>
            Under the <strong className="text-white">Personal Data (Privacy) Ordinance (Cap. 486) of Hong Kong (PDPO)</strong> and comparable international data privacy frameworks (e.g., GDPR), you have specific rights regarding your personal information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li><strong className="text-zinc-200">Right of Access:</strong> You may request confirmation of whether we hold any personal data about you.</li>
            <li><strong className="text-zinc-200">Right to Correction:</strong> You may request rectification of inaccurate personal data.</li>
            <li><strong className="text-zinc-200">Right to Erasure:</strong> You may request deletion of previous correspondence sent to our contact address.</li>
          </ul>
          <p className="text-xs text-zinc-400">
            To exercise any of these rights, please submit a written request to <a href="mailto:contact@sv7.dev" className="text-white underline">contact@sv7.dev</a>.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              07
            </span>
            <span>Cookies Policy</span>
          </h2>
          <p>
            <strong className="text-white">sv7.dev does NOT use third-party advertising cookies, re-targeting pixels, or tracking beacons.</strong> Any storage used is strictly necessary for functional site operation (such as remembering UI toggles or security tokens). Therefore, no intrusive tracking banner is required.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              08
            </span>
            <span>Policy Updates</span>
          </h2>
          <p>
            We may update this Privacy Policy periodically to reflect technological changes, infrastructural updates, or legal compliance requirements. Any revisions will be published here with an updated effective date.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}

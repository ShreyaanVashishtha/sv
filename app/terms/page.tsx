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
    title: `Terms and Conditions | ${siteName}`,
    description:
      'Terms and conditions governing the access and usage of sv7.dev, engineering research archives, robotics prototypes, software repositories, and photography media.',
    alternates: {
      canonical: `${data.settings?.canonicalUrl || 'https://sv7.dev'}/terms`,
    },
  };
}

export default async function TermsPage() {
  const data = await getContent();

  return (
    <LegalLayout
      title="Terms and Conditions"
      subtitle="Please read these terms carefully before accessing sv7.dev, reviewing technical documentation, or using any associated media assets."
      documentType="Terms of Service"
      lastUpdated="October 17, 2026"
      activeSlug="terms"
      data={data}
    >
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              01
            </span>
            <span>Acceptance of Terms</span>
          </h2>
          <p>
            By accessing, browsing, or interacting with <strong className="text-white">sv7.dev</strong> (&quot;the Website&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), operated by <strong className="text-white">Shreyaan Vashishtha</strong>, you agree to comply with and be bound by these Terms and Conditions (&quot;Terms&quot;) and our <Link href="/privacy" className="text-white underline hover:text-zinc-200">Privacy Policy</Link>. If you do not accept these Terms in full, you must discontinue using this Website immediately.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              02
            </span>
            <span>Intellectual Property &amp; Content Licensing</span>
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                A. Engineering Research, Code &amp; Prototypes
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Source code, engineering schematics, CAD representations, aerodynamic calculations, descent control algorithms, and technical writeups published on this Website are the intellectual property of Shreyaan Vashishtha, unless explicitly designated as third-party open-source materials. Code shared via public repositories (such as GitHub) is subject to the specific open-source licenses (e.g., MIT, Apache 2.0, or GPL) accompanying each repository. Technical writeups and non-code documentation may not be plagiarized or claimed as original work without proper attribution.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                B. Photography, Cinematography &amp; Motion Visuals
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                All photographs, aerospace imagery, video reels, motion studies, and visual archive materials presented across the gallery (<Link href="/photography" className="text-white underline hover:text-zinc-200">/photography</Link>), including content syndicated from Instagram (<strong className="text-white">@sv.snap</strong>) and Pexels collection (<strong className="text-white">portfolio-je8myyb</strong>), are original creative works protected by international copyright laws.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                <li><strong className="text-zinc-200">Personal &amp; Non-Commercial Viewing:</strong> You are granted a limited, revocable license to view and display media on your personal device.</li>
                <li><strong className="text-zinc-200">Commercial Reproduction &amp; Resale:</strong> Prohibited without prior written licensing agreement from Shreyaan Vashishtha.</li>
                <li><strong className="text-zinc-200">Machine Learning / AI Scraping:</strong> Automated scraping, harvesting, ingestion, or data-mining of high-resolution imagery or video streams for generative AI model training is expressly prohibited without explicit authorization.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              03
            </span>
            <span>Permitted Use &amp; Code of Conduct</span>
          </h2>
          <p>
            You agree to use this Website solely for lawful, legitimate professional, educational, or evaluative purposes. You must not:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-400">
            <li>Attempt to probe, scan, or breach the security or authentication measures of the Website, admin interfaces, or API endpoints.</li>
            <li>Submit malicious, abusive, spam, or fraudulent payloads through the contact forms or communication channels.</li>
            <li>Impersonate any individual or misrepresent your affiliation with Shreyaan Vashishtha or academic institutions.</li>
            <li>Deploy automated scripts, bots, spiders, or scrapers that place disproportionate loads on server infrastructure.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              04
            </span>
            <span>Technical Demonstrations &amp; Engineering Disclaimers</span>
          </h2>
          <p>
            The technical projects, simulations, flight descent systems, firmware snippets, and rocketry telemetry showcased on this Website represent academic, experimental, and exploratory engineering work. They are presented for demonstration, educational, and portfolio purposes only.
          </p>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <strong>Important Engineering Notice:</strong> Calculations, prototypes, and flight control concepts published herein are not certified for commercial, flight-critical, industrial, or life-safety applications without independent engineering verification and compliance with applicable aviation authorities (e.g., FAA, CAD HK, EASA).
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              05
            </span>
            <span>Third-Party Links &amp; External Feeds</span>
          </h2>
          <p>
            The Website links to and dynamically integrates content from third-party services, including Behold.so, Instagram (Meta Platforms, Inc.), Pexels (Canva Germany GmbH), GitHub, and Vercel. We do not control and are not responsible for the availability, terms, privacy practices, or content of external websites. Accessing external links is done at your own risk.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              06
            </span>
            <span>Disclaimer of Warranties</span>
          </h2>
          <p>
            THE WEBSITE AND ALL MATERIALS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR FREEDOM FROM INTERRUPTIONS OR ERRORS.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              07
            </span>
            <span>Limitation of Liability</span>
          </h2>
          <p>
            To the maximum extent permitted by applicable law, in no event shall Shreyaan Vashishtha, collaborators, or academic affiliates be liable for any direct, indirect, incidental, consequential, special, or exemplary damages (including loss of data, business disruption, or hardware failure) arising out of or in connection with your use or inability to use the Website or reliance on any technical documentation.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              08
            </span>
            <span>Governing Law &amp; Jurisdiction</span>
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the <strong className="text-white">Hong Kong Special Administrative Region (Hong Kong SAR)</strong>, without regard to its conflict of law principles. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the courts of Hong Kong SAR.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              09
            </span>
            <span>Modifications to Terms</span>
          </h2>
          <p>
            We reserve the right to revise or update these Terms at any time without prior notice. Any modifications will become effective immediately upon posting to this page with an updated &quot;Effective Date&quot;. Continued use of the Website constitutes acceptance of the modified Terms.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}

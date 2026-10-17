import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { LegalLayout } from '@/components/LegalLayout';
import Link from 'next/link';
import { Scale, ShieldCheck, ArrowRight, Building, Award, Camera, Box } from 'lucide-react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getContent();
  const siteName = data.settings?.siteName || 'sv7.dev';
  return {
    title: `Legal Notice & Compliance | ${siteName}`,
    description:
      'Legal notice, site operator identification, intellectual property disclosures, 3D CAD engineering assets, and compliance information for sv7.dev.',
    alternates: {
      canonical: `${data.settings?.canonicalUrl || 'https://sv7.dev'}/legal`,
    },
  };
}

export default async function LegalPage() {
  const data = await getContent();

  return (
    <LegalLayout
      title="Legal Notice &amp; Compliance"
      subtitle="Regulatory disclosures, site operator identification, academic disclaimers, 3D CAD engineering assets, and intellectual property notices for sv7.dev."
      documentType="Regulatory Notice"
      lastUpdated="October 17, 2026"
      activeSlug="legal"
      data={data}
    >
      <div className="space-y-8 text-sm text-zinc-300 leading-relaxed">
        {/* Section 1: Site Operator */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              01
            </span>
            <span>Site Operator &amp; Contact Identification</span>
          </h2>
          <p>
            In accordance with international website identification standards and digital disclosure practices, information regarding the operator of this Website is provided below:
          </p>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-zinc-500 uppercase block text-[10px] mb-0.5">Operator Name</span>
              <strong className="text-white text-sm">Shreyaan Vashishtha</strong>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[10px] mb-0.5">Primary Domain</span>
              <strong className="text-white">sv7.dev</strong>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[10px] mb-0.5">Jurisdiction / Location</span>
              <span className="text-zinc-300">Hong Kong SAR</span>
            </div>
            <div>
              <span className="text-zinc-500 uppercase block text-[10px] mb-0.5">Official Inquiries</span>
              <a href="mailto:contact@sv7.dev" className="text-white underline hover:text-zinc-300">
                contact@sv7.dev
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Academic & Institutional Affiliations */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              02
            </span>
            <span>Academic &amp; Research Disclaimers</span>
          </h2>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Building className="w-4 h-4 text-sky-400" />
              <span>Independent Portfolio &amp; Engineering Research</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              This Website is a personal, independent portfolio and engineering archive. While the author is affiliated with the <strong className="text-zinc-200">Department of Mechanical and Aerospace Engineering at the Hong Kong University of Science and Technology (HKUST)</strong>, the views, projects, research writeups, and content expressed on this Website are solely those of Shreyaan Vashishtha. They do not constitute official statements, endorsements, or policy of HKUST or any university affiliated entity.
            </p>
          </div>
        </section>

        {/* Section 3: Student Teams & Collaborative Projects */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              03
            </span>
            <span>Student Engineering Teams &amp; Rocketry Projects</span>
          </h2>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Astrix Rocketry &amp; Collaborative Design</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Project case studies and engineering summaries relating to student engineering teams (including <strong className="text-zinc-200">Astrix Rocketry</strong>, collegiate rocketry competitions, and autonomous flight prototypes) highlight specific individual technical contributions in aerodynamics, airframe design, dual-deploy recovery, and simulation modeling. Co-collaborator contributions are credited where appropriate.
            </p>
          </div>
        </section>

        {/* Section 4: Photography & Cinematography Syndication */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              04
            </span>
            <span>Photography &amp; Motion Syndication Notice</span>
          </h2>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Camera className="w-4 h-4 text-pink-400" />
              <span>@sv.snap &amp; Pexels Portfolio Syndication</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Media presented in the photography gallery (<Link href="/photography" className="text-white underline">/photography</Link>) is originated by Shreyaan Vashishtha. Dynamic video feeds are streamed via Behold.so from Instagram (<strong className="text-zinc-200">@sv.snap</strong>), and curated photography is indexed from Pexels (<strong className="text-zinc-200">portfolio-je8myyb</strong>). All rights in photographic composition, color grading, and technical capture remain with the original author.
            </p>
          </div>
        </section>

        {/* Section 5: 3D CAD Lab & Additive Manufacturing Notice */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              05
            </span>
            <span>3D CAD Lab, Fusion 360 &amp; Additive Manufacturing Notice</span>
          </h2>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-xs">
              <Box className="w-4 h-4 text-amber-400" />
              <span>Autodesk Fusion 360 &amp; Printables Engineering Showcase</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              3D CAD assemblies, stereolithography (.STL) geometries, and mechanical models presented in the CAD Lab (<Link href="/cad" className="text-white underline">/cad</Link>) are designed by Shreyaan Vashishtha using parametric software including Autodesk Fusion 360. Where available, physical fabrication files, 3MF slices, and maker specifications are syndicated through our verified <strong className="text-zinc-200">Printables</strong> maker profile. Physical reproduction of any design requires user validation of slicing parameters, material tensile properties, tolerances, and printer calibration.
            </p>
          </div>
        </section>

        {/* Section 6: Trademark Notice */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-white/10 text-white font-mono text-xs flex items-center justify-center">
              06
            </span>
            <span>Trademarks &amp; Third-Party Rights</span>
          </h2>
          <p className="text-xs text-zinc-400">
            All brand names, logos, software titles, and trademarks referenced on this Website (including but not limited to Autodesk Fusion 360, SolidWorks, Three.js, Printables by Prusa Research a.s., MATLAB, Python, GitHub, Instagram, Meta, Pexels, Canva, Vercel, and HKUST) are the property of their respective owners. Their mention is solely for nominative technical reference, software attribution, and portfolio demonstration, and implies no endorsement, affiliation, or commercial sponsorship.
          </p>
        </section>

        {/* Section 6: Quick Navigation Links */}
        <section className="pt-4 border-t border-white/10 space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            Related Legal Documentation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/terms"
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 text-white flex items-center justify-center">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-zinc-200">
                    Terms of Service
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Licensing, CAD terms, and fabrication disclaimers
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/privacy"
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 text-white flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-zinc-200">
                    Privacy Policy
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    Telemetry, telemetry data, and data rights
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}

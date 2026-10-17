import type { Metadata } from 'next';
import { getContent } from '@/lib/content';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { NotFoundContent } from '@/components/NotFoundContent';

export const metadata: Metadata = {
  title: '404 - Orbital Trajectory Lost | sv7.dev',
  description: 'The requested telemetry path does not exist or has decayed from orbit.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const data = await getContent();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-white/20 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/[0.03] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar
        status={data.profile.status}
        siteName={data.settings.siteName}
        cvUrl={data.settings.cvUrl}
        headerSettings={data.settings.header}
      />

      {/* Main 404 Stage */}
      <main className="flex-1 flex items-center justify-center pt-28 pb-16">
        <NotFoundContent siteName={data.settings.siteName || 'sv7.dev'} />
      </main>

      {/* Footer */}
      <Footer
        siteName={data.settings.siteName}
        footerNote={data.settings.footerNote}
        footerSettings={data.settings.footer}
      />
    </div>
  );
}

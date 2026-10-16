import type { Metadata } from 'next';
import './globals.css';
import { getContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = getContent();
    return {
      title: data.settings?.metaTitle || 'sv7.dev — Engineering & Systems',
      description: data.settings?.metaDescription || 'Official portfolio & systems lab of sv7.dev',
      icons: {
        icon: '/favicon.ico',
      },
    };
  } catch (e) {
    return {
      title: 'sv7.dev',
      description: 'Personal Developer & Engineering Lab',
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}

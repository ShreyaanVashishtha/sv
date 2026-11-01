'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(true);

  useEffect(() => {
    setNavigating(true);
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Ambient Top Route Indicator */}
      {navigating && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none overflow-hidden"
        >
          <div className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] route-progress-bar" />
        </div>
      )}

      {/* Fluid Page Content Transition Wrapper */}
      <div key={pathname} className="page-transition w-full min-h-screen">
        {children}
      </div>
    </>
  );
}

'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 mx-auto flex items-center justify-center font-bold text-rose-400">
            !
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Application Exception</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              A critical runtime error occurred. Please refresh the page to restart the application shell.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-all shadow-md"
          >
            Reload Portfolio
          </button>
        </div>
      </body>
    </html>
  );
}

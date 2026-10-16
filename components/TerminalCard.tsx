'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { TerminalSettings } from '@/types/content';

interface TerminalCardProps {
  handle: string;
  terminalSettings?: TerminalSettings;
}

export function TerminalCard({ handle, terminalSettings }: TerminalCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const windowTitle = terminalSettings?.windowTitle || `bash — ${handle || 'sv7'}.dev`;
  const command = terminalSettings?.commandPrompt || `curl -s https://${handle || 'sv7'}.dev/api/content | jq .profile`;
  const copyText = terminalSettings?.copyButtonText || 'Copy';
  const copiedText = terminalSettings?.copiedText || 'Copied';
  const expandLabel = terminalSettings?.expandText || 'View payload preview';
  const collapseLabel = terminalSettings?.collapseText || 'Hide response preview';

  const defaultOutput = JSON.stringify(
    {
      handle: handle || 'shreyaanv',
      status: 'active',
      university: 'HKUST',
      focus: ['Aerospace Systems', 'Descent Recovery', 'Numerical Python', 'Parametric CAD'],
      availability: 'Open for high-impact projects & engineering research',
    },
    null,
    2
  );

  const displayOutput = terminalSettings?.customOutput || defaultOutput;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-zinc-500 ml-2">{windowTitle}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyText}</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal body */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-emerald-400 font-bold">$</span>
              <span>{command}</span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <span>{expanded ? collapseLabel : expandLabel}</span>
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expanded && (
                <pre className="mt-3 p-4 rounded-xl bg-zinc-950 border border-white/5 text-zinc-300 overflow-x-auto text-xs leading-relaxed animate-fadeIn font-mono">
                  <code>{displayOutput}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

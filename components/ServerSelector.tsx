'use client';

import { useState } from 'react';
import { AlertTriangle, X, CheckCircle2, Wifi } from 'lucide-react';
import type { Stream } from '@/lib/supabase';

type ServerSelectorProps = {
  servers: Stream[];
  activeServerId: string;
  onSelectServer: (server: Stream) => void;
};

const QUALITY_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  FHD:        { label: 'FHD',  dot: 'bg-emerald-400', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  HD:         { label: 'HD',   dot: 'bg-sky-400',     badge: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  SD:         { label: 'SD',   dot: 'bg-amber-400',   badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  'Backup 1': { label: 'BKP1', dot: 'bg-violet-400',  badge: 'text-violet-400 bg-violet-400/10 border-violet-400/20' },
  'Backup 2': { label: 'BKP2', dot: 'bg-rose-400',    badge: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
};

export default function ServerSelector({ servers, activeServerId, onSelectServer }: ServerSelectorProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [reportText, setReportText] = useState('');

  const handleReport = () => {
    if (!reportText.trim()) return;
    setReportSent(true);
    setTimeout(() => { setReportOpen(false); setReportSent(false); setReportText(''); }, 2000);
  };

  return (
    <>
      <div className="mt-2 rounded-xl border border-white/8 bg-[#151d2b] px-4 py-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-slate-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Stream Servers</span>
          </div>
          <button
            onClick={() => setReportOpen(true)}
            className="flex items-center gap-1 text-[11px] font-medium text-amber-500/70 hover:text-amber-400 transition-colors"
          >
            <AlertTriangle className="h-3 w-3" />
            Report Issue
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {servers.map((server, idx) => {
            const isActive = server.id === activeServerId;
            const q = QUALITY_STYLES[server.quality] ?? QUALITY_STYLES.SD;
            return (
              <button
                key={server.id}
                onClick={() => onSelectServer(server)}
                className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'border-red-500/50 bg-red-500/10 text-white shadow-sm'
                    : 'border-white/8 bg-white/4 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400 shadow-sm shadow-green-400/50' : 'bg-slate-600'}`} />
                <span>Server {idx + 1}</span>
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${q.badge}`}>
                  {q.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setReportOpen(false)}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a2233] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">Report Stream Issue</h3>
              </div>
              <button onClick={() => setReportOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {reportSent ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
                <p className="text-sm font-semibold text-white">Report received. Thanks!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the issue (e.g. not loading, buffering, black screen...)"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-red-500/40 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setReportOpen(false)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="flex-1 rounded-xl bg-red-600 py-2 text-sm font-bold text-white hover:bg-red-500 transition-colors active:scale-95"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

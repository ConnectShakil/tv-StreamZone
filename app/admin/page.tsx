'use client';

import { useState } from 'react';
import { Loader2, Play, ArrowLeft, Terminal, CheckCircle2, XCircle, Database } from 'lucide-react';
import Link from 'next/link';

type ResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; data: unknown };

type ActionKey = 'scraper' | 'seed';

export default function AdminPage() {
  const [results, setResults] = useState<Record<ActionKey, ResultState>>({
    scraper: { status: 'idle' },
    seed: { status: 'idle' },
  });

  async function runAction(key: ActionKey, url: string) {
    setResults((prev) => ({ ...prev, [key]: { status: 'loading' } }));
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResults((prev) => ({
        ...prev,
        [key]: { status: res.ok ? 'success' : 'error', data },
      }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [key]: { status: 'error', data: { error: String(err) } },
      }));
    }
  }

  const actions: { key: ActionKey; label: string; loadingLabel: string; route: string; color: string; icon: React.ReactNode; description: string }[] = [
    {
      key: 'scraper',
      label: 'Run Scraper Now',
      loadingLabel: 'Running scraper...',
      route: '/api/scraper?cron_secret=streamzone_scraper_2026',
      color: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 hover:shadow-blue-500/30',
      icon: <Play className="h-4 w-4" />,
      description: 'GET /api/scraper?cron_secret=***',
    },
    {
      key: 'seed',
      label: 'Seed Live Matches & TV Channels',
      loadingLabel: 'Seeding database...',
      route: '/api/seed?cron_secret=streamzone_scraper_2026',
      color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20 hover:shadow-emerald-500/30',
      icon: <Database className="h-4 w-4" />,
      description: 'GET /api/seed?cron_secret=*** — inserts 2 matches + 3 TV channels',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-start px-4 py-14">
      <div className="w-full max-w-xl space-y-8">

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 mb-4">
            <Terminal className="h-4 w-4" />
            <span className="text-xs font-mono uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Control Panel</h1>
          <p className="text-sm text-slate-400">
            Manage live data, seed the database, and trigger the stream scraper.
          </p>
        </div>

        <div className="border-t border-white/8" />

        {/* Actions */}
        <div className="space-y-8">
          {actions.map((action) => {
            const result = results[action.key];
            const isLoading = result.status === 'loading';

            return (
              <div key={action.key} className="space-y-3">
                <button
                  onClick={() => runAction(action.key, action.route)}
                  disabled={isLoading}
                  className={`flex items-center gap-2.5 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${action.color}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {action.loadingLabel}
                    </>
                  ) : (
                    <>
                      {action.icon}
                      {action.label}
                    </>
                  )}
                </button>
                <p className="text-xs text-slate-600 font-mono">{action.description}</p>

                {result.status !== 'idle' && result.status !== 'loading' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {result.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          result.status === 'success' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {result.status === 'success' ? 'Success' : 'Error'}
                      </span>
                    </div>
                    <pre className="w-full overflow-x-auto rounded-xl border border-white/8 bg-[#1a2233] p-4 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back link */}
        <div className="border-t border-white/8 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

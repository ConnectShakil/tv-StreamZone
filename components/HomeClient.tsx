'use client';

import { useState } from 'react';
import { CalendarDays, Radio, Tv2 } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import ServerSelector from '@/components/ServerSelector';
import MatchCard from '@/components/MatchCard';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import { Skeleton } from '@/components/ui/skeleton';
import { getStreamsByMatchId, type Match, type Stream, type Announcement } from '@/lib/supabase';

const DEFAULT_ANNOUNCEMENT =
  'LIVE NOW: Brazil vs Japan! All servers are running smoothly. Report if you face any issues!';

function isLive(m: Match) { return m.status?.toLowerCase() === 'live'; }
function isUpcoming(m: Match) { return m.status?.toLowerCase() === 'upcoming'; }

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

type Props = {
  initialMatches: Match[];
  initialAnnouncement: Announcement | null;
};

export default function HomeClient({ initialMatches, initialAnnouncement }: Props) {
  const liveMatches = initialMatches.filter(isLive);
  const upcomingMatches = initialMatches.filter(isUpcoming);

  const firstMatch = liveMatches[0] ?? initialMatches[0] ?? null;
  const initialStreams: Stream[] = (firstMatch?.streams ?? []) as Stream[];

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(firstMatch);
  const [streams, setStreams] = useState<Stream[]>(initialStreams);
  const [activeStream, setActiveStream] = useState<Stream | null>(initialStreams[0] ?? null);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming'>('live');
  const [loadingStreams, setLoadingStreams] = useState(false);

  async function selectMatch(match: Match) {
    setSelectedMatch(match);
    if (isLive(match)) {
      const embedded = (match.streams ?? []) as Stream[];
      if (embedded.length > 0) {
        setStreams(embedded);
        setActiveStream(embedded[0]);
      } else {
        setLoadingStreams(true);
        const data = await getStreamsByMatchId(match.id);
        setStreams(data);
        setActiveStream(data[0] ?? null);
        setLoadingStreams(false);
      }
    } else {
      setStreams([]);
      setActiveStream(null);
    }
  }

  const displayedMatches = activeTab === 'live' ? liveMatches : upcomingMatches;

  const matchTitle = selectedMatch
    ? selectedMatch.team_b
      ? `${selectedMatch.team_a} vs ${selectedMatch.team_b}`
      : selectedMatch.team_a
    : 'Live Match';

  return (
    <div className="relative min-h-screen bg-[#111827] text-white">

      {/* ── Sticky social sidebar (home page only, lg+ screens) ── */}
      <aside className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-2 lg:flex">
        <a
          href="https://www.facebook.com/AiForMaster/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Facebook"
          className="flex flex-col items-center gap-2 rounded-r-2xl bg-[#1877F2] px-2.5 py-5 shadow-xl transition-all duration-200 hover:bg-[#166FE5] hover:px-4"
        >
          <FacebookIcon />
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-white"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Facebook
          </span>
        </a>
        <a
          href="https://t.me/AiforMaster"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow on Telegram"
          className="flex flex-col items-center gap-2 rounded-r-2xl bg-[#229ED9] px-2.5 py-5 shadow-xl transition-all duration-200 hover:bg-[#1A8CC2] hover:px-4"
        >
          <TelegramIcon />
          <span
            className="text-[11px] font-bold uppercase tracking-widest text-white"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Telegram
          </span>
        </a>
      </aside>

      {/* ── Top brand bar ── */}
      <div className="border-b border-white/8 bg-[#0d1117] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tv2 className="h-5 w-5 text-red-500" />
          <span className="text-base font-bold tracking-tight">
            <span className="text-white">Stream</span>
            <span className="text-red-500">Zone</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          {liveMatches.length} LIVE
        </div>
      </div>

      {/* ── Announcement Banner ── */}
      <AnnouncementBanner text={initialAnnouncement?.text ?? DEFAULT_ANNOUNCEMENT} />

      <div className="mx-auto max-w-5xl px-3 py-4 space-y-4">

        {/* ── Player ── */}
        {selectedMatch ? (
          <div className="space-y-0">
            {isLive(selectedMatch) ? (
              <>
                <VideoPlayer
                  streamUrl={activeStream?.stream_url ?? ''}
                  matchTitle={matchTitle}
                  isLive={true}
                />
                {loadingStreams ? (
                  <div className="mt-2 rounded-xl border border-white/8 bg-[#151d2b] px-4 py-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Skeleton key={n} className="h-9 w-28 rounded-lg bg-white/5" />
                      ))}
                    </div>
                  </div>
                ) : streams.length > 0 ? (
                  <ServerSelector
                    servers={streams}
                    activeServerId={activeStream?.id ?? ''}
                    onSelectServer={(s) => setActiveStream(s)}
                  />
                ) : null}
              </>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-[#0d1117] border border-white/8">
                {selectedMatch.thumbnail && (
                  <img
                    src={selectedMatch.thumbnail}
                    alt={matchTitle}
                    className="h-full w-full object-cover opacity-25"
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <CalendarDays className="h-10 w-10 text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400">Match Not Started Yet</p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* ── Match list ── */}
        <div>
          <div className="mb-3 flex items-center gap-1 border-b border-white/8 pb-0">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors -mb-px ${
                activeTab === 'live'
                  ? 'border-red-500 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              Live{' '}
              <span className="rounded bg-red-600/80 px-1.5 py-0.5 text-[10px] font-bold">
                {liveMatches.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors -mb-px ${
                activeTab === 'upcoming'
                  ? 'border-slate-400 text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Upcoming{' '}
              <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                {upcomingMatches.length}
              </span>
            </button>
          </div>

          {displayedMatches.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-600">
              No {activeTab} matches right now. Check back soon!
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-white/5 rounded-xl border border-white/8 overflow-hidden">
              {displayedMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isSelected={selectedMatch?.id === match.id}
                  onSelect={selectMatch}
                />
              ))}
            </div>
          )}
        </div>

        <p className="pb-4 text-center text-[11px] text-slate-700">
          StreamZone &copy; {new Date().getFullYear()} &mdash; Free live sports. No subscription required.
        </p>
      </div>
    </div>
  );
}

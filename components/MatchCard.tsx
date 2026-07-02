'use client';

import { Clock, Tv } from 'lucide-react';
import type { Match } from '@/lib/supabase';

type MatchCardProps = {
  match: Match;
  isSelected: boolean;
  onSelect: (match: Match) => void;
};

const FLAG_EMOJIS: Record<string, string> = {
  AR: '🇦🇷', AU: '🇦🇺', BE: '🇧🇪', BR: '🇧🇷', DE: '🇩🇪',
  ES: '🇪🇸', FR: '🇫🇷', GB: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', IN: '🇮🇳', IT: '🇮🇹',
  JP: '🇯🇵', LK: '🇱🇰', NL: '🇳🇱', NZ: '🇳🇿', PT: '🇵🇹',
  RS: '🇷🇸', US: '🇺🇸', ZA: '🇿🇦', PK: '🇵🇰',
};

const SPORT_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  Football:   { icon: '⚽', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  Cricket:    { icon: '🏏', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  Basketball: { icon: '🏀', color: 'text-orange-400',  bg: 'bg-orange-500/10 border-orange-500/20' },
  Tennis:     { icon: '🎾', color: 'text-yellow-400',  bg: 'bg-yellow-500/10 border-yellow-500/20' },
};

function formatTime(isoString: string | null): string {
  if (!isoString) return '--:--';
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function LivePulse() {
  return (
    <span className="flex items-center gap-0.5 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider leading-tight">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      LIVE
    </span>
  );
}

function TvChannelCard({ match, isSelected, onSelect }: MatchCardProps) {
  return (
    <button
      onClick={() => onSelect(match)}
      className={`group flex w-full items-center gap-3 px-3 py-3 text-left transition-colors duration-150 ${
        isSelected
          ? 'bg-cyan-600/10 border-l-[3px] border-cyan-500'
          : 'bg-[#1a2233] hover:bg-white/5 border-l-[3px] border-transparent'
      }`}
    >
      {/* TV icon + live badge */}
      <div className="flex w-14 shrink-0 flex-col items-center gap-1">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          isSelected ? 'bg-cyan-500/20' : 'bg-cyan-500/10 group-hover:bg-cyan-500/15'
        } transition-colors`}>
          <Tv className="h-4 w-4 text-cyan-400" />
        </div>
        <LivePulse />
      </div>

      {/* Channel name + 24/7 badge */}
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
        <span className="truncate text-sm font-bold text-white">{match.team_a}</span>
        <span className="text-[10px] text-slate-500">{match.league ?? 'Live TV'}</span>
      </div>

      {/* 24/7 LIVE badge */}
      <div className="shrink-0">
        <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400 tracking-wide">
          24/7 LIVE
        </span>
      </div>
    </button>
  );
}

export default function MatchCard({ match, isSelected, onSelect }: MatchCardProps) {
  if (match.sport === 'tv') {
    return <TvChannelCard match={match} isSelected={isSelected} onSelect={onSelect} />;
  }

  const isLive = match.status?.toLowerCase() === 'live';
  const flagA = match.team_a_flag ? (FLAG_EMOJIS[match.team_a_flag] ?? '🏳️') : '';
  const flagB = match.team_b_flag ? (FLAG_EMOJIS[match.team_b_flag] ?? '🏳️') : '';
  const sport = SPORT_CONFIG[match.sport] ?? { icon: '🎯', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' };

  return (
    <button
      onClick={() => onSelect(match)}
      className={`group flex w-full items-center gap-2 px-3 py-3 text-left transition-colors duration-150 ${
        isSelected
          ? 'bg-red-600/10 border-l-[3px] border-red-500'
          : 'bg-[#1a2233] hover:bg-white/5 border-l-[3px] border-transparent'
      }`}
    >
      {/* Sport icon + status */}
      <div className="flex w-20 shrink-0 flex-col items-center gap-1">
        <span className="text-xl leading-none">{sport.icon}</span>
        {isLive ? (
          <LivePulse />
        ) : (
          <span className="flex items-center gap-0.5 text-[10px] text-slate-500">
            <Clock className="h-2.5 w-2.5" />
            {formatTime(match.match_time)}
          </span>
        )}
      </div>

      {/* Team A — right aligned */}
      <div className="flex flex-1 flex-col items-end gap-0.5 overflow-hidden">
        <span className="text-base leading-none">{flagA}</span>
        <span className="truncate text-sm font-semibold text-white">{match.team_a}</span>
      </div>

      {/* Score / VS */}
      <div className="w-14 shrink-0 text-center">
        {isLive ? (
          <div className="flex flex-col items-center">
            <span className="text-lg font-black text-white tabular-nums leading-tight">
              {match.score_a ?? 0}–{match.score_b ?? 0}
            </span>
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">LIVE</span>
          </div>
        ) : (
          <span className="text-xs font-bold text-slate-600">VS</span>
        )}
      </div>

      {/* Team B — left aligned */}
      <div className="flex flex-1 flex-col items-start gap-0.5 overflow-hidden">
        <span className="text-base leading-none">{flagB}</span>
        <span className="truncate text-sm font-semibold text-white">{match.team_b}</span>
      </div>

      {/* League + sport pill */}
      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        {match.league && (
          <span className="max-w-[110px] truncate text-[10px] text-slate-500">{match.league}</span>
        )}
        <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${sport.color} ${sport.bg}`}>
          {sport.icon} {match.sport}
        </span>
      </div>
    </button>
  );
}

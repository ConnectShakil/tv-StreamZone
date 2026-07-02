'use client';

import { useState, useEffect, useRef } from 'react';
import { Lock, Facebook, Play, Loader2 } from 'lucide-react';

type VideoPlayerProps = {
  streamUrl: string;
  matchTitle: string;
  isLive?: boolean;
};

export default function VideoPlayer({ streamUrl, matchTitle, isLive = false }: VideoPlayerProps) {
  const [hasFollowed, setHasFollowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStorage.getItem('hasFollowed') === 'true') setHasFollowed(true);
  }, []);

  useEffect(() => {
    if (!hasFollowed || !videoRef.current || !streamUrl) return;
    const video = videoRef.current;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.play().catch(() => {});
    } else {
      video.src = streamUrl;
      video.load();
      video.play().catch(() => {});
    }
  }, [hasFollowed, streamUrl]);

  const handleFollowClick = () => {
    setIsLoading(true);
    window.open('https://facebook.com/aiformaster', '_blank');
    setTimeout(() => {
      localStorage.setItem('hasFollowed', 'true');
      setHasFollowed(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black border border-white/8">
      <div className="relative aspect-video w-full">
        {/* Video element */}
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          controls={hasFollowed}
          playsInline
          preload="none"
          poster="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1280"
        />

        {/* Big flashing LIVE badge — top right, above gate */}
        {isLive && (
          <div className="absolute right-3 top-3 z-30 flex items-center gap-2 rounded-lg bg-red-600 px-3.5 py-2 shadow-lg shadow-red-900/60">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
            </span>
            <span className="text-base font-black uppercase tracking-widest text-white">LIVE</span>
          </div>
        )}

        {/* ===== FOLLOW GATE ===== */}
        {!hasFollowed && (
          <div className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
            {/* Blurred stadium background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1280)`,
                filter: 'blur(14px)',
                transform: 'scale(1.1)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

            {/* Gate card */}
            <div className="relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-white/15 bg-black/40 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
              {/* Lock */}
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-lg">
                  <Lock className="h-7 w-7 text-white" />
                </div>
              </div>

              <h2 className="mb-1.5 text-center text-xl font-black text-white">
                Unlock Free Live Stream
              </h2>
              <p className="mb-1 text-center text-sm text-white/60">
                Watching: <span className="font-bold text-white">{matchTitle}</span>
              </p>
              <p className="mb-5 text-center text-xs text-white/45">
                Follow our Facebook page once to unlock all streams — completely free, no sign-up.
              </p>

              {/* CTA */}
              <button
                onClick={handleFollowClick}
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-xl bg-[#1877F2] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-700/40 transition-all duration-200 hover:bg-[#1464d8] hover:shadow-blue-700/60 active:scale-[0.98] disabled:opacity-60"
              >
                <span className="flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Unlocking Stream...
                    </>
                  ) : (
                    <>
                      <Facebook className="h-4 w-4" />
                      Follow &amp; Watch Free
                    </>
                  )}
                </span>
                {/* Shine sweep */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-white/30">
                <span>✓ 100% Free</span>
                <span>·</span>
                <span>✓ No Account</span>
                <span>·</span>
                <span>✓ HD Quality</span>
              </div>
            </div>
          </div>
        )}

        {/* Playing indicator (after gate unlocked) */}
        {hasFollowed && (
          <div className="absolute left-2 top-2 z-30 flex items-center gap-1 rounded-md bg-green-500/90 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm shadow-sm">
            <Play className="h-3 w-3 fill-white" /> Playing
          </div>
        )}
      </div>
    </div>
  );
}

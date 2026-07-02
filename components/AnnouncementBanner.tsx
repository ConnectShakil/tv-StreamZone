'use client';

type AnnouncementBannerProps = {
  text: string;
};

export default function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  return (
    <div className="overflow-hidden bg-red-600 border-b border-red-700">
      <div className="flex items-center">
        <div className="flex shrink-0 items-center gap-1.5 border-r border-red-500 bg-red-700 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-white">Live</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee whitespace-nowrap py-1.5 text-xs font-semibold text-white">
            <span className="px-6">{text}</span>
            <span className="px-6">{text}</span>
            <span className="px-6">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

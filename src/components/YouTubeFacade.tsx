import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  posterSrc?: string;
  className?: string;
}

/**
 * Click-to-Play facade for YouTube embeds so heavy YouTube scripts are not loaded
 * until the visitor explicitly clicks to watch the video.
 */
export default function YouTubeFacade({
  videoId,
  title,
  posterSrc,
  className = '',
}: YouTubeFacadeProps) {
  const [activated, setActivated] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(
    posterSrc || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  );

  if (activated) {
    return (
      <div className={`w-full aspect-video bg-black overflow-hidden ${className}`}>
        <iframe
          className="w-full h-full border-0"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Atskaņot video: ${title}`}
      className={`group relative w-full aspect-video bg-[#0a0a0c] overflow-hidden block text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#dc2626] ${className}`}
    >
      <img
        src={thumbSrc}
        alt={title}
        width={480}
        height={360}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (thumbSrc !== '/assets_gallery/trenini/karate-web-21-1.webp') {
            setThumbSrc('/assets_gallery/trenini/karate-web-21-1.webp');
          }
        }}
        className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/35 pointer-events-none" />

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
        <span className="w-16 h-16 sm:w-20 sm:h-20 bg-[#dc2626] group-hover:bg-[#b91c1c] rounded-full flex items-center justify-center shadow-2xl border-2 border-white/80 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
          <Play size={28} className="text-white fill-white ml-1" aria-hidden="true" />
        </span>
        <span className="px-4 py-1.5 rounded-full bg-black/75 border border-white/20 text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
          Skatīties video
        </span>
      </span>
    </button>
  );
}

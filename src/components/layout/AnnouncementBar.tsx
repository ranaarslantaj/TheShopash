'use client';

import React from 'react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const AnnouncementBar = () => {
  const settings = useSiteSettings();

  if (!settings.announcementEnabled || !settings.announcement.trim()) return null;

  const message = settings.announcement.trim();
  // Repeats per track — keeps the strip dense across any viewport width.
  const REPS = 6;

  // One full-width "track" of repeated message + sparkle separator.
  // We render two identical tracks side-by-side so the marquee can loop
  // seamlessly (when track 1 scrolls off, track 2 takes its place — the
  // animation jumps from -50% back to 0% invisibly).
  const renderTrack = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {Array.from({ length: REPS }).map((_, i) => (
        <React.Fragment key={i}>
          <span className="px-8 text-[10px] uppercase tracking-[0.5em] text-white/85 whitespace-nowrap">
            {message}
          </span>
          <span className="text-primary text-xs select-none">✦</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-[var(--foreground)] text-white overflow-hidden group">
      <div className="flex items-center py-2.5 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:[animation:none]">
        {renderTrack(false)}
        {renderTrack(true)}
      </div>
    </div>
  );
};

export default AnnouncementBar;

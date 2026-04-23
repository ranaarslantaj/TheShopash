'use client';

import React from 'react';

const MESSAGES = [
  'Complimentary worldwide shipping — fully insured',
  '100% authentication guarantee on every timepiece',
  'Lifetime concierge support · Professional servicing available',
  'Established 2024 · A house for collectors',
];

const AnnouncementBar = () => {
  return (
    <div className="w-full bg-[var(--foreground)] text-white overflow-hidden">
      <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] py-2">
        {[...MESSAGES, ...MESSAGES].map((msg, i) => (
          <span
            key={i}
            className="px-8 text-[10px] uppercase tracking-[0.4em] text-white/80 flex items-center gap-8 shrink-0"
          >
            {msg}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;

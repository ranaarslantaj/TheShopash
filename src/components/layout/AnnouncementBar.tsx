'use client';

import React from 'react';
import { useSiteSettings } from '@/lib/useSiteSettings';

const AnnouncementBar = () => {
  const settings = useSiteSettings();

  if (!settings.announcementEnabled || !settings.announcement.trim()) return null;

  return (
    <div className="w-full bg-[var(--foreground)] text-white">
      <div className="container mx-auto px-6 py-2.5 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/85">
          {settings.announcement}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;

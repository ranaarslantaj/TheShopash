'use client';

import { useEffect, useState } from 'react';
import { getSiteSettings, SiteSettings, DEFAULT_SETTINGS } from './db';

/**
 * Lightweight client-side cache so the settings doc only fetches once per page load
 * even if many components consume the hook.
 */
let cached: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;

const loadOnce = async () => {
  if (cached) return cached;
  if (!inflight) {
    inflight = getSiteSettings()
      .then((s) => {
        cached = s;
        return s;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
};

/**
 * Returns site-wide settings. Always renders immediately with defaults so there's
 * no layout flash, then hydrates with real values once the Firestore doc loads.
 */
export const useSiteSettings = (): SiteSettings => {
  const [settings, setSettings] = useState<SiteSettings>(cached ?? DEFAULT_SETTINGS);
  useEffect(() => {
    if (cached) {
      setSettings(cached);
      return;
    }
    let mounted = true;
    loadOnce().then((s) => {
      if (mounted) setSettings(s);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return settings;
};

/** Bust the in-memory cache after the admin saves changes. */
export const clearSiteSettingsCache = () => {
  cached = null;
  inflight = null;
};

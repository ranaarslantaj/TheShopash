/**
 * Pakistani courier configuration.
 *
 * Each entry maps a `Courier` key to display name + tracking URL builder.
 * Adding a new courier = one entry here; everything in admin / customer /
 * email layers picks it up automatically.
 *
 * If a courier ever changes their public tracking URL, update only the
 * `trackingUrl` function below.
 */

export type Courier = 'tcs' | 'trax' | 'leopards' | 'mnp' | 'other';

export interface CourierConfig {
  key: Courier;
  name: string;
  /** Returns the public tracking URL for a given CN / AWB / consignment number. */
  trackingUrl: (cn: string) => string;
  /** Optional brand colour for accents on the customer-facing track page. */
  accent?: string;
  /** Sender / merchant portal URL — handy for admin reference. */
  portalUrl?: string;
}

export const COURIERS: Record<Exclude<Courier, 'other'>, CourierConfig> = {
  tcs: {
    key: 'tcs',
    name: 'TCS Express',
    trackingUrl: (cn) => `https://www.tcsexpress.com/track/${encodeURIComponent(cn.trim())}`,
    accent: '#E30613', // TCS red
    portalUrl: 'https://www.tcsexpress.com',
  },
  trax: {
    key: 'trax',
    name: 'Trax',
    trackingUrl: (cn) =>
      `https://trax.pk/tracking/?awb=${encodeURIComponent(cn.trim())}`,
    accent: '#0E2D5C',
    portalUrl: 'https://trax.pk',
  },
  leopards: {
    key: 'leopards',
    name: 'Leopards',
    trackingUrl: (cn) =>
      `https://www.leopardscourier.com/tracking?id=${encodeURIComponent(cn.trim())}`,
    accent: '#F39200',
    portalUrl: 'https://www.leopardscourier.com',
  },
  mnp: {
    key: 'mnp',
    name: 'M&P Express',
    trackingUrl: (cn) =>
      `https://mulphilog.com/track-trace?cn=${encodeURIComponent(cn.trim())}`,
    accent: '#003F87',
    portalUrl: 'https://mulphilog.com',
  },
};

export const COURIER_KEYS: Courier[] = ['tcs', 'trax', 'leopards', 'mnp', 'other'];

/** Friendly label for a courier key (incl. the "other" fallback). */
export const courierLabel = (key?: Courier | string | null): string => {
  if (!key || key === 'other') return 'Other / Manual';
  return COURIERS[key as keyof typeof COURIERS]?.name ?? 'Other / Manual';
};

/**
 * Builds the public tracking URL for an order. Returns null if there's no
 * tracking number, or the courier is unknown / "other" (shipper picked the
 * courier off-platform).
 */
export const getCourierTrackingUrl = (
  courier?: Courier | string | null,
  trackingNumber?: string | null
): string | null => {
  if (!trackingNumber || !trackingNumber.trim()) return null;
  if (!courier || courier === 'other') return null;
  const cfg = COURIERS[courier as keyof typeof COURIERS];
  if (!cfg) return null;
  return cfg.trackingUrl(trackingNumber);
};

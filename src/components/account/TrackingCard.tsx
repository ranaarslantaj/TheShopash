import React from 'react';
import { ExternalLink, Truck } from 'lucide-react';
import { Order } from '@/lib/db';
import { courierLabel, getCourierTrackingUrl } from '@/lib/couriers';

interface Props {
  order: Order;
}

const TrackingCard: React.FC<Props> = ({ order }) => {
  if (!order.trackingNumber) return null;

  const courier = order.courier;
  const trackingUrl = getCourierTrackingUrl(courier, order.trackingNumber);
  const label = courierLabel(courier);

  return (
    <div className="bg-primary/[0.04] border border-primary/30 p-5 space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary flex items-center gap-1.5">
            <Truck className="w-3 h-3" /> {label}
          </p>
          <p className="font-mono text-base text-[var(--foreground)] mt-1.5 tracking-wider">
            {order.trackingNumber}
          </p>
        </div>
        {trackingUrl && (
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--foreground)] transition-colors whitespace-nowrap"
          >
            Track with {label} <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      {!trackingUrl && courier && courier !== 'other' && (
        <p className="text-[11px] text-[var(--muted)]">
          Live tracking link unavailable — please contact our concierge for an update.
        </p>
      )}
    </div>
  );
};

export default TrackingCard;

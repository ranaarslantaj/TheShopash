'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Loader2,
  Save,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { getOrderById, updateOrder, Order, OrderStatus, formatOrderDate } from '@/lib/db';
import { COURIERS, COURIER_KEYS, Courier, getCourierTrackingUrl, courierLabel } from '@/lib/couriers';
import { formatPrice } from '@/lib/utils';
import StatusPill from '@/components/account/StatusPill';
import OrderTimeline from '@/components/account/OrderTimeline';

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'out-for-delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [courier, setCourier] = useState<Courier>('other');
  const [trackingNumber, setTrackingNumber] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getOrderById(id).then((res) => {
      setOrder(res);
      if (res) {
        setStatus(res.status);
        setCourier((res.courier as Courier) ?? 'other');
        setTrackingNumber(res.trackingNumber ?? '');
      }
      setLoading(false);
    });
  }, [id]);

  const dirty =
    !!order &&
    (status !== order.status ||
      (trackingNumber || '') !== (order.trackingNumber || '') ||
      (courier || 'other') !== (order.courier || 'other'));

  const handleSave = async () => {
    if (!order || !dirty) return;
    setSaving(true);
    setError('');
    try {
      const trimmed = trackingNumber.trim();
      await updateOrder(order.id!, {
        status,
        courier,
        trackingNumber: trimmed,
      });
      setOrder({ ...order, status, courier, trackingNumber: trimmed });
      setSavedAt(Date.now());
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const liveTrackingUrl = getCourierTrackingUrl(courier, trackingNumber);

  const advanceStatus = (next: OrderStatus) => {
    setStatus(next);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-10 h-10 text-[var(--muted)]/40 mx-auto" />
        <p className="font-serif text-lg text-[var(--foreground)]">Order not found.</p>
        <Link
          href="/admin/orders"
          className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary pb-1"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.push('/admin/orders')}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-3 h-3" /> All orders
        </button>
        <div className="flex items-center gap-3">
          {savedAt && !dirty && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-green-600">Saved</span>
          )}
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Order</span>
          <h1 className="font-mono text-2xl text-[var(--foreground)] mt-2">
            #{order.id?.slice(0, 14).toUpperCase()}
          </h1>
          <p className="text-xs text-[var(--muted)] mt-2">
            Placed {formatOrderDate(order.createdAt)}
          </p>
        </div>
        <StatusPill status={order.status} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Status workflow */}
      <section className="bg-white border border-[var(--border)] p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-[var(--foreground)]">Fulfilment</h2>
          {dirty && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Unsaved changes</span>
          )}
        </div>

        <OrderTimeline status={status} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Status select */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
              Update status
            </label>
            <select
              value={status}
              onChange={(e) => advanceStatus(e.target.value as OrderStatus)}
              className="w-full bg-white border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Courier */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
              Courier
            </label>
            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value as Courier)}
              className="w-full bg-white border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              {COURIER_KEYS.map((k) => (
                <option key={k} value={k}>
                  {courierLabel(k)}
                </option>
              ))}
            </select>
          </div>

          {/* Tracking number */}
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
              Tracking number
            </label>
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder={
                courier === 'tcs'
                  ? 'e.g. 5012345678'
                  : courier === 'trax'
                  ? 'e.g. TX0001234567'
                  : courier === 'leopards'
                  ? 'e.g. 12345678'
                  : courier === 'mnp'
                  ? 'e.g. 9876543210'
                  : 'CN / AWB number'
              }
              className="w-full bg-white border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Live tracking link preview */}
        {liveTrackingUrl ? (
          <div className="bg-primary/[0.04] border border-primary/30 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Tracking link active</p>
              <p className="text-xs text-[var(--foreground)] mt-1">
                Customer will see a {courierLabel(courier)} tracking button on their order page.
              </p>
            </div>
            <a
              href={liveTrackingUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-white transition-colors"
            >
              Open tracking <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : courier !== 'other' && trackingNumber ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2.5">
            Tracking number set, but couldn&apos;t build a link — check the courier selection.
          </div>
        ) : null}

        {/* Quick advance buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {STATUSES.filter((s) => s.value !== 'cancelled' && s.value !== status).map((s) => (
            <button
              key={s.value}
              onClick={() => advanceStatus(s.value)}
              className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] border border-[var(--border)] px-3 py-1.5 hover:text-[var(--foreground)] hover:border-[var(--foreground)]/40 transition-colors"
            >
              Mark {s.label}
            </button>
          ))}
          {status !== 'cancelled' && (
            <button
              onClick={() => advanceStatus('cancelled')}
              className="text-[10px] uppercase tracking-[0.3em] text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors"
            >
              Cancel order
            </button>
          )}
        </div>
      </section>

      {/* Customer + payment grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <section className="bg-white border border-[var(--border)] p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-lg text-[var(--foreground)] flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Customer & shipping
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-[var(--foreground)]">{order.customerName}</p>
            <p className="text-[var(--muted)] flex items-center gap-2">
              <Mail className="w-3 h-3" /> {order.email}
            </p>
            <p className="text-[var(--muted)] flex items-center gap-2">
              <Phone className="w-3 h-3" /> {order.phone}
            </p>
            <div className="text-[var(--muted)] flex items-start gap-2 pt-2">
              <MapPin className="w-3 h-3 mt-1 shrink-0" />
              <span>
                {order.address}
                <br />
                {order.country}
              </span>
            </div>
            {order.userId && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] pt-3 border-t border-[var(--border)]">
                Account: <span className="font-mono">{order.userId.slice(0, 14)}</span>
              </p>
            )}
            {!order.userId && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] pt-3 border-t border-[var(--border)]">
                Guest checkout
              </p>
            )}
          </div>
        </section>

        <section className="bg-white border border-[var(--border)] p-6 space-y-4 shadow-sm">
          <h3 className="font-serif text-lg text-[var(--foreground)] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" /> Payment
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[var(--muted)]">
              <span>Subtotal</span>
              <span>{formatPrice(order.totalPricePKR, 'PKR')}</span>
            </div>
            <div className="flex justify-between text-[var(--muted)]">
              <span>Shipping</span>
              <span className="text-primary">Complimentary</span>
            </div>
            <div className="h-px bg-[var(--border)] my-2" />
            <div className="flex justify-between items-baseline">
              <span className="text-[var(--foreground)]">Total</span>
              <div className="text-right">
                <p className="text-primary text-lg">{formatPrice(order.totalPricePKR, 'PKR')}</p>
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
                  ≈ {formatPrice(order.totalPriceUSD, 'USD')}
                </p>
              </div>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] pt-3 border-t border-[var(--border)]">
              <span>Method</span>
              <span>{order.paymentMethod}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Items */}
      <section>
        <h2 className="font-serif text-xl text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" /> Items ({order.products?.length ?? 0})
        </h2>
        <div className="bg-white border border-[var(--border)] divide-y divide-[var(--border)] shadow-sm">
          {order.products?.map((p, i) => (
            <div key={i} className="flex gap-4 p-4 items-center">
              {p.image ? (
                <div className="w-16 h-20 bg-[var(--soft)] shrink-0 overflow-hidden">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-20 bg-[var(--soft)] shrink-0 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[var(--muted)]/50" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {p.brand && (
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">{p.brand}</p>
                )}
                <p className="font-serif text-base text-[var(--foreground)] truncate">{p.title}</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Qty: {p.quantity} · Unit {formatPrice(p.pricePKR, 'PKR')}
                </p>
              </div>
              <p className="text-sm text-[var(--foreground)] tabular-nums whitespace-nowrap font-medium">
                {formatPrice(p.pricePKR * p.quantity, 'PKR')}
              </p>
              <Link
                href={`/product/${p.id}`}
                target="_blank"
                rel="noopener"
                aria-label="Open product page"
                className="text-[var(--muted)] hover:text-primary transition-colors p-1"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Floating save reminder when dirty */}
      {dirty && (
        <div className="sticky bottom-6 z-30 mx-auto w-fit">
          <div className="bg-[var(--foreground)] text-white px-5 py-3 shadow-lg flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/70">Unsaved changes</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-1.5 text-[11px] uppercase tracking-[0.3em] hover:bg-white hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" /> Save
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

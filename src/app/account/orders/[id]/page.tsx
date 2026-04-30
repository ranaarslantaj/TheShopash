'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AccountShell from '@/components/account/AccountShell';
import StatusPill from '@/components/account/StatusPill';
import OrderTimeline from '@/components/account/OrderTimeline';
import { getOrderById, Order, formatOrderDate } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { Loader2, ChevronLeft } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    getOrderById(params.id as string).then((res) => {
      setOrder(res);
      setLoading(false);
    });
  }, [params?.id]);

  return (
    <AccountShell title={loading ? 'Order Details' : `Order #${order?.id?.slice(0, 10).toUpperCase()}`} eyebrow="Order Details">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors mb-8"
      >
        <ChevronLeft className="w-3 h-3" /> Back to all orders
      </Link>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : !order ? (
        <p className="text-sm text-[var(--muted)]">Order not found.</p>
      ) : order.userId && user && order.userId !== user.uid ? (
        <p className="text-sm text-red-600">You don&apos;t have access to this order.</p>
      ) : (
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-6 border-b border-[var(--border)]">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Placed on</p>
              <p className="font-serif text-lg text-[var(--foreground)] mt-1">{formatOrderDate(order.createdAt)}</p>
            </div>
            <StatusPill status={order.status} />
          </div>

          {/* Timeline */}
          <OrderTimeline status={order.status} />

          {/* Items */}
          <section>
            <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">Items</h2>
            <div className="border border-[var(--border)] divide-y divide-[var(--border)] bg-white">
              {order.products.map((p, i) => (
                <div key={i} className="flex gap-5 p-5">
                  {p.image && (
                    <div className="w-20 h-24 bg-[var(--soft)] shrink-0 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {p.brand && (
                      <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">{p.brand}</p>
                    )}
                    <p className="font-serif text-base text-[var(--foreground)] truncate">{p.title}</p>
                    <p className="text-xs text-[var(--muted)] mt-1">Quantity: {p.quantity}</p>
                  </div>
                  <p className="font-medium text-sm text-[var(--foreground)] whitespace-nowrap">
                    {formatPrice(p.pricePKR * p.quantity, 'PKR')}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Totals + Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--soft)] border border-[var(--border)] p-6 space-y-3">
              <h3 className="font-serif text-lg text-[var(--foreground)] mb-3">Shipping Address</h3>
              <p className="text-sm text-[var(--foreground)]">{order.customerName}</p>
              <p className="text-sm text-[var(--muted)]">{order.address}</p>
              <p className="text-sm text-[var(--muted)]">{order.country}</p>
              <p className="text-sm text-[var(--muted)]">{order.phone}</p>
              <p className="text-sm text-[var(--muted)]">{order.email}</p>
            </div>
            <div className="bg-[var(--soft)] border border-[var(--border)] p-6 space-y-3">
              <h3 className="font-serif text-lg text-[var(--foreground)] mb-3">Payment Summary</h3>
              <div className="flex justify-between text-sm text-[var(--muted)]">
                <span>Subtotal</span>
                <span>{formatPrice(order.totalPricePKR, 'PKR')}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--muted)]">
                <span>Shipping</span>
                <span className="text-primary">Complimentary</span>
              </div>
              <div className="h-px bg-[var(--border)] my-2" />
              <div className="flex justify-between text-base">
                <span className="text-[var(--foreground)]">Total</span>
                <span className="text-primary font-medium">{formatPrice(order.totalPricePKR, 'PKR')}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--muted)] pt-2">
                <span>Method</span>
                <span className="uppercase tracking-widest">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className="bg-primary/5 border border-primary/30 p-5 text-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Tracking Number</p>
              <p className="font-mono text-[var(--foreground)]">{order.trackingNumber}</p>
            </div>
          )}
        </div>
      )}
    </AccountShell>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AccountShell from '@/components/account/AccountShell';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByUserId, Order, formatOrderDate } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingBag, ChevronRight } from 'lucide-react';
import StatusPill from '@/components/account/StatusPill';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrdersByUserId(user.uid).then((res) => {
      setOrders(res);
      setLoading(false);
    });
  }, [user]);

  return (
    <AccountShell title="My Orders" eyebrow="Order History">
      {loading ? (
        <p className="text-sm text-[var(--muted)]">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="bg-[var(--soft)] border border-[var(--border)] p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-[var(--muted)]/40 mx-auto mb-4" strokeWidth={1} />
          <p className="font-serif text-xl text-[var(--foreground)] mb-2">No orders yet</p>
          <p className="text-sm text-[var(--muted)] mb-6">When you place an order it will appear here.</p>
          <Link
            href="/shop"
            className="inline-block bg-[var(--foreground)] text-white px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="border border-[var(--border)] divide-y divide-[var(--border)] bg-white">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="flex items-start gap-5 p-6 hover:bg-[var(--soft)] transition-colors"
            >
              <div className="w-14 h-14 bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div>
                    <p className="font-mono text-xs text-[var(--muted)]">#{o.id?.slice(0, 10).toUpperCase()}</p>
                    <p className="font-serif text-lg text-[var(--foreground)] mt-1">
                      {o.products.length} {o.products.length === 1 ? 'timepiece' : 'timepieces'}
                    </p>
                  </div>
                  <StatusPill status={o.status} />
                </div>
                <p className="text-xs text-[var(--muted)] mb-2">
                  {o.products.map((p) => p.title).join(' · ')}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-[var(--muted)]">{formatOrderDate(o.createdAt)}</p>
                  <p className="font-medium text-sm text-[var(--foreground)]">
                    {formatPrice(o.totalPricePKR, 'PKR')}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--muted)] mt-2" />
            </Link>
          ))}
        </div>
      )}
    </AccountShell>
  );
}

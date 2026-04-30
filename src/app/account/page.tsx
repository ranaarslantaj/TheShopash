'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AccountShell from '@/components/account/AccountShell';
import { useAuth } from '@/context/AuthContext';
import { getOrdersByUserId, Order, formatOrderDate } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { Package, ArrowRight, ShoppingBag } from 'lucide-react';
import StatusPill from '@/components/account/StatusPill';

export default function AccountPage() {
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

  const recent = orders.slice(0, 3);
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPricePKR || 0), 0);

  return (
    <AccountShell title={`Welcome, ${user?.displayName?.split(' ')[0] || 'Collector'}`} eyebrow="Your Account">
      <div className="space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--soft)] border border-[var(--border)] p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Orders</p>
            <p className="text-3xl font-serif text-[var(--foreground)] mt-3">{orders.length}</p>
          </div>
          <div className="bg-[var(--soft)] border border-[var(--border)] p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">In Transit</p>
            <p className="text-3xl font-serif text-[var(--foreground)] mt-3">
              {orders.filter((o) => o.status === 'shipped' || o.status === 'out-for-delivery').length}
            </p>
          </div>
          <div className="bg-[var(--soft)] border border-[var(--border)] p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Lifetime Value</p>
            <p className="text-3xl font-serif text-primary mt-3">{formatPrice(totalSpent, 'PKR')}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-serif text-2xl text-[var(--foreground)]">Recent Orders</h2>
            {orders.length > 3 && (
              <Link
                href="/account/orders"
                className="text-xs uppercase tracking-[0.3em] text-primary flex items-center gap-2 hover:gap-3 transition-all"
              >
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {loading ? (
            <p className="text-sm text-[var(--muted)]">Loading…</p>
          ) : recent.length === 0 ? (
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
            <div className="border border-[var(--border)] divide-y divide-[var(--border)]">
              {recent.map((o) => (
                <Link
                  key={o.id}
                  href={`/account/orders/${o.id}`}
                  className="flex items-center gap-4 p-5 hover:bg-[var(--soft)] transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-[var(--muted)]">#{o.id?.slice(0, 10).toUpperCase()}</p>
                    <p className="font-serif text-base text-[var(--foreground)] truncate">
                      {o.products.length} {o.products.length === 1 ? 'item' : 'items'} · {formatPrice(o.totalPricePKR, 'PKR')}
                    </p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{formatOrderDate(o.createdAt)}</p>
                  </div>
                  <StatusPill status={o.status} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Account info */}
        <section className="bg-[var(--soft)] border border-[var(--border)] p-8">
          <h2 className="font-serif text-2xl text-[var(--foreground)] mb-6">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-1">Name</p>
              <p className="text-[var(--foreground)]">{user?.displayName || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-1">Email</p>
              <p className="text-[var(--foreground)]">{user?.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-1">Member Since</p>
              <p className="text-[var(--foreground)]">
                {user?.metadata.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-1">Account ID</p>
              <p className="text-[var(--foreground)] font-mono text-xs truncate">{user?.uid}</p>
            </div>
          </div>
        </section>
      </div>
    </AccountShell>
  );
}

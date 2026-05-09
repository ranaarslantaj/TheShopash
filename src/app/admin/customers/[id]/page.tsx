'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  Crown,
  Package,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import {
  getCustomerById,
  getOrdersByUserId,
  Customer,
  Order,
  formatOrderDate,
} from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import StatusPill from '@/components/account/StatusPill';

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getCustomerById(id), getOrdersByUserId(id)]).then(([c, o]) => {
      setCustomer(c);
      setOrders(o);
      setLoading(false);
    });
  }, [id]);

  const stats = useMemo(() => {
    const lifetimeValue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalPricePKR || 0), 0);
    const inFlight = orders.filter(
      (o) =>
        o.status === 'pending' ||
        o.status === 'confirmed' ||
        o.status === 'shipped' ||
        o.status === 'out-for-delivery'
    ).length;
    const lastOrder = orders[0];
    return { count: orders.length, inFlight, lifetimeValue, lastOrder };
  }, [orders]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-10 h-10 text-[var(--muted)]/40 mx-auto" />
        <p className="font-serif text-lg text-[var(--foreground)]">Customer not found.</p>
        <Link
          href="/admin/customers"
          className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary pb-1"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  const initial =
    customer.displayName?.[0]?.toUpperCase() ?? customer.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="space-y-8 max-w-5xl">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-3 h-3" /> All customers
      </Link>

      {/* Profile header */}
      <header className="flex items-start gap-5 pb-6 border-b border-[var(--border)]">
        <span
          className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-medium shrink-0 ${
            customer.role === 'admin'
              ? 'bg-primary text-white'
              : 'bg-[var(--soft)] border border-[var(--border)] text-[var(--foreground)]'
          }`}
        >
          {customer.photoURL ? (
            <img
              src={customer.photoURL}
              alt=""
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            initial
          )}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-serif text-[var(--foreground)] truncate">
              {customer.displayName || '(No name)'}
            </h1>
            {customer.role === 'admin' && (
              <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] bg-primary/10 text-primary px-3 py-1">
                <Crown className="w-3 h-3" /> Admin
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--muted)] mt-1">{customer.email}</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mt-2 font-mono truncate">
            UID: {customer.id}
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.count, icon: ShoppingBag },
          { label: 'Active Orders', value: stats.inFlight, icon: Package },
          {
            label: 'Lifetime Value',
            value: formatPrice(stats.lifetimeValue, 'PKR'),
            icon: TrendingUp,
          },
          {
            label: 'Last Order',
            value: stats.lastOrder ? formatOrderDate(stats.lastOrder.createdAt) : '—',
            icon: Calendar,
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border)] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                {s.label}
              </span>
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-serif text-[var(--foreground)] truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Profile + account */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-[var(--border)] p-6 space-y-3 shadow-sm">
          <h3 className="font-serif text-lg text-[var(--foreground)] flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" /> Contact
          </h3>
          <p className="text-sm text-[var(--muted)] flex items-center gap-2">
            <Mail className="w-3 h-3" /> {customer.email || '—'}
          </p>
          <p className="text-sm text-[var(--muted)] flex items-center gap-2">
            <Phone className="w-3 h-3" /> {customer.phone || 'Not provided'}
          </p>
        </div>
        <div className="bg-white border border-[var(--border)] p-6 space-y-3 shadow-sm">
          <h3 className="font-serif text-lg text-[var(--foreground)] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Account
          </h3>
          <div className="text-sm text-[var(--muted)] flex justify-between">
            <span>Joined</span>
            <span className="text-[var(--foreground)]">{formatOrderDate(customer.createdAt) || '—'}</span>
          </div>
          <div className="text-sm text-[var(--muted)] flex justify-between">
            <span>Last sign-in</span>
            <span className="text-[var(--foreground)]">
              {formatOrderDate(customer.lastSignInAt) || '—'}
            </span>
          </div>
          <div className="text-sm text-[var(--muted)] flex justify-between">
            <span>Role</span>
            <span className="text-[var(--foreground)] capitalize">{customer.role}</span>
          </div>
        </div>
      </section>

      {/* Orders */}
      <section>
        <h2 className="font-serif text-xl text-[var(--foreground)] mb-4 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-primary" /> Order history ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <div className="bg-white border border-[var(--border)] p-12 text-center shadow-sm">
            <Package className="w-12 h-12 text-[var(--muted)]/40 mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-base text-[var(--foreground)] mb-1">No orders yet</p>
            <p className="text-sm text-[var(--muted)]">
              This customer hasn&apos;t placed an order.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[var(--border)] divide-y divide-[var(--border)] shadow-sm">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="group flex items-center gap-4 p-5 hover:bg-[var(--soft)]/60 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs text-[var(--muted)]">#{o.id?.slice(0, 10).toUpperCase()}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="font-serif text-sm text-[var(--foreground)] mt-1 truncate">
                    {o.products.length} {o.products.length === 1 ? 'item' : 'items'} · {o.products.map((p) => p.title).slice(0, 2).join(', ')}
                    {o.products.length > 2 && ` +${o.products.length - 2}`}
                  </p>
                  <p className="text-[11px] text-[var(--muted)] mt-1">{formatOrderDate(o.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-primary tabular-nums">{formatPrice(o.totalPricePKR, 'PKR')}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted)] group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

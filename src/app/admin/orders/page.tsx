'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  ChevronRight,
  Clock,
  TrendingUp,
  Truck,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { getAllOrders, Order, OrderStatus, formatOrderDate } from '@/lib/db';
import { courierLabel } from '@/lib/couriers';
import { formatPrice } from '@/lib/utils';
import StatusPill from '@/components/account/StatusPill';

const STATUS_FILTERS: { key: OrderStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out-for-delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllOrders().then((res) => {
      setOrders(res);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.phone?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
    const inTransit = orders.filter(
      (o) => o.status === 'shipped' || o.status === 'out-for-delivery'
    ).length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalPricePKR || 0), 0);
    return { pending, inTransit, delivered, revenue };
  }, [orders]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">Manager Console</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Orders</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {loading ? 'Loading…' : `${orders.length} total · ${filtered.length} shown`}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: stats.pending, icon: Clock, accent: 'text-amber-600' },
          { label: 'In Transit', value: stats.inTransit, icon: Truck, accent: 'text-indigo-600' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle, accent: 'text-green-600' },
          {
            label: 'Revenue',
            value: formatPrice(stats.revenue, 'PKR'),
            icon: TrendingUp,
            accent: 'text-primary',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border)] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.accent}`} />
            </div>
            <p className="text-2xl font-serif text-[var(--foreground)] truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[var(--border)] divide-y divide-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID, email, name, or phone"
              className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
            <Filter className="w-3 h-3" />
            <span>Filter</span>
          </div>
        </div>

        {/* Status chips */}
        <div className="px-4 py-3 flex flex-wrap gap-1">
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 transition-colors ${
                  active
                    ? 'bg-[var(--foreground)] text-white'
                    : 'text-[var(--muted)] hover:bg-[var(--soft)]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--border)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[var(--muted)]/40 mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-lg text-[var(--foreground)] mb-1">No orders yet</p>
            <p className="text-sm text-[var(--muted)]">
              {statusFilter !== 'all' || search
                ? 'No orders match your filters.'
                : 'Orders will appear here as customers check out.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] bg-[var(--soft)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((o) => (
                  <tr key={o.id} className="group hover:bg-[var(--soft)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="block font-mono text-xs text-[var(--foreground)] hover:text-primary"
                      >
                        #{o.id?.slice(0, 10).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--foreground)] truncate max-w-[180px]">{o.customerName}</p>
                      <p className="text-[11px] text-[var(--muted)] truncate max-w-[180px]">{o.email}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-sm text-[var(--muted)]">
                      {o.products?.length ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary tabular-nums whitespace-nowrap">
                      {formatPrice(o.totalPricePKR, 'PKR')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={o.status} />
                      {o.courier && o.courier !== 'other' && o.trackingNumber && (
                        <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted)] mt-1.5">
                          {courierLabel(o.courier)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-xs text-[var(--muted)]">
                      {formatOrderDate(o.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center text-[var(--muted)] group-hover:text-primary transition-colors"
                        aria-label="View order"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

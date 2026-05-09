'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  ArrowRight,
  AlertTriangle,
  Crown,
  Loader2,
} from 'lucide-react';
import {
  getAllOrders,
  getAllCustomers,
  getProducts,
  Order,
  Customer,
  formatOrderDate,
} from '@/lib/db';
import { Product } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import StatusPill from '@/components/account/StatusPill';

// ─── Mini sparkline (SVG) ─────────────────────────────────────────
const RevenueSparkline: React.FC<{ data: number[]; width?: number; height?: number }> = ({
  data,
  width = 320,
  height = 80,
}) => {
  const max = Math.max(...data, 1);
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const points = data
    .map((v, i) => `${i * step},${height - (v / max) * (height - 6) - 3}`)
    .join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#rev-grad)" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={i * step}
          cy={height - (v / max) * (height - 6) - 3}
          r={2}
          fill="var(--color-primary)"
        />
      ))}
    </svg>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────
const dateKey = (d: Date) => d.toISOString().slice(0, 10);
const ymd = (createdAt: any): string | null => {
  if (!createdAt) return null;
  const d =
    createdAt?.toDate?.() ??
    (createdAt instanceof Date
      ? createdAt
      : typeof createdAt === 'string'
      ? new Date(createdAt)
      : null);
  if (!d || isNaN(d.getTime())) return null;
  return dateKey(d);
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllOrders(), getProducts(), getAllCustomers()])
      .then(([o, p, c]) => {
        setOrders(o);
        setProducts(p);
        setCustomers(c);
      })
      .finally(() => setLoading(false));
  }, []);

  // ─── Revenue series (last 7 days) ────────────────────────────────
  const { revenueSeries, dayLabels, last7Total, prev7Total } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Build buckets for last 14 days, then split into two 7-day windows
    const buckets14: { date: string; label: string; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      buckets14.push({
        date: dateKey(d),
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        total: 0,
      });
    }
    const indexByDate = new Map(buckets14.map((b, i) => [b.date, i]));

    for (const o of orders) {
      if (o.status === 'cancelled') continue;
      const k = ymd(o.createdAt);
      if (!k) continue;
      const idx = indexByDate.get(k);
      if (idx == null) continue;
      buckets14[idx].total += o.totalPricePKR || 0;
    }

    const last7 = buckets14.slice(7);
    const prev7 = buckets14.slice(0, 7);
    return {
      revenueSeries: last7.map((b) => b.total),
      dayLabels: last7.map((b) => b.label),
      last7Total: last7.reduce((s, b) => s + b.total, 0),
      prev7Total: prev7.reduce((s, b) => s + b.total, 0),
    };
  }, [orders]);

  const trendPct = useMemo(() => {
    if (prev7Total === 0 && last7Total === 0) return 0;
    if (prev7Total === 0) return 100;
    return Math.round(((last7Total - prev7Total) / prev7Total) * 100);
  }, [last7Total, prev7Total]);

  // ─── Top products by revenue ─────────────────────────────────────
  const topProducts = useMemo(() => {
    const totals = new Map<string, { id: string; title: string; revenue: number; units: number }>();
    for (const o of orders) {
      if (o.status === 'cancelled') continue;
      for (const p of o.products) {
        const cur = totals.get(p.id) ?? { id: p.id, title: p.title, revenue: 0, units: 0 };
        cur.revenue += p.pricePKR * p.quantity;
        cur.units += p.quantity;
        totals.set(p.id, cur);
      }
    }
    return Array.from(totals.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  // ─── Top customers ───────────────────────────────────────────────
  const topCustomers = useMemo(() => {
    const totals = new Map<
      string,
      { id: string; name: string; email: string; orders: number; total: number }
    >();
    const customerById = new Map(customers.map((c) => [c.id, c]));
    for (const o of orders) {
      if (o.status === 'cancelled' || !o.userId) continue;
      const c = customerById.get(o.userId);
      const cur = totals.get(o.userId) ?? {
        id: o.userId,
        name: c?.displayName ?? o.customerName ?? 'Customer',
        email: c?.email ?? o.email,
        orders: 0,
        total: 0,
      };
      cur.orders += 1;
      cur.total += o.totalPricePKR;
      totals.set(o.userId, cur);
    }
    return Array.from(totals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [orders, customers]);

  // ─── Low stock ───────────────────────────────────────────────────
  const lowStock = useMemo(
    () =>
      products
        .filter((p) => p.stock !== undefined && p.stock <= 2)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
    [products]
  );

  // ─── Top-line stats ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const lifetime = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((s, o) => s + o.totalPricePKR, 0);
    const pending = orders.filter(
      (o) => o.status === 'pending' || o.status === 'confirmed'
    ).length;
    return {
      revenue: lifetime,
      orders: orders.length,
      products: products.length,
      customers: customers.length,
      pending,
    };
  }, [orders, products, customers]);

  const recentOrders = orders.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">
          Manager Console
        </span>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Overview</h1>
      </header>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            name: 'Lifetime Revenue',
            value: formatPrice(stats.revenue, 'PKR'),
            icon: TrendingUp,
            sub: `${stats.orders} orders`,
          },
          {
            name: 'Pending',
            value: stats.pending,
            icon: ShoppingBag,
            sub: 'Awaiting fulfilment',
            href: '/admin/orders?status=pending',
          },
          {
            name: 'Inventory',
            value: stats.products,
            icon: Package,
            sub: 'Active SKUs',
            href: '/admin/products',
          },
          {
            name: 'Customers',
            value: stats.customers,
            icon: Users,
            sub: 'Registered accounts',
            href: '/admin/customers',
          },
        ].map((s) => (
          <Link
            key={s.name}
            href={s.href ?? '#'}
            className={`bg-white border border-[var(--border)] p-6 space-y-3 shadow-sm transition-colors ${
              s.href ? 'hover:border-primary cursor-pointer' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                {s.name}
              </span>
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-serif text-[var(--foreground)] truncate">{s.value}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">{s.sub}</p>
          </Link>
        ))}
      </div>

      {/* Revenue chart */}
      <section className="bg-white border border-[var(--border)] p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] block">
              Last 7 days
            </span>
            <h2 className="font-serif text-2xl text-[var(--foreground)] mt-1">
              {formatPrice(last7Total, 'PKR')}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`uppercase tracking-[0.3em] ${
                trendPct >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trendPct >= 0 ? '↑' : '↓'} {Math.abs(trendPct)}%
            </span>
            <span className="text-[var(--muted)]">vs previous 7 days</span>
          </div>
        </div>

        <div className="h-24">
          {last7Total > 0 ? (
            <RevenueSparkline data={revenueSeries} />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-[var(--muted)]">
              No revenue in the last 7 days yet.
            </div>
          )}
        </div>

        <div className="grid grid-cols-7 mt-4 text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] text-center">
          {dayLabels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </section>

      {/* Two-column: Top products + Top customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top products */}
        <section className="bg-white border border-[var(--border)] shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-serif text-lg text-[var(--foreground)]">Top Products</h3>
            <Link
              href="/admin/products"
              className="text-[10px] uppercase tracking-[0.3em] text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {topProducts.length === 0 ? (
            <div className="p-10 text-center text-[var(--muted)] text-sm">
              No sales yet — top products will appear once orders come in.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {topProducts.map((p, i) => (
                <li key={p.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-[var(--soft)] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--muted)] tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex-1 min-w-0 font-serif text-sm text-[var(--foreground)] hover:text-primary truncate"
                  >
                    {p.title}
                  </Link>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-primary tabular-nums">
                      {formatPrice(p.revenue, 'PKR')}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
                      {p.units} sold
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Top customers */}
        <section className="bg-white border border-[var(--border)] shadow-sm">
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="font-serif text-lg text-[var(--foreground)]">Top Customers</h3>
            <Link
              href="/admin/customers"
              className="text-[10px] uppercase tracking-[0.3em] text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all"
            >
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {topCustomers.length === 0 ? (
            <div className="p-10 text-center text-[var(--muted)] text-sm">
              No customer orders yet.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {topCustomers.map((c, i) => (
                <li key={c.id} className="px-6 py-4 flex items-center gap-4">
                  <span className="w-6 h-6 rounded-full bg-[var(--soft)] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--muted)] tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <Link href={`/admin/customers/${c.id}`} className="flex-1 min-w-0 group">
                    <p className="text-sm text-[var(--foreground)] group-hover:text-primary truncate flex items-center gap-2">
                      {c.name}
                      {i === 0 && <Crown className="w-3 h-3 text-primary" />}
                    </p>
                    <p className="text-[11px] text-[var(--muted)] truncate">{c.email}</p>
                  </Link>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-primary tabular-nums">
                      {formatPrice(c.total, 'PKR')}
                    </p>
                    <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
                      {c.orders} {c.orders === 1 ? 'order' : 'orders'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Low-stock alerts */}
      {lowStock.length > 0 && (
        <section className="bg-amber-50 border border-amber-200 shadow-sm">
          <div className="px-6 py-5 border-b border-amber-200/60 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <h3 className="font-serif text-lg text-amber-900">Low stock</h3>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-700">
              {lowStock.length} {lowStock.length === 1 ? 'item' : 'items'} need attention
            </span>
          </div>
          <ul className="divide-y divide-amber-200/60">
            {lowStock.map((p) => (
              <li key={p.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-14 bg-white shrink-0 overflow-hidden">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-serif text-sm text-amber-900 hover:underline truncate block"
                  >
                    {p.title}
                  </Link>
                  <p className="text-[11px] text-amber-700/80">{p.brand}</p>
                </div>
                <span
                  className={`text-xs uppercase tracking-[0.3em] px-3 py-1 ${
                    p.stock === 0
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {p.stock === 0 ? 'Out of stock' : `${p.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Recent orders */}
      <section className="bg-white border border-[var(--border)] shadow-sm">
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-serif text-lg text-[var(--foreground)]">Recent Orders</h3>
          <Link
            href="/admin/orders"
            className="text-[10px] uppercase tracking-[0.3em] text-primary flex items-center gap-1.5 hover:gap-2.5 transition-all"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] bg-[var(--soft)]">
              <tr>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[var(--muted)] text-sm">
                    No orders yet — they&apos;ll appear here as customers check out.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr
                    key={o.id}
                    onClick={() => (window.location.href = `/admin/orders/${o.id}`)}
                    className="hover:bg-[var(--soft)]/60 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-[var(--foreground)]">
                      #{o.id?.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--foreground)] truncate max-w-[180px]">
                        {o.customerName}
                      </p>
                      <p className="text-[11px] text-[var(--muted)] truncate max-w-[180px]">
                        {o.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary tabular-nums whitespace-nowrap">
                      {formatPrice(o.totalPricePKR, 'PKR')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--muted)] hidden md:table-cell">
                      {formatOrderDate(o.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

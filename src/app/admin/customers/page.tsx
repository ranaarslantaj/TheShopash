'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Loader2,
  ChevronRight,
  Crown,
  ShoppingBag,
  Calendar,
} from 'lucide-react';
import { getAllCustomers, getAllOrders, Customer, Order, formatOrderDate } from '@/lib/db';
import { formatPrice } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllCustomers(), getAllOrders()]).then(([c, o]) => {
      setCustomers(c);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  // Group orders by userId for fast lookup
  const ordersByUser = useMemo(() => {
    const map = new Map<string, Order[]>();
    for (const o of orders) {
      if (!o.userId) continue;
      const list = map.get(o.userId) ?? [];
      list.push(o);
      map.set(o.userId, list);
    }
    return map;
  }, [orders]);

  // Decorate customers with order stats
  type Decorated = Customer & { orderCount: number; lifetimeValue: number };
  const decorated: Decorated[] = useMemo(() => {
    return customers.map((c) => {
      const userOrders = ordersByUser.get(c.id) ?? [];
      const lifetimeValue = userOrders
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalPricePKR || 0), 0);
      return { ...c, orderCount: userOrders.length, lifetimeValue };
    });
  }, [customers, ordersByUser]);

  const filtered = useMemo(() => {
    if (!search.trim()) return decorated;
    const q = search.trim().toLowerCase();
    return decorated.filter(
      (c) =>
        c.email?.toLowerCase().includes(q) ||
        c.displayName?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q)
    );
  }, [decorated, search]);

  const stats = useMemo(() => {
    const total = customers.length;
    const admins = customers.filter((c) => c.role === 'admin').length;
    const withOrders = decorated.filter((c) => c.orderCount > 0).length;
    const totalRevenue = decorated.reduce((sum, c) => sum + c.lifetimeValue, 0);
    return { total, admins, withOrders, totalRevenue };
  }, [customers, decorated]);

  const initial = (c: Customer) =>
    c.displayName?.[0]?.toUpperCase() ?? c.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <div className="space-y-10">
      {/* Header */}
      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">Maison de Horlogerie</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Customers</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          {loading ? 'Loading…' : `${customers.length} total · ${filtered.length} shown`}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: stats.total, icon: Users },
          { label: 'With Orders', value: stats.withOrders, icon: ShoppingBag },
          { label: 'Administrators', value: stats.admins, icon: Crown },
          {
            label: 'Lifetime Revenue',
            value: formatPrice(stats.totalRevenue, 'PKR'),
            icon: Calendar,
          },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border)] p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">{s.label}</span>
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-serif text-[var(--foreground)] truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-[var(--border)] p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or UID"
          className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-[var(--border)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-[var(--muted)]/40 mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-lg text-[var(--foreground)] mb-1">
              {search ? 'No customers match your search.' : 'No customers yet'}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Customers will appear here when they sign up or sign in.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] bg-[var(--soft)]">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Lifetime Value</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Last Sign-in</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((c) => (
                  <tr key={c.id} className="group hover:bg-[var(--soft)]/60 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                            c.role === 'admin'
                              ? 'bg-primary text-white'
                              : 'bg-[var(--soft)] border border-[var(--border)] text-[var(--foreground)]'
                          }`}
                        >
                          {c.photoURL ? (
                            <img
                              src={c.photoURL}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            initial(c)
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-[var(--foreground)] truncate flex items-center gap-2">
                            {c.displayName || '(No name)'}
                            {c.role === 'admin' && (
                              <span className="text-[9px] uppercase tracking-[0.3em] bg-primary/10 text-primary px-2 py-0.5">
                                Admin
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] truncate">{c.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-xs text-[var(--muted)]">
                      {formatOrderDate(c.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--foreground)] tabular-nums">
                      {c.orderCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-primary tabular-nums whitespace-nowrap">
                      {formatPrice(c.lifetimeValue, 'PKR')}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-xs text-[var(--muted)]">
                      {formatOrderDate(c.lastSignInAt) || '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="inline-flex items-center text-[var(--muted)] group-hover:text-primary transition-colors"
                        aria-label="View customer"
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

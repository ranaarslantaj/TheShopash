'use client';

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Package, TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!db) {
        setLoading(false);
        return;
      }
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        const orderSnap = await getDocs(collection(db, 'orders'));

        let totalRev = 0;
        const orders = orderSnap.docs.map((doc) => {
          const data = doc.data();
          totalRev += data.totalPricePKR || 0;
          return { id: doc.id, ...data };
        });

        setStats({
          products: prodSnap.size,
          orders: orderSnap.size,
          revenue: totalRev,
        });

        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(q);
        setRecentOrders(recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Revenue', value: formatPrice(stats.revenue, 'PKR'), icon: TrendingUp, detail: 'Lifetime sales' },
    { name: 'Orders', value: stats.orders, icon: ShoppingBag, detail: 'Successful checkouts' },
    { name: 'Inventory', value: stats.products, icon: Package, detail: 'Live timepieces' },
    { name: 'Customers', value: stats.orders, icon: Users, detail: 'Unique buyers' },
  ];

  return (
    <div className="space-y-12">
      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">Manager Console</span>
        <h1 className="text-4xl font-serif text-[var(--foreground)]">Business Overview</h1>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white border border-[var(--border)] p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">{stat.name}</span>
              <stat.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-serif text-[var(--foreground)]">{stat.value}</div>
            <p className="text-[10px] text-[var(--muted)] uppercase tracking-tighter">{stat.detail}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <section className="bg-white border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-[var(--border)] flex justify-between items-center">
          <h3 className="text-xl font-serif text-[var(--foreground)]">Recent Orders</h3>
          <Link href="/admin/orders" className="text-xs uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-3 transition-all">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] uppercase tracking-widest text-[var(--muted)] bg-[#faf8f1]">
              <tr>
                <th className="px-8 py-4 font-medium">Order ID</th>
                <th className="px-8 py-4 font-medium">Customer</th>
                <th className="px-8 py-4 font-medium">Total</th>
                <th className="px-8 py-4 font-medium">Status</th>
                <th className="px-8 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-[var(--muted)] font-serif">
                    No orders recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#faf8f1] transition-colors">
                    <td className="px-8 py-5 text-xs text-[var(--muted)] tracking-tighter font-mono">#{order.id.slice(0, 8)}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-[var(--foreground)]">{order.customerName}</p>
                      <p className="text-[10px] text-[var(--muted)]">{order.phone}</p>
                    </td>
                    <td className="px-8 py-5 text-sm text-primary">{formatPrice(order.totalPricePKR, 'PKR')}</td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[10px] uppercase tracking-widest px-3 py-1 border ${
                          order.status === 'delivered'
                            ? 'border-green-500/30 text-green-600 bg-green-500/5'
                            : order.status === 'shipped'
                            ? 'border-blue-500/30 text-blue-600 bg-blue-500/5'
                            : 'border-primary/30 text-primary bg-primary/5'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs text-[var(--muted)]">
                      <Clock className="w-3 h-3 inline mr-2 opacity-50 transition-opacity" />
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Pending'}
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

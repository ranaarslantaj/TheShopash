'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StatusPill from '@/components/account/StatusPill';
import OrderTimeline from '@/components/account/OrderTimeline';
import { getOrderById, Order, formatOrderDate } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { Loader2, Search, Package } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setLoading(true);

    try {
      const found = await getOrderById(orderId.trim());
      if (!found) {
        setError("We couldn't find an order with that ID. Please check the number and try again.");
      } else if (found.email?.toLowerCase() !== email.trim().toLowerCase()) {
        setError("The email doesn't match our records for this order.");
      } else {
        setOrder(found);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white border border-[var(--border)] px-5 py-3 text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors';

  return (
    <main>
      <Navbar />

      <section className="bg-[var(--soft)] border-b border-[var(--border)]">
        <div className="container mx-auto px-6 py-16 text-center">
          <span className="eyebrow">Order Status</span>
          <h1 className="text-4xl md:text-6xl font-serif text-[var(--foreground)] mt-4">Track Your Order</h1>
          <p className="text-sm text-[var(--muted)] mt-4 max-w-md mx-auto font-light">
            Enter your order number and the email used at checkout to view live status.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[var(--background)]">
        <div className="container mx-auto px-6 max-w-3xl">
          <form onSubmit={handle} className="bg-white border border-[var(--border)] p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Order Number</label>
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                placeholder="e.g. LOCAL-MABCD123"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="The email used at checkout"
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--foreground)] text-white px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Searching…</>
                ) : (
                  <><Search className="w-4 h-4" /> Track Order</>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 mt-6">{error}</div>
          )}

          {order && (
            <div className="mt-12 space-y-8">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pb-6 border-b border-[var(--border)]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Order</p>
                  <p className="font-mono text-lg text-[var(--foreground)] mt-1">
                    #{order.id?.slice(0, 12).toUpperCase()}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-1">Placed {formatOrderDate(order.createdAt)}</p>
                </div>
                <StatusPill status={order.status} />
              </div>

              <OrderTimeline status={order.status} />

              <section>
                <h2 className="font-serif text-2xl text-[var(--foreground)] mb-5">Items</h2>
                <div className="border border-[var(--border)] divide-y divide-[var(--border)] bg-white">
                  {order.products.map((p, i) => (
                    <div key={i} className="flex items-center gap-4 p-5">
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {p.brand && (
                          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-0.5">{p.brand}</p>
                        )}
                        <p className="font-serif text-base text-[var(--foreground)] truncate">{p.title}</p>
                        <p className="text-xs text-[var(--muted)]">Quantity: {p.quantity}</p>
                      </div>
                      <p className="font-medium text-sm text-[var(--foreground)] whitespace-nowrap">
                        {formatPrice(p.pricePKR * p.quantity, 'PKR')}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="bg-[var(--soft)] border border-[var(--border)] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-serif text-base text-[var(--foreground)] mb-3">Shipping To</h3>
                  <p className="text-sm text-[var(--foreground)]">{order.customerName}</p>
                  <p className="text-sm text-[var(--muted)]">{order.address}</p>
                  <p className="text-sm text-[var(--muted)]">{order.country}</p>
                </div>
                <div>
                  <h3 className="font-serif text-base text-[var(--foreground)] mb-3">Total</h3>
                  <p className="text-2xl font-serif text-primary">{formatPrice(order.totalPricePKR, 'PKR')}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mt-1">
                    {order.paymentMethod}
                  </p>
                  {order.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">Tracking Number</p>
                      <p className="font-mono text-sm text-[var(--foreground)] mt-1">{order.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

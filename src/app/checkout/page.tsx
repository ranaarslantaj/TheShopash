'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';
import { createOrder } from '@/lib/db';
import { CheckCircle, Loader2, Copy } from 'lucide-react';
import Link from 'next/link';

type Mode = 'choose' | 'form';

export default function CheckoutPage() {
  const { cart, totalPricePKR, totalPriceUSD, clearCart } = useCart();
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>(user ? 'form' : 'choose');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: 'Pakistan',
    payment: 'cod',
  });

  // Auto-fill from auth on mount
  useEffect(() => {
    if (user) {
      setMode('form');
      setForm((f) => ({
        ...f,
        name: f.name || user.displayName || '',
        email: f.email || user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const id = await createOrder({
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        country: form.country,
        paymentMethod: form.payment,
        userId: user?.uid ?? null,
        products: cart.map((item) => ({
          id: item.id,
          title: item.title,
          pricePKR: item.pricePKR,
          quantity: item.quantity,
          image: item.images?.[0],
          brand: item.brand,
        })),
        totalPricePKR,
        totalPriceUSD,
      });
      setOrderId(id);
      clearCart();
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyOrderId = async () => {
    if (!orderId) return;
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass =
    'w-full bg-white border border-[var(--border)] px-5 py-3 text-[var(--foreground)] focus:outline-none focus:border-primary transition-colors';

  if (orderId) {
    return (
      <main>
        <Navbar />
        <section className="pt-16 pb-20 bg-[var(--background)] min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 max-w-lg mx-auto px-6">
            <CheckCircle className="w-20 h-20 text-primary mx-auto" strokeWidth={1.2} />
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)]">Order Confirmed</h1>
            <p className="text-[var(--muted)] font-light">
              Thank you for your purchase. A confirmation has been sent to <strong className="text-[var(--foreground)]">{form.email}</strong>.
            </p>

            <div className="bg-[var(--soft)] border border-[var(--border)] p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Your Order Number</p>
              <div className="flex items-center justify-center gap-3">
                <p className="font-mono text-lg text-[var(--foreground)]">#{orderId.slice(0, 14).toUpperCase()}</p>
                <button
                  onClick={copyOrderId}
                  className="p-2 text-[var(--muted)] hover:text-primary transition-colors"
                  aria-label="Copy order number"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <p className="text-[10px] text-primary mt-2">Copied to clipboard</p>}
              <p className="text-xs text-[var(--muted)] mt-3">
                Save this number to track your order anytime.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link
                href={user ? `/account/orders/${orderId}` : `/track`}
                className="bg-[var(--foreground)] text-white px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors"
              >
                {user ? 'View in Account' : 'Track Order'}
              </Link>
              <Link
                href="/shop"
                className="border border-[var(--foreground)] text-[var(--foreground)] px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-[var(--foreground)] hover:text-white transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

            {!user && (
              <p className="text-xs text-[var(--muted)] pt-6 max-w-md mx-auto">
                Want all your future orders in one place?{' '}
                <Link href={`/account/signup?next=/account`} className="text-primary underline-offset-4 hover:underline">
                  Create an account
                </Link>{' '}
                with the same email to link this order automatically.
              </p>
            )}
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main>
        <Navbar />
        <section className="pt-16 pb-20 bg-[var(--background)] min-h-screen">
          <div className="container mx-auto px-6 text-center py-20">
            <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-6">Checkout</h1>
            <p className="text-[var(--muted)] font-serif text-xl">Your cart is empty</p>
            <Link href="/shop" className="inline-block bg-[var(--foreground)] text-white px-8 py-3 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors mt-6">
              Shop Now
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Guest/sign-in chooser (only shown to non-authenticated users)
  if (mode === 'choose') {
    return (
      <main>
        <Navbar />
        <section className="pt-16 pb-20 bg-[var(--background)] min-h-screen">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <span className="eyebrow">One last step</span>
              <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mt-4">Checkout</h1>
              <p className="text-sm text-[var(--muted)] mt-3 font-light">
                Sign in for a faster checkout, or continue as a guest. Either way, you&apos;ll get an order number to track.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Link
                href={`/account/login?next=/checkout`}
                className="block bg-white border border-[var(--border)] p-8 hover:border-primary transition-colors group"
              >
                <span className="eyebrow">Returning Customer</span>
                <h2 className="font-serif text-2xl text-[var(--foreground)] mt-3 mb-3 group-hover:text-primary transition-colors">
                  Sign In
                </h2>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed mb-6">
                  Skip filling in your details. Saved addresses, faster checkout, and order history kept in one place.
                </p>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary border-b border-primary pb-1">
                  Continue with Sign In →
                </span>
              </Link>

              <button
                onClick={() => setMode('form')}
                className="block bg-white border border-[var(--border)] p-8 hover:border-primary transition-colors group text-left"
              >
                <span className="eyebrow">No Account Needed</span>
                <h2 className="font-serif text-2xl text-[var(--foreground)] mt-3 mb-3 group-hover:text-primary transition-colors">
                  Continue as Guest
                </h2>
                <p className="text-sm text-[var(--muted)] font-light leading-relaxed mb-6">
                  Order without creating an account. We&apos;ll email you an order number you can use to track delivery anytime.
                </p>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary border-b border-primary pb-1">
                  Guest Checkout →
                </span>
              </button>
            </div>

            <p className="text-center text-xs text-[var(--muted)] mt-10">
              New here?{' '}
              <Link href="/account/signup?next=/checkout" className="text-primary underline-offset-4 hover:underline">
                Create an account
              </Link>{' '}
              to save your details for next time.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="pt-16 pb-20 bg-[var(--background)] min-h-screen">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-12">Checkout</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <h3 className="text-[var(--foreground)] font-serif text-xl">Shipping Details</h3>
                {user ? (
                  <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Signed in as {user.email}</span>
                ) : (
                  <Link
                    href={`/account/login?next=/checkout`}
                    className="text-[10px] uppercase tracking-[0.3em] text-primary hover:underline"
                  >
                    Have an account? Sign in
                  </Link>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className={`${inputClass} resize-none`} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Country</label>
                  <select name="country" value={form.country} onChange={handleChange} className={inputClass}>
                    <option value="Pakistan">Pakistan</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">Payment Method</label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 p-4 border cursor-pointer text-center text-sm transition-all ${
                        form.payment === 'cod'
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-[var(--border)] text-[var(--muted)]'
                      }`}
                    >
                      <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange} className="hidden" />
                      Cash on Delivery
                    </label>
                    <label
                      className={`flex-1 p-4 border cursor-pointer text-center text-sm transition-all ${
                        form.payment === 'stripe'
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-[var(--border)] text-[var(--muted)]'
                      }`}
                    >
                      <input type="radio" name="payment" value="stripe" checked={form.payment === 'stripe'} onChange={handleChange} className="hidden" />
                      Card (Coming Soon)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white border border-[var(--border)] p-8 space-y-6 sticky top-28 shadow-sm">
                <h3 className="text-[var(--foreground)] font-serif text-xl">Order Summary</h3>
                <div className="h-px bg-[var(--border)]" />
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[var(--foreground)]/75">{item.title} × {item.quantity}</span>
                      <span className="text-[var(--foreground)]">{formatPrice(item.pricePKR * item.quantity, 'PKR')}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-[var(--border)]" />
                <div className="flex justify-between text-base">
                  <span className="text-[var(--foreground)]">Total</span>
                  <span className="text-primary">{formatPrice(totalPricePKR, 'PKR')}</span>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[var(--foreground)] text-white px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</> : 'Place Order'}
                </button>
                <p className="text-[10px] text-[var(--muted)] text-center uppercase tracking-[0.3em]">
                  Insured · Authenticated · Concierge
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}

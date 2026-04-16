'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, totalPricePKR, totalPriceUSD, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', country: 'Pakistan', payment: 'cod' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, save to Firestore here
    setSubmitted(true);
    clearCart();
  };

  if (submitted) {
    return (
      <main>
        <Navbar />
        <section className="pt-32 pb-20 bg-black min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto px-6">
            <CheckCircle className="w-20 h-20 text-primary mx-auto" />
            <h1 className="text-4xl font-serif text-white">Order Confirmed</h1>
            <p className="text-white/50 font-light">Thank you for your purchase. We will contact you shortly to confirm your order.</p>
            <Link href="/shop" className="luxury-button inline-block">Continue Shopping</Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-16">Checkout</h1>
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 font-serif text-xl">Your cart is empty</p>
              <Link href="/shop" className="luxury-button inline-block mt-6">Shop Now</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Form Fields */}
              <div className="space-y-8">
                <h3 className="text-white font-serif text-xl">Shipping Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} required rows={3}
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Country</label>
                    <select name="country" value={form.country} onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 px-5 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                      <option value="Pakistan">Pakistan</option>
                      <option value="International">International</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Payment Method</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 p-4 border cursor-pointer text-center text-sm transition-all ${form.payment === 'cod' ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-white/50'}`}>
                        <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange} className="hidden" />
                        Cash on Delivery
                      </label>
                      <label className={`flex-1 p-4 border cursor-pointer text-center text-sm transition-all ${form.payment === 'stripe' ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-white/50'}`}>
                        <input type="radio" name="payment" value="stripe" checked={form.payment === 'stripe'} onChange={handleChange} className="hidden" />
                        Card (Coming Soon)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white/5 border border-white/10 p-8 space-y-6 sticky top-28">
                  <h3 className="text-white font-serif text-xl">Order Summary</h3>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-white/60">{item.title} × {item.quantity}</span>
                        <span className="text-white/80">{formatPrice(item.pricePKR * item.quantity, 'PKR')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-white text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(totalPricePKR, 'PKR')}</span>
                  </div>
                  <button type="submit" className="luxury-button w-full">Place Order</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

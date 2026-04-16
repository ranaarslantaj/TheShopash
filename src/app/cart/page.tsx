'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPricePKR, totalPriceUSD, cartCount } = useCart();

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 bg-black min-h-screen">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-16">Shopping Bag</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <ShoppingBag className="w-16 h-16 text-white/10 mx-auto" />
              <p className="text-white/30 font-serif text-xl">Your bag is empty</p>
              <Link href="/shop" className="luxury-button inline-block">Continue Shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-6 p-6 bg-white/5 border border-white/10">
                    <Link href={`/product/${item.id}`} className="w-28 h-28 shrink-0 overflow-hidden">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-white font-serif text-lg">{item.title}</h3>
                          <p className="text-white/30 text-xs uppercase tracking-widest mt-1">{item.category}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center border border-white/10">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-white/50 hover:text-white">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-1 text-white text-sm border-x border-white/10">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-white/50 hover:text-white">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-primary font-light">{formatPrice(item.pricePKR * item.quantity, 'PKR')}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/5 border border-white/10 p-8 space-y-6 sticky top-28">
                  <h3 className="text-white font-serif text-xl">Order Summary</h3>
                  <div className="h-px bg-white/10" />
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white/50"><span>Items ({cartCount})</span><span>{formatPrice(totalPricePKR, 'PKR')}</span></div>
                    <div className="flex justify-between text-white/50"><span>Shipping</span><span className="text-primary text-xs">Free</span></div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-white text-lg">
                    <span>Total</span>
                    <div className="text-right">
                      <p className="text-primary">{formatPrice(totalPricePKR, 'PKR')}</p>
                      <p className="text-white/30 text-xs">≈ {formatPrice(totalPriceUSD, 'USD')}</p>
                    </div>
                  </div>
                  <Link href="/checkout" className="luxury-button w-full block text-center">Proceed to Checkout</Link>
                  <Link href="/shop" className="block text-center text-xs uppercase tracking-widest text-white/30 hover:text-primary transition-colors">
                    Continue Shopping
                  </Link>
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

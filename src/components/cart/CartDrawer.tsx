'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

const CartDrawer = () => {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    removeFromCart,
    updateQuantity,
    totalPricePKR,
    totalPriceUSD,
    cartCount,
  } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeOut', duration: 0.4 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[460px] z-[90] bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[var(--foreground)]" />
                <h2 className="font-serif text-xl text-[var(--foreground)]">
                  Your Bag
                  {cartCount > 0 && (
                    <span className="text-sm text-[var(--muted)] font-sans ml-2">
                      ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trust row */}
            <div className="px-6 py-3 bg-[var(--soft)] border-b border-[var(--border)] flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Authenticated
              </span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-primary" />
                Insured
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Concierge
              </span>
            </div>

            {/* Body */}
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="w-16 h-16 text-[var(--muted)]/30 mb-6" strokeWidth={1} />
                <p className="font-serif text-2xl text-[var(--foreground)] mb-2">Your bag is empty</p>
                <p className="text-sm text-[var(--muted)] font-light max-w-[280px] mb-8">
                  Discover our curated selection of the world&apos;s finest timepieces.
                </p>
                <Link
                  href="/shop"
                  onClick={closeDrawer}
                  className="px-8 py-3 bg-[var(--foreground)] text-white text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-5 border-b border-[var(--border)] last:border-b-0">
                      <Link
                        href={`/product/${item.id}`}
                        onClick={closeDrawer}
                        className="w-24 h-28 shrink-0 overflow-hidden bg-[var(--soft)]"
                      >
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      </Link>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.3em] text-primary mb-1">{item.brand}</p>
                          <Link
                            href={`/product/${item.id}`}
                            onClick={closeDrawer}
                            className="block font-serif text-base text-[var(--foreground)] leading-tight truncate hover:text-primary transition-colors"
                          >
                            {item.title}
                          </Link>
                          {item.reference && (
                            <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">
                              Ref. {item.reference}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-between items-end mt-3">
                          <div className="flex items-center border border-[var(--border)]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs text-[var(--foreground)]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[var(--foreground)] font-medium">
                              {formatPrice(item.pricePKR * item.quantity, 'PKR')}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-red-500 transition-colors mt-1 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--border)] px-6 py-5 space-y-4 bg-[var(--soft)]/50">
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPricePKR, 'PKR')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--muted)]">
                    <span>Shipping</span>
                    <span className="text-primary">Complimentary · Insured</span>
                  </div>
                  <div className="h-px bg-[var(--border)]" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm uppercase tracking-[0.3em] text-[var(--foreground)]">Total</span>
                    <div className="text-right">
                      <p className="text-xl font-serif text-[var(--foreground)]">
                        {formatPrice(totalPricePKR, 'PKR')}
                      </p>
                      <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider">
                        ≈ {formatPrice(totalPriceUSD, 'USD')}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="block w-full text-center bg-[var(--foreground)] text-white px-8 py-4 text-xs uppercase tracking-[0.3em] hover:bg-primary transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="block w-full text-center text-[10px] uppercase tracking-[0.4em] text-[var(--muted)] hover:text-primary transition-colors pt-1"
                  >
                    View Full Bag
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

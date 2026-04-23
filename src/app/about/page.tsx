import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Shop Ash — The House of Horology',
  description: 'Shop Ash is a curated house of luxury watches — Rolex, Rado, Patek Philippe, Omega and more. Every timepiece authenticated, serviced, and delivered worldwide.',
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      {/* Hero */}
      <section className="pt-20 pb-20 bg-[var(--background)]">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] mb-8">The House of Ash</h1>
          <p className="text-[var(--muted)] text-lg font-light leading-relaxed">
            Born from a singular obsession with the mechanical art of time, Shop Ash is a curated house for collectors who understand that a watch is never just a watch — it is a legacy on the wrist.
          </p>
        </div>
      </section>

      {/* Image Band */}
      <section className="h-[50vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 z-10" />
        <img
          src="https://images.unsplash.com/photo-1508685096489-7aac291bd5b3?q=80&w=2070&auto=format&fit=crop"
          alt="Watchmaking"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Vision */}
      <section className="py-32 bg-[var(--background)]">
        <div className="container mx-auto px-6 max-w-4xl space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif text-[var(--foreground)] mb-6">Our Vision</h2>
              <p className="text-[var(--muted)] font-light leading-relaxed">
                To be the most trusted destination in South Asia for rare and revered timepieces. We partner directly with authorised dealers and verified collectors — every watch is authenticated, serviced, and documented before it reaches your wrist.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-serif text-[var(--foreground)] mb-6">Our Promise</h2>
              <p className="text-[var(--muted)] font-light leading-relaxed">
                Authenticity is not a feature — it is the foundation. Every Rolex, every Patek, every Rado in our collection carries our guarantee of provenance and our lifetime concierge support.
              </p>
            </div>
          </div>

          {/* The Maisons */}
          <div className="border-t border-[var(--border)] pt-20">
            <h2 className="text-3xl font-serif text-[var(--foreground)] mb-12 text-center">The Maisons We Carry</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {['Rolex', 'Rado', 'Patek Philippe', 'Omega', 'Audemars Piguet', 'Cartier', 'Tag Heuer', 'Tissot'].map((brand) => (
                <div key={brand} className="space-y-3">
                  <div className="w-16 h-16 mx-auto border border-primary/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary" />
                  </div>
                  <p className="text-[var(--foreground)]/80 text-sm font-light">{brand}</p>
                </div>
              ))}
            </div>
            <p className="text-[var(--muted)] text-center mt-12 font-light max-w-2xl mx-auto">
              From Swiss legends to contemporary innovators — a carefully curated list of the Maisons we believe have earned the right to rest on your wrist.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

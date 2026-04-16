import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Shop Ash — Our Story',
  description: 'Discover the vision behind Shop Ash, a luxury fashion brand committed to timeless elegance and premium craftsmanship.',
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-black">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4 block">Our Story</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-8">The House of Ash</h1>
          <p className="text-white/50 text-lg font-light leading-relaxed">
            Born from a passion for the extraordinary, Shop Ash is more than a brand — it is a philosophy that celebrates the intersection of heritage craftsmanship and modern sophistication.
          </p>
        </div>
      </section>

      {/* Image Band */}
      <section className="h-[50vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury store" className="w-full h-full object-cover" />
      </section>

      {/* Vision */}
      <section className="py-32 bg-black">
        <div className="container mx-auto px-6 max-w-4xl space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-serif text-white mb-6">Our Vision</h2>
              <p className="text-white/50 font-light leading-relaxed">
                To become the definitive destination for luxury fashion in South Asia and beyond. We envision a world where premium quality is accessible, where every individual can experience the confidence that comes with owning something truly exceptional.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-serif text-white mb-6">Our Promise</h2>
              <p className="text-white/50 font-light leading-relaxed">
                Every product at Shop Ash is hand-selected for its quality, design, and craftsmanship. We stand behind every piece with our guarantee of authenticity and our commitment to unparalleled customer service.
              </p>
            </div>
          </div>

          {/* Expansion */}
          <div className="border-t border-white/10 pt-20">
            <h2 className="text-3xl font-serif text-white mb-8 text-center">The Road Ahead</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {['Premium Watches', 'Designer Wear', 'Fine Fragrances', 'Leather Goods'].map((item) => (
                <div key={item} className="space-y-3">
                  <div className="w-16 h-16 mx-auto border border-primary/30 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary" />
                  </div>
                  <p className="text-white/70 text-sm font-light">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-white/40 text-center mt-12 font-light max-w-2xl mx-auto">
              Starting with premium watches, we are expanding into a full luxury fashion house — offering designer clothing, fine fragrances, handcrafted wallets, and curated accessories for the modern connoisseur.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

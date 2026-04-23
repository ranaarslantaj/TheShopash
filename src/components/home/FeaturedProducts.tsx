'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { getProducts } from '@/lib/db';
import { Product, ProductTag } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';

type TabKey = 'new' | 'bestseller' | 'editors-pick';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'new', label: 'New Arrivals' },
  { key: 'bestseller', label: 'Best Sellers' },
  { key: 'editors-pick', label: "Editor's Picks" },
];

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('new');

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const visible = useMemo(() => {
    const tagged = products.filter((p) => p.tags?.includes(activeTab as ProductTag));
    return (tagged.length > 0 ? tagged : products).slice(0, 4);
  }, [products, activeTab]);

  return (
    <section className="py-24 md:py-32 bg-[var(--soft)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="eyebrow">The Selection</span>
          <h2 className="section-title mt-4">Featured Timepieces</h2>
          <div className="divider-gold" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-10 mb-14 border-b border-[var(--border)]">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`relative text-xs md:text-sm uppercase tracking-[0.3em] px-2 pb-4 transition-colors ${
                activeTab === t.key ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              {t.label}
              {activeTab === t.key && (
                <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-primary" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[var(--muted)] font-serif">Our curated selection is currently being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-block text-xs uppercase tracking-[0.4em] text-[var(--foreground)] border-b border-[var(--foreground)] pb-1 hover:text-primary hover:border-primary transition-colors"
          >
            View All Timepieces
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

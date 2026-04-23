'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/db';
import { Product, Gender, WatchBrand, WatchStyle, ProductTag } from '@/context/CartContext';
import { Loader2, X } from 'lucide-react';

type SortOption = 'latest' | 'low-high' | 'high-low';

const BRANDS: WatchBrand[] = [
  'Rolex',
  'Rado',
  'Omega',
  'Patek Philippe',
  'Audemars Piguet',
  'Tag Heuer',
  'Cartier',
  'Tissot',
];

const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const STYLES: WatchStyle[] = ['Dress', 'Sport', 'Diver', 'Chronograph'];

function ShopContent() {
  const searchParams = useSearchParams();

  const [brand, setBrand] = useState<WatchBrand | 'All'>(
    (searchParams.get('brand') as WatchBrand) ?? 'All'
  );
  const [gender, setGender] = useState<Gender | 'All'>(
    (searchParams.get('gender') as Gender) ?? 'All'
  );
  const [style, setStyle] = useState<WatchStyle | 'All'>(
    (searchParams.get('style') as WatchStyle) ?? 'All'
  );
  const [tag, setTag] = useState<ProductTag | null>(
    (searchParams.get('tag') as ProductTag) ?? null
  );
  const [sort, setSort] = useState<SortOption>('latest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const b = searchParams.get('brand') as WatchBrand | null;
    const g = searchParams.get('gender') as Gender | null;
    const s = searchParams.get('style') as WatchStyle | null;
    const t = searchParams.get('tag') as ProductTag | null;
    if (b) setBrand(b);
    if (g) setGender(g);
    if (s) setStyle(s);
    if (t) setTag(t);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let items = products;
    if (brand !== 'All') items = items.filter((p) => p.brand === brand);
    if (gender !== 'All') items = items.filter((p) => p.gender === gender);
    if (style !== 'All') items = items.filter((p) => p.style === style);
    if (tag) items = items.filter((p) => p.tags?.includes(tag));
    if (sort === 'low-high') items = [...items].sort((a, b) => a.pricePKR - b.pricePKR);
    else if (sort === 'high-low') items = [...items].sort((a, b) => b.pricePKR - a.pricePKR);
    return items;
  }, [brand, gender, style, tag, sort, products]);

  const hasActiveFilters = brand !== 'All' || gender !== 'All' || style !== 'All' || tag !== null;

  const clearFilters = () => {
    setBrand('All');
    setGender('All');
    setStyle('All');
    setTag(null);
  };

  const chipClass = (active: boolean) =>
    `text-[10px] uppercase tracking-[0.25em] px-4 py-2 border transition-all duration-300 whitespace-nowrap ${
      active
        ? 'border-primary text-primary bg-primary/5'
        : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/40'
    }`;

  const pageTitle = (() => {
    if (tag === 'new') return 'New Arrivals';
    if (tag === 'bestseller') return 'Best Sellers';
    if (tag === 'editors-pick') return "Editor's Picks";
    if (gender !== 'All') return `${gender}'s Watches`;
    if (brand !== 'All') return brand;
    if (style !== 'All') return `${style} Watches`;
    return 'The Collection';
  })();

  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="pt-16 pb-16 bg-[var(--soft)]">
        <div className="container mx-auto px-6 text-center">
          <span className="eyebrow">Curated Horology</span>
          <h1 className="text-5xl md:text-7xl font-serif text-[var(--foreground)] mt-4">{pageTitle}</h1>
          <p className="text-[var(--muted)] mt-6 text-sm">
            {loading ? 'Loading…' : `${filtered.length} ${filtered.length === 1 ? 'timepiece' : 'timepieces'}`}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-y border-[var(--border)]">
        <div className="container mx-auto px-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] md:w-24 shrink-0">Gender</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setGender('All')} className={chipClass(gender === 'All')}>All</button>
              {GENDERS.map((g) => (
                <button key={g} onClick={() => setGender(g)} className={chipClass(gender === g)}>{g}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] md:w-24 shrink-0">Brand</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setBrand('All')} className={chipClass(brand === 'All')}>All</button>
              {BRANDS.map((b) => (
                <button key={b} onClick={() => setBrand(b)} className={chipClass(brand === b)}>{b}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] md:w-24 shrink-0">Style</span>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setStyle('All')} className={chipClass(style === 'All')}>All</button>
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)} className={chipClass(style === s)}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--muted)] hover:text-primary transition-colors"
              >
                <X className="w-3 h-3" /> Clear all filters
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-white border border-[var(--border)] text-[var(--foreground)] text-xs px-4 py-2 focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="latest">Latest</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-[var(--background)] min-h-[60vh]">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[var(--muted)] font-serif">Loading Collection…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted)] text-lg font-serif">No timepieces match your selection.</p>
              <button onClick={clearFilters} className="text-primary text-xs uppercase tracking-widest mt-4">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <main>
          <Navbar />
          <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <Footer />
        </main>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

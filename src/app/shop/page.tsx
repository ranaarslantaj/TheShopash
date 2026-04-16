'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/products';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

type SortOption = 'latest' | 'low-high' | 'high-low';

export default function ShopPage() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState<SortOption>('latest');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Watches', 'Clothes', 'Perfumes', 'Accessories'];

  const filtered = useMemo(() => {
    let items = category === 'All' ? MOCK_PRODUCTS : MOCK_PRODUCTS.filter(p => p.category === category);
    if (sort === 'low-high') items = [...items].sort((a, b) => a.pricePKR - b.pricePKR);
    else if (sort === 'high-low') items = [...items].sort((a, b) => b.pricePKR - a.pricePKR);
    return items;
  }, [category, sort]);

  return (
    <main>
      <Navbar />
      {/* Header */}
      <section className="pt-32 pb-16 bg-black">
        <div className="container mx-auto px-6 text-center">
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-4 block">Curated Luxury</span>
          <h1 className="text-5xl md:text-7xl font-serif text-white">The Collection</h1>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-black border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-4">
              {categories.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-300 ${category === cat ? 'border-primary text-primary bg-primary/10' : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}>
                  {cat}
                </button>
              ))}
            </div>
            {/* Sort */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-white/30">Sort by</span>
              <select value={sort} onChange={e => setSort(e.target.value as SortOption)}
                className="bg-white/5 border border-white/10 text-white/70 text-xs px-4 py-2 focus:outline-none focus:border-primary cursor-pointer">
                <option value="latest">Latest</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-black min-h-[60vh]">
        <div className="container mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/30 text-lg font-serif">No products found in this category yet.</p>
              <p className="text-white/20 text-sm mt-2">New arrivals coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

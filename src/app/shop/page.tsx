'use client';

import React, { useState, useMemo, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { getProducts } from '@/lib/db';
import { Product, Gender, WatchBrand, WatchStyle, ProductTag } from '@/context/CartContext';
import { Loader2, ChevronDown } from 'lucide-react';

type SortOption = 'latest' | 'low-high' | 'high-low';

const BRANDS: WatchBrand[] = [
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Rado',
  'Cartier',
  'Tag Heuer',
  'Tissot',
];

const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const STYLES: WatchStyle[] = ['Dress', 'Sport', 'Diver', 'Chronograph'];

const SORT_LABELS: Record<SortOption, string> = {
  latest: 'Latest',
  'low-high': 'Price: Low to High',
  'high-low': 'Price: High to Low',
};

// ─── FilterDropdown ─────────────────────────────────────────────
interface FilterDropdownProps<T extends string> {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
  optionLabels?: Partial<Record<T, string>>;
  align?: 'left' | 'right';
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  optionLabels,
  align = 'left',
  isOpen,
  onToggle,
  onClose,
}: FilterDropdownProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  const isActive = value !== 'All';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`group flex items-center gap-2.5 px-4 py-2.5 text-[11px] uppercase tracking-[0.25em] transition-colors ${
          isActive
            ? 'text-[var(--foreground)] bg-[var(--soft)]'
            : 'text-[var(--foreground)] hover:bg-[var(--soft)]'
        }`}
      >
        <span>{label}</span>
        {isActive && (
          <span className="text-primary normal-case tracking-normal text-[11px]">
            · {optionLabels?.[value] ?? value}
          </span>
        )}
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 min-w-[200px] bg-white border border-[var(--border)] shadow-xl z-40 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
          >
            <ul role="listbox">
              {options.map((opt) => {
                const active = value === opt;
                return (
                  <li key={opt}>
                    <button
                      onClick={() => {
                        onChange(opt);
                        onClose();
                      }}
                      className={`block w-full text-left px-5 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors border-l-2 ${
                        active
                          ? 'text-primary bg-primary/[0.04] border-primary'
                          : 'text-[var(--foreground)] hover:bg-[var(--soft)] border-transparent'
                      }`}
                    >
                      {optionLabels?.[opt] ?? opt}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ShopContent ────────────────────────────────────────────────
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
  const [openDropdown, setOpenDropdown] = useState<null | 'gender' | 'brand' | 'style' | 'sort'>(null);

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

  const pageTitle = (() => {
    if (tag === 'new') return 'New Arrivals';
    if (tag === 'bestseller') return 'Best Sellers';
    if (tag === 'editors-pick') return "Editor's Picks";
    if (gender !== 'All') return `${gender}'s Watches`;
    if (brand !== 'All') return brand;
    if (style !== 'All') return `${style} Watches`;
    return 'The Collection';
  })();

  const toggle = (which: 'gender' | 'brand' | 'style' | 'sort') => {
    setOpenDropdown((prev) => (prev === which ? null : which));
  };
  const close = () => setOpenDropdown(null);

  return (
    <main>
      <Navbar />

      {/* Compact header */}
      <section className="bg-[var(--soft)] border-b border-[var(--border)]">
        <div className="container mx-auto px-6 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow">Curated Horology</span>
              <h1
                className="font-serif text-[var(--foreground)] mt-2"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)' }}
              >
                {pageTitle}
              </h1>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
              {loading
                ? 'Loading…'
                : `${filtered.length} ${filtered.length === 1 ? 'piece' : 'pieces'}`}
            </p>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-white border-b border-[var(--border)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 py-3">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-1">
              <FilterDropdown
                label="Gender"
                value={gender}
                options={['All', ...GENDERS] as const}
                onChange={(v) => setGender(v as Gender | 'All')}
                isOpen={openDropdown === 'gender'}
                onToggle={() => toggle('gender')}
                onClose={close}
              />
              <FilterDropdown
                label="Brand"
                value={brand}
                options={['All', ...BRANDS] as const}
                onChange={(v) => setBrand(v as WatchBrand | 'All')}
                isOpen={openDropdown === 'brand'}
                onToggle={() => toggle('brand')}
                onClose={close}
              />
              <FilterDropdown
                label="Style"
                value={style}
                options={['All', ...STYLES] as const}
                onChange={(v) => setStyle(v as WatchStyle | 'All')}
                isOpen={openDropdown === 'style'}
                onToggle={() => toggle('style')}
                onClose={close}
              />
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors px-3 py-2"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Sort */}
            <FilterDropdown
              label="Sort"
              value={sort}
              options={['latest', 'low-high', 'high-low'] as const}
              onChange={(v) => setSort(v as SortOption)}
              optionLabels={SORT_LABELS}
              align="right"
              isOpen={openDropdown === 'sort'}
              onToggle={() => toggle('sort')}
              onClose={close}
            />
          </div>

        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-16 bg-[var(--background)] min-h-[60vh]">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[var(--muted)] font-serif">Loading Collection…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[var(--muted)] text-lg font-serif">No timepieces match your selection.</p>
              <button
                onClick={clearFilters}
                className="text-primary text-xs uppercase tracking-widest mt-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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

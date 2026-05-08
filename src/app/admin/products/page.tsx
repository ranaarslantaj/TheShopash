'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { getProducts, deleteProduct } from '@/lib/db';
import { Product, WatchBrand, Gender, WatchStyle } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

const BRANDS: (WatchBrand | 'All')[] = [
  'All',
  'Rolex',
  'Patek Philippe',
  'Audemars Piguet',
  'Omega',
  'Rado',
  'Cartier',
  'Tag Heuer',
  'Tissot',
];
const GENDERS: (Gender | 'All')[] = ['All', 'Men', 'Women', 'Unisex'];
const STYLES: (WatchStyle | 'All')[] = ['All', 'Dress', 'Sport', 'Diver', 'Chronograph'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState<WatchBrand | 'All'>('All');
  const [gender, setGender] = useState<Gender | 'All'>('All');
  const [style, setStyle] = useState<WatchStyle | 'All'>('All');
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const reload = () => {
    setLoading(true);
    getProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (brand !== 'All') list = list.filter((p) => p.brand === brand);
    if (gender !== 'All') list = list.filter((p) => p.gender === gender);
    if (style !== 'All') list = list.filter((p) => p.style === style);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.reference?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, brand, gender, style, search]);

  const stats = useMemo(() => {
    const inStock = products.filter((p) => p.stock > 0).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.pricePKR || 0) * (p.stock || 0), 0);
    return { total: products.length, inStock, outOfStock, totalValue };
  }, [products]);

  const handleDelete = async () => {
    if (!confirmDelete?.id) return;
    setDeleting(true);
    setError('');
    try {
      await deleteProduct(confirmDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== confirmDelete.id));
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete product.');
    } finally {
      setDeleting(false);
    }
  };

  const chip = (active: boolean) =>
    `text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 transition-colors ${
      active
        ? 'bg-[var(--foreground)] text-white'
        : 'text-[var(--muted)] hover:bg-[var(--soft)]'
    }`;

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">Catalogue</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Products</h1>
          <p className="text-sm text-[var(--muted)] mt-2">
            {loading ? 'Loading…' : `${products.length} total · ${filtered.length} shown`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors"
        >
          <Plus className="w-4 h-4" /> Add product
        </Link>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total },
          { label: 'In Stock', value: stats.inStock },
          { label: 'Out of Stock', value: stats.outOfStock },
          { label: 'Inventory Value', value: formatPrice(stats.totalValue, 'PKR') },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-[var(--border)] p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mb-2">
              {s.label}
            </p>
            <p className="text-2xl font-serif text-[var(--foreground)] truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[var(--border)] divide-y divide-[var(--border)]">
        <div className="p-4 flex items-center gap-3">
          <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, or reference"
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none"
          />
        </div>

        <div className="px-4 py-3 flex flex-wrap gap-x-6 gap-y-2 items-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mr-2">Brand</span>
            <div className="flex flex-wrap gap-1">
              {BRANDS.map((b) => (
                <button key={b} onClick={() => setBrand(b)} className={chip(brand === b)}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex flex-wrap gap-x-6 gap-y-2 items-center">
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mr-2">Gender</span>
            <div className="flex flex-wrap gap-1">
              {GENDERS.map((g) => (
                <button key={g} onClick={() => setGender(g)} className={chip(gender === g)}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mr-2">Style</span>
            <div className="flex flex-wrap gap-1">
              {STYLES.map((s) => (
                <button key={s} onClick={() => setStyle(s)} className={chip(style === s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[var(--border)] overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-[var(--muted)]/40 mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-lg text-[var(--foreground)] mb-1">No products</p>
            <p className="text-sm text-[var(--muted)] mb-6">
              {search || brand !== 'All' || gender !== 'All' || style !== 'All'
                ? 'No products match your filters.'
                : 'Add your first watch to get started.'}
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 bg-[var(--foreground)] text-white px-6 py-3 text-[11px] uppercase tracking-[0.3em] hover:bg-primary transition-colors"
            >
              <Plus className="w-4 h-4" /> Add product
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] bg-[var(--soft)]">
                <tr>
                  <th className="px-4 py-4 font-medium">Image</th>
                  <th className="px-4 py-4 font-medium">Product</th>
                  <th className="px-4 py-4 font-medium hidden md:table-cell">Brand</th>
                  <th className="px-4 py-4 font-medium hidden lg:table-cell">Gender / Style</th>
                  <th className="px-4 py-4 font-medium">Price</th>
                  <th className="px-4 py-4 font-medium">Stock</th>
                  <th className="px-4 py-4 font-medium hidden lg:table-cell">Tags</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--soft)]/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-14 h-16 bg-[var(--soft)] overflow-hidden">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            <ImageIcon className="w-4 h-4 text-[var(--muted)]/50" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="block font-serif text-sm text-[var(--foreground)] hover:text-primary leading-tight"
                      >
                        {p.title}
                      </Link>
                      {p.reference && (
                        <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1">
                          Ref. {p.reference}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-[var(--muted)]">
                      {p.brand}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-[var(--muted)]">
                      {p.gender} · {p.style}
                    </td>
                    <td className="px-4 py-3 text-sm text-primary tabular-nums whitespace-nowrap">
                      {formatPrice(p.pricePKR, 'PKR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs ${
                          p.stock === 0
                            ? 'text-red-600'
                            : p.stock <= 2
                            ? 'text-amber-600'
                            : 'text-[var(--foreground)]'
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(p.tags ?? []).map((t) => (
                          <span
                            key={t}
                            className="text-[9px] uppercase tracking-[0.25em] text-[var(--muted)] border border-[var(--border)] px-2 py-0.5"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <Link
                          href={`/admin/products/${p.id}`}
                          aria-label="Edit"
                          className="p-2 text-[var(--muted)] hover:text-primary transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(p)}
                          aria-label="Delete"
                          className="p-2 text-[var(--muted)] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          onClick={() => !deleting && setConfirmDelete(null)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full p-6 shadow-xl border border-[var(--border)]"
          >
            <h3 className="font-serif text-xl text-[var(--foreground)] mb-2">Delete product?</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              This will permanently delete <strong className="text-[var(--foreground)]">{confirmDelete.title}</strong> from your catalogue.
              Customer order history is unaffected. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] px-4 py-2 hover:text-[var(--foreground)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3 h-3" /> Delete permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

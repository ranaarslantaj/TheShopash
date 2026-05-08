'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Loader2,
  AlertCircle,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { Product } from '@/context/CartContext';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id).then((res) => {
      setProduct(res);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (values: Parameters<React.ComponentProps<typeof ProductForm>['onSubmit']>[0]) => {
    await updateProduct(id, values);
    setProduct((prev) => (prev ? { ...prev, ...values, id: prev.id } : prev));
    setSavedAt(Date.now());
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteProduct(id);
      router.push('/admin/products');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete product.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-10 h-10 text-[var(--muted)]/40 mx-auto" />
        <p className="font-serif text-lg text-[var(--foreground)]">Product not found.</p>
        <Link
          href="/admin/products"
          className="inline-block text-[10px] uppercase tracking-[0.4em] text-primary border-b border-primary pb-1"
        >
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-3 h-3" /> All products
        </Link>
        <div className="flex items-center gap-3">
          {savedAt && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-green-600">Saved</span>
          )}
          <a
            href={`/product/${id}`}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
          >
            View public page <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">Edit Piece</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] truncate">
          {product.title}
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] mt-2 font-mono">
          {product.id}
        </p>
      </header>

      <ProductForm
        productId={id}
        initialValues={product}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />

      {/* Danger zone */}
      <section className="border border-red-200 bg-red-50/40 p-6 mt-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-serif text-base text-red-700">Delete product</h3>
            <p className="text-xs text-red-600/80 mt-1 max-w-md">
              Permanently remove this product from the catalogue. Customer order history is unaffected.
            </p>
          </div>
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-2 border border-red-300 text-red-700 px-5 py-2.5 text-[10px] uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors whitespace-nowrap"
          >
            <Trash2 className="w-3 h-3" /> Delete product
          </button>
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {error}
          </p>
        )}
      </section>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          onClick={() => !deleting && setConfirmDelete(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-md w-full p-6 shadow-xl border border-[var(--border)]"
          >
            <h3 className="font-serif text-xl text-[var(--foreground)] mb-2">Delete product?</h3>
            <p className="text-sm text-[var(--muted)] mb-6">
              This will permanently delete <strong className="text-[var(--foreground)]">{product.title}</strong>{' '}
              from your catalogue. This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
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

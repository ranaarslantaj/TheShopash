'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { createProductWithId } from '@/lib/db';

// Generate a stable client-side ID so image uploads can use the same path
const genId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return (crypto as any).randomUUID().replace(/-/g, '').slice(0, 20);
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
};

export default function NewProductPage() {
  const router = useRouter();

  // Generate one ID per page mount; reused across image uploads + final save
  const productId = useMemo(genId, []);

  const handleSubmit = async (values: Parameters<React.ComponentProps<typeof ProductForm>['onSubmit']>[0]) => {
    await createProductWithId(productId, values);
    router.push(`/admin/products/${productId}`);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-3 h-3" /> All products
        </Link>
      </div>

      <header>
        <span className="text-xs uppercase tracking-[0.5em] text-primary mb-2 block">New Piece</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Add Product</h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          Fill in the details, upload images, then save.
        </p>
      </header>

      <ProductForm
        productId={productId}
        onSubmit={handleSubmit}
        submitLabel="Create product"
      />
    </div>
  );
}

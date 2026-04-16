import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { MOCK_PRODUCTS } from '@/lib/products';

const FeaturedProducts = () => {
  const featured = MOCK_PRODUCTS.slice(0, 4);

  return (
    <section className="py-32 bg-black">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-[0.4em] text-primary mb-4 block font-medium">Curated Selection</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white">Featured Timepieces</h2>
          </div>
          <Link href="/shop" className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-primary transition-colors border-b border-white/20 pb-2">
            View All Products
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

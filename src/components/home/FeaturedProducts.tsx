'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { getProducts } from '@/lib/db';
import { Product } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProducts();
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : products.length === 0 ? (
            <div className="text-center py-20">
                <p className="text-white/20 font-serif">Our featured collection is currently being updated.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

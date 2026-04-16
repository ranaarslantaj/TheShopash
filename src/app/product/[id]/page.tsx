'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { useCart } from '@/context/CartContext';
import { MOCK_PRODUCTS } from '@/lib/products';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Zap, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);

  const product = MOCK_PRODUCTS.find(p => p.id === params.id);
  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black">
          <p className="text-white/50 font-serif text-2xl">Product not found.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const related = MOCK_PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);
  const whatsappMsg = encodeURIComponent(`Hi, I'm interested in buying "${product.title}" from Shop Ash. Price: ${formatPrice(product.pricePKR, 'PKR')}`);
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMsg}`;

  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-20 bg-black min-h-screen">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-12 flex items-center gap-2 text-xs uppercase tracking-widest text-white/30">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white/60">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-white/5 group">
                <motion.img key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                  src={product.images[imgIdx]} alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in" />
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx(i => i === 0 ? product.images.length - 1 : i - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-primary hover:text-black transition-colors">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white hover:bg-primary hover:text-black transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-primary' : 'border-white/10'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <span className="text-xs uppercase tracking-[0.4em] text-primary mb-3 block">{product.category}</span>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{product.title}</h1>
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl text-primary font-light">{formatPrice(product.pricePKR, 'PKR')}</p>
                  <p className="text-white/30 text-sm">≈ {formatPrice(product.priceUSD, 'USD')}</p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <p className="text-white/60 leading-relaxed font-light text-lg">{product.description}</p>
              <p className="text-xs uppercase tracking-widest text-white/30">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <button onClick={() => addToCart(product)} className="luxury-button w-full flex items-center justify-center gap-3">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </button>
                <Link href="/checkout" onClick={() => addToCart(product)} className="luxury-outline-button w-full flex items-center justify-center gap-3">
                  <Zap className="w-4 h-4" /> Buy Now
                </Link>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors">
                  <MessageCircle className="w-4 h-4" /> Buy via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-32">
              <h2 className="text-3xl font-serif text-white mb-12">You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

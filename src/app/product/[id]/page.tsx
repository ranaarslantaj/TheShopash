'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import { useCart, Product } from '@/context/CartContext';
import { getProductById, getProducts } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Zap, MessageCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [related, setRelated] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [imgIdx, setImgIdx] = React.useState(0);

  React.useEffect(() => {
    const fetchProductAndRelated = async () => {
      if (!params.id) return;
      setLoading(true);
      const data = await getProductById(params.id as string);
      if (data) {
        setProduct(data);
        const allProducts = await getProducts();
        // Prefer related from same brand, fall back to others
        const sameBrand = allProducts.filter((p) => p.id !== data.id && p.brand === data.brand);
        const others = allProducts.filter((p) => p.id !== data.id && p.brand !== data.brand);
        setRelated([...sameBrand, ...others].slice(0, 3));
      }
      setLoading(false);
    };
    fetchProductAndRelated();
  }, [params.id]);

  if (loading) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-[var(--muted)] font-serif">Unveiling Masterpiece…</p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <p className="text-[var(--muted)] font-serif text-2xl">Product not found.</p>
        </div>
        <Footer />
      </main>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in buying "${product.title}" (${product.brand}) from Shop Ash. Price: ${formatPrice(product.pricePKR, 'PKR')}`
  );
  const whatsappUrl = `https://wa.me/923001234567?text=${whatsappMsg}`;

  return (
    <main>
      <Navbar />
      <section className="pt-12 pb-20 bg-[var(--background)] min-h-screen">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-12 flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--muted)]">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary transition-colors">Watches</Link>
            <span>/</span>
            <Link href={`/shop?brand=${encodeURIComponent(product.brand)}`} className="hover:text-primary transition-colors">{product.brand}</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]/80">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden bg-white border border-[var(--border)] group">
                <motion.img
                  key={imgIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[imgIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 cursor-zoom-in"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 text-[var(--foreground)] hover:bg-primary hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 text-[var(--foreground)] hover:bg-primary hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      i === imgIdx ? 'border-primary' : 'border-[var(--border)]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <Link
                    href={`/shop?brand=${encodeURIComponent(product.brand)}`}
                    className="text-[10px] uppercase tracking-[0.3em] text-primary border border-primary/30 px-3 py-1 hover:bg-primary/10 transition-colors"
                  >
                    {product.brand}
                  </Link>
                  <Link
                    href={`/shop?gender=${product.gender}`}
                    className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)]/70 border border-[var(--border)] px-3 py-1 hover:border-[var(--foreground)]/50 transition-colors"
                  >
                    {product.gender}
                  </Link>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">{product.title}</h1>
                <div className="flex items-baseline gap-4">
                  <p className="text-3xl text-primary font-light">{formatPrice(product.pricePKR, 'PKR')}</p>
                  <p className="text-[var(--muted)] text-sm">≈ {formatPrice(product.priceUSD, 'USD')}</p>
                </div>
              </div>
              <div className="h-px bg-[var(--border)]" />
              <p className="text-[var(--foreground)]/75 leading-relaxed font-light text-lg">{product.description}</p>
              <p className="text-xs uppercase tracking-widest text-[var(--muted)]">
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
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Buy via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-32">
              <h2 className="text-3xl font-serif text-[var(--foreground)] mb-12">You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

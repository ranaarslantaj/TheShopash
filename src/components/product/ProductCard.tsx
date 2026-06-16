'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatPrice } from '@/lib/utils';

const BRAND_COLORS: Record<string, string> = {
  Rolex: '#0b6b3b',
  Tomi: '#b45309',
  Tissot: '#b91c1c',
  Cartier: '#9d174d',
  Casio: '#1d4ed8',
  Seiko: '#0f766e',
  Other: '#374151',
};

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const tagLabel: Record<string, { text: string; className: string }> = {
  new: { text: 'New', className: 'bg-[var(--foreground)] text-white' },
  bestseller: { text: 'Bestseller', className: 'bg-primary text-white' },
  'editors-pick': { text: "Editor's Pick", className: 'bg-white text-[var(--foreground)] border border-[var(--foreground)]' },
  rare: { text: 'Rare', className: 'bg-white text-primary border border-primary' },
};

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const router = useRouter();
  const [previewIdx, setPreviewIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const hasSecondImage = product.images.length > 1;
  const displayImage = product.images[previewIdx] ?? product.images[0];
  const topTag = product.tags?.[0];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--soft)]">
        <Link href={`/product/${product.id}`}>
          <img
            src={displayImage}
            alt={product.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Top-left tag */}
        {topTag && tagLabel[topTag] && (
          <div className={`absolute top-4 left-4 ${tagLabel[topTag].className}`}>
            <span className="block px-3 py-1 text-[9px] uppercase tracking-[0.3em]">{tagLabel[topTag].text}</span>
          </div>
        )}

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--foreground)] text-white px-4 py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-primary transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              router.push('/checkout');
            }}
            className="flex items-center justify-center bg-white text-[var(--foreground)] px-4 py-3 hover:bg-primary hover:text-white transition-colors"
            aria-label="Buy now"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center bg-white text-[var(--foreground)] px-4 py-3 hover:bg-primary hover:text-white transition-colors"
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Wishlist (top-right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted(product.id) ? 'text-primary' : 'text-[var(--muted)]'}`} />
        </button>
      </div>

      {/* Thumbnail strip for listing (up to 3 previews + +N) */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {(() => {
          const previewCount = 3;
          const previews = product.images.slice(0, previewCount);
          const extra = Math.max(0, product.images.length - previewCount);
          return (
            <>
              {previews.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    setPreviewIdx(i);
                  }}
                  className={`w-12 h-12 overflow-hidden border-2 transition-colors ${
                    i === previewIdx ? 'border-primary' : 'border-[var(--border)]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {extra > 0 && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPreviewIdx(previewCount);
                  }}
                  className="w-12 h-12 flex items-center justify-center border-2 border-[var(--border)] bg-[var(--soft)] text-[var(--muted)] font-medium"
                >
                  +{extra}
                </button>
              )}
            </>
          );
        })()}
      </div>

      {/* Info */}
      <div className={`pt-5 ${compact ? 'pb-2' : 'pb-6'} text-center`}>
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
          ))}
        </div>

        <h3 className="font-sans text-sm md:text-base lg:text-base font-bold text-[var(--foreground)] mb-4 leading-tight">
          <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">{product.title}</Link>
        </h3>

        <div className="mb-4">
          {product.salePricePKR && product.salePricePKR < product.pricePKR ? (
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl md:text-2xl font-bold text-primary">{formatPrice(product.salePricePKR, 'PKR')}</p>
              <p className="text-sm text-[#d1a4a4] line-through font-medium">{formatPrice(product.pricePKR, 'PKR')}</p>
            </div>
          ) : (
            <p className="text-2xl md:text-2xl font-bold text-primary text-center">{formatPrice(product.pricePKR, 'PKR')}</p>
          )}
        </div>

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
              router.push('/checkout');
            }}
            className="inline-flex items-center justify-center border border-[var(--foreground)] text-[var(--foreground)] px-6 py-2 text-sm uppercase tracking-[0.35em] hover:bg-[var(--foreground)] hover:text-white transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

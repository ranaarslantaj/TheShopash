'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

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
  const [isHovered, setIsHovered] = useState(false);

  const hasSecondImage = product.images.length > 1;
  const displayImage = isHovered && hasSecondImage ? product.images[1] : product.images[0];
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
          <Link
            href={`/product/${product.id}`}
            className="flex items-center justify-center bg-white text-[var(--foreground)] px-4 py-3 hover:bg-primary hover:text-white transition-colors"
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className={`pt-5 ${compact ? 'pb-2' : 'pb-6'} text-center`}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2">{product.brand}</p>
        <h3 className="font-serif text-base md:text-lg text-[var(--foreground)] mb-1 leading-tight group-hover:text-primary transition-colors">
          <Link href={`/product/${product.id}`}>{product.title}</Link>
        </h3>
        {product.reference && (
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">Ref. {product.reference}</p>
        )}
        <p className="text-sm text-[var(--foreground)] font-medium">{formatPrice(product.pricePKR, 'PKR')}</p>
        <p className="text-[10px] text-[var(--muted)] mt-0.5 uppercase tracking-wider">
          ≈ {formatPrice(product.priceUSD, 'USD')}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductCard;

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group relative bg-white/5 border border-white/10 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <button 
            onClick={() => addToCart(product)}
            className="p-3 bg-primary text-black hover:bg-white transition-colors duration-300"
            title="Add to Cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <Link 
            href={`/product/${product.id}`}
            className="p-3 bg-white text-black hover:bg-primary transition-colors duration-300"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

        {/* Category Tag */}
        <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 text-[10px] uppercase tracking-widest text-primary border border-primary/30">
          {product.category}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 text-center">
        <h3 className="text-white text-lg font-serif mb-2 group-hover:text-primary transition-colors">
          <Link href={`/product/${product.id}`}>
            {product.title}
          </Link>
        </h3>
        <div className="flex flex-col space-y-1">
          <p className="text-primary font-medium">{formatPrice(product.pricePKR, 'PKR')}</p>
          <p className="text-white/30 text-xs text-center uppercase tracking-tighter italic">Approx. {formatPrice(product.priceUSD, 'USD')}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
